import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

export default function Alert({ children, id }: { children: ReactNode; id?: string }) {
    return (
        <div id={id} role="alert" className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{children}</span>
        </div>
    );
}
