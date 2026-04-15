/**
 * Monster Gaming SDK for TypeScript/JavaScript
 *
 * OpenAI-compatible client for the Monster Gaming API.
 * https://monstergaming.ai
 */
class MonsterGamingError extends Error {
    status;
    body;
    constructor(message, status, body) {
        super(message);
        this.status = status;
        this.body = body;
        this.name = 'MonsterGamingError';
    }
}
export class MonsterGaming {
    apiKey;
    baseURL;
    timeout;
    chat;
    models;
    constructor(options) {
        this.apiKey = options.apiKey;
        this.baseURL = (options.baseURL ?? 'https://api.monstergaming.ai').replace(/\/$/, '');
        this.timeout = options.timeout ?? 120_000;
        this.chat = {
            completions: {
                create: (params) => this.createChatCompletion(params),
            },
        };
        this.models = {
            list: () => this.listModels(),
        };
    }
    async request(method, path, body) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);
        try {
            const res = await fetch(`${this.baseURL}${path}`, {
                method,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });
            if (!res.ok) {
                const errorBody = await res.text().catch(() => null);
                throw new MonsterGamingError(`Monster Gaming API error: ${res.status} ${res.statusText}`, res.status, errorBody ? JSON.parse(errorBody) : undefined);
            }
            return (await res.json());
        }
        finally {
            clearTimeout(timer);
        }
    }
    async createChatCompletion(params) {
        return this.request('POST', '/v1/chat/completions', params);
    }
    async listModels() {
        return this.request('GET', '/v1/models');
    }
}
export { MonsterGamingError };
export default MonsterGaming;
