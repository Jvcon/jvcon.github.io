import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const resumeBase = {
  lang: z.enum(["zh", "en"]),
  order: z.number(),
  draft: z.boolean().default(false),
};

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    schema: z.object({
      draft: z.boolean(),
      date: z.string(),
      title: z.string(),
      description: z.string(),
      category: z.enum(["engineering", "workflow", "strategy", "devlog"]),
      tags: z.array(z.string()).optional().default([]),
      author: z.string().optional().default("Subhashis Hansda"),
    }),
  }),
  "resume-experience": defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/resume/experience" }),
    schema: z.object({
      ...resumeBase,
      organization: z.string(),
      position: z.string(),
      employmentType: z.string().optional().default(""),
      startDate: z.string(),
      endDate: z.string(),
      location: z.string(),
    }),
  }),
  "resume-projects": defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/resume/projects" }),
    schema: z.object({
      ...resumeBase,
      name: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      url: z.string().optional().default(""),
    }),
  }),
  "resume-education": defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/resume/education" }),
    schema: z.object({
      ...resumeBase,
      institution: z.string(),
      degree: z.string(),
      fieldOfStudy: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      grade: z.string().optional().default(""),
    }),
  }),
  "resume-volunteering": defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/resume/volunteering" }),
    schema: z.object({
      ...resumeBase,
      organization: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  }),
  "resume-certifications": defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/resume/certifications" }),
    schema: z.object({
      ...resumeBase,
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      url: z.string().optional().default(""),
      credentialId: z.string().optional().default(""),
    }),
  }),
};