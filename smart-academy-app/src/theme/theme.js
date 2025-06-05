import { createTheme } from '@mui/material/styles';

// Define tu paleta de colores personalizada
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Un azul estándar de Material Design
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e', // Un rosa/magenta
      light: '#ff79b0',
      dark: '#c51162',
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6f8', // Un gris claro para el fondo
      paper: '#ffffff',   // Blanco para superficies como cards
    },
    text: {
      primary: '#2c3e50', // Un gris oscuro para el texto principal
      secondary: '#7f8c8d', // Un gris más claro para texto secundario
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    // Puedes seguir definiendo otros estilos de tipografía (h4, h5, h6, body1, body2, etc.)
  },
  components: {
    // Aquí puedes añadir personalizaciones globales para componentes específicos de MUI
    // Por ejemplo:
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: 8,
    //       textTransform: 'none', // Para evitar que los botones estén en mayúsculas por defecto
    //     },
    //   },
    // },
    // MuiTextField: {
    //   defaultProps: {
    //     variant: 'outlined',
    //     margin: 'normal',
    //   }
    // }
  }
});

export default theme;
