package com.new_cafe.app.backend;

import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.entity.AdminMenuEntity;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

// jdbc api의 예제로 구현하는 파일 (학습용)
public class App {

    public static void main(String[] args) throws ClassNotFoundException, SQLException {
        // 사용자에게 검색어를 입력
        String name = "";
        Scanner scanner = new Scanner(System.in);
        System.out.println("검색어를 입력해주세요");
        name = scanner.nextLine();
        System.out.println(name);

        // DataSource 설정
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl("jdbc:postgresql://localhost:5412/ncafedb?ssl=false");
        dataSource.setUsername("ncafe");
        dataSource.setPassword("1234");

        System.out.println("참고: 현재 시스템은 JPA와 헥사고날 아키텍처로 리팩토링되었습니다.");
        System.out.println("이 파일은 학습용 JDBC 코드로 남겨둡니다.");
    }
}
