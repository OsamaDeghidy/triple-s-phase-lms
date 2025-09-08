import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Container, 
  Grid, 
  TextField, 
  Typography, 
  Tabs, 
  Tab, 
  Avatar, 
  InputAdornment, 
  Skeleton,
  IconButton,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Add, 
  Star, 
  StarBorder, 
  AccessTime, 
  People, 
  Category, 
  School,
  TrendingUp,
  NewReleases,
  Whatshot,
  CheckCircle,
  ShoppingCart,
  AddShoppingCart,
  Check,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { courseAPI, cartAPI } from '../../services/courseService';
import { API_CONFIG } from '../../config/api.config';

// Helper: truncate text to a fixed number of characters and append ellipsis
const truncateText = (text, maxChars = 30) => {
  if (!text) return '';
  const clean = String(text).trim();
  return clean.length > maxChars ? `${clean.slice(0, maxChars)}…` : clean;
};

// Animation variants
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
    '& .course-image': {
      transform: 'scale(1.08)',
    },
    '& .cart-button': {
      transform: 'scale(1.1) rotate(8deg)',
      '&::after': {
        transform: 'scale(1.2)',
        opacity: 0,
      }
    },
    '& .course-title': {
      color: theme.palette.primary.main,
    },
    '& .course-instructor': {
      transform: 'translateX(5px)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #e94560, #533483)',
    opacity: 0.8,
    transition: 'all 0.3s ease',
  },
}));

const CourseMedia = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
  overflow: 'hidden',
  borderRadius: '12px 12px 0 0',
  margin: '4px',
  '& .course-image': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  },
  '& .course-badge': {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    borderRadius: '20px',
    fontWeight: 600,
    padding: '6px 12px',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'rgba(255, 255, 255, 0.9)',
    color: theme.palette.primary.main,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
    zIndex: 1,
  },
}));

const CartButton = styled(IconButton)(({ theme, added }) => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 3,
  backgroundColor: added ? theme.palette.success.main : 'rgba(255, 255, 255, 0.95)',
  color: added ? '#fff' : theme.palette.primary.main,
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: added ? theme.palette.success.dark : theme.palette.primary.main,
    color: '#fff',
    transform: 'scale(1.1) rotate(8deg)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    border: `2px solid ${added ? theme.palette.success.main : theme.palette.primary.main}`,
    animation: added ? `${pulse} 1.5s infinite` : 'none',
    opacity: 0.7,
  },
  '& .cart-icon': {
    transition: 'transform 0.3s ease',
  },
  '&:hover .cart-icon': {
    transform: 'scale(1.2) rotate(-8deg)',
  },
}));

const CartBadge = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  backgroundColor: theme.palette.error.main,
  color: '#fff',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.65rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  animation: `${pulse} 2s infinite`,
}));

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AnimatedBackground = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23e94560\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.4,
    zIndex: 2,
    animation: `${pulse} 15s ease-in-out infinite`,
  },
}));

