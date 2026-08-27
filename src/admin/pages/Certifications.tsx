import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  createCertification,
  createCertificationPoint,
  deleteCertification,
  deleteCertificationPoint,
  getAdminCertifications,
  updateCertification,
  updateCertificationPoint,
} from "../../services/certifications.service";

import type {
  Certification,
  CertificationType,
} from "../../types/certification";

import "./Certifications.css";


/* =========================================================
   TYPES
========================================================= */

interface CertificationFormData {
  title: string;
  organization: string;
  type: CertificationType;
  credential_url: string;
  featured: boolean;
  published: boolean;
  display_order: number;
}


interface PointFormData {
  id?: string;
  point: string;
  display_order: number;
}


/* =========================================================
   INITIAL STATE
========================================================= */

const initialFormData:
  CertificationFormData = {

  title: "",

  organization: "",

  type: "course",

  credential_url: "",

  featured: false,

  published: false,

  display_order: 0,
};


/* =========================================================
   TYPES
========================================================= */

const certificationTypes: {
  value: CertificationType;
  label: string;
}[] = [

  {
    value: "course",
    label: "Course",
  },

  {
    value: "achievement",
    label: "Achievement",
  },

  {
    value: "leadership",
    label: "Leadership",
  },

  {
    value: "award",
    label: "Award",
  },
];


/* =========================================================
   COMPONENT
========================================================= */

