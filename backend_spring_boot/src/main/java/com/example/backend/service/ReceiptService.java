package com.example.backend.service;

import com.example.backend.dto.ExtraFieldDefinition;
import com.example.backend.dto.ProjectSummaryResponse;
import com.example.backend.dto.PublicReceiptResponse;
import com.example.backend.dto.ReceiptItemRequest;
import com.example.backend.dto.ReceiptItemResponse;
import com.example.backend.dto.ReceiptRequest;
import com.example.backend.dto.ReceiptResponse;
import com.example.backend.dto.ReceiptSummaryResponse;
import com.example.backend.entity.PaymentMode;
import com.example.backend.entity.Project;
import com.example.backend.entity.Receipt;
import com.example.backend.entity.ReceiptItem;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.ReceiptRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReceiptService {

    private final ProjectRepository projectRepository;
    private final ReceiptRepository receiptRepository;
    private final ObjectMapper objectMapper;
    private final SigningService signingService;
    private final String publicBaseUrl;

    public ReceiptService(ProjectRepository projectRepository, ReceiptRepository receiptRepository,
                          ObjectMapper objectMapper, SigningService signingService,
                          @Value("${app.public.base-url}") String publicBaseUrl) {
        this.projectRepository = projectRepository;
        this.receiptRepository = receiptRepository;
        this.objectMapper = objectMapper;
        this.signingService = signingService;
        this.publicBaseUrl = publicBaseUrl;
    }

    @Transactional
    public ReceiptResponse createReceipt(ReceiptRequest request) {
        if (request.getProjectCode() == null || request.getProjectCode().isBlank()) {
            throw new IllegalArgumentException("Project code is required");
        }
        Project project = projectRepository.findByCodeForUpdate(request.getProjectCode())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        List<ExtraFieldDefinition> schema = readSchema(project.getReceiptExtraSchema());
        validateExtraData(schema, request.getExtraData());

        List<ReceiptItemRequest> items = request.getItems();
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("At least one item is required");
        }

        Receipt receipt = new Receipt();
        receipt.setProject(project);
        receipt.setDateTime(request.getDateTime() != null ? request.getDateTime() : LocalDateTime.now());
        receipt.setCustomerName(request.getCustomerName());
        receipt.setCustomerPhone(request.getCustomerPhone());
        receipt.setPaymentMode(parsePaymentMode(request.getPaymentMode()));

        BigDecimal subtotal = BigDecimal.ZERO;
        List<ReceiptItem> receiptItems = new ArrayList<>();
        for (ReceiptItemRequest itemRequest : items) {
            ReceiptItem item = new ReceiptItem();
            item.setReceipt(receipt);
            item.setItemName(requireValue(itemRequest.getItemName(), "Item name is required"));
            item.setQty(requireValue(itemRequest.getQty(), "Item qty is required"));
            item.setUnitPrice(requireValue(itemRequest.getUnitPrice(), "Item unit price is required"));
            BigDecimal lineTotal = item.getQty().multiply(item.getUnitPrice()).setScale(2, RoundingMode.HALF_UP);
            item.setLineTotal(lineTotal);
            subtotal = subtotal.add(lineTotal);
            receiptItems.add(item);
        }
        receipt.setItems(receiptItems);

        BigDecimal discount = defaultAmount(request.getDiscount());
        BigDecimal tax = defaultAmount(request.getTax());
        BigDecimal grandTotal = subtotal.subtract(discount).add(tax).setScale(2, RoundingMode.HALF_UP);

        receipt.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        receipt.setDiscount(discount);
        receipt.setTax(tax);
        receipt.setGrandTotal(grandTotal);
        receipt.setNotes(request.getNotes());
        receipt.setExtraData(writeExtraData(request.getExtraData()));

        long nextSeq = project.getReceiptSeq() + 1;
        project.setReceiptSeq(nextSeq);
        receipt.setReceiptNo(nextSeq);

        projectRepository.save(project);
        Receipt saved = receiptRepository.save(receipt);
        return toResponse(saved);
    }

    public List<ReceiptSummaryResponse> listReceipts(String projectCode) {
        if (projectCode == null || projectCode.isBlank()) {
            throw new IllegalArgumentException("Project code is required");
        }
        return receiptRepository.findByProject_CodeOrderByIdDesc(projectCode)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    public ReceiptResponse getReceipt(String projectCode, Long receiptId) {
        if (projectCode == null || projectCode.isBlank()) {
            throw new IllegalArgumentException("Project code is required");
        }
        Receipt receipt = receiptRepository.findByIdAndProject_Code(receiptId, projectCode)
                .orElseThrow(() -> new IllegalArgumentException("Receipt not found"));
        return toResponse(receipt);
    }

    public String generateShareLink(String projectCode, Long receiptId) {
        Receipt receipt = receiptRepository.findByIdAndProject_Code(receiptId, projectCode)
                .orElseThrow(() -> new IllegalArgumentException("Receipt not found"));
        String sign = signingService.sign(projectCode + ":" + receipt.getId());
        return String.format("%s/r/%s/%d?sign=%s", publicBaseUrl, projectCode, receipt.getId(), sign);
    }

    public PublicReceiptResponse getPublicReceipt(String projectCode, Long receiptId, String sign) {
        if (sign == null || sign.isBlank()) {
            throw new IllegalArgumentException("Signature is required");
        }
        String expected = signingService.sign(projectCode + ":" + receiptId);
        if (!expected.equals(sign)) {
            throw new IllegalArgumentException("Invalid signature");
        }
        Receipt receipt = receiptRepository.findByIdAndProject_Code(receiptId, projectCode)
                .orElseThrow(() -> new IllegalArgumentException("Receipt not found"));
        Project project = receipt.getProject();

        PublicReceiptResponse response = new PublicReceiptResponse();
        response.setProject(toProjectSummary(project));
        response.setReceipt(toResponse(receipt));
        response.setReceiptExtraSchema(readSchema(project.getReceiptExtraSchema()));
        return response;
    }

    private PaymentMode parsePaymentMode(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Payment mode is required");
        }
        try {
            return PaymentMode.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid payment mode");
        }
    }

    private <T> T requireValue(T value, String message) {
        if (value == null) {
            throw new IllegalArgumentException(message);
        }
        return value;
    }

    private BigDecimal defaultAmount(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private String writeExtraData(Map<String, Object> extraData) {
        if (extraData == null || extraData.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(extraData);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to serialize extra data", ex);
        }
    }

    private Map<String, Object> readExtraData(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (IOException ex) {
            throw new IllegalStateException("Invalid extra data JSON", ex);
        }
    }

    private List<ExtraFieldDefinition> readSchema(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<ExtraFieldDefinition>>() {});
        } catch (IOException ex) {
            throw new IllegalStateException("Invalid schema JSON", ex);
        }
    }

    private void validateExtraData(List<ExtraFieldDefinition> schema, Map<String, Object> extraData) {
        if ((extraData == null || extraData.isEmpty()) && (schema == null || schema.isEmpty())) {
            return;
        }
        if ((schema == null || schema.isEmpty()) && extraData != null && !extraData.isEmpty()) {
            throw new IllegalArgumentException("Extra data is not allowed for this project");
        }
        Map<String, ExtraFieldDefinition> schemaMap = schema.stream()
                .collect(java.util.stream.Collectors.toMap(ExtraFieldDefinition::getKey, s -> s));

        for (ExtraFieldDefinition def : schema) {
            if (def.isRequired() && (extraData == null || !extraData.containsKey(def.getKey()))) {
                throw new IllegalArgumentException("Missing required field: " + def.getKey());
            }
        }

        if (extraData == null) {
            return;
        }

        for (Map.Entry<String, Object> entry : extraData.entrySet()) {
            ExtraFieldDefinition def = schemaMap.get(entry.getKey());
            if (def == null) {
                throw new IllegalArgumentException("Unknown extra field: " + entry.getKey());
            }
            validateType(def, entry.getValue());
        }
    }

    private void validateType(ExtraFieldDefinition def, Object value) {
        if (value == null) {
            if (def.isRequired()) {
                throw new IllegalArgumentException("Required field is null: " + def.getKey());
            }
            return;
        }
        String type = def.getType() == null ? "string" : def.getType();
        switch (type) {
            case "string" -> {
                if (!(value instanceof String)) {
                    throw new IllegalArgumentException("Field " + def.getKey() + " must be string");
                }
            }
            case "number" -> {
                if (!(value instanceof Number)) {
                    throw new IllegalArgumentException("Field " + def.getKey() + " must be number");
                }
            }
            case "boolean" -> {
                if (!(value instanceof Boolean)) {
                    throw new IllegalArgumentException("Field " + def.getKey() + " must be boolean");
                }
            }
            case "date" -> {
                if (!(value instanceof String)) {
                    throw new IllegalArgumentException("Field " + def.getKey() + " must be date string");
                }
                try {
                    LocalDate.parse((String) value);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("Field " + def.getKey() + " must be ISO date");
                }
            }
            case "enum" -> {
                if (!(value instanceof String)) {
                    throw new IllegalArgumentException("Field " + def.getKey() + " must be string enum");
                }
                if (def.getOptions() == null || !def.getOptions().contains(value)) {
                    throw new IllegalArgumentException("Field " + def.getKey() + " must be one of " + def.getOptions());
                }
            }
            default -> throw new IllegalArgumentException("Unsupported field type: " + def.getType());
        }
    }

    private ReceiptResponse toResponse(Receipt receipt) {
        ReceiptResponse response = new ReceiptResponse();
        response.setId(receipt.getId());
        response.setReceiptNo(receipt.getReceiptNo());
        response.setDateTime(receipt.getDateTime());
        response.setCustomerName(receipt.getCustomerName());
        response.setCustomerPhone(receipt.getCustomerPhone());
        response.setPaymentMode(receipt.getPaymentMode().name());
        response.setSubtotal(receipt.getSubtotal());
        response.setDiscount(receipt.getDiscount());
        response.setTax(receipt.getTax());
        response.setGrandTotal(receipt.getGrandTotal());
        response.setNotes(receipt.getNotes());
        response.setExtraData(readExtraData(receipt.getExtraData()));
        List<ReceiptItemResponse> items = receipt.getItems().stream().map(item -> {
            ReceiptItemResponse itemResponse = new ReceiptItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setItemName(item.getItemName());
            itemResponse.setQty(item.getQty());
            itemResponse.setUnitPrice(item.getUnitPrice());
            itemResponse.setLineTotal(item.getLineTotal());
            return itemResponse;
        }).toList();
        response.setItems(items);
        return response;
    }

    private ReceiptSummaryResponse toSummary(Receipt receipt) {
        ReceiptSummaryResponse response = new ReceiptSummaryResponse();
        response.setId(receipt.getId());
        response.setReceiptNo(receipt.getReceiptNo());
        response.setDateTime(receipt.getDateTime());
        response.setGrandTotal(receipt.getGrandTotal());
        return response;
    }

    private ProjectSummaryResponse toProjectSummary(Project project) {
        ProjectSummaryResponse summary = new ProjectSummaryResponse();
        summary.setId(project.getId());
        summary.setCode(project.getCode());
        summary.setName(project.getName());
        summary.setLogoPath(project.getLogoPath());
        summary.setPrimaryColor(project.getPrimaryColor());
        summary.setSecondaryColor(project.getSecondaryColor());
        summary.setAddress(project.getAddress());
        summary.setPhone(project.getPhone());
        summary.setEmail(project.getEmail());
        summary.setFooterNote(project.getFooterNote());
        return summary;
    }
}
