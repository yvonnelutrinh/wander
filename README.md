# wander: a digital reset

## overview

wander is a wellness app designed to combat digital fatigue and unlock imagination through a series of exercises. 

In our hyper-connected digital world, it's common to experience:
- Chronic digital fatigue
- Creative blockages
- Mental exhaustion

By combining guided narration, generative sound baths, and calming animations, wander offers a reset and rejuvenation for the mind.

[View live demo](https://yvonnelutrinh.github.io/wander/)

## installation

### Setup
Generate a [Gemini API key](https://ai.google.dev/gemini-api/docs/api-key)
```bash
# Clone the repository
git clone https://github.com/yvonnelutrinh/wander.git

# Navigate to project directory
cd wander

# create a .env file given the .env.example (provide your own Gemini API key)

# Install dependencies
npm install

# Start the development server
npm run dev
```

## features

- Guided narrative experience
- Generative sound bath emulating the binaural effect of crystal singing bowls
- Calm animations and user-selected color palettes for light or dark mode

## tech stack

### Frontend
- React
- JavaScript
- SCSS

### Libraries
- Tone.js
- howler.js
- Motion for React
- chroma.js
- color.js
- Gemini API
- random-words.js
- mobx
