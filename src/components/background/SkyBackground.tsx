import "./SkyBackground.css";

import {
  useTheme,
} from "../../contexts/ThemeContext";

import {
  useSettings,
} from "../../contexts/SettingsContext";


export default function SkyBackground() {

  const {
    theme,
  } = useTheme();


  const {
    settings,
  } = useSettings();


  const image =
    theme === "light"
      ? settings?.day_background_url
      : settings?.night_background_url;


  return (
    <div
      className="sky-background"
      aria-hidden="true"
    >

      {image && (

        <img
          src={image}
          className="sky-image"
          alt=""
          aria-hidden="true"
          decoding="async"
          fetchPriority="low"
        />

      )}

      <div
        className="sky-overlay"
      />

    </div>
  );
}