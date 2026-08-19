package dev.forgeguard.payments.idempotency;

import dev.forgeguard.payments.service.PaymentResult;

public record IdempotencyEntry(String fingerprint, PaymentResult result) {
    public PaymentResult replayFor(String requestedFingerprint) {
        if (!fingerprint.equals(requestedFingerprint)) {
            throw new IdempotencyConflictException();
        }
        return result;
    }
}

