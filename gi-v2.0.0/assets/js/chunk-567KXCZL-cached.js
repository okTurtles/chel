import{g as y}from"./chunk-TTB57MVS-cached.js";import{c as x}from"./chunk-I2AIXHXH-cached.js";import{m as v}from"./chunk-3V7YD6RE-cached.js";import{a as w}from"./chunk-GWRDICTQ-cached.js";import{b as _}from"./chunk-33M5GGRR-cached.js";var S=[{createdAt:new Date("2025-06-10T00:00:01"),title:"Version 2.0 + New Server! \u{1F973}",content:`Read [the announcement blog post](https://groupincome.org/2025/06/group-income-2.0/) for more details.

**New Features**

- Long chatroom messages are now truncated with a "Show more" link
- Notification volume can now be adjusted in settings
- You can now mark messages as unread in chatrooms and DMs
- French localization
- Server: admins can now display custom messages on login/signup screen
- Server: archive mode lets server admins set Group Income to read-only
- Server: data accounting logic now keeps track of data usage

**Improvements**

- Chatroom names now displayed in bold when they have new messages
- Replying to a message no longer quotes entire message
- You can now delete your group, your identity, everything
- Push notifications much more reliable, and toggling them on and off in the settings fixes most issues
- Handling of unread messages greatly improved
- Extensionless files can now be uploaded in chat
- Darktheme arrows now used for picture viewer
- Profile cards can be opened in the Contributions page
- Set notification settings in private chatrooms to behave the same as DMs by default
- Server now keeps track of data usage
- Various low-level improvements to Shelter Protocol and Chelonia
- Various low-level server-side improvements related to data storage

**Bugfixes**

- Fixed missing "Delete message" button in menu on mobile
- Chat remembers chatroom scroll position
- Tooltips not disappearing when they should
- Various text alignment and overflow issues fixed
- Payment streaks are properly reset when switching to non-participant (pledging $0)
- Properly scroll chat on new message when window is in background
- Properly play notification sounds for chatroom events
- Multiple bugfixes for issues preventing chatrooms from rendering properly
- Fixed a bug that prevented multilingual translations from working
- Fixed instances of contractID showing up instead of user display name
- Various UI bugfixes
- Various bugfixes to Chelonia`},{createdAt:new Date("2025-01-23T00:00:01"),title:"Version 1.2.0 + The coming server wipe!",content:`**New Features in 1.2.0:**

- Push notifications! This version includes full support for end-to-end encrypted web push notifications. Works best on mobile as a [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing). Please see [our blog](https://groupincome.org/blog/) for this release for more details and caveats about push notifications, especially on iOS.
- Push notifications are now used for important in-group events and reminders.
- You can now change your password!
- Image compression: uploaded images will take up a maximum of ~400KB each to speed up loading times and save server space.
- Image viewer now supports left/right arrow keys to switch between multiple image attachments.
- Chat file attachments now show their size.
- You can now use the paste feature to add an image attachment.
- Mobile: \`<enter>\` key creates newline instead of sending message
- Chelonia now runs in a service worker to support push notifications and better state management with multiple open tabs.

**Bugfixes**

- Prevent accidental creation of multiple DMs.
- Fixed rendering of payment table rows.
- Fixes for forced-color mode.
- Fixed remaining issues related to showing not-logged-in users under group inactivity.
- "See proposal" link should always lead to proposal.
- Fixed chat auto-scroll issue.
- Fixed various markdown rendering bugs in chat.
- Miscellaneous bug fixes.

**Improvements**

- Added download/delete buttons to the image viewer.
- Emojis rendered slightly larger in chat now.
- Increased the maximum length of payment details to support long Lightning payment addresses.
- Various UI/UX improvements. See the 1.2.0 release [here](https://github.com/okTurtles/group-income/releases) for a complete list.

Congratulations to [@Vayras](https://github.com/Vayras) on making their first contribution to the project!

**Server Wipe Coming in Version 2.0!**

Version 2.0 is coming soon, and with it some major backwards-incompatible changes to the internals of Group Income. We will be forced to wipe all data on the groupincome.app site. Therefore, **please backup** any important data before the release to your computer. We will host a temporary backup site where users will be able to access their data for a period of time after the new version launches.`},{createdAt:new Date("2024-10-29T00:00:01"),title:"1.1.0 Released!",content:`**New Features**

- New image viewer: zoom in and out of photos with ease!
- "Notes to self": can create DM's to yourself now
- Notifications for non-monetary contributions updates
- Anyone-can-join invite links are now updated to support maximum 150 invitations

NOTE: old anyone-can-join invite links are expired, please use the new one!

**Bugfixes**

- The emoji selector's search field is now selected when you open it
- Fix for usernames in app notifications when user is removed
- Fix for "haven't logged in" users metric
- Fixed a markdown-related formatting issue related to lists
- Fixed send button not enabled when pasting text into chat
- Fix closing expired proposals

**Improvements**

- Add a red badge to the info icon to make it easier to see where DMs are
- Improved edit message input field hight
- Placeholders for payment info fields
- Misc. internal improvements`},{createdAt:new Date("2024-07-26T00:00:01"),title:"Group Income 1.0 released! \u{1F973}",content:`\u{1F3A6} See the release party footage:

[https://groupincome.org/2024/07/group-income-released/](https://groupincome.org/2024/07/group-income-released/)`},{createdAt:new Date("2023-06-08T00:00:01"),title:"The Prototype is Ready",content:"It's been quite a journey, but we're finally here. A new kind of software is ready for testing. If you have a group of friends/family that's interested in supporting one another using monetary and non-monetary means, you're a perfect fit to try out the Group Income prototype, and we want to hear from you! Read more on our blog: [https://groupincome.org/2023/06/the-prototype-is-ready/](https://groupincome.org/2023/06/the-prototype-is-ready/)"},{createdAt:new Date("2021-06-08T00:00:01"),title:"Roadmap Updates",content:"Some say it's not the destination that matters so much, but the journey and friends you meet along the way. I couldn't agree more. But also, destinations aren't to be underestimated either! Back in 2019, during the Before Times, our team \u2014 a mixture of independent contractors and volunteers \u2014 got together. Read more on our blog: [https://groupincome.org/2021/06/bulgaria-hackathon-2019-roadmap-updates-hiring/](https://groupincome.org/2021/06/bulgaria-hackathon-2019-roadmap-updates-hiring/)"}],C={name:"NewAndUpdates",components:{Avatar:w,RenderMessageWithMarkdown:y},data(){return{dummyPosts:S}},methods:{humanDate:v}},I=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"c-news-and-updates-container"},t._l(t.dummyPosts,function(i,r){return n("div",{key:r,staticClass:"c-post-block"},[n("div",{staticClass:"c-post-created-date"},[t._v(t._s(t.humanDate(i.createdAt,{month:"long",year:"numeric",day:"numeric"})))]),n("div",{staticClass:"card c-post-card"},[n("div",{staticClass:"c-post-img-container"},[n("avatar",{staticClass:"c-post-img",attrs:{src:"/assets/images/group-income-icon-transparent-circle.png",alt:"GI Logo",size:"xs"}})],1),n("div",{staticClass:"c-post-content"},[n("h3",{staticClass:"is-title-4"},[t._v(t._s(i.title))]),n("render-message-with-markdown",{attrs:{text:i.content}})],1)])])}),0)},R=[],T=function(t){t&&t("data-v-489a8467_0",{source:".c-post-block[data-v-489a8467]{position:relative;width:100%;margin-bottom:2rem}.c-post-created-date[data-v-489a8467]{padding-left:1rem;font-weight:700;margin-bottom:.5rem}.c-post-card[data-v-489a8467]{display:flex;align-items:flex-start;gap:.75rem;padding:1.5rem}.c-post-card .c-post-img-container[data-v-489a8467]{display:inline-flex;justify-content:center;align-items:center;width:2.75rem;height:2.75rem;border-radius:50%;background-color:var(--general_2);flex-shrink:0}.c-post-card .c-post-content[data-v-489a8467]{flex-grow:1}.c-post-card .c-post-content h3[data-v-489a8467]{margin-bottom:.5rem}",map:void 0,media:void 0})},j="data-v-489a8467",F=void 0,N=!1;function A(t,a,n,i,r,u,o,d,c,l){let e=(typeof n=="function"?n.options:n)||{};e.__file=`style>
`,e.render||(e.render=t.render,e.staticRenderFns=t.staticRenderFns,e._compiled=!0,r&&(e.functional=!0)),e._scopeId=i;{let m;if(a&&(m=o?function(s){a.call(this,l(s,this.$root.$options.shadowRoot))}:function(s){a.call(this,d(s))}),m!==void 0)if(e.functional){let s=e.render;e.render=function(f,p){return m.call(p),s(f,p)}}else{let s=e.beforeCreate;e.beforeCreate=s?[].concat(s,m):[m]}}return e}function h(){let t=h.styles||(h.styles={}),a=typeof navigator<"u"&&/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());return function(i,r){if(document.querySelector('style[data-vue-ssr-id~="'+i+'"]'))return;let u=a?r.media||"default":i,o=t[u]||(t[u]={ids:[],parts:[],element:void 0});if(!o.ids.includes(i)){let d=r.source,c=o.ids.length;if(o.ids.push(i),r.map&&(d+=`
/*# sourceURL=`+r.map.sources[0]+" */",d+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(r.map))))+" */"),a&&(o.element=o.element||document.querySelector("style[data-group="+u+"]")),!o.element){let l=document.head||document.getElementsByTagName("head")[0],e=o.element=document.createElement("style");e.type="text/css",r.media&&e.setAttribute("media",r.media),a&&(e.setAttribute("data-group",u),e.setAttribute("data-next-index","0")),l.appendChild(e)}if(a&&(c=parseInt(o.element.getAttribute("data-next-index")),o.element.setAttribute("data-next-index",c+1)),o.element.styleSheet)o.parts.push(d),o.element.styleSheet.cssText=o.parts.filter(Boolean).join(`
`);else{let l=document.createTextNode(d),e=o.element.childNodes;e[c]&&o.element.removeChild(e[c]),e.length?o.element.insertBefore(l,e[c]):o.element.appendChild(l)}}}}var $=A({render:I,staticRenderFns:R},T,C,j,N,F,!1,h,void 0,void 0),b=$;var D={name:"NewAndUpdates"},E=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"c-news-and-updates-container"},[n("i18n",{attrs:{tag:"p"}},[t._v("Direct Messages: Coming soon!")])],1)},M=[],U=void 0,V="data-v-5343d96c",P=void 0,B=!1;function O(t,a,n,i,r,u,o,d,c,l){let e=(typeof n=="function"?n.options:n)||{};return e.__file=`style>
`,e.render||(e.render=t.render,e.staticRenderFns=t.staticRenderFns,e._compiled=!0,r&&(e.functional=!0)),e._scopeId=i,e}var G=O({render:E,staticRenderFns:M},U,D,V,B,P,!1,void 0,void 0,void 0),k=G;var W={"news-and-updates":{title:_("News & Updates"),routeTo:"/global-dashboard/news-and-updates",icon:"newspaper"},"direct-messages":{title:_("Direct Messages"),routeTo:"/global-dashboard/direct-messages",icon:"comment"}},L={"news-and-updates":b,"direct-messages":k},z={name:"GlobalDashboard",components:{Page:x},computed:{currentTabSetting(){return W[this.$route.params.id||"news-and-updates"]},currentContent(){return L[this.$route.params.id||"news-and-updates"]}}},X=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("page",{attrs:{pageTestName:"GlobalDashboard",pageTestHeaderName:"pageHeaderName"},scopedSlots:t._u([{key:"title",fn:function(){return[t._v(t._s(t.currentTabSetting.title))]},proxy:!0}])},[n(t.currentContent,{key:t.$route.params.id,tag:"component"})],1)},q=[],H=void 0,Y="data-v-35808785",J=void 0,K=!1;function Q(t,a,n,i,r,u,o,d,c,l){let e=(typeof n=="function"?n.options:n)||{};return e.__file=`style>
`,e.render||(e.render=t.render,e.staticRenderFns=t.staticRenderFns,e._compiled=!0,r&&(e.functional=!0)),e._scopeId=i,e}var Z=Q({render:X,staticRenderFns:q},H,z,Y,K,J,!1,void 0,void 0,void 0),ce=Z;export{W as a,ce as b};
//# sourceMappingURL=chunk-567KXCZL-cached.js.map
