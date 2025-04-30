import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { mt } from 'date-fns/locale/mt'; // Maltese locale

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';
import ScheduleSetter from './ScheduleSetter';
import DownloadSchedule from './DownloadSchedule';

const CalendarComponent: React.FC = () => {
const [isMobile, setIsMobile] = useState(false);
const [selectingSchedule, setSelectingSchedule] = useState(false);
const [selectedDates, setSelectedDates] = useState<Date[]>([]);
const [workDays, setWorkDays] = useState<Date[]>([]);

const locales = {
  'mt': mt,
};

const handleSelectSlot = (slotInfo: any) => {
  if (!selectingSchedule) return;

  const date = new Date(slotInfo.start);
  // Prevent duplicate selection
  if (selectedDates.some(d => isSameDay(d, date))) return;

  setSelectedDates(prev => [...prev, date]);
};

const applySchedule = () => {
  if (selectedDates.length !== 4) {
    resetScheduleSetter();
    return;
  }

  const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
  const isConsecutive = sorted.every((d, i, arr) => i === 0 || isSameDay(d, new Date(arr[i - 1].getTime() + 86400000)));

  if (!isConsecutive) {
    resetScheduleSetter();
    return;
  }

  const allWorkDays: Date[] = [];
  let day = new Date(sorted[0]);

  while (day.getFullYear() === 2025) {
    for (let i = 0; i < 4; i++) {
      allWorkDays.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    day.setDate(day.getDate() + 2); // Skip 2 rest days
  }

  setWorkDays(allWorkDays);
  resetScheduleSetter();
};

const resetScheduleSetter = () => {
  setSelectedDates([]);
  setSelectingSchedule(false);
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Public Holidays in Malta (Example)
const publicHolidays = [
  new Date(2025, 0, 1), // New Year's Day
  new Date(2025, 1, 10),
  new Date(2025, 2, 19),
  new Date(2025, 2, 31),
  new Date(2025, 3, 18),
  new Date(2025, 4, 1), // Labour Day
  new Date(2025, 5, 7),
  new Date(2025, 5, 29),
  new Date(2025, 7, 15), // Feast of the Assumption
  new Date(2025, 8, 8), // Feast of Our Lady of Victories
  new Date(2025, 11, 13), // Republic Day
  new Date(2025, 11, 25),
];




  

  // Update screen size state on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // or any other threshold you want
    };

    checkMobile(); // run on mount
    window.addEventListener('resize', checkMobile); // add resize listener

    return () => window.removeEventListener('resize', checkMobile); // cleanup on unmount
    
  }, []);

  

  // Custom day style to highlight public holidays
  const eventStyleGetter = (event: any) => {
    const isHoliday = publicHolidays.some((holiday) => isSameDay(event.start, holiday));
    const isSelected = selectedDates.some((date) => isSameDay(event.start, date));
    const isWorkDay = workDays.some((day) => isSameDay(event.start, day));
  
    return {
      className: isHoliday
        ? 'holiday-day'
        : isSelected
        ? 'selected-day'
        : isWorkDay
        ? 'work-day'
        : '',
    };
  };
  const dayPropGetter = (date: Date) => {
    //const isHoliday = publicHolidays.some((holiday) => isSameDay(holiday, date));
    const isSelected = selectedDates.some((selected) => isSameDay(selected, date));
    const isWorkDay = workDays.some((work) => isSameDay(work, date));
  
    let className = '';
    //if (isHoliday) className = 'holiday-day';
    if (isSelected) className = 'selected-day';
    else if (isWorkDay) className = 'work-day';
  
    return {
      className,
    };
  };
  
  
  

  const holidayEvents = publicHolidays.map(date => ({
    title: "Public Holiday",
    start: date,
    end: date,
    allDay: true
  }));
  
  return (
    <div className="calendar-wrapper">
<div className="top-bar">
  <ScheduleSetter
    selecting={selectingSchedule}
    selectedDates={selectedDates}
    setSelecting={setSelectingSchedule}
    onDone={applySchedule}
  />
  <DownloadSchedule
  workDays={workDays}
  publicHolidays={publicHolidays}
/>
</div>

      <Calendar
        selectable
        onSelectSlot={handleSelectSlot}
      
        localizer={localizer}
        events={holidayEvents} // <--- this is essential
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month']} // 👈 Only enable the "month" view
        
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        style={{ height: '100%' }}
      />
      
    </div>
  );
  
};

export default CalendarComponent;

