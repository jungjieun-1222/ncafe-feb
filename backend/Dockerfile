# 1단계: 빌드 스테이지
FROM gradle:9.4.0-jdk21 AS builder
WORKDIR /app

# 필요한 파일들 복사
COPY build.gradle settings.gradle ./
COPY src src

# 빌드 실행 (gradle 이미지는 이미 gradle이 설치되어 있으므로 gradlew 대신 gradle 명령어를 사용합니다)
RUN gradle bootJar --no-daemon -x test

# 2단계: 실행 스테이지
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 빌드 스테이지에서 생성된 jar 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 업로드 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/upload && chmod 777 /app/upload
VOLUME /app/upload

EXPOSE 8081
ENTRYPOINT ["java", "-Dserver.port=8081", "-jar", "app.jar"]
