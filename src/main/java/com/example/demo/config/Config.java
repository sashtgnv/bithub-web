package com.example.demo.config;

import com.example.demo.utils.ProjectSaver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class Config {

    @Bean
    public String uploadDir(){
         String s = System.getProperty("user.home") + "/.local/share/bithub-storage";
         Path path = Paths.get(s);
         try {
             if (!Files.exists(path)) {
                 Files.createDirectory(path);
             }
         } catch (IOException e) {
             e.printStackTrace();
         }
         return s;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Для REST API с JWT CSRF не нужен
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Публичные репо
                        .anyRequest().permitAll() // Остальное требует токена
                );
        // Здесь позже добавим JWT фильтр
        return http.build();
    }

//    @Bean
//    public ProjectSaver projectSaver() {
//        return new ProjectSaver(uploadDir());
//    }
}
