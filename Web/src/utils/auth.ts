const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const createCaptchaCode = (length = 4) =>
  Array.from({ length }, () => CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]).join("");

export const createEmailCode = (length = 6) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
