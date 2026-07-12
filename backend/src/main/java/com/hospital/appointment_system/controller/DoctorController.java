package com.hospital.appointment_system.controller;

import com.hospital.appointment_system.dto.AppointmentDTO;
import com.hospital.appointment_system.dto.AvailabilitySlotDTO;
import com.hospital.appointment_system.dto.DoctorProfileDTO;
import com.hospital.appointment_system.dto.PatientProfileDTO;
import com.hospital.appointment_system.dto.PrescriptionDTO;
import com.hospital.appointment_system.security.UserDetailsImpl;
import com.hospital.appointment_system.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // --- Public Endpoints ---
    
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorProfileDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorProfileDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/doctors/{id}/availability")
    public ResponseEntity<List<AvailabilitySlotDTO>> getDoctorAvailability(
            @PathVariable Long id, 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(doctorService.getDoctorAvailability(id, date));
    }

    // --- Protected Doctor Endpoints ---

    @GetMapping("/doctor/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.getMyAppointments(userId));
    }

    @PostMapping("/doctor/availability")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AvailabilitySlotDTO> addAvailability(@Valid @RequestBody AvailabilitySlotDTO slotDTO) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.addAvailability(userId, slotDTO));
    }

    @DeleteMapping("/doctor/availability/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        doctorService.deleteAvailability(userId, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/doctor/appointments/{id}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDTO> completeAppointment(@PathVariable Long id, @Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.completeAppointment(userId, id, prescriptionDTO));
    }

    @PutMapping("/doctor/appointments/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDTO> confirmAppointment(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.confirmAppointment(userId, id));
    }

    @PutMapping("/doctor/appointments/{id}/cancel")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.cancelAppointment(userId, id));
    }

    @GetMapping("/doctor/patients/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PatientProfileDTO> getPatientProfile(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.getPatientProfile(userId, id));
    }

    @GetMapping("/doctor/patients/{id}/prescriptions")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PrescriptionDTO>> getPatientPrescriptions(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.getPatientPrescriptions(userId, id));
    }

    @PostMapping("/doctor/patients/{id}/prescriptions")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionDTO> createPrescription(@PathVariable Long id, @RequestBody PrescriptionDTO prescriptionDTO) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.createPrescription(userId, id, prescriptionDTO));
    }

    @GetMapping("/doctor/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorProfileDTO> getMyProfile() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.getMyProfile(userId));
    }

    @PutMapping("/doctor/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorProfileDTO> updateMyProfile(@RequestBody DoctorProfileDTO dto) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.updateMyProfile(userId, dto));
    }

    @GetMapping("/doctor/prescriptions")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PrescriptionDTO>> getAllMyPrescriptions() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(doctorService.getAllMyPrescriptions(userId));
    }

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }
}
