package com.example.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.cors.allowed-origins:}")
    private String corsAllowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (corsAllowedOrigins == null || corsAllowedOrigins.isBlank()) {
            return;
        }
        String[] origins = corsAllowedOrigins.split(",");
        registry.addMapping("/api/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(false);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (uploadDir == null || uploadDir.isBlank()) {
            return;
        }
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String location = uploadPath.toUri().toString();
        registry.addResourceHandler("/uploads/**").addResourceLocations(location);
    }
}
