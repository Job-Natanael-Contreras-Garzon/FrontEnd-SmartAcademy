```markdown
# Smart Academy API

**Versión:** 1.0.0  
**Descripción:** API para el sistema de gestión académica con predicción de rendimiento. Este README resume los endpoints y esquemas principales para facilitar la implementación de un frontend.

---

## Tabla de Contenidos

1. [Información General](#información-general)  
2. [Autenticación](#autenticación)  
3. [Usuarios](#usuarios)  
4. [Roles](#roles)  
5. [Grupos](#grupos)  
6. [Periodos Académicos](#periodos-académicos)  
7. [Materias](#materias)  
8. [Estudiantes](#estudiantes)  
9. [Profesores](#profesores)  
10. [Cursos](#cursos)  
11. [Calificaciones](#calificaciones)  
12. [Asistencias](#asistencias)  
13. [Tutores](#tutores)  
14. [Matrículas y Pagos](#matrículas-y-pagos)  
15. [Notificaciones](#notificaciones)  
16. [Dashboard](#dashboard)  
17. [Predicciones](#predicciones)  

---

## Información General

- **Base URL:** `https://<tu-dominio>/api/v1`  
- Todos los endpoints, a menos que se indique lo contrario, requieren un token JWT enviado en el encabezado:
```

Authorization: Bearer \<access\_token>

````
- Formato de datos: JSON (tanto en request bodies como en responses).

---

## Autenticación

### 1. Login
- **Endpoint:** `POST /auth/login`
- **Descripción:** Obtener token de acceso.
- **Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
````

* **Response (200):**

  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
    "token_type": "bearer",
    "user_id": 1,
    "email": "usuario@ejemplo.com",
    "full_name": "Nombre Completo",
    "role": "ADMINISTRATOR",
    "is_superuser": true
  }
  ```

### 2. Register Admin

* **Endpoint:** `POST /auth/register-admin`
* **Descripción:** Registrar un nuevo administrador (solo superusuarios).
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body:**

  ```json
  {
    "email": "admin@ejemplo.com",
    "password": "nuevaContraseña",
    "full_name": "Nombre Admin",
    "phone": "123456789",
    "direction": "Dirección opcional",
    "birth_date": "1990-01-01",
    "gender": "OTHER"
  }
  ```
* **Response (201):**
  Devuelve datos básicos del nuevo usuario en un objeto `UserResponse`.

### 3. Get Current User

* **Endpoint:** `GET /auth/me`
* **Descripción:** Obtener información del usuario autenticado.
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Response (200):**
  Objeto `UserResponse` con la información del perfil.

### 4. Change Password

* **Endpoint:** `POST /auth/change-password`
* **Descripción:** Cambiar contraseña del usuario actual.
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body:**

  ```json
  {
    "current_password": "contraseñaActual",
    "new_password": "nuevaContraseña"
  }
  ```
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Usuarios

> **Nota:** Todos los endpoints de usuario requieren rol de administrador.

### 1. Crear Usuario

* **Endpoint:** `POST /users/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`UserCreate`):**

  ```json
  {
    "email": "usuario@ejemplo.com",
    "full_name": "Nombre Completo",
    "password": "contraseña",
    "phone": "123456789",           // opcional
    "direction": "Dirección",      // opcional
    "birth_date": "2000-01-01",     // opcional
    "gender": "OTHER",              // opcional: FEMALE | MALE | OTHER
    "role": "STUDENT",              // opcional: STUDENT | TEACHER | PARENT | ADMINISTRATOR
    "is_superuser": false           // opcional
  }
  ```
* **Response (201):**
  `UserResponse` con la información creada.

### 2. Listar Usuarios

* **Endpoint:** `GET /users/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
* **Response (200):**
  Array de objetos `UserResponse`.

### 3. Obtener Usuario por ID

* **Endpoint:** `GET /users/{user_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `user_id` (integer)
* **Response (200):**
  `UserResponse` con datos del usuario.

### 4. Actualizar Usuario

* **Endpoint:** `PUT /users/{user_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `user_id` (integer)
* **Request Body (`UserUpdate`):**
  Campos opcionales:

  ```json
  {
    "email": "nuevo@ejemplo.com",
    "full_name": "Nombre Nuevo",
    "phone": "987654321",
    "direction": "Nueva Dirección",
    "birth_date": "1995-05-05",
    "gender": "FEMALE",
    "photo": "URL_o_base64",       // opcional
    "is_active": true,
    "is_superuser": false,
    "role": "TEACHER"
  }
  ```
* **Response (200):**
  `UserResponse` actualizado.

### 5. Eliminar Usuario

* **Endpoint:** `DELETE /users/{user_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `user_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Roles

> **Nota:** Solo administradores pueden crear, actualizar o eliminar roles.

### 1. Listar Roles

* **Endpoint:** `GET /roles/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Response (200):**
  Array de objetos `RoleResponse`:

  ```json
  [
    { "id": 1, "name": "ADMINISTRATOR", "description": "...", "permissions": { ... } },
    { "id": 2, "name": "TEACHER", "description": "...", "permissions": { ... } },
    ...
  ]
  ```

### 2. Crear Rol

* **Endpoint:** `POST /roles/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`RoleCreate`):**

  ```json
  {
    "name": "NEW_ROLE",
    "description": "Descripción opcional",
    "permissions": { /* objeto JSON de permisos */ }
  }
  ```
* **Response (201):**
  `RoleResponse` con el rol creado.

### 3. Obtener Rol por ID

