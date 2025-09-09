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

const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #663399 0%, #333679 50%, #1B1B48 100%)',
  color: '#FFFFFF',
  padding: theme.spacing(3, 0, 2),
  position: 'relative',
  overflow: 'hidden',
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
    width: 30,
    height: 1,
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
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
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#FFFFFF',
  margin: theme.spacing(0, 1, 1, 0),
  width: '40px',
  height: '40px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px)',
  },
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const contactInfo = [
    {
      icon: <PhoneIcon />,
      title: 'اتصل بنا في اي وقت',
      text: '+962796098808'
    },
    {
      icon: <EmailIcon />,
      title: 'راسلنا على الايميل',
      text: 'info@triplesacademy.com'
    },
    {
      icon: <LocationIcon />,
      title: 'موقع الاكاديمية',
      text: 'ش. المدينة المنورة، عمان - الأردن'
    },
  ];




  const siteLinks = [
    { text: 'الكورسات', to: '/courses' },
    { text: 'فلاش کاردز', to: '/flashcards' },
    { text: 'بنك الأسئلة', to: '/question-bank' },
    { text: 'المدونة', to: '/blog' },
    { text: 'عن الاكاديمية', to: '/about' },
    { text: 'اتصل بنا', to: '/contact' },
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Contact Bar - Top Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            gap: 2,
            padding: theme.spacing(2, 0)
          }}
        >
          {contactInfo.map((item, index) => (
            <ContactItem key={index}>
              {item.icon}
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5, fontSize: '0.9rem' }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}>
                {item.text}
              </Typography>
            </ContactItem>
          ))}
        </Box>

        <Grid container spacing={isMobile ? 3 : 4}>
          {/* Company Information */}
          <Grid item xs={12} md={4}>
            <Box mb={1}>
              <Box display="flex" alignItems="center" mb={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 2,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#663399'
                  }}
                >
                  S
                </Box>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  Triple S Academy
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#E6E6E6', lineHeight: 1.6, mb: 2, fontSize: '0.85rem' }}>
                اكتشف قدراتك الكامنة وابدأ رحلة التميز الأكاديمي معنا. نحن هنا لترشدك نحو النجاح بثقة وخبرة
              </Typography>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
                تابعنا
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <SocialIcon
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </SocialIcon>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Site Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterTitle>روابط الموقع</FooterTitle>
            {siteLinks.map((link, index) => (
              <Box key={index} mb={0.5}>
                <FooterLink
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                >
                  {link.text}
                </FooterLink>
              </Box>
            ))}
          </Grid>

          {/* Other Links and Newsletter - Side by Side */}
          <Grid item xs={12} sm={6} md={6}>
            <Grid container spacing={2}>
              {/* Other Links */}
              <Grid item xs={6}>
                <FooterTitle>روابط اخرى</FooterTitle>
                {/* Empty section as shown in the image */}
              </Grid>

              {/* Newsletter Subscription */}
              <Grid item xs={6}>
                <FooterTitle>تابع جديدنا</FooterTitle>
                <Typography variant="body2" sx={{ color: '#E6E6E6', lineHeight: 1.4, mb: 2, fontSize: '0.85rem' }}>
                  اشترك في نشرتنا البريدية للحصول على آخر التحديثات والأخبار
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="Email Email"
                      style={{
                        width: '100%',
                        padding: '10px 35px 10px 10px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        outline: 'none',
                        '&::placeholder': {
                          color: '#FFFFFF',
                          opacity: 0.7
                        }
                      }}
                    />
                    <EmailIcon
                      sx={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#FFFFFF',
                        fontSize: '1rem'
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#1B1B48',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      padding: '10px 20px',
                      borderRadius: '6px',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      '&:hover': {
                        backgroundColor: '#0F0F2A',
                      }
                    }}
                  >
                    SUBSCRIBE NOW →
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: '#A0A0A0', textAlign: 'center', fontSize: '0.8rem' }}>
            Copyright © {currentYear} Bluetech Solutions All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
