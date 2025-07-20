// Simple demo test to show the testing infrastructure works
describe('Demo Test Suite', () => {
  test('should demonstrate testing infrastructure is working', () => {
    expect(1 + 1).toBe(2);
    expect('hello world').toContain('world');
    expect(true).toBeTruthy();
    console.log('✅ Testing infrastructure is working correctly!');
  });

  test('should handle async operations', async () => {
    const result = await Promise.resolve('async test');
    expect(result).toBe('async test');
    console.log('✅ Async testing works!');
  });

  test('should handle mock functions', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
    console.log('✅ Mock functions work!');
  });
});