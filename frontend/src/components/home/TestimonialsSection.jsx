import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { FormatQuote, Star, StarBorder, StarHalf, Description, MenuBook } from '@mui/icons-material';

// Statistics data
const statistics = [
  { number: '3.9k+', label: 'Successfully Trained' },
  { number: '15.8k+', label: 'Classes Completed' },
  { number: '97.5k+', label: 'Satisfaction Rate' },
  { number: '100.2k+', label: 'Students Community' }
];

const testimonials = [
  {
    id: 1,
    name: 'student1',
    content: 'الدورة كانت مفيدة جداً وتغطي مواضيع مهمة. أسلوب المدرب ممتاز والأمثلة واضحة. الجلسات التفاعلية ساعدتني في تحسين مهاراتي بسرعة.',
    rating: 5,
    isPositive: true
  },
  {
    id: 2,
    name: 'student1',
    content: 'الدورة لم تكن كما توقعت. المحتوى أقل من المتوقع وبعض الأفكار لا يمكن تطبيقها. بعض المواضيع غير متسقة مع المنهج.',
    rating: 3,
    isPositive: false
  },
  {
    id: 3,
    name: 'student2',
    content: 'تجربة رائعة جداً! المحتوى منظم والمدربين محترفين. استفدت كثيراً من هذه الدورة وأوصي بها بشدة.',
    rating: 5,
    isPositive: true
  },
  {
    id: 4,
    name: 'student3',
    content: 'الدورة جيدة ولكن تحتاج إلى تحسينات في التنظيم. بعض الدروس كانت سريعة جداً.',
    rating: 4,
    isPositive: true
  },
  {
    id: 5,
    name: 'student4',
    content: 'محتوى ممتاز وطريقة التدريس واضحة. ساعدتني في تطوير مهاراتي بشكل كبير.',
    rating: 5,
    isPositive: true
  },
];

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

// Statistics Banner
const StatsBanner = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #663399 0%, #333679 100%)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(102, 51, 153, 0.2)',
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  // Responsive padding and margin
  padding: theme.spacing(4, 2),
  marginBottom: theme.spacing(8),
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 1),
    marginBottom: theme.spacing(4),
  },
  '@media (min-width: 600px) and (max-width: 900px)': {
    flexDirection: 'column',
    gap: theme.spacing(2.5),
    padding: theme.spacing(3, 1.5),
    marginBottom: theme.spacing(6),
  },
  '@media (min-width: 900px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(4, 2),
    marginBottom: theme.spacing(8),
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(135, 206, 235, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(135, 206, 235, 0.06) 0%, transparent 50%)
    `,
    borderRadius: '16px',
    pointerEvents: 'none',
  },
}));

const StatBlock = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: '#FFFFFF',
  position: 'relative',
  flex: 1,
  '&:not(:last-child):after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1px',
    height: '60%',
    backgroundColor: 'rgba(135, 206, 235, 0.4)',
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  marginBottom: theme.spacing(0.5),
  color: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: '#FFFFFF',
  opacity: 0.95,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  },
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 0),
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4),
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#A0A0A0',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  direction: 'rtl',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#663399',
  lineHeight: 1.2,
  marginBottom: theme.spacing(4),
  direction: 'rtl',
  textAlign: 'center',
  // Responsive font size
  fontSize: '2.5rem',
  '@media (max-width: 600px)': {
    fontSize: '1.75rem',
  },
  '@media (min-width: 600px) and (max-width: 900px)': {
    fontSize: '2rem',
  },
  '@media (min-width: 900px)': {
    fontSize: '2.5rem',
  },
}));

const QuoteIcon = styled(FormatQuote)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  bottom: theme.spacing(2),
  color: 'rgba(0, 0, 0, 0.03)',
  fontSize: '6rem',
  zIndex: 0,
  transform: 'scaleX(-1)',
}));

const TestimonialName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: 2,
  color: theme.palette.text.primary,
  fontSize: '1.1rem',
}));

const TestimonialContent = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  position: 'relative',
  paddingRight: theme.spacing(5),
  fontSize: '1rem',
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
  direction: 'rtl',
  textAlign: 'right',
  marginTop: theme.spacing(4),
}));

const TestimonialFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
}));

const TestimonialAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})(({ theme, bgColor }) => ({
  marginRight: theme.spacing(2),
  border: `3px solid #fff`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  backgroundColor: bgColor || theme.palette.primary.main,
  // Responsive sizing
  width: 60,
  height: 60,
  '@media (max-width: 600px)': {
    width: 50,
    height: 50,
  },
  '@media (min-width: 600px) and (max-width: 900px)': {
    width: 55,
    height: 55,
  },
  '@media (min-width: 900px)': {
    width: 60,
    height: 60,
  },
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const TestimonialInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const TestimonialRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  opacity: 0.8,
}));

