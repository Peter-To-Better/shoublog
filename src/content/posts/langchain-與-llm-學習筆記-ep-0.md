---
title: "LangChain 與 LLM 學習筆記 Ep-0"
pubDate: 2025-05-05 15:34:14
description: "本篇將介紹大型語言模型（LLM）的基本概念，並深入說明 LangChain 框架的核心元件與應用方式，探討 AI Agent 的運作邏輯與 MCP（Model Context Protocol）標準。"
author: "Peter"
tags: ["LangChain & LLM"]
category: "LangChain & LLM"
keywords: "LangChain 與 LLM 學習筆記"
draft: false
---

# 本篇重點

本篇將介紹大型語言模型（LLM）的基本概念，並深入說明 LangChain 框架的核心元件與應用方式，探討 AI Agent 的運作邏輯與 MCP（Model Context Protocol）標準。

<!-- more -->

## 什麼是大型語言模型 (LLM)?

大型語言模型（LLM，Large Language Model）是基於深度學習的自然語言處理模型，透過大量文本資料訓練而成，具備理解、生成和處理人類語言的能力。常見的 LLM 包括：

- OpenAI 的 GPT 系列（如 GPT-3.5、GPT-4）
- Meta 的 LLaMA 系列
- Anthropic 的 Claude
- Google 的 Gemini

這些模型能完成各種語言任務，如問答、翻譯、摘要、程式碼生成等。

---

## 什麼是 LangChain？

LangChain 是專為 LLM 應用開發設計的框架，協助開發者打造基於大型語言模型的應用程式。LLM 是經過大量資料預先訓練的大型深度學習模型，能根據使用者查詢生成回應，例如回答問題或從文本提示中建立影像。

### LangChain 主要元件與功能

- **LLM 介面**
  LangChain 提供統一 API，讓開發者輕鬆連接並查詢多種公有與專有模型，可以直接透過 LangChain 來使用不同的模型，不需要一直針對想要不同的 LLM API 規則撰寫，能讓模型切換更方便。
- **提示範本（Prompt Templates）**
  預先建構的提示結構，讓開發者一致地格式化查詢，用於聊天機器人、特定指令傳遞，且可跨應用與模型重複使用。
- **代理程式（Agents）**
  代理有很多種類型可以參考[代理類型](https://python.langchain.com/v0.1/docs/modules/agents/agent_types/)，能讓語言模型根據使用者輸入、可用工具及中繼步驟，自主決定最佳回應流程自動化。
- **擷取模組（Retrieval）**
  有不同的 loader 來實作 RAG，透過字詞內嵌建立語義表示，並將資訊儲存在本地或雲端向量資料庫像是[Pinecone](https://www.pinecone.io/)，提升回應的精確度與時效性。
- **記憶體（Memory）**
  能將一些簡單的短期對話紀錄下來，讓 LLM 能調用過去互動的資料，提高對話的連貫性

---

## 什麼是 AI Agent？

AI Agent 是基於 LLM 的自主決策系統，能自主管理「感知－規劃－行動」的循環，具備以下核心能力：

- **工具使用**：能依照自己的判斷，評估什麼時候使用該工具
- **任務分解**：將複雜問題拆解為多個可執行步驟
- **狀態維持**：利用 Memory 儲存對話歷史與操作狀態
- **自我修正**：根據錯誤回饋調整策略，提升執行效率

### AI Agent 與傳統 LLM 應用的差異

| 維度       | 傳統 LLM 應用  | AI Agent              |
| :--------- | :------------- | :-------------------- |
| 任務複雜度 | 單輪指令執行   | 多步驟跨工具工作流    |
| 決策模式   | 被動回應       | 主動規劃              |
| 記憶管理   | 短期對話上下文 | 長期記憶 + 知識庫檢索 |
| 錯誤處理   | 依賴人工干預   | 自主重試機制          |

---

## 什麼是 MCP（Model Context Protocol）？

MCP 是由 Anthropic 於 2024 年推出的開放標準協議，用來標準化 AI 應用（特別是 LLM）與外部資料及工具的互動方式。它可視為 AI 應用的「通用接口」，讓不同系統能無縫連接，實現即插即用。

### MCP 架構簡介

- **Host（主機）**：需要使用外部資料和工具的 AI 應用，例如 Claude、OpenAI、Cursor 等支援 MCP 的 AI 模型。它們就像你的筆記型電腦，是整個系統的核心，必須透過轉接器才能連接並使用各種外部設備。
- **Client（客戶端）**：像是主機中的橋樑元件，負責在 AI 應用和 MCP Server 之間建立並維護通訊，你可以把它想像成筆電上的 USB 插槽和驅動程式，專門負責發送請求並接收回應，確保筆電能正確操作連接的外部裝置。
- **Server（伺服器）**：提供具體功能和數據的服務端，像是 Slack、Gmail、Google 日曆或本地檔案系統，它們就像連接到筆電的滑鼠、鍵盤或外接硬碟，是實際執行任務和提供資料的設備。

## 延伸閱讀

- [LangChain 官方文件](https://python.langchain.com/)
- [白話科技｜ Google 推 A2A，大戰 MCP！MCP 是什麼？定義、實例一次看懂](https://www.bnext.com.tw/article/82706/what-is-mcp?)
