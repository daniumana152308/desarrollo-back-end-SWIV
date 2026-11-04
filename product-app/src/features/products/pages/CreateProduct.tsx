import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Info, LoaderCircle, PackagePlus } from "lucide-react";
import { createProduct } from "../services/ProductService";
import type { NewProduct } from "../models/request/Product";
import Alert from "../../shared/components/Alert";
import { backLink, inputStyles, primaryButton, secondaryButton } from "../../shared/components/styles";

type ProductFormValues = { name: string };

export default function CreateProduct() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
        defaultValues: { name: "" },
    });

    const onSubmit = async (data: ProductFormValues) => {
        setServerError(null);
        const request: NewProduct = { name: data.name.trim() };
        try {
            await createProduct(request);
            navigate("/products");
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Error al registrar el producto");
        }
    };

    return (
        <section aria-labelledby="create-title">
            <Link to="/products" className={backLink}><ArrowLeft size={16} aria-hidden="true" /> Volver a productos</Link>
            <div className="mt-6 mb-8">
                <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-blue-600">HAZ CRECER TU CATÁLOGO</p>
                <h1 id="create-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Agregar producto</h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">Un nuevo producto, todo en su lugar. Completa la información para comenzar.</p>
            </div>
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
                    <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-6 sm:px-7">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><PackagePlus size={21} strokeWidth={1.6} aria-hidden="true" /></span>
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">Información del producto</h2>
                            <p className="mt-1 text-xs leading-5 text-slate-500">Los detalles que identifican tu producto.</p>
                        </div>
                    </div>
                    <div className="space-y-6 px-5 py-7 sm:px-7 sm:py-8">
                        <div>
                            <div className="mb-2.5 flex items-center justify-between gap-3">
                                <label htmlFor="name" className="text-sm font-semibold text-slate-700">Nombre del producto</label>
                                <span className="text-[11px] text-slate-400">Obligatorio</span>
                            </div>
                            <input id="name" type="text" maxLength={50} placeholder="Ejemplo: Café de especialidad"
                                className={inputStyles}
                                {...register("name", {
                                    required: "El nombre es obligatorio",
                                    maxLength: { value: 50, message: "El nombre debe tener como máximo 50 caracteres" },
                                    validate: (value) => value.trim().length >= 2 || "El nombre debe tener al menos 2 caracteres",
                                })}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? "name-help name-error" : "name-help"} />
                            <p id="name-help" className="mt-2.5 text-xs leading-5 text-slate-400">Usa un nombre claro y fácil de reconocer. Entre 2 y 50 caracteres.</p>
                            {errors.name && <div className="mt-4"><Alert id="name-error">{errors.name.message}</Alert></div>}
                        </div>
                        {serverError && <Alert>{serverError}</Alert>}
                    </div>
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-7">
                        <Link to="/products" className={secondaryButton}>Cancelar</Link>
                        <button type="submit" disabled={isSubmitting} className={primaryButton}>
                            {isSubmitting ? <LoaderCircle size={17} className="motion-safe:animate-spin" aria-hidden="true" /> : null}
                            {isSubmitting ? "Guardando..." : "Guardar producto"}
                            {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
                        </button>
                    </div>
                </form>
                <aside aria-label="Consejos para agregar productos" className="rounded-2xl border border-blue-100/70 bg-blue-50/60 p-6">
                    <Info size={21} className="mb-4 text-blue-500" strokeWidth={1.6} aria-hidden="true" />
                    <h2 className="text-sm font-semibold text-slate-800">Pequeños detalles, más orden</h2>
                    <ul className="mt-4 space-y-4 text-xs leading-6 text-slate-500">
                        <li className="flex items-start gap-2.5"><Check size={15} className="mt-1 shrink-0 text-blue-500" aria-hidden="true" />Elige un nombre que distinga este producto del resto.</li>
                        <li className="flex items-start gap-2.5"><Check size={15} className="mt-1 shrink-0 text-blue-500" aria-hidden="true" />Podrás consultar sus detalles desde el catálogo.</li>
                        <li className="flex items-start gap-2.5"><Check size={15} className="mt-1 shrink-0 text-blue-500" aria-hidden="true" />Al guardar, encontrarás tu nuevo producto en la lista.</li>
                    </ul>
                </aside>
            </div>
        </section>
    );
}
