# Crudeman

## Application Description

Crudeman is a desktop application built with Electron, React, and Vite that enables users to efficiently manage, create, and test HTTP requests (CRUD operations). It provides a clean and intuitive interface for sending API requests, managing headers, parameters, and request bodies, and saving request history for easy reuse. Crudeman aims to simplify API testing and development workflows for developers.

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/DanielSet91/Crudeman.git
   cd crudeman
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the application in development mode**
   ```bash
   npm run dev
   ```

   4. **Build the executable (.exe)**
   ```bash
   npm run dist
   ```

## Build Instructions

To build the production-ready application:

```bash
npm run build
```

This will generate the compiled files in the `dist` folder. You can then package or distribute the app as needed.

## Architecture Decisions

- **Electron** is used as the container to build a cross-platform desktop app with web technologies.
- **React** for building the user interface, leveraging component-based architecture.
- **Vite** as the frontend build tool for fast development and optimized builds.
- **SQLite** is used as the lightweight database to store request history locally.
- **IPC (Inter-Process Communication)** via Electron's `ipcRenderer` and `ipcMain` bridges the UI and backend logic.
- The app uses JSON stringification to store complex request and response data in the database.
- Modular code separation with services, components, and utilities for maintainability and scalability.

## Known Limitations

- The app currently only supports basic HTTP methods (GET, POST, PUT, DELETE).
- Error handling and validation for malformed requests or responses can be improved.
- UI responsiveness is limited.
- Request body parsing assumes JSON format, which may not cover all API use cases.
- Some edge cases around header and parameter encoding may need refinement.
- Currently does not support sending FormData (e.g., for file uploads via multipart/form-data).
- The app cannot yet properly handle binary or non-JSON responses (e.g., images, files, or streamed content).
- Designed for single-user use only — there is no support for authentication, user switching, or multi-user data isolation.


### Development Environment

- Developed and tested on Windows 10/11.
- Node.js version 20.18.1
