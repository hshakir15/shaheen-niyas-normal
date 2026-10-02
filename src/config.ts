// ============================================================
//  EDIT EVERYTHING HERE
//  All names, dates, texts, images, links live in this one file.
// ============================================================
import introVideo from "@/assets/intro.mp4.asset.json";
import introPoster from "@/assets/intro-poster.jpg.asset.json";
import introLastFrame from "@/assets/intro-last-frame.jpg.asset.json";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export const config = {
  // ---------- MEDIA ----------
  media: {
    introVideo: "/intro-video.mp4",
    introPoster: introPoster.url,
    introLastFrame: introLastFrame.url,
    // Optional background music file URL (leave empty for none)
    music: "/music.mp3",
    gallery: [gallery1, gallery2, gallery3, gallery4],
  },

  // ---------- COUPLE ----------
  couple: {
    groom: {
      name: "Mohammed Niyas",
      parents: "S/O",
      details: "Late Mohammed Salim Koya\n& Faseela Salim",
    },
    bride: {
      name: "Shaheen",
      parents: "D/O",
      details: "P. Ammabba & Fathimath Razia",
    },
  },

  // ---------- DATE & TIME ----------
  wedding: {
    // ISO date-time of the ceremony (local time)
    isoStart: "2026-10-15T11:00:00",
    isoEnd: "2026-10-15T14:00:00",
    dateLabel: "October 15, 2026",
    hijriDate: "🌙 4 Jumada al-Awwal 1448 AH",
    weekday: "Thursday",
    timeLabel: "11:30 AM",
  },

  // ---------- TEXTS ----------
  texts: {
    heroKicker: "We're getting married",
    welcomeArabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    welcomeTranslation:
      "“And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy. Surely in this are signs for those who reflect.”",
    welcomeCitation: "— Surah Ar-Rum 30:21",
    closing: "With the blessings of Allah, we invite you to share in our joyous beginning.",
  },

  // ---------- TIMELINE ----------
  timeline: [
    { title: "Guest Arrival", date: "October 15, 2026", time: "10:30 AM" },
    { title: "Nikah Ceremony", date: "October 15, 2026", time: "11:30 AM" },
    { title: "Walima Reception", date: "October 15, 2026", time: "12:30 PM" },
  ],

  // ---------- VENUE ----------
  venue: {
    name: "Shadi Mahal",
    city: "Bolar, Mangalore - 575001",
    address: "Shadi Mahal, Bolar, Mangalore - 575001",
    mapEmbed:
      "https://www.google.com/maps?q=Shadi+Mahal+Bolar+Mangalore&output=embed",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Shadi+Mahal+Bolar+Mangalore",
  },

  // ---------- DRESS CODE ----------
  dressCode: {
    women: "Pastel sarees or traditional attire in elegant tones.",
    men: "Formal sherwani, suit, or traditional attire.",
  },

  // ---------- PRE-WEDDING EVENTS ----------
  preEvents: [
    { name: "Mehendi", date: "October 14, 2026", time: "05:00 PM", location: "Bride's Residence" },
    { name: "Haldi", date: "October 14, 2026", time: "10:00 AM", location: "Bride's Residence" },
  ],

  // ---------- EXTRA INFO ----------
  transportation:
    "Venue is conveniently located at Shadi Mahal, Bolar, Mangalore with parking available for guests.",
  accommodation:
    "Accommodation arrangements can be made upon request. Please contact the family for assistance.",
  gifts:
    "Your presence and prayers are the greatest gift of all. Should you wish to give something more, a warm note or blessing will be treasured forever.",
};

export type Config = typeof config;
