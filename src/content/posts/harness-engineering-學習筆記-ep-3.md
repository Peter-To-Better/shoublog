---
title: "Harness Engineering 學習筆記 Ep-3"
pubDate: 2026-05-12 22:00:00
description: "前面三集我們把 Harness Engineering 的世界觀、AGENTS.md 與 Hooks 都學了一輪，理論到此告一段落。從這一集開始，我們要把學到的東西實體化 — 動手打造一份名為 claude-harness-template 的開源模板，讓任何專案 clone 就能得到一份合格的 Claude Code Harness。"
author: "Peter"
tags: ["Harness Engineering"]
category: "Harness Engineering"
keywords: "claude-harness-template, Harness Engineering, AI Agent, Claude Code, AGENTS.md, Hooks, .claude/settings.json, Sub-agents, Slash Commands, MCP, AI 開發模板"
draft: false
---

# 本篇重點

前面三集我們把 Harness Engineering 的世界觀、AGENTS.md 與 Hooks 都學了一輪，理論到此告一段落。從這一集開始，我們要把學到的東西實體化 — 動手打造一份名為 **claude-harness-template** 的開源模板，讓任何專案 clone 就能得到一份合格的 Claude Code Harness。本篇先做計畫介紹：要解決什麼問題、骨架長什麼樣、設計原則、以及接下來幾集的 roadmap。

<!-- more -->

## 前情提要

到 Ep-2 為止，我們建立了三塊基礎：

| 集數                                             | 主題                       | 核心收穫                                   |
| :----------------------------------------------- | :------------------------- | :----------------------------------------- |
| [Ep-0](/posts/harness-engineering-學習筆記-ep-0) | Harness Engineering 是什麼 | Agent = Model + Harness；機率性 vs 決定性  |
| [Ep-1](/posts/harness-engineering-學習筆記-ep-1) | AGENTS.md                  | 60 ~ 150 行的「隱性規則手冊」              |
| [Ep-2](/posts/harness-engineering-學習筆記-ep-2) | Hooks                      | Exit Code 2 把「應該」變成「不做就不能做」 |

這三集講的都是**觀念**。每個讀者腦袋裡都有一個沒問出口的問題：

> 「我懂了，**然後呢？**」

## 然後呢？— 從理論到實作的斷層

老實說，這也是我自己看完業界一堆 Harness Engineering 文章之後的感覺。

理論很漂亮，舉的例子很厲害（OpenAI 五個月 100 萬行、Hashline 6.7% → 68.3%），但每次想把這套搬進**自己的專案**，就會卡在同樣幾個現實問題：

- AGENTS.md 應該寫多細？該長什麼樣？
- `.claude/settings.json` 那一串 JSON 怎麼開始？有沒有可以直接 copy 的範本？
- Sub-agent 怎麼定義？Slash command 跟 hook 又怎麼分工？
- 這些檔案放在 git 哪裡？團隊怎麼共用？CI 怎麼跑？

每個問題單獨看都不難，但**全部加起來就會勸退一整個團隊**。

這個落差就是我們要填的 — 我們需要一份**可以直接 clone 進去用**的模板。

## 介紹：claude-harness-template

接下來幾集要做的東西，叫做 **claude-harness-template**（暫定名稱）。

它的定位很簡單：

> 一份開源、最小可用、設計過的 Claude Code Harness 起手包。任何專案 `git clone` 進來改一改，就能得到一份**符合 Ep-0 ~ Ep-2 全部原則**的 harness 設定。

更精準地說，它要做這幾件事：

- ✅ 提供一份**經過設計**的 `AGENTS.md` 範本（不是 AI 自動生成，符合 Ep-1 的 -3% 規避原則）
- ✅ 提供一組**生產級的 `.claude/settings.json` hooks**（符合 Ep-2 的 Exit Code 2 範式）
- ✅ 提供常用的 **sub-agents**（code reviewer、migration writer、test writer 等）
- ✅ 提供常用的 **slash commands**（`/commit`、`/review`、`/test` 等）
- ✅ 提供 **CI 整合範例**（GitHub Actions），讓 hooks 不只在本地跑，PR 上也擋
- ✅ 每個檔案都附上「**為什麼這樣設計**」的說明，不是黑盒子

同樣重要的是，它**不做這些事**：

- ❌ 不綁定特定 framework（不是 React-only、不是 NestJS-only）
- ❌ 不取代 Claude Code 官方文件（它是起手包，不是百科）
- ❌ 不打算解決所有人的所有問題（我們會非常用力地控制 scope）

換句話說 — **這個 template 本身，就是一次 Harness Engineering 的實踐**。

## 為什麼這個 template 本身就是 Harness Engineering？

回想 Ep-0 那個核心精神：

> 每次 Agent 出錯，問的不是「我下次怎麼提醒它」，而是「我怎麼讓這個錯誤從此在結構上不可能發生」。

把這句話的主詞從「Agent」換成「**團隊裡的工程師**」，就是這個 template 的存在意義：

