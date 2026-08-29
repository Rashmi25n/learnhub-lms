"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
};

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("learnhubUser");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser && parsedUser.name && parsedUser.email) {
          setUser(parsedUser);
        }
      } catch {
        // If old login data is only an email
        setUser({
          name: savedUser.split("@")[0],
          email: savedUser,
        });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("learnhubUser");

    setUser(null);
    setProfileOpen(false);

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-6 py-5 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LOGO */}

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Learn<span className="text-cyan-400">Hub</span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden items-center gap-7 md:flex">

            <Link
              href="/"
              className="font-semibold text-cyan-400"
            >
              Home
            </Link>

            <Link
              href="/courses"
              className="font-semibold text-slate-300 transition hover:text-cyan-400"
            >
              Courses
            </Link>

            <Link
              href="/courses#about"
              className="font-semibold text-slate-300 transition hover:text-cyan-400"
            >
              About
            </Link>

            {/* ================= LOGGED IN ================= */}

            {user ? (

              <div className="relative">

                {/* PROFILE BUTTON */}

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-cyan-400/50 hover:bg-cyan-400/10"
                >

                  {/* PROFILE ICON */}

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-black text-slate-950">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* USERNAME */}

                  <div className="hidden text-left lg:block">

                    <p className="max-w-[120px] truncate text-sm font-bold text-white">
                      {user.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Student
                    </p>

                  </div>

                  <span
                    className={`text-xs transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>

                </button>

                {/* ================= PROFILE DROPDOWN ================= */}

                {profileOpen && (

                  <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">

                    {/* USER HEADER */}

                    <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-black text-slate-950">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-lg font-black text-white">
                            {user.name}
                          </h3>

                          <p className="truncate text-sm text-slate-400">
                            {user.email}
                          </p>

                          <span className="mt-1 inline-block rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-semibold text-cyan-400">
                            Student
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* PROFILE OPTIONS */}

                    <div className="p-2">

                      {/* MY PROFILE */}

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/profile");
                        }}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
                      >

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                          👤
                        </span>

                        <div>
                          <p className="font-bold text-white">
                            My Profile
                          </p>

                          <p className="text-xs text-slate-500">
                            View your account
                          </p>
                        </div>

                      </button>

                      {/* MY COURSES */}

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/courses");
                        }}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
                      >

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-xl">
                          📚
                        </span>

                        <div>
                          <p className="font-bold text-white">
                            My Courses
                          </p>

                          <p className="text-xs text-slate-500">
                            Continue learning
                          </p>
                        </div>

                      </button>

                      {/* CERTIFICATES */}

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push(
                            "/certificate/python-programming"
                          );
                        }}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
                      >

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-xl">
                          🏆
                        </span>

                        <div>
                          <p className="font-bold text-white">
                            My Certificates
                          </p>

                          <p className="text-xs text-slate-500">
                            View your achievements
                          </p>
                        </div>

                      </button>

                      {/* DIVIDER */}

                      <div className="my-2 border-t border-white/10" />

                      {/* LOGOUT */}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-red-500/10"
                      >

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-xl">
                          🚪
                        </span>

                        <div>
                          <p className="font-bold text-red-400">
                            Logout
                          </p>

                          <p className="text-xs text-slate-500">
                            Sign out of LearnHub
                          </p>
                        </div>

                      </button>

                    </div>

                  </div>

                )}

              </div>

            ) : (

              /* ================= LOGGED OUT ================= */

              <>
                <Link
                  href="/login"
                  className="font-semibold text-slate-300 transition hover:text-cyan-400"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-cyan-400 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Get Started
                </Link>
              </>

            )}

          </div>

          {/* MOBILE */}

          <div className="flex items-center gap-3 md:hidden">

            {user ? (

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-black text-slate-950"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

            ) : (

              <Link
                href="/login"
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-bold text-slate-950"
              >
                Login
              </Link>

            )}

          </div>

        </div>

        {/* MOBILE PROFILE DROPDOWN */}

        {user && profileOpen && (

          <div className="mx-auto mt-4 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-4 md:hidden">

            <div className="flex items-center gap-4 border-b border-white/10 pb-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-black text-slate-950">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>

                <p className="font-black">
                  {user.name}
                </p>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>

              </div>

            </div>

            <div className="mt-3 space-y-1">

              <button
                onClick={() => router.push("/profile")}
                className="w-full rounded-xl px-4 py-3 text-left font-semibold transition hover:bg-white/5"
              >
                👤 My Profile
              </button>

              <button
                onClick={() => router.push("/courses")}
                className="w-full rounded-xl px-4 py-3 text-left font-semibold transition hover:bg-white/5"
              >
                📚 My Courses
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/certificate/python-programming"
                  )
                }
                className="w-full rounded-xl px-4 py-3 text-left font-semibold transition hover:bg-white/5"
              >
                🏆 My Certificates
              </button>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-4 py-3 text-left font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                🚪 Logout
              </button>

            </div>

          </div>

        )}

      </nav>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">

        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          <p className="font-bold tracking-[0.25em] text-cyan-400">
            LEARN • BUILD • CERTIFY
          </p>

          <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
            Upgrade Your Skills.
            <br />
            <span className="text-cyan-400">
              Build Your Future.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            Explore industry-focused courses, gain practical
            knowledge, complete projects and earn certificates
            with LearnHub.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/courses"
              className="rounded-full bg-cyan-400 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore Courses 🚀
            </Link>

            {!user && (
              <Link
                href="/register"
                className="rounded-full border border-white/20 px-8 py-4 font-bold transition hover:bg-white/10"
              >
                Create Free Account
              </Link>
            )}

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4 md:px-10">

        {[
          ["15+", "Courses"],
          ["10K+", "Learners"],
          ["50+", "Projects"],
          ["100%", "Certificates"],
        ].map(([number, label]) => (

          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
          >

            <h2 className="text-3xl font-black text-cyan-400">
              {number}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {label}
            </p>

          </div>

        ))}

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">

        <div className="text-center">

          <p className="font-bold tracking-widest text-cyan-400">
            HOW LEARNHUB WORKS
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Start Your Learning Journey
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Follow three simple steps to start learning,
            complete your course and earn your certificate.
          </p>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <Step
            number="1"
            title="Create Account"
            description="Register on LearnHub with your name, email and password."
            link="/register"
            linkText="Register Now →"
          />

          <Step
            number="2"
            title="Learn & Practice"
            description="Watch lessons, complete learning activities and build practical knowledge."
            link="/courses"
            linkText="Explore Courses →"
          />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-2 hover:border-cyan-400/50">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-2xl font-black text-slate-950">
              3
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Get Certified
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Complete your lessons, pass the quiz and unlock
              your professional certificate.
            </p>

            <span className="mt-6 inline-block font-semibold text-cyan-400">
              Your Career Starts Here →
            </span>

          </div>

        </div>

      </section>

      {/* ================= EXPLORE ================= */}

      <section className="bg-white/[0.02] px-6 py-24 md:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="font-bold tracking-widest text-cyan-400">
                WHAT YOU CAN LEARN
              </p>

              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Explore Your Interests
              </h2>

            </div>

            <Link
              href="/courses"
              className="font-semibold text-cyan-400"
            >
              View All Courses →
            </Link>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <CourseCard
              icon="🤖"
              title="Artificial Intelligence"
              description="AI • ML • NLP"
            />

            <CourseCard
              icon="🐍"
              title="Python Programming"
              description="Python • Projects • APIs"
            />

            <CourseCard
              icon="📊"
              title="Data Analytics"
              description="SQL • Python • Power BI"
            />

          </div>

        </div>

      </section>

      {/* ================= CERTIFICATION CTA ================= */}

      <section className="px-6 py-24 md:px-10">

        <div className="mx-auto max-w-6xl rounded-3xl bg-cyan-400 p-10 text-center text-slate-950 md:p-16">

          <div className="text-6xl">
            🏆
          </div>

          <h2 className="mt-6 text-4xl font-black md:text-5xl">
            Learn Today. Get Certified Tomorrow.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-800">
            Complete your course, pass the assessment and earn
            a professional certificate that showcases your new skills.
          </p>

          <Link
            href={user ? "/courses" : "/register"}
            className="mt-8 inline-block rounded-full bg-slate-950 px-8 py-4 font-bold text-white transition hover:bg-slate-800"
          >
            {user ? "Continue Learning 🚀" : "Create Your Account 🚀"}
          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10 px-6 py-10 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

          <div>

            <h2 className="text-2xl font-bold">
              Learn<span className="text-cyan-400">Hub</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Learn. Grow. Succeed.
            </p>

          </div>

          <div className="flex gap-6 text-sm text-slate-400">

            <Link
              href="/courses"
              className="hover:text-cyan-400"
            >
              Courses
            </Link>

            <Link
              href="/login"
              className="hover:text-cyan-400"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="hover:text-cyan-400"
            >
              Register
            </Link>

          </div>

          <p className="text-sm text-slate-600">
            © 2026 LearnHub. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   STEP COMPONENT
========================================================= */

function Step({
  number,
  title,
  description,
  link,
  linkText,
}: {
  number: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-2 hover:border-cyan-400/50">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-2xl font-black text-slate-950">
        {number}
      </div>

      <h3 className="mt-6 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>

      <Link
        href={link}
        className="mt-6 inline-block font-semibold text-cyan-400"
      >
        {linkText}
      </Link>

    </div>
  );
}


/* =========================================================
   COURSE CARD
========================================================= */

function CourseCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-2 hover:border-cyan-400/50">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-slate-400">
        {description}
      </p>

      <Link
        href="/courses"
        className="mt-6 inline-block font-semibold text-cyan-400"
      >
        View Course →
      </Link>

    </div>
  );
}