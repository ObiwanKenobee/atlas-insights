# ATLAS SANCTUM

## Institutional Decision Engine (IDE)

> **Simulation-driven decision intelligence for understanding systemic risk, portfolio exposure, impact, and strategic opportunity.**

Atlas Sanctum Institutional Decision Engine (IDE) is an institutional decision-intelligence frontend designed for high-stakes financial decision-making.

It helps users model real-world shocks, simulate their effects on portfolios, understand risk propagation, inspect impact verification, and review the evidence and confidence behind major signals.

The MVP is designed for:

* CIOs
* Heads of Risk
* Portfolio Strategists
* Scenario Analysts
* Institutional Investment Teams

The product is deliberately **not** a marketing website and not a generic fintech dashboard.

It is an internal operational interface built around:

**seriousness, trust, intelligence, restraint, clarity under complexity, and institutional-grade depth.**

---

# Product Model

Atlas Sanctum operates as a decision-intelligence layer between real-world events and institutional portfolio decisions.

```text
                REAL WORLD
                    │
                    ▼
              Risk Signals
                    │
                    ▼
                Scenarios
                    │
                    ▼
                Simulation
                    │
                    ▼
             Risk Propagation
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   Portfolio Exposure     Impact / ESG
          │                   │
          └─────────┬─────────┘
                    ▼
              Decision Context
                    │
                    ▼
             Human Judgment
```

The platform supports a workflow from systemic risk detection through scenario construction, simulation, portfolio analysis, verification, and decision review.

---

# Core Workflows

The MVP supports six primary workflows:

1. Review global systemic risks through a risk radar
2. Create or select scenarios
3. Run simulations against portfolios
4. Inspect simulation outcomes and portfolio impacts
5. Analyze risk propagation chains
6. Inspect impact verification, alerts, confidence, and decision rationale

---

# Design Philosophy

Atlas Sanctum should feel like serious institutional infrastructure.

### Design Characteristics

```text
Dark-first
Minimal
High-information-density
Restrained
Precise
Data-oriented
Operational
Executive
```

Avoid:

```text
Consumer fintech aesthetics
Neon cyberpunk
Startup landing-page gradients
Generic fintech decoration
```

## The visual direction draws from the composure of modern institutional analytics, Bloomberg-style information density, Stripe-level clarity, Palantir-style operational interfaces, and professional risk platforms.

# Technology Stack

## Frontend

* Next.js 14+ App Router
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* lucide-react

## Data Visualization

* Recharts
* D3, only where needed for the risk-propagation graph

## Application State

* TanStack React Query
* Zustand

## Animation

* Framer Motion

## Geospatial

* Mapbox GL JS
* Or a clean map abstraction / placeholder

## Theme

* next-themes

The frontend should use server components where sensible and client components where interaction requires them.

---

# Application Routes

```text
/login
/dashboard
/risk-radar
/scenarios
/scenarios/new
/simulations
/simulations/[id]
/portfolios
/portfolios/[id]
/impact
/graph
/settings
```

The application also includes shared infrastructure:

```text
Global Layout
Sidebar Navigation
Top Command Bar
Notifications Panel
Reusable Cards
Tables
Filters
Badges
Metric Tiles
Section Headers
Chart Panels
```

---

# Dashboard

## `/dashboard`

The executive overview is the primary operating surface.

### KPI Strip

```text
Active Scenarios
Simulations Run
At-Risk Portfolios
Verified Impact Assets
System Confidence Score
```

### Main Panels

```text
Global System Risk Overview
Portfolio Exposure Summary
Recent Simulation Runs
High Priority Alerts
Opportunity Signals
Confidence / Data Integrity
```

### Visualizations

* Systemic risk trend
* Sector exposure
* Recent simulation activity
* Alert severity
* Confidence and data-integrity signals

Example information hierarchy:

