# Contributing to JL Dev Environment

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Guidelines for contributing to this repository

---

## Welcome

Thank you for considering contributing to the JL Dev Environment Golden Master! This document provides guidelines for contributing.

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the work, not the person
- Help others learn and grow

---

## How to Contribute

### Reporting Issues

1. Check existing issues first to avoid duplicates
2. Use the issue templates provided
3. Include:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - macOS version and hardware
   - Relevant logs or screenshots

### Suggesting Enhancements

1. Open an issue with the "Feature Request" template
2. Describe the use case and benefit
3. Consider backward compatibility

### Submitting Changes

1. Fork the repository (external contributors) or create a branch (team members)
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## Branch Naming

Use descriptive branch names:

```
feature/add-terraform-support
fix/bootstrap-java-path
docs/update-quickstart
chore/update-extensions
```

---

## Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `chore`: Maintenance tasks
- `refactor`: Code refactoring
- `test`: Adding tests

**Examples:**
```
feat(bootstrap): add Python 3.12 installation
fix(validate): correct gcloud project check
docs(quickstart): add GCP authentication steps
chore(extensions): update to latest versions
```

---

## Pull Request Process

1. **Title:** Use conventional commit format
2. **Description:** Fill out the PR template completely
3. **Tests:** Run `./scripts/validate.sh` and confirm all pass
4. **Review:** Request review from maintainers
5. **Merge:** Squash and merge after approval

### PR Checklist

- [ ] Code follows existing style
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated
- [ ] VERSION bumped if applicable
- [ ] All validation checks pass

---

## Version Numbering

We use Semantic Versioning (SemVer):

- **MAJOR** (1.x.x): Breaking changes
- **MINOR** (x.1.x): New features, backward compatible
- **PATCH** (x.x.1): Bug fixes, backward compatible

---

## File Standards

All files should include a header:

```bash
# ============================================================================
# File Name - Brief Description
# ============================================================================
# Version:     1.0.0
# Updated:     YYYY-MM-DD
# Purpose:     What this file does
# ============================================================================
```

For Markdown files:
```markdown
# Title

Version: 1.0.0
Last Updated: YYYY-MM-DD
Purpose: What this document covers
```

---

## Testing Changes

Before submitting:

1. Run the bootstrap script on a clean environment (if possible)
2. Run validation: `./scripts/validate.sh`
3. Test any affected functionality manually
4. Verify documentation accuracy

---

## Getting Help

- Open an issue for questions
- Tag @charleymm for urgent matters
- Check existing docs first

---

## Recognition

Contributors will be recognized in:
- CHANGELOG.md (for specific contributions)
- README.md (for significant contributions)

---

Thank you for contributing!

