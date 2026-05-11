import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
}

export function handleFirestoreError(error: any, operation: FirestoreErrorInfo['operationType'], path: string | null = null): string {
  console.error(`Firestore Error [${operation}] at ${path}:`, error);
  
  const message = error?.message || '';
  
  if (message.includes('insufficient permissions') || message.includes('permission-denied')) {
    return 'You do not have access (Permission denied)';
  }
  
  if (message.includes('requires an index') || message.includes('failed-precondition')) {
    return 'Database needs setup (admin action required: check indexes)';
  }

  if (message.includes('offline')) {
    return 'Database is currently offline. Please check your connection.';
  }

  return `System error: ${message || 'Unknown error occurred'}`;
}
