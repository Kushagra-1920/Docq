package com.hospital.appointment_system.service;

import com.hospital.appointment_system.dto.AppointmentDTO;
import com.hospital.appointment_system.dto.PatientProfileDTO;
import com.hospital.appointment_system.dto.PrescriptionDTO;
import com.hospital.appointment_system.entity.Appointment;
import com.hospital.appointment_system.entity.AppointmentStatus;
import com.hospital.appointment_system.entity.AvailabilitySlot;
import com.hospital.appointment_system.entity.PatientProfile;
import com.hospital.appointment_system.exception.ResourceNotFoundException;
import com.hospital.appointment_system.mapper.AppMapper;
import com.hospital.appointment_system.repository.AppointmentRepository;
import com.hospital.appointment_system.repository.AvailabilitySlotRepository;
import com.hospital.appointment_system.repository.PatientProfileRepository;
import com.hospital.appointment_system.repository.PrescriptionRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientProfileRepository patientProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AppMapper appMapper;

    public PatientService(PatientProfileRepository patientProfileRepository, AppointmentRepository appointmentRepository,
                          AvailabilitySlotRepository availabilitySlotRepository, PrescriptionRepository prescriptionRepository, AppMapper appMapper) {
        this.patientProfileRepository = patientProfileRepository;
        this.appointmentRepository = appointmentRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.appMapper = appMapper;
    }

    @PreAuthorize("hasRole('PATIENT')")
    public PatientProfileDTO updateProfile(Long userId, PatientProfileDTO profileDTO) {
        PatientProfile profile = getPatientByUserId(userId);
        
        profile.setDob(profileDTO.getDob());
        profile.setGender(profileDTO.getGender());
        profile.setBloodGroup(profileDTO.getBloodGroup());
        profile.setAllergies(profileDTO.getAllergies());
        profile.setAddress(profileDTO.getAddress());
        
        return appMapper.toPatientProfileDTO(patientProfileRepository.save(profile));
    }

    @PreAuthorize("hasRole('PATIENT')")
    public List<AppointmentDTO> getMyAppointments(Long userId) {
        PatientProfile patient = getPatientByUserId(userId);
        return appMapper.toAppointmentDTOs(appointmentRepository.findByPatientId(patient.getId()));
    }

    @PreAuthorize("hasRole('PATIENT')")
    @Transactional
    public AppointmentDTO bookAppointment(Long userId, AppointmentDTO appointmentDTO) {
        PatientProfile patient = getPatientByUserId(userId);
        
        AvailabilitySlot slot = availabilitySlotRepository.findById(appointmentDTO.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));
                
        if (slot.isBooked()) {
            throw new IllegalArgumentException("Slot is already booked");
        }
        
        slot.setBooked(true);
        availabilitySlotRepository.save(slot);

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(slot.getDoctor())
                .slot(slot)
                .appointmentStatus(AppointmentStatus.PENDING)
                .reason(appointmentDTO.getReason())
                .notes(appointmentDTO.getNotes())
                .build();
                
        return appMapper.toAppointmentDTO(appointmentRepository.save(appointment));
    }

    @PreAuthorize("hasRole('PATIENT')")
    @Transactional
    public AppointmentDTO cancelAppointment(Long userId, Long appointmentId, String cancelReason) {
        PatientProfile patient = getPatientByUserId(userId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
                
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new AccessDeniedException("You do not own this appointment");
        }
        
        if (appointment.getAppointmentStatus() == AppointmentStatus.COMPLETED || appointment.getAppointmentStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot cancel this appointment");
        }
        
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        if (cancelReason != null && !cancelReason.trim().isEmpty()) {
            appointment.setNotes("Cancellation Reason: " + cancelReason);
        }
        
        AvailabilitySlot slot = appointment.getSlot();
        slot.setBooked(false);
        availabilitySlotRepository.save(slot);
        
        return appMapper.toAppointmentDTO(appointmentRepository.save(appointment));
    }

    @PreAuthorize("hasRole('PATIENT')")
    public List<PrescriptionDTO> getMyPrescriptions(Long userId) {
        PatientProfile patient = getPatientByUserId(userId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());
        
        return appointments.stream()
                .filter(a -> a.getAppointmentStatus() == AppointmentStatus.COMPLETED)
                .map(a -> prescriptionRepository.findByAppointmentId(a.getId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(appMapper::toPrescriptionDTO)
                .collect(Collectors.toList());
    }

    public PatientProfile getPatientByUserId(Long userId) {
        return patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient Profile not found for this user"));
    }
}
