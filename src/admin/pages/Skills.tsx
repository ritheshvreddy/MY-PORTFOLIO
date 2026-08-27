import { useEffect, useState } from "react";
import "./Skills.css";

import {
  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillPublished,
} from "../../services/skills.service";

import { supabase } from "../../lib/supabase";

import type {
  Skill,
  SkillCategory,
} from "../../types/skill";

const BUCKET = "portfolio";

export default function Skills() {
  const [categories, setCategories] = useState<
    SkillCategory[]
  >([]);

  const [skills, setSkills] = useState<
    Skill[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /* ================= CATEGORY FORM ================= */

  const [
    newCategoryTitle,
    setNewCategoryTitle,
  ] = useState("");

  const [
    newCategoryDescription,
    setNewCategoryDescription,
  ] = useState("");

  const [
    addingCategory,
    setAddingCategory,
  ] = useState(false);

  /* ================= SKILL FORM ================= */

  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState("");

  const [
    newSkillTitle,
    setNewSkillTitle,
  ] = useState("");

  const [
    newSkillDescription,
    setNewSkillDescription,
  ] = useState("");

  const [
    newSkillIcon,
    setNewSkillIcon,
  ] = useState("");

  const [
    addingSkill,
    setAddingSkill,
  ] = useState(false);

  const [
    uploadingIcon,
    setUploadingIcon,
  ] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadSkillsData();
  }, []);

  async function loadSkillsData() {
    try {
      setLoading(true);

      const [
        categoriesData,
        skillsData,
      ] = await Promise.all([
        getSkillCategories(),
        getSkills(),
      ]);

      setCategories(categoriesData);
      setSkills(skillsData);

      if (categoriesData.length > 0) {
        setSelectedCategoryId(
          categoriesData[0].id
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load skills data."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =================================================
     CATEGORY FUNCTIONS
  ================================================= */

  const handleAddCategory = async () => {
    const title =
      newCategoryTitle.trim();

    if (!title) {
      alert(
        "Please enter a category title."
      );
      return;
    }

    try {
      setAddingCategory(true);

      const nextOrder =
        categories.length > 0
          ? Math.max(
              ...categories.map(
                (category) =>
                  category.display_order
              )
            ) + 1
          : 1;

      const createdCategory =
        await createSkillCategory({
          title,
          description:
            newCategoryDescription.trim(),
          display_order: nextOrder,
          published: true,
        });

      setCategories(
        (currentCategories) => [
          ...currentCategories,
          createdCategory,
        ]
      );

      setNewCategoryTitle("");
      setNewCategoryDescription("");

      if (!selectedCategoryId) {
        setSelectedCategoryId(
          createdCategory.id
        );
      }

      alert(
        "Skill category added successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to add skill category."
      );
    } finally {
      setAddingCategory(false);
    }
  };

  const handleCategoryChange = (
    id: string,
    field:
      | "title"
      | "description"
      | "display_order",
    value: string | number
  ) => {
    setCategories(
      (currentCategories) =>
        currentCategories.map(
          (category) =>
            category.id === id
              ? {
                  ...category,
                  [field]: value,
                }
              : category
        )
    );
  };

  const handleSaveCategory = async (
    category: SkillCategory
  ) => {
    if (!category.title.trim()) {
      alert(
        "Category title cannot be empty."
      );
      return;
    }

    try {
      setSaving(true);

      const updatedCategory =
        await updateSkillCategory(
          category.id,
          {
            title:
              category.title.trim(),
            description:
              category.description.trim(),
            display_order:
              Number(
                category.display_order
              ),
            published:
              category.published,
          }
        );

      setCategories(
        (currentCategories) =>
          currentCategories
            .map(
              (currentCategory) =>
                currentCategory.id ===
                category.id
                  ? updatedCategory
                  : currentCategory
            )
            .sort(
              (a, b) =>
                a.display_order -
                b.display_order
            )
      );

      alert(
        "Category updated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryPublished = async (
    category: SkillCategory
  ) => {
    try {
      const updatedCategory =
        await updateSkillCategory(
          category.id,
          {
            published:
              !category.published,
          }
        );

      setCategories(
        (currentCategories) =>
          currentCategories.map(
            (currentCategory) =>
              currentCategory.id ===
              category.id
                ? updatedCategory
                : currentCategory
          )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update category status."
      );
    }
  };

  const handleDeleteCategory = async (
    category: SkillCategory
  ) => {
    const categorySkills =
      skills.filter(
        (skill) =>
          skill.category_id ===
          category.id
      );

    if (categorySkills.length > 0) {
      alert(
        "Please delete all skills in this category before deleting the category."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete category "${category.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSkillCategory(
        category.id
      );

      setCategories(
        (currentCategories) =>
          currentCategories.filter(
            (currentCategory) =>
              currentCategory.id !==
              category.id
          )
      );

      if (
        selectedCategoryId ===
        category.id
      ) {
        const remainingCategories =
          categories.filter(
            (currentCategory) =>
              currentCategory.id !==
              category.id
          );

        setSelectedCategoryId(
          remainingCategories.length > 0
            ? remainingCategories[0].id
            : ""
        );
      }

      alert(
        "Category deleted successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete category."
      );
    }
  };

  /* =================================================
     ICON UPLOAD
  ================================================= */

  const handleIconUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploadingIcon(true);

      const extension =
        file.name
          .split(".")
          .pop() || "png";

      const filePath =
        `skills/skill-${Date.now()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from(BUCKET)
        .upload(
          filePath,
          file,
          {
            upsert: true,
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      /*
       Store the file path in the database.

       skills.service.ts converts the path
       into a public URL when fetching.
      */

      setNewSkillIcon(filePath);

      alert(
        "Skill icon uploaded successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to upload skill icon."
      );
    } finally {
      setUploadingIcon(false);

      event.target.value = "";
    }
  };

  /* =================================================
     SKILL FUNCTIONS
  ================================================= */

  const handleAddSkill = async () => {
    const title =
      newSkillTitle.trim();

    if (!selectedCategoryId) {
      alert(
        "Please select a category."
      );
      return;
    }

    if (!title) {
      alert(
        "Please enter a skill title."
      );
      return;
    }

    try {
      setAddingSkill(true);

      const categorySkills =
        skills.filter(
          (skill) =>
            skill.category_id ===
            selectedCategoryId
        );

      const nextOrder =
        categorySkills.length > 0
          ? Math.max(
              ...categorySkills.map(
                (skill) =>
                  skill.display_order
              )
            ) + 1
          : 1;

      const createdSkill =
        await createSkill({
          category_id:
            selectedCategoryId,
          title,
          description:
            newSkillDescription.trim(),
          icon:
            newSkillIcon,
          display_order:
            nextOrder,
          published: true,
        });

      setSkills(
        (currentSkills) => [
          ...currentSkills,
          createdSkill,
        ]
      );

      setNewSkillTitle("");
      setNewSkillDescription("");
      setNewSkillIcon("");

      alert(
        "Skill added successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to add skill."
      );
    } finally {
      setAddingSkill(false);
    }
  };

  const handleSkillChange = (
    id: string,
    field:
      | "title"
      | "description"
      | "display_order",
    value: string | number
  ) => {
    setSkills(
      (currentSkills) =>
        currentSkills.map(
          (skill) =>
            skill.id === id
              ? {
                  ...skill,
                  [field]: value,
                }
              : skill
        )
    );
  };

  const handleSaveSkill = async (
    skill: Skill
  ) => {
    if (!skill.title.trim()) {
      alert(
        "Skill title cannot be empty."
      );
      return;
    }

    try {
      setSaving(true);

      const updatedSkill =
        await updateSkill(
          skill.id,
          {
            category_id:
              skill.category_id,
            title:
              skill.title.trim(),
            description:
              skill.description.trim(),
            icon:
              skill.icon,
            display_order:
              Number(
                skill.display_order
              ),
            published:
              skill.published,
          }
        );

      setSkills(
        (currentSkills) =>
          currentSkills
            .map(
              (currentSkill) =>
                currentSkill.id ===
                skill.id
                  ? updatedSkill
                  : currentSkill
            )
            .sort(
              (a, b) =>
                a.display_order -
                b.display_order
            )
      );

      alert(
        "Skill updated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSkillPublished = async (
    skill: Skill
  ) => {
    try {
      const updatedSkill =
        await updateSkillPublished(
          skill.id,
          !skill.published
        );

      setSkills(
        (currentSkills) =>
          currentSkills.map(
            (currentSkill) =>
              currentSkill.id ===
              skill.id
                ? updatedSkill
                : currentSkill
          )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update skill status."
      );
    }
  };

  const handleDeleteSkill = async (
    skill: Skill
  ) => {
    const confirmed =
      window.confirm(
        `Delete skill "${skill.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSkill(
        skill.id
      );

      setSkills(
        (currentSkills) =>
          currentSkills.filter(
            (currentSkill) =>
              currentSkill.id !==
              skill.id
          )
      );

      alert(
        "Skill deleted successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete skill."
      );
    }
  };

  /* =================================================
     LOADING
  ================================================= */

  if (loading) {
    return (
      <div className="skills-admin">
        <h1>
          Skills Management
        </h1>

        <p>
          Loading skills...
        </p>
      </div>
    );
  }

  /* =================================================
     UI
  ================================================= */

  return (
    <div className="skills-admin">

      <h1>
        Skills Management
      </h1>

      <p className="skills-page-description">
        Manage your skill categories,
        technologies, tools and expertise.
      </p>


      {/* ================= SKILL CATEGORIES ================= */}

      <div className="admin-section">

        <h2>
          Skill Categories
        </h2>

        <p className="section-description">
          Create categories such as
          Frontend, Backend, AI/ML,
          Cloud or Tools.
        </p>

        <div className="skills-add-form">

          <input
            type="text"
            placeholder="Category title"
            value={newCategoryTitle}
            onChange={(event) =>
              setNewCategoryTitle(
                event.target.value
              )
            }
          />

          <textarea
            placeholder="Category description"
            value={
              newCategoryDescription
            }
            onChange={(event) =>
              setNewCategoryDescription(
                event.target.value
              )
            }
            rows={3}
          />

          <button
            type="button"
            className="add-skill-btn"
            onClick={
              handleAddCategory
            }
            disabled={
              addingCategory
            }
          >
            {addingCategory
              ? "Adding..."
              : "Add Category"}
          </button>

        </div>


        <div className="category-list">

          {categories.length === 0 ? (

            <p className="empty-state">
              No categories added yet.
            </p>

          ) : (

            categories.map(
              (category) => (

                <div
                  className="category-item"
                  key={category.id}
                >

                  <div className="category-fields">

                    <input
                      type="text"
                      value={category.title}
                      onChange={(event) =>
                        handleCategoryChange(
                          category.id,
                          "title",
                          event.target.value
                        )
                      }
                    />

                    <textarea
                      rows={2}
                      value={
                        category.description ||
                        ""
                      }
                      onChange={(event) =>
                        handleCategoryChange(
                          category.id,
                          "description",
                          event.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      className="order-input"
                      value={
                        category.display_order
                      }
                      onChange={(event) =>
                        handleCategoryChange(
                          category.id,
                          "display_order",
                          Number(
                            event.target.value
                          )
                        )
                      }
                    />

                  </div>

                  <div className="category-actions">

                    <button
                      type="button"
                      className="save-small-btn"
                      onClick={() =>
                        handleSaveCategory(
                          category
                        )
                      }
                      disabled={saving}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className={
                        category.published
                          ? "status-btn published"
                          : "status-btn unpublished"
                      }
                      onClick={() =>
                        handleCategoryPublished(
                          category
                        )
                      }
                    >
                      {category.published
                        ? "Published"
                        : "Hidden"}
                    </button>

                    <button
                      type="button"
                      className="delete-small-btn"
                      onClick={() =>
                        handleDeleteCategory(
                          category
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>


      {/* ================= ADD NEW SKILL ================= */}

      <div className="admin-section">

        <h2>
          Add New Skill
        </h2>

        <div className="skills-add-form">

          <select
            value={
              selectedCategoryId
            }
            onChange={(event) =>
              setSelectedCategoryId(
                event.target.value
              )
            }
          >

            <option value="">
              Select Category
            </option>

            {categories.map(
              (category) => (

                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.title}
                </option>

              )
            )}

          </select>

          <input
            type="text"
            placeholder="Skill title (Example: React)"
            value={newSkillTitle}
            onChange={(event) =>
              setNewSkillTitle(
                event.target.value
              )
            }
          />

          <textarea
            placeholder="Skill description"
            value={
              newSkillDescription
            }
            onChange={(event) =>
              setNewSkillDescription(
                event.target.value
              )
            }
            rows={3}
          />


          {/* ================= ICON ================= */}

          <div className="skill-icon-upload">

            {newSkillIcon ? (

              <div className="new-icon-preview">

                <img
                  src={
                    supabase.storage
                      .from(BUCKET)
                      .getPublicUrl(
                        newSkillIcon
                      ).data.publicUrl
                  }
                  alt="Skill icon"
                />

                <button
                  type="button"
                  className="remove-icon-btn"
                  onClick={() =>
                    setNewSkillIcon("")
                  }
                >
                  Remove
                </button>

              </div>

            ) : (

              <label className="media-btn">

                {uploadingIcon
                  ? "Uploading..."
                  : "Upload Skill Icon"}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={
                    uploadingIcon
                  }
                  onChange={
                    handleIconUpload
                  }
                />

              </label>

            )}

          </div>


          <button
            type="button"
            className="add-skill-btn"
            onClick={
              handleAddSkill
            }
            disabled={
              addingSkill ||
              categories.length === 0
            }
          >
            {addingSkill
              ? "Adding..."
              : "Add Skill"}
          </button>

        </div>

      </div>


      {/* ================= ALL SKILLS ================= */}

      <div className="admin-section">

        <h2>
          All Skills
        </h2>

        {categories.length === 0 ? (

          <p className="empty-state">
            Create a category first.
          </p>

        ) : (

          categories.map(
            (category) => {

              const categorySkills =
                skills
                  .filter(
                    (skill) =>
                      skill.category_id ===
                      category.id
                  )
                  .sort(
                    (a, b) =>
                      a.display_order -
                      b.display_order
                  );

              return (

                <div
                  className="skill-category-group"
                  key={category.id}
                >

                  <div className="skill-category-heading">

                    <h3>
                      {category.title}
                    </h3>

                    <span>
                      {
                        categorySkills.length
                      }{" "}
                      skill
                      {categorySkills.length !==
                      1
                        ? "s"
                        : ""}
                    </span>

                  </div>


                  {categorySkills.length ===
                  0 ? (

                    <p className="empty-state">
                      No skills in this category.
                    </p>

                  ) : (

                    <div className="skills-list">

                      {categorySkills.map(
                        (skill) => (

                          <div
                            className="skill-item"
                            key={skill.id}
                          >

                            <div className="skill-edit-fields">

                              {skill.icon && (

                                <img
                                  src={
                                    skill.icon
                                  }
                                  alt={
                                    skill.title
                                  }
                                  className="skill-icon-preview"
                                />

                              )}

                              <div className="skill-inputs">

                                <input
                                  type="text"
                                  value={
                                    skill.title
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleSkillChange(
                                      skill.id,
                                      "title",
                                      event.target
                                        .value
                                    )
                                  }
                                />

                                <textarea
                                  rows={2}
                                  value={
                                    skill.description ||
                                    ""
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleSkillChange(
                                      skill.id,
                                      "description",
                                      event.target
                                        .value
                                    )
                                  }
                                />

                              </div>

                              <input
                                type="number"
                                min="1"
                                className="order-input"
                                value={
                                  skill.display_order
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleSkillChange(
                                    skill.id,
                                    "display_order",
                                    Number(
                                      event.target
                                        .value
                                    )
                                  )
                                }
                              />

                            </div>


                            <div className="skill-actions">

                              <button
                                type="button"
                                className="save-small-btn"
                                onClick={() =>
                                  handleSaveSkill(
                                    skill
                                  )
                                }
                                disabled={
                                  saving
                                }
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                className={
                                  skill.published
                                    ? "status-btn published"
                                    : "status-btn unpublished"
                                }
                                onClick={() =>
                                  handleSkillPublished(
                                    skill
                                  )
                                }
                              >
                                {skill.published
                                  ? "Published"
                                  : "Hidden"}
                              </button>

                              <button
                                type="button"
                                className="delete-small-btn"
                                onClick={() =>
                                  handleDeleteSkill(
                                    skill
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              );
            }
          )

        )}

      </div>

    </div>
  );
}