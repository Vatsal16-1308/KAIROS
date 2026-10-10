# Kairos Backend — Render Deployment Guide (Dockerfile)

This guide provides step-by-step instructions for deploying the **Spring Boot Java backend** to [Render](https://render.com) using **Docker**.

---

## 🚀 Quick Summary
* **Runtime**: Docker (Multi-stage Alpine JRE Build)
* **Dockerfile Locations**:
  * Root level: `./Dockerfile`
  * Server folder: `./server/Dockerfile`
* **Health Check Endpoint**: `/api/health`
* **Default Container Port**: `8080` (Render binds dynamically to `PORT`)

---

## Step 1: Push Code to GitHub / GitLab

Ensure your repository is pushed to GitHub or GitLab so Render can access it.

```bash
git add .
git commit -m "Add Dockerfile and Render deployment setup"
git push origin main
```

---

## Step 2: Deploy Backend on Render

1. Log into your **[Render Dashboard](https://dashboard.render.com)**.
2. Click **New +** → Select **Web Service**.
3. Connect your **GitHub / GitLab repository**.
4. Configure the Web Service settings:

| Setting | Value |
|---|---|
| **Name** | `kairos-backend` |
| **Language / Runtime** | **Docker** |
| **Branch** | `main` |
| **Root Directory** | Leave blank (or `./server` if building server subfolder) |
| **Dockerfile Path** | `./Dockerfile` (or `./server/Dockerfile`) |
| **Instance Type** | **Free** (or Starter) |

---

## Step 3: Configure Environment Variables on Render

In the **Environment** section of your Render Web Service, add the following Environment Variables:

| Key | Example Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<MYSQL_HOST>:3306/kairos_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC` | Database JDBC URL (Aiven, PlanetScale, Railway, or Render MySQL) |
| `SPRING_DATASOURCE_USERNAME` | `root` (or DB user) | MySQL Username |
| `SPRING_DATASOURCE_PASSWORD` | `your_mysql_password` | MySQL Password |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit Hex Key (min 64 chars) |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend-domain.onrender.com,http://localhost:5173` | Allowed CORS URLs |

> 💡 **Tip for Database**: If you want a quick free MySQL instance, you can use [Aiven for MySQL](https://aiven.io/), [Railway MySQL](https://railway.app/), or [Clever Cloud MySQL]. Alternatively, if you set `--spring.profiles.active=h2`, it will run using embedded H2 in memory with zero external database dependencies!

---

## Step 4: Deploy & Verify

1. Click **Create Web Service**.
2. Render will pull the Dockerfile, execute the multi-stage build, package the Spring Boot executable `.jar`, and start the container.
3. Once deployed, verify your backend health check by visiting:
   ```http
   https://kairos-backend.onrender.com/api/health
   ```
4. Update your frontend `VITE_API_URL` environment variable to point to your new live backend URL:
   ```env
   VITE_API_URL=https://kairos-backend.onrender.com/api
   ```

---

## 🐳 Local Docker Build Verification (Optional)

You can test the Docker build locally on your machine before pushing to GitHub:

```bash
# Build Docker Image locally
docker build -t kairos-backend:latest .

# Run Container locally connected to local database
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_PASSWORD="1308@Vatsal" \
  kairos-backend:latest
```
