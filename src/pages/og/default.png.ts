import { generateOGImage } from "@/lib/og";
import site_config from "@/site-config.json";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    title: site_config.site.title,
    description: site_config.site.description,
    siteName: site_config.site.name,
  });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
