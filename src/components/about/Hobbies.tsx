import "./About.css";

import { useCachedData } from "../../lib/cache";

import { getHobbies } from "../../services/about.service";

export default function Hobbies() {
  const { data, loading } = useCachedData(
    "about:hobbies",
    getHobbies
  );

  const hobbies = data ?? [];

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
        <h2>Hobbies & Interests</h2>

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
                  loading="lazy"
                  decoding="async"
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