package com.new_cafe.app.backend.admin.dashboard.adapter.in.web;

import com.new_cafe.app.backend.admin.dashboard.adapter.in.web.dto.DashboardSummaryResponse;
import com.new_cafe.app.backend.admin.dashboard.adapter.in.web.dto.SalesGraphResponse;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderEntity;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderRepository orderRepository;
    private final com.new_cafe.app.backend.reservation.adapter.out.persistence.ReservationRepository reservationRepository;

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);

        Long totalSales = orderRepository.sumTotalPriceByOrderedAtBetween(start, end);
        long orderCount = orderRepository.countByOrderedAtBetween(start, end);
        long reservationCount = reservationRepository.countByCreatedAtBetween(start, end);

        // 인기 메뉴 계산
        List<OrderEntity> orders = orderRepository.findAllByOrderedAtBetween(start, end);
        String popularMenu = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(com.new_cafe.app.backend.order.adapter.out.persistence.OrderItemEntity::getMenuName, Collectors.summingInt(com.new_cafe.app.backend.order.adapter.out.persistence.OrderItemEntity::getQuantity)))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("-");

        return new DashboardSummaryResponse(
            totalSales != null ? totalSales : 0, 
            orderCount, 
            reservationCount, 
            popularMenu
        );
    }

    @GetMapping("/sales-graph")
    public List<SalesGraphResponse> getSalesGraph() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);

        List<OrderEntity> orders = orderRepository.findAllByOrderedAtBetween(start, end);

        // 시간대별로 그룹화 (0시~23시)
        Map<Integer, Long> hourlySales = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderedAt().getHour(),
                        Collectors.summingLong(OrderEntity::getTotalPrice)
                ));

        List<SalesGraphResponse> result = new ArrayList<>();
        // 09:00 ~ 21:00 데이터 생성 (요구사항)
        for (int hour = 9; hour <= 21; hour++) {
            String timeLabel = String.format("%02d:00", hour);
            long sales = hourlySales.getOrDefault(hour, 0L);
            result.add(new SalesGraphResponse(timeLabel, sales));
        }

        return result;
    }
}
