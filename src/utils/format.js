export const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
export const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
