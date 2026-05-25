# DQ DBP – React Agents Prototype Stack Specification

## Pre-Requisites:

**Priming Prompt (Approved Tech Stack)**:
DBP Approved AI Prototype Stack

**Priming Prompt/Document (BRS)**:
DBP AI Agents Build Reference

---

## Platform Context

**Platform**: DBP

**Specialised/Generalised**: Generalised (AI Agent Platform)

**Stage**: S00 | S01 | S02

**Industry**: Cross-industry | Enterprise | Digital Platforms

**Type**: Prototype

**Expected Users**: 10 – 100

**Constraint for Enterprise Technology**:
Lightweight composable architecture for rapid AI experimentation and validation using reusable UI components, lightweight APIs, cloud-native tooling, and fast deployment capabilities.

**Solution Outcomes**:
The prototype stack enables rapid validation of bespoke AI agents embedded into Digital Business Platforms, dashboards, portals, and internal tools.

The platform aims to:

* Rapidly validate AI use cases and workflows.
* Enable lightweight AI-assisted application development.
* Support experimentation with AI agents, workflows, and RAG patterns.
* Accelerate UI prototyping using reusable design patterns.
* Enable quick integration with APIs and backend services.
* Establish reusable foundations for production-ready AI builds.

---

## Build Approach

**New Build | Existing Build Optimization**:
New Build – Lightweight environment for rapid AI experimentation and workflow prototyping.

**Reference Builds (Internal)**:

* DBP AI Agents
* DQ Internal AI Tools
* DQ Automation Prototypes

**Reference Builds (External - 1)**:

* OpenAI Agents SDK

**Reference Builds (External - 2)**:

* LangGraph AI Workflows

**Reference Builds (External - 3)**:

* Supabase AI Starter Kits

---

## DevOps References

**Prototype Tool**: Lovable / Cursor / Railway / Supabase

**Prototype Repo**: <GIT REPO LINK>

---

## Tech Stack Selected

| Technology       | Layer                           | Purpose                  | How Prototype Uses It                                         |
| ---------------- | ------------------------------- | ------------------------ | ------------------------------------------------------------- |
| Lovable          | Presentation Layer              | Rapid UI generation      | Used to generate AI-driven interfaces and layouts rapidly.    |
| Magic Patterns   | Presentation Layer              | UI acceleration          | Used to generate reusable design patterns for prototyping.    |
| React            | Presentation Layer              | Frontend framework       | Used to build AI interfaces and dashboards.                   |
| TailwindCSS      | Presentation Layer              | Styling framework        | Used for responsive and consistent UI styling.                |
| shadcn/ui        | Presentation Layer              | Component library        | Used for reusable UI components and layouts.                  |
| Cursor           | DevOps & Engineering Layer      | AI-assisted development  | Used to accelerate development workflows and code generation. |
| Kiro             | DevOps & Engineering Layer      | AI engineering workflows | Used to support engineering and prototyping workflows.        |
| Express          | Application Layer               | Lightweight APIs         | Used to expose backend APIs and orchestration services.       |
| Mock APIs        | Integration & Messaging Layer   | Service simulation       | Used to simulate integrations during validation.              |
| Supabase         | Application Layer               | Backend services         | Used for backend APIs, database services, and storage.        |
| Supabase Auth    | Identity & Security Layer       | Authentication           | Used to manage lightweight authentication flows.              |
| Supabase Storage | Object Storage & Delivery Layer | File storage             | Used to store files and retrieval assets.                     |
| OpenAI           | AI Layer                        | AI runtime               | Used to execute conversational AI workflows.                  |
| LangGraph        | AI Layer                        | Workflow orchestration   | Used to coordinate AI agents and workflows.                   |
| Supabase Vector  | AI Layer                        | Vector embeddings        | Used to store embeddings for retrieval workflows.             |
| Railway          | DevOps & Engineering Layer      | Deployment platform      | Used for rapid deployment and validation hosting.             |
| Azure OpenAI     | AI Layer                        | Enterprise LLM provider  | Used to provide enterprise AI model access.                   |

---

# Final Prototype Stack Architecture Summary

## Layered View

| Layer                           | Technology                                       |
| ------------------------------- | ------------------------------------------------ |
| Presentation Layer              | React, TailwindCSS, shadcn/ui, Lovable           |
| Application Layer               | Express, Supabase                                |
| Identity & Security Layer       | Supabase Auth                                    |
| Integration & Messaging Layer   | Mock APIs                                        |
| Object Storage & Delivery Layer | Supabase Storage                                 |
| AI Layer                        | OpenAI, LangGraph, Supabase Vector, Azure OpenAI |
| DevOps & Engineering Layer      | Cursor, Kiro, Railway                            |

---

# Final Notes

* Lightweight AI validation stack.
* Optimized for experimentation and rapid iteration.
* Provides foundation for migration into enterprise production stack.