package com.hospital.appointment_system.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AvailabilitySlotDTO {
    private Long id;
    
    @NotNull
    private Long doctorId;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    private boolean booked;
}
