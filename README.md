# Veristream

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). In addition to standard development, this project is dockerized for both the frontend (Next.js) and the backend (Python).

## Project Structure

```
/veristream
├── model
│    ├── analyze_text.py
│    ├── fact_checker.py
│    ├── Dockerfile.backend
│    ├── requirements.txt
├── app
│    ├── Dockerfile.frontend
│    ├── layout.js
│    ├── page.js
├── package.json
├── docker-compose.yml
├── transcribe_video.py
```

- **model/**: Contains Python backend code and its Dockerfile.
- **app/**: Contains Next.js frontend source files and its Dockerfile.
- **transcribe_video.py**: A Python script required by the frontend.
- **docker-compose.yml**: Orchestrates both services.

## Docker Setup

This project uses Docker multi-stage builds to optimize the final image size by including only production artifacts. The configuration is split into two services:

- **Backend**: Built from the `model` folder using a slim Python base image.
- **Frontend**: Built from the project root with the Dockerfile in `app/`, which incorporates a Python virtual environment and Next.js build artifacts.

### Prerequisites

- **Docker:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop) for your operating system (macOS, Windows, or Linux).
- **For macOS users:** Docker Desktop for Mac works similarly to Docker on Linux. Ensure that you have enough resources allocated (CPU, Memory) in Docker Desktop preferences.

### .dockerignore

Make sure your `.dockerignore` (located in the project root) excludes unnecessary files to minimize the build context:

```
.git
.gitignore
node_modules
Dockerfile*
*.pyc
__pycache__/
temp/
*.ipynb
```

**Important:** Do not ignore the `model/` folder or `transcribe_video.py` if they are required for the build.

### Building and Running with Docker

1. **Build the Images**  
   From the project root, run:
   ```bash
   docker-compose build --no-cache
   ```
   This builds both the frontend and backend images using their respective Dockerfiles.

2. **Run the Containers**  
   After building, start the containers:
   ```bash
   docker-compose up
   ```
   - The **frontend** service will be available at [http://localhost:3000](http://localhost:3000).
   - The **backend** service will run on port 5000.

3. **Optimized Images**  
   Multi-stage builds ensure that build-time dependencies are excluded from the final image, reducing image size and improving performance.

## Local Development (Without Docker)

If you prefer to run the project locally:

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

1. Navigate to the `model` folder and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the backend server:
   ```bash
   python fact_checker.py
   ```
   (Adjust the command if your backend entry point is different.)

## Additional Notes

- **macOS Considerations:**  
  Docker Desktop for Mac runs on a Linux VM, so most Docker instructions work as they do on Linux. Ensure you configure resource limits appropriately in Docker Desktop Preferences.
  
- **Best Practices:**  
  - Use a minimal base image (e.g., `*-slim`) to reduce bloat.
  - Leverage multi-stage builds to keep the runtime image lean.
  - Maintain an accurate `.dockerignore` to exclude unnecessary files.
  - Use consistent file and folder structures to simplify COPY commands and context management.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Multi-stage Builds](https://docs.docker.com/develop/develop-images/multistage-build/)

Happy coding and containerizing!