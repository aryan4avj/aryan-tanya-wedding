// Serves each celebration as an .ics file, plus all of them together:
//   /calendar/haldi-mehndi.ics  ...  /calendar/all.ics
// Built at deploy time from src/data/events.ts, so the files always match the site.
import { weddingEvents } from "@/data/events";
import { ALL_EVENTS_ID, buildICS, icsFileName } from "@/lib/calendar";

// Only the files listed below exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return [...weddingEvents.map((e) => e.id), ALL_EVENTS_ID].map((id) => ({ file: `${id}.ics` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const id = file.replace(/\.ics$/, "");
  const events = id === ALL_EVENTS_ID ? weddingEvents : weddingEvents.filter((e) => e.id === id);
  if (!file.endsWith(".ics") || events.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildICS(events), {
    headers: {
      // text/calendar + inline is what makes iPhone Safari open the "Add to Calendar" sheet
      // directly, instead of saving a file. Android/desktop browsers download it.
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${icsFileName(id)}"`,
    },
  });
}
