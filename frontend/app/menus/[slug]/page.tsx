'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { getImageUrl } from '@/utils/image';
import { getOptionsByCategory, MenuOption, OptionGroup } from '@/app/cart/_constants/menuOptions';
import styles from './page.module.css';

interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    slug: string;
    description: string;
    price: number;
    categoryName: string;
    imageSrc: string;
    isAvailable: boolean;
    allergyInfo?: string;
    options: MenuOption[];
}

export default function MenuDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { openCart, triggerRefresh } = useCartStore();
    
    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    // Selection state
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
    const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);

    // Load menu and relevant options
    useEffect(() => {
        const fetchMenuDetail = async () => {
            try {
                const res = await fetch(`/api/menus/${slug}`);
                if (!res.ok) throw new Error('Menu not found');
                const data = await res.json();
                setMenu(data);
                
                // Group dynamic options by name
                const options = data.options || [];
                const groupsMap: Record<string, MenuOption[]> = {};
                options.forEach((opt: MenuOption) => {
                    if (!groupsMap[opt.name]) groupsMap[opt.name] = [];
                    groupsMap[opt.name].push(opt);
                });

                const dynamicGroups: OptionGroup[] = Object.keys(groupsMap).map(name => ({
                    name,
                    type: 'radio', // Default to radio for now
                    options: groupsMap[name]
                }));

                // Fallback to pre-defined options only if no dynamic options exist
                const finalGroups = dynamicGroups.length > 0 
                    ? dynamicGroups 
                    : getOptionsByCategory(data.categoryName);
                
                setOptionGroups(finalGroups);
                
                // Initial selection: pick first radio of each group
                const initial = finalGroups
                    .filter((g: OptionGroup) => g.type === 'radio')
                    .map((g: OptionGroup) => g.options[0]);
                setSelectedOptions(initial);

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        if (slug) fetchMenuDetail();
    }, [slug]);

    const handleSelectOption = (group: OptionGroup, opt: MenuOption) => {
        if (group.type === 'radio') {
            setSelectedOptions((prev: MenuOption[]) => {
                const filtered = prev.filter(p => !group.options.some(o => o.id === p.id));
                return [...filtered, opt];
            });
        } else {
            setSelectedOptions((prev: MenuOption[]) => {
                const isSelected = prev.some(p => p.id === opt.id);
                if (isSelected) {
                    return prev.filter(p => p.id !== opt.id);
                } else {
                    return [...prev, opt];
                }
            });
        }
    };

    const isSelected = (optId: number) => selectedOptions.some((p: MenuOption) => p.id === optId);

    const calculateTotalPrice = () => {
        if (!menu) return 0;
        const optionsTotal = selectedOptions.reduce((acc: number, opt: MenuOption) => acc + opt.price, 0);
        return (menu.price + optionsTotal) * quantity;
    };

    const handleAddToCart = async () => {
        if (!menu) return;
        
        // Validation: Mandatory options (Radio groups usually mandatory in this logic)
        const mandatoryGroups = optionGroups.filter((g: OptionGroup) => g.type === 'radio');
        const allMandatorySelected = mandatoryGroups.every((g: OptionGroup) => 
            selectedOptions.some((s: MenuOption) => g.options.some((o: MenuOption) => o.id === s.id))
        );

        if (!allMandatorySelected) {
            alert('필수 옵션을 선택해주세요.');
            return;
        }

        setIsAdding(true);
        try {
            let cartId = localStorage.getItem('cartId');
            if (!cartId) {
                cartId = 'guest_' + Date.now().toString();
                localStorage.setItem('cartId', cartId);
            }

            const res = await fetch(`/api/v1/carts/${cartId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuId: menu.id,
                    quantity: quantity,
                    optionIds: selectedOptions.map((o: MenuOption) => o.id)
                })
            });

            if (!res.ok) throw new Error('Failed to add cart');

            triggerRefresh(); // Update cart drawer
            openCart();      // Open cart drawer
        } catch (err) {
            console.error(err);
            alert('장바구니 담기에 실패했습니다.');
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) return <div className={styles.loading}>명작을 불러오는 중...</div>;
    if (!menu) return <div className={styles.error}>해당 메뉴를 찾을 수 없습니다.</div>;

    const totalPrice = calculateTotalPrice();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ChevronLeft size={24} /> 차림표로 돌아가기
                </button>

                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        <div className={styles.mainImageWrapper}>
                            <img
                                src={getImageUrl(menu.imageSrc)}
                                alt={menu.korName}
                                className={styles.mainImage}
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = '/images/blank.png'; }}
                            />
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.badgeGroup}>
                            <div className={styles.badge}>{menu.categoryName}</div>
                            {!menu.isAvailable && <div className={styles.soldOutBadge}>SOLD OUT</div>}
                        </div>
                        
                        <h1 className={styles.title}>{menu.korName}</h1>
                        <p className={styles.engName}>{menu.engName}</p>
                        
                        <p className={styles.description}>{menu.description}</p>
                        
                        <div className={styles.divider}></div>

                        <div className={styles.optionsSection}>
                            {optionGroups.map((group, gIdx) => (
                                <div key={gIdx} className={styles.optionGroup}>
                                    <div className={styles.groupLabel}>
                                        {group.name} {group.type === 'radio' && <span className={styles.requiredTag}>* 필수</span>}
                                    </div>
                                    <div className={styles.optionList}>
                                        {group.options.map((opt) => (
                                            <button
                                                key={opt.id}
                                                className={`${styles.optionButton} ${isSelected(opt.id) ? styles.selectedOption : ''}`}
                                                onClick={() => handleSelectOption(group, opt)}
                                            >
                                                <span className={styles.optionValue}>{opt.value}</span>
                                                {opt.price > 0 && (
                                                    <span className={styles.optionPrice}>+{opt.price.toLocaleString()}원</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.quantitySection}>
                            <span className={styles.quantityLabel}>수량</span>
                            <div className={styles.quantityControls}>
                                <button 
                                    className={styles.qBtn}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className={styles.qValue}>{quantity}</span>
                                <button 
                                    className={styles.qBtn}
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className={styles.bottomBar}>
                <div className={styles.bottomBarContent}>
                    <div className={styles.totalPriceInfo}>
                        <div className={styles.totalLabel}>주문 금액 합계</div>
                        <div className={styles.totalValue}>{totalPrice.toLocaleString()}원</div>
                    </div>
                    
                    <button 
                        className={styles.cartBtn}
                        onClick={handleAddToCart}
                        disabled={isAdding || !menu.isAvailable}
                    >
                        <ShoppingCart size={20} />
                        {isAdding ? '담는 중...' : '장바구니 담기'}
                    </button>
                    
                    <button 
                        className={styles.orderBtn}
                        onClick={() => alert('바로 주문 기능은 준비 중입니다.')}
                        disabled={!menu.isAvailable}
                    >
                        바로 주문
                    </button>
                </div>
            </footer>
        </div>
    );
}
