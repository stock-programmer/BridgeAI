import { StreamingText } from '../StreamingText/StreamingText';
import { Button } from '../../common/Button/Button';
import { useTranslationStore } from '../../../store/translationStore';
import { useClipboard } from '../../../hooks/useClipboard';

export const ResultPanel: React.FC = () => {
  const { translationResult, isStreaming, clearResult } =
    useTranslationStore();
  const { copyToClipboard, isCopied } = useClipboard();

  const handleCopy = () => {
    copyToClipboard(translationResult);
  };

  return (
    <div className="result-panel border rounded-lg p-4 min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">翻译结果</h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleCopy} disabled={!translationResult}>
            {isCopied ? '已复制' : '复制结果'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={clearResult}
            disabled={!translationResult}
          >
            清空
          </Button>
        </div>
      </div>

      {translationResult ? (
        <StreamingText content={translationResult} isStreaming={isStreaming} />
      ) : (
        <div className="text-gray-400 text-center py-20">
          翻译结果将在这里显示...
        </div>
      )}
    </div>
  );
};
