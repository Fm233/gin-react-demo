import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Progress from './App';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Progress />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
