import { config } from "@/config";

function toICSDate(iso: string) {
  // local ISO -> UTC basic format
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildICS() {
  const { wedding, venue, couple } = config;
  const title = `${couple.bride.name} & ${couple.groom.name} — Wedding`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wedding`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(wedding.isoStart)}`,
    `DTEND:${toICSDate(wedding.isoEnd)}`,
    `SUMMARY:${title}`,
    `LOCATION:${venue.name}, ${venue.city}`,
    `DESCRIPTION:${title} at ${venue.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS() {
  const blob = new Blob([buildICS()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function googleCalendarLink() {
  const { wedding, venue, couple } = config;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${couple.bride.name} & ${couple.groom.name} — Wedding`,
    dates: `${toICSDate(wedding.isoStart)}/${toICSDate(wedding.isoEnd)}`,
    location: `${venue.name}, ${venue.address}`,
    details: "We would be honoured by your presence.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function saveTheDate() {
  if (typeof window === "undefined") return;
  const ua = navigator.userAgent || "";
  const isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua);
  if (isApple) {
    downloadICS();
  } else {
    window.open(googleCalendarLink(), "_blank", "noopener,noreferrer");
  }
}

export type Rsvp = {
  name: string;
  guests: number;
  message: string;
  createdAt: string;
};

const RSVP_KEY = "wedding-rsvps";

export function saveRsvp(entry: Omit<Rsvp, "createdAt">) {
  const all = readRsvps();
  all.push({ ...entry, createdAt: new Date().toISOString() });
  localStorage.setItem(RSVP_KEY, JSON.stringify(all));
}

export function readRsvps(): Rsvp[] {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY) ?? "[]") as Rsvp[];
  } catch {
    return [];
  }
}
