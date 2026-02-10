import { ROLES } from '../../../utils/constants';

interface RoleSelectorProps {
  value: 'pm' | 'dev';
  onChange: (role: 'pm' | 'dev') => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="role-selector flex gap-2">
      <button
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          value === 'pm'
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => onChange('pm')}
        disabled={disabled}
      >
        {ROLES.PM.label}
      </button>
      <button
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          value === 'dev'
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => onChange('dev')}
        disabled={disabled}
      >
        {ROLES.DEV.label}
      </button>
    </div>
  );
};
