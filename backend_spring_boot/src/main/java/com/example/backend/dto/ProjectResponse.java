package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {
    private Long id;
    private String code;
    private String name;
    private String logoPath;
    private String primaryColor;
    private String secondaryColor;
    private String address;
    private String phone;
    private String email;
    private String footerNote;
    private Boolean isActive;
    private List<ExtraFieldDefinition> receiptExtraSchema;
    private Long receiptSeq;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getSecondaryColor() {
        return secondaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFooterNote() {
        return footerNote;
    }

    public void setFooterNote(String footerNote) {
        this.footerNote = footerNote;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<ExtraFieldDefinition> getReceiptExtraSchema() {
        return receiptExtraSchema;
    }

    public void setReceiptExtraSchema(List<ExtraFieldDefinition> receiptExtraSchema) {
        this.receiptExtraSchema = receiptExtraSchema;
    }

    public Long getReceiptSeq() {
        return receiptSeq;
    }

    public void setReceiptSeq(Long receiptSeq) {
        this.receiptSeq = receiptSeq;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
