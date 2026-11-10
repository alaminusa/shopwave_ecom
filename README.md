# ShopWave - React + Tailwind E-Commerce

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Stack
React 18 (hooks), React Router 6, Tailwind CSS 3 (dark mode via class), Context API, Axios, React Icons, Vite.

## Structure
- `context/StoreContext.jsx` - cart, wishlist, coupons, auth (mock), orders, theme, toasts (all persisted to localStorage)
- `services/api.js` - axios instance + mock calls; swap in your real endpoints
- `routes/AppRoutes.jsx` - lazy-loaded pages and a protected dashboard route
- `components/` - ui primitives (Button, Modal, Loader, Skeleton, Stars, Breadcrumb, Toast), ProductCard, Navbar/Footer (in `layouts/`), Sections (Hero, CategoryCard, SearchBar, FilterSidebar, CartItem)

## Demo notes
- Coupons: `SAVE10`, `WELCOME20`. Free shipping over $100.
- Auth is mocked: any valid email and 8+ character password signs in.
- Images are loaded from picsum.photos.
