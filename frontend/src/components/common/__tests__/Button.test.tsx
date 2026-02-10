import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Button } from '../Button/Button';

describe('Button Component', () => {
  test('should render button text', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  test('should trigger click event', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>点击</Button>);

    fireEvent.click(screen.getByText('点击'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        禁用
      </Button>
    );

    const button = screen.getByText('禁用');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('should show loading text when loading', () => {
    render(<Button loading>提交</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('提交')).not.toBeInTheDocument();
  });

  test('should apply primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary');
  });

  test('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-gray-200');
  });

  test('should apply danger variant styles', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByText('Danger');
    expect(button).toHaveClass('bg-red-500');
  });

  test('should apply small size styles', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  test('should apply medium size styles', () => {
    render(<Button size="md">Medium</Button>);
    const button = screen.getByText('Medium');
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  test('should apply large size styles', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  test('should be disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('should use default props when not specified', () => {
    render(<Button>Default</Button>);
    const button = screen.getByText('Default');
    expect(button).toHaveClass('bg-primary'); // default variant
    expect(button).toHaveClass('px-4', 'py-2'); // default size
  });
});
