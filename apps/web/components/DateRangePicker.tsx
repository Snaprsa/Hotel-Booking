'use client';

import { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  value: { from: Date; to: Date } | undefined;
  onChange: (range: { from: Date; to: Date } | undefined) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onChange({ from: range.from, to: range.to });
      setIsOpen(false);
    } else if (range?.from) {
      onChange({ from: range.from, to: addDays(range.from, 1) });
    }
  };

  const displayText = value?.from && value?.to
    ? `${format(value.from, 'MMM d, yyyy')} - ${format(value.to, 'MMM d, yyyy')}`
    : 'Select dates';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-200 p-3 text-left focus:border-gold outline-none bg-white"
      >
        {displayText}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 bg-white shadow-xl border mt-1 p-4">
          <DayPicker
            mode="range"
            selected={value ? { from: value.from, to: value.to } : undefined}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ before: new Date() }}
            modifiersClassNames={{
              selected: 'bg-gold text-white',
              today: 'font-bold text-gold',
            }}
          />
        </div>
      )}
    </div>
  );
}
