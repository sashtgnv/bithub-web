package com.example.demo.services;

import com.example.demo.repositories.CommitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CommitService {

    private final CommitRepository repository;


}
