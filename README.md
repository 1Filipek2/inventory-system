# Inventory System

![Inventory System](public/images/inv-sys.png)

[![Backend Language](https://img.shields.io/badge/backend-C%23_.NET-512BD4.svg?logo=dotnet)](https://dotnet.microsoft.com/)
[![Frontend Language](https://img.shields.io/badge/frontend-TypeScript-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Frontend Framework](https://img.shields.io/badge/framework-React-61DAFB.svg?logo=react)](https://react.dev/)
[![Build Tool](https://img.shields.io/badge/build_tool-Vite-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Containerization](https://img.shields.io/badge/containerization-Docker-2496ED.svg?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Description

The Inventory System is my ongoing project, a full-stack app with a RESTful ASP.NET Core API, a React + TypeScript UI, Dockerized, and using PostgreSQL, which I’m continuously expanding.

## ✨ Features

*   **Comprehensive Item Management:** Perform Create, Read, Update, and Delete (CRUD) operations on inventory items.
*   **RESTful API:** A clean and well-structured API for seamless interaction with backend services.
*   **Modern Frontend:** Intuitive user interface built with React, offering a smooth user experience.
*   **Type-Safe Development:** Leverage TypeScript for improved code quality and maintainability in the frontend.
*   **Styling with Tailwind CSS:** A utility-first CSS framework for rapid and consistent UI development.
*   **Dockerized Environment:** Easy setup and consistent environment across development and production using Docker and Docker Compose.
*   **PostgreSQL Database:** Reliable and scalable data storage.

## 📚 Tech Stack

**Backend:**
*   **Language:** C#
*   **Framework:** ASP.NET Core
*   **ORM:** Entity Framework Core
*   **Database:** PostgreSQL
*   **API Documentation:** Swagger/OpenAPI (implied by HTTP file structure)

**Frontend:**
*   **Language:** TypeScript
*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **HTTP Client:** Axios
*   **Icons:** Lucide React

**DevOps & Tools:**
*   **Containerization:** Docker, Docker Compose
*   **Linting:** ESLint (@typescript-eslint/eslint-plugin)

## 🚀 Installation

Follow these steps to get the Inventory System up and running on your local machine.

### Prerequisites

Ensure you have the following installed:

*   [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)
*   [.NET SDK](https://dotnet.microsoft.com/download) (latest LTS version, e.g., .NET 10)
*   [Node.js](https://nodejs.org/en/download/) (LTS version, includes npm)

### Clone the repository

```bash
git clone https://github.com/your-username/inventory-system.git
cd inventory-system
```

### Setup with Docker Compose (Recommended)

This method sets up the entire application stack (frontend, backend, database) with a single command.

1.  **Create `.env` file for database credentials:**
    Create a file named `.env` in the root of the `inventory-system` directory with your PostgreSQL credentials:

    ```env
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password
    POSTGRES_DB=inventorydb
    ```
    (You can copy `docker-compose.example.yml` to `docker-compose.yml` if you prefer to edit it directly, or adjust the `docker-compose.yml` to use environment variables as shown in `docker-compose.example.yml`.)

2.  **Start the services:**
    ```bash
    docker-compose up --build
    ```
    This command will:
    *   Build the Docker images for both frontend and backend.
    *   Start the PostgreSQL database container.
    *   Run any pending Entity Framework Core migrations on the backend database.
    *   Start the ASP.NET Core API server.
    *   Start the React development server.

3.  **Access the application:**
    *   **Frontend:** Typically available at `http://localhost:5173` (as configured in `vite.config.ts`).
    *   **Backend API:** Typically available at `http://localhost:5000` or `http://localhost:5001` (HTTPS). Swagger UI for API exploration will be at `http://localhost:5000/swagger`.

### Manual Setup (Optional)

If you prefer to run the frontend and backend services separately without Docker Compose:

#### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd src/Backend
    ```
2.  Restore NuGet packages:
    ```bash
    dotnet restore
    ```
3.  Apply Entity Framework Core migrations:
    ```bash
    dotnet ef database update
    ```
    *(Note: Ensure your `appsettings.Development.json` has the correct PostgreSQL connection string pointing to your local PostgreSQL instance if not using Docker Compose for the DB.)*
4.  Run the backend application:
    ```bash
    dotnet run
    ```
    The API will be available at `http://localhost:5000` (HTTP) or `http://localhost:5001` (HTTPS).

#### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd src/Frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`. Ensure your React app is configured to communicate with your backend API (e.g., `http://localhost:5000`).

## ▶️ Usage

Once the application is running, you can:

*   **Access the UI:** Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`) to interact with the inventory system.
*   **Test the API:**
    *   Use the Swagger UI at `http://localhost:5000/swagger` to explore and test the available API endpoints for managing `Items`.
    *   Alternatively, you can use a tool like VS Code's REST Client with the `src/Backend/InventorySystem.Api.http` file to send requests to the API.

    Example API request (GET all items):
    ```http
    GET http://localhost:5000/api/Items
    Accept: application/json
    ```

    Example API request (POST a new item):
    ```http
    POST http://localhost:5000/api/Items
    Content-Type: application/json

    {
      "name": "Laptop",
      "description": "High-performance laptop",
      "quantity": 10,
      "price": 1200.00
    }
    ```