'use client';

import { Search } from 'lucide-react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchInput({
    value,
    onChange,
    placeholder = '메뉴 검색...'
}: SearchInputProps) {
    return (
        <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
                type="text"
                placeholder={placeholder}
                className={styles.searchInput}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
