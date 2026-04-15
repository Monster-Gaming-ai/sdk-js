/**
 * Monster Gaming SDK for TypeScript/JavaScript
 *
 * OpenAI-compatible client for the Monster Gaming API.
 * https://monstergaming.ai
 */
export interface MonsterGamingOptions {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
}
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    stream?: boolean;
    stop?: string | string[];
}
export interface ChatCompletionChoice {
    index: number;
    message: ChatMessage;
    finish_reason: string;
}
export interface Usage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}
export interface ChatCompletionResponse {
    id: string;
    object: 'chat.completion';
    created: number;
    model: string;
    choices: ChatCompletionChoice[];
    usage: Usage;
}
export interface Model {
    id: string;
    object: 'model';
    created: number;
    owned_by: string;
}
export interface ModelList {
    object: 'list';
    data: Model[];
}
declare class MonsterGamingError extends Error {
    status: number;
    body?: unknown | undefined;
    constructor(message: string, status: number, body?: unknown | undefined);
}
export declare class MonsterGaming {
    private apiKey;
    private baseURL;
    private timeout;
    chat: {
        completions: {
            create: (params: ChatCompletionRequest) => Promise<ChatCompletionResponse>;
        };
    };
    models: {
        list: () => Promise<ModelList>;
    };
    constructor(options: MonsterGamingOptions);
    private request;
    private createChatCompletion;
    private listModels;
}
export { MonsterGamingError };
export default MonsterGaming;
