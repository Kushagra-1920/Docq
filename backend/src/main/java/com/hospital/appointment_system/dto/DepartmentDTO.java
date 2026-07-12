package com.hospital.appointment_system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentDTO {
    private Long id;

    @NotBlank
    private String name;

    private String description;
}
