import { FaEnvelope } from "react-icons/fa";
import type { Profile } from "../../services/profile.service";

interface HeroProfileProps {
  profile: Profile;
}

export default function HeroProfile({
  profile,
}: HeroProfileProps) {
  const scrollToContact = () => {
    document
      .getElementById("contact")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <div className="hero-profile">
      <img
        src={profile.profile_image}
        alt={profile.full_name}
        className="profile-image"
        width={300}
        height={300}
        fetchPriority="high"
        decoding="async"
      />

      <button
        className="contact-btn"
        onClick={scrollToContact}
      >
        <FaEnvelope />

        <span>{profile.contact_button_text}</span>
      </button>
    </div>
  );
}