```text
┌────────────────────────────────────────────────────┐
│ Active Scenarios │ Simulations │ Risk │ Confidence │
├────────────────────────────────────────────────────┤
│                                                    │
│         Global System Risk Overview                │
│                                                    │
├────────────────────────┬───────────────────────────┤
│ Portfolio Exposure     │ High Priority Alerts     │
├────────────────────────┼───────────────────────────┤
│ Recent Simulations     │ Opportunity Signals      │
├────────────────────────┴───────────────────────────┤
│ Data Integrity / Confidence                         │
└────────────────────────────────────────────────────┘
```

---

# Risk Radar

## `/risk-radar`

The Risk Radar provides a global view of systemic risk.

### Risk Overlays

```text
Climate
Inflation
Supply Chain
Conflict
Water Stress
Policy Risk
```

### Interface

The page combines:

* Global or regional map
* Risk heatmap
* Region cards
* Severity legend
* Selected-region detail panel

### Region Panel

```text
Top Drivers
Affected Sectors
Potential Portfolio Implications
Confidence Score
```

The user should be able to select a region and move from geographic signal to institutional implication.

---

# Scenario Library

## `/scenarios`

The Scenario Library lets users browse, filter, and select potential systemic events.

Example categories:

```text
Climate
Macro
Infrastructure
Geopolitical
Policy
Multi-factor
```

Scenario cards should communicate the key assumptions and intended simulation context.

---

# Scenario Builder

## `/scenarios/new`

Users create a structured scenario.

### Inputs

```text
Scenario Name
Scenario Type
Region
Event
Severity
Duration
Probability / Confidence
Notes
Trigger Assumptions
Affected Sectors
```

### Actions

```text
Save Draft
Run Scenario
```

The builder should feel more like a structured institutional modeling workflow than a generic form.

---

# Simulations

## `/simulations`

Provides a centralized view of simulation runs.

### Interface

```text
Simulation
Scenario
Portfolio
Status
Created
Confidence
Result
```

The page should support status tracking and drill-down into individual simulation runs.

---

# Simulation Detail

## `/simulations/[id]`

This is one of the most important screens in the MVP.

### Header

Display:

* Simulation status
* Scenario metadata
* Portfolio metadata

### Summary Metrics

```text
Expected Drawdown
Volatility Increase
Exposure Concentration Shift
Risk Confidence Score
```

### Charts

```text
Expected Drawdown Over Time
Sector Impact
Risk Distribution / Stress Histogram
Scenario Timeline
```

### Intelligence Panels

```text
Risk Propagation Narrative
Key Drivers
Recommendations / Repositioning Options
Assumptions
Confidence & Evidence
```

The screen should tell the story of how the scenario propagates through the portfolio rather than merely displaying disconnected numbers.

---

# Portfolios

## `/portfolios`

The Portfolio List provides access to monitored institutional portfolios.

Potential fields:

```text
Portfolio Name
Strategy
AuM
Benchmark
Risk Status
Recent Scenario Activity
```

---

# Portfolio Detail

## `/portfolios/[id]`

### Header

```text
Portfolio Name
Strategy Type
AuM
Benchmark
```

### Analysis

```text
Holdings Table
Regional Exposure
Sector Allocation
Recent Scenario Tests
Vulnerability Summary
```

The page should move naturally from portfolio composition into scenario sensitivity and vulnerability.

---

# Impact Verification

## `/impact`

The Impact page represents the platform's **truth layer**.

Instead of displaying impact claims as unquestioned facts, the interface distinguishes between what is claimed and what has been verified.

### Verification Domains

```text
Carbon
Water
Biodiversity
Social Resilience
```

### Core Views

```text
Asset Verification Table
Claimed vs Verified
Verification Confidence
Red Flags / Inconsistencies
```

### Filters

```text
Region
Asset Class
Verification Status
```

This allows institutional users to evaluate the quality and confidence of impact information alongside financial analysis.

---

# Risk Propagation Graph

## `/graph`

The Risk Propagation Graph visualizes how an external event can move through interconnected systems and ultimately affect a portfolio.

### Required Interface

