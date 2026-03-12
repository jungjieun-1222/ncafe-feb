# 1단계: 빌드 스테이지
FROM gradle:8.10-jdk21 AS builder
WORKDIR /app

# Gradle 설정 최적화 (메모리 제한 및 툴체인 다운로드 금지)
ENV GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx1024m -Dorg.gradle.daemon=false"
# 툴체인 자동 감지로 인한 오류 방지
ENV GRADLE_USER_HOME=/app/.gradle

# 설정 파일 복사 및 종속성 캐싱
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon > /dev/null 2>&1 || true

# 소스 코드 복사
COPY src src

# 실제 빌드 실행 (상세 로그 및 메모리 설정 추가)
RUN gradle bootJar --no-daemon -x test --info

# 2단계: 실행 스테이지
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

RUN mkdir -p /app/upload && chmod 777 /app/upload
VOLUME /app/upload

EXPOSE 8081
# 실행 시에도 메모리 제한 권장
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=8081", "-jar", "app.jar"]
