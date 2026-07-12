package com.hospital.appointment_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String specialization;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    private String qualification;

    private Integer experienceYears;

    private Double consultationFee;

    @Column(columnDefinition = "TEXT")
    private String biography;

    @Column(columnDefinition = "TEXT")
    private String profileImage;
}
