# 📜 Grocery Store Project Rules (Antigravity)

**IMPORTANT: READ BEFORE ANY ACTION**

This project follows a strict **Specialized Agent** and **Clean Architecture** framework.
The source of truth for all architectural decisions and development processes is located in the `.agents/` directory.

## 🏛️ Core Guidelines
- Read [guidelines.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.agents/guidelines.md) for architectural layers, patterns, and TDD rules.
- Consult the specialized agents in [.agents/specialists/](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.agents/specialists/) for specific domains (Architect, DBA, QA, etc.).

## 🧭 Development Workflow
- Follow the **"Golden Pipeline"** (Planning -> TDD -> Execution -> Verification).
- Use the [/pre-flight](file:///home/tiago/01-dev-env/personal-repos/grocery-store/.agents/workflows/pre-flight.md) workflow at the start of every session.
- Maintain [ROADMAP.md](file:///home/tiago/01-dev-env/personal-repos/grocery-store/docs/refactor/ROADMAP.md) for strategic alignment.

## 🛡️ CRITICAL: COMMIT GOVERNANCE
- **Rule**: ONLY perform `git commit` when explicitly instructed by the USER. 
- **Staging**: You may `git add` for verification, but **never** `git commit` without permission.

## 🤝 Persistence Note
To ensure Antigravity always considers these rules:
1. This file serves as a root-level "beacon" for initial discovery.
2. The user has a persistent **Knowledge Item (KI)** system (long-term memory).
3. Using the `/pre-flight` command at the start of a chat is the recommended SOP.
