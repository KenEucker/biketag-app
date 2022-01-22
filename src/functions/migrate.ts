import dotenv from "dotenv";
import { BikeTagClient } from "biketag";
import { createWriteStream, existsSync, createReadStream } from "fs";
import { join, extname } from "path";
import axios from "axios";
import { uploadTagImagePayload } from "biketag/lib/common/payloads";
import { Client as GoogleMapsClient } from "@googlemaps/google-maps-services-js";
import { PlaceInputType } from "@googlemaps/google-maps-services-js/dist/common";
import { Game, Tag } from "biketag/lib/common/schema";

const googleMapsClient = new GoogleMapsClient({});
const startingNumber = parseInt(process.env.START ?? '0')
const overWriteExistingTags = process.env.OVERWRITE

function downloadImage(url: string, path: string): Promise<string> {
  if (existsSync(path)) {
    return Promise.resolve(path);
  }
  return new Promise(async (resolve, reject) => {
    const writer = createWriteStream(path);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);
    writer.on("finish", () => {
      resolve(path);
    });
    writer.on("error", reject);
  });
}

const getBikeTagImageFileName = (
  game: string,
  type: "found" | "mystery",
  number: number,
  ext: string
) => {
  return `BikeTag-${game}-${number}-${type}${ext.replace("?1", "")}`;
};

const getBikeTagGPSLocation = async (tag: Tag, opts: any) => {
  let gps = undefined;
  await googleMapsClient
    .findPlaceFromText({
      params: {
        key: opts.googleApiKey,
        input: tag.foundLocation,
        inputtype: PlaceInputType.textQuery,
        fields: ["formatted_address", "name", "geometry"],
        locationbias: opts.boundary
          ? `circle:60660@${opts.boundary.lat},${opts.boundary.long}`
          : "",
      },
      timeout: 1000, // milliseconds
    })
    .then((r) => {
      const candidates = r.data.candidates;
      const chosenGeometry = candidates.length
        ? candidates[0]?.geometry?.location
        : null;
      gps = chosenGeometry;
    })
    .catch((e) => {
      console.log(
        e.response.data.error_message || `error ${e.response.status}`
      );
    });
  return gps;
};

function downloadBikeTagImages(tag: Tag): Promise<string>[] {
  const biketagImageFolder = join(__dirname, "images");
  const uploadPromises = [];

  if (!tag.foundImage && tag.foundImageUrl) {
    const ext = extname(tag.foundImageUrl);
    const originalImageUrl =
      tag.foundImageUrl.indexOf("imgur.com") !== -1
        ? tag.foundImageUrl.replace(ext, `l${ext}`)
        : tag.foundImageUrl;
    uploadPromises.push(
      downloadImage(
        originalImageUrl,
        join(
          biketagImageFolder,
          getBikeTagImageFileName(tag.game, "found", tag.tagnumber, ext)
        )
      )
    );
  } else {
    console.log({ noFound: tag });
  }
  if (!tag.mysteryImage && tag.mysteryImageUrl) {
    const ext = extname(tag.mysteryImageUrl);
    const originalImageUrl =
      tag.mysteryImageUrl.indexOf("imgur.com") !== -1
        ? tag.mysteryImageUrl.replace(ext, `l${ext}`)
        : tag.mysteryImageUrl;
    uploadPromises.push(
      downloadImage(
        originalImageUrl,
        join(
          biketagImageFolder,
          getBikeTagImageFileName(tag.game, "mystery", tag.tagnumber, ext)
        )
      )
    );
  } else {
    console.log({ noMystery: tag });
  }

  return uploadPromises;
}

const migrateBikeTagHandler = async (client: BikeTagClient, opts: any) => {
  /// Get game data from the API
  const game = await client.game(opts.game, { source: 'sanity' }) as Game;

  if (!game) {
    return console.log("no game, no dice");
  }

  /// Set and get the new configuration using the mainhash from the game
  const config = client.config(
    {
      imgur: {
        hash: game.mainhash,
      },
      reddit: {
        subreddit: game.subreddit,
      }
    },
    false,
    true
  );

  const currentTags = await client.tags() as Tag[]

  const getCurrentBikeTagByNumber = (tagnumber: number) => {
    const tags = currentTags.filter(t => t.tagnumber === tagnumber)
    if (tags.length) {
      return tags[0]
    }

    return null
  }

  const tagsResponse = await client.getTags({ subreddit: game.subreddit }, {
    source: process.env.BIKETAG_SOURCE ?? "imgur",
  });
  const tags: Tag[] = tagsResponse.data
  let updatePromises: Promise<any>[] = [];

  console.log({ game, config, tags }); // { source: 'imgur'}
  for (let i = startingNumber, promiseCount = 1; i < tags.length; ++i, promiseCount++) {
    const tag: any = tags[i];
    const existingTag = getCurrentBikeTagByNumber(tag.tagnumber)

    let updateTag = true;

    console.log({ retrieving: tag.tagnumber });
    tag.slug = tag.name =
      tag.slug?.indexOf(opts.game) === -1 && tag.slug?.indexOf("-") === 0
        ? `${opts.game}${tag.slug}`
        : tag.slug;
    tag.game = tag.game ?? opts.game;
    let imagePaths = [
      join(
        __dirname,
        tag.game,
        `BikeTag-${tag.game}-${tag.tagnumber}-found.jpg`
      ),
      join(
        __dirname,
        tag.game,
        `BikeTag-${tag.game}-${tag.tagnumber}-mystery.jpg`
      ),
    ];

    if (process.env.DOWNLOAD_IMAGES === "true") {
      const downloadPromises = downloadBikeTagImages(tag);
      imagePaths = [];

      await Promise.all(downloadPromises).then(async (responses: string[]) => {
        imagePaths = responses;
      });
    }

    for (let imagePath of imagePaths) {
      if (imagePath.length && existsSync(imagePath) && (overWriteExistingTags || !existingTag)) {
        const imageType =
          imagePath.indexOf("found") !== -1
            ? "found"
            : imagePath.indexOf("mystery") !== -1
            ? "mystery"
            : "";
        const image = await client.uploadTagImage(
          {
            tagnumber: tag.tagnumber,
            type: imageType,
            stream: createReadStream(imagePath),
          } as unknown as uploadTagImagePayload,
          { source: process.env.BIKETAG_DESTINATION ?? "sanity", }
        );

        if (image.success && image.data?.length) {
          const imageRef = image.data[0]._id;

          if (imageType === "found") {
            tag.foundImage = imageRef;
          } else {
            tag.mysteryImage = imageRef;
          }
        }
      } else if (overWriteExistingTags) {
        updateTag = false;
      }
    }

    if (process.env.GET_GPS === "true") {
      const gps = await getBikeTagGPSLocation(tag, { ...opts, ...game });
      if (gps) {
        tag.gps = gps;
      }
    }

    if (updateTag) {
      console.log({ updating: tag });

      updatePromises.push(
        client.updateTag(tag, {
          source: process.env.BIKETAG_DESTINATION ?? "sanity",
        })
      );

      if (promiseCount >= 15) {
        promiseCount = 0;
        await Promise.all(updatePromises);
      }
    }
  }

  await Promise.all(updatePromises).then((updates: any) => {
    for (const updateList of updates) {
      for (const update of updateList) {
        console.log(update.success ? "Success!" : "FAIL", update.data);
      }
    }
  });
};

export default migrateBikeTagHandler
