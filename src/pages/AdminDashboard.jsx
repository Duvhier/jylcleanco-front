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
} from '@mui/material';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Error al obtener los productos');
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

  return (
    <div className="admin-dashboard" style={{ padding: 20 }}>
      <h2>Panel de Administración</h2>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Crear nuevo producto
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <img src={product.image} alt={product.name} width="50" />
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEditProduct(product)}
                    style={{ marginRight: 8 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteProduct(product._id)}
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
    </div>
  );
};

export default AdminDashboard;
