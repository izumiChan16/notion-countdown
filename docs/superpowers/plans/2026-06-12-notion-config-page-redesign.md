# Notion Config Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign only the configuration page into a Notion-inspired Quiet Workbench while preserving widget URL behavior and leaving `app/widget/page.tsx` unchanged.

**Architecture:** Keep the existing React state and URL generation flow in `app/page.tsx`, but replace the centered gradient card with a responsive two-column workbench. Restyle existing support components in place so their public props and behavior remain unchanged.

**Tech Stack:** Next.js 16 App Router, React 19 client components, TypeScript, Tailwind CSS 4, `next/font`, `react-datepicker`, `qrcode.react`, `@heroicons/react`.

---

## File Structure

- Modify `app/globals.css`: apply the configured `next/font` variables and convert datepicker colors from blue to neutral Notion-like colors.
- Modify `components/DateInput.tsx`: restyle the date field and label with neutral borders and dark text.
- Modify `components/TimeInput.tsx`: restyle number inputs, AM/PM buttons, and radio choices with Notion-like neutral controls.
- Modify `components/LanguageSwitcher.tsx`: restyle as a compact neutral segmented control.
- Modify `components/QRCodeDisplay.tsx`: restyle as a simple white block with subtle border.
- Modify `components/WidgetPreview.tsx`: restyle only the preview container and empty state; keep countdown rendering and style variants intact.
- Modify `app/page.tsx`: replace the current gradient single-card layout with the Quiet Workbench two-column layout and move generated URL output into the right column.
- Do not modify `app/widget/page.tsx`, `lib/countdown.ts`, `lib/url-builder.ts`, or URL parameter semantics.

## Task 1: Global Notion Surface And Datepicker Theme

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Inspect current git state**

Run: `git status --short`

Expected: no unexpected user changes. If there are unrelated user changes, leave them untouched.

- [ ] **Step 2: Replace global body and datepicker styling**

Edit `app/globals.css` so the body and datepicker section match this exact content after the `@theme inline` block:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

/* React Datepicker neutral Notion-style overrides */
.react-datepicker {
  border: 1px solid #dedbd5 !important;
  border-radius: 8px !important;
  box-shadow: 0 12px 30px rgba(15, 15, 15, 0.08) !important;
  color: #37352f !important;
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif !important;
}

.react-datepicker__header {
  background: #f7f6f3 !important;
  border-bottom: 1px solid #ece9e4 !important;
}

.react-datepicker__current-month,
.react-datepicker-time__header,
.react-datepicker-year-header {
  color: #37352f !important;
  font-weight: 600 !important;
}

.react-datepicker__day,
.react-datepicker__day-name {
  color: #37352f !important;
}

.react-datepicker__day:hover {
  background: #f1f1ef !important;
  border-radius: 5px !important;
}

.react-datepicker__day--selected,
.react-datepicker__day--keyboard-selected {
  background: #37352f !important;
  border-radius: 5px !important;
  color: #ffffff !important;
}

.react-datepicker__day--today {
  font-weight: 700 !important;
}
```

Remove the stale Flowbite `.datepicker` selectors; this app now uses `react-datepicker`.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: lint completes with no new errors.

- [ ] **Step 4: Commit**

Run:

```bash
git add app/globals.css
git commit -m "style: add Notion global theme" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Task 2: Restyle Shared Controls

**Files:**
- Modify: `components/DateInput.tsx`
- Modify: `components/TimeInput.tsx`
- Modify: `components/LanguageSwitcher.tsx`
- Modify: `components/QRCodeDisplay.tsx`

- [ ] **Step 1: Inspect current git state**

Run: `git status --short`

Expected: clean after Task 1 commit.

- [ ] **Step 2: Restyle `DateInput`**

In `components/DateInput.tsx`, keep props and `handleChange` unchanged. Replace the returned JSX with:

```tsx
return (
  <div>
    <label className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#787774]">
      <CalendarIcon className="h-4 w-4" />
      <span>{t('endDate')}</span>
    </label>
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="yyyy-MM-dd"
        placeholderText="YYYY-MM-DD"
        className="h-11 w-full rounded-md border border-[#dedbd5] bg-white px-3 pr-10 text-[15px] text-[#37352f] outline-none transition-colors placeholder:text-[#9b9a97] hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10"
        calendarClassName="notion-datepicker"
        showPopperArrow={false}
      />
      <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b9a97]" />
    </div>
  </div>
);
```

- [ ] **Step 3: Restyle `TimeInput`**

In `components/TimeInput.tsx`, keep state and handlers unchanged. Apply these exact class replacements:

