<div align="center">
  <img src="https://raw.githubusercontent.com/ankitkhatrik6/tu-scraper/main/public/logo.png" alt="tu-scraper logo" width="150" />
  
  <h1>tu-scraper</h1>
  
  <p><strong>TypeScript scraper to fetch official Tribhuvan University (TU) notices across all 8 verified institute and faculty portals.</strong></p>

  <a href="https://www.npmjs.com/package/tu-scraper">
    <img src="https://img.shields.io/badge/npm-v1.0.0-cb3837.svg?style=flat-square&logo=npm" alt="npm version" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-Strict%20Type%20Safe-3178C6.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT" />
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B%20%7C%2022%2B-339933.svg?style=flat-square&logo=nodedotjs" alt="Node.js" />
  </a>
  <a href="https://github.com/ankitkhatrik6/tu-scraper/actions">
    <img src="https://img.shields.io/badge/Tests-20%2F20%20Passing-brightgreen.svg?style=flat-square" alt="Tests" />
  </a>
</div>

---

## Overview

**`tu-scraper`** provides a clean, unified, zero-boilerplate API for developers, students, and institutions to programmatically access official Tribhuvan University notices. It eliminates manual HTML parsing, handles faculty-specific DOM variance, provides in-memory caching, and standardizes notice records into strict TypeScript interfaces.

---

## Installation

```bash
# npm
npm install tu-scraper

# pnpm
pnpm add tu-scraper

# yarn
yarn add tu-scraper

# bun
bun add tu-scraper
```

---

## Quick Start

```typescript
import { getNotices, getLatest, searchNotices } from "tu-scraper";

// 1. Fetch notices from Institute of Science and Technology (IOST)
const iostNotices = await getNotices("iost");
console.log(iostNotices);

// 2. Fetch the single most recent notice from Institute of Engineering (IOE)
const latestIoe = await getLatest("ioe");
console.log(`Latest IOE Notice: ${latestIoe?.title} (${latestIoe?.date})`);

// 3. Search for a specific program/keyword across all 8 institutions
const bscResults = await searchNotices("BSc CSIT");

// 4. Search within a specific faculty
const examNotices = await searchNotices("exam", "fohss");
```

---

## Supported Sources (8 Official Portals)

`tu-scraper` strictly targets only the 8 verified official Tribhuvan University portals:

