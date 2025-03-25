# FastLayers Template

Template to create APIs using FastAPI, based on layered architecture.

## Table of Contents

- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Comming soon...](#comming-soon)

---

## Getting Started



### Prerequisites

I recommend you to use **Docker**, but you can use a simple **virtual enviroment** as well.

Clone this repository to your local machine:

```bash
git clone https://github.com/fernandoc-dev/fastlayers.git
```

## Running the Project

Here we have 2 cases:

1. **Without Docker**
    Once you have cloned the repository and set up your .env file, you can create a virtual enviromnent and install the dependencies listed in the requirements.txt file.

    I'm going to try to facilitate the process by providing you with the following commands, if this doesn't go on for your case, I'm sure you can adapt them for your system.
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
    Then you can run the project using the following command:
    ```bash
    uvicorn app.main:app --reload
    ```
    After the service is running, you can access it at http://localhost:8000.
    ### Stopping the Service
    ```bash
    Ctrl + C
    ```
2. **With Docker**
    Once you have cloned the repository and set up your .env file, you can start the service using Docker Compose.

    Build and start the project:
    ```bash
    docker-compose up --build
    ```
    After the service is running, you can access it at http://localhost:8000.
    ### Stopping the Service
    ```bash
    docker-compose down
    ```

## Project Structure
```
fastlayers/
│
├── app/
│   ├── v1/                         # API version 1 (or n version)
│   │   ├── routes/                 # Handle the requests and responses
│   │   │   ├── __init__.py__       # Hub of routes (The routes must be declared here)
│   │   │   └── base_route.py       # Generic routes
│   │   ├── services/               # Handle the business logic
│   │   ├── repositories/           # Handle the communication with databases
│   │   ├── integrations/           # Handle the communication with external services
│   │   └── models/                 # SQLModel-based models
│   ├── config/                     # Project settings 
│   └── main.py                     # FastAPI app entry point
│
├── alembic/               # Directory for Alembic migrations
├── .env                   # Environment variables (database and other configurations)
├── Dockerfile             # Dockerfile for building the image
├── docker-compose.yml     # Docker Compose file to orchestrate the services
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

## Environment Variables

The service requires specific configuration values that should be stored in a .env file at the root of the project. These variables are essential for connecting to the database and configuring other settings.

```
# ENVIROMENT

# DATABASE
DB_HOST=db
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=
DB_NAME=database
```
## Comming soon...
- [ ] Add tests
- [ ] Add more examples
- [ ] Add more documentation
- [ ] Add more features