# Contributing to Warhammer 40K Calculator

First off, thank you for considering contributing to the Warhammer 40K Calculator! It's people like you that make this tool a great resource for the Warhammer 40K community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all skill levels
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- Basic knowledge of Angular and TypeScript

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/Wh40kcalculator.git
   cd Wh40kcalculator
   ```

3. Add the upstream repository:

   ```bash
   git remote add upstream https://github.com/Jorge-GD/Wh40kcalculator.git
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## How Can I Contribute?

### 🐛 Reporting Bugs

When filing an issue, make sure to answer these questions:

1. What version of the application are you using?
2. What browser and operating system are you using?
3. What did you do?
4. What did you expect to see?
5. What did you see instead?

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### 🔧 Code Contributions

#### Types of Contributions We're Looking For

- **Bug fixes**: Help us squash those pesky bugs
- **Feature implementations**: New Warhammer 40K rules and mechanics
- **Performance improvements**: Make calculations faster and more efficient
- **UI/UX enhancements**: Improve the user experience
- **Documentation**: Help improve our docs
- **Tests**: Increase test coverage

#### Areas of Interest

- **Combat Rules**: New weapon types, special abilities, army-specific rules
- **User Interface**: Better mobile experience, accessibility improvements
- **Performance**: Optimization of calculation algorithms
- **Testing**: Unit tests, integration tests, end-to-end tests
- **Themes**: New visual themes and styling improvements

## Development Process

### Branching Strategy

- `main` - Production-ready code
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Workflow

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit Your Changes**

   ```bash
   git commit -m "feat: add new combat protocol calculation"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**
   - Fill out the pull request template
   - Link any related issues
   - Provide a clear description of changes

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**

```
feat(calculator): add sustained hits protocol
fix(ui): correct theme toggle button alignment
docs(readme): update installation instructions
test(services): add unit tests for calculation service
```

## Style Guidelines

### TypeScript/Angular Code

- Use TypeScript strict mode
- Follow Angular style guide
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Prefer composition over inheritance
- Keep components focused and single-purpose

### Code Formatting

We use Prettier and ESLint for code formatting:

```bash
# Check for lint issues
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Component Structure

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit {
  // Public properties first
  public title = 'Feature Title';

  // Private properties
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly service: FeatureService) {}

  ngOnInit(): void {
    // Initialization logic
  }

  // Public methods
  public onAction(): void {
    // Method implementation
  }

  // Private methods
  private calculateResult(): number {
    // Implementation
  }
}
```

### SCSS/CSS Guidelines

- Use CSS custom properties for theming
- Follow BEM methodology for class naming
- Use semantic class names
- Keep specificity low
- Use mixins for repeated patterns

```scss
// Good
.calculator-panel {
  background-color: var(--color-panel-bg);

  &__header {
    padding: var(--spacing-md);
  }

  &__content {
    @include flex-column;
  }
}

// Avoid
.panel {
  background: #333;
}
```

## Testing Guidelines

### Unit Tests

- Write tests for all public methods
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

```typescript
describe('CalculationService', () => {
  let service: CalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationService);
  });

  it('should calculate hit probability correctly for skill 3+', () => {
    // Arrange
    const skill = 3;
    const expected = 4 / 6;

    // Act
    const result = service.calculateHitProbability(skill);

    // Assert
    expect(result).toBeCloseTo(expected, 2);
  });
});
```

### Test Coverage

- Aim for 80%+ code coverage
- Focus on business logic and edge cases
- Test error conditions and boundary values

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run specific test file
ng test --include="**/calculator.service.spec.ts"
```

## Documentation Guidelines

### Code Documentation

- Document all public APIs
- Include examples in JSDoc comments
- Explain complex algorithms
- Document assumptions and limitations

````typescript
/**
 * Calculates the probability of successful hits for a given weapon profile.
 *
 * @param attacks - Number of attacks (supports dice notation like "2D6")
 * @param skill - Weapon skill value (2-6)
 * @param modifiers - Optional hit modifiers
 * @returns Hit probability as a decimal between 0 and 1
 *
 * @example
 * ```typescript
 * const hitChance = calculateHits("4", 3, { reroll: 'ones' });
 * console.log(hitChance); // 0.722 (approximately)
 * ```
 */
public calculateHits(attacks: string, skill: number, modifiers?: HitModifiers): number {
  // Implementation
}
````

### README Updates

When adding new features, update the README to include:

- Feature description
- Usage examples
- Configuration options
- Any breaking changes

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord**: [Join our community](https://discord.gg/warhammer40k) (if available)

### Recognition

Contributors are recognized in:

- GitHub contributor list
- Release notes for significant contributions
- Special mentions for major features

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

### Release Schedule

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Quarterly for significant changes

---

Thank you for contributing to the Warhammer 40K Calculator! Together, we're building the best mathhammer tool for the Warhammer 40K community.

**For the Emperor!** ⚔️
