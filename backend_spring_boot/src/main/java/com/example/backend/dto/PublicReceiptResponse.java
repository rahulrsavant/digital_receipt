package com.example.backend.dto;

import java.util.List;

public class PublicReceiptResponse {
    private ProjectSummaryResponse project;
    private ReceiptResponse receipt;
    private List<ExtraFieldDefinition> receiptExtraSchema;

    public ProjectSummaryResponse getProject() {
        return project;
    }

    public void setProject(ProjectSummaryResponse project) {
        this.project = project;
    }

    public ReceiptResponse getReceipt() {
        return receipt;
    }

    public void setReceipt(ReceiptResponse receipt) {
        this.receipt = receipt;
    }

    public List<ExtraFieldDefinition> getReceiptExtraSchema() {
        return receiptExtraSchema;
    }

    public void setReceiptExtraSchema(List<ExtraFieldDefinition> receiptExtraSchema) {
        this.receiptExtraSchema = receiptExtraSchema;
    }
}
