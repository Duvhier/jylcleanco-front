import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f1f8e9 0%, #e3f2fd 100%)',
        minHeight: '100vh',
        pb: 8,
        px: { xs: 2, md: 6 },
      }}
    >
      {/* Sección Empresa */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          gap: 6,
        }}
      >
        <Box
          sx={{
            width: { xs: '80%', sm: '60%', md: 320 },
            height: 320,
            background: '#fff',
            borderRadius: '24px',
            boxShadow: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <img
            src="src/public/images/jylclean.jpg"
            alt="J&L Clean Co. Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 500 }}>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <img
              src="src/public/images/logo.png"
              alt="J&L Clean Co. Icon"
              style={{ width: 100, height: 100 }}
            />
          </Box>
          <Typography
            variant="h2"
            className="bebas"
            sx={{ color: '#1976d2', mb: 2, fontSize: { xs: 32, md: 48 } }}
          >
            Nuestra empresa
          </Typography>
          <Typography variant="h5" sx={{ color: '#333', mb: 2, fontWeight: 500 }}>
            Está dedicada a la elaboración y fabricación de productos de aseo.
          </Typography>
        </Box>
      </Box>

      {/* Sección Limpieza para el hogar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          gap: 6,
          background: '#f9fbe7',
          borderRadius: 6,
          my: 4,
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 500 }}>
          <img
            src="src/public/images/logo.png"
            alt="J&L Clean Co. Icon"
            style={{ width: 100, height: 100, marginBottom: 16 }}
          />
          <Typography
            variant="h3"
            className="bebas"
            sx={{ color: '#388e3c', mb: 2, fontSize: { xs: 28, md: 40 } }}
          >
            J&L CLEAN CO.<br />
            Limpieza para el hogar
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: '80%', sm: '60%', md: 420 },
            height: 280,
            borderRadius: '24px',
            boxShadow: 3,
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          }}
        >
          <img
            src="src/public/images/jabones.jpg"
            alt="Productos de Limpieza"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Box>

      {/* Sección Tienda Online */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          gap: 6,
          background: '#fffde7',
          borderRadius: 6,
          my: 4,
        }}
      >
        <Box
          sx={{
            textAlign: { xs: 'center', md: 'right' },
            maxWidth: 500,
            order: { xs: 2, md: 1 },
          }}
        >
          <img
            src="src/public/images/logo.png"
            alt="J&L Clean Co. Icon"
            style={{ width: 60, height: 60, marginBottom: 16 }}
          />
          <Typography
            variant="h3"
            className="bebas"
            sx={{ color: '#f57c00', mb: 2, fontSize: { xs: 28, md: 40 } }}
          >
            Tenemos una tienda online
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#444', fontWeight: 500, fontSize: 18, mt: 2 }}
          >
            Que garantiza a nuestros clientes mantenerse bien informados sobre
            nuestros productos, y permite a los usuarios nuevos conocerlos mejor.
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: '80%', sm: '60%', md: 420 },
            height: 280,
            borderRadius: '24px',
            boxShadow: 3,
            overflow: 'hidden',
            order: { xs: 1, md: 2 },
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          }}
        >
          <img
            src="src/public/images/online.jpg"
            alt="Tienda Online"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      </Box>

      {/* Sección Productos Destacados */}
      <Box
        sx={{
          py: 8,
          background: '#e3f2fd',
          borderRadius: 6,
          mt: 6,
        }}
      >
        <Typography
          variant="h3"
          className="bebas"
          align="center"
          sx={{ mb: 6, color: '#1a237e', fontSize: { xs: 28, md: 40 } }}
        >
          Nuestros Productos
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Producto 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: '20px',
                boxShadow: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image="src/public/images/aceites.jpg"
                alt="Aceites Esenciales"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  className="bebas"
                  sx={{ color: '#1976d2', fontSize: 28 }}
                >
                  Aceites Esenciales
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 700 }}>
                  PRECIO $14.000-$18.000
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                  Líquido altamente concentrado obtenido por destilación al vapor de lavanda. Fragancia relajante y beneficios terapéuticos.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  PRESENTACIÓN: 5 ml, 10 ml, 30 ml y 100 ml.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Producto 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: '20px',
                boxShadow: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image="src/public/images/cremas.jpg"
                alt="Crema Facial Hidratante"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  className="bebas"
                  sx={{ color: '#1976d2', fontSize: 28 }}
                >
                  Crema Facial Hidratante
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 700 }}>
                  PRECIO $18.000-$24.000
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                  Crema ligera y nutritiva para hidratar, proteger y revitalizar la piel del rostro.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  PRESENTACIÓN: 30 ml, 50 ml y 100 ml.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Producto 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: '20px',
                boxShadow: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: 8,
                },
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image="src/public/images/ambientador.jpg"
                alt="Ambientador de Pisos"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  className="bebas"
                  sx={{ color: '#1976d2', fontSize: 28 }}
                >
                  Ambientador de Pisos
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 700 }}>
                  PRECIO $12.000-$22.000
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>
                  Líquido aromatizante para dejar un aroma fresco y duradero en pisos.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  PRESENTACIÓN: 500 ml y 1000 ml.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
