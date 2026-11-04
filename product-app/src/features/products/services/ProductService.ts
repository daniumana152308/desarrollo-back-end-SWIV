import { config } from "../../../config";
import type { Product } from "../models/response/Product";
import type { NewProduct } from "../models/request/Product";

const API_URL = `${config.api.url}/api/products`;

type ApiProblem = {
    title?: string;
    detail?: string;
    errors?: Record<string, string[]>;
};

async function request(path = "", options: RequestInit = {}): Promise<Response> {
    let response: Response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            signal: options.signal
                ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)])
                : AbortSignal.timeout(15000),
        });
    } catch (error) {
        if (options.signal?.aborted) throw error;
        throw new Error("No se pudo conectar con el servidor. Verifica que la API esté disponible.");
    }

    if (!response.ok) {
        let message = `No se pudo completar la solicitud (${response.status}).`;
        try {
            const problem: ApiProblem = await response.json();
            const validationErrors = problem.errors
                ? Object.values(problem.errors).flat().join(" ")
                : "";
            message = validationErrors || problem.detail || problem.title || message;
        } catch {
            // Some proxies return HTML or an empty response instead of ProblemDetails.
        }
        throw new Error(message);
    }

    return response;
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
    const response = await request("", { signal });
    return response.json();
}

export async function createProduct(product: NewProduct): Promise<Product> {
    const response = await request("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    return response.json();
}

export async function deleteProduct(productResourceId: string): Promise<void> {
    await request(`/${encodeURIComponent(productResourceId)}`, { method: "DELETE" });
}

export async function getProductById(
    productResourceId: string, signal?: AbortSignal,
): Promise<Product> {
    const response = await request(`/${encodeURIComponent(productResourceId)}`, { signal });
    return response.json();
}