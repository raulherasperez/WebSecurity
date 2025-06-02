package com.websecurity.websecurity;

import com.websecurity.websecurity.user.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.http.HttpMethod;
import static org.springframework.security.config.Customizer.withDefaults;

@org.springframework.context.annotation.Configuration
public class SecurityConfig {

        @Autowired
        private JwtRequestFilter jwtRequestFilter;

        @Bean
        public CorsFilter corsFilter() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin("http://localhost:3000");
            config.addAllowedHeader("*");
            config.addAllowedMethod("*");
            source.registerCorsConfiguration("/**", config);
            return new CorsFilter(source);
        }

                

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                .cors(withDefaults()) // <-- Activa CORS aquí
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/users/register", "/api/users/login",
                    "/api/guias",           // <-- permite GET público a la lista
                    "/api/guias/**" ,
                    "/uploads/**"
                    ).permitAll()
                    .requestMatchers("/api/users/verify", "/api/users/register", "/api/users/forgot-password", "/api/users/reset-password").permitAll()
                    .requestMatchers("/api/upload/**").authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/comentarios/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/preguntas-quiz/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/preguntas-quiz/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/preguntas-quiz/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/preguntas-quiz/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.GET, "/api/modulos/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/modulos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/modulos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/modulos/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.GET, "/api/descripciones-tecnicas/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/descripciones-tecnicas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/descripciones-tecnicas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/descripciones-tecnicas/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.GET, "/api/ejemplos/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/ejemplos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/ejemplos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/ejemplos/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.GET, "/api/soluciones/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/soluciones/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/soluciones/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/soluciones/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.GET, "/api/pistas/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/pistas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/pistas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/pistas/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.GET, "/api/preguntas-teoricas/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/preguntas-teoricas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/preguntas-teoricas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/preguntas-teoricas/**").hasRole("ADMIN")
                    

                    .requestMatchers("/api/vms", "/api/vms/**").permitAll()
                    .requestMatchers("/api/sugerencias/**").authenticated()
                    .requestMatchers("/api/reportes/**").authenticated()
                    .requestMatchers("/api/logros/**").authenticated()
                    .requestMatchers(HttpMethod.GET,"/api/glosario/**").permitAll()
                    .anyRequest().authenticated()
                    
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
            http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
            return http.build();
}
}