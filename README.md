# 🛡️ Armada Security Agent - Vercel AI SDK Vulnerability Detection

A production-ready security vulnerability detection agent powered by the **[Vercel AI SDK](https://sdk.vercel.ai/)**. Analyze websites, code, and system architectures for security vulnerabilities in real-time. Because it uses the Vercel AI toolkit, it requires **no local LLM engine**, is fully serverless, and allows you to easily bypass Anthropic by swapping to OpenAI, Google Gemini, or Groq with a single line of code. 

🔴 **Live Demo:** [https://armada-three-kohl.vercel.app/](https://armada-three-kohl.vercel.app/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_REPO)

---


## 🎯 Features

* **Vercel AI SDK Integration**: A unified, provider-agnostic API. Switch between AI models (GPT-4o, Gemini 1.5 Pro, Claude) effortlessly.
* **Serverless & Cloud-Native**: No local LLM engines (like Ollama) required. Runs entirely on Vercel's edge/serverless infrastructure.
* **3 Analysis Modes**:
  * 🔗 **URL Analysis** - Scan websites and applications.
  * 💻 **Code Review** - Analyze code for vulnerabilities.
  * ⚙️ **System Architecture** - Evaluate full system designs.
* **Streaming Responses**: Built-in support for real-time text streaming to the UI.

---

## 📋 Prerequisites

* **Node.js** 18+
* An API key from a supported provider (OpenAI, Google, Groq, etc.)
* **Vercel** account (free)

---

## 🛠️ Code Implementation (Vercel AI SDK)

Because this project uses the Vercel AI SDK, you can easily swap models without changing your core logic. 

**1. Install the SDK and your preferred provider:**
```bash
npm install ai @ai-sdk/openai 
# Or: npm install @ai-sdk/google