| Source Identifier | Institution Name | Category | Official Portal URL |
| :--- | :--- | :--- | :--- |
| `iost` | Institute of Science and Technology | Institute | [https://iost.tu.edu.np/notices](https://iost.tu.edu.np/notices) |
| `fohss` | Faculty of Humanities and Social Sciences | Faculty | [https://fohss.tu.edu.np/notices](https://fohss.tu.edu.np/notices) |
| `ioe` | Institute of Engineering | Institute | [https://ioe.tu.edu.np/notices](https://ioe.tu.edu.np/notices) |
| `iom` | Institute of Medicine | Institute | [https://iom.tu.edu.np/notices](https://iom.tu.edu.np/notices) |
| `iaas` | Institute of Agriculture and Animal Science | Institute | [https://iaas.tu.edu.np/notices](https://iaas.tu.edu.np/notices) |
| `iof` | Institute of Forestry | Institute | [https://iof.tu.edu.np/notices](https://iof.tu.edu.np/notices) |
| `foe` | Faculty of Education | Faculty | [https://foe.tu.edu.np/notices](https://foe.tu.edu.np/notices) |
| `fol` | Faculty of Law | Faculty | [https://fol.tu.edu.np/notices](https://fol.tu.edu.np/notices) |
| `all` | Aggregates all 8 institutions | Meta-source | All supported URLs above |

---

## Return Type (`Notice`)

Every scraper normalizes results into the standard `Notice` contract:

```typescript
export interface Notice {
  /** Unique ID extracted from notice detail URL */
  id: string;
  /** Full notice title (whitespace cleaned and trimmed) */
  title: string;
  /** Origin source identifier */
  source: NoticeSource;
  /** Date of publication (if available on source page, else undefined) */
  date?: string;
  /** Canonical URL to notice page */
  url: string;
  /** Direct PDF or attachment link (if available, else undefined) */
  pdf?: string;
}
```

*Note: In accordance with data integrity rules, if a date or PDF is unavailable on the source webpage, the property is left `undefined` rather than populating fabricated data.*

---

## Core API Reference

### `getNotices(source, options?)`

Fetches all active notices from the specified source or all sources combined.

```typescript
function getNotices(
  source: "iost" | "fohss" | "ioe" | "iom" | "iaas" | "iof" | "foe" | "fol" | "all",
  options?: ScrapeOptions
): Promise<Notice[]>;
```

#### Behavior with `"all"`:
When calling `await getNotices("all")`, scrapers run concurrently across all 8 faculties via `Promise.allSettled`. If an individual faculty server is temporarily unreachable, the remaining successful faculty results are combined and returned gracefully.

---

### `getLatest(source, options?)`

Fetches the single latest notice from the given faculty.

```typescript
function getLatest(
  source: SourceQuery,
  options?: ScrapeOptions
): Promise<Notice | null>;
```

---

### `searchNotices(query, source?, options?)`

Performs a case-insensitive title search against notices from the specified source (default: `"all"`).

```typescript
function searchNotices(
  query: string,
  source?: SourceQuery, // Defaults to "all"
  options?: ScrapeOptions
): Promise<Notice[]>;
```

---

### `clearCache()`

Clears the internal in-memory cache manually.

```typescript
import { clearCache } from "tu-scraper";
clearCache();
```

---

### `ScrapeOptions`

Customize network timeouts and cache behavior:

```typescript
export interface ScrapeOptions {
  /** Request timeout in milliseconds (default: 10000ms) */
  timeout?: number;
  /** Bypass internal in-memory cache (default: false) */
  bypassCache?: boolean;
  /** Custom User-Agent header */
  userAgent?: string;
}
```

---

## Error Handling

`tu-scraper` exports clear, typed errors:

| Error Class | Trigger | Properties |
| :--- | :--- | :--- |
| `InvalidSourceError` | When an unsupported source string is provided | `invalidSource`, `allowedSources` |
| `NetworkError` | When an HTTP request fails or status code is not 200 | `url`, `statusCode`, `originalError` |
| `TimeoutError` | When a request exceeds the specified timeout | `url`, `timeoutMs` |
| `ParseError` | When the webpage structure is corrupted | `source`, `url` |

```typescript
import { getNotices, InvalidSourceError, NetworkError, TimeoutError } from "tu-scraper";

try {
  const notices = await getNotices("ioe", { timeout: 5000 });
} catch (error) {
  if (error instanceof InvalidSourceError) {
    console.error(`Invalid source: ${error.invalidSource}`);
  } else if (error instanceof TimeoutError) {
    console.error(`Request timed out after ${error.timeoutMs}ms`);
  } else if (error instanceof NetworkError) {
    console.error(`Network error: ${error.message} (HTTP ${error.statusCode})`);
  }
}
```

---

## Examples

### 1. Daily Telegram / Discord Bot Notification

```typescript
import { getLatest } from "tu-scraper";

async function notifyLatestNotice() {
  const latest = await getLatest("ioe");
  if (latest) {
    await sendDiscordWebhook({
      content: `📢 **New IOE Notice**: ${latest.title}\n🔗 ${latest.url}\n📅 ${latest.date || "N/A"}`
    });
  }
}
```

### 2. Express.js REST API Microservice

```typescript
import express from "express";
import { getNotices, searchNotices, isValidSource } from "tu-scraper";

const app = express();

app.get("/api/notices/:source", async (req, res) => {
  const { source } = req.params;
  if (!isValidSource(source)) {
    return res.status(400).json({ error: "Invalid source" });
  }
  const data = await getNotices(source);
  res.json({ success: true, count: data.length, data });
});

app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "");
  const src = (req.query.source as any) || "all";
  const results = await searchNotices(q, src);
  res.json({ query: q, results });
});

app.listen(8080, () => console.log("TU Notices API running on port 8080"));
```

---

## Testing

The package includes a comprehensive test suite with 20 unit tests covering:
- All 8 source adapters using real saved HTML fixtures
- Notice normalization and schema compliance
- Search matching & edge cases
- `getLatest` behavior
- Invalid source error assertions
- Caching TTL and invalidation
- `"all"` multi-source aggregation

Run the test suite:

```bash
npm test
```

---

## License

MIT © [Ankit Khatri KC](https://github.com/ankitkhatrik6)
