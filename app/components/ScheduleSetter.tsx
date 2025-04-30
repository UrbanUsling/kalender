import React from 'react';
import '../styles/ScheduleSetter.css'; // <-- Make sure to import the new CSS file

interface ScheduleSetterProps {
  selecting: boolean;
  selectedDates: Date[];
  setSelecting: (val: boolean) => void;
  onDone: () => void;
}
//

const ScheduleSetter: React.FC<ScheduleSetterProps> = ({
  selecting,
  selectedDates,
  setSelecting,
  onDone,
}) => {
  return (
    <div className="schedule-setter-wrapper">
      {!selecting ? (
        <button className="schedule-button" onClick={() => setSelecting(true)}>
          Set Schedule
        </button>
      ) : (
        <div className="schedule-instructions">
          <p className="instruction-text">Set 4 consecutive workdays</p>
          <button className="schedule-button" onClick={onDone}>
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleSetter;
