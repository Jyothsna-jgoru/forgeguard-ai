package dev.forgeguard.payments.service;

import dev.forgeguard.payments.idempotency.IdempotencyStore;
import dev.forgeguard.payments.idempotency.RequestFingerprint;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    private final PaymentProcessor processor;
    private final IdempotencyStore idempotencyStore;

    public PaymentService(PaymentProcessor processor, IdempotencyStore idempotencyStore) {
        this.processor = processor;
        this.idempotencyStore = idempotencyStore;
    }

    public PaymentResult create(String key, PaymentRequest request) {
        String fingerprint = RequestFingerprint.of(request);
        return idempotencyStore.find(key)
                .map(entry -> entry.replayFor(fingerprint))
                .orElseGet(() -> processOnce(key, fingerprint, request));
    }

    private PaymentResult processOnce(String key, String fingerprint, PaymentRequest request) {
        PaymentResult result = processor.charge(request);
        idempotencyStore.save(key, fingerprint, result);
        return result;
    }
}

