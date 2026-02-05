'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Menu } from '@/types/menu';
import styles from './MenuForm.module.css';
import Button from '@/components/common/Button/Button';
import { categories } from '@/mocks/menuData';
import { useRouter } from 'next/navigation';

interface MenuFormProps {
    initialData?: Menu;
    mode: 'create' | 'edit';
}

interface OptionItemValue {
    name: string;
    priceDelta: number;
}

interface OptionValue {
    name: string;
    type: 'radio' | 'checkbox';
    required: boolean;
    items: OptionItemValue[];
}

interface FormValues {
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryId: string;
    isSoldOut: boolean;
    options: OptionValue[];
    // images: File[] | string[] - For simplicity in this prototype, we'll just handle it visually
}

export default function MenuForm({ initialData, mode }: MenuFormProps) {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            korName: initialData?.korName || '',
            engName: initialData?.engName || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            categoryId: initialData?.category?.id || categories[0].id,
            isSoldOut: initialData?.isSoldOut || false,
            options: initialData?.options?.map(opt => ({
                name: opt.name,
                type: opt.type,
                required: opt.required,
                items: opt.items.map(item => ({ name: item.name, priceDelta: item.priceDelta }))
            })) || []
        }
    });

    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: "options"
    });

    // Helper component for nested array (Items within Option)
    // Since useFieldArray needs to be used at the top level or in a custom component
    // We will inline the item logic or just use a simple list management if simpler, 
    // but nesting useFieldArray is cleaner. Here we'll wrap it in a sub-component.

    const onSubmit = (data: FormValues) => {
        console.log('Form Submitted:', data);
        if (mode === 'edit' && initialData) {
            router.push(`/admin/menus/${initialData.id}`);
        } else {
            router.push('/admin/menus');
        }
        router.refresh();
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
                        <select {...register('categoryId')} className={styles.select}>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.korName}</option>
                            ))}
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

            {/* 이미지 업로드 (Mock) */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>이미지</h2>
                </div>
                <div className={styles.imageUploadArea}>
                    <p style={{ color: 'var(--color-gray-500)' }}>이미지를 드래그하거나 클릭하여 업로드하세요</p>
                </div>
                <div className={styles.previewList}>
                    {/* Mock Image Preview - In real app, visual feedback of upload */}
                    {initialData?.images?.map((img) => (
                        <div key={img.id} className={styles.previewItem}>
                            <img src={img.url} className={styles.previewImg} alt="preview" />
                            <button type="button" className={styles.previewRemove}>×</button>
                        </div>
                    ))}
                    {initialData ? null : (
                        <div style={{ padding: '20px', color: '#ccc', width: '100%', textAlign: 'center' }}>
                            (이미지 미리보기 영역)
                        </div>
                    )}
                </div>
            </section>

            {/* 설정 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>설정</h2>
                </div>
                <div className={styles.row}>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            {...register('isSoldOut')}
                        />
                        <span className={styles.label}>품절 처리 (체크 시 판매 중단)</span>
                    </label>
                </div>
            </section>

            {/* 옵션 관리 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>옵션 관리 ({optionFields.length})</h2>
                    <Button type="button" size="sm" variant="secondary" onClick={() => appendOption({ name: '', type: 'radio', required: false, items: [] })}>
                        + 옵션 그룹 추가
                    </Button>
                </div>

                <div className={styles.optionList}>
                    {optionFields.map((field, index) => (
                        <div key={field.id} className={styles.optionCard}>
                            <div className={styles.optionHeader}>
                                <div className={styles.optionInfo}>
                                    <div className={styles.col} style={{ flex: 2 }}>
                                        <label className={styles.label}>옵션 그룹명</label>
                                        <input
                                            {...register(`options.${index}.name` as const, { required: true })}
                                            className={styles.input}
                                            placeholder="예: 사이즈, 샷 추가"
                                        />
                                    </div>
                                    <div className={styles.col}>
                                        <label className={styles.label}>선택 방식</label>
                                        <select {...register(`options.${index}.type` as const)} className={styles.select}>
                                            <option value="radio">단일 선택 (Radio)</option>
                                            <option value="checkbox">다중 선택 (Checkbox)</option>
                                        </select>
                                    </div>
                                    <div className={styles.col} style={{ justifyContent: 'flex-end', paddingBottom: '10px' }}>
                                        <label className={styles.checkbox}>
                                            <input
                                                type="checkbox"
                                                {...register(`options.${index}.required` as const)}
                                            />
                                            <span className={styles.label}>필수 선택</span>
                                        </label>
                                    </div>
                                </div>
                                <button type="button" className={styles.removeBtn} onClick={() => removeOption(index)}>
                                    그룹 삭제
                                </button>
                            </div>

                            <div className={styles.itemsList}>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-2)' }}>옵션 항목들</div>
                                <OptionItemsField nestIndex={index} control={control} register={register} />
                            </div>
                        </div>
                    ))}
                    {optionFields.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-gray-500)' }}>
                            등록된 옵션이 없습니다.
                        </div>
                    )}
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

// Sub-component for managing items within an option
function OptionItemsField({ nestIndex, control, register }: any) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `options.${nestIndex}.items`
    });

    return (
        <div>
            {fields.map((item, k) => (
                <div key={item.id} className={styles.itemRow}>
                    <input
                        {...register(`options.${nestIndex}.items.${k}.name` as const, { required: true })}
                        className={styles.input}
                        placeholder="항목명 (예: Large)"
                        style={{ flex: 2, padding: '8px' }}
                    />
                    <input
                        type="number"
                        {...register(`options.${nestIndex}.items.${k}.priceDelta` as const)}
                        className={styles.input}
                        placeholder="추가 가격 (0)"
                        style={{ flex: 1, padding: '8px' }}
                    />
                    <button type="button" className={styles.removeBtn} onClick={() => remove(k)}>삭제</button>
                </div>
            ))}
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => append({ name: '', priceDelta: 0 })}
                style={{ marginTop: '8px', fontSize: '12px' }}
            >
                + 항목 추가
            </Button>
        </div>
    );
}
