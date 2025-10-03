import { useState, useEffect, useRef } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Container, IconButton, Rating, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowLeft, KeyboardArrowRight, PlayCircleOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { courseAPI } from '../../services/courseService';
import coursesliderBG from '../../assets/images/coursesliderBG.png';

const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4, 0),
  overflow: 'hidden',
  direction: 'rtl',
  backgroundImage: `url(${coursesliderBG})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '70vh',
}));

const SliderHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(0, 2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    right: 0,
    bottom: -8,
    width: '50px',
    height: '4px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
  },
}));

const SliderButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}));

const SliderTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2),
  },
}));

const CourseCard = styled(Card)(({ theme }) => ({
  width: '90%',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: '#FF0000',
  color: '#ffffff',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.7rem',
  fontWeight: 600,
  zIndex: 2,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
}));

const CourseMedia = styled(CardMedia)({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundColor: '#F0F0F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  '&:hover .play-button': {
    opacity: 1,
    transform: 'scale(1.1)',
  },
  '& .no-image-content': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#A0A0A0',
    fontSize: '0.9rem',
    fontWeight: 500,
    '& .landscape-icon': {
      fontSize: '2.5rem',
      marginBottom: '8px',
    },
    '& .no-image-text': {
      fontSize: '0.8rem',
      color: '#A0A0A0',
    },
  },
});

const PlayButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  opacity: 0,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

const CourseCardContent = styled(CardContent)(({ theme }) => ({
  padding: '16px',
  '& .MuiRating-root': {
    direction: 'ltr',
  },
}));

const CourseCategory = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
}));

const CourseTitle = styled(Typography)({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '3.6em',
  lineHeight: '1.2',
  fontWeight: 700,
  color: '#333333',
  fontSize: '1rem',
  marginBottom: '8px',
});

const InstructorText = styled(Typography)(({ theme }) => ({
  color: '#666666',
  fontSize: '0.8rem',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const PriceContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '8px',
});

const CurrentPrice = styled(Typography)(({ theme }) => ({
  color: '#FF0000',
  fontWeight: 700,
  fontSize: '1.1rem',
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  textDecoration: 'line-through',
  fontSize: '0.875rem',
}));

const StudentsCount = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const SliderDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active, theme }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: theme.palette.action.disabled,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  ...(active && {
    backgroundColor: theme.palette.primary.main,
  }),
}));

const CourseCollections = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const data = await courseAPI.getCourseCollections();
        setCollections(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('حدث خطأ في تحميل المجموعات');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <SliderContainer>
        <Container maxWidth="lg">
          {[1, 2, 3].map((index) => (
            <Box key={index} sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Box sx={{ width: 200, height: 32, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
                  <Box sx={{ width: 300, height: 20, bgcolor: 'grey.200', borderRadius: 1 }} />
                </Box>
                <Box sx={{ width: 100, height: 36, bgcolor: 'grey.300', borderRadius: 1 }} />
              </Box>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(280px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                  md: 'repeat(auto-fill, minmax(320px, 1fr))',
                  lg: 'repeat(auto-fill, minmax(350px, 1fr))'
                },
                gap: 3
              }}>
                {[1, 2, 3, 4].map((courseIndex) => (
                  <Box key={courseIndex} sx={{
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ height: 200, bgcolor: 'grey.300', borderRadius: '8px 8px 0 0' }} />
                    <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ width: '60%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
                      <Box sx={{ width: '90%', height: 20, bgcolor: 'grey.300', borderRadius: 1 }} />
                      <Box sx={{ width: '70%', height: 16, bgcolor: 'grey.200', borderRadius: 1 }} />
                      <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Container>
      </SliderContainer>
    );
  }

  if (error) {
    return (
      <SliderContainer>
        <Container maxWidth="lg">
          <Box sx={{
            textAlign: 'center',
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="h5" color="error.main" sx={{ mb: 2 }}>
              حدث خطأ في تحميل المجموعات
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              إعادة المحاولة
            </Button>
          </Box>
        </Container>
      </SliderContainer>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <SliderContainer>
        <Container maxWidth="lg">
          <Box sx={{
            textAlign: 'center',
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              لا توجد مجموعات متاحة حالياً
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              سيتم إضافة مجموعات جديدة قريباً
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/courses"
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              تصفح جميع الدورات
            </Button>
          </Box>
        </Container>
      </SliderContainer>
    );
  }

  return (
    <SliderContainer>
      <Container maxWidth="lg">
        {collections.map((collection, collectionIndex) => (
          <Box key={collection.id} sx={{ mb: 6 }}>
            <SliderHeader>
              <Box>
                <SectionTitle variant="h4" component="h2">
                  {collection.name}
                </SectionTitle>
                {collection.description && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {collection.description}
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to={`/courses?collection=${collection.slug}`}
                endIcon={<KeyboardArrowLeft />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(74, 108, 247, 0.05)',
                  },
                  '& .MuiButton-endIcon': {
                    marginRight: '4px',
                    marginLeft: '-4px',
                  }
                }}
              >
                عرض الكل
              </Button>
            </SliderHeader>

            {collection.courses && collection.courses.length > 0 ? (
              <Box
                sx={{
                  overflow: 'hidden',
                  width: '100%',
                  margin: '0 auto',
                }}
              >
                <SliderTrack
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(auto-fill, minmax(280px, 1fr))',
                      sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                      md: 'repeat(auto-fill, minmax(320px, 1fr))',
                      lg: 'repeat(auto-fill, minmax(350px, 1fr))'
                    },
                    gap: theme.spacing(2.5),
                    width: '100%',
                    padding: theme.spacing(0, 2, 4, 2),
                    [theme.breakpoints.down('sm')]: {
                      gap: theme.spacing(2),
                      padding: theme.spacing(0, 1, 4, 1),
                    },
                  }}
                >
                  {collection.courses.map((course) => (
                    <CourseCard key={course.id} component={RouterLink} to={`/courses/${course.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box sx={{ position: 'relative' }}>
                        <CourseMedia
                          image={course.image_url || 'https://via.placeholder.com/300x180'}
                          title={course.title}
                        >
                          <PlayButton className="play-button">
                            <PlayCircleOutline fontSize="large" color="primary" />
                          </PlayButton>
                        </CourseMedia>
                        {course.discount_percentage && (
                          <DiscountBadge>
                            {course.discount_percentage}% خصم
                          </DiscountBadge>
                        )}
                      </Box>
                      <CourseCardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating
                            value={course.rating || course.average_rating || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#3F51B5',
                              },
                              '& .MuiRating-iconEmpty': {
                                color: '#E0E0E0',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ color: '#666666', fontSize: '0.8rem' }}>
                            ({course.reviews_count || course.ratings_count || 0})
                          </Typography>
                        </Box>
                        <CourseTitle variant="subtitle1" component="h3">
                          {course.title}
                        </CourseTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, fontSize: '0.8rem', color: '#666666' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: '#666666',
                              borderRadius: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem',
                              color: '#ffffff'
                            }}>
                              📄
                            </Box>
                            <span>درس: {course.lessons_count || course.lessons?.length || 0}</span>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: '#666666',
                              borderRadius: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem',
                              color: '#ffffff'
                            }}>
                              👥
                            </Box>
                            <span>طلاب: {course.enrolled_count || course.students_count || 0}</span>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span>{course.level || 'مبتدئ'}</span>
                          </Box>
                        </Box>
                        <Box sx={{ borderTop: '1px solid #E0E0E0', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: '#E0E0E0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              color: '#666666',
                              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'%23666666\'%3E%3Cpath d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/%3E%3C/svg%3E")',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center'
                            }}>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#333333', fontWeight: 500 }}>
                              {course.instructors && course.instructors.length > 0
                                ? course.instructors[0].name
                                : 'Test'
                              }
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CurrentPrice>
                              {course.is_free ? 'مجاني' : `${parseFloat(course.discount_price || course.price)} $`}
                            </CurrentPrice>
                            {course.discount_price && course.price && course.discount_price < course.price && (
                              <OriginalPrice>
                                {parseFloat(course.price)} $
                              </OriginalPrice>
                            )}
                          </Box>
                        </Box>
                      </CourseCardContent>
                    </CourseCard>
                  ))}
                </SliderTrack>
              </Box>
            ) : (
              <Box sx={{
                textAlign: 'center',
                py: 6,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'grey.300'
              }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  لا توجد دورات في هذه المجموعة حالياً
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  سيتم إضافة دورات جديدة قريباً
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Container>
    </SliderContainer>
  );
};

export default CourseCollections;
