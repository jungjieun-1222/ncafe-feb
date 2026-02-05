
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Scanner;

import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.repository.NewMenuRepository;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

//jdbc api의 예제로 구현하는 파일
public class App {

    public static void main(String[] args) throws ClassNotFoundException, SQLException {
        // 사용자에게 검색어를 입력
        String name = "";
        Scanner scanner = new Scanner(System.in, "MS949");
        System.out.println("검색어를 입력해주세요");
        name = scanner.nextLine();
        System.out.println(name);

        // DataSource 설정 (NewMenuRepository 생성자에 필요)
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl("jdbc:postgresql://hi.newlecture.com:5432/ncafedb?ssl=false");
        dataSource.setUsername("ncafe");
        dataSource.setPassword("new_ibm2");

        NewMenuRepository repository = new NewMenuRepository(dataSource);
        List<Menu> menus = repository.findAllByName(name);
        System.out.println(menus);
        System.out.println("검색결과:" + menus);

        // // api에게 이거 sql을 전달해서 실행해줘
        // String sql = "SELECT * FROM menus";

        // // 0. 드라이버 로드
        // Class.forName("org.postgresql.Driver");

        // // 1. 연결
        // Connection conn = DriverManager
        // .getConnection("jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
        // "postgres.ucqigwxvtccemgaurwny", "c%YwgNsGdJ4MfPs");

        // // 2. 실행
        // Statement stmt = conn.createStatement();
        // ResultSet rs = stmt.executeQuery(sql);

        // // 3. 결과
        // rs.next();
        // System.out.println(rs.getString("kor_name"));
    }
}
