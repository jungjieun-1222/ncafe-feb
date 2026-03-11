package com.new_cafe.app.backend.usermenu.adapter.out.persistence.repository;

import com.new_cafe.app.backend.usermenu.adapter.out.persistence.entity.UserMenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserMenuRepository extends JpaRepository<UserMenuEntity, Long> {

    @Query("SELECT m FROM UserMenuEntity m WHERE " +
           "(:categoryId IS NULL OR m.categoryId = :categoryId) AND " +
           "(:searchQuery IS NULL OR m.korName LIKE %:searchQuery% OR m.engName LIKE %:searchQuery%)")
    List<UserMenuEntity> findAllByCategoryIdAndSearchQuery(
            @Param("categoryId") Integer categoryId, 
            @Param("searchQuery") String searchQuery);
}
