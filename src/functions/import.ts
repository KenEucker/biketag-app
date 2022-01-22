import dotenv from "dotenv";
import { BikeTagClient, createTagObject } from "biketag";
import { join } from "path";
import Papa from "papaparse";
import { readFileSync } from "fs";
import { extname } from "path";
import { Game, Tag } from "biketag/lib/common/schema";
import { Payload } from "biketag/lib/common/types";

const importPlayerPrefix = process.env.IMPORT_PLAYER_PREFIX || "";
const overWriteExistingTags = process.env.OVERWRITE === "true";
const imgurImagePrefix =
  process.env.IMGUR_IMAGE_URL_PREFIX || "https://i.imgur.com";
const importFilePath = join(
  process.cwd(),
  "files",
  process.env.IMPORT_FILE ?? ""
);

const opts: any = {
  game: process.env.BIKETAG_GAME ?? "test",
  imgur: {
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    accessToken: process.env.IMGUR_ACCESS_TOKEN,
    // rapidApiKey: process.env.RAPID_API_KEY ?? undefined,
    // hash: process.env.IMGUR_HASH,
  },
  sanity: {
    useCdn: false,
    token: process.env.SANITY_ACCESS_TOKEN,
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
  },
  reddit: {
    subreddit: process.env.REDDIT_SUBREDDIT
      ? process.env.REDDIT_SUBREDDIT
      : "cyclepdx",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  },
  googleApiKey: process.env.GOOGLE_API_KEY,
};

const biketag = new BikeTagClient(opts);

const getValueFromCsvColumn = (
  header: number,
  list: string[]
): string | undefined => (header !== -1 ? list[header] : undefined);
const getTagFromCsvRow = (list: any, headers: string[]): Tag => {
  const tagnumberHeader = headers.indexOf("tagnumber");
  const nameHeader = headers.indexOf("name");
  const slugHeader = headers.indexOf("slug");
  const mysteryHeader = headers.indexOf("mystery");
  const foundHeader = headers.indexOf("found");
  const mysteryPlayerHeader = headers.indexOf("mysteryPlayer");
  const foundPlayerHeader = headers.indexOf("foundPlayer");
  const locationHeader = headers.indexOf("location");
  const discussionHeader = headers.indexOf("discussion");
  const latHeader = headers.indexOf("lat");
  const longHeader = headers.indexOf("long");

  return createTagObject({
    tagnumber: Number.parseInt(
      getValueFromCsvColumn(tagnumberHeader, list) ?? "0"
    ),
    name: getValueFromCsvColumn(nameHeader, list),
    game: opts.game,
    slug: getValueFromCsvColumn(slugHeader, list),
    mysteryImageUrl: getValueFromCsvColumn(mysteryHeader, list),
    foundImageUrl: getValueFromCsvColumn(foundHeader, list),
    mysteryPlayer: getValueFromCsvColumn(mysteryPlayerHeader, list),
    foundPlayer: getValueFromCsvColumn(foundPlayerHeader, list),
    foundLocation: getValueFromCsvColumn(locationHeader, list),
    discussionUrl: getValueFromCsvColumn(discussionHeader, list),
    gps: {
      lat: parseFloat(getValueFromCsvColumn(latHeader, list) ?? "0"),
      long: parseFloat(getValueFromCsvColumn(longHeader, list) ?? "0"),
      alt: 0,
    },
  });
};

const getImgurImageUrl = (path: string): string =>
  path.indexOf(imgurImagePrefix) === -1 ? `${imgurImagePrefix}/${path}` : path;
const getImgurImageHash = (path: string): string =>
  path.replace(extname(path), "");
const getImgurUploadPaylod = (image: string, album: string, existing: any) => {
  return {
    image: getImgurImageUrl(image),
    album,
    type: "url",
    title: existing.title ?? "",
    description: existing.description ?? "",
  };
};

