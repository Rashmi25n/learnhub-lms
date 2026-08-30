"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  getEnrolledCourses,
  type EnrolledCourse,
  onLearningDataChange,
} from "../lib/learning";

type User = {
  name: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<
    EnrolledCourse[]
  >([]);
  const [mounted, setMounted] = useState(false);

  /* =========================================================
     LOAD COURSES
  ========================================================= */

  function loadCourses() {
    try {
      const courses = getEnrolledCourses();

      console.log("LearnHub enrolled courses:", courses);

      setEnrolledCourses(
        Array.isArray(courses) ? courses : []
      );
    } catch (error) {
      console.error(
        "Failed to load enrolled courses:",
        error
      );

      setEnrolledCourses([]);
    }
  }

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    setMounted(true);

    const storedUser =
      localStorage.getItem("learnhubUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser({
        name: parsedUser.name || "Student",
        email: parsedUser.email || "",
      });
    } catch {
      setUser({
        name: "Student",
        email: storedUser,
      });
    }

    loadCourses();
  }, [router]);

  /* =========================================================
     AUTOMATIC PROGRESS REFRESH
  ========================================================= */

  useEffect(() => {
    if (!mounted) {
      return;
    }

    /*
     * This listens to:
     *
     * learnhubEnrollmentChanged
     * learnhubProgressChanged
     * browser storage changes
     *
     * So when a lesson is completed,
     * the profile page updates automatically.
     */

    const unsubscribe =
      onLearningDataChange(() => {
        loadCourses();
      });

    return unsubscribe;
  }, [mounted]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  function handleLogout() {
    localStorage.removeItem("learnhubUser");

    router.push("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (!mounted || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-slate-400">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     PROGRESS CALCULATIONS
  ========================================================= */

  const completedCourses =
    enrolledCourses.filter(
      (course) =>
        Number(course.progress || 0) >= 100
    );

  const overallProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (total, course) =>
              total +
              Number(course.progress || 0),
            0
          ) / enrolledCourses.length
        )
      : 0;

  const firstLetter =
    user.name.charAt(0).toUpperCase();

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Learn
            <span className="text-cyan-400">
              Hub
            </span>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Home
            </Link>

            <Link
              href="/courses"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Courses
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/20"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* PROFILE HEADER */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl">

          <div className="relative h-40 overflow-hidden bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20">

            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full border border-cyan-400/10" />

            <div className="absolute -left-20 bottom-[-120px] h-64 w-64 rounded-full border border-blue-400/10" />

          </div>

          <div className="relative px-6 pb-8 sm:px-10">

            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-5">

                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border-4 border-slate-950 bg-gradient-to-br from-cyan-400 to-blue-500 text-4xl font-black text-slate-950 shadow-xl shadow-cyan-500/20">
                  {firstLetter}
                </div>

                <div className="pb-2">

                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    🎓 STUDENT
                  </div>

                  <h1 className="text-3xl font-black sm:text-4xl">
                    {user.name}
                  </h1>

                  <p className="mt-1 text-slate-400">
                    {user.email}
                  </p>

                </div>
              </div>

              <Link
                href="/courses"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Explore Courses →
              </Link>

            </div>
          </div>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon="📚"
            title="Enrolled Courses"
            value={enrolledCourses.length.toString()}
            description="Courses you're learning"
          />

          <StatCard
            icon="📈"
            title="Overall Progress"
            value={`${overallProgress}%`}
            description="Learning progress"
          />

          <StatCard
            icon="🏆"
            title="Certificates"
            value={completedCourses.length.toString()}
            description="Certificates earned"
          />

          <StatCard
            icon="✅"
            title="Completed"
            value={completedCourses.length.toString()}
            description="Courses completed"
          />

        </div>

        {/* =====================================================
            PROFILE + LEARNING PROGRESS
        ===================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* PROFILE */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                👤
              </div>

              <div>
                <h2 className="font-black">
                  My Profile
                </h2>

                <p className="text-sm text-slate-500">
                  Account information
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <InfoRow
                label="Full Name"
                value={user.name}
                icon="👤"
              />

              <InfoRow
                label="Email"
                value={user.email}
                icon="✉️"
              />

              <InfoRow
                label="Role"
                value="Student"
                icon="🎓"
              />

              <InfoRow
                label="Platform"
                value="LearnHub LMS"
                icon="🚀"
              />

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 w-full rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
            >
              🚪 Logout from LearnHub
            </button>

          </div>

          {/* LEARNING PROGRESS */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-black">
                  Learning Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your course completion
                </p>

              </div>

              <div className="text-3xl">
                📈
              </div>

            </div>

            {enrolledCourses.length === 0 ? (

              <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">

                <div className="text-5xl">
                  📚
                </div>

                <h3 className="mt-4 text-lg font-black">
                  No courses enrolled yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Start your learning journey by exploring our courses.
                </p>

                <Link
                  href="/courses"
                  className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  Browse Courses →
                </Link>

              </div>

            ) : (

              <div className="mt-6 space-y-5">

                {enrolledCourses.map((course) => (

                  <CourseProgress
                    key={course.slug}
                    course={course}
                  />

                ))}

              </div>

            )}

          </div>

        </div>

        {/* =====================================================
            MY COURSES
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <p className="text-sm font-bold tracking-widest text-cyan-400">
              MY LEARNING
            </p>

            <h2 className="mt-2 text-3xl font-black">
              My Courses
            </h2>

            <p className="mt-2 text-slate-500">
              Continue your learning journey.
            </p>

          </div>

          {enrolledCourses.length === 0 ? (

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-400/10 text-4xl">
                📚
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Your learning dashboard is waiting
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-500">
                Enroll in a course to see your lessons,
                progress, quizzes and certificates here.
              </p>

              <Link
                href="/courses"
                className="mt-6 inline-flex rounded-xl bg-cyan-400 px-7 py-3 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Explore Courses 🚀
              </Link>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {enrolledCourses.map((course) => (

                <CourseCard
                  key={course.slug}
                  course={course}
                />

              ))}

            </div>

          )}

        </section>

        {/* =====================================================
            CERTIFICATES
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <p className="text-sm font-bold tracking-widest text-cyan-400">
              ACHIEVEMENTS
            </p>

            <h2 className="mt-2 text-3xl font-black">
              My Certificates
            </h2>

            <p className="mt-2 text-slate-500">
              Your completed course certificates.
            </p>

          </div>

          {completedCourses.length === 0 ? (

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">

              <div className="text-6xl">
                🏆
              </div>

              <h3 className="mt-5 text-2xl font-black">
                No certificates yet
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-500">
                Complete all lessons to unlock your LearnHub certificate.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2">

              {completedCourses.map((course) => (

                <CertificateCard
                  key={course.slug}
                  course={course}
                />

              ))}

            </div>

          )}

        </section>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mt-8">

          <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 p-6">

            <h2 className="text-xl font-black">
              Quick Actions
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <QuickAction
                href="/courses"
                icon="📚"
                title="Browse Courses"
              />

              <QuickAction
                href="/courses/python-programming"
                icon="🐍"
                title="Python Course"
              />

              <QuickAction
                href="/certificate/python-programming"
                icon="🏆"
                title="Certificate"
              />

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-2xl border border-red-400/10 bg-red-400/5 p-4 text-left transition hover:border-red-400/30 hover:bg-red-400/10"
              >

                <span className="text-2xl">
                  🚪
                </span>

                <span>
                  <span className="block font-bold text-red-300">
                    Logout
                  </span>

                  <span className="text-xs text-slate-600">
                    Sign out
                  </span>
                </span>

              </button>

            </div>

          </div>

        </section>

      </section>

      {/* FOOTER */}

      <footer className="relative z-10 mt-10 border-t border-white/5 px-6 py-8 text-center">

        <p className="font-bold text-cyan-400">
          LEARNHUB LMS
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Learn • Build • Certify
        </p>

        <p className="mt-3 text-xs text-slate-700">
          © 2026 LearnHub. All rights reserved.
        </p>

      </footer>

    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: string;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20">

      <div className="flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
          {icon}
        </div>

        <span className="text-2xl font-black text-white">
          {value}
        </span>

      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">

      <span className="text-lg">
        {icon}
      </span>

      <div className="min-w-0">

        <p className="text-xs text-slate-600">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-slate-300">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   COURSE PROGRESS
========================================================= */

function CourseProgress({
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

  const completedLessons =
    Number(course.completedLessons || 0);

  const totalLessons =
    Number(course.totalLessons || 0);

  const isCompleted =
    progress >= 100 ||
    completedLessons >= totalLessons;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
            {course.icon}
          </div>

          <div>

            <h3 className="font-bold">
              {course.name}
            </h3>

            <p className="text-xs text-slate-600">
              {course.category}
            </p>

          </div>

        </div>

        <span className="font-black text-cyan-400">
          {progress}%
        </span>

      </div>

      {/* PROGRESS BAR */}

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* LESSON COUNT */}

      <div className="mt-3 flex items-center justify-between">

        <span className="text-xs text-slate-500">
          {completedLessons} / {totalLessons} lessons completed
        </span>

        <span
          className={
            isCompleted
              ? "text-xs font-bold text-green-400"
              : "text-xs font-bold text-cyan-400"
          }
        >
          {isCompleted
            ? "🎉 Completed"
            : progress > 0
            ? "Learning in progress"
            : "Not started"}
        </span>

      </div>

      {/* CONTINUE */}

      <div className="mt-4 flex items-center justify-between">

        <Link
          href={`/courses/${course.slug}`}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
        >
          {isCompleted
            ? "Review Course →"
            : "Continue Learning →"}
        </Link>

        {isCompleted && (
          <Link
            href={`/certificate/${course.slug}`}
            className="text-xs font-bold text-yellow-400 hover:text-yellow-300"
          >
            🏆 Certificate
          </Link>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   COURSE CARD
========================================================= */

function CourseCard({
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

  const completedLessons =
    Number(course.completedLessons || 0);

  const totalLessons =
    Number(course.totalLessons || 0);

  const isCompleted =
    progress >= 100 ||
    completedLessons >= totalLessons;

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20">

      <div className="flex items-center justify-center bg-gradient-to-br from-cyan-400/10 to-blue-500/10 py-10 text-6xl">
        {course.icon}
      </div>

      <div className="p-5">

        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
          {course.category}
        </span>

        <h3 className="mt-4 text-lg font-black">
          {course.name}
        </h3>

        {/* PROGRESS */}

        <div className="mt-4">

          <div className="flex justify-between text-xs">

            <span className="text-slate-500">
              Progress
            </span>

            <span className="font-bold text-cyan-400">
              {progress}%
            </span>

          </div>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="mt-2 text-xs text-slate-600">
            {completedLessons} / {totalLessons} lessons completed
          </p>

        </div>

        {/* COMPLETED STATUS */}

        {isCompleted && (
          <div className="mt-4 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-center text-sm font-bold text-green-300">
            🎉 Course Completed
          </div>
        )}

        {/* BUTTON */}

        <Link
          href={`/courses/${course.slug}`}
          className="mt-5 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
        >
          {isCompleted
            ? "Review Course →"
            : "Continue Learning →"}
        </Link>

      </div>

    </div>
  );
}

/* =========================================================
   CERTIFICATE CARD
========================================================= */

function CertificateCard({
  course,
}: {
  course: EnrolledCourse;
}) {
  return (
    <div className="rounded-3xl border border-yellow-400/10 bg-gradient-to-br from-yellow-400/5 to-transparent p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-bold tracking-widest text-yellow-400">
            CERTIFICATE OF ACHIEVEMENT
          </p>

          <h3 className="mt-3 text-2xl font-black">
            {course.name}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Successfully completed and certified.
          </p>

        </div>

        <div className="text-4xl">
          🏆
        </div>

      </div>

      <Link
        href={`/certificate/${course.slug}`}
        className="mt-6 block rounded-xl bg-yellow-400 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-yellow-300"
      >
        View Certificate →
      </Link>

    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  href,
  icon,
  title,
}: {
  href: string;
  icon: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-cyan-400/5"
    >

      <span className="text-2xl">
        {icon}
      </span>

      <span className="font-bold text-slate-300">
        {title}
      </span>

    </Link>
  );
}