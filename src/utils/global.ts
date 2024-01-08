import BikeTagClient from 'biketag';
import { Game } from 'biketag/lib/common/schema';
import {
  Credentials,
  ImgurCredentials,
  SanityCredentials,
} from 'biketag/lib/common/types';

// Get logo url
export const getLogoUrl = (
  logo: string,
  size = '',
  sanityBaseCDNUrl = 'https://cdn.sanity.io/images/x37ikhvs/production/'
) => {
  switch (size) {
    case 'l':
      size = 'h=512';
      break;
    case 'm':
      size = 'h=256';
      break;
    case 's':
      size = 'h=192';
      break;
    default:
      size = 'h=45';
      break;
  }
  return logo?.length
    ? `${sanityBaseCDNUrl}${logo
        .replace('image-', '')
        .replace('-png', '.png')
        .replace('-webp', '.webp')
        .replace('-jpg', '.jpg')}${size.length ? `?${size}` : ''}`
    : 'https://biketag.io/assets/biketag-logo.svg';
};

// Get biketag config

// describe customize interface type
type BikeTagConfiguration = {
  sanity: SanityCredentials;
  imgur: ImgurCredentials;
};

interface BikeTagConfig extends Credentials, BikeTagConfiguration {
  // empty
}

export const getBikeTagConfig = (admin?: boolean, game?: Game) => {
  const opts: BikeTagConfig = {
    game: undefined,
    accessToken: process.env.ACCESS_TOKEN,
    imgur: {},
    sanity: {} as SanityCredentials,
  };
  opts.imgur.clientId = process.env.IA_CID?.length
    ? process.env.IA_CID
    : process.env.I_CID;
  opts.imgur.clientSecret = process.env.IA_CSECRET?.length
    ? process.env.IA_CSECRET
    : process.env.I_CSECRET;
  opts.imgur.accessToken = process.env.IA_TOKEN ?? '';
  opts.imgur.refreshToken = process.env.IA_RTOKEN ?? opts.imgur.refreshToken;

  if (admin) {
    opts.sanity.projectId = process.env.SA_PID as string;
    opts.sanity.dataset = process.env.SA_DSET as string;
    opts.sanity.token = process.env.SA_TOKEN as string;
  } else {
    opts.sanity.projectId = process.env.S_PID as string;
    opts.sanity.dataset = process.env.S_DSET as string;
    opts.sanity.token = process.env.S_TOKEN as string;
  }

  if (game) {
    opts.game = game.slug;
  }

  return opts;
};
// biketag client
export const biketagClient = new BikeTagClient(getBikeTagConfig(false));

// Get biketag guest config
export const getBikeTagClientConfig = (game?: Game) => {
  const opts: BikeTagConfig = {
    game: undefined,
    accessToken: process.env.ACCESS_TOKEN,
    imgur: {},
    sanity: {} as SanityCredentials,
  };
  opts.imgur.clientId = process.env.I_CID ?? '';
  opts.imgur.clientSecret = process.env.I_CSECRET ?? '';
  opts.imgur.refreshToken = process.env.I_RTOKEN ?? '';

  opts.sanity.projectId = process.env.S_PID as string;
  opts.sanity.dataset = process.env.S_DSET as string;

  if (game) {
    opts.game = game.slug;
  }

  return opts;
};
// biketag guest client
export const biketagGuestClient = new BikeTagClient(getBikeTagClientConfig());

// Get thumnail for game tag detail
export const getThumbnail = (imgUrl: string) => {
  const imgType = imgUrl.lastIndexOf('.');
  return `${imgUrl.slice(0, imgType)}s${imgUrl.slice(imgType)}`;
};

// Get time for game tag detail
export const getLocalDateTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString();
