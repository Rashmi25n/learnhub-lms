"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Demo login
   const existingUser = localStorage.getItem("learnhubUser");

let user = {
  name: email.split("@")[0],
  email: email,
};

if (existingUser) {
  try {
    const parsedUser = JSON.parse(existingUser);

    if (typeof parsedUser === "object" && parsedUser !== null) {
      user = {
        name: parsedUser.name || email.split("@")[0],
        email: parsedUser.email || email,
      };
    }
  } catch {
    // Old format contained only the email
    user = {
      name: email.split("@")[0],
      email: email,
    };
  }
}

localStorage.setItem("learnhubUser", JSON.stringify(user));

router.push("/courses");

    router.push("/courses");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Learn<span className="text-cyan-400">Hub</span>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            ← Home
          </Link>
        </div>
      </nav>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl md:grid-cols-2">

          {/* Left Side */}
          <div className="hidden flex-col justify-center bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-500/10 p-12 md:flex">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl">
              🚀
            </div>

            <p className="font-bold tracking-[0.25em] text-cyan-400">
              WELCOME BACK
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight">
              Continue Your
              <span className="block text-cyan-400">
                Learning Journey.
              </span>
            </h1>

            <p className="mt-6 max-w-md leading-7 text-slate-400">
              Sign in to access your courses, continue your lessons,
              take quizzes and earn professional certificates.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-bold">Learn at your pace</p>
                  <p className="text-sm text-slate-500">
                    Continue where you left off.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-2xl">🧠</span>
                <div>
                  <p className="font-bold">Test your knowledge</p>
                  <p className="text-sm text-slate-500">
                    Complete interactive quizzes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-bold">Earn certificates</p>
                  <p className="text-sm text-slate-500">
                    Showcase your achievements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="p-7 sm:p-10 md:p-12">
            <div className="mx-auto max-w-md">

              {/* Mobile Logo */}
              <div className="mb-8 text-center md:hidden">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                  🚀
                </div>

                <h1 className="mt-4 text-2xl font-black">
                  Learn<span className="text-cyan-400">Hub</span>
                </h1>
              </div>

              <div>
                <p className="text-sm font-bold tracking-widest text-cyan-400">
                  ACCOUNT LOGIN
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Welcome Back 👋
                </h2>

                <p className="mt-3 text-slate-400">
                  Login to continue your LearnHub journey.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ⚠️ {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email Address
                  </label>

                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 transition focus-within:border-cyan-400">
                    <span className="pl-4 text-lg">
                      ✉️
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-300">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                      onClick={() =>
                        alert("Password reset feature coming soon.")
                      }
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 transition focus-within:border-cyan-400">
                    <span className="pl-4 text-lg">
                      🔒
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-slate-600"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="pr-4 text-lg text-slate-400 hover:text-cyan-400"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-3">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 accent-cyan-400"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-400"
                  >
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  Login to LearnHub →
                </button>
              </form>

              {/* Register */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-600">
                  OR
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <p className="text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Create Account
                </Link>
              </p>

              {/* Security */}
              <div className="mt-8 rounded-xl border border-green-400/10 bg-green-400/5 p-4 text-center">
                <p className="text-xs text-green-300">
                  🔐 Your learning journey is secure with LearnHub.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center">
        <p className="font-semibold text-cyan-400">
          LEARNHUB LMS
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Learn. Grow. Succeed.
        </p>
      </footer>
    </main>
  );
}