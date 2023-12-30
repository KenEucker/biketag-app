globalThis._importMeta_={url:import.meta.url,env:process.env};import { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, isEvent, createEvent, getRequestHeader, eventHandler, setHeaders, sendRedirect, proxyRequest, setResponseHeader, send, getResponseStatus, setResponseStatus, setResponseHeaders, getRequestHeaders, getHeaders, createError, setCookie, appendHeader, parseCookies, getMethod, getQuery as getQuery$1, isMethod, readBody, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler, getResponseStatusText } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/h3/dist/index.mjs';
import Auth0Provider from 'file:///Users/keneucker/Dev/biketag-app/node_modules/next-auth/providers/auth0.js';
import axios from 'file:///Users/keneucker/Dev/biketag-app/node_modules/axios/index.js';
import Ajv from 'file:///Users/keneucker/Dev/biketag-app/node_modules/ajv/lib/ajv.js';
import CryptoJS from 'file:///Users/keneucker/Dev/biketag-app/node_modules/crypto-js/index.js';
import * as jose from 'file:///Users/keneucker/Dev/biketag-app/node_modules/jose/dist/node/esm/index.js';
import { JwtVerifier, getTokenFromHeader } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/@serverless-jwt/jwt-verifier/dist/index.js';
import BikeTagClient from 'file:///Users/keneucker/Dev/biketag-app/node_modules/biketag/biketag.node.js';
import lzutf8 from 'file:///Users/keneucker/Dev/biketag-app/node_modules/lzutf8/build/production/lzutf8.js';
import qs from 'file:///Users/keneucker/Dev/biketag-app/node_modules/qs/lib/index.js';
import { getRequestDependencies, getPreloadLinks, getPrefetchLinks, createRenderer } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { stringify, uneval } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/devalue/index.js';
import { renderSSRHead } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/@unhead/ssr/dist/index.mjs';
import { createFetch as createFetch$1, Headers as Headers$1 } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/ofetch/dist/node.mjs';
import destr from 'file:///Users/keneucker/Dev/biketag-app/node_modules/destr/dist/index.mjs';
import { createCall, createFetch } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/unenv/runtime/fetch/index.mjs';
import { createHooks } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/hookable/dist/index.mjs';
import { snakeCase } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/scule/dist/index.mjs';
import { klona } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/klona/dist/index.mjs';
import defu, { defuFn, defu as defu$1 } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/defu/dist/defu.mjs';
import { hash } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/ohash/dist/index.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/ufo/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///Users/keneucker/Dev/biketag-app/node_modules/unstorage/drivers/fs.mjs';
import { toRouteMatcher, createRouter } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/radix3/dist/index.mjs';
import getURL from 'file:///Users/keneucker/Dev/biketag-app/node_modules/requrl/dist/requrl.js';
import { AuthHandler } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/next-auth/core/index.js';
import { version, unref } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/vue/index.mjs';
import { createServerHead as createServerHead$1 } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/unhead/dist/index.mjs';
import { defineHeadPlugin } from 'file:///Users/keneucker/Dev/biketag-app/node_modules/@unhead/shared/dist/index.mjs';

const r=Object.create(null),t=e=>globalThis.process?.env||globalThis._importMeta_.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?r:globalThis),s=new Proxy(r,{get(e,o){return t()[o]??r[o]},has(e,o){const i=t();return o in i||o in r},set(e,o,i){const p=t(!0);return p[o]=i,!0},deleteProperty(e,o){if(!o)return !1;const i=t(!0);return delete i[o],!0},ownKeys(){const e=t(!0);return Object.keys(e)}}),E=typeof process<"u"&&process.env&&"development"||"",d=[["APPVEYOR"],["AWS_AMPLIFY","AWS_APP_ID",{ci:!0}],["AZURE_PIPELINES","SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],["AZURE_STATIC","INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],["APPCIRCLE","AC_APPCIRCLE"],["BAMBOO","bamboo_planKey"],["BITBUCKET","BITBUCKET_COMMIT"],["BITRISE","BITRISE_IO"],["BUDDY","BUDDY_WORKSPACE_ID"],["BUILDKITE"],["CIRCLE","CIRCLECI"],["CIRRUS","CIRRUS_CI"],["CLOUDFLARE_PAGES","CF_PAGES",{ci:!0}],["CODEBUILD","CODEBUILD_BUILD_ARN"],["CODEFRESH","CF_BUILD_ID"],["DRONE"],["DRONE","DRONE_BUILD_EVENT"],["DSARI"],["GITHUB_ACTIONS"],["GITLAB","GITLAB_CI"],["GITLAB","CI_MERGE_REQUEST_ID"],["GOCD","GO_PIPELINE_LABEL"],["LAYERCI"],["HUDSON","HUDSON_URL"],["JENKINS","JENKINS_URL"],["MAGNUM"],["NETLIFY"],["NETLIFY","NETLIFY_LOCAL",{ci:!1}],["NEVERCODE"],["RENDER"],["SAIL","SAILCI"],["SEMAPHORE"],["SCREWDRIVER"],["SHIPPABLE"],["SOLANO","TDDIUM"],["STRIDER"],["TEAMCITY","TEAMCITY_VERSION"],["TRAVIS"],["VERCEL","NOW_BUILDER"],["VERCEL","VERCEL",{ci:!1}],["VERCEL","VERCEL_ENV",{ci:!1}],["APPCENTER","APPCENTER_BUILD_ID"],["CODESANDBOX","CODESANDBOX_SSE",{ci:!1}],["STACKBLITZ"],["STORMKIT"],["CLEAVR"]];function B(){if(globalThis.process?.env)for(const e of d){const o=e[1]||e[0];if(globalThis.process?.env[o])return {name:e[0].toLowerCase(),...e[2]}}return globalThis.process?.env?.SHELL==="/bin/jsh"&&globalThis.process?.versions?.webcontainer?{name:"stackblitz",ci:!1}:{name:"",ci:!1}}const I=B(),P=I.name;function n(e){return e?e!=="false":!1}const l=globalThis.process?.platform||"",T=n(s.CI)||I.ci!==!1,a=n(globalThis.process?.stdout&&globalThis.process?.stdout.isTTY);n(s.DEBUG);const c=E==="test"||n(s.TEST);n(s.MINIMAL)||T||c||!a;const C=/^win/i.test(l);!n(s.NO_COLOR)&&(n(s.FORCE_COLOR)||C&&s.TERM!=="dumb"||a&&s.TERM&&s.TERM==="dumb"||T);const R=(globalThis.process?.versions?.node||"").replace(/^v/,"")||null;Number(R?.split(".")[0])||null;const w=globalThis.process||Object.create(null),_={versions:{}};new Proxy(w,{get(e,o){if(o==="env")return s;if(o in e)return e[o];if(o in _)return _[o]}});const L=!!globalThis.Netlify,A=!!globalThis.EdgeRuntime,O=globalThis.navigator?.userAgent==="Cloudflare-Workers",D=!!globalThis.Deno,u=!!globalThis.__lagon__,N=globalThis.process?.release?.name==="node",S=!!globalThis.Bun||!!globalThis.process?.versions?.bun,b=!!globalThis.fastly,G=[[L,"netlify"],[A,"edge-light"],[O,"workerd"],[D,"deno"],[u,"lagon"],[N,"node"],[S,"bun"],[b,"fastly"]];function K(){const e=G.find(o=>o[0]);if(e)return {name:e[1]}}const g=K();g?.name||"";

