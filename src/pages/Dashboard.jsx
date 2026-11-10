import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";
import { money } from "../utils/format";

const tabs = [["profile", "Profile"], ["orders", "Orders"], ["wishlist", "Wishlist"], ["settings", "Settings"]];

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "profile";
  const { user, updateUser, orders, wishlist, logout, theme, toggleTheme } = useStore();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "", address: user.address || "" });

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <nav className="card flex h-fit gap-1 overflow-x-auto p-2 md:flex-col" aria-label="Account">
        {tabs.map(([id, l]) => (
          <button key={id} onClick={() => setParams({ tab: id })} aria-current={tab === id}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${tab === id ? "bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100" : "hover:bg-stone-100 dark:hover:bg-stone-800"}`}>{l}</button>
        ))}
        <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-sm text-red-600">Sign out</button>
      </nav>
      <section>
        {tab === "profile" && (
          <form onSubmit={(e) => { e.preventDefault(); updateUser(form); }} className="card max-w-lg space-y-4 p-6">
            <h1 className="text-xl font-bold">Profile</h1>
            {[["name", "Full name"], ["phone", "Phone"], ["address", "Address"]].map(([k, l]) => (
              <div key={k}><label htmlFor={k} className="mb-1 block text-sm font-medium">{l}</label>
                <input id={k} className="input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
            <p className="text-sm text-stone-500">Email: {user.email}</p>
            <Button>Save changes</Button>
          </form>
        )}
        {tab === "orders" && (
          <div className="space-y-4"><h1 className="text-xl font-bold">Order history</h1>
            {orders.length === 0 ? <p className="text-stone-500">No orders yet. <Link to="/products" className="text-brand-600">Browse products</Link></p> :
              orders.map((o) => (
                <div key={o.id} className="card p-4">
                  <div className="flex justify-between font-semibold"><span>{o.id}</span><span>{money(o.totals.total)}</span></div>
                  <p className="text-sm text-stone-500">{o.date} · {o.items.reduce((s, i) => s + i.qty, 0)} items · Processing</p>
                  <div className="mt-3 flex gap-2">{o.items.slice(0, 5).map((i) => <img key={i.id} src={i.images[0]} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />)}</div>
                </div>
              ))}
          </div>
        )}
        {tab === "wishlist" && (
          <div><h1 className="mb-4 text-xl font-bold">Wishlist</h1>
            {wishlist.length === 0 ? <p className="text-stone-500">Nothing saved yet. Tap the heart on any product.</p> :
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{wishlist.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
          </div>
        )}
        {tab === "settings" && (
          <div className="card max-w-lg space-y-4 p-6"><h1 className="text-xl font-bold">Account settings</h1>
            <div className="flex items-center justify-between"><span>Dark mode</span><Button variant="outline" onClick={toggleTheme}>{theme === "dark" ? "Switch to light" : "Switch to dark"}</Button></div>
            <p className="text-sm text-stone-500">Connect your backend to manage password and notification preferences.</p>
          </div>
        )}
      </section>
    </div>
  );
}