const Rating = styled(Box)(({ theme, rating }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: '#FFD700',
  },
}));

const NavigationButton = styled('button')(({ theme, disabled }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  transition: 'all 0.3s ease',
  '&:hover:not(:disabled)': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
  },
  '&:focus': {
    outline: 'none',
    boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
  },
}));

const PrevButton = styled(NavigationButton)(({ theme }) => ({
  right: -24,
  [theme.breakpoints.down('md')]: {
    right: -16,
  },
}));

const NextButton = styled(NavigationButton)(({ theme }) => ({
  left: -24,
  [theme.breakpoints.down('md')]: {
    left: -16,
  },
}));

const TestimonialCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: theme.spacing(3),
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  width: '400px',
  minHeight: '200px',
  flex: '0 0 auto',
  margin: theme.spacing(0, 1),
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #663399 0%, #333679 100%)',
    clipPath: 'polygon(0 0, 0 100%, 100% 0)',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    width: '350px',
    margin: theme.spacing(0, 1),
  },
  [theme.breakpoints.down('sm')]: {
    width: '300px',
    margin: theme.spacing(0, 0.5),
  },
}));

const BookIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  left: theme.spacing(1.5),
  width: '28px',
  height: '28px',
  backgroundColor: '#FF6B6B',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    color: '#FFFFFF',
  },
}));

const PaginationDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(4),
}));

const Dot = styled(Box)(({ theme, active }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: active ? '#663399' : '#E0E0E0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: active ? '#663399' : '#B0B0B0',
  },
}));

const TestimonialsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#663399',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#333679',
  },
}));

const TestimonialsSection = () => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 2;

  const handleDotClick = (index) => {
    setActiveIndex(index);
    setCurrentPage(index);
  };

  const scrollToTestimonial = (index) => {
    const container = document.getElementById('testimonials-container');
    if (container) {
      const cardWidth = 400 + 16; // card width + margin
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToTestimonial(currentPage);
  }, [currentPage]);

  return (
    <SectionContainer>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Statistics Banner */}
        <StatsBanner>
          {statistics.map((stat, index) => (
            <StatBlock key={index}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatBlock>
          ))}
        </StatsBanner>

        {/* Testimonials Section */}
        <SectionHeader>
          <SectionSubtitle>
            <Description sx={{ fontSize: '1rem' }} />
            شهادات طلابنا
          </SectionSubtitle>
          <SectionTitle variant="h2" component="h2">
            ما يقوله الطلاب عن جامعتنا
          </SectionTitle>
        </SectionHeader>

        {/* Testimonial Cards */}
        <TestimonialsContainer id="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id}>
              <BookIcon>
                <MenuBook />
              </BookIcon>
              <TestimonialContent>
                {testimonial.content}
              </TestimonialContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <TestimonialName>{testimonial.name}</TestimonialName>
                <Typography sx={{ color: '#A0A0A0', fontSize: '0.9rem' }}>
                  ({testimonial.rating})
                </Typography>
              </Box>
            </TestimonialCard>
          ))}
        </TestimonialsContainer>

        {/* Pagination Dots */}
        <PaginationDots>
          {Array.from({ length: Math.ceil(testimonials.length / testimonialsPerPage) }).map((_, index) => (
            <Dot
              key={index}
              active={index === currentPage}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </PaginationDots>
      </Container>
    </SectionContainer>
  );
};

export default TestimonialsSection;
