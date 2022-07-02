# Animockup
![Demo](preview.gif)
<br>
Create stunning product teasers with animated mockups 🔥

Animockup is a web-based tool that helps you create animated mockups for your product teasers. Add gradient backgrounds, browse through 20+ mockups, customize the export settings, and much more.

[👉 Get it now](https://animockup.com)

<a href="https://www.producthunt.com/posts/animockup-2-0?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-animockup-2-0" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=319895&theme=light" alt="Animockup 2.0 - Create stunning product teasers with animated mockups | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Made by [Alyssa X](https://twitter.com/alyssaxuu)

## Table of contents

- [Features](#features)
- [Self-hosting Animockup](#self-hosting-animockup)
- [Libraries used](#libraries-used)

## Features
📹 Add a video or image of the product you want to showcase<br>
📱 Choose from 20+ device mockups and frames<br>
✂️ Crop and reposition your video in the mockup screen<br>
🎨 Customize the background, with gradients<br>
✏️ Add text and images to enhance your video<br>
🪄 Choose the start and end animations from multiple presets<br>
⏱ Set the video duration and change the easing of the animation<br>
🎚️ Set the framerate, export format, and resolution<br>
...and much more!<br>

## Self-hosting Animockup
In order to self-host Animockup, you will need to make a few changes.

1. Create a [Firebase project](https://firebase.google.com/)<br>
2. Update the firebaseConfig object in the [index.html](src/index.html) with your own values<br>
3. Animockup uses Paddle for subscriptions. You can either remove it entirely, or update with your own values in the [main.js](src/main.js) and [api.php](src/api.php) files.

## Libraries used
- [jQuery](https://jquery.com/) - for better event handling and DOM manipulation
- [FabricJs](http://fabricjs.com/) - for the interactive canvas
- [CanvasRecorder.js](https://github.com/SMUsamaShah/CanvasRecorder) - for recording the canvas
- [FFMPEG](https://www.ffmpeg.org/) - for converting the videos to different formats
- [jQuery Nice Select](https://hernansartorio.com/jquery-nice-select/) - for better dropdowns
- [Pickr](https://github.com/Simonwep/pickr) - for a better color picker
- [Anime.js](https://animejs.com/) - for animating the mockups
- [fix-webm-duration](https://github.com/yusitnikov/fix-webm-duration) - to make webm videos seekable
- [Paddle](https://paddle.com/) - for handling subscription payments
- [Firebase](https://paddle.com/) - for authentication

#

Feel free to reach out to me through email at hi@alyssax.com or [on Twitter](https://twitter.com/alyssaxuu) if you have any questions or feedback! Hope you find this useful 💜
