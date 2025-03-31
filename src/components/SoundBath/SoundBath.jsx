import { useEffect, useRef } from "react";
import * as Tone from "tone";
import "./SoundBath.scss";

// global variables
let masterGain = null;
let synth = null;
let bassSynth = null;
let reverb = null;
let tremolo = null;
let initialized = false;

export default function SoundBath({ volume, mute }) {
  // refs to track ongoing processes
  const timeoutsRef = useRef([]);
  const playbackRef = useRef(true);

  // track currently playing notes
  const activeHighNotesRef = useRef([]);
  const activeBassNoteRef = useRef(null);

  // crystal singing bowl notes
  const crystalBowls = {
    high: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"], // higher pitched bowls
    low: ["C3", "D3", "E3", "F3", "G3", "A3", "B3"], // lower pitched bowls
  };

  // update master gain when volume changes
  useEffect(() => {
    if (masterGain) {
      masterGain.gain.value = volume;
    }
  }, [volume]);

  // handle mute toggling
  useEffect(() => {
    if (masterGain) {
      if (mute) {
        masterGain.gain.rampTo(0, 0.3);
      } else {
        // restore to proper volume
        masterGain.gain.rampTo(volume, 0.3);
      }
    }
  }, [mute, volume]);

  // initialize sound bath
  const initializeSoundBath = async () => {
    try {
      // check Tone context state
      if (Tone.context.state !== "running") {
        // if not running, set up a click listener
        const handleFirstInteraction = async () => {
          try {
            await Tone.start();

            // initialize audio
            const success = await initializeAudio();
            if (success) {
              playSoundBath();
            }

            // remove listener after first successful interaction
            document.removeEventListener("click", handleFirstInteraction);
          } catch (error) {
            console.error("Initialization error:", error);
          }
        };

        document.addEventListener("click", handleFirstInteraction);
      } else {
        // audio context already running, initialize immediately
        const success = await initializeAudio();
        if (success) {
          playSoundBath();
        }
      }
    } catch (error) {
      console.error("Sound bath initialization error:", error);
    }
  };

  // trigger initial sound on mount
  useEffect(() => {
    initializeSoundBath();

    return () => {
      cleanupAudio();
    };
  }, []);

  // clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    // clear timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // cancel transport events
    Tone.Transport.cancel();

    // dispose audio nodes
    if (initialized) {
      try {
        if (synth && !synth.disposed) synth.releaseAll();
        if (bassSynth && !bassSynth.disposed) bassSynth.releaseAll();

        if (synth) synth.dispose();
        if (bassSynth) bassSynth.dispose();
        if (tremolo) tremolo.dispose();
        if (reverb) reverb.dispose();
        if (masterGain) masterGain.dispose();

        initialized = false;
        synth = null;
        bassSynth = null;
        tremolo = null;
        reverb = null;
        masterGain = null;
      } catch (error) {
        console.error("error during cleanup:", error);
      }
    }

    // reset tracking arrays
    activeHighNotesRef.current = [];
    activeBassNoteRef.current = null;
  };

  // initialize audio after user interaction
  const initializeAudio = async () => {
    if (initialized) {
      return true;
    }

    try {
      await Tone.start(); // start tone.js after user interaction

      // master volume control with initial gain based on provided volume prop
      const initialGain = mute ? 0 : volume;
      masterGain = new Tone.Gain(initialGain).toDestination();

      // high notes synth
      synth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 4,
        oscillator: { type: "sine" },
        envelope: { attack: 8, decay: 3, sustain: 0.9, release: 15 },
      });

      // low notes synth with smoother settings to prevent choppiness
      bassSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 2, // reduced to prevent overload
        oscillator: {
          type: "sine",
          // detune: -5, // slight detune for binaural effect
        },
        envelope: {
          attack: 20, // longer attack to prevent pops/clicks
          decay: 15, // longer decay
          sustain: 0.9, // higher sustain level for smoother sound
          release: 40, // longer release for smooth fadeout
        },
      });

      // limiter to prevent distortion
      const limiter = new Tone.Limiter(-3);

      // reverb effect
      reverb = new Tone.Reverb({
        decay: 8,
        wet: 0.5,
      });

      await reverb.generate(); // wait for reverb to generate

      // slow pulsing effect with less depth to reduce choppiness
      tremolo = new Tone.Tremolo(0.05, 0.1); // slower rate, less depth
      tremolo.start();

      // connect audio graph
      synth.connect(tremolo);
      tremolo.connect(reverb);
      reverb.connect(limiter);
      limiter.connect(masterGain);

      // quiet synths
      synth.volume.value = -28; // dB
      bassSynth.volume.value = -28; // dB

      // low pass filter to bass to make it smoother, high-pass filter to remove excessive sub-bass (help small speakers)
      const lowPassFilter = new Tone.Filter(500, "lowpass");
      const highPassFilter = new Tone.Filter(100, "highpass");

      bassSynth.connect(lowPassFilter);
      lowPassFilter.connect(highPassFilter);
      highPassFilter.connect(reverb);

      initialized = true;

      return true;
    } catch (error) {
      console.error("failed to initialize audio", error);
      return false;
    }
  };

  // calculate 432hz tuning frequency
  const get432Frequency = (note) => {
    const noteMap = {
      C3: 130.81,
      D3: 146.83,
      E3: 164.81,
      F3: 174.61,
      G3: 196.0,
      A3: 220.0,
      B3: 246.94,
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      B4: 493.88,
    };

    // adjust from 440hz to 432hz
    const stdFreq = noteMap[note] || 440;
    return stdFreq * 0.9818;
  };

  // get random time interval
  const getRandomInterval = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // get random note
  const getRandomNote = (bowlSet) => {
    return bowlSet[Math.floor(Math.random() * bowlSet.length)];
  };

  // check if notes sound good together
  const isComplementary = (note1, note2) => {
    if (!note1 || !note2) {
      return true;
    }
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    const root1 = note1.slice(0, -1);
    const root2 = note2.slice(0, -1);

    const note1Index = notes.indexOf(root1);
    const note2Index = notes.indexOf(root2);

    // good harmonic intervals: 3rds, 5ths, octaves
    const diff = Math.abs(note1Index - note2Index);
    return diff === 0 || diff === 2 || diff === 4 || diff === 7;
  };

  // play high note with management of active notes
  const playHighNote = (note, duration) => {
    if (!synth || synth.disposed || !playbackRef.current) return;

    // keep track of high notes, limit to max 3 high notes at a time
    if (activeHighNotesRef.current.length >= 3) {
      // find the oldest note to release
      const oldestNote = activeHighNotesRef.current.shift();
      synth.triggerRelease(get432Frequency(oldestNote));
    }

    // add new note to active notes
    activeHighNotesRef.current.push(note);

    // play the new note
    const freq = get432Frequency(note);
    synth.triggerAttack(freq);

    // schedule the release
    const releaseTimeout = setTimeout(() => {
      if (!synth || synth.disposed || !playbackRef.current) return;

      synth.triggerRelease(freq);

      // remove from active notes
      const index = activeHighNotesRef.current.indexOf(note);
      if (index > -1) {
        activeHighNotesRef.current.splice(index, 1);
      }
    }, duration * 1000);

    timeoutsRef.current.push(releaseTimeout);

    return releaseTimeout;
  };

  // play bass note with management of active notes
  const playBassNote = (note, duration) => {
    if (!bassSynth || bassSynth.disposed || !playbackRef.current) return;

    // if there's an active bass note, release it first
    if (activeBassNoteRef.current) {
      const prevNote = activeBassNoteRef.current;
      const prevFreq = get432Frequency(prevNote);

      bassSynth.triggerRelease(prevFreq, "+1"); // Release over 1 second
    }

    function triggerBassNote() {
      if (!bassSynth || bassSynth.disposed || !playbackRef.current) return;

      // set as active bass note
      activeBassNoteRef.current = note;

      // play the new note
      const freq = get432Frequency(note);
      bassSynth.triggerAttack(freq);

      // schedule the release
      const releaseTimeout = setTimeout(() => {
        if (!bassSynth || bassSynth.disposed || !playbackRef.current) return;

        bassSynth.triggerRelease(freq, "+1"); // release over 1 second

        // cnly clear active note if it's still the same one
        if (activeBassNoteRef.current === note) {
          activeBassNoteRef.current = null;
        }
      }, duration * 1000);

      timeoutsRef.current.push(releaseTimeout);
    }
    setTimeout(triggerBassNote, 100); // tiny delay to avoid choppiness
  };

  // play sound bath sequence
  const playSoundBath = () => {
    if (!synth || !bassSynth) {
      console.error("synths not initialized");
      return;
    }

    // current notes - define here but trigger immediately
    let initialHighNote = getRandomNote(crystalBowls.high);
    let initialLowNote = getRandomNote(crystalBowls.low);

    // make sure first notes are complementary
    while (!isComplementary(initialHighNote, initialLowNote)) {
      initialLowNote = getRandomNote(crystalBowls.low);
    }

    // FIX: play high note immediately
    const initialHighDuration = getRandomInterval(20, 30);

    // direct call to synth to make sure the high note plays immediately
    const highFreq = get432Frequency(initialHighNote);
    synth.triggerAttack(highFreq);
    activeHighNotesRef.current.push(initialHighNote);

    // schedule release of initial high note
    const releaseHighTimeout = setTimeout(() => {
      if (!synth || synth.disposed || !playbackRef.current) return;

      synth.triggerRelease(highFreq);

      // remove from active notes
      const index = activeHighNotesRef.current.indexOf(initialHighNote);
      if (index > -1) {
        activeHighNotesRef.current.splice(index, 1);
      }
    }, initialHighDuration * 1000);

    timeoutsRef.current.push(releaseHighTimeout);

    // play first low note after a delay (doesn't cut off high note)
    const initialLowDelay = 10000; // 10 seconds delay
    const initialLowTimeout = setTimeout(() => {
      if (!playbackRef.current) return;

      const lowDuration = getRandomInterval(60, 120); // 1-2 minutes
      playBassNote(initialLowNote, lowDuration);
    }, initialLowDelay);

    timeoutsRef.current.push(initialLowTimeout);

    // schedule high notes to play periodically
    const scheduleHighNotes = () => {
      if (!playbackRef.current) return;
      // choose a note that's not currently playing if possible
      let nextNote;
      let attempts = 0;
      do {
        nextNote = getRandomNote(crystalBowls.high);
        attempts++;
        // break after a few attempts to avoid infinite loop if all notes are playing
        if (attempts > 10) break;
      } while (activeHighNotesRef.current.includes(nextNote) && attempts < 10);

      // play the high note for 15-30 seconds
      const duration = getRandomInterval(15, 30);
      playHighNote(nextNote, duration);

      // schedule next high note with gap
      const nextInterval = getRandomInterval(10000, 25000); // 10-25 seconds gap

      const nextTimeout = setTimeout(scheduleHighNotes, nextInterval);
      timeoutsRef.current.push(nextTimeout);
    };

    // schedule bass notes to play periodically
    const scheduleBassNotes = () => {
      if (!playbackRef.current) return;

      // find a complementary bass note that works with current high notes
      let nextBassNote;
      let isComplementaryToAll = false;

      // try to find a note complementary to all current high notes, if not possible after several attempts just pick a random one
      let attempts = 0;
      while (!isComplementaryToAll && attempts < 10) {
        nextBassNote = getRandomNote(crystalBowls.low);
        isComplementaryToAll = true;

        // check if complementary to all active high notes
        for (const highNote of activeHighNotesRef.current) {
          if (!isComplementary(highNote, nextBassNote)) {
            isComplementaryToAll = false;
            break;
          }
        }
        attempts++;
      }

      // play the bass note 1-2 mins
      const duration = getRandomInterval(60, 120);
      playBassNote(nextBassNote, duration);

      // schedule next bass note with longer gap
      const nextInterval = getRandomInterval(40000, 80000);

      const nextTimeout = setTimeout(scheduleBassNotes, nextInterval);
      timeoutsRef.current.push(nextTimeout);
    };

    // start high note sequence after initial high note ends
    const highNotesTimeout = setTimeout(() => {
      scheduleHighNotes();
    }, initialHighDuration * 1000 + 5000); // start after first high note ends + 5s

    timeoutsRef.current.push(highNotesTimeout);

    // start bass note sequence after first bass note
    const bassNotesTimeout = setTimeout(() => {
      scheduleBassNotes();
    }, initialLowDelay + 60000); // start after first bass played for a minute

    timeoutsRef.current.push(bassNotesTimeout);
  };

  return null;
}
