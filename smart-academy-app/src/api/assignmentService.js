// Placeholder for assignmentService.js

// Simulating API calls, replace with actual fetch/axios calls to your backend

const mockAssignments = [
  {
    id: 1,
    title: 'Tarea de Matemáticas I',
    description: 'Resolver los ejercicios del capítulo 3.',
    course_id: 1, // Assuming a course with id 1 exists
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
    max_score: 100,
    instructions: 'Entregar en formato PDF.',
    type: 'HOMEWORK',
    submissions: [] // Placeholder for submissions
  },
  {
    id: 2,
    title: 'Ensayo de Literatura Comparada',
    description: 'Comparar dos obras literarias del siglo XIX.',
    course_id: 2, // Assuming a course with id 2 exists
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
    max_score: 100,
    instructions: 'Mínimo 5 páginas, citar fuentes.',
    type: 'ESSAY',
    submissions: []
  }
];

const mockStats = {
  total_assignments: mockAssignments.length,
  pending_assignments: mockAssignments.filter(a => new Date(a.due_date) > new Date()).length,
  overdue_assignments: 0,
  completed_assignments: 0, // Needs logic based on submissions
  average_score: null
};

export const getAssignments = async () => {
  console.log('API CALL (mock): getAssignments');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { items: mockAssignments }; // Or just mockAssignments depending on expected structure
};

export const createAssignment = async (assignmentData) => {
  console.log('API CALL (mock): createAssignment with data:', assignmentData);
  await new Promise(resolve => setTimeout(resolve, 500));
  const newAssignment = { ...assignmentData, id: Date.now(), submissions: [] };
  mockAssignments.push(newAssignment);
  return newAssignment;
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  console.log('API CALL (mock): updateAssignment for id:', assignmentId, 'with data:', assignmentData);
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockAssignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    mockAssignments[index] = { ...mockAssignments[index], ...assignmentData };
    return mockAssignments[index];
  }
  throw new Error('Assignment not found');
};

export const deleteAssignment = async (assignmentId) => {
  console.log('API CALL (mock): deleteAssignment for id:', assignmentId);
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockAssignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    mockAssignments.splice(index, 1);
    return { message: 'Assignment deleted successfully' };
  }
  throw new Error('Assignment not found');
};

export const getAssignmentStats = async () => {
  console.log('API CALL (mock): getAssignmentStats');
  await new Promise(resolve => setTimeout(resolve, 500));
  // Recalculate some stats for mock purposes
  mockStats.total_assignments = mockAssignments.length;
  mockStats.pending_assignments = mockAssignments.filter(a => new Date(a.due_date) > new Date() && (!a.submissions || a.submissions.length === 0)).length;
  // Add more sophisticated mock logic if needed
  return mockStats;
};
