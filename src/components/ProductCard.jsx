import { memo } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useStore } from "../context/StoreContext";
import { Stars } from "./ui";
import { money } from "../utils/format";

function ProductCard({ product: p }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const liked = inWishlist(p.id);
  return (
    <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
        <Link to={`/products/${p.id}`}>
          <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        {p.oldPrice && <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">Sale</span>}
        <button onClick={() => toggleWishlist(p)} aria-pressed={liked} aria-label="Toggle wishlist"
          className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow ${liked ? "text-red-500" : "text-stone-600"}`}>
          <FiHeart className={liked ? "fill-current" : ""} />
        </button>
      </div>
      <div className="p-4">
        <Link to={`/products/${p.id}`} className="line-clamp-1 font-semibold hover:text-brand-600">{p.name}</Link>
        <div className="mt-1 flex items-center gap-2 text-xs text-stone-500"><Stars value={p.rating} /> ({p.reviews})</div>
        <div className="mt-3 flex items-center justify-between">
          <div><span className="text-lg font-bold">{money(p.price)}</span>
            {p.oldPrice && <span className="ml-2 text-sm text-stone-400 line-through">{money(p.oldPrice)}</span>}</div>
          <button onClick={() => addToCart(p)} aria-label={`Add ${p.name} to cart`} className="rounded-lg bg-brand-600 p-2.5 text-white transition hover:bg-brand-700"><FiShoppingCart /></button>
        </div>
      </div>
    </article>
  );
}
export default memo(ProductCard);
