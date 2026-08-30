// app/lib/learning.ts

/* =========================================================
   TYPES
========================================================= */

export type EnrolledCourse = {
  slug: string;
  name: string;
  icon: string;
  category: string;
  totalLessons: number;
  progress: number;
  completedLessons: number;
};

/* =========================================================
   STORAGE KEYS
========================================================= */

const ENROLLMENTS_KEY = "learnhubEnrollments";
const PROGRESS_KEY = "learnhubProgress";

/* =========================================================
   BROWSER CHECK
========================================================= */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/* =========================================================
   GET COMPLETED LESSONS
========================================================= */

export function getCompletedLessons(
  slug: string
): number[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const key = `learnhubCompletedLessons_${slug}`;

    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return [
      ...new Set(
        parsed
          .map(Number)
          .filter(
            (id) =>
              Number.isFinite(id) &&
              id > 0
          )
      ),
    ].sort((a, b) => a - b);
  } catch (error) {
    console.error(
      "Failed to get completed lessons:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET COMPLETED LESSON COUNT
========================================================= */

export function getCompletedLessonCount(
  slug: string
): number {
  return getCompletedLessons(slug).length;
}

/* =========================================================
   CALCULATE COURSE PROGRESS
========================================================= */

export function calculateCourseProgress(
  slug: string,
  totalLessons: number
): number {
  if (totalLessons <= 0) {
    return 0;
  }

  const completedLessons =
    getCompletedLessonCount(slug);

  return Math.min(
    100,
    Math.round(
      (completedLessons / totalLessons) * 100
    )
  );
}

/* =========================================================
   GET ENROLLMENTS
========================================================= */

function getEnrollmentData(): any[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(
        ENROLLMENTS_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to read enrollments:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET ENROLLED COURSES
========================================================= */

export function getEnrolledCourses(): EnrolledCourse[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const enrollments =
      getEnrollmentData();

    return enrollments
      .map((course: any) => {
        const slug =
          typeof course === "string"
            ? course
            : course?.slug;

        if (!slug) {
          return null;
        }

        const totalLessons =
          typeof course === "string"
            ? 3
            : Number(course?.totalLessons) || 3;

        const completedLessons =
          getCompletedLessonCount(slug);

        const progress =
          calculateCourseProgress(
            slug,
            totalLessons
          );

        return {
          slug,

          name:
            typeof course === "string"
              ? slug
              : course?.name || slug,

          icon:
            typeof course === "string"
              ? "📚"
              : course?.icon || "📚",

          category:
            typeof course === "string"
              ? "Course"
              : course?.category || "Course",

          totalLessons,

          progress,

          completedLessons,
        };
      })
      .filter(
        Boolean
      ) as EnrolledCourse[];
  } catch (error) {
    console.error(
      "Failed to load enrolled courses:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET ALL ENROLLED COURSES
========================================================= */

export function getAllEnrolledCourses(): EnrolledCourse[] {
  return getEnrolledCourses();
}

/* =========================================================
   GET SINGLE ENROLLED COURSE
========================================================= */

export function getEnrolledCourse(
  slug: string
): EnrolledCourse | null {
  const courses =
    getEnrolledCourses();

  return (
    courses.find(
      (course) =>
        course.slug === slug
    ) || null
  );
}

/* =========================================================
   ENROLL COURSE
========================================================= */

export function enrollCourse(course: {
  slug: string;
  name: string;
  icon: string;
  category: string;
  totalLessons: number;
}): void {
  if (!isBrowser()) {
    return;
  }

  try {
    let enrollments =
      getEnrollmentData();

    const alreadyEnrolled =
      enrollments.some(
        (item: any) => {
          if (
            typeof item === "string"
          ) {
            return (
              item === course.slug
            );
          }

          return (
            item?.slug ===
            course.slug
          );
        }
      );

    if (!alreadyEnrolled) {
      enrollments.push({
        slug: course.slug,
        name: course.name,
        icon: course.icon,
        category: course.category,
        totalLessons:
          course.totalLessons,
      });
    }

    localStorage.setItem(
      ENROLLMENTS_KEY,
      JSON.stringify(enrollments)
    );

    /* Initialize progress */

    const progressData =
      getProgressData();

    if (
      typeof progressData[
        course.slug
      ] !== "number"
    ) {
      progressData[
        course.slug
      ] = 0;

      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify(
          progressData
        )
      );
    }

    notifyLearningChange();
  } catch (error) {
    console.error(
      "Failed to enroll course:",
      error
    );
  }
}

/* =========================================================
   REMOVE ENROLLMENT
========================================================= */

export function removeEnrollment(
  slug: string
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const enrollments =
      getEnrollmentData();

    const remaining =
      enrollments.filter(
        (course: any) => {
          if (
            typeof course === "string"
          ) {
            return (
              course !== slug
            );
          }

          return (
            course?.slug !== slug
          );
        }
      );

    localStorage.setItem(
      ENROLLMENTS_KEY,
      JSON.stringify(remaining)
    );

    /* Remove progress */

    const progressData =
      getProgressData();

    delete progressData[slug];

    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(
        progressData
      )
    );

    /* Remove completed lessons */

    localStorage.removeItem(
      `learnhubCompletedLessons_${slug}`
    );

    /* Remove old progress key if it exists */

    localStorage.removeItem(
      `learnhubCourseProgress_${slug}`
    );

    notifyLearningChange();
    notifyProgressChange();
  } catch (error) {
    console.error(
      "Failed to remove enrollment:",
      error
    );
  }
}

/* =========================================================
   GET PROGRESS DATA
========================================================= */

function getProgressData(): Record<
  string,
  number
> {
  if (!isBrowser()) {
    return {};
  }

  try {
    const stored =
      localStorage.getItem(
        PROGRESS_KEY
      );

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(
      stored
    );

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }

    return {};
  } catch {
    return {};
  }
}

/* =========================================================
   GET COURSE PROGRESS
========================================================= */

export function getCourseProgress(
  slug: string
): number {
  const course =
    getEnrolledCourse(slug);

  if (course) {
    return course.progress;
  }

  /*
   * Even if the course is not found
   * in enrollments, calculate from
   * completed lessons.
   */

  const completed =
    getCompletedLessonCount(
      slug
    );

  if (completed === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (completed / 3) * 100
    )
  );
}

/* =========================================================
   SET COURSE PROGRESS
========================================================= */

export function setCourseProgress(
  slug: string,
  progress: number
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const safeProgress =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(progress)
        )
      );

    const progressData =
      getProgressData();

    progressData[slug] =
      safeProgress;

    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(
        progressData
      )
    );

    /*
     * Also save individual
     * course progress for
     * compatibility.
     */

    localStorage.setItem(
      `learnhubCourseProgress_${slug}`,
      String(safeProgress)
    );

    notifyProgressChange();
  } catch (error) {
    console.error(
      "Failed to set course progress:",
      error
    );
  }
}

