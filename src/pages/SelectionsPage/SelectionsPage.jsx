import "./SelectionsPage.scss";
import { useEffect, useState } from "react";
import NextButton from "../../components/NextButton/NextButton";
import chroma from "chroma-js";

// default colors for duotone gradient palette generation
const defaultColors = [
  {
    name: "Horizon",
    hex: "A67C7C",
  },
  {
    name: "Dune",
    hex: "A8977D",
  },
  {
    name: "Trail",
    hex: "889878",
  },
  {
    name: "Ripple",
    hex: "7E96A6",
  },
  {
    name: "Twilight",
    hex: "B4A7BE",
  },
];

export default function SelectionsPage() {
  // select color/generate palette from backend
  const [palette, setPalette] = useState([]);

  // fetch color palette from local storage
  useEffect(() => {
    const fetchPalette = async () => {
      try {
        const localPalette = JSON.parse(localStorage.getItem("palette"));
        if (localPalette && localPalette.length > 0) {
          setPalette(localPalette);
        }
      } catch (error) {
        console.error("Failed to fetch color palette:", error);
      }
    };

    fetchPalette();
  }, []);

  // helper function to generate color palettes of different 'styles'
  const generatePalette = (seedColor, style = "default") => {
    const primaryColor =
      seedColor === "random"
        ? Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
        : seedColor;

    const primary = chroma(primaryColor);
    const h = primary.get("hsl.h");
    const s = primary.get("hsl.s");
    const l = primary.get("hsl.l");

    let secondaryColor;

    switch (style) {
      case "complementary": // opposite on color wheel
        secondaryColor = chroma.hsl((h + 180) % 360, s, l);
        break;
      case "analogous": // close on color wheel
        secondaryColor = chroma.hsl((h + 30) % 360, s, l);
        break;
      case "monochromatic": // same hue but different brightness/saturation
        secondaryColor = chroma.hsl(h, s - 0.3, l + 0.3);
        break;
      case "vibrant": // increased saturation + contrast
        secondaryColor = chroma.hsl(
          (h + 60) % 360,
          Math.min(1, s + 0.2),
          Math.min(0.9, l + 0.2)
        );
        break;
      default: // default soft duotone
        secondaryColor = chroma.hsl(
          (h + 50) % 360,
          Math.max(0.4, s - 0.1),
          Math.min(0.85, l + 0.15)
        );
    }

    const newPalette = chroma
      .scale([
        primaryColor,
        chroma.mix(primaryColor, secondaryColor, 0.3, "lab"),
        chroma.mix(primaryColor, secondaryColor, 0.5, "lab"),
        chroma.mix(primaryColor, secondaryColor, 0.7, "lab"),
        secondaryColor,
      ])
      .mode("lab")
      .colors(5, "hex");

    setPalette(newPalette);
    localStorage.setItem("palette", JSON.stringify(newPalette));
  };

  return (
    <>
      <div className="select">
        <h1 className="select__title">Select a colour</h1>
        {defaultColors.map((color, index) => (
          <button
            onClick={() => generatePalette(color.hex)}
            key={index}
            style={{ background: `#${color.hex}` }}
          >
            {color.name}
          </button>
        ))}
        <button
          onClick={() => {
            generatePalette("random");
          }}
        >
          Random
        </button>
      </div>
      {palette.length > 0 && (
        <div className="palettes">
          <h3 className="palettes__title">Generated Palette</h3>
          <div className="palettes__wrapper">
            {palette.map((value, index) => (
              <div
                key={index}
                className="palettes__color"
                style={{ background: value }}
              ></div>
            ))}
          </div>
          <NextButton />
        </div>
      )}
    </>
  );
}
