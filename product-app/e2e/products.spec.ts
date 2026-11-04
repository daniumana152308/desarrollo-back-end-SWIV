import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

const api = process.env.E2E_API_URL ?? "http://localhost:5001/api/products";

test("API: crear, consultar, listar y eliminar persiste entre solicitudes", async ({ request }) => {
    const id = randomUUID();
    try {
        const created = await request.post(api, { data: { productResourceId: id, name: "  Prueba API  " } });
        expect(created.status()).toBe(201);
        expect(created.headers().location).toBe(`${api}/${id}`);
        expect(await created.json()).toEqual({ productResourceId: id, name: "Prueba API" });
        const detail = await request.get(`${api}/${id}`);
        expect(detail.status()).toBe(200);
        expect(await detail.json()).toEqual({ productResourceId: id, name: "Prueba API" });
        const list = await request.get(api);
        expect(list.status()).toBe(200);
        expect(await list.json()).toContainEqual({ productResourceId: id, name: "Prueba API" });
        expect((await request.delete(`${api}/${id}`)).status()).toBe(204);
        expect((await request.get(`${api}/${id}`)).status()).toBe(404);
        expect((await request.delete(`${api}/${id}`)).status()).toBe(404);
    } finally {
        await request.delete(`${api}/${id}`);
    }
});

test("API: genera un GUID y acepta el limite de 50 caracteres", async ({ request }) => {
    let id: string | undefined;
    try {
        const response = await request.post(api, { data: { name: "a".repeat(50) } });
        expect(response.status()).toBe(201);
        const product = await response.json();
        id = product.productResourceId;
        expect(id).toMatch(/^[0-9a-f-]{36}$/);
        expect(product.name).toHaveLength(50);
    } finally {
        if (id) await request.delete(`${api}/${id}`);
    }
});

for (const [label, data] of [
    ["nombre ausente", {}],
    ["nombre vacio", { name: "" }],
    ["espacios", { name: "   " }],
    ["nombre corto tras trim", { name: " a " }],
    ["nombre mayor a 50", { name: "a".repeat(51) }],
    ["GUID vacio", { name: "Prueba", productResourceId: "00000000-0000-0000-0000-000000000000" }],
    ["GUID mal formado", { name: "Prueba", productResourceId: "invalid" }],
] as const) {
    test(`API: rechaza ${label}`, async ({ request }) => {
        const response = await request.post(api, { data });
        expect(response.status()).toBe(400);
        expect((await response.json()).errors).toBeTruthy();
    });
}

test("API: no permite duplicados incluso en solicitudes concurrentes", async ({ request }) => {
    const id = randomUUID();
    try {
        const results = await Promise.all([
            request.post(api, { data: { productResourceId: id, name: "Concurrente uno" } }),
            request.post(api, { data: { productResourceId: id, name: "Concurrente dos" } }),
        ]);
        expect(results.map(result => result.status()).sort()).toEqual([201, 409]);
        const conflict = results.find(result => result.status() === 409)!;
        expect((await conflict.json()).title).toContain("identificador");
    } finally {
        await request.delete(`${api}/${id}`);
    }
});

test("API: identificadores invalidos y recursos inexistentes", async ({ request }) => {
    expect((await request.get(`${api}/invalid`)).status()).toBe(400);
    const missing = await request.get(`${api}/${randomUUID()}`);
    expect(missing.status()).toBe(404);
    const problem = await missing.json();
    expect(problem.title).toBe("El producto no existe.");
    expect(problem.traceId).toBeTruthy();
    expect(problem.stackTrace).toBeUndefined();
});

test("API: CORS permite el frontend y excluye otros origenes", async ({ request }) => {
    for (const method of ["POST", "DELETE"]) {
        const response = await request.fetch(api, {
            method: "OPTIONS",
            headers: {
                Origin: "http://localhost:5173",
                "Access-Control-Request-Method": method,
                "Access-Control-Request-Headers": "content-type",
            },
        });
        expect(response.status()).toBe(204);
        expect(response.headers()["access-control-allow-origin"]).toBe("http://localhost:5173");
        expect(response.headers()["access-control-allow-methods"]).toContain(method);
    }
    const denied = await request.get(api, { headers: { Origin: "https://untrusted.example" } });
    expect(denied.headers()["access-control-allow-origin"]).toBeUndefined();
});

