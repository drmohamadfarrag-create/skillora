import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  if (!API) {
    throw new Error("VITE_API_URL is not configured");
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage(
        data.verificationRequired
          ? "Account created. Please verify your email."
          : "Account created successfully."
      );
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      setMessage(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      localStorage.setItem("skillora_access", data.accessToken);
      localStorage.setItem("skillora_refresh", data.refreshToken);

      setMessage(`Welcome ${data.user?.name || ""}! Login successful.`);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>SKILLORA</h1>
        <p>Learn it. Use it. Own it.</p>
      </header>

      <section className="card">
        <h2>Create your account</h2>

        <form onSubmit={register}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password (8+ characters)"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <hr />

        <h2>Sign in</h2>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);