package dev.forgeguard.payments.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.forgeguard.payments.idempotency.IdempotencyConflictException;
import dev.forgeguard.payments.idempotency.InMemoryIdempotencyStore;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class PaymentServiceTest {
    @Mock private PaymentProcessor processor;
    private PaymentService service;
    private PaymentRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new PaymentService(processor, new InMemoryIdempotencyStore());
        request = new PaymentRequest("order-42", new BigDecimal("25.00"), "USD");
        when(processor.charge(request)).thenReturn(new PaymentResult("pay_42", "AUTHORIZED"));
    }

    @Test
    void processesFirstRequest() {
        assertThat(service.create("retry-key", request).paymentId()).isEqualTo("pay_42");
        verify(processor).charge(request);
    }

    @Test
    void replaysOriginalResultForEquivalentRetry() {
        PaymentResult first = service.create("retry-key", request);
        PaymentResult retry = service.create("retry-key", request);

        assertThat(retry).isEqualTo(first);
        verify(processor, times(1)).charge(request);
    }

    @Test
    void rejectsKeyReuseForDifferentPayload() {
        service.create("retry-key", request);
        PaymentRequest changedRequest = new PaymentRequest("order-42", new BigDecimal("50.00"), "USD");

        assertThatThrownBy(() -> service.create("retry-key", changedRequest))
                .isInstanceOf(IdempotencyConflictException.class);
        verify(processor, times(1)).charge(request);
    }
}

