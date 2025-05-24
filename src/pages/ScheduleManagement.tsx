
import { useState, useEffect } from 'react';
import { Calendar, Plus, Users, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      // Mock schedule data
      const mockSchedules = [
        {
          id: '1',
          employee: { firstName: 'John', lastName: 'Smith' },
          date: '2024-01-22',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Main Office',
          role: 'Customer Service',
          status: 'scheduled',
        },
        {
          id: '2',
          employee: { firstName: 'Sarah', lastName: 'Johnson' },
          date: '2024-01-22',
          startTime: '13:00',
          endTime: '21:00',
          location: 'Store #2',
          role: 'Sales Associate',
          status: 'confirmed',
        },
      ];
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSchedule = async () => {
    // Simulate AI schedule generation
    console.log('Generating AI-powered schedule...');
    // This would call the backend AI scheduling service
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage team schedules with AI assistance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
          <Button onClick={generateSchedule}>
            <Zap className="mr-2 h-4 w-4" />
            Generate Schedule
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              Staffing coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320</div>
            <p className="text-xs text-muted-foreground">
              Scheduled hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule Overview</CardTitle>
          <CardDescription>
            Current week schedule with employee assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Schedule Management Interface
            </h3>
            <p className="text-gray-500 mb-4">
              This would contain the full schedule management interface with drag-and-drop functionality.
            </p>
            <Button onClick={generateSchedule}>
              <Zap className="mr-2 h-4 w-4" />
              Generate AI Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
