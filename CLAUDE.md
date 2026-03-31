# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Claude Code CLI** (`src/` directory) — Anthropic's official command-line interface for Claude. It's a TypeScript application using React + Ink for terminal UI, Bun as the runtime/bundler, and Zustand for state management.

## Build & Development

This is a Bun-based TypeScript project. No `package.json` is present in `src/` — build configuration lives outside this directory. Build-time macros (e.g., `MACRO.VERSION`) are injected by Bun's bundler. Feature flags use `import { feature } from 'bun:bundle'` for dead code elimination in external builds.

## Architecture

### Entry Flow
`entrypoints/cli.tsx` → fast-path checks (version, daemon, feature-gated subcommands) → `main.tsx:cliMain()` (Commander.js CLI definition, ~4700 LOC)

### Core Subsystems

- **State** (`state/AppStateStore.ts`): Central Zustand store (~21K LOC). Immutable state via `DeepImmutable<>`. Manages tool permissions, task states, MCP connections, plugins, agent registry, and UI state.

- **Tool System** (`Tool.ts`, `tools.ts`, `tools/`): ~47 built-in tools. Each tool is created via `buildTool()` which fills safe defaults. Tools declare `execute()`, `checkPermissions()`, `isReadOnly()`, `isDestructive()`, etc. Tool pool is assembled by `assembleToolPool()` merging built-in + MCP tools.

- **Command System** (`commands.ts`, `commands/`): ~100+ slash commands. Three types: `local` (Ink component), `local-jsx` (explicit JSX), `prompt` (expanded in system prompt, no local rendering). Registered in AppState, invoked via `/` prefix.

- **Query Engine** (`QueryEngine.ts`): Handles the full request-response lifecycle — builds system prompt + context, calls Claude API with messages + tools, streams/handles tool calls, updates state.

- **Permission System** (`utils/permissions/`): Each tool's `checkPermissions()` returns a `PermissionResult`. Rules matched by glob patterns. Modes: `default`, `bypass`, `auto`. Supports `alwaysAllowRules`, `alwaysDenyRules`, `alwaysAskRules`.

- **Task Management** (`Task.ts`, `tasks/`): Six task types with prefixed IDs: `local_bash` (b), `local_agent` (a), `remote_agent` (r), `in_process_teammate` (t), `local_workflow` (w), `monitor_mcp` (m), `dream` (d). Lifecycle: generate ID → create state → register → monitor → cleanup.

- **Services** (`services/`): API client, MCP protocol, plugin loader, LSP integration, OAuth, analytics (GrowthBook), compact/context-collapse optimization, remote managed settings.

- **Context & Memory** (`context.ts`, `context/`, `memdir/`): `getSystemContext()` injects git status and cache breakers. `getUserContext()` injects CLAUDE.md files and current date. Memory files persisted to disk with gzip compression.

- **UI Layer** (`components/`, `ink/`, `screens/`): React + Ink terminal UI. `interactiveHelpers.tsx` (~57K LOC) handles dialogs, pickers, confirmations. `dialogLaunchers.tsx` (~22K LOC) manages dialog lifecycle.

### Execution Modes
- **REPL**: Default interactive mode
- **Remote**: Bridge to Cloud Compute Runtime (`remote/`)
- **Bridge**: WebSocket connection to web UI
- **Coordinator**: Multi-worker task coordination
- **Assistant (Kairos)**: Feature-gated proactive assistant
- **Daemon**: Long-running supervisor process

### Key Patterns

**Tool definition**: Export a const calling `buildTool({name, description, input_schema, execute, ...})`.

**State updates**: Immutable via Zustand setter — `setAppState(prev => ({...prev, field: newValue}))`.

**Feature gating**: `feature('FLAG_NAME')` from `bun:bundle` enables build-time dead code elimination. Examples: `COORDINATOR_MODE`, `KAIROS`, `PROACTIVE`, `AGENT_TRIGGERS`.

**Skills system** (`skills/`): Bundled and user-defined skills exposed as tools. Skills can be `prompt`-type (expanded into system prompt) or `local`-type (rendered as components).
