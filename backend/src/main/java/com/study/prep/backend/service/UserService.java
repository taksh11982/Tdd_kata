package com.study.prep.backend.service;

import com.study.prep.backend.dto.AuthResponse;
import com.study.prep.backend.dto.LoginRequest;
import com.study.prep.backend.dto.RegisterRequest;

public interface UserService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
