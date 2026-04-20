package com.kuala.ftpserver;

import com.kuala.ftpserver.Services.StorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
public class FtPserverApplication {

    public static void main(String[] args) {
         SpringApplication.run(FtPserverApplication.class, args);
    }
    @Bean
    CommandLineRunner init(StorageService storageService) {
        return (args -> {
//            storageService.deleteAll();
            storageService.init();
        });
    }

}
