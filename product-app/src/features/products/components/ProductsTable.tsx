import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, LoaderCircle, Package, PackageOpen, Search, Trash2, X } from "lucide-react";
import type { Product } from "../models/response/Product";
import { deleteProduct, getProducts } from "../services/ProductService";
import Alert from "../../shared/components/Alert";
import { secondaryButton } from "../../shared/components/styles";

export default function ProductsTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const query = search.trim().toLocaleLowerCase();
    const filteredProducts = products.filter((product) =>
        (product.name ?? "").toLocaleLowerCase().includes(query) ||
        product.productResourceId.toLocaleLowerCase().includes(query),
    );

    useEffect(() => {
        const controller = new AbortController();
        async function loadProducts() {
            try {
                const data = await getProducts(controller.signal);
                if (!controller.signal.aborted) setProducts(data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError(error instanceof Error ? error.message : "Error al obtener los productos");
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }
        void loadProducts();
        return () => controller.abort();
    }, []);

    const handleDelete = async (productResourceId: string) => {
        if (deletingId || !window.confirm("¿Está seguro de que desea eliminar este producto?")) return;
        setDeletingId(productResourceId);
        setError(null);
        try {
            await deleteProduct(productResourceId);
            setProducts((current) => current.filter(
                (product) => product.productResourceId !== productResourceId,
            ));
        } catch (error) {
            setError(error instanceof Error ? error.message : "No se pudo eliminar el producto");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
            <div className="flex flex-col gap-5 border-b border-slate-100 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-semibold text-slate-900">Lista de productos</h2>
                        {!isLoading && !error && <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-blue-700">{products.length}</span>}
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">Consulta los detalles y administra tu colección.</p>
                </div>
                <div className="relative w-full xl:max-w-xs">
                    <Search size={17} aria-hidden="true" className="pointer-events-none absolute top-3.5 left-3.5 text-slate-400" />
                    <label htmlFor="product-search" className="sr-only">Buscar productos</label>
                    <input id="product-search" type="search" placeholder="Buscar productos..." value={search} onChange={(event) => setSearch(event.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-4 pl-10 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10" />
                </div>
            </div>
            {error && <div className="p-5 sm:px-6"><Alert>{error}</Alert></div>}
            {isLoading ? (
                <div role="status" className="flex flex-col items-center gap-3 px-6 py-20 text-sm text-slate-500">
                    <LoaderCircle size={24} className="text-blue-600 motion-safe:animate-spin" aria-hidden="true" />
                    Cargando productos...
                </div>
            ) : (
                <>
                    {filteredProducts.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-4 sm:px-6">Producto</th>
                                        <th scope="col" className="hidden px-6 py-4 2xl:table-cell">Identificador</th>
                                        <th scope="col" className="px-5 py-4 text-right sm:px-6"><span className="sr-only sm:not-sr-only">Acciones</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.productResourceId} className="group transition-colors hover:bg-slate-50/70">
                                            <td className="px-5 py-5 sm:px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 sm:flex"><Package size={21} strokeWidth={1.5} aria-hidden="true" /></span>
                                                    <div className="min-w-0">
                                                        <Link to={`/products/${product.productResourceId}`} className="font-semibold break-all text-slate-800 transition-colors hover:text-blue-600">{product.name || "Sin nombre"}</Link>
                                                        <p className="mt-1.5 max-w-40 truncate font-mono text-[10px] text-slate-400 sm:max-w-none 2xl:hidden" title={product.productResourceId}>{product.productResourceId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden px-6 py-5 font-mono text-xs text-slate-400 2xl:table-cell">{product.productResourceId}</td>
                                            <td className="px-5 py-5 sm:px-6">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link to={`/products/${product.productResourceId}`} aria-label={`Ver detalle de ${product.name || "producto"}`}
                                                        className="inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-lg px-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                                                        <span className="hidden text-xs font-medium sm:inline">Ver detalle</span><ArrowUpRight size={17} aria-hidden="true" />
                                                    </Link>
                                                    <span className="mx-1 h-4 w-px bg-slate-200" aria-hidden="true" />
                                                    <button type="button" onClick={() => handleDelete(product.productResourceId)} disabled={deletingId !== null}
                                                        aria-label={`Eliminar ${product.name}`}
                                                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-40">
                                                        {deletingId === product.productResourceId
                                                            ? <LoaderCircle size={17} className="motion-safe:animate-spin" aria-hidden="true" />
                                                            : <Trash2 size={17} aria-hidden="true" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {filteredProducts.length === 0 && !error && (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400"><PackageOpen size={30} strokeWidth={1.5} aria-hidden="true" /></span>
                            <h3 className="font-semibold text-slate-800">{query ? "No encontramos coincidencias" : "Tu catálogo empieza aquí"}</h3>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{query ? "Prueba con otro nombre o identificador de producto." : "No hay productos registrados. Agrega el primero para empezar a organizar tu catálogo."}</p>
                            {query && <button type="button" onClick={() => setSearch("")} className={`${secondaryButton} mt-6`}><X size={15} aria-hidden="true" /> Limpiar búsqueda</button>}
                        </div>
                    )}
                    {!error && (
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/40 px-5 py-4 text-xs text-slate-400 sm:px-6">
                            <p>{filteredProducts.length} de {products.length} {products.length === 1 ? "producto" : "productos"}</p>
                            <p>Tu catálogo, siempre a mano.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
