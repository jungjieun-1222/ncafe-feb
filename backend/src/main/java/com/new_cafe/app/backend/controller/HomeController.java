package com.new_cafe.app.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 메인 페이지(루트 경로) 요청을 처리하는 컨트롤러
 */
@RestController // 데이터를 브라우저에 직접 반환하는 컨트롤러 선언 (화면 파일이 필요 없음)
public class HomeController {

    /**
     * 루트 경로("/") 접속 시 실행되는 메서드
     * 
     * @return "index"라는 문자열을 브라우저에 그대로 출력
     */
    @GetMapping("/")
    public String home() {
        return "index";
    }
}