* **Endpoint:** `GET /roles/{role_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `role_id` (integer)
* **Response (200):**
  `RoleResponse`.

### 4. Actualizar Rol

* **Endpoint:** `PUT /roles/{role_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `role_id` (integer)
* **Request Body (`RoleUpdate`):**

  ```json
  {
    "name": "ACTUALIZADO",
    "description": "Nueva descripción",
    "permissions": { /* JSON actualizado */ }
  }
  ```
* **Response (200):**
  `RoleResponse` actualizado.

### 5. Eliminar Rol

* **Endpoint:** `DELETE /roles/{role_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `role_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

### 6. Asignar Rol a Usuario

* **Endpoint:** `POST /roles/assign/{user_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `user_id` (integer)
* **Request Body (`Body_assign_role_to_user_api_v1_roles_assign__user_id__post`):**

  ```json
  { "role_id": 3 }
  ```
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

### 7. Obtener Rol de un Usuario

* **Endpoint:** `GET /roles/user/{user_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `user_id` (integer)
* **Response (200):**
  `RoleResponse` con el rol asignado al usuario.

---

## Grupos

> **Nota:** Solo administradores pueden crear, actualizar o eliminar grupos.

### 1. Crear Grupo Académico

* **Endpoint:** `POST /groups/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`GroupCreate`):**

  ```json
  {
    "grade": "3ro",            // enum: prekinder | kinder | 1ro | ... | 6to
    "level": "primaria",      // enum: inicial | primaria | secundaria
    "group_name": "Grupo A"
  }
  ```
* **Response (201):**
  `GroupResponse` con:

  ```json
  {
    "id": 5,
    "grade": "3ro",
    "level": "primaria",
    "group_name": "Grupo A"
  }
  ```

### 2. Listar Grupos

* **Endpoint:** `GET /groups/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
* **Response (200):**
  Array de `GroupResponse`.

### 3. Obtener Grupo por ID

* **Endpoint:** `GET /groups/{group_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `group_id` (integer)
* **Response (200):**
  `GroupResponse`.

### 4. Actualizar Grupo

* **Endpoint:** `PUT /groups/{group_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `group_id` (integer)
* **Request Body (`GroupUpdate`):**
  Campos opcionales: `grade`, `level`, `group_name`.

  ```json
  {
    "grade": "4to",
    "level": "primaria",
    "group_name": "Grupo B"
  }
  ```
* **Response (200):**
  `GroupResponse` actualizado.

### 5. Eliminar Grupo

* **Endpoint:** `DELETE /groups/{group_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `group_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Periodos Académicos

> **Nota:** Solo administradores pueden crear, actualizar o eliminar periodos.

### 1. Crear Periodo

* **Endpoint:** `POST /periods/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`PeriodCreate`):**

  ```json
  {
    "name": "2024-2025 Primer Semestre",
    "start_date": "2024-08-01",
    "end_date": "2024-12-20",
    "description": "Semestre de otoño",
    "is_active": true
  }
  ```
* **Response (201):**
  `PeriodResponse` con:

  ```json
  {
    "id": 2,
    "name": "2024-2025 Primer Semestre",
    "start_date": "2024-08-01",
    "end_date": "2024-12-20",
    "description": "Semestre de otoño",
    "is_active": true
  }
  ```

### 2. Listar Periodos

* **Endpoint:** `GET /periods/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
  * `is_active` (boolean | null) — filtrar solo activos/inactivos
* **Response (200):**
  Array de `PeriodResponse`.

### 3. Obtener Periodo Actual

* **Endpoint:** `GET /periods/current`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Response (200):**
  `PeriodResponse` del periodo con `is_active=true` o basado en fechas.

### 4. Obtener Periodo por ID

* **Endpoint:** `GET /periods/{period_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `period_id` (integer)
* **Response (200):**
  `PeriodResponse`.

### 5. Actualizar Periodo

* **Endpoint:** `PUT /periods/{period_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `period_id` (integer)
* **Request Body (`PeriodUpdate`):**
  Campos opcionales: `name`, `start_date`, `end_date`, `description`, `is_active`.

  ```json
  {
    "name": "2024-2025 Semestre Otoño",
    "is_active": false
  }
  ```
* **Response (200):**
  `PeriodResponse` actualizado.

### 6. Eliminar Periodo

* **Endpoint:** `DELETE /periods/{period_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `period_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Materias

> **Nota:** Solo administradores pueden crear, actualizar o eliminar materias.

### 1. Crear Materia / Asignatura

* **Endpoint:** `POST /subjects/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`SubjectCreate`):**

  ```json
  {
    "name": "Matemáticas I",
    "description": "Fundamentos de matemáticas"
  }
  ```
* **Response (201):**
  `SubjectResponse` con:

  ```json
  {
    "id": 4,
    "name": "Matemáticas I",
    "description": "Fundamentos de matemáticas"
  }
  ```

### 2. Listar Materias

* **Endpoint:** `GET /subjects/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
* **Response (200):**
  Array de `SubjectResponse`.

### 3. Obtener Materia por ID

* **Endpoint:** `GET /subjects/{subject_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `subject_id` (integer)
* **Response (200):**
  `SubjectResponse`.

### 4. Actualizar Materia

* **Endpoint:** `PUT /subjects/{subject_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `subject_id` (integer)
* **Request Body (`SubjectUpdate`):**

  ```json
  {
    "name": "Matemáticas Avanzadas",
    "description": "Aspectos avanzados de matemáticas"
  }
  ```
* **Response (200):**
  `SubjectResponse` actualizado.

### 5. Eliminar Materia

* **Endpoint:** `DELETE /subjects/{subject_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `subject_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Estudiantes

> **Nota:** Solo administradores pueden crear, actualizar o eliminar estudiantes.

### 1. Crear Estudiante

* **Endpoint:** `POST /students/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`StudentCreate`):**

  ```json
  {
    "user_id": 10,
    "group_id": 3,             // opcional
    "status": "active",        // enum: active | inactive | suspended | graduated (por defecto: active)
    "student_code": "STU2024" 
  }
  ```
* **Response (201):**
  `StudentResponse` con:

  ```json
  {
    "id": 7,
    "user_id": 10,
    "group_id": 3,
    "status": "active",
    "student_code": "STU2024"
  }
  ```

### 2. Listar Estudiantes

* **Endpoint:** `GET /students/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
  * `group_id` (integer | null) — filtrar por grupo
  * `status` (string | null) — filtrar por estado
* **Response (200):**
  Array de `StudentDetailResponse`:

  ```json
  [
    {
      "id": 7,
      "user_id": 10,
      "group_id": 3,
      "status": "active",
      "student_code": "STU2024",
      "full_name": "Nombre Estudiante",
      "email": "estudiante@ejemplo.com",
      "gender": "FEMALE",
      "phone": "...",
      "photo": "...",
      "grade": "3ro",
      "level": "primaria",
      "group_name": "Grupo A"
    },
    ...
  ]
  ```

### 3. Obtener Estudiante por ID

* **Endpoint:** `GET /students/{student_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `student_id` (integer)
* **Response (200):**
  `StudentDetailResponse` con información completa del estudiante.

### 4. Actualizar Estudiante

* **Endpoint:** `PUT /students/{student_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `student_id` (integer)
* **Request Body (`StudentUpdate`):**

  ```json
  {
    "group_id": 4,
    "status": "inactive",
    "student_code": "STU2024_01"
  }
  ```
* **Response (200):**
  `StudentResponse` actualizado.

### 5. Eliminar Estudiante

* **Endpoint:** `DELETE /students/{student_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `student_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Profesores

> **Nota:** Solo administradores pueden crear, actualizar o eliminar profesores.

### 1. Crear Profesor

* **Endpoint:** `POST /teachers/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`TeacherCreate`):**

  ```json
  {
    "user_id": 12,
    "specialization": "Matemáticas",   // opcional
    "status": "active",                // enum: active | inactive | on_leave (por defecto: active)
    "teacher_code": "TEA2024"
  }
  ```
* **Response (201):**
  `TeacherResponse` con:

  ```json
  {
    "id": 5,
    "user_id": 12,
    "specialization": "Matemáticas",
    "status": "active",
    "teacher_code": "TEA2024"
  }
  ```

### 2. Listar Profesores

* **Endpoint:** `GET /teachers/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
  * `status` (string | null) — filtrar por estado
* **Response (200):**
  Array de `TeacherDetailResponse`:

  ```json
  [
    {
      "id": 5,
      "user_id": 12,
      "specialization": "Matemáticas",
      "status": "active",
      "teacher_code": "TEA2024",
      "full_name": "Nombre Profesor",
      "email": "profesor@ejemplo.com",
      "gender": "MALE",
      "phone": "...",
      "photo": "..."
    },
    ...
  ]
  ```

### 3. Obtener Profesor por ID

* **Endpoint:** `GET /teachers/{teacher_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `teacher_id` (integer)
* **Response (200):**
  `TeacherDetailResponse` completo.

### 4. Actualizar Profesor

* **Endpoint:** `PUT /teachers/{teacher_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `teacher_id` (integer)
* **Request Body (`TeacherUpdate`):**

  ```json
  {
    "specialization": "Física",
    "status": "on_leave",
    "teacher_code": "TEA2024_02"
  }
  ```
* **Response (200):**
  `TeacherResponse` actualizado.

### 5. Eliminar Profesor

* **Endpoint:** `DELETE /teachers/{teacher_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `teacher_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Cursos

> **Nota:** Solo administradores pueden crear, actualizar o eliminar cursos.

### 1. Crear Curso

* **Endpoint:** `POST /courses/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`CourseCreate`):**

  ```json
  {
    "teacher_id": 5,
    "subject_id": 4,
    "group_id": 3,         // opcional
    "period_id": 2,        // opcional
    "description": "Matemáticas I - Grupo A"
  }
  ```
* **Response (201):**
  `CourseResponse` con:

  ```json
  {
    "id": 8,
    "teacher_id": 5,
    "subject_id": 4,
    "group_id": 3,
    "period_id": 2,
    "description": "Matemáticas I - Grupo A"
  }
  ```

### 2. Listar Cursos

* **Endpoint:** `GET /courses/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
  * `teacher_id` (integer | null) — filtrar por profesor
  * `subject_id` (integer | null) — filtrar por materia
  * `group_id` (integer | null) — filtrar por grupo
  * `period_id` (integer | null) — filtrar por periodo
* **Response (200):**
  Array de `CourseDetailResponse`:

  ```json
  [
    {
      "id": 8,
      "teacher_id": 5,
      "subject_id": 4,
      "group_id": 3,
      "period_id": 2,
      "description": "Matemáticas I - Grupo A",
      "teacher_name": "Nombre Profesor",
      "subject_name": "Matemáticas I",
      "group_name": "Grupo A",
      "grade": "3ro",
      "level": "primaria",
      "period_name": "2024-2025 Primer Semestre"
    },
    ...
  ]
  ```

### 3. Obtener Curso por ID

* **Endpoint:** `GET /courses/{course_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `course_id` (integer)
* **Response (200):**
  `CourseDetailResponse` completo.

### 4. Actualizar Curso

* **Endpoint:** `PUT /courses/{course_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `course_id` (integer)
* **Request Body (`CourseUpdate`):**

  ```json
  {
    "teacher_id": 6,
    "subject_id": 5,
    "group_id": 4,
    "period_id": 3,
    "description": "Física II - Grupo B"
  }
  ```
* **Response (200):**
  `CourseResponse` actualizado.

### 5. Eliminar Curso

* **Endpoint:** `DELETE /courses/{course_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `course_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Calificaciones

> **Nota:** Solo profesores pueden crear, actualizar o eliminar calificaciones.

### 1. Crear Calificación

* **Endpoint:** `POST /grades/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`GradeCreate`):**

  ```json
  {
    "student_id": 7,
    "course_id": 8,
    "period": "2024-1",           // cualquier string que represente el periodo
    "value": 85.5,
    "date_recorded": "2024-09-10" // opcional
  }
  ```
* **Response (201):**
  `GradeResponse` con:

  ```json
  {
    "id": 12,
    "student_id": 7,
    "course_id": 8,
    "period": "2024-1",
    "value": 85.5,
    "date_recorded": "2024-09-10"
  }
  ```

### 2. Listar Calificaciones

* **Endpoint:** `GET /grades/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
  * `student_id` (integer | null) — filtrar por estudiante
  * `course_id` (integer | null) — filtrar por curso
  * `period` (string | null) — filtrar por periodo
* **Response (200):**
  Array de `GradeDetailResponse`:

  ```json
  [
    {
      "id": 12,
      "student_id": 7,
      "course_id": 8,
      "period": "2024-1",
      "value": 85.5,
      "date_recorded": "2024-09-10",
      "student_name": "Nombre Estudiante",
      "student_code": "STU2024",
      "subject_name": "Matemáticas I",
      "teacher_name": "Nombre Profesor",
      "group_name": "Grupo A"
    },
    ...
  ]
  ```

### 3. Obtener Calificación por ID

* **Endpoint:** `GET /grades/{grade_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `grade_id` (integer)
* **Response (200):**
  `GradeDetailResponse` completo.

### 4. Actualizar Calificación

* **Endpoint:** `PUT /grades/{grade_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `grade_id` (integer)
* **Request Body (`GradeUpdate`):**

  ```json
  {
    "value": 90.0,
    "period": "2024-1",
    "date_recorded": "2024-09-15"
  }
  ```
* **Response (200):**
  `GradeResponse` actualizado.

### 5. Eliminar Calificación

* **Endpoint:** `DELETE /grades/{grade_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `grade_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Asistencias

> **Nota:** Solo profesores pueden crear, actualizar o eliminar registros de asistencia.

### 1. Crear Asistencia

* **Endpoint:** `POST /attendance/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`AttendanceCreate`):**

  ```json
  {
    "student_id": 7,
    "course_id": 8,
    "date": "2024-09-10",
    "status": "presente",     // enum: presente | ausente | tarde | justificado
    "notes": "Llegó a tiempo" // opcional
  }
  ```
* **Response (201):**
  `AttendanceResponse` con:

  ```json
  {
    "id": 20,
    "student_id": 7,
    "course_id": 8,
    "date": "2024-09-10",
    "status": "presente",
    "notes": "Llegó a tiempo"
  }
  ```

### 2. Listar Asistencias

* **Endpoint:** `GET /attendance/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
  * `student_id` (integer | null) — filtrar por estudiante
  * `course_id` (integer | null) — filtrar por curso
  * `date_from` (string YYYY-MM-DD | null)
  * `date_to` (string YYYY-MM-DD | null)
  * `status` (string | null) — filtrar por estado de asistencia
* **Response (200):**
  Array de `AttendanceDetailResponse`:

  ```json
  [
    {
      "id": 20,
      "student_id": 7,
      "course_id": 8,
      "date": "2024-09-10",
      "status": "presente",
      "notes": "Llegó a tiempo",
      "student_name": "Nombre Estudiante",
      "student_code": "STU2024",
      "subject_name": "Matemáticas I",
      "teacher_name": "Nombre Profesor",
      "group_name": "Grupo A"
    },
    ...
  ]
  ```

### 3. Obtener Asistencia por ID

* **Endpoint:** `GET /attendance/{attendance_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `attendance_id` (integer)
* **Response (200):**
  `AttendanceDetailResponse` completo.

### 4. Actualizar Asistencia

* **Endpoint:** `PUT /attendance/{attendance_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `attendance_id` (integer)
* **Request Body (`AttendanceUpdate`):**

  ```json
  {
    "status": "justificado", 
    "notes": "Certificado médico"
  }
  ```
* **Response (200):**
  `AttendanceResponse` actualizado.

### 5. Eliminar Asistencia

* **Endpoint:** `DELETE /attendance/{attendance_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `attendance_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

### 6. Estadísticas de Asistencia por Curso

* **Endpoint:** `GET /attendance/stats/course/{course_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `course_id` (integer)
* **Query Parameters (opcionales):**

  * `date_from` (string YYYY-MM-DD | null)
  * `date_to` (string YYYY-MM-DD | null)
* **Response (200):**
  `AttendanceStats`:

  ```json
  {
    "total_classes": 30,
    "present_count": 27,
    "absent_count": 2,
    "late_count": 1,
    "excused_count": 0,
    "attendance_rate": 0.90
  }
  ```

### 7. Estadísticas de Asistencia por Estudiante y Curso

* **Endpoint:**
  `GET /attendance/stats/student/{student_id}/course/{course_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Params:**

  * `student_id` (integer)
  * `course_id` (integer)
* **Query Parameters (opcionales):**

  * `date_from` (string YYYY-MM-DD | null)
  * `date_to` (string YYYY-MM-DD | null)
* **Response (200):**
  `AttendanceStats` para ese estudiante en el curso.

---

## Tutores

> **Nota:** Solo administradores pueden crear, actualizar o eliminar relaciones tutor-estudiante.

### 1. Asignar Tutor a Estudiante

* **Endpoint:** `POST /tutors/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`TutorStudentCreate`):**

  ```json
  {
    "student_id": 7,
    "user_id": 15,             // ID del tutor (user_id)
    "relationship": "parent",  // enum: tutor | parent | partner | other
    "notes": "Es el padre biológico" // opcional
  }
  ```
* **Response (201):**
  `TutorStudentResponse`:

  ```json
  {
    "id": 3,
    "student_id": 7,
    "user_id": 15,
    "relationship": "parent",
    "notes": "Es el padre biológico"
  }
  ```

### 2. Obtener Tutores de un Estudiante

* **Endpoint:** `GET /tutors/student/{student_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `student_id` (integer)
* **Response (200):**
  Array de `TutorStudentDetailResponse`:

  ```json
  [
    {
      "id": 3,
      "student_id": 7,
      "user_id": 15,
      "relationship": "parent",
      "notes": "Es el padre biológico",
      "student_name": "Nombre Estudiante",
      "tutor_name": "Nombre Tutor",
      "tutor_email": "tutor@ejemplo.com",
      "tutor_phone": "..."
    },
    ...
  ]
  ```

### 3. Obtener Estudiantes Asociados a un Tutor

* **Endpoint:** `GET /tutors/user/{user_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `user_id` (integer)
* **Response (200):**
  Array de `TutorStudentDetailResponse`.

### 4. Obtener Detalle de Relación Tutor-Estudiante

* **Endpoint:** `GET /tutors/{tutor_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `tutor_id` (integer)
* **Response (200):**
  `TutorStudentDetailResponse` para la relación específica.

### 5. Actualizar Relación Tutor-Estudiante

* **Endpoint:** `PUT /tutors/{tutor_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `tutor_id` (integer)
* **Request Body (`TutorStudentUpdate`):**

  ```json
  {
    "relationship": "other",
    "notes": "Cambio de relación"
  }
  ```
* **Response (200):**
  `TutorStudentResponse` actualizado.

### 6. Eliminar Relación Tutor-Estudiante

* **Endpoint:** `DELETE /tutors/{tutor_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `tutor_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Matrículas y Pagos (Tuitions)

> **Nota:** Solo administradores pueden crear, actualizar o eliminar registros de matrícula/pago.

### 1. Crear Matrícula/Pago

* **Endpoint:** `POST /tuitions/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`TuitionCreate`):**

  ```json
  {
    "student_id": 7,
    "amount": 150.00,
    "month": "september",    // enum: january | february | ... | december
    "year": 2024,
    "status": "pending",     // enum: paid | pending | overdue
    "description": "Pago mensual septiembre",
    "payment_date": null,    // opcional
    "due_date": "2024-09-15" // opcional
  }
  ```
* **Response (201):**
  `TuitionResponse` con:

  ```json
  {
    "id": 10,
    "student_id": 7,
    "amount": 150.00,
    "month": "september",
    "year": 2024,
    "status": "pending",
    "description": "Pago mensual septiembre",
    "payment_date": null,
    "due_date": "2024-09-15",
    "created_at": "2024-09-01"
  }
  ```

### 2. Listar Matrículas/Pagos

* **Endpoint:** `GET /tuitions/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `skip` (integer, default: 0)
  * `limit` (integer, default: 100)
  * `status` (string | null) — filtrar por estado
  * `month` (string | null) — filtrar por mes
  * `year` (integer | null) — filtrar por año
* **Response (200):**
  Array de `TuitionResponse`.

### 3. Obtener Matrículas/Pagos de un Estudiante

* **Endpoint:** `GET /tuitions/student/{student_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `student_id` (integer)
* **Query Parameters (opcionales):**

  * `status` (string | null)
  * `year` (integer | null)
* **Response (200):**
  Array de `TuitionDetailResponse`:

  ```json
  [
    {
      "id": 10,
      "student_id": 7,
      "amount": 150.00,
      "month": "september",
      "year": 2024,
      "status": "pending",
      "description": "Pago mensual septiembre",
      "payment_date": null,
      "due_date": "2024-09-15",
      "created_at": "2024-09-01",
      "student_name": "Nombre Estudiante",
      "student_code": "STU2024",
      "group_name": "Grupo A"
    },
    ...
  ]
  ```

### 4. Obtener Detalle de una Matrícula/Pago

* **Endpoint:** `GET /tuitions/{tuition_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `tuition_id` (integer)
* **Response (200):**
  `TuitionDetailResponse` completo.

### 5. Actualizar Matrícula/Pago

* **Endpoint:** `PUT /tuitions/{tuition_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `tuition_id` (integer)
* **Request Body (`TuitionUpdate`):**

  ```json
  {
    "amount": 155.00,
    "status": "paid",
    "description": "Pago mensual septiembre - ajustado",
    "payment_date": "2024-09-10",
    "due_date": "2024-09-15"
  }
  ```
* **Response (200):**
  `TuitionResponse` actualizado.

### 6. Eliminar Matrícula/Pago

* **Endpoint:** `DELETE /tuitions/{tuition_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `tuition_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

---

## Notificaciones

> **Nota:** Administradores pueden enviar notificaciones a cualquier usuario. Usuarios regulares solo pueden crear notificaciones para sí mismos.

### 1. Crear Notificación

* **Endpoint:** `POST /notifications/`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`NotificationCreate`):**

  ```json
  {
    "title": "Recordatorio de Pago",
    "content": "Tu pago de septiembre está pendiente",
    "type": "payment",        // enum: system | academic | payment | attendance | grade | general
    "priority": "high",       // enum: low | medium | high | urgent
    "recipient_id": 7,        // ID del usuario destinatario
    "sender_id": null         // opcional: si es null, se asume sistema
  }
  ```
* **Response (201):**
  `NotificationResponse` con:

  ```json
  {
    "id": 15,
    "title": "Recordatorio de Pago",
    "content": "Tu pago de septiembre está pendiente",
    "type": "payment",
    "priority": "high",
    "recipient_id": 7,
    "sender_id": null,
    "is_read": false,
    "created_at": "2024-09-01T10:00:00",
    "read_at": null
  }
  ```

### 2. Crear Notificaciones Masivas (Bulk)

* **Endpoint:** `POST /notifications/bulk`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Request Body (`Body_create_bulk_notifications_api_v1_notifications_bulk_post`):**

  ```json
  {
    "recipient_ids": [7, 8, 9],
    "title": "Reunión General",
    "content": "La reunión se llevará a cabo el lunes a las 10:00 AM",
    "type": "system",
    "priority": "medium"
  }
  ```
* **Response (201):**
  Vacío (código HTTP 201 si fue exitoso).

### 3. Obtener Notificaciones de un Usuario

* **Endpoint:** `GET /notifications/user/{user_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `user_id` (integer)
* **Query Parameters (opcionales):**

  * `is_read` (boolean | null) — filtrar por leídas/no leídas
  * `type` (string | null) — filtrar por tipo
  * `priority` (string | null) — filtrar por prioridad
  * `skip` (integer, default: 0)
  * `limit` (integer, default: 50)
* **Response (200):**
  Array de `NotificationDetailResponse`:

  ```json
  [
    {
      "id": 15,
      "title": "Recordatorio de Pago",
      "content": "Tu pago de septiembre está pendiente",
      "type": "payment",
      "priority": "high",
      "recipient_id": 7,
      "sender_id": null,
      "is_read": false,
      "created_at": "2024-09-01T10:00:00",
      "read_at": null,
      "sender_name": null,
      "recipient_name": "Nombre Estudiante"
    },
    ...
  ]
  ```

### 4. Obtener Detalle de Notificación

* **Endpoint:** `GET /notifications/{notification_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `notification_id` (integer)
* **Response (200):**
  `NotificationDetailResponse` completo.

### 5. Eliminar Notificación

* **Endpoint:** `DELETE /notifications/{notification_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `notification_id` (integer)
* **Response (200):**
  Vacío (código HTTP 200 si fue exitoso).

### 6. Marcar Notificación como Leída

* **Endpoint:** `PUT /notifications/{notification_id}/read`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `notification_id` (integer)
* **Response (200):**
  `NotificationResponse` actualizado con `is_read: true` y `read_at`.

---

## Dashboard

> **Nota:** Los endpoints de dashboard devuelven estadísticas generales.

### 1. Estadísticas Generales (Dashboard)

* **Endpoint:** `GET /dashboard/stats`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Response (200):**
  Objeto con métricas agregadas para el dashboard (estructura a definir según implementación).

### 2. Estadísticas de un Estudiante

* **Endpoint:** `GET /dashboard/student/{student_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `student_id` (integer)
* **Response (200):**
  Objeto con métricas específicas del estudiante (estructura a definir).

---

## Predicciones

> **Nota:** Se utiliza para entrenar modelos ML y predecir rendimiento estudiantil.

### 1. Entrenar Modelo

* **Endpoint:** `POST /predictions/train`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `model_type` (string, default: `"random_forest"`) — opciones: `random_forest` | `linear_regression` | `gradient_boosting`
  * `advanced` (boolean, default: `false`) — si es `true`, usa método avanzado
* **Response (200):**
  Objeto con resultados del entrenamiento (métricas, tiempo, etc.).

### 2. Predecir Rendimiento de un Estudiante

* **Endpoint:** `GET /predictions/student/{student_id}`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Path Param:**

  * `student_id` (integer)
* **Query Parameters (opcionales):**

  * `course_id` (integer | null) — si se incluye, predice solo para ese curso
  * `advanced` (boolean, default: `true`)
* **Response (200):**
  Objeto con predicciones (e.g., probabilidad de aprobar, factores de riesgo).

### 3. Estadísticas de Predicción (Dashboard)

* **Endpoint:** `GET /predictions/dashboard/stats`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Response (200):**
  Objeto con métricas agregadas de predicciones (distribuciones, tendencias, factores de riesgo).

### 4. Obtener Estudiantes en Riesgo

* **Endpoint:** `GET /predictions/at-risk`
* **Headers:**
  `Authorization: Bearer <access_token>`
* **Query Parameters (opcionales):**

  * `risk_level` (string, default: `"Alto"`) — opciones: `Alto` | `Medio` | `Bajo`
  * `limit` (integer, default: 10)
* **Response (200):**
  Lista de estudiantes en riesgo según predicciones previas (estructura definida por implementación).

---

## Esquemas Principales (Resumen)

A continuación se muestran los esquemas principales usados en requests/responses:

* **LoginData**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

* **Token**

  ```json
  {
    "access_token": "string",
    "token_type": "bearer",
    "user_id": 1,
    "email": "string",
    "full_name": "string",
    "role": "string",
    "is_superuser": true
  }
  ```

* **UserCreate**

  ```json
  {
    "email": "string",
    "full_name": "string",
    "password": "string",
    "phone": "string | null",
    "direction": "string | null",
    "birth_date": "date | null",
    "gender": "FEMALE | MALE | OTHER | null",
    "role": "STUDENT | TEACHER | PARENT | ADMINISTRATOR | null",
    "is_superuser": "boolean | null"
  }
  ```

* **UserResponse**

  ```json
  {
    "id": 1,
    "email": "string",
    "full_name": "string",
    "phone": "string | null",
    "direction": "string | null",
    "birth_date": "date | null",
    "gender": "FEMALE | MALE | OTHER",
    "role": {
      "id": 2,
      "name": "string",
      "description": "string | null",
      "permissions": {}
    },
    "photo": "string | null",
    "is_active": true,
    "is_superuser": false
  }
  ```

* **RoleCreate / RoleUpdate**

  ```json
  {
    "name": "string",
    "description": "string | null",
    "permissions": { /* objeto JSON */ }
  }
  ```

* **RoleResponse**

  ```json
  {
    "id": 1,
    "name": "string",
    "description": "string | null",
    "permissions": {}
  }
  ```

* **GroupCreate / GroupUpdate**

  ```json
  {
    "grade": "prekinder | kinder | 1ro | ... | 6to",
    "level": "inicial | primaria | secundaria",
    "group_name": "string"
  }
  ```

* **GroupResponse**

  ```json
  {
    "id": 1,
    "grade": "1ro",
    "level": "primaria",
    "group_name": "string"
  }
  ```

* **PeriodCreate / PeriodUpdate**

  ```json
  {
    "name": "string",
    "start_date": "date | null",
    "end_date": "date | null",
    "description": "string | null",
    "is_active": true | null
  }
  ```

* **PeriodResponse**

  ```json
  {
    "id": 1,
    "name": "string",
    "start_date": "date | null",
    "end_date": "date | null",
    "description": "string | null",
    "is_active": true
  }
  ```

* **SubjectCreate / SubjectUpdate**

  ```json
  {
    "name": "string",
    "description": "string | null"
  }
  ```

* **SubjectResponse**

  ```json
  {
    "id": 1,
    "name": "string",
    "description": "string | null"
  }
  ```

* **StudentCreate / StudentUpdate**

  ```json
  {
    "user_id": 1,
    "group_id": 3 | null,
    "status": "active | inactive | suspended | graduated | null",
    "student_code": "string"
  }
  ```

* **StudentResponse / StudentDetailResponse**

  ```json
  {
    "id": 1,
    "user_id": 1,
    "group_id": 3 | null,
    "status": "active",
    "student_code": "string",
    "full_name": "string",
    "email": "string",
    "gender": "FEMALE | MALE | OTHER | null",
    "phone": "string | null",
    "photo": "string | null",
    "grade": "1ro | ... | 6to | null",
    "level": "inicial | primaria | secundaria | null",
    "group_name": "string | null"
  }
  ```

* **TeacherCreate / TeacherUpdate**

  ```json
  {
    "user_id": 1,
    "specialization": "string | null",
    "status": "active | inactive | on_leave | null",
    "teacher_code": "string"
  }
  ```

* **TeacherResponse / TeacherDetailResponse**

  ```json
  {
    "id": 1,
    "user_id": 1,
    "specialization": "string | null",
    "status": "active",
    "teacher_code": "string",
    "full_name": "string",
    "email": "string",
    "gender": "FEMALE | MALE | OTHER | null",
    "phone": "string | null",
    "photo": "string | null"
  }
  ```

* **CourseCreate / CourseUpdate**

  ```json
  {
    "teacher_id": 1,
    "subject_id": 2,
    "group_id": 3 | null,
    "period_id": 4 | null,
    "description": "string | null"
  }
  ```

* **CourseResponse / CourseDetailResponse**

  ```json
  {
    "id": 1,
    "teacher_id": 1,
    "subject_id": 2,
    "group_id": 3 | null,
    "period_id": 4 | null,
    "description": "string | null",
    "teacher_name": "string",
    "subject_name": "string",
    "group_name": "string | null",
    "grade": "string | null",
    "level": "string | null",
    "period_name": "string | null"
  }
  ```

* **GradeCreate / GradeUpdate**

  ```json
  {
    "student_id": 7,
    "course_id": 8,
    "period": "string",
    "value": 0.0–100.0,
    "date_recorded": "date | null"
  }
  ```

* **GradeResponse / GradeDetailResponse**

  ```json
  {
    "id": 1,
    "student_id": 7,
    "course_id": 8,
    "period": "string",
    "value": 0.0–100.0,
    "date_recorded": "date | null",
    "student_name": "string",
    "student_code": "string",
    "subject_name": "string",
    "teacher_name": "string",
    "group_name": "string | null"
  }
  ```

* **AttendanceCreate / AttendanceUpdate**

  ```json
  {
    "student_id": 7,
    "course_id": 8,
    "date": "date",
    "status": "presente | ausente | tarde | justificado",
    "notes": "string | null"
  }
  ```

* **AttendanceResponse / AttendanceDetailResponse**

  ```json
  {
    "id": 1,
    "student_id": 7,
    "course_id": 8,
    "date": "date",
    "status": "presente",
    "notes": "string | null",
    "student_name": "string",
    "student_code": "string",
    "subject_name": "string",
    "teacher_name": "string",
    "group_name": "string | null"
  }
  ```

* **AttendanceStats**

  ```json
  {
    "total_classes": 0,
    "present_count": 0,
    "absent_count": 0,
    "late_count": 0,
    "excused_count": 0,
    "attendance_rate": 0.0
  }
  ```

* **TutorStudentCreate / TutorStudentUpdate**

  ```json
  {
    "student_id": 7,
    "user_id": 15,
    "relationship": "tutor | parent | partner | other",
    "notes": "string | null"
  }
  ```

* **TutorStudentResponse / TutorStudentDetailResponse**

  ```json
  {
    "id": 1,
    "student_id": 7,
    "user_id": 15,
    "relationship": "parent",
    "notes": "string | null",
    "student_name": "string",
    "tutor_name": "string",
    "tutor_email": "string",
    "tutor_phone": "string | null"
  }
  ```

* **TuitionCreate / TuitionUpdate**

  ```json
  {
    "student_id": 7,
    "amount": 0.0,
    "month": "january | february | ... | december",
    "year": 2000–2100,
    "status": "paid | pending | overdue",
    "description": "string | null",
    "payment_date": "date | null",
    "due_date": "date | null"
  }
  ```

* **TuitionResponse / TuitionDetailResponse**

  ```json
  {
    "id": 1,
    "student_id": 7,
    "amount": 0.0,
    "month": "string",
    "year": 2024,
    "status": "pending",
    "description": "string | null",
    "payment_date": "date | null",
    "due_date": "date | null",
    "created_at": "date",
    "student_name": "string",
    "student_code": "string | null",
    "group_name": "string | null"
  }
  ```

* **NotificationCreate**

  ```json
  {
    "title": "string",
    "content": "string",
    "type": "system | academic | payment | attendance | grade | general",
    "priority": "low | medium | high | urgent",
    "recipient_id": 7,
    "sender_id": 15 | null
  }
  ```

* **NotificationResponse / NotificationDetailResponse**

  ```json
  {
    "id": 1,
    "title": "string",
    "content": "string",
    "type": "string",
    "priority": "string",
    "recipient_id": 7,
    "sender_id": 15 | null,
    "is_read": false,
    "created_at": "datetime",
    "read_at": "datetime | null",
    "sender_name": "string | null",
    "recipient_name": "string"
  }
  ```

---

## Ejemplo de Flujo de Uso en Frontend

1. **Login**

   * Usuario ingresa email/contraseña.
   * POST `/auth/login` → recibe `access_token`.
   * Guardar token en almacenamiento (localStorage, Redux, etc.).

2. **Obtener Perfil**

   * GET `/auth/me` con header `Authorization`.
   * Mostrar nombre, rol e información básica en el navbar.

3. **Listar y Administrar Entidades**

   * **Usuarios:** GET/POST/PUT/DELETE sobre `/users`.
   * **Roles:** GET/POST/PUT/DELETE sobre `/roles`.
   * **Grupos, Periodos, Materias, Estudiantes, Profesores, Cursos, Calificaciones, Asistencias:** similares.
   * Construir tablas, formularios y validaciones de campos de acuerdo a los esquemas mostrados.

4. **Tareas Específicas**

   * **Asignar Rol:** POST `/roles/assign/{user_id}`.
   * **Asignar Tutor:** POST `/tutors/`.
   * **Crear Matrícula/Pago:** POST `/tuitions/`.
   * **Enviar Notificaciones:** POST `/notifications/` o `/notifications/bulk`.

5. **Dashboards y Predicciones**

   * GET `/dashboard/stats` → mostrar métricas generales.
   * GET `/dashboard/student/{student_id}` → dashboard personalizado por estudiante.
   * GET `/predictions/dashboard/stats` → métricas de predicción.
   * GET `/predictions/at-risk?risk_level=Alto&limit=10` → lista de estudiantes en riesgo.
   * GET `/predictions/student/{student_id}` → mostrar probabilidad de éxito / riesgo por curso.

---

## Buenas Prácticas

* **Manejo de Errores:** Todos los endpoints pueden retornar código 422 con un objeto `HTTPValidationError` si la validación falla. Formato:

  ```json
  {
    "detail": [
      {
        "loc": ["body", "campo_x"],
        "msg": "Mensaje de error",
        "type": "tipo_de_error"
      },
      ...
    ]
  }
  ```
* **Paginación:** Para listados extensos, usar `skip` y `limit` para optimizar consultas y mostrar resultados por páginas.
* **Autorización:** Verificar el rol del usuario (por ejemplo, `role` o `is_superuser`) antes de habilitar botones de creación/edición/eliminación en el frontend.
* **Fechas:** En los formularios, usar pickers de fecha (YYYY-MM-DD) y validar formato antes de enviar.
* **Enumeraciones:**

  * `GenderEnum`: `FEMALE`, `MALE`, `OTHER`
  * `GradeEnum`: `prekinder`, `kinder`, `1ro`, `2do`, `3ro`, `4to`, `5to`, `6to`
  * `LevelEnum`: `inicial`, `primaria`, `secundaria`
  * `StudentStatusEnum`: `active`, `inactive`, `suspended`, `graduated`
  * `TeacherStatusEnum`: `active`, `inactive`, `on_leave`
  * `AttendanceStatus`: `presente`, `ausente`, `tarde`, `justificado`
  * `TuitionStatus`: `paid`, `pending`, `overdue`
  * `Month`: `january`, `february`, …, `december`
  * `RelationshipType`: `tutor`, `parent`, `partner`, `other`
  * `NotificationType`: `system`, `academic`, `payment`, `attendance`, `grade`, `general`
  * `NotificationPriority`: `low`, `medium`, `high`, `urgent`

---

### Ejemplo Rápido de Uso con cURL

```bash
# 1. Login
curl -X POST "https://<tu-dominio>/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
        "email": "admin@ejemplo.com",
        "password": "MiContraseña123"
      }'

# 2. Listar Estudiantes (página 1)
curl -X GET "https://<tu-dominio>/api/v1/students/?skip=0&limit=20" \
  -H "Authorization: Bearer <access_token>"

# 3. Crear Estudiante
curl -X POST "https://<tu-dominio>/api/v1/students/" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
        "user_id": 25,
        "group_id": 3,
        "student_code": "STU2024_NEW"
      }'

# 4. Obtener Estadísticas de Asistencia de un Curso
curl -X GET "https://<tu-dominio>/api/v1/attendance/stats/course/8?date_from=2024-09-01&date_to=2024-09-30" \
  -H "Authorization: Bearer <access_token>"

# 5. Obtener Estudiantes en Riesgo (predicción)
curl -X GET "https://<tu-dominio>/api/v1/predictions/at-risk?risk_level=Alto&limit=5" \
  -H "Authorization: Bearer <access_token>"
```


