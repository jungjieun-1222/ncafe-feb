# 메뉴 관리 시스템 - 클린 아키텍처 리팩토링 청사진

이 문서는 메뉴 관리 시스템(Menu Management System)을 클린 아키텍처 원칙에 따라 리팩토링하기 위한 계획을 설명합니다.

## 1. 목표
UI(프레젠테이션) 계층과 데이터 가져오기(인프라스트럭처), 비즈니스 로직(도메인) 계층을 분리하여 유지보수성, 테스트 용이성, scalability(확장성)을 향상시키는 것이 목표입니다.

## 2. 제안하는 디렉토리 구조

`frontend/features/menu` 내에 기능 기반 구조(Feature-based structure)를 도입할 예정입니다.

```
frontend/
└── features/
    └── menu/
        ├── domain/                 # 1. 엔터프라이즈 비즈니스 규칙 (순수 JS/TS)
        │   ├── entities/           #    - Menu, Category (핵심 데이터 모델)
        │   ├── repositories/       #    - IMenuRepository (인터페이스 정의)
        │   └── usecases/           #    - GetMenusUseCase, CreateMenuUseCase (비즈니스 로직)
        │
        ├── data/                   # 2. 인터페이스 어댑터 (프레임워크 독립적)
        │   ├── repositories/       #    - MenuRepositoryImpl (IMenuRepository 구현체)
        │   ├── sources/            #    - MenuApiDataSource (Axios/Fetch 호출)
        │   └── dtos/               #    - MenuResponseDto (API 응답 형태)
        │
        └── presentation/           # 3. 프레임워크 & 드라이버 (React UI)
            ├── components/         #    - MenuList, MenuCard (화면 표시용 컴포넌트)
            ├── view-models/        #    - useMenuViewModel (상태 관리 Hook)
            └── pages/              #    - Next.js Pages (라우트 핸들러)
```

## 3. 구현 세부 사항

### A. 도메인 계층 (Domain Layer - 핵심)
*순수 TypeScript로 작성되며, React나 API 호출에 의존하지 않습니다.*

**엔티티 (`Menu.ts`)**
```typescript
interface Menu {
  id: string;
  name: string;
  price: number;
  isSoldOut: boolean;
  // ... 필요한 경우 비즈니스 로직 메서드 추가
}
```

**레포지토리 인터페이스 (`IMenuRepository.ts`)**
```typescript
interface IMenuRepository {
  getMenus(filter: MenuFilter): Promise<Menu[]>; // 메뉴 목록 조회
  save(menu: Menu): Promise<void>; // 메뉴 저장
}
```

**유스케이스 (`GetMenus.ts`)**
```typescript
class GetMenus {
  constructor(private repo: IMenuRepository) {}

  async execute(filter: MenuFilter): Promise<Menu[]> {
    return this.repo.getMenus(filter);
  }
}
```

### B. 데이터 계층 (Data Layer - 연결)
*도메인 계층과 외부 세계(API)를 연결합니다.*

**DTO (`MenuDto.ts`)**
```typescript
// 서버로부터 받는 JSON 응답 형태와 정확히 일치해야 함
interface MenuDto {
  id: number;
  korName: string;
  price: number;
  // ...
}
```

**레포지토리 구현 (`MenuRepositoryImpl.ts`)**
```typescript
class MenuRepositoryImpl implements IMenuRepository {
  async getMenus(filter): Promise<Menu[]> {
    const dtos = await fetch('/api/menus'); // 인프라스트럭처 호출 (실제 API)
    return dtos.map(dto => this.mapToEntity(dto)); // DTO를 깨끗한 Entity로 변환하여 반환
  }
}
```

### C. 프레젠테이션 계층 (Presentation Layer - UI)
*React 컴포넌트와 커스텀 Hook.*

**뷰 모델 (`useMenuViewModel.ts`)**
```typescript
export function useMenuViewModel(getMenusUseCase: GetMenus) {
  const [menus, setMenus] = useState<Menu[]>([]);
  
  const loadMenus = async () => {
    // 유스케이스를 실행하여 데이터를 가져옴 (비즈니스 로직 호출)
    const data = await getMenusUseCase.execute(...);
    setMenus(data);
  };

  return { menus, loadMenus };
}
```

## 4. 마이그레이션 단계

1.  **도메인 엔티티 정의**: UI에서 사용하고자 하는 이상적인 `Menu` 타입을 정의합니다.
2.  **레포지토리 인터페이스 생성**: 데이터를 '어떻게' 가져올지가 아니라 '무엇을' 필요로 하는지 정의합니다.
3.  **데이터 계층 구현**: `useMenus.ts`에 있던 `fetch` 로직을 `MenuRepositoryImpl.ts`로 이동시킵니다.
4.  **유스케이스 생성**: 비즈니스 로직(예: 품절 상품 필터링 등)을 캡슐화합니다.
5.  **Hooks 리팩토링**: `useMenus.ts`가 직접 `fetch`하는 대신 유스케이스를 사용하도록 변경합니다.
6.  **컴포넌트 업데이트**: UI 컴포넌트가 새로운 Hook/ViewModel을 바라보도록 수정합니다.

## 5. 기대 효과

*   **테스트 용이성**: 백엔드 없이 `IMenuRepository`를 Mokcing(모의 객체)하여 유스케이스만 독립적으로 테스트할 수 있습니다.
*   **유연성**: API 엔드포인트나 응답 구조가 바뀌어도 `Data` 계층만 수정하면 됩니다. UI와 비즈니스 로직은 안전하게 보호됩니다.
*   **명확성**: 비즈니스 규칙이 `useEffect` 안에 숨겨져 있지 않고, 유스케이스(`Use Case`)로 명시되어 있어 코드를 이해하기 쉽습니다.
