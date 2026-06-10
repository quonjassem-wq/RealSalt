// Stable per-browser fingerprint stored in localStorage. Not a real HWID — for
// rate-limit / ban-by-browser only. Real HWID is sent by the C# client to /api/public/validate.
const KEY = "salt.hwid";

export function getHwid(): string {
  if (typeof window === "undefined") return "";
  try {
    let v = localStorage.getItem(KEY);
    if (!v) {
      v = "W-" + crypto.randomUUID().replace(/-/g, "");
      localStorage.setItem(KEY, v);
    }
    return v;
  } catch { return ""; }
}
