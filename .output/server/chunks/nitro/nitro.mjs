import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$3 } from 'node:http';
import https, { Server as Server$2 } from 'node:https';
import nodeCrypto, { createHash } from 'node:crypto';
import * as require$$0$2$1 from 'stream';
import require$$0$2__default from 'stream';
import * as require$$0$3 from 'events';
import require$$0$3__default from 'events';
import * as require$$2$5 from 'http';
import require$$2__default from 'http';
import * as require$$1$2 from 'crypto';
import require$$1__default from 'crypto';
import require$$0$1$1 from 'buffer';
import * as require$$0$4 from 'zlib';
import require$$0__default from 'zlib';
import require$$1$1$1 from 'https';
import require$$3$1 from 'net';
import require$$4$1 from 'tls';
import * as require$$7$1 from 'url';
import require$$7__default from 'url';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import * as fs from 'fs';
import * as negotiator from 'negotiator';
import * as mimeTypes from 'mime-types';
import * as path$1 from 'path';
import * as querystring from 'querystring';
import * as base64id$1 from 'base64id';
import * as timers from 'timers';
import * as cookie from 'cookie';
import * as ws from 'ws';
import * as cors from 'cors';
import { Emitter } from '@socket.io/component-emitter';
import jwt$1 from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'node:url';

nodeCrypto.webcrypto?.subtle || {};
const randomUUID = () => {
  return nodeCrypto.randomUUID();
};

const kNodeInspect = /* @__PURE__ */ Symbol.for(
  "nodejs.util.inspect.custom"
);
function toBufferLike(val) {
  if (val === void 0 || val === null) {
    return "";
  }
  const type = typeof val;
  if (type === "string") {
    return val;
  }
  if (type === "number" || type === "boolean" || type === "bigint") {
    return val.toString();
  }
  if (type === "function" || type === "symbol") {
    return "{}";
  }
  if (val instanceof Uint8Array || val instanceof ArrayBuffer) {
    return val;
  }
  if (isPlainObject$1(val)) {
    return JSON.stringify(val);
  }
  return val;
}
function isPlainObject$1(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

class Message {
  /** Access to the original [message event](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/message_event) if available. */
  event;
  /** Access to the Peer that emitted the message. */
  peer;
  /** Raw message data (can be of any type). */
  rawData;
  #id;
  #uint8Array;
  #arrayBuffer;
  #blob;
  #text;
  #json;
  constructor(rawData, peer, event) {
    this.rawData = rawData || "";
    this.peer = peer;
    this.event = event;
  }
  /**
   * Unique random [uuid v4](https://developer.mozilla.org/en-US/docs/Glossary/UUID) identifier for the message.
   */
  get id() {
    if (!this.#id) {
      this.#id = randomUUID();
    }
    return this.#id;
  }
  // --- data views ---
  /**
   * Get data as [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) value.
   *
   * If raw data is in any other format or string, it will be automatically converted and encoded.
   */
  uint8Array() {
    const _uint8Array = this.#uint8Array;
    if (_uint8Array) {
      return _uint8Array;
    }
    const rawData = this.rawData;
    if (rawData instanceof Uint8Array) {
      return this.#uint8Array = rawData;
    }
    if (rawData instanceof ArrayBuffer || rawData instanceof SharedArrayBuffer) {
      this.#arrayBuffer = rawData;
      return this.#uint8Array = new Uint8Array(rawData);
    }
    if (typeof rawData === "string") {
      this.#text = rawData;
      return this.#uint8Array = new TextEncoder().encode(this.#text);
    }
    if (Symbol.iterator in rawData) {
      return this.#uint8Array = new Uint8Array(rawData);
    }
    if (typeof rawData?.length === "number") {
      return this.#uint8Array = new Uint8Array(rawData);
    }
    if (rawData instanceof DataView) {
      return this.#uint8Array = new Uint8Array(
        rawData.buffer,
        rawData.byteOffset,
        rawData.byteLength
      );
    }
    throw new TypeError(
      `Unsupported message type: ${Object.prototype.toString.call(rawData)}`
    );
  }
  /**
   * Get data as [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) value.
   *
   * If raw data is in any other format or string, it will be automatically converted and encoded.
   */
  arrayBuffer() {
    const _arrayBuffer = this.#arrayBuffer;
    if (_arrayBuffer) {
      return _arrayBuffer;
    }
    const rawData = this.rawData;
    if (rawData instanceof ArrayBuffer || rawData instanceof SharedArrayBuffer) {
      return this.#arrayBuffer = rawData;
    }
    return this.#arrayBuffer = this.uint8Array().buffer;
  }
  /**
   * Get data as [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) value.
   *
   * If raw data is in any other format or string, it will be automatically converted and encoded. */
  blob() {
    const _blob = this.#blob;
    if (_blob) {
      return _blob;
    }
    const rawData = this.rawData;
    if (rawData instanceof Blob) {
      return this.#blob = rawData;
    }
    return this.#blob = new Blob([this.uint8Array()]);
  }
  /**
   * Get stringified text version of the message.
   *
   * If raw data is in any other format, it will be automatically converted and decoded.
   */
  text() {
    const _text = this.#text;
    if (_text) {
      return _text;
    }
    const rawData = this.rawData;
    if (typeof rawData === "string") {
      return this.#text = rawData;
    }
    return this.#text = new TextDecoder().decode(this.uint8Array());
  }
  /**
   * Get parsed version of the message text with [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
   */
  json() {
    const _json = this.#json;
    if (_json) {
      return _json;
    }
    return this.#json = JSON.parse(this.text());
  }
  /**
   * Message data (value varies based on `peer.websocket.binaryType`).
   */
  get data() {
    switch (this.peer?.websocket?.binaryType) {
      case "arraybuffer": {
        return this.arrayBuffer();
      }
      case "blob": {
        return this.blob();
      }
      case "nodebuffer": {
        return globalThis.Buffer ? Buffer.from(this.uint8Array()) : this.uint8Array();
      }
      case "uint8array": {
        return this.uint8Array();
      }
      case "text": {
        return this.text();
      }
      default: {
        return this.rawData;
      }
    }
  }
  // --- inspect ---
  toString() {
    return this.text();
  }
  [Symbol.toPrimitive]() {
    return this.text();
  }
  [kNodeInspect]() {
    return { data: this.rawData };
  }
}

class Peer {
  _internal;
  _topics;
  _id;
  #ws;
  constructor(internal) {
    this._topics = /* @__PURE__ */ new Set();
    this._internal = internal;
  }
  get context() {
    return this._internal.context ??= {};
  }
  /**
   * Unique random [uuid v4](https://developer.mozilla.org/en-US/docs/Glossary/UUID) identifier for the peer.
   */
  get id() {
    if (!this._id) {
      this._id = randomUUID();
    }
    return this._id;
  }
  /** IP address of the peer */
  get remoteAddress() {
    return void 0;
  }
  /** upgrade request */
  get request() {
    return this._internal.request;
  }
  /**
   * Get the [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) instance.
   *
   * **Note:** crossws adds polyfill for the following properties if native values are not available:
   * - `protocol`: Extracted from the `sec-websocket-protocol` header.
   * - `extensions`: Extracted from the `sec-websocket-extensions` header.
   * - `url`: Extracted from the request URL (http -> ws).
   * */
  get websocket() {
    if (!this.#ws) {
      const _ws = this._internal.ws;
      const _request = this._internal.request;
      this.#ws = _request ? createWsProxy(_ws, _request) : _ws;
    }
    return this.#ws;
  }
  /** All connected peers to the server */
  get peers() {
    return this._internal.peers || /* @__PURE__ */ new Set();
  }
  /** All topics, this peer has been subscribed to. */
  get topics() {
    return this._topics;
  }
  /** Abruptly close the connection */
  terminate() {
    this.close();
  }
  /** Subscribe to a topic */
  subscribe(topic) {
    this._topics.add(topic);
  }
  /** Unsubscribe from a topic */
  unsubscribe(topic) {
    this._topics.delete(topic);
  }
  // --- inspect ---
  toString() {
    return this.id;
  }
  [Symbol.toPrimitive]() {
    return this.id;
  }
  [Symbol.toStringTag]() {
    return "WebSocket";
  }
  [kNodeInspect]() {
    return Object.fromEntries(
      [
        ["id", this.id],
        ["remoteAddress", this.remoteAddress],
        ["peers", this.peers],
        ["webSocket", this.websocket]
      ].filter((p) => p[1])
    );
  }
}
function createWsProxy(ws, request) {
  return new Proxy(ws, {
    get: (target, prop) => {
      const value = Reflect.get(target, prop);
      if (!value) {
        switch (prop) {
          case "protocol": {
            return request?.headers?.get("sec-websocket-protocol") || "";
          }
          case "extensions": {
            return request?.headers?.get("sec-websocket-extensions") || "";
          }
          case "url": {
            return request?.url?.replace(/^http/, "ws") || void 0;
          }
        }
      }
      return value;
    }
  });
}

class AdapterHookable {
  options;
  constructor(options) {
    this.options = options || {};
  }
  callHook(name, arg1, arg2) {
    const globalHook = this.options.hooks?.[name];
    const globalPromise = globalHook?.(arg1, arg2);
    const resolveHooksPromise = this.options.resolve?.(arg1);
    if (!resolveHooksPromise) {
      return globalPromise;
    }
    const resolvePromise = resolveHooksPromise instanceof Promise ? resolveHooksPromise.then((hooks) => hooks?.[name]) : resolveHooksPromise?.[name];
    return Promise.all([globalPromise, resolvePromise]).then(
      ([globalRes, hook]) => {
        const hookResPromise = hook?.(arg1, arg2);
        return hookResPromise instanceof Promise ? hookResPromise.then((hookRes) => hookRes || globalRes) : hookResPromise || globalRes;
      }
    );
  }
  async upgrade(request) {
    let context = request.context;
    if (!context) {
      context = {};
      Object.defineProperty(request, "context", {
        enumerable: true,
        value: context
      });
    }
    try {
      const res = await this.callHook(
        "upgrade",
        request
      );
      if (!res) {
        return { context };
      }
      if (res.ok === false) {
        return { context, endResponse: res };
      }
      if (res.headers) {
        return {
          context,
          upgradeHeaders: res.headers
        };
      }
    } catch (error) {
      const errResponse = error.response || error;
      if (errResponse instanceof Response) {
        return {
          context,
          endResponse: errResponse
        };
      }
      throw error;
    }
    return { context };
  }
}

function adapterUtils(peers) {
  return {
    peers,
    publish(topic, message, options) {
      let firstPeerWithTopic;
      for (const peer of peers) {
        if (peer.topics.has(topic)) {
          firstPeerWithTopic = peer;
          break;
        }
      }
      if (firstPeerWithTopic) {
        firstPeerWithTopic.send(message, options);
        firstPeerWithTopic.publish(topic, message, options);
      }
    }
  };
}

class WSError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "WSError";
  }
}

function getDefaultExportFromCjs$1 (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var bufferUtil = {exports: {}};

var constants;
var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	const BINARY_TYPES = ['nodebuffer', 'arraybuffer', 'fragments'];
	const hasBlob = typeof Blob !== 'undefined';

	if (hasBlob) BINARY_TYPES.push('blob');

	constants = {
	  BINARY_TYPES,
	  EMPTY_BUFFER: Buffer.alloc(0),
	  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
	  hasBlob,
	  kForOnEventAttribute: Symbol('kIsForOnEventAttribute'),
	  kListener: Symbol('kListener'),
	  kStatusCode: Symbol('status-code'),
	  kWebSocket: Symbol('websocket'),
	  NOOP: () => {}
	};
	return constants;
}

var hasRequiredBufferUtil;

function requireBufferUtil () {
	if (hasRequiredBufferUtil) return bufferUtil.exports;
	hasRequiredBufferUtil = 1;

	const { EMPTY_BUFFER } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];

	/**
	 * Merges an array of buffers into a new buffer.
	 *
	 * @param {Buffer[]} list The array of buffers to concat
	 * @param {Number} totalLength The total length of buffers in the list
	 * @return {Buffer} The resulting buffer
	 * @public
	 */
	function concat(list, totalLength) {
	  if (list.length === 0) return EMPTY_BUFFER;
	  if (list.length === 1) return list[0];

	  const target = Buffer.allocUnsafe(totalLength);
	  let offset = 0;

	  for (let i = 0; i < list.length; i++) {
	    const buf = list[i];
	    target.set(buf, offset);
	    offset += buf.length;
	  }

	  if (offset < totalLength) {
	    return new FastBuffer(target.buffer, target.byteOffset, offset);
	  }

	  return target;
	}

	/**
	 * Masks a buffer using the given mask.
	 *
	 * @param {Buffer} source The buffer to mask
	 * @param {Buffer} mask The mask to use
	 * @param {Buffer} output The buffer where to store the result
	 * @param {Number} offset The offset at which to start writing
	 * @param {Number} length The number of bytes to mask.
	 * @public
	 */
	function _mask(source, mask, output, offset, length) {
	  for (let i = 0; i < length; i++) {
	    output[offset + i] = source[i] ^ mask[i & 3];
	  }
	}

	/**
	 * Unmasks a buffer using the given mask.
	 *
	 * @param {Buffer} buffer The buffer to unmask
	 * @param {Buffer} mask The mask to use
	 * @public
	 */
	function _unmask(buffer, mask) {
	  for (let i = 0; i < buffer.length; i++) {
	    buffer[i] ^= mask[i & 3];
	  }
	}

	/**
	 * Converts a buffer to an `ArrayBuffer`.
	 *
	 * @param {Buffer} buf The buffer to convert
	 * @return {ArrayBuffer} Converted buffer
	 * @public
	 */
	function toArrayBuffer(buf) {
	  if (buf.length === buf.buffer.byteLength) {
	    return buf.buffer;
	  }

	  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}

	/**
	 * Converts `data` to a `Buffer`.
	 *
	 * @param {*} data The data to convert
	 * @return {Buffer} The buffer
	 * @throws {TypeError}
	 * @public
	 */
	function toBuffer(data) {
	  toBuffer.readOnly = true;

	  if (Buffer.isBuffer(data)) return data;

	  let buf;

	  if (data instanceof ArrayBuffer) {
	    buf = new FastBuffer(data);
	  } else if (ArrayBuffer.isView(data)) {
	    buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
	  } else {
	    buf = Buffer.from(data);
	    toBuffer.readOnly = false;
	  }

	  return buf;
	}

	bufferUtil.exports = {
	  concat,
	  mask: _mask,
	  toArrayBuffer,
	  toBuffer,
	  unmask: _unmask
	};

	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) {
	  try {
	    const bufferUtil$1 = require('bufferutil');

	    bufferUtil.exports.mask = function (source, mask, output, offset, length) {
	      if (length < 48) _mask(source, mask, output, offset, length);
	      else bufferUtil$1.mask(source, mask, output, offset, length);
	    };

	    bufferUtil.exports.unmask = function (buffer, mask) {
	      if (buffer.length < 32) _unmask(buffer, mask);
	      else bufferUtil$1.unmask(buffer, mask);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return bufferUtil.exports;
}

var limiter;
var hasRequiredLimiter;

function requireLimiter () {
	if (hasRequiredLimiter) return limiter;
	hasRequiredLimiter = 1;

	const kDone = Symbol('kDone');
	const kRun = Symbol('kRun');

	/**
	 * A very simple job queue with adjustable concurrency. Adapted from
	 * https://github.com/STRML/async-limiter
	 */
	class Limiter {
	  /**
	   * Creates a new `Limiter`.
	   *
	   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
	   *     to run concurrently
	   */
	  constructor(concurrency) {
	    this[kDone] = () => {
	      this.pending--;
	      this[kRun]();
	    };
	    this.concurrency = concurrency || Infinity;
	    this.jobs = [];
	    this.pending = 0;
	  }

	  /**
	   * Adds a job to the queue.
	   *
	   * @param {Function} job The job to run
	   * @public
	   */
	  add(job) {
	    this.jobs.push(job);
	    this[kRun]();
	  }

	  /**
	   * Removes a job from the queue and runs it if possible.
	   *
	   * @private
	   */
	  [kRun]() {
	    if (this.pending === this.concurrency) return;

	    if (this.jobs.length) {
	      const job = this.jobs.shift();

	      this.pending++;
	      job(this[kDone]);
	    }
	  }
	}

	limiter = Limiter;
	return limiter;
}

var permessageDeflate;
var hasRequiredPermessageDeflate;

function requirePermessageDeflate () {
	if (hasRequiredPermessageDeflate) return permessageDeflate;
	hasRequiredPermessageDeflate = 1;

	const zlib = require$$0__default;

	const bufferUtil = requireBufferUtil();
	const Limiter = requireLimiter();
	const { kStatusCode } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];
	const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
	const kPerMessageDeflate = Symbol('permessage-deflate');
	const kTotalLength = Symbol('total-length');
	const kCallback = Symbol('callback');
	const kBuffers = Symbol('buffers');
	const kError = Symbol('error');

	//
	// We limit zlib concurrency, which prevents severe memory fragmentation
	// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
	// and https://github.com/websockets/ws/issues/1202
	//
	// Intentionally global; it's the global thread pool that's an issue.
	//
	let zlibLimiter;

	/**
	 * permessage-deflate implementation.
	 */
	class PerMessageDeflate {
	  /**
	   * Creates a PerMessageDeflate instance.
	   *
	   * @param {Object} [options] Configuration options
	   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
	   *     for, or request, a custom client window size
	   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
	   *     acknowledge disabling of client context takeover
	   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
	   *     calls to zlib
	   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
	   *     use of a custom server window size
	   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
	   *     disabling of server context takeover
	   * @param {Number} [options.threshold=1024] Size (in bytes) below which
	   *     messages should not be compressed if context takeover is disabled
	   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
	   *     deflate
	   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
	   *     inflate
	   * @param {Boolean} [isServer=false] Create the instance in either server or
	   *     client mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(options, isServer, maxPayload) {
	    this._maxPayload = maxPayload | 0;
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._isServer = !!isServer;
	    this._deflate = null;
	    this._inflate = null;

	    this.params = null;

	    if (!zlibLimiter) {
	      const concurrency =
	        this._options.concurrencyLimit !== undefined
	          ? this._options.concurrencyLimit
	          : 10;
	      zlibLimiter = new Limiter(concurrency);
	    }
	  }

	  /**
	   * @type {String}
	   */
	  static get extensionName() {
	    return 'permessage-deflate';
	  }

	  /**
	   * Create an extension negotiation offer.
	   *
	   * @return {Object} Extension parameters
	   * @public
	   */
	  offer() {
	    const params = {};

	    if (this._options.serverNoContextTakeover) {
	      params.server_no_context_takeover = true;
	    }
	    if (this._options.clientNoContextTakeover) {
	      params.client_no_context_takeover = true;
	    }
	    if (this._options.serverMaxWindowBits) {
	      params.server_max_window_bits = this._options.serverMaxWindowBits;
	    }
	    if (this._options.clientMaxWindowBits) {
	      params.client_max_window_bits = this._options.clientMaxWindowBits;
	    } else if (this._options.clientMaxWindowBits == null) {
	      params.client_max_window_bits = true;
	    }

	    return params;
	  }

	  /**
	   * Accept an extension negotiation offer/response.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Object} Accepted configuration
	   * @public
	   */
	  accept(configurations) {
	    configurations = this.normalizeParams(configurations);

	    this.params = this._isServer
	      ? this.acceptAsServer(configurations)
	      : this.acceptAsClient(configurations);

	    return this.params;
	  }

	  /**
	   * Releases all resources used by the extension.
	   *
	   * @public
	   */
	  cleanup() {
	    if (this._inflate) {
	      this._inflate.close();
	      this._inflate = null;
	    }

	    if (this._deflate) {
	      const callback = this._deflate[kCallback];

	      this._deflate.close();
	      this._deflate = null;

	      if (callback) {
	        callback(
	          new Error(
	            'The deflate stream was closed while data was being processed'
	          )
	        );
	      }
	    }
	  }

	  /**
	   *  Accept an extension negotiation offer.
	   *
	   * @param {Array} offers The extension negotiation offers
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsServer(offers) {
	    const opts = this._options;
	    const accepted = offers.find((params) => {
	      if (
	        (opts.serverNoContextTakeover === false &&
	          params.server_no_context_takeover) ||
	        (params.server_max_window_bits &&
	          (opts.serverMaxWindowBits === false ||
	            (typeof opts.serverMaxWindowBits === 'number' &&
	              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
	        (typeof opts.clientMaxWindowBits === 'number' &&
	          !params.client_max_window_bits)
	      ) {
	        return false;
	      }

	      return true;
	    });

	    if (!accepted) {
	      throw new Error('None of the extension offers can be accepted');
	    }

	    if (opts.serverNoContextTakeover) {
	      accepted.server_no_context_takeover = true;
	    }
	    if (opts.clientNoContextTakeover) {
	      accepted.client_no_context_takeover = true;
	    }
	    if (typeof opts.serverMaxWindowBits === 'number') {
	      accepted.server_max_window_bits = opts.serverMaxWindowBits;
	    }
	    if (typeof opts.clientMaxWindowBits === 'number') {
	      accepted.client_max_window_bits = opts.clientMaxWindowBits;
	    } else if (
	      accepted.client_max_window_bits === true ||
	      opts.clientMaxWindowBits === false
	    ) {
	      delete accepted.client_max_window_bits;
	    }

	    return accepted;
	  }

	  /**
	   * Accept the extension negotiation response.
	   *
	   * @param {Array} response The extension negotiation response
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsClient(response) {
	    const params = response[0];

	    if (
	      this._options.clientNoContextTakeover === false &&
	      params.client_no_context_takeover
	    ) {
	      throw new Error('Unexpected parameter "client_no_context_takeover"');
	    }

	    if (!params.client_max_window_bits) {
	      if (typeof this._options.clientMaxWindowBits === 'number') {
	        params.client_max_window_bits = this._options.clientMaxWindowBits;
	      }
	    } else if (
	      this._options.clientMaxWindowBits === false ||
	      (typeof this._options.clientMaxWindowBits === 'number' &&
	        params.client_max_window_bits > this._options.clientMaxWindowBits)
	    ) {
	      throw new Error(
	        'Unexpected or invalid parameter "client_max_window_bits"'
	      );
	    }

	    return params;
	  }

	  /**
	   * Normalize parameters.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Array} The offers/response with normalized parameters
	   * @private
	   */
	  normalizeParams(configurations) {
	    configurations.forEach((params) => {
	      Object.keys(params).forEach((key) => {
	        let value = params[key];

	        if (value.length > 1) {
	          throw new Error(`Parameter "${key}" must have only a single value`);
	        }

	        value = value[0];

	        if (key === 'client_max_window_bits') {
	          if (value !== true) {
	            const num = +value;
	            if (!Number.isInteger(num) || num < 8 || num > 15) {
	              throw new TypeError(
	                `Invalid value for parameter "${key}": ${value}`
	              );
	            }
	            value = num;
	          } else if (!this._isServer) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else if (key === 'server_max_window_bits') {
	          const num = +value;
	          if (!Number.isInteger(num) || num < 8 || num > 15) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	          value = num;
	        } else if (
	          key === 'client_no_context_takeover' ||
	          key === 'server_no_context_takeover'
	        ) {
	          if (value !== true) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else {
	          throw new Error(`Unknown parameter "${key}"`);
	        }

	        params[key] = value;
	      });
	    });

	    return configurations;
	  }

	  /**
	   * Decompress data. Concurrency limited.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  decompress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._decompress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Compress data. Concurrency limited.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  compress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._compress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Decompress data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _decompress(data, fin, callback) {
	    const endpoint = this._isServer ? 'client' : 'server';

	    if (!this._inflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._inflate = zlib.createInflateRaw({
	        ...this._options.zlibInflateOptions,
	        windowBits
	      });
	      this._inflate[kPerMessageDeflate] = this;
	      this._inflate[kTotalLength] = 0;
	      this._inflate[kBuffers] = [];
	      this._inflate.on('error', inflateOnError);
	      this._inflate.on('data', inflateOnData);
	    }

	    this._inflate[kCallback] = callback;

	    this._inflate.write(data);
	    if (fin) this._inflate.write(TRAILER);

	    this._inflate.flush(() => {
	      const err = this._inflate[kError];

	      if (err) {
	        this._inflate.close();
	        this._inflate = null;
	        callback(err);
	        return;
	      }

	      const data = bufferUtil.concat(
	        this._inflate[kBuffers],
	        this._inflate[kTotalLength]
	      );

	      if (this._inflate._readableState.endEmitted) {
	        this._inflate.close();
	        this._inflate = null;
	      } else {
	        this._inflate[kTotalLength] = 0;
	        this._inflate[kBuffers] = [];

	        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	          this._inflate.reset();
	        }
	      }

	      callback(null, data);
	    });
	  }

	  /**
	   * Compress data.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _compress(data, fin, callback) {
	    const endpoint = this._isServer ? 'server' : 'client';

	    if (!this._deflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._deflate = zlib.createDeflateRaw({
	        ...this._options.zlibDeflateOptions,
	        windowBits
	      });

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      this._deflate.on('data', deflateOnData);
	    }

	    this._deflate[kCallback] = callback;

	    this._deflate.write(data);
	    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
	      if (!this._deflate) {
	        //
	        // The deflate stream was closed while data was being processed.
	        //
	        return;
	      }

	      let data = bufferUtil.concat(
	        this._deflate[kBuffers],
	        this._deflate[kTotalLength]
	      );

	      if (fin) {
	        data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
	      }

	      //
	      // Ensure that the callback will not be called again in
	      // `PerMessageDeflate#cleanup()`.
	      //
	      this._deflate[kCallback] = null;

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	        this._deflate.reset();
	      }

	      callback(null, data);
	    });
	  }
	}

	permessageDeflate = PerMessageDeflate;

	/**
	 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function deflateOnData(chunk) {
	  this[kBuffers].push(chunk);
	  this[kTotalLength] += chunk.length;
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function inflateOnData(chunk) {
	  this[kTotalLength] += chunk.length;

	  if (
	    this[kPerMessageDeflate]._maxPayload < 1 ||
	    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
	  ) {
	    this[kBuffers].push(chunk);
	    return;
	  }

	  this[kError] = new RangeError('Max payload size exceeded');
	  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
	  this[kError][kStatusCode] = 1009;
	  this.removeListener('data', inflateOnData);

	  //
	  // The choice to employ `zlib.reset()` over `zlib.close()` is dictated by the
	  // fact that in Node.js versions prior to 13.10.0, the callback for
	  // `zlib.flush()` is not called if `zlib.close()` is used. Utilizing
	  // `zlib.reset()` ensures that either the callback is invoked or an error is
	  // emitted.
	  //
	  this.reset();
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'error'` event.
	 *
	 * @param {Error} err The emitted error
	 * @private
	 */
	function inflateOnError(err) {
	  //
	  // There is no need to call `Zlib#close()` as the handle is automatically
	  // closed when an error is emitted.
	  //
	  this[kPerMessageDeflate]._inflate = null;

	  if (this[kError]) {
	    this[kCallback](this[kError]);
	    return;
	  }

	  err[kStatusCode] = 1007;
	  this[kCallback](err);
	}
	return permessageDeflate;
}

var validation = {exports: {}};

var hasRequiredValidation;

function requireValidation () {
	if (hasRequiredValidation) return validation.exports;
	hasRequiredValidation = 1;

	const { isUtf8 } = require$$0$1$1;

	const { hasBlob } = requireConstants();

	//
	// Allowed token characters:
	//
	// '!', '#', '$', '%', '&', ''', '*', '+', '-',
	// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
	//
	// tokenChars[32] === 0 // ' '
	// tokenChars[33] === 1 // '!'
	// tokenChars[34] === 0 // '"'
	// ...
	//
	// prettier-ignore
	const tokenChars = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
	];

	/**
	 * Checks if a status code is allowed in a close frame.
	 *
	 * @param {Number} code The status code
	 * @return {Boolean} `true` if the status code is valid, else `false`
	 * @public
	 */
	function isValidStatusCode(code) {
	  return (
	    (code >= 1000 &&
	      code <= 1014 &&
	      code !== 1004 &&
	      code !== 1005 &&
	      code !== 1006) ||
	    (code >= 3000 && code <= 4999)
	  );
	}

	/**
	 * Checks if a given buffer contains only correct UTF-8.
	 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	 * Markus Kuhn.
	 *
	 * @param {Buffer} buf The buffer to check
	 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	 * @public
	 */
	function _isValidUTF8(buf) {
	  const len = buf.length;
	  let i = 0;

	  while (i < len) {
	    if ((buf[i] & 0x80) === 0) {
	      // 0xxxxxxx
	      i++;
	    } else if ((buf[i] & 0xe0) === 0xc0) {
	      // 110xxxxx 10xxxxxx
	      if (
	        i + 1 === len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i] & 0xfe) === 0xc0 // Overlong
	      ) {
	        return false;
	      }

	      i += 2;
	    } else if ((buf[i] & 0xf0) === 0xe0) {
	      // 1110xxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 2 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
	        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
	      ) {
	        return false;
	      }

	      i += 3;
	    } else if ((buf[i] & 0xf8) === 0xf0) {
	      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 3 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i + 3] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
	        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
	        buf[i] > 0xf4 // > U+10FFFF
	      ) {
	        return false;
	      }

	      i += 4;
	    } else {
	      return false;
	    }
	  }

	  return true;
	}

	/**
	 * Determines whether a value is a `Blob`.
	 *
	 * @param {*} value The value to be tested
	 * @return {Boolean} `true` if `value` is a `Blob`, else `false`
	 * @private
	 */
	function isBlob(value) {
	  return (
	    hasBlob &&
	    typeof value === 'object' &&
	    typeof value.arrayBuffer === 'function' &&
	    typeof value.type === 'string' &&
	    typeof value.stream === 'function' &&
	    (value[Symbol.toStringTag] === 'Blob' ||
	      value[Symbol.toStringTag] === 'File')
	  );
	}

	validation.exports = {
	  isBlob,
	  isValidStatusCode,
	  isValidUTF8: _isValidUTF8,
	  tokenChars
	};

	if (isUtf8) {
	  validation.exports.isValidUTF8 = function (buf) {
	    return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	  };
	} /* istanbul ignore else  */ else if (!process.env.WS_NO_UTF_8_VALIDATE) {
	  try {
	    const isValidUTF8 = require('utf-8-validate');

	    validation.exports.isValidUTF8 = function (buf) {
	      return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return validation.exports;
}

var receiver;
var hasRequiredReceiver;

function requireReceiver () {
	if (hasRequiredReceiver) return receiver;
	hasRequiredReceiver = 1;

	const { Writable } = require$$0$2__default;

	const PerMessageDeflate = requirePermessageDeflate();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  kStatusCode,
	  kWebSocket
	} = requireConstants();
	const { concat, toArrayBuffer, unmask } = requireBufferUtil();
	const { isValidStatusCode, isValidUTF8 } = requireValidation();

	const FastBuffer = Buffer[Symbol.species];

	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;
	const DEFER_EVENT = 6;

	/**
	 * HyBi Receiver implementation.
	 *
	 * @extends Writable
	 */
	class Receiver extends Writable {
	  /**
	   * Creates a Receiver instance.
	   *
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
	   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
	   *     multiple times in the same tick
	   * @param {String} [options.binaryType=nodebuffer] The type for binary data
	   * @param {Object} [options.extensions] An object containing the negotiated
	   *     extensions
	   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
	   *     client or server mode
	   * @param {Number} [options.maxPayload=0] The maximum allowed message length
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   */
	  constructor(options = {}) {
	    super();

	    this._allowSynchronousEvents =
	      options.allowSynchronousEvents !== undefined
	        ? options.allowSynchronousEvents
	        : true;
	    this._binaryType = options.binaryType || BINARY_TYPES[0];
	    this._extensions = options.extensions || {};
	    this._isServer = !!options.isServer;
	    this._maxPayload = options.maxPayload | 0;
	    this._skipUTF8Validation = !!options.skipUTF8Validation;
	    this[kWebSocket] = undefined;

	    this._bufferedBytes = 0;
	    this._buffers = [];

	    this._compressed = false;
	    this._payloadLength = 0;
	    this._mask = undefined;
	    this._fragmented = 0;
	    this._masked = false;
	    this._fin = false;
	    this._opcode = 0;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragments = [];

	    this._errored = false;
	    this._loop = false;
	    this._state = GET_INFO;
	  }

	  /**
	   * Implements `Writable.prototype._write()`.
	   *
	   * @param {Buffer} chunk The chunk of data to write
	   * @param {String} encoding The character encoding of `chunk`
	   * @param {Function} cb Callback
	   * @private
	   */
	  _write(chunk, encoding, cb) {
	    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

	    this._bufferedBytes += chunk.length;
	    this._buffers.push(chunk);
	    this.startLoop(cb);
	  }

	  /**
	   * Consumes `n` bytes from the buffered data.
	   *
	   * @param {Number} n The number of bytes to consume
	   * @return {Buffer} The consumed bytes
	   * @private
	   */
	  consume(n) {
	    this._bufferedBytes -= n;

	    if (n === this._buffers[0].length) return this._buffers.shift();

	    if (n < this._buffers[0].length) {
	      const buf = this._buffers[0];
	      this._buffers[0] = new FastBuffer(
	        buf.buffer,
	        buf.byteOffset + n,
	        buf.length - n
	      );

	      return new FastBuffer(buf.buffer, buf.byteOffset, n);
	    }

	    const dst = Buffer.allocUnsafe(n);

	    do {
	      const buf = this._buffers[0];
	      const offset = dst.length - n;

	      if (n >= buf.length) {
	        dst.set(this._buffers.shift(), offset);
	      } else {
	        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
	        this._buffers[0] = new FastBuffer(
	          buf.buffer,
	          buf.byteOffset + n,
	          buf.length - n
	        );
	      }

	      n -= buf.length;
	    } while (n > 0);

	    return dst;
	  }

	  /**
	   * Starts the parsing loop.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  startLoop(cb) {
	    this._loop = true;

	    do {
	      switch (this._state) {
	        case GET_INFO:
	          this.getInfo(cb);
	          break;
	        case GET_PAYLOAD_LENGTH_16:
	          this.getPayloadLength16(cb);
	          break;
	        case GET_PAYLOAD_LENGTH_64:
	          this.getPayloadLength64(cb);
	          break;
	        case GET_MASK:
	          this.getMask();
	          break;
	        case GET_DATA:
	          this.getData(cb);
	          break;
	        case INFLATING:
	        case DEFER_EVENT:
	          this._loop = false;
	          return;
	      }
	    } while (this._loop);

	    if (!this._errored) cb();
	  }

	  /**
	   * Reads the first two bytes of a frame.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getInfo(cb) {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(2);

	    if ((buf[0] & 0x30) !== 0x00) {
	      const error = this.createError(
	        RangeError,
	        'RSV2 and RSV3 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_2_3'
	      );

	      cb(error);
	      return;
	    }

	    const compressed = (buf[0] & 0x40) === 0x40;

	    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
	      const error = this.createError(
	        RangeError,
	        'RSV1 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_1'
	      );

	      cb(error);
	      return;
	    }

	    this._fin = (buf[0] & 0x80) === 0x80;
	    this._opcode = buf[0] & 0x0f;
	    this._payloadLength = buf[1] & 0x7f;

	    if (this._opcode === 0x00) {
	      if (compressed) {
	        const error = this.createError(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );

	        cb(error);
	        return;
	      }

	      if (!this._fragmented) {
	        const error = this.createError(
	          RangeError,
	          'invalid opcode 0',
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );

	        cb(error);
	        return;
	      }

	      this._opcode = this._fragmented;
	    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
	      if (this._fragmented) {
	        const error = this.createError(
	          RangeError,
	          `invalid opcode ${this._opcode}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );

	        cb(error);
	        return;
	      }

	      this._compressed = compressed;
	    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
	      if (!this._fin) {
	        const error = this.createError(
	          RangeError,
	          'FIN must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_FIN'
	        );

	        cb(error);
	        return;
	      }

	      if (compressed) {
	        const error = this.createError(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );

	        cb(error);
	        return;
	      }

	      if (
	        this._payloadLength > 0x7d ||
	        (this._opcode === 0x08 && this._payloadLength === 1)
	      ) {
	        const error = this.createError(
	          RangeError,
	          `invalid payload length ${this._payloadLength}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );

	        cb(error);
	        return;
	      }
	    } else {
	      const error = this.createError(
	        RangeError,
	        `invalid opcode ${this._opcode}`,
	        true,
	        1002,
	        'WS_ERR_INVALID_OPCODE'
	      );

	      cb(error);
	      return;
	    }

	    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
	    this._masked = (buf[1] & 0x80) === 0x80;

	    if (this._isServer) {
	      if (!this._masked) {
	        const error = this.createError(
	          RangeError,
	          'MASK must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_MASK'
	        );

	        cb(error);
	        return;
	      }
	    } else if (this._masked) {
	      const error = this.createError(
	        RangeError,
	        'MASK must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_MASK'
	      );

	      cb(error);
	      return;
	    }

	    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
	    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
	    else this.haveLength(cb);
	  }

	  /**
	   * Gets extended payload length (7+16).
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getPayloadLength16(cb) {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    this._payloadLength = this.consume(2).readUInt16BE(0);
	    this.haveLength(cb);
	  }

	  /**
	   * Gets extended payload length (7+64).
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getPayloadLength64(cb) {
	    if (this._bufferedBytes < 8) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(8);
	    const num = buf.readUInt32BE(0);

	    //
	    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
	    // if payload length is greater than this number.
	    //
	    if (num > Math.pow(2, 53 - 32) - 1) {
	      const error = this.createError(
	        RangeError,
	        'Unsupported WebSocket frame: payload length > 2^53 - 1',
	        false,
	        1009,
	        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
	      );

	      cb(error);
	      return;
	    }

	    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
	    this.haveLength(cb);
	  }

	  /**
	   * Payload length has been read.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  haveLength(cb) {
	    if (this._payloadLength && this._opcode < 0x08) {
	      this._totalPayloadLength += this._payloadLength;
	      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
	        const error = this.createError(
	          RangeError,
	          'Max payload size exceeded',
	          false,
	          1009,
	          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	        );

	        cb(error);
	        return;
	      }
	    }

	    if (this._masked) this._state = GET_MASK;
	    else this._state = GET_DATA;
	  }

	  /**
	   * Reads mask bytes.
	   *
	   * @private
	   */
	  getMask() {
	    if (this._bufferedBytes < 4) {
	      this._loop = false;
	      return;
	    }

	    this._mask = this.consume(4);
	    this._state = GET_DATA;
	  }

	  /**
	   * Reads data bytes.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getData(cb) {
	    let data = EMPTY_BUFFER;

	    if (this._payloadLength) {
	      if (this._bufferedBytes < this._payloadLength) {
	        this._loop = false;
	        return;
	      }

	      data = this.consume(this._payloadLength);

	      if (
	        this._masked &&
	        (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0
	      ) {
	        unmask(data, this._mask);
	      }
	    }

	    if (this._opcode > 0x07) {
	      this.controlMessage(data, cb);
	      return;
	    }

	    if (this._compressed) {
	      this._state = INFLATING;
	      this.decompress(data, cb);
	      return;
	    }

	    if (data.length) {
	      //
	      // This message is not compressed so its length is the sum of the payload
	      // length of all fragments.
	      //
	      this._messageLength = this._totalPayloadLength;
	      this._fragments.push(data);
	    }

	    this.dataMessage(cb);
	  }

	  /**
	   * Decompresses data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Function} cb Callback
	   * @private
	   */
	  decompress(data, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
	      if (err) return cb(err);

	      if (buf.length) {
	        this._messageLength += buf.length;
	        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
	          const error = this.createError(
	            RangeError,
	            'Max payload size exceeded',
	            false,
	            1009,
	            'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	          );

	          cb(error);
	          return;
	        }

	        this._fragments.push(buf);
	      }

	      this.dataMessage(cb);
	      if (this._state === GET_INFO) this.startLoop(cb);
	    });
	  }

	  /**
	   * Handles a data message.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  dataMessage(cb) {
	    if (!this._fin) {
	      this._state = GET_INFO;
	      return;
	    }

	    const messageLength = this._messageLength;
	    const fragments = this._fragments;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragmented = 0;
	    this._fragments = [];

	    if (this._opcode === 2) {
	      let data;

	      if (this._binaryType === 'nodebuffer') {
	        data = concat(fragments, messageLength);
	      } else if (this._binaryType === 'arraybuffer') {
	        data = toArrayBuffer(concat(fragments, messageLength));
	      } else if (this._binaryType === 'blob') {
	        data = new Blob(fragments);
	      } else {
	        data = fragments;
	      }

	      if (this._allowSynchronousEvents) {
	        this.emit('message', data, true);
	        this._state = GET_INFO;
	      } else {
	        this._state = DEFER_EVENT;
	        setImmediate(() => {
	          this.emit('message', data, true);
	          this._state = GET_INFO;
	          this.startLoop(cb);
	        });
	      }
	    } else {
	      const buf = concat(fragments, messageLength);

	      if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	        const error = this.createError(
	          Error,
	          'invalid UTF-8 sequence',
	          true,
	          1007,
	          'WS_ERR_INVALID_UTF8'
	        );

	        cb(error);
	        return;
	      }

	      if (this._state === INFLATING || this._allowSynchronousEvents) {
	        this.emit('message', buf, false);
	        this._state = GET_INFO;
	      } else {
	        this._state = DEFER_EVENT;
	        setImmediate(() => {
	          this.emit('message', buf, false);
	          this._state = GET_INFO;
	          this.startLoop(cb);
	        });
	      }
	    }
	  }

	  /**
	   * Handles a control message.
	   *
	   * @param {Buffer} data Data to handle
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  controlMessage(data, cb) {
	    if (this._opcode === 0x08) {
	      if (data.length === 0) {
	        this._loop = false;
	        this.emit('conclude', 1005, EMPTY_BUFFER);
	        this.end();
	      } else {
	        const code = data.readUInt16BE(0);

	        if (!isValidStatusCode(code)) {
	          const error = this.createError(
	            RangeError,
	            `invalid status code ${code}`,
	            true,
	            1002,
	            'WS_ERR_INVALID_CLOSE_CODE'
	          );

	          cb(error);
	          return;
	        }

	        const buf = new FastBuffer(
	          data.buffer,
	          data.byteOffset + 2,
	          data.length - 2
	        );

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          const error = this.createError(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );

	          cb(error);
	          return;
	        }

	        this._loop = false;
	        this.emit('conclude', code, buf);
	        this.end();
	      }

	      this._state = GET_INFO;
	      return;
	    }

	    if (this._allowSynchronousEvents) {
	      this.emit(this._opcode === 0x09 ? 'ping' : 'pong', data);
	      this._state = GET_INFO;
	    } else {
	      this._state = DEFER_EVENT;
	      setImmediate(() => {
	        this.emit(this._opcode === 0x09 ? 'ping' : 'pong', data);
	        this._state = GET_INFO;
	        this.startLoop(cb);
	      });
	    }
	  }

	  /**
	   * Builds an error object.
	   *
	   * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	   * @param {String} message The error message
	   * @param {Boolean} prefix Specifies whether or not to add a default prefix to
	   *     `message`
	   * @param {Number} statusCode The status code
	   * @param {String} errorCode The exposed error code
	   * @return {(Error|RangeError)} The error
	   * @private
	   */
	  createError(ErrorCtor, message, prefix, statusCode, errorCode) {
	    this._loop = false;
	    this._errored = true;

	    const err = new ErrorCtor(
	      prefix ? `Invalid WebSocket frame: ${message}` : message
	    );

	    Error.captureStackTrace(err, this.createError);
	    err.code = errorCode;
	    err[kStatusCode] = statusCode;
	    return err;
	  }
	}

	receiver = Receiver;
	return receiver;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex" }] */

var sender;
var hasRequiredSender;

function requireSender () {
	if (hasRequiredSender) return sender;
	hasRequiredSender = 1;

	const { Duplex } = require$$0$2__default;
	const { randomFillSync } = require$$1__default;

	const PerMessageDeflate = requirePermessageDeflate();
	const { EMPTY_BUFFER, kWebSocket, NOOP } = requireConstants();
	const { isBlob, isValidStatusCode } = requireValidation();
	const { mask: applyMask, toBuffer } = requireBufferUtil();

	const kByteLength = Symbol('kByteLength');
	const maskBuffer = Buffer.alloc(4);
	const RANDOM_POOL_SIZE = 8 * 1024;
	let randomPool;
	let randomPoolPointer = RANDOM_POOL_SIZE;

	const DEFAULT = 0;
	const DEFLATING = 1;
	const GET_BLOB_DATA = 2;

	/**
	 * HyBi Sender implementation.
	 */
	class Sender {
	  /**
	   * Creates a Sender instance.
	   *
	   * @param {Duplex} socket The connection socket
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   * @param {Function} [generateMask] The function used to generate the masking
	   *     key
	   */
	  constructor(socket, extensions, generateMask) {
	    this._extensions = extensions || {};

	    if (generateMask) {
	      this._generateMask = generateMask;
	      this._maskBuffer = Buffer.alloc(4);
	    }

	    this._socket = socket;

	    this._firstFragment = true;
	    this._compress = false;

	    this._bufferedBytes = 0;
	    this._queue = [];
	    this._state = DEFAULT;
	    this.onerror = NOOP;
	    this[kWebSocket] = undefined;
	  }

	  /**
	   * Frames a piece of data according to the HyBi WebSocket protocol.
	   *
	   * @param {(Buffer|String)} data The data to frame
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @return {(Buffer|String)[]} The framed data
	   * @public
	   */
	  static frame(data, options) {
	    let mask;
	    let merge = false;
	    let offset = 2;
	    let skipMasking = false;

	    if (options.mask) {
	      mask = options.maskBuffer || maskBuffer;

	      if (options.generateMask) {
	        options.generateMask(mask);
	      } else {
	        if (randomPoolPointer === RANDOM_POOL_SIZE) {
	          /* istanbul ignore else  */
	          if (randomPool === undefined) {
	            //
	            // This is lazily initialized because server-sent frames must not
	            // be masked so it may never be used.
	            //
	            randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
	          }

	          randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
	          randomPoolPointer = 0;
	        }

	        mask[0] = randomPool[randomPoolPointer++];
	        mask[1] = randomPool[randomPoolPointer++];
	        mask[2] = randomPool[randomPoolPointer++];
	        mask[3] = randomPool[randomPoolPointer++];
	      }

	      skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
	      offset = 6;
	    }

	    let dataLength;

	    if (typeof data === 'string') {
	      if (
	        (!options.mask || skipMasking) &&
	        options[kByteLength] !== undefined
	      ) {
	        dataLength = options[kByteLength];
	      } else {
	        data = Buffer.from(data);
	        dataLength = data.length;
	      }
	    } else {
	      dataLength = data.length;
	      merge = options.mask && options.readOnly && !skipMasking;
	    }

	    let payloadLength = dataLength;

	    if (dataLength >= 65536) {
	      offset += 8;
	      payloadLength = 127;
	    } else if (dataLength > 125) {
	      offset += 2;
	      payloadLength = 126;
	    }

	    const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);

	    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
	    if (options.rsv1) target[0] |= 0x40;

	    target[1] = payloadLength;

	    if (payloadLength === 126) {
	      target.writeUInt16BE(dataLength, 2);
	    } else if (payloadLength === 127) {
	      target[2] = target[3] = 0;
	      target.writeUIntBE(dataLength, 4, 6);
	    }

	    if (!options.mask) return [target, data];

	    target[1] |= 0x80;
	    target[offset - 4] = mask[0];
	    target[offset - 3] = mask[1];
	    target[offset - 2] = mask[2];
	    target[offset - 1] = mask[3];

	    if (skipMasking) return [target, data];

	    if (merge) {
	      applyMask(data, mask, target, offset, dataLength);
	      return [target];
	    }

	    applyMask(data, mask, data, 0, dataLength);
	    return [target, data];
	  }

	  /**
	   * Sends a close message to the other peer.
	   *
	   * @param {Number} [code] The status code component of the body
	   * @param {(String|Buffer)} [data] The message component of the body
	   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(code, data, mask, cb) {
	    let buf;

	    if (code === undefined) {
	      buf = EMPTY_BUFFER;
	    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
	      throw new TypeError('First argument must be a valid error code number');
	    } else if (data === undefined || !data.length) {
	      buf = Buffer.allocUnsafe(2);
	      buf.writeUInt16BE(code, 0);
	    } else {
	      const length = Buffer.byteLength(data);

	      if (length > 123) {
	        throw new RangeError('The message must not be greater than 123 bytes');
	      }

	      buf = Buffer.allocUnsafe(2 + length);
	      buf.writeUInt16BE(code, 0);

	      if (typeof data === 'string') {
	        buf.write(data, 2);
	      } else {
	        buf.set(data, 2);
	      }
	    }

	    const options = {
	      [kByteLength]: buf.length,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x08,
	      readOnly: false,
	      rsv1: false
	    };

	    if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, buf, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(buf, options), cb);
	    }
	  }

	  /**
	   * Sends a ping message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  ping(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else if (isBlob(data)) {
	      byteLength = data.size;
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x09,
	      readOnly,
	      rsv1: false
	    };

	    if (isBlob(data)) {
	      if (this._state !== DEFAULT) {
	        this.enqueue([this.getBlobData, data, false, options, cb]);
	      } else {
	        this.getBlobData(data, false, options, cb);
	      }
	    } else if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a pong message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  pong(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else if (isBlob(data)) {
	      byteLength = data.size;
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x0a,
	      readOnly,
	      rsv1: false
	    };

	    if (isBlob(data)) {
	      if (this._state !== DEFAULT) {
	        this.enqueue([this.getBlobData, data, false, options, cb]);
	      } else {
	        this.getBlobData(data, false, options, cb);
	      }
	    } else if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a data message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Object} options Options object
	   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
	   *     or text
	   * @param {Boolean} [options.compress=false] Specifies whether or not to
	   *     compress `data`
	   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  send(data, options, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
	    let opcode = options.binary ? 2 : 1;
	    let rsv1 = options.compress;

	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else if (isBlob(data)) {
	      byteLength = data.size;
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (this._firstFragment) {
	      this._firstFragment = false;
	      if (
	        rsv1 &&
	        perMessageDeflate &&
	        perMessageDeflate.params[
	          perMessageDeflate._isServer
	            ? 'server_no_context_takeover'
	            : 'client_no_context_takeover'
	        ]
	      ) {
	        rsv1 = byteLength >= perMessageDeflate._threshold;
	      }
	      this._compress = rsv1;
	    } else {
	      rsv1 = false;
	      opcode = 0;
	    }

	    if (options.fin) this._firstFragment = true;

	    const opts = {
	      [kByteLength]: byteLength,
	      fin: options.fin,
	      generateMask: this._generateMask,
	      mask: options.mask,
	      maskBuffer: this._maskBuffer,
	      opcode,
	      readOnly,
	      rsv1
	    };

	    if (isBlob(data)) {
	      if (this._state !== DEFAULT) {
	        this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
	      } else {
	        this.getBlobData(data, this._compress, opts, cb);
	      }
	    } else if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, data, this._compress, opts, cb]);
	    } else {
	      this.dispatch(data, this._compress, opts, cb);
	    }
	  }

	  /**
	   * Gets the contents of a blob as binary data.
	   *
	   * @param {Blob} blob The blob
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     the data
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  getBlobData(blob, compress, options, cb) {
	    this._bufferedBytes += options[kByteLength];
	    this._state = GET_BLOB_DATA;

	    blob
	      .arrayBuffer()
	      .then((arrayBuffer) => {
	        if (this._socket.destroyed) {
	          const err = new Error(
	            'The socket was closed while the blob was being read'
	          );

	          //
	          // `callCallbacks` is called in the next tick to ensure that errors
	          // that might be thrown in the callbacks behave like errors thrown
	          // outside the promise chain.
	          //
	          process.nextTick(callCallbacks, this, err, cb);
	          return;
	        }

	        this._bufferedBytes -= options[kByteLength];
	        const data = toBuffer(arrayBuffer);

	        if (!compress) {
	          this._state = DEFAULT;
	          this.sendFrame(Sender.frame(data, options), cb);
	          this.dequeue();
	        } else {
	          this.dispatch(data, compress, options, cb);
	        }
	      })
	      .catch((err) => {
	        //
	        // `onError` is called in the next tick for the same reason that
	        // `callCallbacks` above is.
	        //
	        process.nextTick(onError, this, err, cb);
	      });
	  }

	  /**
	   * Dispatches a message.
	   *
	   * @param {(Buffer|String)} data The message to send
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     `data`
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  dispatch(data, compress, options, cb) {
	    if (!compress) {
	      this.sendFrame(Sender.frame(data, options), cb);
	      return;
	    }

	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    this._bufferedBytes += options[kByteLength];
	    this._state = DEFLATING;
	    perMessageDeflate.compress(data, options.fin, (_, buf) => {
	      if (this._socket.destroyed) {
	        const err = new Error(
	          'The socket was closed while data was being compressed'
	        );

	        callCallbacks(this, err, cb);
	        return;
	      }

	      this._bufferedBytes -= options[kByteLength];
	      this._state = DEFAULT;
	      options.readOnly = false;
	      this.sendFrame(Sender.frame(buf, options), cb);
	      this.dequeue();
	    });
	  }

	  /**
	   * Executes queued send operations.
	   *
	   * @private
	   */
	  dequeue() {
	    while (this._state === DEFAULT && this._queue.length) {
	      const params = this._queue.shift();

	      this._bufferedBytes -= params[3][kByteLength];
	      Reflect.apply(params[0], this, params.slice(1));
	    }
	  }

	  /**
	   * Enqueues a send operation.
	   *
	   * @param {Array} params Send operation parameters.
	   * @private
	   */
	  enqueue(params) {
	    this._bufferedBytes += params[3][kByteLength];
	    this._queue.push(params);
	  }

	  /**
	   * Sends a frame.
	   *
	   * @param {(Buffer | String)[]} list The frame to send
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  sendFrame(list, cb) {
	    if (list.length === 2) {
	      this._socket.cork();
	      this._socket.write(list[0]);
	      this._socket.write(list[1], cb);
	      this._socket.uncork();
	    } else {
	      this._socket.write(list[0], cb);
	    }
	  }
	}

	sender = Sender;

	/**
	 * Calls queued callbacks with an error.
	 *
	 * @param {Sender} sender The `Sender` instance
	 * @param {Error} err The error to call the callbacks with
	 * @param {Function} [cb] The first callback
	 * @private
	 */
	function callCallbacks(sender, err, cb) {
	  if (typeof cb === 'function') cb(err);

	  for (let i = 0; i < sender._queue.length; i++) {
	    const params = sender._queue[i];
	    const callback = params[params.length - 1];

	    if (typeof callback === 'function') callback(err);
	  }
	}

	/**
	 * Handles a `Sender` error.
	 *
	 * @param {Sender} sender The `Sender` instance
	 * @param {Error} err The error
	 * @param {Function} [cb] The first pending callback
	 * @private
	 */
	function onError(sender, err, cb) {
	  callCallbacks(sender, err, cb);
	  sender.onerror(err);
	}
	return sender;
}

var eventTarget;
var hasRequiredEventTarget;

function requireEventTarget () {
	if (hasRequiredEventTarget) return eventTarget;
	hasRequiredEventTarget = 1;

	const { kForOnEventAttribute, kListener } = requireConstants();

	const kCode = Symbol('kCode');
	const kData = Symbol('kData');
	const kError = Symbol('kError');
	const kMessage = Symbol('kMessage');
	const kReason = Symbol('kReason');
	const kTarget = Symbol('kTarget');
	const kType = Symbol('kType');
	const kWasClean = Symbol('kWasClean');

	/**
	 * Class representing an event.
	 */
	class Event {
	  /**
	   * Create a new `Event`.
	   *
	   * @param {String} type The name of the event
	   * @throws {TypeError} If the `type` argument is not specified
	   */
	  constructor(type) {
	    this[kTarget] = null;
	    this[kType] = type;
	  }

	  /**
	   * @type {*}
	   */
	  get target() {
	    return this[kTarget];
	  }

	  /**
	   * @type {String}
	   */
	  get type() {
	    return this[kType];
	  }
	}

	Object.defineProperty(Event.prototype, 'target', { enumerable: true });
	Object.defineProperty(Event.prototype, 'type', { enumerable: true });

	/**
	 * Class representing a close event.
	 *
	 * @extends Event
	 */
	class CloseEvent extends Event {
	  /**
	   * Create a new `CloseEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {Number} [options.code=0] The status code explaining why the
	   *     connection was closed
	   * @param {String} [options.reason=''] A human-readable string explaining why
	   *     the connection was closed
	   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
	   *     connection was cleanly closed
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kCode] = options.code === undefined ? 0 : options.code;
	    this[kReason] = options.reason === undefined ? '' : options.reason;
	    this[kWasClean] = options.wasClean === undefined ? false : options.wasClean;
	  }

	  /**
	   * @type {Number}
	   */
	  get code() {
	    return this[kCode];
	  }

	  /**
	   * @type {String}
	   */
	  get reason() {
	    return this[kReason];
	  }

	  /**
	   * @type {Boolean}
	   */
	  get wasClean() {
	    return this[kWasClean];
	  }
	}

	Object.defineProperty(CloseEvent.prototype, 'code', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'reason', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'wasClean', { enumerable: true });

	/**
	 * Class representing an error event.
	 *
	 * @extends Event
	 */
	class ErrorEvent extends Event {
	  /**
	   * Create a new `ErrorEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.error=null] The error that generated this event
	   * @param {String} [options.message=''] The error message
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kError] = options.error === undefined ? null : options.error;
	    this[kMessage] = options.message === undefined ? '' : options.message;
	  }

	  /**
	   * @type {*}
	   */
	  get error() {
	    return this[kError];
	  }

	  /**
	   * @type {String}
	   */
	  get message() {
	    return this[kMessage];
	  }
	}

	Object.defineProperty(ErrorEvent.prototype, 'error', { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, 'message', { enumerable: true });

	/**
	 * Class representing a message event.
	 *
	 * @extends Event
	 */
	class MessageEvent extends Event {
	  /**
	   * Create a new `MessageEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.data=null] The message content
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kData] = options.data === undefined ? null : options.data;
	  }

	  /**
	   * @type {*}
	   */
	  get data() {
	    return this[kData];
	  }
	}

	Object.defineProperty(MessageEvent.prototype, 'data', { enumerable: true });

	/**
	 * This provides methods for emulating the `EventTarget` interface. It's not
	 * meant to be used directly.
	 *
	 * @mixin
	 */
	const EventTarget = {
	  /**
	   * Register an event listener.
	   *
	   * @param {String} type A string representing the event type to listen for
	   * @param {(Function|Object)} handler The listener to add
	   * @param {Object} [options] An options object specifies characteristics about
	   *     the event listener
	   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
	   *     listener should be invoked at most once after being added. If `true`,
	   *     the listener would be automatically removed when invoked.
	   * @public
	   */
	  addEventListener(type, handler, options = {}) {
	    for (const listener of this.listeners(type)) {
	      if (
	        !options[kForOnEventAttribute] &&
	        listener[kListener] === handler &&
	        !listener[kForOnEventAttribute]
	      ) {
	        return;
	      }
	    }

	    let wrapper;

	    if (type === 'message') {
	      wrapper = function onMessage(data, isBinary) {
	        const event = new MessageEvent('message', {
	          data: isBinary ? data : data.toString()
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'close') {
	      wrapper = function onClose(code, message) {
	        const event = new CloseEvent('close', {
	          code,
	          reason: message.toString(),
	          wasClean: this._closeFrameReceived && this._closeFrameSent
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'error') {
	      wrapper = function onError(error) {
	        const event = new ErrorEvent('error', {
	          error,
	          message: error.message
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'open') {
	      wrapper = function onOpen() {
	        const event = new Event('open');

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else {
	      return;
	    }

	    wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
	    wrapper[kListener] = handler;

	    if (options.once) {
	      this.once(type, wrapper);
	    } else {
	      this.on(type, wrapper);
	    }
	  },

	  /**
	   * Remove an event listener.
	   *
	   * @param {String} type A string representing the event type to remove
	   * @param {(Function|Object)} handler The listener to remove
	   * @public
	   */
	  removeEventListener(type, handler) {
	    for (const listener of this.listeners(type)) {
	      if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
	        this.removeListener(type, listener);
	        break;
	      }
	    }
	  }
	};

	eventTarget = {
	  CloseEvent,
	  ErrorEvent,
	  Event,
	  EventTarget,
	  MessageEvent
	};

	/**
	 * Call an event listener
	 *
	 * @param {(Function|Object)} listener The listener to call
	 * @param {*} thisArg The value to use as `this`` when calling the listener
	 * @param {Event} event The event to pass to the listener
	 * @private
	 */
	function callListener(listener, thisArg, event) {
	  if (typeof listener === 'object' && listener.handleEvent) {
	    listener.handleEvent.call(listener, event);
	  } else {
	    listener.call(thisArg, event);
	  }
	}
	return eventTarget;
}

var extension;
var hasRequiredExtension;

function requireExtension () {
	if (hasRequiredExtension) return extension;
	hasRequiredExtension = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Adds an offer to the map of extension offers or a parameter to the map of
	 * parameters.
	 *
	 * @param {Object} dest The map of extension offers or parameters
	 * @param {String} name The extension or parameter name
	 * @param {(Object|Boolean|String)} elem The extension parameters or the
	 *     parameter value
	 * @private
	 */
	function push(dest, name, elem) {
	  if (dest[name] === undefined) dest[name] = [elem];
	  else dest[name].push(elem);
	}

	/**
	 * Parses the `Sec-WebSocket-Extensions` header into an object.
	 *
	 * @param {String} header The field value of the header
	 * @return {Object} The parsed object
	 * @public
	 */
	function parse(header) {
	  const offers = Object.create(null);
	  let params = Object.create(null);
	  let mustUnescape = false;
	  let isEscaping = false;
	  let inQuotes = false;
	  let extensionName;
	  let paramName;
	  let start = -1;
	  let code = -1;
	  let end = -1;
	  let i = 0;

	  for (; i < header.length; i++) {
	    code = header.charCodeAt(i);

	    if (extensionName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (
	        i !== 0 &&
	        (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	      ) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        const name = header.slice(start, end);
	        if (code === 0x2c) {
	          push(offers, name, params);
	          params = Object.create(null);
	        } else {
	          extensionName = name;
	        }

	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else if (paramName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 || code === 0x09) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        push(params, header.slice(start, end), true);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        start = end = -1;
	      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
	        paramName = header.slice(start, i);
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else {
	      //
	      // The value of a quoted-string after unescaping must conform to the
	      // token ABNF, so only token characters are valid.
	      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
	      //
	      if (isEscaping) {
	        if (tokenChars[code] !== 1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	        if (start === -1) start = i;
	        else if (!mustUnescape) mustUnescape = true;
	        isEscaping = false;
	      } else if (inQuotes) {
	        if (tokenChars[code] === 1) {
	          if (start === -1) start = i;
	        } else if (code === 0x22 /* '"' */ && start !== -1) {
	          inQuotes = false;
	          end = i;
	        } else if (code === 0x5c /* '\' */) {
	          isEscaping = true;
	        } else {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
	        inQuotes = true;
	      } else if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
	        if (end === -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        let value = header.slice(start, end);
	        if (mustUnescape) {
	          value = value.replace(/\\/g, '');
	          mustUnescape = false;
	        }
	        push(params, paramName, value);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        paramName = undefined;
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    }
	  }

	  if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  if (end === -1) end = i;
	  const token = header.slice(start, end);
	  if (extensionName === undefined) {
	    push(offers, token, params);
	  } else {
	    if (paramName === undefined) {
	      push(params, token, true);
	    } else if (mustUnescape) {
	      push(params, paramName, token.replace(/\\/g, ''));
	    } else {
	      push(params, paramName, token);
	    }
	    push(offers, extensionName, params);
	  }

	  return offers;
	}

	/**
	 * Builds the `Sec-WebSocket-Extensions` header field value.
	 *
	 * @param {Object} extensions The map of extensions and parameters to format
	 * @return {String} A string representing the given object
	 * @public
	 */
	function format(extensions) {
	  return Object.keys(extensions)
	    .map((extension) => {
	      let configurations = extensions[extension];
	      if (!Array.isArray(configurations)) configurations = [configurations];
	      return configurations
	        .map((params) => {
	          return [extension]
	            .concat(
	              Object.keys(params).map((k) => {
	                let values = params[k];
	                if (!Array.isArray(values)) values = [values];
	                return values
	                  .map((v) => (v === true ? k : `${k}=${v}`))
	                  .join('; ');
	              })
	            )
	            .join('; ');
	        })
	        .join(', ');
	    })
	    .join(', ');
	}

	extension = { format, parse };
	return extension;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex|Readable$", "caughtErrors": "none" }] */

var websocket$2;
var hasRequiredWebsocket;

function requireWebsocket () {
	if (hasRequiredWebsocket) return websocket$2;
	hasRequiredWebsocket = 1;

	const EventEmitter = require$$0$3__default;
	const https = require$$1$1$1;
	const http = require$$2__default;
	const net = require$$3$1;
	const tls = require$$4$1;
	const { randomBytes, createHash } = require$$1__default;
	const { Duplex, Readable } = require$$0$2__default;
	const { URL } = require$$7__default;

	const PerMessageDeflate = requirePermessageDeflate();
	const Receiver = requireReceiver();
	const Sender = requireSender();
	const { isBlob } = requireValidation();

	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  GUID,
	  kForOnEventAttribute,
	  kListener,
	  kStatusCode,
	  kWebSocket,
	  NOOP
	} = requireConstants();
	const {
	  EventTarget: { addEventListener, removeEventListener }
	} = requireEventTarget();
	const { format, parse } = requireExtension();
	const { toBuffer } = requireBufferUtil();

	const closeTimeout = 30 * 1000;
	const kAborted = Symbol('kAborted');
	const protocolVersions = [8, 13];
	const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;

	/**
	 * Class representing a WebSocket.
	 *
	 * @extends EventEmitter
	 */
	class WebSocket extends EventEmitter {
	  /**
	   * Create a new `WebSocket`.
	   *
	   * @param {(String|URL)} address The URL to which to connect
	   * @param {(String|String[])} [protocols] The subprotocols
	   * @param {Object} [options] Connection options
	   */
	  constructor(address, protocols, options) {
	    super();

	    this._binaryType = BINARY_TYPES[0];
	    this._closeCode = 1006;
	    this._closeFrameReceived = false;
	    this._closeFrameSent = false;
	    this._closeMessage = EMPTY_BUFFER;
	    this._closeTimer = null;
	    this._errorEmitted = false;
	    this._extensions = {};
	    this._paused = false;
	    this._protocol = '';
	    this._readyState = WebSocket.CONNECTING;
	    this._receiver = null;
	    this._sender = null;
	    this._socket = null;

	    if (address !== null) {
	      this._bufferedAmount = 0;
	      this._isServer = false;
	      this._redirects = 0;

	      if (protocols === undefined) {
	        protocols = [];
	      } else if (!Array.isArray(protocols)) {
	        if (typeof protocols === 'object' && protocols !== null) {
	          options = protocols;
	          protocols = [];
	        } else {
	          protocols = [protocols];
	        }
	      }

	      initAsClient(this, address, protocols, options);
	    } else {
	      this._autoPong = options.autoPong;
	      this._isServer = true;
	    }
	  }

	  /**
	   * For historical reasons, the custom "nodebuffer" type is used by the default
	   * instead of "blob".
	   *
	   * @type {String}
	   */
	  get binaryType() {
	    return this._binaryType;
	  }

	  set binaryType(type) {
	    if (!BINARY_TYPES.includes(type)) return;

	    this._binaryType = type;

	    //
	    // Allow to change `binaryType` on the fly.
	    //
	    if (this._receiver) this._receiver._binaryType = type;
	  }

	  /**
	   * @type {Number}
	   */
	  get bufferedAmount() {
	    if (!this._socket) return this._bufferedAmount;

	    return this._socket._writableState.length + this._sender._bufferedBytes;
	  }

	  /**
	   * @type {String}
	   */
	  get extensions() {
	    return Object.keys(this._extensions).join();
	  }

	  /**
	   * @type {Boolean}
	   */
	  get isPaused() {
	    return this._paused;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onclose() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onerror() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onopen() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onmessage() {
	    return null;
	  }

	  /**
	   * @type {String}
	   */
	  get protocol() {
	    return this._protocol;
	  }

	  /**
	   * @type {Number}
	   */
	  get readyState() {
	    return this._readyState;
	  }

	  /**
	   * @type {String}
	   */
	  get url() {
	    return this._url;
	  }

	  /**
	   * Set up the socket and the internal resources.
	   *
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Object} options Options object
	   * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
	   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
	   *     multiple times in the same tick
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Number} [options.maxPayload=0] The maximum allowed message size
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @private
	   */
	  setSocket(socket, head, options) {
	    const receiver = new Receiver({
	      allowSynchronousEvents: options.allowSynchronousEvents,
	      binaryType: this.binaryType,
	      extensions: this._extensions,
	      isServer: this._isServer,
	      maxPayload: options.maxPayload,
	      skipUTF8Validation: options.skipUTF8Validation
	    });

	    const sender = new Sender(socket, this._extensions, options.generateMask);

	    this._receiver = receiver;
	    this._sender = sender;
	    this._socket = socket;

	    receiver[kWebSocket] = this;
	    sender[kWebSocket] = this;
	    socket[kWebSocket] = this;

	    receiver.on('conclude', receiverOnConclude);
	    receiver.on('drain', receiverOnDrain);
	    receiver.on('error', receiverOnError);
	    receiver.on('message', receiverOnMessage);
	    receiver.on('ping', receiverOnPing);
	    receiver.on('pong', receiverOnPong);

	    sender.onerror = senderOnError;

	    //
	    // These methods may not be available if `socket` is just a `Duplex`.
	    //
	    if (socket.setTimeout) socket.setTimeout(0);
	    if (socket.setNoDelay) socket.setNoDelay();

	    if (head.length > 0) socket.unshift(head);

	    socket.on('close', socketOnClose);
	    socket.on('data', socketOnData);
	    socket.on('end', socketOnEnd);
	    socket.on('error', socketOnError);

	    this._readyState = WebSocket.OPEN;
	    this.emit('open');
	  }

	  /**
	   * Emit the `'close'` event.
	   *
	   * @private
	   */
	  emitClose() {
	    if (!this._socket) {
	      this._readyState = WebSocket.CLOSED;
	      this.emit('close', this._closeCode, this._closeMessage);
	      return;
	    }

	    if (this._extensions[PerMessageDeflate.extensionName]) {
	      this._extensions[PerMessageDeflate.extensionName].cleanup();
	    }

	    this._receiver.removeAllListeners();
	    this._readyState = WebSocket.CLOSED;
	    this.emit('close', this._closeCode, this._closeMessage);
	  }

	  /**
	   * Start a closing handshake.
	   *
	   *          +----------+   +-----------+   +----------+
	   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
	   *    |     +----------+   +-----------+   +----------+     |
	   *          +----------+   +-----------+         |
	   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
	   *          +----------+   +-----------+   |
	   *    |           |                        |   +---+        |
	   *                +------------------------+-->|fin| - - - -
	   *    |         +---+                      |   +---+
	   *     - - - - -|fin|<---------------------+
	   *              +---+
	   *
	   * @param {Number} [code] Status code explaining why the connection is closing
	   * @param {(String|Buffer)} [data] The reason why the connection is
	   *     closing
	   * @public
	   */
	  close(code, data) {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this.readyState === WebSocket.CLOSING) {
	      if (
	        this._closeFrameSent &&
	        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
	      ) {
	        this._socket.end();
	      }

	      return;
	    }

	    this._readyState = WebSocket.CLOSING;
	    this._sender.close(code, data, !this._isServer, (err) => {
	      //
	      // This error is handled by the `'error'` listener on the socket. We only
	      // want to know if the close frame has been sent here.
	      //
	      if (err) return;

	      this._closeFrameSent = true;

	      if (
	        this._closeFrameReceived ||
	        this._receiver._writableState.errorEmitted
	      ) {
	        this._socket.end();
	      }
	    });

	    setCloseTimer(this);
	  }

	  /**
	   * Pause the socket.
	   *
	   * @public
	   */
	  pause() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = true;
	    this._socket.pause();
	  }

	  /**
	   * Send a ping.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the ping is sent
	   * @public
	   */
	  ping(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a pong.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the pong is sent
	   * @public
	   */
	  pong(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Resume the socket.
	   *
	   * @public
	   */
	  resume() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = false;
	    if (!this._receiver._writableState.needDrain) this._socket.resume();
	  }

	  /**
	   * Send a data message.
	   *
	   * @param {*} data The message to send
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
	   *     text
	   * @param {Boolean} [options.compress] Specifies whether or not to compress
	   *     `data`
	   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when data is written out
	   * @public
	   */
	  send(data, options, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof options === 'function') {
	      cb = options;
	      options = {};
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    const opts = {
	      binary: typeof data !== 'string',
	      mask: !this._isServer,
	      compress: true,
	      fin: true,
	      ...options
	    };

	    if (!this._extensions[PerMessageDeflate.extensionName]) {
	      opts.compress = false;
	    }

	    this._sender.send(data || EMPTY_BUFFER, opts, cb);
	  }

	  /**
	   * Forcibly close the connection.
	   *
	   * @public
	   */
	  terminate() {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this._socket) {
	      this._readyState = WebSocket.CLOSING;
	      this._socket.destroy();
	    }
	  }
	}

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	[
	  'binaryType',
	  'bufferedAmount',
	  'extensions',
	  'isPaused',
	  'protocol',
	  'readyState',
	  'url'
	].forEach((property) => {
	  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});

	//
	// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
	// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
	//
	['open', 'error', 'close', 'message'].forEach((method) => {
	  Object.defineProperty(WebSocket.prototype, `on${method}`, {
	    enumerable: true,
	    get() {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) return listener[kListener];
	      }

	      return null;
	    },
	    set(handler) {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) {
	          this.removeListener(method, listener);
	          break;
	        }
	      }

	      if (typeof handler !== 'function') return;

	      this.addEventListener(method, handler, {
	        [kForOnEventAttribute]: true
	      });
	    }
	  });
	});

	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;

	websocket$2 = WebSocket;

	/**
	 * Initialize a WebSocket client.
	 *
	 * @param {WebSocket} websocket The client to initialize
	 * @param {(String|URL)} address The URL to which to connect
	 * @param {Array} protocols The subprotocols
	 * @param {Object} [options] Connection options
	 * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
	 *     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
	 *     times in the same tick
	 * @param {Boolean} [options.autoPong=true] Specifies whether or not to
	 *     automatically send a pong in response to a ping
	 * @param {Function} [options.finishRequest] A function which can be used to
	 *     customize the headers of each http request before it is sent
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Function} [options.generateMask] The function used to generate the
	 *     masking key
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	 *     size
	 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
	 *     allowed
	 * @param {String} [options.origin] Value of the `Origin` or
	 *     `Sec-WebSocket-Origin` header
	 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	 *     permessage-deflate
	 * @param {Number} [options.protocolVersion=13] Value of the
	 *     `Sec-WebSocket-Version` header
	 * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	 *     not to skip UTF-8 validation for text and close messages
	 * @private
	 */
	function initAsClient(websocket, address, protocols, options) {
	  const opts = {
	    allowSynchronousEvents: true,
	    autoPong: true,
	    protocolVersion: protocolVersions[1],
	    maxPayload: 100 * 1024 * 1024,
	    skipUTF8Validation: false,
	    perMessageDeflate: true,
	    followRedirects: false,
	    maxRedirects: 10,
	    ...options,
	    socketPath: undefined,
	    hostname: undefined,
	    protocol: undefined,
	    timeout: undefined,
	    method: 'GET',
	    host: undefined,
	    path: undefined,
	    port: undefined
	  };

	  websocket._autoPong = opts.autoPong;

	  if (!protocolVersions.includes(opts.protocolVersion)) {
	    throw new RangeError(
	      `Unsupported protocol version: ${opts.protocolVersion} ` +
	        `(supported versions: ${protocolVersions.join(', ')})`
	    );
	  }

	  let parsedUrl;

	  if (address instanceof URL) {
	    parsedUrl = address;
	  } else {
	    try {
	      parsedUrl = new URL(address);
	    } catch (e) {
	      throw new SyntaxError(`Invalid URL: ${address}`);
	    }
	  }

	  if (parsedUrl.protocol === 'http:') {
	    parsedUrl.protocol = 'ws:';
	  } else if (parsedUrl.protocol === 'https:') {
	    parsedUrl.protocol = 'wss:';
	  }

	  websocket._url = parsedUrl.href;

	  const isSecure = parsedUrl.protocol === 'wss:';
	  const isIpcUrl = parsedUrl.protocol === 'ws+unix:';
	  let invalidUrlMessage;

	  if (parsedUrl.protocol !== 'ws:' && !isSecure && !isIpcUrl) {
	    invalidUrlMessage =
	      'The URL\'s protocol must be one of "ws:", "wss:", ' +
	      '"http:", "https:", or "ws+unix:"';
	  } else if (isIpcUrl && !parsedUrl.pathname) {
	    invalidUrlMessage = "The URL's pathname is empty";
	  } else if (parsedUrl.hash) {
	    invalidUrlMessage = 'The URL contains a fragment identifier';
	  }

	  if (invalidUrlMessage) {
	    const err = new SyntaxError(invalidUrlMessage);

	    if (websocket._redirects === 0) {
	      throw err;
	    } else {
	      emitErrorAndClose(websocket, err);
	      return;
	    }
	  }

	  const defaultPort = isSecure ? 443 : 80;
	  const key = randomBytes(16).toString('base64');
	  const request = isSecure ? https.request : http.request;
	  const protocolSet = new Set();
	  let perMessageDeflate;

	  opts.createConnection =
	    opts.createConnection || (isSecure ? tlsConnect : netConnect);
	  opts.defaultPort = opts.defaultPort || defaultPort;
	  opts.port = parsedUrl.port || defaultPort;
	  opts.host = parsedUrl.hostname.startsWith('[')
	    ? parsedUrl.hostname.slice(1, -1)
	    : parsedUrl.hostname;
	  opts.headers = {
	    ...opts.headers,
	    'Sec-WebSocket-Version': opts.protocolVersion,
	    'Sec-WebSocket-Key': key,
	    Connection: 'Upgrade',
	    Upgrade: 'websocket'
	  };
	  opts.path = parsedUrl.pathname + parsedUrl.search;
	  opts.timeout = opts.handshakeTimeout;

	  if (opts.perMessageDeflate) {
	    perMessageDeflate = new PerMessageDeflate(
	      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
	      false,
	      opts.maxPayload
	    );
	    opts.headers['Sec-WebSocket-Extensions'] = format({
	      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
	    });
	  }
	  if (protocols.length) {
	    for (const protocol of protocols) {
	      if (
	        typeof protocol !== 'string' ||
	        !subprotocolRegex.test(protocol) ||
	        protocolSet.has(protocol)
	      ) {
	        throw new SyntaxError(
	          'An invalid or duplicated subprotocol was specified'
	        );
	      }

	      protocolSet.add(protocol);
	    }

	    opts.headers['Sec-WebSocket-Protocol'] = protocols.join(',');
	  }
	  if (opts.origin) {
	    if (opts.protocolVersion < 13) {
	      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
	    } else {
	      opts.headers.Origin = opts.origin;
	    }
	  }
	  if (parsedUrl.username || parsedUrl.password) {
	    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
	  }

	  if (isIpcUrl) {
	    const parts = opts.path.split(':');

	    opts.socketPath = parts[0];
	    opts.path = parts[1];
	  }

	  let req;

	  if (opts.followRedirects) {
	    if (websocket._redirects === 0) {
	      websocket._originalIpc = isIpcUrl;
	      websocket._originalSecure = isSecure;
	      websocket._originalHostOrSocketPath = isIpcUrl
	        ? opts.socketPath
	        : parsedUrl.host;

	      const headers = options && options.headers;

	      //
	      // Shallow copy the user provided options so that headers can be changed
	      // without mutating the original object.
	      //
	      options = { ...options, headers: {} };

	      if (headers) {
	        for (const [key, value] of Object.entries(headers)) {
	          options.headers[key.toLowerCase()] = value;
	        }
	      }
	    } else if (websocket.listenerCount('redirect') === 0) {
	      const isSameHost = isIpcUrl
	        ? websocket._originalIpc
	          ? opts.socketPath === websocket._originalHostOrSocketPath
	          : false
	        : websocket._originalIpc
	          ? false
	          : parsedUrl.host === websocket._originalHostOrSocketPath;

	      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
	        //
	        // Match curl 7.77.0 behavior and drop the following headers. These
	        // headers are also dropped when following a redirect to a subdomain.
	        //
	        delete opts.headers.authorization;
	        delete opts.headers.cookie;

	        if (!isSameHost) delete opts.headers.host;

	        opts.auth = undefined;
	      }
	    }

	    //
	    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
	    // If the `Authorization` header is set, then there is nothing to do as it
	    // will take precedence.
	    //
	    if (opts.auth && !options.headers.authorization) {
	      options.headers.authorization =
	        'Basic ' + Buffer.from(opts.auth).toString('base64');
	    }

	    req = websocket._req = request(opts);

	    if (websocket._redirects) {
	      //
	      // Unlike what is done for the `'upgrade'` event, no early exit is
	      // triggered here if the user calls `websocket.close()` or
	      // `websocket.terminate()` from a listener of the `'redirect'` event. This
	      // is because the user can also call `request.destroy()` with an error
	      // before calling `websocket.close()` or `websocket.terminate()` and this
	      // would result in an error being emitted on the `request` object with no
	      // `'error'` event listeners attached.
	      //
	      websocket.emit('redirect', websocket.url, req);
	    }
	  } else {
	    req = websocket._req = request(opts);
	  }

	  if (opts.timeout) {
	    req.on('timeout', () => {
	      abortHandshake(websocket, req, 'Opening handshake has timed out');
	    });
	  }

	  req.on('error', (err) => {
	    if (req === null || req[kAborted]) return;

	    req = websocket._req = null;
	    emitErrorAndClose(websocket, err);
	  });

	  req.on('response', (res) => {
	    const location = res.headers.location;
	    const statusCode = res.statusCode;

	    if (
	      location &&
	      opts.followRedirects &&
	      statusCode >= 300 &&
	      statusCode < 400
	    ) {
	      if (++websocket._redirects > opts.maxRedirects) {
	        abortHandshake(websocket, req, 'Maximum redirects exceeded');
	        return;
	      }

	      req.abort();

	      let addr;

	      try {
	        addr = new URL(location, address);
	      } catch (e) {
	        const err = new SyntaxError(`Invalid URL: ${location}`);
	        emitErrorAndClose(websocket, err);
	        return;
	      }

	      initAsClient(websocket, addr, protocols, options);
	    } else if (!websocket.emit('unexpected-response', req, res)) {
	      abortHandshake(
	        websocket,
	        req,
	        `Unexpected server response: ${res.statusCode}`
	      );
	    }
	  });

	  req.on('upgrade', (res, socket, head) => {
	    websocket.emit('upgrade', res);

	    //
	    // The user may have closed the connection from a listener of the
	    // `'upgrade'` event.
	    //
	    if (websocket.readyState !== WebSocket.CONNECTING) return;

	    req = websocket._req = null;

	    const upgrade = res.headers.upgrade;

	    if (upgrade === undefined || upgrade.toLowerCase() !== 'websocket') {
	      abortHandshake(websocket, socket, 'Invalid Upgrade header');
	      return;
	    }

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    if (res.headers['sec-websocket-accept'] !== digest) {
	      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
	      return;
	    }

	    const serverProt = res.headers['sec-websocket-protocol'];
	    let protError;

	    if (serverProt !== undefined) {
	      if (!protocolSet.size) {
	        protError = 'Server sent a subprotocol but none was requested';
	      } else if (!protocolSet.has(serverProt)) {
	        protError = 'Server sent an invalid subprotocol';
	      }
	    } else if (protocolSet.size) {
	      protError = 'Server sent no subprotocol';
	    }

	    if (protError) {
	      abortHandshake(websocket, socket, protError);
	      return;
	    }

	    if (serverProt) websocket._protocol = serverProt;

	    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

	    if (secWebSocketExtensions !== undefined) {
	      if (!perMessageDeflate) {
	        const message =
	          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
	          'was requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      let extensions;

	      try {
	        extensions = parse(secWebSocketExtensions);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      const extensionNames = Object.keys(extensions);

	      if (
	        extensionNames.length !== 1 ||
	        extensionNames[0] !== PerMessageDeflate.extensionName
	      ) {
	        const message = 'Server indicated an extension that was not requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      try {
	        perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      websocket._extensions[PerMessageDeflate.extensionName] =
	        perMessageDeflate;
	    }

	    websocket.setSocket(socket, head, {
	      allowSynchronousEvents: opts.allowSynchronousEvents,
	      generateMask: opts.generateMask,
	      maxPayload: opts.maxPayload,
	      skipUTF8Validation: opts.skipUTF8Validation
	    });
	  });

	  if (opts.finishRequest) {
	    opts.finishRequest(req, websocket);
	  } else {
	    req.end();
	  }
	}

	/**
	 * Emit the `'error'` and `'close'` events.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {Error} The error to emit
	 * @private
	 */
	function emitErrorAndClose(websocket, err) {
	  websocket._readyState = WebSocket.CLOSING;
	  //
	  // The following assignment is practically useless and is done only for
	  // consistency.
	  //
	  websocket._errorEmitted = true;
	  websocket.emit('error', err);
	  websocket.emitClose();
	}

	/**
	 * Create a `net.Socket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {net.Socket} The newly created socket used to start the connection
	 * @private
	 */
	function netConnect(options) {
	  options.path = options.socketPath;
	  return net.connect(options);
	}

	/**
	 * Create a `tls.TLSSocket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {tls.TLSSocket} The newly created socket used to start the connection
	 * @private
	 */
	function tlsConnect(options) {
	  options.path = undefined;

	  if (!options.servername && options.servername !== '') {
	    options.servername = net.isIP(options.host) ? '' : options.host;
	  }

	  return tls.connect(options);
	}

	/**
	 * Abort the handshake and emit an error.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	 *     abort or the socket to destroy
	 * @param {String} message The error message
	 * @private
	 */
	function abortHandshake(websocket, stream, message) {
	  websocket._readyState = WebSocket.CLOSING;

	  const err = new Error(message);
	  Error.captureStackTrace(err, abortHandshake);

	  if (stream.setHeader) {
	    stream[kAborted] = true;
	    stream.abort();

	    if (stream.socket && !stream.socket.destroyed) {
	      //
	      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
	      // called after the request completed. See
	      // https://github.com/websockets/ws/issues/1869.
	      //
	      stream.socket.destroy();
	    }

	    process.nextTick(emitErrorAndClose, websocket, err);
	  } else {
	    stream.destroy(err);
	    stream.once('error', websocket.emit.bind(websocket, 'error'));
	    stream.once('close', websocket.emitClose.bind(websocket));
	  }
	}

	/**
	 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {*} [data] The data to send
	 * @param {Function} [cb] Callback
	 * @private
	 */
	function sendAfterClose(websocket, data, cb) {
	  if (data) {
	    const length = isBlob(data) ? data.size : toBuffer(data).length;

	    //
	    // The `_bufferedAmount` property is used only when the peer is a client and
	    // the opening handshake fails. Under these circumstances, in fact, the
	    // `setSocket()` method is not called, so the `_socket` and `_sender`
	    // properties are set to `null`.
	    //
	    if (websocket._socket) websocket._sender._bufferedBytes += length;
	    else websocket._bufferedAmount += length;
	  }

	  if (cb) {
	    const err = new Error(
	      `WebSocket is not open: readyState ${websocket.readyState} ` +
	        `(${readyStates[websocket.readyState]})`
	    );
	    process.nextTick(cb, err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'conclude'` event.
	 *
	 * @param {Number} code The status code
	 * @param {Buffer} reason The reason for closing
	 * @private
	 */
	function receiverOnConclude(code, reason) {
	  const websocket = this[kWebSocket];

	  websocket._closeFrameReceived = true;
	  websocket._closeMessage = reason;
	  websocket._closeCode = code;

	  if (websocket._socket[kWebSocket] === undefined) return;

	  websocket._socket.removeListener('data', socketOnData);
	  process.nextTick(resume, websocket._socket);

	  if (code === 1005) websocket.close();
	  else websocket.close(code, reason);
	}

	/**
	 * The listener of the `Receiver` `'drain'` event.
	 *
	 * @private
	 */
	function receiverOnDrain() {
	  const websocket = this[kWebSocket];

	  if (!websocket.isPaused) websocket._socket.resume();
	}

	/**
	 * The listener of the `Receiver` `'error'` event.
	 *
	 * @param {(RangeError|Error)} err The emitted error
	 * @private
	 */
	function receiverOnError(err) {
	  const websocket = this[kWebSocket];

	  if (websocket._socket[kWebSocket] !== undefined) {
	    websocket._socket.removeListener('data', socketOnData);

	    //
	    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
	    // https://github.com/websockets/ws/issues/1940.
	    //
	    process.nextTick(resume, websocket._socket);

	    websocket.close(err[kStatusCode]);
	  }

	  if (!websocket._errorEmitted) {
	    websocket._errorEmitted = true;
	    websocket.emit('error', err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'finish'` event.
	 *
	 * @private
	 */
	function receiverOnFinish() {
	  this[kWebSocket].emitClose();
	}

	/**
	 * The listener of the `Receiver` `'message'` event.
	 *
	 * @param {Buffer|ArrayBuffer|Buffer[])} data The message
	 * @param {Boolean} isBinary Specifies whether the message is binary or not
	 * @private
	 */
	function receiverOnMessage(data, isBinary) {
	  this[kWebSocket].emit('message', data, isBinary);
	}

	/**
	 * The listener of the `Receiver` `'ping'` event.
	 *
	 * @param {Buffer} data The data included in the ping frame
	 * @private
	 */
	function receiverOnPing(data) {
	  const websocket = this[kWebSocket];

	  if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
	  websocket.emit('ping', data);
	}

	/**
	 * The listener of the `Receiver` `'pong'` event.
	 *
	 * @param {Buffer} data The data included in the pong frame
	 * @private
	 */
	function receiverOnPong(data) {
	  this[kWebSocket].emit('pong', data);
	}

	/**
	 * Resume a readable stream
	 *
	 * @param {Readable} stream The readable stream
	 * @private
	 */
	function resume(stream) {
	  stream.resume();
	}

	/**
	 * The `Sender` error event handler.
	 *
	 * @param {Error} The error
	 * @private
	 */
	function senderOnError(err) {
	  const websocket = this[kWebSocket];

	  if (websocket.readyState === WebSocket.CLOSED) return;
	  if (websocket.readyState === WebSocket.OPEN) {
	    websocket._readyState = WebSocket.CLOSING;
	    setCloseTimer(websocket);
	  }

	  //
	  // `socket.end()` is used instead of `socket.destroy()` to allow the other
	  // peer to finish sending queued data. There is no need to set a timer here
	  // because `CLOSING` means that it is already set or not needed.
	  //
	  this._socket.end();

	  if (!websocket._errorEmitted) {
	    websocket._errorEmitted = true;
	    websocket.emit('error', err);
	  }
	}

	/**
	 * Set a timer to destroy the underlying raw socket of a WebSocket.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @private
	 */
	function setCloseTimer(websocket) {
	  websocket._closeTimer = setTimeout(
	    websocket._socket.destroy.bind(websocket._socket),
	    closeTimeout
	  );
	}

	/**
	 * The listener of the socket `'close'` event.
	 *
	 * @private
	 */
	function socketOnClose() {
	  const websocket = this[kWebSocket];

	  this.removeListener('close', socketOnClose);
	  this.removeListener('data', socketOnData);
	  this.removeListener('end', socketOnEnd);

	  websocket._readyState = WebSocket.CLOSING;

	  let chunk;

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written and `readable.read()`
	  // will return `null`. If instead, the socket is paused, any possible buffered
	  // data will be read as a single chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    (chunk = websocket._socket.read()) !== null
	  ) {
	    websocket._receiver.write(chunk);
	  }

	  websocket._receiver.end();

	  this[kWebSocket] = undefined;

	  clearTimeout(websocket._closeTimer);

	  if (
	    websocket._receiver._writableState.finished ||
	    websocket._receiver._writableState.errorEmitted
	  ) {
	    websocket.emitClose();
	  } else {
	    websocket._receiver.on('error', receiverOnFinish);
	    websocket._receiver.on('finish', receiverOnFinish);
	  }
	}

	/**
	 * The listener of the socket `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function socketOnData(chunk) {
	  if (!this[kWebSocket]._receiver.write(chunk)) {
	    this.pause();
	  }
	}

	/**
	 * The listener of the socket `'end'` event.
	 *
	 * @private
	 */
	function socketOnEnd() {
	  const websocket = this[kWebSocket];

	  websocket._readyState = WebSocket.CLOSING;
	  websocket._receiver.end();
	  this.end();
	}

	/**
	 * The listener of the socket `'error'` event.
	 *
	 * @private
	 */
	function socketOnError() {
	  const websocket = this[kWebSocket];

	  this.removeListener('error', socketOnError);
	  this.on('error', NOOP);

	  if (websocket) {
	    websocket._readyState = WebSocket.CLOSING;
	    this.destroy();
	  }
	}
	return websocket$2;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^WebSocket$" }] */

var stream;
var hasRequiredStream;

function requireStream () {
	if (hasRequiredStream) return stream;
	hasRequiredStream = 1;

	requireWebsocket();
	const { Duplex } = require$$0$2__default;

	/**
	 * Emits the `'close'` event on a stream.
	 *
	 * @param {Duplex} stream The stream.
	 * @private
	 */
	function emitClose(stream) {
	  stream.emit('close');
	}

	/**
	 * The listener of the `'end'` event.
	 *
	 * @private
	 */
	function duplexOnEnd() {
	  if (!this.destroyed && this._writableState.finished) {
	    this.destroy();
	  }
	}

	/**
	 * The listener of the `'error'` event.
	 *
	 * @param {Error} err The error
	 * @private
	 */
	function duplexOnError(err) {
	  this.removeListener('error', duplexOnError);
	  this.destroy();
	  if (this.listenerCount('error') === 0) {
	    // Do not suppress the throwing behavior.
	    this.emit('error', err);
	  }
	}

	/**
	 * Wraps a `WebSocket` in a duplex stream.
	 *
	 * @param {WebSocket} ws The `WebSocket` to wrap
	 * @param {Object} [options] The options for the `Duplex` constructor
	 * @return {Duplex} The duplex stream
	 * @public
	 */
	function createWebSocketStream(ws, options) {
	  let terminateOnDestroy = true;

	  const duplex = new Duplex({
	    ...options,
	    autoDestroy: false,
	    emitClose: false,
	    objectMode: false,
	    writableObjectMode: false
	  });

	  ws.on('message', function message(msg, isBinary) {
	    const data =
	      !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;

	    if (!duplex.push(data)) ws.pause();
	  });

	  ws.once('error', function error(err) {
	    if (duplex.destroyed) return;

	    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
	    //
	    // - If the `'error'` event is emitted before the `'open'` event, then
	    //   `ws.terminate()` is a noop as no socket is assigned.
	    // - Otherwise, the error is re-emitted by the listener of the `'error'`
	    //   event of the `Receiver` object. The listener already closes the
	    //   connection by calling `ws.close()`. This allows a close frame to be
	    //   sent to the other peer. If `ws.terminate()` is called right after this,
	    //   then the close frame might not be sent.
	    terminateOnDestroy = false;
	    duplex.destroy(err);
	  });

	  ws.once('close', function close() {
	    if (duplex.destroyed) return;

	    duplex.push(null);
	  });

	  duplex._destroy = function (err, callback) {
	    if (ws.readyState === ws.CLOSED) {
	      callback(err);
	      process.nextTick(emitClose, duplex);
	      return;
	    }

	    let called = false;

	    ws.once('error', function error(err) {
	      called = true;
	      callback(err);
	    });

	    ws.once('close', function close() {
	      if (!called) callback(err);
	      process.nextTick(emitClose, duplex);
	    });

	    if (terminateOnDestroy) ws.terminate();
	  };

	  duplex._final = function (callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._final(callback);
	      });
	      return;
	    }

	    // If the value of the `_socket` property is `null` it means that `ws` is a
	    // client websocket and the handshake failed. In fact, when this happens, a
	    // socket is never assigned to the websocket. Wait for the `'error'` event
	    // that will be emitted by the websocket.
	    if (ws._socket === null) return;

	    if (ws._socket._writableState.finished) {
	      callback();
	      if (duplex._readableState.endEmitted) duplex.destroy();
	    } else {
	      ws._socket.once('finish', function finish() {
	        // `duplex` is not destroyed here because the `'end'` event will be
	        // emitted on `duplex` after this `'finish'` event. The EOF signaling
	        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
	        callback();
	      });
	      ws.close();
	    }
	  };

	  duplex._read = function () {
	    if (ws.isPaused) ws.resume();
	  };

	  duplex._write = function (chunk, encoding, callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._write(chunk, encoding, callback);
	      });
	      return;
	    }

	    ws.send(chunk, callback);
	  };

	  duplex.on('end', duplexOnEnd);
	  duplex.on('error', duplexOnError);
	  return duplex;
	}

	stream = createWebSocketStream;
	return stream;
}

requireStream();

requireReceiver();

requireSender();

requireWebsocket();

var subprotocol;
var hasRequiredSubprotocol;

function requireSubprotocol () {
	if (hasRequiredSubprotocol) return subprotocol;
	hasRequiredSubprotocol = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	 *
	 * @param {String} header The field value of the header
	 * @return {Set} The subprotocol names
	 * @public
	 */
	function parse(header) {
	  const protocols = new Set();
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (i; i < header.length; i++) {
	    const code = header.charCodeAt(i);

	    if (end === -1 && tokenChars[code] === 1) {
	      if (start === -1) start = i;
	    } else if (
	      i !== 0 &&
	      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	    ) {
	      if (end === -1 && start !== -1) end = i;
	    } else if (code === 0x2c /* ',' */) {
	      if (start === -1) {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }

	      if (end === -1) end = i;

	      const protocol = header.slice(start, end);

	      if (protocols.has(protocol)) {
	        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	      }

	      protocols.add(protocol);
	      start = end = -1;
	    } else {
	      throw new SyntaxError(`Unexpected character at index ${i}`);
	    }
	  }

	  if (start === -1 || end !== -1) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  const protocol = header.slice(start, i);

	  if (protocols.has(protocol)) {
	    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	  }

	  protocols.add(protocol);
	  return protocols;
	}

	subprotocol = { parse };
	return subprotocol;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex$", "caughtErrors": "none" }] */

var websocketServer;
var hasRequiredWebsocketServer;

function requireWebsocketServer () {
	if (hasRequiredWebsocketServer) return websocketServer;
	hasRequiredWebsocketServer = 1;

	const EventEmitter = require$$0$3__default;
	const http = require$$2__default;
	const { Duplex } = require$$0$2__default;
	const { createHash } = require$$1__default;

	const extension = requireExtension();
	const PerMessageDeflate = requirePermessageDeflate();
	const subprotocol = requireSubprotocol();
	const WebSocket = requireWebsocket();
	const { GUID, kWebSocket } = requireConstants();

	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;

	/**
	 * Class representing a WebSocket server.
	 *
	 * @extends EventEmitter
	 */
	class WebSocketServer extends EventEmitter {
	  /**
	   * Create a `WebSocketServer` instance.
	   *
	   * @param {Object} options Configuration options
	   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
	   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
	   *     multiple times in the same tick
	   * @param {Boolean} [options.autoPong=true] Specifies whether or not to
	   *     automatically send a pong in response to a ping
	   * @param {Number} [options.backlog=511] The maximum length of the queue of
	   *     pending connections
	   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
	   *     track clients
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	   *     size
	   * @param {Boolean} [options.noServer=false] Enable no server mode
	   * @param {String} [options.path] Accept only connections matching this path
	   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
	   *     permessage-deflate
	   * @param {Number} [options.port] The port where to bind the server
	   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
	   *     server to use
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @param {Function} [options.verifyClient] A hook to reject connections
	   * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
	   *     class to use. It must be the `WebSocket` class or class that extends it
	   * @param {Function} [callback] A listener for the `listening` event
	   */
	  constructor(options, callback) {
	    super();

	    options = {
	      allowSynchronousEvents: true,
	      autoPong: true,
	      maxPayload: 100 * 1024 * 1024,
	      skipUTF8Validation: false,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      verifyClient: null,
	      noServer: false,
	      backlog: null, // use default (511 as implemented in net.js)
	      server: null,
	      host: null,
	      path: null,
	      port: null,
	      WebSocket,
	      ...options
	    };

	    if (
	      (options.port == null && !options.server && !options.noServer) ||
	      (options.port != null && (options.server || options.noServer)) ||
	      (options.server && options.noServer)
	    ) {
	      throw new TypeError(
	        'One and only one of the "port", "server", or "noServer" options ' +
	          'must be specified'
	      );
	    }

	    if (options.port != null) {
	      this._server = http.createServer((req, res) => {
	        const body = http.STATUS_CODES[426];

	        res.writeHead(426, {
	          'Content-Length': body.length,
	          'Content-Type': 'text/plain'
	        });
	        res.end(body);
	      });
	      this._server.listen(
	        options.port,
	        options.host,
	        options.backlog,
	        callback
	      );
	    } else if (options.server) {
	      this._server = options.server;
	    }

	    if (this._server) {
	      const emitConnection = this.emit.bind(this, 'connection');

	      this._removeListeners = addListeners(this._server, {
	        listening: this.emit.bind(this, 'listening'),
	        error: this.emit.bind(this, 'error'),
	        upgrade: (req, socket, head) => {
	          this.handleUpgrade(req, socket, head, emitConnection);
	        }
	      });
	    }

	    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
	    if (options.clientTracking) {
	      this.clients = new Set();
	      this._shouldEmitClose = false;
	    }

	    this.options = options;
	    this._state = RUNNING;
	  }

	  /**
	   * Returns the bound address, the address family name, and port of the server
	   * as reported by the operating system if listening on an IP socket.
	   * If the server is listening on a pipe or UNIX domain socket, the name is
	   * returned as a string.
	   *
	   * @return {(Object|String|null)} The address of the server
	   * @public
	   */
	  address() {
	    if (this.options.noServer) {
	      throw new Error('The server is operating in "noServer" mode');
	    }

	    if (!this._server) return null;
	    return this._server.address();
	  }

	  /**
	   * Stop the server from accepting new connections and emit the `'close'` event
	   * when all existing connections are closed.
	   *
	   * @param {Function} [cb] A one-time listener for the `'close'` event
	   * @public
	   */
	  close(cb) {
	    if (this._state === CLOSED) {
	      if (cb) {
	        this.once('close', () => {
	          cb(new Error('The server is not running'));
	        });
	      }

	      process.nextTick(emitClose, this);
	      return;
	    }

	    if (cb) this.once('close', cb);

	    if (this._state === CLOSING) return;
	    this._state = CLOSING;

	    if (this.options.noServer || this.options.server) {
	      if (this._server) {
	        this._removeListeners();
	        this._removeListeners = this._server = null;
	      }

	      if (this.clients) {
	        if (!this.clients.size) {
	          process.nextTick(emitClose, this);
	        } else {
	          this._shouldEmitClose = true;
	        }
	      } else {
	        process.nextTick(emitClose, this);
	      }
	    } else {
	      const server = this._server;

	      this._removeListeners();
	      this._removeListeners = this._server = null;

	      //
	      // The HTTP/S server was created internally. Close it, and rely on its
	      // `'close'` event.
	      //
	      server.close(() => {
	        emitClose(this);
	      });
	    }
	  }

	  /**
	   * See if a given request should be handled by this server instance.
	   *
	   * @param {http.IncomingMessage} req Request object to inspect
	   * @return {Boolean} `true` if the request is valid, else `false`
	   * @public
	   */
	  shouldHandle(req) {
	    if (this.options.path) {
	      const index = req.url.indexOf('?');
	      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

	      if (pathname !== this.options.path) return false;
	    }

	    return true;
	  }

	  /**
	   * Handle a HTTP Upgrade request.
	   *
	   * @param {http.IncomingMessage} req The request object
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @public
	   */
	  handleUpgrade(req, socket, head, cb) {
	    socket.on('error', socketOnError);

	    const key = req.headers['sec-websocket-key'];
	    const upgrade = req.headers.upgrade;
	    const version = +req.headers['sec-websocket-version'];

	    if (req.method !== 'GET') {
	      const message = 'Invalid HTTP method';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
	      return;
	    }

	    if (upgrade === undefined || upgrade.toLowerCase() !== 'websocket') {
	      const message = 'Invalid Upgrade header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (key === undefined || !keyRegex.test(key)) {
	      const message = 'Missing or invalid Sec-WebSocket-Key header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (version !== 8 && version !== 13) {
	      const message = 'Missing or invalid Sec-WebSocket-Version header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (!this.shouldHandle(req)) {
	      abortHandshake(socket, 400);
	      return;
	    }

	    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
	    let protocols = new Set();

	    if (secWebSocketProtocol !== undefined) {
	      try {
	        protocols = subprotocol.parse(secWebSocketProtocol);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Protocol header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
	    const extensions = {};

	    if (
	      this.options.perMessageDeflate &&
	      secWebSocketExtensions !== undefined
	    ) {
	      const perMessageDeflate = new PerMessageDeflate(
	        this.options.perMessageDeflate,
	        true,
	        this.options.maxPayload
	      );

	      try {
	        const offers = extension.parse(secWebSocketExtensions);

	        if (offers[PerMessageDeflate.extensionName]) {
	          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
	          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
	        }
	      } catch (err) {
	        const message =
	          'Invalid or unacceptable Sec-WebSocket-Extensions header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    //
	    // Optionally call external client verification handler.
	    //
	    if (this.options.verifyClient) {
	      const info = {
	        origin:
	          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
	        secure: !!(req.socket.authorized || req.socket.encrypted),
	        req
	      };

	      if (this.options.verifyClient.length === 2) {
	        this.options.verifyClient(info, (verified, code, message, headers) => {
	          if (!verified) {
	            return abortHandshake(socket, code || 401, message, headers);
	          }

	          this.completeUpgrade(
	            extensions,
	            key,
	            protocols,
	            req,
	            socket,
	            head,
	            cb
	          );
	        });
	        return;
	      }

	      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
	    }

	    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
	  }

	  /**
	   * Upgrade the connection to WebSocket.
	   *
	   * @param {Object} extensions The accepted extensions
	   * @param {String} key The value of the `Sec-WebSocket-Key` header
	   * @param {Set} protocols The subprotocols
	   * @param {http.IncomingMessage} req The request object
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @throws {Error} If called more than once with the same socket
	   * @private
	   */
	  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
	    //
	    // Destroy the socket if the client has already sent a FIN packet.
	    //
	    if (!socket.readable || !socket.writable) return socket.destroy();

	    if (socket[kWebSocket]) {
	      throw new Error(
	        'server.handleUpgrade() was called more than once with the same ' +
	          'socket, possibly due to a misconfiguration'
	      );
	    }

	    if (this._state > RUNNING) return abortHandshake(socket, 503);

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    const headers = [
	      'HTTP/1.1 101 Switching Protocols',
	      'Upgrade: websocket',
	      'Connection: Upgrade',
	      `Sec-WebSocket-Accept: ${digest}`
	    ];

	    const ws = new this.options.WebSocket(null, undefined, this.options);

	    if (protocols.size) {
	      //
	      // Optionally call external protocol selection handler.
	      //
	      const protocol = this.options.handleProtocols
	        ? this.options.handleProtocols(protocols, req)
	        : protocols.values().next().value;

	      if (protocol) {
	        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
	        ws._protocol = protocol;
	      }
	    }

	    if (extensions[PerMessageDeflate.extensionName]) {
	      const params = extensions[PerMessageDeflate.extensionName].params;
	      const value = extension.format({
	        [PerMessageDeflate.extensionName]: [params]
	      });
	      headers.push(`Sec-WebSocket-Extensions: ${value}`);
	      ws._extensions = extensions;
	    }

	    //
	    // Allow external modification/inspection of handshake headers.
	    //
	    this.emit('headers', headers, req);

	    socket.write(headers.concat('\r\n').join('\r\n'));
	    socket.removeListener('error', socketOnError);

	    ws.setSocket(socket, head, {
	      allowSynchronousEvents: this.options.allowSynchronousEvents,
	      maxPayload: this.options.maxPayload,
	      skipUTF8Validation: this.options.skipUTF8Validation
	    });

	    if (this.clients) {
	      this.clients.add(ws);
	      ws.on('close', () => {
	        this.clients.delete(ws);

	        if (this._shouldEmitClose && !this.clients.size) {
	          process.nextTick(emitClose, this);
	        }
	      });
	    }

	    cb(ws, req);
	  }
	}

	websocketServer = WebSocketServer;

	/**
	 * Add event listeners on an `EventEmitter` using a map of <event, listener>
	 * pairs.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @param {Object.<String, Function>} map The listeners to add
	 * @return {Function} A function that will remove the added listeners when
	 *     called
	 * @private
	 */
	function addListeners(server, map) {
	  for (const event of Object.keys(map)) server.on(event, map[event]);

	  return function removeListeners() {
	    for (const event of Object.keys(map)) {
	      server.removeListener(event, map[event]);
	    }
	  };
	}

	/**
	 * Emit a `'close'` event on an `EventEmitter`.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @private
	 */
	function emitClose(server) {
	  server._state = CLOSED;
	  server.emit('close');
	}

	/**
	 * Handle socket errors.
	 *
	 * @private
	 */
	function socketOnError() {
	  this.destroy();
	}

	/**
	 * Close the connection when preconditions are not fulfilled.
	 *
	 * @param {Duplex} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} [message] The HTTP response body
	 * @param {Object} [headers] Additional HTTP response headers
	 * @private
	 */
	function abortHandshake(socket, code, message, headers) {
	  //
	  // The socket is writable unless the user destroyed or ended it before calling
	  // `server.handleUpgrade()` or in the `verifyClient` function, which is a user
	  // error. Handling this does not make much sense as the worst that can happen
	  // is that some of the data written by the user might be discarded due to the
	  // call to `socket.end()` below, which triggers an `'error'` event that in
	  // turn causes the socket to be destroyed.
	  //
	  message = message || http.STATUS_CODES[code];
	  headers = {
	    Connection: 'close',
	    'Content-Type': 'text/html',
	    'Content-Length': Buffer.byteLength(message),
	    ...headers
	  };

	  socket.once('finish', socket.destroy);

	  socket.end(
	    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
	      Object.keys(headers)
	        .map((h) => `${h}: ${headers[h]}`)
	        .join('\r\n') +
	      '\r\n\r\n' +
	      message
	  );
	}

	/**
	 * Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	 * one listener for it, otherwise call `abortHandshake()`.
	 *
	 * @param {WebSocketServer} server The WebSocket server
	 * @param {http.IncomingMessage} req The request object
	 * @param {Duplex} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} message The HTTP response body
	 * @private
	 */
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message) {
	  if (server.listenerCount('wsClientError')) {
	    const err = new Error(message);
	    Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);

	    server.emit('wsClientError', err, socket, req);
	  } else {
	    abortHandshake(socket, code, message);
	  }
	}
	return websocketServer;
}

var websocketServerExports = requireWebsocketServer();
const _WebSocketServer = /*@__PURE__*/getDefaultExportFromCjs$1(websocketServerExports);

const nodeAdapter = (options = {}) => {
  const hooks = new AdapterHookable(options);
  const peers = /* @__PURE__ */ new Set();
  const wss = options.wss || new _WebSocketServer({
    noServer: true,
    ...options.serverOptions
  });
  wss.on("connection", (ws, nodeReq) => {
    const request = new NodeReqProxy(nodeReq);
    const peer = new NodePeer({ ws, request, peers, nodeReq });
    peers.add(peer);
    hooks.callHook("open", peer);
    ws.on("message", (data) => {
      if (Array.isArray(data)) {
        data = Buffer.concat(data);
      }
      hooks.callHook("message", peer, new Message(data, peer));
    });
    ws.on("error", (error) => {
      peers.delete(peer);
      hooks.callHook("error", peer, new WSError(error));
    });
    ws.on("close", (code, reason) => {
      peers.delete(peer);
      hooks.callHook("close", peer, {
        code,
        reason: reason?.toString()
      });
    });
  });
  wss.on("headers", (outgoingHeaders, req) => {
    const upgradeHeaders = req._upgradeHeaders;
    if (upgradeHeaders) {
      for (const [key, value] of new Headers(upgradeHeaders)) {
        outgoingHeaders.push(`${key}: ${value}`);
      }
    }
  });
  return {
    ...adapterUtils(peers),
    handleUpgrade: async (nodeReq, socket, head) => {
      const request = new NodeReqProxy(nodeReq);
      const { upgradeHeaders, endResponse, context } = await hooks.upgrade(request);
      if (endResponse) {
        return sendResponse(socket, endResponse);
      }
      nodeReq._request = request;
      nodeReq._upgradeHeaders = upgradeHeaders;
      nodeReq._context = context;
      wss.handleUpgrade(nodeReq, socket, head, (ws) => {
        wss.emit("connection", ws, nodeReq);
      });
    },
    closeAll: (code, data, force) => {
      for (const client of wss.clients) {
        if (force) {
          client.terminate();
        } else {
          client.close(code, data);
        }
      }
    }
  };
};
class NodePeer extends Peer {
  get remoteAddress() {
    return this._internal.nodeReq.socket?.remoteAddress;
  }
  get context() {
    return this._internal.nodeReq._context;
  }
  send(data, options) {
    const dataBuff = toBufferLike(data);
    const isBinary = typeof dataBuff !== "string";
    this._internal.ws.send(dataBuff, {
      compress: options?.compress,
      binary: isBinary,
      ...options
    });
    return 0;
  }
  publish(topic, data, options) {
    const dataBuff = toBufferLike(data);
    const isBinary = typeof data !== "string";
    const sendOptions = {
      compress: options?.compress,
      binary: isBinary,
      ...options
    };
    for (const peer of this._internal.peers) {
      if (peer !== this && peer._topics.has(topic)) {
        peer._internal.ws.send(dataBuff, sendOptions);
      }
    }
  }
  close(code, data) {
    this._internal.ws.close(code, data);
  }
  terminate() {
    this._internal.ws.terminate();
  }
}
class NodeReqProxy {
  _req;
  _headers;
  _url;
  constructor(req) {
    this._req = req;
  }
  get url() {
    if (!this._url) {
      const req = this._req;
      const host = req.headers["host"] || "localhost";
      const isSecure = req.socket?.encrypted ?? req.headers["x-forwarded-proto"] === "https";
      this._url = `${isSecure ? "https" : "http"}://${host}${req.url}`;
    }
    return this._url;
  }
  get headers() {
    if (!this._headers) {
      this._headers = new Headers(this._req.headers);
    }
    return this._headers;
  }
}
async function sendResponse(socket, res) {
  const head = [
    `HTTP/1.1 ${res.status || 200} ${res.statusText || ""}`,
    ...[...res.headers.entries()].map(
      ([key, value]) => `${encodeURIComponent(key)}: ${encodeURIComponent(value)}`
    )
  ];
  socket.write(head.join("\r\n") + "\r\n\r\n");
  if (res.body) {
    for await (const chunk of res.body) {
      socket.write(chunk);
    }
  }
  return new Promise((resolve) => {
    socket.end(() => {
      socket.destroy();
      resolve();
    });
  });
}

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode$1(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode$1(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$3(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$3(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$3(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$3(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse$2(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode$2;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode$1(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode$2(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode$1(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$2 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$2,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$2.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$2{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse$1(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process$1(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process$1(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$3(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse$1(body, boundary);
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse$2(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i$1=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i$1;
const ofetch = createFetch({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
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
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
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
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
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
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
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
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
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
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
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
    const response = await _cachedHandler(
      event
    );
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
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
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

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const defineAppConfig = (config) => config;

const appConfig0 = defineAppConfig({
  name: "KDC Tutor School",
  version: "1.0.0",
  theme: {
    primary: "#2563eb",
    secondary: "#10b981",
    accent: "#f97316"
  }
});

const inlineAppConfig = {
  "nuxt": {}
};

const appConfig = defuFn(appConfig0, inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "7f778052-5aae-45a6-99ec-27e5a54a4be0",
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
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "apiBase": "/api",
    "appName": "KDC Tutor School",
    "appVersion": "1.0.0",
    "i18n": {
      "configLocales": [],
      "defaultLocale": "th",
      "strategy": "prefix_except_default",
      "differentDomains": false,
      "multiDomainLocales": [],
      "skipSettingLocaleOnNavigate": false,
      "routesNameSeparator": "___",
      "defaultLocaleRouteNameSuffix": "default",
      "defaultDirection": "ltr",
      "experimental": {
        "switchLocalePathLinkSSR": false
      }
    }
  },
  "dbHost": "localhost",
  "dbPort": 3306,
  "dbName": "tutordb",
  "dbUser": "root",
  "dbPassword": "",
  "jwtSecret": "t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=",
  "jwtRefreshSecret": "aJ2YfuWgoLv44yXtI/4W38pZA379nSRQ5J5s0MwQZlo=",
  "jwtExpiresIn": "15m",
  "jwtRefreshExpiresIn": "7d",
  "redisHost": "localhost",
  "redisPort": 6379,
  "redisPassword": "",
  "redisDb": 0
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
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

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config$1.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
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
        const query = getQuery$1(event.path);
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

function _captureError(error, type) {
  console.error(`[${type}]`, error);
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

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

function defineNitroPlugin(def) {
  return def;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

var engine_io = {};

const require$$0$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(require$$2$5);

var server$1 = {};

const require$$0$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(querystring);

const require$$2$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(require$$7$1);

const require$$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(base64id$1);

var transports = {};

var polling$2 = {};

var transport = {};

const require$$8 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(require$$0$3);

const PACKET_TYPES = Object.create(null); // no Map = no polyfill
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach((key) => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = { type: "error", data: "parser error" };

const encodePacket = ({ type, data }, supportsBinary, callback) => {
    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        return callback(supportsBinary ? data : "b" + toBuffer(data, true).toString("base64"));
    }
    // plain string
    return callback(PACKET_TYPES[type] + (data || ""));
};
const toBuffer = (data, forceBufferConversion) => {
    if (Buffer.isBuffer(data) ||
        (data instanceof Uint8Array && !forceBufferConversion)) {
        return data;
    }
    else if (data instanceof ArrayBuffer) {
        return Buffer.from(data);
    }
    else {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    }
};
let TEXT_ENCODER;
function encodePacketToBinary(packet, callback) {
    if (packet.data instanceof ArrayBuffer || ArrayBuffer.isView(packet.data)) {
        return callback(toBuffer(packet.data, false));
    }
    encodePacket(packet, true, (encoded) => {
        if (!TEXT_ENCODER) {
            // lazily created for compatibility with Node.js 10
            TEXT_ENCODER = new TextEncoder();
        }
        callback(TEXT_ENCODER.encode(encoded));
    });
}

const decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
        return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType),
        };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
        const buffer = Buffer.from(encodedPacket.substring(1), "base64");
        return {
            type: "message",
            data: mapBinary(buffer, binaryType),
        };
    }
    if (!PACKET_TYPES_REVERSE[type]) {
        return ERROR_PACKET;
    }
    return encodedPacket.length > 1
        ? {
            type: PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1),
        }
        : {
            type: PACKET_TYPES_REVERSE[type],
        };
};
const mapBinary = (data, binaryType) => {
    switch (binaryType) {
        case "arraybuffer":
            if (data instanceof ArrayBuffer) {
                // from WebSocket & binaryType "arraybuffer"
                return data;
            }
            else if (Buffer.isBuffer(data)) {
                // from HTTP long-polling
                return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
            }
            else {
                // from WebTransport (Uint8Array)
                return data.buffer;
            }
        case "nodebuffer":
        default:
            if (Buffer.isBuffer(data)) {
                // from HTTP long-polling or WebSocket & binaryType "nodebuffer" (default)
                return data;
            }
            else {
                // from WebTransport (Uint8Array)
                return Buffer.from(data);
            }
    }
};

const SEPARATOR$1 = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const encodePayload = (packets, callback) => {
    // some packets may be added to the array while encoding, so the initial length must be saved
    const length = packets.length;
    const encodedPackets = new Array(length);
    let count = 0;
    packets.forEach((packet, i) => {
        // force base64 encoding for binary packets
        encodePacket(packet, false, (encodedPacket) => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
                callback(encodedPackets.join(SEPARATOR$1));
            }
        });
    });
};
const decodePayload = (encodedPayload, binaryType) => {
    const encodedPackets = encodedPayload.split(SEPARATOR$1);
    const packets = [];
    for (let i = 0; i < encodedPackets.length; i++) {
        const decodedPacket = decodePacket(encodedPackets[i], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
            break;
        }
    }
    return packets;
};
function createPacketEncoderStream() {
    return new TransformStream({
        transform(packet, controller) {
            encodePacketToBinary(packet, (encodedPacket) => {
                const payloadLength = encodedPacket.length;
                let header;
                // inspired by the WebSocket format: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#decoding_payload_length
                if (payloadLength < 126) {
                    header = new Uint8Array(1);
                    new DataView(header.buffer).setUint8(0, payloadLength);
                }
                else if (payloadLength < 65536) {
                    header = new Uint8Array(3);
                    const view = new DataView(header.buffer);
                    view.setUint8(0, 126);
                    view.setUint16(1, payloadLength);
                }
                else {
                    header = new Uint8Array(9);
                    const view = new DataView(header.buffer);
                    view.setUint8(0, 127);
                    view.setBigUint64(1, BigInt(payloadLength));
                }
                // first bit indicates whether the payload is plain text (0) or binary (1)
                if (packet.data && typeof packet.data !== "string") {
                    header[0] |= 0x80;
                }
                controller.enqueue(header);
                controller.enqueue(encodedPacket);
            });
        },
    });
}
let TEXT_DECODER;
function totalLength(chunks) {
    return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
}
function concatChunks(chunks, size) {
    if (chunks[0].length === size) {
        return chunks.shift();
    }
    const buffer = new Uint8Array(size);
    let j = 0;
    for (let i = 0; i < size; i++) {
        buffer[i] = chunks[0][j++];
        if (j === chunks[0].length) {
            chunks.shift();
            j = 0;
        }
    }
    if (chunks.length && j < chunks[0].length) {
        chunks[0] = chunks[0].slice(j);
    }
    return buffer;
}
function createPacketDecoderStream(maxPayload, binaryType) {
    if (!TEXT_DECODER) {
        TEXT_DECODER = new TextDecoder();
    }
    const chunks = [];
    let state = 0 /* State.READ_HEADER */;
    let expectedLength = -1;
    let isBinary = false;
    return new TransformStream({
        transform(chunk, controller) {
            chunks.push(chunk);
            while (true) {
                if (state === 0 /* State.READ_HEADER */) {
                    if (totalLength(chunks) < 1) {
                        break;
                    }
                    const header = concatChunks(chunks, 1);
                    isBinary = (header[0] & 0x80) === 0x80;
                    expectedLength = header[0] & 0x7f;
                    if (expectedLength < 126) {
                        state = 3 /* State.READ_PAYLOAD */;
                    }
                    else if (expectedLength === 126) {
                        state = 1 /* State.READ_EXTENDED_LENGTH_16 */;
                    }
                    else {
                        state = 2 /* State.READ_EXTENDED_LENGTH_64 */;
                    }
                }
                else if (state === 1 /* State.READ_EXTENDED_LENGTH_16 */) {
                    if (totalLength(chunks) < 2) {
                        break;
                    }
                    const headerArray = concatChunks(chunks, 2);
                    expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
                    state = 3 /* State.READ_PAYLOAD */;
                }
                else if (state === 2 /* State.READ_EXTENDED_LENGTH_64 */) {
                    if (totalLength(chunks) < 8) {
                        break;
                    }
                    const headerArray = concatChunks(chunks, 8);
                    const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
                    const n = view.getUint32(0);
                    if (n > Math.pow(2, 53 - 32) - 1) {
                        // the maximum safe integer in JavaScript is 2^53 - 1
                        controller.enqueue(ERROR_PACKET);
                        break;
                    }
                    expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
                    state = 3 /* State.READ_PAYLOAD */;
                }
                else {
                    if (totalLength(chunks) < expectedLength) {
                        break;
                    }
                    const data = concatChunks(chunks, expectedLength);
                    controller.enqueue(decodePacket(isBinary ? data : TEXT_DECODER.decode(data), binaryType));
                    state = 0 /* State.READ_HEADER */;
                }
                if (expectedLength === 0 || expectedLength > maxPayload) {
                    controller.enqueue(ERROR_PACKET);
                    break;
                }
            }
        },
    });
}
const protocol$1 = 4;

const esm = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  createPacketDecoderStream: createPacketDecoderStream,
  createPacketEncoderStream: createPacketEncoderStream,
  decodePacket: decodePacket,
  decodePayload: decodePayload,
  encodePacket: encodePacket,
  encodePayload: encodePayload,
  protocol: protocol$1
}, Symbol.toStringTag, { value: 'Module' }));

var parserV3 = {};

/*! https://mths.be/utf8js v2.1.2 by @mathias */

var stringFromCharCode = String.fromCharCode;
// Taken from https://mths.be/punycode
function ucs2decode(string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    var value;
    var extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            }
            else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        }
        else {
            output.push(value);
        }
    }
    return output;
}
// Taken from https://mths.be/punycode
function ucs2encode(array) {
    var length = array.length;
    var index = -1;
    var value;
    var output = '';
    while (++index < length) {
        value = array[index];
        if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
        }
        output += stringFromCharCode(value);
    }
    return output;
}
function checkScalarValue(codePoint, strict) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        if (strict) {
            throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
                ' is not a scalar value');
        }
        return false;
    }
    return true;
}
/*--------------------------------------------------------------------------*/
function createByte(codePoint, shift) {
    return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}
function encodeCodePoint(codePoint, strict) {
    if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
        return stringFromCharCode(codePoint);
    }
    var symbol = '';
    if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
        symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    }
    else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
        if (!checkScalarValue(codePoint, strict)) {
            codePoint = 0xFFFD;
        }
        symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
        symbol += createByte(codePoint, 6);
    }
    else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
        symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
        symbol += createByte(codePoint, 12);
        symbol += createByte(codePoint, 6);
    }
    symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    return symbol;
}
function utf8encode(string, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    var codePoints = ucs2decode(string);
    var length = codePoints.length;
    var index = -1;
    var codePoint;
    var byteString = '';
    while (++index < length) {
        codePoint = codePoints[index];
        byteString += encodeCodePoint(codePoint, strict);
    }
    return byteString;
}
/*--------------------------------------------------------------------------*/
function readContinuationByte() {
    if (byteIndex >= byteCount) {
        throw Error('Invalid byte index');
    }
    var continuationByte = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    if ((continuationByte & 0xC0) == 0x80) {
        return continuationByte & 0x3F;
    }
    // If we end up here, it’s not a continuation byte
    throw Error('Invalid continuation byte');
}
function decodeSymbol(strict) {
    var byte1;
    var byte2;
    var byte3;
    var byte4;
    var codePoint;
    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }
    if (byteIndex == byteCount) {
        return false;
    }
    // Read first byte
    byte1 = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }
    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        byte2 = readContinuationByte();
        codePoint = ((byte1 & 0x1F) << 6) | byte2;
        if (codePoint >= 0x80) {
            return codePoint;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (codePoint >= 0x0800) {
            return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
            (byte3 << 0x06) | byte4;
        if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
            return codePoint;
        }
    }
    throw Error('Invalid UTF-8 detected');
}
var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    byteArray = ucs2decode(byteString);
    byteCount = byteArray.length;
    byteIndex = 0;
    var codePoints = [];
    var tmp;
    while ((tmp = decodeSymbol(strict)) !== false) {
        codePoints.push(tmp);
    }
    return ucs2encode(codePoints);
}
var utf8 = {
    version: '2.1.2',
    encode: utf8encode,
    decode: utf8decode
};

(function (exports$1) {
	// imported from https://github.com/socketio/engine.io-parser/tree/2.2.x
	Object.defineProperty(exports$1, "__esModule", { value: true });
	exports$1.packets = exports$1.protocol = void 0;
	exports$1.encodePacket = encodePacket;
	exports$1.encodeBase64Packet = encodeBase64Packet;
	exports$1.decodePacket = decodePacket;
	exports$1.decodeBase64Packet = decodeBase64Packet;
	exports$1.encodePayload = encodePayload;
	exports$1.decodePayload = decodePayload;
	exports$1.encodePayloadAsBinary = encodePayloadAsBinary;
	exports$1.decodePayloadAsBinary = decodePayloadAsBinary;
	/**
	 * Module dependencies.
	 */
	var utf8$1 = utf8;
	/**
	 * Current protocol version.
	 */
	exports$1.protocol = 3;
	const hasBinary = (packets) => {
	    for (const packet of packets) {
	        if (packet.data instanceof ArrayBuffer || ArrayBuffer.isView(packet.data)) {
	            return true;
	        }
	    }
	    return false;
	};
	/**
	 * Packet types.
	 */
	exports$1.packets = {
	    open: 0 // non-ws
	    ,
	    close: 1 // non-ws
	    ,
	    ping: 2,
	    pong: 3,
	    message: 4,
	    upgrade: 5,
	    noop: 6
	};
	var packetslist = Object.keys(exports$1.packets);
	/**
	 * Premade error packet.
	 */
	var err = { type: 'error', data: 'parser error' };
	const EMPTY_BUFFER = Buffer.concat([]);
	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */
	function encodePacket(packet, supportsBinary, utf8encode, callback) {
	    if (typeof supportsBinary === 'function') {
	        callback = supportsBinary;
	        supportsBinary = null;
	    }
	    if (typeof utf8encode === 'function') {
	        callback = utf8encode;
	        utf8encode = null;
	    }
	    if (Buffer.isBuffer(packet.data)) {
	        return encodeBuffer(packet, supportsBinary, callback);
	    }
	    else if (packet.data && (packet.data.buffer || packet.data) instanceof ArrayBuffer) {
	        return encodeBuffer({ type: packet.type, data: arrayBufferToBuffer(packet.data) }, supportsBinary, callback);
	    }
	    // Sending data as a utf-8 string
	    var encoded = exports$1.packets[packet.type];
	    // data fragment is optional
	    if (undefined !== packet.data) {
	        encoded += utf8encode ? utf8$1.encode(String(packet.data), { strict: false }) : String(packet.data);
	    }
	    return callback('' + encoded);
	}
	/**
	 * Encode Buffer data
	 */
	function encodeBuffer(packet, supportsBinary, callback) {
	    if (!supportsBinary) {
	        return encodeBase64Packet(packet, callback);
	    }
	    var data = packet.data;
	    var typeBuffer = Buffer.allocUnsafe(1);
	    typeBuffer[0] = exports$1.packets[packet.type];
	    return callback(Buffer.concat([typeBuffer, data]));
	}
	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */
	function encodeBase64Packet(packet, callback) {
	    var data = Buffer.isBuffer(packet.data) ? packet.data : arrayBufferToBuffer(packet.data);
	    var message = 'b' + exports$1.packets[packet.type];
	    message += data.toString('base64');
	    return callback(message);
	}
	/**
	 * Decodes a packet. Data also available as an ArrayBuffer if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */
	function decodePacket(data, binaryType, utf8decode) {
	    if (data === undefined) {
	        return err;
	    }
	    var type;
	    // String data
	    if (typeof data === 'string') {
	        type = data.charAt(0);
	        if (type === 'b') {
	            return decodeBase64Packet(data.slice(1), binaryType);
	        }
	        if (utf8decode) {
	            data = tryDecode(data);
	            if (data === false) {
	                return err;
	            }
	        }
	        if (Number(type) != type || !packetslist[type]) {
	            return err;
	        }
	        if (data.length > 1) {
	            return { type: packetslist[type], data: data.slice(1) };
	        }
	        else {
	            return { type: packetslist[type] };
	        }
	    }
	    // Binary data
	    if (binaryType === 'arraybuffer') {
	        // wrap Buffer/ArrayBuffer data into an Uint8Array
	        var intArray = new Uint8Array(data);
	        type = intArray[0];
	        return { type: packetslist[type], data: intArray.buffer.slice(1) };
	    }
	    if (data instanceof ArrayBuffer) {
	        data = arrayBufferToBuffer(data);
	    }
	    type = data[0];
	    return { type: packetslist[type], data: data.slice(1) };
	}
	function tryDecode(data) {
	    try {
	        data = utf8$1.decode(data, { strict: false });
	    }
	    catch (e) {
	        return false;
	    }
	    return data;
	}
	/**
	 * Decodes a packet encoded in a base64 string.
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */
	function decodeBase64Packet(msg, binaryType) {
	    var type = packetslist[msg.charAt(0)];
	    var data = Buffer.from(msg.slice(1), 'base64');
	    if (binaryType === 'arraybuffer') {
	        var abv = new Uint8Array(data.length);
	        for (var i = 0; i < abv.length; i++) {
	            abv[i] = data[i];
	        }
	        // @ts-ignore
	        data = abv.buffer;
	    }
	    return { type: type, data: data };
	}
	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */
	function encodePayload(packets, supportsBinary, callback) {
	    if (typeof supportsBinary === 'function') {
	        callback = supportsBinary;
	        supportsBinary = null;
	    }
	    if (supportsBinary && hasBinary(packets)) {
	        return encodePayloadAsBinary(packets, callback);
	    }
	    if (!packets.length) {
	        return callback('0:');
	    }
	    function encodeOne(packet, doneCallback) {
	        encodePacket(packet, supportsBinary, false, function (message) {
	            doneCallback(null, setLengthHeader(message));
	        });
	    }
	    map(packets, encodeOne, function (err, results) {
	        return callback(results.join(''));
	    });
	}
	function setLengthHeader(message) {
	    return message.length + ':' + message;
	}
	/**
	 * Async array map using after
	 */
	function map(ary, each, done) {
	    const results = new Array(ary.length);
	    let count = 0;
	    for (let i = 0; i < ary.length; i++) {
	        each(ary[i], (error, msg) => {
	            results[i] = msg;
	            if (++count === ary.length) {
	                done(null, results);
	            }
	        });
	    }
	}
	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */
	function decodePayload(data, binaryType, callback) {
	    if (typeof data !== 'string') {
	        return decodePayloadAsBinary(data, binaryType, callback);
	    }
	    if (typeof binaryType === 'function') {
	        callback = binaryType;
	        binaryType = null;
	    }
	    if (data === '') {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	    }
	    var length = '', n, msg, packet;
	    for (var i = 0, l = data.length; i < l; i++) {
	        var chr = data.charAt(i);
	        if (chr !== ':') {
	            length += chr;
	            continue;
	        }
	        // @ts-ignore
	        if (length === '' || (length != (n = Number(length)))) {
	            // parser error - ignoring payload
	            return callback(err, 0, 1);
	        }
	        msg = data.slice(i + 1, i + 1 + n);
	        if (length != msg.length) {
	            // parser error - ignoring payload
	            return callback(err, 0, 1);
	        }
	        if (msg.length) {
	            packet = decodePacket(msg, binaryType, false);
	            if (err.type === packet.type && err.data === packet.data) {
	                // parser error in individual packet - ignoring payload
	                return callback(err, 0, 1);
	            }
	            var more = callback(packet, i + n, l);
	            if (false === more)
	                return;
	        }
	        // advance cursor
	        i += n;
	        length = '';
	    }
	    if (length !== '') {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	    }
	}
	/**
	 *
	 * Converts a buffer to a utf8.js encoded string
	 *
	 * @api private
	 */
	function bufferToString(buffer) {
	    var str = '';
	    for (var i = 0, l = buffer.length; i < l; i++) {
	        str += String.fromCharCode(buffer[i]);
	    }
	    return str;
	}
	/**
	 *
	 * Converts a utf8.js encoded string to a buffer
	 *
	 * @api private
	 */
	function stringToBuffer(string) {
	    var buf = Buffer.allocUnsafe(string.length);
	    for (var i = 0, l = string.length; i < l; i++) {
	        buf.writeUInt8(string.charCodeAt(i), i);
	    }
	    return buf;
	}
	/**
	 *
	 * Converts an ArrayBuffer to a Buffer
	 *
	 * @api private
	 */
	function arrayBufferToBuffer(data) {
	    // data is either an ArrayBuffer or ArrayBufferView.
	    var length = data.byteLength || data.length;
	    var offset = data.byteOffset || 0;
	    return Buffer.from(data.buffer || data, offset, length);
	}
	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {Buffer} encoded payload
	 * @api private
	 */
	function encodePayloadAsBinary(packets, callback) {
	    if (!packets.length) {
	        return callback(EMPTY_BUFFER);
	    }
	    map(packets, encodeOneBinaryPacket, function (err, results) {
	        return callback(Buffer.concat(results));
	    });
	}
	function encodeOneBinaryPacket(p, doneCallback) {
	    function onBinaryPacketEncode(packet) {
	        var encodingLength = '' + packet.length;
	        var sizeBuffer;
	        if (typeof packet === 'string') {
	            sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
	            sizeBuffer[0] = 0; // is a string (not true binary = 0)
	            for (var i = 0; i < encodingLength.length; i++) {
	                sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
	            }
	            sizeBuffer[sizeBuffer.length - 1] = 255;
	            return doneCallback(null, Buffer.concat([sizeBuffer, stringToBuffer(packet)]));
	        }
	        sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
	        sizeBuffer[0] = 1; // is binary (true binary = 1)
	        for (var i = 0; i < encodingLength.length; i++) {
	            sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
	        }
	        sizeBuffer[sizeBuffer.length - 1] = 255;
	        doneCallback(null, Buffer.concat([sizeBuffer, packet]));
	    }
	    encodePacket(p, true, true, onBinaryPacketEncode);
	}
	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary

	 * @param {Buffer} data, callback method
	 * @api public
	 */
	function decodePayloadAsBinary(data, binaryType, callback) {
	    if (typeof binaryType === 'function') {
	        callback = binaryType;
	        binaryType = null;
	    }
	    var bufferTail = data;
	    var buffers = [];
	    var i;
	    while (bufferTail.length > 0) {
	        var strLen = '';
	        var isString = bufferTail[0] === 0;
	        for (i = 1;; i++) {
	            if (bufferTail[i] === 255)
	                break;
	            // 310 = char length of Number.MAX_VALUE
	            if (strLen.length > 310) {
	                return callback(err, 0, 1);
	            }
	            strLen += '' + bufferTail[i];
	        }
	        bufferTail = bufferTail.slice(strLen.length + 1);
	        var msgLength = parseInt(strLen, 10);
	        var msg = bufferTail.slice(1, msgLength + 1);
	        if (isString)
	            msg = bufferToString(msg);
	        buffers.push(msg);
	        bufferTail = bufferTail.slice(msgLength + 1);
	    }
	    var total = buffers.length;
	    for (i = 0; i < total; i++) {
	        var buffer = buffers[i];
	        callback(decodePacket(buffer, binaryType, true), i, total);
	    }
	}
} (parserV3));

function createDebug(namespace) {
	return Object.assign((...args) => {
		const env = globalThis.process?.env.DEBUG;
		if (!env || env !== "*" && !env.startsWith(namespace)) return;
		console.debug(...args);
	}, {
		color: "#000000",
		diff: 0,
		enabled: true,
		log: console.debug.bind(console),
		namespace,
		destroy: () => false,
		extend: (ns, _del) => createDebug(namespace + ns)
	});
}
const debug$f = Object.assign(createDebug, {
	coerce: (val) => val,
	disable: () => "",
	enable: (_namespaces) => {},
	enabled: (_namespaces) => true,
	formatArgs(args) {
		args[0] = `${this.namespace} ${args[0]}`;
	},
	log: console.debug.bind(console),
	selectColor: (_namespace) => 0,
	humanize: (num) => `${num}ms`,
	inspectOpts: {},
	names: [],
	skips: [],
	formatters: {}
});
const coerce = debug$f.coerce;
const disable = debug$f.disable;
const enable = debug$f.enable;
const enabled = debug$f.enabled;
const formatArgs = debug$f.formatArgs;
const log = debug$f.log;
const selectColor = debug$f.selectColor;
const humanize = debug$f.humanize;
const names = debug$f.names;
const skips = debug$f.skips;
const formatters = debug$f.formatters;

const debug$g = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  coerce: coerce,
  default: debug$f,
  disable: disable,
  enable: enable,
  enabled: enabled,
  formatArgs: formatArgs,
  formatters: formatters,
  humanize: humanize,
  log: log,
  names: names,
  selectColor: selectColor,
  skips: skips
}, Symbol.toStringTag, { value: 'Module' }));

const require$$13 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(debug$g);

Object.defineProperty(transport, "__esModule", { value: true });
transport.Transport = void 0;
const events_1$4 = require$$8;
const parser_v4 = esm;
const parser_v3 = parserV3;
const debug_1$b = require$$13;
const debug$e = (0, debug_1$b.default)("engine:transport");
function noop$1() { }
class Transport extends events_1$4.EventEmitter {
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug$e("readyState updated from %s to %s (%s)", this._readyState, state, this.name);
        this._readyState = state;
    }
    /**
     * Transport constructor.
     *
     * @param {EngineRequest} req
     */
    constructor(req) {
        super();
        /**
         * Whether the transport is currently ready to send packets.
         */
        this.writable = false;
        /**
         * The current state of the transport.
         * @protected
         */
        this._readyState = "open";
        /**
         * Whether the transport is discarded and can be safely closed (used during upgrade).
         * @protected
         */
        this.discarded = false;
        this.protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        this.parser = this.protocol === 4 ? parser_v4 : parser_v3;
        this.supportsBinary = !(req._query && req._query.b64);
    }
    /**
     * Flags the transport as discarded.
     *
     * @package
     */
    discard() {
        this.discarded = true;
    }
    /**
     * Called with an incoming HTTP request.
     *
     * @param req
     * @package
     */
    onRequest(req) { }
    /**
     * Closes the transport.
     *
     * @package
     */
    close(fn) {
        if ("closed" === this.readyState || "closing" === this.readyState)
            return;
        this.readyState = "closing";
        this.doClose(fn || noop$1);
    }
    /**
     * Called with a transport error.
     *
     * @param {String} msg - message error
     * @param {Object} desc - error description
     * @protected
     */
    onError(msg, desc) {
        if (this.listeners("error").length) {
            const err = new Error(msg);
            // @ts-ignore
            err.type = "TransportError";
            // @ts-ignore
            err.description = desc;
            this.emit("error", err);
        }
        else {
            debug$e("ignored transport error %s (%s)", msg, desc);
        }
    }
    /**
     * Called with parsed out a packets from the data stream.
     *
     * @param {Object} packet
     * @protected
     */
    onPacket(packet) {
        this.emit("packet", packet);
    }
    /**
     * Called with the encoded packet data.
     *
     * @param {String} data
     * @protected
     */
    onData(data) {
        this.onPacket(this.parser.decodePacket(data));
    }
    /**
     * Called upon transport close.
     *
     * @protected
     */
    onClose() {
        this.readyState = "closed";
        this.emit("close");
    }
}
transport.Transport = Transport;

const require$$2$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(require$$0$4);

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(negotiator);

const require$$1$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(mimeTypes);

/*!
 * accepts
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

var Negotiator = require$$0;
var mime = require$$1$1;

/**
 * Module exports.
 * @public
 */

var accepts$2 = Accepts;

/**
 * Create a new Accepts object for the given req.
 *
 * @param {object} req
 * @public
 */

function Accepts (req) {
  if (!(this instanceof Accepts)) {
    return new Accepts(req)
  }

  this.headers = req.headers;
  this.negotiator = new Negotiator(req);
}

/**
 * Check if the given `type(s)` is acceptable, returning
 * the best match when true, otherwise `undefined`, in which
 * case you should respond with 406 "Not Acceptable".
 *
 * The `type` value may be a single mime type string
 * such as "application/json", the extension name
 * such as "json" or an array `["json", "html", "text/plain"]`. When a list
 * or array is given the _best_ match, if any is returned.
 *
 * Examples:
 *
 *     // Accept: text/html
 *     this.types('html');
 *     // => "html"
 *
 *     // Accept: text/*, application/json
 *     this.types('html');
 *     // => "html"
 *     this.types('text/html');
 *     // => "text/html"
 *     this.types('json', 'text');
 *     // => "json"
 *     this.types('application/json');
 *     // => "application/json"
 *
 *     // Accept: text/*, application/json
 *     this.types('image/png');
 *     this.types('png');
 *     // => undefined
 *
 *     // Accept: text/*;q=.5, application/json
 *     this.types(['html', 'json']);
 *     this.types('html', 'json');
 *     // => "json"
 *
 * @param {String|Array} types...
 * @return {String|Array|Boolean}
 * @public
 */

Accepts.prototype.type =
Accepts.prototype.types = function (types_) {
  var types = types_;

  // support flattened arguments
  if (types && !Array.isArray(types)) {
    types = new Array(arguments.length);
    for (var i = 0; i < types.length; i++) {
      types[i] = arguments[i];
    }
  }

  // no types, return all requested types
  if (!types || types.length === 0) {
    return this.negotiator.mediaTypes()
  }

  // no accept header, return first given type
  if (!this.headers.accept) {
    return types[0]
  }

  var mimes = types.map(extToMime);
  var accepts = this.negotiator.mediaTypes(mimes.filter(validMime));
  var first = accepts[0];

  return first
    ? types[mimes.indexOf(first)]
    : false
};

/**
 * Return accepted encodings or best fit based on `encodings`.
 *
 * Given `Accept-Encoding: gzip, deflate`
 * an array sorted by quality is returned:
 *
 *     ['gzip', 'deflate']
 *
 * @param {String|Array} encodings...
 * @return {String|Array}
 * @public
 */

Accepts.prototype.encoding =
Accepts.prototype.encodings = function (encodings_) {
  var encodings = encodings_;

  // support flattened arguments
  if (encodings && !Array.isArray(encodings)) {
    encodings = new Array(arguments.length);
    for (var i = 0; i < encodings.length; i++) {
      encodings[i] = arguments[i];
    }
  }

  // no encodings, return all requested encodings
  if (!encodings || encodings.length === 0) {
    return this.negotiator.encodings()
  }

  return this.negotiator.encodings(encodings)[0] || false
};

/**
 * Return accepted charsets or best fit based on `charsets`.
 *
 * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
 * an array sorted by quality is returned:
 *
 *     ['utf-8', 'utf-7', 'iso-8859-1']
 *
 * @param {String|Array} charsets...
 * @return {String|Array}
 * @public
 */

Accepts.prototype.charset =
Accepts.prototype.charsets = function (charsets_) {
  var charsets = charsets_;

  // support flattened arguments
  if (charsets && !Array.isArray(charsets)) {
    charsets = new Array(arguments.length);
    for (var i = 0; i < charsets.length; i++) {
      charsets[i] = arguments[i];
    }
  }

  // no charsets, return all requested charsets
  if (!charsets || charsets.length === 0) {
    return this.negotiator.charsets()
  }

  return this.negotiator.charsets(charsets)[0] || false
};

/**
 * Return accepted languages or best fit based on `langs`.
 *
 * Given `Accept-Language: en;q=0.8, es, pt`
 * an array sorted by quality is returned:
 *
 *     ['es', 'pt', 'en']
 *
 * @param {String|Array} langs...
 * @return {Array|String}
 * @public
 */

Accepts.prototype.lang =
Accepts.prototype.langs =
Accepts.prototype.language =
Accepts.prototype.languages = function (languages_) {
  var languages = languages_;

  // support flattened arguments
  if (languages && !Array.isArray(languages)) {
    languages = new Array(arguments.length);
    for (var i = 0; i < languages.length; i++) {
      languages[i] = arguments[i];
    }
  }

  // no languages, return all requested languages
  if (!languages || languages.length === 0) {
    return this.negotiator.languages()
  }

  return this.negotiator.languages(languages)[0] || false
};

/**
 * Convert extnames to mime.
 *
 * @param {String} type
 * @return {String}
 * @private
 */

function extToMime (type) {
  return type.indexOf('/') === -1
    ? mime.lookup(type)
    : type
}

/**
 * Check if mime is valid.
 *
 * @param {String} type
 * @return {String}
 * @private
 */

function validMime (type) {
  return typeof type === 'string'
}

Object.defineProperty(polling$2, "__esModule", { value: true });
polling$2.Polling = void 0;
const transport_1$4 = transport;
const zlib_1$1 = require$$2$3;
const accepts$1 = accepts$2;
const debug_1$a = require$$13;
const debug$d = (0, debug_1$a.default)("engine:polling");
const compressionMethods$1 = {
    gzip: zlib_1$1.createGzip,
    deflate: zlib_1$1.createDeflate,
};
let Polling$1 = class Polling extends transport_1$4.Transport {
    /**
     * HTTP polling constructor.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     */
    get name() {
        return "polling";
    }
    /**
     * Overrides onRequest.
     *
     * @param {EngineRequest} req
     * @package
     */
    onRequest(req) {
        const res = req.res;
        // remove the reference to the ServerResponse object (as the first request of the session is kept in memory by default)
        req.res = null;
        if ("GET" === req.method) {
            this.onPollRequest(req, res);
        }
        else if ("POST" === req.method) {
            this.onDataRequest(req, res);
        }
        else {
            res.writeHead(500);
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug$d("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeHead(400);
            res.end();
            return;
        }
        debug$d("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            req.removeListener("close", onClose);
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        req.on("close", onClose);
        this.writable = true;
        this.emit("ready");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug$d("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeHead(400);
            res.end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let chunks = isBinary ? Buffer.concat([]) : "";
        const cleanup = () => {
            req.removeListener("data", onData);
            req.removeListener("end", onEnd);
            req.removeListener("close", onClose);
            this.dataReq = this.dataRes = chunks = null;
        };
        const onClose = () => {
            cleanup();
            this.onError("data request connection closed prematurely");
        };
        const onData = (data) => {
            let contentLength;
            if (isBinary) {
                chunks = Buffer.concat([chunks, data]);
                contentLength = chunks.length;
            }
            else {
                chunks += data;
                contentLength = Buffer.byteLength(chunks);
            }
            if (contentLength > this.maxHttpBufferSize) {
                res.writeHead(413).end();
                cleanup();
            }
        };
        const onEnd = () => {
            this.onData(chunks);
            const headers = {
                // text/html is required instead of text/plain to avoid an
                // unwanted download dialog on certain user-agents (GH-43)
                "Content-Type": "text/html",
                "Content-Length": "2",
            };
            res.writeHead(200, this.headers(req, headers));
            res.end("ok");
            cleanup();
        };
        req.on("close", onClose);
        if (!isBinary)
            req.setEncoding("utf8");
        req.on("data", onData);
        req.on("end", onEnd);
    }
    /**
     * Processes the incoming data payload.
     *
     * @param data - encoded payload
     * @protected
     */
    onData(data) {
        debug$d('received "%s"', data);
        const callback = (packet) => {
            if ("close" === packet.type) {
                debug$d("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug$d("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = (data) => {
            const compress = packets.some((packet) => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @private
     */
    write(data, options) {
        debug$d('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
            this.emit("drain");
        });
    }
    /**
     * Performs the write.
     *
     * @protected
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType,
        };
        const respond = (data) => {
            headers["Content-Length"] =
                "string" === typeof data ? Buffer.byteLength(data) : data.length;
            this.res.writeHead(200, this.headers(this.req, headers));
            this.res.end(data);
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts$1(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeHead(500);
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @private
     */
    compress(data, encoding, callback) {
        debug$d("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods$1[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @private
     */
    doClose(fn) {
        debug$d("closing");
        let closeTimeoutTimer;
        if (this.dataReq) {
            debug$d("aborting ongoing data request");
            this.dataReq.destroy();
        }
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug$d("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug$d("transport discarded - closing right away");
            onClose();
        }
        else {
            debug$d("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param {http.IncomingMessage} req
     * @param {Object} headers - extra headers
     * @private
     */
    headers(req, headers = {}) {
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        headers["cache-control"] = "no-store";
        this.emit("headers", headers, req);
        return headers;
    }
};
polling$2.Polling = Polling$1;

var pollingJsonp = {};

Object.defineProperty(pollingJsonp, "__esModule", { value: true });
pollingJsonp.JSONP = void 0;
const polling_1$2 = polling$2;
const qs$1 = require$$0$1;
const rDoubleSlashes = /\\\\n/g;
const rSlashes = /(\\)?\\n/g;
class JSONP extends polling_1$2.Polling {
    /**
     * JSON-P polling transport.
     */
    constructor(req) {
        super(req);
        this.head = "___eio[" + (req._query.j || "").replace(/[^0-9]/g, "") + "](";
        this.foot = ");";
    }
    onData(data) {
        // we leverage the qs module so that we get built-in DoS protection
        // and the fast alternative to decodeURIComponent
        data = qs$1.parse(data).d;
        if ("string" === typeof data) {
            // client will send already escaped newlines as \\\\n and newlines as \\n
            // \\n must be replaced with \n and \\\\n with \\n
            data = data.replace(rSlashes, function (match, slashes) {
                return slashes ? match : "\n";
            });
            super.onData(data.replace(rDoubleSlashes, "\\n"));
        }
    }
    doWrite(data, options, callback) {
        // we must output valid javascript, not valid json
        // see: http://timelessrepo.com/json-isnt-a-javascript-subset
        const js = JSON.stringify(data)
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029");
        // prepare response
        data = this.head + js + this.foot;
        super.doWrite(data, options, callback);
    }
}
pollingJsonp.JSONP = JSONP;

var websocket$1 = {};

Object.defineProperty(websocket$1, "__esModule", { value: true });
websocket$1.WebSocket = void 0;
const transport_1$3 = transport;
const debug_1$9 = require$$13;
const debug$c = (0, debug_1$9.default)("engine:ws");
let WebSocket$2 = class WebSocket extends transport_1$3.Transport {
    /**
     * WebSocket transport
     *
     * @param {EngineRequest} req
     */
    constructor(req) {
        super(req);
        this._doSend = (data) => {
            this.socket.send(data, this._onSent);
        };
        this._doSendLast = (data) => {
            this.socket.send(data, this._onSentLast);
        };
        this._onSent = (err) => {
            if (err) {
                this.onError("write error", err.stack);
            }
        };
        this._onSentLast = (err) => {
            if (err) {
                this.onError("write error", err.stack);
            }
            else {
                this.emit("drain");
                this.writable = true;
                this.emit("ready");
            }
        };
        this.socket = req.websocket;
        this.socket.on("message", (data, isBinary) => {
            const message = isBinary ? data : data.toString();
            debug$c('received "%s"', message);
            super.onData(message);
        });
        this.socket.once("close", this.onClose.bind(this));
        this.socket.on("error", this.onError.bind(this));
        this.writable = true;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     */
    get handlesUpgrades() {
        return true;
    }
    send(packets) {
        this.writable = false;
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const isLast = i + 1 === packets.length;
            if (this._canSendPreEncodedFrame(packet)) {
                // the WebSocket frame was computed with WebSocket.Sender.frame()
                // see https://github.com/websockets/ws/issues/617#issuecomment-283002469
                this.socket._sender.sendFrame(
                // @ts-ignore
                packet.options.wsPreEncodedFrame, isLast ? this._onSentLast : this._onSent);
            }
            else {
                this.parser.encodePacket(packet, this.supportsBinary, isLast ? this._doSendLast : this._doSend);
            }
        }
    }
    /**
     * Whether the encoding of the WebSocket frame can be skipped.
     * @param packet
     * @private
     */
    _canSendPreEncodedFrame(packet) {
        var _a, _b, _c;
        return (!this.perMessageDeflate &&
            typeof ((_b = (_a = this.socket) === null || _a === void 0 ? void 0 : _a._sender) === null || _b === void 0 ? void 0 : _b.sendFrame) === "function" &&
            // @ts-ignore
            ((_c = packet.options) === null || _c === void 0 ? void 0 : _c.wsPreEncodedFrame) !== undefined);
    }
    doClose(fn) {
        debug$c("closing");
        this.socket.close();
        fn && fn();
    }
};
websocket$1.WebSocket = WebSocket$2;

var webtransport = {};

Object.defineProperty(webtransport, "__esModule", { value: true });
webtransport.WebTransport = void 0;
const transport_1$2 = transport;
const debug_1$8 = require$$13;
const engine_io_parser_1$1 = esm;
const debug$b = (0, debug_1$8.default)("engine:webtransport");
/**
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API
 */
class WebTransport extends transport_1$2.Transport {
    constructor(session, stream, reader) {
        super({ _query: { EIO: "4" } });
        this.session = session;
        const transformStream = (0, engine_io_parser_1$1.createPacketEncoderStream)();
        transformStream.readable.pipeTo(stream.writable).catch(() => {
            debug$b("the stream was closed");
        });
        this.writer = transformStream.writable.getWriter();
        (async () => {
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        debug$b("session is closed");
                        break;
                    }
                    debug$b("received chunk: %o", value);
                    this.onPacket(value);
                }
            }
            catch (e) {
                debug$b("error while reading: %s", e.message);
            }
        })();
        session.closed.then(() => this.onClose());
        this.writable = true;
    }
    get name() {
        return "webtransport";
    }
    async send(packets) {
        this.writable = false;
        try {
            for (let i = 0; i < packets.length; i++) {
                const packet = packets[i];
                await this.writer.write(packet);
            }
        }
        catch (e) {
            debug$b("error while writing: %s", e.message);
        }
        this.emit("drain");
        this.writable = true;
        this.emit("ready");
    }
    doClose(fn) {
        debug$b("closing WebTransport session");
        this.session.close();
        fn && fn();
    }
}
webtransport.WebTransport = WebTransport;

Object.defineProperty(transports, "__esModule", { value: true });
const polling_1$1 = polling$2;
const polling_jsonp_1 = pollingJsonp;
const websocket_1$1 = websocket$1;
const webtransport_1$1 = webtransport;
transports.default = {
    polling: polling$1,
    websocket: websocket_1$1.WebSocket,
    webtransport: webtransport_1$1.WebTransport,
};
/**
 * Polling polymorphic constructor.
 */
function polling$1(req) {
    if ("string" === typeof req._query.j) {
        return new polling_jsonp_1.JSONP(req);
    }
    else {
        return new polling_1$1.Polling(req);
    }
}
polling$1.upgradesTo = ["websocket", "webtransport"];

var socket$1 = {};

const require$$2$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(timers);

Object.defineProperty(socket$1, "__esModule", { value: true });
socket$1.Socket = void 0;
const events_1$3 = require$$8;
const debug_1$7 = require$$13;
const timers_1 = require$$2$2;
const debug$a = (0, debug_1$7.default)("engine:socket");
let Socket$2 = class Socket extends events_1$3.EventEmitter {
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug$a("readyState updated from %s to %s", this._readyState, state);
        this._readyState = state;
    }
    constructor(id, server, transport, req, protocol) {
        super();
        /**
         * The current state of the socket.
         */
        this._readyState = "opening";
        /* private */ this.upgrading = false;
        /* private */ this.upgraded = false;
        this.writeBuffer = [];
        this.packetsFn = [];
        this.sentCallbackFn = [];
        this.cleanupFn = [];
        this.id = id;
        this.server = server;
        this.request = req;
        this.protocol = protocol;
        // Cache IP since it might not be in the req later
        if (req) {
            if (req.websocket && req.websocket._socket) {
                this.remoteAddress = req.websocket._socket.remoteAddress;
            }
            else {
                this.remoteAddress = req.connection.remoteAddress;
            }
        }
        this.pingTimeoutTimer = null;
        this.pingIntervalTimer = null;
        this.setTransport(transport);
        this.onOpen();
    }
    /**
     * Called upon transport considered open.
     *
     * @private
     */
    onOpen() {
        this.readyState = "open";
        // sends an `open` packet
        this.transport.sid = this.id;
        this.sendPacket("open", JSON.stringify({
            sid: this.id,
            upgrades: this.getAvailableUpgrades(),
            pingInterval: this.server.opts.pingInterval,
            pingTimeout: this.server.opts.pingTimeout,
            maxPayload: this.server.opts.maxHttpBufferSize,
        }));
        if (this.server.opts.initialPacket) {
            this.sendPacket("message", this.server.opts.initialPacket);
        }
        this.emit("open");
        if (this.protocol === 3) {
            // in protocol v3, the client sends a ping, and the server answers with a pong
            this.resetPingTimeout();
        }
        else {
            // in protocol v4, the server sends a ping, and the client answers with a pong
            this.schedulePing();
        }
    }
    /**
     * Called upon transport packet.
     *
     * @param {Object} packet
     * @private
     */
    onPacket(packet) {
        if ("open" !== this.readyState) {
            return debug$a("packet received with closed socket");
        }
        // export packet event
        debug$a(`received packet ${packet.type}`);
        this.emit("packet", packet);
        switch (packet.type) {
            case "ping":
                if (this.transport.protocol !== 3) {
                    this.onError(new Error("invalid heartbeat direction"));
                    return;
                }
                debug$a("got ping");
                this.pingTimeoutTimer.refresh();
                this.sendPacket("pong");
                this.emit("heartbeat");
                break;
            case "pong":
                if (this.transport.protocol === 3) {
                    this.onError(new Error("invalid heartbeat direction"));
                    return;
                }
                debug$a("got pong");
                (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
                this.pingIntervalTimer.refresh();
                this.emit("heartbeat");
                break;
            case "error":
                this.onClose("parse error");
                break;
            case "message":
                this.emit("data", packet.data);
                this.emit("message", packet.data);
                break;
        }
    }
    /**
     * Called upon transport error.
     *
     * @param {Error} err - error object
     * @private
     */
    onError(err) {
        debug$a("transport error");
        this.onClose("transport error", err);
    }
    /**
     * Pings client every `this.pingInterval` and expects response
     * within `this.pingTimeout` or closes connection.
     *
     * @private
     */
    schedulePing() {
        this.pingIntervalTimer = (0, timers_1.setTimeout)(() => {
            debug$a("writing ping packet - expecting pong within %sms", this.server.opts.pingTimeout);
            this.sendPacket("ping");
            this.resetPingTimeout();
        }, this.server.opts.pingInterval);
    }
    /**
     * Resets ping timeout.
     *
     * @private
     */
    resetPingTimeout() {
        (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
        this.pingTimeoutTimer = (0, timers_1.setTimeout)(() => {
            if (this.readyState === "closed")
                return;
            this.onClose("ping timeout");
        }, this.protocol === 3
            ? this.server.opts.pingInterval + this.server.opts.pingTimeout
            : this.server.opts.pingTimeout);
    }
    /**
     * Attaches handlers for the given transport.
     *
     * @param {Transport} transport
     * @private
     */
    setTransport(transport) {
        const onError = this.onError.bind(this);
        const onReady = () => this.flush();
        const onPacket = this.onPacket.bind(this);
        const onDrain = this.onDrain.bind(this);
        const onClose = this.onClose.bind(this, "transport close");
        this.transport = transport;
        this.transport.once("error", onError);
        this.transport.on("ready", onReady);
        this.transport.on("packet", onPacket);
        this.transport.on("drain", onDrain);
        this.transport.once("close", onClose);
        this.cleanupFn.push(function () {
            transport.removeListener("error", onError);
            transport.removeListener("ready", onReady);
            transport.removeListener("packet", onPacket);
            transport.removeListener("drain", onDrain);
            transport.removeListener("close", onClose);
        });
    }
    /**
     * Upon transport "drain" event
     *
     * @private
     */
    onDrain() {
        if (this.sentCallbackFn.length > 0) {
            debug$a("executing batch send callback");
            const seqFn = this.sentCallbackFn.shift();
            if (seqFn) {
                for (let i = 0; i < seqFn.length; i++) {
                    seqFn[i](this.transport);
                }
            }
        }
    }
    /**
     * Upgrades socket to the given transport
     *
     * @param {Transport} transport
     * @private
     */
    /* private */ _maybeUpgrade(transport) {
        debug$a('might upgrade socket transport from "%s" to "%s"', this.transport.name, transport.name);
        this.upgrading = true;
        // set transport upgrade timer
        const upgradeTimeoutTimer = (0, timers_1.setTimeout)(() => {
            debug$a("client did not complete upgrade - closing transport");
            cleanup();
            if ("open" === transport.readyState) {
                transport.close();
            }
        }, this.server.opts.upgradeTimeout);
        let checkIntervalTimer;
        const onPacket = (packet) => {
            if ("ping" === packet.type && "probe" === packet.data) {
                debug$a("got probe ping packet, sending pong");
                transport.send([{ type: "pong", data: "probe" }]);
                this.emit("upgrading", transport);
                clearInterval(checkIntervalTimer);
                checkIntervalTimer = setInterval(check, 100);
            }
            else if ("upgrade" === packet.type && this.readyState !== "closed") {
                debug$a("got upgrade packet - upgrading");
                cleanup();
                this.transport.discard();
                this.upgraded = true;
                this.clearTransport();
                this.setTransport(transport);
                this.emit("upgrade", transport);
                this.flush();
                if (this.readyState === "closing") {
                    transport.close(() => {
                        this.onClose("forced close");
                    });
                }
            }
            else {
                cleanup();
                transport.close();
            }
        };
        // we force a polling cycle to ensure a fast upgrade
        const check = () => {
            if ("polling" === this.transport.name && this.transport.writable) {
                debug$a("writing a noop packet to polling for fast upgrade");
                this.transport.send([{ type: "noop" }]);
            }
        };
        const cleanup = () => {
            this.upgrading = false;
            clearInterval(checkIntervalTimer);
            (0, timers_1.clearTimeout)(upgradeTimeoutTimer);
            transport.removeListener("packet", onPacket);
            transport.removeListener("close", onTransportClose);
            transport.removeListener("error", onError);
            this.removeListener("close", onClose);
        };
        const onError = (err) => {
            debug$a("client did not complete upgrade - %s", err);
            cleanup();
            transport.close();
            transport = null;
        };
        const onTransportClose = () => {
            onError("transport closed");
        };
        const onClose = () => {
            onError("socket closed");
        };
        transport.on("packet", onPacket);
        transport.once("close", onTransportClose);
        transport.once("error", onError);
        this.once("close", onClose);
    }
    /**
     * Clears listeners and timers associated with current transport.
     *
     * @private
     */
    clearTransport() {
        let cleanup;
        const toCleanUp = this.cleanupFn.length;
        for (let i = 0; i < toCleanUp; i++) {
            cleanup = this.cleanupFn.shift();
            cleanup();
        }
        // silence further transport errors and prevent uncaught exceptions
        this.transport.on("error", function () {
            debug$a("error triggered by discarded transport");
        });
        // ensure transport won't stay open
        this.transport.close();
        (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
    }
    /**
     * Called upon transport considered closed.
     * Possible reasons: `ping timeout`, `client error`, `parse error`,
     * `transport error`, `server close`, `transport close`
     */
    onClose(reason, description) {
        if ("closed" !== this.readyState) {
            this.readyState = "closed";
            // clear timers
            (0, timers_1.clearTimeout)(this.pingIntervalTimer);
            (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
            // clean writeBuffer in next tick, so developers can still
            // grab the writeBuffer on 'close' event
            process.nextTick(() => {
                this.writeBuffer = [];
            });
            this.packetsFn = [];
            this.sentCallbackFn = [];
            this.clearTransport();
            this.emit("close", reason, description);
        }
    }
    /**
     * Sends a message packet.
     *
     * @param {Object} data
     * @param {Object} options
     * @param {Function} callback
     * @return {Socket} for chaining
     */
    send(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    /**
     * Alias of {@link send}.
     *
     * @param data
     * @param options
     * @param callback
     */
    write(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} type - packet type
     * @param {String} data
     * @param {Object} options
     * @param {Function} callback
     *
     * @private
     */
    sendPacket(type, data, options = {}, callback) {
        if ("function" === typeof options) {
            callback = options;
            options = {};
        }
        if ("closing" !== this.readyState && "closed" !== this.readyState) {
            debug$a('sending packet "%s" (%s)', type, data);
            // compression is enabled by default
            options.compress = options.compress !== false;
            const packet = {
                type,
                options: options,
            };
            if (data)
                packet.data = data;
            // exports packetCreate event
            this.emit("packetCreate", packet);
            this.writeBuffer.push(packet);
            // add send callback to object, if defined
            if ("function" === typeof callback)
                this.packetsFn.push(callback);
            this.flush();
        }
    }
    /**
     * Attempts to flush the packets buffer.
     *
     * @private
     */
    flush() {
        if ("closed" !== this.readyState &&
            this.transport.writable &&
            this.writeBuffer.length) {
            debug$a("flushing buffer to transport");
            this.emit("flush", this.writeBuffer);
            this.server.emit("flush", this, this.writeBuffer);
            const wbuf = this.writeBuffer;
            this.writeBuffer = [];
            if (this.packetsFn.length) {
                this.sentCallbackFn.push(this.packetsFn);
                this.packetsFn = [];
            }
            else {
                this.sentCallbackFn.push(null);
            }
            this.transport.send(wbuf);
            this.emit("drain");
            this.server.emit("drain", this);
        }
    }
    /**
     * Get available upgrades for this socket.
     *
     * @private
     */
    getAvailableUpgrades() {
        const availableUpgrades = [];
        const allUpgrades = this.server.upgrades(this.transport.name);
        for (let i = 0; i < allUpgrades.length; ++i) {
            const upg = allUpgrades[i];
            if (this.server.opts.transports.indexOf(upg) !== -1) {
                availableUpgrades.push(upg);
            }
        }
        return availableUpgrades;
    }
    /**
     * Closes the socket and underlying transport.
     *
     * @param {Boolean} discard - optional, discard the transport
     * @return {Socket} for chaining
     */
    close(discard) {
        if (discard &&
            (this.readyState === "open" || this.readyState === "closing")) {
            return this.closeTransport(discard);
        }
        if ("open" !== this.readyState)
            return;
        this.readyState = "closing";
        if (this.writeBuffer.length) {
            debug$a("there are %d remaining packets in the buffer, waiting for the 'drain' event", this.writeBuffer.length);
            this.once("drain", () => {
                debug$a("all packets have been sent, closing the transport");
                this.closeTransport(discard);
            });
            return;
        }
        debug$a("the buffer is empty, closing the transport right away");
        this.closeTransport(discard);
    }
    /**
     * Closes the underlying transport.
     *
     * @param {Boolean} discard
     * @private
     */
    closeTransport(discard) {
        debug$a("closing the transport (discard? %s)", !!discard);
        if (discard)
            this.transport.discard();
        this.transport.close(this.onClose.bind(this, "forced close"));
    }
};
socket$1.Socket = Socket$2;

const require$$7 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(cookie);

const require$$2$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(ws);

const require$$17 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(cors);

Object.defineProperty(server$1, "__esModule", { value: true });
server$1.Server = server$1.BaseServer = void 0;
const qs = require$$0$1;
const url_1 = require$$2$4;
const base64id = require$$3;
const transports_1 = transports;
const events_1$2 = require$$8;
const socket_1 = socket$1;
const debug_1$6 = require$$13;
const cookie_1 = require$$7;
const ws_1 = require$$2$1;
const webtransport_1 = webtransport;
const engine_io_parser_1 = esm;
const debug$9 = (0, debug_1$6.default)("engine");
const kResponseHeaders = Symbol("responseHeaders");
function parseSessionId(data) {
    try {
        const parsed = JSON.parse(data);
        if (typeof parsed.sid === "string") {
            return parsed.sid;
        }
    }
    catch (e) { }
}
class BaseServer extends events_1$2.EventEmitter {
    /**
     * Server constructor.
     *
     * @param {Object} opts - options
     */
    constructor(opts = {}) {
        super();
        this.middlewares = [];
        this.clients = {};
        this.clientsCount = 0;
        this.opts = Object.assign({
            wsEngine: ws_1.Server,
            pingTimeout: 20000,
            pingInterval: 25000,
            upgradeTimeout: 10000,
            maxHttpBufferSize: 1e6,
            transports: ["polling", "websocket"], // WebTransport is disabled by default
            allowUpgrades: true,
            httpCompression: {
                threshold: 1024,
            },
            cors: false,
            allowEIO3: false,
        }, opts);
        if (opts.cookie) {
            this.opts.cookie = Object.assign({
                name: "io",
                path: "/",
                // @ts-ignore
                httpOnly: opts.cookie.path !== false,
                sameSite: "lax",
            }, opts.cookie);
        }
        if (this.opts.cors) {
            this.use(require$$17(this.opts.cors));
        }
        if (opts.perMessageDeflate) {
            this.opts.perMessageDeflate = Object.assign({
                threshold: 1024,
            }, opts.perMessageDeflate);
        }
        this.init();
    }
    /**
     * Compute the pathname of the requests that are handled by the server
     * @param options
     * @protected
     */
    _computePath(options) {
        let path = (options.path || "/engine.io").replace(/\/$/, "");
        if (options.addTrailingSlash !== false) {
            // normalize path
            path += "/";
        }
        return path;
    }
    /**
     * Returns a list of available transports for upgrade given a certain transport.
     *
     * @return {Array}
     */
    upgrades(transport) {
        if (!this.opts.allowUpgrades)
            return [];
        return transports_1.default[transport].upgradesTo || [];
    }
    /**
     * Verifies a request.
     *
     * @param {EngineRequest} req
     * @param upgrade - whether it's an upgrade request
     * @param fn
     * @protected
     */
    verify(req, upgrade, fn) {
        // transport check
        const transport = req._query.transport;
        // WebTransport does not go through the verify() method, see the onWebTransportSession() method
        if (!~this.opts.transports.indexOf(transport) ||
            transport === "webtransport") {
            debug$9('unknown transport "%s"', transport);
            return fn(Server$1.errors.UNKNOWN_TRANSPORT, { transport });
        }
        // 'Origin' header check
        const isOriginInvalid = checkInvalidHeaderChar(req.headers.origin);
        if (isOriginInvalid) {
            const origin = req.headers.origin;
            req.headers.origin = null;
            debug$9("origin header invalid");
            return fn(Server$1.errors.BAD_REQUEST, {
                name: "INVALID_ORIGIN",
                origin,
            });
        }
        // sid check
        const sid = req._query.sid;
        if (sid) {
            if (!this.clients.hasOwnProperty(sid)) {
                debug$9('unknown sid "%s"', sid);
                return fn(Server$1.errors.UNKNOWN_SID, {
                    sid,
                });
            }
            const previousTransport = this.clients[sid].transport.name;
            if (!upgrade && previousTransport !== transport) {
                debug$9("bad request: unexpected transport without upgrade");
                return fn(Server$1.errors.BAD_REQUEST, {
                    name: "TRANSPORT_MISMATCH",
                    transport,
                    previousTransport,
                });
            }
        }
        else {
            // handshake is GET only
            if ("GET" !== req.method) {
                return fn(Server$1.errors.BAD_HANDSHAKE_METHOD, {
                    method: req.method,
                });
            }
            if (transport === "websocket" && !upgrade) {
                debug$9("invalid transport upgrade");
                return fn(Server$1.errors.BAD_REQUEST, {
                    name: "TRANSPORT_HANDSHAKE_ERROR",
                });
            }
            if (!this.opts.allowRequest)
                return fn();
            return this.opts.allowRequest(req, (message, success) => {
                if (!success) {
                    return fn(Server$1.errors.FORBIDDEN, {
                        message,
                    });
                }
                fn();
            });
        }
        fn();
    }
    /**
     * Adds a new middleware.
     *
     * @example
     * import helmet from "helmet";
     *
     * engine.use(helmet());
     *
     * @param fn
     */
    use(fn) {
        this.middlewares.push(fn);
    }
    /**
     * Apply the middlewares to the request.
     *
     * @param req
     * @param res
     * @param callback
     * @protected
     */
    _applyMiddlewares(req, res, callback) {
        if (this.middlewares.length === 0) {
            debug$9("no middleware to apply, skipping");
            return callback();
        }
        const apply = (i) => {
            debug$9("applying middleware n°%d", i + 1);
            this.middlewares[i](req, res, (err) => {
                if (err) {
                    return callback(err);
                }
                if (i + 1 < this.middlewares.length) {
                    apply(i + 1);
                }
                else {
                    callback();
                }
            });
        };
        apply(0);
    }
    /**
     * Closes all clients.
     */
    close() {
        debug$9("closing all open clients");
        for (let i in this.clients) {
            if (this.clients.hasOwnProperty(i)) {
                this.clients[i].close(true);
            }
        }
        this.cleanup();
        return this;
    }
    /**
     * generate a socket id.
     * Overwrite this method to generate your custom socket id
     *
     * @param {IncomingMessage} req - the request object
     */
    generateId(req) {
        return base64id.generateId();
    }
    /**
     * Handshakes a new client.
     *
     * @param {String} transportName
     * @param {Object} req - the request object
     * @param {Function} closeConnection
     *
     * @protected
     */
    async handshake(transportName, req, closeConnection) {
        const protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        if (protocol === 3 && !this.opts.allowEIO3) {
            debug$9("unsupported protocol version");
            this.emit("connection_error", {
                req,
                code: Server$1.errors.UNSUPPORTED_PROTOCOL_VERSION,
                message: Server$1.errorMessages[Server$1.errors.UNSUPPORTED_PROTOCOL_VERSION],
                context: {
                    protocol,
                },
            });
            closeConnection(Server$1.errors.UNSUPPORTED_PROTOCOL_VERSION);
            return;
        }
        let id;
        try {
            id = await this.generateId(req);
        }
        catch (e) {
            debug$9("error while generating an id");
            this.emit("connection_error", {
                req,
                code: Server$1.errors.BAD_REQUEST,
                message: Server$1.errorMessages[Server$1.errors.BAD_REQUEST],
                context: {
                    name: "ID_GENERATION_ERROR",
                    error: e,
                },
            });
            closeConnection(Server$1.errors.BAD_REQUEST);
            return;
        }
        debug$9('handshaking client "%s"', id);
        try {
            var transport = this.createTransport(transportName, req);
            if ("polling" === transportName) {
                transport.maxHttpBufferSize = this.opts.maxHttpBufferSize;
                transport.httpCompression = this.opts.httpCompression;
            }
            else if ("websocket" === transportName) {
                transport.perMessageDeflate = this.opts.perMessageDeflate;
            }
        }
        catch (e) {
            debug$9('error handshaking to transport "%s"', transportName);
            this.emit("connection_error", {
                req,
                code: Server$1.errors.BAD_REQUEST,
                message: Server$1.errorMessages[Server$1.errors.BAD_REQUEST],
                context: {
                    name: "TRANSPORT_HANDSHAKE_ERROR",
                    error: e,
                },
            });
            closeConnection(Server$1.errors.BAD_REQUEST);
            return;
        }
        const socket = new socket_1.Socket(id, this, transport, req, protocol);
        transport.on("headers", (headers, req) => {
            const isInitialRequest = !req._query.sid;
            if (isInitialRequest) {
                if (this.opts.cookie) {
                    headers["Set-Cookie"] = [
                        // @ts-ignore
                        (0, cookie_1.serialize)(this.opts.cookie.name, id, this.opts.cookie),
                    ];
                }
                this.emit("initial_headers", headers, req);
            }
            this.emit("headers", headers, req);
        });
        transport.onRequest(req);
        this.clients[id] = socket;
        this.clientsCount++;
        socket.once("close", () => {
            delete this.clients[id];
            this.clientsCount--;
        });
        this.emit("connection", socket);
        return transport;
    }
    async onWebTransportSession(session) {
        const timeout = setTimeout(() => {
            debug$9("the client failed to establish a bidirectional stream in the given period");
            session.close();
        }, this.opts.upgradeTimeout);
        const streamReader = session.incomingBidirectionalStreams.getReader();
        const result = await streamReader.read();
        if (result.done) {
            debug$9("session is closed");
            return;
        }
        const stream = result.value;
        const transformStream = (0, engine_io_parser_1.createPacketDecoderStream)(this.opts.maxHttpBufferSize, "nodebuffer");
        const reader = stream.readable.pipeThrough(transformStream).getReader();
        // reading the first packet of the stream
        const { value, done } = await reader.read();
        if (done) {
            debug$9("stream is closed");
            return;
        }
        clearTimeout(timeout);
        if (value.type !== "open") {
            debug$9("invalid WebTransport handshake");
            return session.close();
        }
        if (value.data === undefined) {
            const transport = new webtransport_1.WebTransport(session, stream, reader);
            // note: we cannot use "this.generateId()", because there is no "req" argument
            const id = base64id.generateId();
            debug$9('handshaking client "%s" (WebTransport)', id);
            const socket = new socket_1.Socket(id, this, transport, null, 4);
            this.clients[id] = socket;
            this.clientsCount++;
            socket.once("close", () => {
                delete this.clients[id];
                this.clientsCount--;
            });
            this.emit("connection", socket);
            return;
        }
        const sid = parseSessionId(value.data);
        if (!sid) {
            debug$9("invalid WebTransport handshake");
            return session.close();
        }
        const client = this.clients[sid];
        if (!client) {
            debug$9("upgrade attempt for closed client");
            session.close();
        }
        else if (client.upgrading) {
            debug$9("transport has already been trying to upgrade");
            session.close();
        }
        else if (client.upgraded) {
            debug$9("transport had already been upgraded");
            session.close();
        }
        else {
            debug$9("upgrading existing transport");
            const transport = new webtransport_1.WebTransport(session, stream, reader);
            client._maybeUpgrade(transport);
        }
    }
}
server$1.BaseServer = BaseServer;
/**
 * Protocol errors mappings.
 */
BaseServer.errors = {
    UNKNOWN_TRANSPORT: 0,
    UNKNOWN_SID: 1,
    BAD_HANDSHAKE_METHOD: 2,
    BAD_REQUEST: 3,
    FORBIDDEN: 4,
    UNSUPPORTED_PROTOCOL_VERSION: 5,
};
BaseServer.errorMessages = {
    0: "Transport unknown",
    1: "Session ID unknown",
    2: "Bad handshake method",
    3: "Bad request",
    4: "Forbidden",
    5: "Unsupported protocol version",
};
/**
 * Exposes a subset of the http.ServerResponse interface, in order to be able to apply the middlewares to an upgrade
 * request.
 *
 * @see https://nodejs.org/api/http.html#class-httpserverresponse
 */
class WebSocketResponse {
    constructor(req, socket) {
        this.req = req;
        this.socket = socket;
        // temporarily store the response headers on the req object (see the "headers" event)
        req[kResponseHeaders] = {};
    }
    setHeader(name, value) {
        this.req[kResponseHeaders][name] = value;
    }
    getHeader(name) {
        return this.req[kResponseHeaders][name];
    }
    removeHeader(name) {
        delete this.req[kResponseHeaders][name];
    }
    write() { }
    writeHead() { }
    end() {
        // we could return a proper error code, but the WebSocket client will emit an "error" event anyway.
        this.socket.destroy();
    }
}
/**
 * An Engine.IO server based on Node.js built-in HTTP server and the `ws` package for WebSocket connections.
 */
let Server$1 = class Server extends BaseServer {
    /**
     * Initialize websocket server
     *
     * @protected
     */
    init() {
        if (!~this.opts.transports.indexOf("websocket"))
            return;
        if (this.ws)
            this.ws.close();
        this.ws = new this.opts.wsEngine({
            noServer: true,
            clientTracking: false,
            perMessageDeflate: this.opts.perMessageDeflate,
            maxPayload: this.opts.maxHttpBufferSize,
        });
        if (typeof this.ws.on === "function") {
            this.ws.on("headers", (headersArray, req) => {
                // note: 'ws' uses an array of headers, while Engine.IO uses an object (response.writeHead() accepts both formats)
                // we could also try to parse the array and then sync the values, but that will be error-prone
                const additionalHeaders = req[kResponseHeaders] || {};
                delete req[kResponseHeaders];
                const isInitialRequest = !req._query.sid;
                if (isInitialRequest) {
                    this.emit("initial_headers", additionalHeaders, req);
                }
                this.emit("headers", additionalHeaders, req);
                debug$9("writing headers: %j", additionalHeaders);
                Object.keys(additionalHeaders).forEach((key) => {
                    headersArray.push(`${key}: ${additionalHeaders[key]}`);
                });
            });
        }
    }
    cleanup() {
        if (this.ws) {
            debug$9("closing webSocketServer");
            this.ws.close();
            // don't delete this.ws because it can be used again if the http server starts listening again
        }
    }
    /**
     * Prepares a request by processing the query string.
     *
     * @private
     */
    prepare(req) {
        // try to leverage pre-existing `req._query` (e.g: from connect)
        if (!req._query) {
            req._query = (~req.url.indexOf("?") ? qs.parse((0, url_1.parse)(req.url).query) : {});
        }
    }
    createTransport(transportName, req) {
        return new transports_1.default[transportName](req);
    }
    /**
     * Handles an Engine.IO HTTP request.
     *
     * @param {EngineRequest} req
     * @param {ServerResponse} res
     */
    handleRequest(req, res) {
        debug$9('handling "%s" http request "%s"', req.method, req.url);
        this.prepare(req);
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server.errorMessages[errorCode],
                    context: errorContext,
                });
                abortRequest(res, errorCode, errorContext);
                return;
            }
            if (req._query.sid) {
                debug$9("setting new request for existing client");
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => abortRequest(res, errorCode, errorContext);
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, false, callback);
            }
        });
    }
    /**
     * Handles an Engine.IO HTTP Upgrade.
     */
    handleUpgrade(req, socket, upgradeHead) {
        this.prepare(req);
        const res = new WebSocketResponse(req, socket);
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server.errorMessages[errorCode],
                    context: errorContext,
                });
                abortUpgrade(socket, errorCode, errorContext);
                return;
            }
            const head = Buffer.from(upgradeHead);
            upgradeHead = null;
            // some middlewares (like express-session) wait for the writeHead() call to flush their headers
            // see https://github.com/expressjs/session/blob/1010fadc2f071ddf2add94235d72224cf65159c6/index.js#L220-L244
            res.writeHead();
            // delegate to ws
            this.ws.handleUpgrade(req, socket, head, (websocket) => {
                this.onWebSocket(req, socket, websocket);
            });
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, true, callback);
            }
        });
    }
    /**
     * Called upon a ws.io connection.
     *
     * @param {ws.Socket} websocket
     * @private
     */
    onWebSocket(req, socket, websocket) {
        websocket.on("error", onUpgradeError);
        if (transports_1.default[req._query.transport] !== undefined &&
            !transports_1.default[req._query.transport].prototype.handlesUpgrades) {
            debug$9("transport doesnt handle upgraded requests");
            websocket.close();
            return;
        }
        // get client id
        const id = req._query.sid;
        // keep a reference to the ws.Socket
        req.websocket = websocket;
        if (id) {
            const client = this.clients[id];
            if (!client) {
                debug$9("upgrade attempt for closed client");
                websocket.close();
            }
            else if (client.upgrading) {
                debug$9("transport has already been trying to upgrade");
                websocket.close();
            }
            else if (client.upgraded) {
                debug$9("transport had already been upgraded");
                websocket.close();
            }
            else {
                debug$9("upgrading existing transport");
                // transport error handling takes over
                websocket.removeListener("error", onUpgradeError);
                const transport = this.createTransport(req._query.transport, req);
                transport.perMessageDeflate = this.opts.perMessageDeflate;
                client._maybeUpgrade(transport);
            }
        }
        else {
            const closeConnection = (errorCode, errorContext) => abortUpgrade(socket, errorCode, errorContext);
            this.handshake(req._query.transport, req, closeConnection);
        }
        function onUpgradeError() {
            debug$9("websocket error before upgrade");
            // websocket.close() not needed
        }
    }
    /**
     * Captures upgrade requests for a http.Server.
     *
     * @param {http.Server} server
     * @param {Object} options
     */
    attach(server, options = {}) {
        const path = this._computePath(options);
        const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;
        function check(req) {
            // TODO use `path === new URL(...).pathname` in the next major release (ref: https://nodejs.org/api/url.html)
            return path === req.url.slice(0, path.length);
        }
        // cache and clean up listeners
        const listeners = server.listeners("request").slice(0);
        server.removeAllListeners("request");
        server.on("close", this.close.bind(this));
        server.on("listening", this.init.bind(this));
        // add request handler
        server.on("request", (req, res) => {
            if (check(req)) {
                debug$9('intercepting request for path "%s"', path);
                this.handleRequest(req, res);
            }
            else {
                let i = 0;
                const l = listeners.length;
                for (; i < l; i++) {
                    listeners[i].call(server, req, res);
                }
            }
        });
        if (~this.opts.transports.indexOf("websocket")) {
            server.on("upgrade", (req, socket, head) => {
                if (check(req)) {
                    this.handleUpgrade(req, socket, head);
                }
                else if (false !== options.destroyUpgrade) {
                    // default node behavior is to disconnect when no handlers
                    // but by adding a handler, we prevent that
                    // and if no eio thing handles the upgrade
                    // then the socket needs to die!
                    setTimeout(function () {
                        // @ts-ignore
                        if (socket.writable && socket.bytesWritten <= 0) {
                            socket.on("error", (e) => {
                                debug$9("error while destroying upgrade: %s", e.message);
                            });
                            return socket.end();
                        }
                    }, destroyUpgradeTimeout);
                }
            });
        }
    }
};
server$1.Server = Server$1;
/**
 * Close the HTTP long-polling request
 *
 * @param res - the response object
 * @param errorCode - the error code
 * @param errorContext - additional error context
 *
 * @private
 */
function abortRequest(res, errorCode, errorContext) {
    const statusCode = errorCode === Server$1.errors.FORBIDDEN ? 403 : 400;
    const message = errorContext && errorContext.message
        ? errorContext.message
        : Server$1.errorMessages[errorCode];
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        code: errorCode,
        message,
    }));
}
/**
 * Close the WebSocket connection
 *
 * @param {net.Socket} socket
 * @param {string} errorCode - the error code
 * @param {object} errorContext - additional error context
 */
function abortUpgrade(socket, errorCode, errorContext = {}) {
    socket.on("error", () => {
        debug$9("ignoring error from closed connection");
    });
    if (socket.writable) {
        const message = errorContext.message || Server$1.errorMessages[errorCode];
        const length = Buffer.byteLength(message);
        socket.write("HTTP/1.1 400 Bad Request\r\n" +
            "Connection: close\r\n" +
            "Content-type: text/html\r\n" +
            "Content-Length: " +
            length +
            "\r\n" +
            "\r\n" +
            message);
    }
    socket.destroy();
}
/* eslint-disable */
/**
 * From https://github.com/nodejs/node/blob/v8.4.0/lib/_http_common.js#L303-L354
 *
 * True if val contains an invalid field-vchar
 *  field-value    = *( field-content / obs-fold )
 *  field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 *  field-vchar    = VCHAR / obs-text
 *
 * checkInvalidHeaderChar() is currently designed to be inlinable by v8,
 * so take care when making changes to the implementation so that the source
 * code size does not exceed v8's default max_inlined_source_size setting.
 **/
// prettier-ignore
const validHdrChars = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, // 0 - 15
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 32 - 47
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 48 - 63
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 80 - 95
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 112 - 127
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 128 ...
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 // ... 255
];
function checkInvalidHeaderChar(val) {
    val += "";
    if (val.length < 1)
        return false;
    if (!validHdrChars[val.charCodeAt(0)]) {
        debug$9('invalid header, index 0, char "%s"', val.charCodeAt(0));
        return true;
    }
    if (val.length < 2)
        return false;
    if (!validHdrChars[val.charCodeAt(1)]) {
        debug$9('invalid header, index 1, char "%s"', val.charCodeAt(1));
        return true;
    }
    if (val.length < 3)
        return false;
    if (!validHdrChars[val.charCodeAt(2)]) {
        debug$9('invalid header, index 2, char "%s"', val.charCodeAt(2));
        return true;
    }
    if (val.length < 4)
        return false;
    if (!validHdrChars[val.charCodeAt(3)]) {
        debug$9('invalid header, index 3, char "%s"', val.charCodeAt(3));
        return true;
    }
    for (let i = 4; i < val.length; ++i) {
        if (!validHdrChars[val.charCodeAt(i)]) {
            debug$9('invalid header, index "%i", char "%s"', i, val.charCodeAt(i));
            return true;
        }
    }
    return false;
}

var userver = {};

var transportsUws = {};

var polling = {};

Object.defineProperty(polling, "__esModule", { value: true });
polling.Polling = void 0;
const transport_1$1 = transport;
const zlib_1 = require$$2$3;
const accepts = accepts$2;
const debug_1$5 = require$$13;
const debug$8 = (0, debug_1$5.default)("engine:polling");
const compressionMethods = {
    gzip: zlib_1.createGzip,
    deflate: zlib_1.createDeflate,
};
class Polling extends transport_1$1.Transport {
    /**
     * HTTP polling constructor.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     */
    get name() {
        return "polling";
    }
    /**
     * Overrides onRequest.
     *
     * @param req
     *
     * @private
     */
    onRequest(req) {
        const res = req.res;
        // remove the reference to the ServerResponse object (as the first request of the session is kept in memory by default)
        req.res = null;
        if (req.getMethod() === "get") {
            this.onPollRequest(req, res);
        }
        else if (req.getMethod() === "post") {
            this.onDataRequest(req, res);
        }
        else {
            res.writeStatus("500 Internal Server Error");
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug$8("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        debug$8("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.writable = false;
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        res.onAborted(onClose);
        this.writable = true;
        this.emit("ready");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug$8("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        const expectedContentLength = Number(req.headers["content-length"]);
        if (!expectedContentLength) {
            this.onError("content-length header required");
            res.writeStatus("411 Length Required").end();
            return;
        }
        if (expectedContentLength > this.maxHttpBufferSize) {
            this.onError("payload too large");
            res.writeStatus("413 Payload Too Large").end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let buffer;
        let offset = 0;
        const headers = {
            // text/html is required instead of text/plain to avoid an
            // unwanted download dialog on certain user-agents (GH-43)
            "Content-Type": "text/html",
        };
        this.headers(req, headers);
        for (let key in headers) {
            res.writeHeader(key, String(headers[key]));
        }
        const onEnd = (buffer) => {
            this.onData(buffer.toString());
            this.onDataRequestCleanup();
            res.cork(() => {
                res.end("ok");
            });
        };
        res.onAborted(() => {
            this.onDataRequestCleanup();
            this.onError("data request connection closed prematurely");
        });
        res.onData((arrayBuffer, isLast) => {
            const totalLength = offset + arrayBuffer.byteLength;
            if (totalLength > expectedContentLength) {
                this.onError("content-length mismatch");
                res.close(); // calls onAborted
                return;
            }
            if (!buffer) {
                if (isLast) {
                    onEnd(Buffer.from(arrayBuffer));
                    return;
                }
                buffer = Buffer.allocUnsafe(expectedContentLength);
            }
            Buffer.from(arrayBuffer).copy(buffer, offset);
            if (isLast) {
                if (totalLength != expectedContentLength) {
                    this.onError("content-length mismatch");
                    res.writeStatus("400 Content-Length Mismatch").end();
                    this.onDataRequestCleanup();
                    return;
                }
                onEnd(buffer);
                return;
            }
            offset = totalLength;
        });
    }
    /**
     * Cleanup request.
     *
     * @private
     */
    onDataRequestCleanup() {
        this.dataReq = this.dataRes = null;
    }
    /**
     * Processes the incoming data payload.
     *
     * @param {String} encoded payload
     * @private
     */
    onData(data) {
        debug$8('received "%s"', data);
        const callback = (packet) => {
            if ("close" === packet.type) {
                debug$8("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    /**
     * Writes a packet payload.
     *
     * @param {Object} packet
     * @private
     */
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug$8("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = (data) => {
            const compress = packets.some((packet) => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @private
     */
    write(data, options) {
        debug$8('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
            this.emit("drain");
        });
    }
    /**
     * Performs the write.
     *
     * @private
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType,
        };
        const respond = (data) => {
            this.headers(this.req, headers);
            this.res.cork(() => {
                Object.keys(headers).forEach((key) => {
                    this.res.writeHeader(key, String(headers[key]));
                });
                this.res.end(data);
            });
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeStatus("500 Internal Server Error");
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @private
     */
    compress(data, encoding, callback) {
        debug$8("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @private
     */
    doClose(fn) {
        debug$8("closing");
        let closeTimeoutTimer;
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug$8("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug$8("transport discarded - closing right away");
            onClose();
        }
        else {
            debug$8("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param req - request
     * @param {Object} extra headers
     * @private
     */
    headers(req, headers) {
        headers = headers || {};
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        headers["cache-control"] = "no-store";
        this.emit("headers", headers, req);
        return headers;
    }
}
polling.Polling = Polling;

var websocket = {};

Object.defineProperty(websocket, "__esModule", { value: true });
websocket.WebSocket = void 0;
const transport_1 = transport;
const debug_1$4 = require$$13;
const debug$7 = (0, debug_1$4.default)("engine:ws");
let WebSocket$1 = class WebSocket extends transport_1.Transport {
    /**
     * WebSocket transport
     *
     * @param req
     */
    constructor(req) {
        super(req);
        this.writable = false;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     */
    get handlesUpgrades() {
        return true;
    }
    /**
     * Writes a packet payload.
     *
     * @param {Array} packets
     * @private
     */
    send(packets) {
        this.writable = false;
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const isLast = i + 1 === packets.length;
            const send = (data) => {
                const isBinary = typeof data !== "string";
                const compress = this.perMessageDeflate &&
                    Buffer.byteLength(data) > this.perMessageDeflate.threshold;
                debug$7('writing "%s"', data);
                this.socket.send(data, isBinary, compress);
                if (isLast) {
                    this.emit("drain");
                    this.writable = true;
                    this.emit("ready");
                }
            };
            if (packet.options && typeof packet.options.wsPreEncoded === "string") {
                send(packet.options.wsPreEncoded);
            }
            else {
                this.parser.encodePacket(packet, this.supportsBinary, send);
            }
        }
    }
    /**
     * Closes the transport.
     *
     * @private
     */
    doClose(fn) {
        debug$7("closing");
        fn && fn();
        // call fn first since socket.end() immediately emits a "close" event
        this.socket.end();
    }
};
websocket.WebSocket = WebSocket$1;

Object.defineProperty(transportsUws, "__esModule", { value: true });
const polling_1 = polling;
const websocket_1 = websocket;
transportsUws.default = {
    polling: polling_1.Polling,
    websocket: websocket_1.WebSocket,
};

Object.defineProperty(userver, "__esModule", { value: true });
userver.uServer = void 0;
const debug_1$3 = require$$13;
const server_1 = server$1;
const transports_uws_1 = transportsUws;
const debug$6 = (0, debug_1$3.default)("engine:uws");
/**
 * An Engine.IO server based on the `uWebSockets.js` package.
 */
// TODO export it into its own package
class uServer extends server_1.BaseServer {
    init() { }
    cleanup() { }
    /**
     * Prepares a request by processing the query string.
     *
     * @private
     */
    prepare(req, res) {
        req.method = req.getMethod().toUpperCase();
        req.url = req.getUrl();
        const params = new URLSearchParams(req.getQuery());
        req._query = Object.fromEntries(params.entries());
        req.headers = {};
        req.forEach((key, value) => {
            req.headers[key] = value;
        });
        req.connection = {
            remoteAddress: Buffer.from(res.getRemoteAddressAsText()).toString(),
        };
        res.onAborted(() => {
            debug$6("response has been aborted");
        });
    }
    createTransport(transportName, req) {
        return new transports_uws_1.default[transportName](req);
    }
    /**
     * Attach the engine to a µWebSockets.js server
     * @param app
     * @param options
     */
    attach(app /* : TemplatedApp */, options = {}) {
        const path = this._computePath(options);
        app
            .any(path, this.handleRequest.bind(this))
            //
            .ws(path, {
            compression: options.compression,
            idleTimeout: options.idleTimeout,
            maxBackpressure: options.maxBackpressure,
            maxPayloadLength: this.opts.maxHttpBufferSize,
            upgrade: this.handleUpgrade.bind(this),
            open: (ws) => {
                const transport = ws.getUserData().transport;
                transport.socket = ws;
                transport.writable = true;
                transport.emit("ready");
            },
            message: (ws, message, isBinary) => {
                ws.getUserData().transport.onData(isBinary ? message : Buffer.from(message).toString());
            },
            close: (ws, code, message) => {
                ws.getUserData().transport.onClose(code, message);
            },
        });
    }
    _applyMiddlewares(req, res, callback) {
        if (this.middlewares.length === 0) {
            return callback();
        }
        // needed to buffer headers until the status is computed
        req.res = new ResponseWrapper(res);
        super._applyMiddlewares(req, req.res, (err) => {
            // some middlewares (like express-session) wait for the writeHead() call to flush their headers
            // see https://github.com/expressjs/session/blob/1010fadc2f071ddf2add94235d72224cf65159c6/index.js#L220-L244
            req.res.writeHead();
            callback(err);
        });
    }
    handleRequest(res, req) {
        debug$6('handling "%s" http request "%s"', req.getMethod(), req.getUrl());
        this.prepare(req, res);
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext,
                });
                this.abortRequest(req.res, errorCode, errorContext);
                return;
            }
            if (req._query.sid) {
                debug$6("setting new request for existing client");
                // @ts-ignore
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext);
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(server_1.Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, false, callback);
            }
        });
    }
    handleUpgrade(res, req, context) {
        debug$6("on upgrade");
        this.prepare(req, res);
        req.res = res;
        const callback = async (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext,
                });
                this.abortRequest(res, errorCode, errorContext);
                return;
            }
            const id = req._query.sid;
            let transport;
            if (id) {
                const client = this.clients[id];
                if (!client) {
                    debug$6("upgrade attempt for closed client");
                    return res.close();
                }
                else if (client.upgrading) {
                    debug$6("transport has already been trying to upgrade");
                    return res.close();
                }
                else if (client.upgraded) {
                    debug$6("transport had already been upgraded");
                    return res.close();
                }
                else {
                    debug$6("upgrading existing transport");
                    transport = this.createTransport(req._query.transport, req);
                    client._maybeUpgrade(transport);
                }
            }
            else {
                transport = await this.handshake(req._query.transport, req, (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext));
                if (!transport) {
                    return;
                }
            }
            // calling writeStatus() triggers the flushing of any header added in a middleware
            req.res.writeStatus("101 Switching Protocols");
            res.upgrade({
                transport,
            }, req.getHeader("sec-websocket-key"), req.getHeader("sec-websocket-protocol"), req.getHeader("sec-websocket-extensions"), context);
        };
        this._applyMiddlewares(req, res, (err) => {
            if (err) {
                callback(server_1.Server.errors.BAD_REQUEST, { name: "MIDDLEWARE_FAILURE" });
            }
            else {
                this.verify(req, true, callback);
            }
        });
    }
    abortRequest(res, errorCode, errorContext) {
        const statusCode = errorCode === server_1.Server.errors.FORBIDDEN
            ? "403 Forbidden"
            : "400 Bad Request";
        const message = errorContext && errorContext.message
            ? errorContext.message
            : server_1.Server.errorMessages[errorCode];
        res.writeStatus(statusCode);
        res.writeHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            code: errorCode,
            message,
        }));
    }
}
userver.uServer = uServer;
class ResponseWrapper {
    constructor(res) {
        this.res = res;
        this.statusWritten = false;
        this.headers = [];
        this.isAborted = false;
    }
    set statusCode(status) {
        if (!status) {
            return;
        }
        // FIXME: handle all status codes?
        this.writeStatus(status === 200 ? "200 OK" : "204 No Content");
    }
    writeHead(status) {
        this.statusCode = status;
    }
    setHeader(key, value) {
        if (Array.isArray(value)) {
            value.forEach((val) => {
                this.writeHeader(key, val);
            });
        }
        else {
            this.writeHeader(key, value);
        }
    }
    removeHeader() {
        // FIXME: not implemented
    }
    // needed by vary: https://github.com/jshttp/vary/blob/5d725d059b3871025cf753e9dfa08924d0bcfa8f/index.js#L134
    getHeader() { }
    writeStatus(status) {
        if (this.isAborted)
            return;
        this.res.writeStatus(status);
        this.statusWritten = true;
        this.writeBufferedHeaders();
        return this;
    }
    writeHeader(key, value) {
        if (this.isAborted)
            return;
        if (key === "Content-Length") {
            // the content length is automatically added by uWebSockets.js
            return;
        }
        if (this.statusWritten) {
            this.res.writeHeader(key, value);
        }
        else {
            this.headers.push([key, value]);
        }
    }
    writeBufferedHeaders() {
        this.headers.forEach(([key, value]) => {
            this.res.writeHeader(key, value);
        });
    }
    end(data) {
        if (this.isAborted)
            return;
        this.res.cork(() => {
            if (!this.statusWritten) {
                // status will be inferred as "200 OK"
                this.writeBufferedHeaders();
            }
            this.res.end(data);
        });
    }
    onData(fn) {
        if (this.isAborted)
            return;
        this.res.onData(fn);
    }
    onAborted(fn) {
        if (this.isAborted)
            return;
        this.res.onAborted(() => {
            // Any attempt to use the UWS response object after abort will throw!
            this.isAborted = true;
            fn();
        });
    }
    cork(fn) {
        if (this.isAborted)
            return;
        this.res.cork(fn);
    }
}

(function (exports$1) {
	Object.defineProperty(exports$1, "__esModule", { value: true });
	exports$1.protocol = exports$1.Transport = exports$1.Socket = exports$1.uServer = exports$1.parser = exports$1.transports = exports$1.Server = void 0;
	exports$1.listen = listen;
	exports$1.attach = attach;
	const http_1 = require$$0$2;
	const server_1 = server$1;
	Object.defineProperty(exports$1, "Server", { enumerable: true, get: function () { return server_1.Server; } });
	const index_1 = transports;
	exports$1.transports = index_1.default;
	const parser = esm;
	exports$1.parser = parser;
	var userver_1 = userver;
	Object.defineProperty(exports$1, "uServer", { enumerable: true, get: function () { return userver_1.uServer; } });
	var socket_1 = socket$1;
	Object.defineProperty(exports$1, "Socket", { enumerable: true, get: function () { return socket_1.Socket; } });
	var transport_1 = transport;
	Object.defineProperty(exports$1, "Transport", { enumerable: true, get: function () { return transport_1.Transport; } });
	exports$1.protocol = parser.protocol;
	/**
	 * Creates an http.Server exclusively used for WS upgrades.
	 *
	 * @param {Number} port
	 * @param {Function} callback
	 * @param {Object} options
	 * @return {Server} websocket.io server
	 */
	function listen(port, options, fn) {
	    if ("function" === typeof options) {
	        fn = options;
	        options = {};
	    }
	    const server = (0, http_1.createServer)(function (req, res) {
	        res.writeHead(501);
	        res.end("Not Implemented");
	    });
	    // create engine server
	    const engine = attach(server, options);
	    engine.httpServer = server;
	    server.listen(port, fn);
	    return engine;
	}
	/**
	 * Captures upgrade requests for a http.Server.
	 *
	 * @param {http.Server} server
	 * @param {Object} options
	 * @return {Server} engine server
	 */
	function attach(server, options) {
	    const engine = new server_1.Server(options);
	    engine.attach(server, options);
	    return engine;
	} 
} (engine_io));

const wrapper = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Server: engine_io.Server,
  Socket: engine_io.Socket,
  Transport: engine_io.Transport,
  attach: engine_io.attach,
  listen: engine_io.listen,
  parser: engine_io.parser,
  protocol: engine_io.protocol,
  transports: engine_io.transports
}, Symbol.toStringTag, { value: 'Module' }));

var dist$2 = {exports: {}};

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(fs);

const require$$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(require$$0$2$1);

const require$$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(path$1);

const require$$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(wrapper);

var client = {};

const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
        (withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}

/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (isBinary(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    delete packet.attachments; // no longer useful
    return packet;
}
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder === true) {
        const isIndexValid = typeof data.num === "number" &&
            data.num >= 0 &&
            data.num < buffers.length;
        if (isIndexValid) {
            return buffers[data.num]; // appropriate buffer (should be natural order anyway)
        }
        else {
            throw new Error("illegal attachments");
        }
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}

const debug$5 = debug$f("socket.io-parser"); // debug()
/**
 * These strings must not be used as event names, as they have a special meaning.
 */
const RESERVED_EVENTS = [
    "connect",
    "connect_error",
    "disconnect",
    "disconnecting",
    "newListener",
    "removeListener", // used by the Node.js EventEmitter
];
/**
 * Protocol version.
 *
 * @public
 */
const protocol = 5;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
/**
 * A socket.io Encoder instance
 */
class Encoder {
    /**
     * Encoder constructor
     *
     * @param {function} replacer - custom replacer to pass down to JSON.parse
     */
    constructor(replacer) {
        this.replacer = replacer;
    }
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
        debug$5("encoding packet %j", obj);
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (hasBinary(obj)) {
                return this.encodeAsBinary({
                    type: obj.type === PacketType.EVENT
                        ? PacketType.BINARY_EVENT
                        : PacketType.BINARY_ACK,
                    nsp: obj.nsp,
                    data: obj.data,
                    id: obj.id,
                });
            }
        }
        return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
        // first is type
        let str = "" + obj.type;
        // attachments if we have them
        if (obj.type === PacketType.BINARY_EVENT ||
            obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
        }
        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
        }
        // immediately followed by the id
        if (null != obj.id) {
            str += obj.id;
        }
        // json data
        if (null != obj.data) {
            str += JSON.stringify(obj.data, this.replacer);
        }
        debug$5("encoded %j as %s", obj, str);
        return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
        const deconstruction = deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list
        return buffers; // write all the buffers
    }
}
// see https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */
class Decoder extends Emitter {
    /**
     * Decoder constructor
     *
     * @param {function} reviver - custom reviver to pass down to JSON.stringify
     */
    constructor(reviver) {
        super();
        this.reviver = reviver;
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
        let packet;
        if (typeof obj === "string") {
            if (this.reconstructor) {
                throw new Error("got plaintext data when reconstructing a packet");
            }
            packet = this.decodeString(obj);
            const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
            if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
                packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
                // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);
                // no attachments, labeled binary but no binary data to follow
                if (packet.attachments === 0) {
                    super.emitReserved("decoded", packet);
                }
            }
            else {
                // non-binary full packet
                super.emitReserved("decoded", packet);
            }
        }
        else if (isBinary(obj) || obj.base64) {
            // raw binary data
            if (!this.reconstructor) {
                throw new Error("got binary data when not reconstructing a packet");
            }
            else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                    // received final buffer
                    this.reconstructor = null;
                    super.emitReserved("decoded", packet);
                }
            }
        }
        else {
            throw new Error("Unknown type: " + obj);
        }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str) {
        let i = 0;
        // look up type
        const p = {
            type: Number(str.charAt(0)),
        };
        if (PacketType[p.type] === undefined) {
            throw new Error("unknown packet type " + p.type);
        }
        // look up attachments if type binary
        if (p.type === PacketType.BINARY_EVENT ||
            p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) { }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
                throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
        }
        // look up namespace (if any)
        if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if ("," === c)
                    break;
                if (i === str.length)
                    break;
            }
            p.nsp = str.substring(start, i);
        }
        else {
            p.nsp = "/";
        }
        // look up id
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                if (i === str.length)
                    break;
            }
            p.id = Number(str.substring(start, i + 1));
        }
        // look up json data
        if (str.charAt(++i)) {
            const payload = this.tryParse(str.substr(i));
            if (Decoder.isPayloadValid(p.type, payload)) {
                p.data = payload;
            }
            else {
                throw new Error("invalid payload");
            }
        }
        debug$5("decoded %s as %j", str, p);
        return p;
    }
    tryParse(str) {
        try {
            return JSON.parse(str, this.reviver);
        }
        catch (e) {
            return false;
        }
    }
    static isPayloadValid(type, payload) {
        switch (type) {
            case PacketType.CONNECT:
                return isObject(payload);
            case PacketType.DISCONNECT:
                return payload === undefined;
            case PacketType.CONNECT_ERROR:
                return typeof payload === "string" || isObject(payload);
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
                return (Array.isArray(payload) &&
                    (typeof payload[0] === "number" ||
                        (typeof payload[0] === "string" &&
                            RESERVED_EVENTS.indexOf(payload[0]) === -1)));
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
                return Array.isArray(payload);
        }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
            this.reconstructor = null;
        }
    }
}
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */
class BinaryReconstructor {
    constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
            // done with buffer list
            const packet = reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
    }
}

const parser = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Decoder: Decoder,
  Encoder: Encoder,
  get PacketType () { return PacketType; },
  protocol: protocol
}, Symbol.toStringTag, { value: 'Module' }));

Object.defineProperty(client, "__esModule", { value: true });
client.Client = void 0;
const socket_io_parser_1$2 = parser;
const debugModule = require$$13;
const url = require$$2$4;
const debug$4 = debugModule("socket.io:client");
class Client {
    /**
     * Client constructor.
     *
     * @param server instance
     * @param conn
     * @package
     */
    constructor(server, conn) {
        this.sockets = new Map();
        this.nsps = new Map();
        this.server = server;
        this.conn = conn;
        this.encoder = server.encoder;
        this.decoder = new server._parser.Decoder();
        this.id = conn.id;
        this.setup();
    }
    /**
     * @return the reference to the request that originated the Engine.IO connection
     *
     * @public
     */
    get request() {
        return this.conn.request;
    }
    /**
     * Sets up event listeners.
     *
     * @private
     */
    setup() {
        this.onclose = this.onclose.bind(this);
        this.ondata = this.ondata.bind(this);
        this.onerror = this.onerror.bind(this);
        this.ondecoded = this.ondecoded.bind(this);
        // @ts-ignore
        this.decoder.on("decoded", this.ondecoded);
        this.conn.on("data", this.ondata);
        this.conn.on("error", this.onerror);
        this.conn.on("close", this.onclose);
        this.connectTimeout = setTimeout(() => {
            if (this.nsps.size === 0) {
                debug$4("no namespace joined yet, close the client");
                this.close();
            }
            else {
                debug$4("the client has already joined a namespace, nothing to do");
            }
        }, this.server._connectTimeout);
    }
    /**
     * Connects a client to a namespace.
     *
     * @param {String} name - the namespace
     * @param {Object} auth - the auth parameters
     * @private
     */
    connect(name, auth = {}) {
        if (this.server._nsps.has(name)) {
            debug$4("connecting to namespace %s", name);
            return this.doConnect(name, auth);
        }
        this.server._checkNamespace(name, auth, (dynamicNspName) => {
            if (dynamicNspName) {
                this.doConnect(name, auth);
            }
            else {
                debug$4("creation of namespace %s was denied", name);
                this._packet({
                    type: socket_io_parser_1$2.PacketType.CONNECT_ERROR,
                    nsp: name,
                    data: {
                        message: "Invalid namespace",
                    },
                });
            }
        });
    }
    /**
     * Connects a client to a namespace.
     *
     * @param name - the namespace
     * @param {Object} auth - the auth parameters
     *
     * @private
     */
    doConnect(name, auth) {
        const nsp = this.server.of(name);
        nsp._add(this, auth, (socket) => {
            this.sockets.set(socket.id, socket);
            this.nsps.set(nsp.name, socket);
            if (this.connectTimeout) {
                clearTimeout(this.connectTimeout);
                this.connectTimeout = undefined;
            }
        });
    }
    /**
     * Disconnects from all namespaces and closes transport.
     *
     * @private
     */
    _disconnect() {
        for (const socket of this.sockets.values()) {
            socket.disconnect();
        }
        this.sockets.clear();
        this.close();
    }
    /**
     * Removes a socket. Called by each `Socket`.
     *
     * @private
     */
    _remove(socket) {
        if (this.sockets.has(socket.id)) {
            const nsp = this.sockets.get(socket.id).nsp.name;
            this.sockets.delete(socket.id);
            this.nsps.delete(nsp);
        }
        else {
            debug$4("ignoring remove for %s", socket.id);
        }
    }
    /**
     * Closes the underlying connection.
     *
     * @private
     */
    close() {
        if ("open" === this.conn.readyState) {
            debug$4("forcing transport close");
            this.conn.close();
            this.onclose("forced server close");
        }
    }
    /**
     * Writes a packet to the transport.
     *
     * @param {Object} packet object
     * @param {Object} opts
     * @private
     */
    _packet(packet, opts = {}) {
        if (this.conn.readyState !== "open") {
            debug$4("ignoring packet write %j", packet);
            return;
        }
        const encodedPackets = opts.preEncoded
            ? packet // previous versions of the adapter incorrectly used socket.packet() instead of writeToEngine()
            : this.encoder.encode(packet);
        this.writeToEngine(encodedPackets, opts);
    }
    writeToEngine(encodedPackets, opts) {
        if (opts.volatile && !this.conn.transport.writable) {
            debug$4("volatile packet is discarded since the transport is not currently writable");
            return;
        }
        const packets = Array.isArray(encodedPackets)
            ? encodedPackets
            : [encodedPackets];
        for (const encodedPacket of packets) {
            this.conn.write(encodedPacket, opts);
        }
    }
    /**
     * Called with incoming transport data.
     *
     * @private
     */
    ondata(data) {
        // try/catch is needed for protocol violations (GH-1880)
        try {
            this.decoder.add(data);
        }
        catch (e) {
            debug$4("invalid packet format");
            this.onerror(e);
        }
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        let namespace;
        let authPayload;
        if (this.conn.protocol === 3) {
            const parsed = url.parse(packet.nsp, true);
            namespace = parsed.pathname;
            authPayload = parsed.query;
        }
        else {
            namespace = packet.nsp;
            authPayload = packet.data;
        }
        const socket = this.nsps.get(namespace);
        if (!socket && packet.type === socket_io_parser_1$2.PacketType.CONNECT) {
            this.connect(namespace, authPayload);
        }
        else if (socket &&
            packet.type !== socket_io_parser_1$2.PacketType.CONNECT &&
            packet.type !== socket_io_parser_1$2.PacketType.CONNECT_ERROR) {
            process.nextTick(function () {
                socket._onpacket(packet);
            });
        }
        else {
            debug$4("invalid state (packet type: %s)", packet.type);
            this.close();
        }
    }
    /**
     * Handles an error.
     *
     * @param {Object} err object
     * @private
     */
    onerror(err) {
        for (const socket of this.sockets.values()) {
            socket._onerror(err);
        }
        this.conn.close();
    }
    /**
     * Called upon transport close.
     *
     * @param reason
     * @param description
     * @private
     */
    onclose(reason, description) {
        debug$4("client close with reason %s", reason);
        // ignore a potential subsequent `close` event
        this.destroy();
        // `nsps` and `sockets` are cleaned up seamlessly
        for (const socket of this.sockets.values()) {
            socket._onclose(reason, description);
        }
        this.sockets.clear();
        this.decoder.destroy(); // clean up decoder
    }
    /**
     * Cleans up event listeners.
     * @private
     */
    destroy() {
        this.conn.removeListener("data", this.ondata);
        this.conn.removeListener("error", this.onerror);
        this.conn.removeListener("close", this.onclose);
        // @ts-ignore
        this.decoder.removeListener("decoded", this.ondecoded);
        if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = undefined;
        }
    }
}
client.Client = Client;

var namespace = {};

var socket = {};

var typedEvents = {};

Object.defineProperty(typedEvents, "__esModule", { value: true });
typedEvents.StrictEventEmitter = void 0;
const events_1$1 = require$$8;
/**
 * Strictly typed version of an `EventEmitter`. A `TypedEventEmitter` takes type
 * parameters for mappings of event names to event data types, and strictly
 * types method calls to the `EventEmitter` according to these event maps.
 *
 * @typeParam ListenEvents - `EventsMap` of user-defined events that can be
 * listened to with `on` or `once`
 * @typeParam EmitEvents - `EventsMap` of user-defined events that can be
 * emitted with `emit`
 * @typeParam ReservedEvents - `EventsMap` of reserved events, that can be
 * emitted by socket.io with `emitReserved`, and can be listened to with
 * `listen`.
 */
class StrictEventEmitter extends events_1$1.EventEmitter {
    /**
     * Adds the `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    on(ev, listener) {
        return super.on(ev, listener);
    }
    /**
     * Adds a one-time `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    once(ev, listener) {
        return super.once(ev, listener);
    }
    /**
     * Emits an event.
     *
     * @param ev Name of the event
     * @param args Values to send to listeners of this event
     */
    emit(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits a reserved event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can emit its own reserved events.
     *
     * @param ev Reserved event name
     * @param args Arguments to emit along with the event
     */
    emitReserved(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits an event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can get around the strict typing. This is useful for
     * calling `emit.apply`, which can be called as `emitUntyped.apply`.
     *
     * @param ev Event name
     * @param args Arguments to emit along with the event
     */
    emitUntyped(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Returns the listeners listening to an event.
     *
     * @param event Event name
     * @returns Array of listeners subscribed to `event`
     */
    listeners(event) {
        return super.listeners(event);
    }
}
typedEvents.StrictEventEmitter = StrictEventEmitter;

var broadcastOperator = {};

var socketTypes = {};

Object.defineProperty(socketTypes, "__esModule", { value: true });
socketTypes.RESERVED_EVENTS = void 0;
socketTypes.RESERVED_EVENTS = new Set([
    "connect",
    "connect_error",
    "disconnect",
    "disconnecting",
    "newListener",
    "removeListener",
]);

Object.defineProperty(broadcastOperator, "__esModule", { value: true });
broadcastOperator.RemoteSocket = broadcastOperator.BroadcastOperator = void 0;
const socket_types_1$1 = socketTypes;
const socket_io_parser_1$1 = parser;
class BroadcastOperator {
    constructor(adapter, rooms = new Set(), exceptRooms = new Set(), flags = {}) {
        this.adapter = adapter;
        this.rooms = rooms;
        this.exceptRooms = exceptRooms;
        this.flags = flags;
    }
    /**
     * Targets a room when emitting.
     *
     * @example
     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
     * io.to("room-101").emit("foo", "bar");
     *
     * // with an array of rooms (a client will be notified at most once)
     * io.to(["room-101", "room-102"]).emit("foo", "bar");
     *
     * // with multiple chained calls
     * io.to("room-101").to("room-102").emit("foo", "bar");
     *
     * @param room - a room, or an array of rooms
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    to(room) {
        const rooms = new Set(this.rooms);
        if (Array.isArray(room)) {
            room.forEach((r) => rooms.add(r));
        }
        else {
            rooms.add(room);
        }
        return new BroadcastOperator(this.adapter, rooms, this.exceptRooms, this.flags);
    }
    /**
     * Targets a room when emitting. Similar to `to()`, but might feel clearer in some cases:
     *
     * @example
     * // disconnect all clients in the "room-101" room
     * io.in("room-101").disconnectSockets();
     *
     * @param room - a room, or an array of rooms
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    in(room) {
        return this.to(room);
    }
    /**
     * Excludes a room when emitting.
     *
     * @example
     * // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
     * io.except("room-101").emit("foo", "bar");
     *
     * // with an array of rooms
     * io.except(["room-101", "room-102"]).emit("foo", "bar");
     *
     * // with multiple chained calls
     * io.except("room-101").except("room-102").emit("foo", "bar");
     *
     * @param room - a room, or an array of rooms
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    except(room) {
        const exceptRooms = new Set(this.exceptRooms);
        if (Array.isArray(room)) {
            room.forEach((r) => exceptRooms.add(r));
        }
        else {
            exceptRooms.add(room);
        }
        return new BroadcastOperator(this.adapter, this.rooms, exceptRooms, this.flags);
    }
    /**
     * Sets the compress flag.
     *
     * @example
     * io.compress(false).emit("hello");
     *
     * @param compress - if `true`, compresses the sending data
     * @return a new BroadcastOperator instance
     */
    compress(compress) {
        const flags = Object.assign({}, this.flags, { compress });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @example
     * io.volatile.emit("hello"); // the clients may or may not receive it
     *
     * @return a new BroadcastOperator instance
     */
    get volatile() {
        const flags = Object.assign({}, this.flags, { volatile: true });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @example
     * // the “foo” event will be broadcast to all connected clients on this node
     * io.local.emit("foo", "bar");
     *
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    get local() {
        const flags = Object.assign({}, this.flags, { local: true });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Adds a timeout in milliseconds for the next operation
     *
     * @example
     * io.timeout(1000).emit("some-event", (err, responses) => {
     *   if (err) {
     *     // some clients did not acknowledge the event in the given delay
     *   } else {
     *     console.log(responses); // one response per client
     *   }
     * });
     *
     * @param timeout
     */
    timeout(timeout) {
        const flags = Object.assign({}, this.flags, { timeout });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Emits to all clients.
     *
     * @example
     * // the “foo” event will be broadcast to all connected clients
     * io.emit("foo", "bar");
     *
     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
     * io.to("room-101").emit("foo", "bar");
     *
     * // with an acknowledgement expected from all connected clients
     * io.timeout(1000).emit("some-event", (err, responses) => {
     *   if (err) {
     *     // some clients did not acknowledge the event in the given delay
     *   } else {
     *     console.log(responses); // one response per client
     *   }
     * });
     *
     * @return Always true
     */
    emit(ev, ...args) {
        if (socket_types_1$1.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${String(ev)}" is a reserved event name`);
        }
        // set up packet object
        const data = [ev, ...args];
        const packet = {
            type: socket_io_parser_1$1.PacketType.EVENT,
            data: data,
        };
        const withAck = typeof data[data.length - 1] === "function";
        if (!withAck) {
            this.adapter.broadcast(packet, {
                rooms: this.rooms,
                except: this.exceptRooms,
                flags: this.flags,
            });
            return true;
        }
        const ack = data.pop();
        let timedOut = false;
        let responses = [];
        const timer = setTimeout(() => {
            timedOut = true;
            ack.apply(this, [
                new Error("operation has timed out"),
                this.flags.expectSingleResponse ? null : responses,
            ]);
        }, this.flags.timeout);
        let expectedServerCount = -1;
        let actualServerCount = 0;
        let expectedClientCount = 0;
        const checkCompleteness = () => {
            if (!timedOut &&
                expectedServerCount === actualServerCount &&
                responses.length === expectedClientCount) {
                clearTimeout(timer);
                ack.apply(this, [
                    null,
                    this.flags.expectSingleResponse ? responses[0] : responses,
                ]);
            }
        };
        this.adapter.broadcastWithAck(packet, {
            rooms: this.rooms,
            except: this.exceptRooms,
            flags: this.flags,
        }, (clientCount) => {
            // each Socket.IO server in the cluster sends the number of clients that were notified
            expectedClientCount += clientCount;
            actualServerCount++;
            checkCompleteness();
        }, (clientResponse) => {
            // each client sends an acknowledgement
            responses.push(clientResponse);
            checkCompleteness();
        });
        this.adapter.serverCount().then((serverCount) => {
            expectedServerCount = serverCount;
            checkCompleteness();
        });
        return true;
    }
    /**
     * Emits an event and waits for an acknowledgement from all clients.
     *
     * @example
     * try {
     *   const responses = await io.timeout(1000).emitWithAck("some-event");
     *   console.log(responses); // one response per client
     * } catch (e) {
     *   // some clients did not acknowledge the event in the given delay
     * }
     *
     * @return a Promise that will be fulfilled when all clients have acknowledged the event
     */
    emitWithAck(ev, ...args) {
        return new Promise((resolve, reject) => {
            args.push((err, responses) => {
                if (err) {
                    err.responses = responses;
                    return reject(err);
                }
                else {
                    return resolve(responses);
                }
            });
            this.emit(ev, ...args);
        });
    }
    /**
     * Gets a list of clients.
     *
     * @deprecated this method will be removed in the next major release, please use {@link Server#serverSideEmit} or
     * {@link fetchSockets} instead.
     */
    allSockets() {
        if (!this.adapter) {
            throw new Error("No adapter for this namespace, are you trying to get the list of clients of a dynamic namespace?");
        }
        return this.adapter.sockets(this.rooms);
    }
    /**
     * Returns the matching socket instances. This method works across a cluster of several Socket.IO servers.
     *
     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
     *
     * @example
     * // return all Socket instances
     * const sockets = await io.fetchSockets();
     *
     * // return all Socket instances in the "room1" room
     * const sockets = await io.in("room1").fetchSockets();
     *
     * for (const socket of sockets) {
     *   console.log(socket.id);
     *   console.log(socket.handshake);
     *   console.log(socket.rooms);
     *   console.log(socket.data);
     *
     *   socket.emit("hello");
     *   socket.join("room1");
     *   socket.leave("room2");
     *   socket.disconnect();
     * }
     */
    fetchSockets() {
        return this.adapter
            .fetchSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
            flags: this.flags,
        })
            .then((sockets) => {
            return sockets.map((socket) => {
                if (socket.server) {
                    return socket; // local instance
                }
                else {
                    return new RemoteSocket(this.adapter, socket);
                }
            });
        });
    }
    /**
     * Makes the matching socket instances join the specified rooms.
     *
     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
     *
     * @example
     *
     * // make all socket instances join the "room1" room
     * io.socketsJoin("room1");
     *
     * // make all socket instances in the "room1" room join the "room2" and "room3" rooms
     * io.in("room1").socketsJoin(["room2", "room3"]);
     *
     * @param room - a room, or an array of rooms
     */
    socketsJoin(room) {
        this.adapter.addSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
            flags: this.flags,
        }, Array.isArray(room) ? room : [room]);
    }
    /**
     * Makes the matching socket instances leave the specified rooms.
     *
     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
     *
     * @example
     * // make all socket instances leave the "room1" room
     * io.socketsLeave("room1");
     *
     * // make all socket instances in the "room1" room leave the "room2" and "room3" rooms
     * io.in("room1").socketsLeave(["room2", "room3"]);
     *
     * @param room - a room, or an array of rooms
     */
    socketsLeave(room) {
        this.adapter.delSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
            flags: this.flags,
        }, Array.isArray(room) ? room : [room]);
    }
    /**
     * Makes the matching socket instances disconnect.
     *
     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
     *
     * @example
     * // make all socket instances disconnect (the connections might be kept alive for other namespaces)
     * io.disconnectSockets();
     *
     * // make all socket instances in the "room1" room disconnect and close the underlying connections
     * io.in("room1").disconnectSockets(true);
     *
     * @param close - whether to close the underlying connection
     */
    disconnectSockets(close = false) {
        this.adapter.disconnectSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
            flags: this.flags,
        }, close);
    }
}
broadcastOperator.BroadcastOperator = BroadcastOperator;
/**
 * Expose of subset of the attributes and methods of the Socket class
 */
class RemoteSocket {
    constructor(adapter, details) {
        this.id = details.id;
        this.handshake = details.handshake;
        this.rooms = new Set(details.rooms);
        this.data = details.data;
        this.operator = new BroadcastOperator(adapter, new Set([this.id]), new Set(), {
            expectSingleResponse: true, // so that remoteSocket.emit() with acknowledgement behaves like socket.emit()
        });
    }
    /**
     * Adds a timeout in milliseconds for the next operation.
     *
     * @example
     * const sockets = await io.fetchSockets();
     *
     * for (const socket of sockets) {
     *   if (someCondition) {
     *     socket.timeout(1000).emit("some-event", (err) => {
     *       if (err) {
     *         // the client did not acknowledge the event in the given delay
     *       }
     *     });
     *   }
     * }
     *
     * // note: if possible, using a room instead of looping over all sockets is preferable
     * io.timeout(1000).to(someConditionRoom).emit("some-event", (err, responses) => {
     *   // ...
     * });
     *
     * @param timeout
     */
    timeout(timeout) {
        return this.operator.timeout(timeout);
    }
    emit(ev, ...args) {
        return this.operator.emit(ev, ...args);
    }
    /**
     * Joins a room.
     *
     * @param {String|Array} room - room or array of rooms
     */
    join(room) {
        return this.operator.socketsJoin(room);
    }
    /**
     * Leaves a room.
     *
     * @param {String} room
     */
    leave(room) {
        return this.operator.socketsLeave(room);
    }
    /**
     * Disconnects this client.
     *
     * @param {Boolean} close - if `true`, closes the underlying connection
     * @return {Socket} self
     */
    disconnect(close = false) {
        this.operator.disconnectSockets(close);
        return this;
    }
}
broadcastOperator.RemoteSocket = RemoteSocket;

var __importDefault$2 = (socket && socket.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(socket, "__esModule", { value: true });
socket.Socket = void 0;
const socket_io_parser_1 = parser;
const debug_1$2 = __importDefault$2(require$$13);
const typed_events_1 = typedEvents;
const base64id_1 = __importDefault$2(require$$3);
const broadcast_operator_1 = broadcastOperator;
const socket_types_1 = socketTypes;
const debug$3 = (0, debug_1$2.default)("socket.io:socket");
const RECOVERABLE_DISCONNECT_REASONS = new Set([
    "transport error",
    "transport close",
    "forced close",
    "ping timeout",
    "server shutting down",
    "forced server close",
]);
function noop() { }
/**
 * This is the main object for interacting with a client.
 *
 * A Socket belongs to a given {@link Namespace} and uses an underlying {@link Client} to communicate.
 *
 * Within each {@link Namespace}, you can also define arbitrary channels (called "rooms") that the {@link Socket} can
 * join and leave. That provides a convenient way to broadcast to a group of socket instances.
 *
 * @example
 * io.on("connection", (socket) => {
 *   console.log(`socket ${socket.id} connected`);
 *
 *   // send an event to the client
 *   socket.emit("foo", "bar");
 *
 *   socket.on("foobar", () => {
 *     // an event was received from the client
 *   });
 *
 *   // join the room named "room1"
 *   socket.join("room1");
 *
 *   // broadcast to everyone in the room named "room1"
 *   io.to("room1").emit("hello");
 *
 *   // upon disconnection
 *   socket.on("disconnect", (reason) => {
 *     console.log(`socket ${socket.id} disconnected due to ${reason}`);
 *   });
 * });
 */
let Socket$1 = class Socket extends typed_events_1.StrictEventEmitter {
    /**
     * Interface to a `Client` for a given `Namespace`.
     *
     * @param {Namespace} nsp
     * @param {Client} client
     * @param {Object} auth
     * @package
     */
    constructor(nsp, client, auth, previousSession) {
        super();
        this.nsp = nsp;
        this.client = client;
        /**
         * Whether the connection state was recovered after a temporary disconnection. In that case, any missed packets will
         * be transmitted to the client, the data attribute and the rooms will be restored.
         */
        this.recovered = false;
        /**
         * Additional information that can be attached to the Socket instance and which will be used in the
         * {@link Server.fetchSockets()} method.
         */
        this.data = {};
        /**
         * Whether the socket is currently connected or not.
         *
         * @example
         * io.use((socket, next) => {
         *   console.log(socket.connected); // false
         *   next();
         * });
         *
         * io.on("connection", (socket) => {
         *   console.log(socket.connected); // true
         * });
         */
        this.connected = false;
        this.acks = new Map();
        this.fns = [];
        this.flags = {};
        this.server = nsp.server;
        this.adapter = this.nsp.adapter;
        if (previousSession) {
            this.id = previousSession.sid;
            this.pid = previousSession.pid;
            previousSession.rooms.forEach((room) => this.join(room));
            this.data = previousSession.data;
            previousSession.missedPackets.forEach((packet) => {
                this.packet({
                    type: socket_io_parser_1.PacketType.EVENT,
                    data: packet,
                });
            });
            this.recovered = true;
        }
        else {
            if (client.conn.protocol === 3) {
                // @ts-ignore
                this.id = nsp.name !== "/" ? nsp.name + "#" + client.id : client.id;
            }
            else {
                this.id = base64id_1.default.generateId(); // don't reuse the Engine.IO id because it's sensitive information
            }
            if (this.server._opts.connectionStateRecovery) {
                this.pid = base64id_1.default.generateId();
            }
        }
        this.handshake = this.buildHandshake(auth);
        // prevents crash when the socket receives an "error" event without listener
        this.on("error", noop);
    }
    /**
     * Builds the `handshake` BC object
     *
     * @private
     */
    buildHandshake(auth) {
        var _a, _b, _c, _d;
        return {
            headers: ((_a = this.request) === null || _a === void 0 ? void 0 : _a.headers) || {},
            time: new Date() + "",
            address: this.conn.remoteAddress,
            xdomain: !!((_b = this.request) === null || _b === void 0 ? void 0 : _b.headers.origin),
            // @ts-ignore
            secure: !this.request || !!this.request.connection.encrypted,
            issued: +new Date(),
            url: (_c = this.request) === null || _c === void 0 ? void 0 : _c.url,
            // @ts-ignore
            query: ((_d = this.request) === null || _d === void 0 ? void 0 : _d._query) || {},
            auth,
        };
    }
    /**
     * Emits to this client.
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.emit("hello", "world");
     *
     *   // all serializable datastructures are supported (no need to call JSON.stringify)
     *   socket.emit("hello", 1, "2", { 3: ["4"], 5: Buffer.from([6]) });
     *
     *   // with an acknowledgement from the client
     *   socket.emit("hello", "world", (val) => {
     *     // ...
     *   });
     * });
     *
     * @return Always returns `true`.
     */
    emit(ev, ...args) {
        if (socket_types_1.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${String(ev)}" is a reserved event name`);
        }
        const data = [ev, ...args];
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: data,
        };
        // access last argument to see if it's an ACK callback
        if (typeof data[data.length - 1] === "function") {
            const id = this.nsp._ids++;
            debug$3("emitting packet with ack id %d", id);
            this.registerAckCallback(id, data.pop());
            packet.id = id;
        }
        const flags = Object.assign({}, this.flags);
        this.flags = {};
        // @ts-ignore
        if (this.nsp.server.opts.connectionStateRecovery) {
            // this ensures the packet is stored and can be transmitted upon reconnection
            this.adapter.broadcast(packet, {
                rooms: new Set([this.id]),
                except: new Set(),
                flags,
            });
        }
        else {
            this.notifyOutgoingListeners(packet);
            this.packet(packet, flags);
        }
        return true;
    }
    /**
     * Emits an event and waits for an acknowledgement
     *
     * @example
     * io.on("connection", async (socket) => {
     *   // without timeout
     *   const response = await socket.emitWithAck("hello", "world");
     *
     *   // with a specific timeout
     *   try {
     *     const response = await socket.timeout(1000).emitWithAck("hello", "world");
     *   } catch (err) {
     *     // the client did not acknowledge the event in the given delay
     *   }
     * });
     *
     * @return a Promise that will be fulfilled when the client acknowledges the event
     */
    emitWithAck(ev, ...args) {
        // the timeout flag is optional
        const withErr = this.flags.timeout !== undefined;
        return new Promise((resolve, reject) => {
            args.push((arg1, arg2) => {
                if (withErr) {
                    return arg1 ? reject(arg1) : resolve(arg2);
                }
                else {
                    return resolve(arg1);
                }
            });
            this.emit(ev, ...args);
        });
    }
    /**
     * @private
     */
    registerAckCallback(id, ack) {
        const timeout = this.flags.timeout;
        if (timeout === undefined) {
            this.acks.set(id, ack);
            return;
        }
        const timer = setTimeout(() => {
            debug$3("event with ack id %d has timed out after %d ms", id, timeout);
            this.acks.delete(id);
            ack.call(this, new Error("operation has timed out"));
        }, timeout);
        this.acks.set(id, (...args) => {
            clearTimeout(timer);
            ack.apply(this, [null, ...args]);
        });
    }
    /**
     * Targets a room when broadcasting.
     *
     * @example
     * io.on("connection", (socket) => {
     *   // the “foo” event will be broadcast to all connected clients in the “room-101” room, except this socket
     *   socket.to("room-101").emit("foo", "bar");
     *
     *   // the code above is equivalent to:
     *   io.to("room-101").except(socket.id).emit("foo", "bar");
     *
     *   // with an array of rooms (a client will be notified at most once)
     *   socket.to(["room-101", "room-102"]).emit("foo", "bar");
     *
     *   // with multiple chained calls
     *   socket.to("room-101").to("room-102").emit("foo", "bar");
     * });
     *
     * @param room - a room, or an array of rooms
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    to(room) {
        return this.newBroadcastOperator().to(room);
    }
    /**
     * Targets a room when broadcasting. Similar to `to()`, but might feel clearer in some cases:
     *
     * @example
     * io.on("connection", (socket) => {
     *   // disconnect all clients in the "room-101" room, except this socket
     *   socket.in("room-101").disconnectSockets();
     * });
     *
     * @param room - a room, or an array of rooms
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    in(room) {
        return this.newBroadcastOperator().in(room);
    }
    /**
     * Excludes a room when broadcasting.
     *
     * @example
     * io.on("connection", (socket) => {
     *   // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
     *   // and this socket
     *   socket.except("room-101").emit("foo", "bar");
     *
     *   // with an array of rooms
     *   socket.except(["room-101", "room-102"]).emit("foo", "bar");
     *
     *   // with multiple chained calls
     *   socket.except("room-101").except("room-102").emit("foo", "bar");
     * });
     *
     * @param room - a room, or an array of rooms
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    except(room) {
        return this.newBroadcastOperator().except(room);
    }
    /**
     * Sends a `message` event.
     *
     * This method mimics the WebSocket.send() method.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.send("hello");
     *
     *   // this is equivalent to
     *   socket.emit("message", "hello");
     * });
     *
     * @return self
     */
    send(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Sends a `message` event. Alias of {@link send}.
     *
     * @return self
     */
    write(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Writes a packet.
     *
     * @param {Object} packet - packet object
     * @param {Object} opts - options
     * @private
     */
    packet(packet, opts = {}) {
        packet.nsp = this.nsp.name;
        opts.compress = false !== opts.compress;
        this.client._packet(packet, opts);
    }
    /**
     * Joins a room.
     *
     * @example
     * io.on("connection", (socket) => {
     *   // join a single room
     *   socket.join("room1");
     *
     *   // join multiple rooms
     *   socket.join(["room1", "room2"]);
     * });
     *
     * @param {String|Array} rooms - room or array of rooms
     * @return a Promise or nothing, depending on the adapter
     */
    join(rooms) {
        debug$3("join room %s", rooms);
        return this.adapter.addAll(this.id, new Set(Array.isArray(rooms) ? rooms : [rooms]));
    }
    /**
     * Leaves a room.
     *
     * @example
     * io.on("connection", (socket) => {
     *   // leave a single room
     *   socket.leave("room1");
     *
     *   // leave multiple rooms
     *   socket.leave("room1").leave("room2");
     * });
     *
     * @param {String} room
     * @return a Promise or nothing, depending on the adapter
     */
    leave(room) {
        debug$3("leave room %s", room);
        return this.adapter.del(this.id, room);
    }
    /**
     * Leave all rooms.
     *
     * @private
     */
    leaveAll() {
        this.adapter.delAll(this.id);
    }
    /**
     * Called by `Namespace` upon successful
     * middleware execution (ie: authorization).
     * Socket is added to namespace array before
     * call to join, so adapters can access it.
     *
     * @private
     */
    _onconnect() {
        debug$3("socket connected - writing packet");
        this.connected = true;
        this.join(this.id);
        if (this.conn.protocol === 3) {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT });
        }
        else {
            this.packet({
                type: socket_io_parser_1.PacketType.CONNECT,
                data: { sid: this.id, pid: this.pid },
            });
        }
    }
    /**
     * Called with each packet. Called by `Client`.
     *
     * @param {Object} packet
     * @private
     */
    _onpacket(packet) {
        debug$3("got packet %j", packet);
        switch (packet.type) {
            case socket_io_parser_1.PacketType.EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.DISCONNECT:
                this.ondisconnect();
                break;
        }
    }
    /**
     * Called upon event packet.
     *
     * @param {Packet} packet - packet object
     * @private
     */
    onevent(packet) {
        const args = packet.data || [];
        debug$3("emitting event %j", args);
        if (null != packet.id) {
            debug$3("attaching ack callback to event");
            args.push(this.ack(packet.id));
        }
        if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, args);
            }
        }
        this.dispatch(args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @param {Number} id - packet id
     * @private
     */
    ack(id) {
        const self = this;
        let sent = false;
        return function () {
            // prevent double callbacks
            if (sent)
                return;
            const args = Array.prototype.slice.call(arguments);
            debug$3("sending ack %j", args);
            self.packet({
                id: id,
                type: socket_io_parser_1.PacketType.ACK,
                data: args,
            });
            sent = true;
        };
    }
    /**
     * Called upon ack packet.
     *
     * @private
     */
    onack(packet) {
        const ack = this.acks.get(packet.id);
        if ("function" == typeof ack) {
            debug$3("calling ack %s with %j", packet.id, packet.data);
            ack.apply(this, packet.data);
            this.acks.delete(packet.id);
        }
        else {
            debug$3("bad ack %s", packet.id);
        }
    }
    /**
     * Called upon client disconnect packet.
     *
     * @private
     */
    ondisconnect() {
        debug$3("got disconnect packet");
        this._onclose("client namespace disconnect");
    }
    /**
     * Handles a client error.
     *
     * @private
     */
    _onerror(err) {
        // FIXME the meaning of the "error" event is overloaded:
        //  - it can be sent by the client (`socket.emit("error")`)
        //  - it can be emitted when the connection encounters an error (an invalid packet for example)
        //  - it can be emitted when a packet is rejected in a middleware (`socket.use()`)
        this.emitReserved("error", err);
    }
    /**
     * Called upon closing. Called by `Client`.
     *
     * @param {String} reason
     * @param description
     * @throw {Error} optional error object
     *
     * @private
     */
    _onclose(reason, description) {
        if (!this.connected)
            return this;
        debug$3("closing socket - reason %s", reason);
        this.emitReserved("disconnecting", reason, description);
        if (this.server._opts.connectionStateRecovery &&
            RECOVERABLE_DISCONNECT_REASONS.has(reason)) {
            debug$3("connection state recovery is enabled for sid %s", this.id);
            this.adapter.persistSession({
                sid: this.id,
                pid: this.pid,
                rooms: [...this.rooms],
                data: this.data,
            });
        }
        this._cleanup();
        this.client._remove(this);
        this.connected = false;
        this.emitReserved("disconnect", reason, description);
        return;
    }
    /**
     * Makes the socket leave all the rooms it was part of and prevents it from joining any other room
     *
     * @private
     */
    _cleanup() {
        this.leaveAll();
        this.nsp._remove(this);
        this.join = noop;
    }
    /**
     * Produces an `error` packet.
     *
     * @param {Object} err - error object
     *
     * @private
     */
    _error(err) {
        this.packet({ type: socket_io_parser_1.PacketType.CONNECT_ERROR, data: err });
    }
    /**
     * Disconnects this client.
     *
     * @example
     * io.on("connection", (socket) => {
     *   // disconnect this socket (the connection might be kept alive for other namespaces)
     *   socket.disconnect();
     *
     *   // disconnect this socket and close the underlying connection
     *   socket.disconnect(true);
     * })
     *
     * @param {Boolean} close - if `true`, closes the underlying connection
     * @return self
     */
    disconnect(close = false) {
        if (!this.connected)
            return this;
        if (close) {
            this.client._disconnect();
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
            this._onclose("server namespace disconnect");
        }
        return this;
    }
    /**
     * Sets the compress flag.
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.compress(false).emit("hello");
     * });
     *
     * @param {Boolean} compress - if `true`, compresses the sending data
     * @return {Socket} self
     */
    compress(compress) {
        this.flags.compress = compress;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.volatile.emit("hello"); // the client may or may not receive it
     * });
     *
     * @return {Socket} self
     */
    get volatile() {
        this.flags.volatile = true;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to every sockets but the
     * sender.
     *
     * @example
     * io.on("connection", (socket) => {
     *   // the “foo” event will be broadcast to all connected clients, except this socket
     *   socket.broadcast.emit("foo", "bar");
     * });
     *
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    get broadcast() {
        return this.newBroadcastOperator();
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @example
     * io.on("connection", (socket) => {
     *   // the “foo” event will be broadcast to all connected clients on this node, except this socket
     *   socket.local.emit("foo", "bar");
     * });
     *
     * @return a new {@link BroadcastOperator} instance for chaining
     */
    get local() {
        return this.newBroadcastOperator().local;
    }
    /**
     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
     * given number of milliseconds have elapsed without an acknowledgement from the client:
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.timeout(5000).emit("my-event", (err) => {
     *     if (err) {
     *       // the client did not acknowledge the event in the given delay
     *     }
     *   });
     * });
     *
     * @returns self
     */
    timeout(timeout) {
        this.flags.timeout = timeout;
        return this;
    }
    /**
     * Dispatch incoming event to socket listeners.
     *
     * @param {Array} event - event that will get emitted
     * @private
     */
    dispatch(event) {
        debug$3("dispatching an event %j", event);
        this.run(event, (err) => {
            process.nextTick(() => {
                if (err) {
                    return this._onerror(err);
                }
                if (this.connected) {
                    super.emitUntyped.apply(this, event);
                }
                else {
                    debug$3("ignore packet received after disconnection");
                }
            });
        });
    }
    /**
     * Sets up socket middleware.
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.use(([event, ...args], next) => {
     *     if (isUnauthorized(event)) {
     *       return next(new Error("unauthorized event"));
     *     }
     *     // do not forget to call next
     *     next();
     *   });
     *
     *   socket.on("error", (err) => {
     *     if (err && err.message === "unauthorized event") {
     *       socket.disconnect();
     *     }
     *   });
     * });
     *
     * @param {Function} fn - middleware function (event, next)
     * @return {Socket} self
     */
    use(fn) {
        this.fns.push(fn);
        return this;
    }
    /**
     * Executes the middleware for an incoming event.
     *
     * @param {Array} event - event that will get emitted
     * @param {Function} fn - last fn call in the middleware
     * @private
     */
    run(event, fn) {
        if (!this.fns.length)
            return fn();
        const fns = this.fns.slice(0);
        function run(i) {
            fns[i](event, (err) => {
                // upon error, short-circuit
                if (err)
                    return fn(err);
                // if no middleware left, summon callback
                if (!fns[i + 1])
                    return fn();
                // go on to next
                run(i + 1);
            });
        }
        run(0);
    }
    /**
     * Whether the socket is currently disconnected
     */
    get disconnected() {
        return !this.connected;
    }
    /**
     * A reference to the request that originated the underlying Engine.IO Socket.
     */
    get request() {
        return this.client.request;
    }
    /**
     * A reference to the underlying Client transport connection (Engine.IO Socket object).
     *
     * @example
     * io.on("connection", (socket) => {
     *   console.log(socket.conn.transport.name); // prints "polling" or "websocket"
     *
     *   socket.conn.once("upgrade", () => {
     *     console.log(socket.conn.transport.name); // prints "websocket"
     *   });
     * });
     */
    get conn() {
        return this.client.conn;
    }
    /**
     * Returns the rooms the socket is currently in.
     *
     * @example
     * io.on("connection", (socket) => {
     *   console.log(socket.rooms); // Set { <socket.id> }
     *
     *   socket.join("room1");
     *
     *   console.log(socket.rooms); // Set { <socket.id>, "room1" }
     * });
     */
    get rooms() {
        return this.adapter.socketRooms(this.id) || new Set();
    }
    /**
     * Adds a listener that will be fired when any event is received. The event name is passed as the first argument to
     * the callback.
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.onAny((event, ...args) => {
     *     console.log(`got event ${event}`);
     *   });
     * });
     *
     * @param listener
     */
    onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is received. The event name is passed as the first argument to
     * the callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     */
    prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is received.
     *
     * @example
     * io.on("connection", (socket) => {
     *   const catchAllListener = (event, ...args) => {
     *     console.log(`got event ${event}`);
     *   }
     *
     *   socket.onAny(catchAllListener);
     *
     *   // remove a specific listener
     *   socket.offAny(catchAllListener);
     *
     *   // or remove all listeners
     *   socket.offAny();
     * });
     *
     * @param listener
     */
    offAny(listener) {
        if (!this._anyListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     */
    listenersAny() {
        return this._anyListeners || [];
    }
    /**
     * Adds a listener that will be fired when any event is sent. The event name is passed as the first argument to
     * the callback.
     *
     * Note: acknowledgements sent to the client are not included.
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.onAnyOutgoing((event, ...args) => {
     *     console.log(`sent event ${event}`);
     *   });
     * });
     *
     * @param listener
     */
    onAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @example
     * io.on("connection", (socket) => {
     *   socket.prependAnyOutgoing((event, ...args) => {
     *     console.log(`sent event ${event}`);
     *   });
     * });
     *
     * @param listener
     */
    prependAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is sent.
     *
     * @example
     * io.on("connection", (socket) => {
     *   const catchAllListener = (event, ...args) => {
     *     console.log(`sent event ${event}`);
     *   }
     *
     *   socket.onAnyOutgoing(catchAllListener);
     *
     *   // remove a specific listener
     *   socket.offAnyOutgoing(catchAllListener);
     *
     *   // or remove all listeners
     *   socket.offAnyOutgoing();
     * });
     *
     * @param listener - the catch-all listener
     */
    offAnyOutgoing(listener) {
        if (!this._anyOutgoingListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyOutgoingListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyOutgoingListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     */
    listenersAnyOutgoing() {
        return this._anyOutgoingListeners || [];
    }
    /**
     * Notify the listeners for each packet sent (emit or broadcast)
     *
     * @param packet
     *
     * @private
     */
    notifyOutgoingListeners(packet) {
        if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const listeners = this._anyOutgoingListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, packet.data);
            }
        }
    }
    newBroadcastOperator() {
        const flags = Object.assign({}, this.flags);
        this.flags = {};
        return new broadcast_operator_1.BroadcastOperator(this.adapter, new Set(), new Set([this.id]), flags);
    }
};
socket.Socket = Socket$1;

(function (exports$1) {
	var __importDefault = (namespace && namespace.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports$1, "__esModule", { value: true });
	exports$1.Namespace = exports$1.RESERVED_EVENTS = void 0;
	const socket_1 = socket;
	const typed_events_1 = typedEvents;
	const debug_1 = __importDefault(require$$13);
	const broadcast_operator_1 = broadcastOperator;
	const debug = (0, debug_1.default)("socket.io:namespace");
	exports$1.RESERVED_EVENTS = new Set(["connect", "connection", "new_namespace"]);
	/**
	 * A Namespace is a communication channel that allows you to split the logic of your application over a single shared
	 * connection.
	 *
	 * Each namespace has its own:
	 *
	 * - event handlers
	 *
	 * ```
	 * io.of("/orders").on("connection", (socket) => {
	 *   socket.on("order:list", () => {});
	 *   socket.on("order:create", () => {});
	 * });
	 *
	 * io.of("/users").on("connection", (socket) => {
	 *   socket.on("user:list", () => {});
	 * });
	 * ```
	 *
	 * - rooms
	 *
	 * ```
	 * const orderNamespace = io.of("/orders");
	 *
	 * orderNamespace.on("connection", (socket) => {
	 *   socket.join("room1");
	 *   orderNamespace.to("room1").emit("hello");
	 * });
	 *
	 * const userNamespace = io.of("/users");
	 *
	 * userNamespace.on("connection", (socket) => {
	 *   socket.join("room1"); // distinct from the room in the "orders" namespace
	 *   userNamespace.to("room1").emit("holà");
	 * });
	 * ```
	 *
	 * - middlewares
	 *
	 * ```
	 * const orderNamespace = io.of("/orders");
	 *
	 * orderNamespace.use((socket, next) => {
	 *   // ensure the socket has access to the "orders" namespace
	 * });
	 *
	 * const userNamespace = io.of("/users");
	 *
	 * userNamespace.use((socket, next) => {
	 *   // ensure the socket has access to the "users" namespace
	 * });
	 * ```
	 */
	class Namespace extends typed_events_1.StrictEventEmitter {
	    /**
	     * Namespace constructor.
	     *
	     * @param server instance
	     * @param name
	     */
	    constructor(server, name) {
	        super();
	        /**
	         * A map of currently connected sockets.
	         */
	        this.sockets = new Map();
	        /**
	         * A map of currently connecting sockets.
	         */
	        this._preConnectSockets = new Map();
	        this._fns = [];
	        /** @private */
	        this._ids = 0;
	        this.server = server;
	        this.name = name;
	        this._initAdapter();
	    }
	    /**
	     * Initializes the `Adapter` for this nsp.
	     * Run upon changing adapter by `Server#adapter`
	     * in addition to the constructor.
	     *
	     * @private
	     */
	    _initAdapter() {
	        // @ts-ignore
	        this.adapter = new (this.server.adapter())(this);
	    }
	    /**
	     * Registers a middleware, which is a function that gets executed for every incoming {@link Socket}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.use((socket, next) => {
	     *   // ...
	     *   next();
	     * });
	     *
	     * @param fn - the middleware function
	     */
	    use(fn) {
	        this._fns.push(fn);
	        return this;
	    }
	    /**
	     * Executes the middleware for an incoming client.
	     *
	     * @param socket - the socket that will get added
	     * @param fn - last fn call in the middleware
	     * @private
	     */
	    run(socket, fn) {
	        if (!this._fns.length)
	            return fn();
	        const fns = this._fns.slice(0);
	        function run(i) {
	            fns[i](socket, (err) => {
	                // upon error, short-circuit
	                if (err)
	                    return fn(err);
	                // if no middleware left, summon callback
	                if (!fns[i + 1])
	                    return fn();
	                // go on to next
	                run(i + 1);
	            });
	        }
	        run(0);
	    }
	    /**
	     * Targets a room when emitting.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
	     * myNamespace.to("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms (a client will be notified at most once)
	     * myNamespace.to(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * myNamespace.to("room-101").to("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    to(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).to(room);
	    }
	    /**
	     * Targets a room when emitting. Similar to `to()`, but might feel clearer in some cases:
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // disconnect all clients in the "room-101" room
	     * myNamespace.in("room-101").disconnectSockets();
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    in(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).in(room);
	    }
	    /**
	     * Excludes a room when emitting.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
	     * myNamespace.except("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms
	     * myNamespace.except(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * myNamespace.except("room-101").except("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    except(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).except(room);
	    }
	    /**
	     * Adds a new client.
	     *
	     * @return {Socket}
	     * @private
	     */
	    async _add(client, auth, fn) {
	        var _a;
	        debug("adding socket to nsp %s", this.name);
	        const socket = await this._createSocket(client, auth);
	        this._preConnectSockets.set(socket.id, socket);
	        if (
	        // @ts-ignore
	        ((_a = this.server.opts.connectionStateRecovery) === null || _a === void 0 ? void 0 : _a.skipMiddlewares) &&
	            socket.recovered &&
	            client.conn.readyState === "open") {
	            return this._doConnect(socket, fn);
	        }
	        this.run(socket, (err) => {
	            process.nextTick(() => {
	                if ("open" !== client.conn.readyState) {
	                    debug("next called after client was closed - ignoring socket");
	                    socket._cleanup();
	                    return;
	                }
	                if (err) {
	                    debug("middleware error, sending CONNECT_ERROR packet to the client");
	                    socket._cleanup();
	                    if (client.conn.protocol === 3) {
	                        return socket._error(err.data || err.message);
	                    }
	                    else {
	                        return socket._error({
	                            message: err.message,
	                            data: err.data,
	                        });
	                    }
	                }
	                this._doConnect(socket, fn);
	            });
	        });
	    }
	    async _createSocket(client, auth) {
	        const sessionId = auth.pid;
	        const offset = auth.offset;
	        if (
	        // @ts-ignore
	        this.server.opts.connectionStateRecovery &&
	            typeof sessionId === "string" &&
	            typeof offset === "string") {
	            let session;
	            try {
	                session = await this.adapter.restoreSession(sessionId, offset);
	            }
	            catch (e) {
	                debug("error while restoring session: %s", e);
	            }
	            if (session) {
	                debug("connection state recovered for sid %s", session.sid);
	                return new socket_1.Socket(this, client, auth, session);
	            }
	        }
	        return new socket_1.Socket(this, client, auth);
	    }
	    _doConnect(socket, fn) {
	        this._preConnectSockets.delete(socket.id);
	        this.sockets.set(socket.id, socket);
	        // it's paramount that the internal `onconnect` logic
	        // fires before user-set events to prevent state order
	        // violations (such as a disconnection before the connection
	        // logic is complete)
	        socket._onconnect();
	        if (fn)
	            fn(socket);
	        // fire user-set events
	        this.emitReserved("connect", socket);
	        this.emitReserved("connection", socket);
	    }
	    /**
	     * Removes a client. Called by each `Socket`.
	     *
	     * @private
	     */
	    _remove(socket) {
	        this.sockets.delete(socket.id) || this._preConnectSockets.delete(socket.id);
	    }
	    /**
	     * Emits to all connected clients.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.emit("hello", "world");
	     *
	     * // all serializable datastructures are supported (no need to call JSON.stringify)
	     * myNamespace.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
	     *
	     * // with an acknowledgement from the clients
	     * myNamespace.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @return Always true
	     */
	    emit(ev, ...args) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).emit(ev, ...args);
	    }
	    /**
	     * Sends a `message` event to all clients.
	     *
	     * This method mimics the WebSocket.send() method.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.send("hello");
	     *
	     * // this is equivalent to
	     * myNamespace.emit("message", "hello");
	     *
	     * @return self
	     */
	    send(...args) {
	        // This type-cast is needed because EmitEvents likely doesn't have `message` as a key.
	        // if you specify the EmitEvents, the type of args will be never.
	        this.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a `message` event to all clients. Sends a `message` event. Alias of {@link send}.
	     *
	     * @return self
	     */
	    write(...args) {
	        // This type-cast is needed because EmitEvents likely doesn't have `message` as a key.
	        // if you specify the EmitEvents, the type of args will be never.
	        this.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a message to the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.serverSideEmit("hello", "world");
	     *
	     * myNamespace.on("hello", (arg1) => {
	     *   console.log(arg1); // prints "world"
	     * });
	     *
	     * // acknowledgements (without binary content) are supported too:
	     * myNamespace.serverSideEmit("ping", (err, responses) => {
	     *  if (err) {
	     *     // some servers did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per server (except the current one)
	     *   }
	     * });
	     *
	     * myNamespace.on("ping", (cb) => {
	     *   cb("pong");
	     * });
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments, which may include an acknowledgement callback at the end
	     */
	    serverSideEmit(ev, ...args) {
	        if (exports$1.RESERVED_EVENTS.has(ev)) {
	            throw new Error(`"${String(ev)}" is a reserved event name`);
	        }
	        args.unshift(ev);
	        this.adapter.serverSideEmit(args);
	        return true;
	    }
	    /**
	     * Sends a message and expect an acknowledgement from the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * try {
	     *   const responses = await myNamespace.serverSideEmitWithAck("ping");
	     *   console.log(responses); // one response per server (except the current one)
	     * } catch (e) {
	     *   // some servers did not acknowledge the event in the given delay
	     * }
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments
	     *
	     * @return a Promise that will be fulfilled when all servers have acknowledged the event
	     */
	    serverSideEmitWithAck(ev, ...args) {
	        return new Promise((resolve, reject) => {
	            args.push((err, responses) => {
	                if (err) {
	                    err.responses = responses;
	                    return reject(err);
	                }
	                else {
	                    return resolve(responses);
	                }
	            });
	            this.serverSideEmit(ev, ...args);
	        });
	    }
	    /**
	     * Called when a packet is received from another Socket.IO server
	     *
	     * @param args - an array of arguments, which may include an acknowledgement callback at the end
	     *
	     * @private
	     */
	    _onServerSideEmit(args) {
	        super.emitUntyped.apply(this, args);
	    }
	    /**
	     * Gets a list of clients.
	     *
	     * @deprecated this method will be removed in the next major release, please use {@link Namespace#serverSideEmit} or
	     * {@link Namespace#fetchSockets} instead.
	     */
	    allSockets() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).allSockets();
	    }
	    /**
	     * Sets the compress flag.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.compress(false).emit("hello");
	     *
	     * @param compress - if `true`, compresses the sending data
	     * @return self
	     */
	    compress(compress) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).compress(compress);
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
	     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
	     * and is in the middle of a request-response cycle).
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.volatile.emit("hello"); // the clients may or may not receive it
	     *
	     * @return self
	     */
	    get volatile() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).volatile;
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // the “foo” event will be broadcast to all connected clients on this node
	     * myNamespace.local.emit("foo", "bar");
	     *
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    get local() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).local;
	    }
	    /**
	     * Adds a timeout in milliseconds for the next operation.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * myNamespace.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @param timeout
	     */
	    timeout(timeout) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).timeout(timeout);
	    }
	    /**
	     * Returns the matching socket instances.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // return all Socket instances
	     * const sockets = await myNamespace.fetchSockets();
	     *
	     * // return all Socket instances in the "room1" room
	     * const sockets = await myNamespace.in("room1").fetchSockets();
	     *
	     * for (const socket of sockets) {
	     *   console.log(socket.id);
	     *   console.log(socket.handshake);
	     *   console.log(socket.rooms);
	     *   console.log(socket.data);
	     *
	     *   socket.emit("hello");
	     *   socket.join("room1");
	     *   socket.leave("room2");
	     *   socket.disconnect();
	     * }
	     */
	    fetchSockets() {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).fetchSockets();
	    }
	    /**
	     * Makes the matching socket instances join the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // make all socket instances join the "room1" room
	     * myNamespace.socketsJoin("room1");
	     *
	     * // make all socket instances in the "room1" room join the "room2" and "room3" rooms
	     * myNamespace.in("room1").socketsJoin(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsJoin(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsJoin(room);
	    }
	    /**
	     * Makes the matching socket instances leave the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // make all socket instances leave the "room1" room
	     * myNamespace.socketsLeave("room1");
	     *
	     * // make all socket instances in the "room1" room leave the "room2" and "room3" rooms
	     * myNamespace.in("room1").socketsLeave(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsLeave(room) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsLeave(room);
	    }
	    /**
	     * Makes the matching socket instances disconnect.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // make all socket instances disconnect (the connections might be kept alive for other namespaces)
	     * myNamespace.disconnectSockets();
	     *
	     * // make all socket instances in the "room1" room disconnect and close the underlying connections
	     * myNamespace.in("room1").disconnectSockets(true);
	     *
	     * @param close - whether to close the underlying connection
	     */
	    disconnectSockets(close = false) {
	        return new broadcast_operator_1.BroadcastOperator(this.adapter).disconnectSockets(close);
	    }
	}
	exports$1.Namespace = Namespace; 
} (namespace));

var parentNamespace = {};

var dist$1 = {};

var inMemoryAdapter = {};

var yeast$1 = {};

Object.defineProperty(yeast$1, "__esModule", { value: true });
yeast$1.yeast = yeast$1.decode = yeast$1.encode = void 0;
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), length = 64, map = {};
let seed = 0, i = 0, prev;
/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
    let encoded = "";
    do {
        encoded = alphabet[num % length] + encoded;
        num = Math.floor(num / length);
    } while (num > 0);
    return encoded;
}
yeast$1.encode = encode;
/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode$1(str) {
    let decoded = 0;
    for (i = 0; i < str.length; i++) {
        decoded = decoded * length + map[str.charAt(i)];
    }
    return decoded;
}
yeast$1.decode = decode$1;
/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
    const now = encode(+new Date());
    if (now !== prev)
        return (seed = 0), (prev = now);
    return now + "." + encode(seed++);
}
yeast$1.yeast = yeast;
//
// Map each character to its index.
//
for (; i < length; i++)
    map[alphabet[i]] = i;

var _a;
Object.defineProperty(inMemoryAdapter, "__esModule", { value: true });
inMemoryAdapter.SessionAwareAdapter = inMemoryAdapter.Adapter = void 0;
const events_1 = require$$8;
const yeast_1 = yeast$1;
const WebSocket = require$$2$1;
const canPreComputeFrame = typeof ((_a = WebSocket === null || WebSocket === void 0 ? void 0 : WebSocket.Sender) === null || _a === void 0 ? void 0 : _a.frame) === "function";
class Adapter extends events_1.EventEmitter {
    /**
     * In-memory adapter constructor.
     *
     * @param {Namespace} nsp
     */
    constructor(nsp) {
        super();
        this.nsp = nsp;
        this.rooms = new Map();
        this.sids = new Map();
        this.encoder = nsp.server.encoder;
    }
    /**
     * To be overridden
     */
    init() { }
    /**
     * To be overridden
     */
    close() { }
    /**
     * Returns the number of Socket.IO servers in the cluster
     *
     * @public
     */
    serverCount() {
        return Promise.resolve(1);
    }
    /**
     * Adds a socket to a list of room.
     *
     * @param {SocketId}  id      the socket id
     * @param {Set<Room>} rooms   a set of rooms
     * @public
     */
    addAll(id, rooms) {
        if (!this.sids.has(id)) {
            this.sids.set(id, new Set());
        }
        for (const room of rooms) {
            this.sids.get(id).add(room);
            if (!this.rooms.has(room)) {
                this.rooms.set(room, new Set());
                this.emit("create-room", room);
            }
            if (!this.rooms.get(room).has(id)) {
                this.rooms.get(room).add(id);
                this.emit("join-room", room, id);
            }
        }
    }
    /**
     * Removes a socket from a room.
     *
     * @param {SocketId} id     the socket id
     * @param {Room}     room   the room name
     */
    del(id, room) {
        if (this.sids.has(id)) {
            this.sids.get(id).delete(room);
        }
        this._del(room, id);
    }
    _del(room, id) {
        const _room = this.rooms.get(room);
        if (_room != null) {
            const deleted = _room.delete(id);
            if (deleted) {
                this.emit("leave-room", room, id);
            }
            if (_room.size === 0 && this.rooms.delete(room)) {
                this.emit("delete-room", room);
            }
        }
    }
    /**
     * Removes a socket from all rooms it's joined.
     *
     * @param {SocketId} id   the socket id
     */
    delAll(id) {
        if (!this.sids.has(id)) {
            return;
        }
        for (const room of this.sids.get(id)) {
            this._del(room, id);
        }
        this.sids.delete(id);
    }
    /**
     * Broadcasts a packet.
     *
     * Options:
     *  - `flags` {Object} flags for this packet
     *  - `except` {Array} sids that should be excluded
     *  - `rooms` {Array} list of rooms to broadcast to
     *
     * @param {Object} packet   the packet object
     * @param {Object} opts     the options
     * @public
     */
    broadcast(packet, opts) {
        const flags = opts.flags || {};
        const packetOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this._encode(packet, packetOpts);
        this.apply(opts, (socket) => {
            if (typeof socket.notifyOutgoingListeners === "function") {
                socket.notifyOutgoingListeners(packet);
            }
            socket.client.writeToEngine(encodedPackets, packetOpts);
        });
    }
    /**
     * Broadcasts a packet and expects multiple acknowledgements.
     *
     * Options:
     *  - `flags` {Object} flags for this packet
     *  - `except` {Array} sids that should be excluded
     *  - `rooms` {Array} list of rooms to broadcast to
     *
     * @param {Object} packet   the packet object
     * @param {Object} opts     the options
     * @param clientCountCallback - the number of clients that received the packet
     * @param ack                 - the callback that will be called for each client response
     *
     * @public
     */
    broadcastWithAck(packet, opts, clientCountCallback, ack) {
        const flags = opts.flags || {};
        const packetOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        // we can use the same id for each packet, since the _ids counter is common (no duplicate)
        packet.id = this.nsp._ids++;
        const encodedPackets = this._encode(packet, packetOpts);
        let clientCount = 0;
        this.apply(opts, (socket) => {
            // track the total number of acknowledgements that are expected
            clientCount++;
            // call the ack callback for each client response
            socket.acks.set(packet.id, ack);
            if (typeof socket.notifyOutgoingListeners === "function") {
                socket.notifyOutgoingListeners(packet);
            }
            socket.client.writeToEngine(encodedPackets, packetOpts);
        });
        clientCountCallback(clientCount);
    }
    _encode(packet, packetOpts) {
        const encodedPackets = this.encoder.encode(packet);
        if (canPreComputeFrame &&
            encodedPackets.length === 1 &&
            typeof encodedPackets[0] === "string") {
            // "4" being the "message" packet type in the Engine.IO protocol
            const data = Buffer.from("4" + encodedPackets[0]);
            // see https://github.com/websockets/ws/issues/617#issuecomment-283002469
            packetOpts.wsPreEncodedFrame = WebSocket.Sender.frame(data, {
                readOnly: false,
                mask: false,
                rsv1: false,
                opcode: 1,
                fin: true,
            });
        }
        return encodedPackets;
    }
    /**
     * Gets a list of sockets by sid.
     *
     * @param {Set<Room>} rooms   the explicit set of rooms to check.
     */
    sockets(rooms) {
        const sids = new Set();
        this.apply({ rooms }, (socket) => {
            sids.add(socket.id);
        });
        return Promise.resolve(sids);
    }
    /**
     * Gets the list of rooms a given socket has joined.
     *
     * @param {SocketId} id   the socket id
     */
    socketRooms(id) {
        return this.sids.get(id);
    }
    /**
     * Returns the matching socket instances
     *
     * @param opts - the filters to apply
     */
    fetchSockets(opts) {
        const sockets = [];
        this.apply(opts, (socket) => {
            sockets.push(socket);
        });
        return Promise.resolve(sockets);
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to join
     */
    addSockets(opts, rooms) {
        this.apply(opts, (socket) => {
            socket.join(rooms);
        });
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to leave
     */
    delSockets(opts, rooms) {
        this.apply(opts, (socket) => {
            rooms.forEach((room) => socket.leave(room));
        });
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param opts - the filters to apply
     * @param close - whether to close the underlying connection
     */
    disconnectSockets(opts, close) {
        this.apply(opts, (socket) => {
            socket.disconnect(close);
        });
    }
    apply(opts, callback) {
        const rooms = opts.rooms;
        const except = this.computeExceptSids(opts.except);
        if (rooms.size) {
            const ids = new Set();
            for (const room of rooms) {
                if (!this.rooms.has(room))
                    continue;
                for (const id of this.rooms.get(room)) {
                    if (ids.has(id) || except.has(id))
                        continue;
                    const socket = this.nsp.sockets.get(id);
                    if (socket) {
                        callback(socket);
                        ids.add(id);
                    }
                }
            }
        }
        else {
            for (const [id] of this.sids) {
                if (except.has(id))
                    continue;
                const socket = this.nsp.sockets.get(id);
                if (socket)
                    callback(socket);
            }
        }
    }
    computeExceptSids(exceptRooms) {
        const exceptSids = new Set();
        if (exceptRooms && exceptRooms.size > 0) {
            for (const room of exceptRooms) {
                if (this.rooms.has(room)) {
                    this.rooms.get(room).forEach((sid) => exceptSids.add(sid));
                }
            }
        }
        return exceptSids;
    }
    /**
     * Send a packet to the other Socket.IO servers in the cluster
     * @param packet - an array of arguments, which may include an acknowledgement callback at the end
     */
    serverSideEmit(packet) {
        console.warn("this adapter does not support the serverSideEmit() functionality");
    }
    /**
     * Save the client session in order to restore it upon reconnection.
     */
    persistSession(session) { }
    /**
     * Restore the session and find the packets that were missed by the client.
     * @param pid
     * @param offset
     */
    restoreSession(pid, offset) {
        return null;
    }
}
inMemoryAdapter.Adapter = Adapter;
class SessionAwareAdapter extends Adapter {
    constructor(nsp) {
        super(nsp);
        this.nsp = nsp;
        this.sessions = new Map();
        this.packets = [];
        this.maxDisconnectionDuration =
            nsp.server.opts.connectionStateRecovery.maxDisconnectionDuration;
        const timer = setInterval(() => {
            const threshold = Date.now() - this.maxDisconnectionDuration;
            this.sessions.forEach((session, sessionId) => {
                const hasExpired = session.disconnectedAt < threshold;
                if (hasExpired) {
                    this.sessions.delete(sessionId);
                }
            });
            for (let i = this.packets.length - 1; i >= 0; i--) {
                const hasExpired = this.packets[i].emittedAt < threshold;
                if (hasExpired) {
                    this.packets.splice(0, i + 1);
                    break;
                }
            }
        }, 60 * 1000);
        // prevents the timer from keeping the process alive
        timer.unref();
    }
    persistSession(session) {
        session.disconnectedAt = Date.now();
        this.sessions.set(session.pid, session);
    }
    restoreSession(pid, offset) {
        const session = this.sessions.get(pid);
        if (!session) {
            // the session may have expired
            return null;
        }
        const hasExpired = session.disconnectedAt + this.maxDisconnectionDuration < Date.now();
        if (hasExpired) {
            // the session has expired
            this.sessions.delete(pid);
            return null;
        }
        const index = this.packets.findIndex((packet) => packet.id === offset);
        if (index === -1) {
            // the offset may be too old
            return null;
        }
        const missedPackets = [];
        for (let i = index + 1; i < this.packets.length; i++) {
            const packet = this.packets[i];
            if (shouldIncludePacket(session.rooms, packet.opts)) {
                missedPackets.push(packet.data);
            }
        }
        return Promise.resolve(Object.assign(Object.assign({}, session), { missedPackets }));
    }
    broadcast(packet, opts) {
        var _a;
        const isEventPacket = packet.type === 2;
        // packets with acknowledgement are not stored because the acknowledgement function cannot be serialized and
        // restored on another server upon reconnection
        const withoutAcknowledgement = packet.id === undefined;
        const notVolatile = ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.volatile) === undefined;
        if (isEventPacket && withoutAcknowledgement && notVolatile) {
            const id = (0, yeast_1.yeast)();
            // the offset is stored at the end of the data array, so the client knows the ID of the last packet it has
            // processed (and the format is backward-compatible)
            packet.data.push(id);
            this.packets.push({
                id,
                opts,
                data: packet.data,
                emittedAt: Date.now(),
            });
        }
        super.broadcast(packet, opts);
    }
}
inMemoryAdapter.SessionAwareAdapter = SessionAwareAdapter;
function shouldIncludePacket(sessionRooms, opts) {
    const included = opts.rooms.size === 0 || sessionRooms.some((room) => opts.rooms.has(room));
    const notExcluded = sessionRooms.every((room) => !opts.except.has(room));
    return included && notExcluded;
}

var clusterAdapter = {};

const require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(require$$1$2);

(function (exports$1) {
	var __rest = (clusterAdapter && clusterAdapter.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	Object.defineProperty(exports$1, "__esModule", { value: true });
	exports$1.ClusterAdapterWithHeartbeat = exports$1.ClusterAdapter = exports$1.MessageType = void 0;
	const in_memory_adapter_1 = inMemoryAdapter;
	const debug_1 = require$$13;
	const crypto_1 = require$$2;
	const debug = (0, debug_1.debug)("socket.io-adapter");
	const EMITTER_UID = "emitter";
	const DEFAULT_TIMEOUT = 5000;
	function randomId() {
	    return (0, crypto_1.randomBytes)(8).toString("hex");
	}
	var MessageType;
	(function (MessageType) {
	    MessageType[MessageType["INITIAL_HEARTBEAT"] = 1] = "INITIAL_HEARTBEAT";
	    MessageType[MessageType["HEARTBEAT"] = 2] = "HEARTBEAT";
	    MessageType[MessageType["BROADCAST"] = 3] = "BROADCAST";
	    MessageType[MessageType["SOCKETS_JOIN"] = 4] = "SOCKETS_JOIN";
	    MessageType[MessageType["SOCKETS_LEAVE"] = 5] = "SOCKETS_LEAVE";
	    MessageType[MessageType["DISCONNECT_SOCKETS"] = 6] = "DISCONNECT_SOCKETS";
	    MessageType[MessageType["FETCH_SOCKETS"] = 7] = "FETCH_SOCKETS";
	    MessageType[MessageType["FETCH_SOCKETS_RESPONSE"] = 8] = "FETCH_SOCKETS_RESPONSE";
	    MessageType[MessageType["SERVER_SIDE_EMIT"] = 9] = "SERVER_SIDE_EMIT";
	    MessageType[MessageType["SERVER_SIDE_EMIT_RESPONSE"] = 10] = "SERVER_SIDE_EMIT_RESPONSE";
	    MessageType[MessageType["BROADCAST_CLIENT_COUNT"] = 11] = "BROADCAST_CLIENT_COUNT";
	    MessageType[MessageType["BROADCAST_ACK"] = 12] = "BROADCAST_ACK";
	    MessageType[MessageType["ADAPTER_CLOSE"] = 13] = "ADAPTER_CLOSE";
	})(MessageType = exports$1.MessageType || (exports$1.MessageType = {}));
	function encodeOptions(opts) {
	    return {
	        rooms: [...opts.rooms],
	        except: [...opts.except],
	        flags: opts.flags,
	    };
	}
	function decodeOptions(opts) {
	    return {
	        rooms: new Set(opts.rooms),
	        except: new Set(opts.except),
	        flags: opts.flags,
	    };
	}
	/**
	 * A cluster-ready adapter. Any extending class must:
	 *
	 * - implement {@link ClusterAdapter#doPublish} and {@link ClusterAdapter#doPublishResponse}
	 * - call {@link ClusterAdapter#onMessage} and {@link ClusterAdapter#onResponse}
	 */
	class ClusterAdapter extends in_memory_adapter_1.Adapter {
	    constructor(nsp) {
	        super(nsp);
	        this.requests = new Map();
	        this.ackRequests = new Map();
	        this.uid = randomId();
	    }
	    /**
	     * Called when receiving a message from another member of the cluster.
	     *
	     * @param message
	     * @param offset
	     * @protected
	     */
	    onMessage(message, offset) {
	        if (message.uid === this.uid) {
	            return debug("[%s] ignore message from self", this.uid);
	        }
	        debug("[%s] new event of type %d from %s", this.uid, message.type, message.uid);
	        switch (message.type) {
	            case MessageType.BROADCAST: {
	                const withAck = message.data.requestId !== undefined;
	                if (withAck) {
	                    super.broadcastWithAck(message.data.packet, decodeOptions(message.data.opts), (clientCount) => {
	                        debug("[%s] waiting for %d client acknowledgements", this.uid, clientCount);
	                        this.publishResponse(message.uid, {
	                            type: MessageType.BROADCAST_CLIENT_COUNT,
	                            data: {
	                                requestId: message.data.requestId,
	                                clientCount,
	                            },
	                        });
	                    }, (arg) => {
	                        debug("[%s] received acknowledgement with value %j", this.uid, arg);
	                        this.publishResponse(message.uid, {
	                            type: MessageType.BROADCAST_ACK,
	                            data: {
	                                requestId: message.data.requestId,
	                                packet: arg,
	                            },
	                        });
	                    });
	                }
	                else {
	                    const packet = message.data.packet;
	                    const opts = decodeOptions(message.data.opts);
	                    this.addOffsetIfNecessary(packet, opts, offset);
	                    super.broadcast(packet, opts);
	                }
	                break;
	            }
	            case MessageType.SOCKETS_JOIN:
	                super.addSockets(decodeOptions(message.data.opts), message.data.rooms);
	                break;
	            case MessageType.SOCKETS_LEAVE:
	                super.delSockets(decodeOptions(message.data.opts), message.data.rooms);
	                break;
	            case MessageType.DISCONNECT_SOCKETS:
	                super.disconnectSockets(decodeOptions(message.data.opts), message.data.close);
	                break;
	            case MessageType.FETCH_SOCKETS: {
	                debug("[%s] calling fetchSockets with opts %j", this.uid, message.data.opts);
	                super
	                    .fetchSockets(decodeOptions(message.data.opts))
	                    .then((localSockets) => {
	                    this.publishResponse(message.uid, {
	                        type: MessageType.FETCH_SOCKETS_RESPONSE,
	                        data: {
	                            requestId: message.data.requestId,
	                            sockets: localSockets.map((socket) => {
	                                // remove sessionStore from handshake, as it may contain circular references
	                                const _a = socket.handshake, { sessionStore } = _a, handshake = __rest(_a, ["sessionStore"]);
	                                return {
	                                    id: socket.id,
	                                    handshake,
	                                    rooms: [...socket.rooms],
	                                    data: socket.data,
	                                };
	                            }),
	                        },
	                    });
	                });
	                break;
	            }
	            case MessageType.SERVER_SIDE_EMIT: {
	                const packet = message.data.packet;
	                const withAck = message.data.requestId !== undefined;
	                if (!withAck) {
	                    this.nsp._onServerSideEmit(packet);
	                    return;
	                }
	                let called = false;
	                const callback = (arg) => {
	                    // only one argument is expected
	                    if (called) {
	                        return;
	                    }
	                    called = true;
	                    debug("[%s] calling acknowledgement with %j", this.uid, arg);
	                    this.publishResponse(message.uid, {
	                        type: MessageType.SERVER_SIDE_EMIT_RESPONSE,
	                        data: {
	                            requestId: message.data.requestId,
	                            packet: arg,
	                        },
	                    });
	                };
	                this.nsp._onServerSideEmit([...packet, callback]);
	                break;
	            }
	            // @ts-ignore
	            case MessageType.BROADCAST_CLIENT_COUNT:
	            // @ts-ignore
	            case MessageType.BROADCAST_ACK:
	            // @ts-ignore
	            case MessageType.FETCH_SOCKETS_RESPONSE:
	            // @ts-ignore
	            case MessageType.SERVER_SIDE_EMIT_RESPONSE:
	                // extending classes may not make a distinction between a ClusterMessage and a ClusterResponse payload and may
	                // always call the onMessage() method
	                this.onResponse(message);
	                break;
	            default:
	                debug("[%s] unknown message type: %s", this.uid, message.type);
	        }
	    }
	    /**
	     * Called when receiving a response from another member of the cluster.
	     *
	     * @param response
	     * @protected
	     */
	    onResponse(response) {
	        var _a, _b;
	        const requestId = response.data.requestId;
	        debug("[%s] received response %s to request %s", this.uid, response.type, requestId);
	        switch (response.type) {
	            case MessageType.BROADCAST_CLIENT_COUNT: {
	                (_a = this.ackRequests
	                    .get(requestId)) === null || _a === void 0 ? void 0 : _a.clientCountCallback(response.data.clientCount);
	                break;
	            }
	            case MessageType.BROADCAST_ACK: {
	                (_b = this.ackRequests.get(requestId)) === null || _b === void 0 ? void 0 : _b.ack(response.data.packet);
	                break;
	            }
	            case MessageType.FETCH_SOCKETS_RESPONSE: {
	                const request = this.requests.get(requestId);
	                if (!request) {
	                    return;
	                }
	                request.current++;
	                response.data.sockets.forEach((socket) => request.responses.push(socket));
	                if (request.current === request.expected) {
	                    clearTimeout(request.timeout);
	                    request.resolve(request.responses);
	                    this.requests.delete(requestId);
	                }
	                break;
	            }
	            case MessageType.SERVER_SIDE_EMIT_RESPONSE: {
	                const request = this.requests.get(requestId);
	                if (!request) {
	                    return;
	                }
	                request.current++;
	                request.responses.push(response.data.packet);
	                if (request.current === request.expected) {
	                    clearTimeout(request.timeout);
	                    request.resolve(null, request.responses);
	                    this.requests.delete(requestId);
	                }
	                break;
	            }
	            default:
	                // @ts-ignore
	                debug("[%s] unknown response type: %s", this.uid, response.type);
	        }
	    }
	    async broadcast(packet, opts) {
	        var _a;
	        const onlyLocal = (_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local;
	        if (!onlyLocal) {
	            try {
	                const offset = await this.publishAndReturnOffset({
	                    type: MessageType.BROADCAST,
	                    data: {
	                        packet,
	                        opts: encodeOptions(opts),
	                    },
	                });
	                this.addOffsetIfNecessary(packet, opts, offset);
	            }
	            catch (e) {
	                return debug("[%s] error while broadcasting message: %s", this.uid, e.message);
	            }
	        }
	        super.broadcast(packet, opts);
	    }
	    /**
	     * Adds an offset at the end of the data array in order to allow the client to receive any missed packets when it
	     * reconnects after a temporary disconnection.
	     *
	     * @param packet
	     * @param opts
	     * @param offset
	     * @private
	     */
	    addOffsetIfNecessary(packet, opts, offset) {
	        var _a;
	        if (!this.nsp.server.opts.connectionStateRecovery) {
	            return;
	        }
	        const isEventPacket = packet.type === 2;
	        // packets with acknowledgement are not stored because the acknowledgement function cannot be serialized and
	        // restored on another server upon reconnection
	        const withoutAcknowledgement = packet.id === undefined;
	        const notVolatile = ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.volatile) === undefined;
	        if (isEventPacket && withoutAcknowledgement && notVolatile) {
	            packet.data.push(offset);
	        }
	    }
	    broadcastWithAck(packet, opts, clientCountCallback, ack) {
	        var _a;
	        const onlyLocal = (_a = opts === null || opts === void 0 ? void 0 : opts.flags) === null || _a === void 0 ? void 0 : _a.local;
	        if (!onlyLocal) {
	            const requestId = randomId();
	            this.ackRequests.set(requestId, {
	                clientCountCallback,
	                ack,
	            });
	            this.publish({
	                type: MessageType.BROADCAST,
	                data: {
	                    packet,
	                    requestId,
	                    opts: encodeOptions(opts),
	                },
	            });
	            // we have no way to know at this level whether the server has received an acknowledgement from each client, so we
	            // will simply clean up the ackRequests map after the given delay
	            setTimeout(() => {
	                this.ackRequests.delete(requestId);
	            }, opts.flags.timeout);
	        }
	        super.broadcastWithAck(packet, opts, clientCountCallback, ack);
	    }
	    async addSockets(opts, rooms) {
	        var _a;
	        const onlyLocal = (_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local;
	        if (!onlyLocal) {
	            try {
	                await this.publishAndReturnOffset({
	                    type: MessageType.SOCKETS_JOIN,
	                    data: {
	                        opts: encodeOptions(opts),
	                        rooms,
	                    },
	                });
	            }
	            catch (e) {
	                debug("[%s] error while publishing message: %s", this.uid, e.message);
	            }
	        }
	        super.addSockets(opts, rooms);
	    }
	    async delSockets(opts, rooms) {
	        var _a;
	        const onlyLocal = (_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local;
	        if (!onlyLocal) {
	            try {
	                await this.publishAndReturnOffset({
	                    type: MessageType.SOCKETS_LEAVE,
	                    data: {
	                        opts: encodeOptions(opts),
	                        rooms,
	                    },
	                });
	            }
	            catch (e) {
	                debug("[%s] error while publishing message: %s", this.uid, e.message);
	            }
	        }
	        super.delSockets(opts, rooms);
	    }
	    async disconnectSockets(opts, close) {
	        var _a;
	        const onlyLocal = (_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local;
	        if (!onlyLocal) {
	            try {
	                await this.publishAndReturnOffset({
	                    type: MessageType.DISCONNECT_SOCKETS,
	                    data: {
	                        opts: encodeOptions(opts),
	                        close,
	                    },
	                });
	            }
	            catch (e) {
	                debug("[%s] error while publishing message: %s", this.uid, e.message);
	            }
	        }
	        super.disconnectSockets(opts, close);
	    }
	    async fetchSockets(opts) {
	        var _a;
	        const [localSockets, serverCount] = await Promise.all([
	            super.fetchSockets(opts),
	            this.serverCount(),
	        ]);
	        const expectedResponseCount = serverCount - 1;
	        if (((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local) || expectedResponseCount <= 0) {
	            return localSockets;
	        }
	        const requestId = randomId();
	        return new Promise((resolve, reject) => {
	            const timeout = setTimeout(() => {
	                const storedRequest = this.requests.get(requestId);
	                if (storedRequest) {
	                    reject(new Error(`timeout reached: only ${storedRequest.current} responses received out of ${storedRequest.expected}`));
	                    this.requests.delete(requestId);
	                }
	            }, opts.flags.timeout || DEFAULT_TIMEOUT);
	            const storedRequest = {
	                type: MessageType.FETCH_SOCKETS,
	                resolve,
	                timeout,
	                current: 0,
	                expected: expectedResponseCount,
	                responses: localSockets,
	            };
	            this.requests.set(requestId, storedRequest);
	            this.publish({
	                type: MessageType.FETCH_SOCKETS,
	                data: {
	                    opts: encodeOptions(opts),
	                    requestId,
	                },
	            });
	        });
	    }
	    async serverSideEmit(packet) {
	        const withAck = typeof packet[packet.length - 1] === "function";
	        if (!withAck) {
	            return this.publish({
	                type: MessageType.SERVER_SIDE_EMIT,
	                data: {
	                    packet,
	                },
	            });
	        }
	        const ack = packet.pop();
	        const expectedResponseCount = (await this.serverCount()) - 1;
	        debug('[%s] waiting for %d responses to "serverSideEmit" request', this.uid, expectedResponseCount);
	        if (expectedResponseCount <= 0) {
	            return ack(null, []);
	        }
	        const requestId = randomId();
	        const timeout = setTimeout(() => {
	            const storedRequest = this.requests.get(requestId);
	            if (storedRequest) {
	                ack(new Error(`timeout reached: only ${storedRequest.current} responses received out of ${storedRequest.expected}`), storedRequest.responses);
	                this.requests.delete(requestId);
	            }
	        }, DEFAULT_TIMEOUT);
	        const storedRequest = {
	            type: MessageType.SERVER_SIDE_EMIT,
	            resolve: ack,
	            timeout,
	            current: 0,
	            expected: expectedResponseCount,
	            responses: [],
	        };
	        this.requests.set(requestId, storedRequest);
	        this.publish({
	            type: MessageType.SERVER_SIDE_EMIT,
	            data: {
	                requestId,
	                packet,
	            },
	        });
	    }
	    publish(message) {
	        this.publishAndReturnOffset(message).catch((err) => {
	            debug("[%s] error while publishing message: %s", this.uid, err);
	        });
	    }
	    publishAndReturnOffset(message) {
	        message.uid = this.uid;
	        message.nsp = this.nsp.name;
	        return this.doPublish(message);
	    }
	    publishResponse(requesterUid, response) {
	        response.uid = this.uid;
	        response.nsp = this.nsp.name;
	        this.doPublishResponse(requesterUid, response).catch((err) => {
	            debug("[%s] error while publishing response: %s", this.uid, err);
	        });
	    }
	}
	exports$1.ClusterAdapter = ClusterAdapter;
	class ClusterAdapterWithHeartbeat extends ClusterAdapter {
	    constructor(nsp, opts) {
	        super(nsp);
	        this.nodesMap = new Map(); // uid => timestamp of last message
	        this.customRequests = new Map();
	        this._opts = Object.assign({
	            heartbeatInterval: 5000,
	            heartbeatTimeout: 10000,
	        }, opts);
	        this.cleanupTimer = setInterval(() => {
	            const now = Date.now();
	            this.nodesMap.forEach((lastSeen, uid) => {
	                const nodeSeemsDown = now - lastSeen > this._opts.heartbeatTimeout;
	                if (nodeSeemsDown) {
	                    debug("[%s] node %s seems down", this.uid, uid);
	                    this.removeNode(uid);
	                }
	            });
	        }, 1000);
	    }
	    init() {
	        this.publish({
	            type: MessageType.INITIAL_HEARTBEAT,
	        });
	    }
	    scheduleHeartbeat() {
	        if (this.heartbeatTimer) {
	            this.heartbeatTimer.refresh();
	        }
	        else {
	            this.heartbeatTimer = setTimeout(() => {
	                this.publish({
	                    type: MessageType.HEARTBEAT,
	                });
	            }, this._opts.heartbeatInterval);
	        }
	    }
	    close() {
	        this.publish({
	            type: MessageType.ADAPTER_CLOSE,
	        });
	        clearTimeout(this.heartbeatTimer);
	        if (this.cleanupTimer) {
	            clearInterval(this.cleanupTimer);
	        }
	    }
	    onMessage(message, offset) {
	        if (message.uid === this.uid) {
	            return debug("[%s] ignore message from self", this.uid);
	        }
	        if (message.uid && message.uid !== EMITTER_UID) {
	            // we track the UID of each sender, in order to know how many servers there are in the cluster
	            this.nodesMap.set(message.uid, Date.now());
	        }
	        debug("[%s] new event of type %d from %s", this.uid, message.type, message.uid);
	        switch (message.type) {
	            case MessageType.INITIAL_HEARTBEAT:
	                this.publish({
	                    type: MessageType.HEARTBEAT,
	                });
	                break;
	            case MessageType.HEARTBEAT:
	                // nothing to do
	                break;
	            case MessageType.ADAPTER_CLOSE:
	                this.removeNode(message.uid);
	                break;
	            default:
	                super.onMessage(message, offset);
	        }
	    }
	    serverCount() {
	        return Promise.resolve(1 + this.nodesMap.size);
	    }
	    publish(message) {
	        this.scheduleHeartbeat();
	        return super.publish(message);
	    }
	    async serverSideEmit(packet) {
	        const withAck = typeof packet[packet.length - 1] === "function";
	        if (!withAck) {
	            return this.publish({
	                type: MessageType.SERVER_SIDE_EMIT,
	                data: {
	                    packet,
	                },
	            });
	        }
	        const ack = packet.pop();
	        const expectedResponseCount = this.nodesMap.size;
	        debug('[%s] waiting for %d responses to "serverSideEmit" request', this.uid, expectedResponseCount);
	        if (expectedResponseCount <= 0) {
	            return ack(null, []);
	        }
	        const requestId = randomId();
	        const timeout = setTimeout(() => {
	            const storedRequest = this.customRequests.get(requestId);
	            if (storedRequest) {
	                ack(new Error(`timeout reached: missing ${storedRequest.missingUids.size} responses`), storedRequest.responses);
	                this.customRequests.delete(requestId);
	            }
	        }, DEFAULT_TIMEOUT);
	        const storedRequest = {
	            type: MessageType.SERVER_SIDE_EMIT,
	            resolve: ack,
	            timeout,
	            missingUids: new Set([...this.nodesMap.keys()]),
	            responses: [],
	        };
	        this.customRequests.set(requestId, storedRequest);
	        this.publish({
	            type: MessageType.SERVER_SIDE_EMIT,
	            data: {
	                requestId,
	                packet,
	            },
	        });
	    }
	    async fetchSockets(opts) {
	        var _a;
	        const [localSockets, serverCount] = await Promise.all([
	            super.fetchSockets({
	                rooms: opts.rooms,
	                except: opts.except,
	                flags: {
	                    local: true,
	                },
	            }),
	            this.serverCount(),
	        ]);
	        const expectedResponseCount = serverCount - 1;
	        if (((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local) || expectedResponseCount <= 0) {
	            return localSockets;
	        }
	        const requestId = randomId();
	        return new Promise((resolve, reject) => {
	            const timeout = setTimeout(() => {
	                const storedRequest = this.customRequests.get(requestId);
	                if (storedRequest) {
	                    reject(new Error(`timeout reached: missing ${storedRequest.missingUids.size} responses`));
	                    this.customRequests.delete(requestId);
	                }
	            }, opts.flags.timeout || DEFAULT_TIMEOUT);
	            const storedRequest = {
	                type: MessageType.FETCH_SOCKETS,
	                resolve,
	                timeout,
	                missingUids: new Set([...this.nodesMap.keys()]),
	                responses: localSockets,
	            };
	            this.customRequests.set(requestId, storedRequest);
	            this.publish({
	                type: MessageType.FETCH_SOCKETS,
	                data: {
	                    opts: encodeOptions(opts),
	                    requestId,
	                },
	            });
	        });
	    }
	    onResponse(response) {
	        const requestId = response.data.requestId;
	        debug("[%s] received response %s to request %s", this.uid, response.type, requestId);
	        switch (response.type) {
	            case MessageType.FETCH_SOCKETS_RESPONSE: {
	                const request = this.customRequests.get(requestId);
	                if (!request) {
	                    return;
	                }
	                response.data.sockets.forEach((socket) => request.responses.push(socket));
	                request.missingUids.delete(response.uid);
	                if (request.missingUids.size === 0) {
	                    clearTimeout(request.timeout);
	                    request.resolve(request.responses);
	                    this.customRequests.delete(requestId);
	                }
	                break;
	            }
	            case MessageType.SERVER_SIDE_EMIT_RESPONSE: {
	                const request = this.customRequests.get(requestId);
	                if (!request) {
	                    return;
	                }
	                request.responses.push(response.data.packet);
	                request.missingUids.delete(response.uid);
	                if (request.missingUids.size === 0) {
	                    clearTimeout(request.timeout);
	                    request.resolve(null, request.responses);
	                    this.customRequests.delete(requestId);
	                }
	                break;
	            }
	            default:
	                super.onResponse(response);
	        }
	    }
	    removeNode(uid) {
	        this.customRequests.forEach((request, requestId) => {
	            request.missingUids.delete(uid);
	            if (request.missingUids.size === 0) {
	                clearTimeout(request.timeout);
	                if (request.type === MessageType.FETCH_SOCKETS) {
	                    request.resolve(request.responses);
	                }
	                else if (request.type === MessageType.SERVER_SIDE_EMIT) {
	                    request.resolve(null, request.responses);
	                }
	                this.customRequests.delete(requestId);
	            }
	        });
	        this.nodesMap.delete(uid);
	    }
	}
	exports$1.ClusterAdapterWithHeartbeat = ClusterAdapterWithHeartbeat; 
} (clusterAdapter));

(function (exports$1) {
	Object.defineProperty(exports$1, "__esModule", { value: true });
	exports$1.MessageType = exports$1.ClusterAdapterWithHeartbeat = exports$1.ClusterAdapter = exports$1.SessionAwareAdapter = exports$1.Adapter = void 0;
	var in_memory_adapter_1 = inMemoryAdapter;
	Object.defineProperty(exports$1, "Adapter", { enumerable: true, get: function () { return in_memory_adapter_1.Adapter; } });
	Object.defineProperty(exports$1, "SessionAwareAdapter", { enumerable: true, get: function () { return in_memory_adapter_1.SessionAwareAdapter; } });
	var cluster_adapter_1 = clusterAdapter;
	Object.defineProperty(exports$1, "ClusterAdapter", { enumerable: true, get: function () { return cluster_adapter_1.ClusterAdapter; } });
	Object.defineProperty(exports$1, "ClusterAdapterWithHeartbeat", { enumerable: true, get: function () { return cluster_adapter_1.ClusterAdapterWithHeartbeat; } });
	Object.defineProperty(exports$1, "MessageType", { enumerable: true, get: function () { return cluster_adapter_1.MessageType; } }); 
} (dist$1));

var __importDefault$1 = (parentNamespace && parentNamespace.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(parentNamespace, "__esModule", { value: true });
parentNamespace.ParentNamespace = void 0;
const namespace_1 = namespace;
const socket_io_adapter_1$1 = dist$1;
const debug_1$1 = __importDefault$1(require$$13);
const debug$2 = (0, debug_1$1.default)("socket.io:parent-namespace");
/**
 * A parent namespace is a special {@link Namespace} that holds a list of child namespaces which were created either
 * with a regular expression or with a function.
 *
 * @example
 * const parentNamespace = io.of(/\/dynamic-\d+/);
 *
 * parentNamespace.on("connection", (socket) => {
 *   const childNamespace = socket.nsp;
 * }
 *
 * // will reach all the clients that are in one of the child namespaces, like "/dynamic-101"
 * parentNamespace.emit("hello", "world");
 *
 */
class ParentNamespace extends namespace_1.Namespace {
    constructor(server) {
        super(server, "/_" + ParentNamespace.count++);
        this.children = new Set();
    }
    /**
     * @private
     */
    _initAdapter() {
        this.adapter = new ParentBroadcastAdapter(this);
    }
    emit(ev, ...args) {
        this.children.forEach((nsp) => {
            nsp.emit(ev, ...args);
        });
        return true;
    }
    createChild(name) {
        debug$2("creating child namespace %s", name);
        const namespace = new namespace_1.Namespace(this.server, name);
        this["_fns"].forEach((fn) => namespace.use(fn));
        this.listeners("connect").forEach((listener) => namespace.on("connect", listener));
        this.listeners("connection").forEach((listener) => namespace.on("connection", listener));
        this.children.add(namespace);
        if (this.server._opts.cleanupEmptyChildNamespaces) {
            const remove = namespace._remove;
            namespace._remove = (socket) => {
                remove.call(namespace, socket);
                if (namespace.sockets.size === 0) {
                    debug$2("closing child namespace %s", name);
                    namespace.adapter.close();
                    this.server._nsps.delete(namespace.name);
                    this.children.delete(namespace);
                }
            };
        }
        this.server._nsps.set(name, namespace);
        // @ts-ignore
        this.server.sockets.emitReserved("new_namespace", namespace);
        return namespace;
    }
    fetchSockets() {
        // note: we could make the fetchSockets() method work for dynamic namespaces created with a regex (by sending the
        // regex to the other Socket.IO servers, and returning the sockets of each matching namespace for example), but
        // the behavior for namespaces created with a function is less clear
        // note²: we cannot loop over each children namespace, because with multiple Socket.IO servers, a given namespace
        // may exist on one node but not exist on another (since it is created upon client connection)
        throw new Error("fetchSockets() is not supported on parent namespaces");
    }
}
parentNamespace.ParentNamespace = ParentNamespace;
ParentNamespace.count = 0;
/**
 * A dummy adapter that only supports broadcasting to child (concrete) namespaces.
 * @private file
 */
class ParentBroadcastAdapter extends socket_io_adapter_1$1.Adapter {
    broadcast(packet, opts) {
        this.nsp.children.forEach((nsp) => {
            nsp.adapter.broadcast(packet, opts);
        });
    }
}

var uws = {};

var __importDefault = (uws && uws.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(uws, "__esModule", { value: true });
uws.patchAdapter = patchAdapter;
uws.restoreAdapter = restoreAdapter;
uws.serveFile = serveFile;
const socket_io_adapter_1 = dist$1;
const fs_1 = require$$1;
const debug_1 = __importDefault(require$$13);
const debug$1 = (0, debug_1.default)("socket.io:adapter-uws");
const SEPARATOR = "\x1f"; // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const { addAll, del, broadcast } = socket_io_adapter_1.Adapter.prototype;
function patchAdapter(app /* : TemplatedApp */) {
    socket_io_adapter_1.Adapter.prototype.addAll = function (id, rooms) {
        const isNew = !this.sids.has(id);
        addAll.call(this, id, rooms);
        const socket = this.nsp.sockets.get(id) || this.nsp._preConnectSockets.get(id);
        if (!socket) {
            return;
        }
        if (socket.conn.transport.name === "websocket") {
            subscribe(this.nsp.name, socket, isNew, rooms);
            return;
        }
        if (isNew) {
            socket.conn.on("upgrade", () => {
                const rooms = this.sids.get(id);
                if (rooms) {
                    subscribe(this.nsp.name, socket, isNew, rooms);
                }
            });
        }
    };
    socket_io_adapter_1.Adapter.prototype.del = function (id, room) {
        del.call(this, id, room);
        const socket = this.nsp.sockets.get(id) || this.nsp._preConnectSockets.get(id);
        if (socket && socket.conn.transport.name === "websocket") {
            // @ts-ignore
            const sessionId = socket.conn.id;
            // @ts-ignore
            const websocket = socket.conn.transport.socket;
            const topic = `${this.nsp.name}${SEPARATOR}${room}`;
            debug$1("unsubscribe connection %s from topic %s", sessionId, topic);
            websocket.unsubscribe(topic);
        }
    };
    socket_io_adapter_1.Adapter.prototype.broadcast = function (packet, opts) {
        const useFastPublish = opts.rooms.size <= 1 && opts.except.size === 0;
        if (!useFastPublish) {
            broadcast.call(this, packet, opts);
            return;
        }
        const flags = opts.flags || {};
        const basePacketOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this.encoder.encode(packet);
        const topic = opts.rooms.size === 0
            ? this.nsp.name
            : `${this.nsp.name}${SEPARATOR}${opts.rooms.keys().next().value}`;
        debug$1("fast publish to %s", topic);
        // fast publish for clients connected with WebSocket
        encodedPackets.forEach((encodedPacket) => {
            const isBinary = typeof encodedPacket !== "string";
            // "4" being the message type in the Engine.IO protocol, see https://github.com/socketio/engine.io-protocol
            app.publish(topic, isBinary ? encodedPacket : "4" + encodedPacket, isBinary);
        });
        this.apply(opts, (socket) => {
            if (socket.conn.transport.name !== "websocket") {
                // classic publish for clients connected with HTTP long-polling
                socket.client.writeToEngine(encodedPackets, basePacketOpts);
            }
        });
    };
}
function subscribe(namespaceName, socket, isNew, rooms) {
    // @ts-ignore
    const sessionId = socket.conn.id;
    // @ts-ignore
    const websocket = socket.conn.transport.socket;
    if (isNew) {
        debug$1("subscribe connection %s to topic %s", sessionId, namespaceName);
        websocket.subscribe(namespaceName);
    }
    rooms.forEach((room) => {
        const topic = `${namespaceName}${SEPARATOR}${room}`; // '#' can be used as wildcard
        debug$1("subscribe connection %s to topic %s", sessionId, topic);
        websocket.subscribe(topic);
    });
}
function restoreAdapter() {
    socket_io_adapter_1.Adapter.prototype.addAll = addAll;
    socket_io_adapter_1.Adapter.prototype.del = del;
    socket_io_adapter_1.Adapter.prototype.broadcast = broadcast;
}
const toArrayBuffer = (buffer) => {
    const { buffer: arrayBuffer, byteOffset, byteLength } = buffer;
    return arrayBuffer.slice(byteOffset, byteOffset + byteLength);
};
// imported from https://github.com/kolodziejczak-sz/uwebsocket-serve
function serveFile(res /* : HttpResponse */, filepath) {
    const { size } = (0, fs_1.statSync)(filepath);
    const readStream = (0, fs_1.createReadStream)(filepath);
    const destroyReadStream = () => !readStream.destroyed && readStream.destroy();
    const onError = (error) => {
        destroyReadStream();
        throw error;
    };
    const onDataChunk = (chunk) => {
        const arrayBufferChunk = toArrayBuffer(chunk);
        res.cork(() => {
            const lastOffset = res.getWriteOffset();
            const [ok, done] = res.tryEnd(arrayBufferChunk, size);
            if (!done && !ok) {
                readStream.pause();
                res.onWritable((offset) => {
                    const [ok, done] = res.tryEnd(arrayBufferChunk.slice(offset - lastOffset), size);
                    if (!done && ok) {
                        readStream.resume();
                    }
                    return ok;
                });
            }
        });
    };
    res.onAborted(destroyReadStream);
    readStream
        .on("data", onDataChunk)
        .on("error", onError)
        .on("end", destroyReadStream);
}

var version = "4.8.1";
const require$$18 = {
	version: version};

var dist = dist$2.exports;

(function (module, exports$1) {
	var __createBinding = (dist && dist.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (dist && dist.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (dist && dist.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __importDefault = (dist && dist.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports$1, "__esModule", { value: true });
	exports$1.Namespace = exports$1.Socket = exports$1.Server = void 0;
	const http = require$$0$2;
	const fs_1 = require$$1;
	const zlib_1 = require$$2$3;
	const accepts = accepts$2;
	const stream_1 = require$$4;
	const path = require$$5;
	const engine_io_1 = require$$6;
	const client_1 = client;
	const events_1 = require$$8;
	const namespace_1 = namespace;
	Object.defineProperty(exports$1, "Namespace", { enumerable: true, get: function () { return namespace_1.Namespace; } });
	const parent_namespace_1 = parentNamespace;
	const socket_io_adapter_1 = dist$1;
	const parser$1 = __importStar(parser);
	const debug_1 = __importDefault(require$$13);
	const socket_1 = socket;
	Object.defineProperty(exports$1, "Socket", { enumerable: true, get: function () { return socket_1.Socket; } });
	const typed_events_1 = typedEvents;
	const uws_1 = uws;
	const cors_1 = __importDefault(require$$17);
	const debug = (0, debug_1.default)("socket.io:server");
	const clientVersion = require$$18.version;
	const dotMapRegex = /\.map/;
	/**
	 * Represents a Socket.IO server.
	 *
	 * @example
	 * import { Server } from "socket.io";
	 *
	 * const io = new Server();
	 *
	 * io.on("connection", (socket) => {
	 *   console.log(`socket ${socket.id} connected`);
	 *
	 *   // send an event to the client
	 *   socket.emit("foo", "bar");
	 *
	 *   socket.on("foobar", () => {
	 *     // an event was received from the client
	 *   });
	 *
	 *   // upon disconnection
	 *   socket.on("disconnect", (reason) => {
	 *     console.log(`socket ${socket.id} disconnected due to ${reason}`);
	 *   });
	 * });
	 *
	 * io.listen(3000);
	 */
	class Server extends typed_events_1.StrictEventEmitter {
	    constructor(srv, opts = {}) {
	        super();
	        /**
	         * @private
	         */
	        this._nsps = new Map();
	        this.parentNsps = new Map();
	        /**
	         * A subset of the {@link parentNsps} map, only containing {@link ParentNamespace} which are based on a regular
	         * expression.
	         *
	         * @private
	         */
	        this.parentNamespacesFromRegExp = new Map();
	        if ("object" === typeof srv &&
	            srv instanceof Object &&
	            !srv.listen) {
	            opts = srv;
	            srv = undefined;
	        }
	        this.path(opts.path || "/socket.io");
	        this.connectTimeout(opts.connectTimeout || 45000);
	        this.serveClient(false !== opts.serveClient);
	        this._parser = opts.parser || parser$1;
	        this.encoder = new this._parser.Encoder();
	        this.opts = opts;
	        if (opts.connectionStateRecovery) {
	            opts.connectionStateRecovery = Object.assign({
	                maxDisconnectionDuration: 2 * 60 * 1000,
	                skipMiddlewares: true,
	            }, opts.connectionStateRecovery);
	            this.adapter(opts.adapter || socket_io_adapter_1.SessionAwareAdapter);
	        }
	        else {
	            this.adapter(opts.adapter || socket_io_adapter_1.Adapter);
	        }
	        opts.cleanupEmptyChildNamespaces = !!opts.cleanupEmptyChildNamespaces;
	        this.sockets = this.of("/");
	        if (srv || typeof srv == "number")
	            this.attach(srv);
	        if (this.opts.cors) {
	            this._corsMiddleware = (0, cors_1.default)(this.opts.cors);
	        }
	    }
	    get _opts() {
	        return this.opts;
	    }
	    serveClient(v) {
	        if (!arguments.length)
	            return this._serveClient;
	        this._serveClient = v;
	        return this;
	    }
	    /**
	     * Executes the middleware for an incoming namespace not already created on the server.
	     *
	     * @param name - name of incoming namespace
	     * @param auth - the auth parameters
	     * @param fn - callback
	     *
	     * @private
	     */
	    _checkNamespace(name, auth, fn) {
	        if (this.parentNsps.size === 0)
	            return fn(false);
	        const keysIterator = this.parentNsps.keys();
	        const run = () => {
	            const nextFn = keysIterator.next();
	            if (nextFn.done) {
	                return fn(false);
	            }
	            nextFn.value(name, auth, (err, allow) => {
	                if (err || !allow) {
	                    return run();
	                }
	                if (this._nsps.has(name)) {
	                    // the namespace was created in the meantime
	                    debug("dynamic namespace %s already exists", name);
	                    return fn(this._nsps.get(name));
	                }
	                const namespace = this.parentNsps.get(nextFn.value).createChild(name);
	                debug("dynamic namespace %s was created", name);
	                fn(namespace);
	            });
	        };
	        run();
	    }
	    path(v) {
	        if (!arguments.length)
	            return this._path;
	        this._path = v.replace(/\/$/, "");
	        const escapedPath = this._path.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	        this.clientPathRegex = new RegExp("^" +
	            escapedPath +
	            "/socket\\.io(\\.msgpack|\\.esm)?(\\.min)?\\.js(\\.map)?(?:\\?|$)");
	        return this;
	    }
	    connectTimeout(v) {
	        if (v === undefined)
	            return this._connectTimeout;
	        this._connectTimeout = v;
	        return this;
	    }
	    adapter(v) {
	        if (!arguments.length)
	            return this._adapter;
	        this._adapter = v;
	        for (const nsp of this._nsps.values()) {
	            nsp._initAdapter();
	        }
	        return this;
	    }
	    /**
	     * Attaches socket.io to a server or port.
	     *
	     * @param srv - server or port
	     * @param opts - options passed to engine.io
	     * @return self
	     */
	    listen(srv, opts = {}) {
	        return this.attach(srv, opts);
	    }
	    /**
	     * Attaches socket.io to a server or port.
	     *
	     * @param srv - server or port
	     * @param opts - options passed to engine.io
	     * @return self
	     */
	    attach(srv, opts = {}) {
	        if ("function" == typeof srv) {
	            const msg = "You are trying to attach socket.io to an express " +
	                "request handler function. Please pass a http.Server instance.";
	            throw new Error(msg);
	        }
	        // handle a port as a string
	        if (Number(srv) == srv) {
	            srv = Number(srv);
	        }
	        if ("number" == typeof srv) {
	            debug("creating http server and binding to %d", srv);
	            const port = srv;
	            srv = http.createServer((req, res) => {
	                res.writeHead(404);
	                res.end();
	            });
	            srv.listen(port);
	        }
	        // merge the options passed to the Socket.IO server
	        Object.assign(opts, this.opts);
	        // set engine.io path to `/socket.io`
	        opts.path = opts.path || this._path;
	        this.initEngine(srv, opts);
	        return this;
	    }
	    attachApp(app /*: TemplatedApp */, opts = {}) {
	        // merge the options passed to the Socket.IO server
	        Object.assign(opts, this.opts);
	        // set engine.io path to `/socket.io`
	        opts.path = opts.path || this._path;
	        // initialize engine
	        debug("creating uWebSockets.js-based engine with opts %j", opts);
	        const engine = new engine_io_1.uServer(opts);
	        engine.attach(app, opts);
	        // bind to engine events
	        this.bind(engine);
	        if (this._serveClient) {
	            // attach static file serving
	            app.get(`${this._path}/*`, (res, req) => {
	                if (!this.clientPathRegex.test(req.getUrl())) {
	                    req.setYield(true);
	                    return;
	                }
	                const filename = req
	                    .getUrl()
	                    .replace(this._path, "")
	                    .replace(/\?.*$/, "")
	                    .replace(/^\//, "");
	                const isMap = dotMapRegex.test(filename);
	                const type = isMap ? "map" : "source";
	                // Per the standard, ETags must be quoted:
	                // https://tools.ietf.org/html/rfc7232#section-2.3
	                const expectedEtag = '"' + clientVersion + '"';
	                const weakEtag = "W/" + expectedEtag;
	                const etag = req.getHeader("if-none-match");
	                if (etag) {
	                    if (expectedEtag === etag || weakEtag === etag) {
	                        debug("serve client %s 304", type);
	                        res.writeStatus("304 Not Modified");
	                        res.end();
	                        return;
	                    }
	                }
	                debug("serve client %s", type);
	                res.writeHeader("cache-control", "public, max-age=0");
	                res.writeHeader("content-type", "application/" + (isMap ? "json" : "javascript") + "; charset=utf-8");
	                res.writeHeader("etag", expectedEtag);
	                const filepath = path.join(__dirname, "../client-dist/", filename);
	                (0, uws_1.serveFile)(res, filepath);
	            });
	        }
	        (0, uws_1.patchAdapter)(app);
	    }
	    /**
	     * Initialize engine
	     *
	     * @param srv - the server to attach to
	     * @param opts - options passed to engine.io
	     * @private
	     */
	    initEngine(srv, opts) {
	        // initialize engine
	        debug("creating engine.io instance with opts %j", opts);
	        this.eio = (0, engine_io_1.attach)(srv, opts);
	        // attach static file serving
	        if (this._serveClient)
	            this.attachServe(srv);
	        // Export http server
	        this.httpServer = srv;
	        // bind to engine events
	        this.bind(this.eio);
	    }
	    /**
	     * Attaches the static file serving.
	     *
	     * @param srv http server
	     * @private
	     */
	    attachServe(srv) {
	        debug("attaching client serving req handler");
	        const evs = srv.listeners("request").slice(0);
	        srv.removeAllListeners("request");
	        srv.on("request", (req, res) => {
	            if (this.clientPathRegex.test(req.url)) {
	                if (this._corsMiddleware) {
	                    this._corsMiddleware(req, res, () => {
	                        this.serve(req, res);
	                    });
	                }
	                else {
	                    this.serve(req, res);
	                }
	            }
	            else {
	                for (let i = 0; i < evs.length; i++) {
	                    evs[i].call(srv, req, res);
	                }
	            }
	        });
	    }
	    /**
	     * Handles a request serving of client source and map
	     *
	     * @param req
	     * @param res
	     * @private
	     */
	    serve(req, res) {
	        const filename = req.url.replace(this._path, "").replace(/\?.*$/, "");
	        const isMap = dotMapRegex.test(filename);
	        const type = isMap ? "map" : "source";
	        // Per the standard, ETags must be quoted:
	        // https://tools.ietf.org/html/rfc7232#section-2.3
	        const expectedEtag = '"' + clientVersion + '"';
	        const weakEtag = "W/" + expectedEtag;
	        const etag = req.headers["if-none-match"];
	        if (etag) {
	            if (expectedEtag === etag || weakEtag === etag) {
	                debug("serve client %s 304", type);
	                res.writeHead(304);
	                res.end();
	                return;
	            }
	        }
	        debug("serve client %s", type);
	        res.setHeader("Cache-Control", "public, max-age=0");
	        res.setHeader("Content-Type", "application/" + (isMap ? "json" : "javascript") + "; charset=utf-8");
	        res.setHeader("ETag", expectedEtag);
	        Server.sendFile(filename, req, res);
	    }
	    /**
	     * @param filename
	     * @param req
	     * @param res
	     * @private
	     */
	    static sendFile(filename, req, res) {
	        const readStream = (0, fs_1.createReadStream)(path.join(__dirname, "../client-dist/", filename));
	        const encoding = accepts(req).encodings(["br", "gzip", "deflate"]);
	        const onError = (err) => {
	            if (err) {
	                res.end();
	            }
	        };
	        switch (encoding) {
	            case "br":
	                res.writeHead(200, { "content-encoding": "br" });
	                (0, stream_1.pipeline)(readStream, (0, zlib_1.createBrotliCompress)(), res, onError);
	                break;
	            case "gzip":
	                res.writeHead(200, { "content-encoding": "gzip" });
	                (0, stream_1.pipeline)(readStream, (0, zlib_1.createGzip)(), res, onError);
	                break;
	            case "deflate":
	                res.writeHead(200, { "content-encoding": "deflate" });
	                (0, stream_1.pipeline)(readStream, (0, zlib_1.createDeflate)(), res, onError);
	                break;
	            default:
	                res.writeHead(200);
	                (0, stream_1.pipeline)(readStream, res, onError);
	        }
	    }
	    /**
	     * Binds socket.io to an engine.io instance.
	     *
	     * @param engine engine.io (or compatible) server
	     * @return self
	     */
	    bind(engine) {
	        // TODO apply strict types to the engine: "connection" event, `close()` and a method to serve static content
	        //  this would allow to provide any custom engine, like one based on Deno or Bun built-in HTTP server
	        this.engine = engine;
	        this.engine.on("connection", this.onconnection.bind(this));
	        return this;
	    }
	    /**
	     * Called with each incoming transport connection.
	     *
	     * @param {engine.Socket} conn
	     * @return self
	     * @private
	     */
	    onconnection(conn) {
	        debug("incoming connection with id %s", conn.id);
	        const client = new client_1.Client(this, conn);
	        if (conn.protocol === 3) {
	            // @ts-ignore
	            client.connect("/");
	        }
	        return this;
	    }
	    /**
	     * Looks up a namespace.
	     *
	     * @example
	     * // with a simple string
	     * const myNamespace = io.of("/my-namespace");
	     *
	     * // with a regex
	     * const dynamicNsp = io.of(/^\/dynamic-\d+$/).on("connection", (socket) => {
	     *   const namespace = socket.nsp; // newNamespace.name === "/dynamic-101"
	     *
	     *   // broadcast to all clients in the given sub-namespace
	     *   namespace.emit("hello");
	     * });
	     *
	     * @param name - nsp name
	     * @param fn optional, nsp `connection` ev handler
	     */
	    of(name, fn) {
	        if (typeof name === "function" || name instanceof RegExp) {
	            const parentNsp = new parent_namespace_1.ParentNamespace(this);
	            debug("initializing parent namespace %s", parentNsp.name);
	            if (typeof name === "function") {
	                this.parentNsps.set(name, parentNsp);
	            }
	            else {
	                this.parentNsps.set((nsp, conn, next) => next(null, name.test(nsp)), parentNsp);
	                this.parentNamespacesFromRegExp.set(name, parentNsp);
	            }
	            if (fn) {
	                // @ts-ignore
	                parentNsp.on("connect", fn);
	            }
	            return parentNsp;
	        }
	        if (String(name)[0] !== "/")
	            name = "/" + name;
	        let nsp = this._nsps.get(name);
	        if (!nsp) {
	            for (const [regex, parentNamespace] of this.parentNamespacesFromRegExp) {
	                if (regex.test(name)) {
	                    debug("attaching namespace %s to parent namespace %s", name, regex);
	                    return parentNamespace.createChild(name);
	                }
	            }
	            debug("initializing namespace %s", name);
	            nsp = new namespace_1.Namespace(this, name);
	            this._nsps.set(name, nsp);
	            if (name !== "/") {
	                // @ts-ignore
	                this.sockets.emitReserved("new_namespace", nsp);
	            }
	        }
	        if (fn)
	            nsp.on("connect", fn);
	        return nsp;
	    }
	    /**
	     * Closes server connection
	     *
	     * @param [fn] optional, called as `fn([err])` on error OR all conns closed
	     */
	    async close(fn) {
	        await Promise.allSettled([...this._nsps.values()].map(async (nsp) => {
	            nsp.sockets.forEach((socket) => {
	                socket._onclose("server shutting down");
	            });
	            await nsp.adapter.close();
	        }));
	        this.engine.close();
	        // restore the Adapter prototype, when the Socket.IO server was attached to a uWebSockets.js server
	        (0, uws_1.restoreAdapter)();
	        if (this.httpServer) {
	            this.httpServer.close(fn);
	        }
	        else {
	            fn && fn();
	        }
	    }
	    /**
	     * Registers a middleware, which is a function that gets executed for every incoming {@link Socket}.
	     *
	     * @example
	     * io.use((socket, next) => {
	     *   // ...
	     *   next();
	     * });
	     *
	     * @param fn - the middleware function
	     */
	    use(fn) {
	        this.sockets.use(fn);
	        return this;
	    }
	    /**
	     * Targets a room when emitting.
	     *
	     * @example
	     * // the “foo” event will be broadcast to all connected clients in the “room-101” room
	     * io.to("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms (a client will be notified at most once)
	     * io.to(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * io.to("room-101").to("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    to(room) {
	        return this.sockets.to(room);
	    }
	    /**
	     * Targets a room when emitting. Similar to `to()`, but might feel clearer in some cases:
	     *
	     * @example
	     * // disconnect all clients in the "room-101" room
	     * io.in("room-101").disconnectSockets();
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    in(room) {
	        return this.sockets.in(room);
	    }
	    /**
	     * Excludes a room when emitting.
	     *
	     * @example
	     * // the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
	     * io.except("room-101").emit("foo", "bar");
	     *
	     * // with an array of rooms
	     * io.except(["room-101", "room-102"]).emit("foo", "bar");
	     *
	     * // with multiple chained calls
	     * io.except("room-101").except("room-102").emit("foo", "bar");
	     *
	     * @param room - a room, or an array of rooms
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    except(room) {
	        return this.sockets.except(room);
	    }
	    /**
	     * Sends a `message` event to all clients.
	     *
	     * This method mimics the WebSocket.send() method.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
	     *
	     * @example
	     * io.send("hello");
	     *
	     * // this is equivalent to
	     * io.emit("message", "hello");
	     *
	     * @return self
	     */
	    send(...args) {
	        // This type-cast is needed because EmitEvents likely doesn't have `message` as a key.
	        // if you specify the EmitEvents, the type of args will be never.
	        this.sockets.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a `message` event to all clients. Alias of {@link send}.
	     *
	     * @return self
	     */
	    write(...args) {
	        // This type-cast is needed because EmitEvents likely doesn't have `message` as a key.
	        // if you specify the EmitEvents, the type of args will be never.
	        this.sockets.emit("message", ...args);
	        return this;
	    }
	    /**
	     * Sends a message to the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * io.serverSideEmit("hello", "world");
	     *
	     * io.on("hello", (arg1) => {
	     *   console.log(arg1); // prints "world"
	     * });
	     *
	     * // acknowledgements (without binary content) are supported too:
	     * io.serverSideEmit("ping", (err, responses) => {
	     *  if (err) {
	     *     // some servers did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per server (except the current one)
	     *   }
	     * });
	     *
	     * io.on("ping", (cb) => {
	     *   cb("pong");
	     * });
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments, which may include an acknowledgement callback at the end
	     */
	    serverSideEmit(ev, ...args) {
	        return this.sockets.serverSideEmit(ev, ...args);
	    }
	    /**
	     * Sends a message and expect an acknowledgement from the other Socket.IO servers of the cluster.
	     *
	     * @example
	     * try {
	     *   const responses = await io.serverSideEmitWithAck("ping");
	     *   console.log(responses); // one response per server (except the current one)
	     * } catch (e) {
	     *   // some servers did not acknowledge the event in the given delay
	     * }
	     *
	     * @param ev - the event name
	     * @param args - an array of arguments
	     *
	     * @return a Promise that will be fulfilled when all servers have acknowledged the event
	     */
	    serverSideEmitWithAck(ev, ...args) {
	        return this.sockets.serverSideEmitWithAck(ev, ...args);
	    }
	    /**
	     * Gets a list of socket ids.
	     *
	     * @deprecated this method will be removed in the next major release, please use {@link Server#serverSideEmit} or
	     * {@link Server#fetchSockets} instead.
	     */
	    allSockets() {
	        return this.sockets.allSockets();
	    }
	    /**
	     * Sets the compress flag.
	     *
	     * @example
	     * io.compress(false).emit("hello");
	     *
	     * @param compress - if `true`, compresses the sending data
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    compress(compress) {
	        return this.sockets.compress(compress);
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
	     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
	     * and is in the middle of a request-response cycle).
	     *
	     * @example
	     * io.volatile.emit("hello"); // the clients may or may not receive it
	     *
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    get volatile() {
	        return this.sockets.volatile;
	    }
	    /**
	     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
	     *
	     * @example
	     * // the “foo” event will be broadcast to all connected clients on this node
	     * io.local.emit("foo", "bar");
	     *
	     * @return a new {@link BroadcastOperator} instance for chaining
	     */
	    get local() {
	        return this.sockets.local;
	    }
	    /**
	     * Adds a timeout in milliseconds for the next operation.
	     *
	     * @example
	     * io.timeout(1000).emit("some-event", (err, responses) => {
	     *   if (err) {
	     *     // some clients did not acknowledge the event in the given delay
	     *   } else {
	     *     console.log(responses); // one response per client
	     *   }
	     * });
	     *
	     * @param timeout
	     */
	    timeout(timeout) {
	        return this.sockets.timeout(timeout);
	    }
	    /**
	     * Returns the matching socket instances.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // return all Socket instances
	     * const sockets = await io.fetchSockets();
	     *
	     * // return all Socket instances in the "room1" room
	     * const sockets = await io.in("room1").fetchSockets();
	     *
	     * for (const socket of sockets) {
	     *   console.log(socket.id);
	     *   console.log(socket.handshake);
	     *   console.log(socket.rooms);
	     *   console.log(socket.data);
	     *
	     *   socket.emit("hello");
	     *   socket.join("room1");
	     *   socket.leave("room2");
	     *   socket.disconnect();
	     * }
	     */
	    fetchSockets() {
	        return this.sockets.fetchSockets();
	    }
	    /**
	     * Makes the matching socket instances join the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     *
	     * // make all socket instances join the "room1" room
	     * io.socketsJoin("room1");
	     *
	     * // make all socket instances in the "room1" room join the "room2" and "room3" rooms
	     * io.in("room1").socketsJoin(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsJoin(room) {
	        return this.sockets.socketsJoin(room);
	    }
	    /**
	     * Makes the matching socket instances leave the specified rooms.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // make all socket instances leave the "room1" room
	     * io.socketsLeave("room1");
	     *
	     * // make all socket instances in the "room1" room leave the "room2" and "room3" rooms
	     * io.in("room1").socketsLeave(["room2", "room3"]);
	     *
	     * @param room - a room, or an array of rooms
	     */
	    socketsLeave(room) {
	        return this.sockets.socketsLeave(room);
	    }
	    /**
	     * Makes the matching socket instances disconnect.
	     *
	     * Note: this method also works within a cluster of multiple Socket.IO servers, with a compatible {@link Adapter}.
	     *
	     * @example
	     * // make all socket instances disconnect (the connections might be kept alive for other namespaces)
	     * io.disconnectSockets();
	     *
	     * // make all socket instances in the "room1" room disconnect and close the underlying connections
	     * io.in("room1").disconnectSockets(true);
	     *
	     * @param close - whether to close the underlying connection
	     */
	    disconnectSockets(close = false) {
	        return this.sockets.disconnectSockets(close);
	    }
	}
	exports$1.Server = Server;
	/**
	 * Expose main namespace (/).
	 */
	const emitterMethods = Object.keys(events_1.EventEmitter.prototype).filter(function (key) {
	    return typeof events_1.EventEmitter.prototype[key] === "function";
	});
	emitterMethods.forEach(function (fn) {
	    Server.prototype[fn] = function () {
	        return this.sockets[fn].apply(this.sockets, arguments);
	    };
	});
	module.exports = (srv, opts) => new Server(srv, opts);
	module.exports.Server = Server;
	module.exports.Namespace = namespace_1.Namespace;
	module.exports.Socket = socket_1.Socket; 
} (dist$2, dist$2.exports));

var distExports = dist$2.exports;
const io = /*@__PURE__*/getDefaultExportFromCjs(distExports);

const {Server, Namespace, Socket} = io;

const config = useRuntimeConfig();
function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    roles: user.roles
  };
  return jwt$1.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
}
function generateRefreshToken(userId) {
  return jwt$1.sign({ userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn
  });
}
function verifyAccessToken(token) {
  try {
    return jwt$1.verify(token, config.jwtSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw createError$1({
        statusCode: 401,
        message: "Session expired due to inactivity"
      });
    }
    throw createError$1({
      statusCode: 401,
      message: "Invalid or expired token"
    });
  }
}

const jwt = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  generateAccessToken: generateAccessToken,
  generateRefreshToken: generateRefreshToken,
  verifyAccessToken: verifyAccessToken
}, Symbol.toStringTag, { value: 'Module' }));

let pool = null;
function getDatabase() {
  const config = useRuntimeConfig();
  if (!pool) {
    const connectionConfig = {
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "50"),
      // ✅ Increased from 10 to 50 for better concurrency
      queueLimit: 0,
      acquireTimeout: 6e4,
      // ✅ 60 seconds timeout
      timeout: 6e4,
      // ✅ 60 seconds query timeout
      timezone: "+07:00",
      // Asia/Bangkok
      dateStrings: false,
      enableKeepAlive: true,
      // ✅ Keep connections alive
      keepAliveInitialDelay: 0
    };
    if (process.env.DB_SOCKET) {
      connectionConfig.socketPath = process.env.DB_SOCKET;
      console.log("[Database] \u2705 Using socket connection:", process.env.DB_SOCKET);
    } else {
      connectionConfig.host = config.dbHost || "localhost";
      connectionConfig.port = config.dbPort || 3307;
      console.log("[Database] \u2705 Using TCP connection:", `${connectionConfig.host}:${connectionConfig.port}`);
    }
    pool = mysql.createPool(connectionConfig);
  }
  return pool;
}
async function query(sql, params) {
  try {
    const db = getDatabase();
    const [rows] = await db.execute(sql, params || []);
    return rows;
  } catch (error) {
    console.error("[Database] Query error:", {
      sql,
      params,
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}
async function queryOne(sql, params) {
  const results = await query(sql, params);
  return results[0] || null;
}
async function execute(sql, params) {
  const db = getDatabase();
  const [result] = await db.execute(sql, params);
  return result;
}

const db = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  execute: execute,
  getDatabase: getDatabase,
  query: query,
  queryOne: queryOne
}, Symbol.toStringTag, { value: 'Module' }));

var UserStatus = /* @__PURE__ */ ((UserStatus2) => {
  UserStatus2["ACTIVE"] = "active";
  UserStatus2["INACTIVE"] = "inactive";
  UserStatus2["SUSPENDED"] = "suspended";
  return UserStatus2;
})(UserStatus || {});
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["STUDENT"] = "student";
  UserRole2["TUTOR"] = "tutor";
  UserRole2["PARENT"] = "parent";
  UserRole2["BRANCH_ADMIN"] = "branch_admin";
  UserRole2["ADMIN"] = "admin";
  UserRole2["OWNER"] = "owner";
  UserRole2["SYSTEM_ADMIN"] = "system_admin";
  return UserRole2;
})(UserRole || {});
const ROLE_PRIORITY = {
  ["system_admin" /* SYSTEM_ADMIN */]: 1,
  ["owner" /* OWNER */]: 2,
  ["admin" /* ADMIN */]: 3,
  ["branch_admin" /* BRANCH_ADMIN */]: 4,
  ["tutor" /* TUTOR */]: 5,
  ["parent" /* PARENT */]: 6,
  ["student" /* STUDENT */]: 7
};
function getHighestPriorityRole(roles) {
  if (!roles || roles.length === 0) return null;
  return roles.reduce((highest, role) => {
    const currentPriority = ROLE_PRIORITY[role] || 999;
    const highestPriority = ROLE_PRIORITY[highest] || 999;
    return currentPriority < highestPriority ? role : highest;
  });
}
function hasRoleOrHigher(userRoles, minRole) {
  if (!userRoles || userRoles.length === 0) return false;
  const minPriority = ROLE_PRIORITY[minRole] || 999;
  return userRoles.some((role) => {
    const rolePriority = ROLE_PRIORITY[role] || 999;
    return rolePriority <= minPriority;
  });
}

const user_types = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROLE_PRIORITY: ROLE_PRIORITY,
  UserRole: UserRole,
  UserStatus: UserStatus,
  getHighestPriorityRole: getHighestPriorityRole,
  hasRoleOrHigher: hasRoleOrHigher
}, Symbol.toStringTag, { value: 'Module' }));

async function findUserByEmail(email) {
  return queryOne(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
}
async function findUserByIdentifier(identifier) {
  return queryOne(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [identifier, identifier]
  );
}
async function findUserById(id) {
  return queryOne(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
}
async function getUserRoles(userId) {
  const roles = await query(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return roles.map((r) => r.name);
}
async function getUserWithRoles(userId) {
  const user = await findUserById(userId);
  if (!user) return null;
  const roles = await getUserRoles(userId);
  const { password_hash, ...publicUser } = user;
  return { ...publicUser, roles };
}
async function createUser(data, defaultRole = UserRole.STUDENT) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  const result = await execute(
    `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.username,
      data.email || null,
      passwordHash,
      data.first_name,
      data.last_name,
      data.phone || null,
      UserStatus.ACTIVE
    ]
  );
  const role = await queryOne(
    "SELECT id FROM roles WHERE name = ?",
    [defaultRole]
  );
  if (role) {
    await execute(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [result.insertId, role.id]
    );
  }
  const user = await findUserById(result.insertId);
  if (!user) throw createError$1({ statusCode: 500, message: "Failed to create user" });
  return user;
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
async function login(credentials) {
  console.log("[Auth Service] Finding user by identifier:", credentials.username);
  const user = await findUserByIdentifier(credentials.username);
  if (!user) {
    console.log("[Auth Service] User not found:", credentials.username);
    throw createError$1({
      statusCode: 401,
      message: "\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
    });
  }
  console.log("[Auth Service] User found:", user.id, user.username, user.status);
  if (user.status !== UserStatus.ACTIVE) {
    console.log("[Auth Service] Account is not active:", user.status);
    throw createError$1({
      statusCode: 403,
      message: "Account is not active"
    });
  }
  console.log("[Auth Service] Getting password hash for user:", user.id);
  const userWithPassword = await queryOne(
    "SELECT password_hash FROM users WHERE id = ?",
    [user.id]
  );
  if (!userWithPassword) {
    console.log("[Auth Service] Password hash not found for user:", user.id);
    throw createError$1({
      statusCode: 401,
      message: "\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
    });
  }
  console.log("[Auth Service] Verifying password...");
  const isValid = await verifyPassword(credentials.password, userWithPassword.password_hash);
  if (!isValid) {
    console.log("[Auth Service] Password verification failed");
    throw createError$1({
      statusCode: 401,
      message: "\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
    });
  }
  console.log("[Auth Service] Password verified successfully");
  const userWithRoles = await getUserWithRoles(user.id);
  if (!userWithRoles) {
    throw createError$1({
      statusCode: 500,
      message: "Failed to get user roles"
    });
  }
  const accessToken = generateAccessToken(userWithRoles);
  const refreshToken = generateRefreshToken(user.id);
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await execute(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, refreshToken, expiresAt]
  );
  return {
    user: userWithRoles,
    accessToken,
    refreshToken
  };
}

const auth_service = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  createUser: createUser,
  findUserByEmail: findUserByEmail,
  findUserById: findUserById,
  findUserByIdentifier: findUserByIdentifier,
  getUserRoles: getUserRoles,
  getUserWithRoles: getUserWithRoles,
  login: login,
  verifyPassword: verifyPassword
}, Symbol.toStringTag, { value: 'Module' }));

async function getUserChatRooms(userId) {
  const rooms = await query(`
    SELECT 
      cr.*,
      c.title as course_title,
      c.code as course_code,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.avatar_url as student_avatar_url,
      t.first_name as tutor_first_name,
      t.last_name as tutor_last_name,
      t.avatar_url as tutor_avatar_url,
      (
        SELECT COUNT(*) 
        FROM chat_messages cm 
        WHERE cm.room_id = cr.id 
        AND cm.sender_id != ? 
        AND cm.is_read = FALSE
      ) as unread_count
    FROM chat_rooms cr
    INNER JOIN courses c ON cr.course_id = c.id
    INNER JOIN users s ON cr.student_id = s.id
    INNER JOIN users t ON cr.tutor_id = t.id
    WHERE (cr.student_id = ? OR cr.tutor_id = ?)
    AND cr.status = 'active'
    ORDER BY cr.last_message_at DESC, cr.created_at DESC
  `, [userId, userId, userId]);
  return rooms.map((room) => ({
    id: room.id,
    course_id: room.course_id,
    student_id: room.student_id,
    tutor_id: room.tutor_id,
    status: room.status,
    last_message_at: room.last_message_at,
    created_at: room.created_at,
    updated_at: room.updated_at,
    course: {
      id: room.course_id,
      title: room.course_title,
      code: room.course_code
    },
    student: {
      id: room.student_id,
      first_name: room.student_first_name,
      last_name: room.student_last_name,
      avatar_url: room.student_avatar_url
    },
    tutor: {
      id: room.tutor_id,
      first_name: room.tutor_first_name,
      last_name: room.tutor_last_name,
      avatar_url: room.tutor_avatar_url
    },
    unread_count: parseInt(room.unread_count) || 0
  }));
}
async function getChatRoom(roomId) {
  const rooms = await query(`
    SELECT 
      cr.*,
      c.title as course_title,
      c.code as course_code,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.avatar_url as student_avatar_url,
      t.first_name as tutor_first_name,
      t.last_name as tutor_last_name,
      t.avatar_url as tutor_avatar_url
    FROM chat_rooms cr
    INNER JOIN courses c ON cr.course_id = c.id
    INNER JOIN users s ON cr.student_id = s.id
    INNER JOIN users t ON cr.tutor_id = t.id
    WHERE cr.id = ?
  `, [roomId]);
  if (!rooms || rooms.length === 0) return null;
  const room = rooms[0];
  return {
    id: room.id,
    course_id: room.course_id,
    student_id: room.student_id,
    tutor_id: room.tutor_id,
    status: room.status,
    last_message_at: room.last_message_at,
    created_at: room.created_at,
    updated_at: room.updated_at,
    course: {
      id: room.course_id,
      title: room.course_title,
      code: room.course_code
    },
    student: {
      id: room.student_id,
      first_name: room.student_first_name,
      last_name: room.student_last_name,
      avatar_url: room.student_avatar_url
    },
    tutor: {
      id: room.tutor_id,
      first_name: room.tutor_first_name,
      last_name: room.tutor_last_name,
      avatar_url: room.tutor_avatar_url
    }
  };
}
async function verifyRoomAccess(userId, roomId) {
  const rooms = await query(
    'SELECT student_id, tutor_id FROM chat_rooms WHERE id = ? AND status = "active"',
    [roomId]
  );
  if (!rooms || rooms.length === 0) return false;
  const room = rooms[0];
  return room.student_id === userId || room.tutor_id === userId;
}
async function createChatRoom(studentId, data) {
  const existingRooms = await query(
    'SELECT id FROM chat_rooms WHERE student_id = ? AND tutor_id = ? AND course_id = ? AND status = "active"',
    [studentId, data.tutor_id, data.course_id]
  );
  if (existingRooms && existingRooms.length > 0) {
    const room2 = await getChatRoom(existingRooms[0].id);
    if (room2) return room2;
    throw new Error("Failed to retrieve existing room");
  }
  const enrollments = await query(
    'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND status IN ("active", "completed")',
    [studentId, data.course_id]
  );
  if (!enrollments || enrollments.length === 0) {
    throw new Error("Student is not enrolled in this course");
  }
  const tutorCourses = await query(`
    SELECT tc.id 
    FROM tutor_courses tc
    INNER JOIN tutors t ON tc.tutor_id = t.id
    WHERE t.user_id = ? AND tc.course_id = ?
  `, [data.tutor_id, data.course_id]);
  if (!tutorCourses || tutorCourses.length === 0) {
    throw new Error("Tutor does not teach this course");
  }
  const result = await execute(
    'INSERT INTO chat_rooms (course_id, student_id, tutor_id, status) VALUES (?, ?, ?, "active")',
    [data.course_id, studentId, data.tutor_id]
  );
  const room = await getChatRoom(result.insertId);
  if (!room) throw new Error("Failed to create room");
  await execute(
    'INSERT INTO chat_room_participants (room_id, user_id, role) VALUES (?, ?, "student"), (?, ?, "tutor")',
    [room.id, studentId, room.id, data.tutor_id]
  );
  if (data.initial_message) {
    await saveMessage({
      room_id: room.id,
      sender_id: studentId,
      content: data.initial_message,
      message_type: "text"
    });
  }
  return room;
}
async function saveMessage(data) {
  const result = await execute(
    `INSERT INTO chat_messages 
     (room_id, sender_id, message_type, content, file_url, file_name, file_size, file_type, reply_to_id, is_read)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
    [
      data.room_id,
      data.sender_id,
      data.message_type,
      data.content,
      data.file_url || null,
      data.file_name || null,
      data.file_size || null,
      data.file_type || null,
      data.reply_to_id || null
    ]
  );
  await execute(
    "UPDATE chat_rooms SET last_message_at = NOW() WHERE id = ?",
    [data.room_id]
  );
  const messages = await query(`
    SELECT cm.*,
           u.first_name as sender_first_name,
           u.last_name as sender_last_name,
           u.avatar_url as sender_avatar_url,
           reply_to.id as reply_to_id_exists,
           reply_to.content as reply_to_content,
           reply_to.file_name as reply_to_file_name,
           reply_to.message_type as reply_to_message_type,
           reply_user.first_name as reply_to_sender_first_name,
           reply_user.last_name as reply_to_sender_last_name
    FROM chat_messages cm
    INNER JOIN users u ON cm.sender_id = u.id
    LEFT JOIN chat_messages reply_to ON cm.reply_to_id = reply_to.id
    LEFT JOIN users reply_user ON reply_to.sender_id = reply_user.id
    WHERE cm.id = ?
  `, [result.insertId]);
  if (!messages || messages.length === 0) throw new Error("Failed to retrieve message");
  const message = messages[0];
  const formattedMessage = {
    id: message.id,
    room_id: message.room_id,
    sender_id: message.sender_id,
    message_type: message.message_type,
    content: message.content,
    file_name: message.file_name,
    file_size: message.file_size,
    file_type: message.file_type,
    file_url: message.file_url,
    is_read: message.is_read,
    read_at: message.read_at,
    created_at: message.created_at,
    reply_to_id: message.reply_to_id || null,
    is_pinned: message.is_pinned || false,
    sender: {
      id: message.sender_id,
      first_name: message.sender_first_name,
      last_name: message.sender_last_name,
      avatar_url: message.sender_avatar_url
    }
  };
  if (message.reply_to_id_exists) {
    formattedMessage.reply_to = {
      id: message.reply_to_id_exists,
      room_id: message.room_id,
      sender_id: 0,
      // Will be filled if needed
      message_type: message.reply_to_message_type,
      content: message.reply_to_content,
      file_name: message.reply_to_file_name,
      is_read: false,
      read_at: null,
      created_at: "",
      sender: {
        id: 0,
        first_name: message.reply_to_sender_first_name || "",
        last_name: message.reply_to_sender_last_name || ""
      }
    };
  }
  return formattedMessage;
}
async function getChatMessages(roomId, limit = 50, offset = 0) {
  try {
    const limitValue = Math.max(1, Math.min(limit, 100));
    const offsetValue = Math.max(0, offset);
    const messages = await query(`
      SELECT cm.*,
             u.first_name as sender_first_name,
             u.last_name as sender_last_name,
             u.avatar_url as sender_avatar_url,
             reply_to.id as reply_to_id_exists,
             reply_to.content as reply_to_content,
             reply_to.file_name as reply_to_file_name,
             reply_to.message_type as reply_to_message_type,
             reply_user.first_name as reply_to_sender_first_name,
             reply_user.last_name as reply_to_sender_last_name
      FROM chat_messages cm
      INNER JOIN users u ON cm.sender_id = u.id
      LEFT JOIN chat_messages reply_to ON cm.reply_to_id = reply_to.id
      LEFT JOIN users reply_user ON reply_to.sender_id = reply_user.id
      WHERE cm.room_id = ?
      ORDER BY cm.created_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `, [roomId]);
    if (!messages || messages.length === 0) {
      return [];
    }
    return messages.reverse().map((msg) => {
      const formatted = {
        id: msg.id,
        room_id: msg.room_id,
        sender_id: msg.sender_id,
        message_type: msg.message_type,
        content: msg.content,
        file_name: msg.file_name,
        file_size: msg.file_size,
        file_type: msg.file_type,
        file_url: msg.file_url,
        is_read: msg.is_read === 1 || msg.is_read === true,
        read_at: msg.read_at,
        created_at: msg.created_at,
        reply_to_id: msg.reply_to_id || null,
        is_pinned: msg.is_pinned === 1 || msg.is_pinned === true || false,
        sender: {
          id: msg.sender_id,
          first_name: msg.sender_first_name || "",
          last_name: msg.sender_last_name || "",
          avatar_url: msg.sender_avatar_url
        }
      };
      if (msg.reply_to_id_exists) {
        formatted.reply_to = {
          id: msg.reply_to_id_exists,
          room_id: msg.room_id,
          sender_id: 0,
          message_type: msg.reply_to_message_type,
          content: msg.reply_to_content,
          file_name: msg.reply_to_file_name,
          is_read: false,
          read_at: null,
          created_at: "",
          sender: {
            id: 0,
            first_name: msg.reply_to_sender_first_name || "",
            last_name: msg.reply_to_sender_last_name || ""
          }
        };
      }
      return formatted;
    });
  } catch (error) {
    console.error("[Chat Service] Error in getChatMessages:", error);
    console.error("[Chat Service] Error details:", {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      roomId,
      limit,
      offset
    });
    throw error;
  }
}
async function markMessagesAsRead(roomId, userId, messageId) {
  if (messageId) {
    await execute(
      "UPDATE chat_messages SET is_read = TRUE, read_at = NOW() WHERE id = ? AND room_id = ? AND sender_id != ?",
      [messageId, roomId, userId]
    );
  } else {
    await execute(
      "UPDATE chat_messages SET is_read = TRUE, read_at = NOW() WHERE room_id = ? AND sender_id != ? AND is_read = FALSE",
      [roomId, userId]
    );
  }
  await execute(
    "UPDATE chat_room_participants SET last_read_at = NOW() WHERE room_id = ? AND user_id = ?",
    [roomId, userId]
  );
}
async function getTutorCourses(userId) {
  const courses = await query(`
    SELECT DISTINCT tc.course_id
    FROM tutor_courses tc
    INNER JOIN tutors t ON tc.tutor_id = t.id
    WHERE t.user_id = ?
  `, [userId]);
  return courses.map((c) => c.course_id);
}
async function getStudentCourses(userId) {
  const courses = await query(`
    SELECT DISTINCT course_id
    FROM enrollments
    WHERE student_id = ? 
    AND status IN ('active', 'completed')
  `, [userId]);
  return courses.map((c) => c.course_id);
}
async function getAllChatRooms(limit = 50, offset = 0, filters) {
  var _a;
  let whereConditions = [];
  let params = [];
  if (filters == null ? void 0 : filters.status) {
    whereConditions.push("cr.status = ?");
    params.push(filters.status);
  } else {
    whereConditions.push('cr.status = "active"');
  }
  if (filters == null ? void 0 : filters.courseId) {
    whereConditions.push("cr.course_id = ?");
    params.push(filters.courseId);
  }
  if (filters == null ? void 0 : filters.studentId) {
    whereConditions.push("cr.student_id = ?");
    params.push(filters.studentId);
  }
  if (filters == null ? void 0 : filters.tutorId) {
    whereConditions.push("cr.tutor_id = ?");
    params.push(filters.tutorId);
  }
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : 'WHERE cr.status = "active"';
  const totalResults = await query(
    `SELECT COUNT(*) as count FROM chat_rooms cr ${whereClause}`,
    params
  );
  const total = ((_a = totalResults[0]) == null ? void 0 : _a.count) || 0;
  const limitValue = Math.max(1, Math.min(limit, 100));
  const offsetValue = Math.max(0, offset);
  const rooms = await query(`
    SELECT 
      cr.*,
      c.title as course_title,
      c.code as course_code,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.avatar_url as student_avatar_url,
      t.first_name as tutor_first_name,
      t.last_name as tutor_last_name,
      t.avatar_url as tutor_avatar_url
    FROM chat_rooms cr
    INNER JOIN courses c ON cr.course_id = c.id
    INNER JOIN users s ON cr.student_id = s.id
    INNER JOIN users t ON cr.tutor_id = t.id
    ${whereClause}
    ORDER BY cr.last_message_at DESC, cr.created_at DESC
    LIMIT ${limitValue} OFFSET ${offsetValue}
  `, params);
  return {
    rooms: rooms.map((room) => ({
      id: room.id,
      course_id: room.course_id,
      student_id: room.student_id,
      tutor_id: room.tutor_id,
      status: room.status,
      last_message_at: room.last_message_at,
      created_at: room.created_at,
      updated_at: room.updated_at,
      course: {
        id: room.course_id,
        title: room.course_title,
        code: room.course_code
      },
      student: {
        id: room.student_id,
        first_name: room.student_first_name,
        last_name: room.student_last_name,
        avatar_url: room.student_avatar_url
      },
      tutor: {
        id: room.tutor_id,
        first_name: room.tutor_first_name,
        last_name: room.tutor_last_name,
        avatar_url: room.tutor_avatar_url
      }
    })),
    total
  };
}

const _jLNx1CnX5kcf2dl0xeVeazMHB59Nl5Q8ozwYoiMDEY = defineNitroPlugin((nitroApp) => {
  const engine = new engine_io.Server();
  const io = new Server();
  io.bind(engine);
  io.use(async (socket, next) => {
    var _a;
    try {
      const token = socket.handshake.auth.token || ((_a = socket.handshake.headers.authorization) == null ? void 0 : _a.replace("Bearer ", "")) || socket.handshake.query.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      const payload = verifyAccessToken(token);
      const user = await getUserWithRoles(payload.userId);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }
      socket.data.user = user;
      socket.data.userId = user.id;
      next();
    } catch (error) {
      console.error("[Socket.IO] Authentication error:", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });
  io.on("connection", async (socket) => {
    const user = socket.data.user;
    const userId = user.id;
    console.log(`[Socket.IO] \u2705 User connected: ${userId} (${user.first_name} ${user.last_name})`);
    console.log(`[Socket.IO] \u{1F50C} Socket ID: ${socket.id}`);
    socket.join(`user:${userId}`);
    console.log(`[Socket.IO] \u{1F464} User ${userId} joined personal room: user:${userId}`);
    try {
      const rooms = await getUserChatRooms(userId);
      for (const room of rooms) {
        socket.join(`room:${room.id}`);
        console.log(`[Socket.IO] \u{1F3E0} User ${userId} joined room ${room.id} (course ${room.course_id}, student ${room.student_id}, tutor ${room.tutor_id})`);
      }
      console.log(`[Socket.IO] \u2705 User ${userId} joined ${rooms.length} chat room(s)`);
      const userRoles = await getUserRoles(userId);
      const isTutor = userRoles.includes("tutor");
      const isStudent = userRoles.includes("student");
      if (isTutor) {
        try {
          const tutorCourses = await getTutorCourses(userId);
          for (const courseId of tutorCourses) {
            socket.join(`course:${courseId}`);
            console.log(`[Socket.IO] \u{1F4DA} Tutor ${userId} joined course room: course:${courseId}`);
          }
          console.log(`[Socket.IO] \u2705 Tutor ${userId} joined ${tutorCourses.length} course room(s)`);
        } catch (error) {
          console.error(`[Socket.IO] Error loading tutor courses for user ${userId}:`, error);
        }
      }
      if (isStudent) {
        try {
          const studentCourses = await getStudentCourses(userId);
          for (const courseId of studentCourses) {
            socket.join(`course:${courseId}`);
            console.log(`[Socket.IO] \u{1F4DA} Student ${userId} joined course room: course:${courseId}`);
          }
          console.log(`[Socket.IO] \u2705 Student ${userId} joined ${studentCourses.length} course room(s)`);
        } catch (error) {
          console.error(`[Socket.IO] Error loading student courses for user ${userId}:`, error);
        }
      }
      const socketRooms = Array.from(socket.rooms);
      console.log(`[Socket.IO] \u{1F4CB} User ${userId} is in ${socketRooms.length} room(s):`, socketRooms);
    } catch (error) {
      console.error(`[Socket.IO] Error loading rooms for user ${userId}:`, error);
    }
    socket.on("join_room", async (data) => {
      try {
        console.log(`[Socket.IO] \u{1F4E5} join_room event received from user ${userId} for room ${data.roomId}`);
        const hasAccess = await verifyRoomAccess(userId, data.roomId);
        if (hasAccess) {
          socket.join(`room:${data.roomId}`);
          const socketRooms = Array.from(socket.rooms);
          const isInRoom = socketRooms.includes(`room:${data.roomId}`);
          console.log(`[Socket.IO] \u2705 User ${userId} joined room ${data.roomId}`, {
            socketId: socket.id,
            isInRoom,
            allRooms: socketRooms
          });
          socket.emit("room_joined", { roomId: data.roomId });
        } else {
          console.warn(`[Socket.IO] \u274C Access denied: User ${userId} cannot join room ${data.roomId}`);
          socket.emit("error", { message: "Access denied to this room" });
        }
      } catch (error) {
        console.error(`[Socket.IO] \u274C Error joining room ${data.roomId} for user ${userId}:`, error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });
    socket.on("leave_room", (data) => {
      socket.leave(`room:${data.roomId}`);
      socket.emit("room_left", { roomId: data.roomId });
      console.log(`[Socket.IO] User ${userId} left room ${data.roomId}`);
    });
    socket.on("typing", (data) => {
      socket.to(`room:${data.roomId}`).emit("user_typing", {
        userId,
        userName: `${user.first_name} ${user.last_name}`,
        roomId: data.roomId
      });
    });
    socket.on("stop_typing", (data) => {
      socket.to(`room:${data.roomId}`).emit("stop_typing", {
        userId,
        roomId: data.roomId
      });
    });
    socket.on("mark_read", async (data) => {
      try {
        await markMessagesAsRead(data.roomId, userId, data.messageId);
        io.to(`room:${data.roomId}`).emit("messages_read", {
          roomId: data.roomId,
          userId
        });
      } catch (error) {
        console.error(`[Socket.IO] Error marking messages as read:`, error);
      }
    });
    socket.on("disconnect", (reason) => {
      console.log(`[Socket.IO] \u26A0\uFE0F  User disconnected: ${userId}, reason: ${reason}`);
    });
    socket.on("error", (error) => {
      if (error.code !== "ECONNRESET" && error.message !== "read ECONNRESET") {
        console.error(`[Socket.IO] Socket error for user ${userId}:`, error);
      }
    });
    socket.on("disconnecting", (reason) => {
      console.log(`[Socket.IO] User ${userId} disconnecting, reason: ${reason}`);
    });
  });
  nitroApp.io = io;
  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      try {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      } catch (error) {
        if (error.code !== "ECONNRESET" && error.message !== "read ECONNRESET") {
          console.error("[Socket.IO] Error handling request:", error);
        }
      }
    },
    websocket: {
      open(peer) {
        try {
          engine.prepare(peer._internal.nodeReq);
          engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
        } catch (error) {
          if (error.code !== "ECONNRESET" && error.message !== "read ECONNRESET") {
            console.error("[Socket.IO] Error opening WebSocket:", error);
          }
        }
      },
      close(peer) {
      },
      error(peer, error) {
        if (error.code !== "ECONNRESET" && error.message !== "read ECONNRESET") {
          console.error("[Socket.IO] WebSocket error:", error);
        }
      }
    }
  }));
  console.log("[Socket.IO] \u2705 Plugin initialized and ready");
});

const plugins = [
  _jLNx1CnX5kcf2dl0xeVeazMHB59Nl5Q8ozwYoiMDEY
];

const assets = {
  "/uploads/.gitkeep": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"",
    "mtime": "2025-12-20T13:42:01.644Z",
    "size": 0,
    "path": "../public/uploads/.gitkeep"
  },
  "/_nuxt/0JwXLbdW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13f0-kjdELbO7f7qQNHul6L01oU9MaOo\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 5104,
    "path": "../public/_nuxt/0JwXLbdW.js"
  },
  "/_nuxt/8aee2ZTh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"75e-SeJV9Smjndi8hBqJ4IuiEt8DAcY\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 1886,
    "path": "../public/_nuxt/8aee2ZTh.js"
  },
  "/_nuxt/8smeP2F2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"250-CPnADmYx/AnACdCdZklbTr2IUKo\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 592,
    "path": "../public/_nuxt/8smeP2F2.js"
  },
  "/_nuxt/9LjQvTqj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a8c-k6TwgMFl7GYIWlj8GosIY0gS0nA\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 6796,
    "path": "../public/_nuxt/9LjQvTqj.js"
  },
  "/_nuxt/B-X30aoF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-pdeiaxGfeEK2QnUISadccljMgfM\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 78,
    "path": "../public/_nuxt/B-X30aoF.js"
  },
  "/_nuxt/B1BO9a0J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"165b-ReZGcheiMOmsmKfqC9toVWOobGE\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 5723,
    "path": "../public/_nuxt/B1BO9a0J.js"
  },
  "/_nuxt/B2mp1wD8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8db-mt0+cSepOhG2eduStBRWogl/gtA\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 2267,
    "path": "../public/_nuxt/B2mp1wD8.js"
  },
  "/_nuxt/B3Z3RBrt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"43c7-HaxCOnkwxuhkFJhQzn7UwGbVUi8\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 17351,
    "path": "../public/_nuxt/B3Z3RBrt.js"
  },
  "/_nuxt/B49HIcoT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6334-K7YAXO53DaYwCOyplcBQHl/RCOo\"",
    "mtime": "2025-12-27T08:24:30.451Z",
    "size": 25396,
    "path": "../public/_nuxt/B49HIcoT.js"
  },
  "/_nuxt/BALXvQ8s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f52-US8A8Kk4KuG0z9fG7QVV968nsXc\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 12114,
    "path": "../public/_nuxt/BALXvQ8s.js"
  },
  "/_nuxt/BCw_uuzn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a0d-/yrKWRvpg1oL2duy5dDfz2S0Eqs\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 2573,
    "path": "../public/_nuxt/BCw_uuzn.js"
  },
  "/_nuxt/BEBU9Hil.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2da1-Q8JyN64Vev1+GqhiCagPyJc5sm4\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 11681,
    "path": "../public/_nuxt/BEBU9Hil.js"
  },
  "/_nuxt/BFsmL2mK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c07-kZkEd6nW+bEIDcAH/nf3SUQKQXw\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 7175,
    "path": "../public/_nuxt/BFsmL2mK.js"
  },
  "/_nuxt/BHSDNIxN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d9c-f7R2zWCnBeTpA6W6DfSQhb4Lhw8\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 3484,
    "path": "../public/_nuxt/BHSDNIxN.js"
  },
  "/_nuxt/BJCjXCMr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"110-MnHUe3glZd+oMpc1aTR/FFe4SxA\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 272,
    "path": "../public/_nuxt/BJCjXCMr.js"
  },
  "/_nuxt/BKpWv-2O.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-czRqwgPrUqKa6beUtS0Mmg3u1XM\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 78,
    "path": "../public/_nuxt/BKpWv-2O.js"
  },
  "/_nuxt/BOBs1G3d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d20-nPglM6NlVz5YngwtAWfZipJKNCw\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 7456,
    "path": "../public/_nuxt/BOBs1G3d.js"
  },
  "/_nuxt/BQPERQYg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e36-CRhVLJp6RMXLB7abD4IeHbbkaTQ\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 7734,
    "path": "../public/_nuxt/BQPERQYg.js"
  },
  "/_nuxt/BTopoM6U.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"90-Vsi2vzKSFNwCby2DNfj1fyN58J8\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 144,
    "path": "../public/_nuxt/BTopoM6U.js"
  },
  "/_nuxt/BTqLQgnH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-mvyvFla/ok8Ttbo+JzZp2LEDbHc\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 78,
    "path": "../public/_nuxt/BTqLQgnH.js"
  },
  "/_nuxt/BZUAIYhA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"256-5BQ8w0zjel6S4Zz3e5qRVlyiBtU\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 598,
    "path": "../public/_nuxt/BZUAIYhA.js"
  },
  "/_nuxt/B_w0QKyd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fb2-DHJGELXKkBkWKD62c9Ybafi08WE\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 8114,
    "path": "../public/_nuxt/B_w0QKyd.js"
  },
  "/_nuxt/Bc4y1aXM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33eb-j6UrbD4vXRi18kujWMRgJl1NHDo\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 13291,
    "path": "../public/_nuxt/Bc4y1aXM.js"
  },
  "/_nuxt/BcKj8Aeq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-ynOujaDuP/BCvsnVNw9CHu2309k\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 78,
    "path": "../public/_nuxt/BcKj8Aeq.js"
  },
  "/_nuxt/BdJkXebB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b33-uTzp7fA05KKT77vrU3FZ+dAg6Os\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 2867,
    "path": "../public/_nuxt/BdJkXebB.js"
  },
  "/_nuxt/BdNG13rv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24d6-gOc4PubjNnOJ+irWBGSMmz1SF+c\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 9430,
    "path": "../public/_nuxt/BdNG13rv.js"
  },
  "/_nuxt/Be9nsAj3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2deb-PfRQQ2HqLBrl5jnxjv3viGe/oC8\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 11755,
    "path": "../public/_nuxt/Be9nsAj3.js"
  },
  "/_nuxt/BeJ1R-XH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b43-Gk+2h3Cmwd4DTGNYk5brJRztzNk\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 6979,
    "path": "../public/_nuxt/BeJ1R-XH.js"
  },
  "/_nuxt/BgJoX-5C.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e8-oXYN/XYhtjmeTz1PCZj/AN6acN4\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 232,
    "path": "../public/_nuxt/BgJoX-5C.js"
  },
  "/_nuxt/BiBmy0vu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5c30-i/fk/gr4lfslrzTxJr77jprTfKo\"",
    "mtime": "2025-12-27T08:24:30.452Z",
    "size": 23600,
    "path": "../public/_nuxt/BiBmy0vu.js"
  },
  "/_nuxt/BmYQ950h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1389-uLENR0KNTifqszbxbenIESBzY/8\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 5001,
    "path": "../public/_nuxt/BmYQ950h.js"
  },
  "/_nuxt/Bo53vrEk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3e-0+FwyaioCw2PD79kkZP6RWOCZss\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 3390,
    "path": "../public/_nuxt/Bo53vrEk.js"
  },
  "/_nuxt/Bw0amrgs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1711-OEb7TtYm8r6LOBWq5LfAKGp1joE\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 5905,
    "path": "../public/_nuxt/Bw0amrgs.js"
  },
  "/_nuxt/BwweZmaY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-MxGe8CyxvgvLv+4SgdzdhTCEdQU\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 78,
    "path": "../public/_nuxt/BwweZmaY.js"
  },
  "/_nuxt/C-BNIxyI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1152-OtoJnL2O9aO+pxFPY1MU6XcCk8c\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 4434,
    "path": "../public/_nuxt/C-BNIxyI.js"
  },
  "/_nuxt/C-arVmPL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e25-GrRbFpXb9dRM6JDswFcElYBGrrY\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 7717,
    "path": "../public/_nuxt/C-arVmPL.js"
  },
  "/_nuxt/C2YKbQDp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b03-XZw7rIPHEFr9rGJb+6SK8nitEbk\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 6915,
    "path": "../public/_nuxt/C2YKbQDp.js"
  },
  "/_nuxt/C4BNzpKP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27c4-8AWy7kU2AgHkIGv5ERZ/VUYDTpo\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 10180,
    "path": "../public/_nuxt/C4BNzpKP.js"
  },
  "/_nuxt/C51Wn5Mq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"155-mOnZvMUBV9RCULjfg826IteKi78\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 341,
    "path": "../public/_nuxt/C51Wn5Mq.js"
  },
  "/_nuxt/C5VP7iu_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"86e-mgClQucCyS+tUXoKM+zXierk8eI\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 2158,
    "path": "../public/_nuxt/C5VP7iu_.js"
  },
  "/_nuxt/C6b0ety_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2848-+yZg5/djM53fYYHpmtfzA1QQPrQ\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 10312,
    "path": "../public/_nuxt/C6b0ety_.js"
  },
  "/_nuxt/C7vjBmAo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9f8-sttIaTCAKJMmcrO58vixgxji4Eo\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 2552,
    "path": "../public/_nuxt/C7vjBmAo.js"
  },
  "/_nuxt/C8uZPu3n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13a0-Sgrcd999VrFRk6QIYKd1JqKRFw0\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 5024,
    "path": "../public/_nuxt/C8uZPu3n.js"
  },
  "/_nuxt/CDjH4OLA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2bdb-jic3CTi3g1WbI9wdHb0oBgTHPx4\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 11227,
    "path": "../public/_nuxt/CDjH4OLA.js"
  },
  "/_nuxt/CIjPKTSB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"59ff-LzCPMhvhoOqQCBuaVyxeo24OcnE\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 23039,
    "path": "../public/_nuxt/CIjPKTSB.js"
  },
  "/_nuxt/CPO0it5h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1585-e/YMUIDkUjTZJRjVmmiVPU04WRA\"",
    "mtime": "2025-12-27T08:24:30.453Z",
    "size": 5509,
    "path": "../public/_nuxt/CPO0it5h.js"
  },
  "/_nuxt/CPo-A71o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a0a-nBGbpN8utEfhU/a9ykiO6QTyDp8\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 2570,
    "path": "../public/_nuxt/CPo-A71o.js"
  },
  "/_nuxt/CPokQ-Z0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1831-wFr3ZSlODtKTLlkWsUpFK9aZiTc\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 6193,
    "path": "../public/_nuxt/CPokQ-Z0.js"
  },
  "/_nuxt/CRIXk28M.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-HfDOenTqKVmXmDs8kmeqnGZPf4Q\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 78,
    "path": "../public/_nuxt/CRIXk28M.js"
  },
  "/_nuxt/CTEk1XwB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-uev5DGETjvSeTC97V1Qjc43Keb4\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 78,
    "path": "../public/_nuxt/CTEk1XwB.js"
  },
  "/_nuxt/CWJWjr3c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3a6b-lWcRpoUSV3lVOhxZH2mXNo87/To\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 14955,
    "path": "../public/_nuxt/CWJWjr3c.js"
  },
  "/_nuxt/CX4WDIMJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33906-wMYzHPlGOrJwBRt+DR2Gx15USTk\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 211206,
    "path": "../public/_nuxt/CX4WDIMJ.js"
  },
  "/_nuxt/CYB17nq9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"acc-kIWdj1VKACY+tMPqqGHA2+gK3uU\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 2764,
    "path": "../public/_nuxt/CYB17nq9.js"
  },
  "/_nuxt/C_uIs32I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"347f-bjLvJ5nFhyrcomLUru/BQuMkqXI\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 13439,
    "path": "../public/_nuxt/C_uIs32I.js"
  },
  "/_nuxt/CaK-Jlu2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"111d-It4SGzXULeU9NgwwFJBeBaKkynU\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 4381,
    "path": "../public/_nuxt/CaK-Jlu2.js"
  },
  "/_nuxt/CasXnXPt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cf5-ms9yx51kssp2Gy4mPTlDNrC5ik0\"",
    "mtime": "2025-12-27T08:24:30.454Z",
    "size": 3317,
    "path": "../public/_nuxt/CasXnXPt.js"
  },
  "/_nuxt/Cb3Vbygw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"64-1d0DBDIvxmUSJu0l68hNQQyQJ84\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 100,
    "path": "../public/_nuxt/Cb3Vbygw.js"
  },
  "/_nuxt/CeAJt_oh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"19287-s8SUmnWdpRZBxjs1/2r+hOqfrkE\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 103047,
    "path": "../public/_nuxt/CeAJt_oh.js"
  },
  "/_nuxt/CfAzB1GA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a6b-enAr1jc9/mu+0S1yLW4lLxVw2xM\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 2667,
    "path": "../public/_nuxt/CfAzB1GA.js"
  },
  "/_nuxt/CfuytIrk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2df0-iGK6inJsM6bdiwk537fDZNlfzow\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 11760,
    "path": "../public/_nuxt/CfuytIrk.js"
  },
  "/_nuxt/CiM0_A9B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"410d-7u24RpjrtclZ8sUvj8TrG4k2vCk\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 16653,
    "path": "../public/_nuxt/CiM0_A9B.js"
  },
  "/_nuxt/CjwhNx0b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"49a9-tv6chodic4+RTKhrbrsTkt8eb60\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 18857,
    "path": "../public/_nuxt/CjwhNx0b.js"
  },
  "/_nuxt/CkyQOW3s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2075-MnQwVuv2ViyihRqhfk8QHwNwIZU\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 8309,
    "path": "../public/_nuxt/CkyQOW3s.js"
  },
  "/_nuxt/CllNs7J-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"507-4FfAuRvdMRt4hN2JeJ1BmsueyMU\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 1287,
    "path": "../public/_nuxt/CllNs7J-.js"
  },
  "/_nuxt/CmxfT9SS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b1d-KyKuDtabUNZO1e7mIddLTINFv+k\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 11037,
    "path": "../public/_nuxt/CmxfT9SS.js"
  },
  "/_nuxt/CqRDv-_f.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f4a-79ck41FFa5HRf6zGdyvMWIY+nF8\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 8010,
    "path": "../public/_nuxt/CqRDv-_f.js"
  },
  "/_nuxt/CtteXIPZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d4b-n+6XLx7jf+hymyeeImj/RfeD//I\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 7499,
    "path": "../public/_nuxt/CtteXIPZ.js"
  },
  "/_nuxt/Cxo8nhUx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"9fe-2q7U8QlnZi8+T+Mfab5ZIaDTtAk\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 2558,
    "path": "../public/_nuxt/Cxo8nhUx.js"
  },
  "/_nuxt/CyzirTAB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44ae-LPpRP10srj+kvd0D+aDz3p667kc\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 17582,
    "path": "../public/_nuxt/CyzirTAB.js"
  },
  "/_nuxt/D4wADBKf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b91-x/IAjQCLS+2C5ggdAfzS9iJwBb0\"",
    "mtime": "2025-12-27T08:24:30.455Z",
    "size": 2961,
    "path": "../public/_nuxt/D4wADBKf.js"
  },
  "/_nuxt/D7CgXfyH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14d14-iNX4E8VHSMKHYyL6F65V5nZ37wc\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 85268,
    "path": "../public/_nuxt/D7CgXfyH.js"
  },
  "/_nuxt/D8WKMr8o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28b5-j//1PN/ijVIl6jDfUxCh84HGKfg\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 10421,
    "path": "../public/_nuxt/D8WKMr8o.js"
  },
  "/_nuxt/DBq6vxy0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-3pIE3GvddfDNKRBng2IpsDb+OiA\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 78,
    "path": "../public/_nuxt/DBq6vxy0.js"
  },
  "/_nuxt/DCX2gqgQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2cc5-uQhDNANzTG67xQ0sS2qeGnC5tek\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 11461,
    "path": "../public/_nuxt/DCX2gqgQ.js"
  },
  "/_nuxt/DClwBoeE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-VHjLaTFu+qbii7DFMw5g1Xs+EPw\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 78,
    "path": "../public/_nuxt/DClwBoeE.js"
  },
  "/_nuxt/DDbQURS5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16e4-2uu5gtyYT2oKu+zJgCTfDf41cFw\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 5860,
    "path": "../public/_nuxt/DDbQURS5.js"
  },
  "/_nuxt/DDxt_u6O.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d6-adHr6PNgNZycFmWoZyAl935WE3A\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 214,
    "path": "../public/_nuxt/DDxt_u6O.js"
  },
  "/_nuxt/DE0tsH7x.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d86-Muitx8FXarD/8QZwv468fxmFVMo\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 3462,
    "path": "../public/_nuxt/DE0tsH7x.js"
  },
  "/_nuxt/DE9j9Y27.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1658-N9yuhbtt/WmvdWt5h0sWAeXJOyw\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 5720,
    "path": "../public/_nuxt/DE9j9Y27.js"
  },
  "/_nuxt/DJ1b1eKD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-c+EvgVnxl42Cl3GgrZ64Cg38/A4\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 78,
    "path": "../public/_nuxt/DJ1b1eKD.js"
  },
  "/_nuxt/DOCv56iD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-9cWT0pm41JDzkj2Ib8kMKXDLdZQ\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 78,
    "path": "../public/_nuxt/DOCv56iD.js"
  },
  "/_nuxt/DOaAHroO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-AATiIAUrS8nJdcY0gqmre2BmeA0\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 78,
    "path": "../public/_nuxt/DOaAHroO.js"
  },
  "/_nuxt/DVLQ4A6n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1070-gz2kcNSW/1CAXQWIoJdawK8p0mA\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 4208,
    "path": "../public/_nuxt/DVLQ4A6n.js"
  },
  "/_nuxt/DWL7QY8Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-8Au9UBmjdCuW001xDbhM1OK/9wM\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 78,
    "path": "../public/_nuxt/DWL7QY8Q.js"
  },
  "/_nuxt/DaQcxvqW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2d8b-VUzdWAUbNQ65MSaHz2bV7oppFgA\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 11659,
    "path": "../public/_nuxt/DaQcxvqW.js"
  },
  "/_nuxt/Dac6oD3c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1118-yPUHGZZQQF4NH3yTZGY1VFqYlsc\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 4376,
    "path": "../public/_nuxt/Dac6oD3c.js"
  },
  "/_nuxt/DbIPe0gX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b96-KssgJiCcP4sEPzc/mruiWakJgXg\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 7062,
    "path": "../public/_nuxt/DbIPe0gX.js"
  },
  "/_nuxt/Dd9IFq5w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-V9syLhTJ60nku+NklabR4lrQJjM\"",
    "mtime": "2025-12-27T08:24:30.456Z",
    "size": 78,
    "path": "../public/_nuxt/Dd9IFq5w.js"
  },
  "/_nuxt/DfgEv0ug.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"64-pDgUm2bmIDJVeYJ+/B4aqUthTpY\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 100,
    "path": "../public/_nuxt/DfgEv0ug.js"
  },
  "/_nuxt/Dfn2J_7j.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1025-jBCY2A2q1dxNDk782fULr81Jk5s\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 4133,
    "path": "../public/_nuxt/Dfn2J_7j.js"
  },
  "/_nuxt/DhtnrIcc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-O35sImZb1Xo4SgmtlML3B3kbjp8\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 78,
    "path": "../public/_nuxt/DhtnrIcc.js"
  },
  "/_nuxt/DjKcNith.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b7c-CfqBOCo0Fi+zT4KO5UUfMSfxZSM\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 7036,
    "path": "../public/_nuxt/DjKcNith.js"
  },
  "/_nuxt/DjwPAIHw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"45c-p7janz67RU9db+I8C5MkRmVlyL0\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 1116,
    "path": "../public/_nuxt/DjwPAIHw.js"
  },
  "/_nuxt/Dm9QA4UA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cce-fTFUfLmlnZvN9cJJIPMpj13bC9M\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 3278,
    "path": "../public/_nuxt/Dm9QA4UA.js"
  },
  "/_nuxt/DwxO8qxn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"32a-YzWTD/9Ab895i6xPCmWDBzyD+XI\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 810,
    "path": "../public/_nuxt/DwxO8qxn.js"
  },
  "/_nuxt/DxDEv_3r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a2a-25yo3iWcg1ZHg0N+fqwkJdGOpms\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 2602,
    "path": "../public/_nuxt/DxDEv_3r.js"
  },
  "/_nuxt/Dz_cw2Mu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"267e-U2NZHLqUy0kjix/RPA2Ri/wPpwQ\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 9854,
    "path": "../public/_nuxt/Dz_cw2Mu.js"
  },
  "/_nuxt/DzoPbhfs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f1a-WB2CiDIx4/FOUEPhLYlrIk7dUsI\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 7962,
    "path": "../public/_nuxt/DzoPbhfs.js"
  },
  "/_nuxt/EIWeQM0D.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b5c-kIVNZfJqhZZ9lzg09Lt5yahwkL8\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 2908,
    "path": "../public/_nuxt/EIWeQM0D.js"
  },
  "/_nuxt/H1WKJ1ey.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ac5-VLb/GSfhNrNsdg3Q9uUkjElhXwc\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 2757,
    "path": "../public/_nuxt/H1WKJ1ey.js"
  },
  "/_nuxt/LiZfZJ8V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"282-XUFM75EvjkBL/7r0nKyrjia8KsE\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 642,
    "path": "../public/_nuxt/LiZfZJ8V.js"
  },
  "/_nuxt/MEG3hhrh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"248-pYxjyPbKEWIvgemQ0PlV4TYMfRo\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 584,
    "path": "../public/_nuxt/MEG3hhrh.js"
  },
  "/_nuxt/NoIg-Coj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-OpIeyjK7MWntDFq0UfF0rcc6BTk\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 78,
    "path": "../public/_nuxt/NoIg-Coj.js"
  },
  "/_nuxt/PItv745k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1850-6Qa7QWSL0p+lAtrzdQ3pW8wf/T0\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 6224,
    "path": "../public/_nuxt/PItv745k.js"
  },
  "/_nuxt/PJD1JfRC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1606-2imETT2wQ+y+QgIMEW/Xl/BgRQQ\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 5638,
    "path": "../public/_nuxt/PJD1JfRC.js"
  },
  "/_nuxt/Qwhilmll.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3616-q2CXlJ/B4/vavSJGKKxnqTsT+Wo\"",
    "mtime": "2025-12-27T08:24:30.457Z",
    "size": 13846,
    "path": "../public/_nuxt/Qwhilmll.js"
  },
  "/_nuxt/RichTextEditor.9N-AczwR.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"35d-16ezpV9kQ3ACp9OAennGdDokKbg\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 861,
    "path": "../public/_nuxt/RichTextEditor.9N-AczwR.css"
  },
  "/_nuxt/_slug_.CGAP6FWb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f5-cTvGHHQrKxkAKLuS2gh7EuwUiWY\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 1269,
    "path": "../public/_nuxt/_slug_.CGAP6FWb.css"
  },
  "/_nuxt/about.CscaCdTE.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"286-r2cYeAvqcBQ30dyTG0VHsg6rFsQ\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 646,
    "path": "../public/_nuxt/about.CscaCdTE.css"
  },
  "/_nuxt/cL3ZD5Hb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"87b-xEMmXYiEHdQW1WO0DDAq+HOHVYY\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 2171,
    "path": "../public/_nuxt/cL3ZD5Hb.js"
  },
  "/_nuxt/careers.tQ6S07Om.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"286-LztnEgkmHL8f2CBhYd7Lmk2A5D0\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 646,
    "path": "../public/_nuxt/careers.tQ6S07Om.css"
  },
  "/_nuxt/contact.BQWmQK7z.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"286-hvl2Fy9Ah5R3InVzJY4cJtXC4+4\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 646,
    "path": "../public/_nuxt/contact.BQWmQK7z.css"
  },
  "/_nuxt/entry.DLS_FDRg.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"aa0c-RShZy5EyPTM04vZCg8iMt3r0kQg\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 43532,
    "path": "../public/_nuxt/entry.DLS_FDRg.css"
  },
  "/_nuxt/help.DlSzpRFm.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"286-RHCPwk3rTGZU4UuDBT+KWRWZ6gU\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 646,
    "path": "../public/_nuxt/help.DlSzpRFm.css"
  },
  "/_nuxt/index.C94WdXjb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ac-6Iy0kKNjx6DA7pn/EmXNxX2HN0o\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 172,
    "path": "../public/_nuxt/index.C94WdXjb.css"
  },
  "/_nuxt/index.CA3aPy--.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e7-Gob4Pyj1F3df2nHgIUjnFeg2kbk\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 231,
    "path": "../public/_nuxt/index.CA3aPy--.css"
  },
  "/_nuxt/jfJEL8rP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"427a-GVfOIEs9j+8rGcqeGonYQMLrup0\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 17018,
    "path": "../public/_nuxt/jfJEL8rP.js"
  },
  "/_nuxt/m998VyF-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5751-egftUFtSIvJBzVg2o+i2njXr9HE\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 22353,
    "path": "../public/_nuxt/m998VyF-.js"
  },
  "/_nuxt/rQp7WoB7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1364-H/bTnzZFU8W+ydtn8INZJOmwf2U\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 4964,
    "path": "../public/_nuxt/rQp7WoB7.js"
  },
  "/_nuxt/rSZ_nZDf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fc9-nNtYfkJxz4q9qO8R17ONtfcPKTU\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 4041,
    "path": "../public/_nuxt/rSZ_nZDf.js"
  },
  "/_nuxt/support.7nip7fuj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"286-BpLsFZdOT17eA16qj1dKumEM9sI\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 646,
    "path": "../public/_nuxt/support.7nip7fuj.css"
  },
  "/_nuxt/v-KwyajG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5ab86-6v8RrFyFEI6WblCxU7ClXztFvF4\"",
    "mtime": "2025-12-27T08:24:30.459Z",
    "size": 371590,
    "path": "../public/_nuxt/v-KwyajG.js"
  },
  "/_nuxt/xJo2gTVb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2cd-9VMn52b/m7sM5zl0oJrKCvLwS+0\"",
    "mtime": "2025-12-27T08:24:30.458Z",
    "size": 717,
    "path": "../public/_nuxt/xJo2gTVb.js"
  },
  "/uploads/courses/.gitkeep": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"",
    "mtime": "2025-12-20T13:42:01.644Z",
    "size": 0,
    "path": "../public/uploads/courses/.gitkeep"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-c7Bq8es5ImiHR2WWZjuzOE/r4vw\"",
    "mtime": "2025-12-27T08:24:30.440Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/uploads/courses/1/thumbnail.png": {
    "type": "image/png",
    "etag": "\"40beb-3UURiio74LxC4tSrULv6UoMI9S0\"",
    "mtime": "2025-12-27T08:24:30.462Z",
    "size": 265195,
    "path": "../public/uploads/courses/1/thumbnail.png"
  },
  "/uploads/courses/7/thumbnail.png": {
    "type": "image/png",
    "etag": "\"805f9-OnBfTtnNqO0IEOSfrFaUu7TL8EQ\"",
    "mtime": "2025-12-27T08:24:30.464Z",
    "size": 525817,
    "path": "../public/uploads/courses/7/thumbnail.png"
  },
  "/uploads/courses/_unmapped/1766238411723-82u7nqfw8a7.jpeg": {
    "type": "image/jpeg",
    "etag": "\"d2fd-ryBYWON8BLJI1GpA7HAwZOQIwqI\"",
    "mtime": "2025-12-27T08:24:30.462Z",
    "size": 54013,
    "path": "../public/uploads/courses/_unmapped/1766238411723-82u7nqfw8a7.jpeg"
  },
  "/uploads/courses/_unmapped/1766238429948-wutivqmymgc.jpg": {
    "type": "image/jpeg",
    "etag": "\"4fd0-+Bm/QXsOzR3v5yXiitNla4hr6Xs\"",
    "mtime": "2025-12-27T08:24:30.461Z",
    "size": 20432,
    "path": "../public/uploads/courses/_unmapped/1766238429948-wutivqmymgc.jpg"
  },
  "/uploads/courses/_unmapped/1766330431095-jshytm39who.png": {
    "type": "image/png",
    "etag": "\"805f9-OnBfTtnNqO0IEOSfrFaUu7TL8EQ\"",
    "mtime": "2025-12-27T08:24:30.465Z",
    "size": 525817,
    "path": "../public/uploads/courses/_unmapped/1766330431095-jshytm39who.png"
  },
  "/uploads/courses/_unmapped/1766330640831-0xnt8fswz2d.png": {
    "type": "image/png",
    "etag": "\"805f9-OnBfTtnNqO0IEOSfrFaUu7TL8EQ\"",
    "mtime": "2025-12-27T08:24:30.463Z",
    "size": 525817,
    "path": "../public/uploads/courses/_unmapped/1766330640831-0xnt8fswz2d.png"
  },
  "/_nuxt/builds/meta/7f778052-5aae-45a6-99ec-27e5a54a4be0.json": {
    "type": "application/json",
    "etag": "\"8b-Rft0H/h2lWMoHaWmOrYjFvLWVWY\"",
    "mtime": "2025-12-27T08:24:30.438Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/7f778052-5aae-45a6-99ec-27e5a54a4be0.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _pIXDZ7 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_XFSqTC = () => import('../routes/api/admin/articles.get.mjs');
const _lazy_mZX4Nt = () => import('../routes/api/admin/articles.post.mjs');
const _lazy_RC49rn = () => import('../routes/api/admin/articles/_id_.delete.mjs');
const _lazy_JlkU9f = () => import('../routes/api/admin/articles/_id_.put.mjs');
const _lazy_VbjLHg = () => import('../routes/api/admin/branches.get.mjs');
const _lazy_19oFzR = () => import('../routes/api/admin/chat/rooms.get.mjs');
const _lazy_RFi39G = () => import('../routes/api/admin/chat/rooms/_roomId_.get.mjs');
const _lazy_TmE9Pd = () => import('../routes/api/admin/content-pages.get.mjs');
const _lazy_G6BXjf = () => import('../routes/api/admin/content-pages.post.mjs');
const _lazy_TQ8M9q = () => import('../routes/api/admin/content-pages/_id_.delete.mjs');
const _lazy_yjg6Xg = () => import('../routes/api/admin/content-pages/_id_.put.mjs');
const _lazy_JA5fIe = () => import('../routes/api/admin/courses.get.mjs');
const _lazy_faO8iE = () => import('../routes/api/admin/courses.post.mjs');
const _lazy_plGDIN = () => import('../routes/api/admin/courses/_id_.delete.mjs');
const _lazy_LDvrIr = () => import('../routes/api/admin/courses/_id_.get.mjs');
const _lazy_a6NdeO = () => import('../routes/api/admin/courses/_id_.put.mjs');
const _lazy_XSsU2q = () => import('../routes/api/admin/courses/_id/images.post.mjs');
const _lazy_zBz3GV = () => import('../routes/api/admin/courses/_id/images/_imageId_.delete.mjs');
const _lazy_KpGVS_ = () => import('../routes/api/admin/courses/_id/status.patch.mjs');
const _lazy_mgTDg4 = () => import('../routes/api/admin/dashboard.get.mjs');
const _lazy_5b10_Z = () => import('../routes/api/admin/enrollments.get.mjs');
const _lazy_7vq2nt = () => import('../routes/api/admin/enrollments.post.mjs');
const _lazy_gbzB1Y = () => import('../routes/api/admin/enrollments/_id_.delete.mjs');
const _lazy_XjPagp = () => import('../routes/api/admin/enrollments/_id_.get.mjs');
const _lazy_oVTenK = () => import('../routes/api/admin/enrollments/_id_.put.mjs');
const _lazy_ufTBDS = () => import('../routes/api/admin/enrollments/_id/status.patch.mjs');
const _lazy_GaDvql = () => import('../routes/api/admin/menus.get.mjs');
const _lazy_tuLmUM = () => import('../routes/api/admin/settings/branches.get.mjs');
const _lazy_2pH841 = () => import('../routes/api/admin/settings/branches.post.mjs');
const _lazy_9V5lbP = () => import('../routes/api/admin/settings/branches/_id_.delete.mjs');
const _lazy_W7nbQ_ = () => import('../routes/api/admin/settings/branches/_id_.put.mjs');
const _lazy_D7r5nS = () => import('../routes/api/admin/settings/branches/_id/status.patch.mjs');
const _lazy_iIB9q1 = () => import('../routes/api/admin/settings/email/smtp.get.mjs');
const _lazy_ATxTFm = () => import('../routes/api/admin/settings/email/smtp.put.mjs');
const _lazy_Ubdx3j = () => import('../routes/api/admin/settings/email/templates.get.mjs');
const _lazy_ZsMGQN = () => import('../routes/api/admin/settings/email/templates/_id_.get.mjs');
const _lazy_3_Qgj2 = () => import('../routes/api/admin/settings/email/templates/_id_.put.mjs');
const _lazy_1f_NhZ = () => import('../routes/api/admin/settings/grade-levels.get.mjs');
const _lazy_uv8NM7 = () => import('../routes/api/admin/settings/grade-levels.post.mjs');
const _lazy_lC3u8Q = () => import('../routes/api/admin/settings/grade-levels/_id_.delete.mjs');
const _lazy_fjXgeX = () => import('../routes/api/admin/settings/grade-levels/_id_.put.mjs');
const _lazy_o0l7LY = () => import('../routes/api/admin/settings/inclusions.get.mjs');
const _lazy_qnVXLM = () => import('../routes/api/admin/settings/inclusions.post.mjs');
const _lazy_njWjSe = () => import('../routes/api/admin/settings/inclusions/_id_.delete.mjs');
const _lazy_4Y_hLQ = () => import('../routes/api/admin/settings/inclusions/_id_.put.mjs');
const _lazy_xcOnKW = () => import('../routes/api/admin/settings/payment-methods.get.mjs');
const _lazy_SovD6D = () => import('../routes/api/admin/settings/payment-methods.post.mjs');
const _lazy_nyuOPO = () => import('../routes/api/admin/settings/payment-methods/_id_.delete.mjs');
const _lazy_e5P9Ck = () => import('../routes/api/admin/settings/payment-methods/_id_.get.mjs');
const _lazy_LXx0yD = () => import('../routes/api/admin/settings/payment-methods/_id_.put.mjs');
const _lazy_nT0uml = () => import('../routes/api/admin/settings/payment-methods/_id/bank-accounts.get.mjs');
const _lazy_8ibiTM = () => import('../routes/api/admin/settings/payment-methods/_id/bank-accounts.post.mjs');
const _lazy_l8auPL = () => import('../routes/api/admin/settings/payment-methods/_id/bank-accounts/_accountId_.delete.mjs');
const _lazy_zfKhht = () => import('../routes/api/admin/settings/payment-methods/_id/bank-accounts/_accountId_.put.mjs');
const _lazy_Ndrixr = () => import('../routes/api/admin/settings/payment-methods/_id/gateway.get.mjs');
const _lazy_GFxP96 = () => import('../routes/api/admin/settings/payment-methods/_id/gateway.put.mjs');
const _lazy_DWxyvQ = () => import('../routes/api/admin/settings/payment-methods/_id/status.patch.mjs');
const _lazy_uM19ep = () => import('../routes/api/admin/settings/roles.get.mjs');
const _lazy_rMaMLg = () => import('../routes/api/admin/settings/roles.post.mjs');
const _lazy_IQo0F8 = () => import('../routes/api/admin/settings/roles/_id_.delete.mjs');
const _lazy_majcj0 = () => import('../routes/api/admin/settings/roles/_id_.put.mjs');
const _lazy_IVIGjo = () => import('../routes/api/admin/settings/subjects.get.mjs');
const _lazy_t8CZkN = () => import('../routes/api/admin/settings/subjects.post.mjs');
const _lazy_EGOtIJ = () => import('../routes/api/admin/settings/subjects/_id_.delete.mjs');
const _lazy_eMcI1v = () => import('../routes/api/admin/settings/subjects/_id_.put.mjs');
const _lazy_YGHbm_ = () => import('../routes/api/admin/settings/system.get.mjs');
const _lazy_nY8ggT = () => import('../routes/api/admin/settings/system.put.mjs');
const _lazy_lS0LbE = () => import('../routes/api/admin/settings/system/_key_.get.mjs');
const _lazy_p4ar8w = () => import('../routes/api/admin/settings/system/_key_.put.mjs');
const _lazy_ywMEru = () => import('../routes/api/admin/students.get.mjs');
const _lazy_qZsaWS = () => import('../routes/api/admin/students/_id_.get.mjs');
const _lazy_YTC0Qj = () => import('../routes/api/admin/students/_id/parents.post.mjs');
const _lazy_oiuenP = () => import('../routes/api/admin/students/_id/parents/_parentId_.delete.mjs');
const _lazy_DjDv0k = () => import('../routes/api/admin/students/_id/parents/_parentId_.patch.mjs');
const _lazy_idAxo9 = () => import('../routes/api/admin/students/_id/payments.get.mjs');
const _lazy_zeAf1d = () => import('../routes/api/admin/testimonials.get.mjs');
const _lazy__gID8h = () => import('../routes/api/admin/testimonials.post.mjs');
const _lazy_kP9vkf = () => import('../routes/api/admin/testimonials/_id_.delete.mjs');
const _lazy_ywARbL = () => import('../routes/api/admin/testimonials/_id_.put.mjs');
const _lazy_LeZwbf = () => import('../routes/api/admin/tutor/schedules.get.mjs');
const _lazy_J8TWAU = () => import('../routes/api/admin/upload.post.mjs');
const _lazy_aEVvUX = () => import('../routes/api/admin/users.get.mjs');
const _lazy_vcX3xh = () => import('../routes/api/admin/users.post.mjs');
const _lazy_N6qNbA = () => import('../routes/api/admin/users/_id_.delete.mjs');
const _lazy_6e8gYz = () => import('../routes/api/admin/users/_id_.put.mjs');
const _lazy_O6D1Ql = () => import('../routes/api/admin/users/_id/status.patch.mjs');
const _lazy_BLDcZ_ = () => import('../routes/api/admin/users/_userId/addresses.get.mjs');
const _lazy_vAM8JV = () => import('../routes/api/admin/users/_userId/addresses.post.mjs');
const _lazy_oCNQhf = () => import('../routes/api/admin/users/_userId/addresses/_addressId_.delete.mjs');
const _lazy_bLHU6H = () => import('../routes/api/admin/users/_userId/addresses/_addressId_.put.mjs');
const _lazy_txoNJG = () => import('../routes/api/admin/users/_userId/addresses/_addressId/set-default.patch.mjs');
const _lazy_fDieN1 = () => import('../routes/api/articles.get.mjs');
const _lazy_gmZiww = () => import('../routes/api/articles/_slug_.get.mjs');
const _lazy_UkyYGn = () => import('../routes/api/auth/forgot-password.post.mjs');
const _lazy_i6bqw6 = () => import('../routes/api/auth/login.post.mjs');
const _lazy_iawmGj = () => import('../routes/api/auth/me.get.mjs');
const _lazy_e9Kohi = () => import('../routes/api/auth/oauth/_provider/callback.post.mjs');
const _lazy_axtPzH = () => import('../routes/api/auth/oauth/_provider/url.post.mjs');
const _lazy_ua5kZa = () => import('../routes/api/auth/register.post.mjs');
const _lazy_DI5yXO = () => import('../routes/api/branches.get.mjs');
const _lazy_Hc9lGB = () => import('../routes/api/calendar/appointments.get.mjs');
const _lazy_Xk3UmJ = () => import('../routes/api/calendar/appointments.post.mjs');
const _lazy_upvjGF = () => import('../routes/api/calendar/appointments/_id_.delete.mjs');
const _lazy_wPzQ1k = () => import('../routes/api/calendar/appointments/_id_.put.mjs');
const _lazy_DrvAAJ = () => import('../routes/api/calendar/events.get.mjs');
const _lazy_pzhaVs = () => import('../routes/api/calendar/events.post.mjs');
const _lazy_uqKNVP = () => import('../routes/api/calendar/events/_id_.delete.mjs');
const _lazy_vbCMRY = () => import('../routes/api/calendar/events/_id_.get.mjs');
const _lazy_lZt1Rd = () => import('../routes/api/calendar/events/_id_.put.mjs');
const _lazy_mPjfwH = () => import('../routes/api/calendar/tasks.get.mjs');
const _lazy_lzgNHX = () => import('../routes/api/calendar/tasks.post.mjs');
const _lazy_qGaz5o = () => import('../routes/api/calendar/tasks/_id_.delete.mjs');
const _lazy_iqFo1A = () => import('../routes/api/calendar/tasks/_id_.put.mjs');
const _lazy_MMmdRs = () => import('../routes/api/chat/events.get.mjs');
const _lazy_ffI4A9 = () => import('../routes/api/chat/events/subscribe.post.mjs');
const _lazy_6_KiFE = () => import('../routes/api/chat/rooms.get.mjs');
const _lazy_RzIjua = () => import('../routes/api/chat/rooms.post.mjs');
const _lazy_TvpHbc = () => import('../routes/api/chat/rooms/_roomId_.get.mjs');
const _lazy_EJ6pJR = () => import('../routes/api/chat/rooms/_roomId/messages.get.mjs');
const _lazy_315NNl = () => import('../routes/api/chat/rooms/_roomId/messages.post.mjs');
const _lazy_9jC0PB = () => import('../routes/api/chat/rooms/_roomId/messages/read.post.mjs');
const _lazy_3MA1wu = () => import('../routes/api/chat/rooms/_roomId/notes.get.mjs');
const _lazy_6j0NJg = () => import('../routes/api/chat/rooms/_roomId/notes.post.mjs');
const _lazy_2W3AJk = () => import('../routes/api/chat/rooms/_roomId/notes/_noteId_.put.mjs');
const _lazy_0JpYFT = () => import('../routes/api/chat/rooms/_roomId/tags.get.mjs');
const _lazy_4NydRk = () => import('../routes/api/chat/rooms/_roomId/tags.post.mjs');
const _lazy_vyASc6 = () => import('../routes/api/chat/rooms/_roomId/typing.post.mjs');
const _lazy_ghfekQ = () => import('../routes/api/chat/rooms/_roomId/typing/stop.post.mjs');
const _lazy_idmILl = () => import('../routes/api/chat/upload.post.mjs');
const _lazy_2NT1du = () => import('../routes/api/content-pages/_slug_.get.mjs');
const _lazy_mx8Aex = () => import('../routes/api/courses.get.mjs');
const _lazy_oTk_6L = () => import('../routes/api/courses/_id_.get.mjs');
const _lazy_9kdm43 = () => import('../routes/api/health.get.mjs');
const _lazy_T3RIcs = () => import('../routes/api/learning/available-chats.get.mjs');
const _lazy_XwZV5m = () => import('../routes/api/learning/my-courses.get.mjs');
const _lazy_RY2uvW = () => import('../routes/api/testimonials.get.mjs');
const _lazy_US9tyS = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _pIXDZ7, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/articles', handler: _lazy_XFSqTC, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/articles', handler: _lazy_mZX4Nt, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/articles/:id', handler: _lazy_RC49rn, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/articles/:id', handler: _lazy_JlkU9f, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/branches', handler: _lazy_VbjLHg, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/chat/rooms', handler: _lazy_19oFzR, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/chat/rooms/:roomId', handler: _lazy_RFi39G, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/content-pages', handler: _lazy_TmE9Pd, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/content-pages', handler: _lazy_G6BXjf, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/content-pages/:id', handler: _lazy_TQ8M9q, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/content-pages/:id', handler: _lazy_yjg6Xg, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/courses', handler: _lazy_JA5fIe, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/courses', handler: _lazy_faO8iE, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/courses/:id', handler: _lazy_plGDIN, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/courses/:id', handler: _lazy_LDvrIr, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/courses/:id', handler: _lazy_a6NdeO, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/courses/:id/images', handler: _lazy_XSsU2q, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/courses/:id/images/:imageId', handler: _lazy_zBz3GV, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/courses/:id/status', handler: _lazy_KpGVS_, lazy: true, middleware: false, method: "patch" },
  { route: '/api/admin/dashboard', handler: _lazy_mgTDg4, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/enrollments', handler: _lazy_5b10_Z, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/enrollments', handler: _lazy_7vq2nt, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/enrollments/:id', handler: _lazy_gbzB1Y, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/enrollments/:id', handler: _lazy_XjPagp, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/enrollments/:id', handler: _lazy_oVTenK, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/enrollments/:id/status', handler: _lazy_ufTBDS, lazy: true, middleware: false, method: "patch" },
  { route: '/api/admin/menus', handler: _lazy_GaDvql, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/branches', handler: _lazy_tuLmUM, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/branches', handler: _lazy_2pH841, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/settings/branches/:id', handler: _lazy_9V5lbP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/settings/branches/:id', handler: _lazy_W7nbQ_, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/branches/:id/status', handler: _lazy_D7r5nS, lazy: true, middleware: false, method: "patch" },
  { route: '/api/admin/settings/email/smtp', handler: _lazy_iIB9q1, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/email/smtp', handler: _lazy_ATxTFm, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/email/templates', handler: _lazy_Ubdx3j, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/email/templates/:id', handler: _lazy_ZsMGQN, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/email/templates/:id', handler: _lazy_3_Qgj2, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/grade-levels', handler: _lazy_1f_NhZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/grade-levels', handler: _lazy_uv8NM7, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/settings/grade-levels/:id', handler: _lazy_lC3u8Q, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/settings/grade-levels/:id', handler: _lazy_fjXgeX, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/inclusions', handler: _lazy_o0l7LY, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/inclusions', handler: _lazy_qnVXLM, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/settings/inclusions/:id', handler: _lazy_njWjSe, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/settings/inclusions/:id', handler: _lazy_4Y_hLQ, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/payment-methods', handler: _lazy_xcOnKW, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/payment-methods', handler: _lazy_SovD6D, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/settings/payment-methods/:id', handler: _lazy_nyuOPO, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/settings/payment-methods/:id', handler: _lazy_e5P9Ck, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/payment-methods/:id', handler: _lazy_LXx0yD, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/payment-methods/:id/bank-accounts', handler: _lazy_nT0uml, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/payment-methods/:id/bank-accounts', handler: _lazy_8ibiTM, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/settings/payment-methods/:id/bank-accounts/:accountId', handler: _lazy_l8auPL, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/settings/payment-methods/:id/bank-accounts/:accountId', handler: _lazy_zfKhht, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/payment-methods/:id/gateway', handler: _lazy_Ndrixr, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/payment-methods/:id/gateway', handler: _lazy_GFxP96, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/payment-methods/:id/status', handler: _lazy_DWxyvQ, lazy: true, middleware: false, method: "patch" },
  { route: '/api/admin/settings/roles', handler: _lazy_uM19ep, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/roles', handler: _lazy_rMaMLg, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/settings/roles/:id', handler: _lazy_IQo0F8, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/settings/roles/:id', handler: _lazy_majcj0, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/subjects', handler: _lazy_IVIGjo, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/subjects', handler: _lazy_t8CZkN, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/settings/subjects/:id', handler: _lazy_EGOtIJ, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/settings/subjects/:id', handler: _lazy_eMcI1v, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/system', handler: _lazy_YGHbm_, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/system', handler: _lazy_nY8ggT, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/settings/system/:key', handler: _lazy_lS0LbE, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings/system/:key', handler: _lazy_p4ar8w, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/students', handler: _lazy_ywMEru, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/students/:id', handler: _lazy_qZsaWS, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/students/:id/parents', handler: _lazy_YTC0Qj, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/students/:id/parents/:parentId', handler: _lazy_oiuenP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/students/:id/parents/:parentId', handler: _lazy_DjDv0k, lazy: true, middleware: false, method: "patch" },
  { route: '/api/admin/students/:id/payments', handler: _lazy_idAxo9, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/testimonials', handler: _lazy_zeAf1d, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/testimonials', handler: _lazy__gID8h, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/testimonials/:id', handler: _lazy_kP9vkf, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/testimonials/:id', handler: _lazy_ywARbL, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/tutor/schedules', handler: _lazy_LeZwbf, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/upload', handler: _lazy_J8TWAU, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/users', handler: _lazy_aEVvUX, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/users', handler: _lazy_vcX3xh, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/users/:id', handler: _lazy_N6qNbA, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/users/:id', handler: _lazy_6e8gYz, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/users/:id/status', handler: _lazy_O6D1Ql, lazy: true, middleware: false, method: "patch" },
  { route: '/api/admin/users/:userId/addresses', handler: _lazy_BLDcZ_, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/users/:userId/addresses', handler: _lazy_vAM8JV, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/users/:userId/addresses/:addressId', handler: _lazy_oCNQhf, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/users/:userId/addresses/:addressId', handler: _lazy_bLHU6H, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/users/:userId/addresses/:addressId/set-default', handler: _lazy_txoNJG, lazy: true, middleware: false, method: "patch" },
  { route: '/api/articles', handler: _lazy_fDieN1, lazy: true, middleware: false, method: "get" },
  { route: '/api/articles/:slug', handler: _lazy_gmZiww, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/forgot-password', handler: _lazy_UkyYGn, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_i6bqw6, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/me', handler: _lazy_iawmGj, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/oauth/:provider/callback', handler: _lazy_e9Kohi, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/oauth/:provider/url', handler: _lazy_axtPzH, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/register', handler: _lazy_ua5kZa, lazy: true, middleware: false, method: "post" },
  { route: '/api/branches', handler: _lazy_DI5yXO, lazy: true, middleware: false, method: "get" },
  { route: '/api/calendar/appointments', handler: _lazy_Hc9lGB, lazy: true, middleware: false, method: "get" },
  { route: '/api/calendar/appointments', handler: _lazy_Xk3UmJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/calendar/appointments/:id', handler: _lazy_upvjGF, lazy: true, middleware: false, method: "delete" },
  { route: '/api/calendar/appointments/:id', handler: _lazy_wPzQ1k, lazy: true, middleware: false, method: "put" },
  { route: '/api/calendar/events', handler: _lazy_DrvAAJ, lazy: true, middleware: false, method: "get" },
  { route: '/api/calendar/events', handler: _lazy_pzhaVs, lazy: true, middleware: false, method: "post" },
  { route: '/api/calendar/events/:id', handler: _lazy_uqKNVP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/calendar/events/:id', handler: _lazy_vbCMRY, lazy: true, middleware: false, method: "get" },
  { route: '/api/calendar/events/:id', handler: _lazy_lZt1Rd, lazy: true, middleware: false, method: "put" },
  { route: '/api/calendar/tasks', handler: _lazy_mPjfwH, lazy: true, middleware: false, method: "get" },
  { route: '/api/calendar/tasks', handler: _lazy_lzgNHX, lazy: true, middleware: false, method: "post" },
  { route: '/api/calendar/tasks/:id', handler: _lazy_qGaz5o, lazy: true, middleware: false, method: "delete" },
  { route: '/api/calendar/tasks/:id', handler: _lazy_iqFo1A, lazy: true, middleware: false, method: "put" },
  { route: '/api/chat/events', handler: _lazy_MMmdRs, lazy: true, middleware: false, method: "get" },
  { route: '/api/chat/events/subscribe', handler: _lazy_ffI4A9, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/rooms', handler: _lazy_6_KiFE, lazy: true, middleware: false, method: "get" },
  { route: '/api/chat/rooms', handler: _lazy_RzIjua, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/rooms/:roomId', handler: _lazy_TvpHbc, lazy: true, middleware: false, method: "get" },
  { route: '/api/chat/rooms/:roomId/messages', handler: _lazy_EJ6pJR, lazy: true, middleware: false, method: "get" },
  { route: '/api/chat/rooms/:roomId/messages', handler: _lazy_315NNl, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/rooms/:roomId/messages/read', handler: _lazy_9jC0PB, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/rooms/:roomId/notes', handler: _lazy_3MA1wu, lazy: true, middleware: false, method: "get" },
  { route: '/api/chat/rooms/:roomId/notes', handler: _lazy_6j0NJg, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/rooms/:roomId/notes/:noteId', handler: _lazy_2W3AJk, lazy: true, middleware: false, method: "put" },
  { route: '/api/chat/rooms/:roomId/tags', handler: _lazy_0JpYFT, lazy: true, middleware: false, method: "get" },
  { route: '/api/chat/rooms/:roomId/tags', handler: _lazy_4NydRk, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/rooms/:roomId/typing', handler: _lazy_vyASc6, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/rooms/:roomId/typing/stop', handler: _lazy_ghfekQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/upload', handler: _lazy_idmILl, lazy: true, middleware: false, method: "post" },
  { route: '/api/content-pages/:slug', handler: _lazy_2NT1du, lazy: true, middleware: false, method: "get" },
  { route: '/api/courses', handler: _lazy_mx8Aex, lazy: true, middleware: false, method: "get" },
  { route: '/api/courses/:id', handler: _lazy_oTk_6L, lazy: true, middleware: false, method: "get" },
  { route: '/api/health', handler: _lazy_9kdm43, lazy: true, middleware: false, method: "get" },
  { route: '/api/learning/available-chats', handler: _lazy_T3RIcs, lazy: true, middleware: false, method: "get" },
  { route: '/api/learning/my-courses', handler: _lazy_XwZV5m, lazy: true, middleware: false, method: "get" },
  { route: '/api/testimonials', handler: _lazy_RY2uvW, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_US9tyS, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_US9tyS, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
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
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
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
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
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
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server$2({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$3(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
{
  const { handleUpgrade } = nodeAdapter(nitroApp.h3App.websocket);
  server.on("upgrade", handleUpgrade);
}
const nodeServer = {};

export { $fetch as $, setHeader as A, getUserChatRooms as B, verifyRoomAccess as C, createChatRoom as D, getChatMessages as E, saveMessage as F, useNitroApp as G, markMessagesAsRead as H, joinRelativeURL as I, getResponseStatusText as J, getResponseStatus as K, defineRenderHandler as L, destr as M, getRouteRules as N, hasProtocol as O, isScriptProtocol as P, joinURL as Q, withQuery as R, sanitizeStatusCode as S, getContext as T, UserRole as U, klona as V, parse as W, getRequestHeader as X, isEqual as Y, deleteCookie as Z, createHooks as _, getQuery as a, executeAsync as a0, toRouteMatcher as a1, createRouter$1 as a2, defu as a3, parseQuery as a4, withTrailingSlash as a5, withoutTrailingSlash as a6, nodeServer as a7, jwt as a8, db as a9, user_types as aa, auth_service as ab, getRouterParam as b, createError$1 as c, defineEventHandler as d, execute as e, getUserWithRoles as f, getUserRoles as g, getAllChatRooms as h, getChatRoom as i, getHighestPriorityRole as j, getCookie as k, getHeader as l, findUserById as m, readMultipartFormData as n, findUserByIdentifier as o, findUserByEmail as p, query as q, readBody as r, UserStatus as s, login as t, setCookie as u, verifyAccessToken as v, useRuntimeConfig as w, createUser as x, generateAccessToken as y, generateRefreshToken as z };
//# sourceMappingURL=nitro.mjs.map
