import jsPDF from "jspdf";
import type { City, Itinerary, ItineraryData, DayPlan } from "@/types";

// ─── Layout constants ─────────────────────────────────────────────────────────

const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297;
const MARGIN_LEFT = 18;
const MARGIN_RIGHT = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 174 mm

// ─── Brand colors [R, G, B] ───────────────────────────────────────────────────

const COLOR_NAVY = [10, 25, 49] as const;
const COLOR_OCEAN = [26, 61, 99] as const;
const COLOR_SKY = [74, 127, 167] as const;
const COLOR_MIST = [179, 207, 229] as const;
const COLOR_CLOUD = [246, 250, 253] as const;
const COLOR_TEXT_BODY = [80, 100, 120] as const;
const COLOR_TEXT_DARK = [30, 40, 55] as const;
const COLOR_RULE = [220, 232, 242] as const;

// ─── Cursor helper ────────────────────────────────────────────────────────────

class Cursor {
  y: number;
  doc: jsPDF;

  constructor(doc: jsPDF, startY = 20) {
    this.doc = doc;
    this.y = startY;
  }

  advance(amount: number) {
    this.y += amount;
    return this.y;
  }

  breakIfNeeded(needed: number) {
    if (this.y + needed > PAGE_HEIGHT - 20) {
      this.doc.addPage();
      this.y = 20;
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateItineraryPDF(
  city: City,
  itinerary: Itinerary
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const cur = new Cursor(doc, 0);

  drawCoverPage(doc, cur, city, itinerary);
  drawItinerarySection(doc, cur, "1-Day Itinerary", itinerary.itineraries["1day"]);
  drawItinerarySection(doc, cur, "3-Day Itinerary", itinerary.itineraries["3days"]);
  drawItinerarySection(doc, cur, "5-Day Itinerary", itinerary.itineraries["5days"]);
  drawFooterOnAllPages(doc, city);

  const filename = `itinerai-${city.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}

// ─── Section builders ─────────────────────────────────────────────────────────

function drawCoverPage(doc: jsPDF, cur: Cursor, city: City, itinerary: Itinerary) {
  // Navy header band
  doc.setFillColor(...COLOR_NAVY);
  doc.rect(0, 0, PAGE_WIDTH, 62, "F");

  // "ItinerAI" wordmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_SKY);
  doc.text("Itiner", MARGIN_LEFT, 18);
  const wordWidth = doc.getTextWidth("Itiner");
  doc.setTextColor(...COLOR_MIST);
  doc.text("AI", MARGIN_LEFT + wordWidth, 18);

  // Generation date — top-right
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MIST);
  doc.text(dateStr, PAGE_WIDTH - MARGIN_RIGHT, 18, { align: "right" });

  // City name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(...COLOR_CLOUD);
  doc.text(city.name, MARGIN_LEFT, 41);

  // Country
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_MIST);
  doc.text(city.country, MARGIN_LEFT, 53);

  // Divider below band
  doc.setDrawColor(...COLOR_SKY);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_LEFT, 64, PAGE_WIDTH - MARGIN_RIGHT, 64);

  cur.y = 74;

  drawHighlights(doc, cur, itinerary.highlights);
}

function drawHighlights(doc: jsPDF, cur: Cursor, highlights: string[]) {
  cur.breakIfNeeded(30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_SKY);
  doc.text("TOP HIGHLIGHTS", MARGIN_LEFT, cur.y);
  cur.advance(7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_BODY);

  highlights.forEach((tag) => {
    cur.breakIfNeeded(7);
    doc.setFillColor(...COLOR_SKY);
    doc.circle(MARGIN_LEFT + 1.5, cur.y - 1.5, 1.2, "F");
    doc.text(tag, MARGIN_LEFT + 5, cur.y);
    cur.advance(6);
  });

  cur.advance(6);
  doc.setDrawColor(...COLOR_RULE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, cur.y, PAGE_WIDTH - MARGIN_RIGHT, cur.y);
}

function drawItinerarySection(
  doc: jsPDF,
  cur: Cursor,
  label: string,
  data: ItineraryData
) {
  doc.addPage();
  cur.y = 20;

  // Section banner
  doc.setFillColor(...COLOR_OCEAN);
  doc.roundedRect(MARGIN_LEFT, cur.y - 5, CONTENT_WIDTH, 12, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_CLOUD);
  doc.text(label.toUpperCase(), MARGIN_LEFT + 4, cur.y + 3);
  cur.advance(16);

  // Subtitle
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_BODY);
  doc.text(data.title, MARGIN_LEFT, cur.y);
  cur.advance(9);

  const showDayHeader = data.days.length > 1;
  data.days.forEach((day) => drawDay(doc, cur, day, showDayHeader));
}

function drawDay(doc: jsPDF, cur: Cursor, day: DayPlan, showDayHeader: boolean) {
  if (showDayHeader) {
    cur.breakIfNeeded(16);

    // "Day N" pill
    doc.setFillColor(...COLOR_SKY);
    doc.roundedRect(MARGIN_LEFT, cur.y - 4.5, 22, 7.5, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_CLOUD);
    doc.text(`Day ${day.day}`, MARGIN_LEFT + 3, cur.y + 0.5);

    // Theme
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.text(day.theme, MARGIN_LEFT + 26, cur.y + 0.5);
    cur.advance(10);
  }

  day.activities.forEach((activity) => {
    cur.breakIfNeeded(28);

    // Time
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_SKY);
    doc.text(activity.time, MARGIN_LEFT, cur.y);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.text(activity.title, MARGIN_LEFT + 16, cur.y);
    cur.advance(5.5);

    // Description (wrapped)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_TEXT_BODY);
    const descLines = doc.splitTextToSize(activity.description, CONTENT_WIDTH - 16);
    descLines.forEach((line: string) => {
      cur.breakIfNeeded(5);
      doc.text(line, MARGIN_LEFT + 16, cur.y);
      cur.advance(4.5);
    });

    // Tip
    if (activity.tip) {
      cur.breakIfNeeded(10);
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_SKY);
      doc.text("Tip:", MARGIN_LEFT + 16, cur.y);

      doc.setFont("helvetica", "italic");
      doc.setTextColor(...COLOR_TEXT_BODY);
      const tipLines = doc.splitTextToSize(activity.tip, CONTENT_WIDTH - 26);
      if (tipLines.length > 0) {
        doc.text(tipLines[0], MARGIN_LEFT + 24, cur.y);
        cur.advance(4);
        tipLines.slice(1).forEach((line: string) => {
          cur.breakIfNeeded(4.5);
          doc.text(line, MARGIN_LEFT + 24, cur.y);
          cur.advance(4);
        });
      }
    }

    // Activity divider
    cur.advance(3);
    doc.setDrawColor(...COLOR_RULE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_LEFT + 16, cur.y, PAGE_WIDTH - MARGIN_RIGHT, cur.y);
    cur.advance(5);
  });

  cur.advance(4);
}

function drawFooterOnAllPages(doc: jsPDF, city: City) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLOR_RULE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_LEFT, PAGE_HEIGHT - 14, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MIST);
    doc.text(`ItinerAI — ${city.name} Travel Plan`, MARGIN_LEFT, PAGE_HEIGHT - 9);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 9, {
      align: "right",
    });
  }
}
