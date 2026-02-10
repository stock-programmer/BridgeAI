import { useState } from 'react';
import { RoleSelector } from '../../common/RoleSelector/RoleSelector';
import { TextArea } from '../../common/TextArea/TextArea';
import { Button } from '../../common/Button/Button';

interface InputPanelProps {
  onSubmit: (role: 'pm' | 'dev', content: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  onSubmit,
  disabled = false,
  loading = false
}) => {
  const [role, setRole] = useState<'pm' | 'dev'>('pm');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(role, content);
      setContent('');
    }
  };

  return (
    <div className="input-panel bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">输入内容</h3>
        <RoleSelector
          value={role}
          onChange={setRole}
          disabled={disabled || loading}
        />
      </div>

      <TextArea
        value={content}
        onChange={setContent}
        placeholder={`请输入${role === 'pm' ? '产品需求' : '开发内容'}...`}
        maxLength={5000}
        minRows={4}
        maxRows={10}
        disabled={disabled || loading}
        showCount={true}
      />

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          loading={loading}
          disabled={disabled || !content.trim()}
          onClick={handleSubmit}
        >
          提交翻译
        </Button>
      </div>
    </div>
  );
};
