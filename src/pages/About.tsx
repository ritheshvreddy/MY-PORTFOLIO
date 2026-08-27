import AboutCard from "../components/about/AboutCard";
import Hobbies from "../components/about/Hobbies";
import Contact from "../components/about/Contact";

import "../components/about/About.css";

export default function About() {
  return (
    <main className="about-page">
      <AboutCard />

      <Hobbies />

      <Contact />
    </main>
  );
}