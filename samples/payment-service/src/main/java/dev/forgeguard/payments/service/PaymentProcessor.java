package dev.forgeguard.payments.service;

public interface PaymentProcessor {
    PaymentResult charge(PaymentRequest request);
}

