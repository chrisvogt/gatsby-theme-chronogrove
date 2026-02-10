# Contributing to Gatsby Theme Chrisvogt

Thank you for your interest in contributing to Gatsby Theme Chris Vogt! This document provides guidelines and information for contributors.

> [!NOTE]
> The current name is to let people know _this is my personal blog and website_, but I am totally open to others reusing this theme for other projects. Want to reuse my theme? Help me make it easier to reuse and contribute to the code. Let's build something great together. And yes, we can change the name. Have any suggestions?

## 🤝 How to Contribute

We welcome contributions of all kinds:

- 🧹 **Theme decoupling** - Help me decouple the theme from my personal website
- 🐛 **Bug reports** - Help us identify and fix issues
- 💡 **Feature requests** - Suggest new features or improvements
- 📝 **Documentation** - Improve docs, add examples, fix typos
- 🔧 **Code contributions** - Submit pull requests for bug fixes or features
- 🧪 **Testing** - Add tests or improve test coverage

> [!NOTE]
> Right now, **theme decoupling** is the most important piece someone can help with. If you would like to use this theme for your own project, please help me migrate any hard-coded content out of the /theme directory and into /www.chrisvogt.me.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Yarn >= 4.0.0
- Git

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/gatsby-theme-chronogrove.git
   cd gatsby-theme-chronogrove
   ```

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Set up HTTPS development** (optional but recommended)

   ```bash
   # Install mkcert
   brew install mkcert  # macOS
   # or
   sudo apt install mkcert  # Linux

   # Generate certificates
   mkcert www.dev-chrisvogt.me

   # Move to certs directory
   mkdir -p www.chrisvogt.me/certs
   mv www.dev-chrisvogt.me-key.pem www.chrisvogt.me/certs/
   mv www.dev-chrisvogt.me.pem www.chrisvogt.me/certs/
   ```

4. **Start development server**
   ```bash
   yarn develop
   ```

## 📋 Development Guidelines

### Code Style

- **JavaScript/JSX**: Follow the existing code style
- **Formatting**: Use Prettier (configured in the project)
- **Linting**: ESLint rules are enforced
- **Naming**: Use descriptive names for variables, functions, and components

### Testing

- **Write tests** for new features and bug fixes
- **Update tests** when modifying existing functionality
- **Run tests** before submitting PRs:
  ```bash
  yarn test
  yarn test:coverage
  ```

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat(widgets): add new Instagram widget`
- `fix(theme): resolve dark mode toggle issue`
- `content(footer): replace default footer text`
- `docs(readme): update installation instructions`

Types:

- `feat`: New feature
- `fix`: Bug fix
- `content`: Updates to theme or blog content
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, well-documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   yarn test
   yarn build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Link any related issues
   - Include screenshots for UI changes

## 🎯 Areas for Contribution

### Highest Priority

- **🧹 Theme decoupling** - Help migrate hard-coded personal content from `/theme` to `/www.chrisvogt.me`
  - Extract personal information from components like `home-header-content.js` and `h-card.js`
  - Remove hard-coded URLs and domains from theme files
  - Make components configurable through site metadata
  - Update test data to use generic examples instead of personal data
  - This is the most important contribution for making the theme reusable by others

### High Priority

- **Bug fixes** - Any issues marked as "bug" in the issue tracker
- **Documentation improvements** - Clarifying unclear docs or adding examples
- **Test coverage** - Adding tests for untested components

### Medium Priority

- **Performance improvements** - Optimizing build times, bundle size, or runtime performance
- **Accessibility improvements** - Making the theme more accessible
- **New widgets** - Adding support for additional social platforms

### Low Priority

- **Styling improvements** - Minor visual enhancements
- **Code refactoring** - Improving code organization without changing functionality

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details**:
   - Operating system
   - Node.js version
   - Yarn version
   - Browser (if applicable)
5. **Screenshots** (if visual issue)
6. **Error messages** (if any)

## 💡 Suggesting Features

When suggesting features:

1. **Describe the feature** clearly
2. **Explain the use case** - why is this feature needed?
3. **Consider implementation** - how might this be implemented?
4. **Check existing issues** - has this been requested before?

## 📚 Documentation

### Adding Documentation

- **Widget documentation**: Add README.md files in widget directories
- **API documentation**: Document new APIs and configuration options
- **Examples**: Provide working examples for new features

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI components
- Keep documentation up to date with code changes

## 🧪 Testing Guidelines

### Writing Tests

- **Test components** in isolation
- **Test user interactions** (clicks, form submissions, etc.)
- **Test edge cases** and error conditions
- **Use descriptive test names**

### Test Structure

```javascript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test rendering
  })

  it('should handle user interactions', () => {
    // Test interactions
  })

  it('should handle edge cases', () => {
    // Test edge cases
  })
})
```

## 🚀 Release Process

Releases are managed by the maintainers. When your PR is merged:

1. **Version bump** - The maintainer will bump the version
2. **Changelog update** - Changes will be documented in CHANGELOG.md
3. **Release** - A new release will be published to npm

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **BlueSky**: [@chrisvogt.me](https://bsky.app/profile/chrisvogt.me) for quick questions

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** - For significant contributions
- **CHANGELOG.md** - For all contributions
- **GitHub contributors** - Automatic recognition

Thank you for contributing to Gatsby Theme Chrisvogt! 🎉