/* =========================================================
   UPDATE COURSE PROGRESS
========================================================= */

export function updateCourseProgress(
  slug: string,
  completedLessons: number,
  totalLessons: number
): void {
  if (totalLessons <= 0) {
    setCourseProgress(
      slug,
      0
    );

    return;
  }

  const safeCompleted =
    Math.max(
      0,
      Math.min(
        completedLessons,
        totalLessons
      )
    );

  const progress =
    Math.round(
      (safeCompleted /
        totalLessons) *
        100
    );

  setCourseProgress(
    slug,
    progress
  );
}

/* =========================================================
   COMPLETE LESSON
========================================================= */

export function completeLesson(
  slug: string,
  lessonId: number,
  totalLessons: number
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    if (
      !Number.isFinite(
        lessonId
      ) ||
      lessonId <= 0
    ) {
      return;
    }

    const key =
      `learnhubCompletedLessons_${slug}`;

    let completed =
      getCompletedLessons(
        slug
      );

    /*
     * Add lesson only once.
     */

    if (
      !completed.includes(
        lessonId
      )
    ) {
      completed.push(
        lessonId
      );
    }

    /*
     * Remove duplicates
     * and sort lesson IDs.
     */

    completed = [
      ...new Set(completed),
    ].sort(
      (a, b) => a - b
    );

    localStorage.setItem(
      key,
      JSON.stringify(
        completed
      )
    );

    /*
     * Calculate exact progress.
     *
     * 1 / 3 = 33%
     * 2 / 3 = 67%
     * 3 / 3 = 100%
     */

    updateCourseProgress(
      slug,
      completed.length,
      totalLessons
    );

    /*
     * Notify every page.
     */

    notifyProgressChange();
    notifyLearningChange();

    console.log(
      "LearnHub lesson completed:",
      {
        course: slug,
        lesson: lessonId,
        completedLessons:
          completed,
        totalLessons,
        progress:
          Math.round(
            (completed.length /
              totalLessons) *
              100
          ),
      }
    );
  } catch (error) {
    console.error(
      "Failed to complete lesson:",
      error
    );
  }
}

/* =========================================================
   CHECK LESSON COMPLETION
========================================================= */

export function isLessonCompleted(
  slug: string,
  lessonId: number
): boolean {
  const completed =
    getCompletedLessons(
      slug
    );

  return completed.includes(
    lessonId
  );
}

/* =========================================================
   CHECK COURSE COMPLETION
========================================================= */

export function isCourseCompleted(
  slug: string
): boolean {
  const course =
    getEnrolledCourse(slug);

  if (!course) {
    return false;
  }

  return (
    course.totalLessons > 0 &&
    course.completedLessons >=
      course.totalLessons
  );
}

/* =========================================================
   GET COURSE COMPLETION STATUS
========================================================= */

export function getCourseCompletionStatus(
  slug: string
): {
  completedLessons: number;
  totalLessons: number;
  progress: number;
  isCompleted: boolean;
} {
  const course =
    getEnrolledCourse(slug);

  const totalLessons =
    course?.totalLessons || 3;

  const completedLessons =
    getCompletedLessonCount(
      slug
    );

  const progress =
    Math.min(
      100,
      Math.round(
        (completedLessons /
          totalLessons) *
          100
      )
    );

  return {
    completedLessons,
    totalLessons,
    progress,
    isCompleted:
      completedLessons >=
      totalLessons,
  };
}

/* =========================================================
   LOGGED-IN USER
========================================================= */

export function isLoggedIn(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return Boolean(
    localStorage.getItem(
      "learnhubUser"
    )
  );
}

/* =========================================================
   LEARNING DATA CHANGE LISTENER
========================================================= */

export function onLearningDataChange(
  callback: () => void
): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handler = () => {
    callback();
  };

  window.addEventListener(
    "learnhubEnrollmentChanged",
    handler
  );

  window.addEventListener(
    "learnhubProgressChanged",
    handler
  );

  window.addEventListener(
    "storage",
    handler
  );

  return () => {
    window.removeEventListener(
      "learnhubEnrollmentChanged",
      handler
    );

    window.removeEventListener(
      "learnhubProgressChanged",
      handler
    );

    window.removeEventListener(
      "storage",
      handler
    );
  };
}

/* =========================================================
   EVENTS
========================================================= */

function notifyLearningChange(): void {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new Event(
      "learnhubEnrollmentChanged"
    )
  );
}

function notifyProgressChange(): void {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new Event(
      "learnhubProgressChanged"
    )
  );
}