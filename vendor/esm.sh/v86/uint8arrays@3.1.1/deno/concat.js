/* esm.sh - esbuild bundle(uint8arrays@3.1.1/concat) deno production */
function n(r){return globalThis.Buffer!=null?new Uint8Array(r.buffer,r.byteOffset,r.byteLength):r}function e(r=0){return globalThis.Buffer!=null&&globalThis.Buffer.allocUnsafe!=null?n(globalThis.Buffer.allocUnsafe(r)):new Uint8Array(r)}function g(r,t){t||(t=r.reduce((l,a)=>l+a.length,0));let o=e(t),f=0;for(let l of r)o.set(l,f),f+=l.length;return n(o)}export{g as concat};
//# sourceMappingURL=concat.js.map