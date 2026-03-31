# GEMINI.md - Project Context for Claude Code (Tengu)

## Project Overview
**Claude Code** (internal codename: **Tengu**) is a sophisticated, feature-rich AI agent terminal interface. It brings powerful AI capabilities directly to the developer's command line, enabling autonomous task execution, codebase exploration, and complex workflows.

The project is built as a high-performance CLI using **TypeScript** and **React**, with the UI rendered in the terminal via **Ink**. It supports both **Bun** and **Node.js** (v18+) runtimes.

## Key Technologies & Frameworks
- **Runtime:** [Bun](https://bun.sh/) (primary for its performance and native TS support) and Node.js.
- **Terminal UI:** [Ink](https://github.com/vadimdemedes/ink) (React-based terminal UI).
- **CLI Parsing:** [Commander.js](https://github.com/tj/commander.js).
- **Logic & Services:**
  - **MCP (Model Context Protocol):** Extensive support for external tools and resources.
  - **Task System:** Robust task management for bash execution, agent swarms, and remote operations.
  - **Analytics & Feature Flags:** Integrated with GrowthBook for feature management and custom telemetry sinks.
- **Linting & Formatting:** [Biome](https://biomejs.dev/).

## Architecture & Project Structure
- `main.tsx`: The main entry point of the CLI application.
- `setup.ts`: Handles initialization, environment checks, and workspace configuration.
- `commands/` & `commands.ts`: Implementation and registration of CLI commands (e.g., `init`, `commit`, `review`, `mcp`, `tasks`, `web`).
- `tools/` & `tools.ts`: Definitions of agent-accessible tools (e.g., `BashTool`, `FileEditTool`, `GrepTool`, `WebSearchTool`).
- `web/`: Prototype web interface for Claude Code.
- `ink-web.tsx`: React DOM compatibility layer for Ink components.
- `server/webServer.ts`: Backend server for the web interface.
- `services/`: Core business logic, including API clients, MCP integration, analytics, and policy management.
- `utils/`: A vast collection of utilities for git, shell, config, permissions, and platform-specific logic.
- `components/`: React/Ink UI components for the terminal interface.
- `state/` & `AppState.tsx`: Global state management for the application.

## Building and Running
As this directory contains the source code, the primary way to interact with it during development is via `bun`:

- **Run CLI:** `bun main.tsx [command]`
- **Web Interface:** `bun main.tsx web` (launches a local web server and opens the browser)
- **Development Setup:** Logic is primarily contained in `setup.ts`, which handles git root detection, worktree management, and configuration loading.
- **Tests:** The project uses `NODE_ENV=test` for testing environments.

## Development Conventions
- **ESM Imports:** The project uses ESM with `.js` extensions in imports (required for compatibility with certain runtimes/build steps).
- **Feature Flags:** Extensive use of `feature('FEATURE_NAME')` to guard experimental or internal-only functionality.
- **Type Safety:** Strict TypeScript usage with complex types for IDs, tasks, and tool schemas.
- **Performance Focused:** Includes startup profilers and parallel prefetching for OAuth, settings, and keychain access to minimize latency.
- **Hooks:** Observability and extensibility via hooks (e.g., `fileChangedWatcher`, `attributionHooks`).

## Key Files to Reference
- `commands.ts`: To see available CLI commands.
- `tools.ts`: To understand the tools the AI agent can use.
- `context.ts`: To understand how system and user context is gathered.
- `Tool.ts` & `Task.ts`: To understand the core abstractions for tools and background tasks.
- `GEMINI.md`: (This file) Primary instructions and context for Gemini interactions.
