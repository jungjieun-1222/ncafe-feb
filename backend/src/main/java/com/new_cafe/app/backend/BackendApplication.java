package com.new_cafe.app.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
	// 톰캣서버 실행
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		System.out.println("hello");
	}

}
