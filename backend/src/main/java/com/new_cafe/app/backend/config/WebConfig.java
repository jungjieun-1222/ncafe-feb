package com.new_cafe.app.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @org.springframework.beans.factory.annotation.Value("${upload.path}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        // Ensure path ends with slash and has protocol
        String baseLocation = uploadPath.startsWith("file:") ? uploadPath : "file:" + uploadPath;
        if (!baseLocation.endsWith("/")) baseLocation += "/";

        // 이미지는 /images/** -> {upload.path}/images/
        registry.addResourceHandler("/images/**")
                .addResourceLocations(baseLocation + "images/");
        
        // 업로드 파일은 /uploads/** -> {upload.path}
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(baseLocation);
    }
}
