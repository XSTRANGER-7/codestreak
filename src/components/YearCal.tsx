
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useUserData } from '../contexts/UserDataContext';
import { DateTime } from "luxon";

const YearCal = () => {
  const { userStats, getStreakCalendar } = useUserData();

  const calendarData = (() => {
    const days: { date: string; active: boolean; count: number }[] = [];
    const today = DateTime.now().setZone("Asia/Kolkata").startOf("day");
    const past = today.minus({ years: 1 }).plus({ days: 1 });

    const map = new Map(getStreakCalendar().map((d: any) => [d.date, d]));

    let d = past;
    while (d <= today) {
      const iso = d.toISODate(); // format YYYY-MM-DD
      const data = map.get(iso) || { date: iso, active: false, count: 0 };
      days.push(data);
      d = d.plus({ days: 1 });
    }

    return days;
  })();

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-white/5 border-white/10';
    if (count === 1) return 'bg-purple-500/20 border-purple-500/30';
    if (count === 2) return 'bg-purple-500/40 border-purple-500/50';
    return 'bg-purple-500/60 border-purple-500/70';
  };

  const getDayOfWeek = (dateString: string) =>
    DateTime.fromISO(dateString, { zone: 'Asia/Kolkata' }).weekday % 7; // 0 = Sunday
  const getMonth = (dateString: string) =>
    DateTime.fromISO(dateString, { zone: 'Asia/Kolkata' }).month - 1;
  const getMonthLabel = (month: number) =>
    DateTime.fromObject({ month: month + 1 }).toFormat("LLL");

  // Group into weeks
  const weeks: Array<Array<any>> = [];
  let currentWeek: Array<any> = [];

  calendarData.forEach((day, index) => {
    const isFirst = index === 0;
    if (isFirst) {
      const startDay = getDayOfWeek(day.date);
      for (let i = 0; i < startDay; i++) {
        currentWeek.push({ date: '', active: false, count: 0 });
      }
    }

    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', active: false, count: 0 });
    }
    weeks.push(currentWeek);
  }

  // Month labels
  const monthLabels: { [key: number]: number } = {};
  let lastMonth = -1;
  weeks.forEach((week, idx) => {
    const firstDay = week.find((d) => d.date);
    if (firstDay) {
      const month = getMonth(firstDay.date);
      if (month !== lastMonth) {
        monthLabels[month] = idx;
        lastMonth = month;
      }
    }
  });

  const totalActiveDays = calendarData.filter((day) => day.active).length;
  const averageProblemsPerDay =
    totalActiveDays > 0
      ? (
          calendarData.reduce((sum, day) => sum + day.count, 0) / totalActiveDays
        ).toFixed(1)
      : '0';

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 xl:px-0">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-purple-500" />
          Yearly Consistency
        </h2>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
        <LegendBox label="No activity" color="bg-white/5 border-white/10" />
        <LegendBox label="1 problem" color="bg-purple-500/20 border-purple-500/30" />
        <LegendBox label="2 problems" color="bg-purple-500/40 border-purple-500/50" />
        <LegendBox label="3+ problems" color="bg-purple-500/60 border-purple-500/70" />
      </div>

      {/* Calendar */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[800px]">
          {/* Month Labels */}
          <div className="ml-0 flex  justify-evenly">
            {weeks.map((_, weekIndex) => {
              const labelEntry = Object.entries(monthLabels).find(
                ([, idx]) => idx === weekIndex
              );
              return (
                <div
                  key={weekIndex}
                  className="w-4 text-xs text-gray-400 text-center"
                >
                  {labelEntry ? getMonthLabel(parseInt(labelEntry[0])) : ''}
                </div>
              );
            })}
          </div>

          {/* Days Grid */}
          <div className="flex mt-2">
            {/* Day Labels */}
            <div className="flex flex-col justify-between mr-2 min-w-fit">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-xs text-gray-400 h-4">
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex w-max">
              {weeks.map((week, weekIndex) => {
                const currentMonth =
                  week.find((d) => d.date)?.date &&
                  getMonth(week.find((d) => d.date)?.date);
                const nextWeekMonth =
                  weeks[weekIndex + 1]?.find((d) => d.date)?.date &&
                  getMonth(weeks[weekIndex + 1].find((d) => d.date)?.date);

                const isNewMonth = nextWeekMonth !== currentMonth;

                return (
                  <div
                    key={weekIndex}
                    className={`flex flex-col space-y-1 mr-1 ${
                      isNewMonth ? 'mr-3' : ''
                    }`}
                  >
                    {week.map((day, dayIndex) => (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-4 h-4 rounded-sm border transition-all duration-200 hover:scale-110 ${
                          day.date
                            ? getIntensityClass(day.count)
                            : 'bg-transparent border-transparent'
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: (weekIndex * 7 + dayIndex) * 0.001,
                        }}
                        title={
                          day.date
                            ? `${DateTime.fromISO(day.date, {
                                zone: 'Asia/Kolkata',
                              }).toFormat('DDD')}: ${
                                day.count
                              } problem${day.count === 1 ? '' : 's'}`
                            : ''
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LegendBox = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-3 h-3 rounded-sm border ${color}`}></div>
    <span>{label}</span>
  </div>
);

export default YearCal;