```text
Node-Link Graph
Selected Node Panel
Propagation Chain Summary
Event → Portfolio Consequence Explanation
```

### Filter Domains

```text
Climate
Economy
Infrastructure
Health
Policy
Markets
```

Example:

```text
Water Stress
    ↓
Agricultural Output
    ↓
Food Inflation
    ↓
Consumer Pressure
    ↓
Sector Earnings
    ↓
Portfolio Exposure
```

The graph is intended to make causal chains legible rather than treating risk as a collection of isolated metrics.

---

# Authentication

## `/login`

The MVP includes a simple institutional login surface.

Authentication should remain intentionally lightweight at this stage.

Do not over-engineer identity infrastructure before the core decision-intelligence workflows are validated.

---

# Settings

## `/settings`

The settings area provides the application configuration shell.

Potential areas include:

```text
Profile
Preferences
Theme
Notifications
Display
Data Settings
```

---

# Core Domain Model

The frontend should use explicit TypeScript models.

```text
DashboardSummary
      │
      ├── RiskSignal
      ├── AlertItem
      └── OpportunitySignal
             │
             ▼
          Scenario
             │
             ▼
         Simulation
             │
             ▼
          Portfolio
             │
             ├── Holding
             │
             └── Exposure
             
ImpactAsset
      │
      ▼
VerificationScore

RiskPropagationNode
      │
      ▼
RiskPropagationEdge
```

Recommended domain types:

```text
Scenario
Simulation
Portfolio
Holding
RiskSignal
RegionRiskSummary
ImpactAsset
VerificationScore
RiskPropagationNode
RiskPropagationEdge
DashboardSummary
AlertItem
OpportunitySignal
```

These models should remain independent from individual UI components.

---

# API Architecture

The frontend assumes the following backend contracts:

```text
GET  /api/dashboard/summary

GET  /api/risk-radar

GET  /api/scenarios
POST /api/scenarios
GET  /api/scenarios/:id

GET  /api/simulations
POST /api/simulations/run
GET  /api/simulations/:id

GET  /api/portfolios
GET  /api/portfolios/:id

GET  /api/impact/assets
POST /api/impact/verify

GET  /api/graph/propagation/:id
```

The frontend should not implement a real backend as part of this MVP.

Instead it should provide:

```text
TypeScript Types
API Client
React Query Hooks
Mock Data
Fallback Strategy
```

---

# Data Flow

```text
UI
 │
 ▼
Feature Hook
 │
 ▼
React Query
 │
 ▼
API Client
 │
 ├── Production API
 │
 └── Mock Data
       │
       ▼
Typed Domain Model
       │
       ▼
UI Components
```

This allows the frontend to function independently during development while remaining ready for backend integration.

---

# Repository Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── risk-radar/
│   ├── scenarios/
│   ├── simulations/
│   ├── portfolios/
│   ├── impact/
│   ├── graph/
│   └── settings/
│
├── components/
│   ├── layout/
│   ├── charts/
│   ├── tables/
│   ├── cards/
│   ├── forms/
│   ├── graph/
│   ├── map/
│   └── ui/
│
├── features/
│   ├── dashboard/
│   ├── risk-radar/
│   ├── scenarios/
│   ├── simulations/
│   ├── portfolios/
│   ├── impact/
│   └── graph/
│
├── lib/
│   ├── api/
│   ├── utils/
│   ├── constants/
│   ├── formatters/
│   └── mocks/
│
├── hooks/
├── store/
└── types/
```

The structure separates:

**application routes → shared UI → domain features → infrastructure → types/state.**

---

# Design System

Build a reusable institutional design foundation.

## Core Components

```text
App Shell
Sidebar
Topbar
Metric Card
Status Badge
Confidence Badge
Severity Indicator
Chart Container
Section Header
Filter Bar
Table Wrapper
Empty State
Loading Skeleton
Error State
```

Use semantic colors consistently while keeping the palette restrained.

### Theme

```text
Dark Theme
   ↓
