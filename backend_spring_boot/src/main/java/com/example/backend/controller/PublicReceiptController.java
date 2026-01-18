package com.example.backend.controller;

import com.example.backend.dto.PublicReceiptResponse;
import com.example.backend.service.ReceiptService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/receipt")
public class PublicReceiptController {

    private final ReceiptService receiptService;

    public PublicReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @GetMapping("/{projectCode}/{receiptId}")
    public PublicReceiptResponse getPublicReceipt(
            @PathVariable String projectCode,
            @PathVariable Long receiptId,
            @RequestParam("sign") String sign
    ) {
        return receiptService.getPublicReceipt(projectCode, receiptId, sign);
    }
}
