package com.example.demo.repositories;

import com.example.demo.models.Project;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Project findProjectById(Long id);

    Project findProjectByName(String name);

    List<Project> findProjectByOwnerUser(User ownerUser);

    Project findProjectByOwnerUserAndName(User ownerUser, String name);
}