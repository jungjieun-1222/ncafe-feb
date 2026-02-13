# 메뉴 관리 시스템 - 클린 아키텍처 (Clean Architecture) 청사진

이 문서는 메뉴 관리 시스템을 로버트 C. 마틴(Uncle Bob)의 **클린 아키텍처(Clean Architecture)** 원칙에 따라 재설계하기 위한 청사진입니다. 의존성 규칙(Dependency Rule)을 철저히 준수하여 안쪽 원(Domain)을 보호하는 것을 최우선으로 합니다.

## 1. 핵심 원칙: 의존성 규칙 (The Dependency Rule)
*   소스 코드의 의존성은 반드시 **안쪽(고수준 정책)**을 향해야 합니다.
*   안쪽 원(Entity, Use Case)은 바깥쪽 원(DB, Web, Framework)에 대해 **전혀 알지 못해야 합니다.**

## 2. 4계층 패키지 구조 (The 4 Layers)

`com.new_cafe.app.backend.menu` 패키지 구조 제안:

```
menu/
├── entity/                             # [1. Entities] - 가장 안쪽 원
│   ├── Menu.java                       # 핵심 비즈니스 로직을 가진 도메인 객체
│   └── MenuFactory.java                # (Optional) 객체 생성 팩토리
│
├── usecase/                            # [2. Use Cases] - 애플리케이션 업무 규칙
│   ├── CreateMenu/                     # 기능(Feature) 단위로 패키징
│   │   ├── CreateMenuUseCase.java      # 유스케이스 구현체 (Interactor)
│   │   ├── CreateMenuInputData.java    # 입력 데이터 구조 (DS)
│   │   └── CreateMenuOutputData.java   # 출력 데이터 구조 (DS)
│   │
│   └── port/                           # **의존성 역전을 위한 경계(Boundary)**
│       ├── in/                         # Input Boundary (Controller가 호출)
│       │   └── CreateMenuInputBoundary.java
│       └── out/                        # Output Boundary (Gateway/Presenter 인터페이스)
│           ├── MenuRepositoryGateway.java  # 데이터 접근 인터페이스
│           └── MenuPresenter.java          # (Optional) 출력 형식 변환 인터페이스
│
├── adapter/                            # [3. Interface Adapters] - 변환 계층
│   ├── controller/                     # Web -> UseCase 입력 변환
│   │   └── MenuController.java
│   │
│   ├── gateway/                        # UseCase -> DB 출력 변환 (Repository 구현)
│   │   └── MenuRepositoryImpl.java     # MenuRepositoryGateway 구현체
│   │
│   └── presenter/                      # UseCase 결과 -> View 출력 변환
│       └── MenuRestPresenter.java      # JSON 응답 포맷팅
│
└── infrastructure/                     # [4. Frameworks & Drivers] - 가장 바깥쪽 원
    ├── persistence/                    # DB, JPA 세부 구현
    │   ├── JpaMenuRepository.java      # Spring Data JPA 인터페이스
    │   └── MenuJpaEntity.java          # DB 테이블 매핑 객체
    │
    └── config/                         # 프레임워크 설정 (Bean 등록 등)
        └── MenuConfig.java
```

## 3. 계층별 상세 역할

### A. Entities (엔티티)
*   **역할**: 전사적인 핵심 비즈니스 규칙을 캡슐화합니다.
*   **특징**: 외부의 변화(페이지 흐름 변경, 보안 사항 등)에 영향을 받지 않습니다.
*   **구성**: `Menu` 클래스는 메소드를 통해 상태를 변경하며, 데이터 구조(DTO)가 아닌 **행위(Behavior)**를 가집니다.

### B. Use Cases (유스케이스)
*   **역할**: 애플리케이션에 특화된 업무 규칙을 구현합니다.
*   **흐름**:
    1.  입력을 받습니다 (`InputData`).
    2.  비즈니스 규칙을 검증합니다 (`Entity` 사용).
    3.  데이터를 저장하거나 불러옵니다 (`Gateway` 인터페이스 호출).
    4.  결과를 반환합니다 (`OutputData`).
*   **특징**: UI나 DB에 대해 전혀 모릅니다. 오직 `Input Boundary`와 `Output Boundary` 인터페이스에만 의존합니다.

### C. Interface Adapters (인터페이스 어댑터)
*   **역할**: 데이터를 유스케이스와 프레임워크(Web, DB)에 가장 편리한 형태로 변환합니다.
*   **Controller**: HTTP 요청을 `InputData`로 변환하여 유스케이스(`InputBoundary`)를 호출합니다.
*   **Gateway (Repository Impl)**: 도메인 객체를 DB 엔티티(`JpaEntity`)로 변환(Mapping)하여 저장소에 전달합니다.
*   **Presenter**: 유스케이스의 `OutputData`를 받아 화면(View)이나 응답(Response Ref) 모델로 변환합니다.

### D. Frameworks & Drivers (인프라스트럭처)
*   **역할**: 모든 세부 사항(Detail)이 위치합니다. (DB, Web Framework, External System 등)
*   **특징**: 여기있는 코드들은 안쪽 원으로 이어주는 '접착제' 코드 외에는 별다른 로직이 없어야 합니다.

## 4. 데이터 흐름 (Control Flow) vs 의존성 방향 (Dependencies)

*   **제어 흐름 (실행 순서)**:
    `Controller` -> `UseCase` -> `Gateway Impl` -> `DB`
*   **의존성 방향 (소스 코드 import)**:
    `Controller` -> `UseCase` <- `Gateway Impl`
    *(Gateway 구현체는 UseCase가 정의한 인터페이스를 의존(구현)하므로, 의존성 화살표가 역전됨)*

## 5. 구현 로드맵

1.  **엔티티 정의**: `menu.entity.Menu` 작성.
2.  **유스케이스 경계(Boundary) 정의**: `menu.usecase.port` 내의 입출력 인터페이스 정의.
3.  **유스케이스 구현**: `menu.usecase` 패키지에서 비즈니스 로직 작성. (테스트 작성 가능 단계)
4.  **어댑터 작성**:
    *   `menu.adapter.gateway`에서 `MenuRepositoryGateway` 구현.
    *   `menu.adapter.controller`에서 웹 요청 처리.
5.  **인프라 연결**: `menu.infrastructure`에서 JPA 및 실제 DB 연동 설정.
