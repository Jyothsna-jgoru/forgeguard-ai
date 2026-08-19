import { BookOpenCheck, Bot, Braces, FileSearch, FlaskConical, Route, ShieldCheck } from 'lucide-react'
import type { AgentStep, PolicyEvent } from '../types'

export const demoTicket = {
  key: 'PAY-1842',
  title: 'Add idempotency validation to the payment-processing API and cover retry behavior with unit tests.',
  description: 'Prevent duplicate payment processing when clients retry POST /api/payments. Accept a caller-supplied Idempotency-Key, replay the original response for matching retries, and reject conflicting payloads that reuse the same key.',
  risk: 'Medium',
  service: 'payment-service',
  owner: 'Payments Platform',
  acceptance: [
    'Require an Idempotency-Key header for payment creation requests.',
    'Return the original response when the same key and payload are retried.',
    'Return HTTP 409 when a key is reused with a different payload.',
    'Cover new, repeated, and conflicting request paths with unit tests.',
    'Avoid logging payment details or exposing key values in error responses.',
  ],
}

export const implementationPlan = [
  { title: 'Define the request contract', detail: 'Require Idempotency-Key at the controller boundary and map conflicts to a stable 409 response.' },
  { title: 'Add guarded result storage', detail: 'Persist a request fingerprint and original response behind an IdempotencyStore abstraction.' },
  { title: 'Protect service execution', detail: 'Resolve cached retries before calling the payment processor and reject fingerprint mismatches.' },
  { title: 'Prove retry behavior', detail: 'Add focused unit tests for first execution, equivalent retry, and conflicting reuse.' },
]

export const ragContext = [
  { source: 'API Reliability Standard §4.2', score: '0.94', text: 'Mutation endpoints that support retries must bind an idempotency key to a canonical request fingerprint and original result.' },
  { source: 'Secure Logging Policy §3.1', score: '0.89', text: 'Identifiers used for replay protection may be correlated internally but must not be written verbatim to application logs.' },
  { source: 'Payment Service Guide §2.6', score: '0.86', text: 'Controller tests should verify HTTP semantics; service tests should verify the processor is invoked at most once per logical request.' },
]

export const agentSteps: AgentStep[] = [
  {
    id: 'planner', name: 'Planner Agent', role: 'workflow.planner', icon: Route, accent: 'blue', status: 'completed', elapsed: '0.8s',
    input: 'Ticket PAY-1842, acceptance criteria, repository profile',
    reasoning: 'The change crosses the HTTP contract, service orchestration, and retry semantics. The plan isolates storage behind an interface and keeps conflict handling explicit.',
    outputs: ['4-step implementation plan', 'Medium-risk classification', 'Human review checkpoint'],
    tool: 'standards.search', decision: 'allowed', decisionReason: 'Planner role may query approved engineering guidance.',
  },
  {
    id: 'analyst', name: 'Repository Analyst', role: 'repository.analyst', icon: FileSearch, accent: 'teal', status: 'completed', elapsed: '1.1s',
    input: 'Implementation plan, repository index, retrieved standards',
    reasoning: 'PaymentController owns request semantics while PaymentService controls processor calls. Existing tests already use Mockito and JUnit 5.',
    outputs: ['4 impacted files', 'Spring Boot conventions', 'No database migration required'],
    tool: 'repository.read', decision: 'allowed', decisionReason: 'Read-only access is granted to the scoped sample repository.',
  },
  {
    id: 'code', name: 'Code Agent', role: 'code.author', icon: Braces, accent: 'violet', status: 'completed', elapsed: '1.7s',
    input: 'Scoped files, plan, repository conventions, policy context',
    reasoning: 'A concurrent in-memory store is sufficient for the sample. Fingerprinting the canonical request prevents silent replay of a different payment.',
    outputs: ['Controller header validation', 'IdempotencyStore abstraction', 'Service retry guard', '+74 / −6 proposed lines'],
    tool: 'workspace.propose_patch', decision: 'allowed', decisionReason: 'Patch generation is confined to a disposable review workspace.',
  },
  {
    id: 'test', name: 'Test Agent', role: 'quality.validator', icon: FlaskConical, accent: 'teal', status: 'completed', elapsed: '2.4s',
    input: 'Proposed patch, test inventory, acceptance criteria',
    reasoning: 'The critical invariant is one processor call for equivalent retries. Conflict behavior must be verified independently from the happy path.',
    outputs: ['12 checks passed', '3 focused retry tests added', 'No network or external services used'],
    tool: 'test.run', decision: 'allowed', decisionReason: 'Allowlisted Maven unit-test command passed schema and sandbox checks.',
  },
  {
    id: 'security', name: 'Security & Policy Review', role: 'security.reviewer', icon: ShieldCheck, accent: 'amber', status: 'completed', elapsed: '1.0s',
    input: 'Patch, validation report, tool audit stream, threat context',
    reasoning: 'No sensitive value is logged and repository scope is respected. PR creation changes external state, so the workflow must stop for approval.',
    outputs: ['No critical findings', '1 residual concurrency note', 'Approval required for draft PR'],
    tool: 'policy.evaluate', decision: 'allowed', decisionReason: 'Security reviewer may evaluate every recorded tool request.',
  },
  {
    id: 'docs', name: 'Documentation Agent', role: 'documentation.writer', icon: BookOpenCheck, accent: 'blue', status: 'completed', elapsed: '0.7s',
    input: 'Plan, proposed diff, test results, policy review',
    reasoning: 'The review package should foreground behavior, verification evidence, and the in-memory store limitation without overstating readiness.',
    outputs: ['Engineering summary', 'Draft PR title and body', 'Reviewer checklist'],
    tool: 'artifact.write', decision: 'allowed', decisionReason: 'Documentation output is restricted to the workflow artifact store.',
  },
  {
    id: 'approval', name: 'Approval Gate', role: 'human.approver', icon: Bot, accent: 'violet', status: 'approval', elapsed: 'waiting',
    input: 'Complete review package and requested external action',
    reasoning: 'All automated checks are complete. A human must explicitly authorize the simulated draft PR transition.',
    outputs: ['Review package ready', 'Draft PR request staged'],
    tool: 'github.create_draft_pr', decision: 'approval_required', decisionReason: 'External mutation is never granted to an autonomous agent.',
  },
]

