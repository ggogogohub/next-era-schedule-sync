
import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TimeOffRequestForm } from '@/components/forms/TimeOffRequestForm';
import { useAuthStore } from '@/lib/auth';
import { TimeOffRequest } from '@/types';

export const TimeOff = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadTimeOffRequests();
  }, []);

  const loadTimeOffRequests = async () => {
    try {
      setIsLoading(true);
      // Load time-off requests from API
      // Mock data for demonstration
      const mockRequests: TimeOffRequest[] = [
        {
          id: '1',
          employeeId: user?.id || '1',
          employee: user!,
          startDate: '2024-02-15',
          endDate: '2024-02-20',
          reason: 'Family vacation',
          type: 'vacation',
          status: 'pending',
          submittedAt: '2024-01-20T10:00:00Z',
          totalDays: 4,
        },
        {
          id: '2',
          employeeId: user?.id || '1',
          employee: user!,
          startDate: '2024-01-25',
          endDate: '2024-01-25',
          reason: 'Doctor appointment',
          type: 'personal',
          status: 'approved',
          submittedAt: '2024-01-15T09:00:00Z',
          reviewedAt: '2024-01-16T14:30:00Z',
          reviewedBy: 'manager1',
          totalDays: 1,
        },
        {
          id: '3',
          employeeId: user?.id || '1',
          employee: user!,
          startDate: '2024-03-10',
          endDate: '2024-03-12',
          reason: 'Sick leave',
          type: 'sick',
          status: 'rejected',
          submittedAt: '2024-01-18T11:00:00Z',
          reviewedAt: '2024-01-19T16:00:00Z',
          reviewedBy: 'manager1',
          reviewerNotes: 'Insufficient sick leave balance',
          totalDays: 3,
        },
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Failed to load time-off requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      // Submit new time-off request
      console.log('Submitting time-off request:', formData);
      // Add API call here
      setIsFormOpen(false);
      loadTimeOffRequests(); // Reload the list
    } catch (error) {
      console.error('Failed to submit time-off request:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const totalDaysRequested = requests.reduce((sum, req) => sum + req.totalDays, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Off Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage your time-off requests and view your balance
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Time-Off Request</DialogTitle>
              <DialogDescription>
                Fill out the form below to request time off
              </DialogDescription>
            </DialogHeader>
            <TimeOffRequestForm onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Days remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Year</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Total approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Used</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDaysRequested}</div>
            <p className="text-xs text-muted-foreground">
              Total requested
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
          <CardDescription>
            All your time-off requests and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    {getStatusIcon(request.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">
                          {formatDate(request.startDate)}
                          {request.startDate !== request.endDate && 
                            ` - ${formatDate(request.endDate)}`
                          }
                        </h3>
                        <Badge className={getTypeColor(request.type)}>
                          {request.type}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {request.reason}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{request.totalDays} day(s)</span>
                        <span>Submitted {formatDate(request.submittedAt)}</span>
                        {request.reviewedAt && (
                          <span>Reviewed {formatDate(request.reviewedAt)}</span>
                        )}
                      </div>
                      {request.reviewerNotes && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                          <strong>Note:</strong> {request.reviewerNotes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {request.status === 'pending' && (
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No time-off requests yet
              </h3>
              <p className="text-gray-500 mb-4">
                Submit your first time-off request to get started.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
