# Estágio 1: build do frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build -- --outDir dist

# Estágio 2: build do backend (com os estáticos do React dentro)
FROM maven:3.9-eclipse-temurin-21-alpine AS backend
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline -q
COPY backend/src ./src
COPY --from=frontend /app/frontend/dist ./src/main/resources/static
RUN mvn package -DskipTests -q

# Estágio 3: imagem final mínima
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx256m", "-XX:+UseContainerSupport", "-jar", "app.jar"]
