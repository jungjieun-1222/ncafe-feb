package com.new_cafe.app.backend.controller.admin;

import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.service.MenuService;
import com.new_cafe.app.backend.controller.dto.MenuDetailResponse;
import com.new_cafe.app.backend.controller.dto.MenuImageListResponse;
import com.new_cafe.app.backend.controller.dto.MenuListRequest;
import com.new_cafe.app.backend.controller.dto.MenuListResponse;

/**
 * 메뉴와 관련된 HTTP 요청(API)을 처리하는 컨트롤러
 */
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/admin/menus")
@RestController

public class MenuController {

    private MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // 목록 조회 데이터 반환
    @GetMapping
    public MenuListResponse getMenus(MenuListRequest request) {
        MenuListResponse response = menuService.getMenus(request);
        return response;
    }

    // 상세 조회 데이터 반환
    @GetMapping("/{id}")
    public MenuDetailResponse getMenu(@PathVariable Long id) {
        MenuDetailResponse response = menuService.getMenu(id);
        return response;
    }

    // 메뉴 생성 데이터 입력
    @PostMapping
    public String newMenu(Menu menu) {
        return "newMenu";
    }

    @PutMapping("/{id}")
    public String editMenu(Menu menu) {
        // TODO: process PUT request

        return "editMenu";
    }

    // 메뉴 삭제 데이터 입력
    @DeleteMapping("/{id}")
    public String deleteMenu() {
        return "deleteMenu";
    }

    // 메뉴 이미지 데이터 반환
    @GetMapping("/{id}/menu-images")
    public MenuImageListResponse getMenuImages(@PathVariable Long id) {
        MenuImageListResponse response = menuService.getMenuImages(id);
        return response;
    }
}