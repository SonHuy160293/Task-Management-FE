# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

DevFlow serves software development organizations. Developers, QA engineers, and
designers manage assigned work and communicate progress and blockers. Team leaders
and project managers coordinate delivery and workloads. Engineering managers assess
capacity, delivery, and outcomes. Organization owners and administrators manage
members, access, teams, and settings.

## Product Purpose

DevFlow is a multi-tenant B2B SaaS platform for software engineering and delivery
management. Its long-term purpose is to give teams one workspace for project
execution, tasks, collaboration, delivery visibility, KPI/OKR tracking, performance
insights, and risks, issues, and blockers. Success means teams can plan and execute
work, identify delivery risks early, and improve outcomes.

## Positioning

The intended product connects engineering work and delivery health with team
capacity and measurable objectives in one workspace. Fast search, keyboard
navigation, useful filtering, and flexible views are intended to make daily work
efficient. AI assistance is a future option, not a dependency of core workflows.

## Operating Context

Organizations are isolated tenants; users may belong to multiple organizations and
teams. Individual contributors manage work, managers coordinate and evaluate
delivery, and administrators manage access. Organization context must be explicit.
Future performance insights should distinguish objective measures from subjective
evaluation and avoid reducing individual performance to task counts or lines of code.

## Capabilities and Constraints

- Identity and organization/team management are foundational domains. Projects,
  tasks, performance, KPI/OKR, and risk management are planned domains, not claims
  of completed functionality. Consult the backend integration gap register for
  current availability.
- Actual backend contracts and authorization are authoritative. Do not invent API
  capabilities or business rules. Frontend permission guards support usability and
  do not replace backend authorization.
- Preserve organization isolation, permission-aware experiences, and session
  handling based on actual backend contracts.
- Future AI suggestions must be reviewable, respect tenant boundaries and
  permissions, and not silently modify critical business data.
- Support responsive, accessible workflows and meaningful loading, empty, error,
  disabled, and permission-restricted states. Plan for large datasets and efficient
  search, filtering, sorting, and keyboard navigation.
- Use the existing React, strict TypeScript, Vite, Tailwind, and shadcn-style stack
  and feature-based architecture. Preserve working features and avoid speculative
  infrastructure or premature abstractions.
- The project owner is an experienced .NET backend developer learning frontend;
  learning documentation should use practical .NET analogies.

## Brand Commitments

The product is named DevFlow. Its intended interface takes inspiration from
Linear's information density and Notion's simplicity. Prioritize clarity, speed,
consistency, and usability over decorative effects; support light and dark themes.

## Evidence on Hand

The repository contains the current implementation, learning documentation, and a
reviewed Identity OpenAPI snapshot. [Backend integration gaps](docs/backend-integration-gaps.md)
records the distinction between implemented and planned capabilities. Do not
fabricate customer evidence, metrics, or deployed functionality.

## Product Principles

1. Keep engineering workflows efficient and understandable.
2. Connect delivery, workload, risks, and objectives with explainable context.
3. Protect tenant boundaries and defer authorization to the backend.
4. Build verified capabilities on actual contracts, incrementally.
5. Favor accessible, maintainable, responsive experiences over decoration.

## Accessibility & Inclusion

Provide semantic labels, keyboard controls, visible focus, and accessible error
states across desktop and mobile. No specific conformance standard has been set.
