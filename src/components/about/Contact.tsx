import "./About.css";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";

import { createContactMessage } from "../../services/contact.service";
import { useSettings } from "../../contexts/SettingsContext";

export default function Contact() {
  const { settings } = useSettings();

  const form = useRef<HTMLFormElement>(null);

  const [sending, setSending] = useState(false);

  const sendEmail = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.current) return;

    setSending(true);

    try {
      const formData = new FormData(form.current);

      const full_name = String(
        formData.get("name") ?? ""
      );

      const email = String(
        formData.get("email") ?? ""
      );

      const subject = String(
        formData.get("subject") ?? ""
      );

      const message = String(
        formData.get("message") ?? ""
      );

      await createContactMessage({
        full_name,
        email,
        subject,
        message,
      });

      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success(
        "Message sent successfully! I'll get back to you soon."
      );

      form.current.reset();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="contact-section"
    >
      <div className="contact-title">
        <h1>Get In Touch</h1>

        <p>
          Have an opportunity, collaboration,
          or just want to say hello?
          I'd love to hear from you.
        </p>
      </div>

      <form
        ref={form}
        onSubmit={sendEmail}
        className="contact-card"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
        />

        <textarea
          name="subject"
          placeholder="Subject"
          rows={5}
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          required
        />

        <button
          type="submit"
          className="contact-button"
          disabled={sending}
        >
          <FaPaperPlane />

          {sending
            ? "Sending..."
            : "Send Message"}
        </button>
      </form>

      <div className="contact-links">
        <a
          href={settings?.github_url ?? "#"}
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
          GitHub
        </a>

        <a
          href={settings?.linkedin_url ?? "#"}
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
          LinkedIn
        </a>

        <a
          href={`mailto:${settings?.email ?? ""}`}
        >
          <FaEnvelope />
          Email
        </a>
      </div>
    </section>
  );
}