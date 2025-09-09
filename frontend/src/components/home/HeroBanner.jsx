import { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Container, Typography, useMediaQuery, useTheme,
  Grid, IconButton, keyframes, Fade, Grow, Slide, Zoom, useScrollTrigger
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import {
  Code, Laptop, Smartphone, PlayCircle, ArrowBackIos,
  ArrowForwardIos, Circle, Star, School, EmojiEvents,
  ArrowForward, Refresh
} from '@mui/icons-material';
import api from '../../services/api.service';

// Import background images
// import home1Image from '../../assets/images/home1.png';
// import home2Image from '../../assets/images/home2.png';
// import home3Image from '../../assets/images/home3.png';



// Keyframe animations
const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeInUp = keyframes`
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const slideInLeft = keyframes`
  0% { transform: translateX(-100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideInUp = keyframes`
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// 3D Image Container
const Image3DContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  perspective: '1000px',
  zIndex: 0,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, #0e5181 0%, #e5978b 100%)',
    animation: '${gradientBG} 15s ease infinite',
    backgroundSize: '400% 400%',
    zIndex: 0,
  },
}));

const Image3D = styled(Box)(({ theme, src }) => ({
  position: 'absolute',
  width: '35%',
  height: '90%',
  left: '8%',
  top: '5%',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'rotateY(5deg) rotateX(5deg) scale(1.05)',
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${src})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '15px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
    transform: 'translateZ(40px)',
    transition: 'all 0.4s ease',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '20px',
  },
  '@keyframes float': {
    '0%': { transform: 'translateZ(0) rotate(0deg)' },
    '50%': { transform: 'translateZ(20px) rotate(2deg)' },
    '100%': { transform: 'translateZ(0) rotate(0deg)' },
  },
  animation: 'float 6s ease-in-out infinite',
}));

// Decorative geometric elements
const GeometricStripes = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  overflow: 'hidden',
}));

const Stripe = styled(Box)(({ top, left, width, height, rotation, color, delay }) => ({
  position: 'absolute',
  top: `${top}%`,
  left: `${left}%`,
  width: `${width}px`,
  height: `${height}px`,
  background: color,
  borderRadius: '20px',
  transform: `rotate(${rotation}deg)`,
  opacity: 0.6,
  animation: `${pulse} 4s ease-in-out ${delay}s infinite`,
}));

const HollowCircle = styled(Box)(({ top, left, size, delay }) => ({
  position: 'absolute',
  top: `${top}%`,
  left: `${left}%`,
  width: `${size}px`,
  height: `${size}px`,
  border: '2px solid #E5978B',
  borderRadius: '50%',
  opacity: 0.4,
  animation: `${pulse} 6s ease-in-out ${delay}s infinite`,
}));

// Background slides container for local images with scroll effect
const BackgroundSlides = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  overflow: 'hidden',
}));

const BackgroundSlide = styled(Box)(({ scrollProgress, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 1,
  transition: 'all 0.3s ease-out',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
    transform: `scale(${1 + scrollProgress * 0.1}) translateY(${scrollProgress * -20}px)`,
    transition: 'transform 0.3s ease-out',
    filter: `brightness(${1.3 + scrollProgress * 0.2}) contrast(${1.4 + scrollProgress * 0.3}) saturate(${1.2 + scrollProgress * 0.2})`,
    display: 'block',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(45, 27, 105, 0.2) 0%, rgba(26, 16, 63, 0.25) 100%)',
    zIndex: 1,
    opacity: 0.2 + scrollProgress * 0.2,
    transition: 'opacity 0.3s ease-out',
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(${90 + scrollProgress * 45}deg, rgba(0,0,0,${0.1 + scrollProgress * 0.2}) 0%, transparent 50%, rgba(0,0,0,${0.05 + scrollProgress * 0.1}) 100%)`,
    zIndex: 2,
    transition: 'all 0.3s ease-out',
  },
}));

