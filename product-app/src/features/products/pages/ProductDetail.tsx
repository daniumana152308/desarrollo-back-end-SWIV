import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Hash, LoaderCircle, Package } from "lucide-react";
import { getProductById } from "../services/ProductService";
import type { Product } from "../models/response/Product";
import Alert from "../../shared/components/Alert";
import { backLink, secondaryButton } from "../../shared/components/styles";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        return (
            <section className="space-y-5">
                <Link to="/products" className={backLink}><ArrowLeft size={16} aria-hidden="true" /> Volver a productos</Link>
                <Alert>Identificador de producto no válido.</Alert>
            </section>
        );
    }
    return <ProductDetails key={id} id={id} />;
}

function ProductDetails({ id }: { id: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        async function loadProduct() {
            try {
                const data = await getProductById(id, controller.signal);
                if (!controller.signal.aborted) setProduct(data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError(error instanceof Error ? error.message : "Error al obtener el producto");
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }
        void loadProduct();
        return () => controller.abort();
    }, [id]);

    return (
        <section aria-labelledby="detail-title">
            <Link to="/products" className={backLink}><ArrowLeft size={16} aria-hidden="true" /> Volver a productos</Link>
            <div className="mt-6 mb-8">
                <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-blue-600">CADA DETALLE CUENTA</p>
                <h1 id="detail-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Detalle del producto</h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">Toda la información de este producto, en un mismo lugar.</p>
            </div>
            {isLoading && <div role="status" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500"><LoaderCircle size={20} className="text-blue-600 motion-safe:animate-spin" aria-hidden="true" />Cargando producto...</div>}
            {error && <Alert>{error}</Alert>}
            {!isLoading && !error && product && (
                <div className="max-w-3xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
                    <div className="flex items-center gap-5 border-b border-slate-100 p-6 sm:p-8">
                        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600"><Package size={30} strokeWidth={1.4} aria-hidden="true" /></span>
                        <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Nombre del producto</p>
                            <h2 className="text-xl font-semibold break-words text-slate-900 sm:text-2xl">{product.name || "Sin nombre"}</h2>
                        </div>
                    </div>
                    <dl className="p-6 sm:p-8">
                        <dt className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500"><Hash size={15} aria-hidden="true" />Identificador del producto</dt>
                        <dd className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 font-mono text-xs leading-6 break-all text-slate-600 sm:text-sm">{product.productResourceId}</dd>
                    </dl>
                    <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
                        <Link to="/products" className={secondaryButton}>Ver catálogo<ArrowUpRight size={16} aria-hidden="true" /></Link>
                    </div>
                </div>
            )}
        </section>
    );
}
