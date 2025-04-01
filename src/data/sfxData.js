const soundEffects = {
    "windChimesMedium": { src: "audio/koshi-wind-chimes-medium.mp3", volume: 0.2 },
    "windChimesSlow": { src: "audio/koshi-wind-chimes-slow-1.mp3", volume: 0.8 },
    "windChimesSlow2": { src: "audio/koshi-wind-chimes-slow-2.mp3", volume: 0.9 },
    "tingshaCymbal": { src: "audio/tingsha-cymbal.mp3", volume: 0.8 },
    "walking": { src: "audio/walking.mp3", volume: 0.8 },
    "paisteGong": { src: "audio/brilliant-paiste-32-gong.mp3", volume: 0.8 }

};

const music = {
    "intro": { src: "audio/intro.mp3", volume: 0.8 },
    "lo-fi": { src: "audio/lo-fi.mp3", volume: 0.8 },
    "playful": { src: "audio/playful.mp3", volume: 0.8 },
    "whimsical": { src: "audio/whimsical.mp3", volume: 0.05, loop: true },
    "end": { src: "audio/end.mp3", volume: 0.3, loop: 2 }
}

export { soundEffects, music };