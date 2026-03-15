package com.new_cafe.app.backend.reservation.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    List<ReservationEntity> findByReserveDateAndReserveTime(
            LocalDate reserveDate,
            LocalTime reserveTime
    );

    List<ReservationEntity> findByUserIdOrderByReserveDateDesc(String userId);
    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
