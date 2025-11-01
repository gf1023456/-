type Translations = {
  [key: string]: string;
};

const translations: { [lang: string]: Translations } = {
  en: {
    title: "Your Health Expert",
    initialMessage: "Hello! I am your health expert. Ask me any health-related questions or upload an image of a product to learn about its function and potential hazards.",
    thinking: "Thinking...",
    errorMessage: "Failed to get response: {errorMessage}",
    chatErrorMessage: "Sorry, I encountered an error: {errorMessage}",
    inputPlaceholder: "Type a message or upload an image...",
    imageAnalysisPrompt: "Analyze this image. Identify the object, describe its functions, and detail any potential health hazards.",
    langToggle: "中文",
  },
  zh: {
    title: "你的健康专家",
    initialMessage: "你好！我是你的健康专家。你可以问我任何与健康相关的问题，或者上传一张产品图片来了解它的作用和潜在危害。",
    thinking: "正在思考...",
    errorMessage: "获取回复失败: {errorMessage}",
    chatErrorMessage: "抱歉，我遇到了一个错误: {errorMessage}",
    inputPlaceholder: "输入消息或上传图片...",
    imageAnalysisPrompt: "分析这张图片。识别图中的物体，描述它的功能，并详细说明任何潜在的健康危害。",
    langToggle: "English",
  },
};

export const getInitialLang = (): 'en' | 'zh' => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
};

export const getTranslator = (lang: 'en' | 'zh') => {
  return (key: string, params?: { [key: string]: string }): string => {
    let text = translations[lang][key] || translations['en'][key] || key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    return text;
  };
};