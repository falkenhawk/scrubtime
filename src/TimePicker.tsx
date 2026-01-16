import { useRef, useCallback } from 'react';

export interface TimePickerProps {
  /** Current time value in "H:mm" or "HH:mm" format */
  value: string;
  /** Callback fired when time changes */
  onChange: (value: string) => void;
  /** Optional label displayed above the picker */
  label?: string;
  /** Custom class name for the root element */
  className?: string;
  /** Disable the picker */
  disabled?: boolean;
  /** Slider step in minutes (default: 15) */
  sliderStep?: number;
  /** Drag sensitivity - pixels per unit change (default: 3) */
  dragSensitivity?: number;
}

interface DraggableValueProps {
  value: number;
  onDelta: (delta: number) => void;
  formatValue?: (v: number) => string;
  className?: string;
  disabled?: boolean;
  sensitivity: number;
}

function DraggableValue({
  value,
  onDelta,
  formatValue,
  className,
  disabled,
  sensitivity,
}: DraggableValueProps) {
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const accumulatedDelta = useRef(0);
  const onDeltaRef = useRef(onDelta);
  onDeltaRef.current = onDelta;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      isDragging.current = true;
      lastX.current = e.clientX;
      accumulatedDelta.current = 0;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const deltaX = e.clientX - lastX.current;
        const deltaValue = deltaX / sensitivity;
        accumulatedDelta.current += deltaValue;

        const wholeDelta = Math.trunc(accumulatedDelta.current);
        if (wholeDelta !== 0) {
          accumulatedDelta.current -= wholeDelta;
          onDeltaRef.current(wholeDelta);
        }
        lastX.current = e.clientX;
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, sensitivity]
  );

  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`scrubtime-value ${className || ''} ${disabled ? 'scrubtime-value--disabled' : ''}`}
      role="spinbutton"
      aria-valuenow={value}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {displayValue}
    </div>
  );
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(':').map(Number);
  return { hours: h || 0, minutes: m || 0 };
}

function formatTime(hours: number, minutes: number): string {
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

function clampTotalMinutes(totalMins: number): number {
  return Math.max(0, Math.min(23 * 60 + 59, totalMins));
}

export function TimePicker({
  value,
  onChange,
  label,
  className,
  disabled = false,
  sliderStep = 15,
  dragSensitivity = 3,
}: TimePickerProps) {
  const { hours, minutes } = parseTime(value);
  const totalMinutes = hours * 60 + minutes;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const mins = clampTotalMinutes(parseInt(e.target.value));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    onChange(formatTime(h, m));
  };

  const handleHoursDelta = useCallback(
    (delta: number) => {
      const newHours = Math.max(0, Math.min(23, hours + delta));
      onChange(formatTime(newHours, minutes));
    },
    [hours, minutes, onChange]
  );

  const handleMinutesDelta = useCallback(
    (delta: number) => {
      const newTotalMinutes = clampTotalMinutes(totalMinutes + delta);
      const h = Math.floor(newTotalMinutes / 60);
      const m = newTotalMinutes % 60;
      onChange(formatTime(h, m));
    },
    [totalMinutes, onChange]
  );

  return (
    <div className={`scrubtime ${className || ''} ${disabled ? 'scrubtime--disabled' : ''}`}>
      {label && <label className="scrubtime-label">{label}</label>}

      <div className="scrubtime-container">
        <div className="scrubtime-display">
          <DraggableValue
            value={hours}
            onDelta={handleHoursDelta}
            disabled={disabled}
            sensitivity={dragSensitivity}
            className="scrubtime-hours"
          />
          <span className="scrubtime-separator">:</span>
          <DraggableValue
            value={minutes}
            onDelta={handleMinutesDelta}
            formatValue={(v) => String(v).padStart(2, '0')}
            disabled={disabled}
            sensitivity={dragSensitivity}
            className="scrubtime-minutes"
          />
        </div>

        <div className="scrubtime-slider-container">
          <input
            type="range"
            min={0}
            max={23 * 60 + 59}
            step={sliderStep}
            value={totalMinutes}
            onChange={handleSliderChange}
            disabled={disabled}
            className="scrubtime-slider"
            aria-label="Time slider"
          />
          <div className="scrubtime-slider-labels">
            <span>0</span>
            <span>6</span>
            <span>12</span>
            <span>18</span>
            <span>24</span>
          </div>
        </div>
      </div>
    </div>
  );
}
