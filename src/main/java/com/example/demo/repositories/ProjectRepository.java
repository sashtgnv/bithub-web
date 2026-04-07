package com.example.demo.repositories;

import com.example.demo.models.Project;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Project findProjectById(Long id);

    List<Project> findProjectsByOwner(User ownerUser);

    Project findProjectByNameAndOwner(String name, User owner);

    // Список репозиториев пользователя
    List<Project> findByOwnerOrderByCreatedAtDesc(User owner);

    // Публичные репозитории для каталога
    List<Project> findByIsPublicTrueOrderByCreatedAtDesc();

    // Проверка уникальности имени
    boolean existsByNameAndOwner(String name, User owner);
}