import React, { useState } from 'react';
import config from '../config/config';

function PhotoBoothEditor({
  name,
  setName,
  message,
  setMessage,
  date,
  setDate,
  layout,
  setLayout,
  theme,
  setTheme,
  filter,
  setFilter,
}) {
  const [activeTab, setActiveTab] = useState('style'); // 'style' | 'text'

  const themeBadges = {
    pink: 'linear-gradient(135deg, #ff2e93, #ff85c8)',
    lavender: 'linear-gradient(135deg, #c084fc, #818cf8)',
    peach: 'linear-gradient(135deg, #ff7a45, #ffd166)',
    mono: 'linear-gradient(135deg, #ffffff, #94a3b8)',
    candy: 'linear-gradient(135deg, #ff389d, #06b6d4)',
  };

  const layoutIcons = {
    classic: '▮',
    horizontal: '▬',
    editorial: '◫',
  };

  return (
    <div className="photoboothEditor">
      {/* Editor Tab Navigation */}
      <div className="editorTabs">
        <button
          type="button"
          className={`editorTabBtn ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          🎨 STYLE & THEME
        </button>
        <button
          type="button"
          className={`editorTabBtn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          ✍️ TEXT & MESSAGE
        </button>
      </div>

      {/* Tab 1: Style, Layout, Theme, Filters */}
      {activeTab === 'style' && (
        <div className="editorSection animate-fade-in">
          {/* Layout Selector */}
          <div className="editorControlGroup">
            <label className="editorLabel">CHOOSE LAYOUT</label>
            <div className="layoutChoiceGrid">
              {config.photoBoothConfig.layouts.map((lKey) => (
                <button
                  key={lKey}
                  type="button"
                  className={`layoutChoiceBtn ${layout === lKey ? 'active' : ''}`}
                  onClick={() => setLayout(lKey)}
                >
                  <span className="layoutIcon">{layoutIcons[lKey]}</span>
                  <span className="layoutName">
                    {config.photoBoothConfig.layoutLabels?.[lKey] || lKey.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="editorControlGroup">
            <label className="editorLabel">COLOR THEME</label>
            <div className="themeChoiceGrid">
              {config.photoBoothConfig.themes.map((tKey) => (
                <button
                  key={tKey}
                  type="button"
                  className={`themeChoiceBtn ${theme === tKey ? 'active' : ''}`}
                  onClick={() => setTheme(tKey)}
                >
                  <span
                    className="themeColorDot"
                    style={{ background: themeBadges[tKey] || '#ff2e93' }}
                  />
                  <span className="themeName">
                    {config.photoBoothConfig.themeLabels?.[tKey] || tKey}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Selector */}
          <div className="editorControlGroup">
            <label className="editorLabel">PHOTO FILTER</label>
            <div className="filterChoiceGrid">
              {config.photoBoothConfig.filters.map((fKey) => (
                <button
                  key={fKey}
                  type="button"
                  className={`filterChoiceBtn ${filter === fKey ? 'active' : ''}`}
                  onClick={() => setFilter(fKey)}
                >
                  {config.photoBoothConfig.filterLabels?.[fKey] || fKey}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Name, Message, Date */}
      {activeTab === 'text' && (
        <div className="editorSection animate-fade-in">
          {/* Name Field */}
          <div className="editorField">
            <label className="editorLabel" htmlFor="booth-name-input">
              YOUR NAME
            </label>
            <div className="inputWithClear">
              <input
                id="booth-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name..."
                maxLength={20}
              />
              {name && (
                <button
                  type="button"
                  className="inputClearBtn"
                  onClick={() => setName('')}
                  aria-label="Clear name"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Message Field & Presets */}
          <div className="editorField">
            <label className="editorLabel" htmlFor="booth-msg-input">
              CAPTION / MESSAGE
            </label>
            <div className="inputWithClear">
              <input
                id="booth-msg-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a cute message..."
                maxLength={45}
              />
              {message && (
                <button
                  type="button"
                  className="inputClearBtn"
                  onClick={() => setMessage('')}
                  aria-label="Clear message"
                >
                  ×
                </button>
              )}
            </div>

            {/* Quick Message Chips */}
            <div className="quickPresetRow">
              <span className="quickPresetTitle">QUICK PRESETS:</span>
              <div className="presetChips">
                {config.photoBoothConfig.messagePresets?.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`presetChip ${message === preset ? 'active' : ''}`}
                    onClick={() => setMessage(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date Field */}
          <div className="editorField">
            <label className="editorLabel" htmlFor="booth-date-input">
              DATE STAMP
            </label>
            <input
              id="booth-date-input"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. AUG 25, 2026"
              maxLength={20}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoBoothEditor;

