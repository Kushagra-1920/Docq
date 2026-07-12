package com.hospital.appointment_system.repository;

import com.hospital.appointment_system.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    java.util.Optional<Appointment> findFirstByDoctorIdAndPatientIdOrderByIdDesc(Long doctorId, Long patientId);
}