const inlineAppConfig = {
  "nuxt": {
    "buildId": "dev"
  },
  "ui": {
    "primary": "green",
    "gray": "cool",
    "colors": [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
      "primary"
    ],
    "strategy": "merge"
  }
};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "ACCESS_TOKEN": "8b4e2b86a724bf3f39d6766de6e67212",
    "CONTEXT": "",
    "APP_ID": "com.app.biketag",
    "ADMIN": "biketag@biketag.org",
    "AMBASSADOR_ROLE": "rol_iET51vzIn8z6Utz0",
    "PLAYER_ROLE": "rol_pcbQ68Q9L0yn1o3O",
    "GAME_NAME": "null",
    "GAME_SOURCE": "",
    "HOST": "biketag.io",
    "HOST_KEY": "ItsABikeTagGame",
    "IA_CID": "",
    "IA_CSECRET": "",
    "IA_RTOKEN": "",
    "IA_TOKEN": "",
    "I_CID": "",
    "I_CSECRET": "",
    "I_RTOKEN": "",
    "I_TOKEN": "",
    "SA_CDN_URL": "https://cdn.sanity.io/images/",
    "SA_DSET": "",
    "SA_PID": "",
    "SA_TOKEN": "",
    "S_CURL": "https://cdn.sanity.io/images/",
    "S_DSET": "",
    "S_PID": "",
    "S_TOKEN": "",
    "G_AKEY": "",
    "auth": {
      "computed": {
        "origin": "http://localhost:3000",
        "pathname": "/api/auth",
        "fullBaseUrl": "http://localhost:3000/api/auth"
      },
      "isEnabled": true,
      "session": {
        "enableRefreshPeriodically": false,
        "enableRefreshOnWindowFocus": true
      },
      "globalAppMiddleware": {
        "isEnabled": true,
        "allow404WithoutAuth": true,
        "addDefaultCallbackUrl": true
      },
      "provider": {
        "type": "authjs",
        "trustHost": false,
        "defaultProvider": "",
        "addDefaultCallbackUrl": true
      },
      "origin": "http://localhost:3000",
      "baseURL": "http://localhost:3000",
      "addDefaultCallbackUrl": true
    }
  },
  "nextAuthSecret": "",
  "auth0Audience": "",
  "auth0ClientId": "",
  "auth0ClientSecret": "",
  "auth0Issuer": "",
  "A_M_CS": "",
  "A_M_CID": ""
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const serverAssets = [{"baseName":"server","dir":"/Users/keneucker/Dev/biketag-app/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/keneucker/Dev/biketag-app","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/keneucker/Dev/biketag-app/server","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/keneucker/Dev/biketag-app/.nuxt","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/keneucker/Dev/biketag-app/.nuxt/cache","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/keneucker/Dev/biketag-app/.data/kv","ignore":["**/node_modules/**","**/.git/**"]}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          const promise = useStorage().setItem(cacheKey, entry).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event && event.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      const _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        variableHeaders[header] = incomingEvent.node.req.headers[header];
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        event.node.res.setHeader(name, value);
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const script$1 = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _riyjSSTt9h = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script$1}<\/script>`);
  });
});

const ERROR_MESSAGES = {
  NO_SECRET: "AUTH_NO_SECRET: No `secret` - this is an error in production, see https://sidebase.io/nuxt-auth/resources/errors. You can ignore this during development",
  NO_ORIGIN: "AUTH_NO_ORIGIN: No `origin` - this is an error in production, see https://sidebase.io/nuxt-auth/resources/errors. You can ignore this during development"
};

const isProduction = "development" === "production";
const useTypedBackendConfig = (runtimeConfig, type) => {
  if (runtimeConfig.public.auth.provider.type === type) {
    return runtimeConfig.public.auth.provider;
  }
  throw new Error("RuntimeError: Type must match at this point");
};

function defineRenderHandler(handler) {
  return eventHandler(async (event) => {
    if (event.path.endsWith("/favicon.ico")) {
      setResponseHeader(event, "Content-Type", "image/x-icon");
      return send(
        event,
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      );
    }
    const response = await handler(event);
    if (!response) {
      const _currentStatus = getResponseStatus(event);
      setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
      return send(
        event,
        "No response returned from render handler: " + event.path
      );
    }
    const nitroApp = useNitroApp();
    await nitroApp.hooks.callHook("render:response", response, { event });
    if (response.headers) {
      setResponseHeaders(event, response.headers);
    }
    if (response.statusCode || response.statusMessage) {
      setResponseStatus(event, response.statusCode, response.statusMessage);
    }
    return response.body;
  });
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const publicBase = useRuntimeConfig().app.cdnURL || useRuntimeConfig().app.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
}

const getServerOrigin = (event) => {
  const envOrigin = process.env.AUTH_ORIGIN;
  if (envOrigin) {
    return envOrigin;
  }
  const runtimeConfigOrigin = useRuntimeConfig().public.auth.computed.origin;
  if (runtimeConfigOrigin) {
    return runtimeConfigOrigin;
  }
  if (event && !isProduction) {
    return getURL(event.node.req, false);
  }
  throw new Error(ERROR_MESSAGES.NO_ORIGIN);
};
const getRequestURLFromRequest = (event, { trustHost }) => {
  if (trustHost) {
    const forwardedValue = getURL(event.node.req);
    if (forwardedValue) {
      return Array.isArray(forwardedValue) ? forwardedValue[0] : forwardedValue;
    }
  }
  let origin;
  try {
    origin = getServerOrigin(event);
  } catch (error) {
    return void 0;
  }
  return joinURL(origin, useRuntimeConfig().public.auth.computed.pathname);
};

function defineNitroPlugin(def) {
  return def;
}
const _8AZFpV9TVf = defineNitroPlugin(() => {
  try {
    getServerOrigin();
  } catch (error) {
    {
      console.info(ERROR_MESSAGES.NO_ORIGIN);
    }
  }
});

const script = "\"use strict\";(()=>{const a=window,e=document.documentElement,m=[\"dark\",\"light\"],c=window&&window.localStorage&&window.localStorage.getItem&&window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let n=c===\"system\"?d():c;const l=e.getAttribute(\"data-color-mode-forced\");l&&(n=l),i(n),a[\"__NUXT_COLOR_MODE__\"]={preference:c,value:n,getColorScheme:d,addColorScheme:i,removeColorScheme:f};function i(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.add(t):e.className+=\" \"+t,s&&e.setAttribute(\"data-\"+s,o)}function f(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp(t,\"g\"),\"\"),s&&e.removeAttribute(\"data-\"+s)}function r(o){return a.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function d(){if(a.matchMedia&&r(\"\").media!==\"not all\"){for(const o of m)if(r(\":\"+o).matches)return o}return\"light\"}})();\n";

const _btb3HUBwFU = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _riyjSSTt9h,
_8AZFpV9TVf,
_btb3HUBwFU
];

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.path,
    statusCode,
    statusMessage,
    message,
    stack: statusCode !== 404 ? `<pre>${stack.map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n")}</pre>` : "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    return send(event, JSON.stringify(errorObject));
  }
  const isErrorPage = event.path.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  return send(event, html);
});

const isNonEmptyObject = (obj) => typeof obj === "object" && Object.keys(obj).length > 0;

