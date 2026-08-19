package dev.forgeguard.payments.idempotency;

import dev.forgeguard.payments.service.PaymentRequest;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public final class RequestFingerprint {
    private RequestFingerprint() {}

    public static String of(PaymentRequest request) {
        String canonical = "%s|%s|%s".formatted(
                request.merchantReference(), request.amount().stripTrailingZeros(), request.currency());
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(canonical.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 must be available", exception);
        }
    }
}

