# 메뉴 관리 시스템 (MSA 전환 대비) - 헥사고날 아키텍처 청사진

이 문서는 **메뉴 관리 시스템**을 향후 MSA(Microservices Architecture) 전환이 용이하도록 **헥사고날 아키텍처(Hexagonal Architecture, Ports and Adapters)** 패턴으로 독립시키는 설계를 다룹니다.

## 1. 핵심 목표
1.  **기술 부채 격리**: 비즈니스 로직(도메인)이 프레임워크(Spring, JPA)나 외부 시스템(DB, UI)에 의존하지 않도록 합니다.
2.  **MSA 준비**: 메뉴 도메인을 다른 도메인(주문, 결제)과 분리하여, 필요 시 별도의 마이크로서비스로 쉽게 떼어낼 수 있는 구조를 만듭니다.
3.  **명확한 경계**: 외부와의 소통은 오직 **포트(Port)**를 통해서만 이루어지며, 구현체는 **어댑터(Adapter)**로 갈아끼울 수 있습니다.

## 2. 패키지 구조 (Directory Structure)

`com.new_cafe.app.backend.menu` 패키지 하위 구조를 제안합니다.

```
menu/
├── adapter/                                # [육각형 외부] 어댑터 계층 (기술적 세부사항)
│   ├── in/                                 # [Driving Adapter] 외부에서 들어오는 요청을 처리
│   │   └── web/
│   │       ├── MenuController.java         # REST API 컨트롤러
│   │       ├── MenuWebModel.java           # API 요청/응답 DTO
│   │       └── MenuWebMapper.java          # DTO <-> Command/DTO 변환
│   │
│   └── out/                                # [Driven Adapter] 내부에서 외부로 나가는 요청 처리
│       └── persistence/
│           ├── MenuJpaEntity.java          # DB 엔티티 (JPA @Entity)
│           ├── MenuPersistenceAdapter.java # Outgoing Port 구현체
│           ├── MenuRepository.java         # Spring Data JPA 레포지토리
│           └── MenuPersistenceMapper.java  # Entity <-> Domain 변환
│
├── application/                            # [육각형 내부] 애플리케이션 계층 (비즈니스 흐름)
│   ├── port/
│   │   ├── in/                             # [Input Port] 외부 -> 내부 (유스케이스)
│   │   │   ├── CreateMenuUseCase.java
│   │   │   ├── GetMenuUseCase.java
│   │   │   └── command/                    # 데이터 운반체 (Command/Query)
│   │   │       ├── CreateMenuCommand.java
│   │   │       └── MenuQuery.java
│   │   │
│   │   └── out/                            # [Output Port] 내부 -> 외부 (인터페이스)
│   │       ├── LoadMenuPort.java
│   │       ├── SaveMenuPort.java
│   │       └── UpdateMenuStatePort.java
│   │
│   └── service/                            # [Service] 유스케이스의 구현체
│       └── MenuService.java                # 도메인 로직 조율 및 트랜잭션 관리
│
└── domain/                                 # [육각형 핵심] 도메인 계층 (순수 비즈니스 로직)
    ├── Menu.java                           # 핵심 도메인 모델 (POJO)
    ├── MenuId.java                         # 식별자 (Value Object)
    ├── Money.java                          # 금액 (Value Object)
    └── MenuStatus.java                     # 상태 (Enum)
```

## 3. 계층별 상세 역할

### A. Domain Layer (핵심)
*   **특징**: 외부 세계를 전혀 모르는 **순수 Java 객체(POJO)**입니다. Spring 어노테이션이나 JPA 어노테이션을 사용하지 **않습니다**.
*   **책임**: 메뉴의 가격 변경, 품절 처리 등 핵심 비즈니스 규칙과 상태 변경 로직을 가집니다.

### B. Application Layer (중재자)
*   **특징**: 도메인 객체를 사용하여 사용자의 요구사항(Use Case)을 처리합니다.
*   **책임**:
    *   **Input Port (UseCase)**: 외부에서 호출 가능한 인터페이스 정의.
    *   **Output Port**: 외부 시스템(DB 등)에 접근하기 위한 인터페이스 정의.
    *   **Service**: Input Port를 구현하며, 도메인 로직을 호출하고, Output Port를 통해 데이터를 저장합니다. **`@Transactional`**이 적용되는 위치입니다.

### C. Adapter Layer (연결자)
*   **특징**: 애플리케이션 계층과 외부 기술(Web, DB)을 연결합니다.
*   **책임**:
    *   **In-Adapter (Web)**: HTTP 요청을 받아 `Command` 객체로 변환 후 UseCase 호출.
    *   **Out-Adapter (Persistence)**: 도메인 객체를 JPA Entity로 변환하여 DB에 저장. 변환(Mapping) 로직이 반드시 포함되어야 합니다.

## 4. MSA 전환 시나리오

1.  **현재 (Monolith)**: `menu` 패키지가 다른 패키지(`order`)와 같은 프로젝트 내에 존재. 메서드 호출로 소통.
2.  **과도기 (Modular Monolith)**: `menu` 모듈을 분리. 다른 모듈은 `menu.application.port.in` 인터페이스만 참조 가능.
3.  **미래 (Microservices)**:
    *   `menu` 패키지를 별도 프로젝트로 분리.
    *   `adapter.in.web` (REST API)이 외부 통신 인터페이스가 됨.
    *   타 서비스와의 통신은 `adapter.out.message` (Kafka 등) 어댑터를 추가하여 처리.
    *   **핵심 도메인 로직은 코드 수정 없이 그대로 이동 가능.**

## 5. 구현 우선순위

1.  **Domain**: `Menu`, `Money` 등 핵심 모델 정의.
2.  **Ports**: `CreateMenuUseCase`(In), `SaveMenuPort`(Out) 인터페이스 정의.
3.  **Adapter (Out)**: `MenuPersistenceAdapter` 구현 (JPA 연결).
4.  **Service**: `MenuService` 구현 (비즈니스 흐름).
5.  **Adapter (In)**: `MenuController` 구현 (API 노출).
