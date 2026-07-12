package com.hospital.appointment_system.controller;

import com.hospital.appointment_system.dto.AppointmentDTO;
import com.hospital.appointment_system.dto.PatientProfileDTO;
import com.hospital.appointment_system.dto.PrescriptionDTO;
import com.hospital.appointment_system.security.UserDetailsImpl;
import com.hospital.appointment_system.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PutMapping("/profile")
    public ResponseEntity<PatientProfileDTO> updateProfile(@Valid @RequestBody PatientProfileDTO profileDTO) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(patientService.updateProfile(userId, profileDTO));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(patientService.getMyAppointments(userId));
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDTO> bookAppointment(@Valid @RequestBody AppointmentDTO appointmentDTO) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(patientService.bookAppointment(userId, appointmentDTO));
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable Long id, @RequestParam(required = false) String reason) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(patientService.cancelAppointment(userId, id, reason));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<List<PrescriptionDTO>> getMyPrescriptions() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(patientService.getMyPrescriptions(userId));
    }

    private Long getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }
}
