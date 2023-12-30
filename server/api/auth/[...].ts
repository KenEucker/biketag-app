import { NuxtAuthHandler } from '#auth';
import Auth0Provider from "next-auth/providers/auth0";

const {
  nextAuthSecret, 
  auth0ClientId,
  auth0ClientSecret,
  auth0Issuer,
  public: {
    isDeployed
  }
} = useRuntimeConfig();

export default NuxtAuthHandler({
  debug: (isDeployed) ? false: true,
  secret: nextAuthSecret,
  providers: [
    Auth0Provider.default({
      id: 'auth0',
      clientId: auth0ClientId,
      clientSecret: auth0ClientSecret,
      issuer: auth0Issuer
    })
  ]
});
