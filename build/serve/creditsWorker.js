var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
import { createRequire } from "node:module";
var __require = createRequire(import.meta.url);

var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from3, except, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/util.js
var require_util = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/util.js"(exports, module) {
    var ERROR_MSG_INPUT = "Input must be an string, Buffer or Uint8Array";
    function normalizeInput(input) {
      let ret;
      if (input instanceof Uint8Array) {
        ret = input;
      } else if (typeof input === "string") {
        const encoder3 = new TextEncoder();
        ret = encoder3.encode(input);
      } else {
        throw new Error(ERROR_MSG_INPUT);
      }
      return ret;
    }
    function toHex(bytes) {
      return Array.prototype.map.call(bytes, function(n) {
        return (n < 16 ? "0" : "") + n.toString(16);
      }).join("");
    }
    function uint32ToHex(val) {
      return (4294967296 + val).toString(16).substring(1);
    }
    function debugPrint(label, arr, size) {
      let msg = "\n" + label + " = ";
      for (let i = 0; i < arr.length; i += 2) {
        if (size === 32) {
          msg += uint32ToHex(arr[i]).toUpperCase();
          msg += " ";
          msg += uint32ToHex(arr[i + 1]).toUpperCase();
        } else if (size === 64) {
          msg += uint32ToHex(arr[i + 1]).toUpperCase();
          msg += uint32ToHex(arr[i]).toUpperCase();
        } else throw new Error("Invalid size " + size);
        if (i % 6 === 4) {
          msg += "\n" + new Array(label.length + 4).join(" ");
        } else if (i < arr.length - 2) {
          msg += " ";
        }
      }
      console.log(msg);
    }
    function testSpeed(hashFn, N, M) {
      let startMs = (/* @__PURE__ */ new Date()).getTime();
      const input = new Uint8Array(N);
      for (let i = 0; i < N; i++) {
        input[i] = i % 256;
      }
      const genMs = (/* @__PURE__ */ new Date()).getTime();
      console.log("Generated random input in " + (genMs - startMs) + "ms");
      startMs = genMs;
      for (let i = 0; i < M; i++) {
        const hashHex = hashFn(input);
        const hashMs = (/* @__PURE__ */ new Date()).getTime();
        const ms = hashMs - startMs;
        startMs = hashMs;
        console.log("Hashed in " + ms + "ms: " + hashHex.substring(0, 20) + "...");
        console.log(Math.round(N / (1 << 20) / (ms / 1e3) * 100) / 100 + " MB PER SECOND");
      }
    }
    module.exports = {
      normalizeInput,
      toHex,
      debugPrint,
      testSpeed
    };
  }
});

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2b.js
var require_blake2b = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2b.js"(exports, module) {
    var util = require_util();
    function ADD64AA(v2, a, b) {
      const o0 = v2[a] + v2[b];
      let o1 = v2[a + 1] + v2[b + 1];
      if (o0 >= 4294967296) {
        o1++;
      }
      v2[a] = o0;
      v2[a + 1] = o1;
    }
    function ADD64AC(v2, a, b0, b1) {
      let o0 = v2[a] + b0;
      if (b0 < 0) {
        o0 += 4294967296;
      }
      let o1 = v2[a + 1] + b1;
      if (o0 >= 4294967296) {
        o1++;
      }
      v2[a] = o0;
      v2[a + 1] = o1;
    }
    function B2B_GET32(arr, i) {
      return arr[i] ^ arr[i + 1] << 8 ^ arr[i + 2] << 16 ^ arr[i + 3] << 24;
    }
    function B2B_G(a, b, c, d, ix, iy) {
      const x0 = m[ix];
      const x1 = m[ix + 1];
      const y0 = m[iy];
      const y1 = m[iy + 1];
      ADD64AA(v, a, b);
      ADD64AC(v, a, x0, x1);
      let xor0 = v[d] ^ v[a];
      let xor1 = v[d + 1] ^ v[a + 1];
      v[d] = xor1;
      v[d + 1] = xor0;
      ADD64AA(v, c, d);
      xor0 = v[b] ^ v[c];
      xor1 = v[b + 1] ^ v[c + 1];
      v[b] = xor0 >>> 24 ^ xor1 << 8;
      v[b + 1] = xor1 >>> 24 ^ xor0 << 8;
      ADD64AA(v, a, b);
      ADD64AC(v, a, y0, y1);
      xor0 = v[d] ^ v[a];
      xor1 = v[d + 1] ^ v[a + 1];
      v[d] = xor0 >>> 16 ^ xor1 << 16;
      v[d + 1] = xor1 >>> 16 ^ xor0 << 16;
      ADD64AA(v, c, d);
      xor0 = v[b] ^ v[c];
      xor1 = v[b + 1] ^ v[c + 1];
      v[b] = xor1 >>> 31 ^ xor0 << 1;
      v[b + 1] = xor0 >>> 31 ^ xor1 << 1;
    }
    var BLAKE2B_IV32 = new Uint32Array([
      4089235720,
      1779033703,
      2227873595,
      3144134277,
      4271175723,
      1013904242,
      1595750129,
      2773480762,
      2917565137,
      1359893119,
      725511199,
      2600822924,
      4215389547,
      528734635,
      327033209,
      1541459225
    ]);
    var SIGMA8 = [
      0,
      1,
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
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0,
      0,
      1,
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
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3
    ];
    var SIGMA82 = new Uint8Array(SIGMA8.map(function(x) {
      return x * 2;
    }));
    var v = new Uint32Array(32);
    var m = new Uint32Array(32);
    function blake2bCompress(ctx, last) {
      let i = 0;
      for (i = 0; i < 16; i++) {
        v[i] = ctx.h[i];
        v[i + 16] = BLAKE2B_IV32[i];
      }
      v[24] = v[24] ^ ctx.t;
      v[25] = v[25] ^ ctx.t / 4294967296;
      if (last) {
        v[28] = ~v[28];
        v[29] = ~v[29];
      }
      for (i = 0; i < 32; i++) {
        m[i] = B2B_GET32(ctx.b, 4 * i);
      }
      for (i = 0; i < 12; i++) {
        B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
        B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
        B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
        B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
        B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
        B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
        B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
        B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
      }
      for (i = 0; i < 16; i++) {
        ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
      }
    }
    var parameterBlock = new Uint8Array([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
      // 60: personal
    ]);
    function blake2bInit2(outlen, key, salt, personal) {
      if (outlen === 0 || outlen > 64) {
        throw new Error("Illegal output length, expected 0 < length <= 64");
      }
      if (key && key.length > 64) {
        throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
      }
      if (salt && salt.length !== 16) {
        throw new Error("Illegal salt, expected Uint8Array with length is 16");
      }
      if (personal && personal.length !== 16) {
        throw new Error("Illegal personal, expected Uint8Array with length is 16");
      }
      const ctx = {
        b: new Uint8Array(128),
        h: new Uint32Array(16),
        t: 0,
        c: 0,
        outlen
        // output length in bytes
      };
      parameterBlock.fill(0);
      parameterBlock[0] = outlen;
      if (key) parameterBlock[1] = key.length;
      parameterBlock[2] = 1;
      parameterBlock[3] = 1;
      if (salt) parameterBlock.set(salt, 32);
      if (personal) parameterBlock.set(personal, 48);
      for (let i = 0; i < 16; i++) {
        ctx.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameterBlock, i * 4);
      }
      if (key) {
        blake2bUpdate2(ctx, key);
        ctx.c = 128;
      }
      return ctx;
    }
    function blake2bUpdate2(ctx, input) {
      for (let i = 0; i < input.length; i++) {
        if (ctx.c === 128) {
          ctx.t += ctx.c;
          blake2bCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i];
      }
    }
    function blake2bFinal2(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 128) {
        ctx.b[ctx.c++] = 0;
      }
      blake2bCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i = 0; i < ctx.outlen; i++) {
        out[i] = ctx.h[i >> 2] >> 8 * (i & 3);
      }
      return out;
    }
    function blake2b3(input, key, outlen, salt, personal) {
      outlen = outlen || 64;
      input = util.normalizeInput(input);
      if (salt) {
        salt = util.normalizeInput(salt);
      }
      if (personal) {
        personal = util.normalizeInput(personal);
      }
      const ctx = blake2bInit2(outlen, key, salt, personal);
      blake2bUpdate2(ctx, input);
      return blake2bFinal2(ctx);
    }
    function blake2bHex(input, key, outlen, salt, personal) {
      const output = blake2b3(input, key, outlen, salt, personal);
      return util.toHex(output);
    }
    module.exports = {
      blake2b: blake2b3,
      blake2bHex,
      blake2bInit: blake2bInit2,
      blake2bUpdate: blake2bUpdate2,
      blake2bFinal: blake2bFinal2
    };
  }
});

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2s.js
var require_blake2s = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2s.js"(exports, module) {
    var util = require_util();
    function B2S_GET32(v2, i) {
      return v2[i] ^ v2[i + 1] << 8 ^ v2[i + 2] << 16 ^ v2[i + 3] << 24;
    }
    function B2S_G(a, b, c, d, x, y) {
      v[a] = v[a] + v[b] + x;
      v[d] = ROTR32(v[d] ^ v[a], 16);
      v[c] = v[c] + v[d];
      v[b] = ROTR32(v[b] ^ v[c], 12);
      v[a] = v[a] + v[b] + y;
      v[d] = ROTR32(v[d] ^ v[a], 8);
      v[c] = v[c] + v[d];
      v[b] = ROTR32(v[b] ^ v[c], 7);
    }
    function ROTR32(x, y) {
      return x >>> y ^ x << 32 - y;
    }
    var BLAKE2S_IV = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    var SIGMA = new Uint8Array([
      0,
      1,
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
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0
    ]);
    var v = new Uint32Array(16);
    var m = new Uint32Array(16);
    function blake2sCompress(ctx, last) {
      let i = 0;
      for (i = 0; i < 8; i++) {
        v[i] = ctx.h[i];
        v[i + 8] = BLAKE2S_IV[i];
      }
      v[12] ^= ctx.t;
      v[13] ^= ctx.t / 4294967296;
      if (last) {
        v[14] = ~v[14];
      }
      for (i = 0; i < 16; i++) {
        m[i] = B2S_GET32(ctx.b, 4 * i);
      }
      for (i = 0; i < 10; i++) {
        B2S_G(0, 4, 8, 12, m[SIGMA[i * 16 + 0]], m[SIGMA[i * 16 + 1]]);
        B2S_G(1, 5, 9, 13, m[SIGMA[i * 16 + 2]], m[SIGMA[i * 16 + 3]]);
        B2S_G(2, 6, 10, 14, m[SIGMA[i * 16 + 4]], m[SIGMA[i * 16 + 5]]);
        B2S_G(3, 7, 11, 15, m[SIGMA[i * 16 + 6]], m[SIGMA[i * 16 + 7]]);
        B2S_G(0, 5, 10, 15, m[SIGMA[i * 16 + 8]], m[SIGMA[i * 16 + 9]]);
        B2S_G(1, 6, 11, 12, m[SIGMA[i * 16 + 10]], m[SIGMA[i * 16 + 11]]);
        B2S_G(2, 7, 8, 13, m[SIGMA[i * 16 + 12]], m[SIGMA[i * 16 + 13]]);
        B2S_G(3, 4, 9, 14, m[SIGMA[i * 16 + 14]], m[SIGMA[i * 16 + 15]]);
      }
      for (i = 0; i < 8; i++) {
        ctx.h[i] ^= v[i] ^ v[i + 8];
      }
    }
    function blake2sInit(outlen, key) {
      if (!(outlen > 0 && outlen <= 32)) {
        throw new Error("Incorrect output length, should be in [1, 32]");
      }
      const keylen = key ? key.length : 0;
      if (key && !(keylen > 0 && keylen <= 32)) {
        throw new Error("Incorrect key length, should be in [1, 32]");
      }
      const ctx = {
        h: new Uint32Array(BLAKE2S_IV),
        b: new Uint8Array(64),
        c: 0,
        t: 0,
        outlen
        // output length in bytes
      };
      ctx.h[0] ^= 16842752 ^ keylen << 8 ^ outlen;
      if (keylen > 0) {
        blake2sUpdate(ctx, key);
        ctx.c = 64;
      }
      return ctx;
    }
    function blake2sUpdate(ctx, input) {
      for (let i = 0; i < input.length; i++) {
        if (ctx.c === 64) {
          ctx.t += ctx.c;
          blake2sCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i];
      }
    }
    function blake2sFinal(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 64) {
        ctx.b[ctx.c++] = 0;
      }
      blake2sCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i = 0; i < ctx.outlen; i++) {
        out[i] = ctx.h[i >> 2] >> 8 * (i & 3) & 255;
      }
      return out;
    }
    function blake2s(input, key, outlen) {
      outlen = outlen || 32;
      input = util.normalizeInput(input);
      const ctx = blake2sInit(outlen, key);
      blake2sUpdate(ctx, input);
      return blake2sFinal(ctx);
    }
    function blake2sHex(input, key, outlen) {
      const output = blake2s(input, key, outlen);
      return util.toHex(output);
    }
    module.exports = {
      blake2s,
      blake2sHex,
      blake2sInit,
      blake2sUpdate,
      blake2sFinal
    };
  }
});

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/index.js
var require_blakejs = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/index.js"(exports, module) {
    var b2b = require_blake2b();
    var b2s = require_blake2s();
    module.exports = {
      blake2b: b2b.blake2b,
      blake2bHex: b2b.blake2bHex,
      blake2bInit: b2b.blake2bInit,
      blake2bUpdate: b2b.blake2bUpdate,
      blake2bFinal: b2b.blake2bFinal,
      blake2s: b2s.blake2s,
      blake2sHex: b2s.blake2sHex,
      blake2sInit: b2s.blake2sInit,
      blake2sUpdate: b2s.blake2sUpdate,
      blake2sFinal: b2s.blake2sFinal
    };
  }
});

// node_modules/.deno/scrypt-async@2.0.1/node_modules/scrypt-async/scrypt-async.js
var require_scrypt_async = __commonJS({
  "node_modules/.deno/scrypt-async@2.0.1/node_modules/scrypt-async/scrypt-async.js"(exports, module) {
    function scrypt3(password, salt, logN, r, dkLen, interruptStep, callback, encoding) {
      "use strict";
      function SHA256(m) {
        var K = [
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ];
        var h0 = 1779033703, h1 = 3144134277, h2 = 1013904242, h3 = 2773480762, h4 = 1359893119, h5 = 2600822924, h6 = 528734635, h7 = 1541459225, w = new Array(64);
        function blocks(p3) {
          var off = 0, len = p3.length;
          while (len >= 64) {
            var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7, u, i2, j, t1, t2;
            for (i2 = 0; i2 < 16; i2++) {
              j = off + i2 * 4;
              w[i2] = (p3[j] & 255) << 24 | (p3[j + 1] & 255) << 16 | (p3[j + 2] & 255) << 8 | p3[j + 3] & 255;
            }
            for (i2 = 16; i2 < 64; i2++) {
              u = w[i2 - 2];
              t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
              u = w[i2 - 15];
              t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
              w[i2] = (t1 + w[i2 - 7] | 0) + (t2 + w[i2 - 16] | 0) | 0;
            }
            for (i2 = 0; i2 < 64; i2++) {
              t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i2] + w[i2] | 0) | 0) | 0;
              t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
              h = g;
              g = f;
              f = e;
              e = d + t1 | 0;
              d = c;
              c = b;
              b = a;
              a = t1 + t2 | 0;
            }
            h0 = h0 + a | 0;
            h1 = h1 + b | 0;
            h2 = h2 + c | 0;
            h3 = h3 + d | 0;
            h4 = h4 + e | 0;
            h5 = h5 + f | 0;
            h6 = h6 + g | 0;
            h7 = h7 + h | 0;
            off += 64;
            len -= 64;
          }
        }
        blocks(m);
        var i, bytesLeft = m.length % 64, bitLenHi = m.length / 536870912 | 0, bitLenLo = m.length << 3, numZeros = bytesLeft < 56 ? 56 : 120, p2 = m.slice(m.length - bytesLeft, m.length);
        p2.push(128);
        for (i = bytesLeft + 1; i < numZeros; i++) p2.push(0);
        p2.push(bitLenHi >>> 24 & 255);
        p2.push(bitLenHi >>> 16 & 255);
        p2.push(bitLenHi >>> 8 & 255);
        p2.push(bitLenHi >>> 0 & 255);
        p2.push(bitLenLo >>> 24 & 255);
        p2.push(bitLenLo >>> 16 & 255);
        p2.push(bitLenLo >>> 8 & 255);
        p2.push(bitLenLo >>> 0 & 255);
        blocks(p2);
        return [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 >>> 0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 >>> 0 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 >>> 0 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 >>> 0 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 >>> 0 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 >>> 0 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 >>> 0 & 255,
          h7 >>> 24 & 255,
          h7 >>> 16 & 255,
          h7 >>> 8 & 255,
          h7 >>> 0 & 255
        ];
      }
      function PBKDF2_HMAC_SHA256_OneIter(password2, salt2, dkLen2) {
        if (password2.length > 64) {
          password2 = SHA256(password2.push ? password2 : Array.prototype.slice.call(password2, 0));
        }
        var i, innerLen = 64 + salt2.length + 4, inner = new Array(innerLen), outerKey = new Array(64), dk = [];
        for (i = 0; i < 64; i++) inner[i] = 54;
        for (i = 0; i < password2.length; i++) inner[i] ^= password2[i];
        for (i = 0; i < salt2.length; i++) inner[64 + i] = salt2[i];
        for (i = innerLen - 4; i < innerLen; i++) inner[i] = 0;
        for (i = 0; i < 64; i++) outerKey[i] = 92;
        for (i = 0; i < password2.length; i++) outerKey[i] ^= password2[i];
        function incrementCounter() {
          for (var i2 = innerLen - 1; i2 >= innerLen - 4; i2--) {
            inner[i2]++;
            if (inner[i2] <= 255) return;
            inner[i2] = 0;
          }
        }
        while (dkLen2 >= 32) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
          dkLen2 -= 32;
        }
        if (dkLen2 > 0) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen2));
        }
        return dk;
      }
      function salsaXOR(tmp2, B2, bin, bout) {
        var j0 = tmp2[0] ^ B2[bin++], j1 = tmp2[1] ^ B2[bin++], j2 = tmp2[2] ^ B2[bin++], j3 = tmp2[3] ^ B2[bin++], j4 = tmp2[4] ^ B2[bin++], j5 = tmp2[5] ^ B2[bin++], j6 = tmp2[6] ^ B2[bin++], j7 = tmp2[7] ^ B2[bin++], j8 = tmp2[8] ^ B2[bin++], j9 = tmp2[9] ^ B2[bin++], j10 = tmp2[10] ^ B2[bin++], j11 = tmp2[11] ^ B2[bin++], j12 = tmp2[12] ^ B2[bin++], j13 = tmp2[13] ^ B2[bin++], j14 = tmp2[14] ^ B2[bin++], j15 = tmp2[15] ^ B2[bin++], u, i;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15;
        for (i = 0; i < 8; i += 2) {
          u = x0 + x12;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        B2[bout++] = tmp2[0] = x0 + j0 | 0;
        B2[bout++] = tmp2[1] = x1 + j1 | 0;
        B2[bout++] = tmp2[2] = x2 + j2 | 0;
        B2[bout++] = tmp2[3] = x3 + j3 | 0;
        B2[bout++] = tmp2[4] = x4 + j4 | 0;
        B2[bout++] = tmp2[5] = x5 + j5 | 0;
        B2[bout++] = tmp2[6] = x6 + j6 | 0;
        B2[bout++] = tmp2[7] = x7 + j7 | 0;
        B2[bout++] = tmp2[8] = x8 + j8 | 0;
        B2[bout++] = tmp2[9] = x9 + j9 | 0;
        B2[bout++] = tmp2[10] = x10 + j10 | 0;
        B2[bout++] = tmp2[11] = x11 + j11 | 0;
        B2[bout++] = tmp2[12] = x12 + j12 | 0;
        B2[bout++] = tmp2[13] = x13 + j13 | 0;
        B2[bout++] = tmp2[14] = x14 + j14 | 0;
        B2[bout++] = tmp2[15] = x15 + j15 | 0;
      }
      function blockCopy(dst, di, src2, si, len) {
        while (len--) dst[di++] = src2[si++];
      }
      function blockXOR(dst, di, src2, si, len) {
        while (len--) dst[di++] ^= src2[si++];
      }
      function blockMix(tmp2, B2, bin, bout, r2) {
        blockCopy(tmp2, 0, B2, bin + (2 * r2 - 1) * 16, 16);
        for (var i = 0; i < 2 * r2; i += 2) {
          salsaXOR(tmp2, B2, bin + i * 16, bout + i * 8);
          salsaXOR(tmp2, B2, bin + i * 16 + 16, bout + i * 8 + r2 * 16);
        }
      }
      function integerify(B2, bi, r2) {
        return B2[bi + (2 * r2 - 1) * 16];
      }
      function stringToUTF8Bytes(s) {
        var arr = [];
        for (var i = 0; i < s.length; i++) {
          var c = s.charCodeAt(i);
          if (c < 128) {
            arr.push(c);
          } else if (c < 2048) {
            arr.push(192 | c >> 6);
            arr.push(128 | c & 63);
          } else if (c < 55296) {
            arr.push(224 | c >> 12);
            arr.push(128 | c >> 6 & 63);
            arr.push(128 | c & 63);
          } else {
            if (i >= s.length - 1) {
              throw new Error("invalid string");
            }
            i++;
            c = (c & 1023) << 10;
            c |= s.charCodeAt(i) & 1023;
            c += 65536;
            arr.push(240 | c >> 18);
            arr.push(128 | c >> 12 & 63);
            arr.push(128 | c >> 6 & 63);
            arr.push(128 | c & 63);
          }
        }
        return arr;
      }
      function bytesToHex(p2) {
        var enc = "0123456789abcdef".split("");
        var len = p2.length, arr = [], i = 0;
        for (; i < len; i++) {
          arr.push(enc[p2[i] >>> 4 & 15]);
          arr.push(enc[p2[i] >>> 0 & 15]);
        }
        return arr.join("");
      }
      function bytesToBase64(p2) {
        var enc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
        var len = p2.length, arr = [], i = 0, a, b, c, t;
        while (i < len) {
          a = i < len ? p2[i++] : 0;
          b = i < len ? p2[i++] : 0;
          c = i < len ? p2[i++] : 0;
          t = (a << 16) + (b << 8) + c;
          arr.push(enc[t >>> 3 * 6 & 63]);
          arr.push(enc[t >>> 2 * 6 & 63]);
          arr.push(enc[t >>> 1 * 6 & 63]);
          arr.push(enc[t >>> 0 * 6 & 63]);
        }
        if (len % 3 > 0) {
          arr[arr.length - 1] = "=";
          if (len % 3 === 1) arr[arr.length - 2] = "=";
        }
        return arr.join("");
      }
      var MAX_UINT = -1 >>> 0, p = 1;
      if (typeof logN === "object") {
        if (arguments.length > 4) {
          throw new Error("scrypt: incorrect number of arguments");
        }
        var opts = logN;
        callback = r;
        logN = opts.logN;
        if (typeof logN === "undefined") {
          if (typeof opts.N !== "undefined") {
            if (opts.N < 2 || opts.N > MAX_UINT) throw new Error("scrypt: N is out of range");
            if ((opts.N & opts.N - 1) !== 0) throw new Error("scrypt: N is not a power of 2");
            logN = Math.log(opts.N) / Math.LN2;
          } else {
            throw new Error("scrypt: missing N parameter");
          }
        }
        p = opts.p || 1;
        r = opts.r;
        dkLen = opts.dkLen || 32;
        interruptStep = opts.interruptStep || 0;
        encoding = opts.encoding;
      }
      if (p < 1) throw new Error("scrypt: invalid p");
      if (r <= 0) throw new Error("scrypt: invalid r");
      if (logN < 1 || logN > 31) throw new Error("scrypt: logN must be between 1 and 31");
      var N = 1 << logN >>> 0, XY, V, B, tmp;
      if (r * p >= 1 << 30 || r > MAX_UINT / 128 / p || r > MAX_UINT / 256 || N > MAX_UINT / 128 / r) throw new Error("scrypt: parameters are too large");
      if (typeof password === "string") password = stringToUTF8Bytes(password);
      if (typeof salt === "string") salt = stringToUTF8Bytes(salt);
      if (typeof Int32Array !== "undefined") {
        XY = new Int32Array(64 * r);
        V = new Int32Array(32 * N * r);
        tmp = new Int32Array(16);
      } else {
        XY = [];
        V = [];
        tmp = new Array(16);
      }
      B = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r);
      var xi = 0, yi = 32 * r;
      function smixStart(pos) {
        for (var i = 0; i < 32 * r; i++) {
          var j = pos + i * 4;
          XY[xi + i] = (B[j + 3] & 255) << 24 | (B[j + 2] & 255) << 16 | (B[j + 1] & 255) << 8 | (B[j + 0] & 255) << 0;
        }
      }
      function smixStep1(start, end) {
        for (var i = start; i < end; i += 2) {
          blockCopy(V, i * (32 * r), XY, xi, 32 * r);
          blockMix(tmp, XY, xi, yi, r);
          blockCopy(V, (i + 1) * (32 * r), XY, yi, 32 * r);
          blockMix(tmp, XY, yi, xi, r);
        }
      }
      function smixStep2(start, end) {
        for (var i = start; i < end; i += 2) {
          var j = integerify(XY, xi, r) & N - 1;
          blockXOR(XY, xi, V, j * (32 * r), 32 * r);
          blockMix(tmp, XY, xi, yi, r);
          j = integerify(XY, yi, r) & N - 1;
          blockXOR(XY, yi, V, j * (32 * r), 32 * r);
          blockMix(tmp, XY, yi, xi, r);
        }
      }
      function smixFinish(pos) {
        for (var i = 0; i < 32 * r; i++) {
          var j = XY[xi + i];
          B[pos + i * 4 + 0] = j >>> 0 & 255;
          B[pos + i * 4 + 1] = j >>> 8 & 255;
          B[pos + i * 4 + 2] = j >>> 16 & 255;
          B[pos + i * 4 + 3] = j >>> 24 & 255;
        }
      }
      var nextTick = typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
      function interruptedFor(start, end, step, fn, donefn) {
        (function performStep() {
          nextTick(function() {
            fn(start, start + step < end ? start + step : end);
            start += step;
            if (start < end) performStep();
            else donefn();
          });
        })();
      }
      function getResult(enc) {
        var result = PBKDF2_HMAC_SHA256_OneIter(password, B, dkLen);
        if (enc === "base64") return bytesToBase64(result);
        else if (enc === "hex") return bytesToHex(result);
        else if (enc === "binary") return new Uint8Array(result);
        else return result;
      }
      function calculateSync() {
        for (var i = 0; i < p; i++) {
          smixStart(i * 128 * r);
          smixStep1(0, N);
          smixStep2(0, N);
          smixFinish(i * 128 * r);
        }
        callback(getResult(encoding));
      }
      function calculateAsync(i) {
        smixStart(i * 128 * r);
        interruptedFor(0, N, interruptStep * 2, smixStep1, function() {
          interruptedFor(0, N, interruptStep * 2, smixStep2, function() {
            smixFinish(i * 128 * r);
            if (i + 1 < p) {
              nextTick(function() {
                calculateAsync(i + 1);
              });
            } else {
              callback(getResult(encoding));
            }
          });
        });
      }
      if (typeof interruptStep === "function") {
        encoding = callback;
        callback = interruptStep;
        interruptStep = 1e3;
      }
      if (interruptStep <= 0) {
        calculateSync();
      } else {
        calculateAsync(0);
      }
    }
    if (typeof module !== "undefined") module.exports = scrypt3;
  }
});

// node_modules/.deno/tweetnacl@1.0.3/node_modules/tweetnacl/nacl-fast.js
var require_nacl_fast = __commonJS({
  "node_modules/.deno/tweetnacl@1.0.3/node_modules/tweetnacl/nacl-fast.js"(exports, module) {
    (function(nacl3) {
      "use strict";
      var gf = function(init2) {
        var i, r = new Float64Array(16);
        if (init2) for (i = 0; i < init2.length; i++) r[i] = init2[i];
        return r;
      };
      var randombytes = function() {
        throw new Error("no PRNG");
      };
      var _0 = new Uint8Array(16);
      var _9 = new Uint8Array(32);
      _9[0] = 9;
      var gf0 = gf(), gf1 = gf([
        1
      ]), _121665 = gf([
        56129,
        1
      ]), D = gf([
        30883,
        4953,
        19914,
        30187,
        55467,
        16705,
        2637,
        112,
        59544,
        30585,
        16505,
        36039,
        65139,
        11119,
        27886,
        20995
      ]), D2 = gf([
        61785,
        9906,
        39828,
        60374,
        45398,
        33411,
        5274,
        224,
        53552,
        61171,
        33010,
        6542,
        64743,
        22239,
        55772,
        9222
      ]), X = gf([
        54554,
        36645,
        11616,
        51542,
        42930,
        38181,
        51040,
        26924,
        56412,
        64982,
        57905,
        49316,
        21502,
        52590,
        14035,
        8553
      ]), Y = gf([
        26200,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214
      ]), I = gf([
        41136,
        18958,
        6951,
        50414,
        58488,
        44335,
        6150,
        12099,
        55207,
        15867,
        153,
        11085,
        57099,
        20417,
        9344,
        11139
      ]);
      function ts64(x, i, h, l) {
        x[i] = h >> 24 & 255;
        x[i + 1] = h >> 16 & 255;
        x[i + 2] = h >> 8 & 255;
        x[i + 3] = h & 255;
        x[i + 4] = l >> 24 & 255;
        x[i + 5] = l >> 16 & 255;
        x[i + 6] = l >> 8 & 255;
        x[i + 7] = l & 255;
      }
      function vn(x, xi, y, yi, n) {
        var i, d = 0;
        for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
        return (1 & d - 1 >>> 8) - 1;
      }
      function crypto_verify_16(x, xi, y, yi) {
        return vn(x, xi, y, yi, 16);
      }
      function crypto_verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32);
      }
      function core_salsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        x0 = x0 + j0 | 0;
        x1 = x1 + j1 | 0;
        x2 = x2 + j2 | 0;
        x3 = x3 + j3 | 0;
        x4 = x4 + j4 | 0;
        x5 = x5 + j5 | 0;
        x6 = x6 + j6 | 0;
        x7 = x7 + j7 | 0;
        x8 = x8 + j8 | 0;
        x9 = x9 + j9 | 0;
        x10 = x10 + j10 | 0;
        x11 = x11 + j11 | 0;
        x12 = x12 + j12 | 0;
        x13 = x13 + j13 | 0;
        x14 = x14 + j14 | 0;
        x15 = x15 + j15 | 0;
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x1 >>> 0 & 255;
        o[5] = x1 >>> 8 & 255;
        o[6] = x1 >>> 16 & 255;
        o[7] = x1 >>> 24 & 255;
        o[8] = x2 >>> 0 & 255;
        o[9] = x2 >>> 8 & 255;
        o[10] = x2 >>> 16 & 255;
        o[11] = x2 >>> 24 & 255;
        o[12] = x3 >>> 0 & 255;
        o[13] = x3 >>> 8 & 255;
        o[14] = x3 >>> 16 & 255;
        o[15] = x3 >>> 24 & 255;
        o[16] = x4 >>> 0 & 255;
        o[17] = x4 >>> 8 & 255;
        o[18] = x4 >>> 16 & 255;
        o[19] = x4 >>> 24 & 255;
        o[20] = x5 >>> 0 & 255;
        o[21] = x5 >>> 8 & 255;
        o[22] = x5 >>> 16 & 255;
        o[23] = x5 >>> 24 & 255;
        o[24] = x6 >>> 0 & 255;
        o[25] = x6 >>> 8 & 255;
        o[26] = x6 >>> 16 & 255;
        o[27] = x6 >>> 24 & 255;
        o[28] = x7 >>> 0 & 255;
        o[29] = x7 >>> 8 & 255;
        o[30] = x7 >>> 16 & 255;
        o[31] = x7 >>> 24 & 255;
        o[32] = x8 >>> 0 & 255;
        o[33] = x8 >>> 8 & 255;
        o[34] = x8 >>> 16 & 255;
        o[35] = x8 >>> 24 & 255;
        o[36] = x9 >>> 0 & 255;
        o[37] = x9 >>> 8 & 255;
        o[38] = x9 >>> 16 & 255;
        o[39] = x9 >>> 24 & 255;
        o[40] = x10 >>> 0 & 255;
        o[41] = x10 >>> 8 & 255;
        o[42] = x10 >>> 16 & 255;
        o[43] = x10 >>> 24 & 255;
        o[44] = x11 >>> 0 & 255;
        o[45] = x11 >>> 8 & 255;
        o[46] = x11 >>> 16 & 255;
        o[47] = x11 >>> 24 & 255;
        o[48] = x12 >>> 0 & 255;
        o[49] = x12 >>> 8 & 255;
        o[50] = x12 >>> 16 & 255;
        o[51] = x12 >>> 24 & 255;
        o[52] = x13 >>> 0 & 255;
        o[53] = x13 >>> 8 & 255;
        o[54] = x13 >>> 16 & 255;
        o[55] = x13 >>> 24 & 255;
        o[56] = x14 >>> 0 & 255;
        o[57] = x14 >>> 8 & 255;
        o[58] = x14 >>> 16 & 255;
        o[59] = x14 >>> 24 & 255;
        o[60] = x15 >>> 0 & 255;
        o[61] = x15 >>> 8 & 255;
        o[62] = x15 >>> 16 & 255;
        o[63] = x15 >>> 24 & 255;
      }
      function core_hsalsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x5 >>> 0 & 255;
        o[5] = x5 >>> 8 & 255;
        o[6] = x5 >>> 16 & 255;
        o[7] = x5 >>> 24 & 255;
        o[8] = x10 >>> 0 & 255;
        o[9] = x10 >>> 8 & 255;
        o[10] = x10 >>> 16 & 255;
        o[11] = x10 >>> 24 & 255;
        o[12] = x15 >>> 0 & 255;
        o[13] = x15 >>> 8 & 255;
        o[14] = x15 >>> 16 & 255;
        o[15] = x15 >>> 24 & 255;
        o[16] = x6 >>> 0 & 255;
        o[17] = x6 >>> 8 & 255;
        o[18] = x6 >>> 16 & 255;
        o[19] = x6 >>> 24 & 255;
        o[20] = x7 >>> 0 & 255;
        o[21] = x7 >>> 8 & 255;
        o[22] = x7 >>> 16 & 255;
        o[23] = x7 >>> 24 & 255;
        o[24] = x8 >>> 0 & 255;
        o[25] = x8 >>> 8 & 255;
        o[26] = x8 >>> 16 & 255;
        o[27] = x8 >>> 24 & 255;
        o[28] = x9 >>> 0 & 255;
        o[29] = x9 >>> 8 & 255;
        o[30] = x9 >>> 16 & 255;
        o[31] = x9 >>> 24 & 255;
      }
      function crypto_core_salsa20(out, inp, k, c) {
        core_salsa20(out, inp, k, c);
      }
      function crypto_core_hsalsa20(out, inp, k, c) {
        core_hsalsa20(out, inp, k, c);
      }
      var sigma = new Uint8Array([
        101,
        120,
        112,
        97,
        110,
        100,
        32,
        51,
        50,
        45,
        98,
        121,
        116,
        101,
        32,
        107
      ]);
      function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
          mpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
        }
        return 0;
      }
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = x[i];
        }
        return 0;
      }
      function crypto_stream(c, cpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20(c, cpos, d, sn, s);
      }
      function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
      }
      var poly1305 = function(key) {
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.leftover = 0;
        this.fin = 0;
        var t0, t1, t2, t3, t4, t5, t6, t7;
        t0 = key[0] & 255 | (key[1] & 255) << 8;
        this.r[0] = t0 & 8191;
        t1 = key[2] & 255 | (key[3] & 255) << 8;
        this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
        t2 = key[4] & 255 | (key[5] & 255) << 8;
        this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        t3 = key[6] & 255 | (key[7] & 255) << 8;
        this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        t4 = key[8] & 255 | (key[9] & 255) << 8;
        this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this.r[5] = t4 >>> 1 & 8190;
        t5 = key[10] & 255 | (key[11] & 255) << 8;
        this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        t6 = key[12] & 255 | (key[13] & 255) << 8;
        this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        t7 = key[14] & 255 | (key[15] & 255) << 8;
        this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this.r[9] = t7 >>> 5 & 127;
        this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
        this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
        this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
        this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
        this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
        this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
        this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
        this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
      };
      poly1305.prototype.blocks = function(m, mpos, bytes) {
        var hibit = this.fin ? 0 : 1 << 11;
        var t0, t1, t2, t3, t4, t5, t6, t7, c;
        var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
        var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
        while (bytes >= 16) {
          t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
          h0 += t0 & 8191;
          t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
          h1 += (t0 >>> 13 | t1 << 3) & 8191;
          t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
          h2 += (t1 >>> 10 | t2 << 6) & 8191;
          t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
          h3 += (t2 >>> 7 | t3 << 9) & 8191;
          t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
          h4 += (t3 >>> 4 | t4 << 12) & 8191;
          h5 += t4 >>> 1 & 8191;
          t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
          h6 += (t4 >>> 14 | t5 << 2) & 8191;
          t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
          h7 += (t5 >>> 11 | t6 << 5) & 8191;
          t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
          h8 += (t6 >>> 8 | t7 << 8) & 8191;
          h9 += t7 >>> 5 | hibit;
          c = 0;
          d0 = c;
          d0 += h0 * r0;
          d0 += h1 * (5 * r9);
          d0 += h2 * (5 * r8);
          d0 += h3 * (5 * r7);
          d0 += h4 * (5 * r6);
          c = d0 >>> 13;
          d0 &= 8191;
          d0 += h5 * (5 * r5);
          d0 += h6 * (5 * r4);
          d0 += h7 * (5 * r3);
          d0 += h8 * (5 * r2);
          d0 += h9 * (5 * r1);
          c += d0 >>> 13;
          d0 &= 8191;
          d1 = c;
          d1 += h0 * r1;
          d1 += h1 * r0;
          d1 += h2 * (5 * r9);
          d1 += h3 * (5 * r8);
          d1 += h4 * (5 * r7);
          c = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6);
          d1 += h6 * (5 * r5);
          d1 += h7 * (5 * r4);
          d1 += h8 * (5 * r3);
          d1 += h9 * (5 * r2);
          c += d1 >>> 13;
          d1 &= 8191;
          d2 = c;
          d2 += h0 * r2;
          d2 += h1 * r1;
          d2 += h2 * r0;
          d2 += h3 * (5 * r9);
          d2 += h4 * (5 * r8);
          c = d2 >>> 13;
          d2 &= 8191;
          d2 += h5 * (5 * r7);
          d2 += h6 * (5 * r6);
          d2 += h7 * (5 * r5);
          d2 += h8 * (5 * r4);
          d2 += h9 * (5 * r3);
          c += d2 >>> 13;
          d2 &= 8191;
          d3 = c;
          d3 += h0 * r3;
          d3 += h1 * r2;
          d3 += h2 * r1;
          d3 += h3 * r0;
          d3 += h4 * (5 * r9);
          c = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8);
          d3 += h6 * (5 * r7);
          d3 += h7 * (5 * r6);
          d3 += h8 * (5 * r5);
          d3 += h9 * (5 * r4);
          c += d3 >>> 13;
          d3 &= 8191;
          d4 = c;
          d4 += h0 * r4;
          d4 += h1 * r3;
          d4 += h2 * r2;
          d4 += h3 * r1;
          d4 += h4 * r0;
          c = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9);
          d4 += h6 * (5 * r8);
          d4 += h7 * (5 * r7);
          d4 += h8 * (5 * r6);
          d4 += h9 * (5 * r5);
          c += d4 >>> 13;
          d4 &= 8191;
          d5 = c;
          d5 += h0 * r5;
          d5 += h1 * r4;
          d5 += h2 * r3;
          d5 += h3 * r2;
          d5 += h4 * r1;
          c = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r0;
          d5 += h6 * (5 * r9);
          d5 += h7 * (5 * r8);
          d5 += h8 * (5 * r7);
          d5 += h9 * (5 * r6);
          c += d5 >>> 13;
          d5 &= 8191;
          d6 = c;
          d6 += h0 * r6;
          d6 += h1 * r5;
          d6 += h2 * r4;
          d6 += h3 * r3;
          d6 += h4 * r2;
          c = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1;
          d6 += h6 * r0;
          d6 += h7 * (5 * r9);
          d6 += h8 * (5 * r8);
          d6 += h9 * (5 * r7);
          c += d6 >>> 13;
          d6 &= 8191;
          d7 = c;
          d7 += h0 * r7;
          d7 += h1 * r6;
          d7 += h2 * r5;
          d7 += h3 * r4;
          d7 += h4 * r3;
          c = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2;
          d7 += h6 * r1;
          d7 += h7 * r0;
          d7 += h8 * (5 * r9);
          d7 += h9 * (5 * r8);
          c += d7 >>> 13;
          d7 &= 8191;
          d8 = c;
          d8 += h0 * r8;
          d8 += h1 * r7;
          d8 += h2 * r6;
          d8 += h3 * r5;
          d8 += h4 * r4;
          c = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3;
          d8 += h6 * r2;
          d8 += h7 * r1;
          d8 += h8 * r0;
          d8 += h9 * (5 * r9);
          c += d8 >>> 13;
          d8 &= 8191;
          d9 = c;
          d9 += h0 * r9;
          d9 += h1 * r8;
          d9 += h2 * r7;
          d9 += h3 * r6;
          d9 += h4 * r5;
          c = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4;
          d9 += h6 * r3;
          d9 += h7 * r2;
          d9 += h8 * r1;
          d9 += h9 * r0;
          c += d9 >>> 13;
          d9 &= 8191;
          c = (c << 2) + c | 0;
          c = c + d0 | 0;
          d0 = c & 8191;
          c = c >>> 13;
          d1 += c;
          h0 = d0;
          h1 = d1;
          h2 = d2;
          h3 = d3;
          h4 = d4;
          h5 = d5;
          h6 = d6;
          h7 = d7;
          h8 = d8;
          h9 = d9;
          mpos += 16;
          bytes -= 16;
        }
        this.h[0] = h0;
        this.h[1] = h1;
        this.h[2] = h2;
        this.h[3] = h3;
        this.h[4] = h4;
        this.h[5] = h5;
        this.h[6] = h6;
        this.h[7] = h7;
        this.h[8] = h8;
        this.h[9] = h9;
      };
      poly1305.prototype.finish = function(mac, macpos) {
        var g = new Uint16Array(10);
        var c, mask, f, i;
        if (this.leftover) {
          i = this.leftover;
          this.buffer[i++] = 1;
          for (; i < 16; i++) this.buffer[i] = 0;
          this.fin = 1;
          this.blocks(this.buffer, 0, 16);
        }
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        for (i = 2; i < 10; i++) {
          this.h[i] += c;
          c = this.h[i] >>> 13;
          this.h[i] &= 8191;
        }
        this.h[0] += c * 5;
        c = this.h[0] >>> 13;
        this.h[0] &= 8191;
        this.h[1] += c;
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        this.h[2] += c;
        g[0] = this.h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 8191;
        for (i = 1; i < 10; i++) {
          g[i] = this.h[i] + c;
          c = g[i] >>> 13;
          g[i] &= 8191;
        }
        g[9] -= 1 << 13;
        mask = (c ^ 1) - 1;
        for (i = 0; i < 10; i++) g[i] &= mask;
        mask = ~mask;
        for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
        this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
        this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
        this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
        this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
        this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
        this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
        this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
        this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
        f = this.h[0] + this.pad[0];
        this.h[0] = f & 65535;
        for (i = 1; i < 8; i++) {
          f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
          this.h[i] = f & 65535;
        }
        mac[macpos + 0] = this.h[0] >>> 0 & 255;
        mac[macpos + 1] = this.h[0] >>> 8 & 255;
        mac[macpos + 2] = this.h[1] >>> 0 & 255;
        mac[macpos + 3] = this.h[1] >>> 8 & 255;
        mac[macpos + 4] = this.h[2] >>> 0 & 255;
        mac[macpos + 5] = this.h[2] >>> 8 & 255;
        mac[macpos + 6] = this.h[3] >>> 0 & 255;
        mac[macpos + 7] = this.h[3] >>> 8 & 255;
        mac[macpos + 8] = this.h[4] >>> 0 & 255;
        mac[macpos + 9] = this.h[4] >>> 8 & 255;
        mac[macpos + 10] = this.h[5] >>> 0 & 255;
        mac[macpos + 11] = this.h[5] >>> 8 & 255;
        mac[macpos + 12] = this.h[6] >>> 0 & 255;
        mac[macpos + 13] = this.h[6] >>> 8 & 255;
        mac[macpos + 14] = this.h[7] >>> 0 & 255;
        mac[macpos + 15] = this.h[7] >>> 8 & 255;
      };
      poly1305.prototype.update = function(m, mpos, bytes) {
        var i, want;
        if (this.leftover) {
          want = 16 - this.leftover;
          if (want > bytes) want = bytes;
          for (i = 0; i < want; i++) this.buffer[this.leftover + i] = m[mpos + i];
          bytes -= want;
          mpos += want;
          this.leftover += want;
          if (this.leftover < 16) return;
          this.blocks(this.buffer, 0, 16);
          this.leftover = 0;
        }
        if (bytes >= 16) {
          want = bytes - bytes % 16;
          this.blocks(m, mpos, want);
          mpos += want;
          bytes -= want;
        }
        if (bytes) {
          for (i = 0; i < bytes; i++) this.buffer[this.leftover + i] = m[mpos + i];
          this.leftover += bytes;
        }
      };
      function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
        var s = new poly1305(k);
        s.update(m, mpos, n);
        s.finish(out, outpos);
        return 0;
      }
      function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
        var x = new Uint8Array(16);
        crypto_onetimeauth(x, 0, m, mpos, n, k);
        return crypto_verify_16(h, hpos, x, 0);
      }
      function crypto_secretbox(c, m, d, n, k) {
        var i;
        if (d < 32) return -1;
        crypto_stream_xor(c, 0, m, 0, d, n, k);
        crypto_onetimeauth(c, 16, c, 32, d - 32, c);
        for (i = 0; i < 16; i++) c[i] = 0;
        return 0;
      }
      function crypto_secretbox_open(m, c, d, n, k) {
        var i;
        var x = new Uint8Array(32);
        if (d < 32) return -1;
        crypto_stream(x, 0, 32, n, k);
        if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
        crypto_stream_xor(m, 0, c, 0, d, n, k);
        for (i = 0; i < 32; i++) m[i] = 0;
        return 0;
      }
      function set25519(r, a) {
        var i;
        for (i = 0; i < 16; i++) r[i] = a[i] | 0;
      }
      function car25519(o) {
        var i, v, c = 1;
        for (i = 0; i < 16; i++) {
          v = o[i] + c + 65535;
          c = Math.floor(v / 65536);
          o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
      }
      function sel25519(p, q, b) {
        var t, c = ~(b - 1);
        for (var i = 0; i < 16; i++) {
          t = c & (p[i] ^ q[i]);
          p[i] ^= t;
          q[i] ^= t;
        }
      }
      function pack25519(o, n) {
        var i, j, b;
        var m = gf(), t = gf();
        for (i = 0; i < 16; i++) t[i] = n[i];
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; j++) {
          m[0] = t[0] - 65517;
          for (i = 1; i < 15; i++) {
            m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
            m[i - 1] &= 65535;
          }
          m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
          b = m[15] >> 16 & 1;
          m[14] &= 65535;
          sel25519(t, m, 1 - b);
        }
        for (i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255;
          o[2 * i + 1] = t[i] >> 8;
        }
      }
      function neq25519(a, b) {
        var c = new Uint8Array(32), d = new Uint8Array(32);
        pack25519(c, a);
        pack25519(d, b);
        return crypto_verify_32(c, 0, d, 0);
      }
      function par25519(a) {
        var d = new Uint8Array(32);
        pack25519(d, a);
        return d[0] & 1;
      }
      function unpack25519(o, n) {
        var i;
        for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        o[15] &= 32767;
      }
      function A(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
      }
      function Z(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
      }
      function M(o, a, b) {
        var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
      }
      function S(o, a) {
        M(o, a, a);
      }
      function inv25519(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 253; a >= 0; a--) {
          S(c, c);
          if (a !== 2 && a !== 4) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      function pow2523(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 250; a >= 0; a--) {
          S(c, c);
          if (a !== 1) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      function crypto_scalarmult(q, n, p) {
        var z = new Uint8Array(32);
        var x = new Float64Array(80), r, i;
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
        for (i = 0; i < 31; i++) z[i] = n[i];
        z[31] = n[31] & 127 | 64;
        z[0] &= 248;
        unpack25519(x, p);
        for (i = 0; i < 16; i++) {
          b[i] = x[i];
          d[i] = a[i] = c[i] = 0;
        }
        a[0] = d[0] = 1;
        for (i = 254; i >= 0; --i) {
          r = z[i >>> 3] >>> (i & 7) & 1;
          sel25519(a, b, r);
          sel25519(c, d, r);
          A(e, a, c);
          Z(a, a, c);
          A(c, b, d);
          Z(b, b, d);
          S(d, e);
          S(f, a);
          M(a, c, a);
          M(c, b, e);
          A(e, a, c);
          Z(a, a, c);
          S(b, a);
          Z(c, d, f);
          M(a, c, _121665);
          A(a, a, d);
          M(c, c, a);
          M(a, d, f);
          M(d, b, x);
          S(b, e);
          sel25519(a, b, r);
          sel25519(c, d, r);
        }
        for (i = 0; i < 16; i++) {
          x[i + 16] = a[i];
          x[i + 32] = c[i];
          x[i + 48] = b[i];
          x[i + 64] = d[i];
        }
        var x32 = x.subarray(32);
        var x16 = x.subarray(16);
        inv25519(x32, x32);
        M(x16, x16, x32);
        pack25519(q, x16);
        return 0;
      }
      function crypto_scalarmult_base(q, n) {
        return crypto_scalarmult(q, n, _9);
      }
      function crypto_box_keypair(y, x) {
        randombytes(x, 32);
        return crypto_scalarmult_base(y, x);
      }
      function crypto_box_beforenm(k, y, x) {
        var s = new Uint8Array(32);
        crypto_scalarmult(s, x, y);
        return crypto_core_hsalsa20(k, _0, s, sigma);
      }
      var crypto_box_afternm = crypto_secretbox;
      var crypto_box_open_afternm = crypto_secretbox_open;
      function crypto_box(c, m, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_afternm(c, m, d, n, k);
      }
      function crypto_box_open(m, c, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_open_afternm(m, c, d, n, k);
      }
      var K = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ];
      function crypto_hashblocks_hl(hh, hl, m, n) {
        var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
        var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        var pos = 0;
        while (n >= 128) {
          for (i = 0; i < 16; i++) {
            j = 8 * i + pos;
            wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
            wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
          }
          for (i = 0; i < 80; i++) {
            bh0 = ah0;
            bh1 = ah1;
            bh2 = ah2;
            bh3 = ah3;
            bh4 = ah4;
            bh5 = ah5;
            bh6 = ah6;
            bh7 = ah7;
            bl0 = al0;
            bl1 = al1;
            bl2 = al2;
            bl3 = al3;
            bl4 = al4;
            bl5 = al5;
            bl6 = al6;
            bl7 = al7;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
            l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah4 & ah5 ^ ~ah4 & ah6;
            l = al4 & al5 ^ ~al4 & al6;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = K[i * 2];
            l = K[i * 2 + 1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = wh[i % 16];
            l = wl[i % 16];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = c & 65535 | d << 16;
            tl = a & 65535 | b << 16;
            h = th;
            l = tl;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
            l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
            l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = c & 65535 | d << 16;
            bl7 = a & 65535 | b << 16;
            h = bh3;
            l = bl3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = th;
            l = tl;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = c & 65535 | d << 16;
            bl3 = a & 65535 | b << 16;
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
              for (j = 0; j < 16; j++) {
                h = wh[j];
                l = wl[j];
                a = l & 65535;
                b = l >>> 16;
                c = h & 65535;
                d = h >>> 16;
                h = wh[(j + 9) % 16];
                l = wl[(j + 9) % 16];
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 1) % 16];
                tl = wl[(j + 1) % 16];
                h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 14) % 16];
                tl = wl[(j + 14) % 16];
                h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                wh[j] = c & 65535 | d << 16;
                wl[j] = a & 65535 | b << 16;
              }
            }
          }
          h = ah0;
          l = al0;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[0];
          l = hl[0];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[0] = ah0 = c & 65535 | d << 16;
          hl[0] = al0 = a & 65535 | b << 16;
          h = ah1;
          l = al1;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[1];
          l = hl[1];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[1] = ah1 = c & 65535 | d << 16;
          hl[1] = al1 = a & 65535 | b << 16;
          h = ah2;
          l = al2;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[2];
          l = hl[2];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[2] = ah2 = c & 65535 | d << 16;
          hl[2] = al2 = a & 65535 | b << 16;
          h = ah3;
          l = al3;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[3];
          l = hl[3];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[3] = ah3 = c & 65535 | d << 16;
          hl[3] = al3 = a & 65535 | b << 16;
          h = ah4;
          l = al4;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[4];
          l = hl[4];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[4] = ah4 = c & 65535 | d << 16;
          hl[4] = al4 = a & 65535 | b << 16;
          h = ah5;
          l = al5;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[5];
          l = hl[5];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[5] = ah5 = c & 65535 | d << 16;
          hl[5] = al5 = a & 65535 | b << 16;
          h = ah6;
          l = al6;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[6];
          l = hl[6];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[6] = ah6 = c & 65535 | d << 16;
          hl[6] = al6 = a & 65535 | b << 16;
          h = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[7];
          l = hl[7];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[7] = ah7 = c & 65535 | d << 16;
          hl[7] = al7 = a & 65535 | b << 16;
          pos += 128;
          n -= 128;
        }
        return n;
      }
      function crypto_hash(out, m, n) {
        var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
        hh[0] = 1779033703;
        hh[1] = 3144134277;
        hh[2] = 1013904242;
        hh[3] = 2773480762;
        hh[4] = 1359893119;
        hh[5] = 2600822924;
        hh[6] = 528734635;
        hh[7] = 1541459225;
        hl[0] = 4089235720;
        hl[1] = 2227873595;
        hl[2] = 4271175723;
        hl[3] = 1595750129;
        hl[4] = 2917565137;
        hl[5] = 725511199;
        hl[6] = 4215389547;
        hl[7] = 327033209;
        crypto_hashblocks_hl(hh, hl, m, n);
        n %= 128;
        for (i = 0; i < n; i++) x[i] = m[b - n + i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        ts64(x, n - 8, b / 536870912 | 0, b << 3);
        crypto_hashblocks_hl(hh, hl, x, n);
        for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
        return 0;
      }
      function add(p, q) {
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
        Z(a, p[1], p[0]);
        Z(t, q[1], q[0]);
        M(a, a, t);
        A(b, p[0], p[1]);
        A(t, q[0], q[1]);
        M(b, b, t);
        M(c, p[3], q[3]);
        M(c, c, D2);
        M(d, p[2], q[2]);
        A(d, d, d);
        Z(e, b, a);
        Z(f, d, c);
        A(g, d, c);
        A(h, b, a);
        M(p[0], e, f);
        M(p[1], h, g);
        M(p[2], g, f);
        M(p[3], e, h);
      }
      function cswap(p, q, b) {
        var i;
        for (i = 0; i < 4; i++) {
          sel25519(p[i], q[i], b);
        }
      }
      function pack(r, p) {
        var tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        M(tx, p[0], zi);
        M(ty, p[1], zi);
        pack25519(r, ty);
        r[31] ^= par25519(tx) << 7;
      }
      function scalarmult(p, q, s) {
        var b, i;
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (i = 255; i >= 0; --i) {
          b = s[i / 8 | 0] >> (i & 7) & 1;
          cswap(p, q, b);
          add(q, p);
          add(p, p);
          cswap(p, q, b);
        }
      }
      function scalarbase(p, s) {
        var q = [
          gf(),
          gf(),
          gf(),
          gf()
        ];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        M(q[3], X, Y);
        scalarmult(p, q, s);
      }
      function crypto_sign_keypair(pk, sk, seeded) {
        var d = new Uint8Array(64);
        var p = [
          gf(),
          gf(),
          gf(),
          gf()
        ];
        var i;
        if (!seeded) randombytes(sk, 32);
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
        return 0;
      }
      var L = new Float64Array([
        237,
        211,
        245,
        92,
        26,
        99,
        18,
        88,
        214,
        156,
        247,
        162,
        222,
        249,
        222,
        20,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        16
      ]);
      function modL(r, x) {
        var carry, i, j, k;
        for (i = 63; i >= 32; --i) {
          carry = 0;
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = Math.floor((x[j] + 128) / 256);
            x[j] -= carry * 256;
          }
          x[j] += carry;
          x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
          x[j] += carry - (x[31] >> 4) * L[j];
          carry = x[j] >> 8;
          x[j] &= 255;
        }
        for (j = 0; j < 32; j++) x[j] -= carry * L[j];
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8;
          r[i] = x[i] & 255;
        }
      }
      function reduce(r) {
        var x = new Float64Array(64), i;
        for (i = 0; i < 64; i++) x[i] = r[i];
        for (i = 0; i < 64; i++) r[i] = 0;
        modL(r, x);
      }
      function crypto_sign(sm, m, n, sk) {
        var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
        var i, j, x = new Float64Array(64);
        var p = [
          gf(),
          gf(),
          gf(),
          gf()
        ];
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        var smlen = n + 64;
        for (i = 0; i < n; i++) sm[64 + i] = m[i];
        for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
        crypto_hash(r, sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i = 32; i < 64; i++) sm[i] = sk[i];
        crypto_hash(h, sm, n + 64);
        reduce(h);
        for (i = 0; i < 64; i++) x[i] = 0;
        for (i = 0; i < 32; i++) x[i] = r[i];
        for (i = 0; i < 32; i++) {
          for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
          }
        }
        modL(sm.subarray(32), x);
        return smlen;
      }
      function unpackneg(r, p) {
        var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r[2], gf1);
        unpack25519(r[1], p);
        S(num, r[1]);
        M(den, num, D);
        Z(num, num, r[2]);
        A(den, r[2], den);
        S(den2, den);
        S(den4, den2);
        M(den6, den4, den2);
        M(t, den6, num);
        M(t, t, den);
        pow2523(t, t);
        M(t, t, num);
        M(t, t, den);
        M(t, t, den);
        M(r[0], t, den);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) M(r[0], r[0], I);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) return -1;
        if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
        M(r[3], r[0], r[1]);
        return 0;
      }
      function crypto_sign_open(m, sm, n, pk) {
        var i;
        var t = new Uint8Array(32), h = new Uint8Array(64);
        var p = [
          gf(),
          gf(),
          gf(),
          gf()
        ], q = [
          gf(),
          gf(),
          gf(),
          gf()
        ];
        if (n < 64) return -1;
        if (unpackneg(q, pk)) return -1;
        for (i = 0; i < n; i++) m[i] = sm[i];
        for (i = 0; i < 32; i++) m[i + 32] = pk[i];
        crypto_hash(h, m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; i++) m[i] = 0;
          return -1;
        }
        for (i = 0; i < n; i++) m[i] = sm[i + 64];
        return n;
      }
      var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
      nacl3.lowlevel = {
        crypto_core_hsalsa20,
        crypto_stream_xor,
        crypto_stream,
        crypto_stream_salsa20_xor,
        crypto_stream_salsa20,
        crypto_onetimeauth,
        crypto_onetimeauth_verify,
        crypto_verify_16,
        crypto_verify_32,
        crypto_secretbox,
        crypto_secretbox_open,
        crypto_scalarmult,
        crypto_scalarmult_base,
        crypto_box_beforenm,
        crypto_box_afternm,
        crypto_box,
        crypto_box_open,
        crypto_box_keypair,
        crypto_hash,
        crypto_sign,
        crypto_sign_keypair,
        crypto_sign_open,
        crypto_secretbox_KEYBYTES,
        crypto_secretbox_NONCEBYTES,
        crypto_secretbox_ZEROBYTES,
        crypto_secretbox_BOXZEROBYTES,
        crypto_scalarmult_BYTES,
        crypto_scalarmult_SCALARBYTES,
        crypto_box_PUBLICKEYBYTES,
        crypto_box_SECRETKEYBYTES,
        crypto_box_BEFORENMBYTES,
        crypto_box_NONCEBYTES,
        crypto_box_ZEROBYTES,
        crypto_box_BOXZEROBYTES,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
        crypto_sign_SEEDBYTES,
        crypto_hash_BYTES,
        gf,
        D,
        L,
        pack25519,
        unpack25519,
        M,
        A,
        S,
        Z,
        pow2523,
        add,
        set25519,
        modL,
        scalarmult,
        scalarbase
      };
      function checkLengths(k, n) {
        if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
        if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
      }
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
        if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
      }
      function checkArrayTypes() {
        for (var i = 0; i < arguments.length; i++) {
          if (!(arguments[i] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array");
        }
      }
      function cleanup(arr) {
        for (var i = 0; i < arr.length; i++) arr[i] = 0;
      }
      nacl3.randomBytes = function(n) {
        var b = new Uint8Array(n);
        randombytes(b, n);
        return b;
      };
      nacl3.secretbox = function(msg, nonce, key) {
        checkArrayTypes(msg, nonce, key);
        checkLengths(key, nonce);
        var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
        var c = new Uint8Array(m.length);
        for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
        crypto_secretbox(c, m, m.length, nonce, key);
        return c.subarray(crypto_secretbox_BOXZEROBYTES);
      };
      nacl3.secretbox.open = function(box, nonce, key) {
        checkArrayTypes(box, nonce, key);
        checkLengths(key, nonce);
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
        var m = new Uint8Array(c.length);
        for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
        if (c.length < 32) return null;
        if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
        return m.subarray(crypto_secretbox_ZEROBYTES);
      };
      nacl3.secretbox.keyLength = crypto_secretbox_KEYBYTES;
      nacl3.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
      nacl3.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
      nacl3.scalarMult = function(n, p) {
        checkArrayTypes(n, p);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult(q, n, p);
        return q;
      };
      nacl3.scalarMult.base = function(n) {
        checkArrayTypes(n);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult_base(q, n);
        return q;
      };
      nacl3.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
      nacl3.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
      nacl3.box = function(msg, nonce, publicKey, secretKey) {
        var k = nacl3.box.before(publicKey, secretKey);
        return nacl3.secretbox(msg, nonce, k);
      };
      nacl3.box.before = function(publicKey, secretKey) {
        checkArrayTypes(publicKey, secretKey);
        checkBoxLengths(publicKey, secretKey);
        var k = new Uint8Array(crypto_box_BEFORENMBYTES);
        crypto_box_beforenm(k, publicKey, secretKey);
        return k;
      };
      nacl3.box.after = nacl3.secretbox;
      nacl3.box.open = function(msg, nonce, publicKey, secretKey) {
        var k = nacl3.box.before(publicKey, secretKey);
        return nacl3.secretbox.open(msg, nonce, k);
      };
      nacl3.box.open.after = nacl3.secretbox.open;
      nacl3.box.keyPair = function() {
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
        crypto_box_keypair(pk, sk);
        return {
          publicKey: pk,
          secretKey: sk
        };
      };
      nacl3.box.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        crypto_scalarmult_base(pk, secretKey);
        return {
          publicKey: pk,
          secretKey: new Uint8Array(secretKey)
        };
      };
      nacl3.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
      nacl3.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
      nacl3.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
      nacl3.box.nonceLength = crypto_box_NONCEBYTES;
      nacl3.box.overheadLength = nacl3.secretbox.overheadLength;
      nacl3.sign = function(msg, secretKey) {
        checkArrayTypes(msg, secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
        var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
        crypto_sign(signedMsg, msg, msg.length, secretKey);
        return signedMsg;
      };
      nacl3.sign.open = function(signedMsg, publicKey) {
        checkArrayTypes(signedMsg, publicKey);
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
        var tmp = new Uint8Array(signedMsg.length);
        var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
        if (mlen < 0) return null;
        var m = new Uint8Array(mlen);
        for (var i = 0; i < m.length; i++) m[i] = tmp[i];
        return m;
      };
      nacl3.sign.detached = function(msg, secretKey) {
        var signedMsg = nacl3.sign(msg, secretKey);
        var sig = new Uint8Array(crypto_sign_BYTES);
        for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
        return sig;
      };
      nacl3.sign.detached.verify = function(msg, sig, publicKey) {
        checkArrayTypes(msg, sig, publicKey);
        if (sig.length !== crypto_sign_BYTES) throw new Error("bad signature size");
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
        var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
        var m = new Uint8Array(crypto_sign_BYTES + msg.length);
        var i;
        for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
        for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
        return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
      };
      nacl3.sign.keyPair = function() {
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        crypto_sign_keypair(pk, sk);
        return {
          publicKey: pk,
          secretKey: sk
        };
      };
      nacl3.sign.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
        return {
          publicKey: pk,
          secretKey: new Uint8Array(secretKey)
        };
      };
      nacl3.sign.keyPair.fromSeed = function(seed) {
        checkArrayTypes(seed);
        if (seed.length !== crypto_sign_SEEDBYTES) throw new Error("bad seed size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        for (var i = 0; i < 32; i++) sk[i] = seed[i];
        crypto_sign_keypair(pk, sk, true);
        return {
          publicKey: pk,
          secretKey: sk
        };
      };
      nacl3.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
      nacl3.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
      nacl3.sign.seedLength = crypto_sign_SEEDBYTES;
      nacl3.sign.signatureLength = crypto_sign_BYTES;
      nacl3.hash = function(msg) {
        checkArrayTypes(msg);
        var h = new Uint8Array(crypto_hash_BYTES);
        crypto_hash(h, msg, msg.length);
        return h;
      };
      nacl3.hash.hashLength = crypto_hash_BYTES;
      nacl3.verify = function(x, y) {
        checkArrayTypes(x, y);
        if (x.length === 0 || y.length === 0) return false;
        if (x.length !== y.length) return false;
        return vn(x, 0, y, 0, x.length) === 0 ? true : false;
      };
      nacl3.setPRNG = function(fn) {
        randombytes = fn;
      };
      (function() {
        var crypto2 = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (crypto2 && crypto2.getRandomValues) {
          var QUOTA = 65536;
          nacl3.setPRNG(function(x, n) {
            var i, v = new Uint8Array(n);
            for (i = 0; i < n; i += QUOTA) {
              crypto2.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
            }
            for (i = 0; i < n; i++) x[i] = v[i];
            cleanup(v);
          });
        } else if (typeof __require !== "undefined") {
          crypto2 = __require("node:crypto");
          if (crypto2 && crypto2.randomBytes) {
            nacl3.setPRNG(function(x, n) {
              var i, v = crypto2.randomBytes(n);
              for (i = 0; i < n; i++) x[i] = v[i];
              cleanup(v);
            });
          }
        }
      })();
    })(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assertError.js
var require_assertError = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assertError.js"(exports, module) {
    "use strict";
    module.exports = class AssertError extends Error {
      name = "AssertError";
      constructor(message, ctor) {
        super(message || "Unknown error");
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, ctor);
        }
      }
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/stringify.js"(exports, module) {
    "use strict";
    module.exports = function(...args) {
      try {
        return JSON.stringify(...args);
      } catch (err) {
        return "[Cannot display object: " + err.message + "]";
      }
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assert.js
var require_assert = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assert.js"(exports, module) {
    "use strict";
    var AssertError = require_assertError();
    var Stringify = require_stringify();
    var assert2 = module.exports = function(condition, ...args) {
      if (condition) {
        return;
      }
      if (args.length === 1 && args[0] instanceof Error) {
        throw args[0];
      }
      const msgs = args.filter((arg) => arg !== "").map((arg) => {
        return typeof arg === "string" ? arg : arg instanceof Error ? arg.message : Stringify(arg);
      });
      throw new AssertError(msgs.join(" "), assert2);
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reach.js
var require_reach = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reach.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var internals = {};
    module.exports = function(obj, chain, options2) {
      if (chain === false || chain === null || chain === void 0) {
        return obj;
      }
      options2 = options2 || {};
      if (typeof options2 === "string") {
        options2 = {
          separator: options2
        };
      }
      const isChainArray = Array.isArray(chain);
      Assert(!isChainArray || !options2.separator, "Separator option is not valid for array-based chain");
      const path2 = isChainArray ? chain : chain.split(options2.separator || ".");
      let ref = obj;
      for (let i = 0; i < path2.length; ++i) {
        let key = path2[i];
        const type = options2.iterables && internals.iterables(ref);
        if (Array.isArray(ref) || type === "set") {
          const number = Number(key);
          if (Number.isInteger(number)) {
            key = number < 0 ? ref.length + number : number;
          }
        }
        if (!ref || typeof ref === "function" && options2.functions === false || // Defaults to true
        !type && ref[key] === void 0) {
          Assert(!options2.strict || i + 1 === path2.length, "Missing segment", key, "in reach path ", chain);
          Assert(typeof ref === "object" || options2.functions === true || typeof ref !== "function", "Invalid segment", key, "in reach path ", chain);
          ref = options2.default;
          break;
        }
        if (!type) {
          ref = ref[key];
        } else if (type === "set") {
          ref = [
            ...ref
          ][key];
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

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/types.js
var require_types = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/types.js"(exports, module) {
    "use strict";
    var internals = {};
    exports = module.exports = {
      array: Array.prototype,
      buffer: Buffer && Buffer.prototype,
      date: Date.prototype,
      error: Error.prototype,
      generic: Object.prototype,
      map: Map.prototype,
      promise: Promise.prototype,
      regex: RegExp.prototype,
      set: Set.prototype,
      url: URL.prototype,
      weakMap: WeakMap.prototype,
      weakSet: WeakSet.prototype
    };
    internals.typeMap = /* @__PURE__ */ new Map([
      [
        "[object Error]",
        exports.error
      ],
      [
        "[object Map]",
        exports.map
      ],
      [
        "[object Promise]",
        exports.promise
      ],
      [
        "[object Set]",
        exports.set
      ],
      [
        "[object URL]",
        exports.url
      ],
      [
        "[object WeakMap]",
        exports.weakMap
      ],
      [
        "[object WeakSet]",
        exports.weakSet
      ]
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

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/utils.js
var require_utils = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/utils.js"(exports) {
    "use strict";
    exports.keys = function(obj, options2 = {}) {
      return options2.symbols !== false ? Reflect.ownKeys(obj) : Object.getOwnPropertyNames(obj);
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/clone.js
var require_clone = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/clone.js"(exports, module) {
    "use strict";
    var Reach = require_reach();
    var Types = require_types();
    var Utils = require_utils();
    var internals = {
      needsProtoHack: /* @__PURE__ */ new Set([
        Types.set,
        Types.map,
        Types.weakSet,
        Types.weakMap
      ]),
      structuredCloneExists: typeof structuredClone === "function"
    };
    module.exports = internals.clone = function(obj, options2 = {}, _seen = null) {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }
      let clone = internals.clone;
      let seen = _seen;
      if (options2.shallow) {
        if (options2.shallow !== true) {
          return internals.cloneWithShallow(obj, options2);
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
      switch (baseProto) {
        case Types.buffer:
          return Buffer?.from(obj);
        case Types.date:
          return new Date(obj.getTime());
        case Types.regex:
        case Types.url:
          return new baseProto.constructor(obj);
      }
      const newObj = internals.base(obj, baseProto, options2);
      if (newObj === obj) {
        return obj;
      }
      if (seen) {
        seen.set(obj, newObj);
      }
      if (baseProto === Types.set) {
        for (const value of obj) {
          newObj.add(clone(value, options2, seen));
        }
      } else if (baseProto === Types.map) {
        for (const [key, value] of obj) {
          newObj.set(key, clone(value, options2, seen));
        }
      }
      const keys = Utils.keys(obj, options2);
      for (const key of keys) {
        if (key === "__proto__") {
          continue;
        }
        if (baseProto === Types.array && key === "length") {
          newObj.length = obj.length;
          continue;
        }
        if (internals.structuredCloneExists && baseProto === Types.error && key === "stack") {
          continue;
        }
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
          if (descriptor.get || descriptor.set) {
            Object.defineProperty(newObj, key, descriptor);
          } else if (descriptor.enumerable) {
            newObj[key] = clone(obj[key], options2, seen);
          } else {
            Object.defineProperty(newObj, key, {
              enumerable: false,
              writable: true,
              configurable: true,
              value: clone(obj[key], options2, seen)
            });
          }
        } else {
          Object.defineProperty(newObj, key, {
            enumerable: true,
            writable: true,
            configurable: true,
            value: clone(obj[key], options2, seen)
          });
        }
      }
      return newObj;
    };
    internals.cloneWithShallow = function(source, options2) {
      const keys = options2.shallow;
      options2 = Object.assign({}, options2);
      options2.shallow = false;
      const seen = /* @__PURE__ */ new Map();
      for (const key of keys) {
        const ref = Reach(source, key);
        if (typeof ref === "object" || typeof ref === "function") {
          seen.set(ref, ref);
        }
      }
      return internals.clone(source, options2, seen);
    };
    internals.base = function(obj, baseProto, options2) {
      if (options2.prototype === false) {
        if (internals.needsProtoHack.has(baseProto)) {
          return new baseProto.constructor();
        }
        return baseProto === Types.array ? [] : {};
      }
      const proto3 = Object.getPrototypeOf(obj);
      if (proto3 && proto3.isImmutable) {
        return obj;
      }
      if (baseProto === Types.array) {
        const newObj = [];
        if (proto3 !== baseProto) {
          Object.setPrototypeOf(newObj, proto3);
        }
        return newObj;
      } else if (baseProto === Types.error && internals.structuredCloneExists && (proto3 === baseProto || Error.isPrototypeOf(proto3.constructor))) {
        const err = structuredClone(obj);
        if (Object.getPrototypeOf(err) !== proto3) {
          Object.setPrototypeOf(err, proto3);
        }
        return err;
      }
      if (internals.needsProtoHack.has(baseProto)) {
        const newObj = new proto3.constructor();
        if (proto3 !== baseProto) {
          Object.setPrototypeOf(newObj, proto3);
        }
        return newObj;
      }
      return Object.create(proto3);
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/merge.js
var require_merge = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/merge.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Utils = require_utils();
    var internals = {};
    module.exports = internals.merge = function(target, source, options2) {
      Assert(target && typeof target === "object", "Invalid target value: must be an object");
      Assert(source === null || source === void 0 || typeof source === "object", "Invalid source value: must be null, undefined, or an object");
      if (!source) {
        return target;
      }
      options2 = Object.assign({
        nullOverride: true,
        mergeArrays: true
      }, options2);
      if (Array.isArray(source)) {
        Assert(Array.isArray(target), "Cannot merge array onto an object");
        if (!options2.mergeArrays) {
          target.length = 0;
        }
        for (let i = 0; i < source.length; ++i) {
          target.push(Clone(source[i], {
            symbols: options2.symbols
          }));
        }
        return target;
      }
      const keys = Utils.keys(source, options2);
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
          if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key]) !== Array.isArray(value) || value instanceof Date || Buffer && Buffer.isBuffer(value) || // $lab:coverage:ignore$
          value instanceof RegExp) {
            target[key] = Clone(value, {
              symbols: options2.symbols
            });
          } else {
            internals.merge(target[key], value, options2);
          }
        } else {
          if (value !== null && value !== void 0) {
            target[key] = value;
          } else if (options2.nullOverride) {
            target[key] = value;
          }
        }
      }
      return target;
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/applyToDefaults.js
var require_applyToDefaults = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/applyToDefaults.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Merge = require_merge();
    var Reach = require_reach();
    var internals = {};
    module.exports = function(defaults, source, options2 = {}) {
      Assert(defaults && typeof defaults === "object", "Invalid defaults value: must be an object");
      Assert(!source || source === true || typeof source === "object", "Invalid source value: must be true, falsy or an object");
      Assert(typeof options2 === "object", "Invalid options: must be an object");
      if (!source) {
        return null;
      }
      if (options2.shallow) {
        return internals.applyToDefaultsWithShallow(defaults, source, options2);
      }
      const copy = Clone(defaults);
      if (source === true) {
        return copy;
      }
      const nullOverride = options2.nullOverride !== void 0 ? options2.nullOverride : false;
      return Merge(copy, source, {
        nullOverride,
        mergeArrays: false
      });
    };
    internals.applyToDefaultsWithShallow = function(defaults, source, options2) {
      const keys = options2.shallow;
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
      const nullOverride = options2.nullOverride !== void 0 ? options2.nullOverride : false;
      return Merge(copy, source, {
        nullOverride,
        mergeArrays: false
      });
    };
    internals.reachCopy = function(dst, src2, path2) {
      for (const segment of path2) {
        if (!(segment in src2)) {
          return;
        }
        const val = src2[segment];
        if (typeof val !== "object" || val === null) {
          return;
        }
        src2 = val;
      }
      const value = src2;
      let ref = dst;
      for (let i = 0; i < path2.length - 1; ++i) {
        const segment = path2[i];
        if (typeof ref[segment] !== "object") {
          ref[segment] = {};
        }
        ref = ref[segment];
      }
      ref[path2[path2.length - 1]] = value;
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/bench.js
var require_bench = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/bench.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = internals.Bench = class {
      constructor() {
        this.ts = 0;
        this.reset();
      }
      reset() {
        this.ts = internals.Bench.now();
      }
      elapsed() {
        return internals.Bench.now() - this.ts;
      }
      static now() {
        const ts = process.hrtime();
        return ts[0] * 1e3 + ts[1] / 1e6;
      }
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/ignore.js
var require_ignore = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/ignore.js"(exports, module) {
    "use strict";
    module.exports = function() {
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/block.js
var require_block = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/block.js"(exports, module) {
    "use strict";
    var Ignore = require_ignore();
    module.exports = function() {
      return new Promise(Ignore);
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/deepEqual.js
var require_deepEqual = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/deepEqual.js"(exports, module) {
    "use strict";
    var Types = require_types();
    var internals = {
      mismatched: null
    };
    module.exports = function(obj, ref, options2) {
      options2 = Object.assign({
        prototype: true
      }, options2);
      return !!internals.isDeepEqual(obj, ref, options2, []);
    };
    internals.isDeepEqual = function(obj, ref, options2, seen) {
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
        if (!options2.deepFunction || obj.toString() !== ref.toString()) {
          return false;
        }
      } else if (type !== "object") {
        return obj !== obj && ref !== ref;
      }
      const instanceType = internals.getSharedType(obj, ref, !!options2.prototype);
      switch (instanceType) {
        case Types.buffer:
          return Buffer && Buffer.prototype.equals.call(obj, ref);
        // $lab:coverage:ignore$
        case Types.promise:
          return obj === ref;
        case Types.regex:
        case Types.url:
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
        return !!internals.isDeepEqualObj(instanceType, obj, ref, options2, seen);
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
    internals.isDeepEqualObj = function(instanceType, obj, ref, options2, seen) {
      const { isDeepEqual, valueOf, hasOwnEnumerableProperty } = internals;
      const { keys, getOwnPropertySymbols } = Object;
      if (instanceType === Types.array) {
        if (options2.part) {
          for (const objValue of obj) {
            for (const refValue of ref) {
              if (isDeepEqual(objValue, refValue, options2, seen)) {
                return true;
              }
            }
          }
        } else {
          if (obj.length !== ref.length) {
            return false;
          }
          for (let i = 0; i < obj.length; ++i) {
            if (!isDeepEqual(obj[i], ref[i], options2, seen)) {
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
              if (isDeepEqual(objEntry, refEntry, options2, seen)) {
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
          if (!isDeepEqual(value, Map.prototype.get.call(ref, key), options2, seen)) {
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
      if ((obj !== valueOfObj || ref !== valueOfRef) && !isDeepEqual(valueOfObj, valueOfRef, options2, seen)) {
        return false;
      }
      const objKeys = keys(obj);
      if (!options2.part && objKeys.length !== keys(ref).length && !options2.skip) {
        return false;
      }
      let skipped = 0;
      for (const key of objKeys) {
        if (options2.skip && options2.skip.includes(key)) {
          if (ref[key] === void 0) {
            ++skipped;
          }
          continue;
        }
        if (!hasOwnEnumerableProperty(ref, key)) {
          return false;
        }
        if (!isDeepEqual(obj[key], ref[key], options2, seen)) {
          return false;
        }
      }
      if (!options2.part && objKeys.length - skipped !== keys(ref).length) {
        return false;
      }
      if (options2.symbols !== false) {
        const objSymbols = getOwnPropertySymbols(obj);
        const refSymbols = new Set(getOwnPropertySymbols(ref));
        for (const key of objSymbols) {
          if (!options2.skip?.includes(key)) {
            if (hasOwnEnumerableProperty(obj, key)) {
              if (!hasOwnEnumerableProperty(ref, key)) {
                return false;
              }
              if (!isDeepEqual(obj[key], ref[key], options2, seen)) {
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

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeRegex.js
var require_escapeRegex = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeRegex.js"(exports, module) {
    "use strict";
    module.exports = function(string) {
      return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, "\\$&");
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/contain.js
var require_contain = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/contain.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var DeepEqual = require_deepEqual();
    var EscapeRegex = require_escapeRegex();
    var Utils = require_utils();
    var internals = {};
    module.exports = function(ref, values, options2 = {}) {
      if (typeof values !== "object") {
        values = [
          values
        ];
      }
      Assert(!Array.isArray(values) || values.length, "Values array cannot be empty");
      if (typeof ref === "string") {
        return internals.string(ref, values, options2);
      }
      if (Array.isArray(ref)) {
        return internals.array(ref, values, options2);
      }
      Assert(typeof ref === "object", "Reference must be string or an object");
      return internals.object(ref, values, options2);
    };
    internals.array = function(ref, values, options2) {
      if (!Array.isArray(values)) {
        values = [
          values
        ];
      }
      if (!ref.length) {
        return false;
      }
      if (options2.only && options2.once && ref.length !== values.length) {
        return false;
      }
      let compare;
      const map = /* @__PURE__ */ new Map();
      for (const value of values) {
        if (!options2.deep || !value || typeof value !== "object") {
          const existing = map.get(value);
          if (existing) {
            ++existing.allowed;
          } else {
            map.set(value, {
              allowed: 1,
              hits: 0
            });
          }
        } else {
          compare = compare ?? internals.compare(options2);
          let found = false;
          for (const [key, existing] of map.entries()) {
            if (compare(key, value)) {
              ++existing.allowed;
              found = true;
              break;
            }
          }
          if (!found) {
            map.set(value, {
              allowed: 1,
              hits: 0
            });
          }
        }
      }
      let hits = 0;
      for (const item of ref) {
        let match;
        if (!options2.deep || !item || typeof item !== "object") {
          match = map.get(item);
        } else {
          compare = compare ?? internals.compare(options2);
          for (const [key, existing] of map.entries()) {
            if (compare(key, item)) {
              match = existing;
              break;
            }
          }
        }
        if (match) {
          ++match.hits;
          ++hits;
          if (options2.once && match.hits > match.allowed) {
            return false;
          }
        }
      }
      if (options2.only && hits !== ref.length) {
        return false;
      }
      for (const match of map.values()) {
        if (match.hits === match.allowed) {
          continue;
        }
        if (match.hits < match.allowed && !options2.part) {
          return false;
        }
      }
      return !!hits;
    };
    internals.object = function(ref, values, options2) {
      Assert(options2.once === void 0, "Cannot use option once with object");
      const keys = Utils.keys(ref, options2);
      if (!keys.length) {
        return false;
      }
      if (Array.isArray(values)) {
        return internals.array(keys, values, options2);
      }
      const symbols2 = Object.getOwnPropertySymbols(values).filter((sym) => values.propertyIsEnumerable(sym));
      const targets = [
        ...Object.keys(values),
        ...symbols2
      ];
      const compare = internals.compare(options2);
      const set = new Set(targets);
      for (const key of keys) {
        if (!set.has(key)) {
          if (options2.only) {
            return false;
          }
          continue;
        }
        if (!compare(values[key], ref[key])) {
          return false;
        }
        set.delete(key);
      }
      if (set.size) {
        return options2.part ? set.size < targets.length : false;
      }
      return true;
    };
    internals.string = function(ref, values, options2) {
      if (ref === "") {
        return values.length === 1 && values[0] === "" || // '' contains ''
        !options2.once && !values.some((v) => v !== "");
      }
      const map = /* @__PURE__ */ new Map();
      const patterns = [];
      for (const value of values) {
        Assert(typeof value === "string", "Cannot compare string reference to non-string value");
        if (value) {
          const existing = map.get(value);
          if (existing) {
            ++existing.allowed;
          } else {
            map.set(value, {
              allowed: 1,
              hits: 0
            });
            patterns.push(EscapeRegex(value));
          }
        } else if (options2.once || options2.only) {
          return false;
        }
      }
      if (!patterns.length) {
        return true;
      }
      const regex = new RegExp(`(${patterns.join("|")})`, "g");
      const leftovers = ref.replace(regex, ($0, $1) => {
        ++map.get($1).hits;
        return "";
      });
      if (options2.only && leftovers) {
        return false;
      }
      let any = false;
      for (const match of map.values()) {
        if (match.hits) {
          any = true;
        }
        if (match.hits === match.allowed) {
          continue;
        }
        if (match.hits < match.allowed && !options2.part) {
          return false;
        }
        if (options2.once) {
          return false;
        }
      }
      return !!any;
    };
    internals.compare = function(options2) {
      if (!options2.deep) {
        return internals.shallow;
      }
      const hasOnly = options2.only !== void 0;
      const hasPart = options2.part !== void 0;
      const flags = {
        prototype: hasOnly ? options2.only : hasPart ? !options2.part : false,
        part: hasOnly ? !options2.only : hasPart ? options2.part : false
      };
      return (a, b) => DeepEqual(a, b, flags);
    };
    internals.shallow = function(a, b) {
      return a === b;
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHeaderAttribute.js
var require_escapeHeaderAttribute = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHeaderAttribute.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    module.exports = function(attribute) {
      Assert(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), "Bad attribute value (" + attribute + ")");
      return attribute.replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHtml.js
var require_escapeHtml = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHtml.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = function(input) {
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
      const namedEscape = internals.namedHtml.get(charCode);
      if (namedEscape) {
        return namedEscape;
      }
      if (charCode >= 256) {
        return "&#" + charCode + ";";
      }
      const hexValue = charCode.toString(16).padStart(2, "0");
      return `&#x${hexValue};`;
    };
    internals.isSafe = function(charCode) {
      return internals.safeCharCodes.has(charCode);
    };
    internals.namedHtml = /* @__PURE__ */ new Map([
      [
        38,
        "&amp;"
      ],
      [
        60,
        "&lt;"
      ],
      [
        62,
        "&gt;"
      ],
      [
        34,
        "&quot;"
      ],
      [
        160,
        "&nbsp;"
      ],
      [
        162,
        "&cent;"
      ],
      [
        163,
        "&pound;"
      ],
      [
        164,
        "&curren;"
      ],
      [
        169,
        "&copy;"
      ],
      [
        174,
        "&reg;"
      ]
    ]);
    internals.safeCharCodes = function() {
      const safe = /* @__PURE__ */ new Set();
      for (let i = 32; i < 123; ++i) {
        if (i >= 97 || // a-z
        i >= 65 && i <= 90 || // A-Z
        i >= 48 && i <= 57 || // 0-9
        i === 32 || // space
        i === 46 || // .
        i === 44 || // ,
        i === 45 || // -
        i === 58 || // :
        i === 95) {
          safe.add(i);
        }
      }
      return safe;
    }();
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeJson.js
var require_escapeJson = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeJson.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = function(input) {
      if (!input) {
        return "";
      }
      return input.replace(/[<>&\u2028\u2029]/g, internals.escape);
    };
    internals.escape = function(char) {
      return internals.replacements.get(char);
    };
    internals.replacements = /* @__PURE__ */ new Map([
      [
        "<",
        "\\u003c"
      ],
      [
        ">",
        "\\u003e"
      ],
      [
        "&",
        "\\u0026"
      ],
      [
        "\u2028",
        "\\u2028"
      ],
      [
        "\u2029",
        "\\u2029"
      ]
    ]);
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/flatten.js
var require_flatten = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/flatten.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = internals.flatten = function(array, target) {
      const result = target || [];
      for (const entry of array) {
        if (Array.isArray(entry)) {
          internals.flatten(entry, result);
        } else {
          result.push(entry);
        }
      }
      return result;
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/intersect.js
var require_intersect = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/intersect.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = function(array1, array2, options2 = {}) {
      if (!array1 || !array2) {
        return options2.first ? null : [];
      }
      const common2 = [];
      const hash3 = Array.isArray(array1) ? new Set(array1) : array1;
      const found = /* @__PURE__ */ new Set();
      for (const value of array2) {
        if (internals.has(hash3, value) && !found.has(value)) {
          if (options2.first) {
            return value;
          }
          common2.push(value);
          found.add(value);
        }
      }
      return options2.first ? null : common2;
    };
    internals.has = function(ref, key) {
      if (typeof ref.has === "function") {
        return ref.has(key);
      }
      return ref[key] !== void 0;
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/isPromise.js
var require_isPromise = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/isPromise.js"(exports, module) {
    "use strict";
    module.exports = function(promise) {
      return typeof promise?.then === "function";
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/once.js
var require_once = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/once.js"(exports, module) {
    "use strict";
    var internals = {
      wrapped: Symbol("wrapped")
    };
    module.exports = function(method) {
      if (method[internals.wrapped]) {
        return method;
      }
      let once = false;
      const wrappedFn = function(...args) {
        if (!once) {
          once = true;
          method(...args);
        }
      };
      wrappedFn[internals.wrapped] = true;
      return wrappedFn;
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reachTemplate.js
var require_reachTemplate = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reachTemplate.js"(exports, module) {
    "use strict";
    var Reach = require_reach();
    module.exports = function(obj, template, options2) {
      return template.replace(/{([^{}]+)}/g, ($0, chain) => {
        const value = Reach(obj, chain, options2);
        return value ?? "";
      });
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/wait.js
var require_wait = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/wait.js"(exports, module) {
    "use strict";
    var internals = {
      maxTimer: 2 ** 31 - 1
      // ~25 days
    };
    module.exports = function(timeout, returnValue, options2) {
      if (typeof timeout === "bigint") {
        timeout = Number(timeout);
      }
      if (timeout >= Number.MAX_SAFE_INTEGER) {
        timeout = Infinity;
      }
      if (typeof timeout !== "number" && timeout !== void 0) {
        throw new TypeError("Timeout must be a number or bigint");
      }
      return new Promise((resolve7) => {
        const _setTimeout = options2 ? options2.setTimeout : setTimeout;
        const activate = () => {
          const time = Math.min(timeout, internals.maxTimer);
          timeout -= time;
          _setTimeout(() => timeout > 0 ? activate() : resolve7(returnValue), time);
        };
        if (timeout !== Infinity) {
          activate();
        }
      });
    };
  }
});

// node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/index.js
var require_lib = __commonJS({
  "node_modules/.deno/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/index.js"(exports) {
    "use strict";
    exports.applyToDefaults = require_applyToDefaults();
    exports.assert = require_assert();
    exports.AssertError = require_assertError();
    exports.Bench = require_bench();
    exports.block = require_block();
    exports.clone = require_clone();
    exports.contain = require_contain();
    exports.deepEqual = require_deepEqual();
    exports.escapeHeaderAttribute = require_escapeHeaderAttribute();
    exports.escapeHtml = require_escapeHtml();
    exports.escapeJson = require_escapeJson();
    exports.escapeRegex = require_escapeRegex();
    exports.flatten = require_flatten();
    exports.ignore = require_ignore();
    exports.intersect = require_intersect();
    exports.isPromise = require_isPromise();
    exports.merge = require_merge();
    exports.once = require_once();
    exports.reach = require_reach();
    exports.reachTemplate = require_reachTemplate();
    exports.stringify = require_stringify();
    exports.wait = require_wait();
  }
});

// node_modules/.deno/@hapi+boom@10.0.1/node_modules/@hapi/boom/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.deno/@hapi+boom@10.0.1/node_modules/@hapi/boom/lib/index.js"(exports) {
    "use strict";
    var Hoek = require_lib();
    var internals = {
      codes: /* @__PURE__ */ new Map([
        [
          100,
          "Continue"
        ],
        [
          101,
          "Switching Protocols"
        ],
        [
          102,
          "Processing"
        ],
        [
          200,
          "OK"
        ],
        [
          201,
          "Created"
        ],
        [
          202,
          "Accepted"
        ],
        [
          203,
          "Non-Authoritative Information"
        ],
        [
          204,
          "No Content"
        ],
        [
          205,
          "Reset Content"
        ],
        [
          206,
          "Partial Content"
        ],
        [
          207,
          "Multi-Status"
        ],
        [
          300,
          "Multiple Choices"
        ],
        [
          301,
          "Moved Permanently"
        ],
        [
          302,
          "Moved Temporarily"
        ],
        [
          303,
          "See Other"
        ],
        [
          304,
          "Not Modified"
        ],
        [
          305,
          "Use Proxy"
        ],
        [
          307,
          "Temporary Redirect"
        ],
        [
          400,
          "Bad Request"
        ],
        [
          401,
          "Unauthorized"
        ],
        [
          402,
          "Payment Required"
        ],
        [
          403,
          "Forbidden"
        ],
        [
          404,
          "Not Found"
        ],
        [
          405,
          "Method Not Allowed"
        ],
        [
          406,
          "Not Acceptable"
        ],
        [
          407,
          "Proxy Authentication Required"
        ],
        [
          408,
          "Request Time-out"
        ],
        [
          409,
          "Conflict"
        ],
        [
          410,
          "Gone"
        ],
        [
          411,
          "Length Required"
        ],
        [
          412,
          "Precondition Failed"
        ],
        [
          413,
          "Request Entity Too Large"
        ],
        [
          414,
          "Request-URI Too Large"
        ],
        [
          415,
          "Unsupported Media Type"
        ],
        [
          416,
          "Requested Range Not Satisfiable"
        ],
        [
          417,
          "Expectation Failed"
        ],
        [
          418,
          "I'm a teapot"
        ],
        [
          422,
          "Unprocessable Entity"
        ],
        [
          423,
          "Locked"
        ],
        [
          424,
          "Failed Dependency"
        ],
        [
          425,
          "Too Early"
        ],
        [
          426,
          "Upgrade Required"
        ],
        [
          428,
          "Precondition Required"
        ],
        [
          429,
          "Too Many Requests"
        ],
        [
          431,
          "Request Header Fields Too Large"
        ],
        [
          451,
          "Unavailable For Legal Reasons"
        ],
        [
          500,
          "Internal Server Error"
        ],
        [
          501,
          "Not Implemented"
        ],
        [
          502,
          "Bad Gateway"
        ],
        [
          503,
          "Service Unavailable"
        ],
        [
          504,
          "Gateway Time-out"
        ],
        [
          505,
          "HTTP Version Not Supported"
        ],
        [
          506,
          "Variant Also Negotiates"
        ],
        [
          507,
          "Insufficient Storage"
        ],
        [
          509,
          "Bandwidth Limit Exceeded"
        ],
        [
          510,
          "Not Extended"
        ],
        [
          511,
          "Network Authentication Required"
        ]
      ])
    };
    exports.Boom = class extends Error {
      constructor(messageOrError, options2 = {}) {
        if (messageOrError instanceof Error) {
          return exports.boomify(Hoek.clone(messageOrError), options2);
        }
        const { statusCode = 500, data = null, ctor = exports.Boom } = options2;
        const error = new Error(messageOrError ? messageOrError : void 0);
        Error.captureStackTrace(error, ctor);
        error.data = data;
        const boom = internals.initialize(error, statusCode);
        Object.defineProperty(boom, "typeof", {
          value: ctor
        });
        if (options2.decorate) {
          Object.assign(boom, options2.decorate);
        }
        return boom;
      }
      static [Symbol.hasInstance](instance) {
        if (this === exports.Boom) {
          return exports.isBoom(instance);
        }
        return this.prototype.isPrototypeOf(instance);
      }
    };
    exports.isBoom = function(err, statusCode) {
      return err instanceof Error && !!err.isBoom && (!statusCode || err.output.statusCode === statusCode);
    };
    exports.boomify = function(err, options2) {
      Hoek.assert(err instanceof Error, "Cannot wrap non-Error object");
      options2 = options2 || {};
      if (options2.data !== void 0) {
        err.data = options2.data;
      }
      if (options2.decorate) {
        Object.assign(err, options2.decorate);
      }
      if (!err.isBoom) {
        return internals.initialize(err, options2.statusCode ?? 500, options2.message);
      }
      if (options2.override === false || // Defaults to true
      !options2.statusCode && !options2.message) {
        return err;
      }
      return internals.initialize(err, options2.statusCode ?? err.output.statusCode, options2.message);
    };
    exports.badRequest = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 400,
        data,
        ctor: exports.badRequest
      });
    };
    exports.unauthorized = function(message, scheme, attributes) {
      const err = new exports.Boom(message, {
        statusCode: 401,
        ctor: exports.unauthorized
      });
      if (!scheme) {
        return err;
      }
      if (typeof scheme !== "string") {
        err.output.headers["WWW-Authenticate"] = scheme.join(", ");
        return err;
      }
      let wwwAuthenticate = `${scheme}`;
      if (attributes || message) {
        err.output.payload.attributes = {};
      }
      if (attributes) {
        if (typeof attributes === "string") {
          wwwAuthenticate += " " + Hoek.escapeHeaderAttribute(attributes);
          err.output.payload.attributes = attributes;
        } else {
          wwwAuthenticate += " " + Object.keys(attributes).map((name) => {
            const value = attributes[name] ?? "";
            err.output.payload.attributes[name] = value;
            return `${name}="${Hoek.escapeHeaderAttribute(value.toString())}"`;
          }).join(", ");
        }
      }
      if (message) {
        if (attributes) {
          wwwAuthenticate += ",";
        }
        wwwAuthenticate += ` error="${Hoek.escapeHeaderAttribute(message)}"`;
        err.output.payload.attributes.error = message;
      } else {
        err.isMissing = true;
      }
      err.output.headers["WWW-Authenticate"] = wwwAuthenticate;
      return err;
    };
    exports.paymentRequired = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 402,
        data,
        ctor: exports.paymentRequired
      });
    };
    exports.forbidden = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 403,
        data,
        ctor: exports.forbidden
      });
    };
    exports.notFound = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 404,
        data,
        ctor: exports.notFound
      });
    };
    exports.methodNotAllowed = function(messageOrError, data, allow) {
      const err = new exports.Boom(messageOrError, {
        statusCode: 405,
        data,
        ctor: exports.methodNotAllowed
      });
      if (typeof allow === "string") {
        allow = [
          allow
        ];
      }
      if (Array.isArray(allow)) {
        err.output.headers.Allow = allow.join(", ");
      }
      return err;
    };
    exports.notAcceptable = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 406,
        data,
        ctor: exports.notAcceptable
      });
    };
    exports.proxyAuthRequired = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 407,
        data,
        ctor: exports.proxyAuthRequired
      });
    };
    exports.clientTimeout = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 408,
        data,
        ctor: exports.clientTimeout
      });
    };
    exports.conflict = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 409,
        data,
        ctor: exports.conflict
      });
    };
    exports.resourceGone = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 410,
        data,
        ctor: exports.resourceGone
      });
    };
    exports.lengthRequired = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 411,
        data,
        ctor: exports.lengthRequired
      });
    };
    exports.preconditionFailed = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 412,
        data,
        ctor: exports.preconditionFailed
      });
    };
    exports.entityTooLarge = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 413,
        data,
        ctor: exports.entityTooLarge
      });
    };
    exports.uriTooLong = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 414,
        data,
        ctor: exports.uriTooLong
      });
    };
    exports.unsupportedMediaType = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 415,
        data,
        ctor: exports.unsupportedMediaType
      });
    };
    exports.rangeNotSatisfiable = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 416,
        data,
        ctor: exports.rangeNotSatisfiable
      });
    };
    exports.expectationFailed = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 417,
        data,
        ctor: exports.expectationFailed
      });
    };
    exports.teapot = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 418,
        data,
        ctor: exports.teapot
      });
    };
    exports.badData = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 422,
        data,
        ctor: exports.badData
      });
    };
    exports.locked = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 423,
        data,
        ctor: exports.locked
      });
    };
    exports.failedDependency = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 424,
        data,
        ctor: exports.failedDependency
      });
    };
    exports.tooEarly = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 425,
        data,
        ctor: exports.tooEarly
      });
    };
    exports.preconditionRequired = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 428,
        data,
        ctor: exports.preconditionRequired
      });
    };
    exports.tooManyRequests = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 429,
        data,
        ctor: exports.tooManyRequests
      });
    };
    exports.illegal = function(messageOrError, data) {
      return new exports.Boom(messageOrError, {
        statusCode: 451,
        data,
        ctor: exports.illegal
      });
    };
    exports.internal = function(message, data, statusCode = 500) {
      return internals.serverError(message, data, statusCode, exports.internal);
    };
    exports.notImplemented = function(message, data) {
      return internals.serverError(message, data, 501, exports.notImplemented);
    };
    exports.badGateway = function(message, data) {
      return internals.serverError(message, data, 502, exports.badGateway);
    };
    exports.serverUnavailable = function(message, data) {
      return internals.serverError(message, data, 503, exports.serverUnavailable);
    };
    exports.gatewayTimeout = function(message, data) {
      return internals.serverError(message, data, 504, exports.gatewayTimeout);
    };
    exports.badImplementation = function(message, data) {
      const err = internals.serverError(message, data, 500, exports.badImplementation);
      err.isDeveloperError = true;
      return err;
    };
    internals.initialize = function(err, statusCode, message) {
      const numberCode = parseInt(statusCode, 10);
      Hoek.assert(!isNaN(numberCode) && numberCode >= 400, "First argument must be a number (400+):", statusCode);
      err.isBoom = true;
      err.isServer = numberCode >= 500;
      if (!err.hasOwnProperty("data")) {
        err.data = null;
      }
      err.output = {
        statusCode: numberCode,
        payload: {},
        headers: {}
      };
      Object.defineProperty(err, "reformat", {
        value: internals.reformat,
        configurable: true
      });
      if (!message && !err.message) {
        err.reformat();
        message = err.output.payload.error;
      }
      if (message) {
        const props = Object.getOwnPropertyDescriptor(err, "message") || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(err), "message");
        Hoek.assert(!props || props.configurable && !props.get, "The error is not compatible with boom");
        err.message = message + (err.message ? ": " + err.message : "");
        err.output.payload.message = err.message;
      }
      err.reformat();
      return err;
    };
    internals.reformat = function(debug = false) {
      this.output.payload.statusCode = this.output.statusCode;
      this.output.payload.error = internals.codes.get(this.output.statusCode) || "Unknown";
      if (this.output.statusCode === 500 && debug !== true) {
        this.output.payload.message = "An internal server error occurred";
      } else if (this.message) {
        this.output.payload.message = this.message;
      }
    };
    internals.serverError = function(messageOrError, data, statusCode, ctor) {
      if (data instanceof Error && !data.isBoom) {
        return exports.boomify(data, {
          statusCode,
          message: messageOrError
        });
      }
      return new exports.Boom(messageOrError, {
        statusCode,
        data,
        ctor
      });
    };
  }
});

// node_modules/.deno/lru-cache@7.14.0/node_modules/lru-cache/index.js
var require_lru_cache = __commonJS({
  "node_modules/.deno/lru-cache@7.14.0/node_modules/lru-cache/index.js"(exports, module) {
    var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
    var hasAbortController = typeof AbortController === "function";
    var AC = hasAbortController ? AbortController : class AbortController {
      constructor() {
        this.signal = new AS();
      }
      abort() {
        this.signal.dispatchEvent("abort");
      }
    };
    var hasAbortSignal = typeof AbortSignal === "function";
    var hasACAbortSignal = typeof AC.AbortSignal === "function";
    var AS = hasAbortSignal ? AbortSignal : hasACAbortSignal ? AC.AbortController : class AbortSignal {
      constructor() {
        this.aborted = false;
        this._listeners = [];
      }
      dispatchEvent(type) {
        if (type === "abort") {
          this.aborted = true;
          const e = {
            type,
            target: this
          };
          this.onabort(e);
          this._listeners.forEach((f) => f(e), this);
        }
      }
      onabort() {
      }
      addEventListener(ev, fn) {
        if (ev === "abort") {
          this._listeners.push(fn);
        }
      }
      removeEventListener(ev, fn) {
        if (ev === "abort") {
          this._listeners = this._listeners.filter((f) => f !== fn);
        }
      }
    };
    var warned = /* @__PURE__ */ new Set();
    var deprecatedOption = (opt, instead) => {
      const code2 = `LRU_CACHE_OPTION_${opt}`;
      if (shouldWarn(code2)) {
        warn(code2, `${opt} option`, `options.${instead}`, LRUCache);
      }
    };
    var deprecatedMethod = (method, instead) => {
      const code2 = `LRU_CACHE_METHOD_${method}`;
      if (shouldWarn(code2)) {
        const { prototype } = LRUCache;
        const { get } = Object.getOwnPropertyDescriptor(prototype, method);
        warn(code2, `${method} method`, `cache.${instead}()`, get);
      }
    };
    var deprecatedProperty = (field, instead) => {
      const code2 = `LRU_CACHE_PROPERTY_${field}`;
      if (shouldWarn(code2)) {
        const { prototype } = LRUCache;
        const { get } = Object.getOwnPropertyDescriptor(prototype, field);
        warn(code2, `${field} property`, `cache.${instead}`, get);
      }
    };
    var emitWarning = (...a) => {
      typeof process === "object" && process && typeof process.emitWarning === "function" ? process.emitWarning(...a) : console.error(...a);
    };
    var shouldWarn = (code2) => !warned.has(code2);
    var warn = (code2, what, instead, fn) => {
      warned.add(code2);
      const msg = `The ${what} is deprecated. Please use ${instead} instead.`;
      emitWarning(msg, "DeprecationWarning", code2, fn);
    };
    var isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
    var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
    var ZeroArray = class extends Array {
      constructor(size) {
        super(size);
        this.fill(0);
      }
    };
    var Stack = class {
      constructor(max) {
        if (max === 0) {
          return [];
        }
        const UintArray = getUintArray(max);
        this.heap = new UintArray(max);
        this.length = 0;
      }
      push(n) {
        this.heap[this.length++] = n;
      }
      pop() {
        return this.heap[--this.length];
      }
    };
    var LRUCache = class _LRUCache {
      constructor(options2 = {}) {
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, fetchContext, noDeleteOnFetchRejection, noDeleteOnStaleGet } = options2;
        const { length: length2, maxAge, stale } = options2 instanceof _LRUCache ? {} : options2;
        if (max !== 0 && !isPosInt(max)) {
          throw new TypeError("max option must be a nonnegative integer");
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
          throw new Error("invalid max value: " + max);
        }
        this.max = max;
        this.maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.maxSize;
        this.sizeCalculation = sizeCalculation || length2;
        if (this.sizeCalculation) {
          if (!this.maxSize && !this.maxEntrySize) {
            throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
          }
          if (typeof this.sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation set to non-function");
          }
        }
        this.fetchMethod = fetchMethod || null;
        if (this.fetchMethod && typeof this.fetchMethod !== "function") {
          throw new TypeError("fetchMethod must be a function if specified");
        }
        this.fetchContext = fetchContext;
        if (!this.fetchMethod && fetchContext !== void 0) {
          throw new TypeError("cannot set fetchContext without fetchMethod");
        }
        this.keyMap = /* @__PURE__ */ new Map();
        this.keyList = new Array(max).fill(null);
        this.valList = new Array(max).fill(null);
        this.next = new UintArray(max);
        this.prev = new UintArray(max);
        this.head = 0;
        this.tail = 0;
        this.free = new Stack(max);
        this.initialFill = 1;
        this.size = 0;
        if (typeof dispose === "function") {
          this.dispose = dispose;
        }
        if (typeof disposeAfter === "function") {
          this.disposeAfter = disposeAfter;
          this.disposed = [];
        } else {
          this.disposeAfter = null;
          this.disposed = null;
        }
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        if (this.maxEntrySize !== 0) {
          if (this.maxSize !== 0) {
            if (!isPosInt(this.maxSize)) {
              throw new TypeError("maxSize must be a positive integer if specified");
            }
          }
          if (!isPosInt(this.maxEntrySize)) {
            throw new TypeError("maxEntrySize must be a positive integer if specified");
          }
          this.initializeSizeTracking();
        }
        this.allowStale = !!allowStale || !!stale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || maxAge || 0;
        if (this.ttl) {
          if (!isPosInt(this.ttl)) {
            throw new TypeError("ttl must be a positive integer if specified");
          }
          this.initializeTTLTracking();
        }
        if (this.max === 0 && this.ttl === 0 && this.maxSize === 0) {
          throw new TypeError("At least one of max, maxSize, or ttl is required");
        }
        if (!this.ttlAutopurge && !this.max && !this.maxSize) {
          const code2 = "LRU_CACHE_UNBOUNDED";
          if (shouldWarn(code2)) {
            warned.add(code2);
            const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
            emitWarning(msg, "UnboundedCacheWarning", code2, _LRUCache);
          }
        }
        if (stale) {
          deprecatedOption("stale", "allowStale");
        }
        if (maxAge) {
          deprecatedOption("maxAge", "ttl");
        }
        if (length2) {
          deprecatedOption("length", "sizeCalculation");
        }
      }
      getRemainingTTL(key) {
        return this.has(key, {
          updateAgeOnHas: false
        }) ? Infinity : 0;
      }
      initializeTTLTracking() {
        this.ttls = new ZeroArray(this.max);
        this.starts = new ZeroArray(this.max);
        this.setItemTTL = (index, ttl, start = perf.now()) => {
          this.starts[index] = ttl !== 0 ? start : 0;
          this.ttls[index] = ttl;
          if (ttl !== 0 && this.ttlAutopurge) {
            const t = setTimeout(() => {
              if (this.isStale(index)) {
                this.delete(this.keyList[index]);
              }
            }, ttl + 1);
            if (t.unref) {
              t.unref();
            }
          }
        };
        this.updateItemAge = (index) => {
          this.starts[index] = this.ttls[index] !== 0 ? perf.now() : 0;
        };
        let cachedNow = 0;
        const getNow = () => {
          const n = perf.now();
          if (this.ttlResolution > 0) {
            cachedNow = n;
            const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
            if (t.unref) {
              t.unref();
            }
          }
          return n;
        };
        this.getRemainingTTL = (key) => {
          const index = this.keyMap.get(key);
          if (index === void 0) {
            return 0;
          }
          return this.ttls[index] === 0 || this.starts[index] === 0 ? Infinity : this.starts[index] + this.ttls[index] - (cachedNow || getNow());
        };
        this.isStale = (index) => {
          return this.ttls[index] !== 0 && this.starts[index] !== 0 && (cachedNow || getNow()) - this.starts[index] > this.ttls[index];
        };
      }
      updateItemAge(index) {
      }
      setItemTTL(index, ttl, start) {
      }
      isStale(index) {
        return false;
      }
      initializeSizeTracking() {
        this.calculatedSize = 0;
        this.sizes = new ZeroArray(this.max);
        this.removeItemSize = (index) => {
          this.calculatedSize -= this.sizes[index];
          this.sizes[index] = 0;
        };
        this.requireSize = (k, v, size, sizeCalculation) => {
          if (!isPosInt(size)) {
            if (sizeCalculation) {
              if (typeof sizeCalculation !== "function") {
                throw new TypeError("sizeCalculation must be a function");
              }
              size = sizeCalculation(v, k);
              if (!isPosInt(size)) {
                throw new TypeError("sizeCalculation return invalid (expect positive integer)");
              }
            } else {
              throw new TypeError("invalid size value (must be positive integer)");
            }
          }
          return size;
        };
        this.addItemSize = (index, size) => {
          this.sizes[index] = size;
          const maxSize = this.maxSize - this.sizes[index];
          while (this.calculatedSize > maxSize) {
            this.evict(true);
          }
          this.calculatedSize += this.sizes[index];
        };
      }
      removeItemSize(index) {
      }
      addItemSize(index, size) {
      }
      requireSize(k, v, size, sizeCalculation) {
        if (size || sizeCalculation) {
          throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
        }
      }
      *indexes({ allowStale = this.allowStale } = {}) {
        if (this.size) {
          for (let i = this.tail; true; ) {
            if (!this.isValidIndex(i)) {
              break;
            }
            if (allowStale || !this.isStale(i)) {
              yield i;
            }
            if (i === this.head) {
              break;
            } else {
              i = this.prev[i];
            }
          }
        }
      }
      *rindexes({ allowStale = this.allowStale } = {}) {
        if (this.size) {
          for (let i = this.head; true; ) {
            if (!this.isValidIndex(i)) {
              break;
            }
            if (allowStale || !this.isStale(i)) {
              yield i;
            }
            if (i === this.tail) {
              break;
            } else {
              i = this.next[i];
            }
          }
        }
      }
      isValidIndex(index) {
        return this.keyMap.get(this.keyList[index]) === index;
      }
      *entries() {
        for (const i of this.indexes()) {
          yield [
            this.keyList[i],
            this.valList[i]
          ];
        }
      }
      *rentries() {
        for (const i of this.rindexes()) {
          yield [
            this.keyList[i],
            this.valList[i]
          ];
        }
      }
      *keys() {
        for (const i of this.indexes()) {
          yield this.keyList[i];
        }
      }
      *rkeys() {
        for (const i of this.rindexes()) {
          yield this.keyList[i];
        }
      }
      *values() {
        for (const i of this.indexes()) {
          yield this.valList[i];
        }
      }
      *rvalues() {
        for (const i of this.rindexes()) {
          yield this.valList[i];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      find(fn, getOptions = {}) {
        for (const i of this.indexes()) {
          if (fn(this.valList[i], this.keyList[i], this)) {
            return this.get(this.keyList[i], getOptions);
          }
        }
      }
      forEach(fn, thisp = this) {
        for (const i of this.indexes()) {
          fn.call(thisp, this.valList[i], this.keyList[i], this);
        }
      }
      rforEach(fn, thisp = this) {
        for (const i of this.rindexes()) {
          fn.call(thisp, this.valList[i], this.keyList[i], this);
        }
      }
      get prune() {
        deprecatedMethod("prune", "purgeStale");
        return this.purgeStale;
      }
      purgeStale() {
        let deleted = false;
        for (const i of this.rindexes({
          allowStale: true
        })) {
          if (this.isStale(i)) {
            this.delete(this.keyList[i]);
            deleted = true;
          }
        }
        return deleted;
      }
      dump() {
        const arr = [];
        for (const i of this.indexes({
          allowStale: true
        })) {
          const key = this.keyList[i];
          const v = this.valList[i];
          const value = this.isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          const entry = {
            value
          };
          if (this.ttls) {
            entry.ttl = this.ttls[i];
            const age = perf.now() - this.starts[i];
            entry.start = Math.floor(Date.now() - age);
          }
          if (this.sizes) {
            entry.size = this.sizes[i];
          }
          arr.unshift([
            key,
            entry
          ]);
        }
        return arr;
      }
      load(arr) {
        this.clear();
        for (const [key, entry] of arr) {
          if (entry.start) {
            const age = Date.now() - entry.start;
            entry.start = perf.now() - age;
          }
          this.set(key, entry.value, entry);
        }
      }
      dispose(v, k, reason) {
      }
      set(k, v, { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, size = 0, sizeCalculation = this.sizeCalculation, noUpdateTTL = this.noUpdateTTL } = {}) {
        size = this.requireSize(k, v, size, sizeCalculation);
        if (this.maxEntrySize && size > this.maxEntrySize) {
          return this;
        }
        let index = this.size === 0 ? void 0 : this.keyMap.get(k);
        if (index === void 0) {
          index = this.newIndex();
          this.keyList[index] = k;
          this.valList[index] = v;
          this.keyMap.set(k, index);
          this.next[this.tail] = index;
          this.prev[index] = this.tail;
          this.tail = index;
          this.size++;
          this.addItemSize(index, size);
          noUpdateTTL = false;
        } else {
          const oldVal = this.valList[index];
          if (v !== oldVal) {
            if (this.isBackgroundFetch(oldVal)) {
              oldVal.__abortController.abort();
            } else {
              if (!noDisposeOnSet) {
                this.dispose(oldVal, k, "set");
                if (this.disposeAfter) {
                  this.disposed.push([
                    oldVal,
                    k,
                    "set"
                  ]);
                }
              }
            }
            this.removeItemSize(index);
            this.valList[index] = v;
            this.addItemSize(index, size);
          }
          this.moveToTail(index);
        }
        if (ttl !== 0 && this.ttl === 0 && !this.ttls) {
          this.initializeTTLTracking();
        }
        if (!noUpdateTTL) {
          this.setItemTTL(index, ttl, start);
        }
        if (this.disposeAfter) {
          while (this.disposed.length) {
            this.disposeAfter(...this.disposed.shift());
          }
        }
        return this;
      }
      newIndex() {
        if (this.size === 0) {
          return this.tail;
        }
        if (this.size === this.max && this.max !== 0) {
          return this.evict(false);
        }
        if (this.free.length !== 0) {
          return this.free.pop();
        }
        return this.initialFill++;
      }
      pop() {
        if (this.size) {
          const val = this.valList[this.head];
          this.evict(true);
          return val;
        }
      }
      evict(free) {
        const head = this.head;
        const k = this.keyList[head];
        const v = this.valList[head];
        if (this.isBackgroundFetch(v)) {
          v.__abortController.abort();
        } else {
          this.dispose(v, k, "evict");
          if (this.disposeAfter) {
            this.disposed.push([
              v,
              k,
              "evict"
            ]);
          }
        }
        this.removeItemSize(head);
        if (free) {
          this.keyList[head] = null;
          this.valList[head] = null;
          this.free.push(head);
        }
        this.head = this.next[head];
        this.keyMap.delete(k);
        this.size--;
        return head;
      }
      has(k, { updateAgeOnHas = this.updateAgeOnHas } = {}) {
        const index = this.keyMap.get(k);
        if (index !== void 0) {
          if (!this.isStale(index)) {
            if (updateAgeOnHas) {
              this.updateItemAge(index);
            }
            return true;
          }
        }
        return false;
      }
      // like get(), but without any LRU updating or TTL expiration
      peek(k, { allowStale = this.allowStale } = {}) {
        const index = this.keyMap.get(k);
        if (index !== void 0 && (allowStale || !this.isStale(index))) {
          const v = this.valList[index];
          return this.isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        }
      }
      backgroundFetch(k, index, options2, context) {
        const v = index === void 0 ? void 0 : this.valList[index];
        if (this.isBackgroundFetch(v)) {
          return v;
        }
        const ac = new AC();
        const fetchOpts = {
          signal: ac.signal,
          options: options2,
          context
        };
        const cb = (v2) => {
          if (!ac.signal.aborted) {
            this.set(k, v2, fetchOpts.options);
          }
          return v2;
        };
        const eb = (er) => {
          if (this.valList[index] === p) {
            const del = !options2.noDeleteOnFetchRejection || p.__staleWhileFetching === void 0;
            if (del) {
              this.delete(k);
            } else {
              this.valList[index] = p.__staleWhileFetching;
            }
          }
          if (p.__returned === p) {
            throw er;
          }
        };
        const pcall = (res) => res(this.fetchMethod(k, v, fetchOpts));
        const p = new Promise(pcall).then(cb, eb);
        p.__abortController = ac;
        p.__staleWhileFetching = v;
        p.__returned = null;
        if (index === void 0) {
          this.set(k, p, fetchOpts.options);
          index = this.keyMap.get(k);
        } else {
          this.valList[index] = p;
        }
        return p;
      }
      isBackgroundFetch(p) {
        return p && typeof p === "object" && typeof p.then === "function" && Object.prototype.hasOwnProperty.call(p, "__staleWhileFetching") && Object.prototype.hasOwnProperty.call(p, "__returned") && (p.__returned === p || p.__returned === null);
      }
      // this takes the union of get() and set() opts, because it does both
      async fetch(k, {
        // get options
        allowStale = this.allowStale,
        updateAgeOnGet = this.updateAgeOnGet,
        noDeleteOnStaleGet = this.noDeleteOnStaleGet,
        // set options
        ttl = this.ttl,
        noDisposeOnSet = this.noDisposeOnSet,
        size = 0,
        sizeCalculation = this.sizeCalculation,
        noUpdateTTL = this.noUpdateTTL,
        // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
        fetchContext = this.fetchContext,
        forceRefresh = false
      } = {}) {
        if (!this.fetchMethod) {
          return this.get(k, {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet
          });
        }
        const options2 = {
          allowStale,
          updateAgeOnGet,
          noDeleteOnStaleGet,
          ttl,
          noDisposeOnSet,
          size,
          sizeCalculation,
          noUpdateTTL,
          noDeleteOnFetchRejection
        };
        let index = this.keyMap.get(k);
        if (index === void 0) {
          const p = this.backgroundFetch(k, index, options2, fetchContext);
          return p.__returned = p;
        } else {
          const v = this.valList[index];
          if (this.isBackgroundFetch(v)) {
            return allowStale && v.__staleWhileFetching !== void 0 ? v.__staleWhileFetching : v.__returned = v;
          }
          if (!forceRefresh && !this.isStale(index)) {
            this.moveToTail(index);
            if (updateAgeOnGet) {
              this.updateItemAge(index);
            }
            return v;
          }
          const p = this.backgroundFetch(k, index, options2, fetchContext);
          return allowStale && p.__staleWhileFetching !== void 0 ? p.__staleWhileFetching : p.__returned = p;
        }
      }
      get(k, { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet } = {}) {
        const index = this.keyMap.get(k);
        if (index !== void 0) {
          const value = this.valList[index];
          const fetching = this.isBackgroundFetch(value);
          if (this.isStale(index)) {
            if (!fetching) {
              if (!noDeleteOnStaleGet) {
                this.delete(k);
              }
              return allowStale ? value : void 0;
            } else {
              return allowStale ? value.__staleWhileFetching : void 0;
            }
          } else {
            if (fetching) {
              return void 0;
            }
            this.moveToTail(index);
            if (updateAgeOnGet) {
              this.updateItemAge(index);
            }
            return value;
          }
        }
      }
      connect(p, n) {
        this.prev[n] = p;
        this.next[p] = n;
      }
      moveToTail(index) {
        if (index !== this.tail) {
          if (index === this.head) {
            this.head = this.next[index];
          } else {
            this.connect(this.prev[index], this.next[index]);
          }
          this.connect(this.tail, index);
          this.tail = index;
        }
      }
      get del() {
        deprecatedMethod("del", "delete");
        return this.delete;
      }
      delete(k) {
        let deleted = false;
        if (this.size !== 0) {
          const index = this.keyMap.get(k);
          if (index !== void 0) {
            deleted = true;
            if (this.size === 1) {
              this.clear();
            } else {
              this.removeItemSize(index);
              const v = this.valList[index];
              if (this.isBackgroundFetch(v)) {
                v.__abortController.abort();
              } else {
                this.dispose(v, k, "delete");
                if (this.disposeAfter) {
                  this.disposed.push([
                    v,
                    k,
                    "delete"
                  ]);
                }
              }
              this.keyMap.delete(k);
              this.keyList[index] = null;
              this.valList[index] = null;
              if (index === this.tail) {
                this.tail = this.prev[index];
              } else if (index === this.head) {
                this.head = this.next[index];
              } else {
                this.next[this.prev[index]] = this.next[index];
                this.prev[this.next[index]] = this.prev[index];
              }
              this.size--;
              this.free.push(index);
            }
          }
        }
        if (this.disposed) {
          while (this.disposed.length) {
            this.disposeAfter(...this.disposed.shift());
          }
        }
        return deleted;
      }
      clear() {
        for (const index of this.rindexes({
          allowStale: true
        })) {
          const v = this.valList[index];
          if (this.isBackgroundFetch(v)) {
            v.__abortController.abort();
          } else {
            const k = this.keyList[index];
            this.dispose(v, k, "delete");
            if (this.disposeAfter) {
              this.disposed.push([
                v,
                k,
                "delete"
              ]);
            }
          }
        }
        this.keyMap.clear();
        this.valList.fill(null);
        this.keyList.fill(null);
        if (this.ttls) {
          this.ttls.fill(0);
          this.starts.fill(0);
        }
        if (this.sizes) {
          this.sizes.fill(0);
        }
        this.head = 0;
        this.tail = 0;
        this.initialFill = 1;
        this.free.length = 0;
        this.calculatedSize = 0;
        this.size = 0;
        if (this.disposed) {
          while (this.disposed.length) {
            this.disposeAfter(...this.disposed.shift());
          }
        }
      }
      get reset() {
        deprecatedMethod("reset", "clear");
        return this.clear;
      }
      get length() {
        deprecatedProperty("length", "size");
        return this.size;
      }
      static get AbortController() {
        return AC;
      }
      static get AbortSignal() {
        return AS;
      }
    };
    module.exports = LRUCache;
  }
});

// node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err-helpers.js
var require_err_helpers = __commonJS({
  "node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err-helpers.js"(exports, module) {
    "use strict";
    var isErrorLike = (err) => {
      return err && typeof err.message === "string";
    };
    var getErrorCause = (err) => {
      if (!err) return;
      const cause = err.cause;
      if (typeof cause === "function") {
        const causeResult = err.cause();
        return isErrorLike(causeResult) ? causeResult : void 0;
      } else {
        return isErrorLike(cause) ? cause : void 0;
      }
    };
    var _stackWithCauses = (err, seen) => {
      if (!isErrorLike(err)) return "";
      const stack = err.stack || "";
      if (seen.has(err)) {
        return stack + "\ncauses have become circular...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        return stack + "\ncaused by: " + _stackWithCauses(cause, seen);
      } else {
        return stack;
      }
    };
    var stackWithCauses = (err) => _stackWithCauses(err, /* @__PURE__ */ new Set());
    var _messageWithCauses = (err, seen, skip) => {
      if (!isErrorLike(err)) return "";
      const message = skip ? "" : err.message || "";
      if (seen.has(err)) {
        return message + ": ...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        const skipIfVErrorStyleCause = typeof err.cause === "function";
        return message + (skipIfVErrorStyleCause ? "" : ": ") + _messageWithCauses(cause, seen, skipIfVErrorStyleCause);
      } else {
        return message;
      }
    };
    var messageWithCauses = (err) => _messageWithCauses(err, /* @__PURE__ */ new Set());
    module.exports = {
      isErrorLike,
      getErrorCause,
      stackWithCauses,
      messageWithCauses
    };
  }
});

// node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err-proto.js
var require_err_proto = __commonJS({
  "node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err-proto.js"(exports, module) {
    "use strict";
    var seen = Symbol("circular-ref-tag");
    var rawSymbol = Symbol("pino-raw-err-ref");
    var pinoErrProto = Object.create({}, {
      type: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      message: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      stack: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      aggregateErrors: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoErrProto, rawSymbol, {
      writable: true,
      value: {}
    });
    module.exports = {
      pinoErrProto,
      pinoErrorSymbols: {
        seen,
        rawSymbol
      }
    };
  }
});

// node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err.js
var require_err = __commonJS({
  "node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err.js"(exports, module) {
    "use strict";
    module.exports = errSerializer;
    var { messageWithCauses, stackWithCauses, isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = messageWithCauses(err);
      _err.stack = stackWithCauses(err);
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errSerializer(err2));
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (key !== "cause" && !Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err-with-cause.js
var require_err_with_cause = __commonJS({
  "node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/err-with-cause.js"(exports, module) {
    "use strict";
    module.exports = errWithCauseSerializer;
    var { isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errWithCauseSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = err.message;
      _err.stack = err.stack;
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errWithCauseSerializer(err2));
      }
      if (isErrorLike(err.cause) && !Object.prototype.hasOwnProperty.call(err.cause, seen)) {
        _err.cause = errWithCauseSerializer(err.cause);
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (!Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errWithCauseSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/req.js
var require_req = __commonJS({
  "node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/req.js"(exports, module) {
    "use strict";
    module.exports = {
      mapHttpRequest,
      reqSerializer
    };
    var rawSymbol = Symbol("pino-raw-req-ref");
    var pinoReqProto = Object.create({}, {
      id: {
        enumerable: true,
        writable: true,
        value: ""
      },
      method: {
        enumerable: true,
        writable: true,
        value: ""
      },
      url: {
        enumerable: true,
        writable: true,
        value: ""
      },
      query: {
        enumerable: true,
        writable: true,
        value: ""
      },
      params: {
        enumerable: true,
        writable: true,
        value: ""
      },
      headers: {
        enumerable: true,
        writable: true,
        value: {}
      },
      remoteAddress: {
        enumerable: true,
        writable: true,
        value: ""
      },
      remotePort: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoReqProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function reqSerializer(req) {
      const connection = req.info || req.socket;
      const _req = Object.create(pinoReqProto);
      _req.id = typeof req.id === "function" ? req.id() : req.id || (req.info ? req.info.id : void 0);
      _req.method = req.method;
      if (req.originalUrl) {
        _req.url = req.originalUrl;
      } else {
        const path2 = req.path;
        _req.url = typeof path2 === "string" ? path2 : req.url ? req.url.path || req.url : void 0;
      }
      if (req.query) {
        _req.query = req.query;
      }
      if (req.params) {
        _req.params = req.params;
      }
      _req.headers = req.headers;
      _req.remoteAddress = connection && connection.remoteAddress;
      _req.remotePort = connection && connection.remotePort;
      _req.raw = req.raw || req;
      return _req;
    }
    function mapHttpRequest(req) {
      return {
        req: reqSerializer(req)
      };
    }
  }
});

// node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/res.js
var require_res = __commonJS({
  "node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/lib/res.js"(exports, module) {
    "use strict";
    module.exports = {
      mapHttpResponse,
      resSerializer
    };
    var rawSymbol = Symbol("pino-raw-res-ref");
    var pinoResProto = Object.create({}, {
      statusCode: {
        enumerable: true,
        writable: true,
        value: 0
      },
      headers: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoResProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function resSerializer(res) {
      const _res = Object.create(pinoResProto);
      _res.statusCode = res.headersSent ? res.statusCode : null;
      _res.headers = res.getHeaders ? res.getHeaders() : res._headers;
      _res.raw = res;
      return _res;
    }
    function mapHttpResponse(res) {
      return {
        res: resSerializer(res)
      };
    }
  }
});

// node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/index.js
var require_pino_std_serializers = __commonJS({
  "node_modules/.deno/pino-std-serializers@6.2.2/node_modules/pino-std-serializers/index.js"(exports, module) {
    "use strict";
    var errSerializer = require_err();
    var errWithCauseSerializer = require_err_with_cause();
    var reqSerializers = require_req();
    var resSerializers = require_res();
    module.exports = {
      err: errSerializer,
      errWithCause: errWithCauseSerializer,
      mapHttpRequest: reqSerializers.mapHttpRequest,
      mapHttpResponse: resSerializers.mapHttpResponse,
      req: reqSerializers.reqSerializer,
      res: resSerializers.resSerializer,
      wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
        if (customSerializer === errSerializer) return customSerializer;
        return function wrapErrSerializer(err) {
          return customSerializer(errSerializer(err));
        };
      },
      wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
        if (customSerializer === reqSerializers.reqSerializer) return customSerializer;
        return function wrappedReqSerializer(req) {
          return customSerializer(reqSerializers.reqSerializer(req));
        };
      },
      wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
        if (customSerializer === resSerializers.resSerializer) return customSerializer;
        return function wrappedResSerializer(res) {
          return customSerializer(resSerializers.resSerializer(res));
        };
      }
    };
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/caller.js
var require_caller = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/caller.js"(exports, module) {
    "use strict";
    function noOpPrepareStackTrace(_, stack) {
      return stack;
    }
    module.exports = function getCallers() {
      const originalPrepare = Error.prepareStackTrace;
      Error.prepareStackTrace = noOpPrepareStackTrace;
      const stack = new Error().stack;
      Error.prepareStackTrace = originalPrepare;
      if (!Array.isArray(stack)) {
        return void 0;
      }
      const entries = stack.slice(2);
      const fileNames = [];
      for (const entry of entries) {
        if (!entry) {
          continue;
        }
        fileNames.push(entry.getFileName());
      }
      return fileNames;
    };
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/validator.js
var require_validator = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/validator.js"(exports, module) {
    "use strict";
    module.exports = validator;
    function validator(opts = {}) {
      const { ERR_PATHS_MUST_BE_STRINGS = () => "fast-redact - Paths must be (non-empty) strings", ERR_INVALID_PATH = (s) => `fast-redact \u2013 Invalid path (${s})` } = opts;
      return function validate({ paths }) {
        paths.forEach((s) => {
          if (typeof s !== "string") {
            throw Error(ERR_PATHS_MUST_BE_STRINGS());
          }
          try {
            if (/〇/.test(s)) throw Error();
            const expr = (s[0] === "[" ? "" : ".") + s.replace(/^\*/, "\u3007").replace(/\.\*/g, ".\u3007").replace(/\[\*\]/g, "[\u3007]");
            if (/\n|\r|;/.test(expr)) throw Error();
            if (/\/\*/.test(expr)) throw Error();
            Function(`
            'use strict'
            const o = new Proxy({}, { get: () => o, set: () => { throw Error() } });
            const \u3007 = null;
            o${expr}
            if ([o${expr}].length !== 1) throw Error()`)();
          } catch (e) {
            throw Error(ERR_INVALID_PATH(s));
          }
        });
      };
    }
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/rx.js
var require_rx = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/rx.js"(exports, module) {
    "use strict";
    module.exports = /[^.[\]]+|\[((?:.)*?)\]/g;
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/parse.js
var require_parse = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/parse.js"(exports, module) {
    "use strict";
    var rx = require_rx();
    module.exports = parse5;
    function parse5({ paths }) {
      const wildcards = [];
      var wcLen = 0;
      const secret = paths.reduce(function(o, strPath, ix) {
        var path2 = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ""));
        const leadingBracket = strPath[0] === "[";
        path2 = path2.map((p) => {
          if (p[0] === "[") return p.substr(1, p.length - 2);
          else return p;
        });
        const star = path2.indexOf("*");
        if (star > -1) {
          const before = path2.slice(0, star);
          const beforeStr = before.join(".");
          const after = path2.slice(star + 1, path2.length);
          const nested = after.length > 0;
          wcLen++;
          wildcards.push({
            before,
            beforeStr,
            after,
            nested
          });
        } else {
          o[strPath] = {
            path: path2,
            val: void 0,
            precensored: false,
            circle: "",
            escPath: JSON.stringify(strPath),
            leadingBracket
          };
        }
        return o;
      }, {});
      return {
        wildcards,
        wcLen,
        secret
      };
    }
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/redactor.js
var require_redactor = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/redactor.js"(exports, module) {
    "use strict";
    var rx = require_rx();
    module.exports = redactor;
    function redactor({ secret, serialize, wcLen, strict, isCensorFct, censorFctTakesPath }, state) {
      const redact = Function("o", `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize)}
    }
    const { censor, secret } = this
    const originalSecret = {}
    const secretKeys = Object.keys(secret)
    for (var i = 0; i < secretKeys.length; i++) {
      originalSecret[secretKeys[i]] = secret[secretKeys[i]]
    }

    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    this.secret = originalSecret
    ${resultTmpl(serialize)}
  `).bind(state);
      redact.state = state;
      if (serialize === false) {
        redact.restore = (o) => state.restore(o);
      }
      return redact;
    }
    function redactTmpl(secret, isCensorFct, censorFctTakesPath) {
      return Object.keys(secret).map((path2) => {
        const { escPath, leadingBracket, path: arrPath } = secret[path2];
        const skip = leadingBracket ? 1 : 0;
        const delim = leadingBracket ? "" : ".";
        const hops = [];
        var match;
        while ((match = rx.exec(path2)) !== null) {
          const [, ix] = match;
          const { index, input } = match;
          if (index > skip) hops.push(input.substring(0, index - (ix ? 0 : 1)));
        }
        var existence = hops.map((p) => `o${delim}${p}`).join(" && ");
        if (existence.length === 0) existence += `o${delim}${path2} != null`;
        else existence += ` && o${delim}${path2} != null`;
        const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join("\n")}
      }
    `;
        const censorArgs = censorFctTakesPath ? `val, ${JSON.stringify(arrPath)}` : `val`;
        return `
      if (${existence}) {
        const val = o${delim}${path2}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path2} = ${isCensorFct ? `censor(${censorArgs})` : "censor"}
          ${circularDetection}
        }
      }
    `;
      }).join("\n");
    }
    function dynamicRedactTmpl(hasWildcards, isCensorFct, censorFctTakesPath) {
      return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : "";
    }
    function resultTmpl(serialize) {
      return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `;
    }
    function strictImpl(strict, serialize) {
      return strict === true ? `throw Error('fast-redact: primitives cannot be redacted')` : serialize === false ? `return o` : `return this.serialize(o)`;
    }
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/modifiers.js
var require_modifiers = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/modifiers.js"(exports, module) {
    "use strict";
    module.exports = {
      groupRedact,
      groupRestore,
      nestedRedact,
      nestedRestore
    };
    function groupRestore({ keys, values, target }) {
      if (target == null || typeof target === "string") return;
      const length2 = keys.length;
      for (var i = 0; i < length2; i++) {
        const k = keys[i];
        target[k] = values[i];
      }
    }
    function groupRedact(o, path2, censor, isCensorFct, censorFctTakesPath) {
      const target = get(o, path2);
      if (target == null || typeof target === "string") return {
        keys: null,
        values: null,
        target,
        flat: true
      };
      const keys = Object.keys(target);
      const keysLength = keys.length;
      const pathLength = path2.length;
      const pathWithKey = censorFctTakesPath ? [
        ...path2
      ] : void 0;
      const values = new Array(keysLength);
      for (var i = 0; i < keysLength; i++) {
        const key = keys[i];
        values[i] = target[key];
        if (censorFctTakesPath) {
          pathWithKey[pathLength] = key;
          target[key] = censor(target[key], pathWithKey);
        } else if (isCensorFct) {
          target[key] = censor(target[key]);
        } else {
          target[key] = censor;
        }
      }
      return {
        keys,
        values,
        target,
        flat: true
      };
    }
    function nestedRestore(instructions) {
      for (let i = 0; i < instructions.length; i++) {
        const { target, path: path2, value } = instructions[i];
        let current = target;
        for (let i2 = path2.length - 1; i2 > 0; i2--) {
          current = current[path2[i2]];
        }
        current[path2[0]] = value;
      }
    }
    function nestedRedact(store, o, path2, ns, censor, isCensorFct, censorFctTakesPath) {
      const target = get(o, path2);
      if (target == null) return;
      const keys = Object.keys(target);
      const keysLength = keys.length;
      for (var i = 0; i < keysLength; i++) {
        const key = keys[i];
        specialSet(store, target, key, path2, ns, censor, isCensorFct, censorFctTakesPath);
      }
      return store;
    }
    function has2(obj, prop) {
      return obj !== void 0 && obj !== null ? "hasOwn" in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop) : false;
    }
    function specialSet(store, o, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath) {
      const afterPathLen = afterPath.length;
      const lastPathIndex = afterPathLen - 1;
      const originalKey = k;
      var i = -1;
      var n;
      var nv;
      var ov;
      var oov = null;
      var wc = null;
      var kIsWc;
      var wcov;
      var consecutive = false;
      var level = 0;
      var depth = 0;
      var redactPathCurrent = tree();
      ov = n = o[k];
      if (typeof n !== "object") return;
      while (n != null && ++i < afterPathLen) {
        depth += 1;
        k = afterPath[i];
        oov = ov;
        if (k !== "*" && !wc && !(typeof n === "object" && k in n)) {
          break;
        }
        if (k === "*") {
          if (wc === "*") {
            consecutive = true;
          }
          wc = k;
          if (i !== lastPathIndex) {
            continue;
          }
        }
        if (wc) {
          const wcKeys = Object.keys(n);
          for (var j = 0; j < wcKeys.length; j++) {
            const wck = wcKeys[j];
            wcov = n[wck];
            kIsWc = k === "*";
            if (consecutive) {
              redactPathCurrent = node(redactPathCurrent, wck, depth);
              level = i;
              ov = iterateNthLevel(wcov, level - 1, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, o[originalKey], depth + 1);
            } else {
              if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
                if (kIsWc) {
                  ov = wcov;
                } else {
                  ov = wcov[k];
                }
                nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
                  ...path2,
                  originalKey,
                  ...afterPath
                ]) : censor(ov) : censor;
                if (kIsWc) {
                  const rv = restoreInstr(node(redactPathCurrent, wck, depth), ov, o[originalKey]);
                  store.push(rv);
                  n[wck] = nv;
                } else {
                  if (wcov[k] === nv) {
                  } else if (nv === void 0 && censor !== void 0 || has2(wcov, k) && nv === ov) {
                    redactPathCurrent = node(redactPathCurrent, wck, depth);
                  } else {
                    redactPathCurrent = node(redactPathCurrent, wck, depth);
                    const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, o[originalKey]);
                    store.push(rv);
                    wcov[k] = nv;
                  }
                }
              }
            }
          }
          wc = null;
        } else {
          ov = n[k];
          redactPathCurrent = node(redactPathCurrent, k, depth);
          nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
            ...path2,
            originalKey,
            ...afterPath
          ]) : censor(ov) : censor;
          if (has2(n, k) && nv === ov || nv === void 0 && censor !== void 0) {
          } else {
            const rv = restoreInstr(redactPathCurrent, ov, o[originalKey]);
            store.push(rv);
            n[k] = nv;
          }
          n = n[k];
        }
        if (typeof n !== "object") break;
        if (ov === oov || typeof ov === "undefined") {
        }
      }
    }
    function get(o, p) {
      var i = -1;
      var l = p.length;
      var n = o;
      while (n != null && ++i < l) {
        n = n[p[i]];
      }
      return n;
    }
    function iterateNthLevel(wcov, level, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth) {
      if (level === 0) {
        if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
          if (kIsWc) {
            ov = wcov;
          } else {
            ov = wcov[k];
          }
          nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
            ...path2,
            originalKey,
            ...afterPath
          ]) : censor(ov) : censor;
          if (kIsWc) {
            const rv = restoreInstr(redactPathCurrent, ov, parent);
            store.push(rv);
            n[wck] = nv;
          } else {
            if (wcov[k] === nv) {
            } else if (nv === void 0 && censor !== void 0 || has2(wcov, k) && nv === ov) {
            } else {
              const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, parent);
              store.push(rv);
              wcov[k] = nv;
            }
          }
        }
      }
      for (const key in wcov) {
        if (typeof wcov[key] === "object") {
          redactPathCurrent = node(redactPathCurrent, key, depth);
          iterateNthLevel(wcov[key], level - 1, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth + 1);
        }
      }
    }
    function tree() {
      return {
        parent: null,
        key: null,
        children: [],
        depth: 0
      };
    }
    function node(parent, key, depth) {
      if (parent.depth === depth) {
        return node(parent.parent, key, depth);
      }
      var child = {
        parent,
        key,
        depth,
        children: []
      };
      parent.children.push(child);
      return child;
    }
    function restoreInstr(node2, value, target) {
      let current = node2;
      const path2 = [];
      do {
        path2.push(current.key);
        current = current.parent;
      } while (current.parent != null);
      return {
        path: path2,
        value,
        target
      };
    }
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/restorer.js
var require_restorer = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/restorer.js"(exports, module) {
    "use strict";
    var { groupRestore, nestedRestore } = require_modifiers();
    module.exports = restorer;
    function restorer() {
      return function compileRestore() {
        if (this.restore) {
          this.restore.state.secret = this.secret;
          return;
        }
        const { secret, wcLen } = this;
        const paths = Object.keys(secret);
        const resetters = resetTmpl(secret, paths);
        const hasWildcards = wcLen > 0;
        const state = hasWildcards ? {
          secret,
          groupRestore,
          nestedRestore
        } : {
          secret
        };
        this.restore = Function("o", restoreTmpl(resetters, paths, hasWildcards)).bind(state);
        this.restore.state = state;
      };
    }
    function resetTmpl(secret, paths) {
      return paths.map((path2) => {
        const { circle, escPath, leadingBracket } = secret[path2];
        const delim = leadingBracket ? "" : ".";
        const reset = circle ? `o.${circle} = secret[${escPath}].val` : `o${delim}${path2} = secret[${escPath}].val`;
        const clear = `secret[${escPath}].val = undefined`;
        return `
      if (secret[${escPath}].val !== undefined) {
        try { ${reset} } catch (e) {}
        ${clear}
      }
    `;
      }).join("");
    }
    function restoreTmpl(resetters, paths, hasWildcards) {
      const dynamicReset = hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o) {
        if (o.flat === true) this.groupRestore(o)
        else this.nestedRestore(o)
        secret[k] = null
      }
    }
  ` : "";
      return `
    const secret = this.secret
    ${dynamicReset}
    ${resetters}
    return o
  `;
    }
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/state.js
var require_state = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/lib/state.js"(exports, module) {
    "use strict";
    module.exports = state;
    function state(o) {
      const { secret, censor, compileRestore, serialize, groupRedact, nestedRedact, wildcards, wcLen } = o;
      const builder = [
        {
          secret,
          censor,
          compileRestore
        }
      ];
      if (serialize !== false) builder.push({
        serialize
      });
      if (wcLen > 0) builder.push({
        groupRedact,
        nestedRedact,
        wildcards,
        wcLen
      });
      return Object.assign(...builder);
    }
  }
});

// node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/index.js
var require_fast_redact = __commonJS({
  "node_modules/.deno/fast-redact@3.5.0/node_modules/fast-redact/index.js"(exports, module) {
    "use strict";
    var validator = require_validator();
    var parse5 = require_parse();
    var redactor = require_redactor();
    var restorer = require_restorer();
    var { groupRedact, nestedRedact } = require_modifiers();
    var state = require_state();
    var rx = require_rx();
    var validate = validator();
    var noop = (o) => o;
    noop.restore = noop;
    var DEFAULT_CENSOR = "[REDACTED]";
    fastRedact.rx = rx;
    fastRedact.validator = validator;
    module.exports = fastRedact;
    function fastRedact(opts = {}) {
      const paths = Array.from(new Set(opts.paths || []));
      const serialize = "serialize" in opts ? opts.serialize === false ? opts.serialize : typeof opts.serialize === "function" ? opts.serialize : JSON.stringify : JSON.stringify;
      const remove = opts.remove;
      if (remove === true && serialize !== JSON.stringify) {
        throw Error("fast-redact \u2013 remove option may only be set when serializer is JSON.stringify");
      }
      const censor = remove === true ? void 0 : "censor" in opts ? opts.censor : DEFAULT_CENSOR;
      const isCensorFct = typeof censor === "function";
      const censorFctTakesPath = isCensorFct && censor.length > 1;
      if (paths.length === 0) return serialize || noop;
      validate({
        paths,
        serialize,
        censor
      });
      const { wildcards, wcLen, secret } = parse5({
        paths,
        censor
      });
      const compileRestore = restorer();
      const strict = "strict" in opts ? opts.strict : true;
      return redactor({
        secret,
        wcLen,
        serialize,
        strict,
        isCensorFct,
        censorFctTakesPath
      }, state({
        secret,
        censor,
        compileRestore,
        serialize,
        groupRedact,
        nestedRedact,
        wildcards,
        wcLen
      }));
    }
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/symbols.js
var require_symbols = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/symbols.js"(exports, module) {
    "use strict";
    var setLevelSym = Symbol("pino.setLevel");
    var getLevelSym = Symbol("pino.getLevel");
    var levelValSym = Symbol("pino.levelVal");
    var levelCompSym = Symbol("pino.levelComp");
    var useLevelLabelsSym = Symbol("pino.useLevelLabels");
    var useOnlyCustomLevelsSym = Symbol("pino.useOnlyCustomLevels");
    var mixinSym = Symbol("pino.mixin");
    var lsCacheSym = Symbol("pino.lsCache");
    var chindingsSym = Symbol("pino.chindings");
    var asJsonSym = Symbol("pino.asJson");
    var writeSym = Symbol("pino.write");
    var redactFmtSym = Symbol("pino.redactFmt");
    var timeSym = Symbol("pino.time");
    var timeSliceIndexSym = Symbol("pino.timeSliceIndex");
    var streamSym = Symbol("pino.stream");
    var stringifySym = Symbol("pino.stringify");
    var stringifySafeSym = Symbol("pino.stringifySafe");
    var stringifiersSym = Symbol("pino.stringifiers");
    var endSym = Symbol("pino.end");
    var formatOptsSym = Symbol("pino.formatOpts");
    var messageKeySym = Symbol("pino.messageKey");
    var errorKeySym = Symbol("pino.errorKey");
    var nestedKeySym = Symbol("pino.nestedKey");
    var nestedKeyStrSym = Symbol("pino.nestedKeyStr");
    var mixinMergeStrategySym = Symbol("pino.mixinMergeStrategy");
    var msgPrefixSym = Symbol("pino.msgPrefix");
    var wildcardFirstSym = Symbol("pino.wildcardFirst");
    var serializersSym = Symbol.for("pino.serializers");
    var formattersSym = Symbol.for("pino.formatters");
    var hooksSym = Symbol.for("pino.hooks");
    var needsMetadataGsym = Symbol.for("pino.metadata");
    module.exports = {
      setLevelSym,
      getLevelSym,
      levelValSym,
      levelCompSym,
      useLevelLabelsSym,
      mixinSym,
      lsCacheSym,
      chindingsSym,
      asJsonSym,
      writeSym,
      serializersSym,
      redactFmtSym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      stringifySym,
      stringifySafeSym,
      stringifiersSym,
      endSym,
      formatOptsSym,
      messageKeySym,
      errorKeySym,
      nestedKeySym,
      wildcardFirstSym,
      needsMetadataGsym,
      useOnlyCustomLevelsSym,
      formattersSym,
      hooksSym,
      nestedKeyStrSym,
      mixinMergeStrategySym,
      msgPrefixSym
    };
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/redaction.js
var require_redaction = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/redaction.js"(exports, module) {
    "use strict";
    var fastRedact = require_fast_redact();
    var { redactFmtSym, wildcardFirstSym } = require_symbols();
    var { rx, validator } = fastRedact;
    var validate = validator({
      ERR_PATHS_MUST_BE_STRINGS: () => "pino \u2013 redacted paths must be strings",
      ERR_INVALID_PATH: (s) => `pino \u2013 redact paths array contains an invalid path (${s})`
    });
    var CENSOR = "[Redacted]";
    var strict = false;
    function redaction(opts, serialize) {
      const { paths, censor } = handle(opts);
      const shape = paths.reduce((o, str) => {
        rx.lastIndex = 0;
        const first = rx.exec(str);
        const next = rx.exec(str);
        let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
        if (ns === "*") {
          ns = wildcardFirstSym;
        }
        if (next === null) {
          o[ns] = null;
          return o;
        }
        if (o[ns] === null) {
          return o;
        }
        const { index } = next;
        const nextPath = `${str.substr(index, str.length - 1)}`;
        o[ns] = o[ns] || [];
        if (ns !== wildcardFirstSym && o[ns].length === 0) {
          o[ns].push(...o[wildcardFirstSym] || []);
        }
        if (ns === wildcardFirstSym) {
          Object.keys(o).forEach(function(k) {
            if (o[k]) {
              o[k].push(nextPath);
            }
          });
        }
        o[ns].push(nextPath);
        return o;
      }, {});
      const result = {
        [redactFmtSym]: fastRedact({
          paths,
          censor,
          serialize,
          strict
        })
      };
      const topCensor = (...args) => {
        return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
      };
      return [
        ...Object.keys(shape),
        ...Object.getOwnPropertySymbols(shape)
      ].reduce((o, k) => {
        if (shape[k] === null) {
          o[k] = (value) => topCensor(value, [
            k
          ]);
        } else {
          const wrappedCensor = typeof censor === "function" ? (value, path2) => {
            return censor(value, [
              k,
              ...path2
            ]);
          } : censor;
          o[k] = fastRedact({
            paths: shape[k],
            censor: wrappedCensor,
            serialize,
            strict
          });
        }
        return o;
      }, result);
    }
    function handle(opts) {
      if (Array.isArray(opts)) {
        opts = {
          paths: opts,
          censor: CENSOR
        };
        validate(opts);
        return opts;
      }
      let { paths, censor = CENSOR, remove } = opts;
      if (Array.isArray(paths) === false) {
        throw Error("pino \u2013 redact must contain an array of strings");
      }
      if (remove === true) censor = void 0;
      validate({
        paths,
        censor
      });
      return {
        paths,
        censor
      };
    }
    module.exports = redaction;
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/time.js
var require_time = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/time.js"(exports, module) {
    "use strict";
    var nullTime = () => "";
    var epochTime = () => `,"time":${Date.now()}`;
    var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
    var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
    module.exports = {
      nullTime,
      epochTime,
      unixTime,
      isoTime
    };
  }
});

// node_modules/.deno/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = __commonJS({
  "node_modules/.deno/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js"(exports, module) {
    "use strict";
    function tryStringify(o) {
      try {
        return JSON.stringify(o);
      } catch (e) {
        return '"[Circular]"';
      }
    }
    module.exports = format6;
    function format6(f, args, opts) {
      var ss = opts && opts.stringify || tryStringify;
      var offset = 1;
      if (typeof f === "object" && f !== null) {
        var len = args.length + offset;
        if (len === 1) return f;
        var objects = new Array(len);
        objects[0] = ss(f);
        for (var index = 1; index < len; index++) {
          objects[index] = ss(args[index]);
        }
        return objects.join(" ");
      }
      if (typeof f !== "string") {
        return f;
      }
      var argLen = args.length;
      if (argLen === 0) return f;
      var str = "";
      var a = 1 - offset;
      var lastPos = -1;
      var flen = f && f.length || 0;
      for (var i = 0; i < flen; ) {
        if (f.charCodeAt(i) === 37 && i + 1 < flen) {
          lastPos = lastPos > -1 ? lastPos : 0;
          switch (f.charCodeAt(i + 1)) {
            case 100:
            case 102:
              if (a >= argLen) break;
              if (args[a] == null) break;
              if (lastPos < i) str += f.slice(lastPos, i);
              str += Number(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 105:
              if (a >= argLen) break;
              if (args[a] == null) break;
              if (lastPos < i) str += f.slice(lastPos, i);
              str += Math.floor(Number(args[a]));
              lastPos = i + 2;
              i++;
              break;
            case 79:
            case 111:
            case 106:
              if (a >= argLen) break;
              if (args[a] === void 0) break;
              if (lastPos < i) str += f.slice(lastPos, i);
              var type = typeof args[a];
              if (type === "string") {
                str += "'" + args[a] + "'";
                lastPos = i + 2;
                i++;
                break;
              }
              if (type === "function") {
                str += args[a].name || "<anonymous>";
                lastPos = i + 2;
                i++;
                break;
              }
              str += ss(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 115:
              if (a >= argLen) break;
              if (lastPos < i) str += f.slice(lastPos, i);
              str += String(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 37:
              if (lastPos < i) str += f.slice(lastPos, i);
              str += "%";
              lastPos = i + 2;
              i++;
              a--;
              break;
          }
          ++a;
        }
        ++i;
      }
      if (lastPos === -1) return f;
      else if (lastPos < flen) {
        str += f.slice(lastPos);
      }
      return str;
    }
  }
});

// node_modules/.deno/atomic-sleep@1.0.0/node_modules/atomic-sleep/index.js
var require_atomic_sleep = __commonJS({
  "node_modules/.deno/atomic-sleep@1.0.0/node_modules/atomic-sleep/index.js"(exports, module) {
    "use strict";
    if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        Atomics.wait(nil, 0, 0, Number(ms));
      };
      const nil = new Int32Array(new SharedArrayBuffer(4));
      module.exports = sleep;
    } else {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        const target = Date.now() + Number(ms);
        while (target > Date.now()) {
        }
      };
      module.exports = sleep;
    }
  }
});

// node_modules/.deno/sonic-boom@3.8.1/node_modules/sonic-boom/index.js
var require_sonic_boom = __commonJS({
  "node_modules/.deno/sonic-boom@3.8.1/node_modules/sonic-boom/index.js"(exports, module) {
    "use strict";
    var fs2 = __require("node:fs");
    var EventEmitter = __require("node:events");
    var inherits = __require("node:util").inherits;
    var path2 = __require("node:path");
    var sleep = require_atomic_sleep();
    var BUSY_WRITE_TIMEOUT = 100;
    var kEmptyBuffer = Buffer.allocUnsafe(0);
    var MAX_WRITE = 16 * 1024;
    var kContentModeBuffer = "buffer";
    var kContentModeUtf8 = "utf8";
    function openFile(file, sonic) {
      sonic._opening = true;
      sonic._writing = true;
      sonic._asyncDrainScheduled = false;
      function fileOpened(err, fd) {
        if (err) {
          sonic._reopening = false;
          sonic._writing = false;
          sonic._opening = false;
          if (sonic.sync) {
            process.nextTick(() => {
              if (sonic.listenerCount("error") > 0) {
                sonic.emit("error", err);
              }
            });
          } else {
            sonic.emit("error", err);
          }
          return;
        }
        const reopening = sonic._reopening;
        sonic.fd = fd;
        sonic.file = file;
        sonic._reopening = false;
        sonic._opening = false;
        sonic._writing = false;
        if (sonic.sync) {
          process.nextTick(() => sonic.emit("ready"));
        } else {
          sonic.emit("ready");
        }
        if (sonic.destroyed) {
          return;
        }
        if (!sonic._writing && sonic._len > sonic.minLength || sonic._flushPending) {
          sonic._actualWrite();
        } else if (reopening) {
          process.nextTick(() => sonic.emit("drain"));
        }
      }
      const flags = sonic.append ? "a" : "w";
      const mode = sonic.mode;
      if (sonic.sync) {
        try {
          if (sonic.mkdir) fs2.mkdirSync(path2.dirname(file), {
            recursive: true
          });
          const fd = fs2.openSync(file, flags, mode);
          fileOpened(null, fd);
        } catch (err) {
          fileOpened(err);
          throw err;
        }
      } else if (sonic.mkdir) {
        fs2.mkdir(path2.dirname(file), {
          recursive: true
        }, (err) => {
          if (err) return fileOpened(err);
          fs2.open(file, flags, mode, fileOpened);
        });
      } else {
        fs2.open(file, flags, mode, fileOpened);
      }
    }
    function SonicBoom(opts) {
      if (!(this instanceof SonicBoom)) {
        return new SonicBoom(opts);
      }
      let { fd, dest, minLength, maxLength, maxWrite, sync, append = true, mkdir: mkdir3, retryEAGAIN, fsync, contentMode, mode } = opts || {};
      fd = fd || dest;
      this._len = 0;
      this.fd = -1;
      this._bufs = [];
      this._lens = [];
      this._writing = false;
      this._ending = false;
      this._reopening = false;
      this._asyncDrainScheduled = false;
      this._flushPending = false;
      this._hwm = Math.max(minLength || 0, 16387);
      this.file = null;
      this.destroyed = false;
      this.minLength = minLength || 0;
      this.maxLength = maxLength || 0;
      this.maxWrite = maxWrite || MAX_WRITE;
      this.sync = sync || false;
      this.writable = true;
      this._fsync = fsync || false;
      this.append = append || false;
      this.mode = mode;
      this.retryEAGAIN = retryEAGAIN || (() => true);
      this.mkdir = mkdir3 || false;
      let fsWriteSync;
      let fsWrite;
      if (contentMode === kContentModeBuffer) {
        this._writingBuf = kEmptyBuffer;
        this.write = writeBuffer;
        this.flush = flushBuffer;
        this.flushSync = flushBufferSync;
        this._actualWrite = actualWriteBuffer;
        fsWriteSync = () => fs2.writeSync(this.fd, this._writingBuf);
        fsWrite = () => fs2.write(this.fd, this._writingBuf, this.release);
      } else if (contentMode === void 0 || contentMode === kContentModeUtf8) {
        this._writingBuf = "";
        this.write = write;
        this.flush = flush;
        this.flushSync = flushSync;
        this._actualWrite = actualWrite;
        fsWriteSync = () => fs2.writeSync(this.fd, this._writingBuf, "utf8");
        fsWrite = () => fs2.write(this.fd, this._writingBuf, "utf8", this.release);
      } else {
        throw new Error(`SonicBoom supports "${kContentModeUtf8}" and "${kContentModeBuffer}", but passed ${contentMode}`);
      }
      if (typeof fd === "number") {
        this.fd = fd;
        process.nextTick(() => this.emit("ready"));
      } else if (typeof fd === "string") {
        openFile(fd, this);
      } else {
        throw new Error("SonicBoom supports only file descriptors and files");
      }
      if (this.minLength >= this.maxWrite) {
        throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`);
      }
      this.release = (err, n) => {
        if (err) {
          if ((err.code === "EAGAIN" || err.code === "EBUSY") && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) {
            if (this.sync) {
              try {
                sleep(BUSY_WRITE_TIMEOUT);
                this.release(void 0, 0);
              } catch (err2) {
                this.release(err2);
              }
            } else {
              setTimeout(fsWrite, BUSY_WRITE_TIMEOUT);
            }
          } else {
            this._writing = false;
            this.emit("error", err);
          }
          return;
        }
        this.emit("write", n);
        const releasedBufObj = releaseWritingBuf(this._writingBuf, this._len, n);
        this._len = releasedBufObj.len;
        this._writingBuf = releasedBufObj.writingBuf;
        if (this._writingBuf.length) {
          if (!this.sync) {
            fsWrite();
            return;
          }
          try {
            do {
              const n2 = fsWriteSync();
              const releasedBufObj2 = releaseWritingBuf(this._writingBuf, this._len, n2);
              this._len = releasedBufObj2.len;
              this._writingBuf = releasedBufObj2.writingBuf;
            } while (this._writingBuf.length);
          } catch (err2) {
            this.release(err2);
            return;
          }
        }
        if (this._fsync) {
          fs2.fsyncSync(this.fd);
        }
        const len = this._len;
        if (this._reopening) {
          this._writing = false;
          this._reopening = false;
          this.reopen();
        } else if (len > this.minLength) {
          this._actualWrite();
        } else if (this._ending) {
          if (len > 0) {
            this._actualWrite();
          } else {
            this._writing = false;
            actualClose(this);
          }
        } else {
          this._writing = false;
          if (this.sync) {
            if (!this._asyncDrainScheduled) {
              this._asyncDrainScheduled = true;
              process.nextTick(emitDrain, this);
            }
          } else {
            this.emit("drain");
          }
        }
      };
      this.on("newListener", function(name) {
        if (name === "drain") {
          this._asyncDrainScheduled = false;
        }
      });
    }
    function releaseWritingBuf(writingBuf, len, n) {
      if (typeof writingBuf === "string" && Buffer.byteLength(writingBuf) !== n) {
        n = Buffer.from(writingBuf).subarray(0, n).toString().length;
      }
      len = Math.max(len - n, 0);
      writingBuf = writingBuf.slice(n);
      return {
        writingBuf,
        len
      };
    }
    function emitDrain(sonic) {
      const hasListeners = sonic.listenerCount("drain") > 0;
      if (!hasListeners) return;
      sonic._asyncDrainScheduled = false;
      sonic.emit("drain");
    }
    inherits(SonicBoom, EventEmitter);
    function mergeBuf(bufs, len) {
      if (bufs.length === 0) {
        return kEmptyBuffer;
      }
      if (bufs.length === 1) {
        return bufs[0];
      }
      return Buffer.concat(bufs, len);
    }
    function write(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      const len = this._len + data.length;
      const bufs = this._bufs;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || bufs[bufs.length - 1].length + data.length > this.maxWrite) {
        bufs.push("" + data);
      } else {
        bufs[bufs.length - 1] += data;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function writeBuffer(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      const len = this._len + data.length;
      const bufs = this._bufs;
      const lens = this._lens;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || lens[lens.length - 1] + data.length > this.maxWrite) {
        bufs.push([
          data
        ]);
        lens.push(data.length);
      } else {
        bufs[bufs.length - 1].push(data);
        lens[lens.length - 1] += data.length;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function callFlushCallbackOnDrain(cb) {
      this._flushPending = true;
      const onDrain = () => {
        if (!this._fsync) {
          fs2.fsync(this.fd, (err) => {
            this._flushPending = false;
            cb(err);
          });
        } else {
          this._flushPending = false;
          cb();
        }
        this.off("error", onError);
      };
      const onError = (err) => {
        this._flushPending = false;
        cb(err);
        this.off("drain", onDrain);
      };
      this.once("drain", onDrain);
      this.once("error", onError);
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push("");
      }
      this._actualWrite();
    }
    function flushBuffer(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push([]);
        this._lens.push(0);
      }
      this._actualWrite();
    }
    SonicBoom.prototype.reopen = function(file) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.reopen(file);
        });
        return;
      }
      if (this._ending) {
        return;
      }
      if (!this.file) {
        throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
      }
      if (file) {
        this.file = file;
      }
      this._reopening = true;
      if (this._writing) {
        return;
      }
      const fd = this.fd;
      this.once("ready", () => {
        if (fd !== this.fd) {
          fs2.close(fd, (err) => {
            if (err) {
              return this.emit("error", err);
            }
          });
        }
      });
      openFile(this.file, this);
    };
    SonicBoom.prototype.end = function() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.end();
        });
        return;
      }
      if (this._ending) {
        return;
      }
      this._ending = true;
      if (this._writing) {
        return;
      }
      if (this._len > 0 && this.fd >= 0) {
        this._actualWrite();
      } else {
        actualClose(this);
      }
    };
    function flushSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift(this._writingBuf);
        this._writingBuf = "";
      }
      let buf2 = "";
      while (this._bufs.length || buf2) {
        if (buf2.length <= 0) {
          buf2 = this._bufs[0];
        }
        try {
          const n = fs2.writeSync(this.fd, buf2, "utf8");
          const releasedBufObj = releaseWritingBuf(buf2, this._len, n);
          buf2 = releasedBufObj.writingBuf;
          this._len = releasedBufObj.len;
          if (buf2.length <= 0) {
            this._bufs.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf2.length, this._len - buf2.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
      try {
        fs2.fsyncSync(this.fd);
      } catch {
      }
    }
    function flushBufferSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift([
          this._writingBuf
        ]);
        this._writingBuf = kEmptyBuffer;
      }
      let buf2 = kEmptyBuffer;
      while (this._bufs.length || buf2.length) {
        if (buf2.length <= 0) {
          buf2 = mergeBuf(this._bufs[0], this._lens[0]);
        }
        try {
          const n = fs2.writeSync(this.fd, buf2);
          buf2 = buf2.subarray(n);
          this._len = Math.max(this._len - n, 0);
          if (buf2.length <= 0) {
            this._bufs.shift();
            this._lens.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf2.length, this._len - buf2.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
    }
    SonicBoom.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      actualClose(this);
    };
    function actualWrite() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf || this._bufs.shift() || "";
      if (this.sync) {
        try {
          const written = fs2.writeSync(this.fd, this._writingBuf, "utf8");
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        fs2.write(this.fd, this._writingBuf, "utf8", release);
      }
    }
    function actualWriteBuffer() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf.length ? this._writingBuf : mergeBuf(this._bufs.shift(), this._lens.shift());
      if (this.sync) {
        try {
          const written = fs2.writeSync(this.fd, this._writingBuf);
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        fs2.write(this.fd, this._writingBuf, release);
      }
    }
    function actualClose(sonic) {
      if (sonic.fd === -1) {
        sonic.once("ready", actualClose.bind(null, sonic));
        return;
      }
      sonic.destroyed = true;
      sonic._bufs = [];
      sonic._lens = [];
      fs2.fsync(sonic.fd, closeWrapped);
      function closeWrapped() {
        if (sonic.fd !== 1 && sonic.fd !== 2) {
          fs2.close(sonic.fd, done);
        } else {
          done();
        }
      }
      function done(err) {
        if (err) {
          sonic.emit("error", err);
          return;
        }
        if (sonic._ending && !sonic._writing) {
          sonic.emit("finish");
        }
        sonic.emit("close");
      }
    }
    SonicBoom.SonicBoom = SonicBoom;
    SonicBoom.default = SonicBoom;
    module.exports = SonicBoom;
  }
});

// node_modules/.deno/on-exit-leak-free@2.1.2/node_modules/on-exit-leak-free/index.js
var require_on_exit_leak_free = __commonJS({
  "node_modules/.deno/on-exit-leak-free@2.1.2/node_modules/on-exit-leak-free/index.js"(exports, module) {
    "use strict";
    var refs = {
      exit: [],
      beforeExit: []
    };
    var functions = {
      exit: onExit,
      beforeExit: onBeforeExit
    };
    var registry;
    function ensureRegistry() {
      if (registry === void 0) {
        registry = new FinalizationRegistry(clear);
      }
    }
    function install(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.on(event, functions[event]);
    }
    function uninstall(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.removeListener(event, functions[event]);
      if (refs.exit.length === 0 && refs.beforeExit.length === 0) {
        registry = void 0;
      }
    }
    function onExit() {
      callRefs("exit");
    }
    function onBeforeExit() {
      callRefs("beforeExit");
    }
    function callRefs(event) {
      for (const ref of refs[event]) {
        const obj = ref.deref();
        const fn = ref.fn;
        if (obj !== void 0) {
          fn(obj, event);
        }
      }
      refs[event] = [];
    }
    function clear(ref) {
      for (const event of [
        "exit",
        "beforeExit"
      ]) {
        const index = refs[event].indexOf(ref);
        refs[event].splice(index, index + 1);
        uninstall(event);
      }
    }
    function _register(event, obj, fn) {
      if (obj === void 0) {
        throw new Error("the object can't be undefined");
      }
      install(event);
      const ref = new WeakRef(obj);
      ref.fn = fn;
      ensureRegistry();
      registry.register(obj, ref);
      refs[event].push(ref);
    }
    function register(obj, fn) {
      _register("exit", obj, fn);
    }
    function registerBeforeExit(obj, fn) {
      _register("beforeExit", obj, fn);
    }
    function unregister(obj) {
      if (registry === void 0) {
        return;
      }
      registry.unregister(obj);
      for (const event of [
        "exit",
        "beforeExit"
      ]) {
        refs[event] = refs[event].filter((ref) => {
          const _obj = ref.deref();
          return _obj && _obj !== obj;
        });
        uninstall(event);
      }
    }
    module.exports = {
      register,
      registerBeforeExit,
      unregister
    };
  }
});

// node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/package.json
var require_package = __commonJS({
  "node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/package.json"(exports, module) {
    module.exports = {
      name: "thread-stream",
      version: "2.7.0",
      description: "A streaming way to send data to a Node.js Worker Thread",
      main: "index.js",
      types: "index.d.ts",
      dependencies: {
        "real-require": "^0.2.0"
      },
      devDependencies: {
        "@types/node": "^20.1.0",
        "@types/tap": "^15.0.0",
        "@yao-pkg/pkg": "^5.11.5",
        desm: "^1.3.0",
        fastbench: "^1.0.1",
        husky: "^9.0.6",
        "pino-elasticsearch": "^8.0.0",
        "sonic-boom": "^3.0.0",
        standard: "^17.0.0",
        tap: "^16.2.0",
        "ts-node": "^10.8.0",
        typescript: "^5.3.2",
        "why-is-node-running": "^2.2.2"
      },
      scripts: {
        test: 'standard && npm run transpile && tap "test/**/*.test.*js" && tap --ts test/*.test.*ts',
        "test:ci": "standard && npm run transpile && npm run test:ci:js && npm run test:ci:ts",
        "test:ci:js": 'tap --no-check-coverage --timeout=120 --coverage-report=lcovonly "test/**/*.test.*js"',
        "test:ci:ts": 'tap --ts --no-check-coverage --coverage-report=lcovonly "test/**/*.test.*ts"',
        "test:yarn": 'npm run transpile && tap "test/**/*.test.js" --no-check-coverage',
        transpile: "sh ./test/ts/transpile.sh",
        prepare: "husky install"
      },
      standard: {
        ignore: [
          "test/ts/**/*"
        ]
      },
      repository: {
        type: "git",
        url: "git+https://github.com/mcollina/thread-stream.git"
      },
      keywords: [
        "worker",
        "thread",
        "threads",
        "stream"
      ],
      author: "Matteo Collina <hello@matteocollina.com>",
      license: "MIT",
      bugs: {
        url: "https://github.com/mcollina/thread-stream/issues"
      },
      homepage: "https://github.com/mcollina/thread-stream#readme"
    };
  }
});

// node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/lib/wait.js
var require_wait2 = __commonJS({
  "node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/lib/wait.js"(exports, module) {
    "use strict";
    var MAX_TIMEOUT = 1e3;
    function wait(state, index, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index);
      if (current === expected) {
        done(null, "ok");
        return;
      }
      let prior = current;
      const check = (backoff) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            prior = current;
            current = Atomics.load(state, index);
            if (current === prior) {
              check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
            } else {
              if (current === expected) done(null, "ok");
              else done(null, "not-equal");
            }
          }, backoff);
        }
      };
      check(1);
    }
    function waitDiff(state, index, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index);
      if (current !== expected) {
        done(null, "ok");
        return;
      }
      const check = (backoff) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            current = Atomics.load(state, index);
            if (current !== expected) {
              done(null, "ok");
            } else {
              check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
            }
          }, backoff);
        }
      };
      check(1);
    }
    module.exports = {
      wait,
      waitDiff
    };
  }
});

// node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/lib/indexes.js
var require_indexes = __commonJS({
  "node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/lib/indexes.js"(exports, module) {
    "use strict";
    var WRITE_INDEX = 4;
    var READ_INDEX = 8;
    module.exports = {
      WRITE_INDEX,
      READ_INDEX
    };
  }
});

// node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/index.js
var require_thread_stream = __commonJS({
  "node_modules/.deno/thread-stream@2.7.0/node_modules/thread-stream/index.js"(exports, module) {
    "use strict";
    var { version } = require_package();
    var { EventEmitter } = __require("node:events");
    var { Worker } = __require("node:worker_threads");
    var { join: join7 } = __require("node:path");
    var { pathToFileURL } = __require("node:url");
    var { wait } = require_wait2();
    var { WRITE_INDEX, READ_INDEX } = require_indexes();
    var buffer = __require("node:buffer");
    var assert2 = __require("node:assert");
    var kImpl = Symbol("kImpl");
    var MAX_STRING = buffer.constants.MAX_STRING_LENGTH;
    var FakeWeakRef = class {
      constructor(value) {
        this._value = value;
      }
      deref() {
        return this._value;
      }
    };
    var FakeFinalizationRegistry = class {
      register() {
      }
      unregister() {
      }
    };
    var FinalizationRegistry2 = process.env.NODE_V8_COVERAGE ? FakeFinalizationRegistry : global.FinalizationRegistry || FakeFinalizationRegistry;
    var WeakRef2 = process.env.NODE_V8_COVERAGE ? FakeWeakRef : global.WeakRef || FakeWeakRef;
    var registry = new FinalizationRegistry2((worker) => {
      if (worker.exited) {
        return;
      }
      worker.terminate();
    });
    function createWorker(stream, opts) {
      const { filename, workerData } = opts;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      const toExecute = bundlerOverrides["thread-stream-worker"] || join7(__dirname, "lib", "worker.js");
      const worker = new Worker(toExecute, {
        ...opts.workerOpts,
        trackUnmanagedFds: false,
        workerData: {
          filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
          dataBuf: stream[kImpl].dataBuf,
          stateBuf: stream[kImpl].stateBuf,
          workerData: {
            $context: {
              threadStreamVersion: version
            },
            ...workerData
          }
        }
      });
      worker.stream = new FakeWeakRef(stream);
      worker.on("message", onWorkerMessage);
      worker.on("exit", onWorkerExit);
      registry.register(stream, worker);
      return worker;
    }
    function drain(stream) {
      assert2(!stream[kImpl].sync);
      if (stream[kImpl].needDrain) {
        stream[kImpl].needDrain = false;
        stream.emit("drain");
      }
    }
    function nextFlush(stream) {
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let leftover = stream[kImpl].data.length - writeIndex;
      if (leftover > 0) {
        if (stream[kImpl].buf.length === 0) {
          stream[kImpl].flushing = false;
          if (stream[kImpl].ending) {
            end(stream);
          } else if (stream[kImpl].needDrain) {
            process.nextTick(drain, stream);
          }
          return;
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, nextFlush.bind(null, stream));
        } else {
          stream.flush(() => {
            if (stream.destroyed) {
              return;
            }
            Atomics.store(stream[kImpl].state, READ_INDEX, 0);
            Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
            while (toWriteBytes > stream[kImpl].data.length) {
              leftover = leftover / 2;
              toWrite = stream[kImpl].buf.slice(0, leftover);
              toWriteBytes = Buffer.byteLength(toWrite);
            }
            stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
            write(stream, toWrite, nextFlush.bind(null, stream));
          });
        }
      } else if (leftover === 0) {
        if (writeIndex === 0 && stream[kImpl].buf.length === 0) {
          return;
        }
        stream.flush(() => {
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          nextFlush(stream);
        });
      } else {
        destroy(stream, new Error("overwritten"));
      }
    }
    function onWorkerMessage(msg) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        this.exited = true;
        this.terminate();
        return;
      }
      switch (msg.code) {
        case "READY":
          this.stream = new WeakRef2(stream);
          stream.flush(() => {
            stream[kImpl].ready = true;
            stream.emit("ready");
          });
          break;
        case "ERROR":
          destroy(stream, msg.err);
          break;
        case "EVENT":
          if (Array.isArray(msg.args)) {
            stream.emit(msg.name, ...msg.args);
          } else {
            stream.emit(msg.name, msg.args);
          }
          break;
        case "WARNING":
          process.emitWarning(msg.err);
          break;
        default:
          destroy(stream, new Error("this should not happen: " + msg.code));
      }
    }
    function onWorkerExit(code2) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        return;
      }
      registry.unregister(stream);
      stream.worker.exited = true;
      stream.worker.off("exit", onWorkerExit);
      destroy(stream, code2 !== 0 ? new Error("the worker thread exited") : null);
    }
    var ThreadStream = class extends EventEmitter {
      constructor(opts = {}) {
        super();
        if (opts.bufferSize < 4) {
          throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
        }
        this[kImpl] = {};
        this[kImpl].stateBuf = new SharedArrayBuffer(128);
        this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
        this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
        this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
        this[kImpl].sync = opts.sync || false;
        this[kImpl].ending = false;
        this[kImpl].ended = false;
        this[kImpl].needDrain = false;
        this[kImpl].destroyed = false;
        this[kImpl].flushing = false;
        this[kImpl].ready = false;
        this[kImpl].finished = false;
        this[kImpl].errored = null;
        this[kImpl].closed = false;
        this[kImpl].buf = "";
        this.worker = createWorker(this, opts);
        this.on("message", (message, transferList) => {
          this.worker.postMessage(message, transferList);
        });
      }
      write(data) {
        if (this[kImpl].destroyed) {
          error(this, new Error("the worker has exited"));
          return false;
        }
        if (this[kImpl].ending) {
          error(this, new Error("the worker is ending"));
          return false;
        }
        if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) {
          try {
            writeSync(this);
            this[kImpl].flushing = true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        this[kImpl].buf += data;
        if (this[kImpl].sync) {
          try {
            writeSync(this);
            return true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        if (!this[kImpl].flushing) {
          this[kImpl].flushing = true;
          setImmediate(nextFlush, this);
        }
        this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
        return !this[kImpl].needDrain;
      }
      end() {
        if (this[kImpl].destroyed) {
          return;
        }
        this[kImpl].ending = true;
        end(this);
      }
      flush(cb) {
        if (this[kImpl].destroyed) {
          if (typeof cb === "function") {
            process.nextTick(cb, new Error("the worker has exited"));
          }
          return;
        }
        const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX);
        wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
          if (err) {
            destroy(this, err);
            process.nextTick(cb, err);
            return;
          }
          if (res === "not-equal") {
            this.flush(cb);
            return;
          }
          process.nextTick(cb);
        });
      }
      flushSync() {
        if (this[kImpl].destroyed) {
          return;
        }
        writeSync(this);
        flushSync(this);
      }
      unref() {
        this.worker.unref();
      }
      ref() {
        this.worker.ref();
      }
      get ready() {
        return this[kImpl].ready;
      }
      get destroyed() {
        return this[kImpl].destroyed;
      }
      get closed() {
        return this[kImpl].closed;
      }
      get writable() {
        return !this[kImpl].destroyed && !this[kImpl].ending;
      }
      get writableEnded() {
        return this[kImpl].ending;
      }
      get writableFinished() {
        return this[kImpl].finished;
      }
      get writableNeedDrain() {
        return this[kImpl].needDrain;
      }
      get writableObjectMode() {
        return false;
      }
      get writableErrored() {
        return this[kImpl].errored;
      }
    };
    function error(stream, err) {
      setImmediate(() => {
        stream.emit("error", err);
      });
    }
    function destroy(stream, err) {
      if (stream[kImpl].destroyed) {
        return;
      }
      stream[kImpl].destroyed = true;
      if (err) {
        stream[kImpl].errored = err;
        error(stream, err);
      }
      if (!stream.worker.exited) {
        stream.worker.terminate().catch(() => {
        }).then(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      } else {
        setImmediate(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      }
    }
    function write(stream, data, cb) {
      const current = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      const length2 = Buffer.byteLength(data);
      stream[kImpl].data.write(data, current);
      Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length2);
      Atomics.notify(stream[kImpl].state, WRITE_INDEX);
      cb();
      return true;
    }
    function end(stream) {
      if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) {
        return;
      }
      stream[kImpl].ended = true;
      try {
        stream.flushSync();
        let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
        Atomics.notify(stream[kImpl].state, WRITE_INDEX);
        let spins = 0;
        while (readIndex !== -1) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
          readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
          if (readIndex === -2) {
            destroy(stream, new Error("end() failed"));
            return;
          }
          if (++spins === 10) {
            destroy(stream, new Error("end() took too long (10s)"));
            return;
          }
        }
        process.nextTick(() => {
          stream[kImpl].finished = true;
          stream.emit("finish");
        });
      } catch (err) {
        destroy(stream, err);
      }
    }
    function writeSync(stream) {
      const cb = () => {
        if (stream[kImpl].ending) {
          end(stream);
        } else if (stream[kImpl].needDrain) {
          process.nextTick(drain, stream);
        }
      };
      stream[kImpl].flushing = false;
      while (stream[kImpl].buf.length !== 0) {
        const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
        let leftover = stream[kImpl].data.length - writeIndex;
        if (leftover === 0) {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          continue;
        } else if (leftover < 0) {
          throw new Error("overwritten");
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        } else {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          while (toWriteBytes > stream[kImpl].buf.length) {
            leftover = leftover / 2;
            toWrite = stream[kImpl].buf.slice(0, leftover);
            toWriteBytes = Buffer.byteLength(toWrite);
          }
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        }
      }
    }
    function flushSync(stream) {
      if (stream[kImpl].flushing) {
        throw new Error("unable to flush while flushing");
      }
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let spins = 0;
      while (true) {
        const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        if (readIndex === -2) {
          throw Error("_flushSync failed");
        }
        if (readIndex !== writeIndex) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
        } else {
          break;
        }
        if (++spins === 10) {
          throw new Error("_flushSync took too long (10s)");
        }
      }
    }
    module.exports = ThreadStream;
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/transport.js
var require_transport = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/transport.js"(exports, module) {
    "use strict";
    var { createRequire } = __require("node:module");
    var getCallers = require_caller();
    var { join: join7, isAbsolute: isAbsolute6, sep } = __require("node:path");
    var sleep = require_atomic_sleep();
    var onExit = require_on_exit_leak_free();
    var ThreadStream = require_thread_stream();
    function setupOnExit(stream) {
      onExit.register(stream, autoEnd);
      onExit.registerBeforeExit(stream, flush);
      stream.on("close", function() {
        onExit.unregister(stream);
      });
    }
    function buildStream(filename, workerData, workerOpts) {
      const stream = new ThreadStream({
        filename,
        workerData,
        workerOpts
      });
      stream.on("ready", onReady);
      stream.on("close", function() {
        process.removeListener("exit", onExit2);
      });
      process.on("exit", onExit2);
      function onReady() {
        process.removeListener("exit", onExit2);
        stream.unref();
        if (workerOpts.autoEnd !== false) {
          setupOnExit(stream);
        }
      }
      function onExit2() {
        if (stream.closed) {
          return;
        }
        stream.flushSync();
        sleep(100);
        stream.end();
      }
      return stream;
    }
    function autoEnd(stream) {
      stream.ref();
      stream.flushSync();
      stream.end();
      stream.once("close", function() {
        stream.unref();
      });
    }
    function flush(stream) {
      stream.flushSync();
    }
    function transport(fullOptions) {
      const { pipeline, targets, levels, dedupe, options: options2 = {}, worker = {}, caller = getCallers() } = fullOptions;
      const callers = typeof caller === "string" ? [
        caller
      ] : caller;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      let target = fullOptions.target;
      if (target && targets) {
        throw new Error("only one of target or targets can be specified");
      }
      if (targets) {
        target = bundlerOverrides["pino-worker"] || join7(__dirname, "worker.js");
        options2.targets = targets.map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        });
      } else if (pipeline) {
        target = bundlerOverrides["pino-pipeline-worker"] || join7(__dirname, "worker-pipeline.js");
        options2.targets = pipeline.map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        });
      }
      if (levels) {
        options2.levels = levels;
      }
      if (dedupe) {
        options2.dedupe = dedupe;
      }
      return buildStream(fixTarget(target), options2, worker);
      function fixTarget(origin) {
        origin = bundlerOverrides[origin] || origin;
        if (isAbsolute6(origin) || origin.indexOf("file://") === 0) {
          return origin;
        }
        if (origin === "pino/file") {
          return join7(__dirname, "..", "file.js");
        }
        let fixTarget2;
        for (const filePath of callers) {
          try {
            const context = filePath === "node:repl" ? process.cwd() + sep : filePath;
            fixTarget2 = createRequire(context).resolve(origin);
            break;
          } catch (err) {
            continue;
          }
        }
        if (!fixTarget2) {
          throw new Error(`unable to determine transport target for "${origin}"`);
        }
        return fixTarget2;
      }
    }
    module.exports = transport;
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/tools.js
var require_tools = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/tools.js"(exports, module) {
    "use strict";
    var format6 = require_quick_format_unescaped();
    var { mapHttpRequest, mapHttpResponse } = require_pino_std_serializers();
    var SonicBoom = require_sonic_boom();
    var onExit = require_on_exit_leak_free();
    var { lsCacheSym, chindingsSym, writeSym, serializersSym, formatOptsSym, endSym, stringifiersSym, stringifySym, stringifySafeSym, wildcardFirstSym, nestedKeySym, formattersSym, messageKeySym, errorKeySym, nestedKeyStrSym, msgPrefixSym } = require_symbols();
    var { isMainThread } = __require("node:worker_threads");
    var transport = require_transport();
    function noop() {
    }
    function genLog(level, hook) {
      if (!hook) return LOG;
      return function hookWrappedLog(...args) {
        hook.call(this, args, LOG, level);
      };
      function LOG(o, ...n) {
        if (typeof o === "object") {
          let msg = o;
          if (o !== null) {
            if (o.method && o.headers && o.socket) {
              o = mapHttpRequest(o);
            } else if (typeof o.setHeader === "function") {
              o = mapHttpResponse(o);
            }
          }
          let formatParams;
          if (msg === null && n.length === 0) {
            formatParams = [
              null
            ];
          } else {
            msg = n.shift();
            formatParams = n;
          }
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](o, format6(msg, formatParams, this[formatOptsSym]), level);
        } else {
          let msg = o === void 0 ? n.shift() : o;
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](null, format6(msg, n, this[formatOptsSym]), level);
        }
      }
    }
    function asString(str) {
      let result = "";
      let last = 0;
      let found = false;
      let point = 255;
      const l = str.length;
      if (l > 100) {
        return JSON.stringify(str);
      }
      for (var i = 0; i < l && point >= 32; i++) {
        point = str.charCodeAt(i);
        if (point === 34 || point === 92) {
          result += str.slice(last, i) + "\\";
          last = i;
          found = true;
        }
      }
      if (!found) {
        result = str;
      } else {
        result += str.slice(last);
      }
      return point < 32 ? JSON.stringify(str) : '"' + result + '"';
    }
    function asJson(obj, msg, num, time) {
      const stringify2 = this[stringifySym];
      const stringifySafe = this[stringifySafeSym];
      const stringifiers = this[stringifiersSym];
      const end = this[endSym];
      const chindings = this[chindingsSym];
      const serializers = this[serializersSym];
      const formatters = this[formattersSym];
      const messageKey = this[messageKeySym];
      const errorKey = this[errorKeySym];
      let data = this[lsCacheSym][num] + time;
      data = data + chindings;
      let value;
      if (formatters.log) {
        obj = formatters.log(obj);
      }
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      let propStr = "";
      for (const key in obj) {
        value = obj[key];
        if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
          if (serializers[key]) {
            value = serializers[key](value);
          } else if (key === errorKey && serializers.err) {
            value = serializers.err(value);
          }
          const stringifier = stringifiers[key] || wildcardStringifier;
          switch (typeof value) {
            case "undefined":
            case "function":
              continue;
            case "number":
              if (Number.isFinite(value) === false) {
                value = null;
              }
            // this case explicitly falls through to the next one
            case "boolean":
              if (stringifier) value = stringifier(value);
              break;
            case "string":
              value = (stringifier || asString)(value);
              break;
            default:
              value = (stringifier || stringify2)(value, stringifySafe);
          }
          if (value === void 0) continue;
          const strKey = asString(key);
          propStr += "," + strKey + ":" + value;
        }
      }
      let msgStr = "";
      if (msg !== void 0) {
        value = serializers[messageKey] ? serializers[messageKey](msg) : msg;
        const stringifier = stringifiers[messageKey] || wildcardStringifier;
        switch (typeof value) {
          case "function":
            break;
          case "number":
            if (Number.isFinite(value) === false) {
              value = null;
            }
          // this case explicitly falls through to the next one
          case "boolean":
            if (stringifier) value = stringifier(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          case "string":
            value = (stringifier || asString)(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          default:
            value = (stringifier || stringify2)(value, stringifySafe);
            msgStr = ',"' + messageKey + '":' + value;
        }
      }
      if (this[nestedKeySym] && propStr) {
        return data + this[nestedKeyStrSym] + propStr.slice(1) + "}" + msgStr + end;
      } else {
        return data + propStr + msgStr + end;
      }
    }
    function asChindings(instance, bindings) {
      let value;
      let data = instance[chindingsSym];
      const stringify2 = instance[stringifySym];
      const stringifySafe = instance[stringifySafeSym];
      const stringifiers = instance[stringifiersSym];
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      const serializers = instance[serializersSym];
      const formatter = instance[formattersSym].bindings;
      bindings = formatter(bindings);
      for (const key in bindings) {
        value = bindings[key];
        const valid = key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels" && bindings.hasOwnProperty(key) && value !== void 0;
        if (valid === true) {
          value = serializers[key] ? serializers[key](value) : value;
          value = (stringifiers[key] || wildcardStringifier || stringify2)(value, stringifySafe);
          if (value === void 0) continue;
          data += ',"' + key + '":' + value;
        }
      }
      return data;
    }
    function hasBeenTampered(stream) {
      return stream.write !== stream.constructor.prototype.write;
    }
    var hasNodeCodeCoverage = process.env.NODE_V8_COVERAGE || process.env.V8_COVERAGE;
    function buildSafeSonicBoom(opts) {
      const stream = new SonicBoom(opts);
      stream.on("error", filterBrokenPipe);
      if (!hasNodeCodeCoverage && !opts.sync && isMainThread) {
        onExit.register(stream, autoEnd);
        stream.on("close", function() {
          onExit.unregister(stream);
        });
      }
      return stream;
      function filterBrokenPipe(err) {
        if (err.code === "EPIPE") {
          stream.write = noop;
          stream.end = noop;
          stream.flushSync = noop;
          stream.destroy = noop;
          return;
        }
        stream.removeListener("error", filterBrokenPipe);
        stream.emit("error", err);
      }
    }
    function autoEnd(stream, eventName) {
      if (stream.destroyed) {
        return;
      }
      if (eventName === "beforeExit") {
        stream.flush();
        stream.on("drain", function() {
          stream.end();
        });
      } else {
        stream.flushSync();
      }
    }
    function createArgsNormalizer(defaultOptions) {
      return function normalizeArgs(instance, caller, opts = {}, stream) {
        if (typeof opts === "string") {
          stream = buildSafeSonicBoom({
            dest: opts
          });
          opts = {};
        } else if (typeof stream === "string") {
          if (opts && opts.transport) {
            throw Error("only one of option.transport or stream can be specified");
          }
          stream = buildSafeSonicBoom({
            dest: stream
          });
        } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
          stream = opts;
          opts = {};
        } else if (opts.transport) {
          if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) {
            throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
          }
          if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") {
            throw Error("option.transport.targets do not allow custom level formatters");
          }
          let customLevels;
          if (opts.customLevels) {
            customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
          }
          stream = transport({
            caller,
            ...opts.transport,
            levels: customLevels
          });
        }
        opts = Object.assign({}, defaultOptions, opts);
        opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers);
        opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters);
        if (opts.prettyPrint) {
          throw new Error("prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)");
        }
        const { enabled: enabled2, onChild } = opts;
        if (enabled2 === false) opts.level = "silent";
        if (!onChild) opts.onChild = noop;
        if (!stream) {
          if (!hasBeenTampered(process.stdout)) {
            stream = buildSafeSonicBoom({
              fd: process.stdout.fd || 1
            });
          } else {
            stream = process.stdout;
          }
        }
        return {
          opts,
          stream
        };
      };
    }
    function stringify(obj, stringifySafeFn) {
      try {
        return JSON.stringify(obj);
      } catch (_) {
        try {
          const stringify2 = stringifySafeFn || this[stringifySafeSym];
          return stringify2(obj);
        } catch (_2) {
          return '"[unable to serialize, circular reference is too complex to analyze]"';
        }
      }
    }
    function buildFormatters(level, bindings, log) {
      return {
        level,
        bindings,
        log
      };
    }
    function normalizeDestFileDescriptor(destination) {
      const fd = Number(destination);
      if (typeof destination === "string" && Number.isFinite(fd)) {
        return fd;
      }
      if (destination === void 0) {
        return 1;
      }
      return destination;
    }
    module.exports = {
      noop,
      buildSafeSonicBoom,
      asChindings,
      asJson,
      genLog,
      createArgsNormalizer,
      stringify,
      buildFormatters,
      normalizeDestFileDescriptor
    };
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/constants.js
var require_constants = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/constants.js"(exports, module) {
    var DEFAULT_LEVELS = {
      trace: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60
    };
    var SORTING_ORDER = {
      ASC: "ASC",
      DESC: "DESC"
    };
    module.exports = {
      DEFAULT_LEVELS,
      SORTING_ORDER
    };
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/levels.js
var require_levels = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/levels.js"(exports, module) {
    "use strict";
    var { lsCacheSym, levelValSym, useOnlyCustomLevelsSym, streamSym, formattersSym, hooksSym, levelCompSym } = require_symbols();
    var { noop, genLog } = require_tools();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var levelMethods = {
      fatal: (hook) => {
        const logFatal = genLog(DEFAULT_LEVELS.fatal, hook);
        return function(...args) {
          const stream = this[streamSym];
          logFatal.call(this, ...args);
          if (typeof stream.flushSync === "function") {
            try {
              stream.flushSync();
            } catch (e) {
            }
          }
        };
      },
      error: (hook) => genLog(DEFAULT_LEVELS.error, hook),
      warn: (hook) => genLog(DEFAULT_LEVELS.warn, hook),
      info: (hook) => genLog(DEFAULT_LEVELS.info, hook),
      debug: (hook) => genLog(DEFAULT_LEVELS.debug, hook),
      trace: (hook) => genLog(DEFAULT_LEVELS.trace, hook)
    };
    var nums = Object.keys(DEFAULT_LEVELS).reduce((o, k) => {
      o[DEFAULT_LEVELS[k]] = k;
      return o;
    }, {});
    var initialLsCache = Object.keys(nums).reduce((o, k) => {
      o[k] = '{"level":' + Number(k);
      return o;
    }, {});
    function genLsCache(instance) {
      const formatter = instance[formattersSym].level;
      const { labels } = instance.levels;
      const cache2 = {};
      for (const label in labels) {
        const level = formatter(labels[label], Number(label));
        cache2[label] = JSON.stringify(level).slice(0, -1);
      }
      instance[lsCacheSym] = cache2;
      return instance;
    }
    function isStandardLevel(level, useOnlyCustomLevels) {
      if (useOnlyCustomLevels) {
        return false;
      }
      switch (level) {
        case "fatal":
        case "error":
        case "warn":
        case "info":
        case "debug":
        case "trace":
          return true;
        default:
          return false;
      }
    }
    function setLevel(level) {
      const { labels, values } = this.levels;
      if (typeof level === "number") {
        if (labels[level] === void 0) throw Error("unknown level value" + level);
        level = labels[level];
      }
      if (values[level] === void 0) throw Error("unknown level " + level);
      const preLevelVal = this[levelValSym];
      const levelVal = this[levelValSym] = values[level];
      const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
      const levelComparison = this[levelCompSym];
      const hook = this[hooksSym].logMethod;
      for (const key in values) {
        if (levelComparison(values[key], levelVal) === false) {
          this[key] = noop;
          continue;
        }
        this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
      }
      this.emit("level-change", level, levelVal, labels[preLevelVal], preLevelVal, this);
    }
    function getLevel(level) {
      const { levels, levelVal } = this;
      return levels && levels.labels ? levels.labels[levelVal] : "";
    }
    function isLevelEnabled(logLevel2) {
      const { values } = this.levels;
      const logLevelVal = values[logLevel2];
      return logLevelVal !== void 0 && this[levelCompSym](logLevelVal, this[levelValSym]);
    }
    function compareLevel(direction, current, expected) {
      if (direction === SORTING_ORDER.DESC) {
        return current <= expected;
      }
      return current >= expected;
    }
    function genLevelComparison(levelComparison) {
      if (typeof levelComparison === "string") {
        return compareLevel.bind(null, levelComparison);
      }
      return levelComparison;
    }
    function mappings(customLevels = null, useOnlyCustomLevels = false) {
      const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
        o[customLevels[k]] = k;
        return o;
      }, {}) : null;
      const labels = Object.assign(Object.create(Object.prototype, {
        Infinity: {
          value: "silent"
        }
      }), useOnlyCustomLevels ? null : nums, customNums);
      const values = Object.assign(Object.create(Object.prototype, {
        silent: {
          value: Infinity
        }
      }), useOnlyCustomLevels ? null : DEFAULT_LEVELS, customLevels);
      return {
        labels,
        values
      };
    }
    function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
      if (typeof defaultLevel === "number") {
        const values = [].concat(Object.keys(customLevels || {}).map((key) => customLevels[key]), useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level), Infinity);
        if (!values.includes(defaultLevel)) {
          throw Error(`default level:${defaultLevel} must be included in custom levels`);
        }
        return;
      }
      const labels = Object.assign(Object.create(Object.prototype, {
        silent: {
          value: Infinity
        }
      }), useOnlyCustomLevels ? null : DEFAULT_LEVELS, customLevels);
      if (!(defaultLevel in labels)) {
        throw Error(`default level:${defaultLevel} must be included in custom levels`);
      }
    }
    function assertNoLevelCollisions(levels, customLevels) {
      const { labels, values } = levels;
      for (const k in customLevels) {
        if (k in values) {
          throw Error("levels cannot be overridden");
        }
        if (customLevels[k] in labels) {
          throw Error("pre-existing level values cannot be used for new levels");
        }
      }
    }
    function assertLevelComparison(levelComparison) {
      if (typeof levelComparison === "function") {
        return;
      }
      if (typeof levelComparison === "string" && Object.values(SORTING_ORDER).includes(levelComparison)) {
        return;
      }
      throw new Error('Levels comparison should be one of "ASC", "DESC" or "function" type');
    }
    module.exports = {
      initialLsCache,
      genLsCache,
      levelMethods,
      getLevel,
      setLevel,
      isLevelEnabled,
      mappings,
      assertNoLevelCollisions,
      assertDefaultLevelFound,
      genLevelComparison,
      assertLevelComparison
    };
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/meta.js
var require_meta = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/meta.js"(exports, module) {
    "use strict";
    module.exports = {
      version: "8.19.0"
    };
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/proto.js
var require_proto = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/proto.js"(exports, module) {
    "use strict";
    var { EventEmitter } = __require("node:events");
    var { lsCacheSym, levelValSym, setLevelSym, getLevelSym, chindingsSym, parsedChindingsSym, mixinSym, asJsonSym, writeSym, mixinMergeStrategySym, timeSym, timeSliceIndexSym, streamSym, serializersSym, formattersSym, errorKeySym, messageKeySym, useOnlyCustomLevelsSym, needsMetadataGsym, redactFmtSym, stringifySym, formatOptsSym, stringifiersSym, msgPrefixSym } = require_symbols();
    var { getLevel, setLevel, isLevelEnabled, mappings, initialLsCache, genLsCache, assertNoLevelCollisions } = require_levels();
    var { asChindings, asJson, buildFormatters, stringify } = require_tools();
    var { version } = require_meta();
    var redaction = require_redaction();
    var constructor = class Pino {
    };
    var prototype = {
      constructor,
      child,
      bindings,
      setBindings,
      flush,
      isLevelEnabled,
      version,
      get level() {
        return this[getLevelSym]();
      },
      set level(lvl) {
        this[setLevelSym](lvl);
      },
      get levelVal() {
        return this[levelValSym];
      },
      set levelVal(n) {
        throw Error("levelVal is read-only");
      },
      [lsCacheSym]: initialLsCache,
      [writeSym]: write,
      [asJsonSym]: asJson,
      [getLevelSym]: getLevel,
      [setLevelSym]: setLevel
    };
    Object.setPrototypeOf(prototype, EventEmitter.prototype);
    module.exports = function() {
      return Object.create(prototype);
    };
    var resetChildingsFormatter = (bindings2) => bindings2;
    function child(bindings2, options2) {
      if (!bindings2) {
        throw Error("missing bindings for child Pino");
      }
      options2 = options2 || {};
      const serializers = this[serializersSym];
      const formatters = this[formattersSym];
      const instance = Object.create(this);
      if (options2.hasOwnProperty("serializers") === true) {
        instance[serializersSym] = /* @__PURE__ */ Object.create(null);
        for (const k in serializers) {
          instance[serializersSym][k] = serializers[k];
        }
        const parentSymbols = Object.getOwnPropertySymbols(serializers);
        for (var i = 0; i < parentSymbols.length; i++) {
          const ks = parentSymbols[i];
          instance[serializersSym][ks] = serializers[ks];
        }
        for (const bk in options2.serializers) {
          instance[serializersSym][bk] = options2.serializers[bk];
        }
        const bindingsSymbols = Object.getOwnPropertySymbols(options2.serializers);
        for (var bi = 0; bi < bindingsSymbols.length; bi++) {
          const bks = bindingsSymbols[bi];
          instance[serializersSym][bks] = options2.serializers[bks];
        }
      } else instance[serializersSym] = serializers;
      if (options2.hasOwnProperty("formatters")) {
        const { level, bindings: chindings, log } = options2.formatters;
        instance[formattersSym] = buildFormatters(level || formatters.level, chindings || resetChildingsFormatter, log || formatters.log);
      } else {
        instance[formattersSym] = buildFormatters(formatters.level, resetChildingsFormatter, formatters.log);
      }
      if (options2.hasOwnProperty("customLevels") === true) {
        assertNoLevelCollisions(this.levels, options2.customLevels);
        instance.levels = mappings(options2.customLevels, instance[useOnlyCustomLevelsSym]);
        genLsCache(instance);
      }
      if (typeof options2.redact === "object" && options2.redact !== null || Array.isArray(options2.redact)) {
        instance.redact = options2.redact;
        const stringifiers = redaction(instance.redact, stringify);
        const formatOpts = {
          stringify: stringifiers[redactFmtSym]
        };
        instance[stringifySym] = stringify;
        instance[stringifiersSym] = stringifiers;
        instance[formatOptsSym] = formatOpts;
      }
      if (typeof options2.msgPrefix === "string") {
        instance[msgPrefixSym] = (this[msgPrefixSym] || "") + options2.msgPrefix;
      }
      instance[chindingsSym] = asChindings(instance, bindings2);
      const childLevel = options2.level || this.level;
      instance[setLevelSym](childLevel);
      this.onChild(instance);
      return instance;
    }
    function bindings() {
      const chindings = this[chindingsSym];
      const chindingsJson = `{${chindings.substr(1)}}`;
      const bindingsFromJson = JSON.parse(chindingsJson);
      delete bindingsFromJson.pid;
      delete bindingsFromJson.hostname;
      return bindingsFromJson;
    }
    function setBindings(newBindings) {
      const chindings = asChindings(this, newBindings);
      this[chindingsSym] = chindings;
      delete this[parsedChindingsSym];
    }
    function defaultMixinMergeStrategy(mergeObject, mixinObject) {
      return Object.assign(mixinObject, mergeObject);
    }
    function write(_obj, msg, num) {
      const t = this[timeSym]();
      const mixin = this[mixinSym];
      const errorKey = this[errorKeySym];
      const messageKey = this[messageKeySym];
      const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy;
      let obj;
      if (_obj === void 0 || _obj === null) {
        obj = {};
      } else if (_obj instanceof Error) {
        obj = {
          [errorKey]: _obj
        };
        if (msg === void 0) {
          msg = _obj.message;
        }
      } else {
        obj = _obj;
        if (msg === void 0 && _obj[messageKey] === void 0 && _obj[errorKey]) {
          msg = _obj[errorKey].message;
        }
      }
      if (mixin) {
        obj = mixinMergeStrategy(obj, mixin(obj, num, this));
      }
      const s = this[asJsonSym](obj, msg, num, t);
      const stream = this[streamSym];
      if (stream[needsMetadataGsym] === true) {
        stream.lastLevel = num;
        stream.lastObj = obj;
        stream.lastMsg = msg;
        stream.lastTime = t.slice(this[timeSliceIndexSym]);
        stream.lastLogger = this;
      }
      stream.write(s);
    }
    function noop() {
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw Error("callback must be a function");
      }
      const stream = this[streamSym];
      if (typeof stream.flush === "function") {
        stream.flush(cb || noop);
      } else if (cb) cb();
    }
  }
});

// node_modules/.deno/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = __commonJS({
  "node_modules/.deno/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js"(exports, module) {
    "use strict";
    var { hasOwnProperty } = Object.prototype;
    var stringify = configure();
    stringify.configure = configure;
    stringify.stringify = stringify;
    stringify.default = stringify;
    exports.stringify = stringify;
    exports.configure = configure;
    module.exports = stringify;
    var strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
    function strEscape(str) {
      if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) {
        return `"${str}"`;
      }
      return JSON.stringify(str);
    }
    function sort(array, comparator) {
      if (array.length > 200 || comparator) {
        return array.sort(comparator);
      }
      for (let i = 1; i < array.length; i++) {
        const currentValue = array[i];
        let position = i;
        while (position !== 0 && array[position - 1] > currentValue) {
          array[position] = array[position - 1];
          position--;
        }
        array[position] = currentValue;
      }
      return array;
    }
    var typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Object.getPrototypeOf(new Int8Array())), Symbol.toStringTag).get;
    function isTypedArrayWithEntries(value) {
      return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
    }
    function stringifyTypedArray(array, separator, maximumBreadth) {
      if (array.length < maximumBreadth) {
        maximumBreadth = array.length;
      }
      const whitespace = separator === "," ? "" : " ";
      let res = `"0":${whitespace}${array[0]}`;
      for (let i = 1; i < maximumBreadth; i++) {
        res += `${separator}"${i}":${whitespace}${array[i]}`;
      }
      return res;
    }
    function getCircularValueOption(options2) {
      if (hasOwnProperty.call(options2, "circularValue")) {
        const circularValue = options2.circularValue;
        if (typeof circularValue === "string") {
          return `"${circularValue}"`;
        }
        if (circularValue == null) {
          return circularValue;
        }
        if (circularValue === Error || circularValue === TypeError) {
          return {
            toString() {
              throw new TypeError("Converting circular structure to JSON");
            }
          };
        }
        throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined');
      }
      return '"[Circular]"';
    }
    function getDeterministicOption(options2) {
      let value;
      if (hasOwnProperty.call(options2, "deterministic")) {
        value = options2.deterministic;
        if (typeof value !== "boolean" && typeof value !== "function") {
          throw new TypeError('The "deterministic" argument must be of type boolean or comparator function');
        }
      }
      return value === void 0 ? true : value;
    }
    function getBooleanOption(options2, key) {
      let value;
      if (hasOwnProperty.call(options2, key)) {
        value = options2[key];
        if (typeof value !== "boolean") {
          throw new TypeError(`The "${key}" argument must be of type boolean`);
        }
      }
      return value === void 0 ? true : value;
    }
    function getPositiveIntegerOption(options2, key) {
      let value;
      if (hasOwnProperty.call(options2, key)) {
        value = options2[key];
        if (typeof value !== "number") {
          throw new TypeError(`The "${key}" argument must be of type number`);
        }
        if (!Number.isInteger(value)) {
          throw new TypeError(`The "${key}" argument must be an integer`);
        }
        if (value < 1) {
          throw new RangeError(`The "${key}" argument must be >= 1`);
        }
      }
      return value === void 0 ? Infinity : value;
    }
    function getItemCount(number) {
      if (number === 1) {
        return "1 item";
      }
      return `${number} items`;
    }
    function getUniqueReplacerSet(replacerArray) {
      const replacerSet = /* @__PURE__ */ new Set();
      for (const value of replacerArray) {
        if (typeof value === "string" || typeof value === "number") {
          replacerSet.add(String(value));
        }
      }
      return replacerSet;
    }
    function getStrictOption(options2) {
      if (hasOwnProperty.call(options2, "strict")) {
        const value = options2.strict;
        if (typeof value !== "boolean") {
          throw new TypeError('The "strict" argument must be of type boolean');
        }
        if (value) {
          return (value2) => {
            let message = `Object can not safely be stringified. Received type ${typeof value2}`;
            if (typeof value2 !== "function") message += ` (${value2.toString()})`;
            throw new Error(message);
          };
        }
      }
    }
    function configure(options2) {
      options2 = {
        ...options2
      };
      const fail = getStrictOption(options2);
      if (fail) {
        if (options2.bigint === void 0) {
          options2.bigint = false;
        }
        if (!("circularValue" in options2)) {
          options2.circularValue = Error;
        }
      }
      const circularValue = getCircularValueOption(options2);
      const bigint = getBooleanOption(options2, "bigint");
      const deterministic = getDeterministicOption(options2);
      const comparator = typeof deterministic === "function" ? deterministic : void 0;
      const maximumDepth = getPositiveIntegerOption(options2, "maximumDepth");
      const maximumBreadth = getPositiveIntegerOption(options2, "maximumBreadth");
      function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
        let value = parent[key];
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        value = replacer.call(parent, key, value);
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            let join7 = ",";
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join7 = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join7;
              }
              const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join7}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let whitespace = "";
            let separator = "";
            if (spacer !== "") {
              indentation += spacer;
              join7 = `,
${indentation}`;
              whitespace = " ";
            }
            const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (deterministic && !isTypedArrayWithEntries(value)) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyFnReplacer(key2, value, stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join7;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
              separator = join7;
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            let res = "";
            let join7 = ",";
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join7 = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join7;
              }
              const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join7}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            stack.push(value);
            let whitespace = "";
            if (spacer !== "") {
              indentation += spacer;
              join7 = `,
${indentation}`;
              whitespace = " ";
            }
            let separator = "";
            for (const key2 of replacer) {
              const tmp = stringifyArrayReplacer(key2, value[key2], stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join7;
              }
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyIndent(key, value, stack, spacer, indentation) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifyIndent(key, value, stack, spacer, indentation);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              indentation += spacer;
              let res2 = `
${indentation}`;
              const join8 = `,
${indentation}`;
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyIndent(String(i), value[i], stack, spacer, indentation);
                res2 += tmp2 !== void 0 ? tmp2 : "null";
                res2 += join8;
              }
              const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
              res2 += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res2 += `${join8}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              res2 += `
${originalIndentation}`;
              stack.pop();
              return `[${res2}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            indentation += spacer;
            const join7 = `,
${indentation}`;
            let res = "";
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, join7, maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = join7;
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyIndent(key2, value[key2], stack, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}: ${tmp}`;
                separator = join7;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
              separator = join7;
            }
            if (separator !== "") {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifySimple(key, value, stack) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifySimple(key, value, stack);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            const hasLength = value.length !== void 0;
            if (hasLength && Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifySimple(String(i), value[i], stack);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += ",";
              }
              const tmp = stringifySimple(String(i), value[i], stack);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `,"... ${getItemCount(removedKeys)} not stringified"`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (hasLength && isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, ",", maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = ",";
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifySimple(key2, value[key2], stack);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${tmp}`;
                separator = ",";
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringify2(value, replacer, space) {
        if (arguments.length > 1) {
          let spacer = "";
          if (typeof space === "number") {
            spacer = " ".repeat(Math.min(space, 10));
          } else if (typeof space === "string") {
            spacer = space.slice(0, 10);
          }
          if (replacer != null) {
            if (typeof replacer === "function") {
              return stringifyFnReplacer("", {
                "": value
              }, [], replacer, spacer, "");
            }
            if (Array.isArray(replacer)) {
              return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
            }
          }
          if (spacer.length !== 0) {
            return stringifyIndent("", value, [], spacer, "");
          }
        }
        return stringifySimple("", value, []);
      }
      return stringify2;
    }
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/lib/multistream.js
var require_multistream = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/lib/multistream.js"(exports, module) {
    "use strict";
    var metadata = Symbol.for("pino.metadata");
    var { DEFAULT_LEVELS } = require_constants();
    var DEFAULT_INFO_LEVEL = DEFAULT_LEVELS.info;
    function multistream(streamsArray, opts) {
      let counter = 0;
      streamsArray = streamsArray || [];
      opts = opts || {
        dedupe: false
      };
      const streamLevels = Object.create(DEFAULT_LEVELS);
      streamLevels.silent = Infinity;
      if (opts.levels && typeof opts.levels === "object") {
        Object.keys(opts.levels).forEach((i) => {
          streamLevels[i] = opts.levels[i];
        });
      }
      const res = {
        write,
        add,
        flushSync,
        end,
        minLevel: 0,
        streams: [],
        clone,
        [metadata]: true,
        streamLevels
      };
      if (Array.isArray(streamsArray)) {
        streamsArray.forEach(add, res);
      } else {
        add.call(res, streamsArray);
      }
      streamsArray = null;
      return res;
      function write(data) {
        let dest;
        const level = this.lastLevel;
        const { streams } = this;
        let recordedLevel = 0;
        let stream;
        for (let i = initLoopVar(streams.length, opts.dedupe); checkLoopVar(i, streams.length, opts.dedupe); i = adjustLoopVar(i, opts.dedupe)) {
          dest = streams[i];
          if (dest.level <= level) {
            if (recordedLevel !== 0 && recordedLevel !== dest.level) {
              break;
            }
            stream = dest.stream;
            if (stream[metadata]) {
              const { lastTime, lastMsg, lastObj, lastLogger } = this;
              stream.lastLevel = level;
              stream.lastTime = lastTime;
              stream.lastMsg = lastMsg;
              stream.lastObj = lastObj;
              stream.lastLogger = lastLogger;
            }
            stream.write(data);
            if (opts.dedupe) {
              recordedLevel = dest.level;
            }
          } else if (!opts.dedupe) {
            break;
          }
        }
      }
      function flushSync() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
        }
      }
      function add(dest) {
        if (!dest) {
          return res;
        }
        const isStream = typeof dest.write === "function" || dest.stream;
        const stream_ = dest.write ? dest : dest.stream;
        if (!isStream) {
          throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
        }
        const { streams, streamLevels: streamLevels2 } = this;
        let level;
        if (typeof dest.levelVal === "number") {
          level = dest.levelVal;
        } else if (typeof dest.level === "string") {
          level = streamLevels2[dest.level];
        } else if (typeof dest.level === "number") {
          level = dest.level;
        } else {
          level = DEFAULT_INFO_LEVEL;
        }
        const dest_ = {
          stream: stream_,
          level,
          levelVal: void 0,
          id: counter++
        };
        streams.unshift(dest_);
        streams.sort(compareByLevel);
        this.minLevel = streams[0].level;
        return res;
      }
      function end() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
          stream.end();
        }
      }
      function clone(level) {
        const streams = new Array(this.streams.length);
        for (let i = 0; i < streams.length; i++) {
          streams[i] = {
            level,
            stream: this.streams[i].stream
          };
        }
        return {
          write,
          add,
          minLevel: level,
          streams,
          clone,
          flushSync,
          [metadata]: true
        };
      }
    }
    function compareByLevel(a, b) {
      return a.level - b.level;
    }
    function initLoopVar(length2, dedupe) {
      return dedupe ? length2 - 1 : 0;
    }
    function adjustLoopVar(i, dedupe) {
      return dedupe ? i - 1 : i + 1;
    }
    function checkLoopVar(i, length2, dedupe) {
      return dedupe ? i >= 0 : i < length2;
    }
    module.exports = multistream;
  }
});

// node_modules/.deno/pino@8.19.0/node_modules/pino/pino.js
var require_pino = __commonJS({
  "node_modules/.deno/pino@8.19.0/node_modules/pino/pino.js"(exports, module) {
    "use strict";
    var os = __require("node:os");
    var stdSerializers = require_pino_std_serializers();
    var caller = require_caller();
    var redaction = require_redaction();
    var time = require_time();
    var proto3 = require_proto();
    var symbols2 = require_symbols();
    var { configure } = require_safe_stable_stringify();
    var { assertDefaultLevelFound, mappings, genLsCache, genLevelComparison, assertLevelComparison } = require_levels();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var { createArgsNormalizer, asChindings, buildSafeSonicBoom, buildFormatters, stringify, normalizeDestFileDescriptor, noop } = require_tools();
    var { version } = require_meta();
    var { chindingsSym, redactFmtSym, serializersSym, timeSym, timeSliceIndexSym, streamSym, stringifySym, stringifySafeSym, stringifiersSym, setLevelSym, endSym, formatOptsSym, messageKeySym, errorKeySym, nestedKeySym, mixinSym, levelCompSym, useOnlyCustomLevelsSym, formattersSym, hooksSym, nestedKeyStrSym, mixinMergeStrategySym, msgPrefixSym } = symbols2;
    var { epochTime, nullTime } = time;
    var { pid } = process;
    var hostname = os.hostname();
    var defaultErrorSerializer = stdSerializers.err;
    var defaultOptions = {
      level: "info",
      levelComparison: SORTING_ORDER.ASC,
      levels: DEFAULT_LEVELS,
      messageKey: "msg",
      errorKey: "err",
      nestedKey: null,
      enabled: true,
      base: {
        pid,
        hostname
      },
      serializers: Object.assign(/* @__PURE__ */ Object.create(null), {
        err: defaultErrorSerializer
      }),
      formatters: Object.assign(/* @__PURE__ */ Object.create(null), {
        bindings(bindings) {
          return bindings;
        },
        level(label, number) {
          return {
            level: number
          };
        }
      }),
      hooks: {
        logMethod: void 0
      },
      timestamp: epochTime,
      name: void 0,
      redact: null,
      customLevels: null,
      useOnlyCustomLevels: false,
      depthLimit: 5,
      edgeLimit: 100
    };
    var normalize7 = createArgsNormalizer(defaultOptions);
    var serializers = Object.assign(/* @__PURE__ */ Object.create(null), stdSerializers);
    function pino2(...args) {
      const instance = {};
      const { opts, stream } = normalize7(instance, caller(), ...args);
      const { redact, crlf, serializers: serializers2, timestamp, messageKey, errorKey, nestedKey, base: base2, name, level, customLevels, levelComparison, mixin, mixinMergeStrategy, useOnlyCustomLevels, formatters, hooks, depthLimit, edgeLimit, onChild, msgPrefix } = opts;
      const stringifySafe = configure({
        maximumDepth: depthLimit,
        maximumBreadth: edgeLimit
      });
      const allFormatters = buildFormatters(formatters.level, formatters.bindings, formatters.log);
      const stringifyFn = stringify.bind({
        [stringifySafeSym]: stringifySafe
      });
      const stringifiers = redact ? redaction(redact, stringifyFn) : {};
      const formatOpts = redact ? {
        stringify: stringifiers[redactFmtSym]
      } : {
        stringify: stringifyFn
      };
      const end = "}" + (crlf ? "\r\n" : "\n");
      const coreChindings = asChindings.bind(null, {
        [chindingsSym]: "",
        [serializersSym]: serializers2,
        [stringifiersSym]: stringifiers,
        [stringifySym]: stringify,
        [stringifySafeSym]: stringifySafe,
        [formattersSym]: allFormatters
      });
      let chindings = "";
      if (base2 !== null) {
        if (name === void 0) {
          chindings = coreChindings(base2);
        } else {
          chindings = coreChindings(Object.assign({}, base2, {
            name
          }));
        }
      }
      const time2 = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
      const timeSliceIndex = time2().indexOf(":") + 1;
      if (useOnlyCustomLevels && !customLevels) throw Error("customLevels is required if useOnlyCustomLevels is set true");
      if (mixin && typeof mixin !== "function") throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
      if (msgPrefix && typeof msgPrefix !== "string") throw Error(`Unknown msgPrefix type "${typeof msgPrefix}" - expected "string"`);
      assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
      const levels = mappings(customLevels, useOnlyCustomLevels);
      assertLevelComparison(levelComparison);
      const levelCompFunc = genLevelComparison(levelComparison);
      Object.assign(instance, {
        levels,
        [levelCompSym]: levelCompFunc,
        [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
        [streamSym]: stream,
        [timeSym]: time2,
        [timeSliceIndexSym]: timeSliceIndex,
        [stringifySym]: stringify,
        [stringifySafeSym]: stringifySafe,
        [stringifiersSym]: stringifiers,
        [endSym]: end,
        [formatOptsSym]: formatOpts,
        [messageKeySym]: messageKey,
        [errorKeySym]: errorKey,
        [nestedKeySym]: nestedKey,
        // protect against injection
        [nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
        [serializersSym]: serializers2,
        [mixinSym]: mixin,
        [mixinMergeStrategySym]: mixinMergeStrategy,
        [chindingsSym]: chindings,
        [formattersSym]: allFormatters,
        [hooksSym]: hooks,
        silent: noop,
        onChild,
        [msgPrefixSym]: msgPrefix
      });
      Object.setPrototypeOf(instance, proto3());
      genLsCache(instance);
      instance[setLevelSym](level);
      return instance;
    }
    module.exports = pino2;
    module.exports.destination = (dest = process.stdout.fd) => {
      if (typeof dest === "object") {
        dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
        return buildSafeSonicBoom(dest);
      } else {
        return buildSafeSonicBoom({
          dest: normalizeDestFileDescriptor(dest),
          minLength: 0
        });
      }
    };
    module.exports.transport = require_transport();
    module.exports.multistream = require_multistream();
    module.exports.levels = mappings();
    module.exports.stdSerializers = serializers;
    module.exports.stdTimeFunctions = Object.assign({}, time);
    module.exports.symbols = symbols2;
    module.exports.version = version;
    module.exports.default = pino2;
    module.exports.pino = pino2;
  }
});

// build/serve/creditsWorker.js-tmp
import { mkdir, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { basename as basename6, dirname as dirname6, join as join6, normalize as normalize6, resolve as resolve6 } from "node:path";
import process2 from "node:process";

// node_modules/.deno/@sbp+sbp@2.4.1/node_modules/@sbp/sbp/dist/esm/index.js
var selectors = /* @__PURE__ */ Object.create(null);
var domains = /* @__PURE__ */ Object.create(null);
var globalFilters = [];
var domainFilters = /* @__PURE__ */ Object.create(null);
var selectorFilters = /* @__PURE__ */ Object.create(null);
var unsafeSelectors = /* @__PURE__ */ Object.create(null);
var DOMAIN_REGEX = /^[^/]+/;
function sbp(selector, ...data) {
  const domain = domainFromSelector(selector);
  const starSelector = `${domain}/*`;
  const selExists = !!selectors[selector];
  let sel = selector;
  if (!selExists) {
    if (selectors[starSelector]) {
      sel = starSelector;
    } else {
      throw new Error(`SBP: selector not registered: ${selector}`);
    }
  }
  for (const filters of [
    selectorFilters[selector],
    domainFilters[domain],
    globalFilters
  ]) {
    if (filters) {
      for (const filter of filters) {
        if (filter(domain, selector, data) === false) return;
      }
    }
  }
  if (!selExists) {
    data.unshift(selector);
  }
  return selectors[sel].apply(domains[domain].state, data);
}
function domainFromSelector(selector) {
  const domainLookup = DOMAIN_REGEX.exec(selector);
  if (domainLookup === null) {
    throw new Error(`SBP: selector missing domain: ${selector}`);
  }
  return domainLookup[0];
}
var SBP_BASE_SELECTORS = {
  "sbp/selectors/register": (sels) => {
    const registered = [];
    for (const selector in sels) {
      const domainName = domainFromSelector(selector);
      const domain = domainName in domains ? domains[domainName] : domains[domainName] = {
        state: /* @__PURE__ */ Object.create(null),
        locked: false
      };
      if (domain.locked) {
        (console.warn || console.log)(`[SBP WARN]: not registering selector on locked domain: '${selector}'`);
      } else if (selectors[selector]) {
        (console.warn || console.log)(`[SBP WARN]: not registering already registered selector: '${selector}'`);
      } else if (typeof sels[selector] === "function") {
        if (unsafeSelectors[selector]) {
          (console.warn || console.log)(`[SBP WARN]: registering unsafe selector: '${selector}' (remember to lock after overwriting)`);
        }
        const fn = selectors[selector] = sels[selector];
        registered.push(selector);
        if (selector === `${domainName}/_init`) {
          fn.call(domain.state);
        }
      }
    }
    return registered;
  },
  "sbp/selectors/unregister": (sels) => {
    var _a2;
    for (const selector of sels) {
      if (!unsafeSelectors[selector]) {
        throw new Error(`SBP: can't unregister locked selector: ${selector}`);
      }
      if ((_a2 = domains[domainFromSelector(selector)]) === null || _a2 === void 0 ? void 0 : _a2.locked) {
        throw new Error(`SBP: can't unregister selector on a locked domain: '${selector}'`);
      }
      delete selectors[selector];
    }
  },
  "sbp/selectors/overwrite": (sels) => {
    sbp("sbp/selectors/unregister", Object.keys(sels));
    return sbp("sbp/selectors/register", sels);
  },
  "sbp/selectors/unsafe": (sels) => {
    for (const selector of sels) {
      if (selectors[selector]) {
        throw new Error("unsafe must be called before registering selector");
      }
      unsafeSelectors[selector] = true;
    }
  },
  "sbp/selectors/lock": (sels) => {
    for (const selector of sels) {
      delete unsafeSelectors[selector];
    }
  },
  "sbp/selectors/fn": (sel) => {
    return selectors[sel];
  },
  "sbp/filters/global/add": (filter) => {
    globalFilters.push(filter);
  },
  "sbp/filters/domain/add": (domain, filter) => {
    if (!domainFilters[domain]) domainFilters[domain] = [];
    domainFilters[domain].push(filter);
  },
  "sbp/filters/selector/add": (selector, filter) => {
    if (!selectorFilters[selector]) selectorFilters[selector] = [];
    selectorFilters[selector].push(filter);
  },
  "sbp/domains/lock": (domainNames) => {
    if (!domainNames) {
      for (const name in domains) {
        domains[name].locked = true;
      }
    } else {
      for (const name of domainNames) {
        if (!domains[name]) {
          throw new Error(`SBP: cannot lock non-existent domain: ${name}`);
        }
        domains[name].locked = true;
      }
    }
  }
};
SBP_BASE_SELECTORS["sbp/selectors/register"](SBP_BASE_SELECTORS);
var esm_default = sbp;

// node_modules/.deno/@sbp+okturtles.data@0.1.6/node_modules/@sbp/okturtles.data/dist/esm/index.mjs
var _store = /* @__PURE__ */ new Map();
var esm_default2 = esm_default("sbp/selectors/register", {
  "okTurtles.data/get": function(key) {
    return _store.get(key);
  },
  "okTurtles.data/set": function(key, data) {
    _store.set(key, data);
    return data;
  },
  "okTurtles.data/delete": function(key) {
    return _store.delete(key);
  },
  "okTurtles.data/add": function(key, data) {
    const array = _store.get(key);
    if (array) {
      array.push(data);
    } else {
      _store.set(key, [
        data
      ]);
    }
  },
  "okTurtles.data/remove": function(key, data) {
    const array = _store.get(key);
    if (array) {
      const aLen = array.length;
      const filtered = array.filter((v) => v !== data);
      _store.set(key, filtered);
      return aLen - filtered.length;
    }
  },
  "okTurtles.data/apply": function(key, fn) {
    return fn(_store.get(key));
  }
});

// node_modules/.deno/@sbp+okturtles.eventqueue@1.2.1/node_modules/@sbp/okturtles.eventqueue/dist/esm/index.mjs
var isEventQueueSbpEvent = (e) => {
  return Object.prototype.hasOwnProperty.call(e, "sbpInvocation");
};
var esm_default3 = esm_default("sbp/selectors/register", {
  "okTurtles.eventQueue/_init": function() {
    this.eventQueues = /* @__PURE__ */ Object.create(null);
  },
  "okTurtles.eventQueue/isWaiting": function(name) {
    var _a2;
    return !!((_a2 = this.eventQueues[name]) === null || _a2 === void 0 ? void 0 : _a2.length);
  },
  "okTurtles.eventQueue/queuedInvocations": function(name) {
    var _a2, _b;
    if (name == null) {
      return Object.fromEntries(Object.entries(this.eventQueues).map(([name2, events]) => [
        name2,
        events.map((event) => {
          if (isEventQueueSbpEvent(event)) {
            return event.sbpInvocation;
          } else {
            return event.fn;
          }
        })
      ]));
    }
    return (_b = (_a2 = this.eventQueues[name]) === null || _a2 === void 0 ? void 0 : _a2.map((event) => {
      if (isEventQueueSbpEvent(event)) {
        return event.sbpInvocation;
      } else {
        return event.fn;
      }
    })) !== null && _b !== void 0 ? _b : [];
  },
  "okTurtles.eventQueue/queueEvent": async function(name, invocation) {
    if (!Object.prototype.hasOwnProperty.call(this.eventQueues, name)) {
      this.eventQueues[name] = [];
    }
    const events = this.eventQueues[name];
    let accept;
    const promise = new Promise((resolve7) => {
      accept = resolve7;
    });
    const thisEvent = typeof invocation === "function" ? {
      fn: invocation,
      promise
    } : {
      sbpInvocation: invocation,
      promise
    };
    events.push(thisEvent);
    while (events.length > 0) {
      const event = events[0];
      if (event === thisEvent) {
        try {
          if (typeof invocation === "function") {
            return await invocation();
          } else {
            return await esm_default(...invocation);
          }
        } finally {
          accept();
          events.shift();
        }
      } else {
        await event.promise;
      }
    }
  }
});

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/db.mjs
import { Buffer as Buffer3 } from "node:buffer";

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bytes.mjs
var empty = new Uint8Array(0);
function equals(aa, bb) {
  if (aa === bb) {
    return true;
  }
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
}
function coerce(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array") {
    return o;
  }
  if (o instanceof ArrayBuffer) {
    return new Uint8Array(o);
  }
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/base-x.mjs
function base(ALPHABET, name) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode4(source) {
    if (source instanceof Uint8Array) {
    } else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length2 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length2) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      pbegin++;
    }
    var it2 = size - length2;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length2) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length2;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode6(string) {
    var buffer = decodeUnsafe(string);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name} character`);
  }
  return {
    encode: encode4,
    decodeUnsafe,
    decode: decode6
  };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base.mjs
var Encoder = class {
  constructor(name, prefix, baseEncode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder = class {
  constructor(name, prefix, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }
  decode(text) {
    if (typeof text === "string") {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  or(decoder) {
    return or(this, decoder);
  }
};
var ComposedDecoder = class {
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or(this, decoder);
  }
  decode(input) {
    const prefix = input[0];
    const decoder = this.decoders[prefix];
    if (decoder != null) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
function or(left, right) {
  var _a2, _b;
  return new ComposedDecoder(Object.assign(Object.assign({}, (_a2 = left.decoders) !== null && _a2 !== void 0 ? _a2 : {
    [left.prefix]: left
  }), (_b = right.decoders) !== null && _b !== void 0 ? _b : {
    [right.prefix]: right
  }));
}
var Codec = class {
  constructor(name, prefix, baseEncode, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name, prefix, baseEncode);
    this.decoder = new Decoder(name, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name, prefix, encode: encode4, decode: decode6 }) {
  return new Codec(name, prefix, encode4, decode6);
}
function baseX({ name, prefix, alphabet: alphabet3 }) {
  const { encode: encode4, decode: decode6 } = base_x_default(alphabet3, name);
  return from({
    prefix,
    name,
    encode: encode4,
    decode: (text) => coerce(decode6(text))
  });
}
function decode(string, alphabet3, bitsPerChar, name) {
  const codes = {};
  for (let i = 0; i < alphabet3.length; ++i) {
    codes[alphabet3[i]] = i;
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name} character`);
    }
    buffer = buffer << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode(data, alphabet3, bitsPerChar) {
  const pad = alphabet3[alphabet3.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet3[mask & buffer >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet3[mask & buffer << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc4648({ name, prefix, bitsPerChar, alphabet: alphabet3 }) {
  return from({
    prefix,
    name,
    encode(input) {
      return encode(input, alphabet3, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabet3, bitsPerChar, name);
    }
  });
}

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base32.mjs
var base32 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base58.mjs
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/blake2b.mjs
var import_blakejs = __toESM(require_blakejs(), 1);

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/vendor/varint.mjs
var encode_1 = encode2;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode2(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode2.bytes = offset - oldOffset + 1;
  return out;
}
var decode2 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf2, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf2[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode: decode2,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/varint.mjs
function decode3(data, offset = 0) {
  const code2 = varint_default.decode(data, offset);
  return [
    code2,
    varint_default.decode.bytes
  ];
}
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
function encodingLength(int) {
  return varint_default.encodingLength(int);
}

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/hashes/digest.mjs
function create(code2, digest) {
  const size = digest.byteLength;
  const sizeOffset = encodingLength(code2);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code2, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);
  return new Digest(code2, size, digest, bytes);
}
function decode4(multihash) {
  const bytes = coerce(multihash);
  const [code2, sizeOffset] = decode3(bytes);
  const [size, digestOffset] = decode3(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);
  if (digest.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code2, size, digest, bytes);
}
function equals2(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals(a.bytes, data.bytes);
  }
}
var Digest = class {
  /**
     * Creates a multihash digest.
     */
  constructor(code2, size, digest, bytes) {
    this.code = code2;
    this.size = size;
    this.digest = digest;
    this.bytes = bytes;
  }
};

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/hasher.mjs
function from2({ name, code: code2, encode: encode4 }) {
  return new Hasher(name, code2, encode4);
}
var Hasher = class {
  constructor(name, code2, encode4) {
    this.name = name;
    this.code = code2;
    this.encode = encode4;
  }
  digest(input) {
    if (input instanceof Uint8Array || input instanceof ReadableStream) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create(this.code, result) : result.then((digest) => create(this.code, digest));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/blake2b.mjs
var { blake2b } = import_blakejs.default;
var blake2b8 = from2({
  name: "blake2b-8",
  code: 45569,
  encode: (input) => coerce(blake2b(input, void 0, 1))
});
var blake2b16 = from2({
  name: "blake2b-16",
  code: 45570,
  encode: (input) => coerce(blake2b(input, void 0, 2))
});
var blake2b24 = from2({
  name: "blake2b-24",
  code: 45571,
  encode: (input) => coerce(blake2b(input, void 0, 3))
});
var blake2b32 = from2({
  name: "blake2b-32",
  code: 45572,
  encode: (input) => coerce(blake2b(input, void 0, 4))
});
var blake2b40 = from2({
  name: "blake2b-40",
  code: 45573,
  encode: (input) => coerce(blake2b(input, void 0, 5))
});
var blake2b48 = from2({
  name: "blake2b-48",
  code: 45574,
  encode: (input) => coerce(blake2b(input, void 0, 6))
});
var blake2b56 = from2({
  name: "blake2b-56",
  code: 45575,
  encode: (input) => coerce(blake2b(input, void 0, 7))
});
var blake2b64 = from2({
  name: "blake2b-64",
  code: 45576,
  encode: (input) => coerce(blake2b(input, void 0, 8))
});
var blake2b72 = from2({
  name: "blake2b-72",
  code: 45577,
  encode: (input) => coerce(blake2b(input, void 0, 9))
});
var blake2b80 = from2({
  name: "blake2b-80",
  code: 45578,
  encode: (input) => coerce(blake2b(input, void 0, 10))
});
var blake2b88 = from2({
  name: "blake2b-88",
  code: 45579,
  encode: (input) => coerce(blake2b(input, void 0, 11))
});
var blake2b96 = from2({
  name: "blake2b-96",
  code: 45580,
  encode: (input) => coerce(blake2b(input, void 0, 12))
});
var blake2b104 = from2({
  name: "blake2b-104",
  code: 45581,
  encode: (input) => coerce(blake2b(input, void 0, 13))
});
var blake2b112 = from2({
  name: "blake2b-112",
  code: 45582,
  encode: (input) => coerce(blake2b(input, void 0, 14))
});
var blake2b120 = from2({
  name: "blake2b-120",
  code: 45583,
  encode: (input) => coerce(blake2b(input, void 0, 15))
});
var blake2b128 = from2({
  name: "blake2b-128",
  code: 45584,
  encode: (input) => coerce(blake2b(input, void 0, 16))
});
var blake2b136 = from2({
  name: "blake2b-136",
  code: 45585,
  encode: (input) => coerce(blake2b(input, void 0, 17))
});
var blake2b144 = from2({
  name: "blake2b-144",
  code: 45586,
  encode: (input) => coerce(blake2b(input, void 0, 18))
});
var blake2b152 = from2({
  name: "blake2b-152",
  code: 45587,
  encode: (input) => coerce(blake2b(input, void 0, 19))
});
var blake2b160 = from2({
  name: "blake2b-160",
  code: 45588,
  encode: (input) => coerce(blake2b(input, void 0, 20))
});
var blake2b168 = from2({
  name: "blake2b-168",
  code: 45589,
  encode: (input) => coerce(blake2b(input, void 0, 21))
});
var blake2b176 = from2({
  name: "blake2b-176",
  code: 45590,
  encode: (input) => coerce(blake2b(input, void 0, 22))
});
var blake2b184 = from2({
  name: "blake2b-184",
  code: 45591,
  encode: (input) => coerce(blake2b(input, void 0, 23))
});
var blake2b192 = from2({
  name: "blake2b-192",
  code: 45592,
  encode: (input) => coerce(blake2b(input, void 0, 24))
});
var blake2b200 = from2({
  name: "blake2b-200",
  code: 45593,
  encode: (input) => coerce(blake2b(input, void 0, 25))
});
var blake2b208 = from2({
  name: "blake2b-208",
  code: 45594,
  encode: (input) => coerce(blake2b(input, void 0, 26))
});
var blake2b216 = from2({
  name: "blake2b-216",
  code: 45595,
  encode: (input) => coerce(blake2b(input, void 0, 27))
});
var blake2b224 = from2({
  name: "blake2b-224",
  code: 45596,
  encode: (input) => coerce(blake2b(input, void 0, 28))
});
var blake2b232 = from2({
  name: "blake2b-232",
  code: 45597,
  encode: (input) => coerce(blake2b(input, void 0, 29))
});
var blake2b240 = from2({
  name: "blake2b-240",
  code: 45598,
  encode: (input) => coerce(blake2b(input, void 0, 30))
});
var blake2b248 = from2({
  name: "blake2b-248",
  code: 45599,
  encode: (input) => coerce(blake2b(input, void 0, 31))
});
var blake2b256 = from2({
  name: "blake2b-256",
  code: 45600,
  encode: (input) => coerce(blake2b(input, void 0, 32))
});
var blake2b264 = from2({
  name: "blake2b-264",
  code: 45601,
  encode: (input) => coerce(blake2b(input, void 0, 33))
});
var blake2b272 = from2({
  name: "blake2b-272",
  code: 45602,
  encode: (input) => coerce(blake2b(input, void 0, 34))
});
var blake2b280 = from2({
  name: "blake2b-280",
  code: 45603,
  encode: (input) => coerce(blake2b(input, void 0, 35))
});
var blake2b288 = from2({
  name: "blake2b-288",
  code: 45604,
  encode: (input) => coerce(blake2b(input, void 0, 36))
});
var blake2b296 = from2({
  name: "blake2b-296",
  code: 45605,
  encode: (input) => coerce(blake2b(input, void 0, 37))
});
var blake2b304 = from2({
  name: "blake2b-304",
  code: 45606,
  encode: (input) => coerce(blake2b(input, void 0, 38))
});
var blake2b312 = from2({
  name: "blake2b-312",
  code: 45607,
  encode: (input) => coerce(blake2b(input, void 0, 39))
});
var blake2b320 = from2({
  name: "blake2b-320",
  code: 45608,
  encode: (input) => coerce(blake2b(input, void 0, 40))
});
var blake2b328 = from2({
  name: "blake2b-328",
  code: 45609,
  encode: (input) => coerce(blake2b(input, void 0, 41))
});
var blake2b336 = from2({
  name: "blake2b-336",
  code: 45610,
  encode: (input) => coerce(blake2b(input, void 0, 42))
});
var blake2b344 = from2({
  name: "blake2b-344",
  code: 45611,
  encode: (input) => coerce(blake2b(input, void 0, 43))
});
var blake2b352 = from2({
  name: "blake2b-352",
  code: 45612,
  encode: (input) => coerce(blake2b(input, void 0, 44))
});
var blake2b360 = from2({
  name: "blake2b-360",
  code: 45613,
  encode: (input) => coerce(blake2b(input, void 0, 45))
});
var blake2b368 = from2({
  name: "blake2b-368",
  code: 45614,
  encode: (input) => coerce(blake2b(input, void 0, 46))
});
var blake2b376 = from2({
  name: "blake2b-376",
  code: 45615,
  encode: (input) => coerce(blake2b(input, void 0, 47))
});
var blake2b384 = from2({
  name: "blake2b-384",
  code: 45616,
  encode: (input) => coerce(blake2b(input, void 0, 48))
});
var blake2b392 = from2({
  name: "blake2b-392",
  code: 45617,
  encode: (input) => coerce(blake2b(input, void 0, 49))
});
var blake2b400 = from2({
  name: "blake2b-400",
  code: 45618,
  encode: (input) => coerce(blake2b(input, void 0, 50))
});
var blake2b408 = from2({
  name: "blake2b-408",
  code: 45619,
  encode: (input) => coerce(blake2b(input, void 0, 51))
});
var blake2b416 = from2({
  name: "blake2b-416",
  code: 45620,
  encode: (input) => coerce(blake2b(input, void 0, 52))
});
var blake2b424 = from2({
  name: "blake2b-424",
  code: 45621,
  encode: (input) => coerce(blake2b(input, void 0, 53))
});
var blake2b432 = from2({
  name: "blake2b-432",
  code: 45622,
  encode: (input) => coerce(blake2b(input, void 0, 54))
});
var blake2b440 = from2({
  name: "blake2b-440",
  code: 45623,
  encode: (input) => coerce(blake2b(input, void 0, 55))
});
var blake2b448 = from2({
  name: "blake2b-448",
  code: 45624,
  encode: (input) => coerce(blake2b(input, void 0, 56))
});
var blake2b456 = from2({
  name: "blake2b-456",
  code: 45625,
  encode: (input) => coerce(blake2b(input, void 0, 57))
});
var blake2b464 = from2({
  name: "blake2b-464",
  code: 45626,
  encode: (input) => coerce(blake2b(input, void 0, 58))
});
var blake2b472 = from2({
  name: "blake2b-472",
  code: 45627,
  encode: (input) => coerce(blake2b(input, void 0, 59))
});
var blake2b480 = from2({
  name: "blake2b-480",
  code: 45628,
  encode: (input) => coerce(blake2b(input, void 0, 60))
});
var blake2b488 = from2({
  name: "blake2b-488",
  code: 45629,
  encode: (input) => coerce(blake2b(input, void 0, 61))
});
var blake2b496 = from2({
  name: "blake2b-496",
  code: 45630,
  encode: (input) => coerce(blake2b(input, void 0, 62))
});
var blake2b504 = from2({
  name: "blake2b-504",
  code: 45631,
  encode: (input) => coerce(blake2b(input, void 0, 63))
});
var blake2b512 = from2({
  name: "blake2b-512",
  code: 45632,
  encode: (input) => coerce(blake2b(input, void 0, 64))
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/blake2bstream.mjs
var import_blakejs2 = __toESM(require_blakejs(), 1);
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve7) {
      resolve7(value);
    });
  }
  return new (P || (P = Promise))(function(resolve7, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve7(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var { blake2b: blake2b2, blake2bInit, blake2bUpdate, blake2bFinal } = import_blakejs2.default;
var blake2b256stream = from2({
  name: "blake2b-256",
  code: 45600,
  encode: (input) => __awaiter(void 0, void 0, void 0, function* () {
    if (input instanceof ReadableStream) {
      const ctx = blake2bInit(32);
      const reader = input.getReader();
      for (; ; ) {
        const result = yield reader.read();
        if (result.done) break;
        blake2bUpdate(ctx, coerce(result.value));
      }
      return blake2bFinal(ctx);
    } else {
      return coerce(blake2b2(input, void 0, 32));
    }
  })
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/cid.mjs
var _a;
function format(link, base2) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV0(bytes, baseCache(link), base2 !== null && base2 !== void 0 ? base2 : base58btc.encoder);
    default:
      return toStringV1(bytes, baseCache(link), base2 !== null && base2 !== void 0 ? base2 : base32.encoder);
  }
}
var cache = /* @__PURE__ */ new WeakMap();
function baseCache(cid) {
  const baseCache2 = cache.get(cid);
  if (baseCache2 == null) {
    const baseCache3 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache3);
    return baseCache3;
  }
  return baseCache2;
}
var CID = class _CID {
  /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param multihash - (Multi)hash of the of the content.
     */
  constructor(version, code2, multihash, bytes) {
    this[_a] = "CID";
    this.code = code2;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes;
    this["/"] = bytes;
  }
  /**
     * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
     * please either use `CID.asCID(cid)` or switch to new signalling mechanism
     *
     * @deprecated
     */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0: {
        return this;
      }
      case 1: {
        const { code: code2, multihash } = this;
        if (code2 !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return _CID.createV0(multihash);
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code2, digest } = this.multihash;
        const multihash = create(code2, digest);
        return _CID.createV1(this.code, multihash);
      }
      case 1: {
        return this;
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
      }
    }
  }
  equals(other) {
    return _CID.equals(this, other);
  }
  static equals(self2, other) {
    const unknown = other;
    return unknown != null && self2.code === unknown.code && self2.version === unknown.version && equals2(self2.multihash, unknown.multihash);
  }
  toString(base2) {
    return format(this, base2);
  }
  toJSON() {
    return {
      "/": format(this)
    };
  }
  link() {
    return this;
  }
  // Legacy
  [(_a = Symbol.toStringTag, Symbol.for("nodejs.util.inspect.custom"))]() {
    return `CID(${this.toString()})`;
  }
  /**
     * Takes any input `value` and returns a `CID` instance if it was
     * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
     * it will return value back. If `value` is not instance of this CID
     * class, but is compatible CID it will return new instance of this
     * `CID` class. Otherwise returns null.
     *
     * This allows two different incompatible versions of CID library to
     * co-exist and interop as long as binary interface is compatible.
     */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value = input;
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code2, multihash, bytes } = value;
      return new _CID(version, code2, multihash, bytes !== null && bytes !== void 0 ? bytes : encodeCID(version, code2, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code2 } = value;
      const digest = decode4(multihash);
      return _CID.create(version, code2, digest);
    } else {
      return null;
    }
  }
  /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param digest - (Multi)hash of the of the content.
     */
  static create(version, code2, digest) {
    if (typeof code2 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code2 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code2, digest, digest.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version, code2, digest.bytes);
        return new _CID(version, code2, digest, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
     * Simplified version of `create` for CIDv0.
     */
  static createV0(digest) {
    return _CID.create(0, DAG_PB_CODE, digest);
  }
  /**
     * Simplified version of `create` for CIDv1.
     *
     * @param code - Content encoding format code.
     * @param digest - Multihash of the content.
     */
  static createV1(code2, digest) {
    return _CID.create(1, code2, digest);
  }
  /**
     * Decoded a CID from its binary representation. The byte array must contain
     * only the CID with no additional bytes.
     *
     * An error will be thrown if the bytes provided do not contain a valid
     * binary representation of a CID.
     */
  static decode(bytes) {
    const [cid, remainder] = _CID.decodeFirst(bytes);
    if (remainder.length !== 0) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  /**
     * Decoded a CID from its binary representation at the beginning of a byte
     * array.
     *
     * Returns an array with the first element containing the CID and the second
     * element containing the remainder of the original byte array. The remainder
     * will be a zero-length byte array if the provided bytes only contained a
     * binary CID representation.
     */
  static decodeFirst(bytes) {
    const specs = _CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest) : _CID.createV1(specs.codec, digest);
    return [
      cid,
      bytes.subarray(specs.size)
    ];
  }
  /**
     * Inspect the initial bytes of a CID to determine its properties.
     *
     * Involves decoding up to 4 varints. Typically this will require only 4 to 6
     * bytes but for larger multicodec code values and larger multihash digest
     * lengths these varints can be quite large. It is recommended that at least
     * 10 bytes be made available in the `initialBytes` argument for a complete
     * inspection.
     */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length2] = decode3(initialBytes.subarray(offset));
      offset += length2;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE;
    if (version === 18) {
      version = 0;
      offset = 0;
    } else {
      codec = next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return {
      version,
      codec,
      multihashCode,
      digestSize,
      multihashSize,
      size
    };
  }
  /**
     * Takes cid in a string representation and creates an instance. If `base`
     * decoder is not provided will use a default from the configuration. It will
     * throw an error if encoding of the CID is not compatible with supplied (or
     * a default decoder).
     */
  static parse(source, base2) {
    const [prefix, bytes] = parseCIDtoBytes(source, base2);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes(source, base2) {
  switch (source[0]) {
    // CIDv0 is parsed differently
    case "Q": {
      const decoder = base2 !== null && base2 !== void 0 ? base2 : base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base2 !== null && base2 !== void 0 ? base2 : base58btc;
      return [
        base58btc.prefix,
        decoder.decode(source)
      ];
    }
    case base32.prefix: {
      const decoder = base2 !== null && base2 !== void 0 ? base2 : base32;
      return [
        base32.prefix,
        decoder.decode(source)
      ];
    }
    default: {
      if (base2 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [
        source[0],
        base2.decode(source)
      ];
    }
  }
}
function toStringV0(bytes, cache2, base2) {
  const { prefix } = base2;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base2.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV1(bytes, cache2, base2) {
  const { prefix } = base2;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code2, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code2);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code2, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/.deno/@chelonia+crypto@1.0.1/node_modules/@chelonia/crypto/dist/esm/index.mjs
var import_scrypt_async = __toESM(require_scrypt_async(), 1);
var import_tweetnacl = __toESM(require_nacl_fast(), 1);
var bufToStr = (() => {
  const textDecoder = new TextDecoder();
  return (buf2) => {
    return textDecoder.decode(buf2);
  };
})();
var strToBuf = (() => {
  const textEncoder = new TextEncoder();
  return (str) => {
    return textEncoder.encode(str);
  };
})();
var blake32Hash = (data) => {
  const uint8array = typeof data === "string" ? strToBuf(data) : data;
  const digest = blake2b256.digest(uint8array);
  return base58btc.encode(digest.bytes);
};
var b64ToBuf = (data) => new Uint8Array(atob(data).split("").map((b) => b.charCodeAt(0)));
var ENULL = "eNULL";
var SNULL = "sNULL";
var EDWARDS25519SHA512BATCH = "edwards25519sha512batch";
var CURVE25519XSALSA20POLY1305 = "curve25519xsalsa20poly1305";
var XSALSA20POLY1305 = "xsalsa20poly1305";
if (false) {
  throw new Error("ENABLE_UNSAFE_NULL_CRYPTO cannot be enabled in production mode");
}
var bytesOrObjectToB64 = (ary) => {
  if (!(ary instanceof Uint8Array)) {
    throw TypeError("Unsupported type");
  }
  return btoa(Array.from(ary).map((c) => String.fromCharCode(c)).join(""));
};
var serializeKey = (key, saveSecretKey) => {
  if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && (key.type === ENULL || key.type === SNULL)) {
    return JSON.stringify([
      key.type,
      saveSecretKey ? null : key.publicKey,
      saveSecretKey ? key.secretKey : null
    ], void 0, 0);
  }
  if (key.type === EDWARDS25519SHA512BATCH || key.type === CURVE25519XSALSA20POLY1305) {
    if (!saveSecretKey) {
      if (!key.publicKey) {
        throw new Error("Unsupported operation: no public key to export");
      }
      return JSON.stringify([
        key.type,
        bytesOrObjectToB64(key.publicKey),
        null
      ], void 0, 0);
    }
    if (!key.secretKey) {
      throw new Error("Unsupported operation: no secret key to export");
    }
    return JSON.stringify([
      key.type,
      null,
      bytesOrObjectToB64(key.secretKey)
    ], void 0, 0);
  } else if (key.type === XSALSA20POLY1305) {
    if (!saveSecretKey) {
      throw new Error("Unsupported operation: no public key to export");
    }
    if (!key.secretKey) {
      throw new Error("Unsupported operation: no secret key to export");
    }
    return JSON.stringify([
      key.type,
      null,
      bytesOrObjectToB64(key.secretKey)
    ], void 0, 0);
  }
  throw new Error("Unsupported key type");
};
var deserializeKey = (data) => {
  const keyData = JSON.parse(data);
  if (!keyData || keyData.length !== 3) {
    throw new Error("Invalid key object");
  }
  if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && (keyData[0] === ENULL || keyData[0] === SNULL)) {
    const res = {
      type: keyData[0]
    };
    if (keyData[2]) {
      Object.defineProperty(res, "secretKey", {
        value: keyData[2]
      });
      res.publicKey = keyData[2];
    } else {
      res.publicKey = keyData[1];
    }
    return res;
  }
  if (keyData[0] === EDWARDS25519SHA512BATCH) {
    if (keyData[2]) {
      const key = import_tweetnacl.default.sign.keyPair.fromSecretKey(b64ToBuf(keyData[2]));
      const res = {
        type: keyData[0],
        publicKey: key.publicKey
      };
      Object.defineProperty(res, "secretKey", {
        value: key.secretKey
      });
      return res;
    } else if (keyData[1]) {
      return {
        type: keyData[0],
        publicKey: new Uint8Array(b64ToBuf(keyData[1]))
      };
    }
    throw new Error("Missing secret or public key");
  } else if (keyData[0] === CURVE25519XSALSA20POLY1305) {
    if (keyData[2]) {
      const key = import_tweetnacl.default.box.keyPair.fromSecretKey(b64ToBuf(keyData[2]));
      const res = {
        type: keyData[0],
        publicKey: key.publicKey
      };
      Object.defineProperty(res, "secretKey", {
        value: key.secretKey
      });
      return res;
    } else if (keyData[1]) {
      return {
        type: keyData[0],
        publicKey: new Uint8Array(b64ToBuf(keyData[1]))
      };
    }
    throw new Error("Missing secret or public key");
  } else if (keyData[0] === XSALSA20POLY1305) {
    if (!keyData[2]) {
      throw new Error("Secret key missing");
    }
    const res = {
      type: keyData[0]
    };
    Object.defineProperty(res, "secretKey", {
      value: new Uint8Array(b64ToBuf(keyData[2]))
    });
    return res;
  }
  throw new Error("Unsupported key type");
};
var keyId = (inKey) => {
  const key = typeof inKey === "string" ? deserializeKey(inKey) : inKey;
  const serializedKey = serializeKey(key, !key.publicKey);
  return blake32Hash(serializedKey);
};
var verifySignature = (inKey, data, signature) => {
  const key = typeof inKey === "string" ? deserializeKey(inKey) : inKey;
  if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && key.type === SNULL) {
    if (!key.publicKey) {
      throw new Error("Public key missing");
    }
    if (key.publicKey + ";" + blake32Hash(data) !== signature) {
      throw new Error("Invalid signature");
    }
    return;
  }
  if (key.type !== EDWARDS25519SHA512BATCH) {
    throw new Error("Unsupported algorithm");
  }
  if (!key.publicKey) {
    throw new Error("Public key missing");
  }
  const decodedSignature = b64ToBuf(signature);
  const messageUint8 = strToBuf(data);
  const result = import_tweetnacl.default.sign.detached.verify(messageUint8, decodedSignature, key.publicKey);
  if (!result) {
    throw new Error("Invalid signature");
  }
};
var decrypt = (inKey, data, ad) => {
  const key = typeof inKey === "string" ? deserializeKey(inKey) : inKey;
  if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && key.type === ENULL) {
    if (!key.secretKey) {
      throw new Error("Secret key missing");
    }
    if (!data.startsWith(key.secretKey + ";") || !data.endsWith(";" + (ad !== null && ad !== void 0 ? ad : ""))) {
      throw new Error("Additional data mismatch");
    }
    return data.slice(String(key.secretKey).length + 1, data.length - 1 - (ad !== null && ad !== void 0 ? ad : "").length);
  }
  if (key.type === XSALSA20POLY1305) {
    if (!key.secretKey) {
      throw new Error("Secret key missing");
    }
    const messageWithNonceAsUint8Array = b64ToBuf(data);
    const nonce = messageWithNonceAsUint8Array.slice(0, import_tweetnacl.default.secretbox.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(import_tweetnacl.default.secretbox.nonceLength, messageWithNonceAsUint8Array.length);
    if (ad) {
      const adHash = import_tweetnacl.default.hash(strToBuf(ad));
      const len = Math.min(adHash.length, nonce.length);
      for (let i = 0; i < len; i++) {
        nonce[i] ^= adHash[i];
      }
    }
    const decrypted = import_tweetnacl.default.secretbox.open(message, nonce, key.secretKey);
    if (!decrypted) {
      throw new Error("Could not decrypt message");
    }
    return bufToStr(decrypted);
  } else if (key.type === CURVE25519XSALSA20POLY1305) {
    if (!key.secretKey) {
      throw new Error("Secret key missing");
    }
    const messageWithNonceAsUint8Array = b64ToBuf(data);
    const ephemeralPublicKey = messageWithNonceAsUint8Array.slice(0, import_tweetnacl.default.box.publicKeyLength);
    const nonce = messageWithNonceAsUint8Array.slice(import_tweetnacl.default.box.publicKeyLength, import_tweetnacl.default.box.publicKeyLength + import_tweetnacl.default.box.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(import_tweetnacl.default.box.publicKeyLength + import_tweetnacl.default.box.nonceLength);
    if (ad) {
      const adHash = import_tweetnacl.default.hash(strToBuf(ad));
      const len = Math.min(adHash.length, nonce.length);
      for (let i = 0; i < len; i++) {
        nonce[i] ^= adHash[i];
      }
    }
    const decrypted = import_tweetnacl.default.box.open(message, nonce, ephemeralPublicKey, key.secretKey);
    if (!decrypted) {
      throw new Error("Could not decrypt message");
    }
    return bufToStr(decrypted);
  }
  throw new Error("Unsupported algorithm");
};

// node_modules/.deno/@chelonia+serdes@1.0.0/node_modules/@chelonia/serdes/dist/esm/index.js
var serdesTagSymbol = Symbol("tag");
var serdesSerializeSymbol = Symbol("serialize");
var serdesDeserializeSymbol = Symbol("deserialize");
var rawResult = (rawResultSet, obj) => {
  rawResultSet.add(obj);
  return obj;
};
var serializer = (data) => {
  const rawResultSet = /* @__PURE__ */ new WeakSet();
  const verbatim = [];
  const transferables = /* @__PURE__ */ new Set();
  const revokables = /* @__PURE__ */ new Set();
  const result = JSON.parse(JSON.stringify(data, (_key, value) => {
    if (value && typeof value === "object" && rawResultSet.has(value)) return value;
    if (value === void 0) return rawResult(rawResultSet, [
      "_",
      "_"
    ]);
    if (!value) return value;
    if (Array.isArray(value) && value[0] === "_") return rawResult(rawResultSet, [
      "_",
      "_",
      ...value
    ]);
    if (value instanceof Map) {
      return rawResult(rawResultSet, [
        "_",
        "Map",
        Array.from(value.entries())
      ]);
    }
    if (value instanceof Set) {
      return rawResult(rawResultSet, [
        "_",
        "Set",
        Array.from(value.values())
      ]);
    }
    if (value instanceof Blob || value instanceof File) {
      const pos = verbatim.length;
      verbatim[verbatim.length] = value;
      return rawResult(rawResultSet, [
        "_",
        "_ref",
        pos
      ]);
    }
    if (value instanceof Error) {
      const pos = verbatim.length;
      verbatim[verbatim.length] = value;
      if (value.cause) {
        value.cause = serializer(value.cause).data;
      }
      return rawResult(rawResultSet, [
        "_",
        "_err",
        rawResult(rawResultSet, [
          "_",
          "_ref",
          pos
        ]),
        value.name
      ]);
    }
    if (value instanceof MessagePort || value instanceof ReadableStream || value instanceof WritableStream || value instanceof ArrayBuffer) {
      const pos = verbatim.length;
      verbatim[verbatim.length] = value;
      transferables.add(value);
      return rawResult(rawResultSet, [
        "_",
        "_ref",
        pos
      ]);
    }
    if (ArrayBuffer.isView(value)) {
      const pos = verbatim.length;
      verbatim[verbatim.length] = value;
      transferables.add(value.buffer);
      return rawResult(rawResultSet, [
        "_",
        "_ref",
        pos
      ]);
    }
    if (typeof value === "function") {
      const mc = new MessageChannel();
      mc.port1.onmessage = async (ev) => {
        try {
          try {
            const result2 = await value(...deserializer(ev.data[1]));
            const { data: data2, transferables: transferables2 } = serializer(result2);
            ev.data[0].postMessage([
              true,
              data2
            ], transferables2);
          } catch (e) {
            const { data: data2, transferables: transferables2 } = serializer(e);
            ev.data[0].postMessage([
              false,
              data2
            ], transferables2);
          }
        } catch (e) {
          console.error("Async error on onmessage handler", e);
        }
      };
      transferables.add(mc.port2);
      revokables.add(mc.port1);
      return rawResult(rawResultSet, [
        "_",
        "_fn",
        mc.port2
      ]);
    }
    const proto3 = Object.getPrototypeOf(value);
    if (proto3?.constructor?.[serdesTagSymbol] && proto3.constructor[serdesSerializeSymbol]) {
      return rawResult(rawResultSet, [
        "_",
        "_custom",
        proto3.constructor[serdesTagSymbol],
        proto3.constructor[serdesSerializeSymbol](value)
      ]);
    }
    return value;
  }), (_key, value) => {
    if (Array.isArray(value) && value[0] === "_" && value[1] === "_ref") {
      return verbatim[value[2]];
    }
    return value;
  });
  return {
    data: result,
    transferables: Array.from(transferables),
    revokables: Array.from(revokables)
  };
};
var deserializerTable = /* @__PURE__ */ Object.create(null);
var deserializer = (data) => {
  const rawResultSet = /* @__PURE__ */ new WeakSet();
  const verbatim = [];
  return JSON.parse(JSON.stringify(data, (_key, value) => {
    if (value && typeof value === "object" && !rawResultSet.has(value) && !Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) {
      const pos = verbatim.length;
      verbatim[verbatim.length] = value;
      return rawResult(rawResultSet, [
        "_",
        "_ref",
        pos
      ]);
    }
    return value;
  }), (_key, value) => {
    if (Array.isArray(value) && value[0] === "_") {
      switch (value[1]) {
        case "_":
          if (value.length >= 3) {
            return value.slice(2);
          } else {
            return;
          }
        // Map input (reconstruct Map)
        case "Map":
          return new Map(value[2]);
        // Set input (reconstruct Set)
        case "Set":
          return new Set(value[2]);
        // Custom object type (reconstruct if possible, otherwise throw an error)
        case "_custom":
          if (deserializerTable[value[2]]) {
            return deserializerTable[value[2]](value[3]);
          } else {
            throw new Error("Invalid or unknown tag: " + value[2]);
          }
        // These are literal values, return them
        case "_ref":
          return verbatim[value[2]];
        case "_err": {
          if (value[2].name !== value[3]) {
            value[2].name = value[3];
          }
          if (value[2].cause) {
            value[2].cause = deserializer(value[2].cause);
          }
          return value[2];
        }
        // These were functions converted to a MessagePort. Convert them on this
        // end back into functions using that port.
        case "_fn": {
          const mp = value[2];
          return (...args) => {
            return new Promise((resolve7, reject) => {
              const mc = new MessageChannel();
              const { data: data2, transferables } = serializer(args);
              mc.port1.onmessage = (ev) => {
                if (ev.data[0]) {
                  resolve7(deserializer(ev.data[1]));
                } else {
                  reject(deserializer(ev.data[1]));
                }
              };
              mp.postMessage([
                mc.port2,
                data2
              ], [
                mc.port2,
                ...transferables
              ]);
            });
          };
        }
      }
    }
    return value;
  });
};
deserializer.register = (ctor) => {
  if (typeof ctor === "function" && typeof ctor[serdesTagSymbol] === "string" && typeof ctor[serdesDeserializeSymbol] === "function") {
    deserializerTable[ctor[serdesTagSymbol]] = ctor[serdesDeserializeSymbol].bind(ctor);
  }
};

// node_modules/.deno/turtledash@1.0.3/node_modules/turtledash/dist/esm/index.js
function omit(o, props) {
  const x = /* @__PURE__ */ Object.create(null);
  for (const k in o) {
    if (!props.includes(k)) {
      x[k] = o[k];
    }
  }
  return x;
}
function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}
var has = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/errors.mjs
var ChelErrorGenerator = (name, base2 = Error) => class extends base2 {
  constructor(...params) {
    super(...params);
    this.name = name;
    if (params[1]?.cause !== this.cause) {
      Object.defineProperty(this, "cause", {
        configurable: true,
        writable: true,
        value: params[1]?.cause
      });
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var ChelErrorWarning = ChelErrorGenerator("ChelErrorWarning");
var ChelErrorAlreadyProcessed = ChelErrorGenerator("ChelErrorAlreadyProcessed");
var ChelErrorDBBadPreviousHEAD = ChelErrorGenerator("ChelErrorDBBadPreviousHEAD");
var ChelErrorDBConnection = ChelErrorGenerator("ChelErrorDBConnection");
var ChelErrorUnexpected = ChelErrorGenerator("ChelErrorUnexpected");
var ChelErrorKeyAlreadyExists = ChelErrorGenerator("ChelErrorKeyAlreadyExists");
var ChelErrorUnrecoverable = ChelErrorGenerator("ChelErrorUnrecoverable");
var ChelErrorForkedChain = ChelErrorGenerator("ChelErrorForkedChain");
var ChelErrorDecryptionError = ChelErrorGenerator("ChelErrorDecryptionError");
var ChelErrorDecryptionKeyNotFound = ChelErrorGenerator("ChelErrorDecryptionKeyNotFound", ChelErrorDecryptionError);
var ChelErrorSignatureError = ChelErrorGenerator("ChelErrorSignatureError");
var ChelErrorSignatureKeyUnauthorized = ChelErrorGenerator("ChelErrorSignatureKeyUnauthorized", ChelErrorSignatureError);
var ChelErrorSignatureKeyNotFound = ChelErrorGenerator("ChelErrorSignatureKeyNotFound", ChelErrorSignatureError);
var ChelErrorFetchServerTimeFailed = ChelErrorGenerator("ChelErrorFetchServerTimeFailed");
var ChelErrorUnexpectedHttpResponseCode = ChelErrorGenerator("ChelErrorUnexpectedHttpResponseCode");
var ChelErrorResourceGone = ChelErrorGenerator("ChelErrorResourceGone", ChelErrorUnexpectedHttpResponseCode);

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/functions.mjs
import { Buffer as Buffer2 } from "node:buffer";
var multicodes = {
  RAW: 0,
  JSON: 512,
  SHELTER_CONTRACT_MANIFEST: 5316096,
  SHELTER_CONTRACT_TEXT: 5316097,
  SHELTER_CONTRACT_DATA: 5316098,
  SHELTER_FILE_MANIFEST: 5316099,
  SHELTER_FILE_CHUNK: 5316100
};
var parseCID = (cid) => {
  if (!cid || cid.length < 52 || cid.length > 64) {
    throw new RangeError("CID length too short or too long");
  }
  const parsed = CID.parse(cid, base58btc);
  if (parsed.version !== 1 || parsed.multihash.code !== blake2b256.code || !Object.values(multicodes).includes(parsed.code)) {
    throw new Error("Invalid CID");
  }
  return parsed;
};
var maybeParseCID = (cid) => {
  try {
    return parseCID(cid);
  } catch {
    return null;
  }
};
function createCID(data, multicode = multicodes.RAW) {
  const uint8array = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = blake2b256.digest(uint8array);
  return CID.create(1, multicode, digest).toString(base58btc);
}
function blake32Hash2(data) {
  const uint8array = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = blake2b256.digest(uint8array);
  return base58btc.encode(digest.bytes);
}
var strToBuf2 = (str) => Buffer2.from(str, "utf8");
var strToB64 = (str) => strToBuf2(str).toString("base64");

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/signedData.mjs
var rootStateFn = () => esm_default("chelonia/rootState");
var proto = Object.create(null, {
  _isSignedData: {
    value: true
  }
});
var wrapper = (o) => {
  return Object.setPrototypeOf(o, proto);
};
var isSignedData = (o) => {
  return !!o && !!Object.getPrototypeOf(o)?._isSignedData;
};
var verifySignatureData = function(state, height, data, additionalData) {
  if (!state) {
    throw new ChelErrorSignatureError("Missing contract state");
  }
  if (!isRawSignedData(data)) {
    throw new ChelErrorSignatureError("Invalid message format");
  }
  if (!Number.isSafeInteger(height) || height < 0) {
    throw new ChelErrorSignatureError(`Height ${height} is invalid or out of range`);
  }
  const [serializedMessage, sKeyId, signature] = data._signedData;
  const designatedKey = state._vm?.authorizedKeys?.[sKeyId];
  if (!designatedKey || height > designatedKey._notAfterHeight || height < designatedKey._notBeforeHeight || !designatedKey.purpose.includes("sig")) {
    if (process.env.CI) {
      console.error(`Key ${sKeyId} is unauthorized or expired for the current contract`, {
        designatedKey,
        height,
        state: JSON.parse(JSON.stringify(esm_default("state/vuex/state")))
      });
      Promise.reject(new ChelErrorSignatureKeyUnauthorized(`Key ${sKeyId} is unauthorized or expired for the current contract`));
    }
    throw new ChelErrorSignatureKeyUnauthorized(`Key ${sKeyId} is unauthorized or expired for the current contract`);
  }
  const deserializedKey = designatedKey.data;
  const payloadToSign = blake32Hash2(`${blake32Hash2(additionalData)}${blake32Hash2(serializedMessage)}`);
  try {
    verifySignature(deserializedKey, payloadToSign, signature);
    const message = JSON.parse(serializedMessage);
    return [
      sKeyId,
      message
    ];
  } catch (e) {
    throw new ChelErrorSignatureError(e?.message || e);
  }
};
var signedIncomingData = (contractID, state, data, height, additionalData, mapperFn) => {
  const stringValueFn = () => data;
  let verifySignedValue;
  const verifySignedValueFn = () => {
    if (verifySignedValue) {
      return verifySignedValue[1];
    }
    verifySignedValue = verifySignatureData(state || rootStateFn()[contractID], height, data, additionalData);
    if (mapperFn) verifySignedValue[1] = mapperFn(verifySignedValue[1]);
    return verifySignedValue[1];
  };
  return wrapper({
    get signingKeyId() {
      if (verifySignedValue) return verifySignedValue[0];
      return signedDataKeyId(data);
    },
    get serialize() {
      return stringValueFn;
    },
    get context() {
      return [
        contractID,
        data,
        height,
        additionalData
      ];
    },
    get toString() {
      return () => JSON.stringify(this.serialize());
    },
    get valueOf() {
      return verifySignedValueFn;
    },
    get toJSON() {
      return this.serialize;
    },
    get get() {
      return (k) => k !== "_signedData" ? data[k] : void 0;
    }
  });
};
var signedDataKeyId = (data) => {
  if (!isRawSignedData(data)) {
    throw new ChelErrorSignatureError("Invalid message format");
  }
  return data._signedData[1];
};
var isRawSignedData = (data) => {
  if (!data || typeof data !== "object" || !has(data, "_signedData") || !Array.isArray(data._signedData) || data._signedData.length !== 3 || data._signedData.map((v) => typeof v).filter((v) => v !== "string").length !== 0) {
    return false;
  }
  return true;
};
var rawSignedIncomingData = (data) => {
  if (!isRawSignedData(data)) {
    throw new ChelErrorSignatureError("Invalid message format");
  }
  const stringValueFn = () => data;
  let verifySignedValue;
  const verifySignedValueFn = () => {
    if (verifySignedValue) {
      return verifySignedValue[1];
    }
    verifySignedValue = [
      data._signedData[1],
      JSON.parse(data._signedData[0])
    ];
    return verifySignedValue[1];
  };
  return wrapper({
    get signingKeyId() {
      if (verifySignedValue) return verifySignedValue[0];
      return signedDataKeyId(data);
    },
    get serialize() {
      return stringValueFn;
    },
    get toString() {
      return () => JSON.stringify(this.serialize());
    },
    get valueOf() {
      return verifySignedValueFn;
    },
    get toJSON() {
      return this.serialize;
    },
    get get() {
      return (k) => k !== "_signedData" ? data[k] : void 0;
    }
  });
};

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/encryptedData.mjs
var rootStateFn2 = () => esm_default("chelonia/rootState");
var proto2 = Object.create(null, {
  _isEncryptedData: {
    value: true
  }
});
var wrapper2 = (o) => {
  return Object.setPrototypeOf(o, proto2);
};
var isEncryptedData = (o) => {
  return !!o && !!Object.getPrototypeOf(o)?._isEncryptedData;
};
var decryptData = function(state, height, data, additionalKeys, additionalData, validatorFn) {
  if (!state) {
    throw new ChelErrorDecryptionError("Missing contract state");
  }
  if (typeof data.valueOf === "function") data = data.valueOf();
  if (!isRawEncryptedData(data)) {
    throw new ChelErrorDecryptionError("Invalid message format");
  }
  const [eKeyId, message] = data;
  const key = additionalKeys[eKeyId];
  if (!key) {
    throw new ChelErrorDecryptionKeyNotFound(`Key ${eKeyId} not found`, {
      cause: eKeyId
    });
  }
  const designatedKey = state._vm?.authorizedKeys?.[eKeyId];
  if (!designatedKey || height > designatedKey._notAfterHeight || height < designatedKey._notBeforeHeight || !designatedKey.purpose.includes("enc")) {
    throw new ChelErrorUnexpected(`Key ${eKeyId} is unauthorized or expired for the current contract`);
  }
  const deserializedKey = typeof key === "string" ? deserializeKey(key) : key;
  try {
    const result = JSON.parse(decrypt(deserializedKey, message, additionalData));
    if (typeof validatorFn === "function") validatorFn(result, eKeyId);
    return result;
  } catch (e) {
    throw new ChelErrorDecryptionError(e?.message || e);
  }
};
var encryptedIncomingData = (contractID, state, data, height, additionalKeys, additionalData, validatorFn) => {
  let decryptedValue;
  const decryptedValueFn = () => {
    if (decryptedValue) {
      return decryptedValue;
    }
    if (!state || !additionalKeys) {
      const rootState = rootStateFn2();
      state = state || rootState[contractID];
      additionalKeys = additionalKeys ?? rootState.secretKeys;
    }
    decryptedValue = decryptData(state, height, data, additionalKeys, additionalData || "", validatorFn);
    if (isRawSignedData(decryptedValue)) {
      decryptedValue = signedIncomingData(contractID, state, decryptedValue, height, additionalData || "");
    }
    return decryptedValue;
  };
  return wrapper2({
    get encryptionKeyId() {
      return encryptedDataKeyId(data);
    },
    get serialize() {
      return () => data;
    },
    get toString() {
      return () => JSON.stringify(this.serialize());
    },
    get valueOf() {
      return decryptedValueFn;
    },
    get toJSON() {
      return this.serialize;
    }
  });
};
var encryptedIncomingForeignData = (contractID, _0, data, _1, additionalKeys, additionalData, validatorFn) => {
  let decryptedValue;
  const decryptedValueFn = () => {
    if (decryptedValue) {
      return decryptedValue;
    }
    const rootState = rootStateFn2();
    const state = rootState[contractID];
    decryptedValue = decryptData(state, NaN, data, additionalKeys ?? rootState.secretKeys, additionalData || "", validatorFn);
    if (isRawSignedData(decryptedValue)) {
      return signedIncomingData(contractID, state, decryptedValue, NaN, additionalData || "");
    }
    return decryptedValue;
  };
  return wrapper2({
    get encryptionKeyId() {
      return encryptedDataKeyId(data);
    },
    get serialize() {
      return () => data;
    },
    get toString() {
      return () => JSON.stringify(this.serialize());
    },
    get valueOf() {
      return decryptedValueFn;
    },
    get toJSON() {
      return this.serialize;
    }
  });
};
var encryptedDataKeyId = (data) => {
  if (!isRawEncryptedData(data)) {
    throw new ChelErrorDecryptionError("Invalid message format");
  }
  return data[0];
};
var isRawEncryptedData = (data) => {
  if (!Array.isArray(data) || data.length !== 2 || data.map((v) => typeof v).filter((v) => v !== "string").length !== 0) {
    return false;
  }
  return true;
};
var unwrapMaybeEncryptedData = (data) => {
  if (data == null) return;
  if (isEncryptedData(data)) {
    try {
      return {
        encryptionKeyId: data.encryptionKeyId,
        data: data.valueOf()
      };
    } catch (e) {
      console.warn("unwrapMaybeEncryptedData: Unable to decrypt", e);
    }
  } else {
    return {
      encryptionKeyId: null,
      data
    };
  }
};
var maybeEncryptedIncomingData = (contractID, state, data, height, additionalKeys, additionalData, validatorFn) => {
  if (isRawEncryptedData(data)) {
    return encryptedIncomingData(contractID, state, data, height, additionalKeys, additionalData, validatorFn);
  } else {
    validatorFn?.(data, "");
    return data;
  }
};

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/SPMessage.mjs
var decryptedAndVerifiedDeserializedMessage = (head, headJSON, contractID, parsedMessage, additionalKeys, state) => {
  const op = head.op;
  const height = head.height;
  const message = op === SPMessage.OP_ACTION_ENCRYPTED ? encryptedIncomingData(contractID, state, parsedMessage, height, additionalKeys, headJSON, void 0) : parsedMessage;
  if ([
    SPMessage.OP_KEY_ADD,
    SPMessage.OP_KEY_UPDATE
  ].includes(op)) {
    return message.map((key) => {
      return maybeEncryptedIncomingData(contractID, state, key, height, additionalKeys, headJSON, (key2) => {
        if (key2.meta?.private?.content) {
          key2.meta.private.content = encryptedIncomingData(contractID, state, key2.meta.private.content, height, additionalKeys, headJSON, (value) => {
            const computedKeyId = keyId(value);
            if (computedKeyId !== key2.id) {
              throw new Error(`Key ID mismatch. Expected to decrypt key ID ${key2.id} but got ${computedKeyId}`);
            }
          });
        }
        if (key2.meta?.keyRequest?.reference) {
          try {
            key2.meta.keyRequest.reference = maybeEncryptedIncomingData(contractID, state, key2.meta.keyRequest.reference, height, additionalKeys, headJSON)?.valueOf();
          } catch {
            delete key2.meta.keyRequest.reference;
          }
        }
        if (key2.meta?.keyRequest?.contractID) {
          try {
            key2.meta.keyRequest.contractID = maybeEncryptedIncomingData(contractID, state, key2.meta.keyRequest.contractID, height, additionalKeys, headJSON)?.valueOf();
          } catch {
            delete key2.meta.keyRequest.contractID;
          }
        }
      });
    });
  }
  if (op === SPMessage.OP_CONTRACT) {
    message.keys = message.keys?.map((key) => {
      return maybeEncryptedIncomingData(contractID, state, key, height, additionalKeys, headJSON, (key2) => {
        if (!key2.meta?.private?.content) return;
        const decryptionFn = encryptedIncomingData;
        const decryptionContract = contractID;
        key2.meta.private.content = decryptionFn(decryptionContract, state, key2.meta.private.content, height, additionalKeys, headJSON, (value) => {
          const computedKeyId = keyId(value);
          if (computedKeyId !== key2.id) {
            throw new Error(`Key ID mismatch. Expected to decrypt key ID ${key2.id} but got ${computedKeyId}`);
          }
        });
      });
    });
  }
  if (op === SPMessage.OP_KEY_SHARE) {
    return maybeEncryptedIncomingData(contractID, state, message, height, additionalKeys, headJSON, (message2) => {
      message2.keys?.forEach((key) => {
        if (!key.meta?.private?.content) return;
        const decryptionFn = message2.foreignContractID ? encryptedIncomingForeignData : encryptedIncomingData;
        const decryptionContract = message2.foreignContractID || contractID;
        key.meta.private.content = decryptionFn(decryptionContract, state, key.meta.private.content, height, additionalKeys, headJSON, (value) => {
          const computedKeyId = keyId(value);
          if (computedKeyId !== key.id) {
            throw new Error(`Key ID mismatch. Expected to decrypt key ID ${key.id} but got ${computedKeyId}`);
          }
        });
      });
    });
  }
  if (op === SPMessage.OP_KEY_REQUEST) {
    return maybeEncryptedIncomingData(contractID, state, message, height, additionalKeys, headJSON, (msg) => {
      msg.replyWith = signedIncomingData(msg.contractID, void 0, msg.replyWith, msg.height, headJSON);
    });
  }
  if (op === SPMessage.OP_ACTION_UNENCRYPTED && isRawSignedData(message)) {
    return signedIncomingData(contractID, state, message, height, headJSON);
  }
  if (op === SPMessage.OP_ACTION_ENCRYPTED) {
    return message;
  }
  if (op === SPMessage.OP_KEY_DEL) {
    return message.map((key) => {
      return maybeEncryptedIncomingData(contractID, state, key, height, additionalKeys, headJSON, void 0);
    });
  }
  if (op === SPMessage.OP_KEY_REQUEST_SEEN) {
    return maybeEncryptedIncomingData(contractID, state, parsedMessage, height, additionalKeys, headJSON, void 0);
  }
  if (op === SPMessage.OP_ATOMIC) {
    return message.map(([opT, opV]) => [
      opT,
      decryptedAndVerifiedDeserializedMessage({
        ...head,
        op: opT
      }, headJSON, contractID, opV, additionalKeys, state)
    ]);
  }
  return message;
};
var SPMessage = class _SPMessage {
  // flow type annotations to make flow happy
  _mapping;
  _head;
  _message;
  _signedMessageData;
  _direction;
  _decryptedValue;
  _innerSigningKeyId;
  static OP_CONTRACT = "c";
  static OP_ACTION_ENCRYPTED = "ae";
  static OP_ACTION_UNENCRYPTED = "au";
  static OP_KEY_ADD = "ka";
  static OP_KEY_DEL = "kd";
  static OP_KEY_UPDATE = "ku";
  static OP_PROTOCOL_UPGRADE = "pu";
  static OP_PROP_SET = "ps";
  static OP_PROP_DEL = "pd";
  static OP_CONTRACT_AUTH = "ca";
  static OP_CONTRACT_DEAUTH = "cd";
  static OP_ATOMIC = "a";
  static OP_KEY_SHARE = "ks";
  static OP_KEY_REQUEST = "kr";
  static OP_KEY_REQUEST_SEEN = "krs";
  // eslint-disable-next-line camelcase
  static createV1_0({
    contractID,
    previousHEAD = null,
    previousKeyOp = null,
    // Height will be automatically set to the correct value when sending
    // The reason to set it to Number.MAX_SAFE_INTEGER is so that we can
    // temporarily process outgoing messages with signature validation
    // still working
    height = Number.MAX_SAFE_INTEGER,
    op,
    manifest
  }) {
    const head = {
      version: "1.0.0",
      previousHEAD,
      previousKeyOp,
      height,
      contractID,
      op: op[0],
      manifest
    };
    return new this(messageToParams(head, op[1]));
  }
  // SPMessage.cloneWith could be used when make a SPMessage object having the same id()
  // https://github.com/okTurtles/group-income/issues/1503
  static cloneWith(targetHead, targetOp, sources) {
    const head = Object.assign({}, targetHead, sources);
    return new this(messageToParams(head, targetOp[1]));
  }
  static deserialize(value, additionalKeys, state, unwrapMaybeEncryptedDataFn = unwrapMaybeEncryptedData) {
    if (!value) throw new Error(`deserialize bad value: ${value}`);
    const { head: headJSON, ...parsedValue } = JSON.parse(value);
    const head = JSON.parse(headJSON);
    const contractID = head.op === _SPMessage.OP_CONTRACT ? createCID(value, multicodes.SHELTER_CONTRACT_DATA) : head.contractID;
    if (!state?._vm?.authorizedKeys && head.op === _SPMessage.OP_CONTRACT) {
      const value2 = rawSignedIncomingData(parsedValue);
      const authorizedKeys = Object.fromEntries(value2.valueOf()?.keys.map((wk) => {
        const k = unwrapMaybeEncryptedDataFn(wk);
        if (!k) return null;
        return [
          k.data.id,
          k.data
        ];
      }).filter(Boolean));
      state = {
        _vm: {
          type: head.type,
          authorizedKeys
        }
      };
    }
    const signedMessageData = signedIncomingData(contractID, state, parsedValue, head.height, headJSON, (message) => decryptedAndVerifiedDeserializedMessage(head, headJSON, contractID, message, additionalKeys, state));
    return new this({
      direction: "incoming",
      mapping: {
        key: createCID(value, multicodes.SHELTER_CONTRACT_DATA),
        value
      },
      head,
      signedMessageData
    });
  }
  static deserializeHEAD(value) {
    if (!value) throw new Error(`deserialize bad value: ${value}`);
    let head, hash3;
    const result = {
      get head() {
        if (head === void 0) {
          head = JSON.parse(JSON.parse(value).head);
        }
        return head;
      },
      get hash() {
        if (!hash3) {
          hash3 = createCID(value, multicodes.SHELTER_CONTRACT_DATA);
        }
        return hash3;
      },
      get contractID() {
        return result.head?.contractID ?? result.hash;
      },
      // `description` is not a getter to prevent the value from being copied
      // if the object is cloned or serialized
      description() {
        const type = this.head.op;
        return `<op_${type}|${this.hash} of ${this.contractID}>`;
      },
      get isFirstMessage() {
        return !result.head?.contractID;
      }
    };
    return result;
  }
  constructor(params) {
    this._direction = params.direction;
    this._mapping = params.mapping;
    this._head = params.head;
    this._signedMessageData = params.signedMessageData;
    const type = this.opType();
    let atomicTopLevel = true;
    const validate = (type2, message) => {
      switch (type2) {
        case _SPMessage.OP_CONTRACT:
          if (!this.isFirstMessage() || !atomicTopLevel) {
            throw new Error("OP_CONTRACT: must be first message");
          }
          break;
        case _SPMessage.OP_ATOMIC:
          if (!atomicTopLevel) {
            throw new Error("OP_ATOMIC not allowed inside of OP_ATOMIC");
          }
          if (!Array.isArray(message)) {
            throw new TypeError("OP_ATOMIC must be of an array type");
          }
          atomicTopLevel = false;
          message.forEach(([t, m]) => validate(t, m));
          break;
        case _SPMessage.OP_KEY_ADD:
        case _SPMessage.OP_KEY_DEL:
        case _SPMessage.OP_KEY_UPDATE:
          if (!Array.isArray(message)) {
            throw new TypeError("OP_KEY_{ADD|DEL|UPDATE} must be of an array type");
          }
          break;
        case _SPMessage.OP_KEY_SHARE:
        case _SPMessage.OP_KEY_REQUEST:
        case _SPMessage.OP_KEY_REQUEST_SEEN:
        case _SPMessage.OP_ACTION_ENCRYPTED:
        case _SPMessage.OP_ACTION_UNENCRYPTED:
          break;
        default:
          throw new Error(`unsupported op: ${type2}`);
      }
    };
    Object.defineProperty(this, "_message", {
      get: /* @__PURE__ */ ((validated) => () => {
        const message = this._signedMessageData.valueOf();
        if (!validated) {
          validate(type, message);
          validated = true;
        }
        return message;
      })()
    });
  }
  decryptedValue() {
    if (this._decryptedValue) return this._decryptedValue;
    try {
      const value = this.message();
      const data = unwrapMaybeEncryptedData(value);
      if (data?.data) {
        if (isSignedData(data.data)) {
          this._innerSigningKeyId = data.data.signingKeyId;
          this._decryptedValue = data.data.valueOf();
        } else {
          this._decryptedValue = data.data;
        }
      }
      return this._decryptedValue;
    } catch {
      return void 0;
    }
  }
  innerSigningKeyId() {
    if (!this._decryptedValue) {
      this.decryptedValue();
    }
    return this._innerSigningKeyId;
  }
  head() {
    return this._head;
  }
  message() {
    return this._message;
  }
  op() {
    return [
      this.head().op,
      this.message()
    ];
  }
  rawOp() {
    return [
      this.head().op,
      this._signedMessageData
    ];
  }
  opType() {
    return this.head().op;
  }
  opValue() {
    return this.message();
  }
  signingKeyId() {
    return this._signedMessageData.signingKeyId;
  }
  manifest() {
    return this.head().manifest;
  }
  description() {
    const type = this.opType();
    let desc = `<op_${type}`;
    if (type === _SPMessage.OP_ACTION_UNENCRYPTED) {
      try {
        const value = this.opValue().valueOf();
        if (typeof value.action === "string") {
          desc += `|${value.action}`;
        }
      } catch (e) {
        console.warn("Error on .description()", this.hash(), e);
      }
    }
    return `${desc}|${this.hash()} of ${this.contractID()}>`;
  }
  isFirstMessage() {
    return !this.head().contractID;
  }
  contractID() {
    return this.head().contractID || this.hash();
  }
  serialize() {
    return this._mapping.value;
  }
  hash() {
    return this._mapping.key;
  }
  previousKeyOp() {
    return this._head.previousKeyOp;
  }
  height() {
    return this._head.height;
  }
  id() {
    throw new Error("SPMessage.id() was called but it has been removed");
  }
  direction() {
    return this._direction;
  }
  // `isKeyOp` is used to filter out non-key operations for providing an
  // abbreviated chain fo snapshot validation
  isKeyOp() {
    let value;
    return !!(keyOps.includes(this.opType()) || this.opType() === _SPMessage.OP_ATOMIC && Array.isArray(value = this.opValue()) && value.some(([opT]) => {
      return keyOps.includes(opT);
    }));
  }
  static get [serdesTagSymbol]() {
    return "SPMessage";
  }
  static [serdesSerializeSymbol](m) {
    return [
      m.serialize(),
      m.direction(),
      m.decryptedValue(),
      m.innerSigningKeyId()
    ];
  }
  static [serdesDeserializeSymbol]([serialized, direction, decryptedValue, innerSigningKeyId]) {
    const m = _SPMessage.deserialize(serialized);
    m._direction = direction;
    m._decryptedValue = decryptedValue;
    m._innerSigningKeyId = innerSigningKeyId;
    return m;
  }
};
function messageToParams(head, message) {
  let mapping;
  return {
    direction: has(message, "recreate") ? "outgoing" : "incoming",
    // Lazy computation of mapping to prevent us from serializing outgoing
    // atomic operations
    get mapping() {
      if (!mapping) {
        const headJSON = JSON.stringify(head);
        const messageJSON = {
          ...message.serialize(headJSON),
          head: headJSON
        };
        const value = JSON.stringify(messageJSON);
        mapping = {
          key: createCID(value, multicodes.SHELTER_CONTRACT_DATA),
          value
        };
      }
      return mapping;
    },
    head,
    signedMessageData: message
  };
}
var keyOps = [
  SPMessage.OP_CONTRACT,
  SPMessage.OP_KEY_ADD,
  SPMessage.OP_KEY_DEL,
  SPMessage.OP_KEY_UPDATE
];

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/db.mjs
var headPrefix = "head=";
var getContractIdFromLogHead = (key) => {
  if (!key.startsWith(headPrefix)) return;
  return key.slice(headPrefix.length);
};
var getLogHead = (contractID) => `${headPrefix}${contractID}`;
var checkKey = (key) => {
  if (/[\x00-\x1f\x7f\t\\/<>:"|?*]/.test(key)) {
    throw new Error(`bad key: ${JSON.stringify(key)}`);
  }
};
var parsePrefixableKey = (key) => {
  const i = key.indexOf(":");
  if (i === -1) {
    return [
      "",
      key
    ];
  }
  const prefix = key.slice(0, i + 1);
  if (prefix in prefixHandlers) {
    return [
      prefix,
      key.slice(prefix.length)
    ];
  }
  throw new ChelErrorDBConnection(`Unknown prefix in '${key}'.`);
};
var prefixHandlers = {
  // Decode buffers, but don't transform other values.
  "": (value) => Buffer3.isBuffer(value) ? value.toString("utf8") : value,
  "any:": (value) => value
};
esm_default("sbp/selectors/unsafe", [
  "chelonia.db/get",
  "chelonia.db/set",
  "chelonia.db/delete"
]);
var dbPrimitiveSelectors = process.env.LIGHTWEIGHT_CLIENT === "true" ? {
  "chelonia.db/get": function(key) {
    const id = getContractIdFromLogHead(key);
    if (!id) return Promise.resolve();
    const state = esm_default("chelonia/rootState").contracts[id];
    const value = state?.HEAD ? JSON.stringify({
      HEAD: state.HEAD,
      height: state.height,
      previousKeyOp: state.previousKeyOp
    }) : void 0;
    return Promise.resolve(value);
  },
  "chelonia.db/set": function() {
    return Promise.resolve();
  },
  "chelonia.db/delete": function() {
    return Promise.resolve(true);
  }
} : {
  // eslint-disable-next-line require-await
  "chelonia.db/get": async function(prefixableKey) {
    const [prefix, key] = parsePrefixableKey(prefixableKey);
    const value = esm_default("okTurtles.data/get", key);
    if (value === void 0) {
      return;
    }
    return prefixHandlers[prefix](value);
  },
  // eslint-disable-next-line require-await
  "chelonia.db/set": async function(key, value) {
    checkKey(key);
    return esm_default("okTurtles.data/set", key, value);
  },
  // eslint-disable-next-line require-await
  "chelonia.db/delete": async function(key) {
    return esm_default("okTurtles.data/delete", key);
  }
};
var db_default = esm_default("sbp/selectors/register", {
  ...dbPrimitiveSelectors,
  "chelonia/db/getEntryMeta": async (contractID, height) => {
    const entryMetaJson = await esm_default("chelonia.db/get", `_private_hidx=${contractID}#${height}`);
    if (!entryMetaJson) return;
    return JSON.parse(entryMetaJson);
  },
  "chelonia/db/setEntryMeta": async (contractID, height, entryMeta) => {
    const entryMetaJson = JSON.stringify(entryMeta);
    await esm_default("chelonia.db/set", `_private_hidx=${contractID}#${height}`, entryMetaJson);
  },
  "chelonia/db/latestHEADinfo": async (contractID) => {
    const r = await esm_default("chelonia.db/get", getLogHead(contractID));
    return r && JSON.parse(r);
  },
  "chelonia/db/deleteLatestHEADinfo": (contractID) => {
    return esm_default("chelonia.db/set", getLogHead(contractID), "");
  },
  "chelonia/db/getEntry": async function(hash3) {
    try {
      const value = await esm_default("chelonia.db/get", hash3);
      if (!value) throw new Error(`no entry for ${hash3}!`);
      return SPMessage.deserialize(value, this.transientSecretKeys, void 0, this.config.unwrapMaybeEncryptedData);
    } catch (e) {
      throw new ChelErrorDBConnection(`${e.name} during getEntry: ${e.message}`);
    }
  },
  "chelonia/db/addEntry": function(entry) {
    return esm_default("okTurtles.eventQueue/queueEvent", `chelonia/db/${entry.contractID()}`, [
      "chelonia/private/db/addEntry",
      entry
    ]);
  },
  // NEVER call this directly yourself! _always_ call 'chelonia/db/addEntry' instead
  "chelonia/private/db/addEntry": async function(entry) {
    try {
      const { previousHEAD: entryPreviousHEAD, previousKeyOp: entryPreviousKeyOp, height: entryHeight } = entry.head();
      const contractID = entry.contractID();
      if (await esm_default("chelonia.db/get", entry.hash())) {
        console.warn(`[chelonia.db] entry exists: ${entry.hash()}`);
        return entry.hash();
      }
      const HEADinfo = await esm_default("chelonia/db/latestHEADinfo", contractID);
      if (!entry.isFirstMessage()) {
        if (!HEADinfo) {
          throw new Error(`No latest HEAD for ${contractID} when attempting to process entry with previous HEAD ${entryPreviousHEAD} at height ${entryHeight}`);
        }
        const { HEAD: contractHEAD, previousKeyOp: contractPreviousKeyOp, height: contractHeight } = HEADinfo;
        if (entryPreviousHEAD !== contractHEAD) {
          console.warn(`[chelonia.db] bad previousHEAD: ${entryPreviousHEAD}! Expected: ${contractHEAD} for contractID: ${contractID}`);
          throw new ChelErrorDBBadPreviousHEAD(`bad previousHEAD: ${entryPreviousHEAD}. Expected ${contractHEAD} for contractID: ${contractID}`);
        } else if (entryPreviousKeyOp !== contractPreviousKeyOp) {
          console.error(`[chelonia.db] bad previousKeyOp: ${entryPreviousKeyOp}! Expected: ${contractPreviousKeyOp} for contractID: ${contractID}`);
          throw new ChelErrorDBBadPreviousHEAD(`bad previousKeyOp: ${entryPreviousKeyOp}. Expected ${contractPreviousKeyOp} for contractID: ${contractID}`);
        } else if (!Number.isSafeInteger(entryHeight) || entryHeight !== contractHeight + 1) {
          console.error(`[chelonia.db] bad height: ${entryHeight}! Expected: ${contractHeight + 1} for contractID: ${contractID}`);
          throw new ChelErrorDBBadPreviousHEAD(`[chelonia.db] bad height: ${entryHeight}! Expected: ${contractHeight + 1} for contractID: ${contractID}`);
        }
      } else {
        if (HEADinfo) {
          console.error(`[chelonia.db] bad previousHEAD: ${entryPreviousHEAD}! Expected: <null> for contractID: ${contractID}`);
          throw new ChelErrorDBBadPreviousHEAD(`bad previousHEAD: ${entryPreviousHEAD}. Expected <null> for contractID: ${contractID}`);
        } else if (entryHeight !== 0) {
          console.error(`[chelonia.db] bad height: ${entryHeight}! Expected: 0 for contractID: ${contractID}`);
          throw new ChelErrorDBBadPreviousHEAD(`[chelonia.db] bad height: ${entryHeight}! Expected: 0 for contractID: ${contractID}`);
        }
      }
      await esm_default("chelonia.db/set", entry.hash(), entry.serialize());
      await esm_default("chelonia.db/set", getLogHead(contractID), JSON.stringify({
        HEAD: entry.hash(),
        previousKeyOp: entry.isKeyOp() ? entry.hash() : entry.previousKeyOp(),
        height: entry.height()
      }));
      console.debug(`[chelonia.db] HEAD for ${contractID} updated to:`, entry.hash());
      await esm_default("chelonia/db/setEntryMeta", contractID, entryHeight, {
        // The hash is used for reverse lookups (height to CID)
        hash: entry.hash(),
        // The date isn't currently used, but will be used for filtering messages
        date: (/* @__PURE__ */ new Date()).toISOString(),
        // isKeyOp is used for filtering messages (the actual filtering is
        // done more efficiently a separate index key, but `isKeyOp` allows
        // us to bootstrap this process without having to load the full message)
        // The separate index key bears the prefix `_private_keyop_idx_`.
        ...entry.isKeyOp() && {
          isKeyOp: true
        }
      });
      return entry.hash();
    } catch (e) {
      if (e.name.includes("ErrorDB")) {
        throw e;
      }
      throw new ChelErrorDBConnection(`${e.name} during addEntry: ${e.message}`);
    }
  },
  "chelonia/db/lastEntry": async function(contractID) {
    try {
      const latestHEADinfo = await esm_default("chelonia/db/latestHEADinfo", contractID);
      if (!latestHEADinfo) throw new Error(`contract ${contractID} has no latest hash!`);
      return esm_default("chelonia/db/getEntry", latestHEADinfo.HEAD);
    } catch (e) {
      throw new ChelErrorDBConnection(`${e.name} during lastEntry: ${e.message}`);
    }
  }
});

// deno:https://jsr.io/@db/sqlite/0.12.0/deno.json
var deno_default = {
  name: "@db/sqlite",
  version: "0.12.0",
  github: "https://github.com/denodrivers/sqlite3",
  exports: "./mod.ts",
  exclude: [
    "sqlite",
    "scripts"
  ],
  tasks: {
    test: "deno test --unstable-ffi -A test/test.ts",
    build: "deno run -A scripts/build.ts",
    "bench-deno": "deno run -A --unstable-ffi bench/bench_deno.js 50 1000000",
    "bench-deno-ffi": "deno run -A --unstable-ffi bench/bench_deno_ffi.js 50 1000000",
    "bench-deno-wasm": "deno run -A --unstable-ffi bench/bench_deno_wasm.js 50 1000000",
    "bench-node": "node bench/bench_node.js 50 1000000",
    "bench-bun": "bun run bench/bench_bun.js 50 1000000",
    "bench-bun-ffi": "bun run bench/bench_bun_ffi.js 50 1000000",
    "bench-c": "./bench/bench 50 1000000",
    "bench-python": "python ./bench/bench_python.py",
    "bench:northwind": "deno bench -A --unstable-ffi bench/northwind/deno.js",
    "bench-wasm:northwind": "deno run -A --unstable-ffi bench/northwind/deno_wasm.js",
    "bench-node:northwind": "node bench/northwind/node.mjs",
    "bench-bun:northwind": "bun run bench/northwind/bun.js"
  },
  fmt: {
    exclude: [
      "sqlite"
    ]
  },
  lint: {
    rules: {
      exclude: [
        "camelcase",
        "no-explicit-any"
      ],
      include: [
        "explicit-function-return-type",
        "eqeqeq",
        "explicit-module-boundary-types"
      ]
    }
  }
};

// deno:https://jsr.io/@std/path/0.217.0/_common/from_file_url.ts
function assertArg3(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return url;
}

// deno:https://jsr.io/@std/path/0.217.0/windows/from_file_url.ts
function fromFileUrl(url) {
  url = assertArg3(url);
  let path2 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname !== "") {
    path2 = `\\\\${url.hostname}${path2}`;
  }
  return path2;
}

// deno:https://jsr.io/@std/path/0.217.0/posix/from_file_url.ts
function fromFileUrl2(url) {
  url = assertArg3(url);
  return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}

// deno:https://jsr.io/@std/path/0.217.0/_os.ts
var osType = (() => {
  const { Deno: Deno3 } = globalThis;
  if (typeof Deno3?.build?.os === "string") {
    return Deno3.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win")) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";

// deno:https://jsr.io/@std/path/0.217.0/from_file_url.ts
function fromFileUrl3(url) {
  return isWindows ? fromFileUrl(url) : fromFileUrl2(url);
}

// deno:https://jsr.io/@std/internal/1.0.10/_os.ts
function checkWindows() {
  const global2 = globalThis;
  const os = global2.Deno?.build?.os;
  return typeof os === "string" ? os === "windows" : global2.navigator?.platform?.startsWith("Win") ?? global2.process?.platform?.startsWith("win") ?? false;
}

// deno:https://jsr.io/@std/internal/1.0.10/os.ts
var isWindows2 = checkWindows();

// deno:https://jsr.io/@std/path/1.1.1/_common/assert_path.ts
function assertPath2(path2) {
  if (typeof path2 !== "string") {
    throw new TypeError(`Path must be a string, received "${JSON.stringify(path2)}"`);
  }
}

// deno:https://jsr.io/@std/path/1.1.1/_common/from_file_url.ts
function assertArg5(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol !== "file:") {
    throw new TypeError(`URL must be a file URL: received "${url.protocol}"`);
  }
  return url;
}

// deno:https://jsr.io/@std/path/1.1.1/posix/from_file_url.ts
function fromFileUrl4(url) {
  url = assertArg5(url);
  return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}

// deno:https://jsr.io/@std/path/1.1.1/_common/strip_trailing_separators.ts
function stripTrailingSeparators2(segment, isSep) {
  if (segment.length <= 1) {
    return segment;
  }
  let end = segment.length;
  for (let i = segment.length - 1; i > 0; i--) {
    if (isSep(segment.charCodeAt(i))) {
      end = i;
    } else {
      break;
    }
  }
  return segment.slice(0, end);
}

// deno:https://jsr.io/@std/path/1.1.1/_common/constants.ts
var CHAR_UPPERCASE_A2 = 65;
var CHAR_LOWERCASE_A2 = 97;
var CHAR_UPPERCASE_Z2 = 90;
var CHAR_LOWERCASE_Z2 = 122;
var CHAR_DOT2 = 46;
var CHAR_FORWARD_SLASH2 = 47;
var CHAR_BACKWARD_SLASH2 = 92;
var CHAR_COLON2 = 58;

// deno:https://jsr.io/@std/path/1.1.1/posix/_util.ts
function isPosixPathSeparator3(code2) {
  return code2 === CHAR_FORWARD_SLASH2;
}

// deno:https://jsr.io/@std/path/1.1.1/windows/_util.ts
function isPosixPathSeparator4(code2) {
  return code2 === CHAR_FORWARD_SLASH2;
}
function isPathSeparator2(code2) {
  return code2 === CHAR_FORWARD_SLASH2 || code2 === CHAR_BACKWARD_SLASH2;
}
function isWindowsDeviceRoot2(code2) {
  return code2 >= CHAR_LOWERCASE_A2 && code2 <= CHAR_LOWERCASE_Z2 || code2 >= CHAR_UPPERCASE_A2 && code2 <= CHAR_UPPERCASE_Z2;
}

// deno:https://jsr.io/@std/path/1.1.1/windows/from_file_url.ts
function fromFileUrl5(url) {
  url = assertArg5(url);
  let path2 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname !== "") {
    path2 = `\\\\${url.hostname}${path2}`;
  }
  return path2;
}

// deno:https://jsr.io/@std/path/1.1.1/_common/dirname.ts
function assertArg6(path2) {
  assertPath2(path2);
  if (path2.length === 0) return ".";
}

// deno:https://jsr.io/@std/path/1.1.1/posix/dirname.ts
function dirname3(path2) {
  if (path2 instanceof URL) {
    path2 = fromFileUrl4(path2);
  }
  assertArg6(path2);
  let end = -1;
  let matchedNonSeparator = false;
  for (let i = path2.length - 1; i >= 1; --i) {
    if (isPosixPathSeparator3(path2.charCodeAt(i))) {
      if (matchedNonSeparator) {
        end = i;
        break;
      }
    } else {
      matchedNonSeparator = true;
    }
  }
  if (end === -1) {
    return isPosixPathSeparator3(path2.charCodeAt(0)) ? "/" : ".";
  }
  return stripTrailingSeparators2(path2.slice(0, end), isPosixPathSeparator3);
}

// deno:https://jsr.io/@std/path/1.1.1/windows/dirname.ts
function dirname4(path2) {
  if (path2 instanceof URL) {
    path2 = fromFileUrl5(path2);
  }
  assertArg6(path2);
  const len = path2.length;
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code2 = path2.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code2)) {
      rootEnd = offset = 1;
      if (isPathSeparator2(path2.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path2.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path2.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path2.charCodeAt(j))) break;
            }
            if (j === len) {
              return path2;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code2)) {
      if (path2.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator2(path2.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator2(code2)) {
    return path2;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator2(path2.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return stripTrailingSeparators2(path2.slice(0, end), isPosixPathSeparator4);
}

// deno:https://jsr.io/@std/path/1.1.1/dirname.ts
function dirname5(path2) {
  return isWindows2 ? dirname4(path2) : dirname3(path2);
}

// deno:https://jsr.io/@std/path/1.1.1/posix/extname.ts
function extname3(path2) {
  if (path2 instanceof URL) {
    path2 = fromFileUrl4(path2);
  }
  assertPath2(path2);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path2.length - 1; i >= 0; --i) {
    const code2 = path2.charCodeAt(i);
    if (isPosixPathSeparator3(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path2.slice(startDot, end);
}

// deno:https://jsr.io/@std/path/1.1.1/windows/extname.ts
function extname4(path2) {
  if (path2 instanceof URL) {
    path2 = fromFileUrl5(path2);
  }
  assertPath2(path2);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path2.length >= 2 && path2.charCodeAt(1) === CHAR_COLON2 && isWindowsDeviceRoot2(path2.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path2.length - 1; i >= start; --i) {
    const code2 = path2.charCodeAt(i);
    if (isPathSeparator2(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path2.slice(startDot, end);
}

// deno:https://jsr.io/@std/path/1.1.1/extname.ts
function extname5(path2) {
  return isWindows2 ? extname4(path2) : extname3(path2);
}

// deno:https://jsr.io/@std/path/1.1.1/from_file_url.ts
function fromFileUrl6(url) {
  return isWindows2 ? fromFileUrl5(url) : fromFileUrl4(url);
}

// deno:https://jsr.io/@std/path/1.1.1/posix/is_absolute.ts
function isAbsolute3(path2) {
  assertPath2(path2);
  return path2.length > 0 && isPosixPathSeparator3(path2.charCodeAt(0));
}

// deno:https://jsr.io/@std/path/1.1.1/windows/is_absolute.ts
function isAbsolute4(path2) {
  assertPath2(path2);
  const len = path2.length;
  if (len === 0) return false;
  const code2 = path2.charCodeAt(0);
  if (isPathSeparator2(code2)) {
    return true;
  } else if (isWindowsDeviceRoot2(code2)) {
    if (len > 2 && path2.charCodeAt(1) === CHAR_COLON2) {
      if (isPathSeparator2(path2.charCodeAt(2))) return true;
    }
  }
  return false;
}

// deno:https://jsr.io/@std/path/1.1.1/is_absolute.ts
function isAbsolute5(path2) {
  return isWindows2 ? isAbsolute4(path2) : isAbsolute3(path2);
}

// deno:https://jsr.io/@std/path/1.1.1/_common/normalize.ts
function assertArg8(path2) {
  assertPath2(path2);
  if (path2.length === 0) return ".";
}

// deno:https://jsr.io/@std/path/1.1.1/_common/normalize_string.ts
function normalizeString2(path2, allowAboveRoot, separator, isPathSeparator3) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code2;
  for (let i = 0; i <= path2.length; ++i) {
    if (i < path2.length) code2 = path2.charCodeAt(i);
    else if (isPathSeparator3(code2)) break;
    else code2 = CHAR_FORWARD_SLASH2;
    if (isPathSeparator3(code2)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT2 || res.charCodeAt(res.length - 2) !== CHAR_DOT2) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path2.slice(lastSlash + 1, i);
        else res = path2.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code2 === CHAR_DOT2 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

// deno:https://jsr.io/@std/path/1.1.1/posix/normalize.ts
function normalize3(path2) {
  if (path2 instanceof URL) {
    path2 = fromFileUrl4(path2);
  }
  assertArg8(path2);
  const isAbsolute6 = isPosixPathSeparator3(path2.charCodeAt(0));
  const trailingSeparator = isPosixPathSeparator3(path2.charCodeAt(path2.length - 1));
  path2 = normalizeString2(path2, !isAbsolute6, "/", isPosixPathSeparator3);
  if (path2.length === 0 && !isAbsolute6) path2 = ".";
  if (path2.length > 0 && trailingSeparator) path2 += "/";
  if (isAbsolute6) return `/${path2}`;
  return path2;
}

// deno:https://jsr.io/@std/path/1.1.1/posix/join.ts
function join3(path2, ...paths) {
  if (path2 === void 0) return ".";
  if (path2 instanceof URL) {
    path2 = fromFileUrl4(path2);
  }
  paths = path2 ? [
    path2,
    ...paths
  ] : paths;
  paths.forEach((path3) => assertPath2(path3));
  const joined = paths.filter((path3) => path3.length > 0).join("/");
  return joined === "" ? "." : normalize3(joined);
}

// deno:https://jsr.io/@std/path/1.1.1/windows/normalize.ts
function normalize4(path2) {
  if (path2 instanceof URL) {
    path2 = fromFileUrl5(path2);
  }
  assertArg8(path2);
  const len = path2.length;
  let rootEnd = 0;
  let device;
  let isAbsolute6 = false;
  const code2 = path2.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code2)) {
      isAbsolute6 = true;
      if (isPathSeparator2(path2.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path2.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path2.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path2.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path2.charCodeAt(j))) break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path2.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot2(code2)) {
      if (path2.charCodeAt(1) === CHAR_COLON2) {
        device = path2.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path2.charCodeAt(2))) {
            isAbsolute6 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator2(code2)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString2(path2.slice(rootEnd), !isAbsolute6, "\\", isPathSeparator2);
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute6) tail = ".";
  if (tail.length > 0 && isPathSeparator2(path2.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute6) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    }
    return tail;
  } else if (isAbsolute6) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  }
  return device + tail;
}

// deno:https://jsr.io/@std/path/1.1.1/windows/join.ts
function join4(path2, ...paths) {
  if (path2 instanceof URL) {
    path2 = fromFileUrl5(path2);
  }
  paths = path2 ? [
    path2,
    ...paths
  ] : paths;
  paths.forEach((path3) => assertPath2(path3));
  paths = paths.filter((path3) => path3.length > 0);
  if (paths.length === 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  const firstPart = paths[0];
  if (isPathSeparator2(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator2(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  let joined = paths.join("\\");
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize4(joined);
}

// deno:https://jsr.io/@std/path/1.1.1/join.ts
function join5(path2, ...paths) {
  return isWindows2 ? join4(path2, ...paths) : join3(path2, ...paths);
}

// deno:https://jsr.io/@std/path/1.1.1/normalize.ts
function normalize5(path2) {
  return isWindows2 ? normalize4(path2) : normalize3(path2);
}

// deno:https://jsr.io/@std/path/1.1.1/posix/resolve.ts
function resolve3(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path2;
    if (i >= 0) path2 = pathSegments[i];
    else {
      const { Deno: Deno3 } = globalThis;
      if (typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a current working directory (CWD)");
      }
      path2 = Deno3.cwd();
    }
    assertPath2(path2);
    if (path2.length === 0) {
      continue;
    }
    resolvedPath = `${path2}/${resolvedPath}`;
    resolvedAbsolute = isPosixPathSeparator3(path2.charCodeAt(0));
  }
  resolvedPath = normalizeString2(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator3);
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}

// deno:https://jsr.io/@std/path/1.1.1/windows/resolve.ts
function resolve4(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path2;
    const { Deno: Deno3 } = globalThis;
    if (i >= 0) {
      path2 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a current working directory (CWD)");
      }
      path2 = Deno3.cwd();
    } else {
      if (typeof Deno3?.env?.get !== "function" || typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a current working directory (CWD)");
      }
      path2 = Deno3.cwd();
      if (path2 === void 0 || path2.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path2 = `${resolvedDevice}\\`;
      }
    }
    assertPath2(path2);
    const len = path2.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute6 = false;
    const code2 = path2.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator2(code2)) {
        isAbsolute6 = true;
        if (isPathSeparator2(path2.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator2(path2.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            const firstPart = path2.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator2(path2.charCodeAt(j))) break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator2(path2.charCodeAt(j))) break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path2.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot2(code2)) {
        if (path2.charCodeAt(1) === CHAR_COLON2) {
          device = path2.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator2(path2.charCodeAt(2))) {
              isAbsolute6 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator2(code2)) {
      rootEnd = 1;
      isAbsolute6 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path2.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute6;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString2(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator2);
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}

// deno:https://jsr.io/@std/path/1.1.1/resolve.ts
function resolve5(...pathSegments) {
  return isWindows2 ? resolve4(...pathSegments) : resolve3(...pathSegments);
}

// deno:https://jsr.io/@std/path/1.1.1/_common/to_file_url.ts
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace2(string) {
  return string.replaceAll(/[\s]/g, (c) => {
    return WHITESPACE_ENCODINGS[c] ?? c;
  });
}

// deno:https://jsr.io/@std/path/1.1.1/posix/to_file_url.ts
function toFileUrl3(path2) {
  if (!isAbsolute3(path2)) {
    throw new TypeError(`Path must be absolute: received "${path2}"`);
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(path2.replace(/%/g, "%25").replace(/\\/g, "%5C"));
  return url;
}

// deno:https://jsr.io/@std/path/1.1.1/windows/to_file_url.ts
function toFileUrl4(path2) {
  if (!isAbsolute4(path2)) {
    throw new TypeError(`Path must be absolute: received "${path2}"`);
  }
  const [, hostname, pathname] = path2.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(pathname.replace(/%/g, "%25"));
  if (hostname !== void 0 && hostname !== "localhost") {
    url.hostname = hostname;
    if (!url.hostname) {
      throw new TypeError(`Invalid hostname: "${url.hostname}"`);
    }
  }
  return url;
}

// deno:https://jsr.io/@std/path/1.1.1/to_file_url.ts
function toFileUrl5(path2) {
  return isWindows2 ? toFileUrl4(path2) : toFileUrl3(path2);
}

// deno:https://jsr.io/@std/fs/1.0.19/_get_file_info_type.ts
function getFileInfoType(fileInfo) {
  return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : void 0;
}

// deno:https://jsr.io/@std/fs/1.0.19/ensure_dir.ts
async function ensureDir(dir) {
  try {
    const fileInfo = await Deno.stat(dir);
    throwIfNotDirectory(fileInfo);
    return;
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
  try {
    await Deno.mkdir(dir, {
      recursive: true
    });
  } catch (err) {
    if (!(err instanceof Deno.errors.AlreadyExists)) {
      throw err;
    }
    const fileInfo = await Deno.stat(dir);
    throwIfNotDirectory(fileInfo);
  }
}
function throwIfNotDirectory(fileInfo) {
  if (!fileInfo.isDirectory) {
    throw new Error(`Failed to ensure directory exists: expected 'dir', got '${getFileInfoType(fileInfo)}'`);
  }
}

// deno:https://jsr.io/@std/fs/1.0.19/move.ts
var EXISTS_ERROR = new Deno.errors.AlreadyExists("dest already exists.");

// deno:https://jsr.io/@std/fs/1.0.19/eol.ts
var LF = "\n";
var CRLF = "\r\n";
var EOL = globalThis.Deno?.build.os === "windows" ? CRLF : LF;

// deno:https://jsr.io/@std/fmt/1.0.8/colors.ts
var { Deno: Deno2 } = globalThis;
var noColor = typeof Deno2?.noColor === "boolean" ? Deno2.noColor : false;
var enabled = !noColor;
function code(open, close) {
  return {
    open: `\x1B[${open.join(";")}m`,
    close: `\x1B[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run(str, code2) {
  return enabled ? `${code2.open}${str.replace(code2.regexp, code2.open)}${code2.close}` : str;
}
function green(str) {
  return run(str, code([
    32
  ], 39));
}
var ANSI_PATTERN = new RegExp([
  "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
  "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TXZcf-nq-uy=><~]))"
].join("|"), "g");

// deno:https://jsr.io/@std/encoding/1.0.10/_common16.ts
var alphabet = new TextEncoder().encode("0123456789abcdef");
var rAlphabet = new Uint8Array(128).fill(16);
alphabet.forEach((byte, i) => rAlphabet[byte] = i);
new TextEncoder().encode("ABCDEF").forEach((byte, i) => rAlphabet[byte] = i + 10);
function calcSizeHex(originalSize) {
  return originalSize * 2;
}
function encode3(buffer, i, o, alphabet3) {
  for (; i < buffer.length; ++i) {
    const x = buffer[i];
    buffer[o++] = alphabet3[x >> 4];
    buffer[o++] = alphabet3[x & 15];
  }
  return o;
}

// deno:https://jsr.io/@std/encoding/1.0.10/_common_detach.ts
function detach(buffer, maxSize) {
  const originalSize = buffer.length;
  if (buffer.byteOffset) {
    const b = new Uint8Array(buffer.buffer);
    b.set(buffer);
    buffer = b.subarray(0, originalSize);
  }
  buffer = new Uint8Array(buffer.buffer.transfer(maxSize));
  buffer.set(buffer.subarray(0, originalSize), maxSize - originalSize);
  return [
    buffer,
    maxSize - originalSize
  ];
}

// deno:https://jsr.io/@std/encoding/1.0.10/hex.ts
var alphabet2 = new TextEncoder().encode("0123456789abcdef");
var rAlphabet2 = new Uint8Array(128).fill(16);
alphabet2.forEach((byte, i) => rAlphabet2[byte] = i);
new TextEncoder().encode("ABCDEF").forEach((byte, i) => rAlphabet2[byte] = i + 10);
function encodeHex(src2) {
  if (typeof src2 === "string") {
    src2 = new TextEncoder().encode(src2);
  } else if (src2 instanceof ArrayBuffer) src2 = new Uint8Array(src2).slice();
  else src2 = src2.slice();
  const [output, i] = detach(src2, calcSizeHex(src2.length));
  encode3(output, i, 0, alphabet2);
  return new TextDecoder().decode(output);
}

// deno:https://jsr.io/@denosaurs/plug/1.1.0/util.ts
var encoder = new TextEncoder();
function baseUrlToFilename(url) {
  const out = [];
  const protocol = url.protocol.replace(":", "");
  out.push(protocol);
  switch (protocol) {
    case "http":
    case "https": {
      const host = url.hostname;
      const hostPort = url.port;
      out.push(hostPort ? `${host}_PORT${hostPort}` : host);
      break;
    }
    case "file":
    case "data":
    case "blob":
      break;
    default:
      throw new TypeError(`Don't know how to create cache name for protocol: ${protocol}`);
  }
  return join5(...out);
}
function stringToURL(url) {
  return url.startsWith("file://") || url.startsWith("http://") || url.startsWith("https://") ? new URL(url) : toFileUrl5(resolve5(url));
}
async function hash(value) {
  return encodeHex(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}
async function urlToFilename(url) {
  const cacheFilename = baseUrlToFilename(url);
  const hashedFilename = await hash(url.pathname + url.search);
  return join5(cacheFilename, hashedFilename);
}
async function isFile(filePath) {
  try {
    const stats = await Deno.lstat(filePath);
    return stats.isFile;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
function homeDir() {
  switch (Deno.build.os) {
    case "windows":
      return Deno.env.get("USERPROFILE");
    case "linux":
    case "darwin":
    case "freebsd":
    case "netbsd":
    case "aix":
    case "solaris":
    case "illumos":
    case "android":
      return Deno.env.get("HOME");
    default:
      throw Error("unreachable");
  }
}
function cacheDir() {
  if (Deno.build.os === "darwin") {
    const home = homeDir();
    if (home) {
      return join5(home, "Library/Caches");
    }
  } else if (Deno.build.os === "windows") {
    return Deno.env.get("LOCALAPPDATA");
  } else {
    const cacheHome = Deno.env.get("XDG_CACHE_HOME");
    if (cacheHome) {
      return cacheHome;
    } else {
      const home = homeDir();
      if (home) {
        return join5(home, ".cache");
      }
    }
  }
}
function denoCacheDir() {
  const dd = Deno.env.get("DENO_DIR");
  let root;
  if (dd) {
    root = normalize5(isAbsolute5(dd) ? dd : join5(Deno.cwd(), dd));
  } else {
    const cd = cacheDir();
    if (cd) {
      root = join5(cd, "deno");
    } else {
      const hd = homeDir();
      if (hd) {
        root = join5(hd, ".deno");
      }
    }
  }
  return root;
}

// deno:https://jsr.io/@denosaurs/plug/1.1.0/download.ts
var ALL_ARCHS = [
  "x86_64",
  "aarch64"
];
var ALL_OSS = [
  "darwin",
  "linux",
  "android",
  "windows",
  "freebsd",
  "netbsd",
  "aix",
  "solaris",
  "illumos"
];
var defaultExtensions = {
  darwin: "dylib",
  linux: "so",
  windows: "dll",
  freebsd: "so",
  netbsd: "so",
  aix: "so",
  solaris: "so",
  illumos: "so",
  android: "so"
};
var defaultPrefixes = {
  darwin: "lib",
  linux: "lib",
  netbsd: "lib",
  freebsd: "lib",
  aix: "lib",
  solaris: "lib",
  illumos: "lib",
  windows: "",
  android: "lib"
};
function getCrossOption(record) {
  if (record === void 0) {
    return;
  }
  if (ALL_OSS.some((os) => os in record)) {
    const subrecord = record[Deno.build.os];
    if (subrecord && typeof subrecord === "object" && ALL_ARCHS.some((arch) => arch in subrecord)) {
      return subrecord[Deno.build.arch];
    } else {
      return subrecord;
    }
  }
  if (ALL_ARCHS.some((arch) => arch in record)) {
    const subrecord = record[Deno.build.arch];
    if (subrecord && typeof subrecord === "object" && ALL_OSS.some((os) => os in subrecord)) {
      return subrecord[Deno.build.os];
    } else {
      return subrecord;
    }
  }
}
function createDownloadURL(options2) {
  if (typeof options2 === "string" || options2 instanceof URL) {
    options2 = {
      url: options2
    };
  }
  options2.extensions ??= defaultExtensions;
  options2.prefixes ??= defaultPrefixes;
  for (const key in options2.extensions) {
    const os = key;
    if (options2.extensions[os] !== void 0) {
      options2.extensions[os] = options2.extensions[os].replace(/\.?(.+)/, "$1");
    }
  }
  let url;
  if (options2.url instanceof URL) {
    url = options2.url;
  } else if (typeof options2.url === "string") {
    url = stringToURL(options2.url);
  } else {
    const tmpUrl = getCrossOption(options2.url);
    if (tmpUrl === void 0) {
      throw new TypeError(`An URL for the "${Deno.build.os}-${Deno.build.arch}" target was not provided.`);
    }
    if (typeof tmpUrl === "string") {
      url = stringToURL(tmpUrl);
    } else {
      url = tmpUrl;
    }
  }
  if ("name" in options2 && !Object.values(options2.extensions).includes(extname5(url.pathname))) {
    if (!url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}/`;
    }
    const prefix = getCrossOption(options2.prefixes) ?? "";
    const suffix = getCrossOption(options2.suffixes) ?? "";
    const extension = options2.extensions[Deno.build.os];
    if (options2.name === void 0) {
      throw new TypeError(`Expected the "name" property for an automatically assembled URL.`);
    }
    const filename = `${prefix}${options2.name}${suffix}.${extension}`;
    url = new URL(filename, url);
  }
  return url;
}
async function ensureCacheLocation(location = "deno") {
  if (location === "deno") {
    const dir = denoCacheDir();
    if (dir === void 0) {
      throw new Error("Could not get the deno cache directory, try using another CacheLocation in the plug options.");
    }
    location = join5(dir, "plug");
  } else if (location === "cache") {
    const dir = cacheDir();
    if (dir === void 0) {
      throw new Error("Could not get the cache directory, try using another CacheLocation in the plug options.");
    }
    location = join5(dir, "plug");
  } else if (location === "cwd") {
    location = join5(Deno.cwd(), "plug");
  } else if (location === "tmp") {
    location = await Deno.makeTempDir({
      prefix: "plug"
    });
  } else if (typeof location === "string" && location.startsWith("file://")) {
    location = fromFileUrl6(location);
  } else if (location instanceof URL) {
    if (location?.protocol !== "file:") {
      throw new TypeError("Cannot use any other protocol than file:// for an URL cache location.");
    }
    location = fromFileUrl6(location);
  }
  location = resolve5(normalize5(location));
  await ensureDir(location);
  return location;
}
async function download(options2) {
  const location = (typeof options2 === "object" && "location" in options2 ? options2.location : void 0) ?? "deno";
  const setting = (typeof options2 === "object" && "cache" in options2 ? options2.cache : void 0) ?? "use";
  const url = createDownloadURL(options2);
  const directory = await ensureCacheLocation(location);
  const cacheBasePath = join5(directory, await urlToFilename(url));
  const cacheFilePath = `${cacheBasePath}${extname5(url.pathname)}`;
  const cacheMetaPath = `${cacheBasePath}.metadata.json`;
  const cached = setting === "use" ? await isFile(cacheFilePath) : setting === "only" || setting !== "reloadAll";
  await ensureDir(dirname5(cacheBasePath));
  if (!cached) {
    const meta = {
      url
    };
    switch (url.protocol) {
      case "http:":
      case "https:": {
        console.log(`${green("Downloading")} ${url}`);
        const response = await fetch(url.toString());
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Could not find ${url}`);
          } else {
            throw new Deno.errors.Http(`${response.status} ${response.statusText}`);
          }
        }
        await Deno.writeFile(cacheFilePath, new Uint8Array(await response.arrayBuffer()));
        break;
      }
      case "file:": {
        console.log(`${green("Copying")} ${url}`);
        await Deno.copyFile(fromFileUrl6(url), cacheFilePath);
        if (Deno.build.os !== "windows") {
          await Deno.chmod(cacheFilePath, 420);
        }
        break;
      }
      default: {
        throw new TypeError(`Cannot fetch to cache using the "${url.protocol}" protocol`);
      }
    }
    await Deno.writeTextFile(cacheMetaPath, JSON.stringify(meta));
  }
  if (!await isFile(cacheFilePath)) {
    throw new Error(`Could not find "${url}" in cache.`);
  }
  return cacheFilePath;
}

// deno:https://jsr.io/@denosaurs/plug/1.1.0/mod.ts
async function dlopen(options2, symbols2) {
  if (Deno.dlopen === void 0) {
    throw new Error("`--unstable-ffi` is required");
  }
  return Deno.dlopen(await download(options2), symbols2);
}

// deno:https://jsr.io/@db/sqlite/0.12.0/src/ffi.ts
var symbols = {
  sqlite3_open_v2: {
    parameters: [
      "buffer",
      "buffer",
      "i32",
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_close_v2: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_changes: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_total_changes: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_last_insert_rowid: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_get_autocommit: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_prepare_v2: {
    parameters: [
      "pointer",
      "buffer",
      "i32",
      "buffer",
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_reset: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_clear_bindings: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_step: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_column_count: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_column_type: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "i32"
  },
  sqlite3_column_text: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "pointer"
  },
  sqlite3_column_value: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "pointer"
  },
  sqlite3_finalize: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_exec: {
    parameters: [
      "pointer",
      "buffer",
      "pointer",
      "pointer",
      "buffer"
    ],
    result: "i32"
  },
  sqlite3_free: {
    parameters: [
      "pointer"
    ],
    result: "void"
  },
  sqlite3_column_int: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "i32"
  },
  sqlite3_column_double: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "f64"
  },
  sqlite3_column_blob: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "pointer"
  },
  sqlite3_column_bytes: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "i32"
  },
  sqlite3_column_name: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "pointer"
  },
  sqlite3_column_decltype: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "u64"
  },
  sqlite3_bind_parameter_index: {
    parameters: [
      "pointer",
      "buffer"
    ],
    result: "i32"
  },
  sqlite3_bind_text: {
    parameters: [
      "pointer",
      "i32",
      "buffer",
      "i32",
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_bind_blob: {
    parameters: [
      "pointer",
      "i32",
      "buffer",
      "i32",
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_bind_double: {
    parameters: [
      "pointer",
      "i32",
      "f64"
    ],
    result: "i32"
  },
  sqlite3_bind_int: {
    parameters: [
      "pointer",
      "i32",
      "i32"
    ],
    result: "i32"
  },
  sqlite3_bind_int64: {
    parameters: [
      "pointer",
      "i32",
      "i64"
    ],
    result: "i32"
  },
  sqlite3_bind_null: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "i32"
  },
  sqlite3_expanded_sql: {
    parameters: [
      "pointer"
    ],
    result: "pointer"
  },
  sqlite3_bind_parameter_count: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_complete: {
    parameters: [
      "buffer"
    ],
    result: "i32"
  },
  sqlite3_sourceid: {
    parameters: [],
    result: "pointer"
  },
  sqlite3_libversion: {
    parameters: [],
    result: "pointer"
  },
  sqlite3_blob_open: {
    parameters: [
      "pointer",
      /* sqlite3 *db */
      "buffer",
      /* const char *zDb */
      "buffer",
      /* const char *zTable */
      "buffer",
      /* const char *zColumn */
      "i64",
      /* sqlite3_int64 iRow */
      "i32",
      /* int flags */
      "buffer"
    ],
    result: "i32"
  },
  sqlite3_blob_read: {
    parameters: [
      "pointer",
      /* sqlite3_blob *blob */
      "buffer",
      /* void *Z */
      "i32",
      /* int N */
      "i32"
    ],
    result: "i32"
  },
  sqlite3_blob_write: {
    parameters: [
      "pointer",
      /* sqlite3_blob *blob */
      "buffer",
      /* const void *z */
      "i32",
      /* int n */
      "i32"
    ],
    result: "i32"
  },
  sqlite3_blob_bytes: {
    parameters: [
      "pointer"
      /* sqlite3_blob *blob */
    ],
    result: "i32"
  },
  sqlite3_blob_close: {
    parameters: [
      "pointer"
      /* sqlite3_blob *blob */
    ],
    result: "i32"
  },
  sqlite3_sql: {
    parameters: [
      "pointer"
    ],
    result: "pointer"
  },
  sqlite3_stmt_readonly: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_bind_parameter_name: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "pointer"
  },
  sqlite3_errcode: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_errmsg: {
    parameters: [
      "pointer"
    ],
    result: "pointer"
  },
  sqlite3_errstr: {
    parameters: [
      "i32"
    ],
    result: "pointer"
  },
  sqlite3_column_int64: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "i64"
  },
  sqlite3_backup_init: {
    parameters: [
      "pointer",
      "buffer",
      "pointer",
      "buffer"
    ],
    result: "pointer"
  },
  sqlite3_backup_step: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "i32"
  },
  sqlite3_backup_finish: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_backup_remaining: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_backup_pagecount: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_create_function: {
    parameters: [
      "pointer",
      "buffer",
      "i32",
      "i32",
      "pointer",
      "pointer",
      "pointer",
      "pointer"
    ],
    result: "i32",
    optional: true
  },
  sqlite3_result_blob: {
    parameters: [
      "pointer",
      "buffer",
      "i32",
      "isize"
    ],
    result: "void"
  },
  sqlite3_result_double: {
    parameters: [
      "pointer",
      "f64"
    ],
    result: "void"
  },
  sqlite3_result_error: {
    parameters: [
      "pointer",
      "buffer",
      "i32"
    ],
    result: "void"
  },
  sqlite3_result_int: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "void"
  },
  sqlite3_result_int64: {
    parameters: [
      "pointer",
      "i64"
    ],
    result: "void"
  },
  sqlite3_result_null: {
    parameters: [
      "pointer"
    ],
    result: "void"
  },
  sqlite3_result_text: {
    parameters: [
      "pointer",
      "buffer",
      "i32",
      "isize"
    ],
    result: "void"
  },
  sqlite3_value_type: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_value_subtype: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_value_blob: {
    parameters: [
      "pointer"
    ],
    result: "pointer"
  },
  sqlite3_value_double: {
    parameters: [
      "pointer"
    ],
    result: "f64"
  },
  sqlite3_value_int: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_value_int64: {
    parameters: [
      "pointer"
    ],
    result: "i64"
  },
  sqlite3_value_text: {
    parameters: [
      "pointer"
    ],
    result: "pointer"
  },
  sqlite3_value_bytes: {
    parameters: [
      "pointer"
    ],
    result: "i32"
  },
  sqlite3_aggregate_context: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "pointer",
    optional: true
  },
  sqlite3_enable_load_extension: {
    parameters: [
      "pointer",
      "i32"
    ],
    result: "i32",
    optional: true
  },
  sqlite3_load_extension: {
    parameters: [
      "pointer",
      "buffer",
      "buffer",
      "buffer"
    ],
    result: "i32",
    optional: true
  },
  sqlite3_initialize: {
    parameters: [],
    result: "i32"
  }
};
var lib;
function tryGetEnv(key) {
  try {
    return Deno.env.get(key);
  } catch (e) {
    if (e instanceof Deno.errors.PermissionDenied) {
      return void 0;
    }
    throw e;
  }
}
try {
  const customPath = tryGetEnv("DENO_SQLITE_PATH");
  const sqliteLocal = tryGetEnv("DENO_SQLITE_LOCAL");
  if (sqliteLocal === "1") {
    lib = Deno.dlopen(new URL(`../build/${Deno.build.os === "windows" ? "" : "lib"}sqlite3${Deno.build.arch !== "x86_64" ? `_${Deno.build.arch}` : ""}.${Deno.build.os === "windows" ? "dll" : Deno.build.os === "darwin" ? "dylib" : "so"}`, import.meta.url), symbols).symbols;
  } else if (customPath) {
    lib = Deno.dlopen(customPath, symbols).symbols;
  } else {
    lib = (await dlopen({
      name: "sqlite3",
      url: `${deno_default.github}/releases/download/${deno_default.version}/`,
      suffixes: {
        aarch64: "_aarch64"
      }
    }, symbols)).symbols;
  }
} catch (e) {
  if (e instanceof Deno.errors.PermissionDenied) {
    throw e;
  }
  throw new Error("Failed to load SQLite3 Dynamic Library", {
    cause: e
  });
}
var init = lib.sqlite3_initialize();
if (init !== 0) {
  throw new Error(`Failed to initialize SQLite3: ${init}`);
}
var ffi_default = lib;

// deno:https://jsr.io/@db/sqlite/0.12.0/src/constants.ts
var SQLITE3_OK = 0;
var SQLITE3_MISUSE = 21;
var SQLITE3_ROW = 100;
var SQLITE3_DONE = 101;
var SQLITE3_OPEN_READONLY = 1;
var SQLITE3_OPEN_READWRITE = 2;
var SQLITE3_OPEN_CREATE = 4;
var SQLITE3_OPEN_MEMORY = 128;
var SQLITE_INTEGER = 1;
var SQLITE_FLOAT = 2;
var SQLITE_TEXT = 3;
var SQLITE_BLOB = 4;
var SQLITE_NULL = 5;

// deno:https://jsr.io/@db/sqlite/0.12.0/src/util.ts
var { sqlite3_errmsg, sqlite3_errstr } = ffi_default;
var encoder2 = new TextEncoder();
function toCString(str) {
  return encoder2.encode(str + "\0");
}
var SqliteError = class extends Error {
  code;
  name;
  constructor(code2 = 1, message = "Unknown Error") {
    super(`${code2}: ${message}`), this.code = code2, this.name = "SqliteError";
  }
};
function unwrap(code2, db2) {
  if (code2 === SQLITE3_OK || code2 === SQLITE3_DONE) return;
  if (code2 === SQLITE3_MISUSE) {
    throw new SqliteError(code2, "SQLite3 API misuse");
  } else if (db2 !== void 0) {
    const errmsg = sqlite3_errmsg(db2);
    if (errmsg === null) throw new SqliteError(code2);
    throw new Error(Deno.UnsafePointerView.getCString(errmsg));
  } else {
    throw new SqliteError(code2, Deno.UnsafePointerView.getCString(sqlite3_errstr(code2)));
  }
}
var buf = Deno.UnsafePointerView.getArrayBuffer;
var readCstr = Deno.UnsafePointerView.getCString;

// deno:https://jsr.io/@db/sqlite/0.12.0/src/statement.ts
var _computedKey;
var _computedKey1;
var _computedKey2;
var { sqlite3_prepare_v2, sqlite3_reset, sqlite3_clear_bindings, sqlite3_step, sqlite3_column_count, sqlite3_column_type, sqlite3_column_value, sqlite3_value_subtype, sqlite3_column_text, sqlite3_finalize, sqlite3_column_int64, sqlite3_column_double, sqlite3_column_blob, sqlite3_column_bytes, sqlite3_column_name, sqlite3_expanded_sql, sqlite3_bind_parameter_count, sqlite3_bind_int, sqlite3_bind_int64, sqlite3_bind_text, sqlite3_bind_blob, sqlite3_bind_double, sqlite3_bind_parameter_index, sqlite3_sql, sqlite3_stmt_readonly, sqlite3_bind_parameter_name, sqlite3_changes, sqlite3_column_int } = ffi_default;
var STATEMENTS_TO_DB = /* @__PURE__ */ new Map();
var emptyStringBuffer = new Uint8Array(1);
var statementFinalizer = new FinalizationRegistry((ptr) => {
  if (STATEMENTS_TO_DB.has(ptr)) {
    sqlite3_finalize(ptr);
    STATEMENTS_TO_DB.delete(ptr);
  }
});
var JSON_SUBTYPE = 74;
var BIG_MAX = BigInt(Number.MAX_SAFE_INTEGER);
function getColumn(handle, i, int64) {
  const ty = sqlite3_column_type(handle, i);
  if (ty === SQLITE_INTEGER && !int64) return sqlite3_column_int(handle, i);
  switch (ty) {
    case SQLITE_TEXT: {
      const ptr = sqlite3_column_text(handle, i);
      if (ptr === null) return null;
      const text = readCstr(ptr, 0);
      const value = sqlite3_column_value(handle, i);
      const subtype = sqlite3_value_subtype(value);
      if (subtype === JSON_SUBTYPE) {
        try {
          return JSON.parse(text);
        } catch (_error) {
          return text;
        }
      }
      return text;
    }
    case SQLITE_INTEGER: {
      const val = sqlite3_column_int64(handle, i);
      if (val < -BIG_MAX || val > BIG_MAX) {
        return val;
      }
      return Number(val);
    }
    case SQLITE_FLOAT: {
      return sqlite3_column_double(handle, i);
    }
    case SQLITE_BLOB: {
      const ptr = sqlite3_column_blob(handle, i);
      if (ptr === null) {
        return new Uint8Array();
      }
      const bytes = sqlite3_column_bytes(handle, i);
      return new Uint8Array(Deno.UnsafePointerView.getArrayBuffer(ptr, bytes).slice(0));
    }
    default: {
      return null;
    }
  }
}
_computedKey = Symbol.iterator, _computedKey1 = Symbol.dispose, _computedKey2 = Symbol.for("Deno.customInspect");
var Statement = class {
  db;
  #handle;
  #finalizerToken;
  #bound;
  #hasNoArgs;
  #unsafeConcurrency;
  /**
   * Whether the query might call into JavaScript or not.
   *
   * Must enable if the query makes use of user defined functions,
   * otherwise there can be V8 crashes.
   *
   * Off by default. Causes performance degradation.
   */
  callback;
  /** Unsafe Raw (pointer) to the sqlite object */
  get unsafeHandle() {
    return this.#handle;
  }
  /** SQL string including bindings */
  get expandedSql() {
    return readCstr(sqlite3_expanded_sql(this.#handle));
  }
  /** The SQL string that we passed when creating statement */
  get sql() {
    return readCstr(sqlite3_sql(this.#handle));
  }
  /** Whether this statement doesn't make any direct changes to the DB */
  get readonly() {
    return sqlite3_stmt_readonly(this.#handle) !== 0;
  }
  /** Simply run the query without retrieving any output there may be. */
  run(...args) {
    return this.#runWithArgs(...args);
  }
  /**
   * Run the query and return the resulting rows where rows are array of columns.
   */
  values(...args) {
    return this.#valuesWithArgs(...args);
  }
  /**
   * Run the query and return the resulting rows where rows are objects
   * mapping column name to their corresponding values.
   */
  all(...args) {
    return this.#allWithArgs(...args);
  }
  #bindParameterCount;
  /** Number of parameters (to be) bound */
  get bindParameterCount() {
    return this.#bindParameterCount;
  }
  constructor(db2, sql) {
    this.db = db2;
    this.#bound = false;
    this.#hasNoArgs = false;
    this.callback = false;
    this.#bindRefs = /* @__PURE__ */ new Set();
    this.#rowObject = {};
    const pHandle = new BigUint64Array(1);
    unwrap(sqlite3_prepare_v2(db2.unsafeHandle, toCString(sql), sql.length, pHandle, null), db2.unsafeHandle);
    this.#handle = Deno.UnsafePointer.create(pHandle[0]);
    STATEMENTS_TO_DB.set(this.#handle, db2.unsafeHandle);
    this.#unsafeConcurrency = db2.unsafeConcurrency;
    this.#finalizerToken = {
      handle: this.#handle
    };
    statementFinalizer.register(this, this.#handle, this.#finalizerToken);
    if ((this.#bindParameterCount = sqlite3_bind_parameter_count(this.#handle)) === 0) {
      this.#hasNoArgs = true;
      this.all = this.#allNoArgs;
      this.values = this.#valuesNoArgs;
      this.run = this.#runNoArgs;
      this.value = this.#valueNoArgs;
      this.get = this.#getNoArgs;
    }
  }
  /** Shorthand for `this.callback = true`. Enables calling user defined functions. */
  enableCallback() {
    this.callback = true;
    return this;
  }
  /** Get bind parameter name by index */
  bindParameterName(i) {
    return readCstr(sqlite3_bind_parameter_name(this.#handle, i));
  }
  /** Get bind parameter index by name */
  bindParameterIndex(name) {
    if (name[0] !== ":" && name[0] !== "@" && name[0] !== "$") {
      name = ":" + name;
    }
    return sqlite3_bind_parameter_index(this.#handle, toCString(name));
  }
  #begin() {
    sqlite3_reset(this.#handle);
    if (!this.#bound && !this.#hasNoArgs) {
      sqlite3_clear_bindings(this.#handle);
      this.#bindRefs.clear();
    }
  }
  #bindRefs;
  #bind(i, param) {
    switch (typeof param) {
      case "number": {
        if (Number.isInteger(param)) {
          if (Number.isSafeInteger(param) && param >= -(2 ** 31) && param < 2 ** 31) {
            unwrap(sqlite3_bind_int(this.#handle, i + 1, param));
          } else {
            unwrap(sqlite3_bind_int64(this.#handle, i + 1, BigInt(param)));
          }
        } else {
          unwrap(sqlite3_bind_double(this.#handle, i + 1, param));
        }
        break;
      }
      case "string": {
        if (param === "") {
          unwrap(sqlite3_bind_text(this.#handle, i + 1, emptyStringBuffer, 0, null));
        } else {
          const str = new TextEncoder().encode(param);
          this.#bindRefs.add(str);
          unwrap(sqlite3_bind_text(this.#handle, i + 1, str, str.byteLength, null));
        }
        break;
      }
      case "object": {
        if (param === null) {
        } else if (param instanceof Uint8Array) {
          this.#bindRefs.add(param);
          unwrap(sqlite3_bind_blob(this.#handle, i + 1, param.byteLength === 0 ? emptyStringBuffer : param, param.byteLength, null));
        } else if (param instanceof Date) {
          const cstring = toCString(param.toISOString());
          this.#bindRefs.add(cstring);
          unwrap(sqlite3_bind_text(this.#handle, i + 1, cstring, -1, null));
        } else {
          const cstring = toCString(JSON.stringify(param));
          this.#bindRefs.add(cstring);
          unwrap(sqlite3_bind_text(this.#handle, i + 1, cstring, -1, null));
        }
        break;
      }
      case "bigint": {
        unwrap(sqlite3_bind_int64(this.#handle, i + 1, param));
        break;
      }
      case "boolean":
        unwrap(sqlite3_bind_int(this.#handle, i + 1, param ? 1 : 0));
        break;
      default: {
        throw new Error(`Value of unsupported type: ${Deno.inspect(param)}`);
      }
    }
  }
  /**
   * Bind parameters to the statement. This method can only be called once
   * to set the parameters to be same throughout the statement. You cannot
   * change the parameters after this method is called.
   *
   * This method is merely just for optimization to avoid binding parameters
   * each time in prepared statement.
   */
  bind(...params) {
    this.#bindAll(params);
    this.#bound = true;
    return this;
  }
  #bindAll(params) {
    if (this.#bound) throw new Error("Statement already bound to values");
    if (typeof params[0] === "object" && params[0] !== null && !(params[0] instanceof Uint8Array) && !(params[0] instanceof Date)) {
      params = params[0];
    }
    if (Array.isArray(params)) {
      for (let i = 0; i < params.length; i++) {
        this.#bind(i, params[i]);
      }
    } else {
      for (const [name, param] of Object.entries(params)) {
        const i = this.bindParameterIndex(name);
        if (i === 0) {
          throw new Error(`No such parameter "${name}"`);
        }
        this.#bind(i - 1, param);
      }
    }
  }
  #runNoArgs() {
    const handle = this.#handle;
    this.#begin();
    const status = sqlite3_step(handle);
    if (status !== SQLITE3_ROW && status !== SQLITE3_DONE) {
      unwrap(status, this.db.unsafeHandle);
    }
    sqlite3_reset(handle);
    return sqlite3_changes(this.db.unsafeHandle);
  }
  #runWithArgs(...params) {
    const handle = this.#handle;
    this.#begin();
    this.#bindAll(params);
    const status = sqlite3_step(handle);
    if (!this.#hasNoArgs && !this.#bound && params.length) {
      this.#bindRefs.clear();
    }
    if (status !== SQLITE3_ROW && status !== SQLITE3_DONE) {
      unwrap(status, this.db.unsafeHandle);
    }
    sqlite3_reset(handle);
    return sqlite3_changes(this.db.unsafeHandle);
  }
  #valuesNoArgs() {
    const handle = this.#handle;
    this.#begin();
    const columnCount = sqlite3_column_count(handle);
    const result = [];
    const getRowArray = new Function("getColumn", `
      return function(h) {
        return [${Array.from({
      length: columnCount
    }).map((_, i) => `getColumn(h, ${i}, ${this.db.int64})`).join(", ")}];
      };
      `)(getColumn);
    let status = sqlite3_step(handle);
    while (status === SQLITE3_ROW) {
      result.push(getRowArray(handle));
      status = sqlite3_step(handle);
    }
    if (status !== SQLITE3_DONE) {
      unwrap(status, this.db.unsafeHandle);
    }
    sqlite3_reset(handle);
    return result;
  }
  #valuesWithArgs(...params) {
    const handle = this.#handle;
    this.#begin();
    this.#bindAll(params);
    const columnCount = sqlite3_column_count(handle);
    const result = [];
    const getRowArray = new Function("getColumn", `
      return function(h) {
        return [${Array.from({
      length: columnCount
    }).map((_, i) => `getColumn(h, ${i}, ${this.db.int64})`).join(", ")}];
      };
      `)(getColumn);
    let status = sqlite3_step(handle);
    while (status === SQLITE3_ROW) {
      result.push(getRowArray(handle));
      status = sqlite3_step(handle);
    }
    if (!this.#hasNoArgs && !this.#bound && params.length) {
      this.#bindRefs.clear();
    }
    if (status !== SQLITE3_DONE) {
      unwrap(status, this.db.unsafeHandle);
    }
    sqlite3_reset(handle);
    return result;
  }
  #rowObjectFn;
  getRowObject() {
    if (!this.#rowObjectFn || !this.#unsafeConcurrency) {
      const columnNames = this.columnNames();
      const getRowObject = new Function("getColumn", `
        return function(h) {
          return {
            ${columnNames.map((name, i) => `"${name}": getColumn(h, ${i}, ${this.db.int64})`).join(",\n")}
          };
        };
        `)(getColumn);
      this.#rowObjectFn = getRowObject;
    }
    return this.#rowObjectFn;
  }
  #allNoArgs() {
    const handle = this.#handle;
    this.#begin();
    const getRowObject = this.getRowObject();
    const result = [];
    let status = sqlite3_step(handle);
    while (status === SQLITE3_ROW) {
      result.push(getRowObject(handle));
      status = sqlite3_step(handle);
    }
    if (status !== SQLITE3_DONE) {
      unwrap(status, this.db.unsafeHandle);
    }
    sqlite3_reset(handle);
    return result;
  }
  #allWithArgs(...params) {
    const handle = this.#handle;
    this.#begin();
    this.#bindAll(params);
    const getRowObject = this.getRowObject();
    const result = [];
    let status = sqlite3_step(handle);
    while (status === SQLITE3_ROW) {
      result.push(getRowObject(handle));
      status = sqlite3_step(handle);
    }
    if (!this.#hasNoArgs && !this.#bound && params.length) {
      this.#bindRefs.clear();
    }
    if (status !== SQLITE3_DONE) {
      unwrap(status, this.db.unsafeHandle);
    }
    sqlite3_reset(handle);
    return result;
  }
  /** Fetch only first row as an array, if any. */
  value(...params) {
    const handle = this.#handle;
    const int64 = this.db.int64;
    const arr = new Array(sqlite3_column_count(handle));
    sqlite3_reset(handle);
    if (!this.#hasNoArgs && !this.#bound) {
      sqlite3_clear_bindings(handle);
      this.#bindRefs.clear();
      if (params.length) {
        this.#bindAll(params);
      }
    }
    const status = sqlite3_step(handle);
    if (!this.#hasNoArgs && !this.#bound && params.length) {
      this.#bindRefs.clear();
    }
    if (status === SQLITE3_ROW) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = getColumn(handle, i, int64);
      }
      sqlite3_reset(this.#handle);
      return arr;
    } else if (status === SQLITE3_DONE) {
      return;
    } else {
      unwrap(status, this.db.unsafeHandle);
    }
  }
  #valueNoArgs() {
    const handle = this.#handle;
    const int64 = this.db.int64;
    const cc = sqlite3_column_count(handle);
    const arr = new Array(cc);
    sqlite3_reset(handle);
    const status = sqlite3_step(handle);
    if (status === SQLITE3_ROW) {
      for (let i = 0; i < cc; i++) {
        arr[i] = getColumn(handle, i, int64);
      }
      sqlite3_reset(this.#handle);
      return arr;
    } else if (status === SQLITE3_DONE) {
      return;
    } else {
      unwrap(status, this.db.unsafeHandle);
    }
  }
  #columnNames;
  #rowObject;
  columnNames() {
    if (!this.#columnNames || !this.#unsafeConcurrency) {
      const columnCount = sqlite3_column_count(this.#handle);
      const columnNames = new Array(columnCount);
      for (let i = 0; i < columnCount; i++) {
        columnNames[i] = readCstr(sqlite3_column_name(this.#handle, i));
      }
      this.#columnNames = columnNames;
      this.#rowObject = {};
      for (const name of columnNames) {
        this.#rowObject[name] = void 0;
      }
    }
    return this.#columnNames;
  }
  /** Fetch only first row as an object, if any. */
  get(...params) {
    const handle = this.#handle;
    const int64 = this.db.int64;
    const columnNames = this.columnNames();
    const row = {};
    sqlite3_reset(handle);
    if (!this.#hasNoArgs && !this.#bound) {
      sqlite3_clear_bindings(handle);
      this.#bindRefs.clear();
      if (params.length) {
        this.#bindAll(params);
      }
    }
    const status = sqlite3_step(handle);
    if (!this.#hasNoArgs && !this.#bound && params.length) {
      this.#bindRefs.clear();
    }
    if (status === SQLITE3_ROW) {
      for (let i = 0; i < columnNames.length; i++) {
        row[columnNames[i]] = getColumn(handle, i, int64);
      }
      sqlite3_reset(this.#handle);
      return row;
    } else if (status === SQLITE3_DONE) {
      return;
    } else {
      unwrap(status, this.db.unsafeHandle);
    }
  }
  #getNoArgs() {
    const handle = this.#handle;
    const int64 = this.db.int64;
    const columnNames = this.columnNames();
    const row = this.#rowObject;
    sqlite3_reset(handle);
    const status = sqlite3_step(handle);
    if (status === SQLITE3_ROW) {
      for (let i = 0; i < columnNames?.length; i++) {
        row[columnNames[i]] = getColumn(handle, i, int64);
      }
      sqlite3_reset(handle);
      return row;
    } else if (status === SQLITE3_DONE) {
      return;
    } else {
      unwrap(status, this.db.unsafeHandle);
    }
  }
  /** Free up the statement object. */
  finalize() {
    if (!STATEMENTS_TO_DB.has(this.#handle)) return;
    this.#bindRefs.clear();
    statementFinalizer.unregister(this.#finalizerToken);
    STATEMENTS_TO_DB.delete(this.#handle);
    unwrap(sqlite3_finalize(this.#handle));
  }
  /** Coerces the statement to a string, which in this case is expanded SQL. */
  toString() {
    return readCstr(sqlite3_expanded_sql(this.#handle));
  }
  /** Iterate over resultant rows from query. */
  *iter(...params) {
    this.#begin();
    this.#bindAll(params);
    const getRowObject = this.getRowObject();
    let status = sqlite3_step(this.#handle);
    while (status === SQLITE3_ROW) {
      yield getRowObject(this.#handle);
      status = sqlite3_step(this.#handle);
    }
    if (status !== SQLITE3_DONE) {
      unwrap(status, this.db.unsafeHandle);
    }
    sqlite3_reset(this.#handle);
  }
  [_computedKey]() {
    return this.iter();
  }
  [_computedKey1]() {
    this.finalize();
  }
  [_computedKey2]() {
    return `Statement { ${this.expandedSql} }`;
  }
};

// deno:https://jsr.io/@db/sqlite/0.12.0/src/blob.ts
var _computedKey3;
var _computedKey12;
var { sqlite3_blob_open, sqlite3_blob_bytes, sqlite3_blob_close, sqlite3_blob_read, sqlite3_blob_write } = ffi_default;
_computedKey3 = Symbol.iterator, _computedKey12 = Symbol.for("Deno.customInspect");
var SQLBlob = class {
  #handle;
  constructor(db2, options2) {
    options2 = Object.assign({
      readonly: true,
      db: "main"
    }, options2);
    const pHandle = new BigUint64Array(1);
    unwrap(sqlite3_blob_open(db2.unsafeHandle, toCString(options2.db ?? "main"), toCString(options2.table), toCString(options2.column), BigInt(options2.row), options2.readonly === false ? 1 : 0, pHandle));
    this.#handle = Deno.UnsafePointer.create(pHandle[0]);
  }
  /** Byte size of the Blob */
  get byteLength() {
    return sqlite3_blob_bytes(this.#handle);
  }
  /** Read from the Blob at given offset into a buffer (Uint8Array) */
  readSync(offset, p) {
    unwrap(sqlite3_blob_read(this.#handle, p, p.byteLength, offset));
  }
  /** Write a buffer (Uint8Array) at given offset in the Blob */
  writeSync(offset, p) {
    unwrap(sqlite3_blob_write(this.#handle, p, p.byteLength, offset));
  }
  /** Close the Blob. It **must** be called to prevent leaks. */
  close() {
    unwrap(sqlite3_blob_close(this.#handle));
  }
  /** Obtains Web Stream for reading the Blob */
  get readable() {
    const length2 = this.byteLength;
    let offset = 0;
    return new ReadableStream({
      type: "bytes",
      pull: (ctx) => {
        try {
          const byob = ctx.byobRequest;
          if (byob) {
            const toRead = Math.min(length2 - offset, byob.view.byteLength);
            this.readSync(offset, byob.view.subarray(0, toRead));
            offset += toRead;
            byob.respond(toRead);
          } else {
            const toRead = Math.min(length2 - offset, ctx.desiredSize || 1024 * 16);
            if (toRead === 0) {
              ctx.close();
              return;
            }
            const buffer = new Uint8Array(toRead);
            this.readSync(offset, buffer);
            offset += toRead;
            ctx.enqueue(buffer);
          }
        } catch (e) {
          ctx.error(e);
          ctx.byobRequest?.respond(0);
        }
      }
    });
  }
  /** Obtains Web Stream for writing to the Blob */
  get writable() {
    const length2 = this.byteLength;
    let offset = 0;
    return new WritableStream({
      write: (chunk, ctx) => {
        if (offset + chunk.byteLength > length2) {
          ctx.error(new Error("Write exceeds blob length"));
          return;
        }
        this.writeSync(offset, chunk);
        offset += chunk.byteLength;
      }
    });
  }
  *[_computedKey3]() {
    const length2 = this.byteLength;
    let offset = 0;
    while (offset < length2) {
      const toRead = Math.min(length2 - offset, 1024 * 16);
      const buffer = new Uint8Array(toRead);
      this.readSync(offset, buffer);
      offset += toRead;
      yield buffer;
    }
  }
  [_computedKey12]() {
    return `SQLite3.Blob(0x${this.byteLength.toString(16)})`;
  }
};

// deno:https://jsr.io/@db/sqlite/0.12.0/src/database.ts
var _computedKey4;
var { sqlite3_open_v2, sqlite3_close_v2, sqlite3_changes: sqlite3_changes2, sqlite3_total_changes, sqlite3_last_insert_rowid, sqlite3_get_autocommit, sqlite3_exec, sqlite3_free, sqlite3_libversion, sqlite3_sourceid, sqlite3_complete, sqlite3_finalize: sqlite3_finalize2, sqlite3_result_blob, sqlite3_result_double, sqlite3_result_error, sqlite3_result_int64, sqlite3_result_null, sqlite3_result_text, sqlite3_value_blob, sqlite3_value_bytes, sqlite3_value_double, sqlite3_value_int64, sqlite3_value_text, sqlite3_value_type, sqlite3_create_function, sqlite3_result_int, sqlite3_aggregate_context, sqlite3_enable_load_extension, sqlite3_load_extension, sqlite3_backup_init, sqlite3_backup_step, sqlite3_backup_finish, sqlite3_errcode } = ffi_default;
var SQLITE_VERSION = readCstr(sqlite3_libversion());
var SQLITE_SOURCEID = readCstr(sqlite3_sourceid());
var BIG_MAX2 = BigInt(Number.MAX_SAFE_INTEGER);
_computedKey4 = Symbol.for("Deno.customInspect");
var Database = class {
  #path;
  #handle;
  #open = true;
  #enableLoadExtension = false;
  /** Whether to support BigInt columns. False by default, integers larger than 32 bit will be inaccurate. */
  int64;
  unsafeConcurrency;
  /** Whether DB connection is open */
  get open() {
    return this.#open;
  }
  /** Unsafe Raw (pointer) to the sqlite object */
  get unsafeHandle() {
    return this.#handle;
  }
  /** Path of the database file. */
  get path() {
    return this.#path;
  }
  /** Number of rows changed by the last executed statement. */
  get changes() {
    return sqlite3_changes2(this.#handle);
  }
  /** Number of rows changed since the database connection was opened. */
  get totalChanges() {
    return sqlite3_total_changes(this.#handle);
  }
  /** Gets last inserted Row ID */
  get lastInsertRowId() {
    return Number(sqlite3_last_insert_rowid(this.#handle));
  }
  /** Whether autocommit is enabled. Enabled by default, can be disabled using BEGIN statement. */
  get autocommit() {
    return sqlite3_get_autocommit(this.#handle) === 1;
  }
  /** Whether DB is in mid of a transaction */
  get inTransaction() {
    return this.#open && !this.autocommit;
  }
  get enableLoadExtension() {
    return this.#enableLoadExtension;
  }
  set enableLoadExtension(enabled2) {
    if (sqlite3_enable_load_extension === null) {
      throw new Error("Extension loading is not supported by the shared library that was used.");
    }
    const result = sqlite3_enable_load_extension(this.#handle, Number(enabled2));
    unwrap(result, this.#handle);
    this.#enableLoadExtension = enabled2;
  }
  constructor(path2, options2 = {}) {
    this.#path = path2 instanceof URL ? fromFileUrl3(path2) : path2;
    let flags = 0;
    this.int64 = options2.int64 ?? false;
    this.unsafeConcurrency = options2.unsafeConcurrency ?? false;
    if (options2.flags !== void 0) {
      flags = options2.flags;
    } else {
      if (options2.memory) {
        flags |= SQLITE3_OPEN_MEMORY;
      }
      if (options2.readonly ?? false) {
        flags |= SQLITE3_OPEN_READONLY;
      } else {
        flags |= SQLITE3_OPEN_READWRITE;
      }
      if ((options2.create ?? true) && !options2.readonly) {
        flags |= SQLITE3_OPEN_CREATE;
      }
    }
    const pHandle = new BigUint64Array(1);
    const result = sqlite3_open_v2(toCString(this.#path), pHandle, flags, null);
    this.#handle = Deno.UnsafePointer.create(pHandle[0]);
    if (result !== 0) sqlite3_close_v2(this.#handle);
    unwrap(result);
    if (options2.enableLoadExtension) {
      this.enableLoadExtension = options2.enableLoadExtension;
    }
  }
  /**
   * Creates a new Prepared Statement from the given SQL statement.
   *
   * Example:
   * ```ts
   * const stmt = db.prepare("SELECT * FROM mytable WHERE id = ?");
   *
   * for (const row of stmt.all(1)) {
   *   console.log(row);
   * }
   * ```
   *
   * Bind parameters can be either provided as an array of values, or as an object
   * mapping the parameter name to the value.
   *
   * Example:
   * ```ts
   * const stmt = db.prepare("SELECT * FROM mytable WHERE id = ?");
   * const row = stmt.get(1);
   *
   * // or
   *
   * const stmt = db.prepare("SELECT * FROM mytable WHERE id = :id");
   * const row = stmt.get({ id: 1 });
   * ```
   *
   * Statements are automatically freed once GC catches them, however
   * you can also manually free using `finalize` method.
   *
   * @param sql SQL statement string
   * @returns Statement object
   */
  prepare(sql) {
    return new Statement(this, sql);
  }
  /**
   * Open a Blob for incremental I/O.
   *
   * Make sure to close the blob after you are done with it,
   * otherwise you will have memory leaks.
   */
  openBlob(options2) {
    return new SQLBlob(this, options2);
  }
  /**
   * Simply executes the SQL statement (supports multiple statements separated by semicolon).
   * Returns the number of changes made by last statement.
   *
   * Example:
   * ```ts
   * // Create table
   * db.exec("create table users (id integer not null, username varchar(20) not null)");
   *
   * // Inserts
   * db.exec("insert into users (id, username) values(?, ?)", id, username);
   *
   * // Insert with named parameters
   * db.exec("insert into users (id, username) values(:id, :username)", { id, username });
   *
   * // Pragma statements
   * db.exec("pragma journal_mode = WAL");
   * db.exec("pragma synchronous = normal");
   * db.exec("pragma temp_store = memory");
   * ```
   *
   * Under the hood, it uses `sqlite3_exec` if no parameters are given to bind
   * with the SQL statement, a prepared statement otherwise.
   */
  exec(sql, ...params) {
    if (params.length === 0) {
      const pErr = new BigUint64Array(1);
      sqlite3_exec(this.#handle, toCString(sql), null, null, new Uint8Array(pErr.buffer));
      const errPtr = Deno.UnsafePointer.create(pErr[0]);
      if (errPtr !== null) {
        const err = readCstr(errPtr);
        sqlite3_free(errPtr);
        throw new Error(err);
      }
      return sqlite3_changes2(this.#handle);
    }
    const stmt = this.prepare(sql);
    stmt.run(...params);
    return sqlite3_changes2(this.#handle);
  }
  /** Alias for `exec`. */
  run(sql, ...params) {
    return this.exec(sql, ...params);
  }
  /** Safely execute SQL with parameters using a tagged template */
  sql(strings, ...parameters) {
    const sql = strings.join("?");
    const stmt = this.prepare(sql);
    return stmt.all(...parameters);
  }
  /**
   * Wraps a callback function in a transaction.
   *
   * - When function is called, the transaction is started.
   * - When function returns, the transaction is committed.
   * - When function throws an error, the transaction is rolled back.
   *
   * Example:
   * ```ts
   * const stmt = db.prepare("insert into users (id, username) values(?, ?)");
   *
   * interface User {
   *   id: number;
   *   username: string;
   * }
   *
   * const insertUsers = db.transaction((data: User[]) => {
   *   for (const user of data) {
   *     stmt.run(user);
   *   }
   * });
   *
   * insertUsers([
   *   { id: 1, username: "alice" },
   *   { id: 2, username: "bob" },
   * ]);
   *
   * // May also use `insertUsers.deferred`, `immediate`, or `exclusive`.
   * // They corresspond to using `BEGIN DEFERRED`, `BEGIN IMMEDIATE`, and `BEGIN EXCLUSIVE`.
   * // For eg.
   *
   * insertUsers.deferred([
   *   { id: 1, username: "alice" },
   *   { id: 2, username: "bob" },
   * ]);
   * ```
   */
  transaction(fn) {
    const controller = getController(this);
    const properties = {
      default: {
        value: wrapTransaction(fn, this, controller.default)
      },
      deferred: {
        value: wrapTransaction(fn, this, controller.deferred)
      },
      immediate: {
        value: wrapTransaction(fn, this, controller.immediate)
      },
      exclusive: {
        value: wrapTransaction(fn, this, controller.exclusive)
      },
      database: {
        value: this,
        enumerable: true
      }
    };
    Object.defineProperties(properties.default.value, properties);
    Object.defineProperties(properties.deferred.value, properties);
    Object.defineProperties(properties.immediate.value, properties);
    Object.defineProperties(properties.exclusive.value, properties);
    return properties.default.value;
  }
  #callbacks = /* @__PURE__ */ new Set();
  /**
   * Creates a new user-defined function.
   *
   * Example:
   * ```ts
   * db.function("add", (a: number, b: number) => a + b);
   * db.prepare("select add(1, 2)").value<[number]>()!; // [3]
   * ```
   */
  function(name, fn, options2) {
    if (sqlite3_create_function === null) {
      throw new Error("User-defined functions are not supported by the shared library that was used.");
    }
    const cb = new Deno.UnsafeCallback({
      parameters: [
        "pointer",
        "i32",
        "pointer"
      ],
      result: "void"
    }, (ctx, nArgs, pArgs) => {
      const argptr = new Deno.UnsafePointerView(pArgs);
      const args = [];
      for (let i = 0; i < nArgs; i++) {
        const arg = Deno.UnsafePointer.create(argptr.getBigUint64(i * 8));
        const type = sqlite3_value_type(arg);
        switch (type) {
          case SQLITE_INTEGER: {
            const value = sqlite3_value_int64(arg);
            if (value < -BIG_MAX2 || value > BIG_MAX2) {
              args.push(value);
            } else {
              args.push(Number(value));
            }
            break;
          }
          case SQLITE_FLOAT:
            args.push(sqlite3_value_double(arg));
            break;
          case SQLITE_TEXT:
            args.push(new TextDecoder().decode(new Uint8Array(Deno.UnsafePointerView.getArrayBuffer(sqlite3_value_text(arg), sqlite3_value_bytes(arg)))));
            break;
          case SQLITE_BLOB:
            args.push(new Uint8Array(Deno.UnsafePointerView.getArrayBuffer(sqlite3_value_blob(arg), sqlite3_value_bytes(arg))));
            break;
          case SQLITE_NULL:
            args.push(null);
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }
      }
      let result;
      try {
        result = fn(...args);
      } catch (err2) {
        const buf2 = new TextEncoder().encode(err2.message);
        sqlite3_result_error(ctx, buf2, buf2.byteLength);
        return;
      }
      if (result === void 0 || result === null) {
        sqlite3_result_null(ctx);
      } else if (typeof result === "boolean") {
        sqlite3_result_int(ctx, result ? 1 : 0);
      } else if (typeof result === "number") {
        if (Number.isSafeInteger(result)) {
          sqlite3_result_int64(ctx, BigInt(result));
        } else sqlite3_result_double(ctx, result);
      } else if (typeof result === "bigint") {
        sqlite3_result_int64(ctx, result);
      } else if (typeof result === "string") {
        const buffer = new TextEncoder().encode(result);
        sqlite3_result_text(ctx, buffer, buffer.byteLength, 0n);
      } else if (result instanceof Uint8Array) {
        sqlite3_result_blob(ctx, result, result.length, -1n);
      } else {
        const buffer = new TextEncoder().encode(`Invalid return value: ${Deno.inspect(result)}`);
        sqlite3_result_error(ctx, buffer, buffer.byteLength);
      }
    });
    let flags = 1;
    if (options2?.deterministic) {
      flags |= 2048;
    }
    if (options2?.directOnly) {
      flags |= 524288;
    }
    if (options2?.subtype) {
      flags |= 1048576;
    }
    if (options2?.directOnly) {
      flags |= 2097152;
    }
    const err = sqlite3_create_function(this.#handle, toCString(name), options2?.varargs ? -1 : fn.length, flags, null, cb.pointer, null, null);
    unwrap(err, this.#handle);
    this.#callbacks.add(cb);
  }
  /**
   * Creates a new user-defined aggregate function.
   */
  aggregate(name, options2) {
    if (sqlite3_aggregate_context === null || sqlite3_create_function === null) {
      throw new Error("User-defined functions are not supported by the shared library that was used.");
    }
    const contexts = /* @__PURE__ */ new Map();
    const cb = new Deno.UnsafeCallback({
      parameters: [
        "pointer",
        "i32",
        "pointer"
      ],
      result: "void"
    }, (ctx, nArgs, pArgs) => {
      const aggrCtx = sqlite3_aggregate_context(ctx, 8);
      const aggrPtr = Deno.UnsafePointer.value(aggrCtx);
      let aggregate;
      if (contexts.has(aggrPtr)) {
        aggregate = contexts.get(aggrPtr);
      } else {
        aggregate = typeof options2.start === "function" ? options2.start() : options2.start;
        contexts.set(aggrPtr, aggregate);
      }
      const argptr = new Deno.UnsafePointerView(pArgs);
      const args = [];
      for (let i = 0; i < nArgs; i++) {
        const arg = Deno.UnsafePointer.create(argptr.getBigUint64(i * 8));
        const type = sqlite3_value_type(arg);
        switch (type) {
          case SQLITE_INTEGER: {
            const value = sqlite3_value_int64(arg);
            if (value < -BIG_MAX2 || value > BIG_MAX2) {
              args.push(value);
            } else {
              args.push(Number(value));
            }
            break;
          }
          case SQLITE_FLOAT:
            args.push(sqlite3_value_double(arg));
            break;
          case SQLITE_TEXT:
            args.push(new TextDecoder().decode(new Uint8Array(Deno.UnsafePointerView.getArrayBuffer(sqlite3_value_text(arg), sqlite3_value_bytes(arg)))));
            break;
          case SQLITE_BLOB:
            args.push(new Uint8Array(Deno.UnsafePointerView.getArrayBuffer(sqlite3_value_blob(arg), sqlite3_value_bytes(arg))));
            break;
          case SQLITE_NULL:
            args.push(null);
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }
      }
      let result;
      try {
        result = options2.step(aggregate, ...args);
      } catch (err2) {
        const buf2 = new TextEncoder().encode(err2.message);
        sqlite3_result_error(ctx, buf2, buf2.byteLength);
        return;
      }
      contexts.set(aggrPtr, result);
    });
    const cbFinal = new Deno.UnsafeCallback({
      parameters: [
        "pointer"
      ],
      result: "void"
    }, (ctx) => {
      const aggrCtx = sqlite3_aggregate_context(ctx, 0);
      const aggrPtr = Deno.UnsafePointer.value(aggrCtx);
      const aggregate = contexts.get(aggrPtr);
      contexts.delete(aggrPtr);
      let result;
      try {
        result = options2.final ? options2.final(aggregate) : aggregate;
      } catch (err2) {
        const buf2 = new TextEncoder().encode(err2.message);
        sqlite3_result_error(ctx, buf2, buf2.byteLength);
        return;
      }
      if (result === void 0 || result === null) {
        sqlite3_result_null(ctx);
      } else if (typeof result === "boolean") {
        sqlite3_result_int(ctx, result ? 1 : 0);
      } else if (typeof result === "number") {
        if (Number.isSafeInteger(result)) {
          sqlite3_result_int64(ctx, BigInt(result));
        } else sqlite3_result_double(ctx, result);
      } else if (typeof result === "bigint") {
        sqlite3_result_int64(ctx, result);
      } else if (typeof result === "string") {
        const buffer = new TextEncoder().encode(result);
        sqlite3_result_text(ctx, buffer, buffer.byteLength, 0n);
      } else if (result instanceof Uint8Array) {
        sqlite3_result_blob(ctx, result, result.length, -1n);
      } else {
        const buffer = new TextEncoder().encode(`Invalid return value: ${Deno.inspect(result)}`);
        sqlite3_result_error(ctx, buffer, buffer.byteLength);
      }
    });
    let flags = 1;
    if (options2?.deterministic) {
      flags |= 2048;
    }
    if (options2?.directOnly) {
      flags |= 524288;
    }
    if (options2?.subtype) {
      flags |= 1048576;
    }
    if (options2?.directOnly) {
      flags |= 2097152;
    }
    const err = sqlite3_create_function(this.#handle, toCString(name), options2?.varargs ? -1 : options2.step.length - 1, flags, null, null, cb.pointer, cbFinal.pointer);
    unwrap(err, this.#handle);
    this.#callbacks.add(cb);
    this.#callbacks.add(cbFinal);
  }
  /**
   * Loads an SQLite extension library from the named file.
   */
  loadExtension(file, entryPoint) {
    if (sqlite3_load_extension === null) {
      throw new Error("Extension loading is not supported by the shared library that was used.");
    }
    if (!this.enableLoadExtension) {
      throw new Error("Extension loading is not enabled");
    }
    const pzErrMsg = new BigUint64Array(1);
    const result = sqlite3_load_extension(this.#handle, toCString(file), entryPoint ? toCString(entryPoint) : null, pzErrMsg);
    const pzErrPtr = Deno.UnsafePointer.create(pzErrMsg[0]);
    if (pzErrPtr !== null) {
      const pzErr = readCstr(pzErrPtr);
      sqlite3_free(pzErrPtr);
      throw new Error(pzErr);
    }
    unwrap(result, this.#handle);
  }
  /**
   * Closes the database connection.
   *
   * Calling this method more than once is no-op.
   */
  close() {
    if (!this.#open) return;
    for (const [stmt, db2] of STATEMENTS_TO_DB) {
      if (db2 === this.#handle) {
        sqlite3_finalize2(stmt);
        STATEMENTS_TO_DB.delete(stmt);
      }
    }
    for (const cb of this.#callbacks) {
      cb.close();
    }
    unwrap(sqlite3_close_v2(this.#handle));
    this.#open = false;
  }
  /**
   * @param dest The destination database connection.
   * @param name Destination database name. "main" for main database, "temp" for temporary database, or the name specified after the AS keyword in an ATTACH statement for an attached database.
   * @param pages The number of pages to copy. If it is negative, all remaining pages are copied (default).
   */
  backup(dest, name = "main", pages = -1) {
    const backup = sqlite3_backup_init(dest.#handle, toCString(name), this.#handle, toCString("main"));
    if (backup) {
      unwrap(sqlite3_backup_step(backup, pages));
      unwrap(sqlite3_backup_finish(backup));
    } else {
      unwrap(sqlite3_errcode(dest.#handle), dest.#handle);
    }
  }
  [_computedKey4]() {
    return `SQLite3.Database { path: ${this.path} }`;
  }
};
var controllers = /* @__PURE__ */ new WeakMap();
var getController = (db2) => {
  let controller = controllers.get(db2);
  if (!controller) {
    const shared = {
      commit: db2.prepare("COMMIT"),
      rollback: db2.prepare("ROLLBACK"),
      savepoint: db2.prepare("SAVEPOINT `	_bs3.	`"),
      release: db2.prepare("RELEASE `	_bs3.	`"),
      rollbackTo: db2.prepare("ROLLBACK TO `	_bs3.	`")
    };
    controllers.set(db2, controller = {
      default: Object.assign({
        begin: db2.prepare("BEGIN")
      }, shared),
      deferred: Object.assign({
        begin: db2.prepare("BEGIN DEFERRED")
      }, shared),
      immediate: Object.assign({
        begin: db2.prepare("BEGIN IMMEDIATE")
      }, shared),
      exclusive: Object.assign({
        begin: db2.prepare("BEGIN EXCLUSIVE")
      }, shared)
    });
  }
  return controller;
};
var wrapTransaction = (fn, db2, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction(...args) {
  const { apply } = Function.prototype;
  let before, after, undo;
  if (db2.inTransaction) {
    before = savepoint;
    after = release;
    undo = rollbackTo;
  } else {
    before = begin;
    after = commit;
    undo = rollback;
  }
  before.run();
  try {
    const result = apply.call(fn, this, args);
    after.run();
    return result;
  } catch (ex) {
    if (!db2.autocommit) {
      undo.run();
      if (undo !== rollback) after.run();
    }
    throw ex;
  }
};

// build/serve/creditsWorker.js-tmp
import { mkdir as mkdir2 } from "node:fs/promises";
import { basename as basename22, dirname as dirname22, join as join22, resolve as resolve22 } from "node:path";
import { resolve as resolve32 } from "node:path";
import { readFile as readFile2 } from "node:fs/promises";
import process3 from "node:process";
import { parentPort } from "node:worker_threads";
import fs from "node:fs";
import { readFile as readFile3, readdir as readdir2 } from "node:fs/promises";
import path from "node:path";
import process4 from "node:process";
import { Readable } from "node:stream";
var import_boom = __toESM(require_lib2());
var import_npm_lru_cache = __toESM(require_lru_cache());
import { Buffer as Buffer22 } from "node:buffer";
import process5 from "node:process";
import { Buffer as Buffer32 } from "node:buffer";
import { randomBytes, timingSafeEqual } from "node:crypto";

// node_modules/.deno/@chelonia+lib@1.2.7/node_modules/@chelonia/lib/dist/esm/zkpp.mjs
var import_scrypt_async2 = __toESM(require_scrypt_async(), 1);
var import_tweetnacl2 = __toESM(require_nacl_fast(), 1);
import { Buffer as Buffer4 } from "node:buffer";
var hashStringArray = (...args) => {
  return import_tweetnacl2.default.hash(Buffer4.concat(args.map((s) => import_tweetnacl2.default.hash(Buffer4.from(s)))));
};

// build/serve/creditsWorker.js-tmp
var import_npm_tweetnacl = __toESM(require_nacl_fast());
var import_npm_pino = __toESM(require_pino());
import process52 from "node:process";
var __defProp2 = Object.defineProperty;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __glob = (map) => (path2) => {
  var fn = map[path2];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path2);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames2(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var requiredMethodNames;
var DatabaseBackend;
var init_DatabaseBackend = __esm({
  "src/serve/DatabaseBackend.ts"() {
    "use strict";
    requiredMethodNames = ["init", "clear", "readData", "writeData", "deleteData", "close"];
    DatabaseBackend = class _DatabaseBackend {
      constructor() {
        if (new.target === _DatabaseBackend) {
          throw new Error("Class DatabaseBackend cannot be instantiated directly.");
        }
        const bindMethod = (name) => {
          this[name] = this[name].bind(this);
        };
        for (const name of requiredMethodNames) {
          bindMethod(name);
        }
      }
    };
  }
});
var database_fs_exports = {};
__export(database_fs_exports, {
  default: () => FsBackend
});
async function testCaseSensitivity(backend) {
  const { readData, writeData, deleteData } = backend;
  const date = /* @__PURE__ */ new Date();
  const dateString = date.toISOString();
  const originalKey = `_private_testCaseSensitivity_${date.getTime()}_${(0, Math.random)().toFixed(8).slice(2)}`;
  const differentlyCasedKey = "_P" + originalKey.slice(2);
  await writeData(originalKey, dateString);
  try {
    const valueOriginalCase = await readData(originalKey);
    const valueDifferentCase = await readData(differentlyCasedKey);
    if (valueOriginalCase?.toString() !== dateString) {
      console.error(`Unexpected value on case-sensitivity test; expected ${dateString}`);
      throw new Error("Unexpected value: original key does not have the correct value");
    }
    if (valueDifferentCase?.toString() === dateString) {
      const errStr = "Filesystem database backend only works on case-sensitive filesystems. This appears to be a case insensitive file system. Set SKIP_DB_FS_CASE_SENSITIVITY_CHECK=true to skip.";
      console.error(errStr);
      throw new Error(errStr);
    }
  } finally {
    await deleteData(originalKey);
  }
}
var splitAndGroup;
var FsBackend;
var init_database_fs = __esm({
  "src/serve/database-fs.ts"() {
    "use strict";
    init_DatabaseBackend();
    splitAndGroup = (input, chunkLength, depth) => input.slice(0, chunkLength * depth).split("").reduce((acc, cv, i) => {
      acc[i / chunkLength | 0] = (acc[i / chunkLength | 0] || "") + cv;
      return acc;
    }, []);
    FsBackend = class extends DatabaseBackend {
      dataFolder = "";
      depth = 0;
      keyChunkLength = 2;
      constructor(options2 = {}) {
        super();
        this.dataFolder = resolve6(options2.dirname);
        if (options2.depth) this.depth = options2.depth;
        if (options2.keyChunkLength) this.keyChunkLength = options2.keyChunkLength;
      }
      // Maps a given key to a real path on the filesystem.
      mapKey(key) {
        if (basename6(normalize6(key)) !== key) throw new TypeError("Invalid key");
        if (!this.depth) return join6(this.dataFolder, key);
        const keyChunks = splitAndGroup(key, this.keyChunkLength, this.depth);
        return join6(this.dataFolder, ...keyChunks, key);
      }
      async init() {
        await mkdir(this.dataFolder, { mode: 488, recursive: true });
        if (process2.env.SKIP_DB_FS_CASE_SENSITIVITY_CHECK === void 0) {
          await testCaseSensitivity(this);
        }
      }
      async clear() {
        const names = await readdir(this.dataFolder);
        const paths = names.map((name) => join6(this.dataFolder, name));
        await Promise.all(
          paths.map((p) => rm(p, { recursive: true }))
        );
      }
      async readData(key) {
        checkKey(key);
        return await readFile(this.mapKey(key)).catch((err) => {
          if (err.code !== "ENOENT") throw err;
        });
      }
      async writeData(key, value) {
        const path2 = this.mapKey(key);
        if (this.depth) await mkdir(dirname6(path2), { mode: 488, recursive: true });
        await writeFile(path2, value);
      }
      async deleteData(key) {
        await unlink(this.mapKey(key)).catch((e) => {
          if (e?.code === "ENOENT") {
            return;
          }
          throw e;
        });
      }
      close() {
      }
    };
  }
});
var database_sqlite_exports = {};
__export(database_sqlite_exports, {
  default: () => SqliteBackend
});
var SqliteBackend;
var init_database_sqlite = __esm({
  "src/serve/database-sqlite.ts"() {
    "use strict";
    init_DatabaseBackend();
    SqliteBackend = class extends DatabaseBackend {
      dataFolder = "";
      db = null;
      filename = "";
      readStatement = null;
      writeStatement = null;
      deleteStatement = null;
      constructor(options2 = {}) {
        super();
        const { filepath } = options2;
        const resolvedPath = resolve22(filepath);
        this.dataFolder = dirname22(resolvedPath);
        this.filename = basename22(resolvedPath);
      }
      run(sql) {
        this.db.prepare(sql).run();
      }
      async init() {
        const { dataFolder: dataFolder2, filename } = this;
        await mkdir2(dataFolder2, { mode: 488, recursive: true });
        if (this.db) {
          throw new Error(`The ${filename} SQLite database is already open.`);
        }
        this.db = new Database(join22(dataFolder2, filename));
        this.run("CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)");
        console.info(`Connected to the ${filename} SQLite database.`);
        this.readStatement = this.db.prepare("SELECT value FROM Data WHERE key = ?");
        this.writeStatement = this.db.prepare("REPLACE INTO Data(key, value) VALUES(?, ?)");
        this.deleteStatement = this.db.prepare("DELETE FROM Data WHERE key = ?");
      }
      // Useful in test hooks.
      // deno-lint-ignore require-await
      async clear() {
        this.run("DELETE FROM Data");
      }
      // deno-lint-ignore require-await
      async readData(key) {
        const row = this.readStatement.get(key);
        return row?.value;
      }
      async writeData(key, value) {
        await this.writeStatement.run(key, value);
      }
      async deleteData(key) {
        await this.deleteStatement.run(key);
      }
      close() {
        this.db.close();
      }
    };
  }
});
var globImport_database_ts;
var init_ = __esm({
  'import("./database-*.ts") in src/serve/database-router.ts'() {
    globImport_database_ts = __glob({
      "./database-fs.ts": () => Promise.resolve().then(() => (init_database_fs(), database_fs_exports)),
      "./database-router.test.ts": () => Promise.resolve().then(() => (init_database_router_test(), database_router_test_exports)),
      "./database-router.ts": () => Promise.resolve().then(() => (init_database_router(), database_router_exports)),
      "./database-sqlite.ts": () => Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports))
    });
  }
});
var database_router_exports = {};
__export(database_router_exports, {
  default: () => RouterBackend
});
var GI_PERSIST_ROUTER_CONFIG;
var GI_PERSIST_ROUTER_CONFIG_PATH;
var RouterBackend;
var init_database_router = __esm({
  "src/serve/database-router.ts"() {
    "use strict";
    init_DatabaseBackend();
    init_();
    ({
      GI_PERSIST_ROUTER_CONFIG: (
        // Tried first by the config lookup.
        // Define this if your config JSON comes as a string from an envar's contents.
        GI_PERSIST_ROUTER_CONFIG
      ),
      GI_PERSIST_ROUTER_CONFIG_PATH: (
        // Tried next.
        // Define this if your config comes from a JSON file.
        GI_PERSIST_ROUTER_CONFIG_PATH
      ) = "./database-router-config.json"
    } = process3.env);
    RouterBackend = class extends DatabaseBackend {
      backends;
      config;
      constructor(options2 = {}) {
        super();
        if (options2.config) this.config = options2.config;
      }
      lookupBackend(key) {
        const { backends, config } = this;
        const keyPrefixes = Object.keys(config);
        for (let i = 0; i < keyPrefixes.length; i++) {
          if (key.startsWith(keyPrefixes[i])) {
            return backends[keyPrefixes[i]];
          }
        }
        return backends["*"];
      }
      async readConfig() {
        if (GI_PERSIST_ROUTER_CONFIG) {
          console.info("[database-router] Reading config from envar GI_PERSIST_ROUTER_CONFIG");
        } else {
          console.info("[database-router] Reading config from path", GI_PERSIST_ROUTER_CONFIG_PATH);
        }
        const configString = GI_PERSIST_ROUTER_CONFIG || await readFile2(resolve32(GI_PERSIST_ROUTER_CONFIG_PATH), "utf8");
        const config = JSON.parse(configString);
        return Object.fromEntries(Object.entries(config).sort((a, b) => b[0].length - a[0].length));
      }
      validateConfig(config) {
        const errors = [];
        if (!config["*"]) {
          errors.push({ msg: 'Missing key: "*" (fallback storage is required)' });
        }
        for (const entry of Object.entries(config)) {
          const value = entry[1];
          if (typeof value?.name !== "string" || typeof value?.options !== "object") {
            errors.push({ msg: "entry value must be of type { name: string, options: Object }", entry });
            continue;
          }
          if (value.name === "router") {
            errors.push({ msg: "Router backends cannot be nested.", entry });
            continue;
          }
        }
        return errors;
      }
      async init() {
        if (!this.config) this.config = await this.readConfig();
        const errors = this.validateConfig(this.config);
        if (errors.length) {
          throw new Error(`[${this.constructor.name}] ${errors.length} error(s) found in your config.`, { cause: errors });
        }
        this.backends = /* @__PURE__ */ Object.create(null);
        const entries = Object.entries(this.config);
        await Promise.all(entries.map(async (entry) => {
          const [keyPrefix, { name, options: options2 }] = entry;
          const Ctor = (await globImport_database_ts(`./database-${name}.ts`)).default;
          const backend = new Ctor(options2);
          await backend.init();
          this.backends[keyPrefix] = backend;
        }));
      }
      async readData(key) {
        return await this.lookupBackend(key).readData(key);
      }
      async writeData(key, value) {
        return await this.lookupBackend(key).writeData(key, value);
      }
      async deleteData(key) {
        return await this.lookupBackend(key).deleteData(key);
      }
      async clear() {
        for (const backend of new Set(Object.values(this.backends))) {
          try {
            await backend.clear();
          } catch (e) {
            const prefix = Object.entries(this.backends).find(([, b]) => b === backend)[0];
            console.error(e, `Error clearing DB for prefix ${prefix}`);
          }
        }
      }
      async close() {
        for (const backend of new Set(Object.values(this.backends))) {
          try {
            await backend.close();
          } catch (e) {
            const prefix = Object.entries(this.backends).find(([, b]) => b === backend)[0];
            console.error(e, `Error closing DB for prefix ${prefix}`);
          }
        }
      }
    };
  }
});
var database_router_test_exports = {};
var CID2;
var randomKeyWithPrefix;
var validConfig;
var db;
var init_database_router_test = __esm({
  "src/serve/database-router.test.ts"() {
    "use strict";
    init_database_router();
    CID2 = "Q";
    randomKeyWithPrefix = (prefix) => `${prefix}${globalThis.crypto.randomUUID().replaceAll("-", "")}`;
    validConfig = {
      [CID2]: {
        name: "sqlite",
        options: {
          filepath: "./test/temp/sqlite.db"
        }
      },
      "*": {
        name: "fs",
        options: {
          dirname: "./test/temp"
        }
      }
    };
    db = new RouterBackend({ config: validConfig });
    Deno.test({
      name: "DatabaseRouter::validateConfig",
      async fn(t) {
        await t.step("should accept a valid config", () => {
          const errors = db.validateConfig(validConfig);
          if (errors.length !== 0) throw new Error(`Expected 0 errors but got ${errors.length}`);
        });
        await t.step("should reject configs missing a * key", () => {
          const config = omit(validConfig, ["*"]);
          const errors = db.validateConfig(config);
          if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`);
        });
        await t.step("should reject config entries missing a name", () => {
          const config = cloneDeep(validConfig);
          delete config["*"].name;
          const errors = db.validateConfig(config);
          if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`);
        });
      }
    });
    Deno.test({
      name: "DatabaseRouter::lookupBackend",
      async fn(t) {
        await db.init();
        try {
          await t.step("should find the right backend for keys starting with configured prefixes", () => {
            for (const keyPrefix of Object.keys(db.config)) {
              if (keyPrefix === "*") continue;
              const key = randomKeyWithPrefix(keyPrefix);
              const actual = db.lookupBackend(key);
              const expected = db.backends[keyPrefix];
              if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
            }
          });
          await t.step("should find the right backend for keys equal to configured prefixes", () => {
            for (const keyPrefix of Object.keys(db.config)) {
              const key = keyPrefix;
              const actual = db.lookupBackend(key);
              const expected = db.backends[keyPrefix];
              if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
            }
          });
          await t.step("should return the fallback backend for keys not matching any configured prefix", () => {
            const key = "foo";
            const actual = db.lookupBackend(key);
            const expected = db.backends["*"];
            if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
          });
        } finally {
          await db.clear();
        }
      }
    });
  }
});
var CREDITS_WORKER_TASK_TIME_INTERVAL = 3e5;
var SERVER_EXITING = "server-exiting";
var vapidPublicKey;
var vapidPrivateKey;
if (!process5.env.VAPID_EMAIL) {
  console.warn('Missing VAPID identification. Please set VAPID_EMAIL to a value like "mailto:some@example".');
}
var vapid = { VAPID_EMAIL: process5.env.VAPID_EMAIL || "mailto:test@example.com" };
var initVapid = async () => {
  const vapidKeyPair = await esm_default("chelonia.db/get", "_private_immutable_vapid_key").then(async (vapidKeyPair2) => {
    if (!vapidKeyPair2) {
      console.info("Generating new VAPID keypair...");
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-256"
          // Use P-256 curve
        },
        true,
        // Whether the key is extractable
        ["sign", "verify"]
        // Usages
      );
      const serializedKeyPair2 = await Promise.all([
        crypto.subtle.exportKey("jwk", keyPair.privateKey),
        crypto.subtle.exportKey("raw", keyPair.publicKey).then(
          (key) => Buffer22.from(key).toString("base64url")
        )
      ]);
      return esm_default("chelonia.db/set", "_private_immutable_vapid_key", JSON.stringify(serializedKeyPair2)).then(() => {
        console.info("Successfully saved newly generated VAPID keys");
        return [keyPair.privateKey, serializedKeyPair2[1]];
      });
    }
    const serializedKeyPair = JSON.parse(vapidKeyPair2);
    return [
      await crypto.subtle.importKey(
        "jwk",
        serializedKeyPair[0],
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign"]
      ),
      serializedKeyPair[1]
    ];
  });
  vapidPrivateKey = vapidKeyPair[0];
  vapidPublicKey = vapidKeyPair[1];
};
var recordSecret;
var challengeSecret;
var registrationSecret;
var hashUpdateSecret;
var initZkpp = async () => {
  const IKM = await esm_default("chelonia.db/get", "_private_immutable_zkpp_ikm").then((IKM2) => {
    if (!IKM2) {
      const secret = randomBytes(33).toString("base64");
      return esm_default("chelonia.db/set", "_private_immutable_zkpp_ikm", secret).then(() => {
        return secret;
      });
    }
    return IKM2;
  });
  recordSecret = Buffer32.from(hashStringArray("private/recordSecret", IKM)).toString("base64");
  challengeSecret = Buffer32.from(hashStringArray("private/challengeSecret", IKM)).toString("base64");
  registrationSecret = Buffer32.from(hashStringArray("private/registrationSecret", IKM)).toString("base64");
  hashUpdateSecret = Buffer32.from(hashStringArray("private/hashUpdateSecret", IKM)).toString("base64");
};
var globImport_database_ts2 = __glob({
  "./database-fs.ts": () => Promise.resolve().then(() => (init_database_fs(), database_fs_exports)),
  "./database-router.test.ts": () => Promise.resolve().then(() => (init_database_router_test(), database_router_test_exports)),
  "./database-router.ts": () => Promise.resolve().then(() => (init_database_router(), database_router_exports)),
  "./database-sqlite.ts": () => Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports))
});
var production = process4.env.NODE_ENV === "production";
var persistence = process4.env.GI_PERSIST || (production ? "fs" : void 0);
var dbRootPath = process4.env.DB_PATH || "./data";
var options = {
  fs: {
    depth: 0,
    dirname: dbRootPath,
    keyChunkLength: 2
  },
  sqlite: {
    filepath: path.join(dbRootPath, "groupincome.db")
  }
};
var KEYOP_SEGMENT_LENGTH = 1e4;
var dataFolder = path.resolve(options.fs.dirname);
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { mode: 488 });
}
var database_default = esm_default("sbp/selectors/register", {
  "backend/db/streamEntriesAfter": async function(contractID, height, requestedLimit, options2 = {}) {
    const limit = Math.min(requestedLimit ?? Number.POSITIVE_INFINITY, process4.env.MAX_EVENTS_BATCH_SIZE ? parseInt(process4.env.MAX_EVENTS_BATCH_SIZE) : 500);
    const latestHEADinfo = await esm_default("chelonia/db/latestHEADinfo", contractID);
    if (latestHEADinfo === "") {
      throw import_boom.default.resourceGone(`contractID ${contractID} has been deleted!`);
    }
    if (!latestHEADinfo) {
      throw import_boom.default.notFound(`contractID ${contractID} doesn't exist!`);
    }
    let counter = 0;
    let currentHeight = height;
    let currentHash, serverMeta;
    let prefix = "";
    const nextKeyOp = /* @__PURE__ */ (() => {
      let index;
      return async () => {
        if (!index) {
          index = (await esm_default("chelonia.db/get", `_private_keyop_idx_${contractID}_${currentHeight - currentHeight % KEYOP_SEGMENT_LENGTH}`))?.split("\0");
        }
        const value = index?.find((h, i) => {
          if (Number(h) >= currentHeight) {
            index = index.slice(i + 1);
            return true;
          } else {
            return false;
          }
        });
        if (value != null) {
          const newHeight = Number(value);
          currentHeight = newHeight;
        } else {
          currentHeight = currentHeight - currentHeight % KEYOP_SEGMENT_LENGTH + KEYOP_SEGMENT_LENGTH;
          index = void 0;
          if (currentHeight > latestHEADinfo.height) {
            return false;
          } else {
            return null;
          }
        }
        return true;
      };
    })();
    const fetchMeta = async () => {
      if (currentHeight > latestHEADinfo.height) {
        return false;
      }
      const meta = await esm_default("chelonia/db/getEntryMeta", contractID, currentHeight);
      if (!meta) {
        return false;
      }
      const { hash: newCurrentHash, ...newServerMeta } = meta;
      currentHash = newCurrentHash;
      serverMeta = newServerMeta;
      return true;
    };
    const stream = Readable.from(async function* () {
      yield "[";
      await fetchMeta();
      while (serverMeta && counter < limit) {
        try {
          const entry = await esm_default("chelonia/db/getEntry", currentHash);
          if (!entry) break;
          const currentPrefix = prefix;
          prefix = ",";
          counter++;
          yield `${currentPrefix}"${strToB64(
            JSON.stringify({ serverMeta, message: entry.serialize() })
          )}"`;
          currentHeight++;
          currentHash = void 0;
          serverMeta = void 0;
          if (options2.keyOps) {
            while (await nextKeyOp() === null) ;
          }
          await fetchMeta();
        } catch (e) {
          console.error(e, "[backend] streamEntriesAfter: read()");
          break;
        }
      }
      yield "]";
    }(), { encoding: "utf-8", objectMode: false });
    stream.headers = {
      "shelter-headinfo-head": latestHEADinfo.HEAD,
      "shelter-headinfo-height": latestHEADinfo.height
    };
    return stream;
  },
  // =======================
  // wrapper methods to add / lookup names
  // =======================
  "backend/db/registerName": async function(name, value) {
    const exists = await esm_default("backend/db/lookupName", name);
    if (exists) {
      throw import_boom.default.conflict("exists");
    }
    await esm_default("chelonia.db/set", namespaceKey(name), value);
    await esm_default("chelonia.db/set", `_private_cid2name_${value}`, name);
    await appendToNamesIndex(name);
    return { name, value };
  },
  "backend/db/lookupName": async function(name) {
    const value = await esm_default("chelonia.db/get", namespaceKey(name));
    return value;
  }
});
function namespaceKey(name) {
  return "name=" + name;
}
var initDB = async ({ skipDbPreloading } = {}) => {
  if (persistence) {
    const Ctor = (await globImport_database_ts2(`./database-${persistence}.ts`)).default;
    const { init: init2, readData, writeData, deleteData, close } = new Ctor(options[persistence]);
    await init2();
    esm_default("okTurtles.events/once", SERVER_EXITING, () => {
      esm_default("okTurtles.eventQueue/queueEvent", SERVER_EXITING, async () => {
        try {
          await close();
        } catch (e) {
          console.error(e, `Error closing DB ${persistence}`);
        }
      });
    });
    const cache2 = new import_npm_lru_cache.default({
      max: Number(process4.env.GI_LRU_NUM_ITEMS) || 1e4
    });
    const prefixes = Object.keys(prefixHandlers);
    esm_default("sbp/selectors/overwrite", {
      "chelonia.db/get": async function(prefixableKey, { bypassCache } = {}) {
        if (!bypassCache) {
          const lookupValue = cache2.get(prefixableKey);
          if (lookupValue !== void 0) {
            return lookupValue;
          }
        }
        const [prefix, key] = parsePrefixableKey(prefixableKey);
        let value = await readData(key);
        if (value === void 0) {
          return;
        }
        value = prefixHandlers[prefix](value);
        cache2.set(prefixableKey, value);
        return value;
      },
      "chelonia.db/set": async function(key, value) {
        if (process4.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
        checkKey(key);
        if (key.startsWith("_private_immutable")) {
          const existingValue = await readData(key);
          if (existingValue !== void 0) {
            throw new Error("Cannot set already set immutable key");
          }
        }
        await writeData(key, value);
        prefixes.forEach((prefix) => {
          cache2.delete(prefix + key);
        });
      },
      "chelonia.db/delete": async function(key) {
        if (process4.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
        checkKey(key);
        if (key.startsWith("_private_immutable")) {
          throw new Error("Cannot delete immutable key");
        }
        await deleteData(key);
        prefixes.forEach((prefix) => {
          cache2.delete(prefix + key);
        });
      }
    });
    esm_default("sbp/selectors/lock", ["chelonia.db/get", "chelonia.db/set", "chelonia.db/delete"]);
  }
  if (skipDbPreloading) return;
  if (persistence !== "fs" || options.fs.dirname !== dbRootPath) {
    const HASH_LENGTH = 56;
    const keys = (await readdir2(dataFolder)).filter((k) => {
      if (k.length !== HASH_LENGTH) return false;
      const parsed = maybeParseCID(k);
      return parsed && [
        multicodes.SHELTER_CONTRACT_MANIFEST,
        multicodes.SHELTER_CONTRACT_TEXT
      ].includes(parsed.code);
    });
    const numKeys = keys.length;
    let numVisitedKeys = 0;
    let numNewKeys = 0;
    const savedProgress = { value: 0, numKeys: 0 };
    console.info("[chelonia.db] Preloading...");
    for (const key of keys) {
      if (!persistence || !await esm_default("chelonia.db/get", key)) {
        const value = await readFile3(path.join(dataFolder, key), "utf8");
        await esm_default("chelonia.db/set", key, value);
        numNewKeys++;
      }
      numVisitedKeys++;
      const progress = numVisitedKeys === numKeys ? 100 : Math.floor(100 * numVisitedKeys / numKeys);
      if (progress === 100 || progress - savedProgress.value >= 10 && numVisitedKeys - savedProgress.numKeys >= 10) {
        console.info(`[chelonia.db] Preloading... ${progress}% done`);
        savedProgress.numKeys = numVisitedKeys;
        savedProgress.value = progress;
      }
    }
    numNewKeys && console.info(`[chelonia.db] Preloaded ${numNewKeys} new entries`);
  }
  await Promise.all([initVapid(), initZkpp()]);
};
var appendToIndexFactory = (key) => {
  return (value) => {
    return esm_default("okTurtles.eventQueue/queueEvent", key, async () => {
      const currentIndex = await esm_default("chelonia.db/get", key, { bypassCache: true });
      if (currentIndex) {
        if (
          // Check if the value is at the end
          currentIndex.endsWith("\0" + value) || // Check if the value is at the start
          currentIndex.startsWith(value + "\0") || // Check if the current index is exactly the value
          currentIndex === value
        ) {
          return;
        }
        await esm_default("chelonia.db/set", key, `${currentIndex}\0${value}`);
        return;
      }
      await esm_default("chelonia.db/set", key, value);
    });
  };
};
var appendToNamesIndex = appendToIndexFactory("_private_names_index");
var prettyPrint = process52.env.NODE_ENV === "development" || process52.env.CI || process52.env.CYPRESS_RECORD_KEY || process52.env.PRETTY;
function logMethod(args, method) {
  const stringIdx = typeof args[0] === "string" ? 0 : 1;
  if (args.length > 1) {
    for (let i = stringIdx + 1; i < args.length; ++i) {
      args[stringIdx] += typeof args[i] === "string" ? " %s" : " %o";
    }
  }
  method.apply(this, args);
}
var logger;
if (prettyPrint) {
  try {
    logger = (0, import_npm_pino.default)({
      hooks: { logMethod },
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true
        }
      }
    });
  } catch (e) {
    console.warn("pino-pretty transport unavailable, using basic logging", e);
    logger = (0, import_npm_pino.default)({ hooks: { logMethod } });
  }
} else {
  logger = (0, import_npm_pino.default)({ hooks: { logMethod } });
}
var logLevel = process52.env.LOG_LEVEL || (prettyPrint ? "debug" : "info");
if (Object.keys(logger.levels.values).includes(logLevel)) {
  logger.level = logLevel;
} else {
  logger.warn(`Unknown log level: ${logLevel}`);
}
globalThis.logger = logger;
console.debug = logger.debug.bind(logger);
console.info = logger.info.bind(logger);
console.log = logger.info.bind(logger);
console.warn = logger.warn.bind(logger);
console.error = logger.error.bind(logger);
var readyQueueName = "parentPort";
parentPort.on("message", ([port, ...msg]) => {
  esm_default("okTurtles.eventQueue/queueEvent", readyQueueName, () => {
    (async () => {
      try {
        port?.postMessage([true, await esm_default(...msg)]);
      } catch (e) {
        port?.postMessage([false, e]);
      }
    })();
  });
});
esm_default("okTurtles.eventQueue/queueEvent", readyQueueName, async () => {
  await initDB({ skipDbPreloading: true });
  parentPort.postMessage("ready");
});
var PICOCREDITS_PER_BYTESECOND = BigInt(10);
var GRANULAR_HISTORY_MAX_ENTRIES = 1e3;
var COARSE_HISTORY_MAX_ENTRIES = 1e3;
var GRANULAR_ENTRIES_PER_COARSE_ENTRIES = 288;
var startTime = Date.now();
var updateCredits = async (billableEntity, type, amount) => {
  const granularHistoryKey = `_private_ownerBalanceHistoryGranular_${billableEntity}`;
  await esm_default("okTurtles.eventQueue/queueEvent", granularHistoryKey, async () => {
    const now = /* @__PURE__ */ new Date();
    const date = now.toISOString();
    const granularHistoryList = await esm_default("chelonia.db/get", granularHistoryKey, { bypassCache: true }) ?? "[]";
    const granularHistory = JSON.parse(granularHistoryList);
    if (granularHistory.length >= GRANULAR_HISTORY_MAX_ENTRIES - 1) {
      granularHistory.splice(GRANULAR_HISTORY_MAX_ENTRIES - 1);
    }
    const previousPcBalance = BigInt(granularHistory[0]?.balancePicocreditAmount || 0);
    if (type === "charge") {
      const previousTime = new Date(granularHistory[0]?.date).getTime() || now.getTime();
      const timeElapsed = Math.max(0, now.getTime() - Math.max(previousTime, startTime));
      const picocreditsUsed = BigInt(Math.floor(amount * timeElapsed / 1e3)) * PICOCREDITS_PER_BYTESECOND;
      const balancePicocreditAmount = (previousPcBalance - picocreditsUsed).toString(10);
      granularHistory.unshift({
        type: "charge",
        date,
        sizeTotal: amount,
        picocreditAmount: picocreditsUsed.toString(10),
        // Period in ISO 8601 format, i.e., `{start}/{end}`
        period: `${new Date(now.getTime() - timeElapsed).toISOString()}/${date}`,
        balancePicocreditAmount
      });
      await esm_default("chelonia.db/set", `_private_ownerPicocreditBalance_${billableEntity}`, balancePicocreditAmount);
    } else if (type === "credit") {
      const picocreditsToAdd = BigInt(amount);
      const newBalance = previousPcBalance + picocreditsToAdd;
      const newBalanceStr = newBalance.toString(10);
      const newEntry = {
        type: "credit",
        date,
        picocreditAmount: picocreditsToAdd.toString(10),
        // Credits added
        balancePicocreditAmount: newBalanceStr
      };
      granularHistory.unshift(newEntry);
      await esm_default("chelonia.db/set", `_private_ownerPicocreditBalance_${billableEntity}`, newBalanceStr);
    } else {
      console.error(`[creditsWorker] Invalid update type "${type}" for ${billableEntity}`);
      return;
    }
    const lastCoarseSyncIdx = granularHistory.findIndex((value) => {
      return !!value.coarseSyncPoint;
    });
    if (lastCoarseSyncIdx >= GRANULAR_ENTRIES_PER_COARSE_ENTRIES || lastCoarseSyncIdx < 0) {
      const coarseHistoryKey = `_private_ownerBalanceHistoryCoarse_${billableEntity}`;
      granularHistory[0].coarseSyncPoint = true;
      const coarseHistoryList = await esm_default("chelonia.db/get", coarseHistoryKey, { bypassCache: true }) ?? "[]";
      const coarseHistory = JSON.parse(coarseHistoryList);
      if (coarseHistory.length >= COARSE_HISTORY_MAX_ENTRIES - 1) {
        coarseHistory.splice(COARSE_HISTORY_MAX_ENTRIES - 1);
      }
      const { periodStart, charges, credits, periodSize, totalPeriodLength } = granularHistory.slice(0, lastCoarseSyncIdx < 0 ? granularHistory.length : lastCoarseSyncIdx).reduce((acc, entry) => {
        if (entry.type === "charge") {
          acc.charges += BigInt(entry.picocreditAmount);
          const [periodStart2, periodEnd] = entry.period.split("/");
          const [periodStartDate, periodEndDate] = [Date.parse(periodStart2), Date.parse(periodEnd)];
          const periodLength = Math.floor(periodEndDate - periodStartDate);
          if (periodLength >= 0) {
            acc.periodSize += entry.sizeTotal * periodLength;
            acc.totalPeriodLength += periodLength;
          }
          acc.periodStart = periodStart2;
        } else if (entry.type === "credit") {
          acc.credits += BigInt(entry.picocreditAmount);
        } else {
          throw new Error("Invalid entry type: " + entry.type);
        }
        return acc;
      }, { charges: BigInt(0), credits: BigInt(0), periodStart: date, periodSize: 0, totalPeriodLength: 0 });
      coarseHistory.unshift({
        type: "aggregate",
        date,
        sizeTotal: totalPeriodLength > 0 ? Math.floor(periodSize / totalPeriodLength) : 0,
        chargesPicocreditAmount: charges.toString(10),
        creditsPicocreditAmount: credits.toString(10),
        period: `${periodStart}/${date}`,
        balancePicocreditAmount: granularHistory[0].balancePicocreditAmount
      });
      await esm_default("chelonia.db/set", coarseHistoryKey, JSON.stringify(coarseHistory));
    }
    await esm_default("chelonia.db/set", granularHistoryKey, JSON.stringify(granularHistory));
  });
};
esm_default("okTurtles.eventQueue/queueEvent", readyQueueName, () => setTimeout(esm_default, CREDITS_WORKER_TASK_TIME_INTERVAL, "worker/computeCredits"));
esm_default("sbp/selectors/register", {
  "worker/computeCredits": async () => {
    const billableEntities = await esm_default("chelonia.db/get", "_private_billable_entities", { bypassCache: true });
    billableEntities && await Promise.all(billableEntities.split("\0").map(async (billableEntity) => {
      const sizeString = await esm_default("chelonia.db/get", `_private_ownerTotalSize_${billableEntity}`, { bypassCache: true });
      const size = parseInt(sizeString, 10);
      if (isNaN(size)) {
        console.warn(`[creditsWorker] Invalid size fetched for entity ${billableEntity}: ${sizeString}. Skipping charge.`);
        return;
      }
      updateCredits(billableEntity, "charge", size).catch((e) => {
        console.error(e, "[creditsWorker] Error computing balance", billableEntity);
      });
    }));
    setTimeout(esm_default, CREDITS_WORKER_TASK_TIME_INTERVAL, "worker/computeCredits");
  }
});
/*! Bundled license information:

scrypt-async/scrypt-async.js:
  (*!
   * Fast "async" scrypt implementation in JavaScript.
   * Copyright (c) 2013-2016 Dmitry Chestnykh | BSD License
   * https://github.com/dchest/scrypt-async-js
   *)
*/
