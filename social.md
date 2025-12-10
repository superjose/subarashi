Making Crunchy Subs Better!

We will continue configuring a backend using Cloudflare to inject Romaji subtitles into Crunchyroll

We will inject out first subtitles from our backend!

This will add notable attack names in Romaji for series like One Piece, Naruto, and more through a Chrome extension.

💻 GOING LIVE:
https://x.com/i/broadcasts/1BdGYZowmjLJX
https://twitch.tv/javiasilis
https://x.com/i/broadcasts/1BdGYZowmjLJX

Currently Building (Open Source):

Crunchyroll Fansubbing (Injects a fancier styling, romaji, and more to Crunchyroll series like One Piece and Naruto)

Todo:

⭕️ Make our first request from the cloudflare backend. Fetch the .ass file and inject it into the stream!

So far:

• Crunchyroll injects custom .ass subtitles using a library called libass-wasm, which is a wasm-port of a C library called "libass" that helps render subtitles.
• Extensions have their own DevTools. On the extension's pop-up you can right-click and click "inspect"
• Crunchyroll downloads a .ass file that is injected into SubtitleOctopus

Todo:
✅ Understanding how Crunchyroll injects the subtitles
✅ Understanding how extensions work (First time building a Chrome/Firefox extension - Manifest V3) ✅ Injecting the first custom .ass file within a Crunchyroll
✅ Happy dancing after the first milestone!
✅ Fixing aesthetics and rendering the subtitles properly
