import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { toast } from 'react-toastify';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    category: '',
  });
  const [sales, setSales] = useState([]);
  const [tab, setTab] = useState(0);

  const statusOptions = ['pending', 'completed', 'cancelled'];

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Error al obtener los productos');
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

  const handleOpenDialog = () => {
    setEditing(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: '',
      category: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const validateProduct = () => {
    const { name, description, price, stock, image, category } = newProduct;
    if (!name || !description || !price || !stock || !image || !category) {
      toast.error('Por favor, completa todos los campos');
      return false;
    }
    if (isNaN(Number(price)) || isNaN(Number(stock))) {
      toast.error('Precio y stock deben ser números válidos');
      return false;
    }
    return true;
  };

  const handleCreateProduct = async () => {
    if (!validateProduct()) return;

    const productToSend = {
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products', productToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Producto creado exitosamente');
      setOpenDialog(false);
      fetchProducts();
    } catch (error) {
      toast.error('Error al crear el producto');
    }
  };

  const handleEditProduct = (product) => {
    setEditing(true);
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      category: product.category,
    });
    setOpenDialog(true);
  };

  const handleUpdateProduct = async () => {
    if (!validateProduct()) return;

    const productToSend = {
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/products/${selectedProduct._id}`,
        productToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Producto actualizado exitosamente');
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleChangeSaleStatus = async (saleId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/sales/${saleId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Estado de la venta actualizado');
      fetchSales();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundAttachment: 'fixed' }}>
      <Paper elevation={0} sx={{ mb: 4, p: 3, display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.18)', borderRadius: 3, boxShadow: '0 2px 12px rgba(25,118,210,0.10)' }}>
        <EmojiEventsIcon sx={{ fontSize: 40, color: '#ffd600', mr: 1 }} />
        <Box>
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}>
            ¡Bienvenido/a al Panel de Administración!
          </Typography>
          <Typography sx={{ color: '#333', opacity: 0.8, fontSize: 16 }}>
            Gestiona tus productos de manera eficiente y visualiza toda la información relevante.
          </Typography>
        </Box>
      </Paper>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 2, mb: 2, textShadow: '0 2px 8px rgba(25,118,210,0.15)' }}>
          Panel de Administración
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab label="Productos" />
            <Tab label="Ventas" />
          </Tabs>
        </Box>
        {tab === 0 && (
          <>
            <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ borderRadius: 2, fontWeight: 600, mb: 2 }}>
              Crear nuevo producto
            </Button>
            <TableContainer component={Paper} sx={{ mt: 3, background: 'rgba(255,255,255,0.18)', borderRadius: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(25,118,210,0.08)' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Descripción</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Precio</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Imagen</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Categoría</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(25,118,210,0.07)' } }}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <img src={product.image} alt={product.name} width="50" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleEditProduct(product)}
                          sx={{ mr: 1, borderRadius: 2 }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteProduct(product._id)}
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
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>
                {editing ? 'Editar Producto' : 'Crear Producto'}
              </DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="Nombre"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Descripción"
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Precio"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Stock"
                  name="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="URL de Imagen"
                  name="image"
                  value={newProduct.image}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Categoría"
                  name="category"
                  value={newProduct.category}
                  onChange={handleChange}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button
                  onClick={editing ? handleUpdateProduct : handleCreateProduct}
                  color="primary"
                  variant="contained"
                >
                  {editing ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {tab === 1 && (
          <TableContainer component={Paper} sx={{ mt: 3, background: 'rgba(255,255,255,0.18)', borderRadius: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(25,118,210,0.08)' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale._id} sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(25,118,210,0.07)' } }}>
                    <TableCell>{sale._id}</TableCell>
                    <TableCell>{sale.user?.username || 'N/A'}</TableCell>
                    <TableCell>${sale.total}</TableCell>
                    <TableCell>
                      <FormControl size="small" variant="standard">
                        <Select
                          value={sale.status}
                          onChange={e => handleChangeSaleStatus(sale._id, e.target.value)}
                          sx={{ minWidth: 120 }}
                        >
                          {statusOptions.map(opt => (
                            <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleChangeSaleStatus(sale._id, sale.status === 'pending' ? 'completed' : 'pending')}
                        sx={{ borderRadius: 2 }}
                      >
                        Cambiar Estado
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
