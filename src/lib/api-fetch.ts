import { ClassInfo, Coach, Court, Student, Banner, Tournament, TuitionPlan, FAQ, Review } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6080/api";

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertKeysToCamelCase(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        snakeToCamel(key),
        convertKeysToCamelCase(value),
      ])
    );
  }
  return obj;
}

async function fetchPublicData<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}/public/${endpoint}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.map((item) => convertKeysToCamelCase(item) as T);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export async function getBanners(): Promise<Banner[]> {
  return fetchPublicData<Banner>("banners");
}

export async function getCoaches(): Promise<Coach[]> {
  return fetchPublicData<Coach>("coaches");
}

export async function getCourts(): Promise<Court[]> {
  return fetchPublicData<Court>("courts");
}

export async function getClasses(): Promise<ClassInfo[]> {
  return fetchPublicData<ClassInfo>("classes");
}

export async function getStudents(): Promise<Student[]> {
  return [];
}

export async function getTournaments(): Promise<Tournament[]> {
  return fetchPublicData<Tournament>("tournaments");
}

export async function getTuitionPlans(): Promise<TuitionPlan[]> {
  return fetchPublicData<TuitionPlan>("tuition-plans");
}

export async function getFAQs(): Promise<FAQ[]> {
  return fetchPublicData<FAQ>("faqs");
}

export async function getReviews(): Promise<Review[]> {
  return fetchPublicData<Review>("reviews");
}
