const currentYear = new Date().getFullYear();

export default function Footer() {
    return (
        <footer className="mx-5 border-t border-slate-200/70 py-5 sm:mx-8 xl:mx-12">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <p>&copy; {currentYear} ProductHub.</p>
                <p>Tu catálogo, en un solo lugar.</p>
            </div>
        </footer>
    );
}