let preparedAuthHandler;
let usedSecret;
const SUPPORTED_ACTIONS = ["providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error", "_log"];
const useConfig = () => useTypedBackendConfig(useRuntimeConfig(), "authjs");
const readBodyForNext = async (event) => {
  let body;
  if (isMethod(event, "PATCH") || isMethod(event, "POST") || isMethod(event, "PUT") || isMethod(event, "DELETE")) {
    body = await readBody(event);
  }
  return body;
};
const parseActionAndProvider = ({ context }) => {
  const params = context.params?._?.split("/");
  if (!params || ![1, 2].includes(params.length)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid path used for auth-endpoint. Supply either one path parameter (e.g., \`/api/auth/session\`) or two (e.g., \`/api/auth/signin/github\` after the base path (in previous examples base path was: \`/api/auth/\`. Received \`${params}\`` });
  }
  const [unvalidatedAction, providerId] = params;
  const action = SUPPORTED_ACTIONS.find((action2) => action2 === unvalidatedAction);
  if (!action) {
    throw createError({ statusCode: 400, statusMessage: `Called endpoint with unsupported action ${unvalidatedAction}. Only the following actions are supported: ${SUPPORTED_ACTIONS.join(", ")}` });
  }
  return { action, providerId };
};
const NuxtAuthHandler = (nuxtAuthOptions) => {
  usedSecret = nuxtAuthOptions?.secret;
  if (!usedSecret) {
    {
      console.info(ERROR_MESSAGES.NO_SECRET);
      usedSecret = "secret";
    }
  }
  const options = defu$1(nuxtAuthOptions, {
    secret: usedSecret,
    logger: void 0,
    providers: [],
    trustHost: useConfig().trustHost
  });
  const getInternalNextAuthRequestData = async (event) => {
    const nextRequest = {
      host: getRequestURLFromRequest(event, { trustHost: useConfig().trustHost }),
      body: void 0,
      cookies: parseCookies(event),
      query: void 0,
      headers: getHeaders(event),
      method: getMethod(event),
      providerId: void 0,
      error: void 0
    };
    if (event.context.checkSessionOnNonAuthRequest === true) {
      return {
        ...nextRequest,
        method: "GET",
        action: "session"
      };
    }
    const query = getQuery$1(event);
    const { action, providerId } = parseActionAndProvider(event);
    const error = query.error;
    if (Array.isArray(error)) {
      throw createError({ statusCode: 400, statusMessage: "Error query parameter can only appear once" });
    }
    const body = await readBodyForNext(event);
    return {
      ...nextRequest,
      body,
      query,
      action,
      providerId,
      error: String(error) || void 0
    };
  };
  const handler = eventHandler(async (event) => {
    const { res } = event.node;
    const nextRequest = await getInternalNextAuthRequestData(event);
    const nextResult = await AuthHandler({
      req: nextRequest,
      options
    });
    if (nextResult.status) {
      res.statusCode = nextResult.status;
    }
    nextResult.cookies?.forEach((cookie) => setCookie(event, cookie.name, cookie.value, cookie.options));
    nextResult.headers?.forEach((header) => appendHeader(event, header.key, header.value));
    if (!nextResult.redirect) {
      return nextResult.body;
    }
    if (nextRequest.body?.json) {
      return { url: nextResult.redirect };
    }
    return sendRedirect(event, nextResult.redirect);
  });
  if (preparedAuthHandler) {
    console.warn("You setup the auth handler for a second time - this is likely undesired. Make sure that you only call `NuxtAuthHandler( ... )` once");
  }
  preparedAuthHandler = handler;
  return handler;
};
const getServerSession = async (event) => {
  const authBasePath = useRuntimeConfig().public.auth.computed.pathname;
  if (event.path && event.path.startsWith(authBasePath)) {
    return null;
  }
  if (!preparedAuthHandler) {
    const headers = getHeaders(event);
    await $fetch(joinURL(authBasePath, "/session"), { headers }).catch((error) => error.data);
    if (!preparedAuthHandler) {
      throw createError({ statusCode: 500, statusMessage: "Tried to get server session without setting up an endpoint to handle authentication (see https://github.com/sidebase/nuxt-auth#quick-start)" });
    }
  }
  event.context.checkSessionOnNonAuthRequest = true;
  const session = await preparedAuthHandler(event);
  delete event.context.checkSessionOnNonAuthRequest;
  if (isNonEmptyObject(session)) {
    return session;
  }
  return null;
};

const _XTcPhk = defineEventHandler(async (event) => {
  const targetUrl = event.req.url;
  const securedUrls = "/api/dashboard/";
  if (targetUrl.startsWith(securedUrls)) {
    const session = await getServerSession(event);
    if (!session) {
      throw createError({
        statusMessage: "Unauthenticated",
        statusCode: 403
      });
    }
    event.session = session;
  }
});

