/** Converts an Indonesian phone number string into a wa.me chat URL. */
export function getWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "62");
  return `https://wa.me/${digits}`;
}

/** Builds a clean `tel:` href by stripping spaces and formatting characters. */
export function getTelUrl(phone?: string): string {
  const cleaned = (phone ?? "02183724628").replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}
