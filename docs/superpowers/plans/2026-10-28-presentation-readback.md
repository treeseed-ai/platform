# Bounded presentation read-back plan

Issue #796 now has exact evidence: submission succeeds, then a read-only application exchange fails
at `base-application-readback` in the frozen Deployment .76 cohort. The existing presentation wait
allows four minutes for terminal readiness but currently aborts on a single transport failure.

Keep the existing deadline and 100ms polling interval. Retry only the fixed
`SERVICE_WORKER_EXCHANGE_FAILED` error while observing that already-submitted application. Never
repeat apply, extend/reset the deadline, accept files as readiness, or retry a blocker/unknown error.
Every successful observation still comes through the real owner client. Return terminal records
immediately; existing assertions must reject failed/cancelled/non-ready records. A response arriving
after the deadline cannot succeed. Expiry retains the last exchange failure or a fixed deadline
error. Error aggregation and the fifteen-second process cleanup bound remain unchanged.

Sequence: this documentation → built controls for pending, transient, fatal, failed, disconnected
and late replies → development-only read-back helper and fixture wiring → strict policy/compiler,
regression and genuine hosted UI gates. Permanent coverage belongs in tests/regression; support
programs have no registrations. Frozen archives and all original acceptance assertions remain.

This qualifies eventual presentation readiness, not the latency of every worker request during
activation. Owner responsiveness remains separately observable. All issues remain open; real
Work/model execution stays Task 10.
