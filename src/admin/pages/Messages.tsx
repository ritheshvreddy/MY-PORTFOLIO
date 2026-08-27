import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteContactMessage,
  getContactMessages,
  markMessageAsRead,
  markMessageAsReplied,
} from "../../services/contact.service";

import type {
  ContactMessage,
} from "../../types/contact";

import "./Messages.css";


/* =========================================================
   FILTER TYPE
========================================================= */

type MessageFilter =
  | "all"
  | "unread"
  | "replied";


/* =========================================================
   COMPONENT
========================================================= */

export default function Messages() {

  /* =======================================================
     DATA
  ======================================================= */

  const [
    messages,
    setMessages,
  ] =
    useState<ContactMessage[]>([]);


  /* =======================================================
     UI STATE
  ======================================================= */

  const [
    loading,
    setLoading,
  ] =
    useState(true);


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


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    filter,
    setFilter,
  ] =
    useState<MessageFilter>(
      "all"
    );


  const [
    selectedMessage,
    setSelectedMessage,
  ] =
    useState<ContactMessage | null>(
      null
    );


  const [
    processingId,
    setProcessingId,
  ] =
    useState<string | null>(
      null
    );


  /* =========================================================
     LOAD MESSAGES
  ========================================================= */

  async function loadMessages() {

    try {

      setLoading(true);

      setError("");

      const data =
        await getContactMessages();

      setMessages(data);

    } catch (loadError) {

      console.error(
        "Error loading messages:",
        loadError
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load messages."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    void loadMessages();

  }, []);


  /* =========================================================
     COUNTS
  ========================================================= */

  const unreadCount =
    useMemo(
      () =>
        messages.filter(
          (message) =>
            !message.is_read
        ).length,
      [messages]
    );


  const repliedCount =
    useMemo(
      () =>
        messages.filter(
          (message) =>
            message.replied
        ).length,
      [messages]
    );


  /* =========================================================
     FILTERED MESSAGES
  ========================================================= */

  const filteredMessages =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      return messages.filter(
        (message) => {

          /* ===============================================
             FILTER
          =============================================== */

          if (
            filter === "unread" &&
            message.is_read
          ) {

            return false;

          }


          if (
            filter === "replied" &&
            !message.replied
          ) {

            return false;

          }


          /* ===============================================
             SEARCH
          =============================================== */

          if (!searchValue) {

            return true;

          }


          return (
            message.full_name
              .toLowerCase()
              .includes(searchValue)

            ||

            message.email
              .toLowerCase()
              .includes(searchValue)

            ||

            message.subject
              .toLowerCase()
              .includes(searchValue)

            ||

            message.message
              .toLowerCase()
              .includes(searchValue)
          );

        }
      );

    }, [
      messages,
      search,
      filter,
    ]);


  /* =========================================================
     OPEN MESSAGE
  ========================================================= */

  async function handleOpenMessage(
    message: ContactMessage
  ) {

    setSelectedMessage(
      message
    );


    if (
      message.is_read
    ) {

      return;

    }


    try {

      setProcessingId(
        message.id
      );

      setError("");


      await markMessageAsRead(
        message.id
      );


      setMessages(
        (previous) =>
          previous.map(
            (item) =>
              item.id === message.id
                ? {
                    ...item,
                    is_read: true,
                  }
                : item
          )
      );


      setSelectedMessage(
        (previous) =>
          previous
            ? {
                ...previous,
                is_read: true,
              }
            : previous
      );

    } catch (readError) {

      console.error(
        "Error marking message as read:",
        readError
      );

      setError(
        readError instanceof Error
          ? readError.message
          : "Unable to mark message as read."
      );

    } finally {

      setProcessingId(
        null
      );

    }
  }


  /* =========================================================
     MARK READ
  ========================================================= */

  async function handleMarkRead(
    message: ContactMessage
  ) {

    if (
      message.is_read
    ) {

      return;

    }


    try {

      setProcessingId(
        message.id
      );

      setError("");
      setSuccess("");


      await markMessageAsRead(
        message.id
      );


      setMessages(
        (previous) =>
          previous.map(
            (item) =>
              item.id === message.id
                ? {
                    ...item,
                    is_read: true,
                  }
                : item
          )
      );


      if (
        selectedMessage?.id ===
        message.id
      ) {

        setSelectedMessage(
          (previous) =>
            previous
              ? {
                  ...previous,
                  is_read: true,
                }
              : previous
        );

      }


      setSuccess(
        "Message marked as read."
      );

    } catch (readError) {

      console.error(
        "Error marking message as read:",
        readError
      );

      setError(
        readError instanceof Error
          ? readError.message
          : "Unable to mark message as read."
      );

    } finally {

      setProcessingId(
        null
      );

    }
  }


  /* =========================================================
     MARK REPLIED
  ========================================================= */

  async function handleMarkReplied(
    message: ContactMessage
  ) {

    if (
      message.replied
    ) {

      return;

    }


    try {

      setProcessingId(
        message.id
      );

      setError("");
      setSuccess("");


      await markMessageAsReplied(
        message.id
      );


      setMessages(
        (previous) =>
          previous.map(
            (item) =>
              item.id === message.id
                ? {
                    ...item,
                    replied: true,
                  }
                : item
          )
      );


      if (
        selectedMessage?.id ===
        message.id
      ) {

        setSelectedMessage(
          (previous) =>
            previous
              ? {
                  ...previous,
                  replied: true,
                }
              : previous
        );

      }


      setSuccess(
        "Message marked as replied."
      );

    } catch (replyError) {

      console.error(
        "Error marking message as replied:",
        replyError
      );

      setError(
        replyError instanceof Error
          ? replyError.message
          : "Unable to mark message as replied."
      );

    } finally {

      setProcessingId(
        null
      );

    }
  }


  /* =========================================================
     DELETE MESSAGE
  ========================================================= */

  async function handleDelete(
    message: ContactMessage
  ) {

    const confirmed =
      window.confirm(
        `Delete the message from "${message.full_name}"?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setProcessingId(
        message.id
      );

      setError("");
      setSuccess("");


      await deleteContactMessage(
        message.id
      );


      setMessages(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== message.id
          )
      );


      if (
        selectedMessage?.id ===
        message.id
      ) {

        setSelectedMessage(
          null
        );

      }


      setSuccess(
        "Message deleted successfully."
      );

    } catch (deleteError) {

      console.error(
        "Error deleting message:",
        deleteError
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete message."
      );

    } finally {

      setProcessingId(
        null
      );

    }
  }


  /* =========================================================
     FORMAT DATE
  ========================================================= */

  function formatDate(
    value: string
  ) {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);

  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="admin-messages-page">

        <div className="messages-page-header">

          <div>

            <h1>
              Messages
            </h1>

            <p>
              Loading contact messages...
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

    <div className="admin-messages-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="messages-page-header">

        <div>

          <h1>
            Messages
          </h1>

          <p>
            View and manage messages submitted through
            your portfolio contact form.
          </p>

        </div>

      </div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (

        <div className="messages-error">

          {error}

        </div>

      )}


      {success && (

        <div className="messages-success">

          {success}

        </div>

      )}


      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="messages-stats">


        <div className="message-stat-card">

          <span className="message-stat-label">
            Total Messages
          </span>

          <strong>
            {messages.length}
          </strong>

        </div>


        <div className="message-stat-card">

          <span className="message-stat-label">
            Unread
          </span>

          <strong className="unread-count">
            {unreadCount}
          </strong>

        </div>


        <div className="message-stat-card">

          <span className="message-stat-label">
            Replied
          </span>

          <strong className="replied-count">
            {repliedCount}
          </strong>

        </div>


      </div>


      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <section className="messages-panel">


        <div className="messages-toolbar">


          {/* SEARCH */}

          <div className="messages-search">

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search name, email, subject or message..."
            />

          </div>


          {/* FILTERS */}

          <div className="messages-filters">

            <button
              type="button"
              className={
                filter === "all"
                  ? "message-filter active"
                  : "message-filter"
              }
              onClick={() =>
                setFilter("all")
              }
            >
              All
              <span>
                {messages.length}
              </span>
            </button>


            <button
              type="button"
              className={
                filter === "unread"
                  ? "message-filter active"
                  : "message-filter"
              }
              onClick={() =>
                setFilter("unread")
              }
            >
              Unread
              <span>
                {unreadCount}
              </span>
            </button>


            <button
              type="button"
              className={
                filter === "replied"
                  ? "message-filter active"
                  : "message-filter"
              }
              onClick={() =>
                setFilter("replied")
              }
            >
              Replied
              <span>
                {repliedCount}
              </span>
            </button>

          </div>

        </div>


        {/* ===================================================
            MESSAGE LIST
        =================================================== */}

        {filteredMessages.length === 0 ? (

          <div className="messages-empty">

            <div className="messages-empty-icon">
              ✉
            </div>

            <h2>
              {search || filter !== "all"
                ? "No matching messages"
                : "No messages yet"}
            </h2>

            <p>

              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "Messages submitted through your contact form will appear here."}

            </p>

          </div>

        ) : (

          <div className="messages-list">

            {filteredMessages.map(
              (message) => (

                <article
                  key={
                    message.id
                  }
                  className={
                    message.is_read
                      ? "message-card"
                      : "message-card unread"
                  }
                  onClick={() =>
                    void handleOpenMessage(
                      message
                    )
                  }
                >


                  {/* =========================================
                      UNREAD INDICATOR
                  ========================================= */}

                  {!message.is_read && (

                    <span className="message-unread-dot" />

                  )}


                  {/* =========================================
                      MAIN
                  ========================================= */}

                  <div className="message-card-main">


                    <div className="message-card-top">

                      <div className="message-sender">

                        <h2>
                          {message.full_name}
                        </h2>

                        <a
                          href={
                            `mailto:${message.email}`
                          }
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          {message.email}
                        </a>

                      </div>


                      <time>
                        {formatDate(
                          message.created_at
                        )}
                      </time>

                    </div>


                    <div className="message-subject">

                      {message.subject}

                    </div>


                    <p className="message-preview">

                      {message.message}

                    </p>


                    {/* =======================================
                        BADGES
                    ======================================= */}

                    <div className="message-badges">

                      <span
                        className={
                          message.is_read
                            ? "message-badge read"
                            : "message-badge unread-badge"
                        }
                      >
                        {message.is_read
                          ? "Read"
                          : "Unread"}
                      </span>


                      {message.replied && (

                        <span className="message-badge replied">
                          Replied
                        </span>

                      )}

                    </div>

                  </div>


                  {/* =========================================
                      ACTIONS
                  ========================================= */}

                  <div
                    className="message-card-actions"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >


                    {!message.is_read && (

                      <button
                        type="button"
                        className="message-action-button"
                        disabled={
                          processingId ===
                          message.id
                        }
                        onClick={() =>
                          void handleMarkRead(
                            message
                          )
                        }
                      >
                        Mark Read
                      </button>

                    )}


                    {!message.replied && (

                      <button
                        type="button"
                        className="message-action-button"
                        disabled={
                          processingId ===
                          message.id
                        }
                        onClick={() =>
                          void handleMarkReplied(
                            message
                          )
                        }
                      >
                        Replied
                      </button>

                    )}


                    <button
                      type="button"
                      className="message-delete-button"
                      disabled={
                        processingId ===
                        message.id
                      }
                      onClick={() =>
                        void handleDelete(
                          message
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


      {/* =====================================================
          MESSAGE VIEWER
      ===================================================== */}

      {selectedMessage && (

        <div
          className="message-modal-overlay"
          onClick={() =>
            setSelectedMessage(
              null
            )
          }
        >

          <div
            className="message-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* ===============================================
                MODAL HEADER
            =============================================== */}

            <div className="message-modal-header">

              <div>

                <span className="message-modal-label">
                  Contact Message
                </span>

                <h2>
                  {selectedMessage.subject}
                </h2>

              </div>


              <button
                type="button"
                className="message-modal-close"
                onClick={() =>
                  setSelectedMessage(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            {/* ===============================================
                SENDER
            =============================================== */}

            <div className="message-modal-sender">

              <div>

                <span>
                  From
                </span>

                <strong>
                  {selectedMessage.full_name}
                </strong>

              </div>


              <div>

                <span>
                  Email
                </span>

                <a
                  href={
                    `mailto:${selectedMessage.email}`
                  }
                >
                  {selectedMessage.email}
                </a>

              </div>


              <div>

                <span>
                  Received
                </span>

                <strong>
                  {formatDate(
                    selectedMessage.created_at
                  )}
                </strong>

              </div>

            </div>


            {/* ===============================================
                STATUS
            =============================================== */}

            <div className="message-modal-status">

              <span
                className={
                  selectedMessage.is_read
                    ? "message-badge read"
                    : "message-badge unread-badge"
                }
              >
                {selectedMessage.is_read
                  ? "Read"
                  : "Unread"}
              </span>


              {selectedMessage.replied && (

                <span className="message-badge replied">
                  Replied
                </span>

              )}

            </div>


            {/* ===============================================
                MESSAGE BODY
            =============================================== */}

            <div className="message-modal-body">

              <p>
                {selectedMessage.message}
              </p>

            </div>


            {/* ===============================================
                ACTIONS
            =============================================== */}

            <div className="message-modal-actions">


              <a
                href={
                  `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`
                }
                className="message-reply-button"
              >
                Reply via Email
              </a>


              {!selectedMessage.is_read && (

                <button
                  type="button"
                  className="message-action-button"
                  disabled={
                    processingId ===
                    selectedMessage.id
                  }
                  onClick={() =>
                    void handleMarkRead(
                      selectedMessage
                    )
                  }
                >
                  Mark Read
                </button>

              )}


              {!selectedMessage.replied && (

                <button
                  type="button"
                  className="message-action-button"
                  disabled={
                    processingId ===
                    selectedMessage.id
                  }
                  onClick={() =>
                    void handleMarkReplied(
                      selectedMessage
                    )
                  }
                >
                  Mark Replied
                </button>

              )}


              <button
                type="button"
                className="message-delete-button"
                disabled={
                  processingId ===
                  selectedMessage.id
                }
                onClick={() =>
                  void handleDelete(
                    selectedMessage
                  )
                }
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}