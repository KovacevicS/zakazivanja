import React from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';

function MyCalendar({ mojDatum, onPostavi }) {
  
  const tileDisabled = ({ date }) => {
    const currentDate = moment();
    const dayOfWeek = moment(date).day(); // Dan u nedelji (0 - nedelja, 1 - ponedeljak, ..., 6 - subota)
    
    // Zaključavamo nedelju (dan u nedelji je 0)
    if (dayOfWeek === 0) {
      return true;
    }
    
    // Zaključavamo prošle datume i datume koji su više od 14 dana u budućnosti
    const isPastDate = moment(date).isBefore(currentDate, 'day');
    const isFutureDate = moment(date).isAfter(currentDate.add(14, 'days'), 'day');
    
    return isPastDate || isFutureDate; 
  };
 

  return (
    <div>
      <Calendar value={mojDatum} tileDisabled={tileDisabled} onChange={onPostavi} />
    </div>
  );
}

export default MyCalendar;