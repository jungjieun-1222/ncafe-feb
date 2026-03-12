package com.new_cafe.app.backend.reservation.application.service;

import com.new_cafe.app.backend.reservation.adapter.in.web.dto.ReservationRequest;
import com.new_cafe.app.backend.reservation.adapter.out.persistence.ReservationEntity;
import com.new_cafe.app.backend.reservation.adapter.out.persistence.ReservationRepository;
import com.new_cafe.app.backend.reservation.domain.ReservationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private static final int MAX_CAPACITY = 20; // 카페 최대 인원

    @Transactional
    public ReservationEntity createReservation(ReservationRequest request) {
        // 1. 해당 날짜 및 시간의 예약 목록 조회
        List<ReservationEntity> overlaps = reservationRepository.findByReserveDateAndReserveTime(
                request.getReserveDate(),
                request.getReserveTime()
        );

        // 2. 현재 시간대 총 인원수 계산
        int currentTotal = overlaps.stream()
                .filter(r -> r.getStatus() != ReservationStatus.CANCELLED)
                .mapToInt(ReservationEntity::getGuestCount)
                .sum();

        if (currentTotal + request.getGuestCount() > MAX_CAPACITY) {
            throw new IllegalStateException("해당 시간대에 남은 좌석이 부족합니다. (현재 이용 가능: " + (MAX_CAPACITY - currentTotal) + "명)");
        }

        // 3. Map DTO to Entity and Save
        ReservationEntity reservation = ReservationEntity.builder()
                .userId(request.getUserId())
                .guestName(request.getGuestName())
                .guestPhone(request.getGuestPhone())
                .reserveDate(request.getReserveDate())
                .reserveTime(request.getReserveTime())
                .guestCount(request.getGuestCount())
                .status(ReservationStatus.PENDING)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        return reservationRepository.save(reservation);
    }

    public List<ReservationEntity> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public void updateReservationStatus(Long id, ReservationStatus status) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
        reservation.setStatus(status);
        reservationRepository.save(reservation);
    }
}
