export function t(field: any, lang: "zh" | "en" = "zh"): any {
  if (field && typeof field === "object" && ("zh" in field || "en" in field)) {
    return field[lang] || (lang === "en" ? field.zh : field.en) || "";
  }
  return field;
}

export function localizeData(obj: any, lang: "zh" | "en" = "zh"): any {
  if (Array.isArray(obj)) return obj.map((v) => localizeData(v, lang));
  if (obj && typeof obj === "object") {
    if ("zh" in obj || "en" in obj) return t(obj, lang);
    const out: any = {};
    for (const k in obj) out[k] = localizeData(obj[k], lang);
    return out;
  }
  return obj;
}
