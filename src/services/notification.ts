import ApiService from './api';
import type { User } from '../types/auth';

// Tipos para el servicio de notificaciones
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string; // URL opcional a la que redirigir al hacer clic
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

/**
 * Servicio para la gestión de notificaciones
 */
class NotificationService {
  /**
   * Obtiene las notificaciones del usuario actual
   * @param limit Número máximo de notificaciones a obtener
   * @returns Notificaciones del usuario
   */
  async getNotifications(limit: number = 10): Promise<NotificationResponse> {
    try {
      // En una implementación real, esto haría una llamada a la API
      // const response = await ApiService.get(`/api/v1/notifications?limit=${limit}`);
      // return response.data;

      // Simulación de datos para desarrollo
      return this.getMockNotifications(limit);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  /**
   * Marca una notificación como leída
   * @param notificationId ID de la notificación
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // En una implementación real, esto haría una llamada a la API
      // await ApiService.put(`/api/v1/notifications/${notificationId}/read`);
      
      console.log(`Notificación ${notificationId} marcada como leída`);
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  }

  /**
   * Marca todas las notificaciones del usuario como leídas
   */
  async markAllAsRead(): Promise<void> {
    try {
      // En una implementación real, esto haría una llamada a la API
      // await ApiService.put('/api/v1/notifications/read-all');
      
      console.log('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  }

  /**
   * Elimina una notificación
   * @param notificationId ID de la notificación
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      // En una implementación real, esto haría una llamada a la API
      // await ApiService.delete(`/api/v1/notifications/${notificationId}`);
      
      console.log(`Notificación ${notificationId} eliminada`);
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  }

  /**
   * Genera notificaciones de prueba para desarrollo
   * @param limit Número de notificaciones a generar
   * @returns Notificaciones de prueba
   */
  private getMockNotifications(limit: number): NotificationResponse {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: '1',
        title: 'Tarea calificada',
        message: 'Tu tarea "Introducción a React" ha sido calificada con 9.5/10',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: '/courses/react/assignments/1'
      },
      {
        id: '2',
        userId: '1',
        title: 'Nuevo mensaje',
        message: 'Has recibido un nuevo mensaje de María González',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        link: '/messages/25'
      },
      {
        id: '3',
        userId: '1',
        title: 'Recordatorio',
        message: 'La entrega del proyecto final es mañana a las 23:59',
        type: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: '/courses/react/assignments/final'
      },
      {
        id: '4',
        userId: '1',
        title: 'Error en el sistema',
        message: 'Hubo un problema al guardar tu último progreso',
        type: 'error',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '5',
        userId: '1',
        title: 'Nueva clase disponible',
        message: 'Se ha publicado una nueva clase de "JavaScript Avanzado"',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        link: '/courses/javascript/lessons/advanced'
      }
    ];

    // Obtener solo las notificaciones solicitadas
    const notifications = mockNotifications.slice(0, limit);
    
    // Contar notificaciones no leídas
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return {
      notifications,
      unreadCount
    };
  }
}

export default new NotificationService();
