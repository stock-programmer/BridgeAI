import { useEffect, useRef } from 'react';
import { formatCharacterCount } from '../../../utils/formatter';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  showCount?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = '',
  maxLength = 5000,
  minRows = 3,
  maxRows = 10,
  disabled = false,
  showCount = true
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = 24; // Approximate line height in pixels
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows * lineHeight;

      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, minRows, maxRows]);

  return (
    <div className="textarea-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
      {showCount && (
        <div className="text-sm text-gray-500 mt-1 text-right">
          {formatCharacterCount(value.length, maxLength)}
        </div>
      )}
    </div>
  );
};
