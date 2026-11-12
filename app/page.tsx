"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingCart, Zap, Truck, ShieldCheck, Headphones, Star, Plus, Minus, X, Globe, ArrowRight } from "lucide-react";

type Product = { id: number; name: string; kh: string; category: string; price: number; rating: number; icon: string; label?: string };
const products: Product[] = [
  { id: 1, name: "LED Bulb 12W", kh: "អំពូល LED 12W", category: "Lighting", price: 2.5, rating: 4.8, icon: "💡", label: "Best seller" },
  { id: 2, name: "Copper Wire 2.5mm", kh: "ខ្សែភ្លើងស្ពាន់ 2.5mm", category: "Wires", price: 28, rating: 4.9, icon: "🧵" },
  { id: 3, name: "Wall Socket 16A", kh: "ព្រីភ្លើង 16A", category: "Switches", price: 4.2, rating: 4.7, icon: "🔌" },
  { id: 4, name: "Mini Circuit Breaker", kh: "ឧបករណ៍កាត់សៀគ្វី MCB", category: "Protection", price: 8.9, rating: 4.8, icon: "⚡" },
  { id: 5, name: "CCTV Camera 2MP", kh: "កាមេរ៉ាសុវត្ថិភាព 2MP", category: "Security", price: 24, rating: 4.6, icon: "📷" },
  { id: 6, name: "Digital Multimeter", kh: "ឧបករណ៍វាស់អគ្គិសនី", category: "Tools", price: 16.5, rating: 4.8, icon: "🧰" },
  { id: 7, name: "Extension Power Strip", kh: "ព្រីភ្លើងបន្ថែម", category: "Electronics", price: 9.5, rating: 4.5, icon: "🔋" },
  { id: 8, name: "Solar Flood Light", kh: "អំពូលសូឡាបំភ្លឺ", category: "Lighting", price: 32, rating: 4.9, icon: "☀️" }
];
const categories = ["All", "Lighting", "Wires", "Switches", "Protection", "Security", "Tools", "Electronics"];

