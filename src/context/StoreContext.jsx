import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { coupons } from "../data/products";

const Store = createContext(null);
export const useStore = () => useContext(Store);

/** Single provider for cart, wishlist, theme, auth, orders, coupon and toasts. */
export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage("sw_cart", []);
  const [wishlist, setWishlist] = useLocalStorage("sw_wishlist", []); // product snapshots
  const [recent, setRecent] = useLocalStorage("sw_recent", []);
  const [theme, setTheme] = useLocalStorage("sw_theme", "light");
  const [user, setUser] = useLocalStorage("sw_user", null);
  const [orders, setOrders] = useLocalStorage("sw_orders", []);
  const [coupon, setCoupon] = useLocalStorage("sw_coupon", null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  const notify = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const addToCart = (p, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.id === p.id);
      if (found) return c.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, p.stock) } : i));
      return [...c, { ...p, qty }];
    });
    notify(`${p.name} added to cart`);
  };
  const updateQty = (id, qty) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)));
  const removeFromCart = (id) => { setCart((c) => c.filter((i) => i.id !== id)); notify("Item removed", "info"); };
  const clearCart = () => { setCart([]); setCoupon(null); };

  const toggleWishlist = (p) => {
    const has = wishlist.some((w) => w.id === p.id);
    setWishlist((w) => (has ? w.filter((x) => x.id !== p.id) : [...w, p]));
    notify(has ? "Removed from wishlist" : "Saved to wishlist", has ? "info" : "success");
  };
  const inWishlist = (id) => wishlist.some((w) => w.id === id);

  const trackView = useCallback((p) => setRecent((r) => [p, ...r.filter((x) => x.id !== p.id)].slice(0, 6)), [setRecent]);

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase();
    if (coupons[c]) { setCoupon({ code: c, rate: coupons[c] }); notify(`Coupon ${c} applied`); }
    else notify("That coupon code isn't valid", "error");
  };

  // Mock auth: replace with real API calls.
  const login = (email, name) => { setUser({ name: name || email.split("@")[0], email, phone: "", address: "" }); notify("Welcome back!"); };
  const logout = () => { setUser(null); notify("Signed out", "info"); };
  const updateUser = (patch) => { setUser((u) => ({ ...u, ...patch })); notify("Profile saved"); };

  const placeOrder = (details) => {
    const order = { id: "SW" + Date.now().toString().slice(-7), date: new Date().toLocaleDateString(), items: cart, totals, ...details };
    setOrders((o) => [order, ...o]);
    clearCart();
    return order;
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = coupon ? subtotal * coupon.rate : 0;
    const shipping = subtotal - discount > 100 || subtotal === 0 ? 0 : 9;
    const tax = (subtotal - discount) * 0.08;
    return { subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax };
  }, [cart, coupon]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const value = { cart, cartCount, totals, coupon, wishlist, recent, theme, user, orders, toasts,
    addToCart, updateQty, removeFromCart, clearCart, toggleWishlist, inWishlist, trackView,
    applyCoupon, removeCoupon: () => setCoupon(null), login, logout, updateUser, placeOrder, notify,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
