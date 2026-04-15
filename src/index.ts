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

class MonsterGamingError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'MonsterGamingError';
  }
}

export class MonsterGaming {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  public chat: {
    completions: {
      create: (params: ChatCompletionRequest) => Promise<ChatCompletionResponse>;
    };
  };

  public models: {
    list: () => Promise<ModelList>;
  };

  constructor(options: MonsterGamingOptions) {
    this.apiKey = options.apiKey;
    this.baseURL = (options.baseURL ?? 'https://api.monstergaming.ai').replace(
      /\/$/,
      '',
    );
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

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
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
        throw new MonsterGamingError(
          `Monster Gaming API error: ${res.status} ${res.statusText}`,
          res.status,
          errorBody ? JSON.parse(errorBody) : undefined,
        );
      }

      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  private async createChatCompletion(
    params: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    return this.request<ChatCompletionResponse>(
      'POST',
      '/v1/chat/completions',
      params,
    );
  }

  private async listModels(): Promise<ModelList> {
    return this.request<ModelList>('GET', '/v1/models');
  }
}

export { MonsterGamingError };
export default MonsterGaming;
