package com.hospital.appointment_system.controller;

import com.hospital.appointment_system.dto.DepartmentDTO;
import com.hospital.appointment_system.dto.DoctorProfileDTO;
import com.hospital.appointment_system.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // --- Department Endpoints ---

    @PostMapping("/departments")
    public ResponseEntity<DepartmentDTO> createDepartment(@Valid @RequestBody DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(adminService.createDepartment(departmentDTO));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<DepartmentDTO> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(adminService.updateDepartment(id, departmentDTO));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        adminService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        return ResponseEntity.ok(adminService.getAllDepartments());
    }

    // --- Doctor Endpoints ---

    @PostMapping("/doctors")
    public ResponseEntity<DoctorProfileDTO> createDoctor(@Valid @RequestBody DoctorProfileDTO doctorDTO) {
        return ResponseEntity.ok(adminService.createDoctor(doctorDTO));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<DoctorProfileDTO> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorProfileDTO doctorDTO) {
        return ResponseEntity.ok(adminService.updateDoctor(id, doctorDTO));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    // --- Analytics ---

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
