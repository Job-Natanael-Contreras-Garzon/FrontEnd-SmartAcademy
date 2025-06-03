export interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  teacher_id: number;
  teacher_name?: string; // Nombre del profesor para mostrar en UI
  schedule?: string;
  start_date?: string;
  end_date?: string;
  credits?: number;
  max_students?: number;
  enrolled_students?: number;
  students_count?: number; // Para mostrar cuántos estudiantes hay en una clase
  is_active: boolean;
  next_class?: string; // Fecha de la próxima clase
  students?: { id: number; name: string; photo?: string }[]; // Lista simplificada de estudiantes para UI
}

export interface Grade {
  id: number;
  student_id: number;
  course_id: number;
  course_name?: string; // Nombre del curso para mostrar en UI
  period: string;
  value: number;
  date_recorded: string;
  date?: string; // Fecha en formato legible para UI
}

export interface Attendance {
  id: number;
  student_id: number;
  course_id: number;
  date: string;
  status: 'presente' | 'ausente' | 'tarde' | 'justificado';
  notes?: string;
}

export interface Assignment {
  id: number;
  course_id: number;
  course_name?: string; // Nombre del curso para mostrar en UI
  title: string;
  description: string;
  due_date: string;
  max_grade: number;
  weight_percentage: number;
  submitted?: boolean; // Si la tarea ha sido entregada
  submissions_count?: number; // Para profesores: cuántas entregas hay
  pending_count?: number; // Para profesores: cuántas entregas quedan por calificar
}

export interface StudentAssignment {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_date?: string;
  grade?: number;
  feedback?: string;
  status: 'pendiente' | 'entregado' | 'calificado' | 'atrasado';
}

export interface StudentCourse {
  student_id: number;
  course_id: number;
  enrollment_date: string;
  status: 'activo' | 'completado' | 'retirado';
  final_grade?: number;
}

export interface AttendanceSummary {
  total_classes: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  attendance_rate: number;
  attendance_percentage: number; // Porcentaje de asistencia para mostrar en UI
}

export interface Student {
  id: number;
  full_name: string;
  grade: string;
  section: string;
  photo?: string;
  grades?: Grade[];
  attendance_summary?: AttendanceSummary;
  assignments?: Assignment[];
}
