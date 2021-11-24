import React from 'react';
import { render, screen } from '@testing-library/react';
import BaseTen from './BaseTen';

test('renders learn react link', () => {
  render(<BaseTen />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
