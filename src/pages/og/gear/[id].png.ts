import { generateOGImage } from "@/lib/og";
import { GEAR_CATEGORY_LABELS_EN } from "@/lib/gear";
import { getCollection } from "astro:content";
import site_config from "@/site-config.json";
import { parse, format } from "date-fns";
import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const items = await getCollection("gear");
  return items
    .filter((item) => !item.data.draft)
    .map((item) => ({
      params: { id: item.id },
      props: { item },
    }));
}

export const GET: APIRoute = async ({ props }) => {
  const { item } = props as any;
  const { title, category, date } = item.data;
  const formattedDate = format(
    parse(date, "dd-MM-yyyy", new Date()),
    "MMM dd, yyyy",
  );

  const png = await generateOGImage({
    title,
    description: "",
    siteName: site_config.site.name,
    category: GEAR_CATEGORY_LABELS_EN[category],
    date: formattedDate,
  });

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
