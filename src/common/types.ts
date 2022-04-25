export enum CHANGED_VALUES {
  'MYSTERY',
  'FOUND',
  'GPS'
}

export interface ProfileMeta {
  name: string
  passcode: string
  social: {
    reddit: string
    instagram: string
    twitter: string
    imgur: string
    discord: string
  }
  options: {
    skipSteps: boolean
  }
}

export interface AmbassadorMeta extends ProfileMeta {
  credentials: {
    imgur: {
      clientId: string
      clientSecret: string
      refreshToken: string
    }
    sanity: {
      projectId: string
      dataset: string
    }
    reddit: {
      clientId: string
      clientSecret: string
      username: string
      password: string
    }
  }
}
export interface Profile {
  name: string
  sub: string
  slug: string
  token?: string
  email?: string
  locale?: string
  nonce?: string
  picture?: string
  user_metadata?: ProfileMeta
  zipcode?: string
}
export interface AmbassadorProfile extends Profile {
  address1: string
  address2: string
  city: string
  country: string
  isBikeTagAmbassador: boolean
  phone: string
  user_metadata?: AmbassadorMeta
  zipcode: string
}

export type BikeTagProfile = Partial<Profile> & Partial<AmbassadorProfile>
