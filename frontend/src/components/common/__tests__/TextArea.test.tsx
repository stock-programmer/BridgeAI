import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { TextArea } from '../TextArea/TextArea';

describe('TextArea Component', () => {
  test('should render textarea', () => {
    render(<TextArea value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('should display value', () => {
    render(<TextArea value="Test content" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Test content');
  });

  test('should call onChange when text is entered', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TextArea value="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'New text');

    expect(handleChange).toHaveBeenCalled();
  });

  test('should display character count', () => {
    render(<TextArea value="Test" onChange={() => {}} showCount={true} />);
    expect(screen.getByText('4 / 5000')).toBeInTheDocument();
  });

  test('should hide character count when showCount is false', () => {
    render(<TextArea value="Test" onChange={() => {}} showCount={false} />);
    expect(screen.queryByText('4 / 5000')).not.toBeInTheDocument();
  });

  test('should respect maxLength prop', () => {
    render(<TextArea value="" onChange={() => {}} maxLength={100} showCount={true} />);
    expect(screen.getByText('0 / 100')).toBeInTheDocument();
  });

  test('should display placeholder', () => {
    render(<TextArea value="" onChange={() => {}} placeholder="Enter text here" />);
    const textarea = screen.getByPlaceholderText('Enter text here');
    expect(textarea).toBeInTheDocument();
  });

  test('should be disabled when disabled prop is true', () => {
    render(<TextArea value="" onChange={() => {}} disabled={true} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  test('should update character count as text changes', async () => {
    const user = userEvent.setup();
    let value = '';
    const handleChange = vi.fn((newValue: string) => {
      value = newValue;
    });

    const { rerender } = render(
      <TextArea value={value} onChange={handleChange} showCount={true} />
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello');

    // Update the value
    value = 'Hello';
    rerender(<TextArea value={value} onChange={handleChange} showCount={true} />);

    expect(screen.getByText('5 / 5000')).toBeInTheDocument();
  });

  test('should use default props', () => {
    render(<TextArea value="Test" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea.maxLength).toBe(5000);
    expect(textarea.disabled).toBe(false);
    expect(screen.getByText('4 / 5000')).toBeInTheDocument(); // showCount defaults to true
  });
});
