package com.example.demo.repositories;

import com.example.demo.models.Commit;
import com.example.demo.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommitRepository extends JpaRepository<Commit, Long> {

    // История коммитов репозитория (от новых к старым)
    List<Commit> findByProjectOrderByCreatedAtDesc(Project repository);

    // Поиск по хешу
    Commit findByHash(String commitHash);

    // Последний коммит репозитория
    Commit findTopByProjectOrderByCreatedAtDesc(Project repository);

}
