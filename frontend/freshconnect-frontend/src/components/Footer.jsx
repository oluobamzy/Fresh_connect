import { Box, Typography, Container, Grid, Link, IconButton, Divider, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', pt: 6, pb: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img src="/freshconnect-logo.svg" alt="FreshConnect Logo" style={{ height: 40, marginRight: 12, filter: 'brightness(0) invert(1)' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                FreshConnect
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Connecting farmers and consumers for a fresher, healthier food system.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook" component="a" href="https://facebook.com" target="_blank" rel="noopener">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" component="a" href="https://twitter.com" target="_blank" rel="noopener">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" component="a" href="https://instagram.com" target="_blank" rel="noopener">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn" component="a" href="https://linkedin.com" target="_blank" rel="noopener">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              {['Marketplace', 'Orders', 'Forum', 'Recipes'].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link component={RouterLink} to={`/${item.toLowerCase()}`} color="inherit" underline="hover">
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Team', path: '/team' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact Us', path: '/contact' }
              ].map((item) => (
                <Box component="li" key={item.name} sx={{ mb: 1 }}>
                  <Link component={RouterLink} to={item.path} color="inherit" underline="hover">
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Subscribe
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Get the latest updates on fresh produce and farm events
            </Typography>
            <Button variant="outlined" color="inherit" fullWidth sx={{ mb: 2 }}>
              Subscribe to Newsletter
            </Button>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" color="grey.300">
            © {new Date().getFullYear()} FreshConnect Canada. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', mt: { xs: 2, sm: 0 } }}>
            <Link href="#" color="inherit" sx={{ mx: 1 }} underline="hover">
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }} underline="hover">
              Terms of Service
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }} underline="hover">
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
