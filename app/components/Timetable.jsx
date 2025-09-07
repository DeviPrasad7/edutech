'use client';

const timetable = [
  { day: 'Monday', subject: 'Math', time: '9:00 AM - 10:00 AM' },
  { day: 'Tuesday', subject: 'Physics', time: '10:15 AM - 11:15 AM' },
  { day: 'Wednesday', subject: 'Chemistry', time: '9:00 AM - 10:00 AM' },
  { day: 'Thursday', subject: 'Biology', time: '11:30 AM - 12:30 PM' },
  { day: 'Friday', subject: 'English', time: '9:00 AM - 10:00 AM' },
];

export default function Timetable() {
  return (
    <div className="bg-white rounded shadow p-5 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Timetable</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-3">Day</th>
            <th className="border-b p-3">Subject</th>
            <th className="border-b p-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map(({ day, subject, time }) => (
            <tr key={day} className="border-b hover:bg-gray-100">
              <td className="p-3">{day}</td>
              <td className="p-3">{subject}</td>
              <td className="p-3">{time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
