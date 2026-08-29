"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Save basic user information for the frontend demo.
    localStorage.setItem(
      "learnhubUser",
      JSON.stringify({
        name: fullName.trim(),
        email: email.trim(),
      })
    );

    setSuccess("Account created successfully! Redirecting to login...");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ================= BACKGROUND EFFECTS ================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

      </div>

      {/* ================= NAVBAR ================= */}

      <nav className="relative z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Learn<span className="text-cyan-400">Hub</span>
          </a>

          <a
            href="/login"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400"
          >
            Already have an account?
          </a>

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <section className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-5 py-12">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-cyan-950/20 lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-600/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">

            {/* Decorative circles */}

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-cyan-400/10" />

            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full border border-blue-400/10" />

            <div className="relative">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                ✨ Start Your Journey
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight xl:text-6xl">

                Learn.
                <br />

                <span className="text-cyan-400">
                  Grow.
                </span>

                <br />

                Succeed.

              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
                Create your LearnHub account and unlock a world of
                practical courses, interactive quizzes and professional
                certificates.
              </p>

            </div>

            {/* Features */}

            <div className="relative mt-12 space-y-4">

              <Feature
                icon="📚"
                title="Learn at Your Pace"
                description="Access structured lessons and practical content."
              />

              <Feature
                icon="🧠"
                title="Test Your Knowledge"
                description="Take interactive quizzes and track your progress."
              />

              <Feature
                icon="🏆"
                title="Earn Certificates"
                description="Complete courses and showcase your achievements."
              />

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="bg-slate-900/70 p-6 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Heading */}

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl shadow-lg shadow-cyan-500/10">
                  🚀
                </div>

                <h2 className="mt-6 text-3xl font-black md:text-4xl">
                  Create Your Account
                </h2>

                <p className="mt-3 text-slate-400">
                  Join LearnHub and start your learning journey.
                </p>

              </div>

              {/* ================= FORM ================= */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* FULL NAME */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Full Name
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      👤
                    </span>

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email Address
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      ✉️
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔒
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3.5 pl-12 pr-14 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition hover:text-cyan-400"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>

                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Password must contain at least 6 characters.
                  </p>

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔐
                    </span>

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3.5 pl-12 pr-14 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition hover:text-cyan-400"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>

                  </div>

                </div>

                {/* ERROR */}

                {error && (

                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                    ⚠️ {error}
                  </div>

                )}

                {/* SUCCESS */}

                {success && (

                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400">
                    ✓ {success}
                  </div>

                )}

                {/* TERMS */}

                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">

                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 accent-cyan-400"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-slate-500"
                  >
                    I agree to the LearnHub terms and understand
                    that my account will be used to track my
                    learning progress and certificates.
                  </label>

                </div>

                {/* CREATE ACCOUNT */}

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-xl bg-cyan-400 py-4 font-black text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-300 hover:shadow-cyan-500/20"
                >

                  <span className="relative z-10">
                    Create Account
                    <span className="ml-2 transition group-hover:ml-3">
                      →
                    </span>
                  </span>

                </button>

              </form>

              {/* LOGIN */}

              <div className="mt-7 text-center">

                <p className="text-sm text-slate-500">
                  Already have an account?{" "}

                  <a
                    href="/login"
                    className="font-bold text-cyan-400 transition hover:text-cyan-300"
                  >
                    Login
                  </a>

                </p>

              </div>

              {/* BOTTOM FEATURES */}

              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/5 pt-7">

                <MiniFeature
                  icon="📚"
                  text="Courses"
                />

                <MiniFeature
                  icon="🧠"
                  text="Quizzes"
                />

                <MiniFeature
                  icon="🏆"
                  text="Certificates"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center">

        <p className="text-sm text-slate-600">
          © 2026 LearnHub LMS • Learn. Grow. Succeed.
        </p>

      </footer>

    </main>
  );
}


/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-cyan-400/20 hover:bg-cyan-400/5">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
        {icon}
      </div>

      <div>

        <h3 className="font-bold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   MINI FEATURE
========================================================= */

function MiniFeature({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3 text-center">

      <div className="text-xl">
        {icon}
      </div>

      <p className="mt-1 text-xs font-semibold text-slate-500">
        {text}
      </p>

    </div>
  );
}