export const policyEvents: PolicyEvent[] = [
  { id: 'evt_01J8Y10K', time: '09:42:11.208', agent: 'Repository Analyst', role: 'repository.analyst', tool: 'repository.read', arguments: '{ scope: "samples/payment-service", path: "src/**" }', result: 'allowed', reason: 'Read-only operation matches role and repository scope.', approval: 'Not required' },
  { id: 'evt_01J8Y13M', time: '09:42:14.091', agent: 'Test Agent', role: 'quality.validator', tool: 'test.run', arguments: '{ suite: "unit", timeout_seconds: 120 }', result: 'allowed', reason: 'Allowlisted suite, bounded timeout, isolated workspace.', approval: 'Not required' },
  { id: 'evt_01J8Y18P', time: '09:42:18.734', agent: 'Documentation Agent', role: 'documentation.writer', tool: 'github.create_draft_pr', arguments: '{ base: "main", draft: true, files: 4 }', result: 'approval_required', reason: 'External state change requires human authorization.', approval: 'Required' },
  { id: 'evt_01J8Y20R', time: '09:42:20.116', agent: 'Code Agent', role: 'code.author', tool: 'deployment.production', arguments: '{ service: "payment-service", version: "proposed" }', result: 'blocked', reason: 'Production deployment is outside demo policy for every agent role.', approval: 'Not eligible' },
  { id: 'evt_01J8Y21S', time: '09:42:21.403', agent: 'Repository Analyst', role: 'repository.analyst', tool: 'secrets.read', arguments: '{ name: "payment_provider_token" }', result: 'blocked', reason: 'Secret retrieval is prohibited and no adapter is registered.', approval: 'Not eligible' },
]

export const proposedFiles = [
  { path: 'src/main/java/com/forgeguard/payments/api/PaymentController.java', change: '+8 −2', reason: 'Requires the retry key at the HTTP boundary and returns a stable conflict response.' },
  { path: 'src/main/java/com/forgeguard/payments/service/PaymentService.java', change: '+28 −3', reason: 'Replays equivalent requests and prevents duplicate processor calls.' },
  { path: 'src/main/java/com/forgeguard/payments/idempotency/IdempotencyStore.java', change: '+25', reason: 'Separates replay state from orchestration so storage can evolve independently.' },
  { path: 'src/test/java/com/forgeguard/payments/service/PaymentServiceTest.java', change: '+41 −1', reason: 'Covers new, repeated, and conflicting idempotency-key behavior.' },
]

