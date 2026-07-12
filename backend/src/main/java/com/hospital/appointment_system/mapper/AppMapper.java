package com.hospital.appointment_system.mapper;

import com.hospital.appointment_system.dto.*;
import com.hospital.appointment_system.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppMapper {
    AppMapper INSTANCE = Mappers.getMapper(AppMapper.class);

    DepartmentDTO toDepartmentDTO(Department department);
    Department toDepartment(DepartmentDTO dto);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    DoctorProfileDTO toDoctorProfileDTO(DoctorProfile doctorProfile);
    
    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "departmentId", target = "department.id")
    DoctorProfile toDoctorProfile(DoctorProfileDTO dto);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    PatientProfileDTO toPatientProfileDTO(PatientProfile patientProfile);
    
    @Mapping(source = "userId", target = "user.id")
    PatientProfile toPatientProfile(PatientProfileDTO dto);

    @Mapping(source = "doctor.id", target = "doctorId")
    AvailabilitySlotDTO toAvailabilitySlotDTO(AvailabilitySlot slot);
    
    @Mapping(source = "doctorId", target = "doctor.id")
    AvailabilitySlot toAvailabilitySlot(AvailabilitySlotDTO dto);

    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(target = "patientName", expression = "java(appointment.getPatient().getUser().getFirstName() + ' ' + appointment.getPatient().getUser().getLastName())")
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(target = "doctorName", expression = "java(appointment.getDoctor().getUser().getFirstName() + ' ' + appointment.getDoctor().getUser().getLastName())")
    @Mapping(source = "slot.id", target = "slotId")
    @Mapping(source = "slot.date", target = "date", dateFormat = "yyyy-MM-dd")
    @Mapping(source = "slot.startTime", target = "time", dateFormat = "HH:mm:ss")
    AppointmentDTO toAppointmentDTO(Appointment appointment);
    
    @Mapping(source = "patientId", target = "patient.id")
    @Mapping(source = "doctorId", target = "doctor.id")
    @Mapping(source = "slotId", target = "slot.id")
    Appointment toAppointment(AppointmentDTO dto);

    @Mapping(source = "appointment.id", target = "appointmentId")
    PrescriptionDTO toPrescriptionDTO(Prescription prescription);
    
    @Mapping(source = "appointmentId", target = "appointment.id")
    Prescription toPrescription(PrescriptionDTO dto);

    List<DoctorProfileDTO> toDoctorProfileDTOs(List<DoctorProfile> doctorProfiles);
    List<AvailabilitySlotDTO> toAvailabilitySlotDTOs(List<AvailabilitySlot> slots);
    List<AppointmentDTO> toAppointmentDTOs(List<Appointment> appointments);
    List<DepartmentDTO> toDepartmentDTOs(List<Department> departments);
    List<PrescriptionDTO> toPrescriptionDTOs(List<Prescription> prescriptions);
}
