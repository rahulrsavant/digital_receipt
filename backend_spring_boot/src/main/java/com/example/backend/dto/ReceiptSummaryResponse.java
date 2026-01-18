package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReceiptSummaryResponse {
    private Long id;
    private Long receiptNo;
    private LocalDateTime dateTime;
    private BigDecimal grandTotal;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReceiptNo() {
        return receiptNo;
    }

    public void setReceiptNo(Long receiptNo) {
        this.receiptNo = receiptNo;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }
}
