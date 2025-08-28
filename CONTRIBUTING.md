# Contributing to Charger Insights

Thank you for your interest in contributing to Charger Insights! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](.github/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/charger-insights.git
   cd charger-insights
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/commercialevs/charger-insights.git
   ```

## Development Setup

### Installation

```bash
# Install dependencies
npm install

# Install demo dependencies
cd demo && npm install && cd ..

# Copy API key template
cp API.txt.example API.txt
# Edit API.txt with your NREL API key
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the library
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run storybook` - Start Storybook
- `npm run storybook:build` - Build Storybook

## Making Changes

### Branch Naming

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(api): add new search endpoint`
- `fix(ui): resolve map rendering issue`
- `docs(readme): update installation instructions`
- `test(components): add unit tests for ChargerFinder`

### File Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── types/              # TypeScript type definitions
└── index.ts            # Main export file
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies
- Aim for high test coverage

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });

  it('should handle errors gracefully', () => {
    // Test implementation
  });
});
```

## Pull Request Process

1. **Create a Pull Request** from your feature branch to `main`
2. **Fill out the PR template** completely
3. **Ensure all checks pass**:
   - Linting
   - Type checking
   - Tests
   - Build
4. **Request review** from maintainers
5. **Address feedback** and make requested changes
6. **Squash commits** if requested
7. **Wait for approval** and merge

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code has been performed
- [ ] Code has been commented, especially in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings
- [ ] Tests have been added that prove the fix is effective or feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## Release Process

### Creating a Release

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features/fixes
3. **Create a tag**:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```
4. **GitHub Actions** will automatically:
   - Run tests
   - Build the library
   - Publish to npm
   - Create a GitHub release

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

### Bug Report Template

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots (if applicable)
- Console logs (if applicable)

## Requesting Features

### Feature Request Template

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Acceptance criteria

## Getting Help

- **Documentation**: Check the [README.md](README.md) and [API documentation](docs/)
- **Issues**: Search existing [issues](https://github.com/commercialevs/charger-insights/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/commercialevs/charger-insights/discussions)

## License

By contributing to Charger Insights, you agree that your contributions will be licensed under the [MIT License](LICENSE).

Thank you for contributing! 🚀
