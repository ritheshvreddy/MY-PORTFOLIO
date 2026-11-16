import "./Hero.css";

import HeroProfile from "./HeroProfile";
import HeroContent from "./HeroContent";

import { useCachedData } from "../../lib/cache";

import { getProfile } from "../../services/profile.service";
import { getHeroRoles } from "../../services/heroRoles.service";
import { getHeroQuotes } from "../../services/heroQuotes.service";


export default function Hero() {

  const { data: profile } =
    useCachedData("hero:profile", getProfile);

  const { data: roles = [] } =
    useCachedData("hero:roles", getHeroRoles);

  const { data: quotes = [] } =
    useCachedData("hero:quotes", getHeroQuotes);


  /* ========================================================
     LOADING
  ======================================================== */

  if (!profile) {

    return (
      <section
        className="hero-section hero-loading"
        aria-busy="true"
      >

        <div className="hero-container">

          <div className="hero-profile">
            <div className="profile-image hero-skeleton" />
          </div>

          <div className="hero-content">
            <div className="hero-skeleton hero-skeleton-line short" />
            <div className="hero-skeleton hero-skeleton-line title" />
            <div className="hero-skeleton hero-skeleton-line" />
            <div className="hero-skeleton hero-skeleton-line" />
          </div>

        </div>

      </section>
    );

  }


  /* ========================================================
     HERO
  ======================================================== */

  return (

    <section className="hero-section">

      <div className="hero-container">

        <HeroProfile
          profile={profile}
        />


        <HeroContent
          profile={profile}

          roles={roles}

          quotes={quotes}
        />

      </div>

    </section>

  );
}
