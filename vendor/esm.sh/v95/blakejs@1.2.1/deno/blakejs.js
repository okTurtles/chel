/* esm.sh - esbuild bundle(blakejs@1.2.1) deno production */
var e1=Object.create;var G=Object.defineProperty;var n1=Object.getOwnPropertyDescriptor;var t1=Object.getOwnPropertyNames;var r1=Object.getPrototypeOf,o1=Object.prototype.hasOwnProperty;var x=(n,t)=>()=>(t||n((t={exports:{}}).exports,t),t.exports);var l1=(n,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of t1(t))!o1.call(n,l)&&l!==e&&G(n,l,{get:()=>t[l],enumerable:!(r=n1(t,l))||r.enumerable});return n};var i1=(n,t,e)=>(e=n!=null?e1(r1(n)):{},l1(t||!n||!n.__esModule?G(e,"default",{value:n,enumerable:!0}):e,n));var B=x((U1,M)=>{var a1="Input must be an string, Buffer or Uint8Array";function s1(n){let t;if(n instanceof Uint8Array)t=n;else if(typeof n=="string")t=new TextEncoder().encode(n);else throw new Error(a1);return t}function f1(n){return Array.prototype.map.call(n,function(t){return(t<16?"0":"")+t.toString(16)}).join("")}function m(n){return(4294967296+n).toString(16).substring(1)}function b1(n,t,e){let r=`
`+n+" = ";for(let l=0;l<t.length;l+=2){if(e===32)r+=m(t[l]).toUpperCase(),r+=" ",r+=m(t[l+1]).toUpperCase();else if(e===64)r+=m(t[l+1]).toUpperCase(),r+=m(t[l]).toUpperCase();else throw new Error("Invalid size "+e);l%6===4?r+=`
`+new Array(n.length+4).join(" "):l<t.length-2&&(r+=" ")}console.log(r)}function u1(n,t,e){let r=new Date().getTime(),l=new Uint8Array(t);for(let h=0;h<t;h++)l[h]=h%256;let a=new Date().getTime();console.log("Generated random input in "+(a-r)+"ms"),r=a;for(let h=0;h<e;h++){let _=n(l),I=new Date().getTime(),d=I-r;r=I,console.log("Hashed in "+d+"ms: "+_.substring(0,20)+"..."),console.log(Math.round(t/(1<<20)/(d/1e3)*100)/100+" MB PER SECOND")}}M.exports={normalizeInput:s1,toHex:f1,debugPrint:b1,testSpeed:u1}});var j=x((A1,O)=>{var H=B();function y(n,t,e){let r=n[t]+n[e],l=n[t+1]+n[e+1];r>=4294967296&&l++,n[t]=r,n[t+1]=l}function T(n,t,e,r){let l=n[t]+e;e<0&&(l+=4294967296);let a=n[t+1]+r;l>=4294967296&&a++,n[t]=l,n[t+1]=a}function C(n,t){return n[t]^n[t+1]<<8^n[t+2]<<16^n[t+3]<<24}function k(n,t,e,r,l,a){let h=p[l],_=p[l+1],I=p[a],d=p[a+1];y(o,n,t),T(o,n,h,_);let u=o[r]^o[n],c=o[r+1]^o[n+1];o[r]=c,o[r+1]=u,y(o,e,r),u=o[t]^o[e],c=o[t+1]^o[e+1],o[t]=u>>>24^c<<8,o[t+1]=c>>>24^u<<8,y(o,n,t),T(o,n,I,d),u=o[r]^o[n],c=o[r+1]^o[n+1],o[r]=u>>>16^c<<16,o[r+1]=c>>>16^u<<16,y(o,e,r),u=o[t]^o[e],c=o[t+1]^o[e+1],o[t]=c>>>31^u<<1,o[t+1]=u>>>31^c<<1}var D=new Uint32Array([4089235720,1779033703,2227873595,3144134277,4271175723,1013904242,1595750129,2773480762,2917565137,1359893119,725511199,2600822924,4215389547,528734635,327033209,1541459225]),c1=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,14,10,4,8,9,15,13,6,1,12,0,2,11,7,5,3,11,8,12,0,5,2,15,13,10,14,3,6,7,1,9,4,7,9,3,1,13,12,11,14,2,6,5,10,4,0,15,8,9,0,5,7,2,4,10,15,14,1,11,12,6,8,3,13,2,12,6,10,0,11,8,3,4,13,7,5,15,14,1,9,12,5,1,15,14,13,4,10,0,7,6,3,9,2,8,11,13,11,7,14,12,1,3,9,5,0,15,4,8,6,2,10,6,15,14,9,11,3,0,8,12,2,13,7,1,4,10,5,10,2,8,4,7,6,1,5,15,11,9,14,3,12,13,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,14,10,4,8,9,15,13,6,1,12,0,2,11,7,5,3],f=new Uint8Array(c1.map(function(n){return n*2})),o=new Uint32Array(32),p=new Uint32Array(32);function R(n,t){let e=0;for(e=0;e<16;e++)o[e]=n.h[e],o[e+16]=D[e];for(o[24]=o[24]^n.t,o[25]=o[25]^n.t/4294967296,t&&(o[28]=~o[28],o[29]=~o[29]),e=0;e<32;e++)p[e]=C(n.b,4*e);for(e=0;e<12;e++)k(0,8,16,24,f[e*16+0],f[e*16+1]),k(2,10,18,26,f[e*16+2],f[e*16+3]),k(4,12,20,28,f[e*16+4],f[e*16+5]),k(6,14,22,30,f[e*16+6],f[e*16+7]),k(0,10,20,30,f[e*16+8],f[e*16+9]),k(2,12,22,24,f[e*16+10],f[e*16+11]),k(4,14,16,26,f[e*16+12],f[e*16+13]),k(6,8,18,28,f[e*16+14],f[e*16+15]);for(e=0;e<16;e++)n.h[e]=n.h[e]^o[e]^o[e+16]}var w=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);function z(n,t,e,r){if(n===0||n>64)throw new Error("Illegal output length, expected 0 < length <= 64");if(t&&t.length>64)throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");if(e&&e.length!==16)throw new Error("Illegal salt, expected Uint8Array with length is 16");if(r&&r.length!==16)throw new Error("Illegal personal, expected Uint8Array with length is 16");let l={b:new Uint8Array(128),h:new Uint32Array(16),t:0,c:0,outlen:n};w.fill(0),w[0]=n,t&&(w[1]=t.length),w[2]=1,w[3]=1,e&&w.set(e,32),r&&w.set(r,48);for(let a=0;a<16;a++)l.h[a]=D[a]^C(w,a*4);return t&&(S(l,t),l.c=128),l}function S(n,t){for(let e=0;e<t.length;e++)n.c===128&&(n.t+=n.c,R(n,!1),n.c=0),n.b[n.c++]=t[e]}function q(n){for(n.t+=n.c;n.c<128;)n.b[n.c++]=0;R(n,!0);let t=new Uint8Array(n.outlen);for(let e=0;e<n.outlen;e++)t[e]=n.h[e>>2]>>8*(e&3);return t}function P(n,t,e,r,l){e=e||64,n=H.normalizeInput(n),r&&(r=H.normalizeInput(r)),l&&(l=H.normalizeInput(l));let a=z(e,t,r,l);return S(a,n),q(a)}function h1(n,t,e,r,l){let a=P(n,t,e,r,l);return H.toHex(a)}O.exports={blake2b:P,blake2bHex:h1,blake2bInit:z,blake2bUpdate:S,blake2bFinal:q}});var X=x((I1,W)=>{var K=B();function k1(n,t){return n[t]^n[t+1]<<8^n[t+2]<<16^n[t+3]<<24}function g(n,t,e,r,l,a){i[n]=i[n]+i[t]+l,i[r]=E(i[r]^i[n],16),i[e]=i[e]+i[r],i[t]=E(i[t]^i[e],12),i[n]=i[n]+i[t]+a,i[r]=E(i[r]^i[n],8),i[e]=i[e]+i[r],i[t]=E(i[t]^i[e],7)}function E(n,t){return n>>>t^n<<32-t}var L=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),b=new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,14,10,4,8,9,15,13,6,1,12,0,2,11,7,5,3,11,8,12,0,5,2,15,13,10,14,3,6,7,1,9,4,7,9,3,1,13,12,11,14,2,6,5,10,4,0,15,8,9,0,5,7,2,4,10,15,14,1,11,12,6,8,3,13,2,12,6,10,0,11,8,3,4,13,7,5,15,14,1,9,12,5,1,15,14,13,4,10,0,7,6,3,9,2,8,11,13,11,7,14,12,1,3,9,5,0,15,4,8,6,2,10,6,15,14,9,11,3,0,8,12,2,13,7,1,4,10,5,10,2,8,4,7,6,1,5,15,11,9,14,3,12,13,0]),i=new Uint32Array(16),s=new Uint32Array(16);function V(n,t){let e=0;for(e=0;e<8;e++)i[e]=n.h[e],i[e+8]=L[e];for(i[12]^=n.t,i[13]^=n.t/4294967296,t&&(i[14]=~i[14]),e=0;e<16;e++)s[e]=k1(n.b,4*e);for(e=0;e<10;e++)g(0,4,8,12,s[b[e*16+0]],s[b[e*16+1]]),g(1,5,9,13,s[b[e*16+2]],s[b[e*16+3]]),g(2,6,10,14,s[b[e*16+4]],s[b[e*16+5]]),g(3,7,11,15,s[b[e*16+6]],s[b[e*16+7]]),g(0,5,10,15,s[b[e*16+8]],s[b[e*16+9]]),g(1,6,11,12,s[b[e*16+10]],s[b[e*16+11]]),g(2,7,8,13,s[b[e*16+12]],s[b[e*16+13]]),g(3,4,9,14,s[b[e*16+14]],s[b[e*16+15]]);for(e=0;e<8;e++)n.h[e]^=i[e]^i[e+8]}function J(n,t){if(!(n>0&&n<=32))throw new Error("Incorrect output length, should be in [1, 32]");let e=t?t.length:0;if(t&&!(e>0&&e<=32))throw new Error("Incorrect key length, should be in [1, 32]");let r={h:new Uint32Array(L),b:new Uint8Array(64),c:0,t:0,outlen:n};return r.h[0]^=16842752^e<<8^n,e>0&&(F(r,t),r.c=64),r}function F(n,t){for(let e=0;e<t.length;e++)n.c===64&&(n.t+=n.c,V(n,!1),n.c=0),n.b[n.c++]=t[e]}function N(n){for(n.t+=n.c;n.c<64;)n.b[n.c++]=0;V(n,!0);let t=new Uint8Array(n.outlen);for(let e=0;e<n.outlen;e++)t[e]=n.h[e>>2]>>8*(e&3)&255;return t}function Q(n,t,e){e=e||32,n=K.normalizeInput(n);let r=J(e,t);return F(r,n),N(r)}function w1(n,t,e){let r=Q(n,t,e);return K.toHex(r)}W.exports={blake2s:Q,blake2sHex:w1,blake2sInit:J,blake2sUpdate:F,blake2sFinal:N}});var Z=x((d1,Y)=>{var U=j(),A=X();Y.exports={blake2b:U.blake2b,blake2bHex:U.blake2bHex,blake2bInit:U.blake2bInit,blake2bUpdate:U.blake2bUpdate,blake2bFinal:U.blake2bFinal,blake2s:A.blake2s,blake2sHex:A.blake2sHex,blake2sInit:A.blake2sInit,blake2sUpdate:A.blake2sUpdate,blake2sFinal:A.blake2sFinal}});var v=i1(Z()),{blake2b:x1,blake2bHex:m1,blake2bInit:y1,blake2bUpdate:H1,blake2bFinal:E1,blake2s:_1,blake2sHex:B1,blake2sInit:S1,blake2sUpdate:F1,blake2sFinal:G1}=v,{default:$,...g1}=v,M1=$!==void 0?$:g1;export{x1 as blake2b,E1 as blake2bFinal,m1 as blake2bHex,y1 as blake2bInit,H1 as blake2bUpdate,_1 as blake2s,G1 as blake2sFinal,B1 as blake2sHex,S1 as blake2sInit,F1 as blake2sUpdate,M1 as default};
