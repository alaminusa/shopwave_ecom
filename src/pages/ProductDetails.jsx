import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiHeart, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { Breadcrumb, Button, Loader, Stars } from "../components/ui";
import ProductCard from "../components/ProductCard";
import useFetch from "../hooks/useFetch";
import { getProduct, getProducts } from "../services/api";
import { useStore } from "../context/StoreContext";
import { money } from "../utils/format";

const reviews = [
  { n: "Sam T.", r: 5, t: "Exactly as described. Great build quality." },
  { n: "Lena M.", r: 4, t: "Good value. Shipping was quick." },
];

export default function ProductDetails() {
  const { id } = useParams();
  const { data: p, loading, error } = useFetch(() => getProduct(id), [id]);
  const { data: all } = useFetch(getProducts);
  const { addToCart, toggleWishlist, inWishlist, trackView, recent, notify } = useStore();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [myRating, setMyRating] = useState(0);

  useEffect(() => { if (p) { trackView(p); setImg(0); setQty(1); } }, [p, trackView]);

  if (loading) return <Loader />;
  if (error) return <p className="py-20 text-center text-red-600">{error}</p>;
  const related = (all || []).filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const seen = recent.filter((x) => x.id !== p.id).slice(0, 4);

  return (
    <>
      <Breadcrumb items={[{ label: "Products", to: "/products" }, { label: p.name }]} />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <img src={p.images[img]} alt={p.name} className="aspect-square w-full rounded-2xl object-cover" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {p.images.map((src, i) => (
              <button key={src} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={`overflow-hidden rounded-xl border-2 ${i === img ? "border-brand-600" : "border-transparent"}`}>
                <img src={src} alt="" className="aspect-square object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">{p.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-stone-500"><Stars value={p.rating} size={16} /> {p.rating} ({p.reviews} reviews)</div>
          <p className="mt-4 text-3xl font-bold">{money(p.price)} {p.oldPrice && <span className="text-lg font-normal text-stone-400 line-through">{money(p.oldPrice)}</span>}</p>
          <p className="mt-4 text-stone-600 dark:text-stone-300">{p.description}</p>
          <p className={`mt-3 text-sm font-medium ${p.stock < 10 ? "text-amber-600" : "text-brand-600"}`}>{p.stock < 10 ? `Only ${p.stock} left` : "In stock"}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-stone-300 dark:border-stone-700">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="p-3"><FiMinus /></button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} aria-label="Increase quantity" className="p-3"><FiPlus /></button>
            </div>
            <Button onClick={() => addToCart(p, qty)} className="flex-1 py-3"><FiShoppingCart /> Add to cart</Button>
            <Button variant="outline" onClick={() => toggleWishlist(p)} aria-pressed={inWishlist(p.id)} aria-label="Toggle wishlist" className="py-3"><FiHeart className={inWishlist(p.id) ? "fill-red-500 text-red-500" : ""} /></Button>
          </div>
        </div>
      </div>

      <section className="mt-14" aria-label="Reviews">
        <h2 className="mb-4 text-2xl font-bold">Ratings and reviews</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => <div key={r.n} className="card p-4"><Stars value={r.r} /><p className="mt-2">{r.t}</p><p className="mt-1 text-sm text-stone-500">{r.n}</p></div>)}
          <div className="card p-4">
            <p className="font-semibold">Rate this product</p>
            <div className="my-2 flex gap-1">{[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setMyRating(n)} aria-label={`${n} stars`} className={`text-2xl ${n <= myRating ? "text-amber-500" : "text-stone-300"}`}>★</button>
            ))}</div>
            <Button variant="outline" disabled={!myRating} onClick={() => { notify("Thanks for your rating!"); setMyRating(0); }}>Submit rating</Button>
          </div>
        </div>
      </section>

      {[["Related products", related], ["Recently viewed", seen]].map(([title, items]) => items.length > 0 && (
        <section key={title} className="mt-14"><h2 className="mb-4 text-2xl font-bold">{title}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((x) => <ProductCard key={x.id} product={x} />)}</div></section>
      ))}
    </>
  );
}
