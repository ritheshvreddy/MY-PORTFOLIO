import {
  useEffect,
  useState,
} from "react";

import "./Roles.css";

import type {
  Role,
  RoleInput,
  RoleResponsibility,
  RoleSkill,
} from "../../types/roles";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  updateRolePublished,
  getResponsibilities,
  createResponsibility,
  updateResponsibility,
  deleteResponsibility,
  getRoleSkills,
  createRoleSkill,
  updateRoleSkill,
  deleteRoleSkill,
} from "../../services/roles.service";


const emptyRole: RoleInput = {
  position: "",
  company: "",
  company_logo: null,
  location: "",
  duration: "",
  employment_type: "",
  short_description: "",
  featured: false,
  is_published: true,
  display_order: 1,
};


export default function Roles() {

  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingRole, setEditingRole] =
    useState<Role | null>(null);

  const [formData, setFormData] =
    useState<RoleInput>(emptyRole);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  const [responsibilities, setResponsibilities] =
    useState<RoleResponsibility[]>([]);

  const [skills, setSkills] =
    useState<RoleSkill[]>([]);

  const [newResponsibility, setNewResponsibility] =
    useState("");

  const [newSkill, setNewSkill] =
    useState("");


  /* =====================================================
     LOAD ROLES
  ===================================================== */

  async function loadRoles() {

    try {

      setLoading(true);

      const data =
        await getRoles();

      setRoles(data);

    } catch (error) {

      console.error(
        "Failed to load roles:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadRoles();

  }, []);


  /* =====================================================
     FORM
  ===================================================== */

  function openCreateForm() {

    setEditingRole(null);

    setFormData({
      ...emptyRole,
      display_order:
        roles.length + 1,
    });

    setShowForm(true);
  }


  function openEditForm(
    role: Role
  ) {

    setEditingRole(role);

    setFormData({
      position: role.position,
      company: role.company,
      company_logo:
        role.company_logo,
      location:
        role.location ?? "",
      duration:
        role.duration ?? "",
      employment_type:
        role.employment_type ?? "",
      short_description:
        role.short_description ?? "",
      featured:
        role.featured,
      is_published:
        role.is_published,
      display_order:
        role.display_order,
    });

    setShowForm(true);
  }


  function closeForm() {

    setShowForm(false);

    setEditingRole(null);

    setFormData(emptyRole);
  }


  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) {

    const {
      name,
      value,
      type,
    } = event.target;

    const checked =
      (event.target as HTMLInputElement)
        .checked;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : name === "display_order"
          ? Number(value)
          : value,

    }));
  }


  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();

    try {

      if (editingRole) {

        await updateRole(
          editingRole.id,
          formData
        );

      } else {

        await createRole(
          formData
        );

      }

      await loadRoles();

      closeForm();

    } catch (error) {

      console.error(
        "Failed to save role:",
        error
      );

      alert(
        "Failed to save role"
      );

    }
  }


  /* =====================================================
     DELETE ROLE
  ===================================================== */

  async function handleDeleteRole(
    role: Role
  ) {

    const confirmed =
      window.confirm(
        `Delete "${role.position}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteRole(
        role.id
      );

      if (
        selectedRole?.id ===
        role.id
      ) {

        setSelectedRole(null);

        setResponsibilities([]);

        setSkills([]);

      }

      await loadRoles();

    } catch (error) {

      console.error(
        "Failed to delete role:",
        error
      );

      alert(
        "Failed to delete role"
      );

    }
  }


  /* =====================================================
     PUBLISH
  ===================================================== */

  async function handlePublishToggle(
    role: Role
  ) {

    try {

      await updateRolePublished(
        role.id,
        !role.is_published
      );

      await loadRoles();

    } catch (error) {

      console.error(
        "Failed to update publish status:",
        error
      );

    }
  }


  /* =====================================================
     SELECT ROLE
  ===================================================== */

  async function selectRole(
    role: Role
  ) {

    try {

      setSelectedRole(role);

      const [
        responsibilitiesData,
        skillsData,
      ] = await Promise.all([
        getResponsibilities(role.id),
        getRoleSkills(role.id),
      ]);

      setResponsibilities(
        responsibilitiesData
      );

      setSkills(
        skillsData
      );

    } catch (error) {

      console.error(
        "Failed to load role details:",
        error
      );

    }
  }


  /* =====================================================
     RESPONSIBILITIES
  ===================================================== */

  async function handleAddResponsibility() {

    if (
      !selectedRole ||
      !newResponsibility.trim()
    ) {
      return;
    }

    try {

      const responsibility =
        await createResponsibility(
          selectedRole.id,
          newResponsibility,
          responsibilities.length + 1
        );

      setResponsibilities(
        (previous) => [
          ...previous,
          responsibility,
        ]
      );

      setNewResponsibility("");

    } catch (error) {

      console.error(
        "Failed to add responsibility:",
        error
      );

    }
  }


  async function handleUpdateResponsibility(
    item: RoleResponsibility,
    value: string
  ) {

    try {

      await updateResponsibility(
        item.id,
        value,
        item.display_order
      );

      setResponsibilities(
        (previous) =>
          previous.map(
            (responsibility) =>
              responsibility.id === item.id
                ? {
                    ...responsibility,
                    responsibility:
                      value,
                  }
                : responsibility
          )
      );

    } catch (error) {

      console.error(
        "Failed to update responsibility:",
        error
      );

    }
  }


  async function handleDeleteResponsibility(
    id: string
  ) {

    try {

      await deleteResponsibility(id);

      setResponsibilities(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );

    } catch (error) {

      console.error(
        "Failed to delete responsibility:",
        error
      );

    }
  }


  /* =====================================================
     SKILLS
  ===================================================== */

  async function handleAddSkill() {

    if (
      !selectedRole ||
      !newSkill.trim()
    ) {
      return;
    }

    try {

      const skill =
        await createRoleSkill(
          selectedRole.id,
          newSkill,
          skills.length + 1
        );

      setSkills(
        (previous) => [
          ...previous,
          skill,
        ]
      );

      setNewSkill("");

    } catch (error) {

      console.error(
        "Failed to add skill:",
        error
      );

    }
  }


  async function handleUpdateSkill(
    item: RoleSkill,
    value: string
  ) {

    try {

      await updateRoleSkill(
        item.id,
        value,
        item.display_order
      );

      setSkills(
        (previous) =>
          previous.map(
            (skill) =>
              skill.id === item.id
                ? {
                    ...skill,
                    skill: value,
                  }
                : skill
          )
      );

    } catch (error) {

      console.error(
        "Failed to update skill:",
        error
      );

    }
  }


  async function handleDeleteSkill(
    id: string
  ) {

    try {

      await deleteRoleSkill(id);

      setSkills(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );

    } catch (error) {

      console.error(
        "Failed to delete skill:",
        error
      );

    }
  }


  /* =====================================================
     RENDER
  ===================================================== */

  if (loading) {

    return (
      <div className="roles-page">

        <div className="roles-loading">
          Loading roles...
        </div>

      </div>
    );

  }


  return (

    <div className="roles-page">

      {/* HEADER */}

      <div className="roles-header">

        <div>

          <h1>
            Roles
          </h1>

          <p>
            Manage your experience,
            education and leadership roles.
          </p>

        </div>

        <button
          className="roles-primary-button"
          onClick={openCreateForm}
        >
          + Add Role
        </button>

      </div>


      {/* CONTENT */}

      <div className="roles-layout">


        {/* ROLES LIST */}

        <div className="roles-list">

          {roles.length === 0 ? (

            <div className="roles-empty">

              <h3>
                No roles found
              </h3>

              <p>
                Create your first role.
              </p>

            </div>

          ) : (

            roles.map((role) => (

              <div
                key={role.id}
                className={`role-card ${
                  selectedRole?.id ===
                  role.id
                    ? "active"
                    : ""
                }`}
              >

                <div
                  className="role-card-main"
                  onClick={() =>
                    selectRole(role)
                  }
                >

                  <div>

                    <h3>
                      {role.position}
                    </h3>

                    <p>
                      {role.company}
                    </p>

                    <span>
                      {role.duration}
                    </span>

                  </div>

                  <div className="role-status">

                    <span
                      className={
                        role.is_published
                          ? "status-published"
                          : "status-draft"
                      }
                    >
                      {role.is_published
                        ? "Published"
                        : "Draft"}
                    </span>

                    {role.featured && (

                      <span className="status-featured">
                        Featured
                      </span>

                    )}

                  </div>

                </div>


                <div className="role-actions">

                  <button
                    onClick={() =>
                      handlePublishToggle(
                        role
                      )
                    }
                  >
                    {role.is_published
                      ? "Unpublish"
                      : "Publish"}
                  </button>

                  <button
                    onClick={() =>
                      openEditForm(role)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteRole(role)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>


        {/* ROLE DETAILS */}

        <div className="role-details">

          {!selectedRole ? (

            <div className="roles-empty">

              <h3>
                Select a role
              </h3>

              <p>
                Select a role to manage
                responsibilities and skills.
              </p>

            </div>

          ) : (

            <>

              <div className="role-details-header">

                <h2>
                  {selectedRole.position}
                </h2>

                <p>
                  {selectedRole.company}
                </p>

              </div>


              {/* RESPONSIBILITIES */}

              <div className="role-section">

                <h3>
                  Responsibilities
                </h3>

                <div className="role-add-row">

                  <input
                    value={
                      newResponsibility
                    }
                    onChange={(event) =>
                      setNewResponsibility(
                        event.target.value
                      )
                    }
                    placeholder="Add responsibility..."
                  />

                  <button
                    onClick={
                      handleAddResponsibility
                    }
                  >
                    Add
                  </button>

                </div>


                <div className="role-items">

                  {responsibilities.map(
                    (item) => (

                      <div
                        className="role-item"
                        key={item.id}
                      >

                        <input
                          defaultValue={
                            item.responsibility
                          }
                          onBlur={(event) =>
                            handleUpdateResponsibility(
                              item,
                              event.target.value
                            )
                          }
                        />

                        <button
                          onClick={() =>
                            handleDeleteResponsibility(
                              item.id
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* SKILLS */}

              <div className="role-section">

                <h3>
                  Skills
                </h3>

                <div className="role-add-row">

                  <input
                    value={newSkill}
                    onChange={(event) =>
                      setNewSkill(
                        event.target.value
                      )
                    }
                    placeholder="Add skill..."
                  />

                  <button
                    onClick={
                      handleAddSkill
                    }
                  >
                    Add
                  </button>

                </div>


                <div className="role-items">

                  {skills.map(
                    (item) => (

                      <div
                        className="role-item"
                        key={item.id}
                      >

                        <input
                          defaultValue={
                            item.skill
                          }
                          onBlur={(event) =>
                            handleUpdateSkill(
                              item,
                              event.target.value
                            )
                          }
                        />

                        <button
                          onClick={() =>
                            handleDeleteSkill(
                              item.id
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            </>

          )}

        </div>

      </div>


      {/* ROLE FORM MODAL */}

      {showForm && (

        <div className="roles-modal-overlay">

          <div className="roles-modal">

            <div className="roles-modal-header">

              <h2>

                {editingRole
                  ? "Edit Role"
                  : "Add Role"}

              </h2>

              <button
                onClick={closeForm}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
            >

              <div className="roles-form-grid">

                <div className="roles-form-group">

                  <label>
                    Position
                  </label>

                  <input
                    name="position"
                    value={
                      formData.position
                    }
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="roles-form-group">

                  <label>
                    Company
                  </label>

                  <input
                    name="company"
                    value={
                      formData.company
                    }
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="roles-form-group">

                  <label>
                    Location
                  </label>

                  <input
                    name="location"
                    value={
                      formData.location ?? ""
                    }
                    onChange={handleChange}
                  />

                </div>


                <div className="roles-form-group">

                  <label>
                    Duration
                  </label>

                  <input
                    name="duration"
                    value={
                      formData.duration ?? ""
                    }
                    onChange={handleChange}
                  />

                </div>


                <div className="roles-form-group">

                  <label>
                    Employment Type
                  </label>

                  <input
                    name="employment_type"
                    value={
                      formData.employment_type ??
                      ""
                    }
                    onChange={handleChange}
                  />

                </div>


                <div className="roles-form-group">

                  <label>
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="display_order"
                    value={
                      formData.display_order
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="roles-form-group">

                <label>
                  Company Logo URL
                </label>

                <input
                  name="company_logo"
                  value={
                    formData.company_logo ??
                    ""
                  }
                  onChange={handleChange}
                />

              </div>


              <div className="roles-form-group">

                <label>
                  Short Description
                </label>

                <textarea
                  name="short_description"
                  value={
                    formData.short_description ??
                    ""
                  }
                  onChange={handleChange}
                  rows={4}
                />

              </div>


              <div className="roles-checkboxes">

                <label>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={handleChange}
                  />

                  Featured

                </label>


                <label>

                  <input
                    type="checkbox"
                    name="is_published"
                    checked={
                      formData.is_published
                    }
                    onChange={handleChange}
                  />

                  Published

                </label>

              </div>


              <div className="roles-modal-actions">

                <button
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="roles-primary-button"
                >
                  {editingRole
                    ? "Update Role"
                    : "Create Role"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}