import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const SuperUserDashboard = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState({
    username: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if (tab === 0) {
      fetchUsers();
    } else if (tab === 1) {
      fetchProducts();
    } else {
      fetchSales();
    }
  }, [tab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar los usuarios');
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar los productos');
    }
  };

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/sales', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSales(response.data);
    } catch (error) {
      toast.error('Error al cargar las ventas');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUser({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setOpenDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Usuario actualizado exitosamente');
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      toast.error('Error al actualizar el usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Usuario eliminado exitosamente');
        fetchUsers();
      } catch (error) {
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundAttachment: 'fixed' }}>
      <Paper elevation={0} sx={{ mb: 4, p: 3, display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.18)', borderRadius: 3, boxShadow: '0 2px 12px rgba(25,118,210,0.10)' }}>
        <EmojiEventsIcon sx={{ fontSize: 40, color: '#ffd600', mr: 1 }} />
        <Box>
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}>
            ¡Bienvenido/a al Panel de SuperUsuario!
          </Typography>
          <Typography sx={{ color: '#333', opacity: 0.8, fontSize: 16 }}>
            Administra usuarios, productos y ventas con todas las herramientas avanzadas a tu disposición.
          </Typography>
        </Box>
      </Paper>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 2, mb: 2, textShadow: '0 2px 8px rgba(25,118,210,0.15)' }}>
          Panel de SuperUsuario
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab label="Usuarios" />
            <Tab label="Productos" />
            <Tab label="Ventas" />
          </Tabs>
        </Box>
        {tab === 0 && (
          <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.18)', borderRadius: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(25,118,210,0.08)' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(25,118,210,0.07)' } }}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditUser(user)}
                        sx={{ mr: 1, borderRadius: 2 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteUser(user._id)}
                        sx={{ borderRadius: 2 }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab === 1 && (
          <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.18)', borderRadius: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(25,118,210,0.08)' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Precio</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Categoría</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(25,118,210,0.07)' } }}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab === 2 && (
          <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.18)', borderRadius: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(25,118,210,0.08)' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale._id} sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(25,118,210,0.07)' } }}>
                    <TableCell>{sale._id}</TableCell>
                    <TableCell>{sale.user.username}</TableCell>
                    <TableCell>${sale.total}</TableCell>
                    <TableCell>{sale.status}</TableCell>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de Usuario"
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              label="Rol"
            >
              <MenuItem value="User">Usuario</MenuItem>
              <MenuItem value="Admin">Administrador</MenuItem>
              <MenuItem value="SuperUser">SuperUsuario</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateUser} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperUserDashboard; 