package com.new_cafe.app.backend.repository;

import java.util.List;
import java.util.Optional;

import com.new_cafe.app.backend.entity.Menu;

/**
 * 데이터 저장소(DB나 메모리)에 접근하기 위한 명세서(약속)
 */
public interface MenuRepository {
    List<Menu> findAll(); // "모든 메뉴 다 가져와!" (전체 목록 조회)

    List<Menu> findAllByName(String name); // "이름에 '아메리카노' 들어간 거 다 가져와!" (이름 검색)

    List<Menu> findAllByCategoryId(Integer categoryId); // "카테고리 ID가 1번인 것만 가져와!" (카테고리별 조회)

    List<Menu> findAllByCategoryIdAndSearchQuery(Integer categoryId, String searchQuery);

    Optional<Menu> findById(Long id);

}
