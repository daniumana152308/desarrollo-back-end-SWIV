import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Layers3, LayoutGrid, Package, Plus } from "lucide-react";

export default function NavBar() {
    const { pathname } = useLocation();
    const catalogActive = pathname.startsWith("/products") && pathname !== "/products/new";
    const itemClass = (active: boolean) =>
        `flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`;

    return (
        <aside className="border-b border-slate-200/80 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
            <div className="flex items-center justify-between px-5 py-5 sm:px-7 lg:pt-8 lg:pb-10">
                <Link to="/products" aria-label="ProductHub, inicio" className="inline-flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/15">
                        <Package size={22} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Product<span className="font-normal text-slate-500">Hub</span></span>
                </Link>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-widest text-slate-500 lg:hidden">CATÁLOGO</span>
            </div>
            <nav aria-label="Navegación principal" className="px-4 pb-4 lg:px-5">
                <p className="mb-3 hidden px-4 text-[10px] font-semibold tracking-[0.18em] text-slate-400 lg:block">ESPACIO DE TRABAJO</p>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                    <NavLink to="/products" end className={itemClass(catalogActive)}>
                        <LayoutGrid size={18} aria-hidden="true" />
                        Productos
                        <span className={`ml-auto hidden size-1.5 rounded-full lg:block ${catalogActive ? "bg-blue-600" : "bg-transparent"}`} />
                    </NavLink>
                    <NavLink to="/products/new" className={({ isActive }) => itemClass(isActive)}>
                        <Plus size={18} aria-hidden="true" />
                        Nuevo producto
                    </NavLink>
                </div>
            </nav>
            <div className="mt-auto hidden p-5 lg:block">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <Layers3 size={22} className="mb-3 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
                    <p className="text-sm font-semibold text-slate-700">Un catálogo organizado.</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">Cada producto en su lugar. Toda la información a mano.</p>
                    <Link to="/products/new" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800">
                        Crear un producto <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
