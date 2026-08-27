import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/auth.service";

import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const error = await login(
      email,
      password
    );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/admin");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: 400,
          background: "#fff",
          padding: 40,
          borderRadius: 18,
          boxShadow:
            "0 20px 60px rgba(0,0,0,.12)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h1
          style={{
            margin: 0,
            textAlign: "center",
          }}
        >
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={{
            padding: 14,
            borderRadius: 10,
            border:
              "1px solid #ddd",
            fontSize: 15,
          }}
        />

        <div
          style={{
            position: "relative",
          }}
        >
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",
              padding:
                "14px 45px 14px 14px",
              borderRadius: 10,
              border:
                "1px solid #ddd",
              fontSize: 15,
              boxSizing:
                "border-box",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform:
                "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666",
              fontSize: 18,
            }}
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 14,
            border: "none",
            borderRadius: 10,
            background:
              "#2563eb",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}