// Carousel indicators (right side dots)
const CarouselIndicators = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '40px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  zIndex: 10,
  [theme.breakpoints.down('md')]: {
    right: '20px',
    gap: '15px',
  },
}));

const IndicatorDot = styled(Box)(({ active, theme }) => ({
  width: active ? '16px' : '12px',
  height: active ? '16px' : '12px',
  borderRadius: '50%',
  backgroundColor: active ? '#fff' : 'rgba(255, 255, 255, 0.6)',
  border: active ? '2px solid #E5978B' : '2px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? '0 0 15px rgba(229, 151, 139, 0.8)' : 'none',
  '&:hover': {
    backgroundColor: active ? '#fff' : 'rgba(255, 255, 255, 0.8)',
    transform: 'scale(1.2)',
    boxShadow: active ? '0 0 20px rgba(229, 151, 139, 1)' : '0 0 10px rgba(255, 255, 255, 0.5)',
  },
}));


// Refresh button (top right)
const RefreshButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '50px',
  height: '50px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  borderRadius: '50%',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  zIndex: 10,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    top: '15px',
    right: '15px',
    width: '40px',
    height: '40px',
  },
}));

const HeroSection = styled('section')(({ theme, scrollProgress }) => ({
  position: 'relative',
  color: '#fff',
  padding: '0',
  overflow: 'hidden',
  height: 'calc(100vh - 80px)', // 100vh minus header height
  minHeight: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'left',
  background: 'linear-gradient(135deg, #2D1B69 0%, #1A103F 50%, #0F0A2A 100%)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(45, 27, 105, 0.8) 0%, rgba(26, 16, 63, 0.9) 100%)',
    zIndex: 1,
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transform: `translateX(${scrollProgress * 100}%) skewX(-15deg)`,
    transition: 'transform 0.3s ease-out',
    zIndex: 1,
    pointerEvents: 'none',
  },
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  height: '100%',
  justifyContent: 'center',
  padding: theme.spacing(6, 0, 6, 2),
  maxWidth: '1000px',
  marginLeft: 0,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 2),
    textAlign: 'center',
    alignItems: 'center',
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  fontSize: '4rem',
  lineHeight: 1.1,
  maxWidth: '1000px',
  animation: `${slideInLeft} 1s ease-out 0.3s both`,
  color: '#FFFFFF',
  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: theme.spacing(4),
  maxWidth: '600px',
  opacity: 0.95,
  animation: `${slideInUp} 1s ease-out 0.6s both`,
  color: '#FFFFFF',
  fontWeight: 400,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
}));