export default function Home() {
  const [lang, setLang] = useState<"km" | "en">("km");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const km = lang === "km";
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const shown = useMemo(() => products.filter(p => (category === "All" || p.category === category) && (p.name + p.kh + p.category).toLowerCase().includes(query.toLowerCase())), [category, query]);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const add = (id: number) => setCart(v => ({ ...v, [id]: (v[id] || 0) + 1 }));
  const change = (id: number, n: number) => setCart(v => ({ ...v, [id]: Math.max(0, (v[id] || 0) + n) }));

  return <main>
    <div className="topbar"><div className="wrap topinner"><span>⚡ {km ? "ហាងផ្គត់ផ្គង់សម្ភារៈអគ្គិសនី និងអេឡិចត្រូនិក" : "Your trusted electrical & electronics store"}</span><span>{km ? "ដឹកជញ្ជូនទូទាំងប្រទេសកម្ពុជា" : "Delivery across Cambodia"} · +855 XX XXX XXX</span></div></div>
    <header><div className="wrap nav">
      <a className="brand" href="#"><span className="brand-icon"><Zap fill="currentColor"/></span><span>Volt<span className="blue">Mart</span><small>ELECTRICAL & ELECTRONICS</small></span></a>
      <div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={km ? "ស្វែងរកទំនិញ..." : "Search products..."}/></div>
      <div className="actions"><button className="language" onClick={() => setLang(km ? "en" : "km")}><Globe size={16}/>{km ? "EN" : "ខ្មែរ"}</button><button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingCart size={19}/>{km ? "កន្ត្រក" : "Cart"}<b>{count}</b></button></div>
    </div><nav className="wrap links"><a href="#products">{km ? "ទំនិញទាំងអស់" : "Products"}</a><a href="#categories">{km ? "ប្រភេទទំនិញ" : "Categories"}</a><a href="#services">{km ? "សេវាកម្ម" : "Services"}</a><a href="#contact">{km ? "ទំនាក់ទំនង" : "Contact"}</a></nav></header>

    <section className="hero"><div className="wrap hero-grid"><div><span className="eyebrow">COMPLETE ELECTRICAL SOLUTIONS</span><h1>{km ? <>បំពាក់ថាមពល<br/><em>ជីវិតរបស់អ្នក</em></> : <>Powering<br/><em>Your Everyday</em></>}</h1><p>{km ? "ស្វែងរកសម្ភារៈអគ្គិសនី និងឧបករណ៍អេឡិចត្រូនិកដែលមានគុណភាព តម្លៃសមរម្យ និងសេវាកម្មដែលអ្នកទុកចិត្ត។" : "Discover quality electrical supplies and electronics at competitive prices, backed by dependable service."}</p><a className="primary" href="#products">{km ? "ទិញទំនិញឥឡូវនេះ" : "Shop now"} <ArrowRight size={17}/></a></div><div className="hero-visual"><div className="hero-circle"></div><div className="hero-device"><span>SMART HOME · ONLINE</span><strong>💡</strong><b>{km ? "បច្ចេកវិទ្យាឆ្លាតវៃ" : "SMART TECHNOLOGY"}</b><small>ENERGY EFFICIENT</small></div><div className="float-chip">⚡ {km ? "សុវត្ថិភាព និងគុណភាព" : "Quality & safety"}</div></div></div></section>

    <section className="benefits" id="services"><div className="wrap benefit-grid"><div><Truck/><span><b>{km ? "ដឹកជញ្ជូនរហ័ស" : "Fast delivery"}</b><small>{km ? "ទូទាំងប្រទេសកម្ពុជា" : "Across Cambodia"}</small></span></div><div><ShieldCheck/><span><b>{km ? "ធានាគុណភាព" : "Quality guarantee"}</b><small>{km ? "ទំនិញមានប្រភពច្បាស់លាស់" : "Trusted products"}</small></span></div><div><Headphones/><span><b>{km ? "ជំនួយអតិថិជន" : "Customer support"}</b><small>{km ? "រួសរាយ និងរហ័ស" : "Here to help"}</small></span></div><div><Star/><span><b>{km ? "តម្លៃសមរម្យ" : "Great value"}</b><small>{km ? "តម្លៃប្រកួតប្រជែង" : "Fair prices"}</small></span></div></div></section>

    <section className="wrap section" id="categories"><span className="eyebrow">{km ? "ស្វែងរកតាមប្រភេទ" : "SHOP BY CATEGORY"}</span><h2>{km ? "ប្រភេទទំនិញ" : "Browse categories"}</h2><div className="category-grid">{categories.slice(1).map((c, i) => <button key={c} onClick={() => { setCategory(c); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}><span>{["💡","〰️","🔌","⚡","📷","🧰","🔋"][i]}</span><b>{c}</b><small>{km ? "មើលទំនិញ" : "Explore"} →</small></button>)}</div></section>

    <section className="products-section" id="products"><div className="wrap section"><span className="eyebrow">{km ? "ជម្រើសសម្រាប់អ្នក" : "OUR SELECTION"}</span><h2>{km ? "ទំនិញពេញនិយម" : "Featured products"}</h2><div className="filters">{categories.map(c => <button className={category === c ? "active" : ""} key={c} onClick={() => setCategory(c)}>{c === "All" && km ? "ទាំងអស់" : c}</button>)}</div><div className="product-grid">{shown.map(p => <article className="product" key={p.id}><div className="product-art"><span>{p.icon}</span>{p.label && <i>{p.label}</i>}<button onClick={() => add(p.id)} aria-label="Add to cart"><Plus/></button></div><div className="product-body"><small className="rating">★ {p.rating} · {km ? "មានក្នុងស្តុក" : "In stock"}</small><h3>{km ? p.kh : p.name}</h3><p>{km ? p.name : p.category}</p><div className="product-foot"><strong>${p.price.toFixed(2)}</strong><button onClick={() => add(p.id)}>{km ? "បន្ថែម" : "Add"} <Plus size={14}/></button></div></div></article>)}</div>{shown.length === 0 && <p className="empty">{km ? "រកមិនឃើញទំនិញទេ។" : "No products found."}</p>}</div></section>

    <section className="promo"><div className="wrap promo-inner"><div><span className="eyebrow">SPECIAL OFFER</span><h2>{km ? "មានគម្រោងថ្មីមែនទេ?" : "Planning a new project?"}</h2><p>{km ? "ទាក់ទងមកយើងសម្រាប់ការបញ្ជាទិញច្រើន និងតម្លៃពិសេស។" : "Contact us for bulk orders and project pricing."}</p></div><a href="#contact">{km ? "ទាក់ទងឥឡូវនេះ" : "Contact us"} →</a></div></section>
    <footer id="contact"><div className="wrap footer-grid"><div><a className="brand footer-brand" href="#"><span className="brand-icon"><Zap fill="currentColor"/></span><span>Volt<span className="blue">Mart</span><small>ELECTRICAL & ELECTRONICS</small></span></a><p>{km ? "ដៃគូដែលអ្នកទុកចិត្តសម្រាប់សម្ភារៈអគ្គិសនី និងអេឡិចត្រូនិក។" : "Your trusted partner for electrical supplies and electronics."}</p></div><div><h4>{km ? "ទំនាក់ទំនង" : "Contact us"}</h4><p>☎ +855 XX XXX XXX</p><p>✉ sales@example.com</p><p>⌖ Cambodia</p></div><div><h4>{km ? "ម៉ោងធ្វើការ" : "Business hours"}</h4><p>{km ? "ចន្ទ - សៅរ៍៖ 8:00 - 18:00" : "Mon - Sat: 8 AM - 6 PM"}</p><p>{km ? "អាទិត្យ៖ បិទ" : "Sunday: Closed"}</p></div></div><div className="wrap copyright">© 2026 VoltMart · Cambodia 🇰🇭 <span>{km ? "រក្សាសិទ្ធិគ្រប់យ៉ាង។" : "All rights reserved."}</span></div></footer>

    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="cart-panel" onClick={e => e.stopPropagation()}><div className="cart-head"><h2>{km ? "កន្ត្រកទំនិញ" : "Your cart"} ({count})</h2><button onClick={() => setCartOpen(false)}><X/></button></div><div className="cart-items">{products.filter(p => cart[p.id]).map(p => <div className="cart-item" key={p.id}><span>{p.icon}</span><div><b>{km ? p.kh : p.name}</b><small>${p.price.toFixed(2)}</small><div className="qty"><button onClick={() => change(p.id, -1)}><Minus size={13}/></button>{cart[p.id]}<button onClick={() => change(p.id, 1)}><Plus size={13}/></button></div></div><strong>${(p.price * cart[p.id]).toFixed(2)}</strong></div>)}</div><div className="cart-total"><span>{km ? "សរុប" : "Subtotal"}</span><b>${total.toFixed(2)}</b></div><p className="note">{km ? "កន្ត្រកសាកល្បង៖ ការទូទាត់នឹងភ្ជាប់នៅជំហានបន្ទាប់។" : "Demo cart. Checkout and payments will be added next."}</p><button className="checkout" onClick={() => alert(km ? "ការទូទាត់មិនទាន់បានភ្ជាប់ទេ។" : "Checkout is not connected yet.")}>{km ? "បន្តការបញ្ជាទិញ" : "Continue to checkout"}</button></aside></div>}
  </main>;
}
