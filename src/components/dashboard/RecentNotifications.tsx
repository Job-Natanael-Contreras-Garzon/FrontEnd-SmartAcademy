import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Divider,
  Link,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationService from '../../services/notification';
import type { Notification } from '../../services/notification';
import NotificationItem from '../notifications/NotificationItem';

interface RecentNotificationsProps {
  limit?: number;
}

/**
 * Componente para mostrar notificaciones recientes en el dashboard
 */
const RecentNotifications: React.FC<RecentNotificationsProps> = ({ limit = 3 }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await NotificationService.getNotifications(limit);
        setNotifications(response.notifications);
        setError(null);
      } catch (err) {
        console.error('Error al cargar notificaciones recientes:', err);
        setError('No se pudieron cargar las notificaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [limit]);

  // Manejadores de eventos
  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      
      // Actualizar estado local
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      
      // Eliminar del estado local
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  return (
    <Card>
      <CardHeader 
        title="Notificaciones recientes" 
        avatar={<NotificationsIcon color="primary" />}
        action={
          <Button 
            component={RouterLink} 
            to="/notifications"
            size="small"
            color="primary"
          >
            Ver todas
          </Button>
        }
      />

      <Divider />

      <CardContent sx={{ p: 0 }}>
        {/* Estado de carga */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={30} />
          </Box>
        )}

        {/* Estado de error */}
        {!loading && error && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        {/* Estado sin notificaciones */}
        {!loading && !error && notifications.length === 0 && (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <NotificationsOffIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No tienes notificaciones recientes
            </Typography>
          </Box>
        )}

        {/* Lista de notificaciones */}
        {!loading && !error && notifications.length > 0 && (
          <>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationItem 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/notifications" 
                underline="hover"
                color="primary"
                variant="body2"
              >
                Ver todas las notificaciones
              </Link>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentNotifications;
