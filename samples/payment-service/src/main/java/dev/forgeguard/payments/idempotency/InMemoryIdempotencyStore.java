package dev.forgeguard.payments.idempotency;

import dev.forgeguard.payments.service.PaymentResult;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class InMemoryIdempotencyStore implements IdempotencyStore {
    private final Map<String, IdempotencyEntry> entries = new ConcurrentHashMap<>();

    @Override
    public Optional<IdempotencyEntry> find(String key) {
        return Optional.ofNullable(entries.get(key));
    }

    @Override
    public void save(String key, String fingerprint, PaymentResult result) {
        entries.putIfAbsent(key, new IdempotencyEntry(fingerprint, result));
    }
}