Default

Light Theme
   ↓
Optional
```

The application is desktop-first while remaining responsive and accessible.

---

# UX Language

The interface should use institutional vocabulary.

### Preferred

```text
System Risk Overview
Portfolio Exposure Shift
Verification Confidence
Propagation Drivers
Scenario Assumptions
Emerging Vulnerability
Allocation Sensitivity
Regional Stress Signals
Data Integrity
```

### Avoid

```text
Awesome insights
Magic AI analysis
Smart portfolio wizard
Cool charts
```

The language should remain sharp, serious, and operational.

---

# Confidence & Evidence

Confidence is a first-class part of the interface.

Every significant analytical output should have enough context for users to understand:

```text
Confidence
Evidence
Assumptions
Data Quality
Uncertainty
```

This is especially important for:

* Risk signals
* Simulation results
* Impact verification
* Portfolio implications
* Risk propagation
* Recommendations

The product should communicate analytical depth without pretending that modeled outputs are certainty.

---

# Alerts

Alerts provide an operational layer above passive analytics.

An alert may include:

```text
Severity
Signal
Region
Affected Portfolio
Confidence
Evidence
Time
Potential Consequence
Recommended Review
```

Example:

```text
HIGH PRIORITY

Emerging Vulnerability

East Africa Agricultural Stress

Drivers:
Water stress
Crop-output decline
Food-price pressure

Confidence:
Medium-high

Affected:
3 portfolios

Review:
Scenario simulation recommended
```

---

# Opportunity Signals

Atlas Sanctum is not only a risk system.

The dashboard should also provide a space for potential opportunity signals.

Example categories:

```text
Allocation Sensitivity
Emerging Themes
Resilience Opportunities
Regional Dislocations
Infrastructure Transitions
Verified Impact Assets
```

These signals should be presented as analytical inputs for human review rather than automatic investment decisions.

---

# Example Institutional Scenarios

Use realistic placeholder scenarios such as:

```text
Emerging Markets Sovereign Debt Fund

Global Fixed Income Resilience Sleeve

East Africa Agricultural Stress Scenario

Mediterranean Water Constraint Scenario

Supply Chain Chokepoint Disruption

Carbon Verification Review Batch 04
```

These provide realistic institutional context during frontend development.

---

# Mock Data

Mock data should resemble actual institutional workflows.

Example:

```ts
const simulation = {
  id: "sim-042",
  scenario: "Mediterranean Water Constraint Scenario",
  portfolio: "Global Fixed Income Resilience Sleeve",
  status: "completed",
  expectedDrawdown: -4.8,
  volatilityIncrease: 1.7,
  concentrationShift: 6.2,
  confidence: 84,
}
```

Mock records should be obviously replaceable through the API abstraction.

---

# Navigation

Example sidebar:

```text
ATLAS SANCTUM

Overview
  Dashboard

Risk
  Risk Radar
  Scenarios
  Simulations
  Risk Graph

Portfolios
  Portfolios

Impact
  Impact Verification

System
  Settings
```

The navigation should make the relationship between **risk → scenario → simulation → portfolio → impact** obvious.

---

# Component Philosophy

The application should be modular.

Prefer:

```text
Domain Components
Typed Props
Reusable UI Primitives
Feature Hooks
Centralized API Access
Explicit State
```

Avoid:

```text
Large monolithic pages
Business logic in visual components
Duplicated API calls
Untyped data
Premature abstractions
```

Business logic should remain separate from presentational components.

---

# Implementation Phases

## Phase 1 — Foundation

Build:

```text
Folder Structure
Dependencies
Global Layout
Sidebar
Topbar
Theme Provider
Domain Types
Navigation
```

## Phase 2 — Shared Components

Build:

```text
Metric Cards
Section Headers
Status Badges
Confidence Badges
Severity Badges
Chart Containers
Tables
Filters
Empty States
Loading States
Error States
```

## Phase 3 — Product Pages

Implement:

```text
/dashboard
/risk-radar
/scenarios
/scenarios/new
/simulations
/simulations/[id]
/portfolios
/portfolios/[id]
/impact
/graph
/settings
```

## Phase 4 — Data Layer

Add:

```text
Mock Data
API Client
React Query
Hooks
Fallback Strategy
```

## Phase 5 — Refinement

Perform:

```text
Import Cleanup
Responsive Review
Accessibility Review
Component Consistency
Loading / Error States
Visual Refinement
```

This phased approach keeps the codebase coherent while allowing a team to continue development immediately.

---

# Local Development

## Requirements

* Node.js 20+
* npm / pnpm / yarn
* Git

## Installation

```bash
git clone https://github.com/YOUR-ORG/atlas-sanctum-ide.git

