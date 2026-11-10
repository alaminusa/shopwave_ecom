import axios from "axios";
import { products } from "../data/products";

// Point baseURL at your real backend; the mock helpers below keep the demo working offline.
export const http = axios.create({ baseURL: "/api", timeout: 8000 });

const delay = (data, ms = 600) => new Promise((res) => setTimeout(() => res(data), ms));

// Real version: http.get("/products").then((r) => r.data)
export const getProducts = () => delay(products);
export const getProduct = (id) =>
  delay(products.find((p) => p.id === Number(id))).then((p) => {
    if (!p) throw new Error("Product not found");
    return p;
  });
