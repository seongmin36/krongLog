/** 2026.02.25 형식 날짜 */
export function formatDotDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

/** 아카이브처럼 시간까지 표시하는 날짜는 빌드 환경(UTC)과 무관하게 KST 기준으로 포맷 */
const kstFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function kstParts(date: Date) {
  const parts = kstFormatter.formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)!.value;
  return {
    year: pick("year"),
    month: pick("month"),
    day: pick("day"),
    hour: pick("hour"),
    minute: pick("minute"),
  };
}

/** 2026.10.21 (KST) */
export function formatKstDotDate(date: Date): string {
  const { year, month, day } = kstParts(date);
  return `${year}.${month}.${day}`;
}

/** 10.21 (KST) */
export function formatKstMonthDay(date: Date): string {
  const { month, day } = kstParts(date);
  return `${month}.${day}`;
}

/** 01:42 (KST) */
export function formatKstTime(date: Date): string {
  const { hour, minute } = kstParts(date);
  return `${hour}:${minute}`;
}
