package com.new_cafe.app.backend.order.domain;

public enum OrderStatus {
    PENDING,    // 대기
    CONFIRMED,  // 승인
    PREPARING,  // 준비 중
    CANCELLED,  // 취소
    COMPLETED   // 완료
}
