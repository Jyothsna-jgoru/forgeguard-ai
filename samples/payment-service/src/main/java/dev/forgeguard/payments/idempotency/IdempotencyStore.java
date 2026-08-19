package dev.forgeguard.payments.idempotency;

import dev.forgeguard.payments.service.PaymentResult;
import java.util.Optional;

public interface IdempotencyStore {
    Optional<IdempotencyEntry> find(String key);
    void save(String key, String fingerprint, PaymentResult result);
}

