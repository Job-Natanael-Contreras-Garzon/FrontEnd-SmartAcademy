export type NotificationType = 'general' | 'academic' | 'administrative' | 'personal';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
  recipient_id: number;
  sender_id: number;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
  recipient_name?: string;
  sender_name?: string;
}

export interface CreateNotificationRequest {
  recipient_id: number;
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
}

export interface CreateBulkNotificationRequest {
  recipient_ids: number[];
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
}

export interface NotificationResponse {
  message: string;
  count?: number;
}
