var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@middy/core/index.js
var require_core = __commonJS({
  "node_modules/@middy/core/index.js"(exports, module2) {
    "use strict";
    var middy2 = (baseHandler = () => {
    }, plugin) => {
      var _plugin$beforePrefetc;
      plugin === null || plugin === void 0 ? void 0 : (_plugin$beforePrefetc = plugin.beforePrefetch) === null || _plugin$beforePrefetc === void 0 ? void 0 : _plugin$beforePrefetc.call(plugin);
      const beforeMiddlewares = [];
      const afterMiddlewares = [];
      const onErrorMiddlewares = [];
      const instance = (event = {}, context = {}) => {
        var _plugin$requestStart;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$requestStart = plugin.requestStart) === null || _plugin$requestStart === void 0 ? void 0 : _plugin$requestStart.call(plugin);
        const request = {
          event,
          context,
          response: void 0,
          error: void 0,
          internal: {}
        };
        return runRequest(request, [...beforeMiddlewares], baseHandler, [...afterMiddlewares], [...onErrorMiddlewares], plugin);
      };
      instance.use = (middlewares) => {
        if (Array.isArray(middlewares)) {
          for (const middleware of middlewares) {
            instance.applyMiddleware(middleware);
          }
          return instance;
        }
        return instance.applyMiddleware(middlewares);
      };
      instance.applyMiddleware = (middleware) => {
        const {
          before,
          after,
          onError
        } = middleware;
        if (!before && !after && !onError) {
          throw new Error('Middleware must be an object containing at least one key among "before", "after", "onError"');
        }
        if (before)
          instance.before(before);
        if (after)
          instance.after(after);
        if (onError)
          instance.onError(onError);
        return instance;
      };
      instance.before = (beforeMiddleware) => {
        beforeMiddlewares.push(beforeMiddleware);
        return instance;
      };
      instance.after = (afterMiddleware) => {
        afterMiddlewares.unshift(afterMiddleware);
        return instance;
      };
      instance.onError = (onErrorMiddleware) => {
        onErrorMiddlewares.push(onErrorMiddleware);
        return instance;
      };
      instance.__middlewares = {
        before: beforeMiddlewares,
        after: afterMiddlewares,
        onError: onErrorMiddlewares
      };
      return instance;
    };
    var runRequest = async (request, beforeMiddlewares, baseHandler, afterMiddlewares, onErrorMiddlewares, plugin) => {
      try {
        await runMiddlewares(request, beforeMiddlewares, plugin);
        if (request.response === void 0) {
          var _plugin$beforeHandler, _plugin$afterHandler;
          plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeHandler = plugin.beforeHandler) === null || _plugin$beforeHandler === void 0 ? void 0 : _plugin$beforeHandler.call(plugin);
          request.response = await baseHandler(request.event, request.context);
          plugin === null || plugin === void 0 ? void 0 : (_plugin$afterHandler = plugin.afterHandler) === null || _plugin$afterHandler === void 0 ? void 0 : _plugin$afterHandler.call(plugin);
          await runMiddlewares(request, afterMiddlewares, plugin);
        }
      } catch (e) {
        request.response = void 0;
        request.error = e;
        try {
          await runMiddlewares(request, onErrorMiddlewares, plugin);
        } catch (e2) {
          e2.originalError = request.error;
          request.error = e2;
          throw request.error;
        }
        if (request.response === void 0)
          throw request.error;
      } finally {
        var _plugin$requestEnd;
        await (plugin === null || plugin === void 0 ? void 0 : (_plugin$requestEnd = plugin.requestEnd) === null || _plugin$requestEnd === void 0 ? void 0 : _plugin$requestEnd.call(plugin, request));
      }
      return request.response;
    };
    var runMiddlewares = async (request, middlewares, plugin) => {
      for (const nextMiddleware of middlewares) {
        var _plugin$beforeMiddlew, _plugin$afterMiddlewa;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeMiddlew = plugin.beforeMiddleware) === null || _plugin$beforeMiddlew === void 0 ? void 0 : _plugin$beforeMiddlew.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        const res = await (nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware(request));
        plugin === null || plugin === void 0 ? void 0 : (_plugin$afterMiddlewa = plugin.afterMiddleware) === null || _plugin$afterMiddlewa === void 0 ? void 0 : _plugin$afterMiddlewa.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        if (res !== void 0) {
          request.response = res;
          return;
        }
      }
    };
    module2.exports = middy2;
  }
});

// node_modules/@middy/util/codes.json
var require_codes = __commonJS({
  "node_modules/@middy/util/codes.json"(exports, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/@middy/util/index.js
var require_util = __commonJS({
  "node_modules/@middy/util/index.js"(exports, module2) {
    "use strict";
    var {
      Agent
    } = require("https");
    var awsClientDefaultOptions = {
      httpOptions: {
        agent: new Agent({
          secureProtocol: "TLSv1_2_method"
        })
      }
    };
    var createPrefetchClient = (options) => {
      const awsClientOptions = __spreadValues(__spreadValues({}, awsClientDefaultOptions), options.awsClientOptions);
      const client = new options.AwsClient(awsClientOptions);
      if (options.awsClientCapture) {
        return options.awsClientCapture(client);
      }
      return client;
    };
    var createClient = async (options, request) => {
      let awsClientCredentials = {};
      if (options.awsClientAssumeRole) {
        if (!request)
          throw new Error("Request required when assuming role");
        awsClientCredentials = await getInternal({
          credentials: options.awsClientAssumeRole
        }, request);
      }
      awsClientCredentials = __spreadValues(__spreadValues({}, awsClientCredentials), options.awsClientOptions);
      return createPrefetchClient(__spreadProps(__spreadValues({}, options), {
        awsClientOptions: awsClientCredentials
      }));
    };
    var canPrefetch = (options) => {
      return !(options !== null && options !== void 0 && options.awsClientAssumeRole) && !(options !== null && options !== void 0 && options.disablePrefetch);
    };
    var getInternal = async (variables, request) => {
      if (!variables || !request)
        return {};
      let keys = [];
      let values = [];
      if (variables === true) {
        keys = values = Object.keys(request.internal);
      } else if (typeof variables === "string") {
        keys = values = [variables];
      } else if (Array.isArray(variables)) {
        keys = values = variables;
      } else if (typeof variables === "object") {
        keys = Object.keys(variables);
        values = Object.values(variables);
      }
      const promises = [];
      for (const internalKey of values) {
        var _valuePromise;
        const pathOptionKey = internalKey.split(".");
        const rootOptionKey = pathOptionKey.shift();
        let valuePromise = request.internal[rootOptionKey];
        if (typeof ((_valuePromise = valuePromise) === null || _valuePromise === void 0 ? void 0 : _valuePromise.then) !== "function") {
          valuePromise = Promise.resolve(valuePromise);
        }
        promises.push(valuePromise.then((value) => pathOptionKey.reduce((p, c) => p === null || p === void 0 ? void 0 : p[c], value)));
      }
      values = await Promise.allSettled(promises);
      const errors = values.filter((res) => res.status === "rejected").map((res) => res.reason.message);
      if (errors.length)
        throw new Error(JSON.stringify(errors));
      return keys.reduce((obj, key, index) => __spreadProps(__spreadValues({}, obj), {
        [sanitizeKey(key)]: values[index].value
      }), {});
    };
    var sanitizeKeyPrefixLeadingNumber = /^([0-9])/;
    var sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g;
    var sanitizeKey = (key) => {
      return key.replace(sanitizeKeyPrefixLeadingNumber, "_$1").replace(sanitizeKeyRemoveDisallowedChar, "_");
    };
    var cache = {};
    var processCache = (options, fetch = () => void 0, request) => {
      const {
        cacheExpiry,
        cacheKey
      } = options;
      if (cacheExpiry) {
        const cached = getCache(cacheKey);
        const unexpired = cached && (cacheExpiry < 0 || cached.expiry > Date.now());
        if (unexpired && cached.modified) {
          const value2 = fetch(request, cached.value);
          cache[cacheKey] = {
            value: __spreadValues(__spreadValues({}, cached.value), value2),
            expiry: cached.expiry
          };
          return cache[cacheKey];
        }
        if (unexpired) {
          return __spreadProps(__spreadValues({}, cached), {
            cache: true
          });
        }
      }
      const value = fetch(request);
      const expiry = Date.now() + cacheExpiry;
      if (cacheExpiry) {
        cache[cacheKey] = {
          value,
          expiry
        };
      }
      return {
        value,
        expiry
      };
    };
    var getCache = (key) => {
      return cache[key];
    };
    var modifyCache = (cacheKey, value) => {
      if (!cache[cacheKey])
        return;
      cache[cacheKey] = __spreadProps(__spreadValues({}, cache[cacheKey]), {
        value,
        modified: true
      });
    };
    var clearCache = (keys = null) => {
      var _keys;
      keys = (_keys = keys) !== null && _keys !== void 0 ? _keys : Object.keys(cache);
      if (!Array.isArray(keys))
        keys = [keys];
      for (const cacheKey of keys) {
        cache[cacheKey] = void 0;
      }
    };
    var jsonSafeParse = (string2, reviver) => {
      if (typeof string2 !== "string")
        return string2;
      const firstChar = string2[0];
      if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"')
        return string2;
      try {
        return JSON.parse(string2, reviver);
      } catch (e) {
      }
      return string2;
    };
    var normalizeHttpResponse = (response) => {
      var _response$headers, _response;
      if (response === void 0) {
        response = {};
      } else if (Array.isArray(response) || typeof response !== "object" || response === null) {
        response = {
          body: response
        };
      }
      response.headers = (_response$headers = (_response = response) === null || _response === void 0 ? void 0 : _response.headers) !== null && _response$headers !== void 0 ? _response$headers : {};
      return response;
    };
    var statuses = require_codes();
    var {
      inherits
    } = require("util");
    var createErrorRegexp = /[^a-zA-Z]/g;
    var createError = (code, message, properties = {}) => {
      const name = statuses[code].replace(createErrorRegexp, "");
      const className = name.substr(-5) !== "Error" ? name + "Error" : name;
      function HttpError(message2) {
        const msg = message2 !== null && message2 !== void 0 ? message2 : statuses[code];
        const err = new Error(msg);
        Error.captureStackTrace(err, HttpError);
        Object.setPrototypeOf(err, HttpError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(HttpError, Error);
      const desc = Object.getOwnPropertyDescriptor(HttpError, "name");
      desc.value = className;
      Object.defineProperty(HttpError, "name", desc);
      Object.assign(HttpError.prototype, {
        status: code,
        statusCode: code,
        expose: code < 500
      }, properties);
      return new HttpError(message);
    };
    module2.exports = {
      createPrefetchClient,
      createClient,
      canPrefetch,
      getInternal,
      sanitizeKey,
      processCache,
      getCache,
      modifyCache,
      clearCache,
      jsonSafeParse,
      normalizeHttpResponse,
      createError
    };
  }
});

// node_modules/@middy/http-json-body-parser/index.js
var require_http_json_body_parser = __commonJS({
  "node_modules/@middy/http-json-body-parser/index.js"(exports, module2) {
    "use strict";
    var mimePattern = /^application\/(.+\+)?json(;.*)?$/;
    var defaults = {
      reviver: void 0
    };
    var httpJsonBodyParserMiddleware = (opts = {}) => {
      const options = __spreadValues(__spreadValues({}, defaults), opts);
      const httpJsonBodyParserMiddlewareBefore = async (request) => {
        var _headers$ContentType;
        const {
          headers,
          body
        } = request.event;
        const contentTypeHeader = (_headers$ContentType = headers === null || headers === void 0 ? void 0 : headers["Content-Type"]) !== null && _headers$ContentType !== void 0 ? _headers$ContentType : headers === null || headers === void 0 ? void 0 : headers["content-type"];
        if (mimePattern.test(contentTypeHeader)) {
          try {
            const data = request.event.isBase64Encoded ? Buffer.from(body, "base64").toString() : body;
            request.event.rawBody = body;
            request.event.body = JSON.parse(data, options.reviver);
          } catch (err) {
            const {
              createError
            } = require_util();
            throw createError(422, "Content type defined as JSON but an invalid JSON was provided");
          }
        }
      };
      return {
        before: httpJsonBodyParserMiddlewareBefore
      };
    };
    module2.exports = httpJsonBodyParserMiddleware;
  }
});

// node_modules/@hapi/hoek/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/@hapi/hoek/lib/stringify.js"(exports, module2) {
    "use strict";
    module2.exports = function(...args) {
      try {
        return JSON.stringify.apply(null, args);
      } catch (err) {
        return "[Cannot display object: " + err.message + "]";
      }
    };
  }
});

// node_modules/@hapi/hoek/lib/error.js
var require_error = __commonJS({
  "node_modules/@hapi/hoek/lib/error.js"(exports, module2) {
    "use strict";
    var Stringify = require_stringify();
    module2.exports = class extends Error {
      constructor(args) {
        const msgs = args.filter((arg) => arg !== "").map((arg) => {
          return typeof arg === "string" ? arg : arg instanceof Error ? arg.message : Stringify(arg);
        });
        super(msgs.join(" ") || "Unknown error");
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, exports.assert);
        }
      }
    };
  }
});

// node_modules/@hapi/hoek/lib/assert.js
var require_assert = __commonJS({
  "node_modules/@hapi/hoek/lib/assert.js"(exports, module2) {
    "use strict";
    var AssertError = require_error();
    module2.exports = function(condition, ...args) {
      if (condition) {
        return;
      }
      if (args.length === 1 && args[0] instanceof Error) {
        throw args[0];
      }
      throw new AssertError(args);
    };
  }
});

// node_modules/@hapi/hoek/lib/reach.js
var require_reach = __commonJS({
  "node_modules/@hapi/hoek/lib/reach.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var internals = {};
    module2.exports = function(obj, chain, options) {
      if (chain === false || chain === null || chain === void 0) {
        return obj;
      }
      options = options || {};
      if (typeof options === "string") {
        options = { separator: options };
      }
      const isChainArray = Array.isArray(chain);
      Assert(!isChainArray || !options.separator, "Separator option no valid for array-based chain");
      const path = isChainArray ? chain : chain.split(options.separator || ".");
      let ref = obj;
      for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        const type = options.iterables && internals.iterables(ref);
        if (Array.isArray(ref) || type === "set") {
          const number2 = Number(key);
          if (Number.isInteger(number2)) {
            key = number2 < 0 ? ref.length + number2 : number2;
          }
        }
        if (!ref || typeof ref === "function" && options.functions === false || !type && ref[key] === void 0) {
          Assert(!options.strict || i + 1 === path.length, "Missing segment", key, "in reach path ", chain);
          Assert(typeof ref === "object" || options.functions === true || typeof ref !== "function", "Invalid segment", key, "in reach path ", chain);
          ref = options.default;
          break;
        }
        if (!type) {
          ref = ref[key];
        } else if (type === "set") {
          ref = [...ref][key];
        } else {
          ref = ref.get(key);
        }
      }
      return ref;
    };
    internals.iterables = function(ref) {
      if (ref instanceof Set) {
        return "set";
      }
      if (ref instanceof Map) {
        return "map";
      }
    };
  }
});

// node_modules/@hapi/hoek/lib/types.js
var require_types = __commonJS({
  "node_modules/@hapi/hoek/lib/types.js"(exports, module2) {
    "use strict";
    var internals = {};
    exports = module2.exports = {
      array: Array.prototype,
      buffer: Buffer && Buffer.prototype,
      date: Date.prototype,
      error: Error.prototype,
      generic: Object.prototype,
      map: Map.prototype,
      promise: Promise.prototype,
      regex: RegExp.prototype,
      set: Set.prototype,
      weakMap: WeakMap.prototype,
      weakSet: WeakSet.prototype
    };
    internals.typeMap = /* @__PURE__ */ new Map([
      ["[object Error]", exports.error],
      ["[object Map]", exports.map],
      ["[object Promise]", exports.promise],
      ["[object Set]", exports.set],
      ["[object WeakMap]", exports.weakMap],
      ["[object WeakSet]", exports.weakSet]
    ]);
    exports.getInternalProto = function(obj) {
      if (Array.isArray(obj)) {
        return exports.array;
      }
      if (Buffer && obj instanceof Buffer) {
        return exports.buffer;
      }
      if (obj instanceof Date) {
        return exports.date;
      }
      if (obj instanceof RegExp) {
        return exports.regex;
      }
      if (obj instanceof Error) {
        return exports.error;
      }
      const objName = Object.prototype.toString.call(obj);
      return internals.typeMap.get(objName) || exports.generic;
    };
  }
});

// node_modules/@hapi/hoek/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@hapi/hoek/lib/utils.js"(exports) {
    "use strict";
    exports.keys = function(obj, options = {}) {
      return options.symbols !== false ? Reflect.ownKeys(obj) : Object.getOwnPropertyNames(obj);
    };
  }
});

// node_modules/@hapi/hoek/lib/clone.js
var require_clone = __commonJS({
  "node_modules/@hapi/hoek/lib/clone.js"(exports, module2) {
    "use strict";
    var Reach = require_reach();
    var Types = require_types();
    var Utils = require_utils();
    var internals = {
      needsProtoHack: /* @__PURE__ */ new Set([Types.set, Types.map, Types.weakSet, Types.weakMap])
    };
    module2.exports = internals.clone = function(obj, options = {}, _seen = null) {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }
      let clone = internals.clone;
      let seen = _seen;
      if (options.shallow) {
        if (options.shallow !== true) {
          return internals.cloneWithShallow(obj, options);
        }
        clone = (value) => value;
      } else if (seen) {
        const lookup = seen.get(obj);
        if (lookup) {
          return lookup;
        }
      } else {
        seen = /* @__PURE__ */ new Map();
      }
      const baseProto = Types.getInternalProto(obj);
      if (baseProto === Types.buffer) {
        return Buffer && Buffer.from(obj);
      }
      if (baseProto === Types.date) {
        return new Date(obj.getTime());
      }
      if (baseProto === Types.regex) {
        return new RegExp(obj);
      }
      const newObj = internals.base(obj, baseProto, options);
      if (newObj === obj) {
        return obj;
      }
      if (seen) {
        seen.set(obj, newObj);
      }
      if (baseProto === Types.set) {
        for (const value of obj) {
          newObj.add(clone(value, options, seen));
        }
      } else if (baseProto === Types.map) {
        for (const [key, value] of obj) {
          newObj.set(key, clone(value, options, seen));
        }
      }
      const keys = Utils.keys(obj, options);
      for (const key of keys) {
        if (key === "__proto__") {
          continue;
        }
        if (baseProto === Types.array && key === "length") {
          newObj.length = obj.length;
          continue;
        }
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
          if (descriptor.get || descriptor.set) {
            Object.defineProperty(newObj, key, descriptor);
          } else if (descriptor.enumerable) {
            newObj[key] = clone(obj[key], options, seen);
          } else {
            Object.defineProperty(newObj, key, { enumerable: false, writable: true, configurable: true, value: clone(obj[key], options, seen) });
          }
        } else {
          Object.defineProperty(newObj, key, {
            enumerable: true,
            writable: true,
            configurable: true,
            value: clone(obj[key], options, seen)
          });
        }
      }
      return newObj;
    };
    internals.cloneWithShallow = function(source, options) {
      const keys = options.shallow;
      options = Object.assign({}, options);
      options.shallow = false;
      const seen = /* @__PURE__ */ new Map();
      for (const key of keys) {
        const ref = Reach(source, key);
        if (typeof ref === "object" || typeof ref === "function") {
          seen.set(ref, ref);
        }
      }
      return internals.clone(source, options, seen);
    };
    internals.base = function(obj, baseProto, options) {
      if (options.prototype === false) {
        if (internals.needsProtoHack.has(baseProto)) {
          return new baseProto.constructor();
        }
        return baseProto === Types.array ? [] : {};
      }
      const proto = Object.getPrototypeOf(obj);
      if (proto && proto.isImmutable) {
        return obj;
      }
      if (baseProto === Types.array) {
        const newObj = [];
        if (proto !== baseProto) {
          Object.setPrototypeOf(newObj, proto);
        }
        return newObj;
      }
      if (internals.needsProtoHack.has(baseProto)) {
        const newObj = new proto.constructor();
        if (proto !== baseProto) {
          Object.setPrototypeOf(newObj, proto);
        }
        return newObj;
      }
      return Object.create(proto);
    };
  }
});

// node_modules/joi/package.json
var require_package = __commonJS({
  "node_modules/joi/package.json"(exports, module2) {
    module2.exports = {
      _from: "joi",
      _id: "joi@17.5.0",
      _inBundle: false,
      _integrity: "sha512-R7hR50COp7StzLnDi4ywOXHrBrgNXuUUfJWIR5lPY5Bm/pOD3jZaTwpluUXVLRWcoWZxkrHBBJ5hLxgnlehbdw==",
      _location: "/joi",
      _phantomChildren: {},
      _requested: {
        type: "tag",
        registry: true,
        raw: "joi",
        name: "joi",
        escapedName: "joi",
        rawSpec: "",
        saveSpec: null,
        fetchSpec: "latest"
      },
      _requiredBy: [
        "#USER",
        "/"
      ],
      _resolved: "https://registry.npmjs.org/joi/-/joi-17.5.0.tgz",
      _shasum: "7e66d0004b5045d971cf416a55fb61d33ac6e011",
      _spec: "joi",
      _where: "C:\\Users\\HYCUBE PC 32\\Desktop\\shahidAbbas\\serverless\\first",
      browser: "dist/joi-browser.min.js",
      bugs: {
        url: "https://github.com/sideway/joi/issues"
      },
      bundleDependencies: false,
      dependencies: {
        "@hapi/hoek": "^9.0.0",
        "@hapi/topo": "^5.0.0",
        "@sideway/address": "^4.1.3",
        "@sideway/formula": "^3.0.0",
        "@sideway/pinpoint": "^2.0.0"
      },
      deprecated: false,
      description: "Object schema validation",
      devDependencies: {
        "@hapi/bourne": "2.x.x",
        "@hapi/code": "8.x.x",
        "@hapi/joi-legacy-test": "npm:@hapi/joi@15.x.x",
        "@hapi/lab": "24.x.x",
        typescript: "4.3.x"
      },
      files: [
        "lib/**/*",
        "dist/*"
      ],
      homepage: "https://github.com/sideway/joi#readme",
      keywords: [
        "schema",
        "validation"
      ],
      license: "BSD-3-Clause",
      main: "lib/index.js",
      name: "joi",
      repository: {
        type: "git",
        url: "git://github.com/sideway/joi.git"
      },
      scripts: {
        prepublishOnly: "cd browser && npm install && npm run build",
        test: "lab -t 100 -a @hapi/code -L -Y",
        "test-cov-html": "lab -r html -o coverage.html -a @hapi/code"
      },
      types: "lib/index.d.ts",
      version: "17.5.0"
    };
  }
});

// node_modules/joi/lib/schemas.js
var require_schemas = __commonJS({
  "node_modules/joi/lib/schemas.js"(exports) {
    "use strict";
    var Joi2 = require_lib4();
    var internals = {};
    internals.wrap = Joi2.string().min(1).max(2).allow(false);
    exports.preferences = Joi2.object({
      allowUnknown: Joi2.boolean(),
      abortEarly: Joi2.boolean(),
      artifacts: Joi2.boolean(),
      cache: Joi2.boolean(),
      context: Joi2.object(),
      convert: Joi2.boolean(),
      dateFormat: Joi2.valid("date", "iso", "string", "time", "utc"),
      debug: Joi2.boolean(),
      errors: {
        escapeHtml: Joi2.boolean(),
        label: Joi2.valid("path", "key", false),
        language: [
          Joi2.string(),
          Joi2.object().ref()
        ],
        render: Joi2.boolean(),
        stack: Joi2.boolean(),
        wrap: {
          label: internals.wrap,
          array: internals.wrap,
          string: internals.wrap
        }
      },
      externals: Joi2.boolean(),
      messages: Joi2.object(),
      noDefaults: Joi2.boolean(),
      nonEnumerables: Joi2.boolean(),
      presence: Joi2.valid("required", "optional", "forbidden"),
      skipFunctions: Joi2.boolean(),
      stripUnknown: Joi2.object({
        arrays: Joi2.boolean(),
        objects: Joi2.boolean()
      }).or("arrays", "objects").allow(true, false),
      warnings: Joi2.boolean()
    }).strict();
    internals.nameRx = /^[a-zA-Z0-9]\w*$/;
    internals.rule = Joi2.object({
      alias: Joi2.array().items(Joi2.string().pattern(internals.nameRx)).single(),
      args: Joi2.array().items(Joi2.string(), Joi2.object({
        name: Joi2.string().pattern(internals.nameRx).required(),
        ref: Joi2.boolean(),
        assert: Joi2.alternatives([
          Joi2.function(),
          Joi2.object().schema()
        ]).conditional("ref", { is: true, then: Joi2.required() }),
        normalize: Joi2.function(),
        message: Joi2.string().when("assert", { is: Joi2.function(), then: Joi2.required() })
      })),
      convert: Joi2.boolean(),
      manifest: Joi2.boolean(),
      method: Joi2.function().allow(false),
      multi: Joi2.boolean(),
      validate: Joi2.function()
    });
    exports.extension = Joi2.object({
      type: Joi2.alternatives([
        Joi2.string(),
        Joi2.object().regex()
      ]).required(),
      args: Joi2.function(),
      cast: Joi2.object().pattern(internals.nameRx, Joi2.object({
        from: Joi2.function().maxArity(1).required(),
        to: Joi2.function().minArity(1).maxArity(2).required()
      })),
      base: Joi2.object().schema().when("type", { is: Joi2.object().regex(), then: Joi2.forbidden() }),
      coerce: [
        Joi2.function().maxArity(3),
        Joi2.object({ method: Joi2.function().maxArity(3).required(), from: Joi2.array().items(Joi2.string()).single() })
      ],
      flags: Joi2.object().pattern(internals.nameRx, Joi2.object({
        setter: Joi2.string(),
        default: Joi2.any()
      })),
      manifest: {
        build: Joi2.function().arity(2)
      },
      messages: [Joi2.object(), Joi2.string()],
      modifiers: Joi2.object().pattern(internals.nameRx, Joi2.function().minArity(1).maxArity(2)),
      overrides: Joi2.object().pattern(internals.nameRx, Joi2.function()),
      prepare: Joi2.function().maxArity(3),
      rebuild: Joi2.function().arity(1),
      rules: Joi2.object().pattern(internals.nameRx, internals.rule),
      terms: Joi2.object().pattern(internals.nameRx, Joi2.object({
        init: Joi2.array().allow(null).required(),
        manifest: Joi2.object().pattern(/.+/, [
          Joi2.valid("schema", "single"),
          Joi2.object({
            mapped: Joi2.object({
              from: Joi2.string().required(),
              to: Joi2.string().required()
            }).required()
          })
        ])
      })),
      validate: Joi2.function().maxArity(3)
    }).strict();
    exports.extensions = Joi2.array().items(Joi2.object(), Joi2.function().arity(1)).strict();
    internals.desc = {
      buffer: Joi2.object({
        buffer: Joi2.string()
      }),
      func: Joi2.object({
        function: Joi2.function().required(),
        options: {
          literal: true
        }
      }),
      override: Joi2.object({
        override: true
      }),
      ref: Joi2.object({
        ref: Joi2.object({
          type: Joi2.valid("value", "global", "local"),
          path: Joi2.array().required(),
          separator: Joi2.string().length(1).allow(false),
          ancestor: Joi2.number().min(0).integer().allow("root"),
          map: Joi2.array().items(Joi2.array().length(2)).min(1),
          adjust: Joi2.function(),
          iterables: Joi2.boolean(),
          in: Joi2.boolean(),
          render: Joi2.boolean()
        }).required()
      }),
      regex: Joi2.object({
        regex: Joi2.string().min(3)
      }),
      special: Joi2.object({
        special: Joi2.valid("deep").required()
      }),
      template: Joi2.object({
        template: Joi2.string().required(),
        options: Joi2.object()
      }),
      value: Joi2.object({
        value: Joi2.alternatives([Joi2.object(), Joi2.array()]).required()
      })
    };
    internals.desc.entity = Joi2.alternatives([
      Joi2.array().items(Joi2.link("...")),
      Joi2.boolean(),
      Joi2.function(),
      Joi2.number(),
      Joi2.string(),
      internals.desc.buffer,
      internals.desc.func,
      internals.desc.ref,
      internals.desc.regex,
      internals.desc.special,
      internals.desc.template,
      internals.desc.value,
      Joi2.link("/")
    ]);
    internals.desc.values = Joi2.array().items(null, Joi2.boolean(), Joi2.function(), Joi2.number().allow(Infinity, -Infinity), Joi2.string().allow(""), Joi2.symbol(), internals.desc.buffer, internals.desc.func, internals.desc.override, internals.desc.ref, internals.desc.regex, internals.desc.template, internals.desc.value);
    internals.desc.messages = Joi2.object().pattern(/.+/, [
      Joi2.string(),
      internals.desc.template,
      Joi2.object().pattern(/.+/, [Joi2.string(), internals.desc.template])
    ]);
    exports.description = Joi2.object({
      type: Joi2.string().required(),
      flags: Joi2.object({
        cast: Joi2.string(),
        default: Joi2.any(),
        description: Joi2.string(),
        empty: Joi2.link("/"),
        failover: internals.desc.entity,
        id: Joi2.string(),
        label: Joi2.string(),
        only: true,
        presence: ["optional", "required", "forbidden"],
        result: ["raw", "strip"],
        strip: Joi2.boolean(),
        unit: Joi2.string()
      }).unknown(),
      preferences: {
        allowUnknown: Joi2.boolean(),
        abortEarly: Joi2.boolean(),
        artifacts: Joi2.boolean(),
        cache: Joi2.boolean(),
        convert: Joi2.boolean(),
        dateFormat: ["date", "iso", "string", "time", "utc"],
        errors: {
          escapeHtml: Joi2.boolean(),
          label: ["path", "key"],
          language: [
            Joi2.string(),
            internals.desc.ref
          ],
          wrap: {
            label: internals.wrap,
            array: internals.wrap
          }
        },
        externals: Joi2.boolean(),
        messages: internals.desc.messages,
        noDefaults: Joi2.boolean(),
        nonEnumerables: Joi2.boolean(),
        presence: ["required", "optional", "forbidden"],
        skipFunctions: Joi2.boolean(),
        stripUnknown: Joi2.object({
          arrays: Joi2.boolean(),
          objects: Joi2.boolean()
        }).or("arrays", "objects").allow(true, false),
        warnings: Joi2.boolean()
      },
      allow: internals.desc.values,
      invalid: internals.desc.values,
      rules: Joi2.array().min(1).items({
        name: Joi2.string().required(),
        args: Joi2.object().min(1),
        keep: Joi2.boolean(),
        message: [
          Joi2.string(),
          internals.desc.messages
        ],
        warn: Joi2.boolean()
      }),
      keys: Joi2.object().pattern(/.*/, Joi2.link("/")),
      link: internals.desc.ref
    }).pattern(/^[a-z]\w*$/, Joi2.any());
  }
});

// node_modules/@hapi/hoek/lib/escapeHtml.js
var require_escapeHtml = __commonJS({
  "node_modules/@hapi/hoek/lib/escapeHtml.js"(exports, module2) {
    "use strict";
    var internals = {};
    module2.exports = function(input) {
      if (!input) {
        return "";
      }
      let escaped = "";
      for (let i = 0; i < input.length; ++i) {
        const charCode = input.charCodeAt(i);
        if (internals.isSafe(charCode)) {
          escaped += input[i];
        } else {
          escaped += internals.escapeHtmlChar(charCode);
        }
      }
      return escaped;
    };
    internals.escapeHtmlChar = function(charCode) {
      const namedEscape = internals.namedHtml[charCode];
      if (typeof namedEscape !== "undefined") {
        return namedEscape;
      }
      if (charCode >= 256) {
        return "&#" + charCode + ";";
      }
      const hexValue = charCode.toString(16).padStart(2, "0");
      return `&#x${hexValue};`;
    };
    internals.isSafe = function(charCode) {
      return typeof internals.safeCharCodes[charCode] !== "undefined";
    };
    internals.namedHtml = {
      "38": "&amp;",
      "60": "&lt;",
      "62": "&gt;",
      "34": "&quot;",
      "160": "&nbsp;",
      "162": "&cent;",
      "163": "&pound;",
      "164": "&curren;",
      "169": "&copy;",
      "174": "&reg;"
    };
    internals.safeCharCodes = function() {
      const safe = {};
      for (let i = 32; i < 123; ++i) {
        if (i >= 97 || i >= 65 && i <= 90 || i >= 48 && i <= 57 || i === 32 || i === 46 || i === 44 || i === 45 || i === 58 || i === 95) {
          safe[i] = null;
        }
      }
      return safe;
    }();
  }
});

// node_modules/@sideway/formula/lib/index.js
var require_lib = __commonJS({
  "node_modules/@sideway/formula/lib/index.js"(exports) {
    "use strict";
    var internals = {
      operators: ["!", "^", "*", "/", "%", "+", "-", "<", "<=", ">", ">=", "==", "!=", "&&", "||", "??"],
      operatorCharacters: ["!", "^", "*", "/", "%", "+", "-", "<", "=", ">", "&", "|", "?"],
      operatorsOrder: [["^"], ["*", "/", "%"], ["+", "-"], ["<", "<=", ">", ">="], ["==", "!="], ["&&"], ["||", "??"]],
      operatorsPrefix: ["!", "n"],
      literals: {
        '"': '"',
        "`": "`",
        "'": "'",
        "[": "]"
      },
      numberRx: /^(?:[0-9]*\.?[0-9]*){1}$/,
      tokenRx: /^[\w\$\#\.\@\:\{\}]+$/,
      symbol: Symbol("formula"),
      settings: Symbol("settings")
    };
    exports.Parser = class {
      constructor(string2, options = {}) {
        if (!options[internals.settings] && options.constants) {
          for (const constant in options.constants) {
            const value = options.constants[constant];
            if (value !== null && !["boolean", "number", "string"].includes(typeof value)) {
              throw new Error(`Formula constant ${constant} contains invalid ${typeof value} value type`);
            }
          }
        }
        this.settings = options[internals.settings] ? options : Object.assign({ [internals.settings]: true, constants: {}, functions: {} }, options);
        this.single = null;
        this._parts = null;
        this._parse(string2);
      }
      _parse(string2) {
        let parts = [];
        let current = "";
        let parenthesis = 0;
        let literal = false;
        const flush = (inner) => {
          if (parenthesis) {
            throw new Error("Formula missing closing parenthesis");
          }
          const last = parts.length ? parts[parts.length - 1] : null;
          if (!literal && !current && !inner) {
            return;
          }
          if (last && last.type === "reference" && inner === ")") {
            last.type = "function";
            last.value = this._subFormula(current, last.value);
            current = "";
            return;
          }
          if (inner === ")") {
            const sub = new exports.Parser(current, this.settings);
            parts.push({ type: "segment", value: sub });
          } else if (literal) {
            if (literal === "]") {
              parts.push({ type: "reference", value: current });
              current = "";
              return;
            }
            parts.push({ type: "literal", value: current });
          } else if (internals.operatorCharacters.includes(current)) {
            if (last && last.type === "operator" && internals.operators.includes(last.value + current)) {
              last.value += current;
            } else {
              parts.push({ type: "operator", value: current });
            }
          } else if (current.match(internals.numberRx)) {
            parts.push({ type: "constant", value: parseFloat(current) });
          } else if (this.settings.constants[current] !== void 0) {
            parts.push({ type: "constant", value: this.settings.constants[current] });
          } else {
            if (!current.match(internals.tokenRx)) {
              throw new Error(`Formula contains invalid token: ${current}`);
            }
            parts.push({ type: "reference", value: current });
          }
          current = "";
        };
        for (const c of string2) {
          if (literal) {
            if (c === literal) {
              flush();
              literal = false;
            } else {
              current += c;
            }
          } else if (parenthesis) {
            if (c === "(") {
              current += c;
              ++parenthesis;
            } else if (c === ")") {
              --parenthesis;
              if (!parenthesis) {
                flush(c);
              } else {
                current += c;
              }
            } else {
              current += c;
            }
          } else if (c in internals.literals) {
            literal = internals.literals[c];
          } else if (c === "(") {
            flush();
            ++parenthesis;
          } else if (internals.operatorCharacters.includes(c)) {
            flush();
            current = c;
            flush();
          } else if (c !== " ") {
            current += c;
          } else {
            flush();
          }
        }
        flush();
        parts = parts.map((part, i) => {
          if (part.type !== "operator" || part.value !== "-" || i && parts[i - 1].type !== "operator") {
            return part;
          }
          return { type: "operator", value: "n" };
        });
        let operator = false;
        for (const part of parts) {
          if (part.type === "operator") {
            if (internals.operatorsPrefix.includes(part.value)) {
              continue;
            }
            if (!operator) {
              throw new Error("Formula contains an operator in invalid position");
            }
            if (!internals.operators.includes(part.value)) {
              throw new Error(`Formula contains an unknown operator ${part.value}`);
            }
          } else if (operator) {
            throw new Error("Formula missing expected operator");
          }
          operator = !operator;
        }
        if (!operator) {
          throw new Error("Formula contains invalid trailing operator");
        }
        if (parts.length === 1 && ["reference", "literal", "constant"].includes(parts[0].type)) {
          this.single = { type: parts[0].type === "reference" ? "reference" : "value", value: parts[0].value };
        }
        this._parts = parts.map((part) => {
          if (part.type === "operator") {
            return internals.operatorsPrefix.includes(part.value) ? part : part.value;
          }
          if (part.type !== "reference") {
            return part.value;
          }
          if (this.settings.tokenRx && !this.settings.tokenRx.test(part.value)) {
            throw new Error(`Formula contains invalid reference ${part.value}`);
          }
          if (this.settings.reference) {
            return this.settings.reference(part.value);
          }
          return internals.reference(part.value);
        });
      }
      _subFormula(string2, name) {
        const method = this.settings.functions[name];
        if (typeof method !== "function") {
          throw new Error(`Formula contains unknown function ${name}`);
        }
        let args = [];
        if (string2) {
          let current = "";
          let parenthesis = 0;
          let literal = false;
          const flush = () => {
            if (!current) {
              throw new Error(`Formula contains function ${name} with invalid arguments ${string2}`);
            }
            args.push(current);
            current = "";
          };
          for (let i = 0; i < string2.length; ++i) {
            const c = string2[i];
            if (literal) {
              current += c;
              if (c === literal) {
                literal = false;
              }
            } else if (c in internals.literals && !parenthesis) {
              current += c;
              literal = internals.literals[c];
            } else if (c === "," && !parenthesis) {
              flush();
            } else {
              current += c;
              if (c === "(") {
                ++parenthesis;
              } else if (c === ")") {
                --parenthesis;
              }
            }
          }
          flush();
        }
        args = args.map((arg) => new exports.Parser(arg, this.settings));
        return function(context) {
          const innerValues = [];
          for (const arg of args) {
            innerValues.push(arg.evaluate(context));
          }
          return method.call(context, ...innerValues);
        };
      }
      evaluate(context) {
        const parts = this._parts.slice();
        for (let i = parts.length - 2; i >= 0; --i) {
          const part = parts[i];
          if (part && part.type === "operator") {
            const current = parts[i + 1];
            parts.splice(i + 1, 1);
            const value = internals.evaluate(current, context);
            parts[i] = internals.single(part.value, value);
          }
        }
        internals.operatorsOrder.forEach((set) => {
          for (let i = 1; i < parts.length - 1; ) {
            if (set.includes(parts[i])) {
              const operator = parts[i];
              const left = internals.evaluate(parts[i - 1], context);
              const right = internals.evaluate(parts[i + 1], context);
              parts.splice(i, 2);
              const result = internals.calculate(operator, left, right);
              parts[i - 1] = result === 0 ? 0 : result;
            } else {
              i += 2;
            }
          }
        });
        return internals.evaluate(parts[0], context);
      }
    };
    exports.Parser.prototype[internals.symbol] = true;
    internals.reference = function(name) {
      return function(context) {
        return context && context[name] !== void 0 ? context[name] : null;
      };
    };
    internals.evaluate = function(part, context) {
      if (part === null) {
        return null;
      }
      if (typeof part === "function") {
        return part(context);
      }
      if (part[internals.symbol]) {
        return part.evaluate(context);
      }
      return part;
    };
    internals.single = function(operator, value) {
      if (operator === "!") {
        return value ? false : true;
      }
      const negative = -value;
      if (negative === 0) {
        return 0;
      }
      return negative;
    };
    internals.calculate = function(operator, left, right) {
      if (operator === "??") {
        return internals.exists(left) ? left : right;
      }
      if (typeof left === "string" || typeof right === "string") {
        if (operator === "+") {
          left = internals.exists(left) ? left : "";
          right = internals.exists(right) ? right : "";
          return left + right;
        }
      } else {
        switch (operator) {
          case "^":
            return Math.pow(left, right);
          case "*":
            return left * right;
          case "/":
            return left / right;
          case "%":
            return left % right;
          case "+":
            return left + right;
          case "-":
            return left - right;
        }
      }
      switch (operator) {
        case "<":
          return left < right;
        case "<=":
          return left <= right;
        case ">":
          return left > right;
        case ">=":
          return left >= right;
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        case "&&":
          return left && right;
        case "||":
          return left || right;
      }
      return null;
    };
    internals.exists = function(value) {
      return value !== null && value !== void 0;
    };
  }
});

// node_modules/joi/lib/annotate.js
var require_annotate = __commonJS({
  "node_modules/joi/lib/annotate.js"(exports) {
    "use strict";
    var Clone = require_clone();
    var Common = require_common();
    var internals = {
      annotations: Symbol("annotations")
    };
    exports.error = function(stripColorCodes) {
      if (!this._original || typeof this._original !== "object") {
        return this.details[0].message;
      }
      const redFgEscape = stripColorCodes ? "" : "[31m";
      const redBgEscape = stripColorCodes ? "" : "[41m";
      const endColor = stripColorCodes ? "" : "[0m";
      const obj = Clone(this._original);
      for (let i = this.details.length - 1; i >= 0; --i) {
        const pos = i + 1;
        const error = this.details[i];
        const path = error.path;
        let node = obj;
        for (let j = 0; ; ++j) {
          const seg = path[j];
          if (Common.isSchema(node)) {
            node = node.clone();
          }
          if (j + 1 < path.length && typeof node[seg] !== "string") {
            node = node[seg];
          } else {
            const refAnnotations = node[internals.annotations] || { errors: {}, missing: {} };
            node[internals.annotations] = refAnnotations;
            const cacheKey = seg || error.context.key;
            if (node[seg] !== void 0) {
              refAnnotations.errors[cacheKey] = refAnnotations.errors[cacheKey] || [];
              refAnnotations.errors[cacheKey].push(pos);
            } else {
              refAnnotations.missing[cacheKey] = pos;
            }
            break;
          }
        }
      }
      const replacers = {
        key: /_\$key\$_([, \d]+)_\$end\$_"/g,
        missing: /"_\$miss\$_([^|]+)\|(\d+)_\$end\$_": "__missing__"/g,
        arrayIndex: /\s*"_\$idx\$_([, \d]+)_\$end\$_",?\n(.*)/g,
        specials: /"\[(NaN|Symbol.*|-?Infinity|function.*|\(.*)]"/g
      };
      let message = internals.safeStringify(obj, 2).replace(replacers.key, ($0, $1) => `" ${redFgEscape}[${$1}]${endColor}`).replace(replacers.missing, ($0, $1, $2) => `${redBgEscape}"${$1}"${endColor}${redFgEscape} [${$2}]: -- missing --${endColor}`).replace(replacers.arrayIndex, ($0, $1, $2) => `
${$2} ${redFgEscape}[${$1}]${endColor}`).replace(replacers.specials, ($0, $1) => $1);
      message = `${message}
${redFgEscape}`;
      for (let i = 0; i < this.details.length; ++i) {
        const pos = i + 1;
        message = `${message}
[${pos}] ${this.details[i].message}`;
      }
      message = message + endColor;
      return message;
    };
    internals.safeStringify = function(obj, spaces) {
      return JSON.stringify(obj, internals.serializer(), spaces);
    };
    internals.serializer = function() {
      const keys = [];
      const stack = [];
      const cycleReplacer = (key, value) => {
        if (stack[0] === value) {
          return "[Circular ~]";
        }
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
      };
      return function(key, value) {
        if (stack.length > 0) {
          const thisPos = stack.indexOf(this);
          if (~thisPos) {
            stack.length = thisPos + 1;
            keys.length = thisPos + 1;
            keys[thisPos] = key;
          } else {
            stack.push(this);
            keys.push(key);
          }
          if (~stack.indexOf(value)) {
            value = cycleReplacer.call(this, key, value);
          }
        } else {
          stack.push(value);
        }
        if (value) {
          const annotations = value[internals.annotations];
          if (annotations) {
            if (Array.isArray(value)) {
              const annotated = [];
              for (let i = 0; i < value.length; ++i) {
                if (annotations.errors[i]) {
                  annotated.push(`_$idx$_${annotations.errors[i].sort().join(", ")}_$end$_`);
                }
                annotated.push(value[i]);
              }
              value = annotated;
            } else {
              for (const errorKey in annotations.errors) {
                value[`${errorKey}_$key$_${annotations.errors[errorKey].sort().join(", ")}_$end$_`] = value[errorKey];
                value[errorKey] = void 0;
              }
              for (const missingKey in annotations.missing) {
                value[`_$miss$_${missingKey}|${annotations.missing[missingKey]}_$end$_`] = "__missing__";
              }
            }
            return value;
          }
        }
        if (value === Infinity || value === -Infinity || Number.isNaN(value) || typeof value === "function" || typeof value === "symbol") {
          return "[" + value.toString() + "]";
        }
        return value;
      };
    };
  }
});

// node_modules/joi/lib/errors.js
var require_errors = __commonJS({
  "node_modules/joi/lib/errors.js"(exports) {
    "use strict";
    var Annotate = require_annotate();
    var Common = require_common();
    var Template = require_template();
    exports.Report = class {
      constructor(code, value, local, flags, messages, state, prefs) {
        this.code = code;
        this.flags = flags;
        this.messages = messages;
        this.path = state.path;
        this.prefs = prefs;
        this.state = state;
        this.value = value;
        this.message = null;
        this.template = null;
        this.local = local || {};
        this.local.label = exports.label(this.flags, this.state, this.prefs, this.messages);
        if (this.value !== void 0 && !this.local.hasOwnProperty("value")) {
          this.local.value = this.value;
        }
        if (this.path.length) {
          const key = this.path[this.path.length - 1];
          if (typeof key !== "object") {
            this.local.key = key;
          }
        }
      }
      _setTemplate(template) {
        this.template = template;
        if (!this.flags.label && this.path.length === 0) {
          const localized = this._template(this.template, "root");
          if (localized) {
            this.local.label = localized;
          }
        }
      }
      toString() {
        if (this.message) {
          return this.message;
        }
        const code = this.code;
        if (!this.prefs.errors.render) {
          return this.code;
        }
        const template = this._template(this.template) || this._template(this.prefs.messages) || this._template(this.messages);
        if (template === void 0) {
          return `Error code "${code}" is not defined, your custom type is missing the correct messages definition`;
        }
        this.message = template.render(this.value, this.state, this.prefs, this.local, { errors: this.prefs.errors, messages: [this.prefs.messages, this.messages] });
        if (!this.prefs.errors.label) {
          this.message = this.message.replace(/^"" /, "").trim();
        }
        return this.message;
      }
      _template(messages, code) {
        return exports.template(this.value, messages, code || this.code, this.state, this.prefs);
      }
    };
    exports.path = function(path) {
      let label = "";
      for (const segment of path) {
        if (typeof segment === "object") {
          continue;
        }
        if (typeof segment === "string") {
          if (label) {
            label += ".";
          }
          label += segment;
        } else {
          label += `[${segment}]`;
        }
      }
      return label;
    };
    exports.template = function(value, messages, code, state, prefs) {
      if (!messages) {
        return;
      }
      if (Template.isTemplate(messages)) {
        return code !== "root" ? messages : null;
      }
      let lang = prefs.errors.language;
      if (Common.isResolvable(lang)) {
        lang = lang.resolve(value, state, prefs);
      }
      if (lang && messages[lang]) {
        if (messages[lang][code] !== void 0) {
          return messages[lang][code];
        }
        if (messages[lang]["*"] !== void 0) {
          return messages[lang]["*"];
        }
      }
      if (!messages[code]) {
        return messages["*"];
      }
      return messages[code];
    };
    exports.label = function(flags, state, prefs, messages) {
      if (flags.label) {
        return flags.label;
      }
      if (!prefs.errors.label) {
        return "";
      }
      let path = state.path;
      if (prefs.errors.label === "key" && state.path.length > 1) {
        path = state.path.slice(-1);
      }
      const normalized = exports.path(path);
      if (normalized) {
        return normalized;
      }
      return exports.template(null, prefs.messages, "root", state, prefs) || messages && exports.template(null, messages, "root", state, prefs) || "value";
    };
    exports.process = function(errors, original, prefs) {
      if (!errors) {
        return null;
      }
      const { override, message, details } = exports.details(errors);
      if (override) {
        return override;
      }
      if (prefs.errors.stack) {
        return new exports.ValidationError(message, details, original);
      }
      const limit = Error.stackTraceLimit;
      Error.stackTraceLimit = 0;
      const validationError = new exports.ValidationError(message, details, original);
      Error.stackTraceLimit = limit;
      return validationError;
    };
    exports.details = function(errors, options = {}) {
      let messages = [];
      const details = [];
      for (const item of errors) {
        if (item instanceof Error) {
          if (options.override !== false) {
            return { override: item };
          }
          const message2 = item.toString();
          messages.push(message2);
          details.push({
            message: message2,
            type: "override",
            context: { error: item }
          });
          continue;
        }
        const message = item.toString();
        messages.push(message);
        details.push({
          message,
          path: item.path.filter((v) => typeof v !== "object"),
          type: item.code,
          context: item.local
        });
      }
      if (messages.length > 1) {
        messages = [...new Set(messages)];
      }
      return { message: messages.join(". "), details };
    };
    exports.ValidationError = class extends Error {
      constructor(message, details, original) {
        super(message);
        this._original = original;
        this.details = details;
      }
      static isError(err) {
        return err instanceof exports.ValidationError;
      }
    };
    exports.ValidationError.prototype.isJoi = true;
    exports.ValidationError.prototype.name = "ValidationError";
    exports.ValidationError.prototype.annotate = Annotate.error;
  }
});

// node_modules/joi/lib/ref.js
var require_ref = __commonJS({
  "node_modules/joi/lib/ref.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Reach = require_reach();
    var Common = require_common();
    var Template;
    var internals = {
      symbol: Symbol("ref"),
      defaults: {
        adjust: null,
        in: false,
        iterables: null,
        map: null,
        separator: ".",
        type: "value"
      }
    };
    exports.create = function(key, options = {}) {
      Assert(typeof key === "string", "Invalid reference key:", key);
      Common.assertOptions(options, ["adjust", "ancestor", "in", "iterables", "map", "prefix", "render", "separator"]);
      Assert(!options.prefix || typeof options.prefix === "object", "options.prefix must be of type object");
      const ref = Object.assign({}, internals.defaults, options);
      delete ref.prefix;
      const separator = ref.separator;
      const context = internals.context(key, separator, options.prefix);
      ref.type = context.type;
      key = context.key;
      if (ref.type === "value") {
        if (context.root) {
          Assert(!separator || key[0] !== separator, "Cannot specify relative path with root prefix");
          ref.ancestor = "root";
          if (!key) {
            key = null;
          }
        }
        if (separator && separator === key) {
          key = null;
          ref.ancestor = 0;
        } else {
          if (ref.ancestor !== void 0) {
            Assert(!separator || !key || key[0] !== separator, "Cannot combine prefix with ancestor option");
          } else {
            const [ancestor, slice] = internals.ancestor(key, separator);
            if (slice) {
              key = key.slice(slice);
              if (key === "") {
                key = null;
              }
            }
            ref.ancestor = ancestor;
          }
        }
      }
      ref.path = separator ? key === null ? [] : key.split(separator) : [key];
      return new internals.Ref(ref);
    };
    exports.in = function(key, options = {}) {
      return exports.create(key, __spreadProps(__spreadValues({}, options), { in: true }));
    };
    exports.isRef = function(ref) {
      return ref ? !!ref[Common.symbols.ref] : false;
    };
    internals.Ref = class {
      constructor(options) {
        Assert(typeof options === "object", "Invalid reference construction");
        Common.assertOptions(options, [
          "adjust",
          "ancestor",
          "in",
          "iterables",
          "map",
          "path",
          "render",
          "separator",
          "type",
          "depth",
          "key",
          "root",
          "display"
        ]);
        Assert([false, void 0].includes(options.separator) || typeof options.separator === "string" && options.separator.length === 1, "Invalid separator");
        Assert(!options.adjust || typeof options.adjust === "function", "options.adjust must be a function");
        Assert(!options.map || Array.isArray(options.map), "options.map must be an array");
        Assert(!options.map || !options.adjust, "Cannot set both map and adjust options");
        Object.assign(this, internals.defaults, options);
        Assert(this.type === "value" || this.ancestor === void 0, "Non-value references cannot reference ancestors");
        if (Array.isArray(this.map)) {
          this.map = new Map(this.map);
        }
        this.depth = this.path.length;
        this.key = this.path.length ? this.path.join(this.separator) : null;
        this.root = this.path[0];
        this.updateDisplay();
      }
      resolve(value, state, prefs, local, options = {}) {
        Assert(!this.in || options.in, "Invalid in() reference usage");
        if (this.type === "global") {
          return this._resolve(prefs.context, state, options);
        }
        if (this.type === "local") {
          return this._resolve(local, state, options);
        }
        if (!this.ancestor) {
          return this._resolve(value, state, options);
        }
        if (this.ancestor === "root") {
          return this._resolve(state.ancestors[state.ancestors.length - 1], state, options);
        }
        Assert(this.ancestor <= state.ancestors.length, "Invalid reference exceeds the schema root:", this.display);
        return this._resolve(state.ancestors[this.ancestor - 1], state, options);
      }
      _resolve(target, state, options) {
        let resolved;
        if (this.type === "value" && state.mainstay.shadow && options.shadow !== false) {
          resolved = state.mainstay.shadow.get(this.absolute(state));
        }
        if (resolved === void 0) {
          resolved = Reach(target, this.path, { iterables: this.iterables, functions: true });
        }
        if (this.adjust) {
          resolved = this.adjust(resolved);
        }
        if (this.map) {
          const mapped = this.map.get(resolved);
          if (mapped !== void 0) {
            resolved = mapped;
          }
        }
        if (state.mainstay) {
          state.mainstay.tracer.resolve(state, this, resolved);
        }
        return resolved;
      }
      toString() {
        return this.display;
      }
      absolute(state) {
        return [...state.path.slice(0, -this.ancestor), ...this.path];
      }
      clone() {
        return new internals.Ref(this);
      }
      describe() {
        const ref = { path: this.path };
        if (this.type !== "value") {
          ref.type = this.type;
        }
        if (this.separator !== ".") {
          ref.separator = this.separator;
        }
        if (this.type === "value" && this.ancestor !== 1) {
          ref.ancestor = this.ancestor;
        }
        if (this.map) {
          ref.map = [...this.map];
        }
        for (const key of ["adjust", "iterables", "render"]) {
          if (this[key] !== null && this[key] !== void 0) {
            ref[key] = this[key];
          }
        }
        if (this.in !== false) {
          ref.in = true;
        }
        return { ref };
      }
      updateDisplay() {
        const key = this.key !== null ? this.key : "";
        if (this.type !== "value") {
          this.display = `ref:${this.type}:${key}`;
          return;
        }
        if (!this.separator) {
          this.display = `ref:${key}`;
          return;
        }
        if (!this.ancestor) {
          this.display = `ref:${this.separator}${key}`;
          return;
        }
        if (this.ancestor === "root") {
          this.display = `ref:root:${key}`;
          return;
        }
        if (this.ancestor === 1) {
          this.display = `ref:${key || ".."}`;
          return;
        }
        const lead = new Array(this.ancestor + 1).fill(this.separator).join("");
        this.display = `ref:${lead}${key || ""}`;
      }
    };
    internals.Ref.prototype[Common.symbols.ref] = true;
    exports.build = function(desc) {
      desc = Object.assign({}, internals.defaults, desc);
      if (desc.type === "value" && desc.ancestor === void 0) {
        desc.ancestor = 1;
      }
      return new internals.Ref(desc);
    };
    internals.context = function(key, separator, prefix = {}) {
      key = key.trim();
      if (prefix) {
        const globalp = prefix.global === void 0 ? "$" : prefix.global;
        if (globalp !== separator && key.startsWith(globalp)) {
          return { key: key.slice(globalp.length), type: "global" };
        }
        const local = prefix.local === void 0 ? "#" : prefix.local;
        if (local !== separator && key.startsWith(local)) {
          return { key: key.slice(local.length), type: "local" };
        }
        const root = prefix.root === void 0 ? "/" : prefix.root;
        if (root !== separator && key.startsWith(root)) {
          return { key: key.slice(root.length), type: "value", root: true };
        }
      }
      return { key, type: "value" };
    };
    internals.ancestor = function(key, separator) {
      if (!separator) {
        return [1, 0];
      }
      if (key[0] !== separator) {
        return [1, 0];
      }
      if (key[1] !== separator) {
        return [0, 1];
      }
      let i = 2;
      while (key[i] === separator) {
        ++i;
      }
      return [i - 1, i];
    };
    exports.toSibling = 0;
    exports.toParent = 1;
    exports.Manager = class {
      constructor() {
        this.refs = [];
      }
      register(source, target) {
        if (!source) {
          return;
        }
        target = target === void 0 ? exports.toParent : target;
        if (Array.isArray(source)) {
          for (const ref of source) {
            this.register(ref, target);
          }
          return;
        }
        if (Common.isSchema(source)) {
          for (const item of source._refs.refs) {
            if (item.ancestor - target >= 0) {
              this.refs.push({ ancestor: item.ancestor - target, root: item.root });
            }
          }
          return;
        }
        if (exports.isRef(source) && source.type === "value" && source.ancestor - target >= 0) {
          this.refs.push({ ancestor: source.ancestor - target, root: source.root });
        }
        Template = Template || require_template();
        if (Template.isTemplate(source)) {
          this.register(source.refs(), target);
        }
      }
      get length() {
        return this.refs.length;
      }
      clone() {
        const copy = new exports.Manager();
        copy.refs = Clone(this.refs);
        return copy;
      }
      reset() {
        this.refs = [];
      }
      roots() {
        return this.refs.filter((ref) => !ref.ancestor).map((ref) => ref.root);
      }
    };
  }
});

// node_modules/joi/lib/template.js
var require_template = __commonJS({
  "node_modules/joi/lib/template.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var EscapeHtml = require_escapeHtml();
    var Formula = require_lib();
    var Common = require_common();
    var Errors = require_errors();
    var Ref = require_ref();
    var internals = {
      symbol: Symbol("template"),
      opens: new Array(1e3).join("\0"),
      closes: new Array(1e3).join(""),
      dateFormat: {
        date: Date.prototype.toDateString,
        iso: Date.prototype.toISOString,
        string: Date.prototype.toString,
        time: Date.prototype.toTimeString,
        utc: Date.prototype.toUTCString
      }
    };
    module2.exports = exports = internals.Template = class {
      constructor(source, options) {
        Assert(typeof source === "string", "Template source must be a string");
        Assert(!source.includes("\0") && !source.includes(""), "Template source cannot contain reserved control characters");
        this.source = source;
        this.rendered = source;
        this._template = null;
        this._settings = Clone(options);
        this._parse();
      }
      _parse() {
        if (!this.source.includes("{")) {
          return;
        }
        const encoded = internals.encode(this.source);
        const parts = internals.split(encoded);
        let refs = false;
        const processed = [];
        const head = parts.shift();
        if (head) {
          processed.push(head);
        }
        for (const part of parts) {
          const raw = part[0] !== "{";
          const ender = raw ? "}" : "}}";
          const end = part.indexOf(ender);
          if (end === -1 || part[1] === "{") {
            processed.push(`{${internals.decode(part)}`);
            continue;
          }
          let variable = part.slice(raw ? 0 : 1, end);
          const wrapped = variable[0] === ":";
          if (wrapped) {
            variable = variable.slice(1);
          }
          const dynamic = this._ref(internals.decode(variable), { raw, wrapped });
          processed.push(dynamic);
          if (typeof dynamic !== "string") {
            refs = true;
          }
          const rest = part.slice(end + ender.length);
          if (rest) {
            processed.push(internals.decode(rest));
          }
        }
        if (!refs) {
          this.rendered = processed.join("");
          return;
        }
        this._template = processed;
      }
      static date(date, prefs) {
        return internals.dateFormat[prefs.dateFormat].call(date);
      }
      describe(options = {}) {
        if (!this._settings && options.compact) {
          return this.source;
        }
        const desc = { template: this.source };
        if (this._settings) {
          desc.options = this._settings;
        }
        return desc;
      }
      static build(desc) {
        return new internals.Template(desc.template, desc.options);
      }
      isDynamic() {
        return !!this._template;
      }
      static isTemplate(template) {
        return template ? !!template[Common.symbols.template] : false;
      }
      refs() {
        if (!this._template) {
          return;
        }
        const refs = [];
        for (const part of this._template) {
          if (typeof part !== "string") {
            refs.push(...part.refs);
          }
        }
        return refs;
      }
      resolve(value, state, prefs, local) {
        if (this._template && this._template.length === 1) {
          return this._part(this._template[0], value, state, prefs, local, {});
        }
        return this.render(value, state, prefs, local);
      }
      _part(part, ...args) {
        if (part.ref) {
          return part.ref.resolve(...args);
        }
        return part.formula.evaluate(args);
      }
      render(value, state, prefs, local, options = {}) {
        if (!this.isDynamic()) {
          return this.rendered;
        }
        const parts = [];
        for (const part of this._template) {
          if (typeof part === "string") {
            parts.push(part);
          } else {
            const rendered = this._part(part, value, state, prefs, local, options);
            const string2 = internals.stringify(rendered, value, state, prefs, local, options);
            if (string2 !== void 0) {
              const result = part.raw || (options.errors && options.errors.escapeHtml) === false ? string2 : EscapeHtml(string2);
              parts.push(internals.wrap(result, part.wrapped && prefs.errors.wrap.label));
            }
          }
        }
        return parts.join("");
      }
      _ref(content, { raw, wrapped }) {
        const refs = [];
        const reference = (variable) => {
          const ref = Ref.create(variable, this._settings);
          refs.push(ref);
          return (context) => ref.resolve(...context);
        };
        try {
          var formula = new Formula.Parser(content, { reference, functions: internals.functions, constants: internals.constants });
        } catch (err) {
          err.message = `Invalid template variable "${content}" fails due to: ${err.message}`;
          throw err;
        }
        if (formula.single) {
          if (formula.single.type === "reference") {
            const ref = refs[0];
            return { ref, raw, refs, wrapped: wrapped || ref.type === "local" && ref.key === "label" };
          }
          return internals.stringify(formula.single.value);
        }
        return { formula, raw, refs };
      }
      toString() {
        return this.source;
      }
    };
    internals.Template.prototype[Common.symbols.template] = true;
    internals.Template.prototype.isImmutable = true;
    internals.encode = function(string2) {
      return string2.replace(/\\(\{+)/g, ($0, $1) => {
        return internals.opens.slice(0, $1.length);
      }).replace(/\\(\}+)/g, ($0, $1) => {
        return internals.closes.slice(0, $1.length);
      });
    };
    internals.decode = function(string2) {
      return string2.replace(/\u0000/g, "{").replace(/\u0001/g, "}");
    };
    internals.split = function(string2) {
      const parts = [];
      let current = "";
      for (let i = 0; i < string2.length; ++i) {
        const char = string2[i];
        if (char === "{") {
          let next = "";
          while (i + 1 < string2.length && string2[i + 1] === "{") {
            next += "{";
            ++i;
          }
          parts.push(current);
          current = next;
        } else {
          current += char;
        }
      }
      parts.push(current);
      return parts;
    };
    internals.wrap = function(value, ends) {
      if (!ends) {
        return value;
      }
      if (ends.length === 1) {
        return `${ends}${value}${ends}`;
      }
      return `${ends[0]}${value}${ends[1]}`;
    };
    internals.stringify = function(value, original, state, prefs, local, options = {}) {
      const type = typeof value;
      const wrap = prefs && prefs.errors && prefs.errors.wrap || {};
      let skipWrap = false;
      if (Ref.isRef(value) && value.render) {
        skipWrap = value.in;
        value = value.resolve(original, state, prefs, local, __spreadValues({ in: value.in }, options));
      }
      if (value === null) {
        return "null";
      }
      if (type === "string") {
        return internals.wrap(value, options.arrayItems && wrap.string);
      }
      if (type === "number" || type === "function" || type === "symbol") {
        return value.toString();
      }
      if (type !== "object") {
        return JSON.stringify(value);
      }
      if (value instanceof Date) {
        return internals.Template.date(value, prefs);
      }
      if (value instanceof Map) {
        const pairs = [];
        for (const [key, sym] of value.entries()) {
          pairs.push(`${key.toString()} -> ${sym.toString()}`);
        }
        value = pairs;
      }
      if (!Array.isArray(value)) {
        return value.toString();
      }
      const values = [];
      for (const item of value) {
        values.push(internals.stringify(item, original, state, prefs, local, __spreadValues({ arrayItems: true }, options)));
      }
      return internals.wrap(values.join(", "), !skipWrap && wrap.array);
    };
    internals.constants = {
      true: true,
      false: false,
      null: null,
      second: 1e3,
      minute: 60 * 1e3,
      hour: 60 * 60 * 1e3,
      day: 24 * 60 * 60 * 1e3
    };
    internals.functions = {
      if(condition, then, otherwise) {
        return condition ? then : otherwise;
      },
      msg(code) {
        const [value, state, prefs, local, options] = this;
        const messages = options.messages;
        if (!messages) {
          return "";
        }
        const template = Errors.template(value, messages[0], code, state, prefs) || Errors.template(value, messages[1], code, state, prefs);
        if (!template) {
          return "";
        }
        return template.render(value, state, prefs, local, options);
      },
      number(value) {
        if (typeof value === "number") {
          return value;
        }
        if (typeof value === "string") {
          return parseFloat(value);
        }
        if (typeof value === "boolean") {
          return value ? 1 : 0;
        }
        if (value instanceof Date) {
          return value.getTime();
        }
        return null;
      }
    };
  }
});

// node_modules/joi/lib/messages.js
var require_messages = __commonJS({
  "node_modules/joi/lib/messages.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Template = require_template();
    exports.compile = function(messages, target) {
      if (typeof messages === "string") {
        Assert(!target, "Cannot set single message string");
        return new Template(messages);
      }
      if (Template.isTemplate(messages)) {
        Assert(!target, "Cannot set single message template");
        return messages;
      }
      Assert(typeof messages === "object" && !Array.isArray(messages), "Invalid message options");
      target = target ? Clone(target) : {};
      for (let code in messages) {
        const message = messages[code];
        if (code === "root" || Template.isTemplate(message)) {
          target[code] = message;
          continue;
        }
        if (typeof message === "string") {
          target[code] = new Template(message);
          continue;
        }
        Assert(typeof message === "object" && !Array.isArray(message), "Invalid message for", code);
        const language = code;
        target[language] = target[language] || {};
        for (code in message) {
          const localized = message[code];
          if (code === "root" || Template.isTemplate(localized)) {
            target[language][code] = localized;
            continue;
          }
          Assert(typeof localized === "string", "Invalid message for", code, "in", language);
          target[language][code] = new Template(localized);
        }
      }
      return target;
    };
    exports.decompile = function(messages) {
      const target = {};
      for (let code in messages) {
        const message = messages[code];
        if (code === "root") {
          target.root = message;
          continue;
        }
        if (Template.isTemplate(message)) {
          target[code] = message.describe({ compact: true });
          continue;
        }
        const language = code;
        target[language] = {};
        for (code in message) {
          const localized = message[code];
          if (code === "root") {
            target[language].root = localized;
            continue;
          }
          target[language][code] = localized.describe({ compact: true });
        }
      }
      return target;
    };
    exports.merge = function(base, extended) {
      if (!base) {
        return exports.compile(extended);
      }
      if (!extended) {
        return base;
      }
      if (typeof extended === "string") {
        return new Template(extended);
      }
      if (Template.isTemplate(extended)) {
        return extended;
      }
      const target = Clone(base);
      for (let code in extended) {
        const message = extended[code];
        if (code === "root" || Template.isTemplate(message)) {
          target[code] = message;
          continue;
        }
        if (typeof message === "string") {
          target[code] = new Template(message);
          continue;
        }
        Assert(typeof message === "object" && !Array.isArray(message), "Invalid message for", code);
        const language = code;
        target[language] = target[language] || {};
        for (code in message) {
          const localized = message[code];
          if (code === "root" || Template.isTemplate(localized)) {
            target[language][code] = localized;
            continue;
          }
          Assert(typeof localized === "string", "Invalid message for", code, "in", language);
          target[language][code] = new Template(localized);
        }
      }
      return target;
    };
  }
});

// node_modules/joi/lib/common.js
var require_common = __commonJS({
  "node_modules/joi/lib/common.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var AssertError = require_error();
    var Pkg = require_package();
    var Messages;
    var Schemas;
    var internals = {
      isoDate: /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/
    };
    exports.version = Pkg.version;
    exports.defaults = {
      abortEarly: true,
      allowUnknown: false,
      artifacts: false,
      cache: true,
      context: null,
      convert: true,
      dateFormat: "iso",
      errors: {
        escapeHtml: false,
        label: "path",
        language: null,
        render: true,
        stack: false,
        wrap: {
          label: '"',
          array: "[]"
        }
      },
      externals: true,
      messages: {},
      nonEnumerables: false,
      noDefaults: false,
      presence: "optional",
      skipFunctions: false,
      stripUnknown: false,
      warnings: false
    };
    exports.symbols = {
      any: Symbol.for("@hapi/joi/schema"),
      arraySingle: Symbol("arraySingle"),
      deepDefault: Symbol("deepDefault"),
      errors: Symbol("errors"),
      literal: Symbol("literal"),
      override: Symbol("override"),
      parent: Symbol("parent"),
      prefs: Symbol("prefs"),
      ref: Symbol("ref"),
      template: Symbol("template"),
      values: Symbol("values")
    };
    exports.assertOptions = function(options, keys, name = "Options") {
      Assert(options && typeof options === "object" && !Array.isArray(options), "Options must be of type object");
      const unknownKeys = Object.keys(options).filter((k) => !keys.includes(k));
      Assert(unknownKeys.length === 0, `${name} contain unknown keys: ${unknownKeys}`);
    };
    exports.checkPreferences = function(prefs) {
      Schemas = Schemas || require_schemas();
      const result = Schemas.preferences.validate(prefs);
      if (result.error) {
        throw new AssertError([result.error.details[0].message]);
      }
    };
    exports.compare = function(a, b, operator) {
      switch (operator) {
        case "=":
          return a === b;
        case ">":
          return a > b;
        case "<":
          return a < b;
        case ">=":
          return a >= b;
        case "<=":
          return a <= b;
      }
    };
    exports.default = function(value, defaultValue) {
      return value === void 0 ? defaultValue : value;
    };
    exports.isIsoDate = function(date) {
      return internals.isoDate.test(date);
    };
    exports.isNumber = function(value) {
      return typeof value === "number" && !isNaN(value);
    };
    exports.isResolvable = function(obj) {
      if (!obj) {
        return false;
      }
      return obj[exports.symbols.ref] || obj[exports.symbols.template];
    };
    exports.isSchema = function(schema, options = {}) {
      const any = schema && schema[exports.symbols.any];
      if (!any) {
        return false;
      }
      Assert(options.legacy || any.version === exports.version, "Cannot mix different versions of joi schemas");
      return true;
    };
    exports.isValues = function(obj) {
      return obj[exports.symbols.values];
    };
    exports.limit = function(value) {
      return Number.isSafeInteger(value) && value >= 0;
    };
    exports.preferences = function(target, source) {
      Messages = Messages || require_messages();
      target = target || {};
      source = source || {};
      const merged = Object.assign({}, target, source);
      if (source.errors && target.errors) {
        merged.errors = Object.assign({}, target.errors, source.errors);
        merged.errors.wrap = Object.assign({}, target.errors.wrap, source.errors.wrap);
      }
      if (source.messages) {
        merged.messages = Messages.compile(source.messages, target.messages);
      }
      delete merged[exports.symbols.prefs];
      return merged;
    };
    exports.tryWithPath = function(fn, key, options = {}) {
      try {
        return fn();
      } catch (err) {
        if (err.path !== void 0) {
          err.path = key + "." + err.path;
        } else {
          err.path = key;
        }
        if (options.append) {
          err.message = `${err.message} (${err.path})`;
        }
        throw err;
      }
    };
    exports.validateArg = function(value, label, { assert, message }) {
      if (exports.isSchema(assert)) {
        const result = assert.validate(value);
        if (!result.error) {
          return;
        }
        return result.error.message;
      } else if (!assert(value)) {
        return label ? `${label} ${message}` : message;
      }
    };
    exports.verifyFlat = function(args, method) {
      for (const arg of args) {
        Assert(!Array.isArray(arg), "Method no longer accepts array arguments:", method);
      }
    };
  }
});

// node_modules/joi/lib/cache.js
var require_cache = __commonJS({
  "node_modules/joi/lib/cache.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Common = require_common();
    var internals = {
      max: 1e3,
      supported: /* @__PURE__ */ new Set(["undefined", "boolean", "number", "string"])
    };
    exports.provider = {
      provision(options) {
        return new internals.Cache(options);
      }
    };
    internals.Cache = class {
      constructor(options = {}) {
        Common.assertOptions(options, ["max"]);
        Assert(options.max === void 0 || options.max && options.max > 0 && isFinite(options.max), "Invalid max cache size");
        this._max = options.max || internals.max;
        this._map = /* @__PURE__ */ new Map();
        this._list = new internals.List();
      }
      get length() {
        return this._map.size;
      }
      set(key, value) {
        if (key !== null && !internals.supported.has(typeof key)) {
          return;
        }
        let node = this._map.get(key);
        if (node) {
          node.value = value;
          this._list.first(node);
          return;
        }
        node = this._list.unshift({ key, value });
        this._map.set(key, node);
        this._compact();
      }
      get(key) {
        const node = this._map.get(key);
        if (node) {
          this._list.first(node);
          return Clone(node.value);
        }
      }
      _compact() {
        if (this._map.size > this._max) {
          const node = this._list.pop();
          this._map.delete(node.key);
        }
      }
    };
    internals.List = class {
      constructor() {
        this.tail = null;
        this.head = null;
      }
      unshift(node) {
        node.next = null;
        node.prev = this.head;
        if (this.head) {
          this.head.next = node;
        }
        this.head = node;
        if (!this.tail) {
          this.tail = node;
        }
        return node;
      }
      first(node) {
        if (node === this.head) {
          return;
        }
        this._remove(node);
        this.unshift(node);
      }
      pop() {
        return this._remove(this.tail);
      }
      _remove(node) {
        const { next, prev } = node;
        next.prev = prev;
        if (prev) {
          prev.next = next;
        }
        if (node === this.tail) {
          this.tail = next;
        }
        node.prev = null;
        node.next = null;
        return node;
      }
    };
  }
});

// node_modules/joi/lib/compile.js
var require_compile = __commonJS({
  "node_modules/joi/lib/compile.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Common = require_common();
    var Ref = require_ref();
    var internals = {};
    exports.schema = function(Joi2, config, options = {}) {
      Common.assertOptions(options, ["appendPath", "override"]);
      try {
        return internals.schema(Joi2, config, options);
      } catch (err) {
        if (options.appendPath && err.path !== void 0) {
          err.message = `${err.message} (${err.path})`;
        }
        throw err;
      }
    };
    internals.schema = function(Joi2, config, options) {
      Assert(config !== void 0, "Invalid undefined schema");
      if (Array.isArray(config)) {
        Assert(config.length, "Invalid empty array schema");
        if (config.length === 1) {
          config = config[0];
        }
      }
      const valid = (base, ...values) => {
        if (options.override !== false) {
          return base.valid(Joi2.override, ...values);
        }
        return base.valid(...values);
      };
      if (internals.simple(config)) {
        return valid(Joi2, config);
      }
      if (typeof config === "function") {
        return Joi2.custom(config);
      }
      Assert(typeof config === "object", "Invalid schema content:", typeof config);
      if (Common.isResolvable(config)) {
        return valid(Joi2, config);
      }
      if (Common.isSchema(config)) {
        return config;
      }
      if (Array.isArray(config)) {
        for (const item of config) {
          if (!internals.simple(item)) {
            return Joi2.alternatives().try(...config);
          }
        }
        return valid(Joi2, ...config);
      }
      if (config instanceof RegExp) {
        return Joi2.string().regex(config);
      }
      if (config instanceof Date) {
        return valid(Joi2.date(), config);
      }
      Assert(Object.getPrototypeOf(config) === Object.getPrototypeOf({}), "Schema can only contain plain objects");
      return Joi2.object().keys(config);
    };
    exports.ref = function(id, options) {
      return Ref.isRef(id) ? id : Ref.create(id, options);
    };
    exports.compile = function(root, schema, options = {}) {
      Common.assertOptions(options, ["legacy"]);
      const any = schema && schema[Common.symbols.any];
      if (any) {
        Assert(options.legacy || any.version === Common.version, "Cannot mix different versions of joi schemas:", any.version, Common.version);
        return schema;
      }
      if (typeof schema !== "object" || !options.legacy) {
        return exports.schema(root, schema, { appendPath: true });
      }
      const compiler = internals.walk(schema);
      if (!compiler) {
        return exports.schema(root, schema, { appendPath: true });
      }
      return compiler.compile(compiler.root, schema);
    };
    internals.walk = function(schema) {
      if (typeof schema !== "object") {
        return null;
      }
      if (Array.isArray(schema)) {
        for (const item of schema) {
          const compiler = internals.walk(item);
          if (compiler) {
            return compiler;
          }
        }
        return null;
      }
      const any = schema[Common.symbols.any];
      if (any) {
        return { root: schema[any.root], compile: any.compile };
      }
      Assert(Object.getPrototypeOf(schema) === Object.getPrototypeOf({}), "Schema can only contain plain objects");
      for (const key in schema) {
        const compiler = internals.walk(schema[key]);
        if (compiler) {
          return compiler;
        }
      }
      return null;
    };
    internals.simple = function(value) {
      return value === null || ["boolean", "string", "number"].includes(typeof value);
    };
    exports.when = function(schema, condition, options) {
      if (options === void 0) {
        Assert(condition && typeof condition === "object", "Missing options");
        options = condition;
        condition = Ref.create(".");
      }
      if (Array.isArray(options)) {
        options = { switch: options };
      }
      Common.assertOptions(options, ["is", "not", "then", "otherwise", "switch", "break"]);
      if (Common.isSchema(condition)) {
        Assert(options.is === void 0, '"is" can not be used with a schema condition');
        Assert(options.not === void 0, '"not" can not be used with a schema condition');
        Assert(options.switch === void 0, '"switch" can not be used with a schema condition');
        return internals.condition(schema, { is: condition, then: options.then, otherwise: options.otherwise, break: options.break });
      }
      Assert(Ref.isRef(condition) || typeof condition === "string", "Invalid condition:", condition);
      Assert(options.not === void 0 || options.is === void 0, 'Cannot combine "is" with "not"');
      if (options.switch === void 0) {
        let rule2 = options;
        if (options.not !== void 0) {
          rule2 = { is: options.not, then: options.otherwise, otherwise: options.then, break: options.break };
        }
        let is = rule2.is !== void 0 ? schema.$_compile(rule2.is) : schema.$_root.invalid(null, false, 0, "").required();
        Assert(rule2.then !== void 0 || rule2.otherwise !== void 0, 'options must have at least one of "then", "otherwise", or "switch"');
        Assert(rule2.break === void 0 || rule2.then === void 0 || rule2.otherwise === void 0, "Cannot specify then, otherwise, and break all together");
        if (options.is !== void 0 && !Ref.isRef(options.is) && !Common.isSchema(options.is)) {
          is = is.required();
        }
        return internals.condition(schema, { ref: exports.ref(condition), is, then: rule2.then, otherwise: rule2.otherwise, break: rule2.break });
      }
      Assert(Array.isArray(options.switch), '"switch" must be an array');
      Assert(options.is === void 0, 'Cannot combine "switch" with "is"');
      Assert(options.not === void 0, 'Cannot combine "switch" with "not"');
      Assert(options.then === void 0, 'Cannot combine "switch" with "then"');
      const rule = {
        ref: exports.ref(condition),
        switch: [],
        break: options.break
      };
      for (let i = 0; i < options.switch.length; ++i) {
        const test = options.switch[i];
        const last = i === options.switch.length - 1;
        Common.assertOptions(test, last ? ["is", "then", "otherwise"] : ["is", "then"]);
        Assert(test.is !== void 0, 'Switch statement missing "is"');
        Assert(test.then !== void 0, 'Switch statement missing "then"');
        const item = {
          is: schema.$_compile(test.is),
          then: schema.$_compile(test.then)
        };
        if (!Ref.isRef(test.is) && !Common.isSchema(test.is)) {
          item.is = item.is.required();
        }
        if (last) {
          Assert(options.otherwise === void 0 || test.otherwise === void 0, 'Cannot specify "otherwise" inside and outside a "switch"');
          const otherwise = options.otherwise !== void 0 ? options.otherwise : test.otherwise;
          if (otherwise !== void 0) {
            Assert(rule.break === void 0, "Cannot specify both otherwise and break");
            item.otherwise = schema.$_compile(otherwise);
          }
        }
        rule.switch.push(item);
      }
      return rule;
    };
    internals.condition = function(schema, condition) {
      for (const key of ["then", "otherwise"]) {
        if (condition[key] === void 0) {
          delete condition[key];
        } else {
          condition[key] = schema.$_compile(condition[key]);
        }
      }
      return condition;
    };
  }
});

// node_modules/joi/lib/extend.js
var require_extend = __commonJS({
  "node_modules/joi/lib/extend.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Common = require_common();
    var Messages = require_messages();
    var internals = {};
    exports.type = function(from, options) {
      const base = Object.getPrototypeOf(from);
      const prototype = Clone(base);
      const schema = from._assign(Object.create(prototype));
      const def = Object.assign({}, options);
      delete def.base;
      prototype._definition = def;
      const parent = base._definition || {};
      def.messages = Messages.merge(parent.messages, def.messages);
      def.properties = Object.assign({}, parent.properties, def.properties);
      schema.type = def.type;
      def.flags = Object.assign({}, parent.flags, def.flags);
      const terms = Object.assign({}, parent.terms);
      if (def.terms) {
        for (const name in def.terms) {
          const term = def.terms[name];
          Assert(schema.$_terms[name] === void 0, "Invalid term override for", def.type, name);
          schema.$_terms[name] = term.init;
          terms[name] = term;
        }
      }
      def.terms = terms;
      if (!def.args) {
        def.args = parent.args;
      }
      def.prepare = internals.prepare(def.prepare, parent.prepare);
      if (def.coerce) {
        if (typeof def.coerce === "function") {
          def.coerce = { method: def.coerce };
        }
        if (def.coerce.from && !Array.isArray(def.coerce.from)) {
          def.coerce = { method: def.coerce.method, from: [].concat(def.coerce.from) };
        }
      }
      def.coerce = internals.coerce(def.coerce, parent.coerce);
      def.validate = internals.validate(def.validate, parent.validate);
      const rules = Object.assign({}, parent.rules);
      if (def.rules) {
        for (const name in def.rules) {
          const rule = def.rules[name];
          Assert(typeof rule === "object", "Invalid rule definition for", def.type, name);
          let method = rule.method;
          if (method === void 0) {
            method = function() {
              return this.$_addRule(name);
            };
          }
          if (method) {
            Assert(!prototype[name], "Rule conflict in", def.type, name);
            prototype[name] = method;
          }
          Assert(!rules[name], "Rule conflict in", def.type, name);
          rules[name] = rule;
          if (rule.alias) {
            const aliases = [].concat(rule.alias);
            for (const alias of aliases) {
              prototype[alias] = rule.method;
            }
          }
          if (rule.args) {
            rule.argsByName = /* @__PURE__ */ new Map();
            rule.args = rule.args.map((arg) => {
              if (typeof arg === "string") {
                arg = { name: arg };
              }
              Assert(!rule.argsByName.has(arg.name), "Duplicated argument name", arg.name);
              if (Common.isSchema(arg.assert)) {
                arg.assert = arg.assert.strict().label(arg.name);
              }
              rule.argsByName.set(arg.name, arg);
              return arg;
            });
          }
        }
      }
      def.rules = rules;
      const modifiers = Object.assign({}, parent.modifiers);
      if (def.modifiers) {
        for (const name in def.modifiers) {
          Assert(!prototype[name], "Rule conflict in", def.type, name);
          const modifier = def.modifiers[name];
          Assert(typeof modifier === "function", "Invalid modifier definition for", def.type, name);
          const method = function(arg) {
            return this.rule({ [name]: arg });
          };
          prototype[name] = method;
          modifiers[name] = modifier;
        }
      }
      def.modifiers = modifiers;
      if (def.overrides) {
        prototype._super = base;
        schema.$_super = {};
        for (const override in def.overrides) {
          Assert(base[override], "Cannot override missing", override);
          def.overrides[override][Common.symbols.parent] = base[override];
          schema.$_super[override] = base[override].bind(schema);
        }
        Object.assign(prototype, def.overrides);
      }
      def.cast = Object.assign({}, parent.cast, def.cast);
      const manifest = Object.assign({}, parent.manifest, def.manifest);
      manifest.build = internals.build(def.manifest && def.manifest.build, parent.manifest && parent.manifest.build);
      def.manifest = manifest;
      def.rebuild = internals.rebuild(def.rebuild, parent.rebuild);
      return schema;
    };
    internals.build = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(obj, desc) {
        return parent(child(obj, desc), desc);
      };
    };
    internals.coerce = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return {
        from: child.from && parent.from ? [.../* @__PURE__ */ new Set([...child.from, ...parent.from])] : null,
        method(value, helpers) {
          let coerced;
          if (!parent.from || parent.from.includes(typeof value)) {
            coerced = parent.method(value, helpers);
            if (coerced) {
              if (coerced.errors || coerced.value === void 0) {
                return coerced;
              }
              value = coerced.value;
            }
          }
          if (!child.from || child.from.includes(typeof value)) {
            const own = child.method(value, helpers);
            if (own) {
              return own;
            }
          }
          return coerced;
        }
      };
    };
    internals.prepare = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(value, helpers) {
        const prepared = child(value, helpers);
        if (prepared) {
          if (prepared.errors || prepared.value === void 0) {
            return prepared;
          }
          value = prepared.value;
        }
        return parent(value, helpers) || prepared;
      };
    };
    internals.rebuild = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(schema) {
        parent(schema);
        child(schema);
      };
    };
    internals.validate = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(value, helpers) {
        const result = parent(value, helpers);
        if (result) {
          if (result.errors && (!Array.isArray(result.errors) || result.errors.length)) {
            return result;
          }
          value = result.value;
        }
        return child(value, helpers) || result;
      };
    };
  }
});

// node_modules/joi/lib/manifest.js
var require_manifest = __commonJS({
  "node_modules/joi/lib/manifest.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Common = require_common();
    var Messages = require_messages();
    var Ref = require_ref();
    var Template = require_template();
    var Schemas;
    var internals = {};
    exports.describe = function(schema) {
      const def = schema._definition;
      const desc = {
        type: schema.type,
        flags: {},
        rules: []
      };
      for (const flag in schema._flags) {
        if (flag[0] !== "_") {
          desc.flags[flag] = internals.describe(schema._flags[flag]);
        }
      }
      if (!Object.keys(desc.flags).length) {
        delete desc.flags;
      }
      if (schema._preferences) {
        desc.preferences = Clone(schema._preferences, { shallow: ["messages"] });
        delete desc.preferences[Common.symbols.prefs];
        if (desc.preferences.messages) {
          desc.preferences.messages = Messages.decompile(desc.preferences.messages);
        }
      }
      if (schema._valids) {
        desc.allow = schema._valids.describe();
      }
      if (schema._invalids) {
        desc.invalid = schema._invalids.describe();
      }
      for (const rule of schema._rules) {
        const ruleDef = def.rules[rule.name];
        if (ruleDef.manifest === false) {
          continue;
        }
        const item = { name: rule.name };
        for (const custom in def.modifiers) {
          if (rule[custom] !== void 0) {
            item[custom] = internals.describe(rule[custom]);
          }
        }
        if (rule.args) {
          item.args = {};
          for (const key in rule.args) {
            const arg = rule.args[key];
            if (key === "options" && !Object.keys(arg).length) {
              continue;
            }
            item.args[key] = internals.describe(arg, { assign: key });
          }
          if (!Object.keys(item.args).length) {
            delete item.args;
          }
        }
        desc.rules.push(item);
      }
      if (!desc.rules.length) {
        delete desc.rules;
      }
      for (const term in schema.$_terms) {
        if (term[0] === "_") {
          continue;
        }
        Assert(!desc[term], "Cannot describe schema due to internal name conflict with", term);
        const items = schema.$_terms[term];
        if (!items) {
          continue;
        }
        if (items instanceof Map) {
          if (items.size) {
            desc[term] = [...items.entries()];
          }
          continue;
        }
        if (Common.isValues(items)) {
          desc[term] = items.describe();
          continue;
        }
        Assert(def.terms[term], "Term", term, "missing configuration");
        const manifest = def.terms[term].manifest;
        const mapped = typeof manifest === "object";
        if (!items.length && !mapped) {
          continue;
        }
        const normalized = [];
        for (const item of items) {
          normalized.push(internals.describe(item));
        }
        if (mapped) {
          const { from, to } = manifest.mapped;
          desc[term] = {};
          for (const item of normalized) {
            desc[term][item[to]] = item[from];
          }
          continue;
        }
        if (manifest === "single") {
          Assert(normalized.length === 1, "Term", term, "contains more than one item");
          desc[term] = normalized[0];
          continue;
        }
        desc[term] = normalized;
      }
      internals.validate(schema.$_root, desc);
      return desc;
    };
    internals.describe = function(item, options = {}) {
      if (Array.isArray(item)) {
        return item.map(internals.describe);
      }
      if (item === Common.symbols.deepDefault) {
        return { special: "deep" };
      }
      if (typeof item !== "object" || item === null) {
        return item;
      }
      if (options.assign === "options") {
        return Clone(item);
      }
      if (Buffer && Buffer.isBuffer(item)) {
        return { buffer: item.toString("binary") };
      }
      if (item instanceof Date) {
        return item.toISOString();
      }
      if (item instanceof Error) {
        return item;
      }
      if (item instanceof RegExp) {
        if (options.assign === "regex") {
          return item.toString();
        }
        return { regex: item.toString() };
      }
      if (item[Common.symbols.literal]) {
        return { function: item.literal };
      }
      if (typeof item.describe === "function") {
        if (options.assign === "ref") {
          return item.describe().ref;
        }
        return item.describe();
      }
      const normalized = {};
      for (const key in item) {
        const value = item[key];
        if (value === void 0) {
          continue;
        }
        normalized[key] = internals.describe(value, { assign: key });
      }
      return normalized;
    };
    exports.build = function(joi, desc) {
      const builder = new internals.Builder(joi);
      return builder.parse(desc);
    };
    internals.Builder = class {
      constructor(joi) {
        this.joi = joi;
      }
      parse(desc) {
        internals.validate(this.joi, desc);
        let schema = this.joi[desc.type]()._bare();
        const def = schema._definition;
        if (desc.flags) {
          for (const flag in desc.flags) {
            const setter = def.flags[flag] && def.flags[flag].setter || flag;
            Assert(typeof schema[setter] === "function", "Invalid flag", flag, "for type", desc.type);
            schema = schema[setter](this.build(desc.flags[flag]));
          }
        }
        if (desc.preferences) {
          schema = schema.preferences(this.build(desc.preferences));
        }
        if (desc.allow) {
          schema = schema.allow(...this.build(desc.allow));
        }
        if (desc.invalid) {
          schema = schema.invalid(...this.build(desc.invalid));
        }
        if (desc.rules) {
          for (const rule of desc.rules) {
            Assert(typeof schema[rule.name] === "function", "Invalid rule", rule.name, "for type", desc.type);
            const args = [];
            if (rule.args) {
              const built = {};
              for (const key in rule.args) {
                built[key] = this.build(rule.args[key], { assign: key });
              }
              const keys = Object.keys(built);
              const definition = def.rules[rule.name].args;
              if (definition) {
                Assert(keys.length <= definition.length, "Invalid number of arguments for", desc.type, rule.name, "(expected up to", definition.length, ", found", keys.length, ")");
                for (const { name } of definition) {
                  args.push(built[name]);
                }
              } else {
                Assert(keys.length === 1, "Invalid number of arguments for", desc.type, rule.name, "(expected up to 1, found", keys.length, ")");
                args.push(built[keys[0]]);
              }
            }
            schema = schema[rule.name](...args);
            const options = {};
            for (const custom in def.modifiers) {
              if (rule[custom] !== void 0) {
                options[custom] = this.build(rule[custom]);
              }
            }
            if (Object.keys(options).length) {
              schema = schema.rule(options);
            }
          }
        }
        const terms = {};
        for (const key in desc) {
          if (["allow", "flags", "invalid", "whens", "preferences", "rules", "type"].includes(key)) {
            continue;
          }
          Assert(def.terms[key], "Term", key, "missing configuration");
          const manifest = def.terms[key].manifest;
          if (manifest === "schema") {
            terms[key] = desc[key].map((item) => this.parse(item));
            continue;
          }
          if (manifest === "values") {
            terms[key] = desc[key].map((item) => this.build(item));
            continue;
          }
          if (manifest === "single") {
            terms[key] = this.build(desc[key]);
            continue;
          }
          if (typeof manifest === "object") {
            terms[key] = {};
            for (const name in desc[key]) {
              const value = desc[key][name];
              terms[key][name] = this.parse(value);
            }
            continue;
          }
          terms[key] = this.build(desc[key]);
        }
        if (desc.whens) {
          terms.whens = desc.whens.map((when) => this.build(when));
        }
        schema = def.manifest.build(schema, terms);
        schema.$_temp.ruleset = false;
        return schema;
      }
      build(desc, options = {}) {
        if (desc === null) {
          return null;
        }
        if (Array.isArray(desc)) {
          return desc.map((item) => this.build(item));
        }
        if (desc instanceof Error) {
          return desc;
        }
        if (options.assign === "options") {
          return Clone(desc);
        }
        if (options.assign === "regex") {
          return internals.regex(desc);
        }
        if (options.assign === "ref") {
          return Ref.build(desc);
        }
        if (typeof desc !== "object") {
          return desc;
        }
        if (Object.keys(desc).length === 1) {
          if (desc.buffer) {
            Assert(Buffer, "Buffers are not supported");
            return Buffer && Buffer.from(desc.buffer, "binary");
          }
          if (desc.function) {
            return { [Common.symbols.literal]: true, literal: desc.function };
          }
          if (desc.override) {
            return Common.symbols.override;
          }
          if (desc.ref) {
            return Ref.build(desc.ref);
          }
          if (desc.regex) {
            return internals.regex(desc.regex);
          }
          if (desc.special) {
            Assert(["deep"].includes(desc.special), "Unknown special value", desc.special);
            return Common.symbols.deepDefault;
          }
          if (desc.value) {
            return Clone(desc.value);
          }
        }
        if (desc.type) {
          return this.parse(desc);
        }
        if (desc.template) {
          return Template.build(desc);
        }
        const normalized = {};
        for (const key in desc) {
          normalized[key] = this.build(desc[key], { assign: key });
        }
        return normalized;
      }
    };
    internals.regex = function(string2) {
      const end = string2.lastIndexOf("/");
      const exp = string2.slice(1, end);
      const flags = string2.slice(end + 1);
      return new RegExp(exp, flags);
    };
    internals.validate = function(joi, desc) {
      Schemas = Schemas || require_schemas();
      joi.assert(desc, Schemas.description);
    };
  }
});

// node_modules/@hapi/hoek/lib/deepEqual.js
var require_deepEqual = __commonJS({
  "node_modules/@hapi/hoek/lib/deepEqual.js"(exports, module2) {
    "use strict";
    var Types = require_types();
    var internals = {
      mismatched: null
    };
    module2.exports = function(obj, ref, options) {
      options = Object.assign({ prototype: true }, options);
      return !!internals.isDeepEqual(obj, ref, options, []);
    };
    internals.isDeepEqual = function(obj, ref, options, seen) {
      if (obj === ref) {
        return obj !== 0 || 1 / obj === 1 / ref;
      }
      const type = typeof obj;
      if (type !== typeof ref) {
        return false;
      }
      if (obj === null || ref === null) {
        return false;
      }
      if (type === "function") {
        if (!options.deepFunction || obj.toString() !== ref.toString()) {
          return false;
        }
      } else if (type !== "object") {
        return obj !== obj && ref !== ref;
      }
      const instanceType = internals.getSharedType(obj, ref, !!options.prototype);
      switch (instanceType) {
        case Types.buffer:
          return Buffer && Buffer.prototype.equals.call(obj, ref);
        case Types.promise:
          return obj === ref;
        case Types.regex:
          return obj.toString() === ref.toString();
        case internals.mismatched:
          return false;
      }
      for (let i = seen.length - 1; i >= 0; --i) {
        if (seen[i].isSame(obj, ref)) {
          return true;
        }
      }
      seen.push(new internals.SeenEntry(obj, ref));
      try {
        return !!internals.isDeepEqualObj(instanceType, obj, ref, options, seen);
      } finally {
        seen.pop();
      }
    };
    internals.getSharedType = function(obj, ref, checkPrototype) {
      if (checkPrototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
          return internals.mismatched;
        }
        return Types.getInternalProto(obj);
      }
      const type = Types.getInternalProto(obj);
      if (type !== Types.getInternalProto(ref)) {
        return internals.mismatched;
      }
      return type;
    };
    internals.valueOf = function(obj) {
      const objValueOf = obj.valueOf;
      if (objValueOf === void 0) {
        return obj;
      }
      try {
        return objValueOf.call(obj);
      } catch (err) {
        return err;
      }
    };
    internals.hasOwnEnumerableProperty = function(obj, key) {
      return Object.prototype.propertyIsEnumerable.call(obj, key);
    };
    internals.isSetSimpleEqual = function(obj, ref) {
      for (const entry of Set.prototype.values.call(obj)) {
        if (!Set.prototype.has.call(ref, entry)) {
          return false;
        }
      }
      return true;
    };
    internals.isDeepEqualObj = function(instanceType, obj, ref, options, seen) {
      const { isDeepEqual, valueOf, hasOwnEnumerableProperty } = internals;
      const { keys, getOwnPropertySymbols } = Object;
      if (instanceType === Types.array) {
        if (options.part) {
          for (const objValue of obj) {
            for (const refValue of ref) {
              if (isDeepEqual(objValue, refValue, options, seen)) {
                return true;
              }
            }
          }
        } else {
          if (obj.length !== ref.length) {
            return false;
          }
          for (let i = 0; i < obj.length; ++i) {
            if (!isDeepEqual(obj[i], ref[i], options, seen)) {
              return false;
            }
          }
          return true;
        }
      } else if (instanceType === Types.set) {
        if (obj.size !== ref.size) {
          return false;
        }
        if (!internals.isSetSimpleEqual(obj, ref)) {
          const ref2 = new Set(Set.prototype.values.call(ref));
          for (const objEntry of Set.prototype.values.call(obj)) {
            if (ref2.delete(objEntry)) {
              continue;
            }
            let found = false;
            for (const refEntry of ref2) {
              if (isDeepEqual(objEntry, refEntry, options, seen)) {
                ref2.delete(refEntry);
                found = true;
                break;
              }
            }
            if (!found) {
              return false;
            }
          }
        }
      } else if (instanceType === Types.map) {
        if (obj.size !== ref.size) {
          return false;
        }
        for (const [key, value] of Map.prototype.entries.call(obj)) {
          if (value === void 0 && !Map.prototype.has.call(ref, key)) {
            return false;
          }
          if (!isDeepEqual(value, Map.prototype.get.call(ref, key), options, seen)) {
            return false;
          }
        }
      } else if (instanceType === Types.error) {
        if (obj.name !== ref.name || obj.message !== ref.message) {
          return false;
        }
      }
      const valueOfObj = valueOf(obj);
      const valueOfRef = valueOf(ref);
      if ((obj !== valueOfObj || ref !== valueOfRef) && !isDeepEqual(valueOfObj, valueOfRef, options, seen)) {
        return false;
      }
      const objKeys = keys(obj);
      if (!options.part && objKeys.length !== keys(ref).length && !options.skip) {
        return false;
      }
      let skipped = 0;
      for (const key of objKeys) {
        if (options.skip && options.skip.includes(key)) {
          if (ref[key] === void 0) {
            ++skipped;
          }
          continue;
        }
        if (!hasOwnEnumerableProperty(ref, key)) {
          return false;
        }
        if (!isDeepEqual(obj[key], ref[key], options, seen)) {
          return false;
        }
      }
      if (!options.part && objKeys.length - skipped !== keys(ref).length) {
        return false;
      }
      if (options.symbols !== false) {
        const objSymbols = getOwnPropertySymbols(obj);
        const refSymbols = new Set(getOwnPropertySymbols(ref));
        for (const key of objSymbols) {
          if (!options.skip || !options.skip.includes(key)) {
            if (hasOwnEnumerableProperty(obj, key)) {
              if (!hasOwnEnumerableProperty(ref, key)) {
                return false;
              }
              if (!isDeepEqual(obj[key], ref[key], options, seen)) {
                return false;
              }
            } else if (hasOwnEnumerableProperty(ref, key)) {
              return false;
            }
          }
          refSymbols.delete(key);
        }
        for (const key of refSymbols) {
          if (hasOwnEnumerableProperty(ref, key)) {
            return false;
          }
        }
      }
      return true;
    };
    internals.SeenEntry = class {
      constructor(obj, ref) {
        this.obj = obj;
        this.ref = ref;
      }
      isSame(obj, ref) {
        return this.obj === obj && this.ref === ref;
      }
    };
  }
});

// node_modules/@sideway/pinpoint/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@sideway/pinpoint/lib/index.js"(exports) {
    "use strict";
    exports.location = function(depth = 0) {
      const orig = Error.prepareStackTrace;
      Error.prepareStackTrace = (ignore, stack) => stack;
      const capture = {};
      Error.captureStackTrace(capture, this);
      const line = capture.stack[depth + 1];
      Error.prepareStackTrace = orig;
      return {
        filename: line.getFileName(),
        line: line.getLineNumber()
      };
    };
  }
});

// node_modules/joi/lib/trace.js
var require_trace = __commonJS({
  "node_modules/joi/lib/trace.js"(exports) {
    "use strict";
    var DeepEqual = require_deepEqual();
    var Pinpoint = require_lib2();
    var Errors = require_errors();
    var internals = {
      codes: {
        error: 1,
        pass: 2,
        full: 3
      },
      labels: {
        0: "never used",
        1: "always error",
        2: "always pass"
      }
    };
    exports.setup = function(root) {
      const trace = function() {
        root._tracer = root._tracer || new internals.Tracer();
        return root._tracer;
      };
      root.trace = trace;
      root[Symbol.for("@hapi/lab/coverage/initialize")] = trace;
      root.untrace = () => {
        root._tracer = null;
      };
    };
    exports.location = function(schema) {
      return schema.$_setFlag("_tracerLocation", Pinpoint.location(2));
    };
    internals.Tracer = class {
      constructor() {
        this.name = "Joi";
        this._schemas = /* @__PURE__ */ new Map();
      }
      _register(schema) {
        const existing = this._schemas.get(schema);
        if (existing) {
          return existing.store;
        }
        const store = new internals.Store(schema);
        const { filename, line } = schema._flags._tracerLocation || Pinpoint.location(5);
        this._schemas.set(schema, { filename, line, store });
        return store;
      }
      _combine(merged, sources) {
        for (const { store } of this._schemas.values()) {
          store._combine(merged, sources);
        }
      }
      report(file) {
        const coverage = [];
        for (const { filename, line, store } of this._schemas.values()) {
          if (file && file !== filename) {
            continue;
          }
          const missing = [];
          const skipped = [];
          for (const [schema, log] of store._sources.entries()) {
            if (internals.sub(log.paths, skipped)) {
              continue;
            }
            if (!log.entry) {
              missing.push({
                status: "never reached",
                paths: [...log.paths]
              });
              skipped.push(...log.paths);
              continue;
            }
            for (const type of ["valid", "invalid"]) {
              const set = schema[`_${type}s`];
              if (!set) {
                continue;
              }
              const values = new Set(set._values);
              const refs = new Set(set._refs);
              for (const { value, ref } of log[type]) {
                values.delete(value);
                refs.delete(ref);
              }
              if (values.size || refs.size) {
                missing.push({
                  status: [...values, ...[...refs].map((ref) => ref.display)],
                  rule: `${type}s`
                });
              }
            }
            const rules = schema._rules.map((rule) => rule.name);
            for (const type of ["default", "failover"]) {
              if (schema._flags[type] !== void 0) {
                rules.push(type);
              }
            }
            for (const name of rules) {
              const status = internals.labels[log.rule[name] || 0];
              if (status) {
                const report = { rule: name, status };
                if (log.paths.size) {
                  report.paths = [...log.paths];
                }
                missing.push(report);
              }
            }
          }
          if (missing.length) {
            coverage.push({
              filename,
              line,
              missing,
              severity: "error",
              message: `Schema missing tests for ${missing.map(internals.message).join(", ")}`
            });
          }
        }
        return coverage.length ? coverage : null;
      }
    };
    internals.Store = class {
      constructor(schema) {
        this.active = true;
        this._sources = /* @__PURE__ */ new Map();
        this._combos = /* @__PURE__ */ new Map();
        this._scan(schema);
      }
      debug(state, source, name, result) {
        state.mainstay.debug && state.mainstay.debug.push({ type: source, name, result, path: state.path });
      }
      entry(schema, state) {
        internals.debug(state, { type: "entry" });
        this._record(schema, (log) => {
          log.entry = true;
        });
      }
      filter(schema, state, source, value) {
        internals.debug(state, __spreadValues({ type: source }, value));
        this._record(schema, (log) => {
          log[source].add(value);
        });
      }
      log(schema, state, source, name, result) {
        internals.debug(state, { type: source, name, result: result === "full" ? "pass" : result });
        this._record(schema, (log) => {
          log[source][name] = log[source][name] || 0;
          log[source][name] |= internals.codes[result];
        });
      }
      resolve(state, ref, to) {
        if (!state.mainstay.debug) {
          return;
        }
        const log = { type: "resolve", ref: ref.display, to, path: state.path };
        state.mainstay.debug.push(log);
      }
      value(state, by, from, to, name) {
        if (!state.mainstay.debug || DeepEqual(from, to)) {
          return;
        }
        const log = { type: "value", by, from, to, path: state.path };
        if (name) {
          log.name = name;
        }
        state.mainstay.debug.push(log);
      }
      _record(schema, each) {
        const log = this._sources.get(schema);
        if (log) {
          each(log);
          return;
        }
        const sources = this._combos.get(schema);
        for (const source of sources) {
          this._record(source, each);
        }
      }
      _scan(schema, _path) {
        const path = _path || [];
        let log = this._sources.get(schema);
        if (!log) {
          log = {
            paths: /* @__PURE__ */ new Set(),
            entry: false,
            rule: {},
            valid: /* @__PURE__ */ new Set(),
            invalid: /* @__PURE__ */ new Set()
          };
          this._sources.set(schema, log);
        }
        if (path.length) {
          log.paths.add(path);
        }
        const each = (sub, source) => {
          const subId = internals.id(sub, source);
          this._scan(sub, path.concat(subId));
        };
        schema.$_modify({ each, ref: false });
      }
      _combine(merged, sources) {
        this._combos.set(merged, sources);
      }
    };
    internals.message = function(item) {
      const path = item.paths ? Errors.path(item.paths[0]) + (item.rule ? ":" : "") : "";
      return `${path}${item.rule || ""} (${item.status})`;
    };
    internals.id = function(schema, { source, name, path, key }) {
      if (schema._flags.id) {
        return schema._flags.id;
      }
      if (key) {
        return key;
      }
      name = `@${name}`;
      if (source === "terms") {
        return [name, path[Math.min(path.length - 1, 1)]];
      }
      return name;
    };
    internals.sub = function(paths, skipped) {
      for (const path of paths) {
        for (const skip of skipped) {
          if (DeepEqual(path.slice(0, skip.length), skip)) {
            return true;
          }
        }
      }
      return false;
    };
    internals.debug = function(state, event) {
      if (state.mainstay.debug) {
        event.path = state.debug ? [...state.path, state.debug] : state.path;
        state.mainstay.debug.push(event);
      }
    };
  }
});

// node_modules/@hapi/hoek/lib/merge.js
var require_merge = __commonJS({
  "node_modules/@hapi/hoek/lib/merge.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Utils = require_utils();
    var internals = {};
    module2.exports = internals.merge = function(target, source, options) {
      Assert(target && typeof target === "object", "Invalid target value: must be an object");
      Assert(source === null || source === void 0 || typeof source === "object", "Invalid source value: must be null, undefined, or an object");
      if (!source) {
        return target;
      }
      options = Object.assign({ nullOverride: true, mergeArrays: true }, options);
      if (Array.isArray(source)) {
        Assert(Array.isArray(target), "Cannot merge array onto an object");
        if (!options.mergeArrays) {
          target.length = 0;
        }
        for (let i = 0; i < source.length; ++i) {
          target.push(Clone(source[i], { symbols: options.symbols }));
        }
        return target;
      }
      const keys = Utils.keys(source, options);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (key === "__proto__" || !Object.prototype.propertyIsEnumerable.call(source, key)) {
          continue;
        }
        const value = source[key];
        if (value && typeof value === "object") {
          if (target[key] === value) {
            continue;
          }
          if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key]) !== Array.isArray(value) || value instanceof Date || Buffer && Buffer.isBuffer(value) || value instanceof RegExp) {
            target[key] = Clone(value, { symbols: options.symbols });
          } else {
            internals.merge(target[key], value, options);
          }
        } else {
          if (value !== null && value !== void 0) {
            target[key] = value;
          } else if (options.nullOverride) {
            target[key] = value;
          }
        }
      }
      return target;
    };
  }
});

// node_modules/joi/lib/modify.js
var require_modify = __commonJS({
  "node_modules/joi/lib/modify.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Common = require_common();
    var Ref = require_ref();
    var internals = {};
    exports.Ids = internals.Ids = class {
      constructor() {
        this._byId = /* @__PURE__ */ new Map();
        this._byKey = /* @__PURE__ */ new Map();
        this._schemaChain = false;
      }
      clone() {
        const clone = new internals.Ids();
        clone._byId = new Map(this._byId);
        clone._byKey = new Map(this._byKey);
        clone._schemaChain = this._schemaChain;
        return clone;
      }
      concat(source) {
        if (source._schemaChain) {
          this._schemaChain = true;
        }
        for (const [id, value] of source._byId.entries()) {
          Assert(!this._byKey.has(id), "Schema id conflicts with existing key:", id);
          this._byId.set(id, value);
        }
        for (const [key, value] of source._byKey.entries()) {
          Assert(!this._byId.has(key), "Schema key conflicts with existing id:", key);
          this._byKey.set(key, value);
        }
      }
      fork(path, adjuster, root) {
        const chain = this._collect(path);
        chain.push({ schema: root });
        const tail = chain.shift();
        let adjusted = { id: tail.id, schema: adjuster(tail.schema) };
        Assert(Common.isSchema(adjusted.schema), "adjuster function failed to return a joi schema type");
        for (const node of chain) {
          adjusted = { id: node.id, schema: internals.fork(node.schema, adjusted.id, adjusted.schema) };
        }
        return adjusted.schema;
      }
      labels(path, behind = []) {
        const current = path[0];
        const node = this._get(current);
        if (!node) {
          return [...behind, ...path].join(".");
        }
        const forward = path.slice(1);
        behind = [...behind, node.schema._flags.label || current];
        if (!forward.length) {
          return behind.join(".");
        }
        return node.schema._ids.labels(forward, behind);
      }
      reach(path, behind = []) {
        const current = path[0];
        const node = this._get(current);
        Assert(node, "Schema does not contain path", [...behind, ...path].join("."));
        const forward = path.slice(1);
        if (!forward.length) {
          return node.schema;
        }
        return node.schema._ids.reach(forward, [...behind, current]);
      }
      register(schema, { key } = {}) {
        if (!schema || !Common.isSchema(schema)) {
          return;
        }
        if (schema.$_property("schemaChain") || schema._ids._schemaChain) {
          this._schemaChain = true;
        }
        const id = schema._flags.id;
        if (id) {
          const existing = this._byId.get(id);
          Assert(!existing || existing.schema === schema, "Cannot add different schemas with the same id:", id);
          Assert(!this._byKey.has(id), "Schema id conflicts with existing key:", id);
          this._byId.set(id, { schema, id });
        }
        if (key) {
          Assert(!this._byKey.has(key), "Schema already contains key:", key);
          Assert(!this._byId.has(key), "Schema key conflicts with existing id:", key);
          this._byKey.set(key, { schema, id: key });
        }
      }
      reset() {
        this._byId = /* @__PURE__ */ new Map();
        this._byKey = /* @__PURE__ */ new Map();
        this._schemaChain = false;
      }
      _collect(path, behind = [], nodes = []) {
        const current = path[0];
        const node = this._get(current);
        Assert(node, "Schema does not contain path", [...behind, ...path].join("."));
        nodes = [node, ...nodes];
        const forward = path.slice(1);
        if (!forward.length) {
          return nodes;
        }
        return node.schema._ids._collect(forward, [...behind, current], nodes);
      }
      _get(id) {
        return this._byId.get(id) || this._byKey.get(id);
      }
    };
    internals.fork = function(schema, id, replacement) {
      const each = (item, { key }) => {
        if (id === (item._flags.id || key)) {
          return replacement;
        }
      };
      const obj = exports.schema(schema, { each, ref: false });
      return obj ? obj.$_mutateRebuild() : schema;
    };
    exports.schema = function(schema, options) {
      let obj;
      for (const name in schema._flags) {
        if (name[0] === "_") {
          continue;
        }
        const result = internals.scan(schema._flags[name], { source: "flags", name }, options);
        if (result !== void 0) {
          obj = obj || schema.clone();
          obj._flags[name] = result;
        }
      }
      for (let i = 0; i < schema._rules.length; ++i) {
        const rule = schema._rules[i];
        const result = internals.scan(rule.args, { source: "rules", name: rule.name }, options);
        if (result !== void 0) {
          obj = obj || schema.clone();
          const clone = Object.assign({}, rule);
          clone.args = result;
          obj._rules[i] = clone;
          const existingUnique = obj._singleRules.get(rule.name);
          if (existingUnique === rule) {
            obj._singleRules.set(rule.name, clone);
          }
        }
      }
      for (const name in schema.$_terms) {
        if (name[0] === "_") {
          continue;
        }
        const result = internals.scan(schema.$_terms[name], { source: "terms", name }, options);
        if (result !== void 0) {
          obj = obj || schema.clone();
          obj.$_terms[name] = result;
        }
      }
      return obj;
    };
    internals.scan = function(item, source, options, _path, _key) {
      const path = _path || [];
      if (item === null || typeof item !== "object") {
        return;
      }
      let clone;
      if (Array.isArray(item)) {
        for (let i = 0; i < item.length; ++i) {
          const key = source.source === "terms" && source.name === "keys" && item[i].key;
          const result = internals.scan(item[i], source, options, [i, ...path], key);
          if (result !== void 0) {
            clone = clone || item.slice();
            clone[i] = result;
          }
        }
        return clone;
      }
      if (options.schema !== false && Common.isSchema(item) || options.ref !== false && Ref.isRef(item)) {
        const result = options.each(item, __spreadProps(__spreadValues({}, source), { path, key: _key }));
        if (result === item) {
          return;
        }
        return result;
      }
      for (const key in item) {
        if (key[0] === "_") {
          continue;
        }
        const result = internals.scan(item[key], source, options, [key, ...path], _key);
        if (result !== void 0) {
          clone = clone || Object.assign({}, item);
          clone[key] = result;
        }
      }
      return clone;
    };
  }
});

// node_modules/@hapi/hoek/lib/ignore.js
var require_ignore = __commonJS({
  "node_modules/@hapi/hoek/lib/ignore.js"(exports, module2) {
    "use strict";
    module2.exports = function() {
    };
  }
});

// node_modules/joi/lib/state.js
var require_state = __commonJS({
  "node_modules/joi/lib/state.js"(exports, module2) {
    "use strict";
    var Clone = require_clone();
    var Reach = require_reach();
    var Common = require_common();
    var internals = {
      value: Symbol("value")
    };
    module2.exports = internals.State = class {
      constructor(path, ancestors, state) {
        this.path = path;
        this.ancestors = ancestors;
        this.mainstay = state.mainstay;
        this.schemas = state.schemas;
        this.debug = null;
      }
      localize(path, ancestors = null, schema = null) {
        const state = new internals.State(path, ancestors, this);
        if (schema && state.schemas) {
          state.schemas = [internals.schemas(schema), ...state.schemas];
        }
        return state;
      }
      nest(schema, debug) {
        const state = new internals.State(this.path, this.ancestors, this);
        state.schemas = state.schemas && [internals.schemas(schema), ...state.schemas];
        state.debug = debug;
        return state;
      }
      shadow(value, reason) {
        this.mainstay.shadow = this.mainstay.shadow || new internals.Shadow();
        this.mainstay.shadow.set(this.path, value, reason);
      }
      snapshot() {
        if (this.mainstay.shadow) {
          this._snapshot = Clone(this.mainstay.shadow.node(this.path));
        }
      }
      restore() {
        if (this.mainstay.shadow) {
          this.mainstay.shadow.override(this.path, this._snapshot);
          this._snapshot = void 0;
        }
      }
    };
    internals.schemas = function(schema) {
      if (Common.isSchema(schema)) {
        return { schema };
      }
      return schema;
    };
    internals.Shadow = class {
      constructor() {
        this._values = null;
      }
      set(path, value, reason) {
        if (!path.length) {
          return;
        }
        if (reason === "strip" && typeof path[path.length - 1] === "number") {
          return;
        }
        this._values = this._values || /* @__PURE__ */ new Map();
        let node = this._values;
        for (let i = 0; i < path.length; ++i) {
          const segment = path[i];
          let next = node.get(segment);
          if (!next) {
            next = /* @__PURE__ */ new Map();
            node.set(segment, next);
          }
          node = next;
        }
        node[internals.value] = value;
      }
      get(path) {
        const node = this.node(path);
        if (node) {
          return node[internals.value];
        }
      }
      node(path) {
        if (!this._values) {
          return;
        }
        return Reach(this._values, path, { iterables: true });
      }
      override(path, node) {
        if (!this._values) {
          return;
        }
        const parents = path.slice(0, -1);
        const own = path[path.length - 1];
        const parent = Reach(this._values, parents, { iterables: true });
        if (node) {
          parent.set(own, node);
          return;
        }
        if (parent) {
          parent.delete(own);
        }
      }
    };
  }
});

// node_modules/joi/lib/validator.js
var require_validator = __commonJS({
  "node_modules/joi/lib/validator.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Ignore = require_ignore();
    var Reach = require_reach();
    var Common = require_common();
    var Errors = require_errors();
    var State = require_state();
    var internals = {
      result: Symbol("result")
    };
    exports.entry = function(value, schema, prefs) {
      let settings = Common.defaults;
      if (prefs) {
        Assert(prefs.warnings === void 0, "Cannot override warnings preference in synchronous validation");
        Assert(prefs.artifacts === void 0, "Cannot override artifacts preference in synchronous validation");
        settings = Common.preferences(Common.defaults, prefs);
      }
      const result = internals.entry(value, schema, settings);
      Assert(!result.mainstay.externals.length, "Schema with external rules must use validateAsync()");
      const outcome = { value: result.value };
      if (result.error) {
        outcome.error = result.error;
      }
      if (result.mainstay.warnings.length) {
        outcome.warning = Errors.details(result.mainstay.warnings);
      }
      if (result.mainstay.debug) {
        outcome.debug = result.mainstay.debug;
      }
      if (result.mainstay.artifacts) {
        outcome.artifacts = result.mainstay.artifacts;
      }
      return outcome;
    };
    exports.entryAsync = async function(value, schema, prefs) {
      let settings = Common.defaults;
      if (prefs) {
        settings = Common.preferences(Common.defaults, prefs);
      }
      const result = internals.entry(value, schema, settings);
      const mainstay = result.mainstay;
      if (result.error) {
        if (mainstay.debug) {
          result.error.debug = mainstay.debug;
        }
        throw result.error;
      }
      if (mainstay.externals.length) {
        let root = result.value;
        for (const { method, path, label } of mainstay.externals) {
          let node = root;
          let key;
          let parent;
          if (path.length) {
            key = path[path.length - 1];
            parent = Reach(root, path.slice(0, -1));
            node = parent[key];
          }
          try {
            const output = await method(node, { prefs });
            if (output === void 0 || output === node) {
              continue;
            }
            if (parent) {
              parent[key] = output;
            } else {
              root = output;
            }
          } catch (err) {
            if (settings.errors.label) {
              err.message += ` (${label})`;
            }
            throw err;
          }
        }
        result.value = root;
      }
      if (!settings.warnings && !settings.debug && !settings.artifacts) {
        return result.value;
      }
      const outcome = { value: result.value };
      if (mainstay.warnings.length) {
        outcome.warning = Errors.details(mainstay.warnings);
      }
      if (mainstay.debug) {
        outcome.debug = mainstay.debug;
      }
      if (mainstay.artifacts) {
        outcome.artifacts = mainstay.artifacts;
      }
      return outcome;
    };
    internals.entry = function(value, schema, prefs) {
      const { tracer, cleanup } = internals.tracer(schema, prefs);
      const debug = prefs.debug ? [] : null;
      const links = schema._ids._schemaChain ? /* @__PURE__ */ new Map() : null;
      const mainstay = { externals: [], warnings: [], tracer, debug, links };
      const schemas = schema._ids._schemaChain ? [{ schema }] : null;
      const state = new State([], [], { mainstay, schemas });
      const result = exports.validate(value, schema, state, prefs);
      if (cleanup) {
        schema.$_root.untrace();
      }
      const error = Errors.process(result.errors, value, prefs);
      return { value: result.value, error, mainstay };
    };
    internals.tracer = function(schema, prefs) {
      if (schema.$_root._tracer) {
        return { tracer: schema.$_root._tracer._register(schema) };
      }
      if (prefs.debug) {
        Assert(schema.$_root.trace, "Debug mode not supported");
        return { tracer: schema.$_root.trace()._register(schema), cleanup: true };
      }
      return { tracer: internals.ignore };
    };
    exports.validate = function(value, schema, state, prefs, overrides = {}) {
      if (schema.$_terms.whens) {
        schema = schema._generate(value, state, prefs).schema;
      }
      if (schema._preferences) {
        prefs = internals.prefs(schema, prefs);
      }
      if (schema._cache && prefs.cache) {
        const result = schema._cache.get(value);
        state.mainstay.tracer.debug(state, "validate", "cached", !!result);
        if (result) {
          return result;
        }
      }
      const createError = (code, local, localState) => schema.$_createError(code, value, local, localState || state, prefs);
      const helpers = {
        original: value,
        prefs,
        schema,
        state,
        error: createError,
        errorsArray: internals.errorsArray,
        warn: (code, local, localState) => state.mainstay.warnings.push(createError(code, local, localState)),
        message: (messages, local) => schema.$_createError("custom", value, local, state, prefs, { messages })
      };
      state.mainstay.tracer.entry(schema, state);
      const def = schema._definition;
      if (def.prepare && value !== void 0 && prefs.convert) {
        const prepared = def.prepare(value, helpers);
        if (prepared) {
          state.mainstay.tracer.value(state, "prepare", value, prepared.value);
          if (prepared.errors) {
            return internals.finalize(prepared.value, [].concat(prepared.errors), helpers);
          }
          value = prepared.value;
        }
      }
      if (def.coerce && value !== void 0 && prefs.convert && (!def.coerce.from || def.coerce.from.includes(typeof value))) {
        const coerced = def.coerce.method(value, helpers);
        if (coerced) {
          state.mainstay.tracer.value(state, "coerced", value, coerced.value);
          if (coerced.errors) {
            return internals.finalize(coerced.value, [].concat(coerced.errors), helpers);
          }
          value = coerced.value;
        }
      }
      const empty = schema._flags.empty;
      if (empty && empty.$_match(internals.trim(value, schema), state.nest(empty), Common.defaults)) {
        state.mainstay.tracer.value(state, "empty", value, void 0);
        value = void 0;
      }
      const presence = overrides.presence || schema._flags.presence || (schema._flags._endedSwitch ? null : prefs.presence);
      if (value === void 0) {
        if (presence === "forbidden") {
          return internals.finalize(value, null, helpers);
        }
        if (presence === "required") {
          return internals.finalize(value, [schema.$_createError("any.required", value, null, state, prefs)], helpers);
        }
        if (presence === "optional") {
          if (schema._flags.default !== Common.symbols.deepDefault) {
            return internals.finalize(value, null, helpers);
          }
          state.mainstay.tracer.value(state, "default", value, {});
          value = {};
        }
      } else if (presence === "forbidden") {
        return internals.finalize(value, [schema.$_createError("any.unknown", value, null, state, prefs)], helpers);
      }
      const errors = [];
      if (schema._valids) {
        const match = schema._valids.get(value, state, prefs, schema._flags.insensitive);
        if (match) {
          if (prefs.convert) {
            state.mainstay.tracer.value(state, "valids", value, match.value);
            value = match.value;
          }
          state.mainstay.tracer.filter(schema, state, "valid", match);
          return internals.finalize(value, null, helpers);
        }
        if (schema._flags.only) {
          const report = schema.$_createError("any.only", value, { valids: schema._valids.values({ display: true }) }, state, prefs);
          if (prefs.abortEarly) {
            return internals.finalize(value, [report], helpers);
          }
          errors.push(report);
        }
      }
      if (schema._invalids) {
        const match = schema._invalids.get(value, state, prefs, schema._flags.insensitive);
        if (match) {
          state.mainstay.tracer.filter(schema, state, "invalid", match);
          const report = schema.$_createError("any.invalid", value, { invalids: schema._invalids.values({ display: true }) }, state, prefs);
          if (prefs.abortEarly) {
            return internals.finalize(value, [report], helpers);
          }
          errors.push(report);
        }
      }
      if (def.validate) {
        const base = def.validate(value, helpers);
        if (base) {
          state.mainstay.tracer.value(state, "base", value, base.value);
          value = base.value;
          if (base.errors) {
            if (!Array.isArray(base.errors)) {
              errors.push(base.errors);
              return internals.finalize(value, errors, helpers);
            }
            if (base.errors.length) {
              errors.push(...base.errors);
              return internals.finalize(value, errors, helpers);
            }
          }
        }
      }
      if (!schema._rules.length) {
        return internals.finalize(value, errors, helpers);
      }
      return internals.rules(value, errors, helpers);
    };
    internals.rules = function(value, errors, helpers) {
      const { schema, state, prefs } = helpers;
      for (const rule of schema._rules) {
        const definition = schema._definition.rules[rule.method];
        if (definition.convert && prefs.convert) {
          state.mainstay.tracer.log(schema, state, "rule", rule.name, "full");
          continue;
        }
        let ret;
        let args = rule.args;
        if (rule._resolve.length) {
          args = Object.assign({}, args);
          for (const key of rule._resolve) {
            const resolver = definition.argsByName.get(key);
            const resolved = args[key].resolve(value, state, prefs);
            const normalized = resolver.normalize ? resolver.normalize(resolved) : resolved;
            const invalid = Common.validateArg(normalized, null, resolver);
            if (invalid) {
              ret = schema.$_createError("any.ref", resolved, { arg: key, ref: args[key], reason: invalid }, state, prefs);
              break;
            }
            args[key] = normalized;
          }
        }
        ret = ret || definition.validate(value, helpers, args, rule);
        const result = internals.rule(ret, rule);
        if (result.errors) {
          state.mainstay.tracer.log(schema, state, "rule", rule.name, "error");
          if (rule.warn) {
            state.mainstay.warnings.push(...result.errors);
            continue;
          }
          if (prefs.abortEarly) {
            return internals.finalize(value, result.errors, helpers);
          }
          errors.push(...result.errors);
        } else {
          state.mainstay.tracer.log(schema, state, "rule", rule.name, "pass");
          state.mainstay.tracer.value(state, "rule", value, result.value, rule.name);
          value = result.value;
        }
      }
      return internals.finalize(value, errors, helpers);
    };
    internals.rule = function(ret, rule) {
      if (ret instanceof Errors.Report) {
        internals.error(ret, rule);
        return { errors: [ret], value: null };
      }
      if (Array.isArray(ret) && ret[Common.symbols.errors]) {
        ret.forEach((report) => internals.error(report, rule));
        return { errors: ret, value: null };
      }
      return { errors: null, value: ret };
    };
    internals.error = function(report, rule) {
      if (rule.message) {
        report._setTemplate(rule.message);
      }
      return report;
    };
    internals.finalize = function(value, errors, helpers) {
      errors = errors || [];
      const { schema, state, prefs } = helpers;
      if (errors.length) {
        const failover = internals.default("failover", void 0, errors, helpers);
        if (failover !== void 0) {
          state.mainstay.tracer.value(state, "failover", value, failover);
          value = failover;
          errors = [];
        }
      }
      if (errors.length && schema._flags.error) {
        if (typeof schema._flags.error === "function") {
          errors = schema._flags.error(errors);
          if (!Array.isArray(errors)) {
            errors = [errors];
          }
          for (const error of errors) {
            Assert(error instanceof Error || error instanceof Errors.Report, "error() must return an Error object");
          }
        } else {
          errors = [schema._flags.error];
        }
      }
      if (value === void 0) {
        const defaulted = internals.default("default", value, errors, helpers);
        state.mainstay.tracer.value(state, "default", value, defaulted);
        value = defaulted;
      }
      if (schema._flags.cast && value !== void 0) {
        const caster = schema._definition.cast[schema._flags.cast];
        if (caster.from(value)) {
          const casted = caster.to(value, helpers);
          state.mainstay.tracer.value(state, "cast", value, casted, schema._flags.cast);
          value = casted;
        }
      }
      if (schema.$_terms.externals && prefs.externals && prefs._externals !== false) {
        for (const { method } of schema.$_terms.externals) {
          state.mainstay.externals.push({ method, path: state.path, label: Errors.label(schema._flags, state, prefs) });
        }
      }
      const result = { value, errors: errors.length ? errors : null };
      if (schema._flags.result) {
        result.value = schema._flags.result === "strip" ? void 0 : helpers.original;
        state.mainstay.tracer.value(state, schema._flags.result, value, result.value);
        state.shadow(value, schema._flags.result);
      }
      if (schema._cache && prefs.cache !== false && !schema._refs.length) {
        schema._cache.set(helpers.original, result);
      }
      if (value !== void 0 && !result.errors && schema._flags.artifact !== void 0) {
        state.mainstay.artifacts = state.mainstay.artifacts || /* @__PURE__ */ new Map();
        if (!state.mainstay.artifacts.has(schema._flags.artifact)) {
          state.mainstay.artifacts.set(schema._flags.artifact, []);
        }
        state.mainstay.artifacts.get(schema._flags.artifact).push(state.path);
      }
      return result;
    };
    internals.prefs = function(schema, prefs) {
      const isDefaultOptions = prefs === Common.defaults;
      if (isDefaultOptions && schema._preferences[Common.symbols.prefs]) {
        return schema._preferences[Common.symbols.prefs];
      }
      prefs = Common.preferences(prefs, schema._preferences);
      if (isDefaultOptions) {
        schema._preferences[Common.symbols.prefs] = prefs;
      }
      return prefs;
    };
    internals.default = function(flag, value, errors, helpers) {
      const { schema, state, prefs } = helpers;
      const source = schema._flags[flag];
      if (prefs.noDefaults || source === void 0) {
        return value;
      }
      state.mainstay.tracer.log(schema, state, "rule", flag, "full");
      if (!source) {
        return source;
      }
      if (typeof source === "function") {
        const args = source.length ? [Clone(state.ancestors[0]), helpers] : [];
        try {
          return source(...args);
        } catch (err) {
          errors.push(schema.$_createError(`any.${flag}`, null, { error: err }, state, prefs));
          return;
        }
      }
      if (typeof source !== "object") {
        return source;
      }
      if (source[Common.symbols.literal]) {
        return source.literal;
      }
      if (Common.isResolvable(source)) {
        return source.resolve(value, state, prefs);
      }
      return Clone(source);
    };
    internals.trim = function(value, schema) {
      if (typeof value !== "string") {
        return value;
      }
      const trim = schema.$_getRule("trim");
      if (!trim || !trim.args.enabled) {
        return value;
      }
      return value.trim();
    };
    internals.ignore = {
      active: false,
      debug: Ignore,
      entry: Ignore,
      filter: Ignore,
      log: Ignore,
      resolve: Ignore,
      value: Ignore
    };
    internals.errorsArray = function() {
      const errors = [];
      errors[Common.symbols.errors] = true;
      return errors;
    };
  }
});

// node_modules/joi/lib/values.js
var require_values = __commonJS({
  "node_modules/joi/lib/values.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var DeepEqual = require_deepEqual();
    var Common = require_common();
    var internals = {};
    module2.exports = internals.Values = class {
      constructor(values, refs) {
        this._values = new Set(values);
        this._refs = new Set(refs);
        this._lowercase = internals.lowercases(values);
        this._override = false;
      }
      get length() {
        return this._values.size + this._refs.size;
      }
      add(value, refs) {
        if (Common.isResolvable(value)) {
          if (!this._refs.has(value)) {
            this._refs.add(value);
            if (refs) {
              refs.register(value);
            }
          }
          return;
        }
        if (!this.has(value, null, null, false)) {
          this._values.add(value);
          if (typeof value === "string") {
            this._lowercase.set(value.toLowerCase(), value);
          }
        }
      }
      static merge(target, source, remove) {
        target = target || new internals.Values();
        if (source) {
          if (source._override) {
            return source.clone();
          }
          for (const item of [...source._values, ...source._refs]) {
            target.add(item);
          }
        }
        if (remove) {
          for (const item of [...remove._values, ...remove._refs]) {
            target.remove(item);
          }
        }
        return target.length ? target : null;
      }
      remove(value) {
        if (Common.isResolvable(value)) {
          this._refs.delete(value);
          return;
        }
        this._values.delete(value);
        if (typeof value === "string") {
          this._lowercase.delete(value.toLowerCase());
        }
      }
      has(value, state, prefs, insensitive) {
        return !!this.get(value, state, prefs, insensitive);
      }
      get(value, state, prefs, insensitive) {
        if (!this.length) {
          return false;
        }
        if (this._values.has(value)) {
          return { value };
        }
        if (typeof value === "string" && value && insensitive) {
          const found = this._lowercase.get(value.toLowerCase());
          if (found) {
            return { value: found };
          }
        }
        if (!this._refs.size && typeof value !== "object") {
          return false;
        }
        if (typeof value === "object") {
          for (const item of this._values) {
            if (DeepEqual(item, value)) {
              return { value: item };
            }
          }
        }
        if (state) {
          for (const ref of this._refs) {
            const resolved = ref.resolve(value, state, prefs, null, { in: true });
            if (resolved === void 0) {
              continue;
            }
            const items = !ref.in || typeof resolved !== "object" ? [resolved] : Array.isArray(resolved) ? resolved : Object.keys(resolved);
            for (const item of items) {
              if (typeof item !== typeof value) {
                continue;
              }
              if (insensitive && value && typeof value === "string") {
                if (item.toLowerCase() === value.toLowerCase()) {
                  return { value: item, ref };
                }
              } else {
                if (DeepEqual(item, value)) {
                  return { value: item, ref };
                }
              }
            }
          }
        }
        return false;
      }
      override() {
        this._override = true;
      }
      values(options) {
        if (options && options.display) {
          const values = [];
          for (const item of [...this._values, ...this._refs]) {
            if (item !== void 0) {
              values.push(item);
            }
          }
          return values;
        }
        return Array.from([...this._values, ...this._refs]);
      }
      clone() {
        const set = new internals.Values(this._values, this._refs);
        set._override = this._override;
        return set;
      }
      concat(source) {
        Assert(!source._override, "Cannot concat override set of values");
        const set = new internals.Values([...this._values, ...source._values], [...this._refs, ...source._refs]);
        set._override = this._override;
        return set;
      }
      describe() {
        const normalized = [];
        if (this._override) {
          normalized.push({ override: true });
        }
        for (const value of this._values.values()) {
          normalized.push(value && typeof value === "object" ? { value } : value);
        }
        for (const value of this._refs.values()) {
          normalized.push(value.describe());
        }
        return normalized;
      }
    };
    internals.Values.prototype[Common.symbols.values] = true;
    internals.Values.prototype.slice = internals.Values.prototype.clone;
    internals.lowercases = function(from) {
      const map = /* @__PURE__ */ new Map();
      if (from) {
        for (const value of from) {
          if (typeof value === "string") {
            map.set(value.toLowerCase(), value);
          }
        }
      }
      return map;
    };
  }
});

// node_modules/joi/lib/base.js
var require_base = __commonJS({
  "node_modules/joi/lib/base.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var DeepEqual = require_deepEqual();
    var Merge = require_merge();
    var Cache = require_cache();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Extend = require_extend();
    var Manifest = require_manifest();
    var Messages = require_messages();
    var Modify = require_modify();
    var Ref = require_ref();
    var Trace = require_trace();
    var Validator = require_validator();
    var Values = require_values();
    var internals = {};
    internals.Base = class {
      constructor(type) {
        this.type = type;
        this.$_root = null;
        this._definition = {};
        this._reset();
      }
      _reset() {
        this._ids = new Modify.Ids();
        this._preferences = null;
        this._refs = new Ref.Manager();
        this._cache = null;
        this._valids = null;
        this._invalids = null;
        this._flags = {};
        this._rules = [];
        this._singleRules = /* @__PURE__ */ new Map();
        this.$_terms = {};
        this.$_temp = {
          ruleset: null,
          whens: {}
        };
      }
      describe() {
        Assert(typeof Manifest.describe === "function", "Manifest functionality disabled");
        return Manifest.describe(this);
      }
      allow(...values) {
        Common.verifyFlat(values, "allow");
        return this._values(values, "_valids");
      }
      alter(targets) {
        Assert(targets && typeof targets === "object" && !Array.isArray(targets), "Invalid targets argument");
        Assert(!this._inRuleset(), "Cannot set alterations inside a ruleset");
        const obj = this.clone();
        obj.$_terms.alterations = obj.$_terms.alterations || [];
        for (const target in targets) {
          const adjuster = targets[target];
          Assert(typeof adjuster === "function", "Alteration adjuster for", target, "must be a function");
          obj.$_terms.alterations.push({ target, adjuster });
        }
        obj.$_temp.ruleset = false;
        return obj;
      }
      artifact(id) {
        Assert(id !== void 0, "Artifact cannot be undefined");
        Assert(!this._cache, "Cannot set an artifact with a rule cache");
        return this.$_setFlag("artifact", id);
      }
      cast(to) {
        Assert(to === false || typeof to === "string", "Invalid to value");
        Assert(to === false || this._definition.cast[to], "Type", this.type, "does not support casting to", to);
        return this.$_setFlag("cast", to === false ? void 0 : to);
      }
      default(value, options) {
        return this._default("default", value, options);
      }
      description(desc) {
        Assert(desc && typeof desc === "string", "Description must be a non-empty string");
        return this.$_setFlag("description", desc);
      }
      empty(schema) {
        const obj = this.clone();
        if (schema !== void 0) {
          schema = obj.$_compile(schema, { override: false });
        }
        return obj.$_setFlag("empty", schema, { clone: false });
      }
      error(err) {
        Assert(err, "Missing error");
        Assert(err instanceof Error || typeof err === "function", "Must provide a valid Error object or a function");
        return this.$_setFlag("error", err);
      }
      example(example, options = {}) {
        Assert(example !== void 0, "Missing example");
        Common.assertOptions(options, ["override"]);
        return this._inner("examples", example, { single: true, override: options.override });
      }
      external(method, description) {
        if (typeof method === "object") {
          Assert(!description, "Cannot combine options with description");
          description = method.description;
          method = method.method;
        }
        Assert(typeof method === "function", "Method must be a function");
        Assert(description === void 0 || description && typeof description === "string", "Description must be a non-empty string");
        return this._inner("externals", { method, description }, { single: true });
      }
      failover(value, options) {
        return this._default("failover", value, options);
      }
      forbidden() {
        return this.presence("forbidden");
      }
      id(id) {
        if (!id) {
          return this.$_setFlag("id", void 0);
        }
        Assert(typeof id === "string", "id must be a non-empty string");
        Assert(/^[^\.]+$/.test(id), "id cannot contain period character");
        return this.$_setFlag("id", id);
      }
      invalid(...values) {
        return this._values(values, "_invalids");
      }
      label(name) {
        Assert(name && typeof name === "string", "Label name must be a non-empty string");
        return this.$_setFlag("label", name);
      }
      meta(meta) {
        Assert(meta !== void 0, "Meta cannot be undefined");
        return this._inner("metas", meta, { single: true });
      }
      note(...notes) {
        Assert(notes.length, "Missing notes");
        for (const note of notes) {
          Assert(note && typeof note === "string", "Notes must be non-empty strings");
        }
        return this._inner("notes", notes);
      }
      only(mode = true) {
        Assert(typeof mode === "boolean", "Invalid mode:", mode);
        return this.$_setFlag("only", mode);
      }
      optional() {
        return this.presence("optional");
      }
      prefs(prefs) {
        Assert(prefs, "Missing preferences");
        Assert(prefs.context === void 0, "Cannot override context");
        Assert(prefs.externals === void 0, "Cannot override externals");
        Assert(prefs.warnings === void 0, "Cannot override warnings");
        Assert(prefs.debug === void 0, "Cannot override debug");
        Common.checkPreferences(prefs);
        const obj = this.clone();
        obj._preferences = Common.preferences(obj._preferences, prefs);
        return obj;
      }
      presence(mode) {
        Assert(["optional", "required", "forbidden"].includes(mode), "Unknown presence mode", mode);
        return this.$_setFlag("presence", mode);
      }
      raw(enabled = true) {
        return this.$_setFlag("result", enabled ? "raw" : void 0);
      }
      result(mode) {
        Assert(["raw", "strip"].includes(mode), "Unknown result mode", mode);
        return this.$_setFlag("result", mode);
      }
      required() {
        return this.presence("required");
      }
      strict(enabled) {
        const obj = this.clone();
        const convert = enabled === void 0 ? false : !enabled;
        obj._preferences = Common.preferences(obj._preferences, { convert });
        return obj;
      }
      strip(enabled = true) {
        return this.$_setFlag("result", enabled ? "strip" : void 0);
      }
      tag(...tags) {
        Assert(tags.length, "Missing tags");
        for (const tag of tags) {
          Assert(tag && typeof tag === "string", "Tags must be non-empty strings");
        }
        return this._inner("tags", tags);
      }
      unit(name) {
        Assert(name && typeof name === "string", "Unit name must be a non-empty string");
        return this.$_setFlag("unit", name);
      }
      valid(...values) {
        Common.verifyFlat(values, "valid");
        const obj = this.allow(...values);
        obj.$_setFlag("only", !!obj._valids, { clone: false });
        return obj;
      }
      when(condition, options) {
        const obj = this.clone();
        if (!obj.$_terms.whens) {
          obj.$_terms.whens = [];
        }
        const when = Compile.when(obj, condition, options);
        if (!["any", "link"].includes(obj.type)) {
          const conditions = when.is ? [when] : when.switch;
          for (const item of conditions) {
            Assert(!item.then || item.then.type === "any" || item.then.type === obj.type, "Cannot combine", obj.type, "with", item.then && item.then.type);
            Assert(!item.otherwise || item.otherwise.type === "any" || item.otherwise.type === obj.type, "Cannot combine", obj.type, "with", item.otherwise && item.otherwise.type);
          }
        }
        obj.$_terms.whens.push(when);
        return obj.$_mutateRebuild();
      }
      cache(cache) {
        Assert(!this._inRuleset(), "Cannot set caching inside a ruleset");
        Assert(!this._cache, "Cannot override schema cache");
        Assert(this._flags.artifact === void 0, "Cannot cache a rule with an artifact");
        const obj = this.clone();
        obj._cache = cache || Cache.provider.provision();
        obj.$_temp.ruleset = false;
        return obj;
      }
      clone() {
        const obj = Object.create(Object.getPrototypeOf(this));
        return this._assign(obj);
      }
      concat(source) {
        Assert(Common.isSchema(source), "Invalid schema object");
        Assert(this.type === "any" || source.type === "any" || source.type === this.type, "Cannot merge type", this.type, "with another type:", source.type);
        Assert(!this._inRuleset(), "Cannot concatenate onto a schema with open ruleset");
        Assert(!source._inRuleset(), "Cannot concatenate a schema with open ruleset");
        let obj = this.clone();
        if (this.type === "any" && source.type !== "any") {
          const tmpObj = source.clone();
          for (const key of Object.keys(obj)) {
            if (key !== "type") {
              tmpObj[key] = obj[key];
            }
          }
          obj = tmpObj;
        }
        obj._ids.concat(source._ids);
        obj._refs.register(source, Ref.toSibling);
        obj._preferences = obj._preferences ? Common.preferences(obj._preferences, source._preferences) : source._preferences;
        obj._valids = Values.merge(obj._valids, source._valids, source._invalids);
        obj._invalids = Values.merge(obj._invalids, source._invalids, source._valids);
        for (const name of source._singleRules.keys()) {
          if (obj._singleRules.has(name)) {
            obj._rules = obj._rules.filter((target) => target.keep || target.name !== name);
            obj._singleRules.delete(name);
          }
        }
        for (const test of source._rules) {
          if (!source._definition.rules[test.method].multi) {
            obj._singleRules.set(test.name, test);
          }
          obj._rules.push(test);
        }
        if (obj._flags.empty && source._flags.empty) {
          obj._flags.empty = obj._flags.empty.concat(source._flags.empty);
          const flags = Object.assign({}, source._flags);
          delete flags.empty;
          Merge(obj._flags, flags);
        } else if (source._flags.empty) {
          obj._flags.empty = source._flags.empty;
          const flags = Object.assign({}, source._flags);
          delete flags.empty;
          Merge(obj._flags, flags);
        } else {
          Merge(obj._flags, source._flags);
        }
        for (const key in source.$_terms) {
          const terms = source.$_terms[key];
          if (!terms) {
            if (!obj.$_terms[key]) {
              obj.$_terms[key] = terms;
            }
            continue;
          }
          if (!obj.$_terms[key]) {
            obj.$_terms[key] = terms.slice();
            continue;
          }
          obj.$_terms[key] = obj.$_terms[key].concat(terms);
        }
        if (this.$_root._tracer) {
          this.$_root._tracer._combine(obj, [this, source]);
        }
        return obj.$_mutateRebuild();
      }
      extend(options) {
        Assert(!options.base, "Cannot extend type with another base");
        return Extend.type(this, options);
      }
      extract(path) {
        path = Array.isArray(path) ? path : path.split(".");
        return this._ids.reach(path);
      }
      fork(paths, adjuster) {
        Assert(!this._inRuleset(), "Cannot fork inside a ruleset");
        let obj = this;
        for (let path of [].concat(paths)) {
          path = Array.isArray(path) ? path : path.split(".");
          obj = obj._ids.fork(path, adjuster, obj);
        }
        obj.$_temp.ruleset = false;
        return obj;
      }
      rule(options) {
        const def = this._definition;
        Common.assertOptions(options, Object.keys(def.modifiers));
        Assert(this.$_temp.ruleset !== false, "Cannot apply rules to empty ruleset or the last rule added does not support rule properties");
        const start = this.$_temp.ruleset === null ? this._rules.length - 1 : this.$_temp.ruleset;
        Assert(start >= 0 && start < this._rules.length, "Cannot apply rules to empty ruleset");
        const obj = this.clone();
        for (let i = start; i < obj._rules.length; ++i) {
          const original = obj._rules[i];
          const rule = Clone(original);
          for (const name in options) {
            def.modifiers[name](rule, options[name]);
            Assert(rule.name === original.name, "Cannot change rule name");
          }
          obj._rules[i] = rule;
          if (obj._singleRules.get(rule.name) === original) {
            obj._singleRules.set(rule.name, rule);
          }
        }
        obj.$_temp.ruleset = false;
        return obj.$_mutateRebuild();
      }
      get ruleset() {
        Assert(!this._inRuleset(), "Cannot start a new ruleset without closing the previous one");
        const obj = this.clone();
        obj.$_temp.ruleset = obj._rules.length;
        return obj;
      }
      get $() {
        return this.ruleset;
      }
      tailor(targets) {
        targets = [].concat(targets);
        Assert(!this._inRuleset(), "Cannot tailor inside a ruleset");
        let obj = this;
        if (this.$_terms.alterations) {
          for (const { target, adjuster } of this.$_terms.alterations) {
            if (targets.includes(target)) {
              obj = adjuster(obj);
              Assert(Common.isSchema(obj), "Alteration adjuster for", target, "failed to return a schema object");
            }
          }
        }
        obj = obj.$_modify({ each: (item) => item.tailor(targets), ref: false });
        obj.$_temp.ruleset = false;
        return obj.$_mutateRebuild();
      }
      tracer() {
        return Trace.location ? Trace.location(this) : this;
      }
      validate(value, options) {
        return Validator.entry(value, this, options);
      }
      validateAsync(value, options) {
        return Validator.entryAsync(value, this, options);
      }
      $_addRule(options) {
        if (typeof options === "string") {
          options = { name: options };
        }
        Assert(options && typeof options === "object", "Invalid options");
        Assert(options.name && typeof options.name === "string", "Invalid rule name");
        for (const key in options) {
          Assert(key[0] !== "_", "Cannot set private rule properties");
        }
        const rule = Object.assign({}, options);
        rule._resolve = [];
        rule.method = rule.method || rule.name;
        const definition = this._definition.rules[rule.method];
        const args = rule.args;
        Assert(definition, "Unknown rule", rule.method);
        const obj = this.clone();
        if (args) {
          Assert(Object.keys(args).length === 1 || Object.keys(args).length === this._definition.rules[rule.name].args.length, "Invalid rule definition for", this.type, rule.name);
          for (const key in args) {
            let arg = args[key];
            if (arg === void 0) {
              delete args[key];
              continue;
            }
            if (definition.argsByName) {
              const resolver = definition.argsByName.get(key);
              if (resolver.ref && Common.isResolvable(arg)) {
                rule._resolve.push(key);
                obj.$_mutateRegister(arg);
              } else {
                if (resolver.normalize) {
                  arg = resolver.normalize(arg);
                  args[key] = arg;
                }
                if (resolver.assert) {
                  const error = Common.validateArg(arg, key, resolver);
                  Assert(!error, error, "or reference");
                }
              }
            }
            args[key] = arg;
          }
        }
        if (!definition.multi) {
          obj._ruleRemove(rule.name, { clone: false });
          obj._singleRules.set(rule.name, rule);
        }
        if (obj.$_temp.ruleset === false) {
          obj.$_temp.ruleset = null;
        }
        if (definition.priority) {
          obj._rules.unshift(rule);
        } else {
          obj._rules.push(rule);
        }
        return obj;
      }
      $_compile(schema, options) {
        return Compile.schema(this.$_root, schema, options);
      }
      $_createError(code, value, local, state, prefs, options = {}) {
        const flags = options.flags !== false ? this._flags : {};
        const messages = options.messages ? Messages.merge(this._definition.messages, options.messages) : this._definition.messages;
        return new Errors.Report(code, value, local, flags, messages, state, prefs);
      }
      $_getFlag(name) {
        return this._flags[name];
      }
      $_getRule(name) {
        return this._singleRules.get(name);
      }
      $_mapLabels(path) {
        path = Array.isArray(path) ? path : path.split(".");
        return this._ids.labels(path);
      }
      $_match(value, state, prefs, overrides) {
        prefs = Object.assign({}, prefs);
        prefs.abortEarly = true;
        prefs._externals = false;
        state.snapshot();
        const result = !Validator.validate(value, this, state, prefs, overrides).errors;
        state.restore();
        return result;
      }
      $_modify(options) {
        Common.assertOptions(options, ["each", "once", "ref", "schema"]);
        return Modify.schema(this, options) || this;
      }
      $_mutateRebuild() {
        Assert(!this._inRuleset(), "Cannot add this rule inside a ruleset");
        this._refs.reset();
        this._ids.reset();
        const each = (item, { source, name, path, key }) => {
          const family = this._definition[source][name] && this._definition[source][name].register;
          if (family !== false) {
            this.$_mutateRegister(item, { family, key });
          }
        };
        this.$_modify({ each });
        if (this._definition.rebuild) {
          this._definition.rebuild(this);
        }
        this.$_temp.ruleset = false;
        return this;
      }
      $_mutateRegister(schema, { family, key } = {}) {
        this._refs.register(schema, family);
        this._ids.register(schema, { key });
      }
      $_property(name) {
        return this._definition.properties[name];
      }
      $_reach(path) {
        return this._ids.reach(path);
      }
      $_rootReferences() {
        return this._refs.roots();
      }
      $_setFlag(name, value, options = {}) {
        Assert(name[0] === "_" || !this._inRuleset(), "Cannot set flag inside a ruleset");
        const flag = this._definition.flags[name] || {};
        if (DeepEqual(value, flag.default)) {
          value = void 0;
        }
        if (DeepEqual(value, this._flags[name])) {
          return this;
        }
        const obj = options.clone !== false ? this.clone() : this;
        if (value !== void 0) {
          obj._flags[name] = value;
          obj.$_mutateRegister(value);
        } else {
          delete obj._flags[name];
        }
        if (name[0] !== "_") {
          obj.$_temp.ruleset = false;
        }
        return obj;
      }
      $_parent(method, ...args) {
        return this[method][Common.symbols.parent].call(this, ...args);
      }
      $_validate(value, state, prefs) {
        return Validator.validate(value, this, state, prefs);
      }
      _assign(target) {
        target.type = this.type;
        target.$_root = this.$_root;
        target.$_temp = Object.assign({}, this.$_temp);
        target.$_temp.whens = {};
        target._ids = this._ids.clone();
        target._preferences = this._preferences;
        target._valids = this._valids && this._valids.clone();
        target._invalids = this._invalids && this._invalids.clone();
        target._rules = this._rules.slice();
        target._singleRules = Clone(this._singleRules, { shallow: true });
        target._refs = this._refs.clone();
        target._flags = Object.assign({}, this._flags);
        target._cache = null;
        target.$_terms = {};
        for (const key in this.$_terms) {
          target.$_terms[key] = this.$_terms[key] ? this.$_terms[key].slice() : null;
        }
        target.$_super = {};
        for (const override in this.$_super) {
          target.$_super[override] = this._super[override].bind(target);
        }
        return target;
      }
      _bare() {
        const obj = this.clone();
        obj._reset();
        const terms = obj._definition.terms;
        for (const name in terms) {
          const term = terms[name];
          obj.$_terms[name] = term.init;
        }
        return obj.$_mutateRebuild();
      }
      _default(flag, value, options = {}) {
        Common.assertOptions(options, "literal");
        Assert(value !== void 0, "Missing", flag, "value");
        Assert(typeof value === "function" || !options.literal, "Only function value supports literal option");
        if (typeof value === "function" && options.literal) {
          value = {
            [Common.symbols.literal]: true,
            literal: value
          };
        }
        const obj = this.$_setFlag(flag, value);
        return obj;
      }
      _generate(value, state, prefs) {
        if (!this.$_terms.whens) {
          return { schema: this };
        }
        const whens = [];
        const ids = [];
        for (let i = 0; i < this.$_terms.whens.length; ++i) {
          const when = this.$_terms.whens[i];
          if (when.concat) {
            whens.push(when.concat);
            ids.push(`${i}.concat`);
            continue;
          }
          const input = when.ref ? when.ref.resolve(value, state, prefs) : value;
          const tests = when.is ? [when] : when.switch;
          const before = ids.length;
          for (let j = 0; j < tests.length; ++j) {
            const { is, then, otherwise } = tests[j];
            const baseId = `${i}${when.switch ? "." + j : ""}`;
            if (is.$_match(input, state.nest(is, `${baseId}.is`), prefs)) {
              if (then) {
                const localState = state.localize([...state.path, `${baseId}.then`], state.ancestors, state.schemas);
                const { schema: generated, id: id2 } = then._generate(value, localState, prefs);
                whens.push(generated);
                ids.push(`${baseId}.then${id2 ? `(${id2})` : ""}`);
                break;
              }
            } else if (otherwise) {
              const localState = state.localize([...state.path, `${baseId}.otherwise`], state.ancestors, state.schemas);
              const { schema: generated, id: id2 } = otherwise._generate(value, localState, prefs);
              whens.push(generated);
              ids.push(`${baseId}.otherwise${id2 ? `(${id2})` : ""}`);
              break;
            }
          }
          if (when.break && ids.length > before) {
            break;
          }
        }
        const id = ids.join(", ");
        state.mainstay.tracer.debug(state, "rule", "when", id);
        if (!id) {
          return { schema: this };
        }
        if (!state.mainstay.tracer.active && this.$_temp.whens[id]) {
          return { schema: this.$_temp.whens[id], id };
        }
        let obj = this;
        if (this._definition.generate) {
          obj = this._definition.generate(this, value, state, prefs);
        }
        for (const when of whens) {
          obj = obj.concat(when);
        }
        if (this.$_root._tracer) {
          this.$_root._tracer._combine(obj, [this, ...whens]);
        }
        this.$_temp.whens[id] = obj;
        return { schema: obj, id };
      }
      _inner(type, values, options = {}) {
        Assert(!this._inRuleset(), `Cannot set ${type} inside a ruleset`);
        const obj = this.clone();
        if (!obj.$_terms[type] || options.override) {
          obj.$_terms[type] = [];
        }
        if (options.single) {
          obj.$_terms[type].push(values);
        } else {
          obj.$_terms[type].push(...values);
        }
        obj.$_temp.ruleset = false;
        return obj;
      }
      _inRuleset() {
        return this.$_temp.ruleset !== null && this.$_temp.ruleset !== false;
      }
      _ruleRemove(name, options = {}) {
        if (!this._singleRules.has(name)) {
          return this;
        }
        const obj = options.clone !== false ? this.clone() : this;
        obj._singleRules.delete(name);
        const filtered = [];
        for (let i = 0; i < obj._rules.length; ++i) {
          const test = obj._rules[i];
          if (test.name === name && !test.keep) {
            if (obj._inRuleset() && i < obj.$_temp.ruleset) {
              --obj.$_temp.ruleset;
            }
            continue;
          }
          filtered.push(test);
        }
        obj._rules = filtered;
        return obj;
      }
      _values(values, key) {
        Common.verifyFlat(values, key.slice(1, -1));
        const obj = this.clone();
        const override = values[0] === Common.symbols.override;
        if (override) {
          values = values.slice(1);
        }
        if (!obj[key] && values.length) {
          obj[key] = new Values();
        } else if (override) {
          obj[key] = values.length ? new Values() : null;
          obj.$_mutateRebuild();
        }
        if (!obj[key]) {
          return obj;
        }
        if (override) {
          obj[key].override();
        }
        for (const value of values) {
          Assert(value !== void 0, "Cannot call allow/valid/invalid with undefined");
          Assert(value !== Common.symbols.override, "Override must be the first value");
          const other = key === "_invalids" ? "_valids" : "_invalids";
          if (obj[other]) {
            obj[other].remove(value);
            if (!obj[other].length) {
              Assert(key === "_valids" || !obj._flags.only, "Setting invalid value", value, "leaves schema rejecting all values due to previous valid rule");
              obj[other] = null;
            }
          }
          obj[key].add(value, obj._refs);
        }
        return obj;
      }
    };
    internals.Base.prototype[Common.symbols.any] = {
      version: Common.version,
      compile: Compile.compile,
      root: "$_root"
    };
    internals.Base.prototype.isImmutable = true;
    internals.Base.prototype.deny = internals.Base.prototype.invalid;
    internals.Base.prototype.disallow = internals.Base.prototype.invalid;
    internals.Base.prototype.equal = internals.Base.prototype.valid;
    internals.Base.prototype.exist = internals.Base.prototype.required;
    internals.Base.prototype.not = internals.Base.prototype.invalid;
    internals.Base.prototype.options = internals.Base.prototype.prefs;
    internals.Base.prototype.preferences = internals.Base.prototype.prefs;
    module2.exports = new internals.Base();
  }
});

// node_modules/joi/lib/types/any.js
var require_any = __commonJS({
  "node_modules/joi/lib/types/any.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Base = require_base();
    var Common = require_common();
    var Messages = require_messages();
    module2.exports = Base.extend({
      type: "any",
      flags: {
        only: { default: false }
      },
      terms: {
        alterations: { init: null },
        examples: { init: null },
        externals: { init: null },
        metas: { init: [] },
        notes: { init: [] },
        shared: { init: null },
        tags: { init: [] },
        whens: { init: null }
      },
      rules: {
        custom: {
          method(method, description) {
            Assert(typeof method === "function", "Method must be a function");
            Assert(description === void 0 || description && typeof description === "string", "Description must be a non-empty string");
            return this.$_addRule({ name: "custom", args: { method, description } });
          },
          validate(value, helpers, { method }) {
            try {
              return method(value, helpers);
            } catch (err) {
              return helpers.error("any.custom", { error: err });
            }
          },
          args: ["method", "description"],
          multi: true
        },
        messages: {
          method(messages) {
            return this.prefs({ messages });
          }
        },
        shared: {
          method(schema) {
            Assert(Common.isSchema(schema) && schema._flags.id, "Schema must be a schema with an id");
            const obj = this.clone();
            obj.$_terms.shared = obj.$_terms.shared || [];
            obj.$_terms.shared.push(schema);
            obj.$_mutateRegister(schema);
            return obj;
          }
        },
        warning: {
          method(code, local) {
            Assert(code && typeof code === "string", "Invalid warning code");
            return this.$_addRule({ name: "warning", args: { code, local }, warn: true });
          },
          validate(value, helpers, { code, local }) {
            return helpers.error(code, local);
          },
          args: ["code", "local"],
          multi: true
        }
      },
      modifiers: {
        keep(rule, enabled = true) {
          rule.keep = enabled;
        },
        message(rule, message) {
          rule.message = Messages.compile(message);
        },
        warn(rule, enabled = true) {
          rule.warn = enabled;
        }
      },
      manifest: {
        build(obj, desc) {
          for (const key in desc) {
            const values = desc[key];
            if (["examples", "externals", "metas", "notes", "tags"].includes(key)) {
              for (const value of values) {
                obj = obj[key.slice(0, -1)](value);
              }
              continue;
            }
            if (key === "alterations") {
              const alter = {};
              for (const { target, adjuster } of values) {
                alter[target] = adjuster;
              }
              obj = obj.alter(alter);
              continue;
            }
            if (key === "whens") {
              for (const value of values) {
                const { ref, is, not, then, otherwise, concat } = value;
                if (concat) {
                  obj = obj.concat(concat);
                } else if (ref) {
                  obj = obj.when(ref, { is, not, then, otherwise, switch: value.switch, break: value.break });
                } else {
                  obj = obj.when(is, { then, otherwise, break: value.break });
                }
              }
              continue;
            }
            if (key === "shared") {
              for (const value of values) {
                obj = obj.shared(value);
              }
            }
          }
          return obj;
        }
      },
      messages: {
        "any.custom": "{{#label}} failed custom validation because {{#error.message}}",
        "any.default": "{{#label}} threw an error when running default method",
        "any.failover": "{{#label}} threw an error when running failover method",
        "any.invalid": "{{#label}} contains an invalid value",
        "any.only": '{{#label}} must be {if(#valids.length == 1, "", "one of ")}{{#valids}}',
        "any.ref": "{{#label}} {{#arg}} references {{:#ref}} which {{#reason}}",
        "any.required": "{{#label}} is required",
        "any.unknown": "{{#label}} is not allowed"
      }
    });
  }
});

// node_modules/joi/lib/types/alternatives.js
var require_alternatives = __commonJS({
  "node_modules/joi/lib/types/alternatives.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Merge = require_merge();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Ref = require_ref();
    var internals = {};
    module2.exports = Any.extend({
      type: "alternatives",
      flags: {
        match: { default: "any" }
      },
      terms: {
        matches: { init: [], register: Ref.toSibling }
      },
      args(schema, ...schemas) {
        if (schemas.length === 1) {
          if (Array.isArray(schemas[0])) {
            return schema.try(...schemas[0]);
          }
        }
        return schema.try(...schemas);
      },
      validate(value, helpers) {
        const { schema, error, state, prefs } = helpers;
        if (schema._flags.match) {
          const matched = [];
          const failed = [];
          for (let i = 0; i < schema.$_terms.matches.length; ++i) {
            const item = schema.$_terms.matches[i];
            const localState = state.nest(item.schema, `match.${i}`);
            localState.snapshot();
            const result = item.schema.$_validate(value, localState, prefs);
            if (!result.errors) {
              matched.push(result.value);
            } else {
              failed.push(result.errors);
              localState.restore();
            }
          }
          if (matched.length === 0) {
            const context = {
              details: failed.map((f) => Errors.details(f, { override: false }))
            };
            return { errors: error("alternatives.any", context) };
          }
          if (schema._flags.match === "one") {
            return matched.length === 1 ? { value: matched[0] } : { errors: error("alternatives.one") };
          }
          if (matched.length !== schema.$_terms.matches.length) {
            const context = {
              details: failed.map((f) => Errors.details(f, { override: false }))
            };
            return { errors: error("alternatives.all", context) };
          }
          const isAnyObj = (alternative) => {
            return alternative.$_terms.matches.some((v) => {
              return v.schema.type === "object" || v.schema.type === "alternatives" && isAnyObj(v.schema);
            });
          };
          return isAnyObj(schema) ? { value: matched.reduce((acc, v) => Merge(acc, v, { mergeArrays: false })) } : { value: matched[matched.length - 1] };
        }
        const errors = [];
        for (let i = 0; i < schema.$_terms.matches.length; ++i) {
          const item = schema.$_terms.matches[i];
          if (item.schema) {
            const localState = state.nest(item.schema, `match.${i}`);
            localState.snapshot();
            const result = item.schema.$_validate(value, localState, prefs);
            if (!result.errors) {
              return result;
            }
            localState.restore();
            errors.push({ schema: item.schema, reports: result.errors });
            continue;
          }
          const input = item.ref ? item.ref.resolve(value, state, prefs) : value;
          const tests = item.is ? [item] : item.switch;
          for (let j = 0; j < tests.length; ++j) {
            const test = tests[j];
            const { is, then, otherwise } = test;
            const id = `match.${i}${item.switch ? "." + j : ""}`;
            if (!is.$_match(input, state.nest(is, `${id}.is`), prefs)) {
              if (otherwise) {
                return otherwise.$_validate(value, state.nest(otherwise, `${id}.otherwise`), prefs);
              }
            } else if (then) {
              return then.$_validate(value, state.nest(then, `${id}.then`), prefs);
            }
          }
        }
        return internals.errors(errors, helpers);
      },
      rules: {
        conditional: {
          method(condition, options) {
            Assert(!this._flags._endedSwitch, "Unreachable condition");
            Assert(!this._flags.match, "Cannot combine match mode", this._flags.match, "with conditional rule");
            Assert(options.break === void 0, "Cannot use break option with alternatives conditional");
            const obj = this.clone();
            const match = Compile.when(obj, condition, options);
            const conditions = match.is ? [match] : match.switch;
            for (const item of conditions) {
              if (item.then && item.otherwise) {
                obj.$_setFlag("_endedSwitch", true, { clone: false });
                break;
              }
            }
            obj.$_terms.matches.push(match);
            return obj.$_mutateRebuild();
          }
        },
        match: {
          method(mode) {
            Assert(["any", "one", "all"].includes(mode), "Invalid alternatives match mode", mode);
            if (mode !== "any") {
              for (const match of this.$_terms.matches) {
                Assert(match.schema, "Cannot combine match mode", mode, "with conditional rules");
              }
            }
            return this.$_setFlag("match", mode);
          }
        },
        try: {
          method(...schemas) {
            Assert(schemas.length, "Missing alternative schemas");
            Common.verifyFlat(schemas, "try");
            Assert(!this._flags._endedSwitch, "Unreachable condition");
            const obj = this.clone();
            for (const schema of schemas) {
              obj.$_terms.matches.push({ schema: obj.$_compile(schema) });
            }
            return obj.$_mutateRebuild();
          }
        }
      },
      overrides: {
        label(name) {
          const obj = this.$_parent("label", name);
          const each = (item, source) => source.path[0] !== "is" ? item.label(name) : void 0;
          return obj.$_modify({ each, ref: false });
        }
      },
      rebuild(schema) {
        const each = (item) => {
          if (Common.isSchema(item) && item.type === "array") {
            schema.$_setFlag("_arrayItems", true, { clone: false });
          }
        };
        schema.$_modify({ each });
      },
      manifest: {
        build(obj, desc) {
          if (desc.matches) {
            for (const match of desc.matches) {
              const { schema, ref, is, not, then, otherwise } = match;
              if (schema) {
                obj = obj.try(schema);
              } else if (ref) {
                obj = obj.conditional(ref, { is, then, not, otherwise, switch: match.switch });
              } else {
                obj = obj.conditional(is, { then, otherwise });
              }
            }
          }
          return obj;
        }
      },
      messages: {
        "alternatives.all": "{{#label}} does not match all of the required types",
        "alternatives.any": "{{#label}} does not match any of the allowed types",
        "alternatives.match": "{{#label}} does not match any of the allowed types",
        "alternatives.one": "{{#label}} matches more than one allowed type",
        "alternatives.types": "{{#label}} must be one of {{#types}}"
      }
    });
    internals.errors = function(failures, { error, state }) {
      if (!failures.length) {
        return { errors: error("alternatives.any") };
      }
      if (failures.length === 1) {
        return { errors: failures[0].reports };
      }
      const valids = /* @__PURE__ */ new Set();
      const complex = [];
      for (const { reports, schema } of failures) {
        if (reports.length > 1) {
          return internals.unmatched(failures, error);
        }
        const report = reports[0];
        if (report instanceof Errors.Report === false) {
          return internals.unmatched(failures, error);
        }
        if (report.state.path.length !== state.path.length) {
          complex.push({ type: schema.type, report });
          continue;
        }
        if (report.code === "any.only") {
          for (const valid of report.local.valids) {
            valids.add(valid);
          }
          continue;
        }
        const [type, code] = report.code.split(".");
        if (code !== "base") {
          complex.push({ type: schema.type, report });
          continue;
        }
        valids.add(type);
      }
      if (!complex.length) {
        return { errors: error("alternatives.types", { types: [...valids] }) };
      }
      if (complex.length === 1) {
        return { errors: complex[0].report };
      }
      return internals.unmatched(failures, error);
    };
    internals.unmatched = function(failures, error) {
      const errors = [];
      for (const failure of failures) {
        errors.push(...failure.reports);
      }
      return { errors: error("alternatives.match", Errors.details(errors, { override: false })) };
    };
  }
});

// node_modules/joi/lib/types/array.js
var require_array = __commonJS({
  "node_modules/joi/lib/types/array.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var DeepEqual = require_deepEqual();
    var Reach = require_reach();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var internals = {};
    module2.exports = Any.extend({
      type: "array",
      flags: {
        single: { default: false },
        sparse: { default: false }
      },
      terms: {
        items: { init: [], manifest: "schema" },
        ordered: { init: [], manifest: "schema" },
        _exclusions: { init: [] },
        _inclusions: { init: [] },
        _requireds: { init: [] }
      },
      coerce: {
        from: "object",
        method(value, { schema, state, prefs }) {
          if (!Array.isArray(value)) {
            return;
          }
          const sort = schema.$_getRule("sort");
          if (!sort) {
            return;
          }
          return internals.sort(schema, value, sort.args.options, state, prefs);
        }
      },
      validate(value, { schema, error }) {
        if (!Array.isArray(value)) {
          if (schema._flags.single) {
            const single = [value];
            single[Common.symbols.arraySingle] = true;
            return { value: single };
          }
          return { errors: error("array.base") };
        }
        if (!schema.$_getRule("items") && !schema.$_terms.externals) {
          return;
        }
        return { value: value.slice() };
      },
      rules: {
        has: {
          method(schema) {
            schema = this.$_compile(schema, { appendPath: true });
            const obj = this.$_addRule({ name: "has", args: { schema } });
            obj.$_mutateRegister(schema);
            return obj;
          },
          validate(value, { state, prefs, error }, { schema: has }) {
            const ancestors = [value, ...state.ancestors];
            for (let i = 0; i < value.length; ++i) {
              const localState = state.localize([...state.path, i], ancestors, has);
              if (has.$_match(value[i], localState, prefs)) {
                return value;
              }
            }
            const patternLabel = has._flags.label;
            if (patternLabel) {
              return error("array.hasKnown", { patternLabel });
            }
            return error("array.hasUnknown", null);
          },
          multi: true
        },
        items: {
          method(...schemas) {
            Common.verifyFlat(schemas, "items");
            const obj = this.$_addRule("items");
            for (let i = 0; i < schemas.length; ++i) {
              const type = Common.tryWithPath(() => this.$_compile(schemas[i]), i, { append: true });
              obj.$_terms.items.push(type);
            }
            return obj.$_mutateRebuild();
          },
          validate(value, { schema, error, state, prefs, errorsArray }) {
            const requireds = schema.$_terms._requireds.slice();
            const ordereds = schema.$_terms.ordered.slice();
            const inclusions = [...schema.$_terms._inclusions, ...requireds];
            const wasArray = !value[Common.symbols.arraySingle];
            delete value[Common.symbols.arraySingle];
            const errors = errorsArray();
            let il = value.length;
            for (let i = 0; i < il; ++i) {
              const item = value[i];
              let errored = false;
              let isValid = false;
              const key = wasArray ? i : new Number(i);
              const path = [...state.path, key];
              if (!schema._flags.sparse && item === void 0) {
                errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                if (prefs.abortEarly) {
                  return errors;
                }
                ordereds.shift();
                continue;
              }
              const ancestors = [value, ...state.ancestors];
              for (const exclusion of schema.$_terms._exclusions) {
                if (!exclusion.$_match(item, state.localize(path, ancestors, exclusion), prefs, { presence: "ignore" })) {
                  continue;
                }
                errors.push(error("array.excludes", { pos: i, value: item }, state.localize(path)));
                if (prefs.abortEarly) {
                  return errors;
                }
                errored = true;
                ordereds.shift();
                break;
              }
              if (errored) {
                continue;
              }
              if (schema.$_terms.ordered.length) {
                if (ordereds.length) {
                  const ordered = ordereds.shift();
                  const res = ordered.$_validate(item, state.localize(path, ancestors, ordered), prefs);
                  if (!res.errors) {
                    if (ordered._flags.result === "strip") {
                      internals.fastSplice(value, i);
                      --i;
                      --il;
                    } else if (!schema._flags.sparse && res.value === void 0) {
                      errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                      if (prefs.abortEarly) {
                        return errors;
                      }
                      continue;
                    } else {
                      value[i] = res.value;
                    }
                  } else {
                    errors.push(...res.errors);
                    if (prefs.abortEarly) {
                      return errors;
                    }
                  }
                  continue;
                } else if (!schema.$_terms.items.length) {
                  errors.push(error("array.orderedLength", { pos: i, limit: schema.$_terms.ordered.length }));
                  if (prefs.abortEarly) {
                    return errors;
                  }
                  break;
                }
              }
              const requiredChecks = [];
              let jl = requireds.length;
              for (let j = 0; j < jl; ++j) {
                const localState = state.localize(path, ancestors, requireds[j]);
                localState.snapshot();
                const res = requireds[j].$_validate(item, localState, prefs);
                requiredChecks[j] = res;
                if (!res.errors) {
                  value[i] = res.value;
                  isValid = true;
                  internals.fastSplice(requireds, j);
                  --j;
                  --jl;
                  if (!schema._flags.sparse && res.value === void 0) {
                    errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                    if (prefs.abortEarly) {
                      return errors;
                    }
                  }
                  break;
                }
                localState.restore();
              }
              if (isValid) {
                continue;
              }
              const stripUnknown = prefs.stripUnknown && !!prefs.stripUnknown.arrays || false;
              jl = inclusions.length;
              for (const inclusion of inclusions) {
                let res;
                const previousCheck = requireds.indexOf(inclusion);
                if (previousCheck !== -1) {
                  res = requiredChecks[previousCheck];
                } else {
                  const localState = state.localize(path, ancestors, inclusion);
                  localState.snapshot();
                  res = inclusion.$_validate(item, localState, prefs);
                  if (!res.errors) {
                    if (inclusion._flags.result === "strip") {
                      internals.fastSplice(value, i);
                      --i;
                      --il;
                    } else if (!schema._flags.sparse && res.value === void 0) {
                      errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                      errored = true;
                    } else {
                      value[i] = res.value;
                    }
                    isValid = true;
                    break;
                  }
                  localState.restore();
                }
                if (jl === 1) {
                  if (stripUnknown) {
                    internals.fastSplice(value, i);
                    --i;
                    --il;
                    isValid = true;
                    break;
                  }
                  errors.push(...res.errors);
                  if (prefs.abortEarly) {
                    return errors;
                  }
                  errored = true;
                  break;
                }
              }
              if (errored) {
                continue;
              }
              if ((schema.$_terms._inclusions.length || schema.$_terms._requireds.length) && !isValid) {
                if (stripUnknown) {
                  internals.fastSplice(value, i);
                  --i;
                  --il;
                  continue;
                }
                errors.push(error("array.includes", { pos: i, value: item }, state.localize(path)));
                if (prefs.abortEarly) {
                  return errors;
                }
              }
            }
            if (requireds.length) {
              internals.fillMissedErrors(schema, errors, requireds, value, state, prefs);
            }
            if (ordereds.length) {
              internals.fillOrderedErrors(schema, errors, ordereds, value, state, prefs);
              if (!errors.length) {
                internals.fillDefault(ordereds, value, state, prefs);
              }
            }
            return errors.length ? errors : value;
          },
          priority: true,
          manifest: false
        },
        length: {
          method(limit) {
            return this.$_addRule({ name: "length", args: { limit }, operator: "=" });
          },
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(value.length, limit, operator)) {
              return value;
            }
            return helpers.error("array." + name, { limit: args.limit, value });
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            }
          ]
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "length", args: { limit }, operator: "<=" });
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "length", args: { limit }, operator: ">=" });
          }
        },
        ordered: {
          method(...schemas) {
            Common.verifyFlat(schemas, "ordered");
            const obj = this.$_addRule("items");
            for (let i = 0; i < schemas.length; ++i) {
              const type = Common.tryWithPath(() => this.$_compile(schemas[i]), i, { append: true });
              internals.validateSingle(type, obj);
              obj.$_mutateRegister(type);
              obj.$_terms.ordered.push(type);
            }
            return obj.$_mutateRebuild();
          }
        },
        single: {
          method(enabled) {
            const value = enabled === void 0 ? true : !!enabled;
            Assert(!value || !this._flags._arrayItems, "Cannot specify single rule when array has array items");
            return this.$_setFlag("single", value);
          }
        },
        sort: {
          method(options = {}) {
            Common.assertOptions(options, ["by", "order"]);
            const settings = {
              order: options.order || "ascending"
            };
            if (options.by) {
              settings.by = Compile.ref(options.by, { ancestor: 0 });
              Assert(!settings.by.ancestor, "Cannot sort by ancestor");
            }
            return this.$_addRule({ name: "sort", args: { options: settings } });
          },
          validate(value, { error, state, prefs, schema }, { options }) {
            const { value: sorted, errors } = internals.sort(schema, value, options, state, prefs);
            if (errors) {
              return errors;
            }
            for (let i = 0; i < value.length; ++i) {
              if (value[i] !== sorted[i]) {
                return error("array.sort", { order: options.order, by: options.by ? options.by.key : "value" });
              }
            }
            return value;
          },
          convert: true
        },
        sparse: {
          method(enabled) {
            const value = enabled === void 0 ? true : !!enabled;
            if (this._flags.sparse === value) {
              return this;
            }
            const obj = value ? this.clone() : this.$_addRule("items");
            return obj.$_setFlag("sparse", value, { clone: false });
          }
        },
        unique: {
          method(comparator, options = {}) {
            Assert(!comparator || typeof comparator === "function" || typeof comparator === "string", "comparator must be a function or a string");
            Common.assertOptions(options, ["ignoreUndefined", "separator"]);
            const rule = { name: "unique", args: { options, comparator } };
            if (comparator) {
              if (typeof comparator === "string") {
                const separator = Common.default(options.separator, ".");
                rule.path = separator ? comparator.split(separator) : [comparator];
              } else {
                rule.comparator = comparator;
              }
            }
            return this.$_addRule(rule);
          },
          validate(value, { state, error, schema }, { comparator: raw, options }, { comparator, path }) {
            const found = {
              string: Object.create(null),
              number: Object.create(null),
              undefined: Object.create(null),
              boolean: Object.create(null),
              object: /* @__PURE__ */ new Map(),
              function: /* @__PURE__ */ new Map(),
              custom: /* @__PURE__ */ new Map()
            };
            const compare = comparator || DeepEqual;
            const ignoreUndefined = options.ignoreUndefined;
            for (let i = 0; i < value.length; ++i) {
              const item = path ? Reach(value[i], path) : value[i];
              const records = comparator ? found.custom : found[typeof item];
              Assert(records, "Failed to find unique map container for type", typeof item);
              if (records instanceof Map) {
                const entries = records.entries();
                let current;
                while (!(current = entries.next()).done) {
                  if (compare(current.value[0], item)) {
                    const localState = state.localize([...state.path, i], [value, ...state.ancestors]);
                    const context = {
                      pos: i,
                      value: value[i],
                      dupePos: current.value[1],
                      dupeValue: value[current.value[1]]
                    };
                    if (path) {
                      context.path = raw;
                    }
                    return error("array.unique", context, localState);
                  }
                }
                records.set(item, i);
              } else {
                if ((!ignoreUndefined || item !== void 0) && records[item] !== void 0) {
                  const context = {
                    pos: i,
                    value: value[i],
                    dupePos: records[item],
                    dupeValue: value[records[item]]
                  };
                  if (path) {
                    context.path = raw;
                  }
                  const localState = state.localize([...state.path, i], [value, ...state.ancestors]);
                  return error("array.unique", context, localState);
                }
                records[item] = i;
              }
            }
            return value;
          },
          args: ["comparator", "options"],
          multi: true
        }
      },
      cast: {
        set: {
          from: Array.isArray,
          to(value, helpers) {
            return new Set(value);
          }
        }
      },
      rebuild(schema) {
        schema.$_terms._inclusions = [];
        schema.$_terms._exclusions = [];
        schema.$_terms._requireds = [];
        for (const type of schema.$_terms.items) {
          internals.validateSingle(type, schema);
          if (type._flags.presence === "required") {
            schema.$_terms._requireds.push(type);
          } else if (type._flags.presence === "forbidden") {
            schema.$_terms._exclusions.push(type);
          } else {
            schema.$_terms._inclusions.push(type);
          }
        }
        for (const type of schema.$_terms.ordered) {
          internals.validateSingle(type, schema);
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.items) {
            obj = obj.items(...desc.items);
          }
          if (desc.ordered) {
            obj = obj.ordered(...desc.ordered);
          }
          return obj;
        }
      },
      messages: {
        "array.base": "{{#label}} must be an array",
        "array.excludes": "{{#label}} contains an excluded value",
        "array.hasKnown": "{{#label}} does not contain at least one required match for type {:#patternLabel}",
        "array.hasUnknown": "{{#label}} does not contain at least one required match",
        "array.includes": "{{#label}} does not match any of the allowed types",
        "array.includesRequiredBoth": "{{#label}} does not contain {{#knownMisses}} and {{#unknownMisses}} other required value(s)",
        "array.includesRequiredKnowns": "{{#label}} does not contain {{#knownMisses}}",
        "array.includesRequiredUnknowns": "{{#label}} does not contain {{#unknownMisses}} required value(s)",
        "array.length": "{{#label}} must contain {{#limit}} items",
        "array.max": "{{#label}} must contain less than or equal to {{#limit}} items",
        "array.min": "{{#label}} must contain at least {{#limit}} items",
        "array.orderedLength": "{{#label}} must contain at most {{#limit}} items",
        "array.sort": "{{#label}} must be sorted in {#order} order by {{#by}}",
        "array.sort.mismatching": "{{#label}} cannot be sorted due to mismatching types",
        "array.sort.unsupported": "{{#label}} cannot be sorted due to unsupported type {#type}",
        "array.sparse": "{{#label}} must not be a sparse array item",
        "array.unique": "{{#label}} contains a duplicate value"
      }
    });
    internals.fillMissedErrors = function(schema, errors, requireds, value, state, prefs) {
      const knownMisses = [];
      let unknownMisses = 0;
      for (const required of requireds) {
        const label = required._flags.label;
        if (label) {
          knownMisses.push(label);
        } else {
          ++unknownMisses;
        }
      }
      if (knownMisses.length) {
        if (unknownMisses) {
          errors.push(schema.$_createError("array.includesRequiredBoth", value, { knownMisses, unknownMisses }, state, prefs));
        } else {
          errors.push(schema.$_createError("array.includesRequiredKnowns", value, { knownMisses }, state, prefs));
        }
      } else {
        errors.push(schema.$_createError("array.includesRequiredUnknowns", value, { unknownMisses }, state, prefs));
      }
    };
    internals.fillOrderedErrors = function(schema, errors, ordereds, value, state, prefs) {
      const requiredOrdereds = [];
      for (const ordered of ordereds) {
        if (ordered._flags.presence === "required") {
          requiredOrdereds.push(ordered);
        }
      }
      if (requiredOrdereds.length) {
        internals.fillMissedErrors(schema, errors, requiredOrdereds, value, state, prefs);
      }
    };
    internals.fillDefault = function(ordereds, value, state, prefs) {
      const overrides = [];
      let trailingUndefined = true;
      for (let i = ordereds.length - 1; i >= 0; --i) {
        const ordered = ordereds[i];
        const ancestors = [value, ...state.ancestors];
        const override = ordered.$_validate(void 0, state.localize(state.path, ancestors, ordered), prefs).value;
        if (trailingUndefined) {
          if (override === void 0) {
            continue;
          }
          trailingUndefined = false;
        }
        overrides.unshift(override);
      }
      if (overrides.length) {
        value.push(...overrides);
      }
    };
    internals.fastSplice = function(arr, i) {
      let pos = i;
      while (pos < arr.length) {
        arr[pos++] = arr[pos];
      }
      --arr.length;
    };
    internals.validateSingle = function(type, obj) {
      if (type.type === "array" || type._flags._arrayItems) {
        Assert(!obj._flags.single, "Cannot specify array item with single rule enabled");
        obj.$_setFlag("_arrayItems", true, { clone: false });
      }
    };
    internals.sort = function(schema, value, settings, state, prefs) {
      const order = settings.order === "ascending" ? 1 : -1;
      const aFirst = -1 * order;
      const bFirst = order;
      const sort = (a, b) => {
        let compare = internals.compare(a, b, aFirst, bFirst);
        if (compare !== null) {
          return compare;
        }
        if (settings.by) {
          a = settings.by.resolve(a, state, prefs);
          b = settings.by.resolve(b, state, prefs);
        }
        compare = internals.compare(a, b, aFirst, bFirst);
        if (compare !== null) {
          return compare;
        }
        const type = typeof a;
        if (type !== typeof b) {
          throw schema.$_createError("array.sort.mismatching", value, null, state, prefs);
        }
        if (type !== "number" && type !== "string") {
          throw schema.$_createError("array.sort.unsupported", value, { type }, state, prefs);
        }
        if (type === "number") {
          return (a - b) * order;
        }
        return a < b ? aFirst : bFirst;
      };
      try {
        return { value: value.slice().sort(sort) };
      } catch (err) {
        return { errors: err };
      }
    };
    internals.compare = function(a, b, aFirst, bFirst) {
      if (a === b) {
        return 0;
      }
      if (a === void 0) {
        return 1;
      }
      if (b === void 0) {
        return -1;
      }
      if (a === null) {
        return bFirst;
      }
      if (b === null) {
        return aFirst;
      }
      return null;
    };
  }
});

// node_modules/joi/lib/types/boolean.js
var require_boolean = __commonJS({
  "node_modules/joi/lib/types/boolean.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Any = require_any();
    var Common = require_common();
    var Values = require_values();
    var internals = {};
    internals.isBool = function(value) {
      return typeof value === "boolean";
    };
    module2.exports = Any.extend({
      type: "boolean",
      flags: {
        sensitive: { default: false }
      },
      terms: {
        falsy: {
          init: null,
          manifest: "values"
        },
        truthy: {
          init: null,
          manifest: "values"
        }
      },
      coerce(value, { schema }) {
        if (typeof value === "boolean") {
          return;
        }
        if (typeof value === "string") {
          const normalized = schema._flags.sensitive ? value : value.toLowerCase();
          value = normalized === "true" ? true : normalized === "false" ? false : value;
        }
        if (typeof value !== "boolean") {
          value = schema.$_terms.truthy && schema.$_terms.truthy.has(value, null, null, !schema._flags.sensitive) || (schema.$_terms.falsy && schema.$_terms.falsy.has(value, null, null, !schema._flags.sensitive) ? false : value);
        }
        return { value };
      },
      validate(value, { error }) {
        if (typeof value !== "boolean") {
          return { value, errors: error("boolean.base") };
        }
      },
      rules: {
        truthy: {
          method(...values) {
            Common.verifyFlat(values, "truthy");
            const obj = this.clone();
            obj.$_terms.truthy = obj.$_terms.truthy || new Values();
            for (let i = 0; i < values.length; ++i) {
              const value = values[i];
              Assert(value !== void 0, "Cannot call truthy with undefined");
              obj.$_terms.truthy.add(value);
            }
            return obj;
          }
        },
        falsy: {
          method(...values) {
            Common.verifyFlat(values, "falsy");
            const obj = this.clone();
            obj.$_terms.falsy = obj.$_terms.falsy || new Values();
            for (let i = 0; i < values.length; ++i) {
              const value = values[i];
              Assert(value !== void 0, "Cannot call falsy with undefined");
              obj.$_terms.falsy.add(value);
            }
            return obj;
          }
        },
        sensitive: {
          method(enabled = true) {
            return this.$_setFlag("sensitive", enabled);
          }
        }
      },
      cast: {
        number: {
          from: internals.isBool,
          to(value, helpers) {
            return value ? 1 : 0;
          }
        },
        string: {
          from: internals.isBool,
          to(value, helpers) {
            return value ? "true" : "false";
          }
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.truthy) {
            obj = obj.truthy(...desc.truthy);
          }
          if (desc.falsy) {
            obj = obj.falsy(...desc.falsy);
          }
          return obj;
        }
      },
      messages: {
        "boolean.base": "{{#label}} must be a boolean"
      }
    });
  }
});

// node_modules/joi/lib/types/date.js
var require_date = __commonJS({
  "node_modules/joi/lib/types/date.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Any = require_any();
    var Common = require_common();
    var Template = require_template();
    var internals = {};
    internals.isDate = function(value) {
      return value instanceof Date;
    };
    module2.exports = Any.extend({
      type: "date",
      coerce: {
        from: ["number", "string"],
        method(value, { schema }) {
          return { value: internals.parse(value, schema._flags.format) || value };
        }
      },
      validate(value, { schema, error, prefs }) {
        if (value instanceof Date && !isNaN(value.getTime())) {
          return;
        }
        const format = schema._flags.format;
        if (!prefs.convert || !format || typeof value !== "string") {
          return { value, errors: error("date.base") };
        }
        return { value, errors: error("date.format", { format }) };
      },
      rules: {
        compare: {
          method: false,
          validate(value, helpers, { date }, { name, operator, args }) {
            const to = date === "now" ? Date.now() : date.getTime();
            if (Common.compare(value.getTime(), to, operator)) {
              return value;
            }
            return helpers.error("date." + name, { limit: args.date, value });
          },
          args: [
            {
              name: "date",
              ref: true,
              normalize: (date) => {
                return date === "now" ? date : internals.parse(date);
              },
              assert: (date) => date !== null,
              message: "must have a valid date format"
            }
          ]
        },
        format: {
          method(format) {
            Assert(["iso", "javascript", "unix"].includes(format), "Unknown date format", format);
            return this.$_setFlag("format", format);
          }
        },
        greater: {
          method(date) {
            return this.$_addRule({ name: "greater", method: "compare", args: { date }, operator: ">" });
          }
        },
        iso: {
          method() {
            return this.format("iso");
          }
        },
        less: {
          method(date) {
            return this.$_addRule({ name: "less", method: "compare", args: { date }, operator: "<" });
          }
        },
        max: {
          method(date) {
            return this.$_addRule({ name: "max", method: "compare", args: { date }, operator: "<=" });
          }
        },
        min: {
          method(date) {
            return this.$_addRule({ name: "min", method: "compare", args: { date }, operator: ">=" });
          }
        },
        timestamp: {
          method(type = "javascript") {
            Assert(["javascript", "unix"].includes(type), '"type" must be one of "javascript, unix"');
            return this.format(type);
          }
        }
      },
      cast: {
        number: {
          from: internals.isDate,
          to(value, helpers) {
            return value.getTime();
          }
        },
        string: {
          from: internals.isDate,
          to(value, { prefs }) {
            return Template.date(value, prefs);
          }
        }
      },
      messages: {
        "date.base": "{{#label}} must be a valid date",
        "date.format": '{{#label}} must be in {msg("date.format." + #format) || #format} format',
        "date.greater": "{{#label}} must be greater than {{:#limit}}",
        "date.less": "{{#label}} must be less than {{:#limit}}",
        "date.max": "{{#label}} must be less than or equal to {{:#limit}}",
        "date.min": "{{#label}} must be greater than or equal to {{:#limit}}",
        "date.format.iso": "ISO 8601 date",
        "date.format.javascript": "timestamp or number of milliseconds",
        "date.format.unix": "timestamp or number of seconds"
      }
    });
    internals.parse = function(value, format) {
      if (value instanceof Date) {
        return value;
      }
      if (typeof value !== "string" && (isNaN(value) || !isFinite(value))) {
        return null;
      }
      if (/^\s*$/.test(value)) {
        return null;
      }
      if (format === "iso") {
        if (!Common.isIsoDate(value)) {
          return null;
        }
        return internals.date(value.toString());
      }
      const original = value;
      if (typeof value === "string" && /^[+-]?\d+(\.\d+)?$/.test(value)) {
        value = parseFloat(value);
      }
      if (format) {
        if (format === "javascript") {
          return internals.date(1 * value);
        }
        if (format === "unix") {
          return internals.date(1e3 * value);
        }
        if (typeof original === "string") {
          return null;
        }
      }
      return internals.date(value);
    };
    internals.date = function(value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
      return null;
    };
  }
});

// node_modules/@hapi/hoek/lib/applyToDefaults.js
var require_applyToDefaults = __commonJS({
  "node_modules/@hapi/hoek/lib/applyToDefaults.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Merge = require_merge();
    var Reach = require_reach();
    var internals = {};
    module2.exports = function(defaults, source, options = {}) {
      Assert(defaults && typeof defaults === "object", "Invalid defaults value: must be an object");
      Assert(!source || source === true || typeof source === "object", "Invalid source value: must be true, falsy or an object");
      Assert(typeof options === "object", "Invalid options: must be an object");
      if (!source) {
        return null;
      }
      if (options.shallow) {
        return internals.applyToDefaultsWithShallow(defaults, source, options);
      }
      const copy = Clone(defaults);
      if (source === true) {
        return copy;
      }
      const nullOverride = options.nullOverride !== void 0 ? options.nullOverride : false;
      return Merge(copy, source, { nullOverride, mergeArrays: false });
    };
    internals.applyToDefaultsWithShallow = function(defaults, source, options) {
      const keys = options.shallow;
      Assert(Array.isArray(keys), "Invalid keys");
      const seen = /* @__PURE__ */ new Map();
      const merge = source === true ? null : /* @__PURE__ */ new Set();
      for (let key of keys) {
        key = Array.isArray(key) ? key : key.split(".");
        const ref = Reach(defaults, key);
        if (ref && typeof ref === "object") {
          seen.set(ref, merge && Reach(source, key) || ref);
        } else if (merge) {
          merge.add(key);
        }
      }
      const copy = Clone(defaults, {}, seen);
      if (!merge) {
        return copy;
      }
      for (const key of merge) {
        internals.reachCopy(copy, source, key);
      }
      const nullOverride = options.nullOverride !== void 0 ? options.nullOverride : false;
      return Merge(copy, source, { nullOverride, mergeArrays: false });
    };
    internals.reachCopy = function(dst, src, path) {
      for (const segment of path) {
        if (!(segment in src)) {
          return;
        }
        const val = src[segment];
        if (typeof val !== "object" || val === null) {
          return;
        }
        src = val;
      }
      const value = src;
      let ref = dst;
      for (let i = 0; i < path.length - 1; ++i) {
        const segment = path[i];
        if (typeof ref[segment] !== "object") {
          ref[segment] = {};
        }
        ref = ref[segment];
      }
      ref[path[path.length - 1]] = value;
    };
  }
});

// node_modules/@hapi/topo/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/@hapi/topo/lib/index.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var internals = {};
    exports.Sorter = class {
      constructor() {
        this._items = [];
        this.nodes = [];
      }
      add(nodes, options) {
        options = options || {};
        const before = [].concat(options.before || []);
        const after = [].concat(options.after || []);
        const group = options.group || "?";
        const sort = options.sort || 0;
        Assert(!before.includes(group), `Item cannot come before itself: ${group}`);
        Assert(!before.includes("?"), "Item cannot come before unassociated items");
        Assert(!after.includes(group), `Item cannot come after itself: ${group}`);
        Assert(!after.includes("?"), "Item cannot come after unassociated items");
        if (!Array.isArray(nodes)) {
          nodes = [nodes];
        }
        for (const node of nodes) {
          const item = {
            seq: this._items.length,
            sort,
            before,
            after,
            group,
            node
          };
          this._items.push(item);
        }
        if (!options.manual) {
          const valid = this._sort();
          Assert(valid, "item", group !== "?" ? `added into group ${group}` : "", "created a dependencies error");
        }
        return this.nodes;
      }
      merge(others) {
        if (!Array.isArray(others)) {
          others = [others];
        }
        for (const other of others) {
          if (other) {
            for (const item of other._items) {
              this._items.push(Object.assign({}, item));
            }
          }
        }
        this._items.sort(internals.mergeSort);
        for (let i = 0; i < this._items.length; ++i) {
          this._items[i].seq = i;
        }
        const valid = this._sort();
        Assert(valid, "merge created a dependencies error");
        return this.nodes;
      }
      sort() {
        const valid = this._sort();
        Assert(valid, "sort created a dependencies error");
        return this.nodes;
      }
      _sort() {
        const graph = {};
        const graphAfters = Object.create(null);
        const groups = Object.create(null);
        for (const item of this._items) {
          const seq = item.seq;
          const group = item.group;
          groups[group] = groups[group] || [];
          groups[group].push(seq);
          graph[seq] = item.before;
          for (const after of item.after) {
            graphAfters[after] = graphAfters[after] || [];
            graphAfters[after].push(seq);
          }
        }
        for (const node in graph) {
          const expandedGroups = [];
          for (const graphNodeItem in graph[node]) {
            const group = graph[node][graphNodeItem];
            groups[group] = groups[group] || [];
            expandedGroups.push(...groups[group]);
          }
          graph[node] = expandedGroups;
        }
        for (const group in graphAfters) {
          if (groups[group]) {
            for (const node of groups[group]) {
              graph[node].push(...graphAfters[group]);
            }
          }
        }
        const ancestors = {};
        for (const node in graph) {
          const children = graph[node];
          for (const child of children) {
            ancestors[child] = ancestors[child] || [];
            ancestors[child].push(node);
          }
        }
        const visited = {};
        const sorted = [];
        for (let i = 0; i < this._items.length; ++i) {
          let next = i;
          if (ancestors[i]) {
            next = null;
            for (let j = 0; j < this._items.length; ++j) {
              if (visited[j] === true) {
                continue;
              }
              if (!ancestors[j]) {
                ancestors[j] = [];
              }
              const shouldSeeCount = ancestors[j].length;
              let seenCount = 0;
              for (let k = 0; k < shouldSeeCount; ++k) {
                if (visited[ancestors[j][k]]) {
                  ++seenCount;
                }
              }
              if (seenCount === shouldSeeCount) {
                next = j;
                break;
              }
            }
          }
          if (next !== null) {
            visited[next] = true;
            sorted.push(next);
          }
        }
        if (sorted.length !== this._items.length) {
          return false;
        }
        const seqIndex = {};
        for (const item of this._items) {
          seqIndex[item.seq] = item;
        }
        this._items = [];
        this.nodes = [];
        for (const value of sorted) {
          const sortedItem = seqIndex[value];
          this.nodes.push(sortedItem.node);
          this._items.push(sortedItem);
        }
        return true;
      }
    };
    internals.mergeSort = (a, b) => {
      return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
    };
  }
});

// node_modules/joi/lib/types/keys.js
var require_keys = __commonJS({
  "node_modules/joi/lib/types/keys.js"(exports, module2) {
    "use strict";
    var ApplyToDefaults = require_applyToDefaults();
    var Assert = require_assert();
    var Clone = require_clone();
    var Topo = require_lib3();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Ref = require_ref();
    var Template = require_template();
    var internals = {
      renameDefaults: {
        alias: false,
        multiple: false,
        override: false
      }
    };
    module2.exports = Any.extend({
      type: "_keys",
      properties: {
        typeof: "object"
      },
      flags: {
        unknown: { default: false }
      },
      terms: {
        dependencies: { init: null },
        keys: { init: null, manifest: { mapped: { from: "schema", to: "key" } } },
        patterns: { init: null },
        renames: { init: null }
      },
      args(schema, keys) {
        return schema.keys(keys);
      },
      validate(value, { schema, error, state, prefs }) {
        if (!value || typeof value !== schema.$_property("typeof") || Array.isArray(value)) {
          return { value, errors: error("object.base", { type: schema.$_property("typeof") }) };
        }
        if (!schema.$_terms.renames && !schema.$_terms.dependencies && !schema.$_terms.keys && !schema.$_terms.patterns && !schema.$_terms.externals) {
          return;
        }
        value = internals.clone(value, prefs);
        const errors = [];
        if (schema.$_terms.renames && !internals.rename(schema, value, state, prefs, errors)) {
          return { value, errors };
        }
        if (!schema.$_terms.keys && !schema.$_terms.patterns && !schema.$_terms.dependencies) {
          return { value, errors };
        }
        const unprocessed = new Set(Object.keys(value));
        if (schema.$_terms.keys) {
          const ancestors = [value, ...state.ancestors];
          for (const child of schema.$_terms.keys) {
            const key = child.key;
            const item = value[key];
            unprocessed.delete(key);
            const localState = state.localize([...state.path, key], ancestors, child);
            const result = child.schema.$_validate(item, localState, prefs);
            if (result.errors) {
              if (prefs.abortEarly) {
                return { value, errors: result.errors };
              }
              if (result.value !== void 0) {
                value[key] = result.value;
              }
              errors.push(...result.errors);
            } else if (child.schema._flags.result === "strip" || result.value === void 0 && item !== void 0) {
              delete value[key];
            } else if (result.value !== void 0) {
              value[key] = result.value;
            }
          }
        }
        if (unprocessed.size || schema._flags._hasPatternMatch) {
          const early = internals.unknown(schema, value, unprocessed, errors, state, prefs);
          if (early) {
            return early;
          }
        }
        if (schema.$_terms.dependencies) {
          for (const dep of schema.$_terms.dependencies) {
            if (dep.key && dep.key.resolve(value, state, prefs, null, { shadow: false }) === void 0) {
              continue;
            }
            const failed = internals.dependencies[dep.rel](schema, dep, value, state, prefs);
            if (failed) {
              const report = schema.$_createError(failed.code, value, failed.context, state, prefs);
              if (prefs.abortEarly) {
                return { value, errors: report };
              }
              errors.push(report);
            }
          }
        }
        return { value, errors };
      },
      rules: {
        and: {
          method(...peers) {
            Common.verifyFlat(peers, "and");
            return internals.dependency(this, "and", null, peers);
          }
        },
        append: {
          method(schema) {
            if (schema === null || schema === void 0 || Object.keys(schema).length === 0) {
              return this;
            }
            return this.keys(schema);
          }
        },
        assert: {
          method(subject, schema, message) {
            if (!Template.isTemplate(subject)) {
              subject = Compile.ref(subject);
            }
            Assert(message === void 0 || typeof message === "string", "Message must be a string");
            schema = this.$_compile(schema, { appendPath: true });
            const obj = this.$_addRule({ name: "assert", args: { subject, schema, message } });
            obj.$_mutateRegister(subject);
            obj.$_mutateRegister(schema);
            return obj;
          },
          validate(value, { error, prefs, state }, { subject, schema, message }) {
            const about = subject.resolve(value, state, prefs);
            const path = Ref.isRef(subject) ? subject.absolute(state) : [];
            if (schema.$_match(about, state.localize(path, [value, ...state.ancestors], schema), prefs)) {
              return value;
            }
            return error("object.assert", { subject, message });
          },
          args: ["subject", "schema", "message"],
          multi: true
        },
        instance: {
          method(constructor, name) {
            Assert(typeof constructor === "function", "constructor must be a function");
            name = name || constructor.name;
            return this.$_addRule({ name: "instance", args: { constructor, name } });
          },
          validate(value, helpers, { constructor, name }) {
            if (value instanceof constructor) {
              return value;
            }
            return helpers.error("object.instance", { type: name, value });
          },
          args: ["constructor", "name"]
        },
        keys: {
          method(schema) {
            Assert(schema === void 0 || typeof schema === "object", "Object schema must be a valid object");
            Assert(!Common.isSchema(schema), "Object schema cannot be a joi schema");
            const obj = this.clone();
            if (!schema) {
              obj.$_terms.keys = null;
            } else if (!Object.keys(schema).length) {
              obj.$_terms.keys = new internals.Keys();
            } else {
              obj.$_terms.keys = obj.$_terms.keys ? obj.$_terms.keys.filter((child) => !schema.hasOwnProperty(child.key)) : new internals.Keys();
              for (const key in schema) {
                Common.tryWithPath(() => obj.$_terms.keys.push({ key, schema: this.$_compile(schema[key]) }), key);
              }
            }
            return obj.$_mutateRebuild();
          }
        },
        length: {
          method(limit) {
            return this.$_addRule({ name: "length", args: { limit }, operator: "=" });
          },
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(Object.keys(value).length, limit, operator)) {
              return value;
            }
            return helpers.error("object." + name, { limit: args.limit, value });
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            }
          ]
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "length", args: { limit }, operator: "<=" });
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "length", args: { limit }, operator: ">=" });
          }
        },
        nand: {
          method(...peers) {
            Common.verifyFlat(peers, "nand");
            return internals.dependency(this, "nand", null, peers);
          }
        },
        or: {
          method(...peers) {
            Common.verifyFlat(peers, "or");
            return internals.dependency(this, "or", null, peers);
          }
        },
        oxor: {
          method(...peers) {
            return internals.dependency(this, "oxor", null, peers);
          }
        },
        pattern: {
          method(pattern, schema, options = {}) {
            const isRegExp = pattern instanceof RegExp;
            if (!isRegExp) {
              pattern = this.$_compile(pattern, { appendPath: true });
            }
            Assert(schema !== void 0, "Invalid rule");
            Common.assertOptions(options, ["fallthrough", "matches"]);
            if (isRegExp) {
              Assert(!pattern.flags.includes("g") && !pattern.flags.includes("y"), "pattern should not use global or sticky mode");
            }
            schema = this.$_compile(schema, { appendPath: true });
            const obj = this.clone();
            obj.$_terms.patterns = obj.$_terms.patterns || [];
            const config = { [isRegExp ? "regex" : "schema"]: pattern, rule: schema };
            if (options.matches) {
              config.matches = this.$_compile(options.matches);
              if (config.matches.type !== "array") {
                config.matches = config.matches.$_root.array().items(config.matches);
              }
              obj.$_mutateRegister(config.matches);
              obj.$_setFlag("_hasPatternMatch", true, { clone: false });
            }
            if (options.fallthrough) {
              config.fallthrough = true;
            }
            obj.$_terms.patterns.push(config);
            obj.$_mutateRegister(schema);
            return obj;
          }
        },
        ref: {
          method() {
            return this.$_addRule("ref");
          },
          validate(value, helpers) {
            if (Ref.isRef(value)) {
              return value;
            }
            return helpers.error("object.refType", { value });
          }
        },
        regex: {
          method() {
            return this.$_addRule("regex");
          },
          validate(value, helpers) {
            if (value instanceof RegExp) {
              return value;
            }
            return helpers.error("object.regex", { value });
          }
        },
        rename: {
          method(from, to, options = {}) {
            Assert(typeof from === "string" || from instanceof RegExp, "Rename missing the from argument");
            Assert(typeof to === "string" || to instanceof Template, "Invalid rename to argument");
            Assert(to !== from, "Cannot rename key to same name:", from);
            Common.assertOptions(options, ["alias", "ignoreUndefined", "override", "multiple"]);
            const obj = this.clone();
            obj.$_terms.renames = obj.$_terms.renames || [];
            for (const rename of obj.$_terms.renames) {
              Assert(rename.from !== from, "Cannot rename the same key multiple times");
            }
            if (to instanceof Template) {
              obj.$_mutateRegister(to);
            }
            obj.$_terms.renames.push({
              from,
              to,
              options: ApplyToDefaults(internals.renameDefaults, options)
            });
            return obj;
          }
        },
        schema: {
          method(type = "any") {
            return this.$_addRule({ name: "schema", args: { type } });
          },
          validate(value, helpers, { type }) {
            if (Common.isSchema(value) && (type === "any" || value.type === type)) {
              return value;
            }
            return helpers.error("object.schema", { type });
          }
        },
        unknown: {
          method(allow) {
            return this.$_setFlag("unknown", allow !== false);
          }
        },
        with: {
          method(key, peers, options = {}) {
            return internals.dependency(this, "with", key, peers, options);
          }
        },
        without: {
          method(key, peers, options = {}) {
            return internals.dependency(this, "without", key, peers, options);
          }
        },
        xor: {
          method(...peers) {
            Common.verifyFlat(peers, "xor");
            return internals.dependency(this, "xor", null, peers);
          }
        }
      },
      overrides: {
        default(value, options) {
          if (value === void 0) {
            value = Common.symbols.deepDefault;
          }
          return this.$_parent("default", value, options);
        }
      },
      rebuild(schema) {
        if (schema.$_terms.keys) {
          const topo = new Topo.Sorter();
          for (const child of schema.$_terms.keys) {
            Common.tryWithPath(() => topo.add(child, { after: child.schema.$_rootReferences(), group: child.key }), child.key);
          }
          schema.$_terms.keys = new internals.Keys(...topo.nodes);
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.keys) {
            obj = obj.keys(desc.keys);
          }
          if (desc.dependencies) {
            for (const { rel, key = null, peers, options } of desc.dependencies) {
              obj = internals.dependency(obj, rel, key, peers, options);
            }
          }
          if (desc.patterns) {
            for (const { regex, schema, rule, fallthrough, matches } of desc.patterns) {
              obj = obj.pattern(regex || schema, rule, { fallthrough, matches });
            }
          }
          if (desc.renames) {
            for (const { from, to, options } of desc.renames) {
              obj = obj.rename(from, to, options);
            }
          }
          return obj;
        }
      },
      messages: {
        "object.and": "{{#label}} contains {{#presentWithLabels}} without its required peers {{#missingWithLabels}}",
        "object.assert": '{{#label}} is invalid because {if(#subject.key, `"` + #subject.key + `" failed to ` + (#message || "pass the assertion test"), #message || "the assertion failed")}',
        "object.base": "{{#label}} must be of type {{#type}}",
        "object.instance": "{{#label}} must be an instance of {{:#type}}",
        "object.length": '{{#label}} must have {{#limit}} key{if(#limit == 1, "", "s")}',
        "object.max": '{{#label}} must have less than or equal to {{#limit}} key{if(#limit == 1, "", "s")}',
        "object.min": '{{#label}} must have at least {{#limit}} key{if(#limit == 1, "", "s")}',
        "object.missing": "{{#label}} must contain at least one of {{#peersWithLabels}}",
        "object.nand": "{{:#mainWithLabel}} must not exist simultaneously with {{#peersWithLabels}}",
        "object.oxor": "{{#label}} contains a conflict between optional exclusive peers {{#peersWithLabels}}",
        "object.pattern.match": "{{#label}} keys failed to match pattern requirements",
        "object.refType": "{{#label}} must be a Joi reference",
        "object.regex": "{{#label}} must be a RegExp object",
        "object.rename.multiple": "{{#label}} cannot rename {{:#from}} because multiple renames are disabled and another key was already renamed to {{:#to}}",
        "object.rename.override": "{{#label}} cannot rename {{:#from}} because override is disabled and target {{:#to}} exists",
        "object.schema": "{{#label}} must be a Joi schema of {{#type}} type",
        "object.unknown": "{{#label}} is not allowed",
        "object.with": "{{:#mainWithLabel}} missing required peer {{:#peerWithLabel}}",
        "object.without": "{{:#mainWithLabel}} conflict with forbidden peer {{:#peerWithLabel}}",
        "object.xor": "{{#label}} contains a conflict between exclusive peers {{#peersWithLabels}}"
      }
    });
    internals.clone = function(value, prefs) {
      if (typeof value === "object") {
        if (prefs.nonEnumerables) {
          return Clone(value, { shallow: true });
        }
        const clone2 = Object.create(Object.getPrototypeOf(value));
        Object.assign(clone2, value);
        return clone2;
      }
      const clone = function(...args) {
        return value.apply(this, args);
      };
      clone.prototype = Clone(value.prototype);
      Object.defineProperty(clone, "name", { value: value.name, writable: false });
      Object.defineProperty(clone, "length", { value: value.length, writable: false });
      Object.assign(clone, value);
      return clone;
    };
    internals.dependency = function(schema, rel, key, peers, options) {
      Assert(key === null || typeof key === "string", rel, "key must be a strings");
      if (!options) {
        options = peers.length > 1 && typeof peers[peers.length - 1] === "object" ? peers.pop() : {};
      }
      Common.assertOptions(options, ["separator"]);
      peers = [].concat(peers);
      const separator = Common.default(options.separator, ".");
      const paths = [];
      for (const peer of peers) {
        Assert(typeof peer === "string", rel, "peers must be strings");
        paths.push(Compile.ref(peer, { separator, ancestor: 0, prefix: false }));
      }
      if (key !== null) {
        key = Compile.ref(key, { separator, ancestor: 0, prefix: false });
      }
      const obj = schema.clone();
      obj.$_terms.dependencies = obj.$_terms.dependencies || [];
      obj.$_terms.dependencies.push(new internals.Dependency(rel, key, paths, peers));
      return obj;
    };
    internals.dependencies = {
      and(schema, dep, value, state, prefs) {
        const missing = [];
        const present = [];
        const count = dep.peers.length;
        for (const peer of dep.peers) {
          if (peer.resolve(value, state, prefs, null, { shadow: false }) === void 0) {
            missing.push(peer.key);
          } else {
            present.push(peer.key);
          }
        }
        if (missing.length !== count && present.length !== count) {
          return {
            code: "object.and",
            context: {
              present,
              presentWithLabels: internals.keysToLabels(schema, present),
              missing,
              missingWithLabels: internals.keysToLabels(schema, missing)
            }
          };
        }
      },
      nand(schema, dep, value, state, prefs) {
        const present = [];
        for (const peer of dep.peers) {
          if (peer.resolve(value, state, prefs, null, { shadow: false }) !== void 0) {
            present.push(peer.key);
          }
        }
        if (present.length !== dep.peers.length) {
          return;
        }
        const main2 = dep.paths[0];
        const values = dep.paths.slice(1);
        return {
          code: "object.nand",
          context: {
            main: main2,
            mainWithLabel: internals.keysToLabels(schema, main2),
            peers: values,
            peersWithLabels: internals.keysToLabels(schema, values)
          }
        };
      },
      or(schema, dep, value, state, prefs) {
        for (const peer of dep.peers) {
          if (peer.resolve(value, state, prefs, null, { shadow: false }) !== void 0) {
            return;
          }
        }
        return {
          code: "object.missing",
          context: {
            peers: dep.paths,
            peersWithLabels: internals.keysToLabels(schema, dep.paths)
          }
        };
      },
      oxor(schema, dep, value, state, prefs) {
        const present = [];
        for (const peer of dep.peers) {
          if (peer.resolve(value, state, prefs, null, { shadow: false }) !== void 0) {
            present.push(peer.key);
          }
        }
        if (!present.length || present.length === 1) {
          return;
        }
        const context = { peers: dep.paths, peersWithLabels: internals.keysToLabels(schema, dep.paths) };
        context.present = present;
        context.presentWithLabels = internals.keysToLabels(schema, present);
        return { code: "object.oxor", context };
      },
      with(schema, dep, value, state, prefs) {
        for (const peer of dep.peers) {
          if (peer.resolve(value, state, prefs, null, { shadow: false }) === void 0) {
            return {
              code: "object.with",
              context: {
                main: dep.key.key,
                mainWithLabel: internals.keysToLabels(schema, dep.key.key),
                peer: peer.key,
                peerWithLabel: internals.keysToLabels(schema, peer.key)
              }
            };
          }
        }
      },
      without(schema, dep, value, state, prefs) {
        for (const peer of dep.peers) {
          if (peer.resolve(value, state, prefs, null, { shadow: false }) !== void 0) {
            return {
              code: "object.without",
              context: {
                main: dep.key.key,
                mainWithLabel: internals.keysToLabels(schema, dep.key.key),
                peer: peer.key,
                peerWithLabel: internals.keysToLabels(schema, peer.key)
              }
            };
          }
        }
      },
      xor(schema, dep, value, state, prefs) {
        const present = [];
        for (const peer of dep.peers) {
          if (peer.resolve(value, state, prefs, null, { shadow: false }) !== void 0) {
            present.push(peer.key);
          }
        }
        if (present.length === 1) {
          return;
        }
        const context = { peers: dep.paths, peersWithLabels: internals.keysToLabels(schema, dep.paths) };
        if (present.length === 0) {
          return { code: "object.missing", context };
        }
        context.present = present;
        context.presentWithLabels = internals.keysToLabels(schema, present);
        return { code: "object.xor", context };
      }
    };
    internals.keysToLabels = function(schema, keys) {
      if (Array.isArray(keys)) {
        return keys.map((key) => schema.$_mapLabels(key));
      }
      return schema.$_mapLabels(keys);
    };
    internals.rename = function(schema, value, state, prefs, errors) {
      const renamed = {};
      for (const rename of schema.$_terms.renames) {
        const matches = [];
        const pattern = typeof rename.from !== "string";
        if (!pattern) {
          if (Object.prototype.hasOwnProperty.call(value, rename.from) && (value[rename.from] !== void 0 || !rename.options.ignoreUndefined)) {
            matches.push(rename);
          }
        } else {
          for (const from in value) {
            if (value[from] === void 0 && rename.options.ignoreUndefined) {
              continue;
            }
            if (from === rename.to) {
              continue;
            }
            const match = rename.from.exec(from);
            if (!match) {
              continue;
            }
            matches.push({ from, to: rename.to, match });
          }
        }
        for (const match of matches) {
          const from = match.from;
          let to = match.to;
          if (to instanceof Template) {
            to = to.render(value, state, prefs, match.match);
          }
          if (from === to) {
            continue;
          }
          if (!rename.options.multiple && renamed[to]) {
            errors.push(schema.$_createError("object.rename.multiple", value, { from, to, pattern }, state, prefs));
            if (prefs.abortEarly) {
              return false;
            }
          }
          if (Object.prototype.hasOwnProperty.call(value, to) && !rename.options.override && !renamed[to]) {
            errors.push(schema.$_createError("object.rename.override", value, { from, to, pattern }, state, prefs));
            if (prefs.abortEarly) {
              return false;
            }
          }
          if (value[from] === void 0) {
            delete value[to];
          } else {
            value[to] = value[from];
          }
          renamed[to] = true;
          if (!rename.options.alias) {
            delete value[from];
          }
        }
      }
      return true;
    };
    internals.unknown = function(schema, value, unprocessed, errors, state, prefs) {
      if (schema.$_terms.patterns) {
        let hasMatches = false;
        const matches = schema.$_terms.patterns.map((pattern) => {
          if (pattern.matches) {
            hasMatches = true;
            return [];
          }
        });
        const ancestors = [value, ...state.ancestors];
        for (const key of unprocessed) {
          const item = value[key];
          const path = [...state.path, key];
          for (let i = 0; i < schema.$_terms.patterns.length; ++i) {
            const pattern = schema.$_terms.patterns[i];
            if (pattern.regex) {
              const match = pattern.regex.test(key);
              state.mainstay.tracer.debug(state, "rule", `pattern.${i}`, match ? "pass" : "error");
              if (!match) {
                continue;
              }
            } else {
              if (!pattern.schema.$_match(key, state.nest(pattern.schema, `pattern.${i}`), prefs)) {
                continue;
              }
            }
            unprocessed.delete(key);
            const localState = state.localize(path, ancestors, { schema: pattern.rule, key });
            const result = pattern.rule.$_validate(item, localState, prefs);
            if (result.errors) {
              if (prefs.abortEarly) {
                return { value, errors: result.errors };
              }
              errors.push(...result.errors);
            }
            if (pattern.matches) {
              matches[i].push(key);
            }
            value[key] = result.value;
            if (!pattern.fallthrough) {
              break;
            }
          }
        }
        if (hasMatches) {
          for (let i = 0; i < matches.length; ++i) {
            const match = matches[i];
            if (!match) {
              continue;
            }
            const stpm = schema.$_terms.patterns[i].matches;
            const localState = state.localize(state.path, ancestors, stpm);
            const result = stpm.$_validate(match, localState, prefs);
            if (result.errors) {
              const details = Errors.details(result.errors, { override: false });
              details.matches = match;
              const report = schema.$_createError("object.pattern.match", value, details, state, prefs);
              if (prefs.abortEarly) {
                return { value, errors: report };
              }
              errors.push(report);
            }
          }
        }
      }
      if (!unprocessed.size || !schema.$_terms.keys && !schema.$_terms.patterns) {
        return;
      }
      if (prefs.stripUnknown && !schema._flags.unknown || prefs.skipFunctions) {
        const stripUnknown = prefs.stripUnknown ? prefs.stripUnknown === true ? true : !!prefs.stripUnknown.objects : false;
        for (const key of unprocessed) {
          if (stripUnknown) {
            delete value[key];
            unprocessed.delete(key);
          } else if (typeof value[key] === "function") {
            unprocessed.delete(key);
          }
        }
      }
      const forbidUnknown = !Common.default(schema._flags.unknown, prefs.allowUnknown);
      if (forbidUnknown) {
        for (const unprocessedKey of unprocessed) {
          const localState = state.localize([...state.path, unprocessedKey], []);
          const report = schema.$_createError("object.unknown", value[unprocessedKey], { child: unprocessedKey }, localState, prefs, { flags: false });
          if (prefs.abortEarly) {
            return { value, errors: report };
          }
          errors.push(report);
        }
      }
    };
    internals.Dependency = class {
      constructor(rel, key, peers, paths) {
        this.rel = rel;
        this.key = key;
        this.peers = peers;
        this.paths = paths;
      }
      describe() {
        const desc = {
          rel: this.rel,
          peers: this.paths
        };
        if (this.key !== null) {
          desc.key = this.key.key;
        }
        if (this.peers[0].separator !== ".") {
          desc.options = { separator: this.peers[0].separator };
        }
        return desc;
      }
    };
    internals.Keys = class extends Array {
      concat(source) {
        const result = this.slice();
        const keys = /* @__PURE__ */ new Map();
        for (let i = 0; i < result.length; ++i) {
          keys.set(result[i].key, i);
        }
        for (const item of source) {
          const key = item.key;
          const pos = keys.get(key);
          if (pos !== void 0) {
            result[pos] = { key, schema: result[pos].schema.concat(item.schema) };
          } else {
            result.push(item);
          }
        }
        return result;
      }
    };
  }
});

// node_modules/joi/lib/types/function.js
var require_function = __commonJS({
  "node_modules/joi/lib/types/function.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Keys = require_keys();
    module2.exports = Keys.extend({
      type: "function",
      properties: {
        typeof: "function"
      },
      rules: {
        arity: {
          method(n) {
            Assert(Number.isSafeInteger(n) && n >= 0, "n must be a positive integer");
            return this.$_addRule({ name: "arity", args: { n } });
          },
          validate(value, helpers, { n }) {
            if (value.length === n) {
              return value;
            }
            return helpers.error("function.arity", { n });
          }
        },
        class: {
          method() {
            return this.$_addRule("class");
          },
          validate(value, helpers) {
            if (/^\s*class\s/.test(value.toString())) {
              return value;
            }
            return helpers.error("function.class", { value });
          }
        },
        minArity: {
          method(n) {
            Assert(Number.isSafeInteger(n) && n > 0, "n must be a strict positive integer");
            return this.$_addRule({ name: "minArity", args: { n } });
          },
          validate(value, helpers, { n }) {
            if (value.length >= n) {
              return value;
            }
            return helpers.error("function.minArity", { n });
          }
        },
        maxArity: {
          method(n) {
            Assert(Number.isSafeInteger(n) && n >= 0, "n must be a positive integer");
            return this.$_addRule({ name: "maxArity", args: { n } });
          },
          validate(value, helpers, { n }) {
            if (value.length <= n) {
              return value;
            }
            return helpers.error("function.maxArity", { n });
          }
        }
      },
      messages: {
        "function.arity": "{{#label}} must have an arity of {{#n}}",
        "function.class": "{{#label}} must be a class",
        "function.maxArity": "{{#label}} must have an arity lesser or equal to {{#n}}",
        "function.minArity": "{{#label}} must have an arity greater or equal to {{#n}}"
      }
    });
  }
});

// node_modules/joi/lib/types/link.js
var require_link = __commonJS({
  "node_modules/joi/lib/types/link.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var internals = {};
    module2.exports = Any.extend({
      type: "link",
      properties: {
        schemaChain: true
      },
      terms: {
        link: { init: null, manifest: "single", register: false }
      },
      args(schema, ref) {
        return schema.ref(ref);
      },
      validate(value, { schema, state, prefs }) {
        Assert(schema.$_terms.link, "Uninitialized link schema");
        const linked = internals.generate(schema, value, state, prefs);
        const ref = schema.$_terms.link[0].ref;
        return linked.$_validate(value, state.nest(linked, `link:${ref.display}:${linked.type}`), prefs);
      },
      generate(schema, value, state, prefs) {
        return internals.generate(schema, value, state, prefs);
      },
      rules: {
        ref: {
          method(ref) {
            Assert(!this.$_terms.link, "Cannot reinitialize schema");
            ref = Compile.ref(ref);
            Assert(ref.type === "value" || ref.type === "local", "Invalid reference type:", ref.type);
            Assert(ref.type === "local" || ref.ancestor === "root" || ref.ancestor > 0, "Link cannot reference itself");
            const obj = this.clone();
            obj.$_terms.link = [{ ref }];
            return obj;
          }
        },
        relative: {
          method(enabled = true) {
            return this.$_setFlag("relative", enabled);
          }
        }
      },
      overrides: {
        concat(source) {
          Assert(this.$_terms.link, "Uninitialized link schema");
          Assert(Common.isSchema(source), "Invalid schema object");
          Assert(source.type !== "link", "Cannot merge type link with another link");
          const obj = this.clone();
          if (!obj.$_terms.whens) {
            obj.$_terms.whens = [];
          }
          obj.$_terms.whens.push({ concat: source });
          return obj.$_mutateRebuild();
        }
      },
      manifest: {
        build(obj, desc) {
          Assert(desc.link, "Invalid link description missing link");
          return obj.ref(desc.link);
        }
      }
    });
    internals.generate = function(schema, value, state, prefs) {
      let linked = state.mainstay.links.get(schema);
      if (linked) {
        return linked._generate(value, state, prefs).schema;
      }
      const ref = schema.$_terms.link[0].ref;
      const { perspective, path } = internals.perspective(ref, state);
      internals.assert(perspective, "which is outside of schema boundaries", ref, schema, state, prefs);
      try {
        linked = path.length ? perspective.$_reach(path) : perspective;
      } catch (ignoreErr) {
        internals.assert(false, "to non-existing schema", ref, schema, state, prefs);
      }
      internals.assert(linked.type !== "link", "which is another link", ref, schema, state, prefs);
      if (!schema._flags.relative) {
        state.mainstay.links.set(schema, linked);
      }
      return linked._generate(value, state, prefs).schema;
    };
    internals.perspective = function(ref, state) {
      if (ref.type === "local") {
        for (const { schema, key } of state.schemas) {
          const id = schema._flags.id || key;
          if (id === ref.path[0]) {
            return { perspective: schema, path: ref.path.slice(1) };
          }
          if (schema.$_terms.shared) {
            for (const shared of schema.$_terms.shared) {
              if (shared._flags.id === ref.path[0]) {
                return { perspective: shared, path: ref.path.slice(1) };
              }
            }
          }
        }
        return { perspective: null, path: null };
      }
      if (ref.ancestor === "root") {
        return { perspective: state.schemas[state.schemas.length - 1].schema, path: ref.path };
      }
      return { perspective: state.schemas[ref.ancestor] && state.schemas[ref.ancestor].schema, path: ref.path };
    };
    internals.assert = function(condition, message, ref, schema, state, prefs) {
      if (condition) {
        return;
      }
      Assert(false, `"${Errors.label(schema._flags, state, prefs)}" contains link reference "${ref.display}" ${message}`);
    };
  }
});

// node_modules/joi/lib/types/number.js
var require_number = __commonJS({
  "node_modules/joi/lib/types/number.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Any = require_any();
    var Common = require_common();
    var internals = {
      numberRx: /^\s*[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e([+-]?\d+))?\s*$/i,
      precisionRx: /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/
    };
    module2.exports = Any.extend({
      type: "number",
      flags: {
        unsafe: { default: false }
      },
      coerce: {
        from: "string",
        method(value, { schema, error }) {
          const matches = value.match(internals.numberRx);
          if (!matches) {
            return;
          }
          value = value.trim();
          const result = { value: parseFloat(value) };
          if (result.value === 0) {
            result.value = 0;
          }
          if (!schema._flags.unsafe) {
            if (value.match(/e/i)) {
              const constructed = internals.normalizeExponent(`${result.value / Math.pow(10, matches[1])}e${matches[1]}`);
              if (constructed !== internals.normalizeExponent(value)) {
                result.errors = error("number.unsafe");
                return result;
              }
            } else {
              const string2 = result.value.toString();
              if (string2.match(/e/i)) {
                return result;
              }
              if (string2 !== internals.normalizeDecimal(value)) {
                result.errors = error("number.unsafe");
                return result;
              }
            }
          }
          return result;
        }
      },
      validate(value, { schema, error, prefs }) {
        if (value === Infinity || value === -Infinity) {
          return { value, errors: error("number.infinity") };
        }
        if (!Common.isNumber(value)) {
          return { value, errors: error("number.base") };
        }
        const result = { value };
        if (prefs.convert) {
          const rule = schema.$_getRule("precision");
          if (rule) {
            const precision = Math.pow(10, rule.args.limit);
            result.value = Math.round(result.value * precision) / precision;
          }
        }
        if (result.value === 0) {
          result.value = 0;
        }
        if (!schema._flags.unsafe && (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)) {
          result.errors = error("number.unsafe");
        }
        return result;
      },
      rules: {
        compare: {
          method: false,
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(value, limit, operator)) {
              return value;
            }
            return helpers.error("number." + name, { limit: args.limit, value });
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.isNumber,
              message: "must be a number"
            }
          ]
        },
        greater: {
          method(limit) {
            return this.$_addRule({ name: "greater", method: "compare", args: { limit }, operator: ">" });
          }
        },
        integer: {
          method() {
            return this.$_addRule("integer");
          },
          validate(value, helpers) {
            if (Math.trunc(value) - value === 0) {
              return value;
            }
            return helpers.error("number.integer");
          }
        },
        less: {
          method(limit) {
            return this.$_addRule({ name: "less", method: "compare", args: { limit }, operator: "<" });
          }
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "compare", args: { limit }, operator: "<=" });
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "compare", args: { limit }, operator: ">=" });
          }
        },
        multiple: {
          method(base) {
            return this.$_addRule({ name: "multiple", args: { base } });
          },
          validate(value, helpers, { base }, options) {
            if (value * (1 / base) % 1 === 0) {
              return value;
            }
            return helpers.error("number.multiple", { multiple: options.args.base, value });
          },
          args: [
            {
              name: "base",
              ref: true,
              assert: (value) => typeof value === "number" && isFinite(value) && value > 0,
              message: "must be a positive number"
            }
          ],
          multi: true
        },
        negative: {
          method() {
            return this.sign("negative");
          }
        },
        port: {
          method() {
            return this.$_addRule("port");
          },
          validate(value, helpers) {
            if (Number.isSafeInteger(value) && value >= 0 && value <= 65535) {
              return value;
            }
            return helpers.error("number.port");
          }
        },
        positive: {
          method() {
            return this.sign("positive");
          }
        },
        precision: {
          method(limit) {
            Assert(Number.isSafeInteger(limit), "limit must be an integer");
            return this.$_addRule({ name: "precision", args: { limit } });
          },
          validate(value, helpers, { limit }) {
            const places = value.toString().match(internals.precisionRx);
            const decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
            if (decimals <= limit) {
              return value;
            }
            return helpers.error("number.precision", { limit, value });
          },
          convert: true
        },
        sign: {
          method(sign) {
            Assert(["negative", "positive"].includes(sign), "Invalid sign", sign);
            return this.$_addRule({ name: "sign", args: { sign } });
          },
          validate(value, helpers, { sign }) {
            if (sign === "negative" && value < 0 || sign === "positive" && value > 0) {
              return value;
            }
            return helpers.error(`number.${sign}`);
          }
        },
        unsafe: {
          method(enabled = true) {
            Assert(typeof enabled === "boolean", "enabled must be a boolean");
            return this.$_setFlag("unsafe", enabled);
          }
        }
      },
      cast: {
        string: {
          from: (value) => typeof value === "number",
          to(value, helpers) {
            return value.toString();
          }
        }
      },
      messages: {
        "number.base": "{{#label}} must be a number",
        "number.greater": "{{#label}} must be greater than {{#limit}}",
        "number.infinity": "{{#label}} cannot be infinity",
        "number.integer": "{{#label}} must be an integer",
        "number.less": "{{#label}} must be less than {{#limit}}",
        "number.max": "{{#label}} must be less than or equal to {{#limit}}",
        "number.min": "{{#label}} must be greater than or equal to {{#limit}}",
        "number.multiple": "{{#label}} must be a multiple of {{#multiple}}",
        "number.negative": "{{#label}} must be a negative number",
        "number.port": "{{#label}} must be a valid port",
        "number.positive": "{{#label}} must be a positive number",
        "number.precision": "{{#label}} must have no more than {{#limit}} decimal places",
        "number.unsafe": "{{#label}} must be a safe number"
      }
    });
    internals.normalizeExponent = function(str) {
      return str.replace(/E/, "e").replace(/\.(\d*[1-9])?0+e/, ".$1e").replace(/\.e/, "e").replace(/e\+/, "e").replace(/^\+/, "").replace(/^(-?)0+([1-9])/, "$1$2");
    };
    internals.normalizeDecimal = function(str) {
      str = str.replace(/^\+/, "").replace(/\.0*$/, "").replace(/^(-?)\.([^\.]*)$/, "$10.$2").replace(/^(-?)0+([0-9])/, "$1$2");
      if (str.includes(".") && str.endsWith("0")) {
        str = str.replace(/0+$/, "");
      }
      if (str === "-0") {
        return "0";
      }
      return str;
    };
  }
});

// node_modules/joi/lib/types/object.js
var require_object = __commonJS({
  "node_modules/joi/lib/types/object.js"(exports, module2) {
    "use strict";
    var Keys = require_keys();
    module2.exports = Keys.extend({
      type: "object",
      cast: {
        map: {
          from: (value) => value && typeof value === "object",
          to(value, helpers) {
            return new Map(Object.entries(value));
          }
        }
      }
    });
  }
});

// node_modules/@sideway/address/lib/errors.js
var require_errors2 = __commonJS({
  "node_modules/@sideway/address/lib/errors.js"(exports) {
    "use strict";
    exports.codes = {
      EMPTY_STRING: "Address must be a non-empty string",
      FORBIDDEN_UNICODE: "Address contains forbidden Unicode characters",
      MULTIPLE_AT_CHAR: "Address cannot contain more than one @ character",
      MISSING_AT_CHAR: "Address must contain one @ character",
      EMPTY_LOCAL: "Address local part cannot be empty",
      ADDRESS_TOO_LONG: "Address too long",
      LOCAL_TOO_LONG: "Address local part too long",
      EMPTY_LOCAL_SEGMENT: "Address local part contains empty dot-separated segment",
      INVALID_LOCAL_CHARS: "Address local part contains invalid character",
      DOMAIN_NON_EMPTY_STRING: "Domain must be a non-empty string",
      DOMAIN_TOO_LONG: "Domain too long",
      DOMAIN_INVALID_UNICODE_CHARS: "Domain contains forbidden Unicode characters",
      DOMAIN_INVALID_CHARS: "Domain contains invalid character",
      DOMAIN_INVALID_TLDS_CHARS: "Domain contains invalid tld character",
      DOMAIN_SEGMENTS_COUNT: "Domain lacks the minimum required number of segments",
      DOMAIN_SEGMENTS_COUNT_MAX: "Domain contains too many segments",
      DOMAIN_FORBIDDEN_TLDS: "Domain uses forbidden TLD",
      DOMAIN_EMPTY_SEGMENT: "Domain contains empty dot-separated segment",
      DOMAIN_LONG_SEGMENT: "Domain contains dot-separated segment that is too long"
    };
    exports.code = function(code) {
      return { code, error: exports.codes[code] };
    };
  }
});

// node_modules/@sideway/address/lib/domain.js
var require_domain = __commonJS({
  "node_modules/@sideway/address/lib/domain.js"(exports) {
    "use strict";
    var Url = require("url");
    var Errors = require_errors2();
    var internals = {
      minDomainSegments: 2,
      nonAsciiRx: /[^\x00-\x7f]/,
      domainControlRx: /[\x00-\x20@\:\/\\#!\$&\'\(\)\*\+,;=\?]/,
      tldSegmentRx: /^[a-zA-Z](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,
      domainSegmentRx: /^[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,
      URL: Url.URL || URL
    };
    exports.analyze = function(domain, options = {}) {
      if (!domain) {
        return Errors.code("DOMAIN_NON_EMPTY_STRING");
      }
      if (typeof domain !== "string") {
        throw new Error("Invalid input: domain must be a string");
      }
      if (domain.length > 256) {
        return Errors.code("DOMAIN_TOO_LONG");
      }
      const ascii = !internals.nonAsciiRx.test(domain);
      if (!ascii) {
        if (options.allowUnicode === false) {
          return Errors.code("DOMAIN_INVALID_UNICODE_CHARS");
        }
        domain = domain.normalize("NFC");
      }
      if (internals.domainControlRx.test(domain)) {
        return Errors.code("DOMAIN_INVALID_CHARS");
      }
      domain = internals.punycode(domain);
      if (options.allowFullyQualified && domain[domain.length - 1] === ".") {
        domain = domain.slice(0, -1);
      }
      const minDomainSegments = options.minDomainSegments || internals.minDomainSegments;
      const segments = domain.split(".");
      if (segments.length < minDomainSegments) {
        return Errors.code("DOMAIN_SEGMENTS_COUNT");
      }
      if (options.maxDomainSegments) {
        if (segments.length > options.maxDomainSegments) {
          return Errors.code("DOMAIN_SEGMENTS_COUNT_MAX");
        }
      }
      const tlds = options.tlds;
      if (tlds) {
        const tld = segments[segments.length - 1].toLowerCase();
        if (tlds.deny && tlds.deny.has(tld) || tlds.allow && !tlds.allow.has(tld)) {
          return Errors.code("DOMAIN_FORBIDDEN_TLDS");
        }
      }
      for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];
        if (!segment.length) {
          return Errors.code("DOMAIN_EMPTY_SEGMENT");
        }
        if (segment.length > 63) {
          return Errors.code("DOMAIN_LONG_SEGMENT");
        }
        if (i < segments.length - 1) {
          if (!internals.domainSegmentRx.test(segment)) {
            return Errors.code("DOMAIN_INVALID_CHARS");
          }
        } else {
          if (!internals.tldSegmentRx.test(segment)) {
            return Errors.code("DOMAIN_INVALID_TLDS_CHARS");
          }
        }
      }
      return null;
    };
    exports.isValid = function(domain, options) {
      return !exports.analyze(domain, options);
    };
    internals.punycode = function(domain) {
      if (domain.includes("%")) {
        domain = domain.replace(/%/g, "%25");
      }
      try {
        return new internals.URL(`http://${domain}`).host;
      } catch (err) {
        return domain;
      }
    };
  }
});

// node_modules/@sideway/address/lib/email.js
var require_email = __commonJS({
  "node_modules/@sideway/address/lib/email.js"(exports) {
    "use strict";
    var Util = require("util");
    var Domain = require_domain();
    var Errors = require_errors2();
    var internals = {
      nonAsciiRx: /[^\x00-\x7f]/,
      encoder: new (Util.TextEncoder || TextEncoder)()
    };
    exports.analyze = function(email, options) {
      return internals.email(email, options);
    };
    exports.isValid = function(email, options) {
      return !internals.email(email, options);
    };
    internals.email = function(email, options = {}) {
      if (typeof email !== "string") {
        throw new Error("Invalid input: email must be a string");
      }
      if (!email) {
        return Errors.code("EMPTY_STRING");
      }
      const ascii = !internals.nonAsciiRx.test(email);
      if (!ascii) {
        if (options.allowUnicode === false) {
          return Errors.code("FORBIDDEN_UNICODE");
        }
        email = email.normalize("NFC");
      }
      const parts = email.split("@");
      if (parts.length !== 2) {
        return parts.length > 2 ? Errors.code("MULTIPLE_AT_CHAR") : Errors.code("MISSING_AT_CHAR");
      }
      const [local, domain] = parts;
      if (!local) {
        return Errors.code("EMPTY_LOCAL");
      }
      if (!options.ignoreLength) {
        if (email.length > 254) {
          return Errors.code("ADDRESS_TOO_LONG");
        }
        if (internals.encoder.encode(local).length > 64) {
          return Errors.code("LOCAL_TOO_LONG");
        }
      }
      return internals.local(local, ascii) || Domain.analyze(domain, options);
    };
    internals.local = function(local, ascii) {
      const segments = local.split(".");
      for (const segment of segments) {
        if (!segment.length) {
          return Errors.code("EMPTY_LOCAL_SEGMENT");
        }
        if (ascii) {
          if (!internals.atextRx.test(segment)) {
            return Errors.code("INVALID_LOCAL_CHARS");
          }
          continue;
        }
        for (const char of segment) {
          if (internals.atextRx.test(char)) {
            continue;
          }
          const binary = internals.binary(char);
          if (!internals.atomRx.test(binary)) {
            return Errors.code("INVALID_LOCAL_CHARS");
          }
        }
      }
    };
    internals.binary = function(char) {
      return Array.from(internals.encoder.encode(char)).map((v) => String.fromCharCode(v)).join("");
    };
    internals.atextRx = /^[\w!#\$%&'\*\+\-/=\?\^`\{\|\}~]+$/;
    internals.atomRx = new RegExp([
      "(?:[\\xc2-\\xdf][\\x80-\\xbf])",
      "(?:\\xe0[\\xa0-\\xbf][\\x80-\\xbf])|(?:[\\xe1-\\xec][\\x80-\\xbf]{2})|(?:\\xed[\\x80-\\x9f][\\x80-\\xbf])|(?:[\\xee-\\xef][\\x80-\\xbf]{2})",
      "(?:\\xf0[\\x90-\\xbf][\\x80-\\xbf]{2})|(?:[\\xf1-\\xf3][\\x80-\\xbf]{3})|(?:\\xf4[\\x80-\\x8f][\\x80-\\xbf]{2})"
    ].join("|"));
  }
});

// node_modules/@hapi/hoek/lib/escapeRegex.js
var require_escapeRegex = __commonJS({
  "node_modules/@hapi/hoek/lib/escapeRegex.js"(exports, module2) {
    "use strict";
    module2.exports = function(string2) {
      return string2.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, "\\$&");
    };
  }
});

// node_modules/@sideway/address/lib/uri.js
var require_uri = __commonJS({
  "node_modules/@sideway/address/lib/uri.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var EscapeRegex = require_escapeRegex();
    var internals = {};
    internals.generate = function() {
      const rfc3986 = {};
      const hexDigit = "\\dA-Fa-f";
      const hexDigitOnly = "[" + hexDigit + "]";
      const unreserved = "\\w-\\.~";
      const subDelims = "!\\$&'\\(\\)\\*\\+,;=";
      const pctEncoded = "%" + hexDigit;
      const pchar = unreserved + pctEncoded + subDelims + ":@";
      const pcharOnly = "[" + pchar + "]";
      const decOctect = "(?:0{0,2}\\d|0?[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";
      rfc3986.ipv4address = "(?:" + decOctect + "\\.){3}" + decOctect;
      const h16 = hexDigitOnly + "{1,4}";
      const ls32 = "(?:" + h16 + ":" + h16 + "|" + rfc3986.ipv4address + ")";
      const IPv6SixHex = "(?:" + h16 + ":){6}" + ls32;
      const IPv6FiveHex = "::(?:" + h16 + ":){5}" + ls32;
      const IPv6FourHex = "(?:" + h16 + ")?::(?:" + h16 + ":){4}" + ls32;
      const IPv6ThreeHex = "(?:(?:" + h16 + ":){0,1}" + h16 + ")?::(?:" + h16 + ":){3}" + ls32;
      const IPv6TwoHex = "(?:(?:" + h16 + ":){0,2}" + h16 + ")?::(?:" + h16 + ":){2}" + ls32;
      const IPv6OneHex = "(?:(?:" + h16 + ":){0,3}" + h16 + ")?::" + h16 + ":" + ls32;
      const IPv6NoneHex = "(?:(?:" + h16 + ":){0,4}" + h16 + ")?::" + ls32;
      const IPv6NoneHex2 = "(?:(?:" + h16 + ":){0,5}" + h16 + ")?::" + h16;
      const IPv6NoneHex3 = "(?:(?:" + h16 + ":){0,6}" + h16 + ")?::";
      rfc3986.ipv4Cidr = "(?:\\d|[1-2]\\d|3[0-2])";
      rfc3986.ipv6Cidr = "(?:0{0,2}\\d|0?[1-9]\\d|1[01]\\d|12[0-8])";
      rfc3986.ipv6address = "(?:" + IPv6SixHex + "|" + IPv6FiveHex + "|" + IPv6FourHex + "|" + IPv6ThreeHex + "|" + IPv6TwoHex + "|" + IPv6OneHex + "|" + IPv6NoneHex + "|" + IPv6NoneHex2 + "|" + IPv6NoneHex3 + ")";
      rfc3986.ipvFuture = "v" + hexDigitOnly + "+\\.[" + unreserved + subDelims + ":]+";
      rfc3986.scheme = "[a-zA-Z][a-zA-Z\\d+-\\.]*";
      rfc3986.schemeRegex = new RegExp(rfc3986.scheme);
      const userinfo = "[" + unreserved + pctEncoded + subDelims + ":]*";
      const IPLiteral = "\\[(?:" + rfc3986.ipv6address + "|" + rfc3986.ipvFuture + ")\\]";
      const regName = "[" + unreserved + pctEncoded + subDelims + "]{1,255}";
      const host = "(?:" + IPLiteral + "|" + rfc3986.ipv4address + "|" + regName + ")";
      const port = "\\d*";
      const authority = "(?:" + userinfo + "@)?" + host + "(?::" + port + ")?";
      const authorityCapture = "(?:" + userinfo + "@)?(" + host + ")(?::" + port + ")?";
      const segment = pcharOnly + "*";
      const segmentNz = pcharOnly + "+";
      const segmentNzNc = "[" + unreserved + pctEncoded + subDelims + "@]+";
      const pathEmpty = "";
      const pathAbEmpty = "(?:\\/" + segment + ")*";
      const pathAbsolute = "\\/(?:" + segmentNz + pathAbEmpty + ")?";
      const pathRootless = segmentNz + pathAbEmpty;
      const pathNoScheme = segmentNzNc + pathAbEmpty;
      const pathAbNoAuthority = "(?:\\/\\/\\/" + segment + pathAbEmpty + ")";
      rfc3986.hierPart = "(?:(?:\\/\\/" + authority + pathAbEmpty + ")|" + pathAbsolute + "|" + pathRootless + "|" + pathAbNoAuthority + ")";
      rfc3986.hierPartCapture = "(?:(?:\\/\\/" + authorityCapture + pathAbEmpty + ")|" + pathAbsolute + "|" + pathRootless + ")";
      rfc3986.relativeRef = "(?:(?:\\/\\/" + authority + pathAbEmpty + ")|" + pathAbsolute + "|" + pathNoScheme + "|" + pathEmpty + ")";
      rfc3986.relativeRefCapture = "(?:(?:\\/\\/" + authorityCapture + pathAbEmpty + ")|" + pathAbsolute + "|" + pathNoScheme + "|" + pathEmpty + ")";
      rfc3986.query = "[" + pchar + "\\/\\?]*(?=#|$)";
      rfc3986.queryWithSquareBrackets = "[" + pchar + "\\[\\]\\/\\?]*(?=#|$)";
      rfc3986.fragment = "[" + pchar + "\\/\\?]*";
      return rfc3986;
    };
    internals.rfc3986 = internals.generate();
    exports.ip = {
      v4Cidr: internals.rfc3986.ipv4Cidr,
      v6Cidr: internals.rfc3986.ipv6Cidr,
      ipv4: internals.rfc3986.ipv4address,
      ipv6: internals.rfc3986.ipv6address,
      ipvfuture: internals.rfc3986.ipvFuture
    };
    internals.createRegex = function(options) {
      const rfc = internals.rfc3986;
      const query = options.allowQuerySquareBrackets ? rfc.queryWithSquareBrackets : rfc.query;
      const suffix = "(?:\\?" + query + ")?(?:#" + rfc.fragment + ")?";
      const relative = options.domain ? rfc.relativeRefCapture : rfc.relativeRef;
      if (options.relativeOnly) {
        return internals.wrap(relative + suffix);
      }
      let customScheme = "";
      if (options.scheme) {
        Assert(options.scheme instanceof RegExp || typeof options.scheme === "string" || Array.isArray(options.scheme), "scheme must be a RegExp, String, or Array");
        const schemes = [].concat(options.scheme);
        Assert(schemes.length >= 1, "scheme must have at least 1 scheme specified");
        const selections = [];
        for (let i = 0; i < schemes.length; ++i) {
          const scheme2 = schemes[i];
          Assert(scheme2 instanceof RegExp || typeof scheme2 === "string", "scheme at position " + i + " must be a RegExp or String");
          if (scheme2 instanceof RegExp) {
            selections.push(scheme2.source.toString());
          } else {
            Assert(rfc.schemeRegex.test(scheme2), "scheme at position " + i + " must be a valid scheme");
            selections.push(EscapeRegex(scheme2));
          }
        }
        customScheme = selections.join("|");
      }
      const scheme = customScheme ? "(?:" + customScheme + ")" : rfc.scheme;
      const absolute = "(?:" + scheme + ":" + (options.domain ? rfc.hierPartCapture : rfc.hierPart) + ")";
      const prefix = options.allowRelative ? "(?:" + absolute + "|" + relative + ")" : absolute;
      return internals.wrap(prefix + suffix, customScheme);
    };
    internals.wrap = function(raw, scheme) {
      raw = `(?=.)(?!https?:/(?:$|[^/]))(?!https?:///)(?!https?:[^/])${raw}`;
      return {
        raw,
        regex: new RegExp(`^${raw}$`),
        scheme
      };
    };
    internals.uriRegex = internals.createRegex({});
    exports.regex = function(options = {}) {
      if (options.scheme || options.allowRelative || options.relativeOnly || options.allowQuerySquareBrackets || options.domain) {
        return internals.createRegex(options);
      }
      return internals.uriRegex;
    };
  }
});

// node_modules/@sideway/address/lib/ip.js
var require_ip = __commonJS({
  "node_modules/@sideway/address/lib/ip.js"(exports) {
    "use strict";
    var Assert = require_assert();
    var Uri = require_uri();
    exports.regex = function(options = {}) {
      Assert(options.cidr === void 0 || typeof options.cidr === "string", "options.cidr must be a string");
      const cidr = options.cidr ? options.cidr.toLowerCase() : "optional";
      Assert(["required", "optional", "forbidden"].includes(cidr), "options.cidr must be one of required, optional, forbidden");
      Assert(options.version === void 0 || typeof options.version === "string" || Array.isArray(options.version), "options.version must be a string or an array of string");
      let versions = options.version || ["ipv4", "ipv6", "ipvfuture"];
      if (!Array.isArray(versions)) {
        versions = [versions];
      }
      Assert(versions.length >= 1, "options.version must have at least 1 version specified");
      for (let i = 0; i < versions.length; ++i) {
        Assert(typeof versions[i] === "string", "options.version must only contain strings");
        versions[i] = versions[i].toLowerCase();
        Assert(["ipv4", "ipv6", "ipvfuture"].includes(versions[i]), "options.version contains unknown version " + versions[i] + " - must be one of ipv4, ipv6, ipvfuture");
      }
      versions = Array.from(new Set(versions));
      const parts = versions.map((version) => {
        if (cidr === "forbidden") {
          return Uri.ip[version];
        }
        const cidrpart = `\\/${version === "ipv4" ? Uri.ip.v4Cidr : Uri.ip.v6Cidr}`;
        if (cidr === "required") {
          return `${Uri.ip[version]}${cidrpart}`;
        }
        return `${Uri.ip[version]}(?:${cidrpart})?`;
      });
      const raw = `(?:${parts.join("|")})`;
      const regex = new RegExp(`^${raw}$`);
      return { cidr, versions, regex, raw };
    };
  }
});

// node_modules/@sideway/address/lib/tlds.js
var require_tlds = __commonJS({
  "node_modules/@sideway/address/lib/tlds.js"(exports, module2) {
    "use strict";
    var internals = {};
    internals.tlds = [
      "AAA",
      "AARP",
      "ABARTH",
      "ABB",
      "ABBOTT",
      "ABBVIE",
      "ABC",
      "ABLE",
      "ABOGADO",
      "ABUDHABI",
      "AC",
      "ACADEMY",
      "ACCENTURE",
      "ACCOUNTANT",
      "ACCOUNTANTS",
      "ACO",
      "ACTOR",
      "AD",
      "ADAC",
      "ADS",
      "ADULT",
      "AE",
      "AEG",
      "AERO",
      "AETNA",
      "AF",
      "AFAMILYCOMPANY",
      "AFL",
      "AFRICA",
      "AG",
      "AGAKHAN",
      "AGENCY",
      "AI",
      "AIG",
      "AIRBUS",
      "AIRFORCE",
      "AIRTEL",
      "AKDN",
      "AL",
      "ALFAROMEO",
      "ALIBABA",
      "ALIPAY",
      "ALLFINANZ",
      "ALLSTATE",
      "ALLY",
      "ALSACE",
      "ALSTOM",
      "AM",
      "AMAZON",
      "AMERICANEXPRESS",
      "AMERICANFAMILY",
      "AMEX",
      "AMFAM",
      "AMICA",
      "AMSTERDAM",
      "ANALYTICS",
      "ANDROID",
      "ANQUAN",
      "ANZ",
      "AO",
      "AOL",
      "APARTMENTS",
      "APP",
      "APPLE",
      "AQ",
      "AQUARELLE",
      "AR",
      "ARAB",
      "ARAMCO",
      "ARCHI",
      "ARMY",
      "ARPA",
      "ART",
      "ARTE",
      "AS",
      "ASDA",
      "ASIA",
      "ASSOCIATES",
      "AT",
      "ATHLETA",
      "ATTORNEY",
      "AU",
      "AUCTION",
      "AUDI",
      "AUDIBLE",
      "AUDIO",
      "AUSPOST",
      "AUTHOR",
      "AUTO",
      "AUTOS",
      "AVIANCA",
      "AW",
      "AWS",
      "AX",
      "AXA",
      "AZ",
      "AZURE",
      "BA",
      "BABY",
      "BAIDU",
      "BANAMEX",
      "BANANAREPUBLIC",
      "BAND",
      "BANK",
      "BAR",
      "BARCELONA",
      "BARCLAYCARD",
      "BARCLAYS",
      "BAREFOOT",
      "BARGAINS",
      "BASEBALL",
      "BASKETBALL",
      "BAUHAUS",
      "BAYERN",
      "BB",
      "BBC",
      "BBT",
      "BBVA",
      "BCG",
      "BCN",
      "BD",
      "BE",
      "BEATS",
      "BEAUTY",
      "BEER",
      "BENTLEY",
      "BERLIN",
      "BEST",
      "BESTBUY",
      "BET",
      "BF",
      "BG",
      "BH",
      "BHARTI",
      "BI",
      "BIBLE",
      "BID",
      "BIKE",
      "BING",
      "BINGO",
      "BIO",
      "BIZ",
      "BJ",
      "BLACK",
      "BLACKFRIDAY",
      "BLOCKBUSTER",
      "BLOG",
      "BLOOMBERG",
      "BLUE",
      "BM",
      "BMS",
      "BMW",
      "BN",
      "BNPPARIBAS",
      "BO",
      "BOATS",
      "BOEHRINGER",
      "BOFA",
      "BOM",
      "BOND",
      "BOO",
      "BOOK",
      "BOOKING",
      "BOSCH",
      "BOSTIK",
      "BOSTON",
      "BOT",
      "BOUTIQUE",
      "BOX",
      "BR",
      "BRADESCO",
      "BRIDGESTONE",
      "BROADWAY",
      "BROKER",
      "BROTHER",
      "BRUSSELS",
      "BS",
      "BT",
      "BUDAPEST",
      "BUGATTI",
      "BUILD",
      "BUILDERS",
      "BUSINESS",
      "BUY",
      "BUZZ",
      "BV",
      "BW",
      "BY",
      "BZ",
      "BZH",
      "CA",
      "CAB",
      "CAFE",
      "CAL",
      "CALL",
      "CALVINKLEIN",
      "CAM",
      "CAMERA",
      "CAMP",
      "CANCERRESEARCH",
      "CANON",
      "CAPETOWN",
      "CAPITAL",
      "CAPITALONE",
      "CAR",
      "CARAVAN",
      "CARDS",
      "CARE",
      "CAREER",
      "CAREERS",
      "CARS",
      "CASA",
      "CASE",
      "CASEIH",
      "CASH",
      "CASINO",
      "CAT",
      "CATERING",
      "CATHOLIC",
      "CBA",
      "CBN",
      "CBRE",
      "CBS",
      "CC",
      "CD",
      "CENTER",
      "CEO",
      "CERN",
      "CF",
      "CFA",
      "CFD",
      "CG",
      "CH",
      "CHANEL",
      "CHANNEL",
      "CHARITY",
      "CHASE",
      "CHAT",
      "CHEAP",
      "CHINTAI",
      "CHRISTMAS",
      "CHROME",
      "CHURCH",
      "CI",
      "CIPRIANI",
      "CIRCLE",
      "CISCO",
      "CITADEL",
      "CITI",
      "CITIC",
      "CITY",
      "CITYEATS",
      "CK",
      "CL",
      "CLAIMS",
      "CLEANING",
      "CLICK",
      "CLINIC",
      "CLINIQUE",
      "CLOTHING",
      "CLOUD",
      "CLUB",
      "CLUBMED",
      "CM",
      "CN",
      "CO",
      "COACH",
      "CODES",
      "COFFEE",
      "COLLEGE",
      "COLOGNE",
      "COM",
      "COMCAST",
      "COMMBANK",
      "COMMUNITY",
      "COMPANY",
      "COMPARE",
      "COMPUTER",
      "COMSEC",
      "CONDOS",
      "CONSTRUCTION",
      "CONSULTING",
      "CONTACT",
      "CONTRACTORS",
      "COOKING",
      "COOKINGCHANNEL",
      "COOL",
      "COOP",
      "CORSICA",
      "COUNTRY",
      "COUPON",
      "COUPONS",
      "COURSES",
      "CPA",
      "CR",
      "CREDIT",
      "CREDITCARD",
      "CREDITUNION",
      "CRICKET",
      "CROWN",
      "CRS",
      "CRUISE",
      "CRUISES",
      "CSC",
      "CU",
      "CUISINELLA",
      "CV",
      "CW",
      "CX",
      "CY",
      "CYMRU",
      "CYOU",
      "CZ",
      "DABUR",
      "DAD",
      "DANCE",
      "DATA",
      "DATE",
      "DATING",
      "DATSUN",
      "DAY",
      "DCLK",
      "DDS",
      "DE",
      "DEAL",
      "DEALER",
      "DEALS",
      "DEGREE",
      "DELIVERY",
      "DELL",
      "DELOITTE",
      "DELTA",
      "DEMOCRAT",
      "DENTAL",
      "DENTIST",
      "DESI",
      "DESIGN",
      "DEV",
      "DHL",
      "DIAMONDS",
      "DIET",
      "DIGITAL",
      "DIRECT",
      "DIRECTORY",
      "DISCOUNT",
      "DISCOVER",
      "DISH",
      "DIY",
      "DJ",
      "DK",
      "DM",
      "DNP",
      "DO",
      "DOCS",
      "DOCTOR",
      "DOG",
      "DOMAINS",
      "DOT",
      "DOWNLOAD",
      "DRIVE",
      "DTV",
      "DUBAI",
      "DUCK",
      "DUNLOP",
      "DUPONT",
      "DURBAN",
      "DVAG",
      "DVR",
      "DZ",
      "EARTH",
      "EAT",
      "EC",
      "ECO",
      "EDEKA",
      "EDU",
      "EDUCATION",
      "EE",
      "EG",
      "EMAIL",
      "EMERCK",
      "ENERGY",
      "ENGINEER",
      "ENGINEERING",
      "ENTERPRISES",
      "EPSON",
      "EQUIPMENT",
      "ER",
      "ERICSSON",
      "ERNI",
      "ES",
      "ESQ",
      "ESTATE",
      "ET",
      "ETISALAT",
      "EU",
      "EUROVISION",
      "EUS",
      "EVENTS",
      "EXCHANGE",
      "EXPERT",
      "EXPOSED",
      "EXPRESS",
      "EXTRASPACE",
      "FAGE",
      "FAIL",
      "FAIRWINDS",
      "FAITH",
      "FAMILY",
      "FAN",
      "FANS",
      "FARM",
      "FARMERS",
      "FASHION",
      "FAST",
      "FEDEX",
      "FEEDBACK",
      "FERRARI",
      "FERRERO",
      "FI",
      "FIAT",
      "FIDELITY",
      "FIDO",
      "FILM",
      "FINAL",
      "FINANCE",
      "FINANCIAL",
      "FIRE",
      "FIRESTONE",
      "FIRMDALE",
      "FISH",
      "FISHING",
      "FIT",
      "FITNESS",
      "FJ",
      "FK",
      "FLICKR",
      "FLIGHTS",
      "FLIR",
      "FLORIST",
      "FLOWERS",
      "FLY",
      "FM",
      "FO",
      "FOO",
      "FOOD",
      "FOODNETWORK",
      "FOOTBALL",
      "FORD",
      "FOREX",
      "FORSALE",
      "FORUM",
      "FOUNDATION",
      "FOX",
      "FR",
      "FREE",
      "FRESENIUS",
      "FRL",
      "FROGANS",
      "FRONTDOOR",
      "FRONTIER",
      "FTR",
      "FUJITSU",
      "FUJIXEROX",
      "FUN",
      "FUND",
      "FURNITURE",
      "FUTBOL",
      "FYI",
      "GA",
      "GAL",
      "GALLERY",
      "GALLO",
      "GALLUP",
      "GAME",
      "GAMES",
      "GAP",
      "GARDEN",
      "GAY",
      "GB",
      "GBIZ",
      "GD",
      "GDN",
      "GE",
      "GEA",
      "GENT",
      "GENTING",
      "GEORGE",
      "GF",
      "GG",
      "GGEE",
      "GH",
      "GI",
      "GIFT",
      "GIFTS",
      "GIVES",
      "GIVING",
      "GL",
      "GLADE",
      "GLASS",
      "GLE",
      "GLOBAL",
      "GLOBO",
      "GM",
      "GMAIL",
      "GMBH",
      "GMO",
      "GMX",
      "GN",
      "GODADDY",
      "GOLD",
      "GOLDPOINT",
      "GOLF",
      "GOO",
      "GOODYEAR",
      "GOOG",
      "GOOGLE",
      "GOP",
      "GOT",
      "GOV",
      "GP",
      "GQ",
      "GR",
      "GRAINGER",
      "GRAPHICS",
      "GRATIS",
      "GREEN",
      "GRIPE",
      "GROCERY",
      "GROUP",
      "GS",
      "GT",
      "GU",
      "GUARDIAN",
      "GUCCI",
      "GUGE",
      "GUIDE",
      "GUITARS",
      "GURU",
      "GW",
      "GY",
      "HAIR",
      "HAMBURG",
      "HANGOUT",
      "HAUS",
      "HBO",
      "HDFC",
      "HDFCBANK",
      "HEALTH",
      "HEALTHCARE",
      "HELP",
      "HELSINKI",
      "HERE",
      "HERMES",
      "HGTV",
      "HIPHOP",
      "HISAMITSU",
      "HITACHI",
      "HIV",
      "HK",
      "HKT",
      "HM",
      "HN",
      "HOCKEY",
      "HOLDINGS",
      "HOLIDAY",
      "HOMEDEPOT",
      "HOMEGOODS",
      "HOMES",
      "HOMESENSE",
      "HONDA",
      "HORSE",
      "HOSPITAL",
      "HOST",
      "HOSTING",
      "HOT",
      "HOTELES",
      "HOTELS",
      "HOTMAIL",
      "HOUSE",
      "HOW",
      "HR",
      "HSBC",
      "HT",
      "HU",
      "HUGHES",
      "HYATT",
      "HYUNDAI",
      "IBM",
      "ICBC",
      "ICE",
      "ICU",
      "ID",
      "IE",
      "IEEE",
      "IFM",
      "IKANO",
      "IL",
      "IM",
      "IMAMAT",
      "IMDB",
      "IMMO",
      "IMMOBILIEN",
      "IN",
      "INC",
      "INDUSTRIES",
      "INFINITI",
      "INFO",
      "ING",
      "INK",
      "INSTITUTE",
      "INSURANCE",
      "INSURE",
      "INT",
      "INTERNATIONAL",
      "INTUIT",
      "INVESTMENTS",
      "IO",
      "IPIRANGA",
      "IQ",
      "IR",
      "IRISH",
      "IS",
      "ISMAILI",
      "IST",
      "ISTANBUL",
      "IT",
      "ITAU",
      "ITV",
      "IVECO",
      "JAGUAR",
      "JAVA",
      "JCB",
      "JE",
      "JEEP",
      "JETZT",
      "JEWELRY",
      "JIO",
      "JLL",
      "JM",
      "JMP",
      "JNJ",
      "JO",
      "JOBS",
      "JOBURG",
      "JOT",
      "JOY",
      "JP",
      "JPMORGAN",
      "JPRS",
      "JUEGOS",
      "JUNIPER",
      "KAUFEN",
      "KDDI",
      "KE",
      "KERRYHOTELS",
      "KERRYLOGISTICS",
      "KERRYPROPERTIES",
      "KFH",
      "KG",
      "KH",
      "KI",
      "KIA",
      "KIM",
      "KINDER",
      "KINDLE",
      "KITCHEN",
      "KIWI",
      "KM",
      "KN",
      "KOELN",
      "KOMATSU",
      "KOSHER",
      "KP",
      "KPMG",
      "KPN",
      "KR",
      "KRD",
      "KRED",
      "KUOKGROUP",
      "KW",
      "KY",
      "KYOTO",
      "KZ",
      "LA",
      "LACAIXA",
      "LAMBORGHINI",
      "LAMER",
      "LANCASTER",
      "LANCIA",
      "LAND",
      "LANDROVER",
      "LANXESS",
      "LASALLE",
      "LAT",
      "LATINO",
      "LATROBE",
      "LAW",
      "LAWYER",
      "LB",
      "LC",
      "LDS",
      "LEASE",
      "LECLERC",
      "LEFRAK",
      "LEGAL",
      "LEGO",
      "LEXUS",
      "LGBT",
      "LI",
      "LIDL",
      "LIFE",
      "LIFEINSURANCE",
      "LIFESTYLE",
      "LIGHTING",
      "LIKE",
      "LILLY",
      "LIMITED",
      "LIMO",
      "LINCOLN",
      "LINDE",
      "LINK",
      "LIPSY",
      "LIVE",
      "LIVING",
      "LIXIL",
      "LK",
      "LLC",
      "LLP",
      "LOAN",
      "LOANS",
      "LOCKER",
      "LOCUS",
      "LOFT",
      "LOL",
      "LONDON",
      "LOTTE",
      "LOTTO",
      "LOVE",
      "LPL",
      "LPLFINANCIAL",
      "LR",
      "LS",
      "LT",
      "LTD",
      "LTDA",
      "LU",
      "LUNDBECK",
      "LUXE",
      "LUXURY",
      "LV",
      "LY",
      "MA",
      "MACYS",
      "MADRID",
      "MAIF",
      "MAISON",
      "MAKEUP",
      "MAN",
      "MANAGEMENT",
      "MANGO",
      "MAP",
      "MARKET",
      "MARKETING",
      "MARKETS",
      "MARRIOTT",
      "MARSHALLS",
      "MASERATI",
      "MATTEL",
      "MBA",
      "MC",
      "MCKINSEY",
      "MD",
      "ME",
      "MED",
      "MEDIA",
      "MEET",
      "MELBOURNE",
      "MEME",
      "MEMORIAL",
      "MEN",
      "MENU",
      "MERCKMSD",
      "MG",
      "MH",
      "MIAMI",
      "MICROSOFT",
      "MIL",
      "MINI",
      "MINT",
      "MIT",
      "MITSUBISHI",
      "MK",
      "ML",
      "MLB",
      "MLS",
      "MM",
      "MMA",
      "MN",
      "MO",
      "MOBI",
      "MOBILE",
      "MODA",
      "MOE",
      "MOI",
      "MOM",
      "MONASH",
      "MONEY",
      "MONSTER",
      "MORMON",
      "MORTGAGE",
      "MOSCOW",
      "MOTO",
      "MOTORCYCLES",
      "MOV",
      "MOVIE",
      "MP",
      "MQ",
      "MR",
      "MS",
      "MSD",
      "MT",
      "MTN",
      "MTR",
      "MU",
      "MUSEUM",
      "MUTUAL",
      "MV",
      "MW",
      "MX",
      "MY",
      "MZ",
      "NA",
      "NAB",
      "NAGOYA",
      "NAME",
      "NATIONWIDE",
      "NATURA",
      "NAVY",
      "NBA",
      "NC",
      "NE",
      "NEC",
      "NET",
      "NETBANK",
      "NETFLIX",
      "NETWORK",
      "NEUSTAR",
      "NEW",
      "NEWHOLLAND",
      "NEWS",
      "NEXT",
      "NEXTDIRECT",
      "NEXUS",
      "NF",
      "NFL",
      "NG",
      "NGO",
      "NHK",
      "NI",
      "NICO",
      "NIKE",
      "NIKON",
      "NINJA",
      "NISSAN",
      "NISSAY",
      "NL",
      "NO",
      "NOKIA",
      "NORTHWESTERNMUTUAL",
      "NORTON",
      "NOW",
      "NOWRUZ",
      "NOWTV",
      "NP",
      "NR",
      "NRA",
      "NRW",
      "NTT",
      "NU",
      "NYC",
      "NZ",
      "OBI",
      "OBSERVER",
      "OFF",
      "OFFICE",
      "OKINAWA",
      "OLAYAN",
      "OLAYANGROUP",
      "OLDNAVY",
      "OLLO",
      "OM",
      "OMEGA",
      "ONE",
      "ONG",
      "ONL",
      "ONLINE",
      "ONYOURSIDE",
      "OOO",
      "OPEN",
      "ORACLE",
      "ORANGE",
      "ORG",
      "ORGANIC",
      "ORIGINS",
      "OSAKA",
      "OTSUKA",
      "OTT",
      "OVH",
      "PA",
      "PAGE",
      "PANASONIC",
      "PARIS",
      "PARS",
      "PARTNERS",
      "PARTS",
      "PARTY",
      "PASSAGENS",
      "PAY",
      "PCCW",
      "PE",
      "PET",
      "PF",
      "PFIZER",
      "PG",
      "PH",
      "PHARMACY",
      "PHD",
      "PHILIPS",
      "PHONE",
      "PHOTO",
      "PHOTOGRAPHY",
      "PHOTOS",
      "PHYSIO",
      "PICS",
      "PICTET",
      "PICTURES",
      "PID",
      "PIN",
      "PING",
      "PINK",
      "PIONEER",
      "PIZZA",
      "PK",
      "PL",
      "PLACE",
      "PLAY",
      "PLAYSTATION",
      "PLUMBING",
      "PLUS",
      "PM",
      "PN",
      "PNC",
      "POHL",
      "POKER",
      "POLITIE",
      "PORN",
      "POST",
      "PR",
      "PRAMERICA",
      "PRAXI",
      "PRESS",
      "PRIME",
      "PRO",
      "PROD",
      "PRODUCTIONS",
      "PROF",
      "PROGRESSIVE",
      "PROMO",
      "PROPERTIES",
      "PROPERTY",
      "PROTECTION",
      "PRU",
      "PRUDENTIAL",
      "PS",
      "PT",
      "PUB",
      "PW",
      "PWC",
      "PY",
      "QA",
      "QPON",
      "QUEBEC",
      "QUEST",
      "QVC",
      "RACING",
      "RADIO",
      "RAID",
      "RE",
      "READ",
      "REALESTATE",
      "REALTOR",
      "REALTY",
      "RECIPES",
      "RED",
      "REDSTONE",
      "REDUMBRELLA",
      "REHAB",
      "REISE",
      "REISEN",
      "REIT",
      "RELIANCE",
      "REN",
      "RENT",
      "RENTALS",
      "REPAIR",
      "REPORT",
      "REPUBLICAN",
      "REST",
      "RESTAURANT",
      "REVIEW",
      "REVIEWS",
      "REXROTH",
      "RICH",
      "RICHARDLI",
      "RICOH",
      "RIL",
      "RIO",
      "RIP",
      "RMIT",
      "RO",
      "ROCHER",
      "ROCKS",
      "RODEO",
      "ROGERS",
      "ROOM",
      "RS",
      "RSVP",
      "RU",
      "RUGBY",
      "RUHR",
      "RUN",
      "RW",
      "RWE",
      "RYUKYU",
      "SA",
      "SAARLAND",
      "SAFE",
      "SAFETY",
      "SAKURA",
      "SALE",
      "SALON",
      "SAMSCLUB",
      "SAMSUNG",
      "SANDVIK",
      "SANDVIKCOROMANT",
      "SANOFI",
      "SAP",
      "SARL",
      "SAS",
      "SAVE",
      "SAXO",
      "SB",
      "SBI",
      "SBS",
      "SC",
      "SCA",
      "SCB",
      "SCHAEFFLER",
      "SCHMIDT",
      "SCHOLARSHIPS",
      "SCHOOL",
      "SCHULE",
      "SCHWARZ",
      "SCIENCE",
      "SCJOHNSON",
      "SCOT",
      "SD",
      "SE",
      "SEARCH",
      "SEAT",
      "SECURE",
      "SECURITY",
      "SEEK",
      "SELECT",
      "SENER",
      "SERVICES",
      "SES",
      "SEVEN",
      "SEW",
      "SEX",
      "SEXY",
      "SFR",
      "SG",
      "SH",
      "SHANGRILA",
      "SHARP",
      "SHAW",
      "SHELL",
      "SHIA",
      "SHIKSHA",
      "SHOES",
      "SHOP",
      "SHOPPING",
      "SHOUJI",
      "SHOW",
      "SHOWTIME",
      "SI",
      "SILK",
      "SINA",
      "SINGLES",
      "SITE",
      "SJ",
      "SK",
      "SKI",
      "SKIN",
      "SKY",
      "SKYPE",
      "SL",
      "SLING",
      "SM",
      "SMART",
      "SMILE",
      "SN",
      "SNCF",
      "SO",
      "SOCCER",
      "SOCIAL",
      "SOFTBANK",
      "SOFTWARE",
      "SOHU",
      "SOLAR",
      "SOLUTIONS",
      "SONG",
      "SONY",
      "SOY",
      "SPA",
      "SPACE",
      "SPORT",
      "SPOT",
      "SPREADBETTING",
      "SR",
      "SRL",
      "SS",
      "ST",
      "STADA",
      "STAPLES",
      "STAR",
      "STATEBANK",
      "STATEFARM",
      "STC",
      "STCGROUP",
      "STOCKHOLM",
      "STORAGE",
      "STORE",
      "STREAM",
      "STUDIO",
      "STUDY",
      "STYLE",
      "SU",
      "SUCKS",
      "SUPPLIES",
      "SUPPLY",
      "SUPPORT",
      "SURF",
      "SURGERY",
      "SUZUKI",
      "SV",
      "SWATCH",
      "SWIFTCOVER",
      "SWISS",
      "SX",
      "SY",
      "SYDNEY",
      "SYSTEMS",
      "SZ",
      "TAB",
      "TAIPEI",
      "TALK",
      "TAOBAO",
      "TARGET",
      "TATAMOTORS",
      "TATAR",
      "TATTOO",
      "TAX",
      "TAXI",
      "TC",
      "TCI",
      "TD",
      "TDK",
      "TEAM",
      "TECH",
      "TECHNOLOGY",
      "TEL",
      "TEMASEK",
      "TENNIS",
      "TEVA",
      "TF",
      "TG",
      "TH",
      "THD",
      "THEATER",
      "THEATRE",
      "TIAA",
      "TICKETS",
      "TIENDA",
      "TIFFANY",
      "TIPS",
      "TIRES",
      "TIROL",
      "TJ",
      "TJMAXX",
      "TJX",
      "TK",
      "TKMAXX",
      "TL",
      "TM",
      "TMALL",
      "TN",
      "TO",
      "TODAY",
      "TOKYO",
      "TOOLS",
      "TOP",
      "TORAY",
      "TOSHIBA",
      "TOTAL",
      "TOURS",
      "TOWN",
      "TOYOTA",
      "TOYS",
      "TR",
      "TRADE",
      "TRADING",
      "TRAINING",
      "TRAVEL",
      "TRAVELCHANNEL",
      "TRAVELERS",
      "TRAVELERSINSURANCE",
      "TRUST",
      "TRV",
      "TT",
      "TUBE",
      "TUI",
      "TUNES",
      "TUSHU",
      "TV",
      "TVS",
      "TW",
      "TZ",
      "UA",
      "UBANK",
      "UBS",
      "UG",
      "UK",
      "UNICOM",
      "UNIVERSITY",
      "UNO",
      "UOL",
      "UPS",
      "US",
      "UY",
      "UZ",
      "VA",
      "VACATIONS",
      "VANA",
      "VANGUARD",
      "VC",
      "VE",
      "VEGAS",
      "VENTURES",
      "VERISIGN",
      "VERSICHERUNG",
      "VET",
      "VG",
      "VI",
      "VIAJES",
      "VIDEO",
      "VIG",
      "VIKING",
      "VILLAS",
      "VIN",
      "VIP",
      "VIRGIN",
      "VISA",
      "VISION",
      "VIVA",
      "VIVO",
      "VLAANDEREN",
      "VN",
      "VODKA",
      "VOLKSWAGEN",
      "VOLVO",
      "VOTE",
      "VOTING",
      "VOTO",
      "VOYAGE",
      "VU",
      "VUELOS",
      "WALES",
      "WALMART",
      "WALTER",
      "WANG",
      "WANGGOU",
      "WATCH",
      "WATCHES",
      "WEATHER",
      "WEATHERCHANNEL",
      "WEBCAM",
      "WEBER",
      "WEBSITE",
      "WED",
      "WEDDING",
      "WEIBO",
      "WEIR",
      "WF",
      "WHOSWHO",
      "WIEN",
      "WIKI",
      "WILLIAMHILL",
      "WIN",
      "WINDOWS",
      "WINE",
      "WINNERS",
      "WME",
      "WOLTERSKLUWER",
      "WOODSIDE",
      "WORK",
      "WORKS",
      "WORLD",
      "WOW",
      "WS",
      "WTC",
      "WTF",
      "XBOX",
      "XEROX",
      "XFINITY",
      "XIHUAN",
      "XIN",
      "XN--11B4C3D",
      "XN--1CK2E1B",
      "XN--1QQW23A",
      "XN--2SCRJ9C",
      "XN--30RR7Y",
      "XN--3BST00M",
      "XN--3DS443G",
      "XN--3E0B707E",
      "XN--3HCRJ9C",
      "XN--3OQ18VL8PN36A",
      "XN--3PXU8K",
      "XN--42C2D9A",
      "XN--45BR5CYL",
      "XN--45BRJ9C",
      "XN--45Q11C",
      "XN--4GBRIM",
      "XN--54B7FTA0CC",
      "XN--55QW42G",
      "XN--55QX5D",
      "XN--5SU34J936BGSG",
      "XN--5TZM5G",
      "XN--6FRZ82G",
      "XN--6QQ986B3XL",
      "XN--80ADXHKS",
      "XN--80AO21A",
      "XN--80AQECDR1A",
      "XN--80ASEHDB",
      "XN--80ASWG",
      "XN--8Y0A063A",
      "XN--90A3AC",
      "XN--90AE",
      "XN--90AIS",
      "XN--9DBQ2A",
      "XN--9ET52U",
      "XN--9KRT00A",
      "XN--B4W605FERD",
      "XN--BCK1B9A5DRE4C",
      "XN--C1AVG",
      "XN--C2BR7G",
      "XN--CCK2B3B",
      "XN--CCKWCXETD",
      "XN--CG4BKI",
      "XN--CLCHC0EA0B2G2A9GCD",
      "XN--CZR694B",
      "XN--CZRS0T",
      "XN--CZRU2D",
      "XN--D1ACJ3B",
      "XN--D1ALF",
      "XN--E1A4C",
      "XN--ECKVDTC9D",
      "XN--EFVY88H",
      "XN--FCT429K",
      "XN--FHBEI",
      "XN--FIQ228C5HS",
      "XN--FIQ64B",
      "XN--FIQS8S",
      "XN--FIQZ9S",
      "XN--FJQ720A",
      "XN--FLW351E",
      "XN--FPCRJ9C3D",
      "XN--FZC2C9E2C",
      "XN--FZYS8D69UVGM",
      "XN--G2XX48C",
      "XN--GCKR3F0F",
      "XN--GECRJ9C",
      "XN--GK3AT1E",
      "XN--H2BREG3EVE",
      "XN--H2BRJ9C",
      "XN--H2BRJ9C8C",
      "XN--HXT814E",
      "XN--I1B6B1A6A2E",
      "XN--IMR513N",
      "XN--IO0A7I",
      "XN--J1AEF",
      "XN--J1AMH",
      "XN--J6W193G",
      "XN--JLQ480N2RG",
      "XN--JLQ61U9W7B",
      "XN--JVR189M",
      "XN--KCRX77D1X4A",
      "XN--KPRW13D",
      "XN--KPRY57D",
      "XN--KPUT3I",
      "XN--L1ACC",
      "XN--LGBBAT1AD8J",
      "XN--MGB9AWBF",
      "XN--MGBA3A3EJT",
      "XN--MGBA3A4F16A",
      "XN--MGBA7C0BBN0A",
      "XN--MGBAAKC7DVF",
      "XN--MGBAAM7A8H",
      "XN--MGBAB2BD",
      "XN--MGBAH1A3HJKRD",
      "XN--MGBAI9AZGQP6J",
      "XN--MGBAYH7GPA",
      "XN--MGBBH1A",
      "XN--MGBBH1A71E",
      "XN--MGBC0A9AZCG",
      "XN--MGBCA7DZDO",
      "XN--MGBCPQ6GPA1A",
      "XN--MGBERP4A5D4AR",
      "XN--MGBGU82A",
      "XN--MGBI4ECEXP",
      "XN--MGBPL2FH",
      "XN--MGBT3DHD",
      "XN--MGBTX2B",
      "XN--MGBX4CD0AB",
      "XN--MIX891F",
      "XN--MK1BU44C",
      "XN--MXTQ1M",
      "XN--NGBC5AZD",
      "XN--NGBE9E0A",
      "XN--NGBRX",
      "XN--NODE",
      "XN--NQV7F",
      "XN--NQV7FS00EMA",
      "XN--NYQY26A",
      "XN--O3CW4H",
      "XN--OGBPF8FL",
      "XN--OTU796D",
      "XN--P1ACF",
      "XN--P1AI",
      "XN--PGBS0DH",
      "XN--PSSY2U",
      "XN--Q7CE6A",
      "XN--Q9JYB4C",
      "XN--QCKA1PMC",
      "XN--QXA6A",
      "XN--QXAM",
      "XN--RHQV96G",
      "XN--ROVU88B",
      "XN--RVC1E0AM3E",
      "XN--S9BRJ9C",
      "XN--SES554G",
      "XN--T60B56A",
      "XN--TCKWE",
      "XN--TIQ49XQYJ",
      "XN--UNUP4Y",
      "XN--VERMGENSBERATER-CTB",
      "XN--VERMGENSBERATUNG-PWB",
      "XN--VHQUV",
      "XN--VUQ861B",
      "XN--W4R85EL8FHU5DNRA",
      "XN--W4RS40L",
      "XN--WGBH1C",
      "XN--WGBL6A",
      "XN--XHQ521B",
      "XN--XKC2AL3HYE2A",
      "XN--XKC2DL3A5EE0H",
      "XN--Y9A3AQ",
      "XN--YFRO4I67O",
      "XN--YGBI2AMMX",
      "XN--ZFR164B",
      "XXX",
      "XYZ",
      "YACHTS",
      "YAHOO",
      "YAMAXUN",
      "YANDEX",
      "YE",
      "YODOBASHI",
      "YOGA",
      "YOKOHAMA",
      "YOU",
      "YOUTUBE",
      "YT",
      "YUN",
      "ZA",
      "ZAPPOS",
      "ZARA",
      "ZERO",
      "ZIP",
      "ZM",
      "ZONE",
      "ZUERICH",
      "ZW"
    ];
    module2.exports = new Set(internals.tlds.map((tld) => tld.toLowerCase()));
  }
});

// node_modules/joi/lib/types/string.js
var require_string = __commonJS({
  "node_modules/joi/lib/types/string.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Domain = require_domain();
    var Email = require_email();
    var Ip = require_ip();
    var EscapeRegex = require_escapeRegex();
    var Tlds = require_tlds();
    var Uri = require_uri();
    var Any = require_any();
    var Common = require_common();
    var internals = {
      tlds: Tlds instanceof Set ? { tlds: { allow: Tlds, deny: null } } : false,
      base64Regex: {
        true: {
          true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}==|[\w\-]{3}=)?$/,
          false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
        },
        false: {
          true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}(==)?|[\w\-]{3}=?)?$/,
          false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/
        }
      },
      dataUriRegex: /^data:[\w+.-]+\/[\w+.-]+;((charset=[\w-]+|base64),)?(.*)$/,
      hexRegex: /^[a-f0-9]+$/i,
      ipRegex: Ip.regex({ cidr: "forbidden" }).regex,
      isoDurationRegex: /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/,
      guidBrackets: {
        "{": "}",
        "[": "]",
        "(": ")",
        "": ""
      },
      guidVersions: {
        uuidv1: "1",
        uuidv2: "2",
        uuidv3: "3",
        uuidv4: "4",
        uuidv5: "5"
      },
      guidSeparators: /* @__PURE__ */ new Set([void 0, true, false, "-", ":"]),
      normalizationForms: ["NFC", "NFD", "NFKC", "NFKD"]
    };
    module2.exports = Any.extend({
      type: "string",
      flags: {
        insensitive: { default: false },
        truncate: { default: false }
      },
      terms: {
        replacements: { init: null }
      },
      coerce: {
        from: "string",
        method(value, { schema, state, prefs }) {
          const normalize = schema.$_getRule("normalize");
          if (normalize) {
            value = value.normalize(normalize.args.form);
          }
          const casing = schema.$_getRule("case");
          if (casing) {
            value = casing.args.direction === "upper" ? value.toLocaleUpperCase() : value.toLocaleLowerCase();
          }
          const trim = schema.$_getRule("trim");
          if (trim && trim.args.enabled) {
            value = value.trim();
          }
          if (schema.$_terms.replacements) {
            for (const replacement of schema.$_terms.replacements) {
              value = value.replace(replacement.pattern, replacement.replacement);
            }
          }
          const hex = schema.$_getRule("hex");
          if (hex && hex.args.options.byteAligned && value.length % 2 !== 0) {
            value = `0${value}`;
          }
          if (schema.$_getRule("isoDate")) {
            const iso = internals.isoDate(value);
            if (iso) {
              value = iso;
            }
          }
          if (schema._flags.truncate) {
            const rule = schema.$_getRule("max");
            if (rule) {
              let limit = rule.args.limit;
              if (Common.isResolvable(limit)) {
                limit = limit.resolve(value, state, prefs);
                if (!Common.limit(limit)) {
                  return { value, errors: schema.$_createError("any.ref", limit, { ref: rule.args.limit, arg: "limit", reason: "must be a positive integer" }, state, prefs) };
                }
              }
              value = value.slice(0, limit);
            }
          }
          return { value };
        }
      },
      validate(value, { schema, error }) {
        if (typeof value !== "string") {
          return { value, errors: error("string.base") };
        }
        if (value === "") {
          const min = schema.$_getRule("min");
          if (min && min.args.limit === 0) {
            return;
          }
          return { value, errors: error("string.empty") };
        }
      },
      rules: {
        alphanum: {
          method() {
            return this.$_addRule("alphanum");
          },
          validate(value, helpers) {
            if (/^[a-zA-Z0-9]+$/.test(value)) {
              return value;
            }
            return helpers.error("string.alphanum");
          }
        },
        base64: {
          method(options = {}) {
            Common.assertOptions(options, ["paddingRequired", "urlSafe"]);
            options = __spreadValues({ urlSafe: false, paddingRequired: true }, options);
            Assert(typeof options.paddingRequired === "boolean", "paddingRequired must be boolean");
            Assert(typeof options.urlSafe === "boolean", "urlSafe must be boolean");
            return this.$_addRule({ name: "base64", args: { options } });
          },
          validate(value, helpers, { options }) {
            const regex = internals.base64Regex[options.paddingRequired][options.urlSafe];
            if (regex.test(value)) {
              return value;
            }
            return helpers.error("string.base64");
          }
        },
        case: {
          method(direction) {
            Assert(["lower", "upper"].includes(direction), "Invalid case:", direction);
            return this.$_addRule({ name: "case", args: { direction } });
          },
          validate(value, helpers, { direction }) {
            if (direction === "lower" && value === value.toLocaleLowerCase() || direction === "upper" && value === value.toLocaleUpperCase()) {
              return value;
            }
            return helpers.error(`string.${direction}case`);
          },
          convert: true
        },
        creditCard: {
          method() {
            return this.$_addRule("creditCard");
          },
          validate(value, helpers) {
            let i = value.length;
            let sum = 0;
            let mul = 1;
            while (i--) {
              const char = value.charAt(i) * mul;
              sum = sum + (char - (char > 9) * 9);
              mul = mul ^ 3;
            }
            if (sum > 0 && sum % 10 === 0) {
              return value;
            }
            return helpers.error("string.creditCard");
          }
        },
        dataUri: {
          method(options = {}) {
            Common.assertOptions(options, ["paddingRequired"]);
            options = __spreadValues({ paddingRequired: true }, options);
            Assert(typeof options.paddingRequired === "boolean", "paddingRequired must be boolean");
            return this.$_addRule({ name: "dataUri", args: { options } });
          },
          validate(value, helpers, { options }) {
            const matches = value.match(internals.dataUriRegex);
            if (matches) {
              if (!matches[2]) {
                return value;
              }
              if (matches[2] !== "base64") {
                return value;
              }
              const base64regex = internals.base64Regex[options.paddingRequired].false;
              if (base64regex.test(matches[3])) {
                return value;
              }
            }
            return helpers.error("string.dataUri");
          }
        },
        domain: {
          method(options) {
            if (options) {
              Common.assertOptions(options, ["allowFullyQualified", "allowUnicode", "maxDomainSegments", "minDomainSegments", "tlds"]);
            }
            const address = internals.addressOptions(options);
            return this.$_addRule({ name: "domain", args: { options }, address });
          },
          validate(value, helpers, args, { address }) {
            if (Domain.isValid(value, address)) {
              return value;
            }
            return helpers.error("string.domain");
          }
        },
        email: {
          method(options = {}) {
            Common.assertOptions(options, ["allowFullyQualified", "allowUnicode", "ignoreLength", "maxDomainSegments", "minDomainSegments", "multiple", "separator", "tlds"]);
            Assert(options.multiple === void 0 || typeof options.multiple === "boolean", "multiple option must be an boolean");
            const address = internals.addressOptions(options);
            const regex = new RegExp(`\\s*[${options.separator ? EscapeRegex(options.separator) : ","}]\\s*`);
            return this.$_addRule({ name: "email", args: { options }, regex, address });
          },
          validate(value, helpers, { options }, { regex, address }) {
            const emails = options.multiple ? value.split(regex) : [value];
            const invalids = [];
            for (const email of emails) {
              if (!Email.isValid(email, address)) {
                invalids.push(email);
              }
            }
            if (!invalids.length) {
              return value;
            }
            return helpers.error("string.email", { value, invalids });
          }
        },
        guid: {
          alias: "uuid",
          method(options = {}) {
            Common.assertOptions(options, ["version", "separator"]);
            let versionNumbers = "";
            if (options.version) {
              const versions = [].concat(options.version);
              Assert(versions.length >= 1, "version must have at least 1 valid version specified");
              const set = /* @__PURE__ */ new Set();
              for (let i = 0; i < versions.length; ++i) {
                const version = versions[i];
                Assert(typeof version === "string", "version at position " + i + " must be a string");
                const versionNumber = internals.guidVersions[version.toLowerCase()];
                Assert(versionNumber, "version at position " + i + " must be one of " + Object.keys(internals.guidVersions).join(", "));
                Assert(!set.has(versionNumber), "version at position " + i + " must not be a duplicate");
                versionNumbers += versionNumber;
                set.add(versionNumber);
              }
            }
            Assert(internals.guidSeparators.has(options.separator), 'separator must be one of true, false, "-", or ":"');
            const separator = options.separator === void 0 ? "[:-]?" : options.separator === true ? "[:-]" : options.separator === false ? "[]?" : `\\${options.separator}`;
            const regex = new RegExp(`^([\\[{\\(]?)[0-9A-F]{8}(${separator})[0-9A-F]{4}\\2?[${versionNumbers || "0-9A-F"}][0-9A-F]{3}\\2?[${versionNumbers ? "89AB" : "0-9A-F"}][0-9A-F]{3}\\2?[0-9A-F]{12}([\\]}\\)]?)$`, "i");
            return this.$_addRule({ name: "guid", args: { options }, regex });
          },
          validate(value, helpers, args, { regex }) {
            const results = regex.exec(value);
            if (!results) {
              return helpers.error("string.guid");
            }
            if (internals.guidBrackets[results[1]] !== results[results.length - 1]) {
              return helpers.error("string.guid");
            }
            return value;
          }
        },
        hex: {
          method(options = {}) {
            Common.assertOptions(options, ["byteAligned"]);
            options = __spreadValues({ byteAligned: false }, options);
            Assert(typeof options.byteAligned === "boolean", "byteAligned must be boolean");
            return this.$_addRule({ name: "hex", args: { options } });
          },
          validate(value, helpers, { options }) {
            if (!internals.hexRegex.test(value)) {
              return helpers.error("string.hex");
            }
            if (options.byteAligned && value.length % 2 !== 0) {
              return helpers.error("string.hexAlign");
            }
            return value;
          }
        },
        hostname: {
          method() {
            return this.$_addRule("hostname");
          },
          validate(value, helpers) {
            if (Domain.isValid(value, { minDomainSegments: 1 }) || internals.ipRegex.test(value)) {
              return value;
            }
            return helpers.error("string.hostname");
          }
        },
        insensitive: {
          method() {
            return this.$_setFlag("insensitive", true);
          }
        },
        ip: {
          method(options = {}) {
            Common.assertOptions(options, ["cidr", "version"]);
            const { cidr, versions, regex } = Ip.regex(options);
            const version = options.version ? versions : void 0;
            return this.$_addRule({ name: "ip", args: { options: { cidr, version } }, regex });
          },
          validate(value, helpers, { options }, { regex }) {
            if (regex.test(value)) {
              return value;
            }
            if (options.version) {
              return helpers.error("string.ipVersion", { value, cidr: options.cidr, version: options.version });
            }
            return helpers.error("string.ip", { value, cidr: options.cidr });
          }
        },
        isoDate: {
          method() {
            return this.$_addRule("isoDate");
          },
          validate(value, { error }) {
            if (internals.isoDate(value)) {
              return value;
            }
            return error("string.isoDate");
          }
        },
        isoDuration: {
          method() {
            return this.$_addRule("isoDuration");
          },
          validate(value, helpers) {
            if (internals.isoDurationRegex.test(value)) {
              return value;
            }
            return helpers.error("string.isoDuration");
          }
        },
        length: {
          method(limit, encoding) {
            return internals.length(this, "length", limit, "=", encoding);
          },
          validate(value, helpers, { limit, encoding }, { name, operator, args }) {
            const length = encoding ? Buffer && Buffer.byteLength(value, encoding) : value.length;
            if (Common.compare(length, limit, operator)) {
              return value;
            }
            return helpers.error("string." + name, { limit: args.limit, value, encoding });
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            },
            "encoding"
          ]
        },
        lowercase: {
          method() {
            return this.case("lower");
          }
        },
        max: {
          method(limit, encoding) {
            return internals.length(this, "max", limit, "<=", encoding);
          },
          args: ["limit", "encoding"]
        },
        min: {
          method(limit, encoding) {
            return internals.length(this, "min", limit, ">=", encoding);
          },
          args: ["limit", "encoding"]
        },
        normalize: {
          method(form = "NFC") {
            Assert(internals.normalizationForms.includes(form), "normalization form must be one of " + internals.normalizationForms.join(", "));
            return this.$_addRule({ name: "normalize", args: { form } });
          },
          validate(value, { error }, { form }) {
            if (value === value.normalize(form)) {
              return value;
            }
            return error("string.normalize", { value, form });
          },
          convert: true
        },
        pattern: {
          alias: "regex",
          method(regex, options = {}) {
            Assert(regex instanceof RegExp, "regex must be a RegExp");
            Assert(!regex.flags.includes("g") && !regex.flags.includes("y"), "regex should not use global or sticky mode");
            if (typeof options === "string") {
              options = { name: options };
            }
            Common.assertOptions(options, ["invert", "name"]);
            const errorCode = ["string.pattern", options.invert ? ".invert" : "", options.name ? ".name" : ".base"].join("");
            return this.$_addRule({ name: "pattern", args: { regex, options }, errorCode });
          },
          validate(value, helpers, { regex, options }, { errorCode }) {
            const patternMatch = regex.test(value);
            if (patternMatch ^ options.invert) {
              return value;
            }
            return helpers.error(errorCode, { name: options.name, regex, value });
          },
          args: ["regex", "options"],
          multi: true
        },
        replace: {
          method(pattern, replacement) {
            if (typeof pattern === "string") {
              pattern = new RegExp(EscapeRegex(pattern), "g");
            }
            Assert(pattern instanceof RegExp, "pattern must be a RegExp");
            Assert(typeof replacement === "string", "replacement must be a String");
            const obj = this.clone();
            if (!obj.$_terms.replacements) {
              obj.$_terms.replacements = [];
            }
            obj.$_terms.replacements.push({ pattern, replacement });
            return obj;
          }
        },
        token: {
          method() {
            return this.$_addRule("token");
          },
          validate(value, helpers) {
            if (/^\w+$/.test(value)) {
              return value;
            }
            return helpers.error("string.token");
          }
        },
        trim: {
          method(enabled = true) {
            Assert(typeof enabled === "boolean", "enabled must be a boolean");
            return this.$_addRule({ name: "trim", args: { enabled } });
          },
          validate(value, helpers, { enabled }) {
            if (!enabled || value === value.trim()) {
              return value;
            }
            return helpers.error("string.trim");
          },
          convert: true
        },
        truncate: {
          method(enabled = true) {
            Assert(typeof enabled === "boolean", "enabled must be a boolean");
            return this.$_setFlag("truncate", enabled);
          }
        },
        uppercase: {
          method() {
            return this.case("upper");
          }
        },
        uri: {
          method(options = {}) {
            Common.assertOptions(options, ["allowRelative", "allowQuerySquareBrackets", "domain", "relativeOnly", "scheme"]);
            if (options.domain) {
              Common.assertOptions(options.domain, ["allowFullyQualified", "allowUnicode", "maxDomainSegments", "minDomainSegments", "tlds"]);
            }
            const { regex, scheme } = Uri.regex(options);
            const domain = options.domain ? internals.addressOptions(options.domain) : null;
            return this.$_addRule({ name: "uri", args: { options }, regex, domain, scheme });
          },
          validate(value, helpers, { options }, { regex, domain, scheme }) {
            if (["http:/", "https:/"].includes(value)) {
              return helpers.error("string.uri");
            }
            const match = regex.exec(value);
            if (match) {
              const matched = match[1] || match[2];
              if (domain && (!options.allowRelative || matched) && !Domain.isValid(matched, domain)) {
                return helpers.error("string.domain", { value: matched });
              }
              return value;
            }
            if (options.relativeOnly) {
              return helpers.error("string.uriRelativeOnly");
            }
            if (options.scheme) {
              return helpers.error("string.uriCustomScheme", { scheme, value });
            }
            return helpers.error("string.uri");
          }
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.replacements) {
            for (const { pattern, replacement } of desc.replacements) {
              obj = obj.replace(pattern, replacement);
            }
          }
          return obj;
        }
      },
      messages: {
        "string.alphanum": "{{#label}} must only contain alpha-numeric characters",
        "string.base": "{{#label}} must be a string",
        "string.base64": "{{#label}} must be a valid base64 string",
        "string.creditCard": "{{#label}} must be a credit card",
        "string.dataUri": "{{#label}} must be a valid dataUri string",
        "string.domain": "{{#label}} must contain a valid domain name",
        "string.email": "{{#label}} must be a valid email",
        "string.empty": "{{#label}} is not allowed to be empty",
        "string.guid": "{{#label}} must be a valid GUID",
        "string.hex": "{{#label}} must only contain hexadecimal characters",
        "string.hexAlign": "{{#label}} hex decoded representation must be byte aligned",
        "string.hostname": "{{#label}} must be a valid hostname",
        "string.ip": "{{#label}} must be a valid ip address with a {{#cidr}} CIDR",
        "string.ipVersion": "{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR",
        "string.isoDate": "{{#label}} must be in iso format",
        "string.isoDuration": "{{#label}} must be a valid ISO 8601 duration",
        "string.length": "{{#label}} length must be {{#limit}} characters long",
        "string.lowercase": "{{#label}} must only contain lowercase characters",
        "string.max": "{{#label}} length must be less than or equal to {{#limit}} characters long",
        "string.min": "{{#label}} length must be at least {{#limit}} characters long",
        "string.normalize": "{{#label}} must be unicode normalized in the {{#form}} form",
        "string.token": "{{#label}} must only contain alpha-numeric and underscore characters",
        "string.pattern.base": "{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}",
        "string.pattern.name": "{{#label}} with value {:[.]} fails to match the {{#name}} pattern",
        "string.pattern.invert.base": "{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}",
        "string.pattern.invert.name": "{{#label}} with value {:[.]} matches the inverted {{#name}} pattern",
        "string.trim": "{{#label}} must not have leading or trailing whitespace",
        "string.uri": "{{#label}} must be a valid uri",
        "string.uriCustomScheme": "{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern",
        "string.uriRelativeOnly": "{{#label}} must be a valid relative uri",
        "string.uppercase": "{{#label}} must only contain uppercase characters"
      }
    });
    internals.addressOptions = function(options) {
      if (!options) {
        return options;
      }
      Assert(options.minDomainSegments === void 0 || Number.isSafeInteger(options.minDomainSegments) && options.minDomainSegments > 0, "minDomainSegments must be a positive integer");
      Assert(options.maxDomainSegments === void 0 || Number.isSafeInteger(options.maxDomainSegments) && options.maxDomainSegments > 0, "maxDomainSegments must be a positive integer");
      if (options.tlds === false) {
        return options;
      }
      if (options.tlds === true || options.tlds === void 0) {
        Assert(internals.tlds, "Built-in TLD list disabled");
        return Object.assign({}, options, internals.tlds);
      }
      Assert(typeof options.tlds === "object", "tlds must be true, false, or an object");
      const deny = options.tlds.deny;
      if (deny) {
        if (Array.isArray(deny)) {
          options = Object.assign({}, options, { tlds: { deny: new Set(deny) } });
        }
        Assert(options.tlds.deny instanceof Set, "tlds.deny must be an array, Set, or boolean");
        Assert(!options.tlds.allow, "Cannot specify both tlds.allow and tlds.deny lists");
        internals.validateTlds(options.tlds.deny, "tlds.deny");
        return options;
      }
      const allow = options.tlds.allow;
      if (!allow) {
        return options;
      }
      if (allow === true) {
        Assert(internals.tlds, "Built-in TLD list disabled");
        return Object.assign({}, options, internals.tlds);
      }
      if (Array.isArray(allow)) {
        options = Object.assign({}, options, { tlds: { allow: new Set(allow) } });
      }
      Assert(options.tlds.allow instanceof Set, "tlds.allow must be an array, Set, or boolean");
      internals.validateTlds(options.tlds.allow, "tlds.allow");
      return options;
    };
    internals.validateTlds = function(set, source) {
      for (const tld of set) {
        Assert(Domain.isValid(tld, { minDomainSegments: 1, maxDomainSegments: 1 }), `${source} must contain valid top level domain names`);
      }
    };
    internals.isoDate = function(value) {
      if (!Common.isIsoDate(value)) {
        return null;
      }
      if (/.*T.*[+-]\d\d$/.test(value)) {
        value += "00";
      }
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString();
    };
    internals.length = function(schema, name, limit, operator, encoding) {
      Assert(!encoding || Buffer && Buffer.isEncoding(encoding), "Invalid encoding:", encoding);
      return schema.$_addRule({ name, method: "length", args: { limit, encoding }, operator });
    };
  }
});

// node_modules/joi/lib/types/symbol.js
var require_symbol = __commonJS({
  "node_modules/joi/lib/types/symbol.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Any = require_any();
    var internals = {};
    internals.Map = class extends Map {
      slice() {
        return new internals.Map(this);
      }
    };
    module2.exports = Any.extend({
      type: "symbol",
      terms: {
        map: { init: new internals.Map() }
      },
      coerce: {
        method(value, { schema, error }) {
          const lookup = schema.$_terms.map.get(value);
          if (lookup) {
            value = lookup;
          }
          if (!schema._flags.only || typeof value === "symbol") {
            return { value };
          }
          return { value, errors: error("symbol.map", { map: schema.$_terms.map }) };
        }
      },
      validate(value, { error }) {
        if (typeof value !== "symbol") {
          return { value, errors: error("symbol.base") };
        }
      },
      rules: {
        map: {
          method(iterable) {
            if (iterable && !iterable[Symbol.iterator] && typeof iterable === "object") {
              iterable = Object.entries(iterable);
            }
            Assert(iterable && iterable[Symbol.iterator], "Iterable must be an iterable or object");
            const obj = this.clone();
            const symbols = [];
            for (const entry of iterable) {
              Assert(entry && entry[Symbol.iterator], "Entry must be an iterable");
              const [key, value] = entry;
              Assert(typeof key !== "object" && typeof key !== "function" && typeof key !== "symbol", "Key must not be of type object, function, or Symbol");
              Assert(typeof value === "symbol", "Value must be a Symbol");
              obj.$_terms.map.set(key, value);
              symbols.push(value);
            }
            return obj.valid(...symbols);
          }
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.map) {
            obj = obj.map(desc.map);
          }
          return obj;
        }
      },
      messages: {
        "symbol.base": "{{#label}} must be a symbol",
        "symbol.map": "{{#label}} must be one of {{#map}}"
      }
    });
  }
});

// node_modules/joi/lib/types/binary.js
var require_binary = __commonJS({
  "node_modules/joi/lib/types/binary.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Any = require_any();
    var Common = require_common();
    module2.exports = Any.extend({
      type: "binary",
      coerce: {
        from: "string",
        method(value, { schema }) {
          try {
            return { value: Buffer.from(value, schema._flags.encoding) };
          } catch (ignoreErr) {
          }
        }
      },
      validate(value, { error }) {
        if (!Buffer.isBuffer(value)) {
          return { value, errors: error("binary.base") };
        }
      },
      rules: {
        encoding: {
          method(encoding) {
            Assert(Buffer.isEncoding(encoding), "Invalid encoding:", encoding);
            return this.$_setFlag("encoding", encoding);
          }
        },
        length: {
          method(limit) {
            return this.$_addRule({ name: "length", method: "length", args: { limit }, operator: "=" });
          },
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(value.length, limit, operator)) {
              return value;
            }
            return helpers.error("binary." + name, { limit: args.limit, value });
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            }
          ]
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "length", args: { limit }, operator: "<=" });
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "length", args: { limit }, operator: ">=" });
          }
        }
      },
      cast: {
        string: {
          from: (value) => Buffer.isBuffer(value),
          to(value, helpers) {
            return value.toString();
          }
        }
      },
      messages: {
        "binary.base": "{{#label}} must be a buffer or a string",
        "binary.length": "{{#label}} must be {{#limit}} bytes",
        "binary.max": "{{#label}} must be less than or equal to {{#limit}} bytes",
        "binary.min": "{{#label}} must be at least {{#limit}} bytes"
      }
    });
  }
});

// node_modules/joi/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/joi/lib/index.js"(exports, module2) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Cache = require_cache();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Extend = require_extend();
    var Manifest = require_manifest();
    var Ref = require_ref();
    var Template = require_template();
    var Trace = require_trace();
    var Schemas;
    var internals = {
      types: {
        alternatives: require_alternatives(),
        any: require_any(),
        array: require_array(),
        boolean: require_boolean(),
        date: require_date(),
        function: require_function(),
        link: require_link(),
        number: require_number(),
        object: require_object(),
        string: require_string(),
        symbol: require_symbol()
      },
      aliases: {
        alt: "alternatives",
        bool: "boolean",
        func: "function"
      }
    };
    if (Buffer) {
      internals.types.binary = require_binary();
    }
    internals.root = function() {
      const root = {
        _types: new Set(Object.keys(internals.types))
      };
      for (const type of root._types) {
        root[type] = function(...args) {
          Assert(!args.length || ["alternatives", "link", "object"].includes(type), "The", type, "type does not allow arguments");
          return internals.generate(this, internals.types[type], args);
        };
      }
      for (const method of ["allow", "custom", "disallow", "equal", "exist", "forbidden", "invalid", "not", "only", "optional", "options", "prefs", "preferences", "required", "strip", "valid", "when"]) {
        root[method] = function(...args) {
          return this.any()[method](...args);
        };
      }
      Object.assign(root, internals.methods);
      for (const alias in internals.aliases) {
        const target = internals.aliases[alias];
        root[alias] = root[target];
      }
      root.x = root.expression;
      if (Trace.setup) {
        Trace.setup(root);
      }
      return root;
    };
    internals.methods = {
      ValidationError: Errors.ValidationError,
      version: Common.version,
      cache: Cache.provider,
      assert(value, schema, ...args) {
        internals.assert(value, schema, true, args);
      },
      attempt(value, schema, ...args) {
        return internals.assert(value, schema, false, args);
      },
      build(desc) {
        Assert(typeof Manifest.build === "function", "Manifest functionality disabled");
        return Manifest.build(this, desc);
      },
      checkPreferences(prefs) {
        Common.checkPreferences(prefs);
      },
      compile(schema, options) {
        return Compile.compile(this, schema, options);
      },
      defaults(modifier) {
        Assert(typeof modifier === "function", "modifier must be a function");
        const joi = Object.assign({}, this);
        for (const type of joi._types) {
          const schema = modifier(joi[type]());
          Assert(Common.isSchema(schema), "modifier must return a valid schema object");
          joi[type] = function(...args) {
            return internals.generate(this, schema, args);
          };
        }
        return joi;
      },
      expression(...args) {
        return new Template(...args);
      },
      extend(...extensions) {
        Common.verifyFlat(extensions, "extend");
        Schemas = Schemas || require_schemas();
        Assert(extensions.length, "You need to provide at least one extension");
        this.assert(extensions, Schemas.extensions);
        const joi = Object.assign({}, this);
        joi._types = new Set(joi._types);
        for (let extension of extensions) {
          if (typeof extension === "function") {
            extension = extension(joi);
          }
          this.assert(extension, Schemas.extension);
          const expanded = internals.expandExtension(extension, joi);
          for (const item of expanded) {
            Assert(joi[item.type] === void 0 || joi._types.has(item.type), "Cannot override name", item.type);
            const base = item.base || this.any();
            const schema = Extend.type(base, item);
            joi._types.add(item.type);
            joi[item.type] = function(...args) {
              return internals.generate(this, schema, args);
            };
          }
        }
        return joi;
      },
      isError: Errors.ValidationError.isError,
      isExpression: Template.isTemplate,
      isRef: Ref.isRef,
      isSchema: Common.isSchema,
      in(...args) {
        return Ref.in(...args);
      },
      override: Common.symbols.override,
      ref(...args) {
        return Ref.create(...args);
      },
      types() {
        const types = {};
        for (const type of this._types) {
          types[type] = this[type]();
        }
        for (const target in internals.aliases) {
          types[target] = this[target]();
        }
        return types;
      }
    };
    internals.assert = function(value, schema, annotate, args) {
      const message = args[0] instanceof Error || typeof args[0] === "string" ? args[0] : null;
      const options = message ? args[1] : args[0];
      const result = schema.validate(value, Common.preferences({ errors: { stack: true } }, options || {}));
      let error = result.error;
      if (!error) {
        return result.value;
      }
      if (message instanceof Error) {
        throw message;
      }
      const display = annotate && typeof error.annotate === "function" ? error.annotate() : error.message;
      if (error instanceof Errors.ValidationError === false) {
        error = Clone(error);
      }
      error.message = message ? `${message} ${display}` : display;
      throw error;
    };
    internals.generate = function(root, schema, args) {
      Assert(root, "Must be invoked on a Joi instance.");
      schema.$_root = root;
      if (!schema._definition.args || !args.length) {
        return schema;
      }
      return schema._definition.args(schema, ...args);
    };
    internals.expandExtension = function(extension, joi) {
      if (typeof extension.type === "string") {
        return [extension];
      }
      const extended = [];
      for (const type of joi._types) {
        if (extension.type.test(type)) {
          const item = Object.assign({}, extension);
          item.type = type;
          item.base = joi[type]();
          extended.push(item);
        }
      }
      return extended;
    };
    module2.exports = internals.root();
  }
});

// node_modules/bcryptjs/dist/bcrypt.js
var require_bcrypt = __commonJS({
  "node_modules/bcryptjs/dist/bcrypt.js"(exports, module2) {
    (function(global, factory) {
      if (typeof define === "function" && define["amd"])
        define([], factory);
      else if (typeof require === "function" && typeof module2 === "object" && module2 && module2["exports"])
        module2["exports"] = factory();
      else
        (global["dcodeIO"] = global["dcodeIO"] || {})["bcrypt"] = factory();
    })(exports, function() {
      "use strict";
      var bcrypt2 = {};
      var randomFallback = null;
      function random(len) {
        if (typeof module2 !== "undefined" && module2 && module2["exports"])
          try {
            return require("crypto")["randomBytes"](len);
          } catch (e) {
          }
        try {
          var a;
          (self["crypto"] || self["msCrypto"])["getRandomValues"](a = new Uint32Array(len));
          return Array.prototype.slice.call(a);
        } catch (e) {
        }
        if (!randomFallback)
          throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
        return randomFallback(len);
      }
      var randomAvailable = false;
      try {
        random(1);
        randomAvailable = true;
      } catch (e) {
      }
      randomFallback = null;
      bcrypt2.setRandomFallback = function(random2) {
        randomFallback = random2;
      };
      bcrypt2.genSaltSync = function(rounds, seed_length) {
        rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof rounds !== "number")
          throw Error("Illegal arguments: " + typeof rounds + ", " + typeof seed_length);
        if (rounds < 4)
          rounds = 4;
        else if (rounds > 31)
          rounds = 31;
        var salt = [];
        salt.push("$2a$");
        if (rounds < 10)
          salt.push("0");
        salt.push(rounds.toString());
        salt.push("$");
        salt.push(base64_encode(random(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
        return salt.join("");
      };
      bcrypt2.genSalt = function(rounds, seed_length, callback) {
        if (typeof seed_length === "function")
          callback = seed_length, seed_length = void 0;
        if (typeof rounds === "function")
          callback = rounds, rounds = void 0;
        if (typeof rounds === "undefined")
          rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
        else if (typeof rounds !== "number")
          throw Error("illegal arguments: " + typeof rounds);
        function _async(callback2) {
          nextTick(function() {
            try {
              callback2(null, bcrypt2.genSaltSync(rounds));
            } catch (err) {
              callback2(err);
            }
          });
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt2.hashSync = function(s, salt) {
        if (typeof salt === "undefined")
          salt = GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof salt === "number")
          salt = bcrypt2.genSaltSync(salt);
        if (typeof s !== "string" || typeof salt !== "string")
          throw Error("Illegal arguments: " + typeof s + ", " + typeof salt);
        return _hash(s, salt);
      };
      bcrypt2.hash = function(s, salt, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s === "string" && typeof salt === "number")
            bcrypt2.genSalt(salt, function(err, salt2) {
              _hash(s, salt2, callback2, progressCallback);
            });
          else if (typeof s === "string" && typeof salt === "string")
            _hash(s, salt, callback2, progressCallback);
          else
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s + ", " + typeof salt)));
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      function safeStringCompare(known, unknown) {
        var right = 0, wrong = 0;
        for (var i = 0, k = known.length; i < k; ++i) {
          if (known.charCodeAt(i) === unknown.charCodeAt(i))
            ++right;
          else
            ++wrong;
        }
        if (right < 0)
          return false;
        return wrong === 0;
      }
      bcrypt2.compareSync = function(s, hash2) {
        if (typeof s !== "string" || typeof hash2 !== "string")
          throw Error("Illegal arguments: " + typeof s + ", " + typeof hash2);
        if (hash2.length !== 60)
          return false;
        return safeStringCompare(bcrypt2.hashSync(s, hash2.substr(0, hash2.length - 31)), hash2);
      };
      bcrypt2.compare = function(s, hash2, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s !== "string" || typeof hash2 !== "string") {
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s + ", " + typeof hash2)));
            return;
          }
          if (hash2.length !== 60) {
            nextTick(callback2.bind(this, null, false));
            return;
          }
          bcrypt2.hash(s, hash2.substr(0, 29), function(err, comp) {
            if (err)
              callback2(err);
            else
              callback2(null, safeStringCompare(comp, hash2));
          }, progressCallback);
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt2.getRounds = function(hash2) {
        if (typeof hash2 !== "string")
          throw Error("Illegal arguments: " + typeof hash2);
        return parseInt(hash2.split("$")[2], 10);
      };
      bcrypt2.getSalt = function(hash2) {
        if (typeof hash2 !== "string")
          throw Error("Illegal arguments: " + typeof hash2);
        if (hash2.length !== 60)
          throw Error("Illegal hash length: " + hash2.length + " != 60");
        return hash2.substring(0, 29);
      };
      var nextTick = typeof process !== "undefined" && process && typeof process.nextTick === "function" ? typeof setImmediate === "function" ? setImmediate : process.nextTick : setTimeout;
      function stringToBytes(str) {
        var out = [], i = 0;
        utfx.encodeUTF16toUTF8(function() {
          if (i >= str.length)
            return null;
          return str.charCodeAt(i++);
        }, function(b) {
          out.push(b);
        });
        return out;
      }
      var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
      var BASE64_INDEX = [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        0,
        1,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        -1,
        -1,
        -1,
        -1,
        -1
      ];
      var stringFromCharCode = String.fromCharCode;
      function base64_encode(b, len) {
        var off = 0, rs = [], c1, c2;
        if (len <= 0 || len > b.length)
          throw Error("Illegal len: " + len);
        while (off < len) {
          c1 = b[off++] & 255;
          rs.push(BASE64_CODE[c1 >> 2 & 63]);
          c1 = (c1 & 3) << 4;
          if (off >= len) {
            rs.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b[off++] & 255;
          c1 |= c2 >> 4 & 15;
          rs.push(BASE64_CODE[c1 & 63]);
          c1 = (c2 & 15) << 2;
          if (off >= len) {
            rs.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b[off++] & 255;
          c1 |= c2 >> 6 & 3;
          rs.push(BASE64_CODE[c1 & 63]);
          rs.push(BASE64_CODE[c2 & 63]);
        }
        return rs.join("");
      }
      function base64_decode(s, len) {
        var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
        if (len <= 0)
          throw Error("Illegal len: " + len);
        while (off < slen - 1 && olen < len) {
          code = s.charCodeAt(off++);
          c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          code = s.charCodeAt(off++);
          c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c1 == -1 || c2 == -1)
            break;
          o = c1 << 2 >>> 0;
          o |= (c2 & 48) >> 4;
          rs.push(stringFromCharCode(o));
          if (++olen >= len || off >= slen)
            break;
          code = s.charCodeAt(off++);
          c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c3 == -1)
            break;
          o = (c2 & 15) << 4 >>> 0;
          o |= (c3 & 60) >> 2;
          rs.push(stringFromCharCode(o));
          if (++olen >= len || off >= slen)
            break;
          code = s.charCodeAt(off++);
          c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          o = (c3 & 3) << 6 >>> 0;
          o |= c4;
          rs.push(stringFromCharCode(o));
          ++olen;
        }
        var res = [];
        for (off = 0; off < olen; off++)
          res.push(rs[off].charCodeAt(0));
        return res;
      }
      var utfx = function() {
        "use strict";
        var utfx2 = {};
        utfx2.MAX_CODEPOINT = 1114111;
        utfx2.encodeUTF8 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp < 128)
              dst(cp & 127);
            else if (cp < 2048)
              dst(cp >> 6 & 31 | 192), dst(cp & 63 | 128);
            else if (cp < 65536)
              dst(cp >> 12 & 15 | 224), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            else
              dst(cp >> 18 & 7 | 240), dst(cp >> 12 & 63 | 128), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            cp = null;
          }
        };
        utfx2.decodeUTF8 = function(src, dst) {
          var a, b, c, d, fail = function(b2) {
            b2 = b2.slice(0, b2.indexOf(null));
            var err = Error(b2.toString());
            err.name = "TruncatedError";
            err["bytes"] = b2;
            throw err;
          };
          while ((a = src()) !== null) {
            if ((a & 128) === 0)
              dst(a);
            else if ((a & 224) === 192)
              (b = src()) === null && fail([a, b]), dst((a & 31) << 6 | b & 63);
            else if ((a & 240) === 224)
              ((b = src()) === null || (c = src()) === null) && fail([a, b, c]), dst((a & 15) << 12 | (b & 63) << 6 | c & 63);
            else if ((a & 248) === 240)
              ((b = src()) === null || (c = src()) === null || (d = src()) === null) && fail([a, b, c, d]), dst((a & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63);
            else
              throw RangeError("Illegal starting byte: " + a);
          }
        };
        utfx2.UTF16toUTF8 = function(src, dst) {
          var c1, c2 = null;
          while (true) {
            if ((c1 = c2 !== null ? c2 : src()) === null)
              break;
            if (c1 >= 55296 && c1 <= 57343) {
              if ((c2 = src()) !== null) {
                if (c2 >= 56320 && c2 <= 57343) {
                  dst((c1 - 55296) * 1024 + c2 - 56320 + 65536);
                  c2 = null;
                  continue;
                }
              }
            }
            dst(c1);
          }
          if (c2 !== null)
            dst(c2);
        };
        utfx2.UTF8toUTF16 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp <= 65535)
              dst(cp);
            else
              cp -= 65536, dst((cp >> 10) + 55296), dst(cp % 1024 + 56320);
            cp = null;
          }
        };
        utfx2.encodeUTF16toUTF8 = function(src, dst) {
          utfx2.UTF16toUTF8(src, function(cp) {
            utfx2.encodeUTF8(cp, dst);
          });
        };
        utfx2.decodeUTF8toUTF16 = function(src, dst) {
          utfx2.decodeUTF8(src, function(cp) {
            utfx2.UTF8toUTF16(cp, dst);
          });
        };
        utfx2.calculateCodePoint = function(cp) {
          return cp < 128 ? 1 : cp < 2048 ? 2 : cp < 65536 ? 3 : 4;
        };
        utfx2.calculateUTF8 = function(src) {
          var cp, l = 0;
          while ((cp = src()) !== null)
            l += utfx2.calculateCodePoint(cp);
          return l;
        };
        utfx2.calculateUTF16asUTF8 = function(src) {
          var n = 0, l = 0;
          utfx2.UTF16toUTF8(src, function(cp) {
            ++n;
            l += utfx2.calculateCodePoint(cp);
          });
          return [n, l];
        };
        return utfx2;
      }();
      Date.now = Date.now || function() {
        return +new Date();
      };
      var BCRYPT_SALT_LEN = 16;
      var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
      var BLOWFISH_NUM_ROUNDS = 16;
      var MAX_EXECUTION_TIME = 100;
      var P_ORIG = [
        608135816,
        2242054355,
        320440878,
        57701188,
        2752067618,
        698298832,
        137296536,
        3964562569,
        1160258022,
        953160567,
        3193202383,
        887688300,
        3232508343,
        3380367581,
        1065670069,
        3041331479,
        2450970073,
        2306472731
      ];
      var S_ORIG = [
        3509652390,
        2564797868,
        805139163,
        3491422135,
        3101798381,
        1780907670,
        3128725573,
        4046225305,
        614570311,
        3012652279,
        134345442,
        2240740374,
        1667834072,
        1901547113,
        2757295779,
        4103290238,
        227898511,
        1921955416,
        1904987480,
        2182433518,
        2069144605,
        3260701109,
        2620446009,
        720527379,
        3318853667,
        677414384,
        3393288472,
        3101374703,
        2390351024,
        1614419982,
        1822297739,
        2954791486,
        3608508353,
        3174124327,
        2024746970,
        1432378464,
        3864339955,
        2857741204,
        1464375394,
        1676153920,
        1439316330,
        715854006,
        3033291828,
        289532110,
        2706671279,
        2087905683,
        3018724369,
        1668267050,
        732546397,
        1947742710,
        3462151702,
        2609353502,
        2950085171,
        1814351708,
        2050118529,
        680887927,
        999245976,
        1800124847,
        3300911131,
        1713906067,
        1641548236,
        4213287313,
        1216130144,
        1575780402,
        4018429277,
        3917837745,
        3693486850,
        3949271944,
        596196993,
        3549867205,
        258830323,
        2213823033,
        772490370,
        2760122372,
        1774776394,
        2652871518,
        566650946,
        4142492826,
        1728879713,
        2882767088,
        1783734482,
        3629395816,
        2517608232,
        2874225571,
        1861159788,
        326777828,
        3124490320,
        2130389656,
        2716951837,
        967770486,
        1724537150,
        2185432712,
        2364442137,
        1164943284,
        2105845187,
        998989502,
        3765401048,
        2244026483,
        1075463327,
        1455516326,
        1322494562,
        910128902,
        469688178,
        1117454909,
        936433444,
        3490320968,
        3675253459,
        1240580251,
        122909385,
        2157517691,
        634681816,
        4142456567,
        3825094682,
        3061402683,
        2540495037,
        79693498,
        3249098678,
        1084186820,
        1583128258,
        426386531,
        1761308591,
        1047286709,
        322548459,
        995290223,
        1845252383,
        2603652396,
        3431023940,
        2942221577,
        3202600964,
        3727903485,
        1712269319,
        422464435,
        3234572375,
        1170764815,
        3523960633,
        3117677531,
        1434042557,
        442511882,
        3600875718,
        1076654713,
        1738483198,
        4213154764,
        2393238008,
        3677496056,
        1014306527,
        4251020053,
        793779912,
        2902807211,
        842905082,
        4246964064,
        1395751752,
        1040244610,
        2656851899,
        3396308128,
        445077038,
        3742853595,
        3577915638,
        679411651,
        2892444358,
        2354009459,
        1767581616,
        3150600392,
        3791627101,
        3102740896,
        284835224,
        4246832056,
        1258075500,
        768725851,
        2589189241,
        3069724005,
        3532540348,
        1274779536,
        3789419226,
        2764799539,
        1660621633,
        3471099624,
        4011903706,
        913787905,
        3497959166,
        737222580,
        2514213453,
        2928710040,
        3937242737,
        1804850592,
        3499020752,
        2949064160,
        2386320175,
        2390070455,
        2415321851,
        4061277028,
        2290661394,
        2416832540,
        1336762016,
        1754252060,
        3520065937,
        3014181293,
        791618072,
        3188594551,
        3933548030,
        2332172193,
        3852520463,
        3043980520,
        413987798,
        3465142937,
        3030929376,
        4245938359,
        2093235073,
        3534596313,
        375366246,
        2157278981,
        2479649556,
        555357303,
        3870105701,
        2008414854,
        3344188149,
        4221384143,
        3956125452,
        2067696032,
        3594591187,
        2921233993,
        2428461,
        544322398,
        577241275,
        1471733935,
        610547355,
        4027169054,
        1432588573,
        1507829418,
        2025931657,
        3646575487,
        545086370,
        48609733,
        2200306550,
        1653985193,
        298326376,
        1316178497,
        3007786442,
        2064951626,
        458293330,
        2589141269,
        3591329599,
        3164325604,
        727753846,
        2179363840,
        146436021,
        1461446943,
        4069977195,
        705550613,
        3059967265,
        3887724982,
        4281599278,
        3313849956,
        1404054877,
        2845806497,
        146425753,
        1854211946,
        1266315497,
        3048417604,
        3681880366,
        3289982499,
        290971e4,
        1235738493,
        2632868024,
        2414719590,
        3970600049,
        1771706367,
        1449415276,
        3266420449,
        422970021,
        1963543593,
        2690192192,
        3826793022,
        1062508698,
        1531092325,
        1804592342,
        2583117782,
        2714934279,
        4024971509,
        1294809318,
        4028980673,
        1289560198,
        2221992742,
        1669523910,
        35572830,
        157838143,
        1052438473,
        1016535060,
        1802137761,
        1753167236,
        1386275462,
        3080475397,
        2857371447,
        1040679964,
        2145300060,
        2390574316,
        1461121720,
        2956646967,
        4031777805,
        4028374788,
        33600511,
        2920084762,
        1018524850,
        629373528,
        3691585981,
        3515945977,
        2091462646,
        2486323059,
        586499841,
        988145025,
        935516892,
        3367335476,
        2599673255,
        2839830854,
        265290510,
        3972581182,
        2759138881,
        3795373465,
        1005194799,
        847297441,
        406762289,
        1314163512,
        1332590856,
        1866599683,
        4127851711,
        750260880,
        613907577,
        1450815602,
        3165620655,
        3734664991,
        3650291728,
        3012275730,
        3704569646,
        1427272223,
        778793252,
        1343938022,
        2676280711,
        2052605720,
        1946737175,
        3164576444,
        3914038668,
        3967478842,
        3682934266,
        1661551462,
        3294938066,
        4011595847,
        840292616,
        3712170807,
        616741398,
        312560963,
        711312465,
        1351876610,
        322626781,
        1910503582,
        271666773,
        2175563734,
        1594956187,
        70604529,
        3617834859,
        1007753275,
        1495573769,
        4069517037,
        2549218298,
        2663038764,
        504708206,
        2263041392,
        3941167025,
        2249088522,
        1514023603,
        1998579484,
        1312622330,
        694541497,
        2582060303,
        2151582166,
        1382467621,
        776784248,
        2618340202,
        3323268794,
        2497899128,
        2784771155,
        503983604,
        4076293799,
        907881277,
        423175695,
        432175456,
        1378068232,
        4145222326,
        3954048622,
        3938656102,
        3820766613,
        2793130115,
        2977904593,
        26017576,
        3274890735,
        3194772133,
        1700274565,
        1756076034,
        4006520079,
        3677328699,
        720338349,
        1533947780,
        354530856,
        688349552,
        3973924725,
        1637815568,
        332179504,
        3949051286,
        53804574,
        2852348879,
        3044236432,
        1282449977,
        3583942155,
        3416972820,
        4006381244,
        1617046695,
        2628476075,
        3002303598,
        1686838959,
        431878346,
        2686675385,
        1700445008,
        1080580658,
        1009431731,
        832498133,
        3223435511,
        2605976345,
        2271191193,
        2516031870,
        1648197032,
        4164389018,
        2548247927,
        300782431,
        375919233,
        238389289,
        3353747414,
        2531188641,
        2019080857,
        1475708069,
        455242339,
        2609103871,
        448939670,
        3451063019,
        1395535956,
        2413381860,
        1841049896,
        1491858159,
        885456874,
        4264095073,
        4001119347,
        1565136089,
        3898914787,
        1108368660,
        540939232,
        1173283510,
        2745871338,
        3681308437,
        4207628240,
        3343053890,
        4016749493,
        1699691293,
        1103962373,
        3625875870,
        2256883143,
        3830138730,
        1031889488,
        3479347698,
        1535977030,
        4236805024,
        3251091107,
        2132092099,
        1774941330,
        1199868427,
        1452454533,
        157007616,
        2904115357,
        342012276,
        595725824,
        1480756522,
        206960106,
        497939518,
        591360097,
        863170706,
        2375253569,
        3596610801,
        1814182875,
        2094937945,
        3421402208,
        1082520231,
        3463918190,
        2785509508,
        435703966,
        3908032597,
        1641649973,
        2842273706,
        3305899714,
        1510255612,
        2148256476,
        2655287854,
        3276092548,
        4258621189,
        236887753,
        3681803219,
        274041037,
        1734335097,
        3815195456,
        3317970021,
        1899903192,
        1026095262,
        4050517792,
        356393447,
        2410691914,
        3873677099,
        3682840055,
        3913112168,
        2491498743,
        4132185628,
        2489919796,
        1091903735,
        1979897079,
        3170134830,
        3567386728,
        3557303409,
        857797738,
        1136121015,
        1342202287,
        507115054,
        2535736646,
        337727348,
        3213592640,
        1301675037,
        2528481711,
        1895095763,
        1721773893,
        3216771564,
        62756741,
        2142006736,
        835421444,
        2531993523,
        1442658625,
        3659876326,
        2882144922,
        676362277,
        1392781812,
        170690266,
        3921047035,
        1759253602,
        3611846912,
        1745797284,
        664899054,
        1329594018,
        3901205900,
        3045908486,
        2062866102,
        2865634940,
        3543621612,
        3464012697,
        1080764994,
        553557557,
        3656615353,
        3996768171,
        991055499,
        499776247,
        1265440854,
        648242737,
        3940784050,
        980351604,
        3713745714,
        1749149687,
        3396870395,
        4211799374,
        3640570775,
        1161844396,
        3125318951,
        1431517754,
        545492359,
        4268468663,
        3499529547,
        1437099964,
        2702547544,
        3433638243,
        2581715763,
        2787789398,
        1060185593,
        1593081372,
        2418618748,
        4260947970,
        69676912,
        2159744348,
        86519011,
        2512459080,
        3838209314,
        1220612927,
        3339683548,
        133810670,
        1090789135,
        1078426020,
        1569222167,
        845107691,
        3583754449,
        4072456591,
        1091646820,
        628848692,
        1613405280,
        3757631651,
        526609435,
        236106946,
        48312990,
        2942717905,
        3402727701,
        1797494240,
        859738849,
        992217954,
        4005476642,
        2243076622,
        3870952857,
        3732016268,
        765654824,
        3490871365,
        2511836413,
        1685915746,
        3888969200,
        1414112111,
        2273134842,
        3281911079,
        4080962846,
        172450625,
        2569994100,
        980381355,
        4109958455,
        2819808352,
        2716589560,
        2568741196,
        3681446669,
        3329971472,
        1835478071,
        660984891,
        3704678404,
        4045999559,
        3422617507,
        3040415634,
        1762651403,
        1719377915,
        3470491036,
        2693910283,
        3642056355,
        3138596744,
        1364962596,
        2073328063,
        1983633131,
        926494387,
        3423689081,
        2150032023,
        4096667949,
        1749200295,
        3328846651,
        309677260,
        2016342300,
        1779581495,
        3079819751,
        111262694,
        1274766160,
        443224088,
        298511866,
        1025883608,
        3806446537,
        1145181785,
        168956806,
        3641502830,
        3584813610,
        1689216846,
        3666258015,
        3200248200,
        1692713982,
        2646376535,
        4042768518,
        1618508792,
        1610833997,
        3523052358,
        4130873264,
        2001055236,
        3610705100,
        2202168115,
        4028541809,
        2961195399,
        1006657119,
        2006996926,
        3186142756,
        1430667929,
        3210227297,
        1314452623,
        4074634658,
        4101304120,
        2273951170,
        1399257539,
        3367210612,
        3027628629,
        1190975929,
        2062231137,
        2333990788,
        2221543033,
        2438960610,
        1181637006,
        548689776,
        2362791313,
        3372408396,
        3104550113,
        3145860560,
        296247880,
        1970579870,
        3078560182,
        3769228297,
        1714227617,
        3291629107,
        3898220290,
        166772364,
        1251581989,
        493813264,
        448347421,
        195405023,
        2709975567,
        677966185,
        3703036547,
        1463355134,
        2715995803,
        1338867538,
        1343315457,
        2802222074,
        2684532164,
        233230375,
        2599980071,
        2000651841,
        3277868038,
        1638401717,
        4028070440,
        3237316320,
        6314154,
        819756386,
        300326615,
        590932579,
        1405279636,
        3267499572,
        3150704214,
        2428286686,
        3959192993,
        3461946742,
        1862657033,
        1266418056,
        963775037,
        2089974820,
        2263052895,
        1917689273,
        448879540,
        3550394620,
        3981727096,
        150775221,
        3627908307,
        1303187396,
        508620638,
        2975983352,
        2726630617,
        1817252668,
        1876281319,
        1457606340,
        908771278,
        3720792119,
        3617206836,
        2455994898,
        1729034894,
        1080033504,
        976866871,
        3556439503,
        2881648439,
        1522871579,
        1555064734,
        1336096578,
        3548522304,
        2579274686,
        3574697629,
        3205460757,
        3593280638,
        3338716283,
        3079412587,
        564236357,
        2993598910,
        1781952180,
        1464380207,
        3163844217,
        3332601554,
        1699332808,
        1393555694,
        1183702653,
        3581086237,
        1288719814,
        691649499,
        2847557200,
        2895455976,
        3193889540,
        2717570544,
        1781354906,
        1676643554,
        2592534050,
        3230253752,
        1126444790,
        2770207658,
        2633158820,
        2210423226,
        2615765581,
        2414155088,
        3127139286,
        673620729,
        2805611233,
        1269405062,
        4015350505,
        3341807571,
        4149409754,
        1057255273,
        2012875353,
        2162469141,
        2276492801,
        2601117357,
        993977747,
        3918593370,
        2654263191,
        753973209,
        36408145,
        2530585658,
        25011837,
        3520020182,
        2088578344,
        530523599,
        2918365339,
        1524020338,
        1518925132,
        3760827505,
        3759777254,
        1202760957,
        3985898139,
        3906192525,
        674977740,
        4174734889,
        2031300136,
        2019492241,
        3983892565,
        4153806404,
        3822280332,
        352677332,
        2297720250,
        60907813,
        90501309,
        3286998549,
        1016092578,
        2535922412,
        2839152426,
        457141659,
        509813237,
        4120667899,
        652014361,
        1966332200,
        2975202805,
        55981186,
        2327461051,
        676427537,
        3255491064,
        2882294119,
        3433927263,
        1307055953,
        942726286,
        933058658,
        2468411793,
        3933900994,
        4215176142,
        1361170020,
        2001714738,
        2830558078,
        3274259782,
        1222529897,
        1679025792,
        2729314320,
        3714953764,
        1770335741,
        151462246,
        3013232138,
        1682292957,
        1483529935,
        471910574,
        1539241949,
        458788160,
        3436315007,
        1807016891,
        3718408830,
        978976581,
        1043663428,
        3165965781,
        1927990952,
        4200891579,
        2372276910,
        3208408903,
        3533431907,
        1412390302,
        2931980059,
        4132332400,
        1947078029,
        3881505623,
        4168226417,
        2941484381,
        1077988104,
        1320477388,
        886195818,
        18198404,
        3786409e3,
        2509781533,
        112762804,
        3463356488,
        1866414978,
        891333506,
        18488651,
        661792760,
        1628790961,
        3885187036,
        3141171499,
        876946877,
        2693282273,
        1372485963,
        791857591,
        2686433993,
        3759982718,
        3167212022,
        3472953795,
        2716379847,
        445679433,
        3561995674,
        3504004811,
        3574258232,
        54117162,
        3331405415,
        2381918588,
        3769707343,
        4154350007,
        1140177722,
        4074052095,
        668550556,
        3214352940,
        367459370,
        261225585,
        2610173221,
        4209349473,
        3468074219,
        3265815641,
        314222801,
        3066103646,
        3808782860,
        282218597,
        3406013506,
        3773591054,
        379116347,
        1285071038,
        846784868,
        2669647154,
        3771962079,
        3550491691,
        2305946142,
        453669953,
        1268987020,
        3317592352,
        3279303384,
        3744833421,
        2610507566,
        3859509063,
        266596637,
        3847019092,
        517658769,
        3462560207,
        3443424879,
        370717030,
        4247526661,
        2224018117,
        4143653529,
        4112773975,
        2788324899,
        2477274417,
        1456262402,
        2901442914,
        1517677493,
        1846949527,
        2295493580,
        3734397586,
        2176403920,
        1280348187,
        1908823572,
        3871786941,
        846861322,
        1172426758,
        3287448474,
        3383383037,
        1655181056,
        3139813346,
        901632758,
        1897031941,
        2986607138,
        3066810236,
        3447102507,
        1393639104,
        373351379,
        950779232,
        625454576,
        3124240540,
        4148612726,
        2007998917,
        544563296,
        2244738638,
        2330496472,
        2058025392,
        1291430526,
        424198748,
        50039436,
        29584100,
        3605783033,
        2429876329,
        2791104160,
        1057563949,
        3255363231,
        3075367218,
        3463963227,
        1469046755,
        985887462
      ];
      var C_ORIG = [
        1332899944,
        1700884034,
        1701343084,
        1684370003,
        1668446532,
        1869963892
      ];
      function _encipher(lr, off, P, S) {
        var n, l = lr[off], r = lr[off + 1];
        l ^= P[0];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[1];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[2];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[3];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[4];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[5];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[6];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[7];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[8];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[9];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[10];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[11];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[12];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[13];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[14];
        n = S[l >>> 24];
        n += S[256 | l >> 16 & 255];
        n ^= S[512 | l >> 8 & 255];
        n += S[768 | l & 255];
        r ^= n ^ P[15];
        n = S[r >>> 24];
        n += S[256 | r >> 16 & 255];
        n ^= S[512 | r >> 8 & 255];
        n += S[768 | r & 255];
        l ^= n ^ P[16];
        lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
        lr[off + 1] = l;
        return lr;
      }
      function _streamtoword(data, offp) {
        for (var i = 0, word = 0; i < 4; ++i)
          word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
        return { key: word, offp };
      }
      function _key(key, P, S) {
        var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
        for (i = 0; i < plen; i += 2)
          lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
        for (i = 0; i < slen; i += 2)
          lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
      }
      function _ekskey(data, key, P, S) {
        var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
        offp = 0;
        for (i = 0; i < plen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
        for (i = 0; i < slen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
      }
      function _crypt(b, salt, rounds, callback, progressCallback) {
        var cdata = C_ORIG.slice(), clen = cdata.length, err;
        if (rounds < 4 || rounds > 31) {
          err = Error("Illegal number of rounds (4-31): " + rounds);
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        if (salt.length !== BCRYPT_SALT_LEN) {
          err = Error("Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN);
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        rounds = 1 << rounds >>> 0;
        var P, S, i = 0, j;
        if (Int32Array) {
          P = new Int32Array(P_ORIG);
          S = new Int32Array(S_ORIG);
        } else {
          P = P_ORIG.slice();
          S = S_ORIG.slice();
        }
        _ekskey(salt, b, P, S);
        function next() {
          if (progressCallback)
            progressCallback(i / rounds);
          if (i < rounds) {
            var start = Date.now();
            for (; i < rounds; ) {
              i = i + 1;
              _key(b, P, S);
              _key(salt, P, S);
              if (Date.now() - start > MAX_EXECUTION_TIME)
                break;
            }
          } else {
            for (i = 0; i < 64; i++)
              for (j = 0; j < clen >> 1; j++)
                _encipher(cdata, j << 1, P, S);
            var ret = [];
            for (i = 0; i < clen; i++)
              ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
            if (callback) {
              callback(null, ret);
              return;
            } else
              return ret;
          }
          if (callback)
            nextTick(next);
        }
        if (typeof callback !== "undefined") {
          next();
        } else {
          var res;
          while (true)
            if (typeof (res = next()) !== "undefined")
              return res || [];
        }
      }
      function _hash(s, salt, callback, progressCallback) {
        var err;
        if (typeof s !== "string" || typeof salt !== "string") {
          err = Error("Invalid string / salt: Not a string");
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        var minor, offset;
        if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
          err = Error("Invalid salt version: " + salt.substring(0, 2));
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        if (salt.charAt(2) === "$")
          minor = String.fromCharCode(0), offset = 3;
        else {
          minor = salt.charAt(2);
          if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
            err = Error("Invalid salt revision: " + salt.substring(2, 4));
            if (callback) {
              nextTick(callback.bind(this, err));
              return;
            } else
              throw err;
          }
          offset = 4;
        }
        if (salt.charAt(offset + 2) > "$") {
          err = Error("Missing salt rounds");
          if (callback) {
            nextTick(callback.bind(this, err));
            return;
          } else
            throw err;
        }
        var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
        s += minor >= "a" ? "\0" : "";
        var passwordb = stringToBytes(s), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
        function finish(bytes) {
          var res = [];
          res.push("$2");
          if (minor >= "a")
            res.push(minor);
          res.push("$");
          if (rounds < 10)
            res.push("0");
          res.push(rounds.toString());
          res.push("$");
          res.push(base64_encode(saltb, saltb.length));
          res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
          return res.join("");
        }
        if (typeof callback == "undefined")
          return finish(_crypt(passwordb, saltb, rounds));
        else {
          _crypt(passwordb, saltb, rounds, function(err2, bytes) {
            if (err2)
              callback(err2, null);
            else
              callback(null, finish(bytes));
          }, progressCallback);
        }
      }
      bcrypt2.encodeBase64 = base64_encode;
      bcrypt2.decodeBase64 = base64_decode;
      return bcrypt2;
    });
  }
});

// node_modules/bcryptjs/index.js
var require_bcryptjs = __commonJS({
  "node_modules/bcryptjs/index.js"(exports, module2) {
    module2.exports = require_bcrypt();
  }
});

// src/functions/users/signup/handler.ts
__export(exports, {
  main: () => main
});

// src/libs/apiGateway.ts
var formatJSONResponse = (response) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

// src/libs/lambda.ts
var import_core = __toModule(require_core());
var import_http_json_body_parser = __toModule(require_http_json_body_parser());
var middyfy = (handler) => {
  return (0, import_core.default)(handler).use((0, import_http_json_body_parser.default)());
};

// src/functions/users/signup/handler.ts
var AWS = __toModule(require("aws-sdk"));

// src/models/users/user.model.ts
var Joi = __toModule(require_lib4());
var userSchema = Joi.object({
  name: Joi.string().min(3).max(10).required(),
  age: Joi.number().min(18).max(50).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(5).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required()
});
var user_model_default = userSchema;

// src/functions/users/signup/handler.ts
var bcrypt = __toModule(require_bcryptjs());
function schemaValidation(message, statusCode) {
  this.message = message;
  this.statusCode = statusCode;
}
var signup = async (event) => {
  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: "lccalhost",
    endpoint: "http://localhost:8000"
  });
  try {
    console.log(event.body);
    const user = event.body;
    let k = await user_model_default.validateAsync(user);
    if (k.error) {
      throw new schemaValidation(k.error, 400);
    }
    let User = await dynamo.get({
      TableName: "users",
      Key: { email: event.body.email }
    }).promise();
    if (User.Item) {
      return formatJSONResponse({
        message: ` user already exist with this email`,
        statuscode: 400
      });
    }
    const hash2 = await bcrypt.hash(event.body.password, 10);
    event.body.password = hash2;
    await dynamo.put({
      TableName: "users",
      Item: __spreadValues({}, event.body)
    }, function(err) {
      if (err) {
        return formatJSONResponse({
          message: "some error occured while sign up",
          error: err
        });
      }
    }).promise();
    const _a = event.body, { password } = _a, others = __objRest(_a, ["password"]);
    return formatJSONResponse({
      message: `user has been created`,
      user: others
    });
  } catch (error) {
    return formatJSONResponse({
      error
    });
  }
};
var main = middyfy(signup);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
/**
 * @license bcrypt.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/bcrypt.js for details
 */
//# sourceMappingURL=handler.js.map
