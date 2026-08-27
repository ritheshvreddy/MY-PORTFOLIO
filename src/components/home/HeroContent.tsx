import AnimatedRole from "./AnimatedRole";
import HeroButtons from "./HeroButtons";
import HeroQuote from "./HeroQuote";

import type { Profile } from "../../services/profile.service";
import type { HeroRole } from "../../services/heroRoles.service";
import type { HeroQuote as Quote } from "../../services/heroQuotes.service";

interface HeroContentProps {
  profile: Profile;
  roles: HeroRole[];
  quotes: Quote[];
}

export default function HeroContent({
  profile,
  roles,
  quotes,
}: HeroContentProps) {
  return (
    <div className="hero-content">
      <p className="hero-greeting">
        {profile.greeting}
      </p>

      <h1 className="hero-title">
        {profile.full_name}
      </h1>

      <AnimatedRole roles={roles} />

      <p className="hero-description">
        {profile.description}
      </p>

      <HeroButtons profile={profile} />

      <HeroQuote quotes={quotes} />
    </div>
  );
}