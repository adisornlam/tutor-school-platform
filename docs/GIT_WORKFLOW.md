# 🔀 Git Workflow Guide

## 📋 Branch Strategy

### Branch Structure

```
main (production)
  └── dev (development)
```

### Branch Purposes

- **`main`**: Production-ready code
  - Stable, tested code
  - Deployed to production
  - Only merge from `dev` after testing

- **`dev`**: Development branch
  - Active development
  - Integration testing
  - Feature development

## 🚀 Workflow

### 1. Starting Development

```bash
# Switch to dev branch
git checkout dev

# Pull latest changes
git pull origin dev

# Create feature branch from dev
git checkout -b feature/your-feature-name
```

### 2. Making Changes

```bash
# Make your changes
# ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature description"
```

### 3. Merging to Dev

```bash
# Push feature branch
git push origin feature/your-feature-name

# Switch to dev
git checkout dev

# Merge feature branch
git merge feature/your-feature-name

# Push to dev
git push origin dev
```

### 4. Merging Dev to Main (Release)

```bash
# Switch to main
git checkout main

# Pull latest main
git pull origin main

# Merge dev into main
git merge dev

# Tag release (optional)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push to main
git push origin main
git push origin --tags
```

## 📝 Commit Message Convention

ใช้ [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
git commit -m "feat: add payment methods management"
git commit -m "fix: resolve build error with shared types"
git commit -m "docs: update deployment guide"
git commit -m "refactor: improve enrollment API structure"
```

## 🔄 Daily Workflow

### Start of Day

```bash
# Switch to dev
git checkout dev

# Pull latest changes
git pull origin dev

# Create feature branch
git checkout -b feature/daily-task-name
```

### End of Day / Before Deploying

```bash
# Commit all changes
git add .
git commit -m "feat: complete daily tasks"

# Push to feature branch
git push origin feature/daily-task-name

# Merge to dev (if ready)
git checkout dev
git merge feature/daily-task-name
git push origin dev
```

## 🚨 Best Practices

1. **Always work on feature branches**, never directly on `dev` or `main`
2. **Pull before push** to avoid conflicts
3. **Write clear commit messages**
4. **Test before merging to dev**
5. **Review code before merging to main**
6. **Keep dev branch up to date**

## 📦 Branch Protection (Recommended)

สำหรับ GitHub/GitLab สามารถตั้งค่า branch protection rules:

- **main**: Require pull request reviews, require status checks
- **dev**: Require pull request (optional), allow force push (for development)

---

*Last updated: 2025-01-20*

