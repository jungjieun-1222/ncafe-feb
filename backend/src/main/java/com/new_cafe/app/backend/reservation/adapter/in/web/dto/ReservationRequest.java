package com.new_cafe.app.backend.reservation.adapter.in.web.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationRequest {
    private String userId;
    private String guestName;
    private String guestPhone;
    private LocalDate reserveDate;
    private LocalTime reserveTime;
    private int guestCount;
}
