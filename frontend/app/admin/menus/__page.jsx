'use client';

import { useEffect } from "react";
import { useState } from "react";
import CategoryList from "./CategoryList";
import MenuList from "./_components/MenuList/MenuList";

// 1. 단순화된 카드 컴포넌트 (데이터 출력에 집중)
export default function MenusPage() {

    // const today = new Date().toLocaleDateString();
    //fetch menus
    const [menus, setMenus] = useState([]);
    const [categoryId, setCategoryId] = useState(null);

    console.log('MenusPage');

    useEffect(() => {
        // http://localhost:8080/admin/menus
        const fetchMenus = async () => {
            const url = new URL('http://localhost:8080/admin/menus');
            const params = url.searchParams;
            if (categoryId) {
                params.set('cid', categoryId);
            }

            const response = await fetch(url);
            const data = await response.json();
            setMenus(data);
        };

        fetchMenus();
    }, [categoryId]);

    const handleCategoryChange = (categoryId) => {
        console.log("selected category id: ", categoryId);
        setCategoryId(categoryId);
        // 여기서 메뉴 필터링 등의 로직을 처리할 수 있습니다.
    };

    return (
        <main>
            <CategoryList onCategoryChange={handleCategoryChange} />

            <h1>메뉴목록</h1>
            <div>
                {menus.map(menu => (
                    <div key={menu.id}>
                        <h2>{menu.korName}</h2>
                        <p>{menu.engName}</p>
                        <p>{menu.description}</p>
                        <p>{menu.price}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}