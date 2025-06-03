import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  IconButton, 
  Box, 
  Tooltip 
} from '@mui/material';
import { 
  Info as InfoIcon, 
  Warning as WarningIcon, 
  Check as CheckIcon, 
  Error as ErrorIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import type { Notification } from '../../services/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Componente que muestra una notificación individual en la lista
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  // Formatea la fecha relativa (ej: "hace 2 horas")
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `hace ${diffInSeconds} segundos`;
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  };

  // Determina el icono según el tipo de notificación
  const getNotificationIcon = () => {
    const colors = {
      info: '#2196f3',
      warning: '#ff9800',
      success: '#4caf50',
      error: '#f44336'
    };

    let icon;
    switch (notification.type) {
      case 'info':
        icon = <InfoIcon />;
        break;
      case 'warning':
        icon = <WarningIcon />;
        break;
      case 'success':
        icon = <CheckIcon />;
        break;
      case 'error':
        icon = <ErrorIcon />;
        break;
      default:
        icon = <InfoIcon />;
    }

    return (
      <Avatar sx={{ bgcolor: colors[notification.type] }}>
        {icon}
      </Avatar>
    );
  };

  // Contenido principal de la notificación
  const content = (
    <>
      <ListItemAvatar>
        {getNotificationIcon()}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: notification.isRead ? 'normal' : 'bold',
              color: notification.isRead ? 'text.secondary' : 'text.primary'
            }}
          >
            {notification.title}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary" component="span">
              {notification.message}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              component="div"
              sx={{ mt: 0.5 }}
            >
              {getRelativeTime(notification.createdAt)}
            </Typography>
          </>
        }
      />
      <Box>
        {!notification.isRead && (
          <Tooltip title="Marcar como leída">
            <IconButton 
              edge="end" 
              size="small" 
              onClick={() => onMarkAsRead(notification.id)}
              sx={{ mr: 1 }}
            >
              <DoneAllIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Eliminar">
          <IconButton 
            edge="end" 
            size="small" 
            onClick={() => onDelete(notification.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );

  // Si tiene un enlace, envuelve el contenido en un Link
  return (
    <ListItem 
      alignItems="flex-start" 
      sx={{ 
        py: 1.5,
        px: 2,
        borderLeft: notification.isRead ? 'none' : `4px solid`,
        borderColor: notification.type === 'info' ? 'info.main' : 
                    notification.type === 'warning' ? 'warning.main' :
                    notification.type === 'success' ? 'success.main' : 'error.main',
        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      {notification.link ? (
        <RouterLink 
          to={notification.link} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'inherit',
            flex: 1
          }}
          onClick={() => {
            if (!notification.isRead) {
              onMarkAsRead(notification.id);
            }
          }}
        >
          {content}
        </RouterLink>
      ) : (
        content
      )}
    </ListItem>
  );
};

export default NotificationItem;
