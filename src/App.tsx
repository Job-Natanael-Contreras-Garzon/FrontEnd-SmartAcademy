// React se importa implícitamente al usar JSX
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

// Rutas
import AppRoutes from './routes/AppRoutes';

// Contextos
import { AuthProvider } from './contexts/AuthContext';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul principal
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057', // Rosa/rojo para acentos
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5', // Gris claro para el fondo
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
}, esES); // Configuración local español

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza los estilos CSS */}
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