const _lazy_EOdPcK = () => Promise.resolve().then(function () { return _____$1; });
const _lazy_PtwXlS = () => Promise.resolve().then(function () { return constants; });
const _lazy_8qNhMe = () => Promise.resolve().then(function () { return methods; });
const _lazy_WVmeVZ = () => Promise.resolve().then(function () { return hello$1; });
const _lazy_4QdVZf = () => Promise.resolve().then(function () { return profile$1; });
const _lazy_YSRBsT = () => Promise.resolve().then(function () { return submissionCreated$1; });
const _lazy_VswOL4 = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _XTcPhk, lazy: false, middleware: true, method: undefined },
  { route: '/api/auth/**', handler: _lazy_EOdPcK, lazy: true, middleware: false, method: undefined },
  { route: '/api/common/constants', handler: _lazy_PtwXlS, lazy: true, middleware: false, method: undefined },
  { route: '/api/common/methods', handler: _lazy_8qNhMe, lazy: true, middleware: false, method: undefined },
  { route: '/api/hello', handler: _lazy_WVmeVZ, lazy: true, middleware: false, method: undefined },
  { route: '/api/profile', handler: _lazy_4QdVZf, lazy: true, middleware: false, method: undefined },
  { route: '/api/submission-created', handler: _lazy_YSRBsT, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_VswOL4, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_VswOL4, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((_err) => {
      console.error("Error while capturing another error", _err);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  for (const plugin of plugins) {
    try {
      plugin(app);
    } catch (err) {
      captureError(err, { tags: ["plugin"] });
      throw err;
    }
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const server = new Server(toNodeListener(nitroApp.h3App));
function getAddress() {
  if (P === "stackblitz" || process.env.NITRO_NO_UNIX_SOCKET || process.versions.bun) {
    return 0;
  }
  const socketName = `worker-${process.pid}-${threadId}.sock`;
  if (C) {
    return join("\\\\.\\pipe\\nitro", socketName);
  } else {
    const socketDir = join(tmpdir(), "nitro");
    mkdirSync(socketDir, { recursive: true });
    return join(socketDir, socketName);
  }
}
const listenAddress = getAddress();
server.listen(listenAddress, () => {
  const _address = server.address();
  parentPort.postMessage({
    event: "listen",
    address: typeof _address === "string" ? { socketPath: _address } : { host: "localhost", port: _address.port }
  });
});
trapUnhandledNodeErrors();
async function onShutdown(signal) {
  await nitroApp.hooks.callHook("close");
}
parentPort.on("message", async (msg) => {
  if (msg && msg.event === "shutdown") {
    await onShutdown();
    parentPort.postMessage({ event: "exit" });
  }
});

const _messages = {"appName":"Nuxt","version":"","statusCode":500,"statusMessage":"Server error","description":"An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.","stack":""};
const _render = function({ messages }) {
var __t, __p = '';
__p += '<!DOCTYPE html><html><head><title>' +
((__t = ( messages.statusCode )) == null ? '' : __t) +
' - ' +
((__t = ( messages.statusMessage )) == null ? '' : __t) +
' | ' +
((__t = ( messages.appName )) == null ? '' : __t) +
'</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1,minimum-scale=1" name="viewport"><style>.spotlight{background:linear-gradient(45deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);opacity:0.8;filter:blur(30vh);height:60vh;bottom:-40vh}*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e0e0e0}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p,pre{margin:0}h1{font-size:inherit;font-weight:inherit}pre{font-size:1em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.bg-white{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.bg-black\\/5{--tw-bg-opacity:.05;background-color:rgba(0,0,0,var(--tw-bg-opacity))}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.flex{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.flex-1{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}.font-medium{font-weight:500}.font-light{font-weight:300}.h-auto{height:auto}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-6xl{font-size:3.75rem;line-height:1}.leading-tight{line-height:1.25}.mb-8{margin-bottom:2rem}.mb-6{margin-bottom:1.5rem}.min-h-screen{min-height:100vh}.overflow-y-auto{overflow-y:auto}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.text-black{--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.z-10{z-index:10}@media (min-width: 640px){.sm\\:text-8xl{font-size:6rem;line-height:1}.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}}@media (prefers-color-scheme: dark){.dark\\:bg-black{--tw-bg-opacity:1;background-color:rgba(0,0,0,var(--tw-bg-opacity))}.dark\\:bg-white\\/10{--tw-bg-opacity:.1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.dark\\:text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}</style><script>(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll(\'link[rel="modulepreload"]\'))i(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();</script></head><body class="font-sans antialiased bg-white px-10 pt-14 dark:bg-black text-black dark:text-white min-h-screen flex flex-col"><div class="fixed left-0 right-0 spotlight"></div><h1 class="text-6xl sm:text-8xl font-medium mb-6">' +
((__t = ( messages.statusCode )) == null ? '' : __t) +
'</h1><p class="text-xl sm:text-2xl font-light mb-8 leading-tight">' +
((__t = ( messages.description )) == null ? '' : __t) +
'</p><div class="bg-white rounded-t-md bg-black/5 dark:bg-white/10 flex-1 overflow-y-auto h-auto"><pre class="text-xl font-light leading-tight z-10 p-8">' +
((__t = ( messages.stack )) == null ? '' : __t) +
'</pre></div></body></html>';
return __p
};
const _template = (messages) => _render({ messages: { ..._messages, ...messages } });
const template$1 = _template;

const errorDev = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template$1
});

const {
  nextAuthSecret,
  auth0ClientId,
  auth0ClientSecret,
  auth0Issuer,
  public: {
    isDeployed
  }
} = useRuntimeConfig();
const _____ = NuxtAuthHandler({
  debug: isDeployed ? false : true,
  secret: nextAuthSecret,
  providers: [
    Auth0Provider.default({
      id: "auth0",
      clientId: auth0ClientId,
      clientSecret: auth0ClientSecret,
      issuer: auth0Issuer
    })
  ]
});

const _____$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _____
});

