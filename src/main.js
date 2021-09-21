import './main.css';
import Chat from 'twitch-chat-emotes';

import pixelMoonSrc from './pixel-moon.png';
const pixelMoon = new Image();
pixelMoon.src = pixelMoonSrc;

// a default array of twitch channels to join
let channels = ['moonmoon'];

// the following few lines of code will allow you to add ?channels=channel1,channel2,channel3 to the URL in order to override the default array of channels
const query_vars = {};
const query_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    query_vars[key] = value;
});
if (query_vars.channels) {
    channels = query_vars.channels.split(',');
}

const pixelRatio = 3;
const emoteSize = 32;

// create our chat instance
const ChatInstance = new Chat({
    channels,
	maximumEmoteLimit: 4,
    duplicateEmoteLimit: 0,
})

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');


function resize() {
    canvas.width = window.innerWidth / pixelRatio;
    canvas.height = window.innerHeight / pixelRatio;
}
resize();
window.addEventListener('resize', resize);


let lastFrame = Date.now();
// Called once per frame
function draw() {
    window.requestAnimationFrame(draw);

    // number of seconds since the last frame was drawn
    const delta = (Date.now() - lastFrame) / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let o = emoteArray.length - 1; o >= 0; o--) {
        const emoteGroup = emoteArray[o];

        // Keep track of where we should be drawing the next emote per message
        let xOffset = 0;

        for (let i = 0; i < emoteGroup.emotes.length; i++) {
            const emote = emoteGroup.emotes[i];
            ctx.drawImage(emote.gif.canvas, xOffset + emoteGroup.x, emoteGroup.y, emoteSize, emoteSize);
            xOffset += emoteSize;
        }

        // Delete a group after 10 seconds
        if (emoteGroup.spawn < Date.now() - 10000) {
            emoteArray.splice(o, 1);
        }
    }

	const centerx = Math.floor(Math.floor(Math.floor(canvas.width / 4) / emoteSize) * emoteSize);
	const centery = Math.floor(Math.floor(Math.floor(canvas.height / 2) / emoteSize) * emoteSize);
	ctx.clearRect(Math.round(centerx - pixelMoon.width / 2), Math.round(centery - pixelMoon.height / 2), pixelMoon.width, pixelMoon.height);
	ctx.drawImage(pixelMoon, Math.round(centerx - pixelMoon.width / 2), Math.round(centery - pixelMoon.height / 2));


    lastFrame = Date.now();
}

// add a callback function for when a new message with emotes is sent
const emoteArray = [];
ChatInstance.on("emotes", (emotes) => {
    emoteArray.push({
        emotes,
        x: Math.floor(Math.floor(Math.floor(Math.random() * canvas.width) / emoteSize) * emoteSize),
        y: Math.floor(Math.floor(Math.floor(Math.random() * canvas.height) / emoteSize) * emoteSize),
        spawn: Date.now()
    });
})

draw();
