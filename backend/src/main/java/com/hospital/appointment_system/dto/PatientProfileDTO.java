package com.hospital.appointment_system.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientProfileDTO {
    private Long id;
    private Long userId;
    
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    private LocalDate dob;
    private String gender;
    private String bloodGroup;
    private String allergies;
    private String address;
}
