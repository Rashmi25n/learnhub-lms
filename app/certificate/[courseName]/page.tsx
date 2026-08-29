"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();

  const courseName = decodeURIComponent(
    String(params.courseName || "")
  );

  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("learnhubUser");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user?.name) {
          setUserName(user.name);
        }

        if (user?.email) {
          setUserEmail(user.email);
        }
      }
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  const formattedCourseName = courseName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      {/* ================= CERTIFICATE ================= */}

      <div className="mx-auto max-w-5xl">

        <div className="overflow-hidden rounded-[2rem] bg-white text-slate-900 shadow-2xl">

          {/* Certificate Border */}

          <div className="m-4 rounded-[1.5rem] border-8 border-yellow-500">

            <div className="relative px-8 py-12 text-center sm:px-12 sm:py-16">

              {/* Decorative Corner */}

              <div className="pointer-events-none absolute left-4 top-4 h-16 w-16 rounded-tl-2xl border-l-4 border-t-4 border-yellow-400" />

              <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-tr-2xl border-r-4 border-t-4 border-yellow-400" />

              <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 rounded-bl-2xl border-b-4 border-l-4 border-yellow-400" />

              <div className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 rounded-br-2xl border-b-4 border-r-4 border-yellow-400" />

              {/* Trophy */}

              <div className="text-6xl">
                🏆
              </div>

              {/* Logo */}

              <p className="mt-4 text-lg font-black tracking-[0.35em] text-blue-700">
                LEARNHUB
              </p>

              {/* Title */}

              <h1 className="mt-5 font-serif text-5xl font-black sm:text-6xl">
                Certificate
              </h1>

              <p className="mt-2 font-serif text-2xl italic text-slate-500">
                of Achievement
              </p>

              <div className="mx-auto my-8 h-1 w-32 rounded-full bg-yellow-500" />

              {/* Presented To */}

              <p className="text-lg text-slate-500">
                This certificate is proudly presented to
              </p>

              {/* USERNAME */}

              <h2 className="mt-5 break-words text-4xl font-black text-blue-700 sm:text-5xl">
                {userName}
              </h2>

              {/* EMAIL */}

              {userEmail && (
                <p className="mt-2 text-sm text-slate-500">
                  {userEmail}
                </p>
              )}

              <p className="mt-8 text-lg text-slate-500">
                for successfully completing the course
              </p>

              {/* COURSE */}

              <h3 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">
                {formattedCourseName}
              </h3>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                This learner has successfully completed all required
                lessons and passed the course assessment.
              </p>

              {/* Achievement Cards */}

              <div className="mt-12 grid gap-5 sm:grid-cols-3">

                {/* Course */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <div className="text-4xl">
                    🎓
                  </div>

                  <h4 className="mt-3 font-black text-slate-900">
                    Course Completed
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Successfully finished
                  </p>

                </div>

                {/* Assessment */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <div className="text-4xl">
                    🏅
                  </div>

                  <h4 className="mt-3 font-black text-slate-900">
                    Assessment Passed
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Successfully qualified
                  </p>

                </div>

                {/* Certification */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <div className="text-4xl">
                    📚
                  </div>

                  <h4 className="mt-3 font-black text-slate-900">
                    LearnHub Certified
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Verified achievement
                  </p>

                </div>

              </div>

              {/* Academy */}

              <div className="mt-12">

                <p className="text-xl font-black text-slate-900">
                  LearnHub Academy
                </p>

                <p className="mt-2 text-sm font-semibold tracking-[0.25em] text-blue-700">
                  LEARN • BUILD • CERTIFY
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ================= BUTTONS ================= */}

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          {/* PRINT */}

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-blue-600 px-7 py-3 font-black text-white transition hover:bg-blue-700"
          >
            🖨️ Print Certificate
          </button>

          {/* MY COURSES */}

          <button
            onClick={() => router.push("/courses")}
            className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-bold text-white transition hover:border-cyan-400 hover:text-cyan-400"
          >
            📚 My Courses
          </button>

          {/* HOME */}

          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-bold text-white transition hover:border-cyan-400 hover:text-cyan-400"
          >
            🏠 Home
          </button>

        </div>

      </div>

      {/* ================= PRINT STYLE ================= */}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          main {
            background: white !important;
            padding: 0 !important;
          }

          button {
            display: none !important;
          }

          .shadow-2xl {
            box-shadow: none !important;
          }
        }
      `}</style>

    </main>
  );
}