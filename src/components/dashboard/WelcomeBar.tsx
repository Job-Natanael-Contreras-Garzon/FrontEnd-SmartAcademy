import { 
  Paper, 
  Typography, 
  Box, 
  useTheme, 
  useMediaQuery,
  Avatar,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WelcomeBarProps {
  username: string;
  role?: string;
  lastLogin?: string | Date;
  photo?: string;
  roleText?: {
    administrator?: string;
    teacher?: string;
    student?: string;
    parent?: string;
  };
}

/**
 * Barra de bienvenida para los dashboards
 */
export const WelcomeBar = ({ 
  username, 
  role, 
  lastLogin,
  photo,
  roleText = {
    administrator: 'Administrador',
    teacher: 'Profesor/a',
    student: 'Estudiante',
    parent: 'Padre/Tutor'
  }
}: WelcomeBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Formatear último acceso
  const formattedLastLogin = lastLogin 
    ? format(new Date(lastLogin), "'Último acceso:' d 'de' MMMM 'a las' HH:mm", { locale: es }) 
    : '';

  // Obtener saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '¡Buenos días';
    if (hour >= 12 && hour < 19) return '¡Buenas tardes';
    return '¡Buenas noches';
  };
  
  // Obtener el texto del rol
  const getRoleText = () => {
    if (!role) return '';
    return roleText[role as keyof typeof roleText] || '';
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: { xs: 2, md: 3 }, 
        mb: 3, 
        borderRadius: 2, 
        background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2
        }}
      >
        {photo && (
          <Avatar 
            src={photo} 
            alt={username}
            sx={{ 
              width: { xs: 60, md: 80 }, 
              height: { xs: 60, md: 80 }, 
              border: '3px solid white',
            }}
          />
        )}
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold', 
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            {getGreeting()}, {username}!
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 1 : 2,
              alignItems: isMobile ? 'flex-start' : 'center',
            }}
          >
            {role && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {getRoleText()}
                </Typography>
                {!isMobile && lastLogin && <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.5)' }} />}
              </>
            )}
            
            {lastLogin && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {formattedLastLogin}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default WelcomeBar;
