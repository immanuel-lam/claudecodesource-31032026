# Claude Code

Anthropic's official CLI for Claude — an agentic coding assistant that lives in your terminal.

## Overview

Claude Code is an interactive command-line tool that connects to Claude to help with software engineering tasks: reading and editing files, running commands, searching codebases, managing git workflows, and more. It operates directly in your terminal with full context of your project.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Language**: TypeScript
- **Terminal UI**: [React](https://react.dev/) + [Ink](https://github.com/vadimdemedes/ink)
- **CLI Framework**: [Commander.js](https://github.com/tj/commander.js/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **API**: Anthropic Claude API via `@anthropic-ai/sdk`
- **Protocols**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

## Development

This is a Bun-based TypeScript project. Build configuration lives outside this `src/` directory — there is no `package.json` here. Build-time macros like `MACRO.VERSION` are inlined by Bun's bundler.

## Architecture

### Entry Flow

```
entrypoints/cli.tsx  →  main.tsx:cliMain()  →  REPL loop
       │
       ├── Fast paths (--version, --dump-system-prompt, daemon)
       ├── Feature-gated subcommands (bridge, remote, coordinator)
       └── Full CLI via Commander.js (~52 subcommands)
```

### Core Systems

| System | Location | Description |
|--------|----------|-------------|
| **State Store** | `state/AppStateStore.ts` | Central Zustand store — permissions, tasks, MCP, plugins, agents, UI |
| **Tools** | `Tool.ts`, `tools.ts`, `tools/` | ~40 built-in tools registered via `buildTool()` |
| **Commands** | `commands.ts`, `commands/` | ~100 slash commands (local, local-jsx, prompt types) |
| **Query Engine** | `QueryEngine.ts` | Request lifecycle — prompt building, API calls, tool dispatch, streaming |
| **Permissions** | `utils/permissions/` | Per-tool permission checks with allow/deny/ask rules and glob matching |
| **Tasks** | `Task.ts`, `tasks/` | Task lifecycle for bash, agent, workflow, and teammate processes |
| **Services** | `services/` | API client, MCP, plugins, LSP, OAuth, analytics, compaction |
| **Context** | `context.ts`, `context/` | System/user context injection (git state, CLAUDE.md files, date) |
| **Memory** | `memdir/` | Persistent conversation memory with gzip compression |
| **UI** | `components/`, `ink/`, `screens/` | Terminal UI components, dialogs, interactive helpers |

### Built-in Tools

File operations (Read, Edit, Write, NotebookEdit), execution (Bash, PowerShell, REPL), search (Glob, Grep, WebSearch, WebFetch), agent coordination (Agent, SendMessage, TeamCreate), task management (TaskCreate, TaskGet, TaskList, TaskOutput, TaskStop, TaskUpdate), planning (EnterPlanMode, ExitPlanMode), worktrees (EnterWorktree, ExitWorktree), configuration (Config, MCP, Skill, ToolSearch), and more.

### Slash Commands

Session management (`resume`, `clear`, `session`), development workflows (`commit`, `review`, `branch`, `pr_comments`, `diff`), configuration (`config`, `theme`, `model`, `keybindings`, `permissions`), tools (`mcp`, `plugin`, `skills`), and utilities (`help`, `doctor`, `cost`, `status`, `context`, `compact`).

### Execution Modes

- **REPL** — Default interactive mode
- **Print** (`-p`) — Single-shot query, output to stdout
- **Remote** — Cloud Compute Runtime via bridge
- **Bridge** — WebSocket connection to web UI
- **Coordinator** — Multi-worker task coordination
- **Daemon** — Long-running supervisor process
- **MCP Server** (`mcp serve`) — Expose Claude Code as an MCP server

### Key Patterns

**Tool registration** — Each tool exports a const via `buildTool()` with `name`, `description`, `input_schema`, `execute()`, and optional methods like `checkPermissions()`, `isReadOnly()`, `isDestructive()`.

**Feature flags** — `import { feature } from 'bun:bundle'` enables build-time dead code elimination. Feature-gated code is stripped from external builds.

**Immutable state** — All state updates go through Zustand with `DeepImmutable<>` typing. Updates use functional setters: `setAppState(prev => ({...prev, ...}))`.

**Dynamic imports** — The CLI bootstrap uses dynamic imports extensively to minimize startup time. Fast paths (e.g., `--version`) load zero modules beyond the entry file.

**Build-time macros** — `MACRO.VERSION` and similar values are inlined by Bun's bundler at build time.
