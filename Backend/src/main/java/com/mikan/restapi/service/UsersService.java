package com.mikan.restapi.service;

import com.mikan.restapi.entity.Users;
import com.mikan.restapi.model.user.request.CreateUserRequest;
import com.mikan.restapi.model.user.response.CreateUserResponse;
import com.mikan.restapi.model.user.response.GetUserResponse;
import com.mikan.restapi.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class UsersService {
    private final UsersRepository usersRepository;
    private final JwtService jwtService;

    public UsersService(UsersRepository usersRepository, JwtService jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }

    public GetUserResponse getUserById(String userId) {
        Users user = usersRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return GetUserResponse.builder()
                .userId(user.getId().toString())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public CreateUserResponse createUser(CreateUserRequest request) {
        Users user = new Users();
        user.setId(UUID.randomUUID());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user.setCreateAt(LocalDateTime.now());

        Users saved = usersRepository.save(user);
        UUID userId = saved.getId();
        String token = jwtService.generateJwt(userId.toString(), request.getEmail() , "BUYER");

        return CreateUserResponse.builder()
                .userId(saved.getId().toString())
                .token(token)
                .build();
    }

    public String genJWT(String userId){
        UUID uid = UUID.fromString(userId);
        return jwtService.generateJwt(userId.toString(), "example@gmail.com" , "BUYER");
    }

}


