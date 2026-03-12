'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Menu } from '@/types/menu';
import styles from './MenuForm.module.css';
import Button from '@/components/common/Button/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface MenuFormProps {
    initialData?: Menu;
    mode: 'create' | 'edit';
}

interface Category {
    id: number;
    name: string;
}

interface FormValues {
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryId: number;
    isAvailable: boolean;
    costPrice?: number;
    adminMemo?: string;
    altText?: string;
    imageSrc?: string;
}

export default function MenuForm({ initialData, mode }: MenuFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            korName: initialData?.korName || '',
            engName: initialData?.engName || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            categoryId: initialData?.category?.id ? Number(initialData.category.id) : 1,
            isAvailable: initialData?.isAvailable ?? true,
            costPrice: (initialData as any)?.costPrice || 0,
            adminMemo: (initialData as any)?.adminMemo || '',
            altText: (initialData as any)?.altText || '',
            imageSrc: (initialData as any)?.imageSrc || initialData?.images?.[0]?.url || ''
        }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories');
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error('Category fetch error:', error);
                toast.error('카테고리를 불러오는데 실패했습니다.');
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const onSubmit = async (data: FormValues) => {
        try {
            const url = mode === 'create' 
                ? '/api/admin/menus' 
                : `/api/admin/menus/${initialData?.id}`;
            
            const method = mode === 'create' ? 'POST' : 'PUT';

            const payload = {
                ...data,
                price: Number(data.price),
                categoryId: Number(data.categoryId),
                costPrice: data.costPrice ? Number(data.costPrice) : null,
                isAvailable: String(data.isAvailable) === 'true' // Select value is string
            };

            const formData = new FormData();
            formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const res = await fetch(url, {
                method,
                body: formData,
            });

            if (!res.ok) throw new Error('저장 실패');

            toast.success(mode === 'create' ? '메뉴가 등록되었습니다.' : '메뉴 정보가 수정되었습니다.');
            
            if (mode === 'edit') {
                router.push(`/admin/menus`);
            } else {
                router.push('/admin/menus');
            }
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* 기본 정보 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>기본 정보</h2>
                </div>

                <div className={styles.row}>
                    <div className={styles.col}>
                        <label className={styles.label}>메뉴명 (한글) <span style={{ color: 'red' }}>*</span></label>
                        <input
                            {...register('korName', { required: '한글 메뉴명을 입력해주세요' })}
                            className={styles.input}
                            placeholder="예: 아메리카노"
                        />
                        {errors.korName && <span className={styles.error}>{errors.korName.message}</span>}
                    </div>
                    <div className={styles.col}>
                        <label className={styles.label}>메뉴명 (영문)</label>
                        <input
                            {...register('engName')}
                            className={styles.input}
                            placeholder="예: Americano"
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.col}>
                        <label className={styles.label}>카테고리</label>
                        <select {...register('categoryId')} className={styles.select} disabled={isLoadingCategories}>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                            {categories.length === 0 && <option value="1">전통차</option>}
                        </select>
                    </div>
                    <div className={styles.col}>
                        <label className={styles.label}>가격 (원) <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            {...register('price', { required: '가격을 입력해주세요', min: 0 })}
                            className={styles.input}
                            placeholder="0"
                        />
                        {errors.price && <span className={styles.error}>{errors.price.message}</span>}
                    </div>
                </div>

                <div className={styles.col}>
                    <label className={styles.label}>설명</label>
                    <textarea
                        {...register('description')}
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder="메뉴에 대한 설명을 입력해주세요."
                    />
                </div>
            </section>

            {/* 관리자 정보 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>관리 정보</h2>
                </div>
                <div className={styles.row}>
                    <div className={styles.col}>
                        <label className={styles.label}>원가 (Optional)</label>
                        <input
                            type="number"
                            {...register('costPrice', { min: 0 })}
                            className={styles.input}
                            placeholder="0"
                        />
                    </div>
                    <div className={styles.col}>
                        <label className={styles.label}>판매 상태</label>
                        <select {...register('isAvailable')} className={styles.select}>
                            <option value="true">판매 중</option>
                            <option value="false">품절/숨김</option>
                        </select>
                    </div>
                </div>
                <div className={styles.col}>
                    <label className={styles.label}>관리자 메모</label>
                    <input
                        {...register('adminMemo')}
                        className={styles.input}
                        placeholder="내부 관리용 메모"
                    />
                </div>
            </section>

            {/* 이미지 정보 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>이미지 설정</h2>
                </div>
                <div className={styles.row}>
                    <div className={styles.col}>
                        <label className={styles.label}>대표 이미지 업로드</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles.input}
                        />
                        <input type="hidden" {...register('imageSrc')} />
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                        </p>
                    </div>
                    <div className={styles.col}>
                        <label className={styles.label}>이미지 설명 (Alt Text)</label>
                        <input
                            {...register('altText')}
                            className={styles.input}
                            placeholder="이미지 보조 설명"
                        />
                    </div>
                </div>
                
                <div className={styles.previewContainer} style={{ marginTop: '15px' }}>
                    <p className={styles.label} style={{ marginBottom: '8px' }}>이미지 미리보기</p>
                    <div style={{ width: '120px', height: '120px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                        <img 
                            src={previewUrl || watch('imageSrc') || initialData?.imageSrc || '/images/blank.png'} 
                            alt="preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => (e.currentTarget.src = '/images/blank.png')}
                        />
                    </div>
                </div>
            </section>

            <div className={styles.actions}>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    취소
                </Button>
                <Button type="submit">
                    {mode === 'create' ? '메뉴 등록' : '수정 저장'}
                </Button>
            </div>
        </form>
    );
}
