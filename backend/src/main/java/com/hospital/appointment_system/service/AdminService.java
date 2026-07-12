package com.hospital.appointment_system.service;

import com.hospital.appointment_system.dto.DepartmentDTO;
import com.hospital.appointment_system.dto.DoctorProfileDTO;
import com.hospital.appointment_system.entity.Department;
import com.hospital.appointment_system.entity.DoctorProfile;
import com.hospital.appointment_system.entity.Role;
import com.hospital.appointment_system.entity.User;
import com.hospital.appointment_system.exception.ResourceNotFoundException;
import com.hospital.appointment_system.mapper.AppMapper;
import com.hospital.appointment_system.repository.AppointmentRepository;
import com.hospital.appointment_system.repository.DepartmentRepository;
import com.hospital.appointment_system.repository.DoctorProfileRepository;
import com.hospital.appointment_system.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@PreAuthorize("hasRole('ADMIN')")
public class AdminService {
    
    private final DepartmentRepository departmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppMapper appMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminService(DepartmentRepository departmentRepository, DoctorProfileRepository doctorProfileRepository,
                        UserRepository userRepository, AppointmentRepository appointmentRepository, AppMapper appMapper, PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.appMapper = appMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Department Management ---

    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        if (departmentRepository.findByName(departmentDTO.getName()).isPresent()) {
            throw new IllegalArgumentException("Department name already exists!");
        }
        Department dept = appMapper.toDepartment(departmentDTO);
        return appMapper.toDepartmentDTO(departmentRepository.save(dept));
    }

    @Transactional
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        dept.setName(departmentDTO.getName());
        dept.setDescription(departmentDTO.getDescription());
        return appMapper.toDepartmentDTO(departmentRepository.save(dept));
    }

    @Transactional
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
    
    public List<DepartmentDTO> getAllDepartments() {
        return appMapper.toDepartmentDTOs(departmentRepository.findAll());
    }

    // --- Doctor Management ---

    @Transactional
    public DoctorProfileDTO createDoctor(DoctorProfileDTO doctorDTO) {
        if (userRepository.existsByEmail(doctorDTO.getEmail())) {
            throw new IllegalArgumentException("Email already in use!");
        }
        
        Department dept = departmentRepository.findById(doctorDTO.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        User user = User.builder()
                .firstName(doctorDTO.getFirstName())
                .lastName(doctorDTO.getLastName())
                .email(doctorDTO.getEmail())
                .password(passwordEncoder.encode("Doctor@123")) // Default password
                .role(Role.ROLE_DOCTOR)
                .build();
        user = userRepository.save(user);

        DoctorProfile profile = DoctorProfile.builder()
                .user(user)
                .department(dept)
                .specialization(doctorDTO.getSpecialization())
                .qualification(doctorDTO.getQualification())
                .experienceYears(doctorDTO.getExperienceYears())
                .consultationFee(doctorDTO.getConsultationFee())
                .biography(doctorDTO.getBiography())
                .build();

        return appMapper.toDoctorProfileDTO(doctorProfileRepository.save(profile));
    }

    @Transactional
    public DoctorProfileDTO updateDoctor(Long id, DoctorProfileDTO doctorDTO) {
        DoctorProfile profile = doctorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor Profile not found"));
        
        Department dept = departmentRepository.findById(doctorDTO.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        profile.setSpecialization(doctorDTO.getSpecialization());
        profile.setDepartment(dept);
        profile.setQualification(doctorDTO.getQualification());
        profile.setExperienceYears(doctorDTO.getExperienceYears());
        profile.setConsultationFee(doctorDTO.getConsultationFee());
        profile.setBiography(doctorDTO.getBiography());

        return appMapper.toDoctorProfileDTO(doctorProfileRepository.save(profile));
    }

    @Transactional
    public void deleteDoctor(Long id) {
        DoctorProfile profile = doctorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        doctorProfileRepository.delete(profile);
        userRepository.delete(profile.getUser());
    }
    
    // --- Analytics ---
    
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        long totalDoctors = doctorProfileRepository.count();
        long totalPatients = userRepository.findAll().stream().filter(u -> u.getRole() == Role.ROLE_PATIENT).count();
        long totalAppointments = appointmentRepository.count();
        
        analytics.put("totalDoctors", totalDoctors);
        analytics.put("totalPatients", totalPatients);
        analytics.put("totalAppointments", totalAppointments);
        // More complex analytics could be added here
        
        return analytics;
    }
}
