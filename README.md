# Prompter

Turn any idea into a powerful AI prompt. Prompter helps you transform rough ideas or gibberish prompts into well-crafted, professional AI prompts using free Hugging Face models.

## Features

- 🎯 Transform ideas into structured AI prompts
- ⚙️ Customizable prompt components (Role, Tone, Safety Rules, Examples)
- 🤖 Powered by free AI models (Groq or Hugging Face)
- 💾 Copy generated prompts with one click
- 🎨 Modern dark-themed UI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. (Recommended) Set up AI API Keys for real AI-powered prompts:

   **Option 1: Groq API (Recommended - Free, Fast)**
   - Get a free API key at [Groq Console](https://console.groq.com)
   - No credit card required, very fast responses

   **Option 2: Hugging Face API Token**
   - Create a free account at [Hugging Face](https://huggingface.co/)
   - Get an API token from [settings](https://huggingface.co/settings/tokens)

   Create a `.env.local` file in the root directory:

   ```env
   GROQ_API_KEY=your_groq_key_here
   # OR
   HUGGINGFACE_API_TOKEN=your_hf_token_here
   ```

   **Note:** Without API keys, the app uses template-based generation (not AI). Adding an API key enables real AI-powered prompt generation!

### Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to Use

1. Enter your idea or rough prompt in the text area
2. Select which components you want included:
   - **Include Role**: Adds a role definition for the AI
   - **Include Tone**: Adds tone and style guidelines
   - **Include Safety Rules**: Adds safety and ethical guidelines
   - **Include Examples**: Adds example-based instructions
3. Click "Generate Prompt"
4. Copy the generated prompt using the "Copy Prompt" button

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Groq API** - Fast, free AI inference (preferred)
- **Hugging Face Inference API** - Alternative free AI models

## API Route

The app includes an API route at `/api/generate` that:
- Accepts user ideas and options
- **Uses real AI models** to generate intelligent, context-aware prompts:
  - **Primary**: Groq API (tries Llama 3.3 70B → Llama 3.1 8B → Mixtral → Gemma2)
  - **Secondary**: HuggingFace with Mixtral-8x7B, Mistral-7B, or Llama-3-8B
  - **Fallback**: Template-based generation if no API keys configured
- Automatically tries multiple models and providers for maximum reliability


## License

MIT
