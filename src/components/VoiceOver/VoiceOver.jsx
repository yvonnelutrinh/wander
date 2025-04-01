import { Howl } from "howler";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getAudioSource,
  sourceConfig,
} from "../SlidesManager/SlidesManager.jsx";
import "./VoiceOver.scss";
import { PUBLIC_URL } from "../../main";

export default function VoiceOver({
  onVoiceOverEnd,
  manualContinue,
  currentTextIndex,
  volume,
  mute,
}) {
  const location = useLocation().pathname;
  const cleanPath = () => `/${location.split("/")[1]}`;
  const currentRoute = cleanPath().slice(1);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    // get the appropriate audio source for the current route and text index
    const audioSource = getAudioSource(currentRoute, currentTextIndex);
    const sprite = sourceConfig[currentRoute].sprites[currentTextIndex];
    if (sprite) {
      const spriteTiming = sprite.timing;

      // create Howl instance with appropriate configuration
      const newSound = new Howl({
        src: [PUBLIC_URL+audioSource],
        sprite: { sprite: spriteTiming },
        onend: () => {
          onVoiceOverEnd();
        },
        volume: volume,
        mute: mute,
      });

      if (spriteTiming && spriteTiming.length) {
        newSound.play("sprite");
      }

      // set sound and cleanup
      setSound(newSound);
      return () => {
        if (newSound.state === "loaded") return;
        if (newSound) newSound.unload();
      };
    }
  }, [currentTextIndex, manualContinue, currentRoute]);

  useEffect(() => {
    if (sound) {
      sound.volume(volume);
      sound.mute(mute);
    }
  }, [volume, mute, sound]);

  return null;
}
