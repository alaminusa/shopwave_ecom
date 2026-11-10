import { useState } from "react";
import { CartItem } from "../components/Sections";
import { Breadcrumb, Button, Modal } from "../components/ui";
import { useStore } from "../context/StoreContext";
import { money } from "../utils/format";

export function Summary({ showCoupon = true }) {
  const { totals: t, coupon, applyCoupon, removeCoupon } = useStore();
  const [code, setCode] = useState("");
  const Row = ({ l, v, b }) => <div className={`flex justify-between py-1 ${b ? "border-t border-stone-200 pt-3 text-lg font-bold dark:border-stone-700" : "text-sm"}`}><span>{l}</span><span>{v}</span></div>;
  return (
    <div className="card h-fit p-5">
      <h2 className="mb-3 text-lg font-bold">Order summary</h2>
      <Row l="Subtotal" v={money(t.subtotal)} />
      {coupon && <Row l={`Discount (${coupon.code})`} v={`-${money(t.discount)}`} />}
      <Row l="Shipping" v={t.shipping ? money(t.shipping) : "Free"} />
      <Row l="Tax (8%)" v={money(t.tax)} />
      <Row l="Total" v={money(t.total)} b />
      {showCoupon && (
        <div className="mt-4">
          {coupon ? <button onClick={removeCoupon} className="text-sm text-red-600">Remove {coupon.code}</button> : (
            <form onSubmit={(e) => { e.preventDefault(); applyCoupon(code); setCode(""); }} className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon (try SAVE10)" aria-label="Coupon code" className="input" />
              <Button variant="outline">Apply</Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function Cart() {
  const { cart, clearCart } = useStore();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="mb-6 text-3xl font-extrabold">Your cart</h1>
      {cart.length === 0 ? (
        <div className="py-16 text-center"><p className="mb-4 text-lg">Your cart is empty.</p><Button to="/products">Start shopping</Button></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.map((i) => <CartItem key={i.id} item={i} />)}
            <div className="flex justify-between">
              <Button to="/products" variant="outline">Continue shopping</Button>
              <Button variant="ghost" onClick={() => setConfirm(true)}>Clear cart</Button>
            </div>
          </div>
          <div className="space-y-4"><Summary /><Button to="/checkout" className="w-full py-3">Proceed to checkout</Button></div>
        </div>
      )}
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Clear your cart?">
        <p className="mb-4 text-sm text-stone-500">This removes all items from your cart.</p>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirm(false)}>Keep items</Button><Button variant="danger" onClick={() => { clearCart(); setConfirm(false); }}>Clear cart</Button></div>
      </Modal>
    </>
  );
}
