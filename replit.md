# Overview

This is an authentic WhatsApp clone built with a modern full-stack architecture that closely replicates the real WhatsApp Web interface. The application features real-time messaging capabilities with a React frontend and Express.js backend, using authentic WhatsApp conversation data from provided JSON webhook files. It provides a pixel-perfect chat interface with support for different message types, emoji reactions, file attachments, and real-time communication through WebSockets.

## Recent Changes (August 9, 2025)
- Enhanced UI to match authentic WhatsApp Web design with proper color scheme and spacing
- Increased chat list width from w-80 to w-96 for better proportions matching real WhatsApp
- Integrated real WhatsApp conversation data from JSON webhook files into the storage system
- Updated chat names and messages to reflect authentic business conversations:
  - Ravi Kumar: "Hi, I'd like to know more about your services."
  - Neha Joshi: "Hi, I saw your ad. Can you share more details?"
- Improved message bubbles, chat list styling, and overall visual authenticity
- Added proper unread message counts based on real conversation data

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built using React with TypeScript and follows a component-based architecture:

- **React Router**: Uses Wouter for client-side routing with a simple route structure
- **State Management**: Leverages React Query (@tanstack/react-query) for server state management and caching
- **UI Components**: Built with Radix UI primitives and shadcn/ui components for consistent, accessible design
- **Styling**: Uses Tailwind CSS with a custom WhatsApp-inspired color scheme and theming system
- **Real-time Communication**: Custom WebSocket hook for real-time message updates and typing indicators

## Backend Architecture
The server follows a RESTful API design with WebSocket integration:

- **Express.js Server**: Handles HTTP requests and serves the React application in production
- **WebSocket Integration**: Uses the `ws` library for real-time bidirectional communication
- **Storage Layer**: Abstract storage interface with in-memory implementation for development (includes mock data)
- **Route Structure**: Organized API endpoints for user management, chat operations, and message handling
- **Development Setup**: Vite integration for hot module replacement and development server

## Data Storage Solutions
The application uses a flexible storage architecture:

- **Database**: Configured for PostgreSQL using Drizzle ORM with schema definitions
- **Development Storage**: In-memory storage implementation with mock data for development
- **Schema Design**: Well-defined database schema with users, chats, chat_members, and messages tables
- **Session Management**: PostgreSQL session store integration for user sessions

## Authentication and Authorization
Basic authentication framework is in place:

- **User Management**: User creation, authentication, and profile management endpoints
- **Session Handling**: Express session middleware with PostgreSQL session storage
- **Current User Context**: API endpoints assume authenticated user context (user-1 for development)

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Query for data fetching
- **Express.js**: Web framework with session management and WebSocket support
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL dialect

### Database and Storage
- **PostgreSQL**: Primary database (via @neondatabase/serverless for cloud deployment)
- **Session Storage**: connect-pg-simple for PostgreSQL session management

### UI and Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom WhatsApp theming
- **shadcn/ui**: Pre-built components built on top of Radix UI

### Development and Build Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type checking and enhanced development experience
- **ESBuild**: Fast JavaScript bundler for production builds

### Real-time Communication
- **WebSocket (ws)**: Real-time bidirectional communication for live messaging
- **Custom WebSocket Hook**: React hook for managing WebSocket connections and message handling

### Additional Features
- **Date Formatting**: date-fns for consistent date and time formatting
- **Form Handling**: React Hook Form with Zod validation
- **Emoji Support**: Custom emoji picker component
- **File Attachments**: Framework for handling different attachment types (documents, images, camera)