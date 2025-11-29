import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../../api/propertiesApi';
import { calendarApi } from '../../api/calendarApi';
import { CalendarIcon, HomeIcon } from '@heroicons/react/24/outline';

const CalendarViewPage = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [viewDate, setViewDate] = useState(new Date());

  // Fetch properties
  const { data: propertiesData } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertiesApi.list()
  });

  const properties = propertiesData?.data || [];
  const selectedPropertyData = properties.find(p => p.id === parseInt(selectedProperty));
  const units = selectedPropertyData?.units || [];

  // Calculate date range for calendar (current month)
  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

  // Fetch calendar data
  const { data: calendarData, isLoading: calendarLoading } = useQuery({
    queryKey: ['calendar', selectedProperty, selectedUnit, startOfMonth, endOfMonth],
    queryFn: () => calendarApi.getEvents({
      property_id: selectedProperty || undefined,
      unit_id: selectedUnit || undefined,
      start: startOfMonth.toISOString().split('T')[0],
      end: endOfMonth.toISOString().split('T')[0]
    }),
    enabled: !!selectedProperty
  });

  const events = calendarData?.data?.events || [];

  // Generate calendar grid
  const generateCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    let day = 1;

    // Generate 6 weeks (rows)
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      
      // Generate 7 days (columns)
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if ((week === 0 && dayOfWeek < startingDayOfWeek) || day > daysInMonth) {
          weekDays.push(null);
        } else {
          const currentDate = new Date(year, month, day);
          const dateString = currentDate.toISOString().split('T')[0];
          
          // Find bookings for this date
          const dayEvents = events.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return currentDate >= eventStart && currentDate <= eventEnd;
          });

          weekDays.push({
            day,
            date: currentDate,
            dateString,
            events: dayEvents
          });
          day++;
        }
      }
      
      calendar.push(weekDays);
      if (day > daysInMonth) break;
    }

    return calendar;
  };

  const calendar = generateCalendar();

  const previousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-200',
      pending_payment: 'bg-yellow-200',
      confirmed: 'bg-blue-200',
      checked_in: 'bg-green-200',
      checked_out: 'bg-purple-200',
      canceled: 'bg-red-200',
      completed: 'bg-green-300'
    };
    return colors[status] || 'bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Calendar
          </h1>
          <p className="text-gray-600">
            View booking availability and occupancy
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Property
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedProperty}
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                  setSelectedUnit('');
                }}
              >
                <option value="">-- Select a property --</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name} ({property.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Unit (Optional)
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                disabled={!selectedProperty || units.length === 0}
              >
                <option value="">All Units</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!selectedProperty ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Please select a property to view the calendar
            </p>
          </div>
        ) : (
          <>
            {/* Calendar Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Previous
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={nextMonth}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Next →
                </button>
              </div>

              {calendarLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-semibold text-gray-700 py-2">
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days */}
                    {calendar.map((week, weekIndex) => (
                      <React.Fragment key={weekIndex}>
                        {week.map((dayData, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`min-h-24 border border-gray-200 p-2 ${
                              dayData ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            {dayData && (
                              <>
                                <div className={`text-sm font-medium mb-1 ${
                                  dayData.date.toDateString() === new Date().toDateString()
                                    ? 'text-primary-600'
                                    : 'text-gray-900'
                                }`}>
                                  {dayData.day}
                                </div>
                                {dayData.events.length > 0 && (
                                  <div className="space-y-1">
                                    {dayData.events.slice(0, 2).map((event, index) => (
                                      <div
                                        key={index}
                                        className={`text-xs px-1 py-1 rounded truncate ${getStatusColor(event.status)}`}
                                        title={`${event.title} - ${event.status}`}
                                      >
                                        {event.unit_name || 'Booking'}
                                      </div>
                                    ))}
                                    {dayData.events.length > 2 && (
                                      <div className="text-xs text-gray-600">
                                        +{dayData.events.length - 2} more
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-3">Legend:</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span className="text-sm text-gray-600">Draft</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                        <span className="text-sm text-gray-600">Pending Payment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-200 rounded"></div>
                        <span className="text-sm text-gray-600">Confirmed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-200 rounded"></div>
                        <span className="text-sm text-gray-600">Checked In</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-purple-200 rounded"></div>
                        <span className="text-sm text-gray-600">Checked Out</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confirmed</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {events.filter(e => e.status === 'confirmed').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Checked In</p>
                      <p className="text-2xl font-bold text-green-600">
                        {events.filter(e => e.status === 'checked_in').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {events.filter(e => e.status === 'pending_payment').length}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarViewPage;
