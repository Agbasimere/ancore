/**
 * @ancore/ui-kit
 * Shared UI components for Ancore wallet applications
 */

export const UI_KIT_VERSION = '0.1.0';

// Export styles (consumers need to import this in their app)
export * from './styles/globals.css';

// Core shadcn/ui components
export { Button, buttonVariants } from './components/ui/button';
export type { ButtonProps } from './components/ui/button';

export { Input } from './components/ui/input';
export type { InputProps } from './components/ui/input';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/card';

export { Badge, badgeVariants } from './components/ui/badge';
export type { BadgeProps } from './components/ui/badge';

export { Separator } from './components/ui/separator';

// Custom wallet components
export { AmountInput } from './components/amount-input';
export type { AmountInputProps } from './components/amount-input';

export { AddressDisplay } from './components/address-display';
export type { AddressDisplayProps } from './components/address-display';

// Utility functions
export { cn } from './lib/utils';
