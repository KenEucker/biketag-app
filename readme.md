<h1 align="center" style="border-bottom: none;">biketag</h1>
<h3 align="center">BikeTag Official Application library</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/biketag-app/v/latest">
    <img alt="npm next version" src="https://img.shields.io/npm/v/biketag-app/latest.svg">
  </a>
  <a href="https://github.com/keneucker/biketag-app-app/actions?query=workflow%3ATests+branch%3Anext">
    <img alt="Build states" src="https://github.com/keneucker/biketag-app/workflows/Tests/badge.svg">
  </a>
  <br>
  <a href="https://creativecommons.org/licenses/by-sa/4.0/">
    <img src='https://img.shields.io/github/license/KenEucker/biketag-app' alt='license'>
  </a>
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
<img alt="biketag-app logo" src="https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/biketag-app-logo.jpg" height="auto" width="200" style="border-radius:25%;">
</div>

<div align="center">

## Installation

`npm install biketag-app`

</div>

## How to include it in your projects

The library is a default export, as well as a named class export `BikeTagApp`. You can retrieve it from jsDeliver or npm, and it works in both the browser and nodejs.

### Browser

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/biketag-app/client.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/npm/biketag-app/client.js"></script>
```

### CommonJS

import/require the module:
```ts
// Using import statement
import { BikeTagApp } from 'biketag-app'
```

```js
// Using require()
const { BikeTagApp } = require('biketag-app')
```

---

## Usage

### Instantiate with or without credentials (browser):
```js
// if you have your clientKey/clientToken to retrieve an access token automatically, you can pass those in:
const client = new biketagApp({
  game: 'portland',
  clientKey: process.env.BIKETAG_CLIENT_KEY,
  clientToken: process.env.BIKETAG_CLIENT_TOKEN,
})
```

### Instantiate with or without credentials (node):
```ts
// if you have Imgur credentials: clientId and clientSecret
const client = new BikeTagApp({
  game: 'portland',
  imgur: {
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
  }
})
```
<div align="center">

### Configuration

The BikeTag APP requires several different credentials to be set in the configuration in order to read BikeTag data. You can read more about specific configurations in the documentation: 

</div>

### **⚠️ For brevity, the rest of the examples will leave out the import and/or instantiation step.**




<div align="center">

## Credits

</div>

Support the BikeTag Project on [GitHub][github], [Patreon][patreon], or directly by going out and playing a round of [BikeTag in your city][biketag]]!

[twitter]: https://developer.twitter.com/en/docs/twitter-api
[github]: https://github.com/sponsors/KenEucker
[patreon]: https://patreon.com/BikeTag
[node-imgur]: https://github.com/kaimallea/node-imgur
[sanity]: https://www.sanity.io/docs/api-versioning
[imgur]: https://www.npmjs.com/package/imgur/v/next
[reddit]: https://www.npmjs.com/package/snoowrap
[biketag]: https://biketag.org


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

  [biketag-logo]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/biketag-app-logo.jpg
  [imgur-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/imgur-logo.png
  [sanity-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/sanity-logo.png
  [reddit-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/reddit-logo.png
  [twitter-image]: https://raw.githubusercontent.com/keneucker/biketag-website/production/public/img/twitter-logo.png
</div>