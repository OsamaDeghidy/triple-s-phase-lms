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
  // Responsive padding
  '@media (max-width: 600px)': {
    padding: theme.spacing(1.5, 0, 1.5),
  },
  '@media (min-width: 600px) and (max-width: 900px)': {
    padding: theme.spacing(2, 0, 2),
  },
  '@media (min-width: 900px)': {
    padding: theme.spacing(2.5, 0, 2.5),
  },
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
  // Responsive font size
  '@media (max-width: 600px)': {
    fontSize: '0.9rem',
    marginBottom: theme.spacing(1),
  },
  '@media (min-width: 600px) and (max-width: 900px)': {
    fontSize: '0.95rem',
  },
  '@media (min-width: 900px)': {
    fontSize: '1rem',
  },
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
    // Responsive width
    '@media (max-width: 600px)': {
      width: 30,
    },
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  display: 'block',
  color: '#E6E6E6',
  marginBottom: theme.spacing(0.5),
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  fontSize: '0.85rem',
  // Responsive font size
  '@media (max-width: 600px)': {
    fontSize: '0.8rem',
    marginBottom: theme.spacing(0.3),
  },
  '@media (min-width: 600px) and (max-width: 900px)': {
    fontSize: '0.82rem',
  },
  '@media (min-width: 900px)': {
    fontSize: '0.85rem',
  },
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
  // Responsive layout
  '@media (max-width: 600px)': {
    marginBottom: theme.spacing(1.5),
  },
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
    // Responsive sizing
    '@media (max-width: 600px)': {
      width: '50px',
      height: '50px',
      fontSize: '1.2rem',
      padding: theme.spacing(1),
    },
    '@media (min-width: 600px) and (max-width: 900px)': {
      width: '55px',
      height: '55px',
      fontSize: '1.3rem',
    },
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#4A148C',
  color: '#FFFFFF',
  margin: theme.spacing(0, 1, 1, 0),
  width: '40px',
  height: '40px',
  transition: 'all 0.3s ease',
  // Responsive sizing
  '@media (max-width: 600px)': {
    width: '35px',
    height: '35px',
    margin: theme.spacing(0, 0.5, 0.5, 0),
  },
  '@media (min-width: 600px) and (max-width: 900px)': {
    width: '37px',
    height: '37px',
  },
  '@media (min-width: 900px)': {
    width: '40px',
    height: '40px',
  },
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
            padding: { xs: theme.spacing(1.5, 0), md: theme.spacing(2, 0) },
            mb: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 1, md: 0 },
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
                gap: { xs: 1, md: 2 },
                flex: 1,
                justifyContent: 'center',
                padding: { xs: theme.spacing(1, 0.5), md: theme.spacing(1.5, 1) },
                borderRight: !isMobile && index < contactInfo.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                borderBottom: isMobile && index < contactInfo.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                '&:last-child': {
                  borderRight: 'none',
                  borderBottom: 'none'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '60px', md: '80px' },
                  height: { xs: '60px', md: '80px' },
                  backgroundColor: 'transparent',
                  borderRadius: '0',
                  padding: 0,
                  border: 'none',
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="body2" sx={{ 
                  color: '#FFFFFF', 
                  fontWeight: 500, 
                  mb: 0.3, 
                  fontSize: { xs: '0.75rem', md: '0.85rem' } 
                }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#FFFFFF', 
                  fontWeight: 600, 
                  fontSize: { xs: '0.8rem', md: '0.9rem' } 
                }}>
                  {item.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Main Content - Single Unified Card */}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: { xs: theme.spacing(2), md: theme.spacing(4) },
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: { xs: 3, md: 4 },
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: 'center'
          }}
        >
          {/* Column 1: Logo and Description */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={{ xs: 1.5, md: 2.5 }}>
              <Box
                component="img"
                src={logo}
                alt="Triple S Academy Logo"
                sx={{
                  width: { xs: 80, sm: 100, md: 140, lg: 180, xl: 240 },
                  height: { xs: 80, sm: 100, md: 70, lg: 90, xl: 100 },
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
                mb: { xs: 1.5, md: 2.5 },
                fontSize: { xs: '0.75rem', md: '0.85rem' },
                textAlign: 'center',
                fontWeight: 400,
                px: { xs: 1, md: 0 }
              }}
            >
              Discover your hidden potential and start your journey of academic excellence with us.
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ 
                color: '#FFFFFF', 
                fontWeight: 600, 
                mb: { xs: 1, md: 1.5 }, 
                fontSize: { xs: '0.75rem', md: '0.85rem' } 
              }}>
                FOLLOW US ON
              </Typography>
              <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 0.8 }, justifyContent: 'center' }}>
                {socialLinks.map((social, index) => (
                  <SocialIcon
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: { xs: '30px', md: '35px' },
                      height: { xs: '30px', md: '35px' },
                      fontSize: { xs: '1rem', md: '1.1rem' }
                    }}
                  >
                    {social.icon}
                  </SocialIcon>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Column 2: Site Links */}
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '300px' } }}>
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.2rem' },
                mb: { xs: 2, md: 3 },
                position: 'relative',
                '&:after': {
                  content: '"— — —"',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#6A3ABF',
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  letterSpacing: '2px'
                }
              }}
            >
              روابط الموقع
            </Typography>
            <Box sx={{ mt: { xs: 2, md: 4 } }}>
              {siteLinks.map((link, index) => (
                <Typography
                  key={index}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    display: 'block',
                    color: '#C0B0E0',
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    mb: { xs: 1, md: 1.5 },
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#FFFFFF'
                    }
                  }}
                >
                  {link.text === 'courses' ? 'الكورسات' : link.text === 'Flash Cards' ? 'فلاش کاردز' : link.text}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Column 3: Other Links */}
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '300px' } }}>
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.2rem' },
                mb: { xs: 2, md: 3 },
                position: 'relative',
                '&:after': {
                  content: '"— — —"',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#6A3ABF',
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  letterSpacing: '2px'
                }
              }}
            >
              روابط اخرى
            </Typography>
            <Box sx={{ mt: { xs: 2, md: 4 } }}>
              {otherLinks.map((link, index) => (
                <Typography
                  key={index}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    display: 'block',
                    color: '#C0B0E0',
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    mb: { xs: 1, md: 1.5 },
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#FFFFFF'
                    }
                  }}
                >
                  {link.text}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Column 4: Newsletter Subscription */}
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '300px' } }}>
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.2rem' },
                mb: { xs: 2, md: 3 },
                position: 'relative',
                '&:after': {
                  content: '"— — —"',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#6A3ABF',
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  letterSpacing: '2px'
                }
              }}
            >
              Get in touch!
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#FFFFFF',
                lineHeight: 1.4,
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '0.75rem', md: '0.8rem' },
                textAlign: 'center',
                px: { xs: 1, md: 0 }
              }}
            >
              Subscribe our newsletter to get our latest Update & news
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.5 } }}>
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
                    fontSize: window.innerWidth < 600 ? '16px' : '0.85rem',
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
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                />
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#4A148C',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  padding: { xs: '8px 12px', md: '10px 16px' },
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', md: '0.85rem' },
                  minHeight: { xs: '44px', md: 'auto' },
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
        </Box>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: { xs: 2, md: 4 },
            pt: { xs: 2, md: 3 },
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 1, md: 0 }
          }}
        >
          {/* Copyright */}
          <Typography variant="body2" sx={{ 
            color: '#FFFFFF', 
            textAlign: 'center', 
            fontSize: { xs: '0.75rem', md: '0.85rem' },
            lineHeight: 1.4
          }}>
            Copyright © {currentYear} Bluetech Solutions All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
