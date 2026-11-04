import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import { primaryButton, secondaryButton } from "./styles";

export default function NotFound() {
    return (
        <section aria-labelledby="not-found-title" className="mx-auto flex max-w-xl flex-col items-center py-12 text-center sm:py-20">
            <span className="relative mb-8 flex size-24 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 text-blue-500">
                <Compass size={44} strokeWidth={1.2} aria-hidden="true" />
                <span className="absolute -right-3 -bottom-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-500 shadow-sm">404</span>
            </span>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-blue-600">FUERA DE RUTA</p>
            <h1 id="not-found-title" className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Esta página no existe</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">La dirección puede haber cambiado o estar escrita incorrectamente. Tu catálogo sigue en su lugar.</p>
            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <Link to="/" className={secondaryButton}><ArrowLeft size={16} aria-hidden="true" />Volver al inicio</Link>
                <Link to="/products" className={primaryButton}>Volver a productos<ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
        </section>
    );
}
