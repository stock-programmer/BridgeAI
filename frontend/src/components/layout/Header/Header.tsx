import { useTranslationStore } from '../../../store/translationStore';

export const Header: React.FC = () => {
  const { wsConnected } = useTranslationStore();

  const getStatusColor = () => {
    return wsConnected ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    return wsConnected ? '已连接' : '未连接';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-primary">
            雷石翻译
          </div>
          <span className="text-gray-600">| PM-Dev 实时协作翻译系统</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="text-sm text-gray-600">{getStatusText()}</span>
        </div>
      </div>
    </header>
  );
};
