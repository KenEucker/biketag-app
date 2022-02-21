<h1 align="center" style="border-bottom: none;">biketag</h1>
<h3 align="center">BikeTag Official Application</h3>
<p align="center">
  <br>
  <a href="https://github.com/sponsors/KenEucker">
    <img alt="Sponsors" src="https://img.shields.io/github/sponsors/keneucker">
  </a>
  <a href="https://gitter.im/biketagorg/community">
    <img alt="Sponsors" src="https://badges.gitter.im/gitterHQ/gitter.png">
  </a>
</p>
<p align="center">
  <a href="https://github.com/keneucker/biketag-app/discussions">
    <img alt="Join the community on GitHub Discussions" src="https://img.shields.io/badge/Join%20the%20community-on%20GitHub%20Discussions-blue">
  </a>
</p>

<div align="center">
<img alt="biketag-app logo" src="https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/Tag-Logo-Stacked-V2-medium.png" height="auto" width="200" style="border-radius:25%;">
</div>

<div align="center">

## TODO

[ ] Develop restful API and provide all data needed for existing BikeTag Vue App to function

[ ] Develop restful API endpoints for active gameplay features including; queueing a tag, approving a tag, editing a tag, deleting a tag.

[ ] Develop serverless functions to support the process by which BikeTag Ambassadors administer BikeTag Games. (no FE component required)

[ ] Develop a frontend web component for BikeTag Ambassadors to log in using GitHub and be provided with the ability to access the administrative API endpoints developed in #2 and #3. (provided the ability means being provided the correct BikeTag Credentials for using the restful API endpoints, not a fully functional application that uses those endpoints)

[ ] Develop the serverless functions to support the process by which BikeTag Administrators (godmode) can grant API access to third-party BikeTag developers. (as with previous endeavors, this does not require a fully functional FE component)

[ ] Develop the subscribe and notify serverless functions with complementing restful API endpoints in order for the BikeTag App (Vue) to register players (using Croquet.io) for notifications and to send push notifications to those registered players of the BikeTag App (Vue).

## Side Quests

  [ ] Develop a frontend component for BikeTag Admins to be able to create new and change existing game settings (using BikeTag API/Sanity)
  
  [ ] Develop a frontend component for BikeTag Admins to be able to edit/delete/upload BikeTag posts for a given game (using BikeTag API/Imgur)
  
  [ ] Develop a frontend component for BikeTag Admins to be able to add/edit/delete BikeTag Developer Credentials
  
  [ ] Develop a frontend component for BikeTag Admins to be able to see all notifications (queue-found-tag, queue-mystery-tag, queue-submit-tag, queue-approve-tag)
  
  [ ] Develop a frontend component for BikeTag Admins to be able to see all of the server logs
  
  [ ] Develop a frontend component for BikeTag Admins to be able create a new BikeTag Game (using Netlify API for subdomain)
  
  [ ] Develop a frontend component for BikeTag Admins to be able to invite new BikeTag Ambassadors (using Netlify Identity API)
  
  [ ] Develop a frontend component for BikeTag Admins to be able to "ban" users or IP addresses from uploading new tags
  
  [ ] Develop a frontend component for BikeTag Admins to be able see all tags as pins on a map (Using Google Maps API)
  
  [ ] Develop a frontend component for BikeTag Admins to be able see site analytices (visits, posts, etc) (Using Netlfy API)
  
  [ ] Develop a frontend component for BikeTag Admins to be able to see all game data in a table and be able to export the data (to images + JSON file]

</div>


<div align="center">

## Credits

</div>

Many thanks to those who have donated to the BikeTag Project. Thank you to Prime Digital Academy for the opportunity to collaborate on vNext of this BikeTag App project for managing BikeTag Games.

Thank you to [Netlify][netlify] for providing a [free open source plan][netlify-opensource] for hosting.

Support the BikeTag Project on [GitHub][github], [Patreon][patreon], or directly by going out and playing a round of [BikeTag in your city](https://client.org)!

[twitter]: https://developer.twitter.com/en/docs/twitter-api
[github]: https://github.com/sponsors/KenEucker
[patreon]: https://patreon.com/BikeTag
[node-imgur]: https://github.com/kaimallea/node-imgur
[sanity]: https://www.sanity.io/docs/api-versioning
[imgur]: https://www.npmjs.com/package/imgur/v/next
[reddit]: https://www.npmjs.com/package/snoowrap
[biketag]: https://biketag.org
[netlify]: https://www.netlify.com
[netlify-opensource]: https://www.netlify.com/legal/open-source-policy


<div align="center">

  ## Vendors

  Images powered by imgur.com

  [![imgur.com][imgur-image]](https://apidocs.imgur.com/)

  Structured Content powered by sanity.io

  [![sanity.io][sanity-image]](https://www.sanity.io/docs/http-api)

  Discussions powered by reddit.com

  [![reddit.com][reddit-image]](https://www.reddit.com/dev/api/)

  Mentions powered by twitter.com

  [![twitter.com][twitter-image]](https://developer.twitter.com/en/docs)

  ## Deployed on Netlify servers

  <a href="https://www.netlify.com">
    <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
  </a>

  [biketag-logo]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/biketag-app-logo.jpg
  [imgur-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/imgur-logo.png
  [sanity-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/sanity-logo.png
  [reddit-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/reddit-logo.png
  [twitter-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/twitter-logo.png
</div>
