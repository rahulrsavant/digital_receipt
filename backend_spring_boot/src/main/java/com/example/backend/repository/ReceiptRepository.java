package com.example.backend.repository;

import com.example.backend.entity.Receipt;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    List<Receipt> findByProject_CodeOrderByIdDesc(String projectCode);

    @EntityGraph(attributePaths = "items")
    Optional<Receipt> findByIdAndProject_Code(Long id, String projectCode);
}
