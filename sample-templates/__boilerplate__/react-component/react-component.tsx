import React from 'react';

export interface IReactComponentProps {
  children?: React.ReactNode;
}

export const ReactComponent = ({
  children,
}: IReactComponentProps): JSX.Element => {
  return <div data-test="ReactComponent">{children}</div>;
};
