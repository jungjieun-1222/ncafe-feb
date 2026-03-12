export interface MenuOption {
    id: number; // Database ID
    name: string;
    value: string;
    price: number;
}

export interface OptionGroup {
    name: string;
    type: 'radio' | 'checkbox';
    options: MenuOption[];
}

export const AVAILABLE_OPTIONS: Record<string, OptionGroup[]> = {
    '커피&음료': [
        {
            name: '온도',
            type: 'radio',
            options: [
                { id: 9, name: '온도', value: 'HOT', price: 0 },
                { id: 4, name: '온도', value: 'ICE', price: 0 }
            ]
        },
        {
            name: '사이즈',
            type: 'radio',
            options: [
                { id: 7, name: '사이즈', value: 'Regular', price: 0 },
                { id: 8, name: '사이즈', value: 'Large', price: 1000 }
            ]
        },
        {
            name: '추가 선택',
            type: 'checkbox',
            options: [
                { id: 1, name: '추가 선택', value: '샷 추가', price: 500 },
                { id: 2, name: '추가 선택', value: '휘핑 추가', price: 500 },
                { id: 3, name: '추가 선택', value: '시럽 추가', price: 500 }
            ]
        }
    ],
    '전통차': [
        {
            name: '온도',
            type: 'radio',
            options: [
                { id: 9, name: '온도', value: 'HOT', price: 0 },
                { id: 4, name: '온도', value: 'ICE', price: 0 }
            ]
        },
        {
            name: '사이즈',
            type: 'radio',
            options: [
                { id: 7, name: '사이즈', value: 'Regular', price: 0 },
                { id: 8, name: '사이즈', value: 'Large', price: 1000 }
            ]
        }
    ],
    '에이드&스무디': [
        {
            name: '사이즈',
            type: 'radio',
            options: [
                { id: 7, name: '사이즈', value: 'Regular', price: 0 },
                { id: 8, name: '사이즈', value: 'Large', price: 1000 }
            ]
        }
    ],
    '디저트': [
        {
            name: '포장 선택',
            type: 'radio',
            options: [
                { id: 5, name: '포장 선택', value: '매장 취식', price: 0 },
                { id: 6, name: '포장 선택', value: '박스 포장', price: 500 }
            ]
        }
    ]
};

export const getOptionsByCategory = (categoryName: string): OptionGroup[] => {
    return AVAILABLE_OPTIONS[categoryName] || [];
};
