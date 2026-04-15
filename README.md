# Monster Gaming SDK for TypeScript/JavaScript

Official TypeScript/JavaScript client for [Monster Gaming](https://monstergaming.ai) — an AI-powered game development platform for Unreal Engine, Unity, Godot, and bespoke engines.

## Installation

```bash
npm install @monstergaming/sdk
```

## Quick Start

```typescript
import { MonsterGaming } from '@monstergaming/sdk';

const client = new MonsterGaming({ apiKey: 'mg_your_api_key' });

const response = await client.chat.completions.create({
  model: 'monster-gpt',
  messages: [
    {
      role: 'user',
      content: 'Generate a UE5 C++ character controller with double jump',
    },
  ],
});

console.log(response.choices[0].message.content);
```

## Monster-GPT

`monster-gpt` is Monster Gaming's flagship model. It auto-detects your game engine and routes your query to a specialist agent — shader programming, networking, animation, level design, QA, and 25+ other disciplines.

```typescript
// Engine-aware code generation
const response = await client.chat.completions.create({
  model: 'monster-gpt',
  messages: [
    { role: 'system', content: 'Engine: Unity 6. Language: C#.' },
    { role: 'user', content: 'Implement object pooling for projectiles' },
  ],
});
```

## Available Models

```typescript
const models = await client.models.list();
console.log(models.data.map((m) => m.id));
```

Budget models (Free tier): `monster-gpt`, `claude-haiku`, `deepseek-chat`, `codestral`, `gemini-3-flash`

Standard models (Starter+): `claude-sonnet`, `gpt-4o`, `gemini-3.1-pro`, `mistral-large`

Premium models (Pro+): `claude-opus`, `o3`, `gpt-5.4`

## Pricing

Free tier available — no credit card required. See [monstergaming.ai/pricing](https://monstergaming.ai/pricing) for details.

## Documentation

Full documentation at [monstergaming.ai/quickstart](https://monstergaming.ai/quickstart).

## License

MIT