const FloatingShape = styled('div')({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(45deg, #0e5181, #1a5f8a)',
  filter: 'blur(60px)',  
  opacity: 0.15,
  zIndex: 1,
  animation: `${float} 15s ease-in-out infinite`,
  '&:nth-of-type(1)': {
    width: '300px',
    height: '300px',
    top: '10%',
    right: '10%',
    animationDelay: '0s',
  },
  '&:nth-of-type(2)': {
    width: '200px',
    height: '200px',
    bottom: '20%',
    right: '15%',
    animationDelay: '5s',
  },
  '&:nth-of-type(3)': {
    width: '250px',
    height: '250px',
    top: '30%',
    left: '15%',
    animationDelay: '7s',
    background: 'linear-gradient(45deg, #0a3d62, #0e5181)',
  },
});

const HeroSection = styled('div')(({ theme }) => ({
  background: 'linear-gradient(135deg, #0e5181 0%, #1a5f8a 50%, #0a3d62 100%)',
  color: 'white',
  padding: '30px 0 25px',
  margin: '0 0 20px 0',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 30%, rgba(14, 81, 129, 0.3) 0%, transparent 50%)',
    zIndex: 1,
    animation: `${pulse} 15s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23e5978b\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.6,
    zIndex: 2,
    animation: `${rotate} 120s linear infinite`,
  },
}));

// Floating shape styles are now defined in the keyframes section above

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  '& .search-input': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50px',
    padding: '12px 24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
      boxShadow: '0 0 0 2px rgba(229, 151, 139, 0.5)',
    },
  },
  '& .search-button': {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.primary.main,
  },
}));

const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderRadius: '20px',
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid',
  borderColor: selected ? theme.palette.primary.main : 'transparent',
  backgroundColor: selected 
    ? theme.palette.primary.main
    : alpha(theme.palette.background.paper, 0.8),
  color: selected 
    ? '#fff'
    : theme.palette.text.primary,
  boxShadow: selected 
    ? '0 4px 20px rgba(0, 0, 0, 0.15)'
    : '0 2px 8px rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: selected 
      ? theme.palette.primary.dark
      : alpha(theme.palette.primary.main, 0.1),
    color: selected 
      ? '#fff'
      : theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiChip-label': {
    fontSize: '0.875rem',
    padding: '4px 8px',
  },
  '& .MuiChip-icon': {
    fontSize: '1rem',
  },
}));

const CourseTitle = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '1.6em',
  fontWeight: 700,
  lineHeight: 1.3,
  marginBottom: '8px',
  color: theme.palette.text.primary,
  transition: 'color 0.3s ease'
}));

const InstructorInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: '12px',
  borderTop: '1px solid rgba(0,0,0,0.05)'
}));

const CourseMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  '& > *': {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1.5),
    '& svg': {
      fontSize: '1rem',
      marginLeft: theme.spacing(0.5)
    }
  }
}));

const AnimatedBackgroundComponent = () => (
  <AnimatedBackground>
    <FloatingShape />
    <FloatingShape style={{ width: '200px', height: '200px', bottom: '20%', right: '15%', animationDelay: '5s' }} />
    <FloatingShape style={{ width: '250px', height: '250px', top: '30%', left: '15%', animationDelay: '7s' }} />
  </AnimatedBackground>
);

const Courses = () => {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch courses and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch courses and categories in parallel
        const [coursesResponse, categoriesResponse] = await Promise.all([
          courseAPI.getCourses({ status: 'published' }),
          courseAPI.getCategories()
        ]);
        
        const coursesData = coursesResponse.results || coursesResponse;
        const categoriesData = categoriesResponse.results || categoriesResponse;
        
        // Debug logging
        console.log('Courses data:', coursesData);
        console.log('Categories data:', categoriesData);
        if (coursesData.length > 0) {
          console.log('Sample course category structure:', coursesData[0].category);
        }
        
        setCourses(coursesData);
        setCategories(categoriesData);
        
        // Load cart items
        try {
          const cartResponse = await cartAPI.getCart();
          const cartItemsMap = {};
          if (cartResponse.items) {
            cartResponse.items.forEach(item => {
              cartItemsMap[item.course.id] = true;
            });
          }
          setCartItems(cartItemsMap);
        } catch (cartError) {
          console.log('Cart not available:', cartError);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('حدث خطأ أثناء تحميل الدورات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter(course => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
                         course.title?.toLowerCase().includes(searchLower) ||
                         (course.instructors && course.instructors.some(instructor => 
                           instructor.name?.toLowerCase().includes(searchLower)
                         ));
    
    // Category filter - handle different data structures
    let matchesCategory = activeCategory === 'all';
    if (!matchesCategory && course.category) {
      // Check if category is an object with id or just an id
      const categoryId = typeof course.category === 'object' ? course.category.id : course.category;
      matchesCategory = categoryId == activeCategory; // Use == to handle string/number comparison
      
      // Debug logging for first few courses
      if (courses.indexOf(course) < 3) {
        console.log(`Course "${course.title}":`, {
          courseCategory: course.category,
          categoryId: categoryId,
          activeCategory: activeCategory,
          matchesCategory: matchesCategory
        });
      }
    }
    
    // Level filter
    const matchesLevel = tabValue === 'all' || course.level === tabValue;
    
    const result = matchesSearch && matchesCategory && matchesLevel;
    
    // Debug logging for filtering
    if (courses.indexOf(course) < 3) {
      console.log(`Course "${course.title}" filter result:`, {
        matchesSearch,
        matchesCategory,
        matchesLevel,
        finalResult: result
      });
    }
    
    return result;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCategoryChange = (categoryId) => {
    console.log('Category changed to:', categoryId);
    setActiveCategory(categoryId);
  };

  const toggleCartItem = async (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (cartItems[courseId]) {
        // Remove from cart - we need to find the cart item ID first
        const cartResponse = await cartAPI.getCart();
        const cartItem = cartResponse.items?.find(item => item.course.id === courseId);
        if (cartItem) {
          await cartAPI.removeFromCart(cartItem.id);
        }
        setCartItems(prev => {
          const newState = { ...prev };
          delete newState[courseId];
          return newState;
        });
        setSnackbar({ open: true, message: 'تم إزالة الدورة من السلة', severity: 'info' });
      } else {
        // Add to cart
        await cartAPI.addToCart(courseId);
        setCartItems(prev => ({ ...prev, [courseId]: true }));
        setSnackbar({ open: true, message: 'تم إضافة الدورة إلى السلة', severity: 'success' });
      }
    } catch (error) {
      console.error('Error toggling cart item:', error);
      setSnackbar({ 
        open: true, 
        message: 'حدث خطأ أثناء تحديث السلة', 
        severity: 'error' 
      });
    }
  };

  const getLevelLabel = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'مبتدئ';
      case 'intermediate':
        return 'متوسط';
      case 'advanced':
        return 'متقدم';
      default:
        return level || 'غير محدد';
    }
  };

  const getInstructorName = (instructors) => {
    if (!instructors || instructors.length === 0) return 'غير محدد';
    return instructors[0].name || 'غير محدد';
  };

  const getInstructorAvatar = (instructors) => {
    if (!instructors || instructors.length === 0) return null;
    return instructors[0].profile_pic;
  };

  const getCategoryName = (course) => {
    if (!course.category) return null;
    const categoryId = typeof course.category === 'object' ? course.category.id : course.category;
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : null;
  };

  const getCourseImage = (course) => {
    if (course.image) {
      return course.image.startsWith('http') ? course.image : `${API_CONFIG.baseURL}${course.image}`;
    }
    // Fallback to a default image
    return 'https://source.unsplash.com/random/800x450?course,education';
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <Box sx={{ py: 8, px: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl">
            <Grid container spacing={4}>
              {[1, 2, 3, 4].map((item) => (
                <Grid key={item} sx={{
                  width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.333% - 32px)', lg: 'calc(25% - 32px)' },
                  flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 32px)', md: '0 0 calc(33.333% - 32px)', lg: '0 0 calc(25% - 32px)' },
                  px: 2,
                  mb: 4
                }}>
                  <Card>
                    <Skeleton variant="rectangular" height={160} animation="wave" />
                    <CardContent>
                      <Skeleton width="80%" height={24} animation="wave" />
                      <Skeleton width="60%" height={20} animation="wave" sx={{ mt: 1 }} />
                      <Box sx={{ display: 'flex', mt: 2 }}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton width="40%" height={20} animation="wave" sx={{ mr: 1 }} />
                      </Box>
                      <Skeleton width="100%" height={40} animation="wave" sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            حدث خطأ
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            إعادة المحاولة
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AnimatedBackground>
        <FloatingShape />
        <FloatingShape style={{ width: '200px', height: '200px', bottom: '20%', right: '15%', animationDelay: '5s' }} />
        <FloatingShape style={{ width: '250px', height: '250px', top: '30%', left: '15%', animationDelay: '7s' }} />
      </AnimatedBackground>
      <Header />
      
      {/* Hero Section */}
      <HeroSection>
        {/* Animated Background Elements */}
        <FloatingShape style={{ width: '300px', height: '300px', top: '-100px', right: '-100px', animationDelay: '0s' }} />
        <FloatingShape style={{ width: '200px', height: '200px', bottom: '-50px', right: '20%', animationDelay: '2s', animationDuration: '15s' }} />
        <FloatingShape style={{ width: '400px', height: '400px', bottom: '-200px', left: '-150px', animationDelay: '4s', animationDuration: '20s' }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              py: 3,
              position: 'relative',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                filter: 'blur(40px)',
                zIndex: -1,
              },
              '&::before': {
                top: '20%',
                left: '10%',
                animation: `${pulse} 8s ease-in-out infinite`,
              },
              '&::after': {
                bottom: '10%',
                right: '15%',
                animation: `${pulse} 10s ease-in-out infinite reverse`,
              }
            }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  color: '#ffffff',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.2rem' },
                  lineHeight: 1.2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                اكتشف دوراتنا التعليمية
              </Typography>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    maxWidth: '600px', 
                    mx: 'auto', 
                    mb: 2,
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.6,
                    fontWeight: 300,
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  تعلم المهارات الجديدة وتقدم في مسيرتك المهنية مع دوراتنا المتنوعة والمتخصصة
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}
              >
                <Box sx={{ 
                  position: 'relative',
                  maxWidth: '400px',
                  mx: 'auto',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, #0e5181, #1a5f8a, #0a3d62)',
                    borderRadius: '25px',
                    zIndex: -1,
                    opacity: 0.3,
                    animation: `${pulse} 3s ease-in-out infinite`,
                  }
                }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="ابحث عن دورة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '25px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none',
                          boxShadow: '0 0 0 2px rgba(229, 151, 139, 0.5)',
                        },
                        paddingRight: '15px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 15px',
                        fontSize: '0.9rem',
                        '&::placeholder': {
                          opacity: 0.7,
                          color: theme.palette.text.secondary,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ 
                            color: '#0e5181', 
                            ml: 1,
                            fontSize: '1.1rem',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                          }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </HeroSection>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flex: 1, py: 6, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 6 }}>
          {/* Categories Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category sx={{ color: 'primary.main' }} />
                  التصنيفات
                </Typography>
                {(activeCategory !== 'all' || searchTerm || tabValue !== 'all') && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                      setTabValue('all');
                    }}
                    startIcon={<FilterList />}
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontSize: '0.8rem'
                    }}
                  >
                    مسح الفلاتر
                  </Button>
                )}
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1.5,
                maxHeight: { xs: '140px', sm: 'auto' },
                overflowY: { xs: 'auto', sm: 'visible' },
                pb: { xs: 1, sm: 0 },
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '3px',
                  '&:hover': {
                    background: 'rgba(0,0,0,0.5)',
                  },
                },
              }}>
                <CategoryChip
                  label="جميع التصنيفات"
                  selected={activeCategory === 'all'}
                  onClick={() => handleCategoryChange('all')}
                  icon={<Category fontSize="small" />}
                  sx={{
                    backgroundColor: activeCategory === 'all' ? 'primary.main' : 'background.paper',
                    color: activeCategory === 'all' ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: activeCategory === 'all' ? 'primary.dark' : 'primary.light',
                      color: 'white',
                    },
                  }}
                />
                {categories.map((category) => {
                  console.log('Rendering category:', category);
                  return (
                    <CategoryChip
                      key={category.id}
                      label={category.name}
                      selected={activeCategory === category.id.toString()}
                      onClick={() => handleCategoryChange(category.id.toString())}
                      sx={{
                        backgroundColor: activeCategory === category.id.toString() ? 'primary.main' : 'background.paper',
                        color: activeCategory === category.id.toString() ? 'white' : 'text.primary',
                        '&:hover': {
                          backgroundColor: activeCategory === category.id.toString() ? 'primary.dark' : 'primary.light',
                          color: 'white',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </motion.div>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" component="h2" fontWeight={700}>
                {activeCategory === 'all' ? 'جميع الدورات' : `دورات ${categories.find(c => c.id === parseInt(activeCategory))?.name || ''}`}
                {searchTerm && `: نتائج البحث عن "${searchTerm}"`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ fontWeight: 600, color: 'primary.main' }}>{filteredCourses.length}</span>
                دورة متاحة من إجمالي {courses.length} دورة
                {(activeCategory !== 'all' || searchTerm || tabValue !== 'all') && (
                  <Chip 
                    label="مفلترة" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      height: '20px', 
                      fontSize: '0.7rem',
                      ml: 1
                    }} 
                  />
                )}
              </Typography>
            </Box>
            
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-flexContainer': {
                  gap: 1,
                },
                '& .MuiTab-root': {
                  minHeight: 36,
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: 500,
                  minWidth: 'auto',
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              }}
            >
              <Tab value="all" label="الكل" />
              <Tab value="beginner" label="مبتدئ" icon={<School fontSize="small" />} iconPosition="start" />
              <Tab value="intermediate" label="متوسط" icon={<TrendingUp fontSize="small" />} iconPosition="start" />
              <Tab value="advanced" label="متقدم" icon={<Whatshot fontSize="small" />} iconPosition="start" />
            </Tabs>
          </Box>
          
          {filteredCourses.length > 0 ? (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)' 
              },
              gap: 3,
              width: '100%'
            }}>
              {filteredCourses.map((course, index) => (
                <Box key={course.id} sx={{ width: '100%' }}>
                  <motion.div
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={cardVariants}
                    style={{ height: '100%' }}
                  >
                    <StyledCard elevation={0} component={Link} to={`/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <CourseMedia>
                        <img 
                          src={getCourseImage(course)} 
                          alt={course.title} 
                          className="course-image"
                        />
                        {course.is_featured && (
                          <Chip 
                            label="مميز" 
                            color="primary" 
                            size="small" 
                            className="course-badge"
                            sx={{ 
                              bgcolor: 'primary.main',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {course.is_certified && (
                          <Chip 
                            label="شهادة" 
                            color="secondary" 
                            size="small" 
                            className="course-badge"
                            sx={{ 
                              bgcolor: 'secondary.main',
                              color: 'white',
                              fontWeight: 600,
                              top: course.is_featured ? 50 : 16,
                            }}
                          />
                        )}
                        <CartButton 
                          className="cart-button"
                          onClick={(e) => toggleCartItem(course.id, e)}
                          added={cartItems[course.id]}
                        >
                          {cartItems[course.id] ? (
                            <Check className="cart-icon" />
                          ) : (
                            <AddShoppingCart className="cart-icon" />
                          )}
                          {!cartItems[course.id] && <CartBadge>+</CartBadge>}
                        </CartButton>
                      </CourseMedia>
                      
                      <CardContent sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        flexGrow: 1,
                        p: 3,
                      }}>
                        <Box sx={{ mb: 1.5 }}>
                          {getCategoryName(course) && (
                            <Chip
                              label={getCategoryName(course)}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(229, 151, 139, 0.1)',
                                color: 'primary.main',
                                border: '1px solid rgba(229, 151, 139, 0.3)',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                height: '24px',
                                mb: 1,
                                '& .MuiChip-label': {
                                  px: 1.5,
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(229, 151, 139, 0.2)',
                                  borderColor: 'primary.main',
                                },
                              }}
                            />
                          )}
                          <Chip 
                            label={getLevelLabel(course.level)}
                            size="small"
                            color={course.level === 'beginner' ? 'success' : course.level === 'intermediate' ? 'warning' : 'error'}
                            sx={{ 
                              mb: 1.5,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                          <CourseTitle variant="h6" component="h3" gutterBottom>
                            {course.title}
                          </CourseTitle>
                        </Box>
                        
                        <InstructorInfo>
                          <Avatar 
                            src={getInstructorAvatar(course.instructors)} 
                            alt={getInstructorName(course.instructors)}
                            sx={{ width: 32, height: 32, ml: 1.5 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              المدرب
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={500}>
                              {getInstructorName(course.instructors)}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Star color="warning" fontSize="small" sx={{ ml: 0.5 }} />
                              <Typography variant="body2" fontWeight={600}>
                                {course.average_rating?.toFixed(1) || '0.0'}
                              </Typography>
                            </Box>
                          </Box>
                        </InstructorInfo>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <CourseMeta>
                            <Box>
                              <AccessTime fontSize="small" />
                              <Typography variant="caption" sx={{ mr: 0.5 }}>
                                {course.duration || 'غير محدد'}
                              </Typography>
                            </Box>
                            <Box>
                              <People fontSize="small" />
                              <Typography variant="caption" sx={{ mr: 0.5 }}>
                                {course.total_enrollments?.toLocaleString() || 0}
                              </Typography>
                            </Box>
                          </CourseMeta>
                          
                          <Box sx={{ textAlign: 'left' }}>
                            {course.discount_price ? (
                              <>
                                <Typography variant="body2" color="error" sx={{ textDecoration: 'line-through', opacity: 0.7, fontSize: '0.8rem' }}>
                                  {course.price} ر.س
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ lineHeight: 1, mt: -0.5 }}>
                                  {course.discount_price} ر.س
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="h6" color="primary">
                                {course.is_free ? 'مجاني' : `${course.price} ر.س`}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </motion.div>
                </Box>
              ))}
            </Box>
          ) : (
            <Box 
              textAlign="center" 
              py={8} 
              sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
                <School sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  لا توجد دورات متطابقة مع بحثك
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  لا يمكننا العثور على أي دورات تطابق معايير البحث الخاصة بك. حاول تغيير الفلتر أو مسح عوامل التصفية للعثور على ما تبحث عنه.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                    setTabValue('all');
                  }}
                  startIcon={<FilterList />}
                  sx={{ mt: 2 }}
                >
                  مسح كل الفلاتر
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
      
      <Footer />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Courses;
