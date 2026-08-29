/**
 * Decodes contact details only after a visitor asks to see them. Keeping the
 * encoded value out of the rendered HTML deters basic address and spam bots.
 */
export const revealContactDetail = (value: string) => atob(value);
