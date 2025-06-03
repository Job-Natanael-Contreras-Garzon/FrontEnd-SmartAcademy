import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { Grade } from '../../types/academic';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AcademicPerformanceChartProps {
  grades: Grade[];
  isLoading?: boolean;
  type?: 'line' | 'bar';
  title?: string;
}

const AcademicPerformanceChart: React.FC<AcademicPerformanceChartProps> = ({ 
  grades, 
  isLoading = false,
  type = 'line',
  title = 'Rendimiento Académico'
}) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Skeleton variant="rectangular" height={300} width="100%" />
      </Paper>
    );
  }

  if (!grades || grades.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">
            No hay datos de calificaciones disponibles.
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Organizar los datos por curso y fecha
  const courseGrades = grades.reduce((acc, grade) => {
    const courseName = grade.course_name || `Curso ${grade.course_id}`;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(grade);
    return acc;
  }, {} as { [key: string]: Grade[] });

  // Obtener lista de cursos y colores
  const courses = Object.keys(courseGrades);
  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
  ];

  // Obtener todas las fechas de evaluación (sin duplicados)
  let allDates = new Set<string>();
  grades.forEach(grade => {
    // Usar date_recorded si date no está disponible
    const dateValue = grade.date || grade.date_recorded;
    if (dateValue) {
      allDates.add(new Date(dateValue).toLocaleDateString());
    }
  });
  const dateLabels = Array.from(allDates).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Generar datasets para el gráfico
  const datasets = courses.map((course, index) => {
    const courseData = courseGrades[course];
    
    // Para cada fecha, encontrar la calificación o usar null
    const dataPoints = dateLabels.map(date => {
      const gradeForDate = courseData.find(g => {
        const dateValue = g.date || g.date_recorded;
        return dateValue ? new Date(dateValue).toLocaleDateString() === date : false;
      });
      return gradeForDate ? gradeForDate.value : null;
    });

    return {
      label: course,
      data: dataPoints,
      borderColor: colorPalette[index % colorPalette.length],
      backgroundColor: type === 'line' 
        ? `${colorPalette[index % colorPalette.length]}33` // Añadir transparencia
        : colorPalette[index % colorPalette.length],
      fill: type === 'line',
      tension: 0.4,
    };
  });

  const data = {
    labels: dateLabels,
    datasets
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Calificación'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box sx={{ height: 300, position: 'relative' }}>
        {type === 'line' ? (
          <Line data={data} options={options} />
        ) : (
          <Bar data={data} options={options} />
        )}
      </Box>
    </Paper>
  );
};

export default AcademicPerformanceChart;
