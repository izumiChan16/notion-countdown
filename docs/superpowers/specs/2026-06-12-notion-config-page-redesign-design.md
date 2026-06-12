# Notion Config Page Redesign Design

## Scope

Redesign only the configuration page at `app/page.tsx` and its configuration-page support components. Do not redesign `app/widget/page.tsx` in this pass.

The embedded widget page will keep its existing URL contract, countdown rendering behavior, theme handling, style options, and timer logic. The configuration page may restyle the preview container around `WidgetPreview`, but it must not introduce a new widget style system or change generated widget parameters.

## Direction

Use a Notion-inspired "Quiet Workbench" layout.

The page should feel like a Notion workspace rather than a marketing page:

- Warm paper background, close to `#fbfbfa`.
- Dark Notion text, close to `#37352f`.
- Subtle borders, close to `#dedbd5` and `#ece9e4`.
- Small radii around 5-8px.
- Minimal shadows, used only where depth clarifies hierarchy.
- No blue-purple gradients, glass panels, oversized pill cards, or high-saturation accents.

The interface should be calm, editable, and practical. It should still feel polished, but the polish comes from spacing, typography, and restrained hierarchy.

## Layout

Use a two-column workbench on desktop:

- Left column: configuration controls.
- Right column: live preview, generated URL, copy action, and QR code.

Use a single-column stacked layout on mobile:

- Header first.
- Configuration controls next.
- Preview and output below.

The desktop layout should keep both columns visible without requiring the user to scroll immediately on typical laptop viewports. The right column can be sticky if it remains readable and does not create mobile issues.

## Header

Replace the current centered hero title with a Notion-like page header:

- A slim top row with product context, such as `Notion Countdown / New widget`.
- Language switcher aligned to the opposite side.
- A page title like the existing localized title.
- A concise subtitle using existing translation text.

The header should not look like a landing-page hero. It is part of the workspace.

## Configuration Controls

Keep the existing data and behavior:

- End date.
- End time.
- Optional title.
- Countdown unit.
- Theme mode.
- Widget style.
- Optional end message.
- Generate URL.

Restyle controls to match Notion:

- Inputs use white or near-white fills, thin neutral borders, and dark text.
- Labels are small, quiet, and paired with existing icons where useful.
- Date and time controls should feel like editable property fields.
- Unit, theme, and style can remain native selects if needed for implementation safety, but the visual treatment should be compact and Notion-like. If practical, use segmented option controls for a stronger Notion property-editing feel.
- The primary generate button should use Notion dark text color as its background, not a gradient.

The form should remain keyboard-accessible and preserve current validation behavior: generation stays disabled until date and time are valid.

## Preview And Output Panel

Do not change the actual widget page.

On the configuration page, place `WidgetPreview` inside a Notion-style panel:

- White surface.
- Thin neutral border.
- Small panel title row, such as `Live preview`.
- Neutral preview frame instead of the current heavy bordered section.

When no URL has been generated, the right column should still feel useful by showing the live preview when date and time are valid, plus a quiet empty output block.

When a URL is generated:

- Show the generated URL in a compact monospaced field.
- Show a Notion-style copy button.
- Show the QR code in a simple block.
- Use a restrained success indicator. Avoid green gradient panels.

## Typography

Use the existing `next/font` setup rather than adding remote runtime font requests.

The app already loads Geist through `next/font/google`, which is close enough for a modern Notion-like interface. Remove the global `Arial, Helvetica, sans-serif` override so the configured font variables can apply consistently.

Use neutral font weights:

- Page title: bold but not oversized.
- Section headings: medium or semibold.
- Body and labels: regular or medium.

Do not use large decorative display type.

## Components And Boundaries

Expected touched areas:

- `app/page.tsx`: main layout and page-level styling.
- `app/globals.css`: global font/background cleanup and datepicker neutral styling.
- `components/DateInput.tsx`: Notion-like input styling.
- `components/TimeInput.tsx`: Notion-like input, radio, and AM/PM styling.
- `components/LanguageSwitcher.tsx`: neutral segmented control styling.
- `components/WidgetPreview.tsx`: preview container styling only; keep countdown logic and style variants intact.
- `components/QRCodeDisplay.tsx`: neutral block styling.

Avoid changing:

- `app/widget/page.tsx`.
- `lib/countdown.ts`.
- `lib/url-builder.ts`.
- URL query parameter names or meanings.
- Translation keys unless strictly required by the redesign.

If duplicate preview/widget rendering becomes distracting during implementation, defer deeper extraction to a later refactor unless it is necessary to complete this visual redesign safely.

## Accessibility And Responsive Behavior

Maintain visible focus states on all interactive controls.

Use sufficient contrast for text, borders, and disabled states. Notion-like subtlety should not make fields hard to identify.

Ensure mobile layout avoids horizontal scrolling:

- Stack columns.
- Let buttons and generated URL fields wrap or resize.
- Keep text inside controls readable in Chinese and English.

## Verification

After implementation:

- Run lint.
- Run a production build.
- Start the local dev server.
- Inspect the configuration page on desktop and mobile widths.
- Confirm `/widget` still renders from a generated URL and was not intentionally restyled.

## Out Of Scope

- Additional widget card styles.
- Redesigning `app/widget/page.tsx`.
- Saving history or presets.
- Adding new URL parameters.
- Reworking localization architecture.
