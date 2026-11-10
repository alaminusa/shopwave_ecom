import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui";
import { useStore } from "../context/StoreContext";
import { emailOk } from "../utils/format";

const copy = {
  login: { title: "Sign in", cta: "Sign in", fields: ["email", "password"] },
  register: { title: "Create your account", cta: "Create account", fields: ["name", "email", "password", "confirm"] },
  reset: { title: "Reset your password", cta: "Send reset link", fields: ["email"] },
};
const labels = { name: "Full name", email: "Email", password: "Password", confirm: "Confirm password" };

export default function Auth({ mode }) {
  const { login, notify } = useStore();
  const navigate = useNavigate();
  const from = useLocation().state?.from || "/dashboard";
  const [v, setV] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const c = copy[mode];

  const validate = () => {
    const e = {};
    if (c.fields.includes("name") && v.name.trim().length < 2) e.name = "Enter your name";
    if (!emailOk(v.email)) e.email = "Enter a valid email address";
    if (c.fields.includes("password") && v.password.length < 8) e.password = "Use at least 8 characters";
    if (c.fields.includes("confirm") && v.confirm !== v.password) e.confirm = "Passwords don't match";
    return e;
  };
  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (mode === "reset") { notify("Check your inbox for a reset link"); return navigate("/login"); }
    login(v.email, v.name); // mock: replace with API call
    navigate(from, { replace: true });
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} noValidate className="card space-y-4 p-6">
        <h1 className="text-2xl font-extrabold">{c.title}</h1>
        {c.fields.map((f) => (
          <div key={f}>
            <label htmlFor={f} className="mb-1 block text-sm font-medium">{labels[f]}</label>
            <input id={f} type={f === "password" || f === "confirm" ? "password" : f === "email" ? "email" : "text"} className="input"
              value={v[f]} onChange={(e) => setV({ ...v, [f]: e.target.value })} aria-invalid={!!errors[f]} autoComplete={f === "password" ? "current-password" : f} />
            {errors[f] && <p className="mt-1 text-xs text-red-600">{errors[f]}</p>}
          </div>
        ))}
        <Button className="w-full py-3">{c.cta}</Button>
        <p className="text-center text-sm text-stone-500">
          {mode === "login" && <><Link to="/reset-password" className="text-brand-600">Forgot password?</Link> · <Link to="/register" className="text-brand-600">Create account</Link></>}
          {mode !== "login" && <>Already have an account? <Link to="/login" className="text-brand-600">Sign in</Link></>}
        </p>
      </form>
    </div>
  );
}
