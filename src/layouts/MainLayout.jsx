import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { FiHeart, FiMenu, FiMoon, FiShoppingCart, FiSun, FiUser, FiX } from "react-icons/fi";
import { useStore } from "../context/StoreContext";
import { SearchBar } from "../components/Sections";
import { ToastHost } from "../components/ui";
import { categories } from "../data/products";

function Navbar() {
  const { cartCount, wishlist, theme, toggleTheme, user } = useStore();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const icon = "relative rounded-lg p-2 hover:bg-stone-100 dark:hover:bg-stone-800";
  const badge = (n) => n > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">{n}</span>;
  
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <FiX size={22} /> : <FiMenu size={22} />}</button>
        <Link to="/" className="text-xl font-extrabold tracking-tight text-brand-600">ShopWave</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Main">
          <NavLink to="/products" end className="hover:text-brand-600">Shop</NavLink>
          {/* Mega menu */}
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button className="hover:text-brand-600" aria-expanded={mega} onFocus={() => setMega(true)}>Categories</button>
            {mega && (
              <div className="card absolute left-0 top-full grid w-[34rem] animate-pop grid-cols-2 gap-6 p-6 shadow-xl">
                {categories.map((c) => (
                  <div key={c.id}>
                    <Link to={`/products?category=${c.id}`} className="font-bold hover:text-brand-600">{c.name}</Link>
                    <ul className="mt-1 space-y-1 text-stone-500">{c.sub.map((s) => <li key={s}><Link to={`/products?category=${c.id}&q=${s}`} className="hover:text-brand-600">{s}</Link></li>)}</ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
        <SearchBar className="ml-auto hidden flex-1 md:block md:max-w-sm" />
        <div className="ml-auto flex items-center md:ml-0">
          <button onClick={toggleTheme} className={icon} aria-label="Toggle dark mode">{theme === "dark" ? <FiSun /> : <FiMoon />}</button>
          <Link to="/dashboard?tab=wishlist" className={icon} aria-label="Wishlist"><FiHeart />{badge(wishlist.length)}</Link>
          <Link to="/cart" className={icon} aria-label="Cart"><FiShoppingCart />{badge(cartCount)}</Link>
          <Link to={user ? "/dashboard" : "/login"} className={icon} aria-label="Account"><FiUser /></Link>
        </div>
      </div>
      {open && (
        <div className="space-y-3 border-t border-stone-200 p-4 dark:border-stone-800 md:hidden">
          <SearchBar />
          <Link to="/products" className="block py-1 font-medium">All products</Link>
          {categories.map((c) => <Link key={c.id} to={`/products?category=${c.id}`} className="block py-1 text-stone-500">{c.name}</Link>)}
        </div>
      )}
    </header>
  );
}

function Footer() {
  const col = (title, links) => (
    <div><h4 className="mb-3 font-bold">{title}</h4>
      <ul className="space-y-2 text-sm text-stone-500">{links.map(([l, to]) => <li key={l}><Link to={to} className="hover:text-brand-600">{l}</Link></li>)}</ul></div>
  );
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div><p className="text-xl font-extrabold text-brand-600">ShopWave</p><p className="mt-2 text-sm text-stone-500">Quality products, fair prices, and returns that don't need a phone call.</p></div>
        {col("Shop", [["All products", "/products"], ["Electronics", "/products?category=electronics"], ["Fashion", "/products?category=fashion"]])}
        {col("Account", [["Sign in", "/login"], ["Orders", "/dashboard?tab=orders"], ["Wishlist", "/dashboard?tab=wishlist"]])}
        {col("Help", [["Cart", "/cart"], ["Reset password", "/reset-password"], ["Create account", "/register"]])}
      </div>
      <p className="border-t border-stone-200 py-4 text-center text-xs text-stone-500 dark:border-stone-800">© {new Date().getFullYear()} ShopWave. Demo store.</p>
    </footer>
  );
}

export default function MainLayout() {
  const { toasts } = useStore();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">Skip to content</a>
      <Navbar />
      <main id="main" className="mx-auto max-w-7xl px-4 py-8"><Outlet /></main>
      <Footer />
      <ToastHost toasts={toasts} />
    </>
  );
}