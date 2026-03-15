package com.new_cafe.app.backend.reservation.adapter.in.web;

import com.new_cafe.app.backend.reservation.adapter.in.web.dto.ReservationRequest;
import com.new_cafe.app.backend.reservation.adapter.out.persistence.ReservationEntity;
import com.new_cafe.app.backend.reservation.domain.ReservationStatus;
import com.new_cafe.app.backend.reservation.application.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@Slf4j
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
        log.info("🏮 ReservationController initialized!");
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
            ReservationEntity reservation = reservationService.createReservation(request);
            return ResponseEntity.ok(reservation);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("예약 처리 중 오류가 발생했습니다.");
        }
    }

    @GetMapping
    public ResponseEntity<List<ReservationEntity>> getReservations(
            @RequestParam(required = false) String userId) {
        if (userId != null) {
            return ResponseEntity.ok(reservationService.getReservationsByUserId(userId));
        }
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam ReservationStatus status) {
        try {
            reservationService.updateReservationStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
