# PROJECT_GUARDRAILS.md - Project Constraints and Rules

Version: 1.1.0
Last Updated: 2025-12-09
Purpose: Define constraints, rules, and boundaries for development work

---

## Overview

This document defines the guardrails for all development work on the JL Dev Environment Golden Master. Both human developers and AI assistants should follow these rules to maintain project integrity.

---

## ⚠️ Critical Constraints

### 1. Standard Project Path Convention

**On ANY local device, all AI/dev projects should follow this folder structure:**

```
~/dev/ai-agents-and-apps-dev/PROJECT_NAME/
```

**Path breakdown:**
| Segment | Description |
|---------|-------------|
| `~` | User home directory |
| `dev/` | Development folder |
| `ai-agents-and-apps-dev/` | AI projects parent folder |
| `PROJECT_NAME/` | Specific project folder |

**Current project path:**
```
~/dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0/
```

### 2. Workspace Boundaries

**Allowed:**
- All files within `~/dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0/`

**Not Allowed:**
- Modifying files outside this workspace
- Using legacy paths like `~/Projects/` (deprecated)
- Creating symlinks to external directories
- Referencing user home directories without parameterization

### 3. First Check Before Any Session

**Before starting ANY work, verify workspace location:**

```bash
# Quick verification
[[ "$PWD" == *"dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0"* ]] && echo "✓ Correct" || echo "✗ Wrong path!"
```

This check is enforced in:
- `CLAUDE.md` - AI assistant context
- `scripts/validate.sh` - Environment validation
- `dashboard/server.js` - Repository monitoring

### 2. No Hardcoded Credentials

**Never commit:**
- API keys or tokens
- Passwords or secrets
- Personal email addresses
- OAuth client secrets
- Webhook URLs

**Use instead:**
- Environment variables
- `.env` files (gitignored)
- Template files with placeholders
- GCP Secret Manager (for production)

### 3. File Creation Rules

**Before creating new files:**
- Check if functionality already exists
- Follow existing naming conventions
- Add version headers to all source files
- Ensure file is not gitignored if it should be tracked

---

## Development Standards

### Code Style

| Language | Standard |
|----------|----------|
| JavaScript | ES2022+, Node.js 22 conventions |
| Shell/Bash | POSIX-compatible, shellcheck clean |
| JSON | 2-space indentation, sorted keys |
| Markdown | ATX headings, fenced code blocks |

### Version Headers

All source files should include:

```
/**
 * File Name - Brief Description
 * ============================================================================
 * Version:     X.Y.Z
 * Updated:     YYYY-MM-DD
 * Purpose:     What this file does
 * ============================================================================
 */
```

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: fix a bug
docs: documentation changes
style: formatting, no code change
refactor: code restructure
test: add tests
chore: maintenance tasks
```

---

## Dependency Management

### Adding Dependencies

**Before adding:**
1. Check if existing dependency can fulfill the need
2. Review package for security vulnerabilities
3. Prefer well-maintained, widely-used packages
4. Document why the dependency was added

**Dashboard (Node.js):**
- Production deps in `dependencies`
- Dev tools in `devDependencies`
- Pin exact versions when stability matters

### Updating Dependencies

- Run security audit: `npm audit`
- Test thoroughly after updates
- Document breaking changes

---

## Security Rules

### Sensitive Data

| Data Type | Handling |
|-----------|----------|
| API Keys | Environment variables only |
| Passwords | Never store, use OAuth |
| User Data | Anonymize in logs |
| Tokens | Short-lived, refresh as needed |

### File Permissions

- Scripts: `chmod 755` (executable)
- Config files: `chmod 644` (readable)
- Secret templates: `chmod 600` (owner only)

---

## Testing Requirements

### Before Committing

1. Run validation: `./scripts/validate.sh`
2. Test affected functionality manually
3. Check for linter errors
4. Verify no sensitive data exposed

### Dashboard Changes

1. Start dashboard: `./scripts/utils/dashboard.sh`
2. Verify all API endpoints respond
3. Check console for errors
4. Test on multiple browsers if UI changes

---

## Documentation Requirements

### When to Update Docs

- Adding new features → Update README, CLAUDE.md
- Changing APIs → Update relevant docs
- Fixing bugs → Update CHANGELOG.md
- Completing sessions → Update ACCOMPLISHMENTS.md

### Documentation Files

| File | Update When |
|------|-------------|
| `README.md` | Major features, setup changes |
| `QUICKSTART.md` | Onboarding process changes |
| `CLAUDE.md` | AI assistant context changes |
| `TODO.md` | Task completion, new priorities |
| `CHANGELOG.md` | Any notable change |
| `ACCOMPLISHMENTS.md` | End of session |

---

## Performance Guidelines

### Dashboard

- API responses < 3 seconds
- Page load < 2 seconds
- Auto-refresh interval: 30 seconds (configurable)
- Timeout external commands after 5 seconds

### Scripts

- Provide progress feedback for long operations
- Handle interrupts gracefully (Ctrl+C)
- Exit with appropriate codes (0 success, 1+ failure)

---

## Compatibility

### Target Environment

- macOS 14.0+ (Sonoma)
- Apple Silicon (M1/M2/M3)
- Cursor IDE 0.43+
- Node.js 22 LTS
- Docker Desktop 4.x

### Browser Support (Dashboard)

- Chrome 120+
- Safari 17+
- Firefox 120+

---

## Maintenance Windows

### Safe to Modify

- Documentation files
- UI/CSS changes
- New utility scripts
- Test files

### Requires Extra Care

- `scripts/bootstrap.sh` - Core setup script
- `scripts/validate.sh` - Validation logic
- `dashboard/server.js` - API endpoints
- Configuration templates

---

## Escalation

### When to Ask for Human Review

- Security-related changes
- Breaking changes to APIs
- Modifications to bootstrap script
- Changes affecting multiple team members

---

## Future Adjustments

This document will be updated as the project evolves. Key areas to refine:

- [ ] Add specific linting rules
- [ ] Define test coverage requirements
- [ ] Add deployment guardrails
- [ ] Specify code review requirements
- [ ] Add performance benchmarks

---

*Last reviewed: 2025-12-09*

