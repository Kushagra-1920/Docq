package com.hospital.appointment_system.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorProfileDTO {
    private Long id;
    private Long userId;
    
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    
    @NotBlank
    private String specialization;

    @NotNull
    private Long departmentId;
    
    private String departmentName;

    private String qualification;

    @Min(0)
    private Integer experienceYears;

    @Min(0)
    private Double consultationFee;

    private String biography;

    private String profileImage;
}
