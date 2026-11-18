import { getCollection, render } from "astro:content";

export type ResumeSection =
  | "resume-experience"
  | "resume-projects"
  | "resume-education"
  | "resume-volunteering"
  | "resume-certifications";

/**
 * Loads and renders one resume collection for a given language.
 *
 * `order` is authored chronologically (earliest entry = 1). Sections that
 * should show the newest entry first pass `direction: "desc"`; the rest keep
 * the default ascending order.
 */
export async function loadResumeSection(
  name: ResumeSection,
  lang: "zh" | "en",
  direction: "asc" | "desc" = "asc",
) {
  const entries = (await getCollection(name))
    .filter((e) => e.data.lang === lang && !e.data.draft)
    .sort((a, b) =>
      direction === "desc" ? b.data.order - a.data.order : a.data.order - b.data.order,
    );
  return Promise.all(
    entries.map(async (e) => {
      const { Content, headings } = await render(e);
      return { data: e.data, Content, headings };
    }),
  );
}
