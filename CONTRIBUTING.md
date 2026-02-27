# Contributing to Predictsports

Thank you for your interest in contributing to Predictsports! We welcome contributions from developers, data scientists, and sports enthusiasts who want to help build the future of AI-powered sports prediction.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose
- Git & GitHub account

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/YOUR_USERNAME/predictsports.git
cd predictsports
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/improvement-area
```

3. **Install Dependencies**
```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# Engine
cd engine && pip install -r requirements.txt && cd ..
```

4. **Setup Local Environment**
Create `.env.local` files in backend, frontend, and engine with required variables (see `.env.example` files)

5. **Start Development**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Engine
cd engine && python src/main.py

# Terminal 4: Database (if using Docker)
docker-compose up -d postgres redis
```

## Development Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/topic` - Documentation updates
- `refactor/area` - Code refactoring
- `perf/optimization` - Performance improvements
- `test/area` - Test additions/improvements

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring without feature/fix changes
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build scripts, CI configuration, etc.
- `style` - Code style changes (formatting, etc.)

**Scope (optional):**
- `backend` - Fastify backend changes
- `frontend` - Next.js frontend changes
- `engine` - Python engine changes
- `db` - Database schema/migrations
- `api` - External API integration
- `docker` - Docker configuration

**Examples:**
```
feat(backend): add ensemble prediction scoring

fix(frontend): resolve dashboard loading state issues

docs(api): expand API documentation with examples

refactor(engine): optimize feature engineering pipeline

test(backend): add unit tests for prediction validation
```

### Code Style

#### TypeScript/JavaScript
- Use ESLint: `npm run lint`
- Format with Prettier (configured in eslint)
- Type everything - no implicit `any`
- Write unit tests with Vitest

#### Python
- Follow PEP 8
- Use type hints
- Run pylint: `pylint src/`
- Write unit tests with pytest

### Testing Requirements

- **Backend**: New features require unit tests
  ```bash
  cd backend && npm test
  ```
- **Frontend**: Components should have snapshot tests
  ```bash
  cd frontend && npm test
  ```
- **Engine**: All models must have test coverage
  ```bash
  cd engine && pytest tests/
  ```

### Pull Request Process

1. **Before Creating PR:**
   - Pull latest `main` branch
   - Run tests locally: `npm test` / `pytest tests/`
   - Check linting: `npm run lint`
   - Build successfully: `npm run build` or `python build`

2. **Create Pull Request:**
   - Use the PR template (automatically provided)
   - Reference related issues: "Fixes #123" or "Relates to #456"
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Keep PR scope focused (one feature/fix per PR when possible)

3. **PR Title Format:**
   ```
   [Type] Brief description
   
   Examples:
   [Feature] Add ensemble prediction model
   [Fix] Correct fixture API normalization
   [Docs] Update deployment guide
   [Refactor] Optimize database queries
   ```

4. **PR Description Template:**
   ```markdown
   ## Description
   Brief description of the changes.

   ## Motivation
   Why these changes are needed.

   ## Changes Made
   - Change 1
   - Change 2
   - Change 3

   ## Related Issues
   Fixes #123

   ## Testing
   How to test these changes:
   1. Step 1
   2. Step 2

   ## Screenshots (if applicable)
   [Attach screenshots for UI changes]

   ## Checklist
   - [ ] Tests pass locally
   - [ ] New tests added/updated
   - [ ] Documentation updated
   - [ ] No breaking changes
   - [ ] Commit messages follow convention
   ```

5. **Merge Strategy:**
   - Squash and merge for single-commit features
   - Rebase and merge for multi-part refactors
   - Create merge commit for releases

## Areas for Contribution

### High Priority
- [ ] Expand prediction model accuracy
- [ ] Add more data source providers
- [ ] Improve error handling and resilience
- [ ] Performance optimization
- [ ] Mobile responsive improvements

### Medium Priority
- [ ] Additional gamification features (badges, achievements)
- [ ] Advanced filtering and sorting
- [ ] Historical data analysis views
- [ ] Community leaderboards

### Documentation
- [ ] API documentation expansion
- [ ] Architecture diagrams
- [ ] Deployment guides
- [ ] Model documentation
- [ ] Troubleshooting guides

### Testing
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Load testing
- [ ] Security testing

## Reporting Issues

### Bug Reports
Include:
- OS and environment details
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs

### Feature Requests
Include:
- Use case description
- Proposed solution
- Alternative solutions
- Additional context

## Questions?

- Open a discussion on GitHub
- Check existing issues for similar topics
- Review documentation in `/docs` folder

## Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes for major contributions
- Eligible for maintainer status after consistent contributions

Thank you for building Predictsports! 🚀
