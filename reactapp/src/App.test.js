import App from './App';

jest.mock('./hooks/useApiData', () => {
  return () => ({ data: null, loading: false, error: null });
});

test('App component is defined', () => {
  expect(App).toBeDefined();
});
