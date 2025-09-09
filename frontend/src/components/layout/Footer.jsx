import { Box, Container, Grid, Typography, Link, IconButton, Divider, useMediaQuery, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import logo from '../../assets/images/logo.png';
import footerBG from '../../assets/images/footerBG.png';
import footerPhone from '../../assets/images/footerphone.png';
import footerMassage from '../../assets/images/footermassage.png';
import footerLocation from '../../assets/images/footerlocation.png';

const FooterContainer = styled(Box)(({ theme }) => ({
  background: `url(${footerBG}) center/cover no-repeat, linear-gradient(135deg, #9C27B0 0%, #7B1FA2 50%, #6A1B9A 100%)`,
  color: '#FFFFFF',
  padding: theme.spacing(2.5, 0, 2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)', // Lighter overlay to match the image
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#FFFFFF',
  marginBottom: theme.spacing(1.5),
  position: 'relative',
  fontSize: '1rem',
  paddingBottom: theme.spacing(0.5),
  '&:after': {
    content: '""',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 1,
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 1,
    borderBottom: '1px dashed rgba(255, 255, 255, 0.5)',
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  display: 'block',
  color: '#E6E6E6',
  marginBottom: theme.spacing(0.5),
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  fontSize: '0.85rem',
  '&:hover': {
    color: '#FFFFFF',
    paddingRight: theme.spacing(0.5),
  },
}));

const ArrowIcon = styled(ArrowBackIcon)({
  fontSize: '1rem',
  marginRight: 8,
  opacity: 0,
  transform: 'translateX(-5px)',
  transition: 'all 0.3s ease',
});

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  flexDirection: 'column',
  flex: 1,
  '& .MuiSvgIcon-root': {
    marginBottom: theme.spacing(1),
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    fontSize: '1.5rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#4A148C',
  color: '#FFFFFF',
  margin: theme.spacing(0, 1, 1, 0),
  width: '40px',
  height: '40px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#6A1B9A',
    transform: 'translateY(-2px)',
  },
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const contactInfo = [
    {
      icon: <Box component="img" src={footerPhone} alt="Phone" sx={{ width: '80px', height: '80px' }} />,
      title: 'Call us any time:',
      text: '+962796098808'
    },
    {
      icon: <Box component="img" src={footerMassage} alt="Email" sx={{ width: '80px', height: '80px' }} />,
      title: 'Email us 24/7 hours:',
      text: 'info@triplesacademy.com'
    },
    {
      icon: <Box component="img" src={footerLocation} alt="Location" sx={{ width: '80px', height: '80px' }} />,
      title: 'Our academy location:',
      text: 'Al-Madina Al-Munawara Street, Amman - Jordan'
    },
  ];




  const siteLinks = [
    { text: 'courses', to: '/courses' },
    { text: 'Flash Cards', to: '/flashcards' },
    { text: 'Questions Bank', to: '/question-bank' },
    { text: 'blog', to: '/blog' },
    { text: 'About Us', to: '/about' },
    { text: 'Contact Us', to: '/contact' },
  ];



  const otherLinks = [
    { text: 'الأسئلة الشائعة', to: '/faq' },
    { text: 'سياسة الخصوصية', to: '/privacy-policy' },
    { text: 'الشروط والأحكام', to: '/terms' },
    { text: 'سياسة الإرجاع', to: '/refund-policy' },
    { text: 'المساعدة والدعم', to: '/support' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer component="footer">
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Top Contact Bar */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #4A148C 0%, #6A1B9A 50%, #7B1FA2 100%)',
            borderRadius: '0px',
            padding: theme.spacing(2, 0),
            mb: 3,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          {contactInfo.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flex: 1,
                justifyContent: 'center',
                padding: theme.spacing(1.5, 1),
                borderRight: index < contactInfo.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                '&:last-child': {
                  borderRight: 'none'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  // Remove background and border for all icons since they have their own styling
                  backgroundColor: 'transparent',
                  borderRadius: '0',
                  padding: 0,
                  border: 'none',
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500, mb: 0.3, fontSize: '0.85rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Main Content Grid - All Cards in One Row */}
        <Grid container spacing={4} sx={{ alignItems: 'stretch', justifyContent: 'center' }}>
          {/* Column 1: Logo and Description */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: theme.spacing(3),
                height: '100%',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" mb={2.5}>
                <Box
                  component="img"
                  src={logo}
                  alt="Triple S Academy Logo"
                  sx={{
                    width: { xs: 140, sm: 160, md: 180 },
                    height: { xs: 140, sm: 160, md: 180 },
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
                      transform: 'scale(1.05)',
                    }
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  lineHeight: 1.5,
                  mb: 2.5,
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  fontWeight: 400
                }}
              >
                Discover your hidden potential and start your journey of academic excellence with us.
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1.5, fontSize: '0.85rem' }}>
                  FOLLOW US ON
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'center' }}>
                  {socialLinks.map((social, index) => (
                    <SocialIcon
                      key={index}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        width: '35px',
                        height: '35px',
                        fontSize: '1.1rem'
                      }}
                    >
                      {social.icon}
                    </SocialIcon>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Column 2: Site Links */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: theme.spacing(3),
                height: '100%',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <FooterTitle sx={{ fontSize: '1rem', mb: 2 }}>Site Links</FooterTitle>
              {siteLinks.map((link, index) => (
                <Box key={index} mb={0.8}>
                  <FooterLink
                    component={RouterLink}
                    to={link.to}
                    underline="none"
                    sx={{ fontSize: '0.85rem', color: '#FFFFFF' }}
                  >
                    {link.text}
                  </FooterLink>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Column 3: Other Links */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: theme.spacing(3),
                height: '100%',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <FooterTitle sx={{ fontSize: '1rem', mb: 2 }}>Other Links</FooterTitle>
              {otherLinks.map((link, index) => (
                <Box key={index} mb={0.8}>
                  <FooterLink
                    component={RouterLink}
                    to={link.to}
                    underline="none"
                    sx={{ fontSize: '0.85rem', color: '#FFFFFF' }}
                  >
                    {link.text}
                  </FooterLink>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Column 4: Newsletter Subscription */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: theme.spacing(3),
                height: '100%',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <FooterTitle sx={{ fontSize: '1rem', mb: 2 }}>Get in touch!</FooterTitle>
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  lineHeight: 1.4,
                  mb: 2,
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}
              >
                Subscribe our newsletter to get our latest Update & news
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="Email Email"
                    style={{
                      width: '100%',
                      padding: '10px 35px 10px 10px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      color: '#333333',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <EmailIcon
                    sx={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#666666',
                      fontSize: '1rem'
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#4A148C',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    padding: '10px 16px',
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  SUBSCRIBE NOW →
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Copyright */}
          <Typography variant="body2" sx={{ color: '#FFFFFF', textAlign: 'center', fontSize: '0.85rem' }}>
            Copyright © {currentYear} Bluetech Solutions All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
