package dev.forgeguard.payments.idempotency;

public class IdempotencyConflictException extends RuntimeException {
    public IdempotencyConflictException() {
        super("Idempotency key was reused with a different request fingerprint.");
    }
}

