import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const AssetBadge: Story = {
  args: {
    children: 'XLM',
    variant: 'outline',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const WalletExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <span className="text-sm">Asset:</span>
        <Badge variant="outline">XLM</Badge>
      </div>
      <div className="flex gap-2">
        <span className="text-sm">Status:</span>
        <Badge variant="default">Active</Badge>
      </div>
      <div className="flex gap-2">
        <span className="text-sm">Network:</span>
        <Badge variant="secondary">Mainnet</Badge>
      </div>
      <div className="flex gap-2">
        <span className="text-sm">Alert:</span>
        <Badge variant="destructive">Low Balance</Badge>
      </div>
    </div>
  ),
};
