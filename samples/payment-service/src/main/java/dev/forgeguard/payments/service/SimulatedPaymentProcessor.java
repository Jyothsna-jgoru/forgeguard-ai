package dev.forgeguard.payments.service;

import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class SimulatedPaymentProcessor implements PaymentProcessor {
    @Override
    public PaymentResult charge(PaymentRequest request) {
        return new PaymentResult("pay_" + UUID.randomUUID(), "AUTHORIZED");
    }
}

