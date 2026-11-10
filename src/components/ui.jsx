import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border border-stone-300 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800",
  ghost: "hover:bg-stone-100 dark:hover:bg-stone-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

/** Button that renders a <Link> when `to` is given. */
export function Button({ variant = "primary", to, className = "", children, ...rest }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`;
  return to ? <Link to={to} className={cls} {...rest}>{children}</Link> : <button className={cls} {...rest}>{children}</button>;
}

export const Loader = () => (
  <div role="status" aria-label="Loading" className="flex justify-center py-16">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-stone-200 border-t-brand-600" />
  </div>
);

export const Skeleton = ({ className = "" }) => <div className={`animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800 ${className}`} />;
export const ProductSkeleton = () => (
  <div className="card p-3"><Skeleton className="aspect-square" /><Skeleton className="mt-3 h-4 w-3/4" /><Skeleton className="mt-2 h-4 w-1/3" /></div>
);

export function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex text-amber-500" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(value) ? <FaStar key={n} size={size} /> : <FaRegStar key={n} size={size} />))}
    </span>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="card w-full max-w-md animate-pop p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-stone-100 dark:hover:bg-stone-800"><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-stone-500">
      <ol className="flex flex-wrap gap-2">
        {[{ label: "Home", to: "/" }, ...items].map((it, i, a) => (
          <li key={it.label} className="flex gap-2">
            {it.to && i < a.length - 1 ? <Link to={it.to} className="hover:text-brand-600">{it.label}</Link> : <span className="text-stone-900 dark:text-stone-100">{it.label}</span>}
            {i < a.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ToastHost({ toasts }) {
  const color = { success: "bg-brand-600", error: "bg-red-600", info: "bg-stone-700" };
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`animate-pop rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${color[t.type]}`}>{t.message}</div>)}
    </div>
  );
}
