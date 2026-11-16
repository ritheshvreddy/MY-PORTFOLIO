import { useState } from "react";
import Tilt from "react-parallax-tilt";
import "./Skills.css";

interface SkillCardProps {
  title: string;
  description: string;
  icon: string;
}

/*
  Touch screens have no hover, so the tilt effect fights with
  scrolling and the hover-flip gets stuck. On those devices
  the card flips on tap instead.
*/
const canHover =
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

const FALLBACK_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
  );

export default function SkillCard({
  title,
  description,
  icon,
}: SkillCardProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((value) => !value);

  return (
    <Tilt
      className="skill-tilt"
      tiltEnable={canHover}
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1400}
      scale={canHover ? 1.03 : 1}
      transitionSpeed={1500}
      glareEnable={canHover}
      glareMaxOpacity={0.12}
      glareColor="#ffffff"
      glarePosition="all"
      glareBorderRadius="24px"
    >
      <div
        className={`skill-card${flipped ? " flipped" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${title}: ${flipped ? "hide" : "show"} details`}
        onClick={canHover ? undefined : toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
      >
        <div className="skill-front">
          <div className="skill-icon-wrap">
            <img
              src={icon || FALLBACK_ICON}
              alt=""
              className="skill-icon"
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_ICON) {
                  e.currentTarget.src = FALLBACK_ICON;
                }
              }}
            />
          </div>

          <h3 className="skill-title">
            {title}
          </h3>
        </div>

        <div className="skill-back">
          <h3>{title}</h3>

          <p>{description}</p>
        </div>
      </div>
    </Tilt>
  );
}
