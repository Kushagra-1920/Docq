package com.hospital.appointment_system.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void missingJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/doctors")) // We'll add this endpoint later, but any protected endpoint should return 401
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void invalidJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/doctors")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }
}
