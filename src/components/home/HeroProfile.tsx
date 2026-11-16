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
      {/* The frame clips the photo, so it can be zoomed slightly
          to hide the dark strip along the top edge of the file */}
      <div className="profile-image">
        <img
          src={profile.profile_image}
          alt={profile.full_name}
          className="profile-photo"
          width={300}
          height={300}
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
      </div>

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