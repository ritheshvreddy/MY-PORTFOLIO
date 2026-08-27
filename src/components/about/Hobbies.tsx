import "./About.css";

import { useEffect, useState } from "react";

import { getHobbies } from "../../services/about.service";

import type { Hobby } from "../../types/about";

export default function Hobbies() {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHobbies() {
      const data = await getHobbies();

      setHobbies(data);

      setLoading(false);
    }

    loadHobbies();
  }, []);

  if (loading) {
    return (
      <section className="hobbies-section">
        <div className="hobbies-card">
          Loading...
        </div>
      </section>
    );
  }

  return (
    <section className="hobbies-section">
      <div className="about-header">
        <h1>Hobbies & Interests</h1>

        <p>
          Beyond building products and writing code,
          these are some of the things I genuinely enjoy.
        </p>
      </div>

      <div className="hobbies-card">
        <div className="hobby-list">
          {hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="hobby"
            >
              <div className="hobby-icon">
                <img
                  src={hobby.icon_url}
                  alt={hobby.name}
                />
              </div>

              <div className="hobby-name">
                {hobby.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}