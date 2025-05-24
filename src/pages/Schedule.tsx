
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/auth';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';

export const Schedule = () => {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, [currentDate, viewMode]);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      // Load schedules from API
      // Mock data for demonstration
      const mockSchedules = [
        {
          id: '1',
          date: '2024-01-22',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Main Office',
          role: 'Customer Service',
          status: 'scheduled',
        },
        {
          id: '2',
          date: '2024-01-23',
          startTime: '13:00',
          endTime: '21:00',
          location: 'Store #2',
          role: 'Sales Associate',
          status: 'scheduled',
        },
        {
          id: '3',
          date: '2024-01-24',
          startTime: '08:00',
          endTime: '16:00',
          location: 'Main Office',
          role: 'Customer Service',
          status: 'confirmed',
        },
        {
          id: '4',
          date: '2024-01-25',
          startTime: '10:00',
          endTime: '18:00',
          location: 'Store #1',
          role: 'Supervisor',
          status: 'scheduled',
        },
      ];
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getSchedulesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return schedules.filter(schedule => schedule.date === dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'missed': return 'bg-red-500';
      case 'cancelled': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-1">
            View and manage your work schedule
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: 'week' | 'month') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(currentDate, 'MMM yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      {viewMode === 'week' && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-semibold">
            {format(startOfWeek(currentDate), 'MMM d')} - {format(endOfWeek(currentDate), 'MMM d, yyyy')}
          </h2>
          
          <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Schedule Grid */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {getWeekDays().map((day, index) => {
            const daySchedules = getSchedulesForDate(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <Card key={index} className={`${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {format(day, 'EEE')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {format(day, 'MMM d')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {daySchedules.length > 0 ? (
                    daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <div className="text-xs font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {schedule.location}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {schedule.role}
                        </div>
                        <Badge
                          className={`mt-1 text-xs ${getStatusColor(schedule.status)} text-white`}
                        >
                          {schedule.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 text-center py-4">
                      No shifts
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Schedule</CardTitle>
            <CardDescription>
              Your schedule for {format(currentDate, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
            />
          </CardContent>
        </Card>
      )}

      {/* Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This Week Summary</CardTitle>
          <CardDescription>
            Overview of your scheduled hours and shifts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {schedules.length}
              </div>
              <div className="text-sm text-gray-600">Total Shifts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">32</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Roles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {(user?.role === 'manager' || user?.role === 'administrator') && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule Actions</CardTitle>
            <CardDescription>
              Manage and modify schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Shift
              </Button>
              <Button variant="outline">
                Generate Schedule
              </Button>
              <Button variant="outline">
                Copy Previous Week
              </Button>
              <Button variant="outline">
                Export Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
