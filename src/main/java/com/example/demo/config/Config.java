package com.example.demo.config;

import com.example.demo.utils.ProjectSaver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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

//    @Bean
//    public ProjectSaver projectSaver() {
//        return new ProjectSaver(uploadDir());
//    }
}
