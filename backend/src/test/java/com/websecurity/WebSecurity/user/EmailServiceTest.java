package com.websecurity.WebSecurity.user;

import com.websecurity.websecurity.user.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

public class EmailServiceTest {

    private JavaMailSender mailSender;
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        emailService = new EmailService();
        // Inyecta el mock manualmente
        try {
            var field = EmailService.class.getDeclaredField("mailSender");
            field.setAccessible(true);
            field.set(emailService, mailSender);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testSendVerificationEmail() {
        emailService.sendVerificationEmail("test@mail.com", "token123");
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendResetPasswordEmail() {
        emailService.sendResetPasswordEmail("test@mail.com", "token456");
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}