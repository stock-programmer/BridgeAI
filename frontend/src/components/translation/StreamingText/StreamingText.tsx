import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

export const StreamingText: React.FC<{
  content: string;
  isStreaming: boolean;
}> = ({ content, isStreaming }) => {
  return (
    <div className="streaming-container">
      <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <motion.span
          className="cursor"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ▊
        </motion.span>
      )}
    </div>
  );
};
