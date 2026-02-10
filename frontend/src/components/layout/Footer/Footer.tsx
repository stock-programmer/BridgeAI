export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            © {currentYear} 雷石翻译系统. All rights reserved.
          </div>

          <div className="flex gap-6 text-sm">
            <a
              href="#about"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              关于我们
            </a>
            <a
              href="#help"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              使用帮助
            </a>
            <a
              href="#privacy"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              隐私政策
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
