import {
  useEffect,
  useState,
} from "react";

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

  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null
    );

  const [
    roles,
    setRoles,
  ] =
    useState<HeroRole[]>([]);

  const [
    quotes,
    setQuotes,
  ] =
    useState<HeroQuote[]>([]);


  /* ========================================================
     LOAD HERO DATA
  ======================================================== */

  useEffect(() => {

    async function loadHero() {

      try {

        const [
          profileData,
          rolesData,
          quotesData,
        ] =
          await Promise.all([
            getProfile(),
            getHeroRoles(),
            getHeroQuotes(),
          ]);


        setProfile(
          profileData
        );

        setRoles(
          rolesData
        );

        setQuotes(
          quotesData
        );

      } catch (error) {

        console.error(
          "Failed to load hero data:",
          error
        );

      }

    }


    void loadHero();

  }, []);


  /* ========================================================
     LOADING
  ======================================================== */

  if (!profile) {

    return (
      <section
        className="hero-section hero-loading"
      >

        <div
          className="hero-loading-space"
        />

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