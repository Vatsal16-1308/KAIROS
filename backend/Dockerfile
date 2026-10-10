# ==========================================
# STAGE 1: Build Application with Maven
# ==========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy pom.xml and source files
COPY pom.xml .
COPY src ./src

# Package application JAR file
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Lightweight Production Runtime
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root system user for production security
RUN addgroup -S kairosgroup && adduser -S kairosuser -G kairosgroup

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/kairos-backend-1.0.0.jar app.jar

# Ensure proper permissions
RUN chown -R kairosuser:kairosgroup /app
USER kairosuser

# Default port for Render (Render passes PORT dynamically, e.g. 10000 or 8080)
ENV PORT=8080
EXPOSE ${PORT}

# Health check for deployment monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Launch Spring Boot backend executable
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
