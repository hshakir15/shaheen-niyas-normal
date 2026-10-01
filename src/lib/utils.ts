import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAbsoluteUrl(path: string = "/og-image.jpg"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof process !== "undefined" && process.env?.SITE_URL) {
    const site = process.env.SITE_URL.replace(/\/+$/, "");
    return `${site}${cleanPath}`;
  }
  if (typeof process !== "undefined" && process.env?.VERCEL_URL) {
    const vercel = process.env.VERCEL_URL.replace(/\/+$/, "");
    const protocol = vercel.startsWith("http") ? "" : "https://";
    return `${protocol}${vercel}${cleanPath}`;
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${cleanPath}`;
  }
  return `https://shaheen-wedding.vercel.app${cleanPath}`;
}
