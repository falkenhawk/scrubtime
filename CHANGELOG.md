# Changelog

## [0.3.0] - 2026-01-18

### Added
- Magnifier popup above digit fields during touch drag (shows current value)
- Long press activation (300ms) - starts value changes immediately without drag threshold
- Distance-based activation shows magnifier first, requires more movement before first change

### Changed
- Vertical swipe direction: down = increase, up = decrease (natural scroll)
- Minutes drag sensitivity now matches base (slower, more precise)
- Magnifier styled smaller and more subtle

### Fixed
- Prevent rapid-fire value changes on drag activation
- Slider labels no longer block thumb touch interaction

## [0.2.0] - 2026-01-18

### Added
- Touch support for digit fields (swipe to change values on mobile)
- Vertical swipe on touch devices (up = increase, down = decrease)
- Auto-select text when clicking digit fields for keyboard input
- Rolling input for digits (continuous typing keeps last 2 digits)

### Changed
- Hours field is now 2x slower to drag (more deliberate changes)
- Minutes field is now 2x faster to drag (quick adjustments)
- Prevent page scroll when dragging slider on mobile

## [0.1.0] - 2026-01-17

### Added
- Initial release
- Draggable scrubber for hours and minutes
- Horizontal slider for quick time selection
- Click-to-edit with keyboard input
- Keyboard navigation (arrow keys)
- CSS variables for theming
- Light/dark mode support
- TypeScript support
