import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 8,
        px: { xs: 2, md: 6 },
        background: 'transparent',
      }}
    >
      {/* Sección Empresa */}
      <Box
        className="glass-card"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          gap: 6,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          my: 4,
        }}
      >
        <Box
          sx={{
            width: { xs: '80%', sm: '60%', md: 320 },
            height: 320,
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
            src="src/public/images/jylclean.png"
            alt="J&L Clean Co. Logo"
            style={{ width: '120%', height: '120%', objectFit: 'cover' }}
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
          </Box>
          <Typography
            variant="h3"
            className="bebas"
            sx={{ color: '#fff', mb: 2, fontSize: { xs: 28, md: 40 }, textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
          >
            NUESTRA EMPRESA
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 500, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Está dedicada a la elaboración y fabricación de productos de aseo.
          </Typography>
        </Box>
      </Box>

      {/* Sección Limpieza para el hogar */}
      <Box
        className="glass-card"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          gap: 6,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          my: 4,
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 500 }}>
          <Typography
            variant="h3"
            className="bebas"
            sx={{ color: '#fff', mb: 2, fontSize: { xs: 28, md: 40 }, textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
          >
            J&L CLEAN CO.<br />
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 500, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Limpieza y cuidado para el hogar.
          </Typography>          
        </Box>
        <Box
          sx={{
            width: { xs: '80%', sm: '60%', md: 420 },
            height: 280,
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
        className="glass-card"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          gap: 6,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
          <Typography
            variant="h3"
            className="bebas"
            sx={{ color: '#fff', mb: 2, fontSize: { xs: 24, md: 36 }, textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
          >
            TENEMOS UNA TIENDA ONLINE
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: '#fff', fontWeight: 500, fontSize: 18, mt: 2, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
          >
            Que garantiza a nuestros clientes mantenerse bien informados sobre
            nuestros productos, y permite a los usuarios nuevos conocerlos mejor.
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: '80%', sm: '60%', md: 420 },
            height: 280,
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
        className="glass-card"
        sx={{
          py: 8,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          mt: 6,
        }}
      >
        <Typography
          variant="h3"
          className="bebas"
          align="center"
          sx={{ mb: 6, color: '#fff', fontSize: { xs: 28, md: 40 }, textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
          NUESTROS PRODUCTOS
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Producto 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              className="glass-card"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
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
                  sx={{ color: '#fff', fontSize: 28, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                >
                  Aceites Esenciales
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  PRECIO $14.000-$18.000
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 16, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  Líquido altamente concentrado. Fragancia relajante y beneficios terapéuticos.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  PRESENTACIÓN: 5 ml, 10 ml, 30 ml y 100 ml.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Producto 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              className="glass-card"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
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
                  sx={{ color: '#fff', fontSize: 28, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                >
                  Crema Hidratante
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  PRECIO $18.000-$24.000
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 16, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  Crema ligera y nutritiva para hidratar, proteger y revitalizar la piel del rostro.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  PRESENTACIÓN: 30 ml, 50 ml y 100 ml.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Producto 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              className="glass-card"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
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
                  sx={{ color: '#fff', fontSize: 28, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                >
                  Ambientador de Pisos
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  PRECIO $12.000-$22.000
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 16, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  Líquido aromatizante para dejar un aroma fresco y duradero en pisos.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
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
