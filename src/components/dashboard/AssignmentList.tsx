import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Assignment } from '../../types/academic';

interface AssignmentListProps {
  assignments: Assignment[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  emptyMessage?: string;
  onViewAll?: () => void;
  maxItems?: number;
}

/**
 * Componente para mostrar una lista de tareas pendientes
 */
const AssignmentList: React.FC<AssignmentListProps> = ({ 
  assignments, 
  isLoading = false,
  error = null,
  title = 'Tareas pendientes',
  emptyMessage = 'No hay tareas pendientes',
  onViewAll,
  maxItems = 5
}) => {
  const theme = useTheme();
  
  // Calcula cuántos días faltan para la entrega
  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Determina el color del chip según los días restantes
  const getChipColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'error';
    if (daysLeft <= 2) return 'warning';
    if (daysLeft <= 7) return 'primary';
    return 'default';
  };
  
  // Obtiene el mensaje para la fecha de entrega
  const getDueDateText = (dueDate: string) => {
    const daysLeft = getDaysLeft(dueDate);
    
    if (daysLeft < 0) {
      return 'Vencida';
    } else if (daysLeft === 0) {
      return 'Vence hoy';
    } else if (daysLeft === 1) {
      return 'Vence mañana';
    } else {
      return `${daysLeft} días restantes`;
    }
  };

  // Filtra y limita las tareas a mostrar
  const displayedAssignments = assignments.slice(0, maxItems);
  
  // Estado de carga
  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }
  
  // Estado de error
  if (error) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Box sx={{ textAlign: 'center', py: 4, color: theme.palette.error.main }}>
          <Typography>{error}</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {onViewAll && assignments.length > maxItems && (
          <Button 
            size="small" 
            onClick={onViewAll}
            sx={{ textTransform: 'none' }}
          >
            Ver todas
          </Button>
        )}
      </Box>
      
      {displayedAssignments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">{emptyMessage}</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {displayedAssignments.map((assignment, index) => {
            const daysLeft = getDaysLeft(assignment.due_date);
            const chipColor = getChipColor(daysLeft);
            
            return (
              <React.Fragment key={assignment.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ px: 0, py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {assignment.title}
                        </Typography>
                        <Chip 
                          size="small" 
                          color={chipColor as any}
                          label={getDueDateText(assignment.due_date)}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.primary"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          {assignment.course_name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, fontSize: '0.75rem' }}>
                          <AccessTimeIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                          {format(new Date(assignment.due_date), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < displayedAssignments.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      )}
      
      {onViewAll && assignments.length > maxItems && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={onViewAll}
            sx={{ textTransform: 'none' }}
          >
            Ver todas las tareas ({assignments.length})
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default AssignmentList;
