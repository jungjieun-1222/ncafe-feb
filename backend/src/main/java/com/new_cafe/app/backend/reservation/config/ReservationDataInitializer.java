package com.new_cafe.app.backend.reservation.config;

import com.new_cafe.app.backend.reservation.adapter.out.persistence.ReservationEntity;
import com.new_cafe.app.backend.reservation.adapter.out.persistence.ReservationRepository;
import com.new_cafe.app.backend.reservation.domain.ReservationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ReservationDataInitializer implements CommandLineRunner {

    private final ReservationRepository reservationRepository;

    @Override
    public void run(String... args) throws Exception {
        if (reservationRepository.count() == 0) {
            log.info("예약 데이터가 없어 초기 데이터를 생성합니다.");
            
            ReservationEntity res1 = ReservationEntity.builder()
                    .guestName("홍길동")
                    .guestPhone("010-1234-5678")
                    .reserveDate(LocalDate.now().plusDays(1))
                    .reserveTime(LocalTime.of(14, 0))
                    .guestCount(2)
                    .status(ReservationStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            ReservationEntity res2 = ReservationEntity.builder()
                    .guestName("성춘향")
                    .guestPhone("010-9876-5432")
                    .reserveDate(LocalDate.now().plusDays(2))
                    .reserveTime(LocalTime.of(16, 0))
                    .guestCount(4)
                    .status(ReservationStatus.CONFIRMED)
                    .createdAt(LocalDateTime.now())
                    .build();

            ReservationEntity res3 = ReservationEntity.builder()
                    .guestName("이몽룡")
                    .guestPhone("010-1111-2222")
                    .reserveDate(LocalDate.now().plusDays(3))
                    .reserveTime(LocalTime.of(11, 0))
                    .guestCount(1)
                    .status(ReservationStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            reservationRepository.saveAll(Arrays.asList(res1, res2, res3));
            log.info("초기 예약 데이터 3건이 삽입되었습니다.");
        } else {
            log.info("기존 예약 데이터가 존재하여 초기 데이터 생성을 건너뜁니다.");
        }
    }
}
