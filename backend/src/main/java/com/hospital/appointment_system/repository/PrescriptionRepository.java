package com.hospital.appointment_system.repository;

import com.hospital.appointment_system.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByAppointmentId(Long appointmentId);
    List<Prescription> findByAppointment_Patient_Id(Long patientId);
    List<Prescription> findByAppointment_Doctor_Id(Long doctorId);
    List<Prescription> findByAppointment_Doctor_IdAndAppointment_Patient_Id(Long doctorId, Long patientId);
    List<Prescription> findByAppointment_Doctor_IdOrderByIssuedAtDesc(Long doctorId);
}
