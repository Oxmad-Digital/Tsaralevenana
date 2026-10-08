export type Device = "desktop" | "mobile" | "tablet";

const TABLET_PATTERN = /ipad|tablet|playbook|silk|kindle/i;
const MOBILE_PATTERN = /mobi|iphone|ipod|android|windows phone|blackberry/i;

export function getDevice(userAgent: string | null): Device {
  if (!userAgent) return "desktop";
  if (TABLET_PATTERN.test(userAgent)) return "tablet";
  // Android tablets omit "Mobile" from their user-agent; phones include it.
  if (/android/i.test(userAgent) && !/mobile/i.test(userAgent)) return "tablet";
  if (MOBILE_PATTERN.test(userAgent)) return "mobile";
  return "desktop";
}
