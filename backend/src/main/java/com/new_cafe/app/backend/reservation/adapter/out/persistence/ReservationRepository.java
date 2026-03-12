package com.new_cafe.app.backend.reservation.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    List<ReservationEntity> findByReserveDateAndReserveTime(
            @Param("date") LocalDate date,
            @Param("time") LocalTime time
    );

    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
