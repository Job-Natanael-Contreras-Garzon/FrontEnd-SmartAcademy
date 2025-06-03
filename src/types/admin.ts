export interface AdminStats {
  total_students: number;
  total_teachers: number;
  total_parents: number;
  total_courses: number;
  active_courses: number;
  recent_activities: AdminActivity[];
  course_occupancy: CourseOccupancy[];
}

export interface AdminActivity {
  id: number;
  activity_type: 'user_creation' | 'course_creation' | 'enrollment' | 'grade_submission' | 'system_update';
  description: string;
  user_id: number;
  user_name: string;
  user_role: string;
  timestamp: string;
  entity_id?: number;
  entity_name?: string;
}

export interface CourseOccupancy {
  course_id: number;
  course_name: string;
  enrolled_students: number;
  max_students: number;
  occupation_percentage: number;
}
