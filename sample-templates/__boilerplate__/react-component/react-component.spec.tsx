import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactComponent } from './react-component';
import { mockData } from './react-component.mock-data';

describe(`Boilerplate/ReactComponent`, () => {
  it(`renders the Body Text component`, () => {
    render(<ReactComponent {...mockData} />);

    expect(screen.getByText(`Sample text`).toBeInTheDocument();
  });
});