- 不是寫一份 wiki 提醒大家「請記得設 PreToolUse hook 擋 `rm -rf`」
- 而是讓 `git clone` 進來那一刻，這個 hook **已經設好**了

這就是把 Harness Engineering 的精神，從「給 Agent 用」進一步**升級成「給開發團隊用」**。

## 預覽：模板骨架

直接看一下計畫中的目錄結構：

```text
claude-harness-template/
├── AGENTS.md                       # 寫給 Agent 看的主規則（< 150 行）
├── README.md                       # 寫給人類看的快速上手
│
├── .claude/
│   ├── settings.json               # 團隊共用的 hooks（commit）
│   ├── settings.local.example.json # 個人設定的範例（gitignored）
│   │
│   ├── agents/                     # Sub-agent 定義（Ep-4 主題）
│   │   ├── code-reviewer.md
│   │   ├── migration-writer.md
│   │   └── test-writer.md
│   │
│   ├── commands/                   # Slash commands（Ep-5 主題）
│   │   ├── commit.md
│   │   ├── review.md
│   │   └── test.md
│   │
│   └── scripts/                    # Hook handlers
│       ├── block-generated.js
│       ├── guard-bash.js
│       └── auto-format.js
│
├── docs/                           # Conditional references
│   ├── architecture.md
│   ├── testing.md
│   └── migrations.md
│
├── .github/
│   └── workflows/
│       └── claude-harness-ci.yml   # CI 整合（Ep-7 主題）
│
└── .gitignore
```

注意幾個設計細節：

1. **`AGENTS.md` 放最外層** — 它是 Agent 第一個讀的檔案，跟 README 並列。
2. **`.claude/` 分成三個子資料夾** — `agents/`、`commands/`、`scripts/` 各司其職，符合 Ep-2 的「每個元件做好一件事」原則。
3. **`docs/` 走 conditional reference 模式** — `AGENTS.md` 不直接塞細節，需要時才指向 `docs/`。
4. **CI workflow 命名為 `claude-harness-ci.yml`** — 方便日後辨識，不跟一般 build CI 混淆。

## 設計原則（動工前先講清楚）

為了避免最後做出一份巨大難用的 template，先立下五條原則：

1. **Convention over configuration**
   能用慣例解決的事，不開設定。一個讀者只要照 README 跑 `git clone` + 改三個變數，就能上路。

2. **Drop-in, not framework-coupled**
   不依賴 Nx、Next.js、NestJS 等任何特定技術。所有 framework-specific 的內容用 `<!-- replace: -->` 標記，讓使用者替換。

3. **Everything explained, nothing magical**
   每個 hook、每個 agent、每個 command，**註解一定要寫「為什麼存在」**。沒人看得懂的設定一律不收。

4. **Hard rules vs Soft rules 分離**
   違反會直接擋 commit 的（HARD），跟只是建議的（SOFT），用不同的標記與檔案存放。讀者一眼就知道哪些不能動。

5. **Always shippable**
   每一集寫完，main branch 上的 template 都必須是「能 clone、能用」的狀態。不允許「等下一集才有用」的半成品。

## Roadmap：接下來四集要做什麼

| 集數     | 主題               | 對應 template 產出                                       |
| :------- | :----------------- | :------------------------------------------------------- |
| **Ep-4** | Sub-agents         | `.claude/agents/` 三個 agent 與 `AGENTS.md` 草稿         |
| **Ep-5** | Slash Commands     | `.claude/commands/` 三個 command                         |
| **Ep-6** | MCP + Hooks 整合   | `.claude/settings.json` 完整版 + `scripts/` hook handler |
| **Ep-7** | CI 整合 + 公開釋出 | `.github/workflows/` + GitHub repo + README              |

到了 Ep-7，**你會拿到一份能 `git clone https://github.com/.../claude-harness-template` 直接用的成品**。

## 結論

把這集濃縮成三句話：

1. **理論到實作之間有一道斷層**，光懂概念寫不出可用的 harness。
2. **claude-harness-template 是把 Ep-0 ~ Ep-2 學到的觀念實體化**，本身就是一次 Harness Engineering 的實踐。
3. **我們會按 roadmap 每集交付一塊**，每一集寫完 main branch 都能直接用，沒有半成品。

下一篇 **Ep-4 — Sub-agents：用 Context Firewall 讓 Agent 越跑越聰明**，會深入介紹 sub-agent 的概念跟 context rot 的問題，並且動手做出 template 的第一批檔案：`.claude/agents/code-reviewer.md`、`migration-writer.md`、`test-writer.md`。

我們開工吧。

# 延伸閱讀

- [Claude Code Sub-agents 官方文件](https://docs.claude.com/en/docs/claude-code/sub-agents)
- [Skill Issue: Harness Engineering for Coding Agents - HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [How to write a great agents.md - GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Harness Engineering: Leveraging Codex in an Agent-First World - OpenAI](https://openai.com/index/harness-engineering/)
