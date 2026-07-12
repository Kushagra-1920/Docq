package com.hospital.appointment_system.service;

import com.hospital.appointment_system.entity.Prescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void sendPrescriptionEmail(String toEmail, String patientName, String doctorName, Prescription prescription) {
        logger.info("\n=======================================================");
        logger.info("DUMMY EMAIL SERVICE - SENDING EMAIL");
        logger.info("TO: {}", toEmail);
        logger.info("SUBJECT: Your New Prescription from {}", doctorName);
        logger.info("-------------------------------------------------------");
        logger.info("Dear {},", patientName);
        logger.info("\nDr. {} has issued a new prescription for you.", doctorName);
        logger.info("\nDiagnosis: {}", prescription.getDiagnosis());
        logger.info("Medications: {}", prescription.getMedicines());
        if (prescription.getDosageInstructions() != null && !prescription.getDosageInstructions().isBlank()) {
            logger.info("Dosage Instructions: {}", prescription.getDosageInstructions());
        }
        if (prescription.getDoctorNotes() != null && !prescription.getDoctorNotes().isBlank()) {
            logger.info("Doctor Notes: {}", prescription.getDoctorNotes());
        }
        logger.info("\nThank you for choosing CareConnect.");
        logger.info("=======================================================\n");
    }
}
