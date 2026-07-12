package com.hospital.appointment_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PrescriptionDTO {
    private Long id;
    
    private Long appointmentId;

    @NotBlank
    private String diagnosis;

    @NotBlank
    private String medicines;

    private String dosageInstructions;
    private String doctorNotes;
    
    private LocalDateTime issuedAt;
}
