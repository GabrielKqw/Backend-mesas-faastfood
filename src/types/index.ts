export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum TableStatus {
  FREE = 'FREE',
  OCCUPIED = 'OCCUPIED',
  WAITING_CLEANUP = 'WAITING_CLEANUP',
  RESERVED = 'RESERVED',
}

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface WebSocketNotification {
  event: string;
  data: Record<string, unknown>;
}
