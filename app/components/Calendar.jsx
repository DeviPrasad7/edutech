// components/Calendar.jsx
'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Import base styles

export default function InteractiveCalendar() {
  // CSS for react-day-picker to match our dark theme
  const calendarStyles = `
    .rdp {
      --rdp-cell-size: 40px;
      --rdp-caption-font-size: 1.125rem;
      --rdp-accent-color: #818cf8; /* indigo-400 */
      --rdp-background-color: #a3e635; /* lime-400 */
      margin: 1em 0;
      color: #e5e7eb; /* gray-200 */
    }
    .rdp-caption_label {
        color: #fff;
        font-weight: 700;
    }
    .rdp-nav_button {
        color: #c7d2fe; /* indigo-200 */
    }
    .rdp-head_cell {
        color: #9ca3af; /* gray-400 */
        font-weight: 600;
    }
    .rdp-day_today {
        color: #a3e635; /* lime-400 */
        font-weight: 700;
    }
    .rdp-day_selected {
        background-color: #6366f1; /* indigo-500 */
        color: #fff;
        font-weight: 700;
    }
  `;

  return (
    // The component is wrapped in our standard Card for consistency
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg p-6">
       <h2 className="font-extrabold text-2xl text-indigo-300 mb-4">Upcoming Events</h2>
       <style>{calendarStyles}</style>
       <DayPicker
        mode="single"
        showOutsideDays
        fixedWeeks
        // You can add event handlers like onSelect, etc. here
       />
    </div>
  );
}