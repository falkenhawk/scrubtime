import { useRef, useCallback, useState } from 'react';

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
  /** Number of equal parts to divide the 24h range into (default: 4 = labels at 0,6,12,18,24) */
  divisions?: number;
}

interface DraggableValueProps {
  value: number;
  onDelta: (delta: number) => void;
  onSet: (value: number) => void;
  formatValue?: (v: number) => string;
  className?: string;
  disabled?: boolean;
  sensitivity: number;
  min: number;
  max: number;
}

const DRAG_THRESHOLD = 3;

function DraggableValue({
  value,
  onDelta,
  onSet,
  formatValue,
  className,
  disabled,
  sensitivity,
  min,
  max,
}: DraggableValueProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showMagnifier, setShowMagnifier] = useState(false);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const isLongPress = useRef(false);
  const needsBuffer = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const accumulatedDelta = useRef(0);
  const onDeltaRef = useRef(onDelta);
  onDeltaRef.current = onDelta;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isEditing) return;

      isDragging.current = true;
      hasDragged.current = false;
      startX.current = e.clientX;
      lastX.current = e.clientX;
      accumulatedDelta.current = 0;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;

        const totalDeltaX = Math.abs(e.clientX - startX.current);
        if (totalDeltaX > DRAG_THRESHOLD) {
          hasDragged.current = true;
        }

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
    [disabled, sensitivity, isEditing]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isEditing) return;

      const touch = e.touches[0];
      isDragging.current = true;
      hasDragged.current = false;
      isLongPress.current = false;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      lastX.current = touch.clientX;
      lastY.current = touch.clientY;
      accumulatedDelta.current = 0;

      // Long press timer - activates after 300ms, no threshold needed after
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        setShowMagnifier(true);
      }, 300);

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging.current) return;

        const touch = e.touches[0];

        // Before drag is activated, check threshold or long press
        if (!hasDragged.current) {
          const totalDeltaX = touch.clientX - startX.current;
          const totalDeltaY = touch.clientY - startY.current;

          // Long press activated - start immediately with +1/-1 on any movement
          if (isLongPress.current) {
            const deltaX = touch.clientX - lastX.current;
            const deltaY = touch.clientY - lastY.current;
            if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
              hasDragged.current = true;
              e.preventDefault();
              const direction = (deltaX + deltaY) > 0 ? 1 : -1;
              onDeltaRef.current(direction);
              lastX.current = touch.clientX;
              lastY.current = touch.clientY;
              // Add buffer to prevent rapid-fire changes after activation
              accumulatedDelta.current = -direction * 0.8;
              return;
            }
          }

          if (Math.abs(totalDeltaX) > DRAG_THRESHOLD || Math.abs(totalDeltaY) > DRAG_THRESHOLD) {
            // Cancel long press timer since drag started
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
            }
            hasDragged.current = true;
            needsBuffer.current = true;
            setShowMagnifier(true);
            e.preventDefault();
            // Show magnifier first, don't change value yet - further dragging will mutate
            lastX.current = touch.clientX;
            lastY.current = touch.clientY;
            accumulatedDelta.current = 0;
          }
          // Always update lastX/lastY so long press activation has fresh position
          lastX.current = touch.clientX;
          lastY.current = touch.clientY;
          return;
        }

        e.preventDefault();
        const deltaX = touch.clientX - lastX.current;
        const deltaY = touch.clientY - lastY.current;
        // Horizontal: right = increase, left = decrease
        // Vertical: up = increase, down = decrease
        const deltaValue = (deltaX + deltaY) / sensitivity;
        accumulatedDelta.current += deltaValue;

        // Require more movement for first change after distance activation
        const threshold = needsBuffer.current ? 2 : 1;
        if (Math.abs(accumulatedDelta.current) >= threshold) {
          const wholeDelta = Math.trunc(accumulatedDelta.current);
          accumulatedDelta.current -= wholeDelta;
          onDeltaRef.current(wholeDelta);
          needsBuffer.current = false;
        }
        lastX.current = touch.clientX;
        lastY.current = touch.clientY;
      };

      const handleTouchEnd = () => {
        isDragging.current = false;
        needsBuffer.current = false;
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        setShowMagnifier(false);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    },
    [disabled, sensitivity, isEditing]
  );

  const displayValue = formatValue ? formatValue(value) : String(value);

  const handleClick = useCallback(() => {
    if (disabled || hasDragged.current) return;
    setEditValue(displayValue);
    setIsEditing(true);
  }, [disabled, displayValue]);

  const handleDivKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setEditValue(e.key);
        setIsEditing(true);
      }
    },
    [disabled]
  );

  const commitEdit = useCallback(() => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onSet(clamped);
    }
    setIsEditing(false);
  }, [editValue, min, max, onSet]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        commitEdit();
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
    },
    [commitEdit]
  );

  if (isEditing) {
    return (
      <input
        type="text"
        inputMode="numeric"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value.replace(/\D/g, '').slice(-2))}
        onFocus={(e) => e.target.select()}
        onBlur={commitEdit}
        onKeyDown={handleKeyDown}
        className={`scrubtime-value scrubtime-value--editing ${className || ''}`}
        autoFocus
      />
    );
  }

  return (
    <div className="scrubtime-value-wrapper">
      {showMagnifier && (
        <div className="scrubtime-magnifier" aria-hidden="true">
          {displayValue}
        </div>
      )}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        onKeyDown={handleDivKeyDown}
        className={`scrubtime-value ${className || ''} ${disabled ? 'scrubtime-value--disabled' : ''}`}
        role="spinbutton"
        aria-valuenow={value}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {displayValue}
      </div>
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
  divisions = 4,
}: TimePickerProps) {
  const labelCount = divisions + 1;
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

  const handleHoursSet = useCallback(
    (newHours: number) => {
      onChange(formatTime(newHours, minutes));
    },
    [minutes, onChange]
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

  const handleMinutesSet = useCallback(
    (newMinutes: number) => {
      onChange(formatTime(hours, newMinutes));
    },
    [hours, onChange]
  );

  return (
    <div className={`scrubtime ${className || ''} ${disabled ? 'scrubtime--disabled' : ''}`}>
      {label && <label className="scrubtime-label">{label}</label>}

      <div className="scrubtime-container">
        <div className="scrubtime-display">
          <DraggableValue
            value={hours}
            onDelta={handleHoursDelta}
            onSet={handleHoursSet}
            disabled={disabled}
            sensitivity={dragSensitivity * 2}
            min={0}
            max={23}
            className="scrubtime-hours"
          />
          <span className="scrubtime-separator">:</span>
          <DraggableValue
            value={minutes}
            onDelta={handleMinutesDelta}
            onSet={handleMinutesSet}
            formatValue={(v) => String(v).padStart(2, '0')}
            disabled={disabled}
            sensitivity={dragSensitivity}
            min={0}
            max={59}
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
            tabIndex={-1}
            className="scrubtime-slider"
            aria-label="Time slider"
          />
          <div className="scrubtime-slider-labels">
            {Array.from({ length: labelCount }, (_, i) => {
              const hour = Math.round((24 / divisions) * i);
              const percent = (i / divisions) * 100;
              return (
                <span key={i} style={{ left: `${percent}%` }}>
                  {hour}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