export const diffLines = [
  { type: 'meta', text: 'diff --git a/src/main/java/com/forgeguard/payments/service/PaymentService.java b/src/main/java/com/forgeguard/payments/service/PaymentService.java' },
  { type: 'meta', text: '@@ -18,12 +18,34 @@ public class PaymentService {' },
  { type: 'context', old: '18', next: '18', text: '  private final PaymentProcessor processor;' },
  { type: 'add', old: '', next: '19', text: '  private final IdempotencyStore idempotencyStore;' },
  { type: 'context', old: '19', next: '20', text: '' },
  { type: 'remove', old: '20', next: '', text: '  public PaymentResult create(PaymentRequest request) {' },
  { type: 'remove', old: '21', next: '', text: '    return processor.charge(request);' },
  { type: 'add', old: '', next: '21', text: '  public PaymentResult create(String key, PaymentRequest request) {' },
  { type: 'add', old: '', next: '22', text: '    String fingerprint = RequestFingerprint.of(request);' },
  { type: 'add', old: '', next: '23', text: '    return idempotencyStore.find(key)' },
  { type: 'add', old: '', next: '24', text: '        .map(entry -> entry.replayFor(fingerprint))' },
  { type: 'add', old: '', next: '25', text: '        .orElseGet(() -> processOnce(key, fingerprint, request));' },
  { type: 'context', old: '22', next: '26', text: '  }' },
  { type: 'add', old: '', next: '27', text: '' },
  { type: 'add', old: '', next: '28', text: '  private PaymentResult processOnce(String key, String fingerprint,' },
  { type: 'add', old: '', next: '29', text: '      PaymentRequest request) {' },
  { type: 'add', old: '', next: '30', text: '    PaymentResult result = processor.charge(request);' },
  { type: 'add', old: '', next: '31', text: '    idempotencyStore.save(key, fingerprint, result);' },
  { type: 'add', old: '', next: '32', text: '    return result;' },
  { type: 'add', old: '', next: '33', text: '  }' },
  { type: 'meta', text: 'diff --git a/src/test/java/com/forgeguard/payments/service/PaymentServiceTest.java b/src/test/java/com/forgeguard/payments/service/PaymentServiceTest.java' },
  { type: 'meta', text: '@@ -42,3 +42,24 @@ class PaymentServiceTest {' },
  { type: 'add', old: '', next: '43', text: '  @Test' },
  { type: 'add', old: '', next: '44', text: '  void replaysOriginalResultForEquivalentRetry() {' },
  { type: 'add', old: '', next: '45', text: '    var first = service.create("retry-key", request);' },
  { type: 'add', old: '', next: '46', text: '    var retry = service.create("retry-key", request);' },
  { type: 'add', old: '', next: '47', text: '' },
  { type: 'add', old: '', next: '48', text: '    assertThat(retry).isEqualTo(first);' },
  { type: 'add', old: '', next: '49', text: '    verify(processor, times(1)).charge(request);' },
  { type: 'add', old: '', next: '50', text: '  }' },
  { type: 'add', old: '', next: '51', text: '' },
  { type: 'add', old: '', next: '52', text: '  @Test' },
  { type: 'add', old: '', next: '53', text: '  void rejectsKeyReuseForDifferentPayload() {' },
  { type: 'add', old: '', next: '54', text: '    service.create("retry-key", request);' },
  { type: 'add', old: '', next: '55', text: '    assertThatThrownBy(() -> service.create("retry-key", changedRequest))' },
  { type: 'add', old: '', next: '56', text: '        .isInstanceOf(IdempotencyConflictException.class);' },
  { type: 'add', old: '', next: '57', text: '  }' },
] as const

export const prPackage = {
  title: 'feat(payments): validate idempotency keys for payment retries',
  branch: 'demo/pay-1842-idempotency-validation',
  summary: 'Adds request fingerprinting and result replay so equivalent payment retries return the original response without calling the processor again. Reusing a key with a different payload returns a conflict.',
  checks: ['12 unit checks passed', 'Policy review passed', 'Sensitive logging check passed', 'Human approval recorded'],
}
