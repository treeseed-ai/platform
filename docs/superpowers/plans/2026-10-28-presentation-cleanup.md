# Presentation failure custody implementation plan

**Goal:** Preserve the primary assembled-presentation error and every cleanup failure (#796).

**Architecture:** A development-only lifecycle class executes the scenario and each named cleanup
step exactly once. It rethrows a lone error unchanged and aggregates multiple errors in occurrence
order. Process ownership checks remain strict. The assembly's touched orchestration and cleanup
boundaries become short named methods; exact archives, assertions and time budgets stay unchanged.

**Verification:** First run a built public fixture control that fails without the lifecycle helper.
Cover success, primary-only, cleanup-only and combined failures, and prove later cleanup still runs.
Then implement the helper and refactor assembly stages. Run strict compilation, layout/readability
checks and the control; run genuine assembled UI acceptance in hosted CI. Diagnose the retained
first failure before claiming reliability. This correction grants no runtime or identity changes.

**Sequence:** documentation commit → built-program regression → lifecycle and assembly refactor →
owner checks and exact-head hosted acceptance → bounded review candidate targeting Cordis.

All issues remain open. Work/model execution stays deferred to Task 10.
