# Stage 1: Build React App
FROM node:20 AS frontend-build
ARG FRONTEND_ENV
ENV FRONTEND_ENV=${FRONTEND_ENV}
WORKDIR /app
COPY frontend/ /app/
RUN rm -f /app/.env
RUN touch /app/.env
RUN echo "${FRONTEND_ENV}" | tr ',' '\n' > /app/.env
RUN cat /app/.env
RUN yarn install --frozen-lockfile && yarn build

# Stage 2: Install Python Backend
FROM python:3.11-slim as backend
WORKDIR /app
COPY backend/ /app/
COPY backend/requirements.txt /app/requirements.txt
RUN rm /app/.env
RUN pip install --no-cache-dir -r requirements.txt

# Stage 3: Final Image
FROM nginx:stable-alpine
# Copy built frontend
COPY --from=frontend-build /app/build /usr/share/nginx/html
COPY --from=backend /app/main.py /backend/main.py
COPY --from=backend /app/requirements.txt /backend/requirements.txt
# Add other necessary files as needed, e.g.:
# COPY --from=backend /app/app /backend/app
COPY --from=backend /app /backend
# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Python and dependencies are already installed in the backend stage

# The entrypoint script should start both Uvicorn (backend) and Nginx (frontend)
CMD ["/entrypoint.sh"]
