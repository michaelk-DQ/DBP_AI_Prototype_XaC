# DQ DBP – React Agents Build Stack Specification

## Pre-Requisites:

**Priming Prompt (Approved Tech Stack)**:
DBP Approved AI Enterprise Stack

**Priming Prompt/Document (BRS)**:
DBP AI Agents Enterprise Build Reference

---

## Platform Context

**Platform**: DBP

**Specialised/Generalised**: Generalised (Enterprise AI Agent Platform)

**Stage**: S03 | S04

**Industry**: Cross-industry | Enterprise | Digital Platforms

**Type**: Build

**Expected Users**: 100 – 5000+

**Constraint for Enterprise Technology**:
The enterprise stack must support scalable, secure, governed, and observable AI systems integrated into DBP platforms using enterprise IAM, event-driven workflows, modular APIs, and production-grade deployment patterns.

**Solution Outcomes**:
The build stack enables scalable, secure, and governed bespoke AI agents embedded into enterprise Digital Business Platforms.

The platform aims to:

* Deliver enterprise-grade AI assistants and workflows.
* Enable secure role-based AI access and governance.
* Support scalable AI orchestration and automation.
* Enable AI integrations with enterprise systems and APIs.
* Provide observability, monitoring, and auditability for AI systems.
* Support scalable event-driven AI workflows.
* Establish reusable enterprise AI architecture patterns.

---

## Build Approach

**New Build | Existing Build Optimization**:
New Build – Production-ready enterprise AI architecture baseline.

**Reference Builds (Internal)**:

* DBP AI Platform
* DQ Enterprise AI Tools
* DQ AI Automation Platform

**Reference Builds (External - 1)**:

* OpenAI Agents SDK

**Reference Builds (External - 2)**:

* Azure OpenAI Enterprise Architecture

**Reference Builds (External - 3)**:

* LangGraph Enterprise AI Workflows

---

## DevOps References

**Prototype Tool**: Cursor / GitHub / Docker / Kubernetes

**Prototype Repo**: <GIT REPO LINK>

---

## Tech Stack Selected

| Technology         | Layer                           | Purpose                  | How Build Uses It                                            |
| ------------------ | ------------------------------- | ------------------------ | ------------------------------------------------------------ |
| React              | Presentation Layer              | Frontend framework       | Used to build enterprise AI dashboards and applications.     |
| DQ Design System   | Presentation Layer              | Enterprise design system | Used to standardize UI and UX across AI platforms.           |
| TailwindCSS        | Presentation Layer              | Styling framework        | Used for responsive enterprise styling.                      |
| shadcn/ui          | Presentation Layer              | Component library        | Used for reusable enterprise UI components.                  |
| Express            | Application Layer               | APIs and orchestration   | Used to manage AI orchestration and backend APIs.            |
| PostgreSQL         | Data Layer                      | Relational database      | Used to store workflows, users, and operational data.        |
| Neo4j              | Data Layer                      | Graph database           | Used to model relationships and enterprise knowledge graphs. |
| REST APIs          | Integration & Messaging Layer   | Service communication    | Used to integrate with enterprise systems and services.      |
| GraphQL            | Integration & Messaging Layer   | Flexible querying        | Used for dynamic API querying.                               |
| Webhooks           | Integration & Messaging Layer   | Event communication      | Used for event-driven integrations.                          |
| Kafka              | Integration & Messaging Layer   | Event streaming          | Used to support scalable AI messaging workflows.             |
| MCP                | Integration & Messaging Layer   | AI integrations          | Used for Model Context Protocol integrations.                |
| Microsoft Entra ID | Identity & Security Layer       | Enterprise IAM           | Used for authentication, SSO, and identity management.       |
| PII Redaction      | Identity & Security Layer       | Data protection          | Used to protect sensitive information in AI interactions.    |
| Encryption         | Identity & Security Layer       | Data security            | Used to secure enterprise data and communications.           |
| Audit Logs         | Identity & Security Layer       | Compliance logging       | Used to track AI and platform activity.                      |
| AI Permissions     | Identity & Security Layer       | AI governance            | Used to control AI access and permissions.                   |
| OpenAI             | AI Layer                        | AI runtime               | Used to execute enterprise AI workflows.                     |
| LangGraph          | AI Layer                        | Workflow orchestration   | Used to coordinate AI agents and automation.                 |
| Azure OpenAI       | AI Layer                        | Enterprise LLM provider  | Used to provide enterprise AI models.                        |
| PG Vector          | AI Layer                        | Vector database          | Used to store embeddings for retrieval workflows.            |
| Neo4j GraphRAG     | AI Layer                        | GraphRAG orchestration   | Used for graph-based retrieval augmented generation.         |
| LangSmith          | Analytics Layer                 | AI observability         | Used to monitor prompts, traces, and workflows.              |
| Supabase Storage   | Object Storage & Delivery Layer | File storage             | Used to store AI files, assets, and documents.               |
| Docker             | DevOps & Engineering Layer      | Containerization         | Used to package services consistently.                       |
| Kubernetes / AKS   | DevOps & Engineering Layer      | Orchestration            | Used to scale enterprise workloads.                          |
| CI/CD              | DevOps & Engineering Layer      | Deployment automation    | Used to automate builds and releases.                        |
| Terraform          | DevOps & Engineering Layer      | Infrastructure as Code   | Used to provision infrastructure consistently.               |
| GitHub             | DevOps & Engineering Layer      | Source control           | Used to manage repositories and workflows.                   |
| Protected Branches | DevOps & Engineering Layer      | Governance               | Used to enforce source control governance.                   |
| Code Reviews       | DevOps & Engineering Layer      | Quality assurance        | Used to maintain engineering quality standards.              |

---

# Final Build Stack Architecture Summary

## Layered View

| Layer                           | Technology                                           |
| ------------------------------- | ---------------------------------------------------- |
| Presentation Layer              | React, TailwindCSS, shadcn/ui, DQ Design System      |
| Application Layer               | Express                                              |
| Data Layer                      | PostgreSQL, Neo4j                                    |
| Integration & Messaging Layer   | REST APIs, GraphQL, Webhooks, Kafka, MCP             |
| Identity & Security Layer       | Entra ID, Encryption, PII Redaction, Audit Logs      |
| Object Storage & Delivery Layer | Supabase Storage                                     |
| Analytics Layer                 | LangSmith                                            |
| AI Layer                        | OpenAI, LangGraph, Azure OpenAI, PG Vector, GraphRAG |
| DevOps & Engineering Layer      | Docker, Kubernetes, Terraform, GitHub                |

---

# Final Notes

* Enterprise-first AI architecture aligned to DBP governance.
* Supports scalable, observable, and governed AI systems.
* Designed for secure production-grade AI integration across enterprise platforms.