package com.websecurity.WebSecurity.file;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.websecurity.websecurity.file.UploadController;

@WebMvcTest(UploadController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.websecurity.websecurity.user.JwtUtil jwtUtil;

    @MockBean
    private com.websecurity.websecurity.user.UserRepository userRepository;

    @Test
    void testUploadImageSuccess() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.png",
                MediaType.IMAGE_PNG_VALUE,
                "fake image content".getBytes()
        );

        mockMvc.perform(multipart("/api/upload/image").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("http://localhost:8080/uploads/")));
    }

    @Test
    void testUploadImageEmptyFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "",
                MediaType.IMAGE_PNG_VALUE,
                new byte[0]
        );

        mockMvc.perform(multipart("/api/upload/image").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("No file selected")));
    }
}