import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  createHobby,
  deleteAboutAsset,
  deleteHobby,
  getAboutProfile,
  getAdminHobbies,
  saveAboutProfile,
  updateHobby,
  uploadHobbyIcon,
  uploadResume,
} from "../../services/about.service";

import type {
  Hobby,
} from "../../types/about";

import "./About.css";


/* =========================================================
   FORM TYPES
========================================================= */

interface AboutFormData {
  title: string;

  subtitle: string;

  /*
    Existing database columns.

    These are actually the two About paragraphs.
  */
  background_1: string;

  background_2: string;

  resume_url: string;
}


interface HobbyFormData {
  name: string;

  icon_url: string;

  display_order: number;

  published: boolean;
}


/* =========================================================
   INITIAL DATA
========================================================= */

const initialAboutData:
  AboutFormData = {

  title: "",

  subtitle: "",

  background_1: "",

  background_2: "",

  resume_url: "",
};


const initialHobbyData:
  HobbyFormData = {

  name: "",

  icon_url: "",

  display_order: 0,

  published: true,
};


/* =========================================================
   COMPONENT
========================================================= */

export default function About() {

  /* =======================================================
     ABOUT PROFILE
  ======================================================= */

  const [
    aboutData,
    setAboutData,
  ] =
    useState<AboutFormData>(
      initialAboutData
    );


  /* =======================================================
     HOBBIES
  ======================================================= */

  const [
    hobbies,
    setHobbies,
  ] =
    useState<Hobby[]>([]);


  const [
    hobbyData,
    setHobbyData,
  ] =
    useState<HobbyFormData>(
      initialHobbyData
    );


  const [
    editingHobby,
    setEditingHobby,
  ] =
    useState<Hobby | null>(
      null
    );


  const [
    showHobbyForm,
    setShowHobbyForm,
  ] =
    useState(false);


  /* =======================================================
     UI
  ======================================================= */

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    savingProfile,
    setSavingProfile,
  ] =
    useState(false);


  const [
    savingHobby,
    setSavingHobby,
  ] =
    useState(false);


  const [
    uploadingAsset,
    setUploadingAsset,
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


  const hobbyIconRef =
    useRef<HTMLInputElement | null>(
      null
    );


  /* =========================================================
     LOAD DATA
  ========================================================= */

  async function loadData() {

    try {

      setLoading(true);

      setError("");


      const [
        profile,
        hobbyList,
      ] =
        await Promise.all([
          getAboutProfile(),
          getAdminHobbies(),
        ]);


      setHobbies(
        hobbyList
      );


      if (profile) {

        setAboutData({

          title:
            profile.title || "",

          subtitle:
            profile.subtitle || "",

          background_1:
            profile.background_1 || "",

          background_2:
            profile.background_2 || "",

          resume_url:
            profile.resume_url || "",

        });

      } else {

        setAboutData(
          initialAboutData
        );

      }

    } catch (loadError) {

      console.error(
        "Error loading About admin:",
        loadError
      );


      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load About data."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    void loadData();

  }, []);


  /* =========================================================
     ABOUT FORM CHANGE
  ========================================================= */

  function handleAboutChange(
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


    setAboutData(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );

  }


  /* =========================================================
     HOBBY FORM CHANGE
  ========================================================= */

  function handleHobbyChange(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const target =
      event.target;


    const {
      name,
      value,
      type,
    } =
      target;


    if (
      type === "checkbox"
    ) {

      setHobbyData(
        (previous) => ({
          ...previous,

          [name]:
            target.checked,
        })
      );


      return;

    }


    setHobbyData(
      (previous) => ({
        ...previous,

        [name]:
          name === "display_order"
            ? Number(value)
            : value,
      })
    );

  }


  /* =========================================================
     SAVE ABOUT PROFILE
  ========================================================= */

  async function handleSaveProfile(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (
      !aboutData.title.trim()
    ) {

      setError(
        "About title is required."
      );

      return;

    }


    if (
      !aboutData.background_1.trim()
    ) {

      setError(
        "About paragraph 1 is required."
      );

      return;

    }


    try {

      setSavingProfile(true);

      setError("");

      setSuccess("");


      await saveAboutProfile({

        title:
          aboutData.title.trim(),

        subtitle:
          aboutData.subtitle.trim() ||
          null,

        background_1:
          aboutData.background_1.trim(),

        background_2:
          aboutData.background_2.trim() ||
          null,

        resume_url:
          aboutData.resume_url ||
          null,

      });


      setSuccess(
        "About profile saved successfully."
      );

    } catch (saveError) {

      console.error(
        "Error saving About profile:",
        saveError
      );


      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save About profile."
      );

    } finally {

      setSavingProfile(false);

    }

  }


  /* =========================================================
     RESUME UPLOAD
  ========================================================= */

  async function handleResumeUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    try {

      setUploadingAsset(true);

      setError("");

      setSuccess("");


      const oldUrl =
        aboutData.resume_url;


      const newUrl =
        await uploadResume(
          file
        );


      setAboutData(
        (previous) => ({
          ...previous,

          resume_url:
            newUrl,
        })
      );


      /*
        Delete the previous file after
        the replacement upload succeeds.
      */

      if (
        oldUrl &&
        oldUrl !== newUrl
      ) {

        try {

          await deleteAboutAsset(
            oldUrl
          );

        } catch (cleanupError) {

          console.error(
            "Old resume cleanup failed:",
            cleanupError
          );

        }

      }


      setSuccess(
        "Resume uploaded successfully."
      );

    } catch (uploadError) {

      console.error(
        "Resume upload error:",
        uploadError
      );


      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload resume."
      );

    } finally {

      setUploadingAsset(false);

      event.target.value = "";

    }

  }


  /* =========================================================
     DELETE RESUME
  ========================================================= */

  async function handleDeleteResume() {

    if (
      !aboutData.resume_url
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        "Delete the resume?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setUploadingAsset(true);

      setError("");

      setSuccess("");


      await deleteAboutAsset(
        aboutData.resume_url
      );


      setAboutData(
        (previous) => ({
          ...previous,

          resume_url:
            "",
        })
      );


      setSuccess(
        "Resume deleted successfully."
      );

    } catch (deleteError) {

      console.error(
        "Error deleting resume:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete resume."
      );

    } finally {

      setUploadingAsset(false);

    }

  }


  /* =========================================================
     CREATE HOBBY
  ========================================================= */

  function handleCreateHobby() {

    setEditingHobby(
      null
    );


    setHobbyData({

      name:
        "",

      icon_url:
        "",

      display_order:
        hobbies.length,

      published:
        true,

    });


    setError("");

    setSuccess("");

    setShowHobbyForm(
      true
    );

  }


  /* =========================================================
     EDIT HOBBY
  ========================================================= */

  function handleEditHobby(
    hobby: Hobby
  ) {

    setEditingHobby(
      hobby
    );


    setHobbyData({

      name:
        hobby.name,

      icon_url:
        hobby.icon_url,

      display_order:
        hobby.display_order,

      published:
        hobby.published,

    });


    setError("");

    setSuccess("");

    setShowHobbyForm(
      true
    );

  }


  /* =========================================================
     CLOSE HOBBY FORM
  ========================================================= */

  function closeHobbyForm() {

    if (
      savingHobby ||
      uploadingAsset
    ) {

      return;

    }


    setShowHobbyForm(
      false
    );


    setEditingHobby(
      null
    );


    setHobbyData(
      initialHobbyData
    );

  }


  /* =========================================================
     HOBBY ICON UPLOAD
  ========================================================= */

  async function handleHobbyIconUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    try {

      setUploadingAsset(true);

      setError("");

      setSuccess("");


      const oldUrl =
        hobbyData.icon_url;


      const newUrl =
        await uploadHobbyIcon(
          file
        );


      setHobbyData(
        (previous) => ({
          ...previous,

          icon_url:
            newUrl,
        })
      );


      if (
        oldUrl &&
        oldUrl !== newUrl
      ) {

        try {

          await deleteAboutAsset(
            oldUrl
          );

        } catch (cleanupError) {

          console.error(
            "Old hobby icon cleanup failed:",
            cleanupError
          );

        }

      }


      setSuccess(
        "Hobby icon uploaded successfully."
      );

    } catch (uploadError) {

      console.error(
        "Hobby icon upload error:",
        uploadError
      );


      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload hobby icon."
      );

    } finally {

      setUploadingAsset(false);

      event.target.value = "";

    }

  }


  /* =========================================================
     DELETE HOBBY ICON
  ========================================================= */

  async function handleDeleteHobbyIcon() {

    if (
      !hobbyData.icon_url
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        "Delete this hobby icon?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setUploadingAsset(true);

      setError("");

      setSuccess("");


      await deleteAboutAsset(
        hobbyData.icon_url
      );


      setHobbyData(
        (previous) => ({
          ...previous,

          icon_url:
            "",
        })
      );


      setSuccess(
        "Hobby icon deleted."
      );

    } catch (deleteError) {

      console.error(
        "Error deleting hobby icon:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete hobby icon."
      );

    } finally {

      setUploadingAsset(false);

    }

  }


  /* =========================================================
     SAVE HOBBY
  ========================================================= */

  async function handleSaveHobby(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (
      !hobbyData.name.trim()
    ) {

      setError(
        "Hobby name is required."
      );

      return;

    }


    if (
      !hobbyData.icon_url
    ) {

      setError(
        "Hobby icon is required."
      );

      return;

    }


    try {

      setSavingHobby(true);

      setError("");

      setSuccess("");


      if (
        editingHobby
      ) {

        const updated =
          await updateHobby(
            editingHobby.id,
            {

              name:
                hobbyData.name.trim(),

              icon_url:
                hobbyData.icon_url,

              display_order:
                hobbyData.display_order,

              published:
                hobbyData.published,

            }
          );


        setHobbies(
          (previous) =>
            previous
              .map(
                (item) =>
                  item.id ===
                  updated.id
                    ? updated
                    : item
              )
              .sort(
                (a, b) =>
                  a.display_order -
                  b.display_order
              )
        );


        setSuccess(
          "Hobby updated successfully."
        );

      } else {

        const created =
          await createHobby({

            name:
              hobbyData.name.trim(),

            icon_url:
              hobbyData.icon_url,

            display_order:
              hobbyData.display_order,

            published:
              hobbyData.published,

          });


        setHobbies(
          (previous) =>
            [
              ...previous,
              created,
            ].sort(
              (a, b) =>
                a.display_order -
                b.display_order
            )
        );


        setSuccess(
          "Hobby created successfully."
        );

      }


      setShowHobbyForm(
        false
      );


      setEditingHobby(
        null
      );


      setHobbyData(
        initialHobbyData
      );

    } catch (saveError) {

      console.error(
        "Error saving hobby:",
        saveError
      );


      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save hobby."
      );

    } finally {

      setSavingHobby(false);

    }

  }


  /* =========================================================
     DELETE HOBBY
  ========================================================= */

  async function handleDeleteHobby(
    hobby: Hobby
  ) {

    const confirmed =
      window.confirm(
        `Delete "${hobby.name}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");

      setSuccess("");


      if (
        hobby.icon_url
      ) {

        try {

          await deleteAboutAsset(
            hobby.icon_url
          );

        } catch (imageError) {

          console.error(
            "Hobby icon cleanup failed:",
            imageError
          );

        }

      }


      await deleteHobby(
        hobby.id
      );


      setHobbies(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              hobby.id
          )
      );


      setSuccess(
        "Hobby deleted successfully."
      );

    } catch (deleteError) {

      console.error(
        "Error deleting hobby:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete hobby."
      );

    }

  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="admin-about-page">

        <div className="about-page-header">

          <div>

            <h1>
              About
            </h1>

            <p>
              Loading About content...
            </p>

          </div>

        </div>

      </div>

    );

  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <div className="admin-about-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="about-page-header">

        <div>

          <h1>
            About
          </h1>

          <p>
            Manage your About page content, resume and hobbies.
          </p>

        </div>

      </div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (

        <div className="about-error">
          {error}
        </div>

      )}


      {success && (

        <div className="about-success">
          {success}
        </div>

      )}


      {/* =====================================================
          ABOUT PROFILE
      ===================================================== */}

      <section className="about-card">


        <div className="about-card-header">

          <div>

            <h2>
              About Profile
            </h2>

            <p>
              Manage the content displayed on your About page.
            </p>

          </div>

        </div>


        <form
          className="about-form"
          onSubmit={
            handleSaveProfile
          }
        >


          {/* =================================================
              TITLE
          ================================================= */}

          <div className="about-form-group">

            <label>
              Title
            </label>

            <input
              type="text"
              name="title"
              value={
                aboutData.title
              }
              onChange={
                handleAboutChange
              }
              placeholder="About Me"
              required
            />

          </div>


          {/* =================================================
              SUBTITLE
          ================================================= */}

          <div className="about-form-group about-form-full-width">

            <label>
              Subtitle
            </label>

            <input
              type="text"
              name="subtitle"
              value={
                aboutData.subtitle
              }
              onChange={
                handleAboutChange
              }
              placeholder="Product Associate • Computer Science Graduate."
            />

          </div>


          {/* =================================================
              PARAGRAPH 1
          ================================================= */}

          <div className="about-form-group about-form-full-width">

            <label>
              About Paragraph 1
            </label>

            <textarea
              name="background_1"
              value={
                aboutData.background_1
              }
              onChange={
                handleAboutChange
              }
              placeholder="Write the first paragraph of your About section..."
              rows={7}
            />

          </div>


          {/* =================================================
              PARAGRAPH 2
          ================================================= */}

          <div className="about-form-group about-form-full-width">

            <label>
              About Paragraph 2
            </label>

            <textarea
              name="background_2"
              value={
                aboutData.background_2
              }
              onChange={
                handleAboutChange
              }
              placeholder="Write the second paragraph of your About section..."
              rows={7}
            />

          </div>


          {/* =================================================
              RESUME
          ================================================= */}

          <div className="about-asset-section">

            <div className="about-asset-header">

              <div>

                <h3>
                  Resume
                </h3>

                <p>
                  Upload the resume used by your website.
                </p>

              </div>

            </div>


            <input
              ref={
                resumeRef
              }
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={
                handleResumeUpload
              }
            />


            {aboutData.resume_url ? (

              <div className="about-file-row">

                <div>

                  <strong>
                    Resume uploaded
                  </strong>

                  <span>
                    Your current resume is connected.
                  </span>

                </div>


                <div className="about-asset-actions">

                  <button
                    type="button"
                    className="about-secondary-button"
                    onClick={() =>
                      resumeRef.current?.click()
                    }
                    disabled={
                      uploadingAsset
                    }
                  >
                    Replace
                  </button>


                  <button
                    type="button"
                    className="about-danger-button"
                    onClick={
                      handleDeleteResume
                    }
                    disabled={
                      uploadingAsset
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ) : (

              <div className="about-upload-empty">

                <p>
                  No resume uploaded.
                </p>


                <button
                  type="button"
                  className="about-primary-button"
                  onClick={() =>
                    resumeRef.current?.click()
                  }
                  disabled={
                    uploadingAsset
                  }
                >
                  Upload Resume
                </button>

              </div>

            )}

          </div>


          {/* =================================================
              SAVE
          ================================================= */}

          <div className="about-form-actions">

            <button
              type="submit"
              className="about-primary-button"
              disabled={
                savingProfile ||
                uploadingAsset
              }
            >

              {savingProfile
                ? "Saving..."
                : "Save About Profile"}

            </button>

          </div>

        </form>

      </section>


      {/* =====================================================
          HOBBIES
      ===================================================== */}

      <section className="about-card">


        <div className="about-card-header">

          <div>

            <h2>
              Hobbies
            </h2>

            <p>
              Manage the hobbies displayed on your About page.
            </p>

          </div>


          <button
            type="button"
            className="about-primary-button"
            onClick={
              handleCreateHobby
            }
          >
            + Add Hobby
          </button>

        </div>


        {/* ===================================================
            HOBBY EDITOR
        =================================================== */}

        {showHobbyForm && (

          <div className="hobby-editor">


            <div className="hobby-editor-header">

              <h3>

                {editingHobby
                  ? "Edit Hobby"
                  : "Add Hobby"}

              </h3>


              <button
                type="button"
                className="about-close-button"
                onClick={
                  closeHobbyForm
                }
              >
                ×
              </button>

            </div>


            <form
              className="hobby-form"
              onSubmit={
                handleSaveHobby
              }
            >


              <div className="hobby-form-grid">


                <div className="about-form-group">

                  <label>
                    Hobby Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      hobbyData.name
                    }
                    onChange={
                      handleHobbyChange
                    }
                    placeholder="Photography"
                    required
                  />

                </div>


                <div className="about-form-group">

                  <label>
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="display_order"
                    value={
                      hobbyData.display_order
                    }
                    onChange={
                      handleHobbyChange
                    }
                    min="0"
                  />

                </div>


                <div className="hobby-icon-section">

                  <label>
                    Hobby Icon
                  </label>


                  <input
                    ref={
                      hobbyIconRef
                    }
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleHobbyIconUpload
                    }
                  />


                  {hobbyData.icon_url ? (

                    <div className="hobby-icon-preview">

                      <img
                        src={
                          hobbyData.icon_url
                        }
                        alt={
                          hobbyData.name ||
                          "Hobby icon"
                        }
                      />


                      <div className="about-asset-actions">

                        <button
                          type="button"
                          className="about-secondary-button"
                          onClick={() =>
                            hobbyIconRef.current?.click()
                          }
                          disabled={
                            uploadingAsset
                          }
                        >
                          Replace
                        </button>


                        <button
                          type="button"
                          className="about-danger-button"
                          onClick={
                            handleDeleteHobbyIcon
                          }
                          disabled={
                            uploadingAsset
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  ) : (

                    <button
                      type="button"
                      className="about-secondary-button"
                      onClick={() =>
                        hobbyIconRef.current?.click()
                      }
                      disabled={
                        uploadingAsset
                      }
                    >
                      Upload Icon
                    </button>

                  )}

                </div>


                <label className="about-checkbox">

                  <input
                    type="checkbox"
                    name="published"
                    checked={
                      hobbyData.published
                    }
                    onChange={
                      handleHobbyChange
                    }
                  />

                  Published

                </label>

              </div>


              <div className="hobby-form-actions">

                <button
                  type="button"
                  className="about-secondary-button"
                  onClick={
                    closeHobbyForm
                  }
                  disabled={
                    savingHobby ||
                    uploadingAsset
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="about-primary-button"
                  disabled={
                    savingHobby ||
                    uploadingAsset
                  }
                >

                  {savingHobby
                    ? "Saving..."
                    : editingHobby
                      ? "Update Hobby"
                      : "Create Hobby"}

                </button>

              </div>

            </form>

          </div>

        )}


        {/* ===================================================
            HOBBY LIST
        =================================================== */}

        <div className="hobbies-list">


          {hobbies.length === 0 ? (

            <div className="about-empty-state">

              <h3>
                No hobbies found
              </h3>

              <p>
                Add your first hobby.
              </p>

            </div>

          ) : (

            hobbies.map(
              (hobby) => (

                <article
                  key={
                    hobby.id
                  }
                  className="hobby-card"
                >


                  <div className="hobby-card-icon">

                    {hobby.icon_url ? (

                      <img
                        src={
                          hobby.icon_url
                        }
                        alt=""
                      />

                    ) : (

                      <span>
                        ?
                      </span>

                    )}

                  </div>


                  <div className="hobby-card-content">


                    <div className="hobby-card-top">

                      <div>

                        <h3>
                          {hobby.name}
                        </h3>

                        <span>
                          Order:
                          {" "}
                          {hobby.display_order}
                        </span>

                      </div>


                      <div className="hobby-status">

                        {hobby.published ? (

                          <span className="about-status published">
                            Published
                          </span>

                        ) : (

                          <span className="about-status draft">
                            Draft
                          </span>

                        )}

                      </div>

                    </div>


                    <div className="hobby-card-actions">

                      <button
                        type="button"
                        className="about-secondary-button"
                        onClick={() =>
                          handleEditHobby(
                            hobby
                          )
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="about-danger-button"
                        onClick={() =>
                          void handleDeleteHobby(
                            hobby
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              )
            )

          )}

        </div>

      </section>

    </div>
  );
}