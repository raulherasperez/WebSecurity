package com.websecurity.websecurity.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        String link = "http://localhost:3000/activar-cuenta?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("rauherper.tfg@gmail.com");
        message.setTo(to);
        message.setSubject("Verifica tu cuenta");
        message.setText("Haz clic en el siguiente enlace para activar tu cuenta: " + link);
        mailSender.send(message);
    }

    public void sendResetPasswordEmail(String to, String token) {
        String link = "http://localhost:3000/restablecer-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("rauherper.tfg@gmail.com");
        message.setTo(to);
        message.setSubject("Recupera tu contraseña");
        message.setText("Haz clic en el siguiente enlace para restablecer tu contraseña: " + link + "\nEste enlace expirará en 15 minutos.");
        mailSender.send(message);
    }
}