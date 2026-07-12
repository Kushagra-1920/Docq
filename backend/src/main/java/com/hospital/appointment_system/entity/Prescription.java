package com.hospital.appointment_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false)
    private String diagnosis;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String medicines;

    @Column(columnDefinition = "TEXT")
    private String dosageInstructions;

    @Column(columnDefinition = "TEXT")
    private String doctorNotes;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime issuedAt;
}
