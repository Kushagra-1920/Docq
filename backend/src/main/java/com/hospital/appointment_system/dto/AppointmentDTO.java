package com.hospital.appointment_system.dto;

import com.hospital.appointment_system.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    
    private Long patientId;
    private String patientName;
    
    @NotNull
    private Long doctorId;
    private String doctorName;
    
    @NotNull
    private Long slotId;
    private String date;
    private String time;

    private AppointmentStatus appointmentStatus;
    
    private String reason;
    private String notes;
    private LocalDateTime createdAt;
}
