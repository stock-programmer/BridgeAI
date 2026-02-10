import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { StreamingText } from '../StreamingText/StreamingText';

describe('StreamingText Component', () => {
  test('should render markdown content', () => {
    const content = '# Hello World\n\nThis is a test.';
    render(<StreamingText content={content} isStreaming={false} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('This is a test.')).toBeInTheDocument();
  });

  test('should show cursor when streaming', () => {
    render(<StreamingText content="Content" isStreaming={true} />);

    const cursor = screen.getByText('▊');
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass('cursor');
  });

  test('should hide cursor when not streaming', () => {
    render(<StreamingText content="Content" isStreaming={false} />);

    expect(screen.queryByText('▊')).not.toBeInTheDocument();
  });

  test('should render bold text', () => {
    const content = '**Bold text**';
    render(<StreamingText content={content} isStreaming={false} />);

    const boldElement = screen.getByText('Bold text');
    expect(boldElement.tagName).toBe('STRONG');
  });

  test('should render italic text', () => {
    const content = '*Italic text*';
    render(<StreamingText content={content} isStreaming={false} />);

    const italicElement = screen.getByText('Italic text');
    expect(italicElement.tagName).toBe('EM');
  });

  test('should render code blocks', () => {
    const content = '```javascript\nconst x = 1;\n```';
    render(<StreamingText content={content} isStreaming={false} />);

    const codeElement = screen.getByText('const x = 1;');
    expect(codeElement.closest('code')).toBeInTheDocument();
  });

  test('should render lists', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    render(<StreamingText content={content} isStreaming={false} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('should render links', () => {
    const content = '[Click here](https://example.com)';
    render(<StreamingText content={content} isStreaming={false} />);

    const link = screen.getByText('Click here');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  test('should render empty content', () => {
    const { container } = render(<StreamingText content="" isStreaming={false} />);
    const markdownBody = container.querySelector('.markdown-body');
    expect(markdownBody).toBeInTheDocument();
    expect(markdownBody?.textContent).toBe('');
  });

  test('should update content when it changes', () => {
    const { rerender } = render(
      <StreamingText content="Initial" isStreaming={true} />
    );

    expect(screen.getByText('Initial')).toBeInTheDocument();

    rerender(<StreamingText content="Initial Updated" isStreaming={true} />);

    expect(screen.getByText('Initial Updated')).toBeInTheDocument();
  });

  test('should handle streaming state changes', () => {
    const { rerender } = render(
      <StreamingText content="Content" isStreaming={true} />
    );

    expect(screen.getByText('▊')).toBeInTheDocument();

    rerender(<StreamingText content="Content" isStreaming={false} />);

    expect(screen.queryByText('▊')).not.toBeInTheDocument();
  });

  test('should render table with GFM', () => {
    const content = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
    render(<StreamingText content={content} isStreaming={false} />);

    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });
});
