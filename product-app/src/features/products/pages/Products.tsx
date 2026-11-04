import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ProductsTable from "../components/ProductsTable";
import { primaryButton } from "../../shared/components/styles";

export default function Products() {
    return (
        <section aria-labelledby="products-title" className="space-y-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-blue-600">TU ESPACIO, EN ORDEN</p>
                    <h1 id="products-title" className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Productos</h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Organiza tu catálogo y encuentra cada producto en un solo lugar.</p>
                </div>
                <Link to="/products/new" className={primaryButton}>
                    <Plus size={18} aria-hidden="true" /> Agregar producto
                </Link>
            </div>
            <ProductsTable />
        </section>
    );
}
