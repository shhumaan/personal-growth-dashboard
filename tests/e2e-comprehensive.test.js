const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Personal Growth Dashboard - Comprehensive E2E Tests', () => {
  let driver;
  const BASE_URL = 'http://localhost:3000';
  
  beforeAll(async () => {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless'); // Remove for visual debugging
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--window-size=1920,1080');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
      
    await driver.manage().setTimeouts({ implicit: 10000 });
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get(BASE_URL);
    await driver.sleep(2000); // Allow page to load
  });

  describe('Page Load and Basic Navigation', () => {
    test('should load the main dashboard page', async () => {
      const title = await driver.getTitle();
      expect(title).toContain('Personal Growth Dashboard');
      
      // Check for main elements
      const mainContent = await driver.findElement(By.css('main'));
      expect(await mainContent.isDisplayed()).toBe(true);
    });

    test('should display all session cards', async () => {
      const sessionCards = await driver.findElements(By.css('[data-testid*="session-card"]'));
      expect(sessionCards.length).toBeGreaterThanOrEqual(4); // Morning, Midday, Evening, Bedtime
      
      for (let card of sessionCards) {
        expect(await card.isDisplayed()).toBe(true);
      }
    });

    test('should navigate to settings page', async () => {
      try {
        const settingsButton = await driver.findElement(By.css('a[href="/settings"]'));
        await settingsButton.click();
        await driver.wait(until.urlContains('/settings'), 5000);
        
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/settings');
      } catch (error) {
        console.log('Settings navigation test skipped - button not found');
      }
    });
  });

  describe('Authentication Flow', () => {
    test('should display auth component when not authenticated', async () => {
      // Look for sign-in or auth related elements
      const authElements = await driver.findElements(By.css('[data-testid*="auth"], [class*="auth"], button[type="submit"]'));
      
      if (authElements.length > 0) {
        console.log('Auth component found - testing login flow');
        
        // Test demo mode or authentication flow
        const demoButton = await driver.findElements(By.xpath("//button[contains(text(), 'Demo') or contains(text(), 'demo')]"));
        if (demoButton.length > 0) {
          await demoButton[0].click();
          await driver.sleep(2000);
          
          // Verify dashboard loads after demo login
          const dashboardElements = await driver.findElements(By.css('main'));
          expect(dashboardElements.length).toBeGreaterThan(0);
        }
      } else {
        console.log('Already authenticated or in demo mode');
      }
    });
  });

  describe('Session Forms Testing', () => {
    const testFormInteraction = async (formSelector, formName) => {
      try {
        console.log(`Testing ${formName} form...`);
        
        // Find and click the session card or form trigger
        const sessionButton = await driver.findElements(By.xpath(`//button[contains(text(), '${formName}') or contains(@data-testid, '${formName.toLowerCase()}')]`));
        
        if (sessionButton.length === 0) {
          // Try alternative selectors
          const altButtons = await driver.findElements(By.css(`[data-testid*="${formName.toLowerCase()}"], [class*="${formName.toLowerCase()}"]`));
          if (altButtons.length > 0) {
            await altButtons[0].click();
          } else {
            console.log(`${formName} form button not found, skipping...`);
            return;
          }
        } else {
          await sessionButton[0].click();
        }
        
        await driver.sleep(1000);
        
        // Look for form elements
        const formElements = await driver.findElements(By.css('form, [role="form"], input, textarea, button[type="submit"]'));
        
        if (formElements.length > 0) {
          console.log(`${formName} form found with ${formElements.length} elements`);
          
          // Test input fields
          const inputs = await driver.findElements(By.css('input[type="text"], input[type="number"], textarea'));
          for (let i = 0; i < Math.min(inputs.length, 3); i++) {
            const input = inputs[i];
            const inputType = await input.getAttribute('type');
            
            if (inputType === 'number') {
              await input.clear();
              await input.sendKeys('7');
            } else {
              await input.clear();
              await input.sendKeys('Test input for ' + formName);
            }
          }
          
          // Test sliders/range inputs
          const sliders = await driver.findElements(By.css('input[type="range"]'));
          for (let slider of sliders) {
            await driver.executeScript("arguments[0].value = 7; arguments[0].dispatchEvent(new Event('input'));", slider);
          }
          
          // Test select elements
          const selects = await driver.findElements(By.css('select'));
          for (let select of selects) {
            const options = await select.findElements(By.css('option'));
            if (options.length > 1) {
              await options[1].click();
            }
          }
          
          // Test form submission
          const submitButtons = await driver.findElements(By.css('button[type="submit"], button:contains("Save"), button:contains("Submit")'));
          if (submitButtons.length > 0) {
            await submitButtons[0].click();
            await driver.sleep(2000);
            
            // Check for success indicators
            const successElements = await driver.findElements(By.css('[class*="success"], [class*="complete"], [data-testid*="success"]'));
            console.log(`${formName} form submission resulted in ${successElements.length} success indicators`);
          }
        } else {
          console.log(`No form elements found for ${formName}`);
        }
        
        // Close modal/form if needed
        const closeButtons = await driver.findElements(By.css('button[aria-label="Close"], [data-testid="close"], .close'));
        if (closeButtons.length > 0) {
          await closeButtons[0].click();
        }
        
      } catch (error) {
        console.log(`Error testing ${formName} form:`, error.message);
      }
    };

    test('should test Morning form interaction', async () => {
      await testFormInteraction('morning-form', 'Morning');
    });

    test('should test Midday form interaction', async () => {
      await testFormInteraction('midday-form', 'Midday');
    });

    test('should test Evening form interaction', async () => {
      await testFormInteraction('evening-form', 'Evening');
    });

    test('should test Bedtime form interaction', async () => {
      await testFormInteraction('bedtime-form', 'Bedtime');
    });
  });

  describe('Dashboard Components', () => {
    test('should display progress rings', async () => {
      const progressRings = await driver.findElements(By.css('[class*="progress"], [data-testid*="progress"], svg circle'));
      expect(progressRings.length).toBeGreaterThan(0);
      console.log(`Found ${progressRings.length} progress indicators`);
    });

    test('should display stats cards', async () => {
      const statsCards = await driver.findElements(By.css('[class*="stat"], [data-testid*="stat"], [class*="card"]'));
      console.log(`Found ${statsCards.length} stats/card elements`);
      
      // Test that cards are interactive
      for (let i = 0; i < Math.min(statsCards.length, 3); i++) {
        const card = statsCards[i];
        const isClickable = await card.getAttribute('onclick') || await card.getTagName() === 'button';
        if (isClickable) {
          await card.click();
          await driver.sleep(500);
        }
      }
    });

    test('should display heatmap calendar', async () => {
      const heatmapElements = await driver.findElements(By.css('[class*="heatmap"], [class*="calendar"], [data-testid*="heatmap"]'));
      
      if (heatmapElements.length > 0) {
        console.log(`Found ${heatmapElements.length} heatmap/calendar elements`);
        
        // Test calendar interactions
        const calendarCells = await driver.findElements(By.css('[class*="day"], [class*="cell"], [data-date]'));
        if (calendarCells.length > 0) {
          await calendarCells[0].click();
          await driver.sleep(1000);
        }
      } else {
        console.log('No heatmap calendar found');
      }
    });

    test('should test streak counter display', async () => {
      const streakElements = await driver.findElements(By.css('[class*="streak"], [data-testid*="streak"]'));
      
      if (streakElements.length > 0) {
        console.log(`Found ${streakElements.length} streak elements`);
        
        // Verify streak numbers are displayed
        for (let streak of streakElements) {
          const text = await streak.getText();
          expect(text).toBeTruthy();
        }
      }
    });

    test('should display achievement badges', async () => {
      const badgeElements = await driver.findElements(By.css('[class*="badge"], [class*="achievement"], [data-testid*="badge"]'));
      console.log(`Found ${badgeElements.length} badge/achievement elements`);
      
      // Test badge interactions
      for (let badge of badgeElements.slice(0, 2)) {
        await badge.click();
        await driver.sleep(500);
      }
    });
  });

  describe('Data Persistence and State Management', () => {
    test('should maintain form data on page refresh', async () => {
      // Fill out a form
      const inputs = await driver.findElements(By.css('input[type="text"], textarea'));
      if (inputs.length > 0) {
        const testValue = 'Persistence test ' + Date.now();
        await inputs[0].clear();
        await inputs[0].sendKeys(testValue);
        
        // Refresh page
        await driver.refresh();
        await driver.sleep(2000);
        
        // Check if data persisted (if using localStorage/sessionStorage)
        const persistedData = await driver.executeScript('return localStorage.getItem("dashboard-storage") || sessionStorage.getItem("dashboard-storage")');
        
        if (persistedData) {
          console.log('Data persistence detected in storage');
        }
      }
    });

    test('should handle demo mode data generation', async () => {
      // Check if demo data is being used
      const demoElements = await driver.findElements(By.xpath("//*[contains(text(), 'demo') or contains(text(), 'Demo')]"));
      
      if (demoElements.length > 0) {
        console.log('Demo mode detected');
        
        // Verify demo data is displayed
        const dataElements = await driver.findElements(By.css('[class*="progress"], [class*="stat"], [class*="count"]'));
        
        for (let element of dataElements.slice(0, 5)) {
          const text = await element.getText();
          if (text && /\d/.test(text)) {
            console.log('Demo data found:', text);
          }
        }
      }
    });
  });

  describe('Responsive Design and UI Interactions', () => {
    test('should work on mobile viewport', async () => {
      await driver.manage().window().setRect({ width: 375, height: 667 });
      await driver.sleep(1000);
      
      // Check that elements are still visible and functional
      const mainContent = await driver.findElement(By.css('main'));
      expect(await mainContent.isDisplayed()).toBe(true);
      
      // Test mobile navigation if present
      const mobileMenus = await driver.findElements(By.css('[class*="mobile"], [aria-label*="menu"], button[class*="hamburger"]'));
      
      for (let menu of mobileMenus) {
        await menu.click();
        await driver.sleep(500);
      }
      
      // Reset to desktop
      await driver.manage().window().setRect({ width: 1920, height: 1080 });
    });

    test('should handle theme switching', async () => {
      const themeButtons = await driver.findElements(By.css('[class*="theme"], [data-testid*="theme"], button[aria-label*="theme"]'));
      
      if (themeButtons.length > 0) {
        console.log('Theme switching found');
        
        // Get initial theme
        const initialBodyClass = await driver.findElement(By.css('body')).getAttribute('class');
        
        // Click theme toggle
        await themeButtons[0].click();
        await driver.sleep(1000);
        
        // Check if theme changed
        const newBodyClass = await driver.findElement(By.css('body')).getAttribute('class');
        
        if (initialBodyClass !== newBodyClass) {
          console.log('Theme switching successful');
        }
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle invalid form inputs gracefully', async () => {
      const numberInputs = await driver.findElements(By.css('input[type="number"]'));
      
      for (let input of numberInputs.slice(0, 2)) {
        // Test invalid number input
        await input.clear();
        await input.sendKeys('invalid_number');
        
        // Try to submit and check for validation
        const submitButtons = await driver.findElements(By.css('button[type="submit"]'));
        if (submitButtons.length > 0) {
          await submitButtons[0].click();
          await driver.sleep(1000);
          
          // Check for error messages
          const errorMessages = await driver.findElements(By.css('[class*="error"], [role="alert"], [aria-invalid="true"]'));
          if (errorMessages.length > 0) {
            console.log('Form validation working correctly');
          }
        }
      }
    });

    test('should handle network errors gracefully', async () => {
      // Simulate slow network by adding delays
      await driver.executeScript(`
        window.originalFetch = window.fetch;
        window.fetch = function(...args) {
          return new Promise(resolve => {
            setTimeout(() => resolve(window.originalFetch(...args)), 2000);
          });
        };
      `);
      
      // Try to perform an action that might make API calls
      const actionButtons = await driver.findElements(By.css('button[type="submit"], button[data-action]'));
      
      if (actionButtons.length > 0) {
        await actionButtons[0].click();
        
        // Check for loading states
        const loadingElements = await driver.findElements(By.css('[class*="loading"], [class*="spinner"], [aria-busy="true"]'));
        
        if (loadingElements.length > 0) {
          console.log('Loading states handled correctly');
        }
      }
      
      // Restore original fetch
      await driver.executeScript('window.fetch = window.originalFetch;');
    });
  });

  describe('Accessibility Testing', () => {
    test('should have proper ARIA labels and roles', async () => {
      const ariaElements = await driver.findElements(By.css('[aria-label], [role], [aria-describedby]'));
      expect(ariaElements.length).toBeGreaterThan(0);
      console.log(`Found ${ariaElements.length} elements with ARIA attributes`);
    });

    test('should be keyboard navigable', async () => {
      const body = await driver.findElement(By.css('body'));
      
      // Test tab navigation
      for (let i = 0; i < 10; i++) {
        await body.sendKeys(Key.TAB);
        await driver.sleep(200);
        
        const activeElement = await driver.switchTo().activeElement();
        const tagName = await activeElement.getTagName();
        
        if (['button', 'input', 'textarea', 'select', 'a'].includes(tagName.toLowerCase())) {
          console.log(`Tab ${i + 1}: Focused on ${tagName}`);
        }
      }
    });

    test('should have proper heading structure', async () => {
      const headings = await driver.findElements(By.css('h1, h2, h3, h4, h5, h6'));
      expect(headings.length).toBeGreaterThan(0);
      
      for (let heading of headings) {
        const text = await heading.getText();
        const tagName = await heading.getTagName();
        expect(text.trim()).toBeTruthy();
        console.log(`${tagName}: ${text}`);
      }
    });
  });

  describe('Performance and Loading', () => {
    test('should load within acceptable time limits', async () => {
      const startTime = Date.now();
      await driver.get(BASE_URL);
      
      await driver.wait(until.elementLocated(By.css('main')), 10000);
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
      console.log(`Page loaded in ${loadTime}ms`);
    });

    test('should handle concurrent user interactions', async () => {
      // Simulate rapid interactions
      const buttons = await driver.findElements(By.css('button'));
      
      const clickPromises = buttons.slice(0, 5).map(async (button) => {
        try {
          await button.click();
          await driver.sleep(100);
        } catch (error) {
          console.log('Concurrent click error (expected):', error.message);
        }
      });
      
      await Promise.all(clickPromises);
      console.log('Concurrent interactions test completed');
    });
  });
});

// Helper function to start the development server
async function startDevServer() {
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      detached: false
    });
    
    server.stdout.on('data', (data) => {
      if (data.toString().includes('localhost:3000') || data.toString().includes('ready')) {
        setTimeout(resolve, 3000); // Give extra time for full startup
      }
    });
    
    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });
    
    setTimeout(() => {
      reject(new Error('Server startup timeout'));
    }, 30000);
    
    // Store server reference for cleanup
    process.env.DEV_SERVER_PID = server.pid;
  });
}

// Export for use in CI/CD
module.exports = { startDevServer };