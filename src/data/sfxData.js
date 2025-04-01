const soundEffects = {
    "windChimesMedium": { src: "public/audio/koshi-wind-chimes-medium.mp3", volume: 0.2 },
    "windChimesSlow": { src: "public/audio/koshi-wind-chimes-slow-1.mp3", volume: 0.8 },
    "windChimesSlow2": { src: "public/audio/koshi-wind-chimes-slow-2.mp3", volume: 0.9 },
    "tingshaCymbal": { src: "public/audio/tingsha-cymbal.mp3", volume: 0.8 },
    "walking": { src: "public/audio/walking.mp3", volume: 0.8 },
    "paisteGong": { src: "public/audio/brilliant-paiste-32-gong.mp3", volume: 0.8 }

};

const music = {
    "intro": { src: "public/audio/intro.mp3", volume: 0.8 },
    "lo-fi": { src: "public/audio/lo-fi.mp3", volume: 0.8 },
    "playful": { src: "public/audio/playful.mp3", volume: 0.8 },
    "whimsical": { src: "public/audio/whimsical.mp3", volume: 0.05, loop: true },
    "end": { src: "public/audio/end.mp3", volume: 0.3, loop: 2 }
}

export { soundEffects, music };