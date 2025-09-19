# Overview

This is an Aviation Financial Analysis application built for Aviation Component Solutions (ACS) to evaluate new product development opportunities. The application provides a comprehensive financial analyzer that calculates key performance indicators (NPV, IRR, Payback Period) and presents results with a traffic light system (Red/Yellow/Green) to guide investment decisions. It's designed as a specialized tool for aviation professionals requiring precise financial analysis for component development projects.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, professional interface
- **Styling**: Tailwind CSS with custom design system optimized for financial data presentation
- **State Management**: React useState for local component state, React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom dark/light theme implementation with localStorage persistence

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API
- **Language**: TypeScript throughout the entire stack for consistency
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Session Management**: Built-in session handling with connect-pg-simple for production

## Design System
- **Color Palette**: Aviation-inspired theme with deep blue-gray primary colors
- **Typography**: Inter for UI text, JetBrains Mono for financial figures
- **Component Library**: Custom components optimized for financial data display
- **Status Indicators**: Visual traffic light system (Red/Yellow/Green) for quick decision making
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities

## Financial Calculation Engine
- **Core Logic**: Comprehensive NPV, IRR, and Payback Period calculations
- **Input Validation**: Type-safe input handling with Zod schemas
- **Real-time Updates**: Calculations update automatically as inputs change
- **Export Functionality**: CSV export for detailed financial analysis reports
- **Criteria-based Evaluation**: Configurable thresholds for pass/fail criteria

## Data Architecture
- **Schema Design**: Structured financial analysis data model with user management
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Validation**: Zod schemas for runtime type checking and validation
- **Migration System**: Drizzle migrations for database schema management

# External Dependencies

## Database
- **PostgreSQL**: Primary database using Neon serverless for cloud deployment
- **Drizzle ORM**: Type-safe database operations with automatic migration support

## UI Components
- **Radix UI**: Accessible component primitives for professional interface
- **Lucide React**: Consistent icon library for UI elements
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## Development Tools
- **Vite**: Modern build tool with HMR for fast development
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundling for production builds

## Third-party Services
- **Replit Integration**: Development environment integration with error modal and cartographer
- **Google Fonts**: Inter and JetBrains Mono fonts for professional typography
- **React Query**: Server state management and caching for optimal performance

## Financial Libraries
- **date-fns**: Date manipulation for financial calculations
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation for financial inputs