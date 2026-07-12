package com.hospital.appointment_system.service;

import com.hospital.appointment_system.dto.AppointmentDTO;
import com.hospital.appointment_system.dto.AvailabilitySlotDTO;
import com.hospital.appointment_system.dto.DoctorProfileDTO;
import com.hospital.appointment_system.dto.PrescriptionDTO;
import com.hospital.appointment_system.entity.Appointment;
import com.hospital.appointment_system.entity.AppointmentStatus;
import com.hospital.appointment_system.entity.AvailabilitySlot;
import com.hospital.appointment_system.entity.DoctorProfile;
import com.hospital.appointment_system.entity.Prescription;
import com.hospital.appointment_system.entity.User;
import com.hospital.appointment_system.exception.ResourceNotFoundException;
import com.hospital.appointment_system.mapper.AppMapper;
import com.hospital.appointment_system.repository.AppointmentRepository;
import com.hospital.appointment_system.repository.AvailabilitySlotRepository;
import com.hospital.appointment_system.repository.DoctorProfileRepository;
import com.hospital.appointment_system.repository.PrescriptionRepository;
import com.hospital.appointment_system.repository.PatientProfileRepository;
import com.hospital.appointment_system.repository.UserRepository;
import com.hospital.appointment_system.dto.PatientProfileDTO;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final UserRepository userRepository;
    private final AppMapper appMapper;
    private final EmailService emailService;

    public DoctorService(DoctorProfileRepository doctorProfileRepository, AvailabilitySlotRepository availabilitySlotRepository,
                         AppointmentRepository appointmentRepository, PrescriptionRepository prescriptionRepository, 
                         PatientProfileRepository patientProfileRepository, UserRepository userRepository, AppMapper appMapper, EmailService emailService) {
        this.doctorProfileRepository = doctorProfileRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.userRepository = userRepository;
        this.appMapper = appMapper;
        this.emailService = emailService;
    }
    
    public List<DoctorProfileDTO> getAllDoctors() {
        return appMapper.toDoctorProfileDTOs(doctorProfileRepository.findAll());
    }
    
    public DoctorProfileDTO getDoctorById(Long id) {
        return appMapper.toDoctorProfileDTO(doctorProfileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor not found")));
    }

    public List<AvailabilitySlotDTO> getDoctorAvailability(Long doctorId, LocalDate date) {
        return appMapper.toAvailabilitySlotDTOs(availabilitySlotRepository.findByDoctorIdAndDateGreaterThanEqual(doctorId, date));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    public List<AppointmentDTO> getMyAppointments(Long userId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        return appMapper.toAppointmentDTOs(appointmentRepository.findByDoctorId(doctor.getId()));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @Transactional
    public AvailabilitySlotDTO addAvailability(Long userId, AvailabilitySlotDTO slotDTO) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        AvailabilitySlot slot = appMapper.toAvailabilitySlot(slotDTO);
        slot.setDoctor(doctor);
        slot.setBooked(false);
        return appMapper.toAvailabilitySlotDTO(availabilitySlotRepository.save(slot));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @Transactional
    public void deleteAvailability(Long userId, Long slotId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        AvailabilitySlot slot = availabilitySlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));
        
        if (!slot.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You do not own this slot");
        }
        
        if (slot.isBooked()) {
            throw new IllegalArgumentException("Cannot delete a booked slot");
        }
        
        availabilitySlotRepository.delete(slot);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @Transactional
    public AppointmentDTO completeAppointment(Long userId, Long appointmentId, PrescriptionDTO prescriptionDTO) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You do not own this appointment");
        }
        
        appointment.setAppointmentStatus(AppointmentStatus.COMPLETED);
        
        Prescription prescription = appMapper.toPrescription(prescriptionDTO);
        prescription.setAppointment(appointment);
        prescriptionRepository.save(prescription);
        
        return appMapper.toAppointmentDTO(appointmentRepository.save(appointment));
    }

    private DoctorProfile getDoctorByUserId(Long userId) {
        return doctorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor Profile not found for this user"));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @Transactional
    public AppointmentDTO confirmAppointment(Long userId, Long appointmentId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You do not own this appointment");
        }
        
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        
        // Mark the availability slot as booked if it isn't already
        AvailabilitySlot slot = appointment.getSlot();
        if (slot != null) {
            slot.setBooked(true);
            availabilitySlotRepository.save(slot);
        }
        
        return appMapper.toAppointmentDTO(appointmentRepository.save(appointment));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @Transactional
    public AppointmentDTO cancelAppointment(Long userId, Long appointmentId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You do not own this appointment");
        }
        
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        
        // Free up the availability slot
        AvailabilitySlot slot = appointment.getSlot();
        if (slot != null) {
            slot.setBooked(false);
            availabilitySlotRepository.save(slot);
        }
        
        return appMapper.toAppointmentDTO(appointmentRepository.save(appointment));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    public PatientProfileDTO getPatientProfile(Long userId, Long patientId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        
        // Verify doctor has an appointment with this patient
        boolean hasAppointment = appointmentRepository.findByDoctorId(doctor.getId())
            .stream()
            .anyMatch(a -> a.getPatient().getId().equals(patientId));
            
        if (!hasAppointment) {
            throw new AccessDeniedException("You do not have access to this patient's profile");
        }
        
        return appMapper.toPatientProfileDTO(patientProfileRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found")));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorProfileDTO getMyProfile(Long userId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        return appMapper.toDoctorProfileDTO(doctor);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    public DoctorProfileDTO updateMyProfile(Long userId, DoctorProfileDTO dto) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        
        if (dto.getBiography() != null) doctor.setBiography(dto.getBiography());
        if (dto.getConsultationFee() != null) doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getExperienceYears() != null) doctor.setExperienceYears(dto.getExperienceYears());
        if (dto.getQualification() != null) doctor.setQualification(dto.getQualification());
        if (dto.getProfileImage() != null) doctor.setProfileImage(dto.getProfileImage());
        if (dto.getSpecialization() != null && !dto.getSpecialization().isEmpty()) doctor.setSpecialization(dto.getSpecialization());

        // Update User info if needed
        User user = doctor.getUser();
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        return appMapper.toDoctorProfileDTO(doctorProfileRepository.save(doctor));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    public List<PrescriptionDTO> getAllMyPrescriptions(Long userId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        return appMapper.toPrescriptionDTOs(prescriptionRepository.findByAppointment_Doctor_IdOrderByIssuedAtDesc(doctor.getId()));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    public List<PrescriptionDTO> getPatientPrescriptions(Long userId, Long patientId) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        
        // Return only prescriptions issued by this doctor to this patient
        return appMapper.toPrescriptionDTOs(
            prescriptionRepository.findByAppointment_Doctor_IdAndAppointment_Patient_Id(doctor.getId(), patientId)
        );
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @Transactional
    public PrescriptionDTO createPrescription(Long userId, Long patientId, PrescriptionDTO prescriptionDTO) {
        DoctorProfile doctor = getDoctorByUserId(userId);
        
        // Find the most recent appointment to attach this prescription to
        Appointment appointment = appointmentRepository.findFirstByDoctorIdAndPatientIdOrderByIdDesc(doctor.getId(), patientId)
                .orElseThrow(() -> new ResourceNotFoundException("No appointment found for this patient to attach prescription to"));

        Prescription prescription = appMapper.toPrescription(prescriptionDTO);
        prescription.setAppointment(appointment);
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        
        // Fetch details for email
        String patientName = appointment.getPatient().getUser().getFirstName() + " " + appointment.getPatient().getUser().getLastName();
        String patientEmail = appointment.getPatient().getUser().getEmail();
        String doctorName = doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName();

        // Send Email Async
        emailService.sendPrescriptionEmail(patientEmail, patientName, doctorName, savedPrescription);
        
        return appMapper.toPrescriptionDTO(savedPrescription);
    }
}
