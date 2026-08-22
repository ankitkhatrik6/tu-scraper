'use client';

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Zap,
  Terminal,
  Server,
  Layers,
  Bot,
} from 'lucide-react';
import { NoticeSource, SourceQuery } from '@/src/types';

export function CodeGenerator({ darkMode }: { darkMode: boolean }) {
  const [env, setEnv] = useState<'typescript' | 'esm' | 'cjs' | 'nextjs' | 'express' | 'discord' | 'curl'>('typescript');
  const [source, setSource] = useState<SourceQuery>('iost');
  const [copied, setCopied] = useState(false);

  const getSnippet = () => {
    switch (env) {
      case 'typescript':
        return `import { getNotices, getLatest, searchNotices, Notice } from "tu-scraper";

async function main() {
  // 1. Fetch notices from ${source.toUpperCase()}
  const notices: Notice[] = await getNotices("${source}");
  console.log(\`Fetched \${notices.length} notices:\`);
  notices.forEach((n) => {
    console.log(\`- [\${n.date || "N/A"}] \${n.title} (\${n.url})\`);
  });

  // 2. Search for keyword
  const results = await searchNotices("exam", "${source}");
  console.log(\`Found \${results.length} exam notices\`);
}

main().catch(console.error);`;

      case 'esm':
        return `// package.json: { "type": "module" }
import { getNotices, getLatest } from "tu-scraper";

const notices = await getNotices("${source}");
console.log(notices);

const latest = await getLatest("${source}");
console.log("Latest:", latest?.title);`;

      case 'cjs':
        return `const { getNotices, getLatest, searchNotices } = require("tu-scraper");

async function run() {
  const notices = await getNotices("${source}");
  console.log(notices);
}

run();`;

      case 'nextjs':
        return `// app/notices/page.tsx (Next.js Server Component)
import { getNotices } from "tu-scraper";

export const revalidate = 300; // Cache for 5 minutes

export default async function NoticesPage() {
  const notices = await getNotices("${source}");

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">${source.toUpperCase()} Notices</h1>
      <div className="space-y-3">
        {notices.map((n) => (
          <article key={n.id} className="p-4 rounded border">
            <h2 className="font-semibold">{n.title}</h2>
            <p className="text-sm text-gray-500">{n.date || "No date"}</p>
            <a href={n.url} target="_blank" className="text-blue-500 underline text-sm">
              Read Official Notice
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}`;

      case 'express':
        return `import express from "express";
import { getNotices, isValidSource } from "tu-scraper";

const app = express();
const PORT = 3000;

app.get("/notices/:source", async (req, res) => {
  const { source } = req.params;
  if (!isValidSource(source)) {
    return res.status(400).json({ error: "Invalid source parameter" });
  }

  try {
    const data = await getNotices(source);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));`;

      case 'discord':
        return `// Discord / Telegram Notice Bot Webhook
import { getLatest } from "tu-scraper";

let lastNoticeId = null;

async function checkAndNotify() {
  const latest = await getLatest("${source}");
  if (!latest) return;

  if (latest.id !== lastNoticeId) {
    lastNoticeId = latest.id;
    console.log("New notice found! Dispatching notification...");
    
    // Dispatch webhook to Discord / Telegram
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: \`📢 **New \${latest.source.toUpperCase()} Notice Published!**\\n**\${latest.title}**\\n📅 \${latest.date || "N/A"}\\n🔗 \${latest.url}\`,
      }),
    });
  }
}

// Poll every 10 minutes
setInterval(checkAndNotify, 10 * 60 * 1000);`;

      case 'curl':
        return `# Direct API Request via local proxy
curl -X GET "http://localhost:3000/api/notices?source=${source}&action=notices"`;

      default:
        return '';
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code-generator" className="space-y-6 max-w-4xl">
      <div
        className={`rounded-md border p-4 sm:p-5 ${
          darkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Ready-to-Run Code Generator</span>
            </h2>
            <p
              className={`text-xs mt-1 ${
                darkMode ? 'text-[#7d8590]' : 'text-[#656d76]'
              }`}
            >
              Select your framework and target faculty to generate copy-pasteable integration code.
            </p>
          </div>

          {/* Source Dropdown */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${darkMode ? 'text-[#7d8590]' : 'text-[#656d76]'}`}>
              Faculty:
            </span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as SourceQuery)}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-md border ${
                darkMode
                  ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3]'
                  : 'bg-white border-[#d0d7de] text-[#1f2328]'
              }`}
            >
              <option value="all">ALL (Aggregate)</option>
              <option value="iost">IOST</option>
              <option value="fohss">FOHSS</option>
              <option value="ioe">IOE</option>
              <option value="iom">IOM</option>
              <option value="iaas">IAAS</option>
              <option value="iof">IOF</option>
              <option value="foe">FOE</option>
              <option value="fol">FOL</option>
            </select>
          </div>
        </div>

        {/* Framework Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'typescript', label: 'TypeScript' },
            { id: 'esm', label: 'Node.js (ESM)' },
            { id: 'cjs', label: 'CommonJS' },
            { id: 'nextjs', label: 'Next.js App Router' },
            { id: 'express', label: 'Express.js REST API' },
            { id: 'discord', label: 'Discord / Telegram Bot' },
            { id: 'curl', label: 'cURL / HTTP' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setEnv(item.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                env === item.id
                  ? darkMode
                    ? 'bg-[#238636] text-white border border-[#2ea043]'
                    : 'bg-[#1f883d] text-white border border-[#1a7f37]'
                  : darkMode
                  ? 'bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                  : 'bg-[#f6f8fa] border border-[#d0d7de] text-[#24292f] hover:bg-[#eaeef2]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet Card */}
      <div
        className={`rounded-md border overflow-hidden font-mono text-xs ${
          darkMode ? 'bg-[#010409] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 py-2 border-b ${
            darkMode ? 'bg-[#161b22] border-[#30363d] text-[#7d8590]' : 'bg-white border-[#d0d7de] text-[#656d76]'
          }`}
        >
          <span className="font-semibold text-[11px]">snippet.{env === 'nextjs' ? 'tsx' : env === 'curl' ? 'sh' : 'ts'}</span>
          <button
            onClick={copySnippet}
            className="flex items-center gap-1 hover:text-neutral-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copied!' : 'Copy snippet'}</span>
          </button>
        </div>

        <pre
          className={`p-4 overflow-x-auto leading-relaxed ${
            darkMode ? 'text-[#e6edf3]' : 'text-[#1f2328]'
          }`}
        >
          {getSnippet()}
        </pre>
      </div>
    </div>
  );
}
