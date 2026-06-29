# Docker Advanced Assignment

## Project Overview

This project demonstrates advanced Docker concepts by containerizing a Node.js application with MongoDB and Nginx using Docker Compose. The project focuses on Docker image optimization, networking, volumes, security best practices, backup and restore operations, and container management.

---

# Features

- Multi-stage Docker build for optimized image size
- Custom Docker bridge network
- Multi-container application using Docker Compose
- Persistent data using Docker named volumes
- Bind mounts for development
- Docker volume backup and restore
- Non-root user implementation
- Least privilege container configuration
- Image vulnerability scanning using Docker Scout/Trivy
- Docker Bench for Security audit
- Environment variable management using `.env`
- Log aggregation architecture (Bonus)

---

# Project Structure

```text
docker-advanced-assignment/
│
├── app/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│
├── nginx/
│   └── nginx.conf
│
├── scripts/
│   ├── backup.sh
│   └── restore.sh
│
├── compose.yaml
├── .dockerignore
├── .env
├── README.md
└── logs/
```

---

# Prerequisites

- Docker 20.10+
- Docker Compose 1.29+
- Git
- Linux/macOS Terminal (or WSL for Windows)

Verify installation:

```bash
docker --version
docker compose version
```

---

# Clone Repository

```bash
git clone <repository-url>

cd docker-advanced-assignment
```

---

# Environment Variables

Create a `.env` file.

Example:

```env
PORT=3000

MONGO_URI=mongodb://mongo:27017/demo

JWT_SECRET=your-secret-key
```

---

# Build Docker Images

```bash
docker compose build
```

---

# Start Application

```bash
docker compose up -d
```

View logs

```bash
docker compose logs -f
```

---

# Stop Application

```bash
docker compose down
```

Remove volumes as well

```bash
docker compose down -v
```

---

# Multi-stage Build

The application Dockerfile uses two stages:

1. Builder Stage
   - Installs dependencies
   - Builds the application

2. Production Stage
   - Copies only required files
   - Creates a non-root user
   - Runs the application as a non-root user

Benefits:

- Smaller image
- Faster deployment
- Improved security

---

# Docker Network

Create custom bridge network

```bash
docker network create backend-network
```

Inspect network

```bash
docker network inspect backend-network
```

List networks

```bash
docker network ls
```

Remove network

```bash
docker network rm backend-network
```

Containers communicate using service names instead of IP addresses.

Example:

```
mongodb://mongo:27017/demo
```

---

# Docker Volumes

Create named volume

```bash
docker volume create mongo-data
```

List volumes

```bash
docker volume ls
```

Inspect volume

```bash
docker volume inspect mongo-data
```

Remove unused volumes

```bash
docker volume prune
```

---

# Bind Mount

Development uses bind mount.

![alt text](image.png)

```yaml
volumes:
  - ./mongo-data:/data/db
```

Benefits:

- Live code changes
- No image rebuild required
- Faster development

---

# Backup Docker Volume

```bash
docker run --rm \
-v mongo-data:/volume \
-v $(pwd):/backup \
ubuntu \
tar czf /backup/mongo-backup.tar.gz /volume
```

---

# Restore Docker Volume

```bash
docker run --rm \
-v mongo-data:/volume \
-v $(pwd):/backup \
ubuntu \
bash -c "cd /volume && tar xzf /backup/mongo-backup.tar.gz"
```

---

# Security Best Practices

This project follows Docker security recommendations.

### Non-root User

```dockerfile
RUN addgroup -S appgroup \
 && adduser -S appuser -G appgroup

USER appuser
```

---

### File Ownership

```dockerfile
COPY --from=builder --chown=appuser:appgroup /app .
```

---

### Least Privilege

Example Compose configuration

```yaml
read_only: true

security_opt:
  - no-new-privileges:true

cap_drop:
  - ALL

tmpfs:
  - /tmp
```

---

### Secrets Management

Sensitive values are stored inside `.env`.

Example:

```env
JWT_SECRET=******
DATABASE_PASSWORD=******
```

The `.env` file should never be committed to Git.

---

# Image Vulnerability Scan

Docker Scout

```bash
docker scout quickview node-app
```

Detailed CVE scan

```bash
docker scout cves node-app
```

Using Trivy

```bash
trivy image node-app
```

---

# Docker Bench for Security

Run security audit

```bash
docker run --rm \
--net host \
--pid host \
--userns host \
--cap-add audit_control \
-v /etc:/etc:ro \
-v /var/lib:/var/lib:ro \
-v /var/run/docker.sock:/var/run/docker.sock:ro \
docker/docker-bench-security
```

Checks include:

- Docker daemon configuration
- Host security
- Image security
- Container configuration
- Logging
- Networking

---

# Useful Docker Commands

### Images

```bash
docker images
```

### Containers

```bash
docker ps

docker ps -a
```

### Logs

```bash
docker logs <container-name>
```

### Execute Shell

```bash
docker exec -it <container-name> sh
```

### Remove Containers

```bash
docker rm <container-name>
```

### Remove Images

```bash
docker rmi <image-name>
```

---

# Docker Compose Commands

Start

```bash
docker compose up -d
```

Build

```bash
docker compose build
```

Restart

```bash
docker compose restart
```

Stop

```bash
docker compose stop
```

Down

```bash
docker compose down
```

View running containers

```bash
docker compose ps
```

Logs

```bash
docker compose logs
```

---

# Bonus: Log Aggregation System

Architecture

```
Node Application
        │
        ▼
     Fluentd
        │
        ▼
 Elasticsearch
        │
        ▼
     Kibana
```

Benefits

- Centralized logging
- Search application logs
- Monitor errors
- Performance analysis
- Visual dashboards
- Request tracing

---

# Learning Outcomes

This assignment demonstrates practical knowledge of:

- Dockerfile optimization
- Multi-stage builds
- Docker Compose
- Container networking
- Named volumes
- Bind mounts
- Backup and restore
- Image optimization
- Docker security
- Least privilege principle
- Secret management
- Vulnerability scanning
- Docker Bench for Security
- Multi-container deployment
- Log aggregation architecture

---

# Screenshots to Include

- Docker images

- Running containers
- Docker Compose output
- Docker network inspection
- Docker volumes
- Backup and restore execution
- Docker Scout scan results
- Docker Bench results
- Kibana dashboard (Bonus)

---

# Author

Nishant Chand Rajwar

**Technology Stack:**

- Node.js
- Docker
- Docker Compose
- MongoDB
- Nginx
## Docker log aggregation

This project includes a local log aggregation stack:

- Loki stores and queries logs.
- Promtail discovers Docker containers, reads their stdout/stderr logs, and pushes them to Loki.
- Grafana visualizes logs and request metrics from Loki.

Start the full stack:

```bash
docker compose up --build
```

Open Grafana:

```text
http://localhost:3001
```

Default login:

```text
username: admin
password: admin
```

Open the `Docker Observability / Docker Application Logs` dashboard. It shows:

- live application logs from the `node-app` container
- request rate grouped by HTTP status
- average request duration from structured JSON logs

Generate sample traffic:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
```

Useful Loki queries in Grafana Explore:

```logql
{container="node-app"}
{container="node-app", level="error"}
{container="node-app"} | json | method="GET"
sum by (status) (rate({container="node-app", status!=""}[1m]))
avg_over_time({container="node-app"} | json | duration_ms != "" | unwrap duration_ms [5m])
```
