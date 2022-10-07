import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactComponent } from './react-component';
import { mockData } from './react-component.mock-data';

export default {
  title: `Boilerplate/ReactComponent`,
  component: ReactComponent,
} as ComponentMeta<typeof ReactComponent>;

const Template: ComponentStory<typeof ReactComponent> = (args) => (
  <ReactComponent {...args} />
);

export const Default = Template.bind({});
Default.storyName = `Default`;
Default.args = mockData;