const importBikeTagsHandler = async (client: BikeTagClient, opts: any) => {
  /// Get game data from the API
  const game = (await client.game(opts.game, { source: "sanity" })) as Game;
  let config = opts;

  if (!game) {
    return console.log("no game, no dice");
  }

  /// Set and get the new configuration using the mainhash from the game
  if (!opts.imgur?.hash) {
    config = client.config(
      {
        imgur: {
          hash: game.mainhash,
        },
      },
      false,
      true
    );
  }
  const imgur = biketag.images(config.imgur);
  const currentTagsResponse = await client.getTags();
  const currentTags = currentTagsResponse.data

  const getCurrentBikeTagByNumber = (tagnumber: number) => {
    const tags = currentTags.filter((t) => t.tagnumber === tagnumber);
    if (tags.length) {
      return tags[0];
    }

    return null;
  };

  const importFileExtension = extname(importFilePath);
  const importFileIsCsv = importFileExtension === ".csv";
  let tags = [],
    headers: string[] = [],
    isJsonImages = false;

  if (importFileIsCsv) {
    const importString = readFileSync(importFilePath, "utf8");
    const parsed = Papa.parse(importString, {});

    if (!parsed?.data) {
      return false;
    }

    tags = parsed.data.slice(1);
    headers = parsed.data[0] as string[];
  } else {
    const importString = readFileSync(importFilePath, "utf8");
    const json = JSON.parse(importString);

    if (!json) {
      return false;
    }

    const jsonKeys = Object.keys(json);
    const firstJson = json[jsonKeys[0]];
    isJsonImages =
      firstJson.mystery &&
      (firstJson.found || firstJson.found === null) &&
      Object.keys(firstJson).length === 2;
    if (isJsonImages) {
      jsonKeys.forEach((key) => {
        tags.push({
          tagnumber: parseInt(key),
          found: json[key].found,
          mystery: json[key].mystery,
        });
      });
    } else {
      tags = json;
    }
  }

  /// get tag number 1
  let updatePromises: Promise<any>[] = [];

  for (let i = 0, promiseCount = 1; i < tags.length; ++i, promiseCount++) {
    const tag: any = importFileIsCsv
      ? getTagFromCsvRow(tags[i], headers)
      : tags[i];
    const existingTag = getCurrentBikeTagByNumber(tag.tagnumber);

    if (isJsonImages) {
      /// Imgur throttle
      if (
        tag.found &&
        (overWriteExistingTags || !existingTag?.foundImageUrl?.length)
      ) {
        // await sleep(500);
        const { data: existingFoundImage } = await imgur.getImage(
          getImgurImageHash(tag.found)
        );
        const foundImagePayload = getImgurUploadPaylod(
          tag.found,
          game.mainhash!,
          existingFoundImage
        ) as Payload;
        console.log({ uploadingFoundImage: tag.tagnumber });
        updatePromises.push(
          imgur.upload(foundImagePayload).catch((e) => {
            console.log({ foundTagFailed: tag, foundImagePayload, e });
          })
        );
      }
      if (
        tag.mystery &&
        (overWriteExistingTags || !existingTag?.mysteryImageUrl?.length)
      ) {
        // await sleep(500);
        const { data: existingMysteryImage } = await imgur.getImage(
          getImgurImageHash(tag.mystery)
        );
        const mysteryImagePayload = getImgurUploadPaylod(
          tag.mystery,
          game.mainhash!,
          existingMysteryImage
        ) as Payload;
        console.log({ uploadingMysterImage: tag.tagnumber });
        updatePromises.push(
          imgur.upload(mysteryImagePayload).catch((e) => {
            console.log({ mysteryTagFailed: tag, mysteryImagePayload, e });
          })
        );
      }
    } else {
      const updateTag = createTagObject(tag);
      updateTag.slug = updateTag.name =
        updateTag.slug?.indexOf(opts.game) === -1 &&
        updateTag.slug?.indexOf("-") === 0
          ? `${opts.game}${updateTag.slug}`
          : updateTag.slug;
      updateTag.game = updateTag.game ?? opts.game;
      updateTag.mysteryPlayer = `${
        updateTag.mysteryPlayer?.length ? importPlayerPrefix : ""
      }${updateTag.mysteryPlayer}`;
      updateTag.foundPlayer = `${
        updateTag.foundPlayer?.length ? importPlayerPrefix : ""
      }${updateTag.foundPlayer}`;

      console.log({ updating: updateTag });

      updatePromises.push(
        client
          .updateTag(updateTag, {
            source: process.env.BIKETAG_DESTINATION ?? "sanity",
          })
          .catch((e) => {
            console.log({ tagFailed: updateTag.tagnumber, e });
          })
      );
    }

    if (promiseCount >= 15) {
      promiseCount = 0;
      const allSetted = await Promise.allSettled(updatePromises);
      allSetted.forEach((p: PromiseSettledResult<any>) => {
        console.log(p.status === "fulfilled" ? p.value : p.reason);
      });
      updatePromises = [];
    }
  }

  await Promise.allSettled(updatePromises).then((updates: any) => {
    for (const update of updates) {
      console.log(update.status, update.status !== 'fullfilled' ? update.reason : update.value)
    }
  });
};

export default importBikeTagsHandler
