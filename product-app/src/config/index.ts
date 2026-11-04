import rawConfig from "./config.json";
import type { Configuration } from "./configuration";

export const config: Configuration = {
    api: {
        url: (import.meta.env.VITE_API_URL ?? rawConfig.api.url).replace(/\/+$/, ""),
    },
};