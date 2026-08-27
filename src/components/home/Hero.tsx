import { useEffect, useState } from "react";

import "./Hero.css";

import HeroProfile from "./HeroProfile";
import HeroContent from "./HeroContent";

import {
  getProfile,
  type Profile,
} from "../../services/profile.service";

import {
  getHeroRoles,
  type HeroRole,
} from "../../services/heroRoles.service";

import {
  getHeroQuotes,
  type HeroQuote,
} from "../../services/heroQuotes.service";

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<HeroRole[]>([]);
  const [quotes, setQuotes] = useState<HeroQuote[]>([]);

  useEffect(() => {
    async function loadHero() {
      const [profileData, rolesData, quotesData] =
        await Promise.all([
          getProfile(),
          getHeroRoles(),
          getHeroQuotes(),
        ]);

      console.log("========== HERO DATA ==========");
      console.log("Profile:", profileData);
      console.log("Roles:", rolesData);
      console.log("Quotes:", quotesData);
      console.log("===============================");

      setProfile(profileData);
      setRoles(rolesData);
      setQuotes(quotesData);
    }

    loadHero();
  }, []);

  if (!profile) {
  return (
    <section className="hero-section">
      <div
        style={{
          minHeight: "100vh",
        }}
      />
    </section>
  );
}

  return (
    <section className="hero-section">
      <div className="hero-container">
        <HeroProfile profile={profile} />

        <HeroContent
          profile={profile}
          roles={roles}
          quotes={quotes}
        />
      </div>
    </section>
  );
}