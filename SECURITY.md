# Security Policy

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Security guidelines and vulnerability reporting

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |
| < 1.0   | ❌ No     |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email the maintainer directly: [contact team lead]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you on remediation.

---

## Security Best Practices

### Credentials

**NEVER commit:**
- API keys or tokens
- Passwords or secrets
- Private keys (*.pem, *.key)
- OAuth credentials
- Service account files

**Always use:**
- Environment variables for secrets
- `.env` files (gitignored)
- GitHub Secrets for CI/CD
- GCP Secret Manager for production

### .gitignore Protection

This repo's `.gitignore` excludes:
```
.env
.env.local
*.pem
*.key
*credentials*.json
*secret*
```

### Authentication

- Use `gcloud auth` for GCP (not service account keys locally)
- Use `gh auth` for GitHub (not personal access tokens)
- Rotate tokens periodically
- Use short-lived credentials when possible

---

## Secrets Management

### Local Development

Store secrets in `.env` (never committed):
```bash
# .env (gitignored)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### CI/CD (GitHub Actions)

Use GitHub repository secrets:
1. Go to Settings > Secrets and variables > Actions
2. Add secrets there
3. Reference in workflows: `${{ secrets.SECRET_NAME }}`

---

## Audit Checklist

Before committing, verify:

- [ ] No hardcoded credentials
- [ ] No API keys in code
- [ ] .env files are gitignored
- [ ] Sensitive configs use templates (*.template)
- [ ] No production URLs in committed code

---

## Incident Response

If credentials are accidentally committed:

1. **Immediately** rotate the exposed credential
2. Remove from git history (contact maintainer)
3. Audit for unauthorized access
4. Document the incident

---

## Contact

Security concerns: Contact @charleymm or team lead directly.

