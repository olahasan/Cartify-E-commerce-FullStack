import { COUNTRY_CODES } from "@shared/constants/countryCodes";

export const extractCountryCode = (phone?: string) => {
  if (!phone) return "";

  const sortedCodes = [...COUNTRY_CODES]
    .map((c) => c.code)
    .sort((a, b) => b.length - a.length);

  const foundCode = sortedCodes.find((code) => phone.startsWith(code));

  return foundCode ?? "";
};

export const extractPhone = (phone?: string) => {
  if (!phone) return "";

  const code = extractCountryCode(phone);
  return code ? phone.slice(code.length) : phone;
};
