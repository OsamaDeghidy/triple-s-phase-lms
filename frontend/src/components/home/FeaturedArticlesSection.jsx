import React, { useState } from 'react';
import { Box, Container, Typography, Button, IconButton, useTheme, useMediaQuery, styled } from '@mui/material';
import { ArrowForward, ChevronLeft, ChevronRight, Article } from '@mui/icons-material';

// Sample articles data
const articles = [
    {
        id: 1,
        title: 'كيفية الوقاية من سرطان الثدي',
        author: 'admin',
        date: '2025-06-01',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
        readMore: 'اقرأ المزيد'
    },
    {
        id: 2,
        title: 'دور الرياضة في الحفاظ على صحة القلب',
        author: 'admin',
        date: '2025-06-01',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
        readMore: 'اقرأ المزيد'
    },
    {
        id: 3,
        title: 'الطب الوقائي وأهميته في الحد من الأمراض',
        author: 'admin',
        date: '2025-06-01',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=250&fit=crop',
        readMore: 'اقرأ المزيد'
    },
    {
        id: 4,
        title: 'التغذية السليمة وأثرها على الصحة العامة',
        author: 'admin',
        date: '2025-05-28',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
        readMore: 'اقرأ المزيد'
    },
    {
        id: 5,
        title: 'الصحة النفسية في بيئة العمل',
        author: 'admin',
        date: '2025-05-25',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop',
        readMore: 'اقرأ المزيد'
    },
    {
        id: 6,
        title: 'أهمية النوم الصحي لجسم الإنسان',
        author: 'admin',
        date: '2025-05-22',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop',
        readMore: 'اقرأ المزيد'
    }
];

const SectionContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 0),
    backgroundColor: '#FFFFFF',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(6, 0),
    },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: theme.spacing(3),
        alignItems: 'flex-start',
    },
}));

const HeaderLeft = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    direction: 'rtl',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#663399',
    lineHeight: 1.2,
    direction: 'rtl',
    [theme.breakpoints.down('sm')]: {
        fontSize: '2rem',
    },
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#333679',
    color: '#FFFFFF',
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(51, 54, 121, 0.3)',
    transition: 'all 0.3s ease',
    direction: 'rtl',
    '&:hover': {
        backgroundColor: '#2A2D5F',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(51, 54, 121, 0.4)',
    },
    '& .MuiButton-endIcon': {
        marginLeft: theme.spacing(0.5),
    },
}));

const ArticlesContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    padding: theme.spacing(0, 8),
    margin: theme.spacing(0, -2),
    [theme.breakpoints.down('lg')]: {
        gap: theme.spacing(2),
        padding: theme.spacing(0, 6),
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(0, 4),
        margin: theme.spacing(0, -1),
    },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E0E0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    zIndex: 2,
    '&:hover': {
        backgroundColor: '#663399',
        color: '#FFFFFF',
        borderColor: '#663399',
        transform: 'scale(1.1)',
    },
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
}));

const ArticlesGrid = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(3),
    overflowX: 'auto',
    overflowY: 'hidden',
    flex: 1,
    scrollBehavior: 'smooth',
    padding: theme.spacing(1, 0),
    margin: theme.spacing(0, 2),
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
    [theme.breakpoints.down('lg')]: {
        gap: theme.spacing(2),
        margin: theme.spacing(0, 1),
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: theme.spacing(2),
        overflowX: 'hidden',
        margin: 0,
    },
}));

const ArticleCard = styled(Box)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    minWidth: '320px',
    maxWidth: '380px',
    width: '100%',
    flex: '0 0 auto',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('xl')]: {
        minWidth: '300px',
        maxWidth: '350px',
    },
    [theme.breakpoints.down('lg')]: {
        minWidth: '280px',
        maxWidth: '320px',
    },
    [theme.breakpoints.down('md')]: {
        minWidth: '100%',
        maxWidth: '100%',
        width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
        maxWidth: '100%',
        width: '100%',
    },
}));

const ArticleImage = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '180px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: '#000000',
    },
    [theme.breakpoints.down('lg')]: {
        height: '160px',
    },
    [theme.breakpoints.down('md')]: {
        height: '200px',
    },
    [theme.breakpoints.down('sm')]: {
        height: '180px',
    },
}));

const ArticleContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2.5),
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(2),
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2.5),
    },
}));

const ArticleTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#663399',
    marginBottom: theme.spacing(1.5),
    lineHeight: 1.4,
    direction: 'rtl',
    textAlign: 'right',
    [theme.breakpoints.down('lg')]: {
        fontSize: '1rem',
        marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '1.1rem',
        marginBottom: theme.spacing(1.5),
    },
}));

const ArticleMeta = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
    fontSize: '0.85rem',
    color: '#A0A0A0',
    [theme.breakpoints.down('lg')]: {
        fontSize: '0.8rem',
        marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '0.85rem',
        marginBottom: theme.spacing(1.5),
    },
}));

const ReadMoreButton = styled(Button)(({ theme }) => ({
    color: '#663399',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: 0,
    direction: 'rtl',
    '&:hover': {
        backgroundColor: 'transparent',
        color: '#333679',
    },
    '& .MuiButton-endIcon': {
        marginLeft: theme.spacing(0.5),
    },
}));

const FeaturedArticlesSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        const container = document.getElementById('articles-scroll-container');
        if (container) {
            const cardWidth = 320 + 24; // card width + gap
            container.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleNext = () => {
        const container = document.getElementById('articles-scroll-container');
        if (container) {
            const cardWidth = 320 + 24; // card width + gap
            container.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const visibleArticles = articles;

    return (
        <SectionContainer>
            <Container maxWidth="lg">
                {/* Section Header */}
                <SectionHeader>
                    <HeaderLeft>
                        <SectionSubtitle>جديد المقالات</SectionSubtitle>
                        <SectionTitle variant="h2" component="h2">
                            مقالاتنا المميزة
                        </SectionTitle>
                    </HeaderLeft>
                    <ViewAllButton
                        endIcon={<ArrowForward />}
                        onClick={() => window.location.href = '/articles'}
                    >
                        عرض جميع المقالات
                    </ViewAllButton>
                </SectionHeader>

                {/* Articles Section */}
                <ArticlesContainer>
                    <NavigationButton
                        onClick={handlePrevious}
                        sx={{ position: 'absolute', left: -24, zIndex: 2 }}
                    >
                        <ChevronLeft />
                    </NavigationButton>

                    <ArticlesGrid id="articles-scroll-container">
                        {visibleArticles.map((article) => (
                            <ArticleCard key={article.id}>
                                <ArticleImage
                                    sx={{ backgroundImage: `url(${article.image})` }}
                                />
                                <ArticleContent>
                                    <ArticleTitle>{article.title}</ArticleTitle>
                                    <ArticleMeta>
                                        <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                                            by {article.author}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                                            {article.date}
                                        </Typography>
                                    </ArticleMeta>
                                    <ReadMoreButton
                                        endIcon={<ArrowForward />}
                                        onClick={() => window.location.href = `/article/${article.id}`}
                                    >
                                        {article.readMore}
                                    </ReadMoreButton>
                                </ArticleContent>
                            </ArticleCard>
                        ))}
                    </ArticlesGrid>

                    <NavigationButton
                        onClick={handleNext}
                        sx={{ position: 'absolute', right: -24, zIndex: 2 }}
                    >
                        <ChevronRight />
                    </NavigationButton>
                </ArticlesContainer>
            </Container>
        </SectionContainer>
    );
};

export default FeaturedArticlesSection;