cd atlas-sanctum-ide

npm install
```

---

# Environment Variables

Create:

```bash
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_GRAPHQL_URL=
```

The exact environment variables can expand as backend integrations are introduced.

---

# Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production Build

```bash
npm run build
npm run start
```

---

# Quality Requirements

The scaffold should be production-oriented from the beginning.

### Required

```text
TypeScript
Strict typing
Reusable components
Accessible interfaces
Responsive layout
Loading states
Error states
Mock fallback
Clean API abstraction
Server/client separation
```

### Avoid

```text
Toy application architecture
Marketing-first layouts
Hard-coded business logic
Fake backend implementations
Unnecessary authentication complexity
Uncontrolled visual effects
```

The objective is code that compiles with minimal edits and gives an engineering team a real foundation to continue from.

---

# Product Architecture

The conceptual architecture of the MVP is:

```text
                   ATLAS SANCTUM IDE
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
     RISK RADAR        SCENARIOS          PORTFOLIOS
        │                  │                  │
        │                  ▼                  │
        │             SIMULATIONS             │
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                 RISK PROPAGATION
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
         IMPACT TRUTH              ALERTS
              │                         │
              └────────────┬────────────┘
                           ▼
                  DECISION CONTEXT
```

---

# What This MVP Proves

The MVP is designed to demonstrate one coherent idea:

> **Complex systemic events can be modeled as scenarios, simulated across portfolios, traced through causal chains, and examined alongside evidence and impact data.**

The application therefore connects:

```text
World Event
   ↓
Risk
   ↓
Scenario
   ↓
Simulation
   ↓
Propagation
   ↓
Portfolio Impact
   ↓
Evidence
   ↓
Decision Context
```

The final decision remains with the institution and its responsible decision-makers.

---

# Roadmap

### Foundation

```text
Institutional UI
Core Domain Models
Navigation
API Layer
Mock Data
```

### Intelligence

```text
Risk Radar
Scenario Engine
Simulation Results
Propagation Graph
Confidence Models
```

### Verification

```text
Impact Assets
Verification Workflows
Data Integrity
Evidence Layer
```

### Institutional Integration

```text
Portfolio Systems
Market Data
Risk Systems
Scenario Engines
Research Data
```

---

# Project Status

**Project:** Atlas Sanctum
**Product:** Institutional Decision Engine
**Abbreviation:** IDE
**Type:** Institutional Decision Intelligence
**Stage:** Frontend MVP
**Architecture:** Next.js App Router + TypeScript
**Primary Users:** CIOs, Heads of Risk, Portfolio Strategists, Scenario Analysts

---

# Philosophy

Atlas Sanctum is built around a simple principle:

```text
Complexity should produce clarity,
not confusion.
```

The interface should help institutions move from:

```text
Signal
   ↓
Understanding
   ↓
Scenario
   ↓
Simulation
   ↓
Evidence
   ↓
Decision
```

Not because the system replaces institutional judgment, but because better decisions require better models, clearer evidence, and a more legible view of how risks propagate through interconnected systems.

---

# ATLAS SANCTUM

### Institutional Decision Engine

**Understand the shock.
Model the propagation.
See the exposure.
Examine the evidence.
Make the decision.**
