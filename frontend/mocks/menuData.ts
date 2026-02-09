import { Menu, MenuCategory } from '@/types/menu';

// 기본 카테고리 목록
export const categories: MenuCategory[] = [
    { id: '1', korName: '커피', engName: 'Coffee', icon: 'coffee', sortOrder: 1 },
    { id: '2', korName: '음료', engName: 'Beverage', icon: 'cup-soda', sortOrder: 2 },
    { id: '3', korName: '티', engName: 'Tea', icon: 'leaf', sortOrder: 3 },
    { id: '4', korName: '디저트', engName: 'Dessert', icon: 'cake', sortOrder: 4 },
    { id: '5', korName: '베이커리', engName: 'Bakery', icon: 'croissant', sortOrder: 5 },
];

// 기본 메뉴 목록 (목업 데이터) - AI 생성 이미지 적용
export const menus: Menu[] = [
    {
        id: '1',
        korName: '아메리카노',
        engName: 'Americano',
        description: '깊고 진한 에스프레소에 물을 더해 깔끔하게 즐기는 coffee',
        price: 4500,
        category: categories[0],
        images: [
            { id: '1-1', url: '/images/menu/americano.jpg', altText: '따뜻한 아메리카노 이미지', isPrimary: true, sortOrder: 1 },
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [
            {
                id: 'opt-temp',
                name: '온도',
                type: 'radio',
                required: true,
                items: [
                    { id: 'temp-hot', name: 'HOT', priceDelta: 0 },
                    { id: 'temp-ice', name: 'ICE', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-size',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    { id: 'size-r', name: 'Regular', priceDelta: 0 },
                    { id: 'size-l', name: 'Large', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-shot',
                name: '추가 선택',
                type: 'checkbox',
                required: false,
                items: [
                    { id: 'shot-add', name: '에스프레소 샷 추가', priceDelta: 500 },
                    { id: 'syrup-add', name: '헤이즐넛 시럽 추가', priceDelta: 500 },
                ],
            },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '2',
        korName: '카페라떼',
        engName: 'Cafe Latte',
        description: '부드러운 우유와 에스프레소의 완벽한 조화',
        price: 5000,
        category: categories[0],
        images: [
            { id: '2-1', url: '/images/menu/latte.jpg', altText: '부드러운 카페라떼 이미지', isPrimary: true, sortOrder: 1 },
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        options: [
            {
                id: 'opt-temp-2',
                name: '온도',
                type: 'radio',
                required: true,
                items: [
                    { id: 'temp-hot-2', name: 'HOT', priceDelta: 0 },
                    { id: 'temp-ice-2', name: 'ICE', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-size-2',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    { id: 'size-r-2', name: 'Regular', priceDelta: 0 },
                    { id: 'size-l-2', name: 'Large', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-shot-2',
                name: '추가 선택',
                type: 'checkbox',
                required: false,
                items: [
                    { id: 'shot-add-2', name: '에스프레소 샷 추가', priceDelta: 500 },
                    { id: 'syrup-vanilla', name: '바닐라 시럽 추가', priceDelta: 500 },
                ],
            },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '3',
        korName: '카페모카',
        engName: 'Cafe Mocha',
        description: '달콤한 초콜릿과 에스프레소, 우유의 풍미가 어우러진 음료',
        price: 5500,
        category: categories[0],
        images: [
            { id: '3-1', url: '/images/menu/latte.jpg', isPrimary: true, sortOrder: 1 }, /* 임시 */
        ],
        isAvailable: true,
        isSoldOut: true,
        sortOrder: 3,
        options: [
            {
                id: 'opt-temp-3',
                name: '온도',
                type: 'radio',
                required: true,
                items: [
                    { id: 'temp-hot-3', name: 'HOT', priceDelta: 0 },
                    { id: 'temp-ice-3', name: 'ICE', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-size-3',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    { id: 'size-r-3', name: 'Regular', priceDelta: 0 },
                    { id: 'size-l-3', name: 'Large', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-shot-3',
                name: '추가 선택',
                type: 'checkbox',
                required: false,
                items: [
                    { id: 'shot-add-3', name: '에스프레소 샷 추가', priceDelta: 500 },
                    { id: 'whipping-more', name: '휘핑크림 많이', priceDelta: 0 },
                ],
            },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '4',
        korName: '바닐라라떼',
        engName: 'Vanilla Latte',
        description: '바닐라 시럽과 에스프레소, 우유의 달콤한 조화',
        price: 5500,
        category: categories[0],
        images: [
            { id: '4-1', url: '/images/menu/latte.jpg', isPrimary: true, sortOrder: 1 }, /* 임시 */
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 4,
        options: [
            {
                id: 'opt-temp-4',
                name: '온도',
                type: 'radio',
                required: true,
                items: [
                    { id: 'temp-hot-4', name: 'HOT', priceDelta: 0 },
                    { id: 'temp-ice-4', name: 'ICE', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-size-4',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    { id: 'size-r-4', name: 'Regular', priceDelta: 0 },
                    { id: 'size-l-4', name: 'Large', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-shot-4',
                name: '추가 선택',
                type: 'checkbox',
                required: false,
                items: [
                    { id: 'shot-add-4', name: '에스프레소 샷 추가', priceDelta: 500 },
                ],
            },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '5',
        korName: '레몬에이드',
        engName: 'Lemonade',
        description: '상큼한 레몬과 탄산수의 청량한 만남',
        price: 5000,
        category: categories[1],
        images: [
            { id: '5-1', url: '/images/menu/lemonade.jpg', isPrimary: true, sortOrder: 1 },
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [
            {
                id: 'opt-size-5',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    { id: 'size-r-5', name: 'Regular', priceDelta: 0 },
                    { id: 'size-l-5', name: 'Large', priceDelta: 500 },
                ],
            },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '6',
        korName: '자몽에이드',
        engName: 'Grapefruit Ade',
        description: '새콤달콤한 자몽과 탄산수의 상쾌한 조합',
        price: 5500,
        category: categories[1],
        images: [
            { id: '6-1', url: '/images/menu/lemonade.jpg', isPrimary: true, sortOrder: 1 }, /* 임시 */
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        options: [
            {
                id: 'opt-size-6',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    { id: 'size-r-6', name: 'Regular', priceDelta: 0 },
                    { id: 'size-l-6', name: 'Large', priceDelta: 500 },
                ],
            },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '7',
        korName: '얼그레이',
        engName: 'Earl Grey',
        description: '베르가못 향이 은은하게 퍼지는 클래식 홍차',
        price: 4500,
        category: categories[2],
        images: [
            { id: '7-1', url: 'https://placehold.co/600x600/689F38/FFF?text=Earl+Grey', isPrimary: true, sortOrder: 1 },
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [
            {
                id: 'opt-temp-7',
                name: '온도',
                type: 'radio',
                required: true,
                items: [
                    { id: 'temp-hot-7', name: 'HOT', priceDelta: 0 },
                    { id: 'temp-ice-7', name: 'ICE', priceDelta: 500 },
                ],
            },
            {
                id: 'opt-size-7',
                name: '사이즈',
                type: 'radio',
                required: true,
                items: [
                    { id: 'size-r-7', name: 'Regular', priceDelta: 0 },
                    { id: 'size-l-7', name: 'Large', priceDelta: 500 },
                ],
            },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '8',
        korName: '티라미수',
        engName: 'Tiramisu',
        description: '에스프레소에 적신 레이디핑거와 마스카포네 크림',
        price: 7000,
        category: categories[3],
        images: [
            { id: '8-1', url: 'https://placehold.co/600x600/795548/FFF?text=Tiramisu', isPrimary: true, sortOrder: 1 },
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
    {
        id: '9',
        korName: '크로와상',
        engName: 'Croissant',
        description: '버터 향 가득한 바삭한 페이스트리',
        price: 4000,
        category: categories[4],
        images: [
            { id: '9-1', url: 'https://placehold.co/600x600/FFB74D/FFF?text=Croissant', isPrimary: true, sortOrder: 1 },
        ],
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        options: [],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
    },
];
