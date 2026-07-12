package com.hospital.appointment_system.repository;

import com.hospital.appointment_system.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByDoctorIdAndDate(Long doctorId, LocalDate date);
    List<AvailabilitySlot> findByDoctorIdAndDateGreaterThanEqual(Long doctorId, LocalDate date);
}
