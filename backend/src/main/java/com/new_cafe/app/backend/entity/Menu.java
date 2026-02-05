package com.new_cafe.app.backend.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

/**
 * 메뉴 정보를 담는 그릇 클래스 (Entity)
 * 이 클래스는 로직 보다는 데이터를 담는 것이 목적이므로 @Component를 붙이지 않습니다.
 * 필요할 때마다 new Menu(...) 해서 사용합니다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {
    private long id; // 메뉴 ID (식별자)
    private String korName; // 한글 이름
    private String engName; // 영어 이름
    private String description; // 설명
    private int price; // 가격
    private int categoryId; // 카테고리 ID
    private boolean isAvailable; // 판매 가능 여부
    private LocalDateTime createdAt; // 생성 시간
    private LocalDateTime updatedAt; // 수정 시간
    private Category category; // 카테고리
}
