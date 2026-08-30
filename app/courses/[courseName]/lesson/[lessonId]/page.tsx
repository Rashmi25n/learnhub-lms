"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Lesson = {
  id: number;
  documentId?: string;
  title: string;
  content: string;
  videoUrl?: string;
  order?: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://learnhub-backend-production-2413.up.railway.app";

const TOTAL_LESSONS = 3;

/* =========================================================
   HELPERS
========================================================= */

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function youtubeUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.substring(1);

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

/* =========================================================
   GET SAVED COMPLETED LESSONS
========================================================= */

function getCompletedLessons(
  courseSlug: string
): number[] {
  try {
    const saved = localStorage.getItem(
      `learnhubProgress_${courseSlug}`
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(Number)
      .filter((number) => Number.isFinite(number))
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}

/* =========================================================
   SAVE LESSON PROGRESS
========================================================= */

function saveLessonProgress(
  courseSlug: string,
  lessonNumber: number
): number {
  try {
    let completedLessons =
      getCompletedLessons(courseSlug);

    if (!completedLessons.includes(lessonNumber)) {
      completedLessons.push(lessonNumber);
    }

    completedLessons = [
      ...new Set(completedLessons),
    ].sort((a, b) => a - b);

    /* Main progress storage */
    localStorage.setItem(
      `learnhubProgress_${courseSlug}`,
      JSON.stringify(completedLessons)
    );

    /* Completed lessons storage */
    localStorage.setItem(
      `learnhubCompletedLessons_${courseSlug}`,
      JSON.stringify(completedLessons)
    );

    /* Calculate percentage */
    const progress = Math.min(
      100,
      Math.round(
        (completedLessons.length /
          TOTAL_LESSONS) *
          100
      )
    );

    /* Percentage storage */
    localStorage.setItem(
      `learnhubCourseProgress_${courseSlug}`,
      String(progress)
    );

    /* Notify other pages */
    window.dispatchEvent(
      new Event("learnhubProgressChanged")
    );

    window.dispatchEvent(
      new Event("learnhubEnrollmentChanged")
    );

    console.log(
      "================================="
    );

    console.log(
      "COURSE:",
      courseSlug
    );

    console.log(
      "COMPLETED LESSONS:",
      completedLessons
    );

    console.log(
      "PROGRESS:",
      `${progress}%`
    );

    console.log(
      "================================="
    );

    return progress;
  } catch (error) {
    console.error(
      "Progress save error:",
      error
    );

    return 0;
  }
}

/* =========================================================
   LESSON PAGE
========================================================= */

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseName = String(
    params.courseName || ""
  );

  const lessonId = Number(
    params.lessonId
  );

  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  /* =========================================================
     LOAD LESSON
  ========================================================= */

  useEffect(() => {
    async function getLesson() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/lessons?populate=*&pagination[pageSize]=100`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status}`
          );
        }

        const result =
          await response.json();

        const lessons =
          result?.data || [];

        console.log(
          "API URL:",
          API_URL
        );

        console.log(
          "ALL LESSONS:",
          lessons
        );

        console.log(
          "COURSE:",
          courseName
        );

        console.log(
          "LESSON:",
          lessonId
        );

        /* =====================================================
           FIND LESSONS FOR CURRENT COURSE
        ===================================================== */

        const courseLessons =
          lessons
            .filter((item: any) => {
              const data =
                item.attributes || item;

              const course =
                data.course;

              if (!course) {
                return false;
              }

              const courseData =
                course.data || course;

              const courseAttributes =
                courseData.attributes ||
                courseData;

              const courseTitle =
                courseAttributes?.title ||
                "";

              const courseSlug =
                courseAttributes?.slug ||
                "";

              const courseDocumentId =
                courseData?.documentId ||
                "";

              return (
                createSlug(
                  courseTitle
                ) === courseName ||
                courseSlug === courseName ||
                courseDocumentId ===
                  courseName
              );
            })
            .sort(
              (
                a: any,
                b: any
              ) => {
                const dataA =
                  a.attributes || a;

                const dataB =
                  b.attributes || b;

                const orderA =
                  Number(
                    dataA.order || 0
                  );

                const orderB =
                  Number(
                    dataB.order || 0
                  );

                return (
                  orderA - orderB
                );
              }
            );

        console.log(
          "COURSE LESSONS:",
          courseLessons
        );

        /* =====================================================
           FIND CURRENT LESSON
        ===================================================== */

        let selectedLesson =
          courseLessons.find(
            (item: any) => {
              const data =
                item.attributes || item;

              return (
                Number(data.order) ===
                lessonId
              );
            }
          );

        if (!selectedLesson) {
          selectedLesson =
            courseLessons[
              lessonId - 1
            ];
        }

        if (!selectedLesson) {
          setError(
            "Lesson not found"
          );
          return;
        }

        const data =
          selectedLesson.attributes ||
          selectedLesson;

        setLesson({
          id: selectedLesson.id,

          documentId:
            selectedLesson.documentId,

          title:
            data.title ||
            "Untitled Lesson",

          content:
            data.content || "",

          videoUrl:
            data.videoUrl || "",

          order:
            Number(data.order) ||
            lessonId,
        });

        /* =====================================================
           LOAD SAVED PROGRESS
        ===================================================== */

        const completedLessons =
          getCompletedLessons(
            courseName
          );

        const currentProgress =
          Math.min(
            100,
            Math.round(
              (completedLessons.length /
                TOTAL_LESSONS) *
                100
            )
          );

        setProgress(
          currentProgress
        );

        setCompleted(
          completedLessons.includes(
            lessonId
          )
        );

        console.log(
          "SAVED COMPLETED LESSONS:",
          completedLessons
        );

        console.log(
          "CURRENT PROGRESS:",
          currentProgress
        );
      } catch (error) {
        console.error(
          "LESSON ERROR:",
          error
        );

        setError(
          "Unable to load lesson"
        );
      } finally {
        setLoading(false);
      }
    }

    getLesson();
  }, [
    courseName,
    lessonId,
  ]);

  /* =========================================================
     COMPLETE CURRENT LESSON
  ========================================================= */

  function completeCurrentLesson() {
    const newProgress =
      saveLessonProgress(
        courseName,
        lessonId
      );

    setCompleted(true);

    setProgress(
      newProgress
    );

    return newProgress;
  }

  /* =========================================================
     NEXT LESSON
  ========================================================= */

  function handleNextLesson() {
    completeCurrentLesson();

    if (
      lessonId <
      TOTAL_LESSONS
    ) {
      router.push(
        `/courses/${courseName}/lesson/${
          lessonId + 1
        }`
      );
    } else {
      router.push(
        `/courses/${courseName}/quiz`
      );
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

          <p className="mt-5 text-lg font-semibold text-slate-400">
            Loading lesson...
          </p>

        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (
    error ||
    !lesson
  ) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">

        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

          <div className="text-6xl">
            📚
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Lesson not found
          </h1>

          <p className="mt-4 text-slate-400">
            Course: {courseName}
          </p>

          <p className="mt-2 text-slate-400">
            Lesson: {lessonId}
          </p>

          <button
            onClick={() =>
              router.push(
                `/courses/${courseName}`
              )
            }
            className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            ← Back to Course
          </button>

        </div>

      </main>
    );
  }

  const isLastLesson =
    lessonId >= TOTAL_LESSONS;

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-6 py-5 backdrop-blur-xl">

        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <button
            onClick={() =>
              router.push(
                `/courses/${courseName}`
              )
            }
            className="text-2xl font-black"
          >
            Learn
            <span className="text-cyan-400">
              Hub
            </span>
          </button>

          <button
            onClick={() =>
              router.push(
                `/courses/${courseName}`
              )
            }
            className="rounded-xl border border-white/10 px-5 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400"
          >
            ← Back to Course
          </button>

        </div>

      </nav>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-12">

        {/* HEADER */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="font-bold tracking-[0.2em] text-cyan-400">
              LESSON{" "}
              {lesson.order ||
                lessonId}
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-5xl">
              {lesson.title}
            </h1>

            <p className="mt-4 text-slate-400">
              Course:{" "}
              {courseName}
            </p>

          </div>

          {/* COMPLETED BADGE */}

          {completed && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
              ✓ Lesson Completed
            </div>
          )}

        </div>

        {/* =====================================================
            PROGRESS BAR
        ===================================================== */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold text-slate-300">
                Course Progress
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {
                  getCompletedLessons(
                    courseName
                  ).length
                }{" "}
                of{" "}
                {TOTAL_LESSONS}{" "}
                lessons completed
              </p>

            </div>

            <span className="text-xl font-black text-cyan-400">
              {progress}%
            </span>

          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          {/* PROGRESS STEPS */}

          <div className="mt-4 flex justify-between">

            {Array.from({
              length: TOTAL_LESSONS,
            }).map(
              (_, index) => {
                const number =
                  index + 1;

                const done =
                  getCompletedLessons(
                    courseName
                  ).includes(
                    number
                  );

                return (
                  <div
                    key={number}
                    className={`flex items-center gap-2 text-xs font-bold ${
                      done
                        ? "text-emerald-400"
                        : "text-slate-600"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        done
                          ? "bg-emerald-400/20"
                          : "bg-slate-800"
                      }`}
                    >
                      {done
                        ? "✓"
                        : number}
                    </span>

                    <span className="hidden sm:inline">
                      Lesson{" "}
                      {number}
                    </span>
                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* =====================================================
            VIDEO
        ===================================================== */}

        {lesson.videoUrl && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">

            <div className="aspect-video">

              <iframe
                src={youtubeUrl(
                  lesson.videoUrl
                )}
                title={
                  lesson.title
                }
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

            </div>

          </div>
        )}

        {/* =====================================================
            LESSON CONTENT
        ===================================================== */}

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="flex items-center justify-between gap-4">

            <h2 className="text-2xl font-black">
              About this lesson
            </h2>

            {completed && (
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">
                Completed ✓
              </span>
            )}

          </div>

          <p className="mt-5 whitespace-pre-line leading-8 text-slate-300">
            {lesson.content}
          </p>

        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* PREVIOUS */}

          {lessonId > 1 ? (
            <button
              onClick={() =>
                router.push(
                  `/courses/${courseName}/lesson/${
                    lessonId - 1
                  }`
                )
              }
              className="rounded-xl border border-white/10 px-6 py-3 font-bold transition hover:border-cyan-400 hover:text-cyan-400"
            >
              ← Previous Lesson
            </button>
          ) : (
            <button
              onClick={() =>
                router.push(
                  `/courses/${courseName}`
                )
              }
              className="rounded-xl border border-white/10 px-6 py-3 font-bold transition hover:border-cyan-400 hover:text-cyan-400"
            >
              ← Course
            </button>
          )}

          {/* COMPLETE / NEXT */}

          {!isLastLesson ? (
            <button
              onClick={
                handleNextLesson
              }
              className="rounded-xl bg-cyan-400 px-7 py-3 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              {completed
                ? "Next Lesson →"
                : "✓ Complete Lesson →"}
            </button>
          ) : (
            <button
              onClick={
                handleNextLesson
              }
              className="rounded-xl bg-cyan-400 px-7 py-3 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              {completed
                ? "Take Quiz →"
                : "✓ Complete Course →"}
            </button>
          )}

        </div>

        {/* =====================================================
            COURSE COMPLETED
        ===================================================== */}

        {isLastLesson &&
          completed && (
            <div className="mt-10 rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 p-10 text-center">

              <div className="text-6xl">
                🎉
              </div>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Course Completed!
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
                Congratulations! You
                have completed all{" "}
                {TOTAL_LESSONS}{" "}
                lessons in this
                course.
              </p>

              {/* 100% */}

              <div className="mx-auto mt-7 max-w-md">

                <div className="flex justify-between text-sm font-bold">

                  <span>
                    Course Progress
                  </span>

                  <span className="text-emerald-400">
                    100%
                  </span>

                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">

                  <div className="h-full w-full rounded-full bg-emerald-400" />

                </div>

              </div>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

                <button
                  onClick={() =>
                    router.push(
                      `/courses/${courseName}`
                    )
                  }
                  className="rounded-xl border border-white/10 px-7 py-3 font-bold transition hover:border-cyan-400"
                >
                  ← Back to Course
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/courses/${courseName}/quiz`
                    )
                  }
                  className="rounded-xl bg-cyan-400 px-8 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  🧠 Take Quiz →
                </button>

              </div>

            </div>
          )}

      </section>

    </main>
  );
}