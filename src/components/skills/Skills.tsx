import "./Skills.css";

import SkillCard from "./SkillCard";

import { useCachedData } from "../../lib/cache";

import {
  getPublishedSkills,
  getSkillCategories,
} from "../../services/skills.service";

export default function Skills() {
  const { data: categories } = useCachedData(
    "skills:categories",
    getSkillCategories
  );

  const { data: skills } = useCachedData(
    "skills:published",
    getPublishedSkills
  );

  if (!categories || !skills) return null;

  return (
    <section className="skills-section">

      {categories.map((category) => {

        const categorySkills =
          skills.filter(
            (skill) =>
              skill.category_id ===
              category.id
          );

        if (
          categorySkills.length === 0
        )
          return null;

        return (
          <section
            key={category.id}
            className="skill-category"
          >
            <div className="category-header">

              <h2>
                {category.title}
              </h2>

              <p>
                {category.description}
              </p>

            </div>

            <div className="skills-grid">

              {categorySkills.map(
                (skill) => (
                  <SkillCard
                    key={skill.id}
                    title={skill.title}
                    description={
                      skill.description
                    }
                    icon={skill.icon}
                  />
                )
              )}

            </div>
          </section>
        );
      })}

    </section>
  );
}