test("navegador: inicio, validacion, creacion, detalle, recarga y borrado", async ({ page, request }) => {
    const name = `E2E ${randomUUID()}`;
    let id: string | undefined;
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    try {
        await page.goto("/");
        await expect(page).toHaveURL(/\/products$/);
        await expect(page.getByRole("heading", { name: "Productos", exact: true })).toBeVisible();
        await page.getByRole("link", { name: "Agregar producto", exact: true }).click();
        await page.getByLabel("Nombre del producto").fill(" ");
        await page.getByRole("button", { name: "Guardar producto" }).click();
        await expect(page.getByRole("alert")).toContainText("al menos 2");
        await expect(page.getByLabel("Nombre del producto")).toHaveAttribute("maxlength", "50");
        await page.getByLabel("Nombre del producto").fill(name);
        const createdResponse = page.waitForResponse(response =>
            response.url().endsWith("/api/products") && response.request().method() === "POST",
        );
        await page.getByRole("button", { name: "Guardar producto" }).click();
        const response = await createdResponse;
        expect(response.status()).toBe(201);
        id = (await response.json()).productResourceId;
        await expect(page).toHaveURL(/\/products$/);
        await page.getByRole("searchbox", { name: "Buscar productos" }).fill(name.toUpperCase());
        await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
        await page.getByRole("searchbox", { name: "Buscar productos" }).fill(id!);
        await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
        await page.getByRole("searchbox", { name: "Buscar productos" }).fill("sin-coincidencias-" + name);
        await expect(page.getByRole("heading", { name: "No encontramos coincidencias" })).toBeVisible();
        await page.getByRole("button", { name: "Limpiar búsqueda" }).click();
        await page.getByRole("link", { name, exact: true }).click();
        await expect(page.getByRole("heading", { name: "Detalle del producto" })).toBeVisible();
        await expect(page.getByText(name, { exact: true })).toBeVisible();
        await page.reload();
        await expect(page.getByText(name, { exact: true })).toBeVisible();
        await page.getByRole("link", { name: "Volver a productos" }).click();
        page.once("dialog", dialog => dialog.dismiss());
        await page.getByRole("button", { name: `Eliminar ${name}`, exact: true }).click();
        await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
        page.once("dialog", dialog => dialog.accept());
        await page.getByRole("button", { name: `Eliminar ${name}`, exact: true }).click();
        await expect(page.getByRole("link", { name, exact: true })).toHaveCount(0);
        await page.reload();
        await expect(page.getByRole("status")).toHaveCount(0);
        await expect(page.getByRole("link", { name, exact: true })).toHaveCount(0);
        expect(errors).toEqual([]);
    } finally {
        if (id) await request.delete(`${api}/${id}`);
    }
});

test("navegador: ruta desconocida, GUID invalido y detalle inexistente", async ({ page }) => {
    await page.goto("/ruta-inexistente");
    await expect(page.getByRole("heading", { name: "Esta página no existe" })).toBeVisible();
    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page).toHaveURL(/\/products$/);
    await page.goto("/products/invalid");
    await expect(page.getByRole("alert")).toContainText("Identificador de producto no válido");
    await page.goto(`/products/${randomUUID()}`);
    await expect(page.getByRole("alert")).toHaveText("El producto no existe.");
});

test("navegador: presenta fallos de red y errores de validacion de la API", async ({ page }) => {
    await page.route("**/api/products", route => route.abort());
    await page.goto("/products");
    await expect(page.getByRole("alert")).toContainText("No se pudo conectar");
    await page.unroute("**/api/products");
    await page.route("**/api/products", route => route.fulfill({
        status: 400,
        contentType: "application/problem+json",
        body: JSON.stringify({ errors: { Name: ["Nombre rechazado por el servidor."] } }),
    }));
    await page.goto("/products/new");
    await page.getByLabel("Nombre del producto").fill("Prueba controlada");
    await page.getByRole("button", { name: "Guardar producto" }).click();
    await expect(page.getByRole("alert")).toHaveText("Nombre rechazado por el servidor.");
    await expect(page.getByRole("button", { name: "Guardar producto" })).toBeEnabled();
});

test("navegador: formulario utilizable en pantalla movil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/products/new");
    await expect(page.getByLabel("Nombre del producto")).toBeVisible();
    await expect(page.getByRole("button", { name: "Guardar producto" })).toBeVisible();
    const widths = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
    }));
    expect(widths.content).toBeLessThanOrEqual(widths.viewport);
});
