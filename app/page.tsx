"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  getEnrolledCourses,
  type EnrolledCourse,
  onLearningDataChange,
} from "./lib/learning";

type User = {
  name: string;
  email: string;
};

/* =========================================================
   HOME PAGE
========================================================= */

export default function Home() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [enrolledCourses, setEnrolledCourses] = useState<
    EnrolledCourse[]
  >([]);

  const [activeFeature, setActiveFeature] =
    useState("Learn");

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  useEffect(() => {
    setMounted(true);

    const savedUser =
      localStorage.getItem("learnhubUser");

    if (!savedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (
        parsedUser &&
        parsedUser.name &&
        parsedUser.email
      ) {
        setUser({
          name: parsedUser.name,
          email: parsedUser.email,
        });
      } else {
        localStorage.removeItem("learnhubUser");
        router.replace("/login");
      }
    } catch {
      localStorage.removeItem("learnhubUser");
      router.replace("/login");
    }
  }, [router]);

  /* =========================================================
     LOAD LEARNING DATA
  ========================================================= */

  useEffect(() => {
    if (!mounted) {
      return;
    }

    function loadLearningData() {
      try {
        const courses = getEnrolledCourses();

        setEnrolledCourses(
          Array.isArray(courses)
            ? courses
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load learning data:",
          error
        );

        setEnrolledCourses([]);
      }
    }

    loadLearningData();

    const unsubscribe =
      onLearningDataChange(
        loadLearningData
      );

    return unsubscribe;
  }, [mounted]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  function handleLogout() {
    localStorage.removeItem(
      "learnhubUser"
    );

    setUser(null);
    setProfileOpen(false);

    router.replace("/login");
  }

  /* =========================================================
     LEARNING STATISTICS
  ========================================================= */

  const overallProgress = useMemo(() => {
    if (enrolledCourses.length === 0) {
      return 0;
    }

    return Math.round(
      enrolledCourses.reduce(
        (total, course) =>
          total +
          Number(course.progress || 0),
        0
      ) / enrolledCourses.length
    );
  }, [enrolledCourses]);

  const completedCourses = useMemo(() => {
    return enrolledCourses.filter(
      (course) =>
        Number(course.progress || 0) >= 100
    ).length;
  }, [enrolledCourses]);

  const inProgressCourses = useMemo(() => {
    return enrolledCourses.filter(
      (course) => {
        const progress =
          Number(course.progress || 0);

        return (
          progress > 0 &&
          progress < 100
        );
      }
    ).length;
  }, [enrolledCourses]);

  const firstName =
    user?.name?.split(" ")[0] ||
    "Student";

  /* =========================================================
     LOADING
  ========================================================= */

  if (!mounted || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

          <p className="mt-5 font-semibold text-slate-400">
            Preparing your LearnHub dashboard...
          </p>

        </div>
      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-[-150px] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-3xl" />

      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 px-6 py-4 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LOGO */}

          <Link
            href="/"
            className="group text-2xl font-black tracking-tight"
          >
            Learn
            <span className="text-cyan-400 transition group-hover:text-cyan-300">
              Hub
            </span>
          </Link>

          {/* DESKTOP NAV */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              href="/"
              className="rounded-xl bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-400"
            >
              Home
            </Link>

            <Link
              href="/courses"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-cyan-400"
            >
              Courses
            </Link>

            <Link
              href="/profile"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-cyan-400"
            >
              My Learning
            </Link>

            {/* PROFILE */}

            <div className="relative ml-2">

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-black text-slate-950">
                  {user.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="hidden text-left lg:block">

                  <p className="max-w-[120px] truncate text-sm font-bold">
                    {user.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    Student
                  </p>

                </div>

                <span
                  className={`text-xs transition ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ▼
                </span>

              </button>

              {/* DROPDOWN */}

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                  <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-black text-slate-950">
                        {user.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-lg font-black">
                          {user.name}
                        </h3>

                        <p className="truncate text-sm text-slate-400">
                          {user.email}
                        </p>

                        <span className="mt-1 inline-block rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-bold text-cyan-400">
                          Student
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="p-2">

                    <ProfileMenuButton
                      icon="👤"
                      title="My Profile"
                      description="View your account"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push(
                          "/profile"
                        );
                      }}
                    />

                    <ProfileMenuButton
                      icon="📚"
                      title="My Courses"
                      description="Continue learning"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push(
                          "/courses"
                        );
                      }}
                    />

                    <ProfileMenuButton
                      icon="🏆"
                      title="Certificates"
                      description="View your achievements"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push(
                          "/profile"
                        );
                      }}
                    />

                    <div className="my-2 border-t border-white/10" />

                    <button
                      type="button"
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

          </div>

          {/* MOBILE */}

          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                !profileOpen
              )
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-black text-slate-950 md:hidden"
          >
            {user.name
              .charAt(0)
              .toUpperCase()}
          </button>

        </div>

        {/* MOBILE MENU */}

        {profileOpen && (
          <div className="mx-auto mt-4 max-w-md rounded-2xl border border-white/10 bg-slate-900 p-3 md:hidden">

            <Link
              href="/profile"
              onClick={() =>
                setProfileOpen(false)
              }
              className="block rounded-xl px-4 py-3 font-semibold transition hover:bg-white/5"
            >
              👤 My Profile
            </Link>

            <Link
              href="/courses"
              onClick={() =>
                setProfileOpen(false)
              }
              className="block rounded-xl px-4 py-3 font-semibold transition hover:bg-white/5"
            >
              📚 My Courses
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              🚪 Logout
            </button>

          </div>
        )}

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative px-6 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">

            {/* HERO TEXT */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">

                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                Welcome back, {firstName}

              </div>

              <p className="mt-7 font-bold tracking-[0.3em] text-cyan-400">
                LEARN • BUILD • CERTIFY
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[1.05] md:text-7xl">

                Upgrade Your Skills.

                <br />

                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Build Your Future.
                </span>

              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
                Master industry-ready skills through
                structured courses, practical projects,
                assessments and professional certificates.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                <Link
                  href="/courses"
                  className="rounded-xl bg-cyan-400 px-8 py-4 text-center font-black text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-1 hover:bg-cyan-300"
                >
                  Explore Courses 🚀
                </Link>

                <Link
                  href="/profile"
                  className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-center font-bold text-white transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/10"
                >
                  View My Learning →
                </Link>

              </div>

              {/* TRUST */}

              <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">

                <span>
                  ✓ Industry-focused
                </span>

                <span>
                  ✓ Practical learning
                </span>

                <span>
                  ✓ Certificates
                </span>

              </div>

            </div>

            {/* DASHBOARD PREVIEW */}

            <div className="relative">

              <div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/5 blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">

                {/* WINDOW HEADER */}

                <div className="flex items-center justify-between border-b border-white/10 pb-4">

                  <div className="flex gap-2">

                    <span className="h-3 w-3 rounded-full bg-red-400/70" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                    <span className="h-3 w-3 rounded-full bg-green-400/70" />

                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    LEARNHUB DASHBOARD
                  </span>

                </div>

                {/* WELCOME */}

                <div className="mt-6">

                  <p className="text-sm text-slate-500">
                    Your learning overview
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Keep learning, {firstName}!
                  </h2>

                </div>

                {/* MINI STATS */}

                <div className="mt-6 grid grid-cols-3 gap-3">

                  <MiniStat
                    value={enrolledCourses.length}
                    label="Enrolled"
                  />

                  <MiniStat
                    value={`${overallProgress}%`}
                    label="Progress"
                  />

                  <MiniStat
                    value={completedCourses}
                    label="Completed"
                  />

                </div>

                {/* PROGRESS */}

                <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-bold">
                      Overall Learning Progress
                    </span>

                    <span className="font-black text-cyan-400">
                      {overallProgress}%
                    </span>

                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                      style={{
                        width: `${overallProgress}%`,
                      }}
                    />

                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {completedCourses > 0
                      ? `${completedCourses} course${completedCourses !== 1 ? "s" : ""} completed`
                      : inProgressCourses > 0
                      ? `${inProgressCourses} course${inProgressCourses !== 1 ? "s" : ""} in progress`
                      : "Start your first course today"}
                  </p>

                </div>

                {/* COURSE PREVIEW */}

                {enrolledCourses.length > 0 ? (

                  <div className="mt-5 space-y-3">

                    {enrolledCourses
                      .slice(0, 2)
                      .map((course) => (

                        <Link
                          key={course.slug}
                          href={`/courses/${course.slug}`}
                          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition hover:border-cyan-400/20 hover:bg-cyan-400/5"
                        >

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                            {course.icon}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex justify-between gap-3">

                              <p className="truncate text-sm font-bold">
                                {course.name}
                              </p>

                              <span className="text-xs font-black text-cyan-400">
                                {course.progress}%
                              </span>

                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">

                              <div
                                className="h-full rounded-full bg-cyan-400 transition-all"
                                style={{
                                  width: `${course.progress}%`,
                                }}
                              />

                            </div>

                          </div>

                        </Link>

                      ))}

                  </div>

                ) : (

                  <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-5 text-center">

                    <div className="text-3xl">
                      📚
                    </div>

                    <p className="mt-2 text-sm font-bold">
                      Your learning dashboard is ready
                    </p>

                    <Link
                      href="/courses"
                      className="mt-3 inline-block text-sm font-bold text-cyan-400"
                    >
                      Start Learning →
                    </Link>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PLATFORM STATS
      ===================================================== */}

      <section className="px-6 md:px-10">

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">

          <PlatformStat
            number="15+"
            label="Industry Courses"
            icon="📚"
          />

          <PlatformStat
            number="10K+"
            label="Learning Community"
            icon="👥"
          />

          <PlatformStat
            number="50+"
            label="Practical Projects"
            icon="💻"
          />

          <PlatformStat
            number="100%"
            label="Certificate Ready"
            icon="🏆"
          />

        </div>

      </section>

      {/* =====================================================
          INTERACTIVE FEATURES
      ===================================================== */}

      <section className="px-6 py-24 md:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-bold tracking-[0.2em] text-cyan-400">
              ONE PLATFORM
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Everything You Need to Grow
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Learn systematically, practice with projects,
              track your progress and showcase your achievements.
            </p>

          </div>

          {/* FEATURE TABS */}

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            {[
              "Learn",
              "Practice",
              "Track",
              "Certify",
            ].map((feature) => (

              <button
                key={feature}
                type="button"
                onClick={() =>
                  setActiveFeature(feature)
                }
                className={
                  activeFeature === feature
                    ? "rounded-full bg-cyan-400 px-6 py-3 font-black text-slate-950"
                    : "rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-400"
                }
              >
                {feature}
              </button>

            ))}

          </div>

          <div className="mt-8">

            {activeFeature === "Learn" && (
              <FeaturePanel
                icon="📚"
                title="Structured Learning"
                description="Follow carefully organized lessons from fundamentals to advanced concepts with a clear learning path."
                points={[
                  "Beginner to advanced courses",
                  "Lesson-by-lesson learning",
                  "Industry-focused curriculum",
                ]}
              />
            )}

            {activeFeature === "Practice" && (
              <FeaturePanel
                icon="💻"
                title="Learn by Building"
                description="Turn theory into practical knowledge through projects, assessments and real-world problem solving."
                points={[
                  "Hands-on projects",
                  "Practical assessments",
                  "Real-world applications",
                ]}
              />
            )}

            {activeFeature === "Track" && (
              <FeaturePanel
                icon="📈"
                title="Track Your Growth"
                description="Monitor your course progress and completed lessons directly from your personalized dashboard."
                points={[
                  "Live learning progress",
                  "Completed course tracking",
                  "Personal learning dashboard",
                ]}
              />
            )}

            {activeFeature === "Certify" && (
              <FeaturePanel
                icon="🏆"
                title="Earn Certificates"
                description="Complete your learning journey and showcase your achievements with LearnHub certificates."
                points={[
                  "Course completion",
                  "Achievement tracking",
                  "Professional certificate access",
                ]}
              />
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-24 md:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-bold tracking-widest text-cyan-400">
              SIMPLE PROCESS
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              From Learning to Certification
            </h2>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <StepCard
              number="01"
              icon="🎯"
              title="Choose Your Course"
              description="Explore industry-focused courses and select the skills you want to develop."
            />

            <StepCard
              number="02"
              icon="🚀"
              title="Learn & Practice"
              description="Complete lessons, build projects and track your progress through the platform."
            />

            <StepCard
              number="03"
              icon="🏆"
              title="Get Certified"
              description="Complete the course requirements and unlock your LearnHub certificate."
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          MY LEARNING
      ===================================================== */}

      <section className="px-6 py-24 md:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="font-bold tracking-widest text-cyan-400">
                YOUR LEARNING
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Continue Where You Left Off
              </h2>

              <p className="mt-3 text-slate-500">
                Your latest course progress appears here automatically.
              </p>

            </div>

            <Link
              href="/profile"
              className="font-bold text-cyan-400 transition hover:text-cyan-300"
            >
              Open Dashboard →
            </Link>

          </div>

          {enrolledCourses.length === 0 ? (

            <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">

              <div className="text-6xl">
                🚀
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Your learning journey starts here
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                Enroll in your first course and start building
                skills that can move your career forward.
              </p>

              <Link
                href="/courses"
                className="mt-7 inline-block rounded-xl bg-cyan-400 px-7 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Explore Courses 🚀
              </Link>

            </div>

          ) : (

            <div className="mt-10 grid gap-5 md:grid-cols-2">

              {enrolledCourses
                .slice(0, 4)
                .map((course) => (

                  <LearningCourseCard
                    key={course.slug}
                    course={course}
                  />

                ))}

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          CAREER CTA
      ===================================================== */}

      <section className="px-6 pb-24 md:px-10">

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-500/10 p-10 md:p-16">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">

            <div>

              <p className="font-bold tracking-widest text-cyan-400">
                BUILD YOUR CAREER
              </p>

              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                Skills Today.
                <br />
                Opportunities Tomorrow.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Build practical knowledge, complete projects,
                track your progress and create a portfolio of
                achievements with LearnHub.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  href="/courses"
                  className="rounded-xl bg-cyan-400 px-7 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  Start Learning
                </Link>

                <Link
                  href="/profile"
                  className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-bold transition hover:border-cyan-400/30"
                >
                  View Progress
                </Link>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <CareerCard
                icon="🧠"
                title="Skills"
                text="Industry-ready knowledge"
              />

              <CareerCard
                icon="💻"
                title="Projects"
                text="Practical experience"
              />

              <CareerCard
                icon="📈"
                title="Progress"
                text="Track your growth"
              />

              <CareerCard
                icon="🏆"
                title="Certificates"
                text="Showcase achievements"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 px-6 py-10 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

          <div className="text-center md:text-left">

            <h2 className="text-2xl font-black">
              Learn
              <span className="text-cyan-400">
                Hub
              </span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Learn • Build • Certify
            </p>

          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-500">

            <Link
              href="/courses"
              className="transition hover:text-cyan-400"
            >
              Courses
            </Link>

            <Link
              href="/profile"
              className="transition hover:text-cyan-400"
            >
              Profile
            </Link>

            <Link
              href="/profile"
              className="transition hover:text-cyan-400"
            >
              Certificates
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="transition hover:text-red-400"
            >
              Logout
            </button>

          </div>

          <p className="text-sm text-slate-700">
            © 2026 LearnHub. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}

/* =========================================================
   PROFILE MENU BUTTON
========================================================= */

function ProfileMenuButton({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
    >

      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
        {icon}
      </span>

      <div>

        <p className="font-bold">
          {title}
        </p>

        <p className="text-xs text-slate-500">
          {description}
        </p>

      </div>

    </button>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">

      <p className="text-xl font-black text-cyan-400">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   PLATFORM STAT
========================================================= */

function PlatformStat({
  number,
  label,
  icon,
}: {
  number: string;
  label: string;
  icon: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]">

      <div className="text-2xl transition group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-3 text-3xl font-black text-cyan-400">
        {number}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   FEATURE PANEL
========================================================= */

function FeaturePanel({
  icon,
  title,
  description,
  points,
}: {
  icon: string;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:grid-cols-2 md:p-10">

      <div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
          {icon}
        </div>

        <h3 className="mt-6 text-3xl font-black">
          {title}
        </h3>

        <p className="mt-4 leading-7 text-slate-400">
          {description}
        </p>

      </div>

      <div className="flex flex-col justify-center gap-3">

        {points.map((point) => (

          <div
            key={point}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4"
          >

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/10 text-sm text-cyan-400">
              ✓
            </span>

            <span className="font-semibold text-slate-300">
              {point}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40">

      <div className="flex items-center justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-2xl text-slate-950">
          {icon}
        </div>

        <span className="text-4xl font-black text-white/10">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-2xl font-black">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   LEARNING COURSE CARD
========================================================= */

function LearningCourseCard({
  course,
}: {
  course: EnrolledCourse;
}) {
  const progress = Math.max(
    0,
    Math.min(
      100,
      Number(course.progress || 0)
    )
  );

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]"
    >

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl transition group-hover:scale-105">
            {course.icon}
          </div>

          <div>

            <span className="text-xs font-bold text-cyan-400">
              {course.category}
            </span>

            <h3 className="mt-1 font-black">
              {course.name}
            </h3>

          </div>

        </div>

        <span className="font-black text-cyan-400">
          {progress}%
        </span>

      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-4 flex items-center justify-between">

        <span className="text-xs text-slate-500">
          {progress >= 100
            ? "Completed 🎉"
            : progress > 0
            ? "Learning in progress"
            : "Not started yet"}
        </span>

        <span className="text-xs font-bold text-cyan-400">
          Continue →
        </span>

      </div>

    </Link>
  );
}

/* =========================================================
   CAREER CARD
========================================================= */

function CareerCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-cyan-400/30 hover:bg-cyan-400/5">

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}