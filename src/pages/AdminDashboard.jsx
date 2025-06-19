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
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    category: ''
  });

  useEffect(() => {
    if (tab === 0) {
      fetchProducts();
    } else {
      fetchSales();
    }
  }, [tab]);

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

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/products',
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Producto creado exitosamente');
      setOpenDialog(false);
      fetchProducts();
    } catch (error) {
      toast.error('Error al crear el producto');
    }
  };

  const handleUpdateSaleStatus = async (saleId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/sales/${saleId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Estado de venta actualizado');
      fetchSales();
    } catch (error) {
      toast.error('Error al actualizar el estado de la venta');
    }
  };

  const handleOpenEditDialog = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      category: product.category
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: '',
      category: ''
    });
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/products/${selectedProduct._id}`,
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Producto actualizado exitosamente');
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Producto eliminado exitosamente');
        fetchProducts();
      } catch (error) {
        toast.error('Error al eliminar el producto');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Productos" />
          <Tab label="Ventas" />
        </Tabs>
      </Box>

      {tab === 0 ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 2 }}
          >
            Agregar Producto
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenEditDialog(product)}
                      >
                        
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale._id}</TableCell>
                  <TableCell>{sale.user.username}</TableCell>
                  <TableCell>${sale.total}</TableCell>
                  <TableCell>{sale.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleUpdateSaleStatus(sale._id, 'completed')}
                      disabled={sale.status === 'completed'}
                    >
                      Completar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleUpdateSaleStatus(sale._id, 'cancelled')}
                      disabled={sale.status === 'cancelled'}
                      sx={{ ml: 1 }}
                    >
                      Cancelar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descripción"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Precio"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL de Imagen"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Categoría"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          {editMode ? (
            <Button onClick={handleUpdateProduct} variant="contained" color="primary">
              Guardar Cambios
            </Button>
          ) : (
            <Button onClick={handleCreateProduct} variant="contained" color="primary">
              Crear
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 