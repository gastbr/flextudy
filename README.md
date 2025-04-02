# Educational Platform - Class Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Containers-blue)](https://www.docker.com/)

A comprehensive platform connecting students, teachers, and administrators in an integrated educational environment.

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Application Structure](#-application-structure)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [System Workflow](#-system-workflow)
- [API Documentation](#-api-documentation)
- [License](#-license)

## 🌟 Project Overview

Platform for managing educational classes (in-person/virtual) that connects students, teachers, and administrators. The system streamlines lesson organization, attendance tracking, credit purchases, and user communication through:

- **Role-based access control** (Admin/Teacher/Student)
- **Unified scheduling system** with calendar and list views
- **Digital wallet** for class credit management
- **Hybrid classroom support** with capacity constraints
- **Integrated messaging system**

## 🚀 Key Features

| Role        | Capabilities                                                                 |
|-------------|------------------------------------------------------------------------------|
| Admin       | Global dashboard, user management, analytics on class completion/attendance  |
| Teacher     | Create/manage classes, view student rosters, track attendance                |
| Student     | Browse/join classes, purchase credits, manage personal schedule              |

**Core Components:**
- Interactive Google-like calendar view
- Virtual wallet with credit purchase system
- Conflict detection for class scheduling
<!-- - Real-time notifications -->

## 💻 Technology Stack

**Backend:**
- FastAPI (Primary API)
- PostgreSQL (Transactional database)
- Alembic (Database migrations)

**Frontend:**
- Next.js (Dynamic React framework)

**Infrastructure:**
- Docker (Containerization)
- Multi-VPS deployment (Separate frontend/backend hosts)

## 📂 Application Structure

## 🏗️ Project Structure

```text
project-root/
│
├── backend/ # Core API Server (FastAPI + PostgreSQL)
│ │
│ ├── app/ # Application Logic
│ ️│ │
│ │ ├── v1/ # API Version 1 (scalable to v2, v3)
│ │ │ │
│ │ │ ├── routes/ # API Endpoint Controllers
│ │ │ │ ├── init.py # Central route registry
│ │ │ │ └── base_route.py # Common route template (Base CRUD)
│ │ │ │
│ │ │ ├── services/ # Business logic (validation, processing)
│ │ │ ├── repositories/ # Database communication layer
│ │ │ ├── integrations/ # External API connections (payments, auth)
│ │ │ └── models/ # Data models (SQLModel for DB + schemas)
│ │ │
│ │ ├── config/ # Environment configurations
│ │ └── main.py # FastAPI entry point
│ │
│ ├── alembic/ # Database migrations (version control)
│ ├── .env # Local environment variables (git-ignored)
│ ├── Dockerfile # Container configuration
│ ├── docker-compose.yml # Service orchestration (API + DB)
│ ├── requirements.txt # Python dependencies
│ └── README.md # Backend-specific docs
│
├── frontend/ # Next.js Application (React)
│ │
│ ├── src/ # Core source code
│ │ │
│ │ ├── app/ # Next.js App Router
│ ️│ ├── components/ # Reusable UI components
│ │ ├── lib/ # Shared utilities/helpers
│ │ └── styles/ # Global CSS/CSS Modules
│ │
│ ├── Dockerfile # Container configuration
│ └── next.config.js # Next.js advanced config
│
├── docker-compose.yml # Global orchestration (full stack)
└── menu.py # Management CLI
```

## ⚡ Quick Start

### Prerequisites
- Docker Engine 20.10+
- Python 3.8+
- Node.js 18+ (For frontend development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/educational-platform.git
   cd educational-platform

2. Rename .env.example to .evn (backend)

3. Launch the management interface:

    python menu.py

    Management Menu Options:

        1. 🏗️  Build and start containers      # Initial deployment
        2. 🐘 Run migrations (Alembic)        # Apply database changes
        3. 📜 View backend logs               # Monitor service output
        4. 🛑 Stop and remove containers      # Shutdown services
        5. 🔄 Rebuild everything              # Full clean install

4. (menu.py)Build and start containers

5. (menu.py)Run migrations (Alembic)

6. Run de seeders:
    
    Use the endpoint faker/post to seed the db.

    http://localhost:8000/docs

7. Ready!


### 📜 Front
Front: http://localhost:3000/
### 📚 API Documentation
Swagger UI: http://localhost:8000/docs
