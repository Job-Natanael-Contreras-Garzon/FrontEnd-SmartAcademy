# FrontEnd-SmartAcademy

# Arquitectura Frontend Smart Academy

Este documento define la arquitectura, estructura de navegación y especificaciones para el desarrollo del frontend de Smart Academy, basado en los endpoints y modelos disponibles en el backend.

## Índice

1. [Arquitectura General](#1-arquitectura-general)
2. [Flujo de Desarrollo](#2-flujo-de-desarrollo)
3. [Componentes Base](#3-componentes-base)
4. [Módulos y Vistas](#4-módulos-y-vistas)
   - [Autenticación](#41-autenticación)
   - [Dashboard](#42-dashboard)
   - [Gestión Académica](#43-gestión-académica)
   - [Comunidad Educativa](#44-comunidad-educativa)
   - [Administración](#45-administración)
   - [Sistema de Notificaciones](#46-sistema-de-notificaciones)
   - [Configuración](#47-configuración)
5. [Consideraciones Técnicas](#5-consideraciones-técnicas)

## 1. Arquitectura General

### Tecnologías Recomendadas
- **Framework UI**: React.js o Vue.js
- **Gestión de Estado**: Redux/Vuex o Context API
- **Enrutamiento**: React Router/Vue Router
- **Componentes UI**: Material-UI, Ant Design o Tailwind CSS
- **Peticiones HTTP**: Axios
- **Notificaciones en tiempo real**: WebSockets (Socket.io)

### Estructura de Carpetas
```
src/
├── assets/            # Imágenes, fuentes, etc.
├── components/        # Componentes reutilizables
├── contexts/          # Contextos de React (si se usa)
├── hooks/             # Custom hooks
├── layouts/           # Layouts de la aplicación
├── modules/           # Módulos principales (vistas+lógica)
├── services/          # Servicios API y utilidades
├── store/             # Estado global (Redux/Vuex)
├── utils/             # Utilidades y helpers
└── App.js             # Componente principal
```

## 2. Flujo de Desarrollo

### Fase 1: Configuración y Autenticación
1. Configuración del proyecto y dependencias
2. Implementación del sistema de autenticación
3. Configuración de rutas protegidas
4. Creación de layouts base según roles

### Fase 2: Dashboards y Navegación
1. Implementación de la navegación principal
2. Desarrollo de dashboards específicos por rol
3. Implementación del sistema de notificaciones básico

### Fase 3: Módulos Principales
1. Desarrollo del módulo de Gestión Académica
2. Desarrollo del módulo de Comunidad Educativa
3. Desarrollo del módulo de Administración

### Fase 4: Funcionalidades Avanzadas
1. Sistema de notificaciones en tiempo real
2. Visualizaciones y gráficos de datos
3. Optimizaciones para dispositivos móviles

### Fase 5: Pruebas y Refinamiento
1. Pruebas de integración con el backend
2. Optimización de rendimiento
3. Pulido de la experiencia de usuario

## 3. Componentes Base

### Componentes de UI
- **AppLayout**: Layout principal con navegación y contenido
- **Sidebar**: Navegación lateral adaptativa
- **Header**: Barra superior con perfil y notificaciones
- **NotificationCenter**: Centro de notificaciones desplegable
- **DataTable**: Tabla de datos con paginación, filtros y ordenamiento
- **FormBuilder**: Constructor de formularios dinámicos
- **Card**: Contenedor de información estilizado
- **Modal**: Ventanas modales para acciones específicas
- **Loader**: Indicadores de carga

### Servicios
- **ApiService**: Cliente HTTP centralizado
- **AuthService**: Gestión de autenticación y tokens
- **NotificationService**: Gestión de notificaciones
- **StorageService**: Manejo del almacenamiento local
- **WebSocketService**: Comunicación en tiempo real

## 4. Módulos y Vistas

### 4.1 Autenticación

#### Login
- **Ruta**: `/login`
- **Endpoints**:
  - `POST /api/v1/auth/login` - Autenticación de usuario

#### Registro
- **Ruta**: `/register`
- **Endpoints**:
  - `POST /api/v1/auth/register` - Registro de nuevo usuario

#### Recuperación de Contraseña
- **Ruta**: `/forgot-password`
- **Endpoints**:
  - `POST /api/v1/auth/password-recovery` - Solicitar recuperación
  - `POST /api/v1/auth/reset-password` - Restablecer contraseña

### 4.2 Dashboard

#### Dashboard Estudiante
- **Ruta**: `/dashboard/student`
- **Endpoints**:
  - `GET /api/v1/dashboard/student/{student_id}` - Datos del dashboard
  - `GET /api/v1/grades/student/{student_id}` - Calificaciones recientes
  - `GET /api/v1/attendance/student/{student_id}` - Asistencias recientes
  - `GET /api/v1/notifications?limit=5` - Últimas notificaciones

#### Dashboard Profesor
- **Ruta**: `/dashboard/teacher`
- **Endpoints**:
  - `GET /api/v1/dashboard/teacher/{teacher_id}` - Datos del dashboard
  - `GET /api/v1/courses/teacher/{teacher_id}` - Cursos asignados
  - `GET /api/v1/notifications?limit=5` - Últimas notificaciones

#### Dashboard Administrador
- **Ruta**: `/dashboard/admin`
- **Endpoints**:
  - `GET /api/v1/dashboard/admin` - Métricas generales
  - `GET /api/v1/dashboard/stats` - Estadísticas del sistema
  - `GET /api/v1/notifications?limit=5` - Últimas notificaciones

#### Dashboard Padre/Tutor
- **Ruta**: `/dashboard/parent`
- **Endpoints**:
  - `GET /api/v1/dashboard/parent/{parent_id}` - Datos del dashboard
  - `GET /api/v1/tutors/{parent_id}/students` - Estudiantes asociados
  - `GET /api/v1/notifications?limit=5` - Últimas notificaciones

### 4.3 Gestión Académica

#### Listado de Cursos
- **Ruta**: `/courses`
- **Endpoints**:
  - `GET /api/v1/courses` - Lista de cursos con paginación
  - `GET /api/v1/periods` - Períodos académicos (para filtrado)

#### Detalle de Curso
- **Ruta**: `/courses/{course_id}`
- **Endpoints**:
  - `GET /api/v1/courses/{course_id}` - Detalles del curso
  - `GET /api/v1/subjects/{subject_id}` - Detalles de la materia
  - `GET /api/v1/courses/{course_id}/students` - Estudiantes del curso

#### Calificaciones por Curso
- **Ruta**: `/courses/{course_id}/grades`
- **Endpoints**:
  - `GET /api/v1/grades/course/{course_id}` - Calificaciones del curso
  - `GET /api/v1/subjects/{subject_id}/criteria` - Criterios de evaluación

#### Vista de Calificaciones (Estudiante)
- **Ruta**: `/grades`
- **Endpoints**:
  - `GET /api/v1/grades/student/{student_id}` - Calificaciones del estudiante
  - `GET /api/v1/grades/student/{student_id}/stats` - Estadísticas y promedios

#### Registro de Asistencias
- **Ruta**: `/attendance/record`
- **Endpoints**:
  - `GET /api/v1/courses/{course_id}/students` - Estudiantes para registro
  - `POST /api/v1/attendance/batch` - Registro masivo de asistencia

#### Reporte de Asistencias
- **Ruta**: `/attendance/report`
- **Endpoints**:
  - `GET /api/v1/attendance/course/{course_id}` - Asistencias por curso
  - `GET /api/v1/attendance/student/{student_id}` - Asistencias por estudiante

### 4.4 Comunidad Educativa

#### Directorio de Estudiantes
- **Ruta**: `/students`
- **Endpoints**:
  - `GET /api/v1/students` - Lista de estudiantes con paginación
  - `GET /api/v1/groups` - Grupos (para filtrado)

#### Perfil de Estudiante
- **Ruta**: `/students/{student_id}`
- **Endpoints**:
  - `GET /api/v1/students/{student_id}` - Datos del estudiante
  - `GET /api/v1/grades/student/{student_id}` - Calificaciones
  - `GET /api/v1/attendance/student/{student_id}` - Asistencias
  - `GET /api/v1/tutors/student/{student_id}` - Tutores asociados

#### Directorio de Profesores
- **Ruta**: `/teachers`
- **Endpoints**:
  - `GET /api/v1/teachers` - Lista de profesores
  - `GET /api/v1/subjects` - Materias (para filtrado)

#### Perfil de Profesor
- **Ruta**: `/teachers/{teacher_id}`
- **Endpoints**:
  - `GET /api/v1/teachers/{teacher_id}` - Datos del profesor
  - `GET /api/v1/courses/teacher/{teacher_id}` - Cursos asignados

#### Gestión de Tutores
- **Ruta**: `/tutors`
- **Endpoints**:
  - `GET /api/v1/tutors` - Lista de tutores
  - `GET /api/v1/tutors/{tutor_id}/students` - Estudiantes asociados
  - `POST /api/v1/tutors/associate` - Asociar tutor con estudiante

### 4.5 Administración

#### Gestión de Matrículas
- **Ruta**: `/tuitions`
- **Endpoints**:
  - `GET /api/v1/tuitions` - Lista de matrículas
  - `POST /api/v1/tuitions` - Crear matrícula
  - `GET /api/v1/students` - Estudiantes disponibles

#### Pagos y Facturación
- **Ruta**: `/tuitions/payments`
- **Endpoints**:
  - `GET /api/v1/tuitions/{tuition_id}/payments` - Pagos de matrícula
  - `POST /api/v1/tuitions/{tuition_id}/payments` - Registrar pago

#### Gestión de Grupos
- **Ruta**: `/groups`
- **Endpoints**:
  - `GET /api/v1/groups` - Lista de grupos
  - `POST /api/v1/groups` - Crear grupo
  - `PUT /api/v1/groups/{group_id}` - Actualizar grupo

#### Asignación de Estudiantes a Grupos
- **Ruta**: `/groups/{group_id}/students`
- **Endpoints**:
  - `GET /api/v1/groups/{group_id}/students` - Estudiantes del grupo
  - `POST /api/v1/groups/{group_id}/students` - Asignar estudiantes
  - `GET /api/v1/students?not_in_group={group_id}` - Estudiantes disponibles

#### Gestión de Usuarios
- **Ruta**: `/users`
- **Endpoints**:
  - `GET /api/v1/users` - Lista de usuarios
  - `POST /api/v1/users` - Crear usuario
  - `PUT /api/v1/users/{user_id}` - Actualizar usuario
  - `GET /api/v1/roles` - Roles disponibles

### 4.6 Sistema de Notificaciones

#### Centro de Notificaciones
- **Ruta**: `/notifications`
- **Endpoints**:
  - `GET /api/v1/notifications` - Lista de notificaciones
  - `PUT /api/v1/notifications/{notification_id}/read` - Marcar como leída
  - `DELETE /api/v1/notifications/{notification_id}` - Eliminar notificación

#### Creación de Notificaciones
- **Ruta**: `/notifications/create`
- **Endpoints**:
  - `POST /api/v1/notifications` - Crear notificación individual
  - `POST /api/v1/notifications/bulk` - Crear notificaciones masivas
  - `GET /api/v1/users` - Usuarios disponibles (para destinatarios)

#### Preferencias de Notificaciones
- **Ruta**: `/notifications/preferences`
- **Endpoints**:
  - `GET /api/v1/devices` - Dispositivos registrados
  - `GET /api/v1/devices/preferences` - Preferencias actuales
  - `PUT /api/v1/devices/preferences` - Actualizar preferencias

### 4.7 Configuración

#### Perfil de Usuario
- **Ruta**: `/profile`
- **Endpoints**:
  - `GET /api/v1/users/me` - Datos del usuario actual
  - `PUT /api/v1/users/me` - Actualizar perfil
  - `PUT /api/v1/users/me/password` - Cambiar contraseña

#### Gestión de Dispositivos
- **Ruta**: `/devices`
- **Endpoints**:
  - `GET /api/v1/devices` - Dispositivos registrados
  - `POST /api/v1/devices` - Registrar nuevo dispositivo
  - `DELETE /api/v1/devices/{device_id}` - Eliminar dispositivo

## 5. Consideraciones Técnicas

### Autenticación y Seguridad
- Implementar JWT para la autenticación
- Almacenar tokens en localStorage/sessionStorage según las necesidades de seguridad
- Manejar la renovación automática de tokens
- Implementar protección de rutas basada en roles

### Gestión de Estado
- Utilizar un store centralizado para:
  - Estado de autenticación
  - Datos de usuario actual
  - Notificaciones
  - Datos compartidos entre componentes

### Optimización de Rendimiento
- Implementar carga perezosa (lazy loading) de módulos
- Utilizar memorización para componentes y consultas costosas
- Implementar paginación y carga infinita para listas grandes
- Optimizar imágenes y recursos estáticos

### Accesibilidad y Diseño Responsivo
- Seguir directrices WCAG 2.1 para accesibilidad
- Implementar diseño mobile-first
- Utilizar breakpoints estándar para diferentes dispositivos
- Probar en múltiples tamaños de pantalla y dispositivos

### Comunicación en Tiempo Real
- Implementar WebSockets para notificaciones en tiempo real
- Considerar la implementación de actualización en tiempo real para:
  - Notificaciones
  - Calificaciones recientes
  - Asistencia
  - Chat (si se implementa)

### Gestión de Errores
- Implementar un sistema centralizado de manejo de errores
- Mostrar mensajes de error amigables al usuario
- Registrar errores para análisis posterior
- Implementar reintentos automáticos para peticiones fallidas cuando sea apropiado

### Internacionalización
- Implementar soporte para múltiples idiomas
- Separar textos en archivos de traducción
- Considerar aspectos culturales en formatos de fecha y números
