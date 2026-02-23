package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.repository;

import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.entity.AdminMenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminMenuRepository extends JpaRepository<AdminMenuEntity, Long> {
    
    @Query("SELECT m FROM AdminMenuEntity m WHERE " +
           "(:categoryId IS NULL OR m.categoryId = :categoryId) AND " +
           "(:searchQuery IS NULL OR m.korName LIKE %:searchQuery% OR m.engName LIKE %:searchQuery%)")
    List<AdminMenuEntity> findAllByCategoryIdAndSearchQuery(
            @Param("categoryId") Integer categoryId, 
            @Param("searchQuery") String searchQuery);
}
