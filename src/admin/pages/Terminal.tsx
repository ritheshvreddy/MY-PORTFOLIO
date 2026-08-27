import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  createTerminalCommand,
  deleteTerminalCommand,
  getAdminTerminalCommands,
  updateTerminalCommand,
} from "../../services/terminal.service";

import type {
  TerminalCommand,
} from "../../types/terminal";

import "./Terminal.css";


/* =========================================================
   FORM TYPE
========================================================= */

interface TerminalFormData {
  command: string;

  description: string;

  outputText: string;

  display_order: number;

  published: boolean;
}


/* =========================================================
   INITIAL DATA
========================================================= */

const initialFormData:
  TerminalFormData = {

  command:
    "",

  description:
    "",

  outputText:
    "",

  display_order:
    0,

  published:
    true,
};


/* =========================================================
   COMPONENT
========================================================= */

export default function Terminal() {

  /* =======================================================
     DATA
  ======================================================= */

  const [
    commands,
    setCommands,
  ] =
    useState<TerminalCommand[]>([]);


  /* =======================================================
     FORM
  ======================================================= */

  const [
    formData,
    setFormData,
  ] =
    useState<TerminalFormData>(
      initialFormData
    );


  const [
    editingCommand,
    setEditingCommand,
  ] =
    useState<TerminalCommand | null>(
      null
    );


  const [
    showForm,
    setShowForm,
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
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    processingId,
    setProcessingId,
  ] =
    useState<string | null>(
      null
    );


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


  /* =========================================================
     LOAD COMMANDS
  ========================================================= */

  async function loadCommands() {

    try {

      setLoading(true);

      setError("");

      const data =
        await getAdminTerminalCommands();

      setCommands(
        data
      );

    } catch (loadError) {

      console.error(
        "Error loading terminal commands:",
        loadError
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load terminal commands."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    void loadCommands();

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

      setFormData(
        (previous) => ({
          ...previous,

          [name]:
            (
              target as HTMLInputElement
            ).checked,
        })
      );


      return;

    }


    setFormData(
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
     OPEN CREATE
  ========================================================= */

  function handleCreate() {

    setEditingCommand(
      null
    );


    setFormData({

      command:
        "",

      description:
        "",

      outputText:
        "",

      display_order:
        commands.length,

      published:
        true,

    });


    setError("");

    setSuccess("");

    setShowForm(
      true
    );

  }


  /* =========================================================
     OPEN EDIT
  ========================================================= */

  function handleEdit(
    command: TerminalCommand
  ) {

    setEditingCommand(
      command
    );


    setFormData({

      command:
        command.command,

      description:
        command.description || "",

      outputText:
        command.output.join(
          "\n"
        ),

      display_order:
        command.display_order,

      published:
        command.published,

    });


    setError("");

    setSuccess("");

    setShowForm(
      true
    );

  }


  /* =========================================================
     CLOSE FORM
  ========================================================= */

  function closeForm() {

    if (saving) {
      return;
    }


    setShowForm(
      false
    );


    setEditingCommand(
      null
    );


    setFormData(
      initialFormData
    );

  }


  /* =========================================================
     SAVE COMMAND
  ========================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (
      !formData.command.trim()
    ) {

      setError(
        "Command is required."
      );

      return;

    }


    /*
      Each line in the textarea becomes
      one item in the output array.
    */

    const output =
      formData.outputText
        .split("\n")
        .map(
          (line) =>
            line.trimEnd()
        )
        .filter(
          (line) =>
            line.trim().length > 0
        );


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      if (
        editingCommand
      ) {

        const updated =
          await updateTerminalCommand(
            editingCommand.id,
            {

              command:
                formData.command.trim(),

              description:
                formData.description.trim() ||
                null,

              output,

              display_order:
                formData.display_order,

              published:
                formData.published,

            }
          );


        setCommands(
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
          "Terminal command updated successfully."
        );

      } else {

        const created =
          await createTerminalCommand({

            command:
              formData.command.trim(),

            description:
              formData.description.trim() ||
              null,

            output,

            display_order:
              formData.display_order,

            published:
              formData.published,

          });


        setCommands(
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
          "Terminal command created successfully."
        );

      }


      setShowForm(
        false
      );


      setEditingCommand(
        null
      );


      setFormData(
        initialFormData
      );

    } catch (saveError) {

      console.error(
        "Error saving terminal command:",
        saveError
      );


      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save terminal command."
      );

    } finally {

      setSaving(false);

    }

  }


  /* =========================================================
     DELETE COMMAND
  ========================================================= */

  async function handleDelete(
    command: TerminalCommand
  ) {

    const confirmed =
      window.confirm(
        `Delete "${command.command}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setProcessingId(
        command.id
      );

      setError("");

      setSuccess("");


      await deleteTerminalCommand(
        command.id
      );


      setCommands(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              command.id
          )
      );


      setSuccess(
        "Terminal command deleted successfully."
      );

    } catch (deleteError) {

      console.error(
        "Error deleting terminal command:",
        deleteError
      );


      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete terminal command."
      );

    } finally {

      setProcessingId(
        null
      );

    }

  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="admin-terminal-page">

        <div className="terminal-page-header">

          <div>

            <h1>
              Terminal
            </h1>

            <p>
              Loading terminal commands...
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

    <div className="admin-terminal-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="terminal-page-header">

        <div>

          <h1>
            Terminal
          </h1>

          <p>
            Create and manage the commands displayed on
            your portfolio terminal.
          </p>

        </div>


        <button
          type="button"
          className="terminal-primary-button"
          onClick={
            handleCreate
          }
        >
          + Add Command
        </button>

      </div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (

        <div className="terminal-error">
          {error}
        </div>

      )}


      {success && (

        <div className="terminal-success">
          {success}
        </div>

      )}


      {/* =====================================================
          EDITOR
      ===================================================== */}

      {showForm && (

        <section className="terminal-editor">


          <div className="terminal-editor-header">

            <div>

              <h2>

                {editingCommand
                  ? "Edit Command"
                  : "Add Command"}

              </h2>

              <p>
                Configure the command and its terminal output.
              </p>

            </div>


            <button
              type="button"
              className="terminal-close-button"
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
            className="terminal-form"
            onSubmit={
              handleSubmit
            }
          >


            {/* ===============================================
                COMMAND
            =============================================== */}

            <div className="terminal-form-group">

              <label>
                Command
              </label>

              <input
                type="text"
                name="command"
                value={
                  formData.command
                }
                onChange={
                  handleChange
                }
                placeholder="help"
                required
              />

              <span className="terminal-field-help">
                Example: about, projects, skills, contact
              </span>

            </div>


            {/* ===============================================
                DESCRIPTION
            =============================================== */}

            <div className="terminal-form-group">

              <label>
                Description
              </label>

              <input
                type="text"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Show information about me"
              />

            </div>


            {/* ===============================================
                OUTPUT
            =============================================== */}

            <div className="terminal-form-group">

              <label>
                Terminal Output
              </label>

              <span className="terminal-field-help">
                Enter each output line on a separate line.
              </span>


              <textarea
                name="outputText"
                value={
                  formData.outputText
                }
                onChange={
                  handleChange
                }
                placeholder={
                  "Name: Rithesh V Reddy\nRole: Product Associate\nLocation: India"
                }
                rows={10}
              />

            </div>


            {/* ===============================================
                ORDER
            =============================================== */}

            <div className="terminal-form-row">

              <div className="terminal-form-group">

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


              <label className="terminal-checkbox">

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

                Published

              </label>

            </div>


            {/* ===============================================
                ACTIONS
            =============================================== */}

            <div className="terminal-form-actions">

              <button
                type="button"
                className="terminal-secondary-button"
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
                className="terminal-primary-button"
                disabled={
                  saving
                }
              >

                {saving
                  ? "Saving..."
                  : editingCommand
                    ? "Update Command"
                    : "Create Command"}

              </button>

            </div>

          </form>

        </section>

      )}


      {/* =====================================================
          COMMAND LIST
      ===================================================== */}

      <section className="terminal-panel">


        <div className="terminal-panel-header">

          <div>

            <h2>
              Commands
            </h2>

            <p>
              {commands.length} command
              {commands.length === 1
                ? ""
                : "s"} configured.
            </p>

          </div>

        </div>


        {commands.length === 0 ? (

          <div className="terminal-empty">

            <div className="terminal-empty-icon">
              &gt;_
            </div>

            <h3>
              No terminal commands
            </h3>

            <p>
              Add your first command to populate the
              portfolio terminal.
            </p>

          </div>

        ) : (

          <div className="terminal-command-list">

            {commands.map(
              (command) => (

                <article
                  key={
                    command.id
                  }
                  className="terminal-command-card"
                >


                  {/* =========================================
                      COMMAND HEADER
                  ========================================= */}

                  <div className="terminal-command-header">

                    <div className="terminal-command-title">

                      <span className="terminal-prompt">
                        $
                      </span>

                      <code>
                        {command.command}
                      </code>

                    </div>


                    <div className="terminal-command-status">

                      {command.published ? (

                        <span className="terminal-status published">
                          Published
                        </span>

                      ) : (

                        <span className="terminal-status draft">
                          Draft
                        </span>

                      )}

                    </div>

                  </div>


                  {/* =========================================
                      DESCRIPTION
                  ========================================= */}

                  {command.description && (

                    <p className="terminal-command-description">

                      {command.description}

                    </p>

                  )}


                  {/* =========================================
                      OUTPUT PREVIEW
                  ========================================= */}

                  {command.output.length > 0 && (

                    <div className="terminal-output-preview">

                      {command.output
                        .slice(0, 6)
                        .map(
                          (
                            line,
                            index
                          ) => (

                            <div
                              key={
                                `${command.id}-${index}`
                              }
                            >
                              {line}
                            </div>

                          )
                        )}


                      {command.output.length > 6 && (

                        <div className="terminal-more-lines">

                          +{" "}
                          {command.output.length - 6}
                          {" "}
                          more lines

                        </div>

                      )}

                    </div>

                  )}


                  {/* =========================================
                      META
                  ========================================= */}

                  <div className="terminal-command-meta">

                    <span>
                      Order:
                      {" "}
                      {command.display_order}
                    </span>

                    <span>
                      {command.output.length}
                      {" "}
                      output line
                      {command.output.length === 1
                        ? ""
                        : "s"}
                    </span>

                  </div>


                  {/* =========================================
                      ACTIONS
                  ========================================= */}

                  <div className="terminal-command-actions">

                    <button
                      type="button"
                      className="terminal-secondary-button"
                      onClick={() =>
                        handleEdit(
                          command
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="terminal-danger-button"
                      disabled={
                        processingId ===
                        command.id
                      }
                      onClick={() =>
                        void handleDelete(
                          command
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </div>

  );
}