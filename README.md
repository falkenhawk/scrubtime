# scrubtime

A React time picker with draggable scrubber and slider — minimal clicks, maximum control.

![npm](https://img.shields.io/npm/v/scrubtime)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/scrubtime)
![license](https://img.shields.io/npm/l/scrubtime)

## Features

- **Draggable scrubber** — Click and drag on hours/minutes to adjust values (like Figma, Blender, After Effects)
- **Horizontal slider** — Quick selection with configurable step intervals
- **Minimal clicks** — Designed for efficiency
- **Fully accessible** — Keyboard navigation and ARIA support
- **Customizable** — CSS variables for easy theming
- **Lightweight** — No dependencies besides React
- **TypeScript** — Full type support

## Installation

```bash
npm install scrubtime
# or
yarn add scrubtime
# or
pnpm add scrubtime
```

## Usage

```tsx
import { useState } from 'react';
import { TimePicker } from 'scrubtime';
import 'scrubtime/styles.css'; // Import default styles

function App() {
  const [time, setTime] = useState('14:30');

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      label="Select time"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Time in "H:mm" or "HH:mm" format |
| `onChange` | `(value: string) => void` | required | Called when time changes |
| `label` | `string` | - | Optional label above picker |
| `className` | `string` | - | Custom class for root element |
| `disabled` | `boolean` | `false` | Disable the picker |
| `sliderStep` | `number` | `15` | Slider step in minutes |
| `dragSensitivity` | `number` | `3` | Pixels per unit when dragging |
| `divisions` | `number` | `4` | Number of equal parts to divide the 24h range (4 = labels at 0, 6, 12, 18, 24) |

## Interaction

### Dragging (Scrubber)

- **Hours**: Click and drag left/right to decrease/increase (0-23, clamped)
- **Minutes**: Click and drag to change. Crossing 0 or 59 automatically adjusts the hour

### Slider

- Drag the slider for quick 15-minute jumps (configurable via `sliderStep`)
- Snaps to step intervals

### Keyboard

- Focus the value and use arrow keys to adjust

## Customization

### CSS Variables

Override these variables to customize the appearance:

```css
:root {
  --scrubtime-bg: #27272a;
  --scrubtime-bg-hover: #3f3f46;
  --scrubtime-border: #3f3f46;
  --scrubtime-text: #ffffff;
  --scrubtime-text-muted: #71717a;
  --scrubtime-value-bg: #3f3f46;
  --scrubtime-slider-bg: #3f3f46;
  --scrubtime-slider-thumb: #3b82f6;
  --scrubtime-slider-thumb-border: #1e3a5f;
  --scrubtime-radius: 0.75rem;
  --scrubtime-radius-sm: 0.5rem;
  --scrubtime-font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

### Without Default Styles

Don't import the CSS and style the classes yourself:

```tsx
import { TimePicker } from 'scrubtime';
// Don't import styles.css

// Style these classes:
// .scrubtime
// .scrubtime-label
// .scrubtime-container
// .scrubtime-display
// .scrubtime-value
// .scrubtime-hours
// .scrubtime-minutes
// .scrubtime-separator
// .scrubtime-slider-container
// .scrubtime-slider
// .scrubtime-slider-labels
```

### With Tailwind CSS

You can use Tailwind by passing a className and not importing the default styles:

```tsx
<TimePicker
  value={time}
  onChange={setTime}
  className="[&_.scrubtime-container]:bg-zinc-800 [&_.scrubtime-value]:bg-zinc-700"
/>
```

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Requires React 18+

## License

MIT © [falkenhawk](https://github.com/falkenhawk)
