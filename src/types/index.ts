
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  skills: string[];
  phoneNumber?: string;
  emergencyContact?: EmergencyContact;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  availability: AvailabilityPattern[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface AvailabilityPattern {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export type UserRole = 'employee' | 'manager' | 'administrator';

export interface Schedule {
  id: string;
  employeeId: string;
  employee: User;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  role: string;
  department: string;
  status: ScheduleStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleStatus = 'scheduled' | 'confirmed' | 'completed' | 'missed' | 'cancelled';

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employee: User;
  startDate: string;
  endDate: string;
  reason: string;
  type: TimeOffType;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerNotes?: string;
  totalDays: number;
}

export type TimeOffType = 'vacation' | 'sick' | 'personal' | 'emergency' | 'other';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requester: User;
  targetEmployeeId: string;
  targetEmployee: User;
  originalShiftId: string;
  originalShift: Schedule;
  proposedShiftId?: string;
  proposedShift?: Schedule;
  reason: string;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerNotes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  recipientId?: string;
  recipient?: User;
  departmentId?: string;
  subject: string;
  content: string;
  type: MessageType;
  priority: MessagePriority;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
  requiresAcknowledgment: boolean;
  acknowledgments: MessageAcknowledgment[];
}

export type MessageType = 'direct' | 'announcement' | 'system' | 'emergency';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface MessageAcknowledgment {
  userId: string;
  user: User;
  acknowledgedAt: string;
}

export interface WorkforceMetrics {
  totalEmployees: number;
  activeEmployees: number;
  scheduledHours: number;
  actualHours: number;
  utilizationRate: number;
  attendanceRate: number;
  overtimeHours: number;
  departmentBreakdown: DepartmentMetric[];
  recentActivity: ActivityLog[];
}

export interface DepartmentMetric {
  department: string;
  employeeCount: number;
  scheduledHours: number;
  actualHours: number;
  utilizationRate: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SchedulingConstraints {
  id: string;
  name: string;
  minStaffing: { [department: string]: number };
  maxStaffing: { [department: string]: number };
  operatingHours: {
    [dayOfWeek: number]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  skillRequirements: { [role: string]: string[] };
  maxConsecutiveDays: number;
  minRestHours: number;
  maxHoursPerWeek: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}
