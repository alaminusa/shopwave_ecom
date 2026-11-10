import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiSearch, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "./ui";
import { categories } from "../data/products";
import { money } from "../utils/format";
import { useStore } from "../context/StoreContext";

export function Hero() {
  return (
    <section className="overflow-hidden rounded-3xl bg-stone-900 text-white">
      <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-14">
        <div>
          <p className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-sm text-brand-100">Use code WELCOME20 for 20% off</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Gear you'll actually use, delivered fast.</h1>
          <p className="mt-4 max-w-md text-stone-300">Audio, fashion, home and sport essentials. Free shipping over $100 and 30-day returns.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button to="/products" className="!bg-white !text-stone-900 hover:!bg-stone-200">Shop all products</Button>
            <Button to="/products?category=electronics" variant="outline" className="!border-stone-600 hover:!bg-stone-800">Browse electronics</Button>
          </div>
        </div>
        <img src="https://picsum.photos/seed/shopwave-hero/700/500" alt="Featured products" className="h-64 w-full rounded-2xl object-cover md:h-80" />
      </div>
    </section>
  );
}

export function CategoryCard({ c }) {
  return (
    <Link to={`/products?category=${c.id}`} className="group relative block overflow-hidden rounded-2xl">
      <img src={`https://picsum.photos/seed/cat-${c.id}/500/350`} alt="" loading="lazy" className="h-40 w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 font-bold text-white">{c.name}</div>
    </Link>
  );
}

export function SearchBar({ defaultValue = "", onSearch, className = "" }) {
  const [q, setQ] = useState(defaultValue);
  const navigate = useNavigate();
  const submit = (e) => { e.preventDefault(); onSearch ? onSearch(q) : navigate(`/products?q=${encodeURIComponent(q)}`); };
  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." aria-label="Search products" className="input pl-10" />
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
    </form>
  );
}

/** Category + price filters. Controlled by the parent via `filters`/`onChange`. */
export function FilterSidebar({ filters, onChange }) {
  return (
    <aside className="card space-y-6 p-5" aria-label="Filters">
      <div>
        <h3 className="mb-2 font-bold">Category</h3>
        {[{ id: "", name: "All" }, ...categories].map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
            <input type="radio" name="cat" checked={filters.category === c.id} onChange={() => onChange({ category: c.id })} className="accent-brand-600" />{c.name}
          </label>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-bold">Max price: {money(filters.maxPrice)}</h3>
        <input type="range" min="20" max="250" step="5" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: +e.target.value })} className="w-full accent-brand-600" aria-label="Maximum price" />
      </div>
      <Button variant="outline" className="w-full" onClick={() => onChange({ category: "", maxPrice: 250 })}>Reset filters</Button>
    </aside>
  );
}

export function CartItem({ item }) {
  const { updateQty, removeFromCart } = useStore();
  return (
    <div className="card flex gap-4 p-4">
      <Link to={`/products/${item.id}`}><img src={item.images[0]} alt={item.name} className="h-24 w-24 rounded-xl object-cover" /></Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <Link to={`/products/${item.id}`} className="font-semibold hover:text-brand-600">{item.name}</Link>
          <span className="font-bold">{money(item.price * item.qty)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-stone-300 dark:border-stone-700">
            <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity" className="p-2"><FiMinus /></button>
            <span className="w-8 text-center text-sm" aria-live="polite">{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity" className="p-2"><FiPlus /></button>
          </div>
          <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-1 text-sm text-red-600"><FiTrash2 /> Remove</button>
        </div>
      </div>
    </div>
  );
}

export function Testimonial({ t }) {
  return (
    <figure className="card p-6">
      <blockquote className="text-stone-700 dark:text-stone-300">{t.text}</blockquote>
      <figcaption className="mt-4 text-sm font-semibold">{t.name}</figcaption>
    </figure>
  );
}
