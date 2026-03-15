// Menu 인터페이스
export interface Menu {
    id: string;
    korName: string;
    engName: string;
    description: string;
    price: number;
    category: MenuCategory;
    images: MenuImage[];
    isAvailable: boolean;
    isSoldOut: boolean;
    sortOrder: number;
    options: MenuOption[];
    curationTags?: string[];
    slug?: string;
    altText?: string;
    costPrice?: number;
    adminMemo?: string;
    createdAt: Date;
    updatedAt: Date;
}

// 메뉴 이미지
export interface MenuImage {
    id: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
}

// 메뉴 옵션
export interface MenuOption {
    id: string;
    name: string;
    type: 'radio' | 'checkbox';
    required: boolean;
    items: OptionItem[];
}

// 옵션 항목
export interface OptionItem {
    id: string;
    name: string;
    priceDelta: number;
}

// 메뉴 카테고리
export interface MenuCategory {
    id: string;
    korName: string;
    engName: string;
    icon?: string;
    sortOrder: number;
}
