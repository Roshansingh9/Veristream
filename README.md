# Veristream

Veristream is a Next.js project with a Python backend, fully containerized using Docker. This guide covers how to run the project using Docker (by pulling prebuilt images or building locally) and how to work with the images (including tagging and pushing to Docker Hub).

---

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
- **transcribe_video.py**: A Python script used by the frontend.
- **docker-compose.yml**: Orchestrates both services.

---

## Docker Setup

### Using Prebuilt Images

If you prefer not to build the images yourself, you can pull the prebuilt images from Docker Hub:

#### Pull and Run

1. **Pull the Images**

   ```bash
   docker pull bhushansah3/veristream:backend
   docker pull bhushansah3/veristream:frontend
   ```

2. **Run the Containers**

   For the **backend** (runs on port 5000):

   ```bash
   docker run -p 5000:5000 bhushansah3/veristream:backend
   ```

   For the **frontend** (runs on port 3000):

   ```bash
   docker run -p 3000:3000 bhushansah3/veristream:frontend
   ```

### Building Locally with Docker

If you want to build the images yourself, follow these steps:

1. **Ensure Your `.dockerignore` is Correct**

   In your project root, your `.dockerignore` should exclude unnecessary files:
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
   *Note: Do not ignore the `model/` folder or `transcribe_video.py`.*

2. **Build the Images Using Docker Compose**

   From the project root, run:

   ```bash
   docker-compose build --no-cache
   ```

3. **Run the Containers**

   Once built, start the services:

   ```bash
   docker-compose up
   ```

   - The **frontend** will be available at [http://localhost:3000](http://localhost:3000).
   - The **backend** will run on port 5000.

---

## Local Development (Without Docker)

If you prefer to run the project locally without containers:

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

*Note: Adjust the backend startup command if your entry point is different.*

---

## Additional Notes

- **macOS Users:**  
  Docker Desktop for Mac runs inside a Linux VM. Most Docker instructions work the same as on Linux, but ensure you allocate sufficient resources (CPU, memory) in Docker Desktop Preferences.

- **Best Practices:**  
  - Use minimal base images (e.g., `node:18-slim`, `python:3.11-slim`) to reduce image size.
  - Leverage multi-stage builds to separate the build environment from the runtime environment.
  - Maintain an accurate `.dockerignore` to keep the build context lean.
  - Use reproducible installs with `npm ci` and `pip install --no-cache-dir`.

- **Learn More:**  
  - [Next.js Documentation](https://nextjs.org/docs)
  - [Docker Documentation](https://docs.docker.com/)
  - [Multi-stage Builds](https://docs.docker.com/develop/develop-images/multistage-build/)

Happy coding, containerizing, and enjoy using Veristream!
```