const HeroButton = styled(Button)(({ theme, variant }) => ({
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: '12px',
  textTransform: 'none',
  background: variant === 'contained'
    ? 'linear-gradient(135deg, #2D1B69 0%, #1A103F 100%)'
    : 'transparent',
  color: variant === 'contained' ? 'white' : '#2D1B69',
  border: variant === 'outlined' ? '2px solid #2D1B69' : '2px solid rgba(255, 255, 255, 0.2)',
  boxShadow: variant === 'contained' ? '0 4px 15px rgba(45, 27, 105, 0.4)' : 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${slideInUp} 1s ease-out 0.9s both`,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: '0.5s',
  },
  '&:hover': {
    background: variant === 'contained'
      ? 'linear-gradient(135deg, #3A2375 0%, #2D1B69 100%)'
      : 'rgba(45, 27, 105, 0.1)',
    boxShadow: variant === 'contained'
      ? '0 6px 20px rgba(45, 27, 105, 0.6)'
      : '0 4px 12px rgba(45, 27, 105, 0.2)',
    transform: 'translateY(-2px)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    '&:before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

const FeatureItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
  padding: '1.5rem 2rem',
  background: 'linear-gradient(90deg, rgba(14, 81, 129, 0.1) 0%, rgba(229, 151, 139, 0.05) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(to bottom, #0e5181, #e5978b)',
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    '&::before': {
      width: '8px',
    },
    '& .feature-icon': {
      transform: 'scale(1.2) rotate(5deg)',
      textShadow: '0 0 15px rgba(255,255,255,0.5)',
    },
  },
  '& .feature-icon': {
    marginLeft: '1.5rem',
    fontSize: '1.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 1,
  },
  '& .feature-text': {
    fontSize: '1rem',
    fontWeight: 500,
    position: 'relative',
    zIndex: 1,
    background: 'linear-gradient(90deg, #fff, #E2E8F0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
});

const ImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.03) rotate(1deg)',
      filter: 'drop-shadow(0 15px 30px rgba(14, 81, 129, 0.3))',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(229, 151, 139, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(20px)',
    zIndex: 0,
    animation: 'pulse 8s infinite alternate',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(14, 81, 129, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(30px)',
    zIndex: 0,
    animation: 'pulse 10s infinite alternate-reverse',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(1.1)' },
  },
});

const FloatingIcon = styled('div')(({ theme, top, left, size = 40, delay }) => ({
  position: 'absolute',
  width: size,
  height: size,
  top: `${top}%`,
  left: `${left}%`,
  background: 'rgba(14, 81, 129, 0.1)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(14, 81, 129, 0.8)',
  animation: `float 6s ease-in-out ${delay}s infinite`,
  backdropFilter: 'blur(2px)',
  border: '1px solid rgba(14, 81, 129, 0.2)',
  zIndex: 1,
  '&:hover': {
    background: 'rgba(229, 151, 139, 0.15)',
    transform: 'scale(1.1)',
  },
}));

// Fallback background slides data (local images) - used when no banners are available
const fallbackSlides = [
  {
    id: 'fallback-1',
    image: '/static/images/placeholder-banner-1.jpg',
    title: 'التعلم الطبي، أصبح أسهل',
    subtitle: 'تعلم بوتيرتك الخاصة، بإرشاد الخبراء'
  },
  {
    id: 'fallback-2',
    image: '/static/images/placeholder-banner-2.jpg',
    title: 'تعلم بوتيرتك الخاصة',
    subtitle: 'التعليم الطبي المهني'
  },
  {
    id: 'fallback-3',
    image: '/static/images/placeholder-banner-3.jpg',
    title: 'دورات بقيادة الخبراء',
    subtitle: 'التدريب الطبي الشامل'
  }
];

const HeroBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bottomSlideIndex, setBottomSlideIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        console.log('Fetching banners from API...');
        console.log('API base URL:', api.defaults.baseURL);
        console.log('Full URL:', `${api.defaults.baseURL}/api/extras/banners/active/`);

        const response = await api.get('/api/extras/banners/active/');
        console.log('API Response:', response.data);

        // Check if response has results property (paginated response)
        const bannersData = response.data.results || response.data;
        console.log('Banners data:', bannersData);

        // Transform the data to match the expected format
        const transformedSlides = bannersData.map(banner => ({
          id: banner.id,
          title: banner.title,
          subtitle: banner.description || '',
          image: banner.image_url,
          url: banner.url || null,
          banner_type: banner.banner_type || 'main'
        }));
        console.log('Transformed slides:', transformedSlides);
        setSlides(transformedSlides);
      } catch (error) {
        console.error('Error fetching banners:', error);
        console.error('Error details:', error.response?.data || error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error config:', error.config);
        console.error('Error headers:', error.response?.headers);
        // Use fallback slides if API fails
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [refreshKey]);

  // Auto slide functionality for dynamic slides
  useEffect(() => {
    const currentSlides = slides.length > 0 ? slides : fallbackSlides;
    if (!autoPlay || currentSlides.length === 0) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === currentSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  // Scroll effect for background images
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const heroHeight = containerRef.current?.offsetHeight || 600;
      const progress = Math.min(scrollTop / heroHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play functionality for bottom slideshow
  useEffect(() => {
    const currentSlides = slides.length > 0 ? slides : fallbackSlides;
    if (currentSlides.length === 0) return;

    const interval = setInterval(() => {
      setBottomSlideIndex((prevIndex) =>
        prevIndex === currentSlides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides]);

  // Reset active slide if it's out of bounds
  useEffect(() => {
    const currentSlides = slides.length > 0 ? slides : fallbackSlides;
    if (activeSlide >= currentSlides.length && currentSlides.length > 0) {
      setActiveSlide(0);
    }
  }, [slides.length, activeSlide]);

  const handleNext = () => {
    const currentSlides = slides.length > 0 ? slides : fallbackSlides;
    if (currentSlides.length === 0) return;
    setActiveSlide((prev) => (prev === currentSlides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    const currentSlides = slides.length > 0 ? slides : fallbackSlides;
    if (currentSlides.length === 0) return;
    setActiveSlide((prev) => (prev === 0 ? currentSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  // Handle mouse move for parallax effect
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  // Calculate parallax effect
  const parallaxStyle = (factor = 5) => ({
    transform: `translate(${(mousePosition.x - window.innerWidth / 2) / factor}px, ${(mousePosition.y - window.innerHeight / 2) / factor}px)`,
    transition: 'transform 0.1s ease-out'
  });

  // Show loading state
  if (loading) {
    return (
      <HeroSection>
        <HeroContent maxWidth="md">
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              جاري تحميل البانرات...
            </Typography>
            <Box sx={{
              width: 40,
              height: 40,
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </Box>
        </HeroContent>
      </HeroSection>
    );
  }

  // Use fallback slides if no banners are available
  const displaySlides = slides.length > 0 ? slides : fallbackSlides;
  


  const currentSlide = displaySlides[activeSlide] || { title: '', subtitle: '' };

  return (
    <>
      <HeroSection
        onMouseMove={handleMouseMove}
        ref={containerRef}
        scrollProgress={scrollProgress}
      >
        {/* Background Slides (Dynamic from API) with Scroll Effect */}
        <BackgroundSlides>
          {displaySlides.map((slide, index) => (
            <BackgroundSlide
              key={slide.id}
              scrollProgress={scrollProgress}
              style={{
                opacity: index === activeSlide ? 1 : 0,
                zIndex: index === activeSlide ? 1 : 0,
              }}
            >
              <img
                src={slide.image}
                alt={slide.title || `Background ${index + 1}`}
                style={{
                  cursor: slide.url ? 'pointer' : 'default',
                  transition: 'transform 0.3s ease'
                }}
                onClick={() => {
                  if (slide.url) {
                    window.open(slide.url, '_blank');
                  }
                }}
                onError={(e) => {
                  // Fallback to local image if dynamic image fails to load
                  if (fallbackSlides[index]) {
                    e.target.src = fallbackSlides[index].image;
                  }
                }}
              />
            </BackgroundSlide>
          ))}
        </BackgroundSlides>

        {/* Decorative Geometric Elements */}
        <GeometricStripes>
          {/* Diagonal stripes */}
          <Stripe top={10} left={5} width={120} height={8} rotation={45} color="#4A2B8A" delay={0} />
          <Stripe top={15} left={15} width={80} height={6} rotation={45} color="#6B3FA3" delay={0.5} />
          <Stripe top={25} left={8} width={100} height={7} rotation={45} color="#5A3596" delay={1} />
          <Stripe top={35} left={20} width={90} height={5} rotation={45} color="#4A2B8A" delay={1.5} />
          <Stripe top={45} left={12} width={110} height={8} rotation={45} color="#6B3FA3" delay={2} />
          <Stripe top={55} left={25} width={70} height={6} rotation={45} color="#5A3596" delay={2.5} />
          <Stripe top={65} left={18} width={95} height={7} rotation={45} color="#4A2B8A" delay={3} />
          <Stripe top={75} left={30} width={85} height={5} rotation={45} color="#6B3FA3" delay={3.5} />

          {/* Right side stripes */}
          <Stripe top={20} left={85} width={100} height={6} rotation={45} color="#4A2B8A" delay={0.2} />
          <Stripe top={30} left={90} width={80} height={7} rotation={45} color="#6B3FA3" delay={0.7} />
          <Stripe top={40} left={82} width={110} height={5} rotation={45} color="#5A3596" delay={1.2} />
          <Stripe top={50} left={88} width={90} height={8} rotation={45} color="#4A2B8A" delay={1.7} />
          <Stripe top={60} left={85} width={75} height={6} rotation={45} color="#6B3FA3" delay={2.2} />
          <Stripe top={70} left={92} width={100} height={7} rotation={45} color="#5A3596" delay={2.7} />

          {/* Hollow circles */}
          <HollowCircle top={15} left={80} size={40} delay={0} />
          <HollowCircle top={25} left={75} size={30} delay={1} />
          <HollowCircle top={35} left={85} size={35} delay={2} />
          <HollowCircle top={45} left={78} size={25} delay={3} />
          <HollowCircle top={55} left={82} size={45} delay={4} />
          <HollowCircle top={65} left={76} size={20} delay={5} />
          <HollowCircle top={75} left={88} size={35} delay={6} />

          {/* Left side circles */}
          <HollowCircle top={20} left={15} size={30} delay={0.5} />
          <HollowCircle top={30} left={10} size={25} delay={1.5} />
          <HollowCircle top={40} left={18} size={40} delay={2.5} />
          <HollowCircle top={50} left={12} size={20} delay={3.5} />
          <HollowCircle top={60} left={20} size={35} delay={4.5} />
          <HollowCircle top={70} left={8} size={30} delay={5.5} />
        </GeometricStripes>

        {/* Hero Content with Scroll Effects */}
        <HeroContent maxWidth={false}>
          <Box sx={{
            maxWidth: '1000px',
            position: 'relative',
            zIndex: 2,
            padding: '0 20px 0 0',
            marginLeft: 0,
            transform: `translateY(${scrollProgress * -30}px)`,
            transition: 'transform 0.3s ease-out',
          }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 1,
                color: '#fff',
                textShadow: `0 ${2 + scrollProgress * 3}px ${10 + scrollProgress * 5}px rgba(0,0,0,${0.3 + scrollProgress * 0.2})`,
                animation: `${slideInUp} 1s ease-out 0.3s both`,
                position: 'relative',
                zIndex: 2,
                transform: `translateX(${scrollProgress * -20}px)`,
                transition: 'transform 0.3s ease-out',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '100px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.8)',
                  margin: '12px auto 8px',
                  borderRadius: '2px'
                }
              }}
            >
              {currentSlide.title}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                fontWeight: 400,
                mb: 1.5,
                color: 'rgba(255,255,255,0.95)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 2,
                transform: `translateX(${scrollProgress * -15}px)`,
                transition: 'transform 0.3s ease-out',
                opacity: 0.95 - scrollProgress * 0.3,
              }}
            >
              {currentSlide.subtitle}
            </Typography>

            {/* Add Hero Button */}
            <HeroButton
              variant="contained"
              component={RouterLink}
              to="/courses"
              endIcon={<ArrowForward />}
              sx={{
                transform: `translateX(${scrollProgress * -10}px) scale(${1 - scrollProgress * 0.1})`,
                transition: 'all 0.3s ease-out',
                opacity: 1 - scrollProgress * 0.4,
              }}
            >
              ابدأ رحلتك
            </HeroButton>
          </Box>
        </HeroContent>

        {/* Carousel Indicators (Right Side) */}
        <CarouselIndicators>
          {displaySlides.map((_, index) => (
            <IndicatorDot
              key={index}
              active={index === activeSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </CarouselIndicators>

        {/* Refresh Button (Top Right) */}
        <RefreshButton
          aria-label="refresh banners"
          onClick={() => {
            setRefreshKey(prev => prev + 1);
            setLoading(true);
          }}
          disabled={loading}
        >
          <Refresh />
        </RefreshButton>

      </HeroSection>


    </>
  );
};

export default HeroBanner;
