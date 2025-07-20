# Personal Growth Dashboard - Testing Guide

## Overview

This testing suite provides comprehensive coverage for the Personal Growth Dashboard application, including unit tests, integration tests, and end-to-end (E2E) tests using Selenium WebDriver.

## Test Structure

```
tests/
├── e2e-comprehensive.test.js     # Selenium E2E tests
src/
├── setupTests.ts                 # Jest configuration
├── components/
│   ├── forms/__tests__/
│   │   └── morning-form.test.tsx
│   └── dashboard/__tests__/
│       └── session-card.test.tsx
└── lib/__tests__/
    └── store.test.ts
```

## Available Test Commands

### Quick Start
```bash
# Run all tests (unit + E2E)
npm test

# Run only unit tests (faster)
npm run test:quick

# Run only E2E tests
npm run test:e2e

# Run unit tests only
npm run test:unit

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Runner Options
```bash
# Use the custom test runner directly
node test-runner.js              # Full test suite
node test-runner.js --quick      # Unit tests only
node test-runner.js --e2e        # E2E tests only
node test-runner.js --help       # Show help
```

## Test Categories

### 1. Unit Tests

**Location**: `src/**/__tests__/`

**Coverage**:
- Form components (validation, submission, user interaction)
- State management (Zustand store)
- UI components (session cards, progress indicators)
- Utility functions

**Technologies**: Jest, React Testing Library

### 2. End-to-End Tests

**Location**: `tests/e2e-comprehensive.test.js`

**Coverage**:
- Page load and navigation
- Authentication flow
- Form interactions (all 4 daily sessions)
- Dashboard component functionality
- Data persistence
- Responsive design
- Accessibility features
- Error handling
- Performance testing

**Technologies**: Selenium WebDriver, Chrome/Firefox

## Test Features

### 🚀 Comprehensive E2E Testing

The E2E test suite includes:

1. **Page Load & Navigation**
   - Main dashboard loading
   - Session card display
   - Settings page navigation

2. **Authentication Flow**
   - Sign-in/sign-up process
   - Demo mode functionality
   - Session management

3. **Form Testing**
   - Morning form (wake time, focus/energy ratings, gratitude)
   - Midday form interactions
   - Evening form validation
   - Bedtime form submission

4. **Dashboard Components**
   - Progress rings visualization
   - Stats cards display
   - Heatmap calendar interactions
   - Streak counter functionality
   - Achievement badges

5. **Data Management**
   - Form data persistence
   - Demo mode data generation
   - Local storage handling

6. **Responsive Design**
   - Mobile viewport testing
   - Theme switching
   - Touch interactions

7. **Error Handling**
   - Invalid form inputs
   - Network error simulation
   - Edge case scenarios

8. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader compatibility
   - Heading structure

9. **Performance**
   - Page load timing
   - Concurrent user interactions
   - Resource optimization

### 🧪 Unit Test Features

- **Form Validation**: Tests all form fields, validation rules, and error messages
- **State Management**: Comprehensive store testing including persistence and demo mode
- **Component Behavior**: User interactions, prop handling, and state changes
- **Mocking**: Proper mocking of external dependencies (Supabase, Next.js router)

## Setup Requirements

### Dependencies Installed
- `selenium-webdriver`: E2E browser automation
- `chromedriver` & `geckodriver`: Browser drivers
- `jest`: JavaScript testing framework
- `@testing-library/react`: React component testing utilities
- `@testing-library/jest-dom`: Additional Jest matchers
- `@testing-library/user-event`: User interaction simulation
- `ts-jest`: TypeScript support for Jest
- `node-fetch`: HTTP requests for health checks

### Browser Requirements
- Chrome (recommended for E2E tests)
- Firefox (alternative browser support)

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Ensure Chrome or Firefox is installed
3. Start development server for E2E tests: `npm run dev`

### Test Execution Flow

1. **Type Checking**: `npm run type-check`
2. **Linting**: `npm run lint`
3. **Unit Tests**: Jest runs all `.test.tsx?` files
4. **E2E Tests**: 
   - Starts development server on port 3000
   - Launches browser (headless by default)
   - Runs comprehensive user journey tests
   - Cleans up server and browser

### Debugging Tests

**E2E Test Debugging**:
```javascript
// In e2e-comprehensive.test.js, remove headless mode:
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Comment this line
```

**Unit Test Debugging**:
```bash
npm run test:watch  # Interactive watch mode
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- TypeScript support with `ts-jest`
- JSDOM environment for React components
- Module path mapping (`@/` -> `src/`)
- Setup files for mocks and utilities

### Mock Configuration (`src/setupTests.ts`)
- Next.js router mocking
- Supabase client mocking
- ResizeObserver and matchMedia polyfills
- Global test utilities

## CI/CD Integration

The test suite is designed for CI/CD environments:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm ci
    npm run test:quick  # Unit tests only in CI
    npm run build       # Ensure build works
```

For full E2E testing in CI, use headless browsers and consider using services like GitHub Actions with Chrome installed.

## Test Coverage

### Current Coverage Areas
- ✅ Form validation and submission
- ✅ State management and persistence
- ✅ Component rendering and interactions
- ✅ Authentication flows
- ✅ Dashboard functionality
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Error handling

### Future Enhancements
- API endpoint testing
- Database integration testing
- Email notification testing
- Third-party service integration testing
- Performance regression testing
- Visual regression testing

## Troubleshooting

### Common Issues

1. **Server not starting**: Ensure port 3000 is available
2. **Browser not found**: Install Chrome/Firefox or update paths
3. **Test timeouts**: Increase timeout values in test configuration
4. **Mock failures**: Check mock implementations in `setupTests.ts`

### Debug Commands
```bash
# Check server health
curl http://localhost:3000

# Verbose test output
npm run test:e2e -- --verbose

# Run specific test
npx jest morning-form.test.tsx
```

## Contributing

When adding new features:

1. **Add unit tests** for new components
2. **Update E2E tests** for new user flows
3. **Update this documentation** with new test scenarios
4. **Ensure all tests pass** before submitting PRs

### Test Writing Guidelines

- Use descriptive test names
- Test both happy path and error cases
- Mock external dependencies appropriately
- Include accessibility testing
- Add performance considerations for complex features

## Performance Benchmarks

- Page load: < 10 seconds
- Form submission: < 3 seconds
- Navigation: < 2 seconds
- Test suite completion: < 5 minutes (full), < 30 seconds (unit only)

---

**Note**: This testing infrastructure provides a solid foundation for ensuring the Personal Growth Dashboard works reliably across different browsers, devices, and usage scenarios. Regular test execution helps maintain code quality and user experience.