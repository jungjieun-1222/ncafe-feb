import { useState, useEffect } from "react";

export default function CategoryList({ onCategoryChange }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/admin/categories');
            const data = await response.json();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const clickHandler = (categoryId) => {
        console.log("handler execute: ", categoryId);
        if (onCategoryChange) {
            onCategoryChange(categoryId);
        }
    };

    return (
        <section>
            <h1>카테고리 블록</h1>
            <div>
                <button onClick={() => clickHandler(null)}>전체</button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => clickHandler(category.id)}
                    >
                        {category.korName || category.name}
                    </button>
                ))}
            </div>
        </section>
    );
}
