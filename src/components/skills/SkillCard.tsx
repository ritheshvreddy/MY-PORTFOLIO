import Tilt from "react-parallax-tilt";
import "./Skills.css";

interface SkillCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function SkillCard({
  title,
  description,
  icon,
}: SkillCardProps) {
  return (
    <Tilt
      className="skill-tilt"
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1400}
      scale={1.03}
      transitionSpeed={1500}
      glareEnable
      glareMaxOpacity={0.12}
      glareColor="#ffffff"
      glarePosition="all"
    >
      <div className="skill-card">
        <div className="skill-front">
          <img
            src={icon}
            alt={title}
            className="skill-icon"
            loading="lazy"
            draggable={false}
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/80x80?text=Skill";
            }}
          />

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