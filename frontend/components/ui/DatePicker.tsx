import React, { useState, useRef, useEffect } from 'react';

const DatePicker = ({selectedDate, setSelectedDate}) => {
    const [date, setDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);

    // Cerrar calendario al hacer clic fuera
    useEffect(() => {
        if(selectedDate) {
            setDate(selectedDate);
        }
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Generar días del mes
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];
        const prevMonthDays = getDaysInMonth(year, month - 1);

        // Días del mes anterior
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`prev-${i}`} className="text-gray-400 p-2">
                    {prevMonthDays - firstDayOfMonth + i + 1}
                </div>
            );
        }

        // Días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            const isSelected = date && currentDate.toDateString() === date.toDateString();

            days.push(
                <div
                    key={`current-${i}`}
                    className={`p-2 cursor-pointer rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                        }`}
                    onClick={() => {
                        setDate(currentDate);
                        setShowCalendar(false);
                    }}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
            return newMonth;
        });
    };

    return (
        <div className="relative">
            <input
                type="text"
                readOnly
                value={date ? date.toLocaleDateString() : ''}
                placeholder="Select date"
                className="w-full p-2 border rounded-md cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
            />

            {showCalendar && (
                <div
                    ref={calendarRef}
                    className="absolute z-10 mt-1 w-64 bg-white border rounded-md shadow-lg p-4"
                >
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            &lt;
                        </button>
                        <h3 className="font-medium">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                            <div key={day} className="font-medium text-sm p-1">
                                {day}
                            </div>
                        ))}
                        {renderCalendar()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;