export default function Certifications() {

  const [
    certifications,
    setCertifications,
  ] = useState<Certification[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);


  const [
    editingCertification,
    setEditingCertification,
  ] =
    useState<Certification | null>(
      null
    );


  const [
    formData,
    setFormData,
  ] =
    useState<CertificationFormData>(
      initialFormData
    );


  const [
    points,
    setPoints,
  ] =
    useState<PointFormData[]>([]);


  /* =========================================================
     LOAD
  ========================================================= */

  async function loadCertifications() {

    try {

      setLoading(true);

      setError("");


      const data =
        await getAdminCertifications();


      setCertifications(
        data
      );

    } catch (loadError) {

      console.error(
        "Error loading certifications:",
        loadError
      );


      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load certifications."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    void loadCertifications();

  }, []);


  /* =========================================================
     CHANGE
  ========================================================= */

function handleChange(
  event: ChangeEvent<
    HTMLInputElement | HTMLSelectElement
  >
) {
  const target = event.target;

  const {
    name,
    value,
    type,
  } = target;

  if (
    type === "checkbox" &&
    target instanceof HTMLInputElement
  ) {
    setFormData((previous) => ({
      ...previous,
      [name]: target.checked,
    }));

    return;
  }

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
}


  /* =========================================================
     OPEN CREATE
  ========================================================= */

  function handleCreate() {

    setEditingCertification(
      null
    );


    setFormData({
      ...initialFormData,

      display_order:
        certifications.length,
    });


    setPoints([]);

    setError("");

    setSuccess("");

    setIsFormOpen(
      true
    );
  }


  /* =========================================================
     OPEN EDIT
  ========================================================= */

  function handleEdit(
    certification: Certification
  ) {

    setEditingCertification(
      certification
    );


    setFormData({

      title:
        certification.title,

      organization:
        certification.organization,

      type:
        certification.type,

      credential_url:
        certification.credential_url ||
        "",

      featured:
        certification.featured,

      published:
        certification.published,

      display_order:
        certification.display_order,
    });


    setPoints(
      certification.points
        .map(
          (point) => ({
            id:
              point.id,

            point:
              point.point,

            display_order:
              point.display_order,
          })
        )
        .sort(
          (a, b) =>
            a.display_order -
            b.display_order
        )
    );


    setError("");

    setSuccess("");

    setIsFormOpen(
      true
    );
  }


  /* =========================================================
     CLOSE
  ========================================================= */

  function closeForm() {

    if (saving) {
      return;
    }


    setIsFormOpen(
      false
    );

    setEditingCertification(
      null
    );

    setFormData(
      initialFormData
    );

    setPoints([]);

    setError("");
  }


  /* =========================================================
     POINT CHANGE
  ========================================================= */

  function handlePointChange(
    index: number,
    value: string
  ) {

    setPoints(
      (previous) =>
        previous.map(
          (point, pointIndex) =>
            pointIndex === index
              ? {
                  ...point,
                  point: value,
                }
              : point
        )
    );
  }


  /* =========================================================
     ADD POINT
  ========================================================= */

  function addPoint() {

    setPoints(
      (previous) => [
        ...previous,

        {
          point: "",
          display_order:
            previous.length,
        },
      ]
    );
  }


  /* =========================================================
     REMOVE POINT
  ========================================================= */

  async function removePoint(
    index: number
  ) {

    const point =
      points[index];


    if (
      point?.id
    ) {

      try {

        await deleteCertificationPoint(
          point.id
        );

      } catch (pointError) {

        console.error(
          "Error deleting point:",
          pointError
        );


        setError(
          pointError instanceof Error
            ? pointError.message
            : "Unable to delete point."
        );


        return;
      }
    }


    setPoints(
      (previous) =>
        previous
          .filter(
            (
              _,
              pointIndex
            ) =>
              pointIndex !== index
          )
          .map(
            (
              item,
              pointIndex
            ) => ({
              ...item,
              display_order:
                pointIndex,
            })
          )
    );
  }


  /* =========================================================
     SAVE
  ========================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (
      !formData.title.trim()
    ) {

      setError(
        "Certification title is required."
      );

      return;
    }


    if (
      !formData.organization.trim()
    ) {

      setError(
        "Organization is required."
      );

      return;
    }


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const input = {

        title:
          formData.title.trim(),

        organization:
          formData.organization.trim(),

        type:
          formData.type,

        credential_url:
          formData.credential_url.trim() ||
          null,

        featured:
          formData.featured,

        published:
          formData.published,

        display_order:
          Number(
            formData.display_order
          ),

      };


      let certificationId =
        editingCertification?.id;


      /* =====================================================
         CREATE
      ===================================================== */

      if (
        editingCertification
      ) {

        await updateCertification(
          editingCertification.id,
          input
        );

      } else {

        const created =
          await createCertification(
            input
          );

        certificationId =
          created.id;
      }


      /* =====================================================
         SAVE POINTS
      ===================================================== */

      if (
        certificationId
      ) {

        const cleanedPoints =
          points
            .map(
              (point) =>
                point.point.trim()
            )
            .filter(
              (point) =>
                point.length > 0
            );


        /*
          Existing points are updated,
          empty points are removed,
          new points are inserted.
        */

        const existingPointIds =
          new Set(
            points
              .filter(
                (point) =>
                  Boolean(point.id) &&
                  point.point.trim()
                    .length > 0
              )
              .map(
                (point) =>
                  point.id as string
              )
          );


        const originalPoints =
          editingCertification?.points ??
          [];


        for (
          const originalPoint
          of originalPoints
        ) {

          if (
            !existingPointIds.has(
              originalPoint.id
            ) &&
            !points.some(
              (point) =>
                point.id ===
                originalPoint.id
            )
          ) {

            await deleteCertificationPoint(
              originalPoint.id
            );
          }
        }


        for (
          let index = 0;
          index <
            points.length;
          index++
        ) {

          const point =
            points[index];


          const cleaned =
            point.point.trim();


          if (!cleaned) {
            continue;
          }


          if (
            point.id
          ) {

            await updateCertificationPoint(
              point.id,
              {
                point:
                  cleaned,

                display_order:
                  index,
              }
            );

          } else {

            await createCertificationPoint(
              certificationId,
              {
                point:
                  cleaned,

                display_order:
                  index,
              }
            );
          }
        }


        /*
          Make sure display order
          is normalized.
        */

        void cleanedPoints;
      }


      await loadCertifications();


      setSuccess(
        editingCertification
          ? "Certification updated successfully."
          : "Certification created successfully."
      );


      setIsFormOpen(
        false
      );

      setEditingCertification(
        null
      );

      setFormData(
        initialFormData
      );

      setPoints([]);

    } catch (saveError) {

      console.error(
        "Error saving certification:",
        saveError
      );


      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save certification."
      );

    } finally {

      setSaving(false);
    }
  }


  /* =========================================================
     DELETE
  ========================================================= */

  async function handleDelete(
    certification: Certification
  ) {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${certification.title}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");

      setSuccess("");


      await deleteCertification(
        certification.id
      );


      setCertifications(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              certification.id
          )
      );


      setSuccess(
        "Certification deleted successfully."
      );

    } catch (deleteError) {

      console.error(
        "Error deleting certification:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete certification."
      );
    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="admin-certifications-page">

        <div className="certifications-header">

          <div>

            <h1>
              Certifications
            </h1>

            <p>
              Loading certifications...
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

    <div className="admin-certifications-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="certifications-header">

        <div>

          <h1>
            Certifications
          </h1>

          <p>
            Create, edit and manage your certifications,
            achievements and awards.
          </p>

        </div>


        <button
          type="button"
          className="certifications-primary-button"
          onClick={
            handleCreate
          }
        >
          + Add Certification
        </button>

      </div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (

        <div className="certifications-error">
          {error}
        </div>

      )}


      {success && (

        <div className="certifications-success">
          {success}
        </div>

      )}


      {/* =====================================================
          FORM
      ===================================================== */}

      {isFormOpen && (

        <div className="certification-editor">

          <div className="certification-editor-header">

            <div>

              <h2>

                {editingCertification
                  ? `Edit ${editingCertification.title}`
                  : "Create Certification"}

              </h2>

              <p>
                Manage certification details and points.
              </p>

            </div>


            <button
              type="button"
              className="certifications-close-button"
              onClick={
                closeForm
              }
              disabled={
                saving
              }
            >
              ×
            </button>

          </div>


          <form
            onSubmit={
              handleSubmit
            }
            className="certification-form"
          >


            {/* =================================================
                BASIC DETAILS
            ================================================= */}

            <div className="certification-form-grid">


              <div className="certification-form-group">

                <label>
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Certification title"
                  required
                />

              </div>


              <div className="certification-form-group">

                <label>
                  Organization
                </label>

                <input
                  type="text"
                  name="organization"
                  value={
                    formData.organization
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Issuing organization"
                  required
                />

              </div>


              <div className="certification-form-group">

                <label>
                  Type
                </label>

                <select
                  name="type"
                  value={
                    formData.type
                  }
                  onChange={
                    handleChange
                  }
                >

                  {certificationTypes.map(
                    (item) => (

                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="certification-form-group">

                <label>
                  Display Order
                </label>

                <input
                  type="number"
                  name="display_order"
                  value={
                    formData.display_order
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                />

              </div>


              <div className="certification-form-group certification-form-full">

                <label>
                  Credential URL
                </label>

                <input
                  type="url"
                  name="credential_url"
                  value={
                    formData.credential_url
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                />

              </div>

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div className="certification-settings">

              <label className="certification-checkbox">

                <input
                  type="checkbox"
                  name="featured"
                  checked={
                    formData.featured
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  Featured
                </span>

              </label>


              <label className="certification-checkbox">

                <input
                  type="checkbox"
                  name="published"
                  checked={
                    formData.published
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>
                  Published
                </span>

              </label>

            </div>


            {/* =================================================
                POINTS
            ================================================= */}

            <div className="certification-points-editor">

              <div className="certification-points-header">

                <div>

                  <h3>
                    Certification Points
                  </h3>

                  <p>
                    Add the key details you want displayed
                    for this certification.
                  </p>

                </div>


                <button
                  type="button"
                  className="certifications-secondary-button"
                  onClick={
                    addPoint
                  }
                >
                  + Add Point
                </button>

              </div>


              {points.length === 0 ? (

                <div className="certification-empty-points">

                  <p>
                    No points added yet.
                  </p>

                </div>

              ) : (

                <div className="certification-points-list">

                  {points.map(
                    (
                      point,
                      index
                    ) => (

                      <div
                        key={
                          point.id ||
                          `point-${index}`
                        }
                        className="certification-point-row"
                      >

                        <span className="certification-point-number">
                          {index + 1}
                        </span>


                        <input
                          type="text"
                          value={
                            point.point
                          }
                          onChange={(
                            event
                          ) =>
                            handlePointChange(
                              index,
                              event.target.value
                            )
                          }
                          placeholder="Enter certification point"
                        />


                        <button
                          type="button"
                          className="certifications-danger-button"
                          onClick={() =>
                            void removePoint(
                              index
                            )
                          }
                          disabled={
                            saving
                          }
                        >
                          Delete
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="certification-form-actions">

              <button
                type="button"
                className="certifications-secondary-button"
                onClick={
                  closeForm
                }
                disabled={
                  saving
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="certifications-primary-button"
                disabled={
                  saving
                }
              >

                {saving
                  ? "Saving..."
                  : editingCertification
                    ? "Update Certification"
                    : "Create Certification"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================================================
          LIST
      ===================================================== */}

      <div className="certifications-list">

        {certifications.length === 0 ? (

          <div className="certifications-empty">

            <h3>
              No certifications found
            </h3>

            <p>
              Add your first certification to get started.
            </p>

          </div>

        ) : (

          certifications.map(
            (certification) => (

              <article
                key={
                  certification.id
                }
                className="certification-card"
              >

                <div className="certification-card-content">

                  <div className="certification-card-main">

                    <div className="certification-card-badges">

                      <span className="certification-type-badge">

                        {certification.type}

                      </span>


                      {certification.published && (

                        <span className="certification-status published">
                          Published
                        </span>

                      )}


                      {!certification.published && (

                        <span className="certification-status draft">
                          Draft
                        </span>

                      )}


                      {certification.featured && (

                        <span className="certification-status featured">
                          Featured
                        </span>

                      )}

                    </div>


                    <h2>
                      {certification.title}
                    </h2>


                    <p className="certification-organization">
                      {certification.organization}
                    </p>


                    {certification.points.length > 0 && (

                      <ul className="certification-preview-points">

                        {certification.points
                          .slice(
                            0,
                            3
                          )
                          .map(
                            (point) => (

                              <li
                                key={
                                  point.id
                                }
                              >
                                {point.point}
                              </li>

                            )
                          )}

                      </ul>

                    )}


                    <div className="certification-card-meta">

                      <span>
                        Order:
                        {" "}
                        {certification.display_order}
                      </span>


                      {certification.credential_url && (

                        <a
                          href={
                            certification.credential_url
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Credential
                        </a>

                      )}

                    </div>

                  </div>


                  <div className="certification-card-actions">

                    <button
                      type="button"
                      className="certifications-secondary-button"
                      onClick={() =>
                        handleEdit(
                          certification
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="certifications-danger-button"
                      onClick={() =>
                        void handleDelete(
                          certification
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

    </div>
  );
}