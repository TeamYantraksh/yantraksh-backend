export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  VOLUNTEER = 'volunteer',
  PARTICIPANT = 'participant'
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedEventId?: string; // For organizers
  token?: string;
}

export interface TechEvent {
  id: string;
  name: string;
  description: string;
  conductedBy: string; // Admin or Organizer User Name
  coordinatorId: string; // Linked User ID
  date: string;
  venue: string;
  maxParticipants: number;
  participantsCount: number;
  status: EventStatus;
}

export interface Merchandise {
  id: string;
  name: string;
  price: number;
  stock: number;
  soldCount: number;
  imageUrl: string;
}

export interface Participation {
  id: string;
  userId: string;
  userName: string;
  eventId: string;
  eventName: string;
  registrationDate: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  totalMerchSold: number;
  activeCoordinators: number;
}
