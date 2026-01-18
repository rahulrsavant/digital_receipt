package com.example.backend.controller;

import com.example.backend.dto.ReceiptRequest;
import com.example.backend.dto.ReceiptResponse;
import com.example.backend.dto.ReceiptSummaryResponse;
import com.example.backend.service.ReceiptService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @PostMapping
    public ReceiptResponse createReceipt(@RequestBody ReceiptRequest request) {
        return receiptService.createReceipt(request);
    }

    @GetMapping
    public List<ReceiptSummaryResponse> listReceipts(@RequestParam("projectCode") String projectCode) {
        return receiptService.listReceipts(projectCode);
    }

    @GetMapping("/{id}")
    public ReceiptResponse getReceipt(@PathVariable Long id, @RequestParam("projectCode") String projectCode) {
        return receiptService.getReceipt(projectCode, id);
    }

    @GetMapping("/{id}/share-link")
    public String getShareLink(@PathVariable Long id, @RequestParam("projectCode") String projectCode) {
        return receiptService.generateShareLink(projectCode, id);
    }
}
