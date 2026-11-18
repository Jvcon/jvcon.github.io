import { GEAR_CATEGORIES, type gearCategoryType } from "./categories";

export const GEAR_CATEGORY_LABELS: Record<gearCategoryType, string> = {
  compute: "电脑与外设",
  mobile: "手机与音频",
  wearable: "手表与穿戴",
  reading: "阅读",
  travel: "背包与出行",
  home: "家居与厨房",
  network: "网络与存储",
};

export const GEAR_CATEGORY_LABELS_EN: Record<gearCategoryType, string> = {
  compute: "COMPUTE",
  mobile: "MOBILE",
  wearable: "WEARABLE",
  reading: "READING",
  travel: "TRAVEL",
  home: "HOME",
  network: "NETWORK",
};

export const GEAR_STATUS_LABELS = {
  current: "在役",
  retired: "退役",
  replaced: "已替换",
} as const;

export const GEAR_VERDICT_LABELS = {
  "buy-again": "会再买",
  maybe: "看情况",
  no: "不会",
} as const;

export const GEAR_ACQUIRED_VIA_LABELS = {
  bought: "购入",
  gift: "赠礼",
  work: "工作设备",
  secondhand: "二手",
} as const;

export const GEAR_CATEGORY_ORDER = GEAR_CATEGORIES;

export function formatAcquired(value: string): string {
  const [year, month] = value.split("-");
  if (!month) return year;
  return `${year} 年 ${Number(month)} 月`;
}

export function formatPrice(price?: number, currency = "CNY"): string {
  if (price === undefined) return "";
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatUpdated(value?: string): string {
  if (!value) return "";
  const [day, month, year] = value.split("-");
  if (!year) return value;
  return `${year}-${month}-${day}`;
}
