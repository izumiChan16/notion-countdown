'use client';

import { useState } from 'react';
import { buildWidgetUrl } from '@/lib/url-builder';
import type { CountdownUnit, Theme, Style } from '@/types';

export default function Home() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState<CountdownUnit>('days');
  const [theme, setTheme] = useState<Theme>('auto');
  const [style, setStyle] = useState<Style>('minimal');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!date || !time) return;
    try {
      const url = buildWidgetUrl({
        end: new Date(`${date}T${time}`),
        title: title || undefined,
        unit,
        theme,
        style,
        lang: 'zh',
        endMessage: undefined,
      });
      setGeneratedUrl(`${window.location.origin}${url}`);
    } catch (error) {
      console.error('生成URL失败', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isValid = date && time;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            倒计时配置器
          </h1>
          <p className="text-gray-600 text-lg">为 Notion 创建你的专属倒计时 Widget</p>
        </div>

        <div className="space-y-8">
          {/* 日期时间选择 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span>设置结束时间</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">时间</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg"
                />
              </div>
            </div>
            {isValid && (
              <div className="mt-4 p-3 bg-white rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">目标时间：</span>
                  {new Date(`${date}T${time}`).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* 其他配置 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <span>标题（可选）</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：考研倒计时"
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">⏱️ 精度</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as CountdownUnit)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="days">天</option>
                  <option value="hours">小时</option>
                  <option value="minutes">分钟</option>
                  <option value="seconds">秒</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">🎨 主题</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="auto">自动</option>
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">💎 样式</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as Style)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="minimal">简约</option>
                  <option value="card">卡片</option>
                  <option value="gradient">渐变</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg py-5 px-6 rounded-2xl hover:shadow-2xl disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
          >
            {isValid ? '🚀 生成 Widget URL' : '⚠️ 请先选择日期和时间'}
          </button>

          {generatedUrl && (
            <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>URL 生成成功！</span>
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border-2 border-green-300 rounded-xl text-sm text-gray-700 focus:outline-none font-mono"
                />
                <button
                  onClick={handleCopy}
                  className={`px-6 py-3 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black'
                  }`}
                >
                  {copied ? '✓ 已复制' : '📋 复制'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
