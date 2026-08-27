import "./Skills.css";

import { useEffect, useState } from "react";

import SkillCard from "./SkillCard";

import {
  getPublishedSkills,
  getSkillCategories,
} from "../../services/skills.service";

import type {
  Skill,
  SkillCategory,
} from "../../types/skill";

export default function Skills() {
  const [categories, setCategories] = useState<
    SkillCategory[]
  >([]);

  const [skills, setSkills] = useState<
    Skill[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const [
          categoryData,
          skillData,
        ] = await Promise.all([
          getSkillCategories(),
          getPublishedSkills(),
        ]);

        setCategories(categoryData);

        setSkills(skillData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  if (loading) return null;

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