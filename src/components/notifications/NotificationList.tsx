import React from 'react';
import { 
  List, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider,
  CircularProgress
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationItem from './NotificationItem';
import type { Notification } from '../../services/notification';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

/**
 * Componente que muestra una lista de notificaciones
 */
const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  error,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) => {
  // Estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="outlined" color="primary" size="small" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Box>
    );
  }

  // Estado vacío
  if (notifications.length === 0) {
    return (
      <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
        <NotificationsOffIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No tienes notificaciones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Las notificaciones importantes aparecerán aquí
        </Typography>
      </Box>
    );
  }

  // Verificar si hay notificaciones no leídas
  const hasUnread = notifications.some(notification => !notification.isRead);

  return (
    <Paper elevation={0} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
      {/* Encabezado con contador y botón para marcar todo como leído */}
      {hasUnread && (
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            size="small" 
            startIcon={<DoneAllIcon />}
            onClick={onMarkAllAsRead}
          >
            Marcar todo como leído
          </Button>
        </Box>
      )}

      <Divider />

      {/* Lista de notificaciones */}
      <List disablePadding>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <NotificationItem 
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
            {index < notifications.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationList;
