import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { Breadcrumb, Button } from "../components/ui";
import { Summary } from "./Cart";
import { useStore } from "../context/StoreContext";
import { emailOk, money } from "../utils/format";

const fields = [["name", "Full name"], ["email", "Email"], ["address", "Street address"], ["city", "City"], ["zip", "ZIP / postal code"]];

export default function Checkout({ confirmation }) {
  const { cart, user, placeOrder, orders, notify } = useStore();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", address: user?.address || "", city: "", zip: "" });
  const [sameShip, setSameShip] = useState(true);
  const [pay, setPay] = useState("card");
  const [errors, setErrors] = useState({});

  if (confirmation) {
    const o = orders.find((x) => x.id === orderId);
    if (!o) return <Navigate to="/" replace />;
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <FiCheckCircle className="mx-auto text-brand-600" size={56} />
        <h1 className="mt-4 text-3xl font-extrabold">Order confirmed</h1>
        <p className="mt-2 text-stone-500">Order {o.id} for {money(o.totals.total)} is on its way. We sent details to {o.form.email}.</p>
        <div className="mt-6 flex justify-center gap-3"><Button to="/dashboard?tab=orders">View orders</Button><Button to="/products" variant="outline">Keep shopping</Button></div>
      </div>
    );
  }
  if (cart.length === 0) return <Navigate to="/cart" replace />;

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    fields.forEach(([k, l]) => !form[k].trim() && (err[k] = `${l} is required`));
    if (form.email && !emailOk(form.email)) err.email = "Enter a valid email address";
    setErrors(err);
    if (Object.keys(err).length) return notify("Please fix the highlighted fields", "error");
    const order = placeOrder({ form, pay, shipTo: sameShip ? "billing" : "other" });
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-4 text-lg font-bold">Billing information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([k, l]) => (
                <div key={k} className={k === "address" ? "sm:col-span-2" : ""}>
                  <label htmlFor={k} className="mb-1 block text-sm font-medium">{l}</label>
                  <input id={k} className="input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} />
                  {errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>}
                </div>
              ))}
            </div>
          </section>
          <section className="card p-5">
            <h2 className="mb-3 text-lg font-bold">Shipping</h2>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sameShip} onChange={(e) => setSameShip(e.target.checked)} className="accent-brand-600" /> Ship to my billing address</label>
          </section>
          <section className="card p-5">
            <h2 className="mb-3 text-lg font-bold">Payment</h2>
            {[["card", "Credit / debit card"], ["paypal", "PayPal"], ["cod", "Cash on delivery"]].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 py-1.5 text-sm"><input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} className="accent-brand-600" />{l}</label>
            ))}
            {pay === "card" && <div className="mt-3 grid gap-3 sm:grid-cols-3"><input className="input sm:col-span-3" placeholder="Card number" aria-label="Card number" inputMode="numeric" /><input className="input" placeholder="MM/YY" aria-label="Expiry" /><input className="input" placeholder="CVC" aria-label="CVC" /></div>}
            <p className="mt-2 text-xs text-stone-500">Demo only. No payment is processed.</p>
          </section>
        </div>
        <div className="space-y-4"><Summary showCoupon={false} /><Button className="w-full py-3">Place order</Button></div>
      </form>
    </>
  );
}
