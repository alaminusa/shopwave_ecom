import { useState } from "react";
import { Hero, CategoryCard, Testimonial } from "../components/Sections";
import ProductCard from "../components/ProductCard";
import { ProductSkeleton, Button } from "../components/ui";
import useFetch from "../hooks/useFetch";
import { getProducts } from "../services/api";
import { categories, testimonials } from "../data/products";
import { useStore } from "../context/StoreContext";

const Grid = ({ title, items, loading, action }) => (
  <section className="mt-14">
    <div className="mb-5 flex items-end justify-between"><h2 className="text-2xl font-bold">{title}</h2>{action}</div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {loading ? Array.from({ length: 4 }, (_, i) => <ProductSkeleton key={i} />) : items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  </section>
);

export default function Home() {
  const { data, loading, error } = useFetch(getProducts);
  const { recent, notify } = useStore();
  const [email, setEmail] = useState("");
  const featured = data?.filter((p) => p.rating >= 4.6).slice(0, 4) ?? [];
  const best = data ? [...data].sort((a, b) => b.sold - a.sold).slice(0, 4) : [];

  const subscribe = (e) => {
    e.preventDefault();
    notify(`Subscribed ${email}`);
    setEmail("");
  };
  if (error) return <p className="py-20 text-center text-red-600">Couldn't load products. Refresh to try again.</p>;
  return (
    <>
      <Hero />
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-bold">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{categories.map((c) => <CategoryCard key={c.id} c={c} />)}</div>
      </section>
      <Grid title="Featured products" items={featured} loading={loading} action={<Button to="/products" variant="ghost">View all</Button>} />
      <Grid title="Best sellers" items={best} loading={loading} />
      {recent.length > 0 && <Grid title="Recently viewed" items={recent.slice(0, 4)} />}
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-bold">What customers say</h2>
        <div className="grid gap-4 md:grid-cols-3">{testimonials.map((t) => <Testimonial key={t.name} t={t} />)}</div>
      </section>
      <section className="mt-14 rounded-3xl bg-brand-600 p-8 text-center text-white md:p-12">
        <h2 className="text-2xl font-bold">Get 10% off your first order</h2>
        <p className="mt-1 text-brand-100">Join the newsletter. Deals only, no spam.</p>
        <form onSubmit={subscribe} className="mx-auto mt-5 flex max-w-md gap-2">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" className="input !border-0 text-stone-900" />
          <Button className="!bg-stone-900 hover:!bg-black">Subscribe</Button>
        </form>
      </section>
    </>
  );
}
