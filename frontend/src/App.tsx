import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { InputPanel } from './components/translation/InputPanel/InputPanel';
import { ResultPanel } from './components/translation/ResultPanel/ResultPanel';
import { useWebSocket } from './hooks/useWebSocket';
import { Toaster } from 'react-hot-toast';
import { useTranslationStore } from './store/translationStore';

function App() {
  const { sendTranslation } = useWebSocket(); // 初始化 WebSocket 连接
  const { clearResult, setStreamingStatus } = useTranslationStore();

  const handleSubmit = (role: 'pm' | 'dev', content: string) => {
    // 清空之前的结果
    clearResult();
    setStreamingStatus(true);

    // 发送消息到 WebSocket
    sendTranslation(role, content);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputPanel onSubmit={handleSubmit} />
          <ResultPanel />
        </div>
      </main>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
