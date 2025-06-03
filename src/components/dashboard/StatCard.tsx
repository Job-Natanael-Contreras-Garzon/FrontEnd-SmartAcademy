import React, { ReactElement } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  useTheme, 
  SvgIconProps
} from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactElement<SvgIconProps>;
  color?: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'info';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Tarjeta de estadísticas para dashboards
 * Muestra un valor principal con un título y un icono opcional
 */
export const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  subtitle,
  trend
}: StatCardProps) => {
  const theme = useTheme();
  
  // Obtener el color correspondiente
  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'warning':
        return theme.palette.warning?.main || '#ff9800';
      case 'error':
        return theme.palette.error.main;
      case 'success':
        return theme.palette.success?.main || '#4caf50';
      case 'info':
        return theme.palette.info?.main || '#2196f3';
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Mostrar el trend (tendencia)
  const renderTrend = () => {
    if (!trend) return null;
    
    const trendColor = trend.isPositive ? '#4caf50' : '#f44336';
    const trendPrefix = trend.isPositive ? '+' : '';
    
    return (
      <Typography 
        variant="caption" 
        sx={{ 
          color: trendColor,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold'
        }}
      >
        {trend.isPositive ? '↑' : '↓'} {trendPrefix}{trend.value}%
      </Typography>
    );
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{ textTransform: 'uppercase', fontWeight: 500 }}
        >
          {title}
        </Typography>
        
        {icon && (
          <Box 
            sx={{ 
              bgcolor: `${iconColor}15`, // Color con baja opacidad
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { 
              sx: { color: iconColor, fontSize: 22 }
            })}
          </Box>
        )}
      </Box>
      
      <Box sx={{ mt: 'auto' }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold', mb: 0.5 }}
        >
          {value}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          
          {renderTrend()}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatCard;
