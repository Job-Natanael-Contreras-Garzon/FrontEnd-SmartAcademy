import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext.jsx';
import RegisterAdminButton from '../../components/admin/RegisterAdminButton.jsx';
import {
  Alert, // Added Alert
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Snackbar,
  Switch,
  FormControlLabel
  } from '@mui/material';
import { getUsers, createUser, getRoles, updateUser, deleteUser } from '../../api/userService'; // Added updateUser, deleteUser
import { registerAdmin } from '../../api/authService.js'; // Added registerAdmin

const genderOptions = [
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'MALE', label: 'Masculino' },
  { value: 'OTHER', label: 'Otro' },
  { value: '', label: 'No Especificado' }, // Option for null/empty
];

const getSafeDetailMessage = (detail, defaultMessage) => {
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const firstError = detail[0];
    if (firstError && typeof firstError.msg === 'string') {
      return `${firstError.loc ? '[' + firstError.loc.join(', ') + ']: ' : ''}${firstError.msg}`;
    }
  }
  if (typeof detail === 'object' && detail !== null && typeof detail.msg === 'string') {
    return `${detail.loc ? '[' + detail.loc.join(', ') + ']: ' : ''}${detail.msg}`;
  }
  return defaultMessage;
};

const UserManagementPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error' | 'warning' | 'info'
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // To store user data for editing
  const [originalEditingUser, setOriginalEditingUser] = useState(null); // To compare for changes
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRegisterAdminDialog, setOpenRegisterAdminDialog] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ 
    email: '', 
    password: '', 
    full_name: '', 
    phone: '', 
    direction: '', 
    birth_date: '', 
    gender: '' 
  });
  const [deletingUserId, setDeletingUserId] = useState(null);

  // State for User Detail Dialog
  const [openUserDetailDialog, setOpenUserDetailDialog] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '', // For frontend validation only
    role: '', // Changed from role_id, will store role name as string
    phone: '',
    direction: '',
    birth_date: '',
    gender: '',
    is_superuser: false // Explicitly set for regular user creation
  });

  // Fetch Users
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Fetch Roles
  const { data: roles, isLoading: isLoadingRoles, error: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  // Mutation for creating user
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['users']);
      setSnackbarMessage('Usuario creado con éxito!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseCreateDialog();
    },
    onError: (error) => {
      const safeMessage = getSafeDetailMessage(error.response?.data?.detail, 'Error al crear el usuario.');
      setSnackbarMessage(safeMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error creating user:', error.response?.data || error.message);
    },
  });

  // Mutation for registering admin
  const registerAdminMutation = useMutation({
    mutationFn: registerAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']); // Or specific query if admins are handled differently
      setSnackbarMessage('Administrador registrado con éxito!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseRegisterAdminDialog();
    },
    onError: (error) => {
      const safeMessage = getSafeDetailMessage(error.response?.data?.detail, 'Error al registrar al administrador.');
      setSnackbarMessage(safeMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error registering admin:', error.response?.data || error.message);
    },
  });

  // Mutation for updating user
  const updateUserMutation = useMutation({
    mutationFn: (userData) => updateUser(userData.id, userData.data),
    onSuccess: (updatedUserDataFromServer, variables) => {
      console.log('Updated User Data From Server (onSuccess):', JSON.stringify(updatedUserDataFromServer, null, 2));
      queryClient.invalidateQueries(['users']);
      setSnackbarMessage('Usuario actualizado con éxito!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // If the detail dialog is open for the edited user, update its data
      if (openUserDetailDialog && selectedUserForDetail && selectedUserForDetail.id === updatedUserDataFromServer.id) {
        // Prepare data for the detail dialog
        const detailData = { ...updatedUserDataFromServer }; // Start with all data from server

        // Ensure 'role' object or 'role_id' is correctly set for UserDetailDialog's logic
        if (typeof updatedUserDataFromServer.role === 'string') {
          // If server returns role name as a string (e.g., "STUDENT")
          const roleNameFromServer = updatedUserDataFromServer.role;
          const foundRoleObject = roles?.find(r => r.name.toUpperCase() === roleNameFromServer.toUpperCase());
          if (foundRoleObject) {
            detailData.role = foundRoleObject; // Set the full role object
            detailData.role_id = foundRoleObject.id; // Ensure role_id is also present
          } else {
            detailData.role = { name: roleNameFromServer }; // Fallback if not found in local roles list
            delete detailData.role_id; // Or set to a sensible default if role_id is strictly needed
          }
        } else if (typeof updatedUserDataFromServer.role === 'object' && updatedUserDataFromServer.role !== null) {
          // If server returns a role object (e.g., {id: 1, name: "STUDENT"})
          detailData.role = updatedUserDataFromServer.role;
          detailData.role_id = updatedUserDataFromServer.role.id;
        } else {
          // Handle case where role might be null or undefined from server
          delete detailData.role; // Or set to a default object like { name: 'N/A' }
          delete detailData.role_id;
        }

        // Gender should be directly from updatedUserDataFromServer.gender (e.g., "MALE")
        // No specific transformation needed here if UserDetailDialog uses selectedUserForDetail.gender directly

        setSelectedUserForDetail(detailData);
      }

      handleCloseEditDialog();
    },
    onError: (error) => {
      const safeMessage = getSafeDetailMessage(error.response?.data?.detail, 'Error al actualizar el usuario.');
      setSnackbarMessage(safeMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error updating user:', error.response?.data || error.message);
    },
  });

  // Mutation for deleting user
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setSnackbarMessage('Usuario eliminado con éxito!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDeleteDialog();
    },
    onError: (error) => {
      const safeMessage = getSafeDetailMessage(error.response?.data?.detail, 'Error al eliminar el usuario.');
      setSnackbarMessage(safeMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error deleting user:', error.response?.data || error.message);
    },
  });

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewUser({
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: '', 
      phone: '', 
      direction: '', 
      birth_date: '', 
      gender: '', 
      is_superuser: false 
    }); // Reset form on close
  };

  const handleOpenEditDialog = (user) => {
    const userData = {
      id: user.id,
      full_name: user.full_name || '',
      email: user.email || '',
      role_id: user.role?.id || user.role_id || '',
      is_active: user.is_active === undefined ? true : user.is_active,
      is_superuser: user.is_superuser === undefined ? false : user.is_superuser,
      phone: user.phone || '',
      direction: user.direction || '',
      birth_date: user.birth_date || '',
      gender: user.gender || '',
      photo: user.photo || '',
    };
    setEditingUser(userData);
    setOriginalEditingUser(JSON.parse(JSON.stringify(userData))); // Deep copy
    setOpenEditDialog(true);
  };

  const handleOpenUserDetailDialog = (user) => {
    setSelectedUserForDetail(user);
    setOpenUserDetailDialog(true);
  };

  const handleCloseUserDetailDialog = () => {
    setOpenUserDetailDialog(false);
    setSelectedUserForDetail(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingUser(null);
    setOriginalEditingUser(null);
  };

  const handleOpenDeleteDialog = (userId) => {
    setDeletingUserId(userId);
    setOpenDeleteDialog(true);
  };


  const handleOpenRegisterAdminDialog = () => {
    setNewAdminData({ email: '', password: '', full_name: '', phone: '', direction: '', birth_date: '', gender: '' });
    setOpenRegisterAdminDialog(true);
  };

  const handleCloseRegisterAdminDialog = () => {
    setOpenRegisterAdminDialog(false);
  };

  const handleNewAdminDataChange = (event) => {
    const { name, value } = event.target;
    setNewAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterAdminSubmit = () => {
    // Basic validation (e.g., password confirmation if you add a confirm_password field)
    if (!newAdminData.email || !newAdminData.password || !newAdminData.full_name) {
      setSnackbarMessage('Por favor, completa los campos obligatorios: Nombre Completo, Correo Electrónico y Contraseña.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    // Add more validation as needed

    registerAdminMutation.mutate(newAdminData);
  };
  const handleCloseDeleteDialog = () => {
    setDeletingUserId(null);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    if (deletingUserId) {
      deleteUserMutation.mutate(deletingUserId);
    }
  };

  const handleEditingUserChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirm_password) {
      setSnackbarMessage('Las contraseñas no coinciden.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    // Exclude confirm_password before sending to API
    const { confirm_password, ...userData } = newUser;
    createUserMutation.mutate(userData);
  };

  const handleSaveChanges = () => {
    if (!editingUser) return;

    // Construct payload with all editable fields from editingUser.
    // The backend's UserUpdate schema will determine which fields it processes.
    const payload = {
      full_name: editingUser.full_name,
      email: editingUser.email,
      is_active: editingUser.is_active,
      is_superuser: editingUser.is_superuser,
      phone: editingUser.phone || null, // Send null if empty string for optional fields
      direction: editingUser.direction || null,
      birth_date: editingUser.birth_date ? editingUser.birth_date : null, // Ensure empty string becomes null
      gender: editingUser.gender ? editingUser.gender.toUpperCase() : null, // Convert to uppercase if not null/empty
      photo: editingUser.photo || null,
    };

    // Handle role transformation
    if (editingUser.role_id && roles) {
      const selectedRoleObject = roles.find(r => r.id === editingUser.role_id);
      payload.role = selectedRoleObject ? selectedRoleObject.name.toUpperCase() : null; // Convert role name to uppercase
    } else if (editingUser.role_id === '') { // Explicitly chosen "Sin Rol / No Cambiar" or empty
      payload.role = null; // Instruct backend to remove/set role to null
    }
    // If editingUser.role_id is undefined (e.g. not touched in form), 'role' field is not sent,
    // and backend should ideally not change the existing role.
    // However, to be explicit for PUT, if originalEditingUser.role_id was something and now editingUser.role_id is undefined (not ''),
    // it implies we might want to send the original role or handle it. 
    // For simplicity now, if role_id is not explicitly set (empty string or a value), we don't send 'role'.
    // This might need refinement based on desired PUT behavior (partial vs full update semantics for role).

    // Filter out null values from payload if backend prefers optional fields to be absent rather than null
    // For now, sending null for empty optional string fields as per UserUpdate schema likely expecting string | null
    const finalPayload = {};
    for (const key in payload) {
      if (payload[key] !== undefined) { // only include defined keys
        finalPayload[key] = payload[key];
      }
    }
    
    // console.log('Final payload for update:', finalPayload);
    updateUserMutation.mutate({ id: editingUser.id, data: finalPayload });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (authLoading || isLoadingUsers || isLoadingRoles) {
    return <CircularProgress />;
  }

  // Combine errors for display
  const apiError = usersError || rolesError;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar datos: {apiError.message}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleOpenCreateDialog} sx={{ mr: currentUser?.is_superuser ? 1 : 0 }}>
          Crear Usuario
        </Button>
        <RegisterAdminButton 
          onClick={handleOpenRegisterAdminDialog} 
          isSuperuser={currentUser?.is_superuser} 
        />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="center">¿Activo?</TableCell>
              <TableCell align="center">¿Superusuario?</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => {
                let roleName = 'N/A';
                if (user.role?.name) {
                  roleName = user.role.name;
                } else if (user.role_id && roles) { // Check if roles is loaded
                  const foundRole = roles.find(r => r.id === user.role_id);
                  if (foundRole) {
                    roleName = foundRole.name;
                  }
                }

                return (
                  <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.id}
                    </TableCell>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{roleName}</TableCell>
                    <TableCell align="center">{user.is_active ? 'Sí' : 'No'}</TableCell>
                    <TableCell align="center">{user.is_superuser ? 'Sí' : 'No'}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleOpenUserDetailDialog(user)} variant="outlined" size="small">Ver más</Button>
                      <Button onClick={() => handleOpenDeleteDialog(user.id)} variant="outlined" size="small" color="error" sx={{ ml: 1 }}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay usuarios para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb:2}}>
            Por favor, completa los siguientes campos para crear un nuevo usuario.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="full_name"
                label="Nombre Completo"
                type="text"
                fullWidth
                variant="outlined"
                value={newUser.full_name}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="email"
                label="Correo Electrónico"
                type="email"
                fullWidth
                variant="outlined"
                value={newUser.email}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="password"
                label="Contraseña"
                type="password"
                fullWidth
                variant="outlined"
                value={newUser.password}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="confirm_password"
                label="Confirmar Contraseña"
                type="password"
                fullWidth
                variant="outlined"
                value={newUser.confirm_password}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel id="role-select-label">Rol</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="role" // Changed from role_id
                  value={newUser.role} // Changed from newUser.role_id
                  label="Rol"
                  onChange={handleNewUserChange}
                >
                  {roles && roles.map((role) => (
                    <MenuItem key={role.id} value={role.name.toUpperCase()}> {/* Ensure value is uppercase */}
                      {role.name} ({role.description})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="phone"
                label="Teléfono (Opcional)"
                type="text"
                fullWidth
                variant="outlined"
                value={newUser.phone}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="direction"
                label="Dirección (Opcional)"
                type="text"
                fullWidth
                variant="outlined"
                value={newUser.direction}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="birth_date"
                label="Fecha de Nacimiento (Opcional)"
                type="date"
                fullWidth
                variant="outlined"
                value={newUser.birth_date}
                onChange={handleNewUserChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel id="gender-select-label">Género (Opcional)</InputLabel>
                <Select
                  labelId="gender-select-label"
                  name="gender"
                  value={newUser.gender}
                  label="Género (Opcional)"
                  onChange={handleNewUserChange}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancelar</Button>
          <Button onClick={handleCreateUser} variant="contained" disabled={createUserMutation.isLoading}>
            {createUserMutation.isLoading ? <CircularProgress size={24} /> : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Modifica los campos necesarios para actualizar el usuario.
          </DialogContentText>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', mt: 2 }}>
            <TextField label="ID" value={editingUser?.id || ''} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
            <TextField name="full_name" label="Nombre Completo" value={editingUser?.full_name || ''} onChange={handleEditingUserChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="email" label="Email" value={editingUser?.email || ''} onChange={handleEditingUserChange} variant="outlined" fullWidth margin="dense" type="email" />
            
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="edit-role-select-label">Rol</InputLabel>
              <Select
                labelId="edit-role-select-label"
                name="role_id"
                value={editingUser?.role_id || ''}
                label="Rol"
                onChange={handleEditingUserChange}
              >
                <MenuItem value=""><em>Sin Rol / No Cambiar</em></MenuItem>
                {roles?.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField name="phone" label="Teléfono" value={editingUser?.phone || ''} onChange={handleEditingUserChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="direction" label="Dirección" value={editingUser?.direction || ''} onChange={handleEditingUserChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="birth_date" label="Fecha de Nacimiento (YYYY-MM-DD)" value={editingUser?.birth_date || ''} onChange={handleEditingUserChange} variant="outlined" fullWidth margin="dense" helperText="Formato: YYYY-MM-DD" />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="edit-gender-select-label">Género</InputLabel>
              <Select
                labelId="edit-gender-select-label"
                name="gender"
                value={editingUser?.gender || ''}
                label="Género"
                onChange={handleEditingUserChange}
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField name="photo" label="Foto (URL)" value={editingUser?.photo || ''} onChange={handleEditingUserChange} variant="outlined" fullWidth margin="dense" />
            
            <FormControlLabel
              control={<Switch checked={editingUser?.is_active || false} onChange={handleEditingUserChange} name="is_active" />}
              label="¿Usuario Activo?"
              sx={{ gridColumn: 'span 1' }} 
            />
            <FormControlLabel
              control={<Switch checked={editingUser?.is_superuser || false} onChange={handleEditingUserChange} name="is_superuser" />}
              label="¿Superusuario?"
              sx={{ gridColumn: 'span 1' }} 
            />
          </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancelar</Button>
            <Button onClick={handleSaveChanges} variant="contained" disabled={updateUserMutation.isLoading}>
              {updateUserMutation.isLoading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Register Admin Dialog */}
      {openRegisterAdminDialog && (
        <Dialog open={openRegisterAdminDialog} onClose={handleCloseRegisterAdminDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Registrar Nuevo Administrador</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{mb:2}}>
              Por favor, completa los siguientes campos para registrar un nuevo administrador.
              Este usuario tendrá permisos de superusuario.
            </DialogContentText>
            <TextField name="full_name" label="Nombre Completo" value={newAdminData.full_name} onChange={handleNewAdminDataChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="email" label="Correo Electrónico" type="email" value={newAdminData.email} onChange={handleNewAdminDataChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="password" label="Contraseña" type="password" value={newAdminData.password} onChange={handleNewAdminDataChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="phone" label="Teléfono" value={newAdminData.phone} onChange={handleNewAdminDataChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="direction" label="Dirección" value={newAdminData.direction} onChange={handleNewAdminDataChange} variant="outlined" fullWidth margin="dense" />
            <TextField name="birth_date" label="Fecha de Nacimiento (YYYY-MM-DD)" value={newAdminData.birth_date} onChange={handleNewAdminDataChange} variant="outlined" fullWidth margin="dense" helperText="Formato: YYYY-MM-DD" />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="register-admin-gender-select-label">Género</InputLabel>
              <Select
                labelId="register-admin-gender-select-label"
                name="gender"
                value={newAdminData.gender}
                label="Género"
                onChange={handleNewAdminDataChange}
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRegisterAdminDialog}>Cancelar</Button>
            <Button onClick={handleRegisterAdminSubmit} variant="contained" disabled={registerAdminMutation.isLoading}>
                            {registerAdminMutation.isLoading ? <CircularProgress size={24} /> : 'Registrar Administrador'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* User Detail Dialog (Read-only initially) */}
      {selectedUserForDetail && (
        <Dialog open={openUserDetailDialog} onClose={handleCloseUserDetailDialog} fullWidth maxWidth="md">
          <DialogTitle>Detalles del Usuario</DialogTitle>
          <DialogContent>
            {/* User Photo Display */}
            {selectedUserForDetail.photo && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  component="img"
                  sx={{
                    height: 150,
                    width: 150,
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                  alt={`${selectedUserForDetail.full_name}'s photo`}
                  src={selectedUserForDetail.photo}
                />
              </Box>
            )}
            {!selectedUserForDetail.photo && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    height: 150,
                    width: 150,
                    border: '1px dashed #ddd',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#aaa',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  Sin foto
                </Box>
              </Box>
            )}
            {/* User Attributes Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', mt: 2 }}>
              <TextField label="ID" value={selectedUserForDetail.id || ''} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Nombre Completo" value={selectedUserForDetail.full_name || ''} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Email" value={selectedUserForDetail.email || ''} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Rol" value={selectedUserForDetail.role?.name || (roles?.find(r => r.id === selectedUserForDetail.role_id)?.name || 'N/A')} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Activo" value={selectedUserForDetail.is_active ? 'Sí' : 'No'} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Superusuario" value={selectedUserForDetail.is_superuser ? 'Sí' : 'No'} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              
              {/* Placeholder for other fields from UserResponse/UserUpdate schema */}
              <TextField label="Teléfono" value={selectedUserForDetail.phone || 'N/A'} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Dirección" value={selectedUserForDetail.direction || 'N/A'} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Fecha de Nacimiento" value={selectedUserForDetail.birth_date || 'N/A'} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
              <TextField label="Género" value={selectedUserForDetail.gender || 'N/A'} InputProps={{ readOnly: true }} variant="filled" fullWidth margin="dense" />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { 
              // This will eventually open the edit mode for these details
              // For now, it can re-use the existing edit dialog logic as a placeholder if desired
              // or we build a new edit mode within this dialog (Phase 2)
              handleCloseUserDetailDialog(); // Close this one
              handleOpenEditDialog(selectedUserForDetail); // Open old edit dialog for now
            }} variant="outlined">
              Editar
            </Button>
            <Button onClick={handleCloseUserDetailDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleteUserMutation.isLoading}>
            {deleteUserMutation.isLoading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default UserManagementPage;
