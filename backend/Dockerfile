FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
RUN ./gradlew bootJar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
# Ensure upload directory exists
RUN mkdir -p /app/upload
VOLUME /app/upload
EXPOSE 8080
ENTRYPOINT ["java", "-Dserver.port=8080", "-jar", "app.jar"]
