/**
 * Qwen LLM 服务模块
 * 封装与通义千问大模型的交互逻辑
 * 支持流式和非流式翻译
 */

import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { getSystemPrompt, buildUserPrompt } from '../prompts/system-prompt.js';

/**
 * Qwen LLM 服务类
 */
class LLMService {
  constructor() {
    this.apiBase = config.qwen.apiBase;
    this.apiKey = config.qwen.apiKey;
    this.model = config.qwen.model;
  }

  /**
   * 验证 API 配置
   */
  validateConfig() {
    if (!this.apiKey) {
      throw new Error('QWEN_API_KEY 未配置，请检查环境变量');
    }
  }

  /**
   * 流式翻译 (支持 SSE)
   * @param {string} role - 用户角色 (pm/dev)
   * @param {string} content - 用户输入内容
   * @param {Function} onChunk - 接收流式数据的回调
   * @returns {Promise<string>} 完整响应内容
   */
  async translateStream(role, content, onChunk) {
    this.validateConfig();

    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(role, content);

    logger.info('开始流式翻译', {
      role,
      contentLength: content.length,
      model: this.model
    });

    const requestBody = {
      model: this.model,
      input: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      },
      parameters: {
        temperature: config.qwen.temperature,
        top_p: config.qwen.topP,
        result_format: 'message',
        incremental_output: true  // 启用增量输出
      }
    };

    try {
      const response = await axios.post(
        `${this.apiBase}/services/aigc/text-generation/generation`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'enable'  // 启用 SSE
          },
          timeout: config.qwen.timeout,
          responseType: 'stream'  // 重要：设置为流式响应
        }
      );

      let fullContent = '';

      // 处理流式数据
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');

          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const jsonStr = line.slice(5).trim();
                if (jsonStr === '[DONE]') {
                  resolve(fullContent);
                  return;
                }

                const data = JSON.parse(jsonStr);
                const delta = data.output?.choices?.[0]?.message?.content || '';

                if (delta) {
                  fullContent += delta;
                  onChunk(delta);  // 回调发送增量数据
                }
              } catch (err) {
                logger.warn('解析流式数据失败', { line, error: err.message });
              }
            }
          }
        });

        response.data.on('end', () => {
          logger.info('流式翻译完成', { totalLength: fullContent.length });
          resolve(fullContent);
        });

        response.data.on('error', (error) => {
          logger.error('流式响应错误', { error: error.message });
          reject(error);
        });
      });

    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 非流式翻译 (常规接口)
   * @param {string} role - 用户角色 (pm/dev)
   * @param {string} content - 用户输入内容
   * @returns {Promise<string>} 翻译结果
   */
  async translate(role, content) {
    this.validateConfig();

    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(role, content);

    logger.info('开始翻译', { role, contentLength: content.length });

    const requestBody = {
      model: this.model,
      input: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      },
      parameters: {
        temperature: config.qwen.temperature,
        top_p: config.qwen.topP,
        result_format: 'message',
        max_tokens: config.qwen.maxTokens
      }
    };

    try {
      const response = await axios.post(
        `${this.apiBase}/services/aigc/text-generation/generation`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: config.qwen.timeout
        }
      );

      const result = response.data.output?.choices?.[0]?.message?.content;

      if (!result) {
        throw new Error('API 未返回有效内容');
      }

      logger.info('翻译成功', { resultLength: result.length });
      return result;

    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 统一错误处理
   */
  handleError(error) {
    logger.error('Qwen API 调用失败', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      throw new Error('API Key 无效，请检查 QWEN_API_KEY 配置');
    } else if (error.response?.status === 429) {
      throw new Error('API 调用频率超限，请稍后再试');
    } else if (error.response?.status === 400) {
      const errorMsg = error.response.data?.message || '请求参数错误';
      throw new Error(`API 请求错误: ${errorMsg}`);
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('API 请求超时，请稍后重试');
    }

    throw new Error('翻译服务暂时不可用，请稍后重试');
  }
}

export default new LLMService();