```tsx
<label className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#787774]">
  <ClockIcon className="h-4 w-4" />
  <span>{t('endTime')}</span>
</label>
```

Use this class for both hour and minute inputs:

```tsx
className="h-11 w-20 rounded-md border border-[#dedbd5] bg-white px-3 text-center text-lg font-semibold text-[#37352f] outline-none transition-colors hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10"
```

Use this separator:

```tsx
<span className="text-xl font-semibold text-[#787774]">:</span>
```

Use this AM/PM wrapper:

```tsx
<div className="flex overflow-hidden rounded-md border border-[#dedbd5] bg-white">
```

Use these AM/PM button active and inactive classes in the existing template literal:

```tsx
!isPM ? 'bg-[#37352f] text-white' : 'bg-white text-[#37352f] hover:bg-[#f7f6f3]'
isPM ? 'bg-[#37352f] text-white' : 'bg-white text-[#37352f] hover:bg-[#f7f6f3]'
```

Use this radio group wrapper:

```tsx
<div className="mt-3 flex items-center gap-4">
```

Use this radio input class:

```tsx
className="h-4 w-4 accent-[#37352f]"
```

Use this radio label text class:

```tsx
<span className="text-sm text-[#787774]">{t('hour12')}</span>
```

and the same class for `hour24`.

- [ ] **Step 4: Restyle `LanguageSwitcher`**

In `components/LanguageSwitcher.tsx`, keep `handleChange` unchanged. Replace the returned JSX with:

```tsx
return (
  <div className="flex items-center gap-1 rounded-md border border-[#dedbd5] bg-white p-1 text-sm shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
    <LanguageIcon className="ml-1 h-4 w-4 text-[#787774]" />
    <button
      onClick={() => handleChange('zh')}
      className={`rounded px-2.5 py-1 font-medium transition-colors ${
        language === 'zh' ? 'bg-[#37352f] text-white' : 'text-[#787774] hover:bg-[#f7f6f3] hover:text-[#37352f]'
      }`}
    >
      中文
    </button>
    <button
      onClick={() => handleChange('en')}
      className={`rounded px-2.5 py-1 font-medium transition-colors ${
        language === 'en' ? 'bg-[#37352f] text-white' : 'text-[#787774] hover:bg-[#f7f6f3] hover:text-[#37352f]'
      }`}
    >
      EN
    </button>
  </div>
);
```

- [ ] **Step 5: Restyle `QRCodeDisplay`**

In `components/QRCodeDisplay.tsx`, replace the returned JSX with:

```tsx
return (
  <div className="rounded-md border border-[#dedbd5] bg-white p-4">
    <p className="mb-3 text-center text-sm font-medium text-[#787774]">
      {t('qrcodeTitle')}
    </p>
    <div className="flex justify-center">
      <QRCodeSVG value={url} size={160} level="H" />
    </div>
  </div>
);
```

- [ ] **Step 6: Run lint**

Run: `npm run lint`

Expected: lint completes with no new errors.

- [ ] **Step 7: Commit**

Run:

```bash
git add components/DateInput.tsx components/TimeInput.tsx components/LanguageSwitcher.tsx components/QRCodeDisplay.tsx
git commit -m "style: restyle config controls for Notion" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Task 3: Restyle The Preview Component Shell

**Files:**
- Modify: `components/WidgetPreview.tsx`

- [ ] **Step 1: Inspect current git state**

Run: `git status --short`

Expected: clean after Task 2 commit.

- [ ] **Step 2: Remove unused import**

Delete `useMemo` from the first import. The top imports should start as:

```tsx
'use client';

import { EyeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';
import type { CountdownConfig } from '@/types';
import { calculateTimeRemaining } from '@/lib/countdown';
import { useState, useEffect } from 'react';
```

- [ ] **Step 3: Replace the empty preview shell**

Replace the `if (!config || !time)` return block with:

```tsx
if (!config || !time) {
  return (
    <div className="rounded-md border border-[#dedbd5] bg-white">
      <div className="flex items-center gap-2 border-b border-[#ece9e4] px-4 py-3 text-sm font-medium text-[#37352f]">
        <EyeIcon className="h-4 w-4 text-[#787774]" />
        <span>{t('preview')}</span>
      </div>
      <div className="flex min-h-[260px] items-center justify-center p-8 text-center text-sm text-[#9b9a97]">
        {t('previewPlaceholder')}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Replace the populated preview shell**

Keep `renderCountdown()` and `getStyleClasses()` unchanged. Replace only the final `return` wrapper with:

```tsx
return (
  <div className="rounded-md border border-[#dedbd5] bg-white">
    <div className="flex items-center gap-2 border-b border-[#ece9e4] px-4 py-3 text-sm font-medium text-[#37352f]">
      <EyeIcon className="h-4 w-4 text-[#787774]" />
      <span>{t('preview')}</span>
    </div>
    <div
      className="flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-b-md bg-[#fbfbfa] p-3 sm:p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className={getStyleClasses()}>
        {config.title && (
          <h2 className="mb-3 text-center text-base font-semibold sm:mb-6 sm:text-2xl" style={{ color: textColor }}>
            {config.title}
          </h2>
        )}
        {renderCountdown()}
      </div>
    </div>
  </div>
);
```

- [ ] **Step 5: Run lint**

Run: `npm run lint`

Expected: lint completes with no new errors.

- [ ] **Step 6: Commit**

Run:

```bash
git add components/WidgetPreview.tsx
git commit -m "style: restyle config preview shell" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Task 4: Replace Config Page With Quiet Workbench

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Inspect current git state**

Run: `git status --short`

Expected: clean after Task 3 commit.

- [ ] **Step 2: Keep state and handlers unchanged**

Do not change these state variables or handlers:

```tsx
const [date, setDate] = useState('');
const [time, setTime] = useState('08:00');
const [title, setTitle] = useState('');
const [unit, setUnit] = useState<CountdownUnit>('days');
const [theme, setTheme] = useState<Theme>('auto');
const [style, setStyle] = useState<Style>('minimal');
const [endMessage, setEndMessage] = useState('');
const [generatedUrl, setGeneratedUrl] = useState('');
const [copied, setCopied] = useState(false);
```

Keep `previewConfig`, `handleGenerate`, and `handleCopy` behavior unchanged.

- [ ] **Step 3: Add local class constants inside `ConfigPage`**

Add these constants after `handleCopy`:

```tsx
const labelClass = 'mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#787774]';
const fieldClass = 'h-11 w-full rounded-md border border-[#dedbd5] bg-white px-3 text-[15px] text-[#37352f] outline-none transition-colors placeholder:text-[#9b9a97] hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10';
const selectClass = 'h-11 w-full cursor-pointer rounded-md border border-[#dedbd5] bg-white px-3 text-[15px] text-[#37352f] outline-none transition-colors hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10';
```

- [ ] **Step 4: Replace the full `return` JSX in `ConfigPage`**

Replace the current `return (` block in `ConfigPage` with this JSX:

```tsx
return (
  <main className="min-h-screen bg-[#fbfbfa] px-4 py-5 text-[#37352f] sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="border-b border-[#ece9e4] pb-5">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-[#787774]">Notion Countdown / New widget</p>
          <LanguageSwitcher />
        </div>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-normal text-[#37352f] sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-2 text-base leading-7 text-[#787774]">{t('subtitle')}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <section className="rounded-md border border-[#dedbd5] bg-white">
          <div className="border-b border-[#ece9e4] px-5 py-4">
            <h2 className="text-base font-semibold text-[#37352f]">{t('generateButton')}</h2>
            <p className="mt-1 text-sm text-[#787774]">{t('selectDateTime')}</p>
          </div>

          <div className="space-y-6 p-5">
            <div className="rounded-md border border-[#ece9e4] bg-[#fbfbfa] p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DateInput value={date} onChange={setDate} />
                <TimeInput value={time} onChange={setTime} />
              </div>
              {isValid && (
                <div className="mt-4 rounded-md border border-[#dedbd5] bg-white px-3 py-2">
                  <p className="text-sm text-[#787774]">
                    <span className="font-medium text-[#37352f]">{t('targetTime')}:</span>{' '}
                    {new Date(`${date}T${time}`).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
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

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  <PencilIcon className="h-4 w-4" />
                  <span>{t('titleLabel')}</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('titlePlaceholder')}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <PencilIcon className="h-4 w-4" />
                  <span>{t('endMessage')}</span>
                </label>
                <input
                  type="text"
                  value={endMessage}
                  onChange={(e) => setEndMessage(e.target.value)}
                  placeholder={t('endMessagePlaceholder')}
                  className={fieldClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{t('unit')}</span>
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as CountdownUnit)}
                    className={selectClass}
                  >
                    <option value="days">{t('unitDays')}</option>
                    <option value="hours">{t('unitHours')}</option>
                    <option value="minutes">{t('unitMinutes')}</option>
                    <option value="seconds">{t('unitSeconds')}</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    <SwatchIcon className="h-4 w-4" />
                    <span>{t('theme')}</span>
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as Theme)}
                    className={selectClass}
                  >
                    <option value="auto">{t('themeAuto')}</option>
                    <option value="light">{t('themeLight')}</option>
                    <option value="dark">{t('themeDark')}</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    <SparklesIcon className="h-4 w-4" />
                    <span>{t('style')}</span>
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as Style)}
                    className={selectClass}
                  >
                    <option value="minimal">{t('styleMinimal')}</option>
                    <option value="card">{t('styleCard')}</option>
                    <option value="gradient">{t('styleGradient')}</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isValid}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#37352f] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2f2d29] active:bg-[#262421] disabled:cursor-not-allowed disabled:bg-[#d8d5ce] disabled:text-[#9b9a97]"
            >
              <RocketLaunchIcon className="h-5 w-5" />
              <span>{isValid ? t('generateButton') : t('selectDateTime')}</span>
            </button>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <WidgetPreview config={previewConfig} />

          <section className="rounded-md border border-[#dedbd5] bg-white">
            <div className="flex items-center gap-2 border-b border-[#ece9e4] px-4 py-3 text-sm font-medium text-[#37352f]">
              <CheckCircleIcon className={`h-4 w-4 ${generatedUrl ? 'text-[#2f7d32]' : 'text-[#9b9a97]'}`} />
              <span>{generatedUrl ? t('urlGenerated') : t('generateButton')}</span>
            </div>

            {generatedUrl ? (
              <div className="space-y-4 p-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className="min-w-0 flex-1 rounded-md border border-[#dedbd5] bg-[#fbfbfa] px-3 py-2 font-mono text-xs text-[#37352f] outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      copied
                        ? 'bg-[#2f7d32] text-white'
                        : 'bg-[#37352f] text-white hover:bg-[#2f2d29] active:bg-[#262421]'
                    }`}
                  >
                    {copied ? <CheckCircleIcon className="h-4 w-4" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
                    <span>{copied ? t('copied') : t('copyButton')}</span>
                  </button>
                </div>
                <QRCodeDisplay url={generatedUrl} />
              </div>
            ) : (
              <div className="p-4">
                <div className="rounded-md border border-dashed border-[#dedbd5] bg-[#fbfbfa] px-4 py-8 text-center text-sm text-[#9b9a97]">
                  {t('selectDateTime')}
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  </main>
);
```

- [ ] **Step 5: Run lint**

Run: `npm run lint`

Expected: lint completes with no new errors.

- [ ] **Step 6: Commit**

Run:

```bash
git add app/page.tsx
git commit -m "style: redesign config page as Notion workbench" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Task 5: Build And Visual Verification

**Files:**
- Read: `app/page.tsx`
- Read: `app/widget/page.tsx`

- [ ] **Step 1: Inspect current git state**

Run: `git status --short`

Expected: clean after Task 4 commit.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: Next.js build completes successfully.

- [ ] **Step 3: Start dev server**

Run: `npm run dev`

Expected: local server starts and prints a localhost URL.

- [ ] **Step 4: Desktop visual check**

Open the config page at the dev server URL. Verify:

- Background is warm paper, not blue-purple gradient.
- Header is workspace-like, not centered hero.
- Desktop layout has left configuration panel and right preview/output column.
- Generate button is Notion dark, not gradient.
- Right preview is inside a neutral panel.

- [ ] **Step 5: Mobile visual check**

Inspect around 390px width. Verify:

- No horizontal scrolling.
- Header, form, preview, and output stack vertically.
- Generated URL input and copy button do not overlap.
- Chinese and English labels remain readable.

- [ ] **Step 6: Widget route regression check**

Generate a URL from the config page. Open the generated `/widget?...` URL. Verify:

- `/widget` still renders the existing countdown.
- Existing `minimal`, `card`, and `gradient` style values still work.
- The widget page itself did not receive the Quiet Workbench shell.

- [ ] **Step 7: Commit verification note if any docs changed**

No commit is needed if verification does not change files. If a small documentation note is added, commit it with:

```bash
git add docs/superpowers/plans/2026-06-12-notion-config-page-redesign.md
git commit -m "docs: update Notion redesign verification notes" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Self-Review

- Spec coverage: The plan covers the approved Quiet Workbench layout, Notion-like colors, global font cleanup, support component styling, config-page preview shell styling, generated URL output styling, mobile behavior, lint/build verification, and explicit `/widget` non-change verification.
- Out-of-scope check: No task modifies `app/widget/page.tsx`, URL parameters, countdown logic, localization architecture, or new widget styles.
- Type consistency: Existing `CountdownUnit`, `Theme`, and `Style` values are preserved. Component props remain unchanged.
- Completion-marker scan: This plan contains no unfinished work markers or undefined implementation gaps.
