import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  deleteSettingsAsset,
  getSiteSettings,
  updateSiteSettings,
  uploadSettingsAsset,
} from "../../services/settings.service";

import type {
  SiteSettings,
} from "../../types/settings";

import "./Settings.css";


/* =========================================================
   FORM TYPE
========================================================= */

interface SettingsFormData {
  portfolio_name: string;

  tagline: string;

  email: string;

  github_url: string;

  linkedin_url: string;

  resume_url: string;

  logo_url: string;

  favicon_url: string;

  phone: string;

  location: string;

  seo_title: string;

  seo_description: string;

  copyright: string;

  day_background_url: string;

  night_background_url: string;
}


/* =========================================================
   INITIAL DATA
========================================================= */

const initialFormData:
  SettingsFormData = {

  portfolio_name:
    "",

  tagline:
    "",

  email:
    "",

  github_url:
    "",

  linkedin_url:
    "",

  resume_url:
    "",

  logo_url:
    "",

  favicon_url:
    "",

  phone:
    "",

  location:
    "",

  seo_title:
    "",

  seo_description:
    "",

  copyright:
    "",

  day_background_url:
    "",

  night_background_url:
    "",
};


/* =========================================================
   COMPONENT
========================================================= */

export default function Settings() {

  /* =======================================================
     PROFILE
  ======================================================= */

  const [
    settings,
    setSettings,
  ] =
    useState<SiteSettings | null>(
      null
    );


  const [
    formData,
    setFormData,
  ] =
    useState<SettingsFormData>(
      initialFormData
    );


  /* =======================================================
     UI
  ======================================================= */

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    uploading,
    setUploading,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    success,
    setSuccess,
  ] =
    useState("");


  /* =======================================================
     FILE INPUTS
  ======================================================= */

  const resumeRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const logoRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const faviconRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const dayBackgroundRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const nightBackgroundRef =
    useRef<HTMLInputElement | null>(
      null
    );


  /* =========================================================
     LOAD SETTINGS
  ========================================================= */

  async function loadSettings() {

    try {

      setLoading(true);

      setError("");


      const data =
        await getSiteSettings();


      setSettings(
        data
      );


      if (data) {

        setFormData({

          portfolio_name:
            data.portfolio_name ||
            "",

          tagline:
            data.tagline ||
            "",

          email:
            data.email ||
            "",

          github_url:
            data.github_url ||
            "",

          linkedin_url:
            data.linkedin_url ||
            "",

          resume_url:
            data.resume_url ||
            "",

          logo_url:
            data.logo_url ||
            "",

          favicon_url:
            data.favicon_url ||
            "",

          phone:
            data.phone ||
            "",

          location:
            data.location ||
            "",

          seo_title:
            data.seo_title ||
            "",

          seo_description:
            data.seo_description ||
            "",

          copyright:
            data.copyright ||
            "",

          day_background_url:
            data.day_background_url ||
            "",

          night_background_url:
            data.night_background_url ||
            "",

        });

      }


    } catch (loadError) {

      console.error(
        "Error loading settings:",
        loadError
      );


      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load settings."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    void loadSettings();

  }, []);


  /* =========================================================
     FORM CHANGE
  ========================================================= */

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) {

    const {
      name,
      value,
    } =
      event.target;


    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );
  }


  /* =========================================================
     SAVE
  ========================================================= */

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (
      !settings?.id
    ) {

      setError(
        "Settings record was not found."
      );

      return;

    }


    if (
      !formData.portfolio_name.trim()
    ) {

      setError(
        "Portfolio name is required."
      );

      return;

    }


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const updated =
        await updateSiteSettings(
          settings.id,
          {

            portfolio_name:
              formData.portfolio_name.trim(),

            tagline:
              formData.tagline.trim() ||
              null,

            email:
              formData.email.trim() ||
              null,

            github_url:
              formData.github_url.trim() ||
              null,

            linkedin_url:
              formData.linkedin_url.trim() ||
              null,

            resume_url:
              formData.resume_url ||
              null,

            logo_url:
              formData.logo_url ||
              null,

            favicon_url:
              formData.favicon_url ||
              null,

            phone:
              formData.phone.trim() ||
              null,

            location:
              formData.location.trim() ||
              null,

            seo_title:
              formData.seo_title.trim() ||
              null,

            seo_description:
              formData.seo_description.trim() ||
              null,

            copyright:
              formData.copyright.trim() ||
              null,

            day_background_url:
              formData.day_background_url ||
              null,

            night_background_url:
              formData.night_background_url ||
              null,

          }
        );


      setSettings(
        updated
      );


      setSuccess(
        "Site settings saved successfully."
      );

    } catch (saveError) {

      console.error(
        "Error saving settings:",
        saveError
      );


      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save settings."
      );

    } finally {

      setSaving(false);

    }
  }


  /* =========================================================
     UPLOAD ASSET
  ========================================================= */

  async function handleAssetUpload(
    event: ChangeEvent<HTMLInputElement>,

    field:
      | "resume_url"
      | "logo_url"
      | "favicon_url"
      | "day_background_url"
      | "night_background_url",

    folder: string
  ) {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    try {

      setUploading(true);

      setError("");

      setSuccess("");


      const oldUrl =
        formData[field];


      const newUrl =
        await uploadSettingsAsset(
          file,
          folder
        );


      setFormData(
        (previous) => ({
          ...previous,

          [field]:
            newUrl,
        })
      );


      if (
        oldUrl &&
        oldUrl !== newUrl
      ) {

        try {

          await deleteSettingsAsset(
            oldUrl
          );

        } catch (cleanupError) {

          console.error(
            "Old asset cleanup failed:",
            cleanupError
          );

        }

      }


      setSuccess(
        "File uploaded successfully."
      );

    } catch (uploadError) {

      console.error(
        "Settings asset upload error:",
        uploadError
      );


      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload file."
      );

    } finally {

      setUploading(false);

      event.target.value = "";

    }
  }


  /* =========================================================
     DELETE ASSET
  ========================================================= */

  async function handleDeleteAsset(
    field:
      | "resume_url"
      | "logo_url"
      | "favicon_url"
      | "day_background_url"
      | "night_background_url"
  ) {

    const fileUrl =
      formData[field];


    if (!fileUrl) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this file?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setUploading(true);

      setError("");

      setSuccess("");


      await deleteSettingsAsset(
        fileUrl
      );


      setFormData(
        (previous) => ({
          ...previous,

          [field]:
            "",
        })
      );


      setSuccess(
        "File deleted successfully."
      );

    } catch (deleteError) {

      console.error(
        "Error deleting settings asset:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete file."
      );

    } finally {

      setUploading(false);

    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="admin-settings-page">

        <div className="settings-page-header">

          <h1>
            Settings
          </h1>

          <p>
            Loading site settings...
          </p>

        </div>

      </div>

    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <div className="admin-settings-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="settings-page-header">

        <div>

          <h1>
            Settings
          </h1>

          <p>
            Manage your portfolio identity, contact details,
            links, SEO and website assets.
          </p>

        </div>

      </div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (

        <div className="settings-error">
          {error}
        </div>

      )}


      {success && (

        <div className="settings-success">
          {success}
        </div>

      )}


      <form
        className="settings-form"
        onSubmit={
          handleSave
        }
      >


        {/* ===================================================
            GENERAL
        =================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <h2>
              General
            </h2>

            <p>
              Basic information shown across your portfolio.
            </p>

          </div>


          <div className="settings-grid">


            <div className="settings-field">

              <label>
                Portfolio Name
              </label>

              <input
                type="text"
                name="portfolio_name"
                value={
                  formData.portfolio_name
                }
                onChange={
                  handleChange
                }
                placeholder="Rithesh V Reddy"
                required
              />

            </div>


            <div className="settings-field">

              <label>
                Tagline
              </label>

              <input
                type="text"
                name="tagline"
                value={
                  formData.tagline
                }
                onChange={
                  handleChange
                }
                placeholder="Product Associate • Computer Science Graduate"
              />

            </div>


            <div className="settings-field">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="hello@example.com"
              />

            </div>


            <div className="settings-field">

              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                placeholder="+91..."
              />

            </div>


            <div className="settings-field">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                placeholder="India"
              />

            </div>


            <div className="settings-field">

              <label>
                Copyright
              </label>

              <input
                type="text"
                name="copyright"
                value={
                  formData.copyright
                }
                onChange={
                  handleChange
                }
                placeholder="© 2026 Rithesh V Reddy. All rights reserved."
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            SOCIAL LINKS
        =================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <h2>
              Social & Links
            </h2>

            <p>
              Manage the links used across your portfolio.
            </p>

          </div>


          <div className="settings-grid">


            <div className="settings-field">

              <label>
                GitHub URL
              </label>

              <input
                type="url"
                name="github_url"
                value={
                  formData.github_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://github.com/..."
              />

            </div>


            <div className="settings-field">

              <label>
                LinkedIn URL
              </label>

              <input
                type="url"
                name="linkedin_url"
                value={
                  formData.linkedin_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://linkedin.com/in/..."
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            SEO
        =================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <h2>
              SEO
            </h2>

            <p>
              Configure search engine title and description.
            </p>

          </div>


          <div className="settings-seo-fields">


            <div className="settings-field">

              <label>
                SEO Title
              </label>

              <input
                type="text"
                name="seo_title"
                value={
                  formData.seo_title
                }
                onChange={
                  handleChange
                }
                placeholder="Rithesh V Reddy | Product Associate"
              />

            </div>


            <div className="settings-field">

              <label>
                SEO Description
              </label>

              <textarea
                name="seo_description"
                value={
                  formData.seo_description
                }
                onChange={
                  handleChange
                }
                rows={5}
                placeholder="Describe your portfolio for search engines..."
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            WEBSITE ASSETS
        =================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <h2>
              Website Assets
            </h2>

            <p>
              Upload and manage your portfolio files and images.
            </p>

          </div>


          {/* =================================================
              RESUME
          ================================================= */}

          <div className="settings-asset">

            <div className="settings-asset-info">

              <h3>
                Resume
              </h3>

              <p>
                Resume used by your download buttons.
              </p>

            </div>


            <input
              ref={
                resumeRef
              }
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(event) =>
                void handleAssetUpload(
                  event,
                  "resume_url",
                  "resume"
                )
              }
            />


            {formData.resume_url ? (

              <div className="settings-file">

                <div>

                  <strong>
                    Resume uploaded
                  </strong>

                  <span>
                    Current resume is active.
                  </span>

                </div>


                <div className="settings-asset-actions">

                  <button
                    type="button"
                    className="settings-secondary-button"
                    onClick={() =>
                      resumeRef.current?.click()
                    }
                    disabled={
                      uploading
                    }
                  >
                    Replace
                  </button>


                  <button
                    type="button"
                    className="settings-danger-button"
                    onClick={() =>
                      void handleDeleteAsset(
                        "resume_url"
                      )
                    }
                    disabled={
                      uploading
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ) : (

              <button
                type="button"
                className="settings-secondary-button"
                onClick={() =>
                  resumeRef.current?.click()
                }
                disabled={
                  uploading
                }
              >
                Upload Resume
              </button>

            )}

          </div>


          {/* =================================================
              LOGO
          ================================================= */}

          <div className="settings-asset">

            <div className="settings-asset-info">

              <h3>
                Logo
              </h3>

              <p>
                Main portfolio logo.
              </p>

            </div>


            <input
              ref={
                logoRef
              }
              type="file"
              accept="image/*"
              hidden
              onChange={(event) =>
                void handleAssetUpload(
                  event,
                  "logo_url",
                  "logo"
                )
              }
            />


            {formData.logo_url ? (

              <div className="settings-image-file">

                <img
                  src={
                    formData.logo_url
                  }
                  alt="Portfolio logo"
                />


                <div className="settings-asset-actions">

                  <button
                    type="button"
                    className="settings-secondary-button"
                    onClick={() =>
                      logoRef.current?.click()
                    }
                    disabled={
                      uploading
                    }
                  >
                    Replace
                  </button>


                  <button
                    type="button"
                    className="settings-danger-button"
                    onClick={() =>
                      void handleDeleteAsset(
                        "logo_url"
                      )
                    }
                    disabled={
                      uploading
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ) : (

              <button
                type="button"
                className="settings-secondary-button"
                onClick={() =>
                  logoRef.current?.click()
                }
                disabled={
                  uploading
                }
              >
                Upload Logo
              </button>

            )}

          </div>


          {/* =================================================
              FAVICON
          ================================================= */}

          <div className="settings-asset">

            <div className="settings-asset-info">

              <h3>
                Favicon
              </h3>

              <p>
                Browser tab icon.
              </p>

            </div>


            <input
              ref={
                faviconRef
              }
              type="file"
              accept="image/*"
              hidden
              onChange={(event) =>
                void handleAssetUpload(
                  event,
                  "favicon_url",
                  "favicon"
                )
              }
            />


            {formData.favicon_url ? (

              <div className="settings-image-file small">

                <img
                  src={
                    formData.favicon_url
                  }
                  alt="Favicon"
                />


                <div className="settings-asset-actions">

                  <button
                    type="button"
                    className="settings-secondary-button"
                    onClick={() =>
                      faviconRef.current?.click()
                    }
                    disabled={
                      uploading
                    }
                  >
                    Replace
                  </button>


                  <button
                    type="button"
                    className="settings-danger-button"
                    onClick={() =>
                      void handleDeleteAsset(
                        "favicon_url"
                      )
                    }
                    disabled={
                      uploading
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ) : (

              <button
                type="button"
                className="settings-secondary-button"
                onClick={() =>
                  faviconRef.current?.click()
                }
                disabled={
                  uploading
                }
              >
                Upload Favicon
              </button>

            )}

          </div>


          {/* =================================================
              DAY BACKGROUND
          ================================================= */}

          <div className="settings-asset">

            <div className="settings-asset-info">

              <h3>
                Day Background
              </h3>

              <p>
                Background used for the light theme.
              </p>

            </div>


            <input
              ref={
                dayBackgroundRef
              }
              type="file"
              accept="image/*"
              hidden
              onChange={(event) =>
                void handleAssetUpload(
                  event,
                  "day_background_url",
                  "backgrounds"
                )
              }
            />


            {formData.day_background_url ? (

              <div className="settings-background-preview">

                <img
                  src={
                    formData.day_background_url
                  }
                  alt="Day background"
                />


                <div className="settings-asset-actions">

                  <button
                    type="button"
                    className="settings-secondary-button"
                    onClick={() =>
                      dayBackgroundRef.current?.click()
                    }
                    disabled={
                      uploading
                    }
                  >
                    Replace
                  </button>


                  <button
                    type="button"
                    className="settings-danger-button"
                    onClick={() =>
                      void handleDeleteAsset(
                        "day_background_url"
                      )
                    }
                    disabled={
                      uploading
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ) : (

              <button
                type="button"
                className="settings-secondary-button"
                onClick={() =>
                  dayBackgroundRef.current?.click()
                }
                disabled={
                  uploading
                }
              >
                Upload Day Background
              </button>

            )}

          </div>


          {/* =================================================
              NIGHT BACKGROUND
          ================================================= */}

          <div className="settings-asset">

            <div className="settings-asset-info">

              <h3>
                Night Background
              </h3>

              <p>
                Background used for the dark theme.
              </p>

            </div>


            <input
              ref={
                nightBackgroundRef
              }
              type="file"
              accept="image/*"
              hidden
              onChange={(event) =>
                void handleAssetUpload(
                  event,
                  "night_background_url",
                  "backgrounds"
                )
              }
            />


            {formData.night_background_url ? (

              <div className="settings-background-preview">

                <img
                  src={
                    formData.night_background_url
                  }
                  alt="Night background"
                />


                <div className="settings-asset-actions">

                  <button
                    type="button"
                    className="settings-secondary-button"
                    onClick={() =>
                      nightBackgroundRef.current?.click()
                    }
                    disabled={
                      uploading
                    }
                  >
                    Replace
                  </button>


                  <button
                    type="button"
                    className="settings-danger-button"
                    onClick={() =>
                      void handleDeleteAsset(
                        "night_background_url"
                      )
                    }
                    disabled={
                      uploading
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ) : (

              <button
                type="button"
                className="settings-secondary-button"
                onClick={() =>
                  nightBackgroundRef.current?.click()
                }
                disabled={
                  uploading
                }
              >
                Upload Night Background
              </button>

            )}

          </div>

        </section>


        {/* ===================================================
            SAVE
        =================================================== */}

        <div className="settings-save-bar">

          <button
            type="submit"
            className="settings-primary-button"
            disabled={
              saving ||
              uploading
            }
          >

            {saving
              ? "Saving..."
              : "Save Settings"}

          </button>

        </div>

      </form>

    </div>
  );
}