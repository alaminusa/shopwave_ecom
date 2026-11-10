import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { FilterSidebar, SearchBar } from "../components/Sections";
import { Breadcrumb, Button, ProductSkeleton } from "../components/ui";
import useFetch from "../hooks/useFetch";
import { getProducts } from "../services/api";

const PAGE_SIZE = 8;
const sorters = {
  popular: (a, b) => b.sold - a.sold,
  rating: (a, b) => b.rating - a.rating,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(250);
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const { data, loading, error } = useFetch(getProducts);
  const q = params.get("q") || "";
  const category = params.get("category") || "";

  const update = (patch) => {
    if ("maxPrice" in patch) setMaxPrice(patch.maxPrice);
    if ("category" in patch) {
      const next = new URLSearchParams(params);
      patch.category ? next.set("category", patch.category) : next.delete("category");
      if ("maxPrice" in patch) next.delete("q");
      setParams(next);
    }
    setPage(1);
  };

  const results = useMemo(() => {
    if (!data) return [];
    const term = q.toLowerCase();
    return data
      .filter((p) => (!category || p.category === category) && p.price <= maxPrice && (!term || p.name.toLowerCase().includes(term) || p.category.includes(term)))
      .sort(sorters[sort]);
  }, [data, q, category, maxPrice, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Breadcrumb items={[{ label: "Products" }]} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SearchBar defaultValue={q} className="w-full sm:w-72" onSearch={(v) => { const n = new URLSearchParams(params); v ? n.set("q", v) : n.delete("q"); setParams(n); setPage(1); }} />
        <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>Filters</Button>
        <label className="ml-auto flex items-center gap-2 text-sm">Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto">
            <option value="popular">Popularity</option><option value="rating">Rating</option>
            <option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <div className={showFilters ? "block" : "hidden lg:block"}><FilterSidebar filters={{ category, maxPrice }} onChange={update} /></div>
        <div>
          {error && <p className="text-red-600">Couldn't load products: {error}</p>}
          <p className="mb-3 text-sm text-stone-500">{loading ? "Loading..." : `${results.length} products`}</p>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 md:grid-cols-3">
            {loading ? Array.from({ length: 8 }, (_, i) => <ProductSkeleton key={i} />) : visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {!loading && results.length === 0 && (
            <div className="py-16 text-center"><p className="font-semibold">No products match your filters.</p><Button className="mt-4" onClick={() => { setParams({}); update({ maxPrice: 250 }); }}>Clear filters</Button></div>
          )}
          {pages > 1 && (
            <nav className="mt-8 flex justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1} className={`h-10 w-10 rounded-lg text-sm font-semibold ${page === i + 1 ? "bg-brand-600 text-white" : "border border-stone-300 dark:border-stone-700"}`}>{i + 1}</button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
