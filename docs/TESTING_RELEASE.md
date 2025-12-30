# Testing Semantic-Release Setup

This guide will help you test all components of the semantic-release setup.

## Prerequisites

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Ensure you're on the `master` branch:**
   ```bash
   git checkout master
   git pull origin master
   ```

## 1. Test Commitlint (Local)

### Test with a valid commit message:
```bash
echo "feat: add new feature" | pnpm commitlint
```
✅ Should pass without errors

### Test with an invalid commit message:
```bash
echo "invalid commit message" | pnpm commitlint
```
❌ Should fail with validation errors

### Test the commit-msg hook:
```bash
# Create a test commit with invalid message (should be rejected)
git commit -m "invalid message"
```
❌ Should be rejected by the husky hook

```bash
# Create a test commit with valid message (should pass)
git commit -m "feat: test feature"
```
✅ Should pass and create the commit

## 2. Test Semantic-Release (Dry Run)

### Run semantic-release in dry-run mode:
```bash
pnpm release:dry-run
```

This will:
- ✅ Analyze your commits
- ✅ Determine the next version
- ✅ Show what would be released
- ✅ **NOT** create tags, releases, or commits

### Expected output:
- Shows the next version (e.g., `1.0.1`)
- Lists commits that would trigger a release
- Shows what files would be updated (CHANGELOG.md, package.json)

### Test with debug mode for more details:
```bash
pnpm test:release
```

## 3. Test the Full Workflow (CI)

### Option A: Test with a test commit (Recommended)

1. **Create a test commit with a valid conventional commit:**
   ```bash
   # Make a small change (e.g., update README)
   echo "# Test" >> TEST.md
   git add TEST.md
   git commit -m "feat: add test file"
   ```

2. **Push to master:**
   ```bash
   git push origin master
   ```

3. **Monitor the GitHub Actions workflow:**
   - Go to: `https://github.com/FaXaq/website/actions`
   - Watch the "Automatic Release" workflow
   - Check if it:
     - ✅ Runs semantic-release
     - ✅ Creates a new version (if commits warrant it)
     - ✅ Updates CHANGELOG.md
     - ✅ Creates a GitHub release
     - ✅ Builds Docker images (if a new release was created)

### Option B: Test with a non-release commit

1. **Create a commit that won't trigger a release:**
   ```bash
   echo "# Docs" >> DOCS.md
   git add DOCS.md
   git commit -m "docs: update documentation"
   git push origin master
   ```

2. **Expected behavior:**
   - ✅ Workflow runs
   - ✅ Semantic-release determines no release needed
   - ✅ No version bump
   - ✅ No Docker build (because no new release)

## 4. Verify Release Outputs

After a successful release, check:

### ✅ GitHub Release
- Go to: `https://github.com/FaXaq/website/releases`
- Should see a new release with:
  - Version tag (e.g., `v1.0.1`)
  - Release notes with emojis
  - Changelog content

### ✅ CHANGELOG.md
```bash
git pull origin master
cat CHANGELOG.md
```
- Should be updated with the new release
- Should include commit messages with emojis

### ✅ package.json
```bash
cat package.json | grep version
```
- Version should be updated (if a release was created)

### ✅ Docker Images
- Check: `https://github.com/FaXaq/website/pkgs/container/website_web`
- Check: `https://github.com/FaXaq/website/pkgs/container/website_server`
- Should have new tags with the version number

## 5. Test Different Commit Types

Test how different commit types affect versioning:

### Patch Release (1.0.0 → 1.0.1):
```bash
git commit -m "fix: fix bug in authentication"
```

### Minor Release (1.0.0 → 1.1.0):
```bash
git commit -m "feat: add user profile page"
```

### Major Release (1.0.0 → 2.0.0):
```bash
git commit -m "feat!: redesign authentication system"
# or
git commit -m "feat: new feature

BREAKING CHANGE: API endpoints have changed"
```

### No Release:
```bash
git commit -m "docs: update README"
git commit -m "chore: update dependencies"
git commit -m "style: format code"
```

## 6. Troubleshooting

### Commitlint not working?
```bash
# Check if husky is installed
ls -la .husky/

# Reinstall husky hooks
pnpm prepare
```

### Semantic-release not detecting commits?
```bash
# Check if you're on the right branch
git branch

# Check commit history
git log --oneline -10

# Run with debug mode
pnpm test:release
```

### Docker build not running?
- Check if semantic-release actually created a release
- Verify the workflow logs in GitHub Actions
- Check if `new_release` output is `true`

## 7. Quick Test Checklist

- [ ] Commitlint validates commit messages locally
- [ ] Husky hook blocks invalid commits
- [ ] Semantic-release dry-run shows expected version
- [ ] Pushing a `feat:` commit triggers a minor release
- [ ] Pushing a `fix:` commit triggers a patch release
- [ ] Pushing a `docs:` commit doesn't trigger a release
- [ ] CHANGELOG.md is updated after release
- [ ] GitHub release is created with notes
- [ ] Docker images are built and pushed

## 8. Safe Testing on a Feature Branch

If you want to test without affecting master:

1. **Create a test branch:**
   ```bash
   git checkout -b test/semantic-release
   ```

2. **Test commitlint:**
   ```bash
   git commit -m "feat: test feature"
   ```

3. **Test semantic-release dry-run:**
   ```bash
   pnpm release:dry-run
   ```

4. **Don't push to master** - just verify locally that everything works!

