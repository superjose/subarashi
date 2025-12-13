We're close on releasing the MVP!

We are making crunchyroll subtitles better:

- Romanized/Romaji text for series like One Piece.
- Sharper text
- Karaoke-styled openings (later)

💻 GOING LIVE:
https://youtu.be/nmDx8MqyfMo
https://x.com/i/broadcasts/1mnxeNOLQpLKX
https://twitch.tv/javiasilis

Currently Building (Open Source):

Crunchyroll Fansubbing (Injects a fancier styling, romaji, and more to Crunchyroll series like One Piece and Naruto)

Todo:
⭕️ Work on UI/UX
⭕️ Finalize feature-set.

So far:

• Crunchyroll injects custom .ass subtitles using a library called libass-wasm, which is a wasm-port of a C library called "libass" that helps render subtitles.
• Extensions have their own DevTools. On the extension's pop-up you can right-click and click "inspect"
• Crunchyroll downloads a .ass file that is injected into SubtitleOctopus

Todo:
✅ Understanding how Crunchyroll injects the subtitles
✅ Understanding how extensions work (First time building a Chrome/Firefox extension - Manifest V3) ✅ Injecting the first custom .ass file within a Crunchyroll
✅ Happy dancing after the first milestone!
✅ Fixing aesthetics and rendering the subtitles properly
✅ Make our first request from the cloudflare backend. Fetch the .ass file and inject it into the stream!
