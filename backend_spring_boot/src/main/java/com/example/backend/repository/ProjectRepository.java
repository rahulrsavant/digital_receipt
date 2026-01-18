package com.example.backend.repository;

import com.example.backend.entity.Project;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByCode(String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Project p where p.code = :code")
    Optional<Project> findByCodeForUpdate(@Param("code") String code);
}
