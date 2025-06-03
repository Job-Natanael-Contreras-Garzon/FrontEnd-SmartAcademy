import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Tabs, 
  Tab, 
  Stack,
  Button,
  Divider
} from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';
import NotificationList from '../../components/notifications/NotificationList';
import NotificationService from '../../services/notification';
import type { Notification } from '../../services/notification';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente para panel de pestañas
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

/**
 * Página principal de notificaciones
 * Permite ver todas las notificaciones con filtros y opciones de gestión
 */
const NotificationsPage: React.FC = () => {
  // Estados
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications();
  }, [tabValue]); // Recargar cuando cambie la pestaña

  // Función para obtener notificaciones
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications(50); // Obtener más notificaciones para esta vista
      
      // Filtrar según la pestaña seleccionada
      let filtered = [...response.notifications];
      if (tabValue === 1) { // No leídas
        filtered = filtered.filter(n => !n.isRead);
      } else if (tabValue === 2) { // Leídas
        filtered = filtered.filter(n => n.isRead);
      }
      
      setNotifications(filtered);
      setError(null);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de eventos
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      
      // Actualizar estado local
      setNotifications(prevNotifications => {
        const updated = prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        );
        
        // Si estamos en la pestaña "No leídas", remover la notificación marcada
        if (tabValue === 1) {
          return updated.filter(n => !n.isRead);
        }
        
        return updated;
      });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      
      // Actualizar estado local
      if (tabValue === 0) { // Todas
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, isRead: true }))
        );
      } else if (tabValue === 1) { // No leídas
        // Si estamos en la pestaña "No leídas", vaciar la lista
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
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

  // Verificar si hay notificaciones no leídas
  const hasUnread = notifications.some(notification => !notification.isRead);

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          {/* Encabezado */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Typography variant="h5" component="h1">
                Notificaciones
              </Typography>
              
              {hasUnread && (
                <Button 
                  variant="outlined" 
                  startIcon={<DoneAllIcon />}
                  onClick={handleMarkAllAsRead}
                  size="small"
                >
                  Marcar todo como leído
                </Button>
              )}
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Pestañas */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="notification tabs"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Todas" id="notification-tab-0" aria-controls="notification-tabpanel-0" />
              <Tab label="No leídas" id="notification-tab-1" aria-controls="notification-tabpanel-1" />
              <Tab label="Leídas" id="notification-tab-2" aria-controls="notification-tabpanel-2" />
            </Tabs>
          </Box>
          
          {/* Contenido de pestañas */}
          <TabPanel value={tabValue} index={0}>
            <NotificationList
              notifications={notifications}
              loading={loading}
              error={error}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDelete={handleDelete}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <NotificationList
              notifications={notifications}
              loading={loading}
              error={error}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDelete={handleDelete}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <NotificationList
              notifications={notifications}
              loading={loading}
              error={error}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDelete={handleDelete}
            />
          </TabPanel>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default NotificationsPage;
