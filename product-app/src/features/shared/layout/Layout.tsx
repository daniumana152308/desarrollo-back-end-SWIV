import { ChevronRight, Layers3 } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function Layout() {
    const { pathname } = useLocation();
    const currentPage = pathname === "/products/new" ? "Nuevo producto"
        : pathname === "/products" || pathname === "/" ? "Productos"
        : pathname.startsWith("/products/") ? "Detalle" : "Página no encontrada";

    return (
        <div className="min-h-svh">
            <a href="#main-content" className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-white p-3 text-blue-700 shadow-lg focus:not-sr-only">Saltar al contenido</a>
            <NavBar />
            <div className="flex min-h-svh min-w-0 flex-col lg:pl-64">
                <header className="hidden h-20 items-center justify-between border-b border-slate-200/70 bg-white/80 px-8 lg:flex xl:px-12">
                    <nav aria-label="Ruta de navegación" className="flex items-center gap-3 text-sm">
                        <Link to="/products" className="text-slate-400 hover:text-blue-600">Catálogo</Link>
                        <ChevronRight size={14} className="text-slate-300" aria-hidden="true" />
                        <span aria-current="page" className="font-medium text-slate-700">{currentPage}</span>
                    </nav>
                    <span className="flex items-center gap-2 text-xs text-slate-400"><Layers3 size={15} aria-hidden="true" /> Gestión de productos</span>
                </header>
                <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 sm:py-10 xl:px-12 xl:py-12">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
