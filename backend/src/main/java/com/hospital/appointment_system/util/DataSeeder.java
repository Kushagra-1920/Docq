package com.hospital.appointment_system.util;

import com.hospital.appointment_system.entity.*;
import com.hospital.appointment_system.repository.*;
import net.datafaker.Faker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    
    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @Value("${app.seed.doctors:15}")
    private int numDoctors;

    @Value("${app.seed.patients:50}")
    private int numPatients;

    @Value("${app.seed.appointments:300}")
    private int numAppointments;

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker;
    private final Random random;

    public DataSeeder(UserRepository userRepository, DepartmentRepository departmentRepository,
                      DoctorProfileRepository doctorProfileRepository, PatientProfileRepository patientProfileRepository,
                      AvailabilitySlotRepository availabilitySlotRepository, AppointmentRepository appointmentRepository,
                      PrescriptionRepository prescriptionRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.passwordEncoder = passwordEncoder;
        this.faker = new Faker();
        this.random = new Random();
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            logger.info("Data seeding is disabled or database is already populated.");
            return;
        }

        logger.info("Starting data seeding...");
        
        seedAdmin();
        List<Department> departments = seedDepartments();
        List<DoctorProfile> doctors = seedDoctors(departments);
        List<PatientProfile> patients = seedPatients();
        List<AvailabilitySlot> slots = seedAvailability(doctors);
        seedAppointmentsAndPrescriptions(patients, slots);

        logger.info("Data seeding completed successfully!");
    }

    private void seedAdmin() {
        User admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@hospital.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_ADMIN)
                .build();
        userRepository.save(admin);
    }

    private List<Department> seedDepartments() {
        List<String> deptNames = Arrays.asList(
                "Cardiology", "Neurology", "Dermatology", "Orthopedics",
                "Pediatrics", "General Medicine", "ENT", "Ophthalmology"
        );
        List<Department> departments = new ArrayList<>();
        for (String name : deptNames) {
            Department dept = Department.builder()
                    .name(name)
                    .description(faker.lorem().sentence(10))
                    .build();
            departments.add(departmentRepository.save(dept));
        }
        return departments;
    }

    private List<DoctorProfile> seedDoctors(List<Department> departments) {
        List<DoctorProfile> doctors = new ArrayList<>();
        
        for (int i = 0; i < numDoctors; i++) {
            User user = User.builder()
                    .firstName(faker.name().firstName())
                    .lastName(faker.name().lastName())
                    .email("doctor" + (i + 1) + "@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone(faker.phoneNumber().cellPhone())
                    .role(Role.ROLE_DOCTOR)
                    .build();
            user = userRepository.save(user);

            int exp = 5 + random.nextInt(10); // Normal experience 5 to 15 years
            String achievements = "Consultant at Hospital. Previous Experience: " + exp + " years.";

            DoctorProfile profile = DoctorProfile.builder()
                    .user(user)
                    .department(departments.get(random.nextInt(departments.size())))
                    .specialization(faker.medical().diseaseName() + " Specialist")
                    .qualification("MBBS, MD")
                    .experienceYears(exp) 
                    .consultationFee(500.0 + random.nextInt(500))
                    .biography(achievements)
                    .profileImage("https://i.pravatar.cc/150?u=" + user.getId())
                    .build();
            doctors.add(doctorProfileRepository.save(profile));
        }
        return doctors;
    }

    private List<PatientProfile> seedPatients() {
        List<PatientProfile> patients = new ArrayList<>();
        List<String> bloodGroups = Arrays.asList("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-");
        for (int i = 1; i <= numPatients; i++) {
            User user = User.builder()
                    .firstName(faker.name().firstName())
                    .lastName(faker.name().lastName())
                    .email("patient" + i + "@hospital.com")
                    .password(passwordEncoder.encode("Patient@123"))
                    .phone(faker.phoneNumber().cellPhone())
                    .role(Role.ROLE_PATIENT)
                    .build();
            user = userRepository.save(user);

            PatientProfile profile = PatientProfile.builder()
                    .user(user)
                    .dob(LocalDate.now().minusYears(random.nextInt(60) + 10))
                    .gender(random.nextBoolean() ? "Male" : "Female")
                    .bloodGroup(bloodGroups.get(random.nextInt(bloodGroups.size())))
                    .address(faker.address().fullAddress())
                    .allergies(random.nextBoolean() ? faker.medical().medicineName() : "None")
                    .build();
            patients.add(patientProfileRepository.save(profile));
        }
        return patients;
    }

    private List<AvailabilitySlot> seedAvailability(List<DoctorProfile> doctors) {
        List<AvailabilitySlot> slots = new ArrayList<>();
        LocalDate today = LocalDate.now();
        int slotsCreated = 0;
        
        for (DoctorProfile doctor : doctors) {
            for (int i = 0; i < 30; i++) { 
                LocalDate date = today.plusDays(i);
                if (date.getDayOfWeek().getValue() >= 6) continue; // Skip weekends
                
                LocalTime time = LocalTime.of(12, 0); // Start 12 PM
                while (time.isBefore(LocalTime.of(18, 0))) {
                    if (slotsCreated >= 20) return slots;
                    
                    AvailabilitySlot slot = AvailabilitySlot.builder()
                            .doctor(doctor)
                            .date(date)
                            .startTime(time)
                            .endTime(time.plusHours(1))
                            .booked(random.nextDouble() > 0.7)
                            .build();
                    slots.add(availabilitySlotRepository.save(slot));
                    slotsCreated++;
                    time = time.plusHours(1);
                }
            }
        }
        return slots;
    }

    private void seedAppointmentsAndPrescriptions(List<PatientProfile> patients, List<AvailabilitySlot> slots) {
        AppointmentStatus[] statuses = AppointmentStatus.values();
        
        for (int i = 0; i < numAppointments; i++) {
            if (slots.isEmpty()) break;
            
            int slotIndex = random.nextInt(slots.size());
            AvailabilitySlot slot = slots.remove(slotIndex);
            
            slot.setBooked(true);
            availabilitySlotRepository.save(slot);
            
            PatientProfile patient = patients.get(random.nextInt(patients.size()));
            AppointmentStatus status = statuses[random.nextInt(statuses.length)];
            
            String[] reasons = {"Regular checkup", "Fever and cold", "Stomach ache", "Routine blood test", "Back pain consultation", "Follow-up visit", "Allergy symptoms", "General fatigue", "Mild headache"};
            
            Appointment appointment = Appointment.builder()
                    .patient(patient)
                    .doctor(slot.getDoctor())
                    .slot(slot)
                    .appointmentStatus(status)
                    .reason(reasons[random.nextInt(reasons.length)])
                    .build();
            
            appointment = appointmentRepository.save(appointment);
            
            if (status == AppointmentStatus.COMPLETED) {
                Prescription prescription = Prescription.builder()
                        .appointment(appointment)
                        .diagnosis(faker.medical().diseaseName())
                        .medicines(faker.medical().medicineName() + ", " + faker.medical().medicineName())
                        .dosageInstructions("Take medicine after meals.")
                        .doctorNotes("Drink plenty of water. Follow up after 5 days.")
                        .build();
                prescriptionRepository.save(prescription);
            }
        }
    }
}