var ErrorMessage = /* @__PURE__ */ ((ErrorMessage2) => {
  ErrorMessage2["NameTaken"] = "profile name is already in use";
  ErrorMessage2["ProfileInitialized"] = "profile fields have already been initialized";
  ErrorMessage2["InvalidRequestData"] = "invalid request data";
  ErrorMessage2["PatchFailed"] = "profile update error";
  ErrorMessage2["MethodNotAllowed"] = "request method not allowed";
  return ErrorMessage2;
})(ErrorMessage || {});
var HttpStatusCode = /* @__PURE__ */ ((HttpStatusCode2) => {
  HttpStatusCode2[HttpStatusCode2["Continue"] = 100] = "Continue";
  HttpStatusCode2[HttpStatusCode2["SwitchingProtocols"] = 101] = "SwitchingProtocols";
  HttpStatusCode2[HttpStatusCode2["Processing"] = 102] = "Processing";
  HttpStatusCode2[HttpStatusCode2["Ok"] = 200] = "Ok";
  HttpStatusCode2[HttpStatusCode2["Created"] = 201] = "Created";
  HttpStatusCode2[HttpStatusCode2["Accepted"] = 202] = "Accepted";
  HttpStatusCode2[HttpStatusCode2["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
  HttpStatusCode2[HttpStatusCode2["NoContent"] = 204] = "NoContent";
  HttpStatusCode2[HttpStatusCode2["ResetContent"] = 205] = "ResetContent";
  HttpStatusCode2[HttpStatusCode2["PartialContent"] = 206] = "PartialContent";
  HttpStatusCode2[HttpStatusCode2["MultiStatus"] = 207] = "MultiStatus";
  HttpStatusCode2[HttpStatusCode2["AlreadyReported"] = 208] = "AlreadyReported";
  HttpStatusCode2[HttpStatusCode2["ImUsed"] = 226] = "ImUsed";
  HttpStatusCode2[HttpStatusCode2["MultipleChoices"] = 300] = "MultipleChoices";
  HttpStatusCode2[HttpStatusCode2["MovedPermanently"] = 301] = "MovedPermanently";
  HttpStatusCode2[HttpStatusCode2["Found"] = 302] = "Found";
  HttpStatusCode2[HttpStatusCode2["SeeOther"] = 303] = "SeeOther";
  HttpStatusCode2[HttpStatusCode2["NotModified"] = 304] = "NotModified";
  HttpStatusCode2[HttpStatusCode2["UseProxy"] = 305] = "UseProxy";
  HttpStatusCode2[HttpStatusCode2["SwitchProxy"] = 306] = "SwitchProxy";
  HttpStatusCode2[HttpStatusCode2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
  HttpStatusCode2[HttpStatusCode2["PermanentRedirect"] = 308] = "PermanentRedirect";
  HttpStatusCode2[HttpStatusCode2["BadRequest"] = 400] = "BadRequest";
  HttpStatusCode2[HttpStatusCode2["Unauthorized"] = 401] = "Unauthorized";
  HttpStatusCode2[HttpStatusCode2["PaymentRequired"] = 402] = "PaymentRequired";
  HttpStatusCode2[HttpStatusCode2["Forbidden"] = 403] = "Forbidden";
  HttpStatusCode2[HttpStatusCode2["NotFound"] = 404] = "NotFound";
  HttpStatusCode2[HttpStatusCode2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
  HttpStatusCode2[HttpStatusCode2["NotAcceptable"] = 406] = "NotAcceptable";
  HttpStatusCode2[HttpStatusCode2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
  HttpStatusCode2[HttpStatusCode2["RequestTimeout"] = 408] = "RequestTimeout";
  HttpStatusCode2[HttpStatusCode2["Conflict"] = 409] = "Conflict";
  HttpStatusCode2[HttpStatusCode2["Gone"] = 410] = "Gone";
  HttpStatusCode2[HttpStatusCode2["LengthRequired"] = 411] = "LengthRequired";
  HttpStatusCode2[HttpStatusCode2["PreconditionFailed"] = 412] = "PreconditionFailed";
  HttpStatusCode2[HttpStatusCode2["PayloadTooLarge"] = 413] = "PayloadTooLarge";
  HttpStatusCode2[HttpStatusCode2["UriTooLong"] = 414] = "UriTooLong";
  HttpStatusCode2[HttpStatusCode2["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
  HttpStatusCode2[HttpStatusCode2["RangeNotSatisfiable"] = 416] = "RangeNotSatisfiable";
  HttpStatusCode2[HttpStatusCode2["ExpectationFailed"] = 417] = "ExpectationFailed";
  HttpStatusCode2[HttpStatusCode2["IAmATeapot"] = 418] = "IAmATeapot";
  HttpStatusCode2[HttpStatusCode2["MisdirectedRequest"] = 421] = "MisdirectedRequest";
  HttpStatusCode2[HttpStatusCode2["UnprocessableEntity"] = 422] = "UnprocessableEntity";
  HttpStatusCode2[HttpStatusCode2["Locked"] = 423] = "Locked";
  HttpStatusCode2[HttpStatusCode2["FailedDependency"] = 424] = "FailedDependency";
  HttpStatusCode2[HttpStatusCode2["UpgradeRequired"] = 426] = "UpgradeRequired";
  HttpStatusCode2[HttpStatusCode2["PreconditionRequired"] = 428] = "PreconditionRequired";
  HttpStatusCode2[HttpStatusCode2["TooManyRequests"] = 429] = "TooManyRequests";
  HttpStatusCode2[HttpStatusCode2["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
  HttpStatusCode2[HttpStatusCode2["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
  HttpStatusCode2[HttpStatusCode2["InternalServerError"] = 500] = "InternalServerError";
  HttpStatusCode2[HttpStatusCode2["NotImplemented"] = 501] = "NotImplemented";
  HttpStatusCode2[HttpStatusCode2["BadGateway"] = 502] = "BadGateway";
  HttpStatusCode2[HttpStatusCode2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
  HttpStatusCode2[HttpStatusCode2["GatewayTimeout"] = 504] = "GatewayTimeout";
  HttpStatusCode2[HttpStatusCode2["HttpVersionNotSupported"] = 505] = "HttpVersionNotSupported";
  HttpStatusCode2[HttpStatusCode2["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
  HttpStatusCode2[HttpStatusCode2["InsufficientStorage"] = 507] = "InsufficientStorage";
  HttpStatusCode2[HttpStatusCode2["LoopDetected"] = 508] = "LoopDetected";
  HttpStatusCode2[HttpStatusCode2["NotExtended"] = 510] = "NotExtended";
  HttpStatusCode2[HttpStatusCode2["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
  return HttpStatusCode2;
})(HttpStatusCode || {});

const constants = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ErrorMessage: ErrorMessage,
  HttpStatusCode: HttpStatusCode
});

const decompress = lzutf8.decompress;
const ajv = new Ajv();
const isValidJson = (data, type = "none") => {
  let schema = {};
  switch (type) {
    case "profile.patch":
      schema = {
        type: "object",
        properties: {
          user_metadata: {
            type: "object",
            properties: {
              passcode: { type: "string" },
              options: {
                type: "object",
                properties: {
                  skipSteps: { type: "boolean" }
                },
                minProperties: 1,
                additionalProperties: false
              },
              social: {
                type: "object",
                properties: {
                  reddit: { type: "string" },
                  instagram: { type: "string" },
                  twitter: { type: "string" },
                  imgur: { type: "string" },
                  discord: { type: "string" }
                },
                minProperties: 1,
                additionalProperties: false
              }
            },
            minProperties: 1,
            additionalProperties: false
          }
        },
        required: ["user_metadata"],
        additionalProperties: false
      };
      break;
    case "profile.patch.ambassador":
      schema = {
        type: "object",
        properties: {
          user_metadata: {
            type: "object",
            properties: {
              name: { type: "string" },
              passcode: { type: "string" },
              options: {
                type: "object",
                properties: {
                  skipSteps: { type: "boolean" }
                },
                minProperties: 1,
                additionalProperties: false
              },
              social: {
                type: "object",
                properties: {
                  reddit: { type: "string" },
                  instagram: { type: "string" },
                  twitter: { type: "string" },
                  imgur: { type: "string" },
                  discord: { type: "string" }
                },
                minProperties: 1,
                additionalProperties: false
              },
              credentials: {
                type: "object",
                properties: {
                  imgur: {
                    type: "object",
                    properties: {
                      clientId: { type: "string" },
                      clientSecret: { type: "string" },
                      refreshToken: { type: "string" }
                    },
                    additionalProperties: false
                  },
                  sanity: {
                    type: "object",
                    properties: {
                      projectId: { type: "string" },
                      dataset: { type: "string" }
                    },
                    additionalProperties: false
                  },
                  reddit: {
                    type: "object",
                    properties: {
                      clientId: { type: "string" },
                      clientSecret: { type: "string" },
                      username: { type: "string" },
                      password: { type: "string" }
                    },
                    additionalProperties: false
                  }
                },
                additionalProperties: false
              }
            },
            minProperties: 1,
            additionalProperties: false
          }
        },
        required: ["user_metadata"],
        additionalProperties: false
      };
      break;
  }
  const validate = ajv.compile(schema);
  return validate(data);
};
const getDomainInfo = (req) => {
  var _a, _b, _c, _d, _e;
  const nonSubdomainHosts = [
    `${(_a = process.env.HOST) != null ? _a : "biketag.local"}`,
    "biketag.dev",
    "0.0.0.0",
    "localhost"
  ];
  let host = (((_c = (_b = req.headers) == null ? void 0 : _b.host) == null ? void 0 : _c.length) ? req.headers.host : ((_e = (_d = req.location) == null ? void 0 : _d.host) == null ? void 0 : _e.length) ? req.location.host : "").toLowerCase().replace(/www./g, "");
  let port = null;
  let subdomain = null;
  if (host.indexOf(":") > 0) {
    [host, port] = host.split(":");
  }
  const isSubdomain = nonSubdomainHosts.indexOf(host) === -1;
  if (isSubdomain) {
    const hostSplit = host.split(".");
    subdomain = hostSplit[0];
    host = hostSplit.join(".");
  }
  return {
    host: host + (port ? ":" + port : ""),
    isSubdomain,
    subdomain
  };
};
const getBikeTagClientOpts = (req, authorized, admin) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const domainInfo = getDomainInfo(req);
  const isAuthenticatedPOST = (req == null ? void 0 : req.method) === "POST" || authorized;
  const isGET = !isAuthenticatedPOST && (req == null ? void 0 : req.method) === "GET";
  const opts = {
    game: (_a = domainInfo.subdomain) != null ? _a : process.env.GAME_NAME,
    cached: isGET || !isAuthenticatedPOST,
    accessToken: process.env.ACCESS_TOKEN,
    imgur: {
      clientId: process.env.I_CID
    }
  };
  if (authorized) {
    opts.imgur = (_b = opts.imgur) != null ? _b : {};
    opts.imgur.clientSecret = process.env.I_CSECRET;
    opts.imgur.accessToken = process.env.I_TOKEN;
    opts.imgur.refreshToken = process.env.I_RTOKEN;
    opts.sanity = (_c = opts.sanity) != null ? _c : {};
    opts.sanity.projectId = process.env.S_PID;
    opts.sanity.dataset = process.env.S_DSET;
    opts.sanity.token = process.env.S_TOKEN;
    if (admin) {
      opts.imgur.clientId = ((_d = process.env.IA_CID) == null ? void 0 : _d.length) ? process.env.IA_CID : opts.imgur.clientId;
      opts.imgur.clientSecret = ((_e = process.env.IA_CSECRET) == null ? void 0 : _e.length) ? process.env.IA_CSECRET : opts.imgur.clientSecret;
      opts.imgur.accessToken = (_f = process.env.IA_TOKEN) != null ? _f : "";
      opts.imgur.refreshToken = (_g = process.env.IA_RTOKEN) != null ? _g : opts.imgur.refreshToken;
      opts.sanity = (_h = opts.sanity) != null ? _h : {};
      opts.sanity.projectId = process.env.SA_PID;
      opts.sanity.dataset = process.env.SA_DSET;
      opts.sanity.token = process.env.SA_TOKEN;
    }
  }
  return opts;
};
const validateJWT = (verifier, options) => {
  return (handler) => async (event, context, cb) => {
    let claims;
    let accessToken;
    try {
      accessToken = getTokenFromHeader(event.headers.authorization);
      claims = await verifier.verifyAccessToken(accessToken);
    } catch (err) {
      if (typeof options.handleError !== "undefined" && options.handleError !== null) {
        return options.handleError(err);
      }
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: err.code,
          error_description: err.message
        })
      };
    }
    const ctx = {
      token: accessToken,
      claims
    };
    context.identityContext = ctx;
    return handler(event, context, cb);
  };
};
const getPayloadAuthorization = async (event) => {
  let authorizationString = event.headers.authorization;
  const basic = "Basic ";
  const bearer = "Bearer ";
  const client = "Client-ID ";
  const authorizationType = (authorizationString == null ? void 0 : authorizationString.indexOf(basic)) === 0 ? "basic" : (authorizationString == null ? void 0 : authorizationString.indexOf(client)) === 0 ? "client" : (authorizationString == null ? void 0 : authorizationString.indexOf(bearer)) === 0 ? "bearer" : null;
  const getBasicAuthProfile = (authorizationString2) => {
    const namePasscodeString = CryptoJS.AES.decrypt(
      authorizationString2,
      process.env.HOST_KEY
    ).toString(CryptoJS.enc.Utf8);
    const namePasscodeSplit = namePasscodeString.split("::");
    return {
      name: namePasscodeSplit[0],
      passcode: namePasscodeSplit[1]
    };
  };
  const getNetlifyAuthProfile = async (authorizationString2) => {
    try {
      const verifierOpts = { issuer: "", audience: "" };
      const verifier = new JwtVerifier(verifierOpts);
      return await validateJWT(verifier, verifierOpts);
    } catch (e) {
      console.error({ authorizationNetlifyValidationError: e });
    }
    return null;
  };
  const getAuth0AuthProfile = async (authorizationString2) => {
    try {
      const JWKS = jose.createRemoteJWKSet(
        new URL(`https://${process.env.A_DOMAIN}/.well-known/jwks.json`)
      );
      const { payload } = await jose.jwtVerify(authorizationString2, JWKS);
      return payload;
    } catch (e) {
      return authorizationString2;
    }
  };
  switch (authorizationType) {
    case "basic":
      authorizationString = authorizationString.substring(basic.length);
      return getBasicAuthProfile(authorizationString);
    case "netlify":
      authorizationString = authorizationString.substring(client.length);
      return getNetlifyAuthProfile();
    case "client":
      authorizationString = authorizationString.substring(client.length);
      return getAuth0AuthProfile(authorizationString);
    case "bearer":
      authorizationString = authorizationString.substring(bearer.length);
      return getAuth0AuthProfile(authorizationString);
    default:
      authorizationString = (authorizationString == null ? void 0 : authorizationString.length) ? "authorization type not supported" : authorizationString;
      break;
  }
  return null;
};
const getThisGamesAmbassadors = async (client, adminBikeTagOpts) => {
  if (!client) {
    adminBikeTagOpts = adminBikeTagOpts != null ? adminBikeTagOpts : getBikeTagClientOpts(
      {
        method: "get"
      },
      true,
      true
    );
  }
  client = client != null ? client : new BikeTagClient(adminBikeTagOpts);
  const thisGamesAmbassadors = await client.ambassadors(void 0, {
    source: "sanity"
  });
  return thisGamesAmbassadors;
};
const getProfileAuthorization = async (event) => {
  const authorization = await getPayloadAuthorization(event);
  let profile = authorization;
  if (authorization) {
    const biketagOpts = getBikeTagClientOpts(event, true, true);
    const biketag = new BikeTagClient(biketagOpts);
    const thisGamesAmbassadors = await getThisGamesAmbassadors(biketag);
    const profileAmbassadorMatch = thisGamesAmbassadors.filter((a) => a.email === profile.email);
    if (profileAmbassadorMatch.length) {
      profile.isBikeTagAmbassador = true;
      profile = { ...profile, ...profileAmbassadorMatch[0] };
    }
  }
  return profile;
};
const getEnvironmentVariable = (key) => {
  if (process.env[key]) {
    return decompress(process.env[key], { inputEncoding: "Base64" });
  }
};
const getAuthManagementToken = async () => {
  try {
    return await axios({
      method: "POST",
      url: `https://${process.env.A_DOMAIN}/oauth/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: qs.stringify({
        grant_type: "client_credentials",
        client_id: process.env.A_M_CID,
        client_secret: process.env.A_M_CS,
        audience: process.env.A_AUDIENCE
      })
    });
  } catch (e) {
    console.log(e);
  }
};
const auth0Headers = async () => {
  var _a;
  return {
    "Authorization": `Bearer ${(_a = (await getAuthManagementToken()).data) == null ? void 0 : _a.access_token}`
  };
};
const acceptCorsHeaders = () => ({
  Accept: "*",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Max-Age": "8640"
});
const constructAmbassadorProfile = (profile = {}, defaults = {}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea, _Fa, _Ga, _Ha, _Ia, _Ja, _Ka, _La, _Ma, _Na, _Oa, _Pa, _Qa, _Ra, _Sa, _Ta, _Ua, _Va, _Wa, _Xa, _Ya, _Za, __a, _$a, _ab, _bb, _cb, _db, _eb, _fb, _gb, _hb, _ib, _jb, _kb, _lb, _mb, _nb, _ob, _pb, _qb, _rb;
  const user_metadata = {
    name: (_d = (_c = (_a = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _a.name) != null ? _c : (_b = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _b.name) != null ? _d : "",
    passcode: (_h = (_g = (_e = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _e.passcode) != null ? _g : (_f = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _f.passcode) != null ? _h : "",
    social: {
      reddit: (_n = (_m = (_j = (_i = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _i.social) == null ? void 0 : _j.reddit) != null ? _m : (_l = (_k = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _k.social) == null ? void 0 : _l.reddit) != null ? _n : "",
      instagram: (_t = (_s = (_p = (_o = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _o.social) == null ? void 0 : _p.instagram) != null ? _s : (_r = (_q = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _q.social) == null ? void 0 : _r.instagram) != null ? _t : "",
      twitter: (_z = (_y = (_v = (_u = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _u.social) == null ? void 0 : _v.twitter) != null ? _y : (_x = (_w = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _w.social) == null ? void 0 : _x.twitter) != null ? _z : "",
      imgur: (_F = (_E = (_B = (_A = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _A.social) == null ? void 0 : _B.imgur) != null ? _E : (_D = (_C = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _C.social) == null ? void 0 : _D.imgur) != null ? _F : "",
      discord: (_L = (_K = (_H = (_G = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _G.social) == null ? void 0 : _H.discord) != null ? _K : (_J = (_I = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _I.social) == null ? void 0 : _J.discord) != null ? _L : ""
    },
    credentials: {
      imgur: {
        clientId: (_R = (_Q = (_N = (_M = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _M.credentials) == null ? void 0 : _N.imgur.clientId) != null ? _Q : (_P = (_O = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _O.credentials) == null ? void 0 : _P.imgur.clientId) != null ? _R : "",
        clientSecret: (_X = (_W = (_T = (_S = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _S.credentials) == null ? void 0 : _T.imgur.clientSecret) != null ? _W : (_V = (_U = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _U.credentials) == null ? void 0 : _V.imgur.clientSecret) != null ? _X : "",
        refreshToken: (_ba = (_aa = (_Z = (_Y = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _Y.credentials) == null ? void 0 : _Z.imgur.refreshToken) != null ? _aa : (_$ = (__ = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : __.credentials) == null ? void 0 : _$.imgur.refreshToken) != null ? _ba : ""
      },
      sanity: {
        projectId: (_ha = (_ga = (_da = (_ca = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _ca.credentials) == null ? void 0 : _da.sanity.projectId) != null ? _ga : (_fa = (_ea = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _ea.credentials) == null ? void 0 : _fa.sanity.projectId) != null ? _ha : "",
        dataset: (_na = (_ma = (_ja = (_ia = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _ia.credentials) == null ? void 0 : _ja.sanity.dataset) != null ? _ma : (_la = (_ka = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _ka.credentials) == null ? void 0 : _la.sanity.dataset) != null ? _na : ""
      },
      reddit: {
        clientId: (_ta = (_sa = (_pa = (_oa = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _oa.credentials) == null ? void 0 : _pa.reddit.clientId) != null ? _sa : (_ra = (_qa = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _qa.credentials) == null ? void 0 : _ra.reddit.clientId) != null ? _ta : "",
        clientSecret: (_za = (_ya = (_va = (_ua = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _ua.credentials) == null ? void 0 : _va.reddit.clientSecret) != null ? _ya : (_xa = (_wa = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _wa.credentials) == null ? void 0 : _xa.reddit.clientSecret) != null ? _za : "",
        username: (_Fa = (_Ea = (_Ba = (_Aa = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _Aa.credentials) == null ? void 0 : _Ba.reddit.username) != null ? _Ea : (_Da = (_Ca = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _Ca.credentials) == null ? void 0 : _Da.reddit.username) != null ? _Fa : "",
        password: (_La = (_Ka = (_Ha = (_Ga = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _Ga.credentials) == null ? void 0 : _Ha.reddit.password) != null ? _Ka : (_Ja = (_Ia = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _Ia.credentials) == null ? void 0 : _Ja.reddit.password) != null ? _La : ""
      }
    },
    options: {
      skipSteps: (_Ra = (_Qa = (_Na = (_Ma = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _Ma.options) == null ? void 0 : _Na.skipSteps) != null ? _Qa : (_Pa = (_Oa = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _Oa.options) == null ? void 0 : _Pa.skipSteps) != null ? _Ra : false
    }
  };
  return {
    name: (_Ta = (_Sa = profile.name) != null ? _Sa : defaults.name) != null ? _Ta : "",
    sub: (_Va = (_Ua = profile.sub) != null ? _Ua : defaults.sub) != null ? _Va : "",
    slug: (_Xa = (_Wa = profile.slug) != null ? _Wa : defaults.slug) != null ? _Xa : "",
    address1: (_Za = (_Ya = profile.address1) != null ? _Ya : defaults.address1) != null ? _Za : "",
    address2: (_$a = (__a = profile.address2) != null ? __a : defaults.address2) != null ? _$a : "",
    city: (_bb = (_ab = profile.city) != null ? _ab : defaults.city) != null ? _bb : "",
    country: (_db = (_cb = profile.country) != null ? _cb : defaults.country) != null ? _db : "",
    email: (_fb = (_eb = profile.email) != null ? _eb : defaults.email) != null ? _fb : "",
    isBikeTagAmbassador: (_hb = (_gb = profile.isBikeTagAmbassador) != null ? _gb : defaults.isBikeTagAmbassador) != null ? _hb : "",
    locale: (_jb = (_ib = profile.locale) != null ? _ib : defaults.locale) != null ? _jb : "",
    nonce: (_lb = (_kb = profile.nonce) != null ? _kb : defaults.nonce) != null ? _lb : "",
    phone: (_nb = (_mb = profile.phone) != null ? _mb : defaults.phone) != null ? _nb : "",
    picture: (_pb = (_ob = profile.picture) != null ? _ob : defaults.picture) != null ? _pb : "",
    user_metadata,
    zipcode: (_rb = (_qb = profile.zipcode) != null ? _qb : defaults.zipcode) != null ? _rb : ""
  };
};
const constructPlayerProfile = (profile = {}, defaults = {}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T;
  const user_metadata = {
    name: (_d = (_c = (_a = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _a.name) != null ? _c : (_b = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _b.name) != null ? _d : "",
    social: {
      reddit: (_h = (_g = (_e = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _e.reddit) != null ? _g : (_f = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _f.reddit) != null ? _h : "",
      instagram: (_l = (_k = (_i = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _i.instagram) != null ? _k : (_j = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _j.instagram) != null ? _l : "",
      twitter: (_p = (_o = (_m = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _m.twitter) != null ? _o : (_n = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _n.twitter) != null ? _p : "",
      imgur: (_t = (_s = (_q = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _q.imgur) != null ? _s : (_r = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _r.imgur) != null ? _t : "",
      discord: (_x = (_w = (_u = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _u.discord) != null ? _w : (_v = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _v.discord) != null ? _x : ""
    },
    options: {
      skipSteps: (_D = (_C = (_z = (_y = profile == null ? void 0 : profile.user_metadata) == null ? void 0 : _y.options) == null ? void 0 : _z.skipSteps) != null ? _C : (_B = (_A = defaults == null ? void 0 : defaults.user_metadata) == null ? void 0 : _A.options) == null ? void 0 : _B.skipSteps) != null ? _D : false
    }
  };
  return {
    name: (_F = (_E = profile.name) != null ? _E : defaults.name) != null ? _F : "",
    sub: (_H = (_G = profile.sub) != null ? _G : defaults.sub) != null ? _H : "",
    slug: (_J = (_I = profile.slug) != null ? _I : defaults.slug) != null ? _J : "",
    email: (_L = (_K = profile.email) != null ? _K : defaults.email) != null ? _L : "",
    locale: (_N = (_M = profile.locale) != null ? _M : defaults.locale) != null ? _N : "",
    nonce: (_P = (_O = profile.nonce) != null ? _O : defaults.nonce) != null ? _P : "",
    picture: (_R = (_Q = profile.picture) != null ? _Q : defaults.picture) != null ? _R : "",
    user_metadata,
    zipcode: (_T = (_S = profile.zipcode) != null ? _S : defaults.zipcode) != null ? _T : ""
  };
};

const methods = /*#__PURE__*/Object.freeze({
  __proto__: null,
  acceptCorsHeaders: acceptCorsHeaders,
  auth0Headers: auth0Headers,
  constructAmbassadorProfile: constructAmbassadorProfile,
  constructPlayerProfile: constructPlayerProfile,
  decompress: decompress,
  getBikeTagClientOpts: getBikeTagClientOpts,
  getDomainInfo: getDomainInfo,
  getEnvironmentVariable: getEnvironmentVariable,
  getPayloadAuthorization: getPayloadAuthorization,
  getProfileAuthorization: getProfileAuthorization,
  getThisGamesAmbassadors: getThisGamesAmbassadors,
  isValidJson: isValidJson
});

useRuntimeConfig();
const parseQuery = (query = "") => {
  var _a;
  const params = (_a = new URLSearchParams(query)) != null ? _a : [];
  return Object.fromEntries(params);
};
const parseBody = (body = "") => {
  let parsed = {};
  try {
    parsed = JSON.parse(body);
  } catch (e) {
    parsed = parseQuery(body);
  }
  return parsed;
};
const getPayloadOpts = (event, base = {}) => {
  const parsedQuery = parseQuery(event.rawQuery);
  const parsedBody = parseBody(event.body);
  return {
    ...base,
    ...parsedQuery,
    ...parsedBody
  };
};

const hello = defineEventHandler(async (event) => {
  var _a;
  const body = getPayloadOpts(event);
  console.log({ event, body });
  return {
    statusCode: 200,
    body: JSON.stringify({ hello: (_a = body.hello) != null ? _a : "world" })
  };
});

const hello$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: hello
});

const profile = defineEventHandler(async (event) => {
  var _a;
  const headers = acceptCorsHeaders();
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: HttpStatusCode.NoContent,
      headers
    };
  }
  let body = "missing authorization header";
  let statusCode = HttpStatusCode.Unauthorized;
  const profile = await getProfileAuthorization(event);
  if (profile && profile.sub) {
    let options = {};
    const authorizationHeaders = await auth0Headers();
    switch (event.httpMethod) {
      case "PATCH":
        try {
          const data = JSON.parse(event.body);
          delete data.user_metadata.name;
          const validator = profile.isBikeTagAmbassador ? "profile.patch.ambassador" : "profile.patch";
          const isValid = isValidJson(data, validator);
          if (isValid) {
            options = {
              method: "PATCH",
              url: `https://${process.env.A_DOMAIN}/api/v2/users/${profile.sub}`,
              headers: authorizationHeaders,
              data
            };
          } else {
            console.log(data.user_metadata.credentials);
            console.log("data is not valid", data, validator);
            body = ErrorMessage.InvalidRequestData;
            statusCode = HttpStatusCode.BadRequest;
          }
        } catch (e) {
          body = `${ErrorMessage.PatchFailed}: ${(_a = e.message) != null ? _a : e}`;
          statusCode = HttpStatusCode.BadRequest;
        }
        break;
      case "GET":
        options = {
          method: "GET",
          url: `https://${process.env.A_DOMAIN}/api/v2/users/${profile.sub}?fields=user_metadata`,
          headers: authorizationHeaders
        };
        break;
      default:
        body = ErrorMessage.MethodNotAllowed;
        statusCode = HttpStatusCode.NotImplemented;
    }
    if (statusCode == HttpStatusCode.Unauthorized) {
      await axios.request(options).then(function(response) {
        if (typeof response.data === "string") {
          body = response.data;
        } else {
          const profileDataResponse = profile.isBikeTagAmbassador ? constructAmbassadorProfile(response.data, profile) : constructPlayerProfile(response.data, profile);
          body = JSON.stringify(profileDataResponse);
        }
        statusCode = HttpStatusCode.Ok;
      }).catch(function(error) {
        console.error(error);
        statusCode = HttpStatusCode.InternalServerError;
        body = error.message;
      });
    }
  }
  if (statusCode !== HttpStatusCode.Ok) {
    console.error(body);
  }
  return {
    statusCode,
    headers,
    body
  };
});

const profile$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: profile
});

const submissionCreated = defineEventHandler(async (event) => {
  console.log({ event });
  return {
    data: JSON.stringify({ event }),
    statusCode: 200
  };
});

const submissionCreated$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: submissionCreated
});

const Vue3 = version.startsWith("3");

function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref, lastKey = "") {
  if (ref instanceof Promise)
    return ref;
  const root = resolveUnref(ref);
  if (!ref || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}

const VueReactivityPlugin = defineHeadPlugin({
  hooks: {
    "entries:resolve": function(ctx) {
      for (const entry of ctx.entries)
        entry.resolvedInput = resolveUnrefHeadInput(entry.input);
    }
  }
});

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1(options);
  head.use(VueReactivityPlugin);
  head.install = vueInstall(head);
  return head;
}

const unheadPlugins = [];

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[],"noscript":[]};

const appRootId = "__nuxt";

const appRootTag = "div";

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const getClientManifest = () => import('file:///Users/keneucker/Dev/biketag-app/.nuxt/dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "");
  const options = {
    manifest,
    renderToString: () => `<${appRootTag}${` id="${appRootId}"` }>${spaTemplate}</${appRootTag}>`,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig();
    ssrContext.modules = ssrContext.modules || /* @__PURE__ */ new Set();
    ssrContext.payload = {
      _errors: {},
      serverRendered: false,
      data: {},
      state: {}
    };
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
const PAYLOAD_URL_RE = /\/_payload(\.[a-zA-Z0-9]+)?.json(\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && ssrError.statusCode) {
    ssrError.statusCode = parseInt(ssrError.statusCode);
  }
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const islandContext = void 0;
  let url = ssrError?.url || islandContext?.url || event.path;
  const isRenderingPayload = PAYLOAD_URL_RE.test(url) && !islandContext;
  if (isRenderingPayload) {
    url = url.substring(0, url.lastIndexOf("/")) || "/";
    event._path = url;
    event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  const head = createServerHead({
    plugins: unheadPlugins
  });
  const headEntryOptions = { mode: "server" };
  head.push(appHead, headEntryOptions);
  const ssrContext = {
    url,
    event,
    runtimeConfig: useRuntimeConfig(),
    noSSR: !!true   ,
    head,
    error: !!ssrError,
    nuxt: void 0,
    /* NuxtApp */
    payload: ssrError ? { error: ssrError } : {},
    _payloadReducers: {},
    islandContext
  };
  const renderer = await getSPARenderer() ;
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response2 = renderPayloadResponse(ssrContext);
    return response2;
  }
  const inlinedStyles = Boolean(islandContext) ? await renderInlineStyles(ssrContext.modules ?? ssrContext._registeredComponents ?? []) : [];
  const NO_SCRIPTS = routeOptions.experimentalNoScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  head.push({ style: inlinedStyles });
  head.push({
    link: Object.values(styles).map(
      (resource) => ({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file) })
    )
  }, headEntryOptions);
  if (!NO_SCRIPTS) {
    head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      script: renderPayloadJsonScript({ id: "__NUXT_DATA__", ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.experimentalNoScripts) {
    head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(head);
  const htmlContext = {
    island: Boolean(islandContext),
    htmlAttrs: [htmlAttrs],
    head: normalizeChunks([headTags, ssrContext.styles]),
    bodyAttrs: [bodyAttrs],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [_rendered.html],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  const response = {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
  return response;
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  return chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html>
<html ${joinAttrs(html.htmlAttrs)}>
<head>${joinTags(html.head)}</head>
<body ${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>
</html>`;
}
async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}
function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    type: "application/json",
    id: opts.id,
    innerHTML: contents,
    "data-ssr": !(true )
  };
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${uneval(opts.ssrContext.config)}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const renderer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: renderer
});

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: styles
});

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template
});
//# sourceMappingURL=index.mjs.map
