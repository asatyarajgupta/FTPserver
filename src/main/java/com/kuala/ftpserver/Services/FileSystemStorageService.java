package com.kuala.ftpserver.Services;

import com.kuala.ftpserver.StorageException;
import com.kuala.ftpserver.StorageFileNotFoundException;
import com.kuala.ftpserver.StorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;

@Service
public class FileSystemStorageService implements StorageService {
    private final Path rootLocation;
    @Autowired
    public FileSystemStorageService(StorageProperties properties){
        if(properties.getLocation().trim().length() == 0){
            throw new StorageException("File upload location cannot be empty");
        }
        this.rootLocation = Paths.get(properties.getLocation());
    }
    @Override
    public void store(MultipartFile file){
        try {
            if(file.isEmpty()) {
                throw new StorageException("file cannot be empty son");
            }
            Path destinationFile = this.rootLocation.resolve(Paths.get(file.getOriginalFilename())).normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new StorageException("Cannot store file outside the current directory");
            }
            try(InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
        }
        catch (IOException e) {
            throw new StorageException("Something went wrong son", e);
        }
    }
    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .filter(path -> Files.isRegularFile(path))
                    .map(this.rootLocation::relativize);

        } catch (IOException e) {
            throw new StorageException("Something went wrong son", e);
        }
    }
    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }
    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException(
                        "Could not read file" + filename);
            }
        } catch (IOException e) {
            throw new StorageException("Something went wrong son", e);

        }
    }
    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }
    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e){
            throw new StorageException("Something went wrong son", e);

        }
    }

}
