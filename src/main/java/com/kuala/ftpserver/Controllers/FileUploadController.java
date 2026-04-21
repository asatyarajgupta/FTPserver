package com.kuala.ftpserver.Controllers;

import com.kuala.ftpserver.Services.StorageService;
import com.kuala.ftpserver.StorageFileNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLConnection;
import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin(origins = "*")
@Controller
public class FileUploadController {
    private final StorageService storageService;
    String contentType;
    @Autowired
    public FileUploadController(StorageService storageService) {
        this.storageService = storageService;
    }


    @GetMapping("/files")
    @ResponseBody
    public List<String> listUploadedFiles() {
        return storageService.loadAll()
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename){
        Resource file = storageService.loadAsResource(filename);
        if (file == null) {
            return ResponseEntity.notFound().build();

        }

        contentType = URLConnection.guessContentTypeFromName(file.getFilename());
        if (contentType == null) {
            contentType = "application/ocet-stream";
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, contentType).header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);

    }
    @PostMapping("/upload")
    @ResponseBody
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file) {
        storageService.store(file);
        return ResponseEntity.ok("Uploaded: " + file.getOriginalFilename());
    }
    @DeleteMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<String> deleteFile(@PathVariable String filename) {
        storageService.delete(filename);
        return ResponseEntity.ok("Deleted : " + filename);
    }
    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
