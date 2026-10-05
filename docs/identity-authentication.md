# Managed authentication

Admin redirects to the independently managed Identity service. Keycloak supplies
the password, MFA, registration, and recovery flows; applications do not collect
passwords. Each application retains its own host-scoped session.

The TreeSeed login theme belongs to Identity and reuses the UI package's logo,
design tokens, and authentication styles. Deployment installs those exact
published assets read-only. Platform does not build or implement the theme.
Light/dark appearance currently follows the operating-system preference; saved
cross-application theme preferences are not yet synchronized.

## Registration and recovery policy

The installation's managed host configuration selects public registration:

```json
{
  "registrationAllowed": true,
  "resetPasswordAllowed": true,
  "mailTransport": "existing"
}
```

This is the Identity component's `configuration.authentication` value. The API's
`configuration.identityRuntime.registration.enabled` must match
`registrationAllowed`. Internal installations may set both registration flags
to false without disabling existing users' sign-in or password recovery.

`existing` preserves the configured SMTP credentials and requires an existing
TLS-enabled email transport before enabling registration or recovery. Supply
that transport through managed installation authority, never Platform Git.

For local staging only, `local-mailpit` selects the enabled Lab's mail capture
service. It does not deliver mail to a user's real inbox. Verification and reset
messages contain account-access links; treat the local mail viewer as privileged
test infrastructure. This transport is rejected for production.

New registration requires verified email before the API provisions a local
principal. Identity is keyed by issuer and subject, not email. A matching email
does not merge accounts or confer team membership, ownership, or administrator
permissions. Existing principal mappings remain unchanged.

Apply changes with `trsd host config plan` followed by `trsd host config apply`.
Registration is not activated merely by updating packages. Preserve the
coordinated application/database restore point; never restore an old
authentication writer onto incompatible migrated data.
