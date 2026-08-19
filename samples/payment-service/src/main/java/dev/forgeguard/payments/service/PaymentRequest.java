package dev.forgeguard.payments.service;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record PaymentRequest(
        @NotBlank String merchantReference,
        @Positive BigDecimal amount,
        @NotBlank String currency) {}

