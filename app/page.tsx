'use client';

import { useState } from 'react';
import { buildWidgetUrl } from '@/lib/url-builder';
import type { CountdownUnit, Theme, Style } from '@/types';

export default function Home() {
  const [endDate, setEndDate] = useState('');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState<CountdownUnit>('days');
  const [theme, setTheme] = useState<Theme>('auto');
  const [style, setStyle] = useState<Style>('minimal');
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleGenerate = () => {
    if (!endDate) return;
    try {
      const url = buildWidgetUrl({
        end: new Date(endDate),
        title: title || undefined,
        unit,
        theme,
        style,
      });
      setGeneratedUrl(`${window.location.origin}${url}`);
    } catch (error) {
      console.error('生成URL失败', error);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">倒计时配置</h1>
          <p className="text-gray-600">为 Notion 创建你的专属倒计时 Widget</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">📅 结束日期与时间</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                console.log('日期选择:', e.target.value);
                setEndDate(e.target.value);
              }}
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {endDate && (
              <p className="mt-2 text-sm text-green-600">✓ 已选择：{new Date(endDate).toLocaleString('zh-CN')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">✏️ 标题（可选）</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：考研倒计时"
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">⏱️ 精度</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as CountdownUnit)}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
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
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
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
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="minimal">简约</option>
                <option value="card">卡片</option>
                <option value="gradient">渐变</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              console.log('按钮点击, endDate:', endDate);
              handleGenerate();
            }}
            disabled={!endDate || endDate.trim() === ''}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {(endDate && endDate.trim() !== '') ? '🚀 生成 Widget URL' : '⚠️ 请先选择结束日期'}
          </button>

          {generatedUrl && (
            <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
              <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-green-600">✅</span> URL 已生成
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border-2 border-green-300 rounded-lg text-sm text-gray-700 focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:from-gray-900 hover:to-black transition-all shadow-md hover:shadow-lg"
                >
                  📋 复制
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
