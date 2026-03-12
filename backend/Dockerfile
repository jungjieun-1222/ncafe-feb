# 1단계: 빌드 스테이지
FROM gradle:8.10-jdk21 AS builder
WORKDIR /app

# 설정 파일만 먼저 복사하여 종속성 캐싱 활용
COPY build.gradle settings.gradle ./

# 종속성 먼저 다운로드 (코드 변경 시에도 캐시 활용 가능)
RUN gradle build --refresh-dependencies -x test > /dev/null 2>&1 || true

# 소스 코드 복사
COPY src src

# 실제 빌드 실행
RUN gradle bootJar --no-daemon -x test

# 2단계: 실행 스테이지
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 빌드 스테이지에서 생성된 jar 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 업로드 디렉토리 설정
RUN mkdir -p /app/upload && chmod 777 /app/upload
VOLUME /app/upload

EXPOSE 8081
ENTRYPOINT ["java", "-Dserver.port=8081", "-jar", "app.jar"]
