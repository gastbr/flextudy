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

### Root Level

project-root/
│
├── backend
├── frontend
├── docker-compose.yml # Global container setup
└── menu.py # Management CLI

### Backend Structure

backend/
│
├── app/ # Core application
│ ├── v1/ # API version namespace
│ │ ├── routes/ # Endpoint controllers
│ │ │ ├── init.py # Route aggregator
│ │ │ └── base_route.py # Shared route logic
│ │ ├── services/ # Business logic layer
│ │ ├── repositories/ # Database operations
│ │ ├── integrations/ # Third-party integrations
│ │ └── models/ # Data models (SQLModel)
│ │
│ ├── config/ # Configuration files
│ └── main.py # FastAPI entrypoint
│
├── alembic/ # Database migrations
├── .env # Environment variables
├── Dockerfile # Container configuration
├── docker-compose.yml # Service orchestration
├── requirements.txt # Python dependencies
└── README.md # Backend documentation

### Frontend Structure

frontend/
│
├── src/ # Next.js application
│ ├── app/ # App router
│ ├── components/ # UI components
│ ├── lib/ # Utilities
│ └── styles/ # Global CSS
│
├── Dockerfile # Frontend container
└── (Other config files)


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
