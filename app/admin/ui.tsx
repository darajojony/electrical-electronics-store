"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingBag, LogOut, Plus, Search, AlertTriangle, Boxes, X, RefreshCw } from "lucide-react";

type Category = { id: string; name: string; nameKm: string; slug: string };
type Product = { id: string; sku: string; name: string; nameKm: string; price: string | number; stock: number; active: boolean; featured: boolean; category: Category };
type Summary = { products: number; activeProducts: number; lowStock: number; orders: number; pendingOrders: number; categories: number };
const emptySummary: Summary = { products: 0, activeProducts: 0, lowStock: 0, orders: 0, pendingOrders: 0, categories: 0 };

export default function AdminDashboard({ initialEmail, role }: { initialEmail: string; role: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "products">("overview");
  const [summary, setSummary] = useState(emptySummary);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ sku: "", name: "", nameKm: "", categoryId: "", price: "", stock: "0" });

  async function load() {
    setError("");
    const [s, p, c] = await Promise.all([fetch("/api/admin/summary"), fetch("/api/products?all=true"), fetch("/api/categories?all=true")]);
    if (s.status === 401) { router.replace("/admin/login"); return; }
    const sd = await s.json(); const pd = await p.json(); const cd = await c.json();
    if (!s.ok || !p.ok || !c.ok) { setError(sd.error || pd.error || cd.error || "មិនអាចទាញទិន្នន័យបាន។"); return; }
    setSummary(sd); setProducts(pd.products); setCategories(cd.categories);
    if (!form.categoryId && cd.categories[0]) setForm(v => ({ ...v, categoryId: cd.categories[0].id }));
  }
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => products.filter(p => (p.name + p.nameKm + p.sku).toLowerCase().includes(query.toLowerCase())), [products, query]);

  async function addProduct(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Create product failed");
      setShowForm(false); setForm({ sku: "", name: "", nameKm: "", categoryId: categories[0]?.id || "", price: "", stock: "0" }); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "មានបញ្ហា"); }
    finally { setBusy(false); }
  }
  async function archive(id: string) {
    if (!confirm("តើអ្នកប្រាកដថាចង់លាក់ទំនិញនេះមែនទេ?")) return;
    const response = await fetch("/api/products/" + id, { method: "DELETE" });
    if (!response.ok) { setError("មិនអាចលាក់ទំនិញបានទេ។"); return; }
    await load();
  }
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login"); router.refresh();
  }

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a href="/" className="admin-brand"><span>⚡</span> VoltMart <small>ADMIN</small></a>
      <div className="admin-nav-label">WORKSPACE</div>
      <button className={tab === "overview" ? "selected" : ""} onClick={() => setTab("overview")}><LayoutDashboard size={17}/> ទិដ្ឋភាពទូទៅ</button>
      <button className={tab === "products" ? "selected" : ""} onClick={() => setTab("products")}><Package size={17}/> គ្រប់គ្រងទំនិញ</button>
      <a href="/" className="back-store">↗ មើលហាង</a>
      <div className="sidebar-user"><b>{initialEmail}</b><small>{role}</small><button onClick={logout}><LogOut size={15}/> ចាកចេញ</button></div>
    </aside>
    <section className="admin-main">
      <header className="admin-top"><div><span>ADMINISTRATION</span><h1>{tab === "overview" ? "ទិដ្ឋភាពទូទៅ" : "គ្រប់គ្រងផលិតផល"}</h1></div><button className="refresh-btn" onClick={load}><RefreshCw size={15}/> Refresh</button></header>
      {error && <div className="admin-alert"><AlertTriangle size={17}/>{error}</div>}
      {tab === "overview" ? <>
        <div className="stat-grid">
          <div className="stat-card"><span>ផលិតផលសរុប</span><b>{summary.products}</b><Package/></div>
          <div className="stat-card"><span>កំពុងដាក់លក់</span><b>{summary.activeProducts}</b><Boxes/></div>
          <div className="stat-card warning"><span>ស្តុកទាប (≤ 5)</span><b>{summary.lowStock}</b><AlertTriangle/></div>
          <div className="stat-card"><span>ប្រភេទទំនិញ</span><b>{summary.categories}</b><Tags/></div>
          <div className="stat-card"><span>ការបញ្ជាទិញ</span><b>{summary.orders}</b><ShoppingBag/></div>
          <div className="stat-card warning"><span>រង់ចាំបញ្ជាក់</span><b>{summary.pendingOrders}</b><ShoppingBag/></div>
        </div>
        <div className="admin-panel"><h2>សកម្មភាពរហ័ស</h2><p>គ្រប់គ្រងព័ត៌មានទំនិញ និងពិនិត្យស្ថានភាពស្តុករបស់ហាង។</p><button className="primary-admin" onClick={() => setTab("products")}><Package size={16}/> ចូលទៅគ្រប់គ្រងទំនិញ</button></div>
      </> : <>
        <div className="product-toolbar"><div className="admin-search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ស្វែងរកតាមឈ្មោះ ឬ SKU..."/></div><button className="primary-admin" onClick={() => setShowForm(true)}><Plus size={16}/> បន្ថែមទំនិញ</button></div>
        <div className="admin-panel table-panel"><div className="table-scroll"><table><thead><tr><th>SKU</th><th>ឈ្មោះផលិតផល</th><th>ប្រភេទ</th><th>តម្លៃ</th><th>ស្តុក</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr></thead><tbody>
          {filtered.map(p => <tr key={p.id}><td>{p.sku}</td><td><b>{p.name}</b><small className="kh-sub">{p.nameKm}</small></td><td>{p.category?.nameKm || p.category?.name}</td><td>${Number(p.price).toFixed(2)}</td><td><span className={p.stock <= 5 ? "stock-low" : ""}>{p.stock}</span></td><td><span className={p.active ? "status-active" : "status-off"}>{p.active ? "កំពុងលក់" : "បានលាក់"}</span></td><td><button className="archive-btn" disabled={!p.active} onClick={() => archive(p.id)}>លាក់</button></td></tr>)}
          {filtered.length === 0 && <tr><td colSpan={7} className="no-data">មិនមានទិន្នន័យទំនិញ</td></tr>}
        </tbody></table></div></div>
      </>}
    </section>
    {showForm && <div className="admin-modal-backdrop" onClick={() => setShowForm(false)}><form className="admin-modal" onSubmit={addProduct} onClick={e => e.stopPropagation()}>
      <div className="modal-title"><h2>បន្ថែមផលិតផលថ្មី</h2><button type="button" onClick={() => setShowForm(false)}><X/></button></div>
      <label>SKU *<input required value={form.sku} onChange={e => setForm(v => ({...v,sku:e.target.value}))} placeholder="EL-001"/></label>
      <label>Product name (English) *<input required value={form.name} onChange={e => setForm(v => ({...v,name:e.target.value}))}/></label>
      <label>ឈ្មោះផលិតផល (ខ្មែរ) *<input required value={form.nameKm} onChange={e => setForm(v => ({...v,nameKm:e.target.value}))}/></label>
      <label>ប្រភេទទំនិញ *<select required value={form.categoryId} onChange={e => setForm(v => ({...v,categoryId:e.target.value}))}>{categories.map(c => <option key={c.id} value={c.id}>{c.nameKm} / {c.name}</option>)}</select></label>
      <div className="form-row"><label>តម្លៃ ($) *<input type="number" min="0" step="0.01" required value={form.price} onChange={e => setForm(v => ({...v,price:e.target.value}))}/></label><label>ចំនួនស្តុក *<input type="number" min="0" step="1" required value={form.stock} onChange={e => setForm(v => ({...v,stock:e.target.value}))}/></label></div>
      <button className="primary-admin" disabled={busy}>{busy ? "កំពុងរក្សាទុក..." : "រក្សាទុកផលិតផល"}</button>
    </form></div>}
  </main>;
}
