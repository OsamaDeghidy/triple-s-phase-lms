import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  styled,
  keyframes,
  Fade,
  Grow,
  CircularProgress,
  Alert,
  IconButton,
  Slider
} from '@mui/material';
import {
  Code,
  School,
  MenuBook,
  ChevronLeft,
  ChevronRight,
  ArrowForward,
  CheckCircle,
  LocalPharmacy,
  MedicalServices,
  LocalHospital,
  Description,
  NavigateNext,
  NavigateBefore,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import { courseAPI } from '../../services/api.service';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const SectionContainer = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(4, 0),
  backgroundColor: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 25% 25%, rgba(92, 45, 145, 0.06) 0%, transparent 25%),
      radial-gradient(circle at 75% 75%, rgba(52, 73, 139, 0.06) 0%, transparent 25%),
      radial-gradient(circle at 50% 10%, rgba(135, 206, 235, 0.04) 0%, transparent 20%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.98) 100%)
    `,
    zIndex: 0,
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 48px,
        rgba(92, 45, 145, 0.015) 50px,
        rgba(92, 45, 145, 0.015) 52px
      ),
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 48px,
        rgba(52, 73, 139, 0.015) 50px,
        rgba(52, 73, 139, 0.015) 52px
      )
    `,
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 0),
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(8),
  alignItems: 'center',
  position: 'relative',
  zIndex: 2,
  minHeight: '400px',
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(6),
  },
}));

const LeftSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    textAlign: 'center',
    order: 2,
  },
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    color: '#A0A0A0',
    fontSize: '1.2rem',
  },
  '& span': {
    color: '#333333',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  color: '#5C2D91',
  lineHeight: 1.2,
  marginBottom: theme.spacing(2),
  whiteSpace: 'nowrap', // Prevent line breaks
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
    whiteSpace: 'normal', // Allow wrapping on very small screens
    textOverflow: 'unset',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: '#6c757d',
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
  maxWidth: '500px',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
  },
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  background: '#34498B',
  color: '#fff',
  padding: theme.spacing(1.5, 3),
  borderRadius: '30px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 4px 15px rgba(52, 73, 139, 0.3)',
  transition: 'all 0.3s ease',
  alignSelf: 'flex-start',
  [theme.breakpoints.down('lg')]: {
    alignSelf: 'center',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(52, 73, 139, 0.4)',
    backgroundColor: '#2a3a6b',
  },
}));

const RightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    order: 1,
  },
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '600px',
  position: 'relative',
}));

const SliderTrack = styled(Box)(({ theme }) => ({
  flex: 1,
  height: '4px',
  backgroundColor: '#E0E0E0',
  borderRadius: '2px',
  position: 'relative',
  overflow: 'hidden',
}));

const SliderProgress = styled(Box)(({ theme, progress }) => ({
  height: '100%',
  backgroundColor: '#5C2D91',
  borderRadius: '2px',
  width: `${progress}%`,
  transition: 'width 0.3s ease',
}));

const SliderThumb = styled(Box)(({ theme, position }) => ({
  position: 'absolute',
  top: '50%',
  left: `${position}%`,
  transform: 'translate(-50%, -50%)',
  width: '16px',
  height: '16px',
  backgroundColor: '#5C2D91',
  borderRadius: '50%',
  border: '3px solid #ffffff',
  boxShadow: '0 2px 8px rgba(92, 45, 145, 0.3)',
  cursor: 'pointer',
  transition: 'left 0.3s ease',
  '&:hover': {
    transform: 'translate(-50%, -50%) scale(1.1)',
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  minWidth: '200px',
  maxWidth: '220px',
  width: '200px',
  minHeight: '300px',
  borderRadius: '16px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  flexShrink: 0, // Prevent cards from shrinking
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '180px',
    maxWidth: '180px',
    width: '180px',
    minHeight: '280px',
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  background: 'transparent',
  padding: theme.spacing(2, 2, 1, 2),
  textAlign: 'center',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '3rem',
    marginBottom: theme.spacing(1),
    color: '#87CEEB',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  color: '#5C2D91',
}));

const CourseCount = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: '#666666',
  fontWeight: 500,
}));

const CategoryCardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2, 2),
  textAlign: 'center',
  marginTop: 'auto',
}));

const ReadMoreButton = styled(Button)(({ theme, color }) => ({
  background: '#34498B',
  color: '#fff',
  padding: theme.spacing(1, 2),
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  width: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(52, 73, 139, 0.4)',
    backgroundColor: '#2a3a6b',
  },
}));

const ConnectingLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '60%',
  left: '20%',
  right: '20%',
  height: '2px',
  background: 'linear-gradient(90deg, transparent, #E0E0E0, transparent)',
  zIndex: 1,
  borderRadius: '1px',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    width: '8px',
    height: '8px',
    background: '#E0E0E0',
    borderRadius: '1px',
  },
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

const MethodCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'delay',
})(({ theme, delay = 0 }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.03)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    '& .card-hover-effect': {
      opacity: 1,
      transform: 'scale(1.03)',
    },
    '& .course-image': {
      transform: 'scale(1.05)',
    },
    '& .course-stats': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #6f42c1 0%, #e83e8c 100%)',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    zIndex: 2,
  },
  animation: `${floatAnimation} 6s ease-in-out infinite`,
  animationDelay: `${delay * 0.2}s`,
  opacity: 1,
}));

const CourseImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: { xs: '160px', sm: '180px', md: '200px' },
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
  '& .course-image': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
}));

const CourseBadge = styled(Box)(({ theme, variant = 'primary' }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  zIndex: 3,
  ...(variant === 'free' && {
    background: 'linear-gradient(90deg, #4DBFB3 0%, #d18a7a 100%)',
    color: '#fff',
  }),
  ...(variant === 'featured' && {
    background: 'linear-gradient(90deg, #ffc107 0%, #ff9800 100%)',
    color: '#fff',
  }),
  ...(variant === 'new' && {
    background: 'linear-gradient(90deg, #4DBFB3 0%, #45a049 100%)',
    color: '#fff',
  }),
}));

const MethodHeader = styled(Box)(({ theme, bgcolor }) => ({
  padding: theme.spacing(2.5, 3),
  background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
  },
  '& .MuiSvgIcon-root': {
    marginLeft: theme.spacing(1.5),
    fontSize: '2.2rem',
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '8px',
  },
  '& h3': {
    position: 'relative',
    zIndex: 1,
    margin: 0,
    fontWeight: 700,
    fontSize: '1.1rem',
  },
}));

const MethodContent = styled(CardContent)(({ theme }) => ({
  padding: { xs: theme.spacing(2), sm: theme.spacing(3) },
  position: 'relative',
  zIndex: 1,
  background: '#fff',
  borderRadius: '0 0 20px 20px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  '& h3': {
    marginTop: 0,
    marginBottom: theme.spacing(1.5),
    color: theme.palette.text.primary,
    fontWeight: 700,
    fontSize: { xs: '1.1rem', sm: '1.25rem' },
    lineHeight: 1.4,
    minHeight: { xs: '2.5rem', sm: '3rem' },
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  '& p': {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    minHeight: { xs: '60px', sm: '72px' },
    lineHeight: 1.7,
    fontSize: { xs: '0.9rem', sm: '0.95rem' },
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  '& ul': {
    paddingRight: '20px',
    margin: '12px 0',
    '& li': {
      marginBottom: '8px',
      position: 'relative',
      paddingRight: '24px',
      '&:before': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '8px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#333679',
      },
    },
  },
}));

const MethodFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 3, 3, 3),
  marginTop: 'auto',
  '& .MuiButton-root': {
    textTransform: 'none',
    fontWeight: 500,
    letterSpacing: '0.3px',
    padding: '10px 24px',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    color: '#333679',
    border: `1.5px solid #333679`,
    '&:hover': {
      backgroundColor: 'rgba(14, 81, 129, 0.04)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(14, 81, 129, 0.1)',
      borderColor: '#333679',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(14, 81, 129, 0.1)',
    },
    '& .MuiButton-endIcon': {
      transition: 'transform 0.3s ease',
      marginRight: theme.spacing(0.5),
      marginLeft: 0,
    },
    '&:hover .MuiButton-endIcon': {
      transform: 'translateX(-4px)'
    },
    '& span': {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9rem',
    },
  },
  '& .MuiTypography-body2': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    '& svg': {
      color: '#333679',
      fontSize: '1rem',
    },
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const LearningMethodsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [scrollContainer, setScrollContainer] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (categories[newValue]) {
      loadCoursesByCategory(categories[newValue].id);
    }
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  // Scroll navigation functions
  const scrollLeft = () => {
    if (scrollContainer) {
      // Scroll by exactly one card width + gap (16px)
      const cardWidth = window.innerWidth >= 960 ? 200 + 16 : 180 + 16;
      scrollContainer.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer) {
      // Scroll by exactly one card width + gap (16px)
      const cardWidth = window.innerWidth >= 960 ? 200 + 16 : 180 + 16;
      scrollContainer.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (typeof image === 'string') {
      // If it's already a full URL, return it
      if (image.startsWith('http')) return image;

      // If it's a relative path, construct full URL
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${image}`;
    }

    return null;
  };

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching categories from API...');
      const response = await courseAPI.getCategories();
      console.log('✅ Categories received:', response);

      // Ensure we have an array and filter active categories
      const categoriesData = Array.isArray(response) ? response : [];
      const activeCategories = categoriesData.filter(category => category.is_active !== false);

      console.log('📊 Active categories:', activeCategories.length);
      setCategories(activeCategories);

      if (activeCategories.length > 0) {
        // Load courses for the first category
        await loadCoursesByCategory(activeCategories[0].id);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setError('حدث خطأ في تحميل التصنيفات');
      setCategories([]);
    } finally {
      setLoading(false);
      console.log('🏁 Categories loading completed');
    }
  };

  // Load courses by category
  const loadCoursesByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await courseAPI.getPublicCourses({ category: categoryId });
      setCourses(Array.isArray(response) ? response : response.results || response.data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('حدث خطأ في تحميل الدورات');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';

    // Medical categories
    if (name.includes('صيدلة') || name.includes('pharmacy')) return <LocalPharmacy />;
    if (name.includes('طب') || name.includes('medicine') || name.includes('medical')) return <LocalHospital />;
    if (name.includes('اسنان') || name.includes('dentistry') || name.includes('dental')) return <MedicalServices />;

    // General categories
    if (name.includes('دورة') || name.includes('course')) return <School />;
    if (name.includes('تدريب') || name.includes('training')) return <Code />;
    if (name.includes('دبلوم') || name.includes('diploma')) return <MenuBook />;

    // Default icon
    return <School />;
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const renderCourses = () => {
    if (loading) {
      return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 6,
          gap: 2
        }}>
          <CircularProgress sx={{ color: '#5C2D91' }} />
          <Typography variant="body1" color="text.secondary">
            جاري تحميل الدورات...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Alert
            severity="error"
            sx={{
              maxWidth: '600px',
              width: '100%',
              '& .MuiAlert-message': {
                textAlign: 'center'
              }
            }}
          >
            {error}
          </Alert>
          <Button
            variant="outlined"
            onClick={() => {
              setError(null);
              loadCategories();
            }}
            sx={{ color: '#5C2D91', borderColor: '#5C2D91' }}
          >
            إعادة المحاولة
          </Button>
        </Box>
      );
    }

    if (courses.length === 0) {
      return (
        <Box sx={{
          textAlign: 'center',
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            bgcolor: 'rgba(92, 45, 145, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            <School sx={{ fontSize: '2rem', color: '#5C2D91' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            لا توجد دورات متاحة في هذا التصنيف حالياً
          </Typography>
          <Typography variant="body2" color="text.secondary">
            سيتم إضافة دورات جديدة قريباً
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        },
        gap: { xs: 2, sm: 3 },
        width: '100%',
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 2, sm: 3 }
      }}>
        {courses.map((course, index) => (
          <Box key={course.id} sx={{ width: '100%' }}>
            <Grow in={true} timeout={index * 200}>
              <Box>
                <MethodCard
                  delay={index}
                  onClick={() => handleCourseClick(course.id)}
                >
                  <CourseImageContainer>
                    <img
                      src={course.image_url || '/src/assets/images/bannar.jpeg'}
                      alt={course.title}
                      className="course-image"
                      onError={(e) => {
                        e.target.src = '/src/assets/images/bannar.jpeg';
                      }}
                    />

                    {/* Course Badges */}
                    {course.is_free && (
                      <CourseBadge variant="free">
                        مجاني
                      </CourseBadge>
                    )}
                    {course.is_featured && (
                      <CourseBadge variant="featured">
                        مميز
                      </CourseBadge>
                    )}
                    {course.is_certified && (
                      <CourseBadge variant="new">
                        معتمد
                      </CourseBadge>
                    )}
                  </CourseImageContainer>

                  <MethodContent>
                    <Typography variant="h6" component="h3">
                      {course.title}
                    </Typography>

                    <Typography variant="body2">
                      {course.short_description || course.description?.substring(0, 120) + '...' || 'لا يوجد وصف متاح'}
                    </Typography>

                    {course.instructors && course.instructors.length > 0 && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1.5,
                        p: 1,
                        bgcolor: 'rgba(14, 81, 129, 0.05)',
                        borderRadius: '8px'
                      }}>
                        <Box sx={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          bgcolor: '#5C2D91',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {course.instructors[0]?.name?.charAt(0) || 'م'}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {course.instructors[0]?.name || 'مدرب غير محدد'}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      {course.level && (
                        <Box sx={{
                          bgcolor: 'rgba(92, 45, 145, 0.1)',
                          color: '#5C2D91',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          {course.level === 'beginner' ? 'مبتدئ' :
                            course.level === 'intermediate' ? 'متوسط' :
                              course.level === 'advanced' ? 'متقدم' : course.level}
                        </Box>
                      )}
                      {course.price && !course.is_free && (
                        <Box sx={{
                          bgcolor: 'rgba(92, 45, 145, 0.1)',
                          color: '#5C2D91',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          {course.price} ريال
                        </Box>
                      )}
                      {course.average_rating && (
                        <Box sx={{
                          bgcolor: 'rgba(255, 193, 7, 0.1)',
                          color: '#ffc107',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          ⭐ {course.average_rating.toFixed(1)}
                        </Box>
                      )}
                      {course.total_enrollments && (
                        <Box sx={{
                          bgcolor: 'rgba(232, 62, 140, 0.1)',
                          color: '#e83e8c',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          👥 {course.total_enrollments}
                        </Box>
                      )}
                    </Box>

                    {/* Course Stats */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                      opacity: 0.8,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                      }
                    }} className="course-stats">
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          color: '#5C2D91',
                        }
                      }}>
                        <School sx={{ fontSize: '1rem', color: '#5C2D91' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {course.modules?.length || 0} وحدة
                        </Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          color: '#e83e8c',
                        }
                      }}>
                        <MenuBook sx={{ fontSize: '1rem', color: '#8A7BAA' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {course.lessons?.length || 0} درس
                        </Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          color: '#e83e8c',
                        }
                      }}>
                        <Code sx={{ fontSize: '1rem', color: '#8A7BAA' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {course.duration || 'غير محدد'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Course Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <Box sx={{
                        display: 'flex',
                        gap: 0.5,
                        mt: 1.5,
                        flexWrap: 'wrap'
                      }}>
                        {course.tags.slice(0, 3).map((tag, index) => (
                          <Box
                            key={index}
                            sx={{
                              bgcolor: 'rgba(111, 66, 193, 0.08)',
                              color: '#5C2D91',
                              px: 1,
                              py: 0.3,
                              borderRadius: '12px',
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              border: '1px solid rgba(111, 66, 193, 0.1)',
                            }}
                          >
                            {tag.name}
                          </Box>
                        ))}
                        {course.tags.length > 3 && (
                          <Box
                            sx={{
                              bgcolor: 'rgba(232, 62, 140, 0.08)',
                              color: '#e83e8c',
                              px: 1,
                              py: 0.3,
                              borderRadius: '12px',
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              border: '1px solid rgba(232, 62, 140, 0.1)',
                            }}
                          >
                            +{course.tags.length - 3}
                          </Box>
                        )}
                      </Box>
                    )}
                  </MethodContent>

                  <MethodFooter>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      disableRipple
                      disableTouchRipple
                      endIcon={<ArrowForward />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course.id);
                      }}
                      sx={{
                        background: 'linear-gradient(90deg, rgba(92, 45, 145, 0.05) 0%, rgba(138, 123, 170, 0.05) 100%)',
                        border: '1.5px solid #5C2D91',
                        color: '#5C2D91',
                        fontWeight: 600,
                        borderRadius: '12px',
                        padding: '10px 20px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #5C2D91 0%, #8A7BAA 100%)',
                          color: '#fff',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(92, 45, 145, 0.2)',
                          borderColor: 'transparent',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                          boxShadow: '0 2px 4px rgba(92, 45, 145, 0.1)',
                        },
                        '& .MuiTouchRipple-root': {
                          display: 'none !important'
                        },
                        '&:focus': {
                          transform: 'scale(1) !important',
                        },
                        '& .MuiButton-endIcon': {
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover .MuiButton-endIcon': {
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      عرض الدورة
                    </Button>
                  </MethodFooter>
                </MethodCard>
              </Box>
            </Grow>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <SectionContainer>
      <Container maxWidth="lg">
        <ContentWrapper>
          <LeftSection>
            <CategoryIcon>
              <Description />
              <span>تصنيفات الكورسات</span>
            </CategoryIcon>

            <MainTitle variant="h2" component="h2">
              كل شيء في مكان واحد
            </MainTitle>

            <ViewAllButton
              endIcon={<ArrowForward />}
              onClick={() => navigate('/courses')}
            >
              شاهد جميع التصنيفات
            </ViewAllButton>
          </LeftSection>

          <RightSection>
            {loading && categories.length === 0 ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 6,
                gap: 2
              }}>
                <CircularProgress sx={{ color: '#5C2D91' }} />
                <Typography variant="body1" color="text.secondary">
                  جاري تحميل التصنيفات...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Dynamic Category Cards from API - Horizontal Scroll */}
                <Box sx={{
                  position: 'relative',
                  mb: 3,
                  maxWidth: '672px', // Exactly 3 cards: (200px + 16px gap) * 3 = 648px + 24px padding
                  width: '100%',
                  mx: 'auto',
                  [theme.breakpoints.down('md')]: {
                    maxWidth: '588px', // (180px + 16px gap) * 3 = 552px + 36px padding
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '60px',
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '60px',
                    height: '100%',
                    background: 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }
                }}>
                  <Box
                    ref={setScrollContainer}
                    sx={{
                      display: 'flex',
                      gap: theme.spacing(2),
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      padding: theme.spacing(2, 0),
                      scrollBehavior: 'smooth',
                      '&::-webkit-scrollbar': {
                        height: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(0,0,0,0.1)',
                        borderRadius: '3px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'linear-gradient(90deg, #5C2D91 0%, #8A7BAA 100%)',
                        borderRadius: '3px',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #4a2475 0%, #7a6b9a 100%)',
                        }
                      },
                      // Hide scrollbar on mobile
                      [theme.breakpoints.down('md')]: {
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        '-ms-overflow-style': 'none',
                        'scrollbar-width': 'none',
                      }
                    }}
                  >
                    {categories.map((category, index) => (
                      <CategoryCard key={category.id}>
                        {/* Image Section at Top Center */}
                        <Box sx={{
                          width: '100%',
                          height: '140px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <Box sx={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                            border: '4px solid #ffffff'
                          }}>
                            {getImageUrl(category.image) ? (
                              <img
                                src={getImageUrl(category.image)}
                                alt={category.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '14px'
                                }}
                                onError={(e) => {
                                  // Fallback to icon if image fails to load
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <Box sx={{
                              display: getImageUrl(category.image) ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                              color: '#ffffff'
                            }}>
                              {getCategoryIcon(category.name)}
                            </Box>
                          </Box>
                        </Box>

                        {/* Content Section */}
                        <CardHeader>
                          <CardTitle>{category.name}</CardTitle>
                          <CourseCount>{category.active_courses_count || 0} كورس</CourseCount>
                        </CardHeader>

                        <CategoryCardContent>
                          <ReadMoreButton
                            onClick={() => navigate(`/courses?category=${category.slug || category.id}`)}
                            endIcon={<ArrowForward />}
                          >
                            إقرأ المزيد
                          </ReadMoreButton>
                        </CategoryCardContent>
                      </CategoryCard>
                    ))}

                    {/* Show message if no categories */}
                    {categories.length === 0 && !loading && (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        py: 4,
                        px: 3,
                        textAlign: 'center'
                      }}>
                        <Box sx={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          bgcolor: 'rgba(92, 45, 145, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2
                        }}>
                          <School sx={{ fontSize: '2rem', color: '#5C2D91' }} />
                        </Box>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          لا توجد تصنيفات متاحة حالياً
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          سيتم إضافة تصنيفات جديدة قريباً
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Navigation Buttons */}
                  {categories.length > 3 && (
                    <>
                      <IconButton
                        onClick={scrollLeft}
                        sx={{
                          position: 'absolute',
                          left: '-20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: '#ffffff',
                          color: '#5C2D91',
                          width: '40px',
                          height: '40px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          zIndex: 3,
                          '&:hover': {
                            backgroundColor: '#f8f9fa',
                            transform: 'translateY(-50%) scale(1.1)',
                          },
                          [theme.breakpoints.down('md')]: {
                            display: 'none', // Hide on mobile
                          }
                        }}
                      >
                        <KeyboardArrowLeft />
                      </IconButton>

                      <IconButton
                        onClick={scrollRight}
                        sx={{
                          position: 'absolute',
                          right: '-20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: '#ffffff',
                          color: '#5C2D91',
                          width: '40px',
                          height: '40px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          zIndex: 3,
                          '&:hover': {
                            backgroundColor: '#f8f9fa',
                            transform: 'translateY(-50%) scale(1.1)',
                          },
                          [theme.breakpoints.down('md')]: {
                            display: 'none', // Hide on mobile
                          }
                        }}
                      >
                        <KeyboardArrowRight />
                      </IconButton>
                    </>
                  )}
                </Box>

              </>
            )}
          </RightSection>
        </ContentWrapper>

        <ConnectingLine />

        {/* Keep the existing tabs and course display for functionality */}
        <Box sx={{ position: 'relative', zIndex: 1, mt: 8 }}>
          <Fade in={true} timeout={500}>
            <Box>
              {loading && categories.length === 0 ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 6,
                  gap: 2
                }}>
                  <CircularProgress sx={{ color: '#5C2D91' }} />
                  <Typography variant="body1" color="text.secondary">
                    جاري تحميل التصنيفات...
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 4,
                    gap: 2,
                    flexWrap: 'wrap'
                  }}>
                    {categories.map((category, index) => (
                      <Button
                        key={category.id}
                        variant={value === index ? "contained" : "outlined"}
                        onClick={() => handleChange(null, index)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '25px',
                          px: 3,
                          py: 1.5,
                          ...(value === index ? {
                            background: 'linear-gradient(90deg, #5C2D91, #8A7BAA)',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(92, 45, 145, 0.3)',
                          } : {
                            borderColor: '#5C2D91',
                            color: '#5C2D91',
                            '&:hover': {
                              borderColor: '#8A7BAA',
                              color: '#8A7BAA',
                            }
                          })
                        }}
                      >
                        {getCategoryIcon(category.name)}
                        <span style={{ marginLeft: '8px' }}>{category.name}</span>
                        {category.courses_count > 0 && (
                          <Box sx={{
                            bgcolor: value === index ? 'rgba(255, 255, 255, 0.2)' : 'rgba(92, 45, 145, 0.1)',
                            color: value === index ? '#fff' : '#5C2D91',
                            px: 1,
                            py: 0.2,
                            borderRadius: '10px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            minWidth: '20px',
                            textAlign: 'center',
                            marginLeft: '8px'
                          }}>
                            {category.courses_count}
                          </Box>
                        )}
                      </Button>
                    ))}
                  </Box> */}

                  {/* <Box mt={2}>
                    <TabPanel value={value} index={value}>
                      {renderCourses()}
                    </TabPanel>
                  </Box> */}
                </>
              )}
            </Box>
          </Fade>
        </Box>
      </Container>
    </SectionContainer>
  );
};

export default LearningMethodsSection;
