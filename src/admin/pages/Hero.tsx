import { useEffect, useState } from "react";

import "./Hero.css";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  uploadResume,
  deleteResume,
  type Profile,
} from "../../services/profile.service";

import {
  getHeroRoles,
  createHeroRole,
  updateHeroRole,
  deleteHeroRole,
  type HeroRole,
} from "../../services/heroRoles.service";

import {
  getHeroQuotes,
  createHeroQuote,
  updateHeroQuote,
  deleteHeroQuote,
  type HeroQuote,
} from "../../services/heroQuotes.service";

export default function Hero() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [roles, setRoles] =
    useState<HeroRole[]>([]);

  const [quotes, setQuotes] =
    useState<HeroQuote[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [uploadingResume, setUploadingResume] =
    useState(false);

  /* ================= NEW ROLE ================= */

  const [newRole, setNewRole] =
    useState("");

  const [addingRole, setAddingRole] =
    useState(false);

  /* ================= NEW QUOTE ================= */

  const [newQuote, setNewQuote] =
    useState("");

  const [newQuoteAuthor, setNewQuoteAuthor] =
    useState("");

  const [addingQuote, setAddingQuote] =
    useState(false);

  useEffect(() => {
    loadHeroData();
  }, []);

  /* ================= LOAD DATA ================= */

  async function loadHeroData() {
    try {
      setLoading(true);

      const [
        profileData,
        rolesData,
        quotesData,
      ] = await Promise.all([
        getProfile(),
        getHeroRoles(),
        getHeroQuotes(),
      ]);

      setProfile(profileData);
      setRoles(rolesData);
      setQuotes(quotesData);
    } catch (error) {
      console.error(error);
      alert("Failed to load hero data");
    } finally {
      setLoading(false);
    }
  }

  /* ================= PROFILE CHANGE ================= */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    if (!profile) return;

    setProfile({
      ...profile,
      [event.target.name]:
        event.target.value,
    });
  };

  /* ================= SAVE PROFILE ================= */

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);

      await updateProfile(profile);

      alert(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploadingImage(true);

      const imageUrl =
        await uploadProfileImage(
          file,
          profile.id
        );

      setProfile({
        ...profile,
        profile_image: imageUrl,
      });

      alert(
        "Profile image updated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to upload profile image"
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  /* ================= IMAGE DELETE ================= */

const handleImageDelete = async () => {
  if (!profile || !profile.profile_image) {
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete the profile image?"
  );

  if (!confirmed) return;

  try {
    const { supabase } = await import(
      "../../lib/supabase"
    );

    const { data, error } = await supabase
      .from("profile")
      .select("profile_image")
      .eq("id", profile.id)
      .single();

    if (error) {
      throw error;
    }

    await deleteProfileImage(
      data.profile_image,
      profile.id
    );

    setProfile({
      ...profile,
      profile_image: "",
    });

    alert(
      "Profile image deleted successfully!"
    );
  } catch (error) {
    console.error(
      "Failed to delete profile image:",
      error
    );

    alert(
      "Failed to delete profile image"
    );
  }
};

  /* ================= RESUME UPLOAD ================= */

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file || !profile) return;

    if (
      file.type !== "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert(
        "Please select a PDF file."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploadingResume(true);

      const resumeUrl =
        await uploadResume(
          file,
          profile.id
        );

      setProfile({
        ...profile,
        resume_file: resumeUrl,
      });

      alert(
        "Resume uploaded successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to upload resume"
      );
    } finally {
      setUploadingResume(false);
      event.target.value = "";
    }
  };

  /* ================= RESUME DELETE ================= */

  const handleResumeDelete = async () => {
  if (
    !profile ||
    !profile.resume_file
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      "Are you sure you want to delete the resume?"
    );

  if (!confirmed) return;

  try {
    await deleteResume(
      profile.resume_file,
      profile.id
    );

    setProfile({
      ...profile,
      resume_file: "",
    });

    alert(
      "Resume deleted successfully!"
    );
  } catch (error) {
    console.error(error);

    alert(
      "Failed to delete resume"
    );
  }
};
  /* =====================================================
     ANIMATED ROLES
  ===================================================== */

  /* ================= ADD ROLE ================= */

  const handleAddRole = async () => {
    const title = newRole.trim();

    if (!title) {
      alert("Please enter a role.");
      return;
    }

    try {
      setAddingRole(true);

      const nextOrder =
        roles.length > 0
          ? Math.max(
              ...roles.map(
                (role) =>
                  role.display_order
              )
            ) + 1
          : 1;

      const createdRole =
        await createHeroRole({
          title,
          display_order: nextOrder,
          published: true,
        });

      setRoles([
        ...roles,
        createdRole,
      ]);

      setNewRole("");
    } catch (error) {
      console.error(error);
      alert("Failed to add role");
    } finally {
      setAddingRole(false);
    }
  };

  /* ================= EDIT ROLE ================= */

  const handleRoleChange = (
    id: string,
    title: string
  ) => {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === id
          ? {
              ...role,
              title,
            }
          : role
      )
    );
  };

  const handleRoleSave = async (
    role: HeroRole
  ) => {
    if (!role.title.trim()) {
      alert("Role cannot be empty.");
      return;
    }

    try {
      const updatedRole =
        await updateHeroRole(
          role.id,
          {
            title:
              role.title.trim(),
          }
        );

      setRoles((currentRoles) =>
        currentRoles.map(
          (currentRole) =>
            currentRole.id ===
            updatedRole.id
              ? updatedRole
              : currentRole
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    }
  };

  /* ================= TOGGLE ROLE ================= */

  const handleRolePublished = async (
    role: HeroRole
  ) => {
    try {
      const updatedRole =
        await updateHeroRole(
          role.id,
          {
            published:
              !role.published,
          }
        );

      setRoles((currentRoles) =>
        currentRoles.map(
          (currentRole) =>
            currentRole.id ===
            updatedRole.id
              ? updatedRole
              : currentRole
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update role status"
      );
    }
  };

  /* ================= ROLE ORDER ================= */

  const handleRoleOrderChange = (
    id: string,
    display_order: number
  ) => {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === id
          ? {
              ...role,
              display_order,
            }
          : role
      )
    );
  };

  const handleRoleOrderSave = async (
    role: HeroRole
  ) => {
    try {
      const updatedRole =
        await updateHeroRole(
          role.id,
          {
            display_order:
              role.display_order,
          }
        );

      setRoles((currentRoles) =>
        currentRoles
          .map(
            (currentRole) =>
              currentRole.id ===
              updatedRole.id
                ? updatedRole
                : currentRole
          )
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order
          )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update role order"
      );
    }
  };

  /* ================= DELETE ROLE ================= */

  const handleDeleteRole = async (
    role: HeroRole
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${role.title}"?`
      );

    if (!confirmed) return;

    try {
      await deleteHeroRole(role.id);

      setRoles((currentRoles) =>
        currentRoles.filter(
          (currentRole) =>
            currentRole.id !== role.id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete role");
    }
  };

  /* =====================================================
     HERO QUOTES
  ===================================================== */

  /* ================= ADD QUOTE ================= */

  const handleAddQuote = async () => {
    const quote = newQuote.trim();
    const author = newQuoteAuthor.trim();

    if (!quote) {
      alert("Please enter a quote.");
      return;
    }

    if (!author) {
      alert("Please enter the author name.");
      return;
    }

    try {
      setAddingQuote(true);

      const nextOrder =
        quotes.length > 0
          ? Math.max(
              ...quotes.map(
                (item) =>
                  item.display_order
              )
            ) + 1
          : 1;

      const createdQuote =
        await createHeroQuote({
          quote,
          author,
          display_order: nextOrder,
          published: true,
        });

      setQuotes([
        ...quotes,
        createdQuote,
      ]);

      setNewQuote("");
      setNewQuoteAuthor("");
    } catch (error) {
      console.error(error);
      alert("Failed to add quote");
    } finally {
      setAddingQuote(false);
    }
  };

  /* ================= EDIT QUOTE ================= */

  const handleQuoteChange = (
    id: string,
    field: "quote" | "author",
    value: string
  ) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleQuoteSave = async (
    quoteItem: HeroQuote
  ) => {
    if (!quoteItem.quote.trim()) {
      alert("Quote cannot be empty.");
      return;
    }

    if (!quoteItem.author.trim()) {
      alert("Author cannot be empty.");
      return;
    }

    try {
      const updatedQuote =
        await updateHeroQuote(
          quoteItem.id,
          {
            quote:
              quoteItem.quote.trim(),
            author:
              quoteItem.author.trim(),
          }
        );

      setQuotes((currentQuotes) =>
        currentQuotes.map(
          (currentQuote) =>
            currentQuote.id ===
            updatedQuote.id
              ? updatedQuote
              : currentQuote
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update quote");
    }
  };

  /* ================= TOGGLE QUOTE ================= */

  const handleQuotePublished = async (
    quoteItem: HeroQuote
  ) => {
    try {
      const updatedQuote =
        await updateHeroQuote(
          quoteItem.id,
          {
            published:
              !quoteItem.published,
          }
        );

      setQuotes((currentQuotes) =>
        currentQuotes.map(
          (currentQuote) =>
            currentQuote.id ===
            updatedQuote.id
              ? updatedQuote
              : currentQuote
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update quote status"
      );
    }
  };

  /* ================= QUOTE ORDER ================= */

  const handleQuoteOrderChange = (
    id: string,
    display_order: number
  ) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((item) =>
        item.id === id
          ? {
              ...item,
              display_order,
            }
          : item
      )
    );
  };

  const handleQuoteOrderSave = async (
    quoteItem: HeroQuote
  ) => {
    try {
      const updatedQuote =
        await updateHeroQuote(
          quoteItem.id,
          {
            display_order:
              quoteItem.display_order,
          }
        );

      setQuotes((currentQuotes) =>
        currentQuotes
          .map(
            (currentQuote) =>
              currentQuote.id ===
              updatedQuote.id
                ? updatedQuote
                : currentQuote
          )
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order
          )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update quote order"
      );
    }
  };

  /* ================= DELETE QUOTE ================= */

  const handleDeleteQuote = async (
    quoteItem: HeroQuote
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this quote?"
      );

    if (!confirmed) return;

    try {
      await deleteHeroQuote(
        quoteItem.id
      );

      setQuotes((currentQuotes) =>
        currentQuotes.filter(
          (currentQuote) =>
            currentQuote.id !==
            quoteItem.id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete quote");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="hero-admin">
        <h1>Hero Management</h1>

        <p>Loading hero data...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="hero-admin">
        <h1>Hero Management</h1>

        <p>Profile not found.</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="hero-admin">

      <h1>Hero Management</h1>

      {/* ================= PROFILE ================= */}

      <div className="admin-section">

        <h2>Profile Information</h2>

        <div className="hero-form">

          <div className="form-group">

            <label>Greeting</label>

            <input
              type="text"
              name="greeting"
              value={
                profile.greeting || ""
              }
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="full_name"
              value={
                profile.full_name || ""
              }
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              value={
                profile.description || ""
              }
              onChange={handleChange}
              rows={6}
            />

          </div>

          <div className="form-group">

            <label>
              Contact Button Text
            </label>

            <input
              type="text"
              name="contact_button_text"
              value={
                profile.contact_button_text ||
                ""
              }
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

      {/* ================= PROFILE IMAGE ================= */}

      <div className="admin-section">

        <h2>Profile Image</h2>

        {profile.profile_image ? (

          <div className="media-section">

            <img
              src={profile.profile_image}
              alt={profile.full_name}
              className="image-preview"
            />

            <div className="media-actions">

              <label className="media-btn">

                {uploadingImage
                  ? "Replacing..."
                  : "Replace Image"}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={
                    uploadingImage
                  }
                  onChange={
                    handleImageUpload
                  }
                />

              </label>

              <button
                type="button"
                className="delete-btn"
                onClick={
                  handleImageDelete
                }
              >
                Delete Image
              </button>

            </div>

          </div>

        ) : (

          <div className="media-section">

            <label className="media-btn">

              {uploadingImage
                ? "Uploading..."
                : "Upload Profile Image"}

              <input
                type="file"
                accept="image/*"
                hidden
                disabled={
                  uploadingImage
                }
                onChange={
                  handleImageUpload
                }
              />

            </label>

          </div>

        )}

      </div>

      {/* ================= RESUME ================= */}

      <div className="admin-section">

        <h2>Resume</h2>

        {profile.resume_file ? (

          <div className="resume-section">

            <div className="resume-status">
              📄 Resume uploaded
            </div>

            <div className="media-actions">

              <a
                href={
                  profile.resume_file
                }
                target="_blank"
                rel="noreferrer"
                className="media-btn"
              >
                View Resume
              </a>

              <label className="media-btn">

                {uploadingResume
                  ? "Replacing..."
                  : "Replace Resume"}

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  disabled={
                    uploadingResume
                  }
                  onChange={
                    handleResumeUpload
                  }
                />

              </label>

              <button
                type="button"
                className="delete-btn"
                onClick={
                  handleResumeDelete
                }
              >
                Delete Resume
              </button>

            </div>

          </div>

        ) : (

          <div className="resume-section">

            <label className="media-btn">

              {uploadingResume
                ? "Uploading..."
                : "Upload Resume PDF"}

              <input
                type="file"
                accept=".pdf,application/pdf"
                hidden
                disabled={
                  uploadingResume
                }
                onChange={
                  handleResumeUpload
                }
              />

            </label>

          </div>

        )}

      </div>

      {/* ================= ANIMATED ROLES ================= */}

      <div className="admin-section">

        <h2>Animated Roles</h2>

        <p className="section-description">
          Manage the roles shown in the animated
          text on your homepage.
        </p>

        <div className="add-role">

          <input
            type="text"
            placeholder="Example: Product Intern"
            value={newRole}
            onChange={(event) =>
              setNewRole(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                handleAddRole();
              }
            }}
          />

          <button
            type="button"
            className="add-role-btn"
            onClick={handleAddRole}
            disabled={addingRole}
          >
            {addingRole
              ? "Adding..."
              : "Add Role"}
          </button>

        </div>

        <div className="roles-list">

          {roles.length === 0 ? (

            <p className="empty-state">
              No roles added yet.
            </p>

          ) : (

            roles.map((role) => (

              <div
                className="role-item"
                key={role.id}
              >

                <div className="role-main">

                  <input
                    type="text"
                    value={role.title}
                    onChange={(event) =>
                      handleRoleChange(
                        role.id,
                        event.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    min="1"
                    className="role-order"
                    value={
                      role.display_order
                    }
                    onChange={(event) =>
                      handleRoleOrderChange(
                        role.id,
                        Number(
                          event.target.value
                        )
                      )
                    }
                  />

                </div>

                <div className="role-actions">

                  <button
                    type="button"
                    className="role-save-btn"
                    onClick={() =>
                      handleRoleSave(role)
                    }
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="role-order-save-btn"
                    onClick={() =>
                      handleRoleOrderSave(
                        role
                      )
                    }
                  >
                    Order
                  </button>

                  <button
                    type="button"
                    className={
                      role.published
                        ? "role-status published"
                        : "role-status unpublished"
                    }
                    onClick={() =>
                      handleRolePublished(
                        role
                      )
                    }
                  >
                    {role.published
                      ? "Published"
                      : "Hidden"}
                  </button>

                  <button
                    type="button"
                    className="role-delete-btn"
                    onClick={() =>
                      handleDeleteRole(
                        role
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* ================= HERO QUOTES ================= */}

      <div className="admin-section">

        <h2>Hero Quotes</h2>

        <p className="section-description">
          Manage the quotes displayed on your
          homepage.
        </p>

        {/* ADD QUOTE */}

        <div className="add-quote">

          <textarea
            placeholder="Enter a quote..."
            value={newQuote}
            rows={3}
            onChange={(event) =>
              setNewQuote(
                event.target.value
              )
            }
          />

          <div className="add-quote-actions">

            <input
              type="text"
              placeholder="Author name"
              value={newQuoteAuthor}
              onChange={(event) =>
                setNewQuoteAuthor(
                  event.target.value
                )
              }
            />

            <button
              type="button"
              className="add-role-btn"
              onClick={handleAddQuote}
              disabled={addingQuote}
            >
              {addingQuote
                ? "Adding..."
                : "Add Quote"}
            </button>

          </div>

        </div>

        {/* QUOTE LIST */}

        <div className="quotes-list">

          {quotes.length === 0 ? (

            <p className="empty-state">
              No quotes added yet.
            </p>

          ) : (

            quotes.map((quoteItem) => (

              <div
                className="quote-item"
                key={quoteItem.id}
              >

                <div className="quote-main">

                  <textarea
                    value={
                      quoteItem.quote
                    }
                    rows={3}
                    onChange={(event) =>
                      handleQuoteChange(
                        quoteItem.id,
                        "quote",
                        event.target.value
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      quoteItem.author
                    }
                    placeholder="Author"
                    onChange={(event) =>
                      handleQuoteChange(
                        quoteItem.id,
                        "author",
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="quote-actions">

                  <input
                    type="number"
                    min="1"
                    className="quote-order"
                    value={
                      quoteItem.display_order
                    }
                    onChange={(event) =>
                      handleQuoteOrderChange(
                        quoteItem.id,
                        Number(
                          event.target.value
                        )
                      )
                    }
                  />

                  <button
                    type="button"
                    className="role-save-btn"
                    onClick={() =>
                      handleQuoteSave(
                        quoteItem
                      )
                    }
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="role-order-save-btn"
                    onClick={() =>
                      handleQuoteOrderSave(
                        quoteItem
                      )
                    }
                  >
                    Order
                  </button>

                  <button
                    type="button"
                    className={
                      quoteItem.published
                        ? "role-status published"
                        : "role-status unpublished"
                    }
                    onClick={() =>
                      handleQuotePublished(
                        quoteItem
                      )
                    }
                  >
                    {quoteItem.published
                      ? "Published"
                      : "Hidden"}
                  </button>

                  <button
                    type="button"
                    className="role-delete-btn"
                    onClick={() =>
                      handleDeleteQuote(
                        quoteItem
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* ================= SAVE PROFILE ================= */}

      <button
        type="button"
        className="save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : "Save Profile Changes"}
      </button>

    </div>
  );
}