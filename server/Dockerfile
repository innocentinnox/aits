# Stage 1: Base build stage
FROM python:3.13-slim AS builder

# Install only necessary build dependencies
RUN apt-get update && apt-get install -y gcc build-essential && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 

# Copy only requirements first for caching
COPY requirements.txt /app/

# Upgrade pip and install dependencies in a separate directory
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production stage
FROM python:3.13-slim

# Create a non-root user and prepare directories
RUN useradd -m -r appuser && mkdir /app && chown -R appuser /app

# Set working directory
WORKDIR /app

# Copy Python dependencies from the builder stage
COPY --from=builder /install /usr/local

# Copy application source code (after dependencies to maximize cache efficiency)
COPY --chown=appuser:appuser . .

# Ensure entrypoint script is executable
RUN chmod +x /app/entrypoint.prod.sh

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8000

# Start the application using Gunicorn
CMD ["/app/entrypoint.prod.sh"]
