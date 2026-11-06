import React, { useState, useMemo } from 'react';
import { useApp, calculateHoursDifference } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  FileText, 
  TrendingUp, 
  Building, 
  Sparkles, 
  AlertCircle,
  Briefcase,
  Layers,
  Send
} from 'lucide-react';

const COMMON_TECH = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PyTorch', 'SQL', 
  'Docker', 'AWS', 'Git', 'FastAPI', 'Tailwind CSS', 'Figma'
];

export const StudentDashboard: React.FC = () => {
  const { 
    authSession, 
    students, 
    logs, 
    addDailyLog, 
    setActiveView 
  } = useApp();

  const student = authSession?.role === 'student' && authSession.student
    ? students.find(s => s.id === authSession.student?.id) || authSession.student
    : null;

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [entryTime, setEntryTime] = useState<string>('09:30');
  const [exitTime, setExitTime] = useState<string>('17:30');
  const [tasksText, setTasksText] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string[]>(['React', 'TypeScript']);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Calendar View Month/Year state
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());

  if (!student) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Student Authentication Required</h2>
        <p className="text-xs text-slate-500 mt-2 mb-4">
          Please log in with your Student ID to access the daily work and timesheet logger.
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Filter logs for this student
  const studentLogs = useMemo(() => {
    return logs
      .filter((l) => l.studentId === student.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs, student.id]);

  // Aggregate metrics
  const totalHours = useMemo(() => {
    return Math.round(studentLogs.reduce((acc, curr) => acc + curr.totalHours, 0) * 10) / 10;
  }, [studentLogs]);

  const daysWorked = studentLogs.length;
  const avgHoursPerDay = daysWorked > 0 ? (totalHours / daysWorked).toFixed(1) : '0';

  // Real-time automatic hour calculation
  const calculatedLiveHours = useMemo(() => {
    return calculateHoursDifference(entryTime, exitTime);
  }, [entryTime, exitTime]);

  // Map of logged dates for fast calendar lookups
  const loggedDatesMap = useMemo(() => {
    const map = new Map<string, number>();
    studentLogs.forEach((l) => map.set(l.date, l.totalHours));
    return map;
  }, [studentLogs]);

  // If student clicks on a date that already has a log, load it into the form for editing/viewing
  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    const existingLog = studentLogs.find((l) => l.date === dateStr);
    if (existingLog) {
      setEntryTime(existingLog.entryTime);
      setExitTime(existingLog.exitTime);
      setTasksText(existingLog.tasksCompleted);
      setSelectedTech(existingLog.technologiesUsed || []);
      setFormFeedback({
        type: 'success',
        message: `Loaded existing timesheet entry for ${dateStr} (${existingLog.totalHours} hrs).`,
      });
    } else {
      setTasksText('');
      setFormFeedback(null);
    }
  };

  const handleToggleTech = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleSubmitDailyWork = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!tasksText.trim()) {
      setFormFeedback({
        type: 'error',
        message: 'Please provide a description of the tasks completed during this shift.',
      });
      return;
    }

    if (calculatedLiveHours <= 0) {
      setFormFeedback({
        type: 'error',
        message: 'Exit time must be later than entry time.',
      });
      return;
    }

    const res = addDailyLog({
      studentId: student.id,
      date: selectedDate,
      entryTime,
      exitTime,
      tasksCompleted: tasksText,
      technologiesUsed: selectedTech,
    });

    if (res.success) {
      setFormFeedback({
        type: 'success',
        message: res.message,
      });
      setTasksText('');
    } else {
      setFormFeedback({
        type: 'error',
        message: res.message,
      });
    }
  };

  // Calendar rendering helpers
  const year = currentCalendarMonth.getFullYear();
  const month = currentCalendarMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentCalendarMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarMonth(new Date(year, month + 1, 1));
  };

  const monthName = currentCalendarMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Profile Header & Stats Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
              <span className="font-mono-num text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-md">
                {student.id}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Intern
              </span>
            </div>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-700">{student.domain}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.college}</span>
              </span>
              <span>·</span>
              <span>
                Term: {student.startDate} to {student.endDate}
              </span>
            </div>
          </div>

          {/* Quick Certificate Gateway Button */}
          <div className="flex items-center gap-3 shrink-0">
            {student.certificate.status === 'approved' ? (
              <button
                onClick={() => setActiveView('certificate-generator')}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:from-amber-700 hover:to-amber-800 transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-200" />
                <span>View Generated Certificate</span>
              </button>
            ) : student.certificate.status === 'pending' ? (
              <button
                onClick={() => setActiveView('certificate-generator')}
                className="px-4 py-2 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Certificate Request Pending</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('certificate-generator')}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>Go to Certificate Generator</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Logged</div>
            <div className="text-2xl font-bold font-mono-num text-slate-900 mt-1">{totalHours} <span className="text-xs font-normal text-slate-500">hrs</span></div>
            <div className="text-[11px] text-blue-600 mt-0.5">Automated calculation</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Days Active</div>
            <div className="text-2xl font-bold font-mono-num text-slate-900 mt-1">{daysWorked} <span className="text-xs font-normal text-slate-500">days</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Attendance streak</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Daily Average</div>
            <div className="text-2xl font-bold font-mono-num text-slate-900 mt-1">{avgHoursPerDay} <span className="text-xs font-normal text-slate-500">hrs/day</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Productive shift pace</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Certificate Status</div>
            <div className="text-sm font-bold text-slate-900 mt-2 truncate">
              {student.certificate.status === 'approved' ? (
                <span className="text-emerald-700">Issued & Certified</span>
              ) : student.certificate.status === 'pending' ? (
                <span className="text-amber-700">Under Review</span>
              ) : (
                <span className="text-slate-600">Ready to Request</span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-mono-num">
              {student.certificate.certificateId || 'ID: Ready on approval'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Calendar & Attendance Form | Right Column Timesheet Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Calendar & Daily Work Entry Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Daily Entry Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Record Daily Work & Attendance</h3>
                  <p className="text-xs text-slate-500">Entry/exit time calculation with manual task documentation</p>
                </div>
              </div>

              <div className="text-xs font-mono-num font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Selected: {selectedDate}
              </div>
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitDailyWork} className="space-y-4">
              
              {/* Date & Shift Times Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => handleSelectDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Entry Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exit Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                  />
                </div>
              </div>

              {/* Automatic Hours Calculation Banner */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    Calculated Work Duration:
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono-num text-blue-900">
                    {calculatedLiveHours} Hours
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    (Shift: {entryTime} to {exitTime})
                  </span>
                </div>
              </div>

              {/* Manual Tasks Completed Entry */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manual Daily Work Log / Deliverables *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the modules developed, bugs solved, algorithm optimizations, or project meetings completed today..."
                  value={tasksText}
                  onChange={(e) => setTasksText(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
                />
              </div>

              {/* Technologies / Tags Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Technologies / Tools Engaged:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TECH.map((tech) => {
                    const isSelected = selectedTech.includes(tech);
                    return (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => handleToggleTech(tech)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Daily Timesheet & Log</span>
              </button>
            </form>
          </div>

          {/* Interactive Attendance Calendar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Attendance Calendar</h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-800 px-2 min-w-[120px] text-center">
                  {monthName}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 uppercase py-1">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 rounded-lg bg-slate-50/50" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDate === dateKey;
                const hasLog = loggedDatesMap.has(dateKey);
                const hoursLogged = loggedDatesMap.get(dateKey);

                return (
                  <button
                    type="button"
                    key={dateKey}
                    onClick={() => handleSelectDate(dateKey)}
                    className={`h-11 rounded-lg p-1 text-xs transition-all relative flex flex-col items-center justify-between border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 shadow-xs'
                        : hasLog
                        ? 'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px]">{dayNum}</span>
                    {hasLog && (
                      <span className="text-[9px] font-mono-num font-bold text-emerald-700 leading-none">
                        {hoursLogged}h
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-400" />
                  <span>Logged shift</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-500" />
                  <span>Selected date</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSelectDate(todayStr)}
                className="text-blue-600 hover:underline font-semibold"
              >
                Jump to Today
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Timesheet History / Log Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Timesheet History ({studentLogs.length})</h3>
              </div>
              <span className="text-xs font-mono-num text-slate-500">
                Total: {totalHours} hrs
              </span>
            </div>

            {studentLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No daily work logged yet.</p>
                <p className="text-[11px] text-slate-400">
                  Select a date and record your hours and deliverables above.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto space-y-1">
                {studentLogs.map((log) => (
                  <div key={log.id} className="py-3.5 space-y-2 group">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className="font-mono-num">{log.date}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono-num text-slate-600 text-[11px]">
                          {log.entryTime} – {log.exitTime}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono-num font-bold text-xs bg-blue-50 text-blue-700">
                        {log.totalHours} hrs
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {log.tasksCompleted}
                    </p>

                    {log.technologiesUsed && log.technologiesUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {log.technologiesUsed.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
