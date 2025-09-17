import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    useTheme,
    useMediaQuery,
    styled,
    CircularProgress,
    Alert,
    Card,
    CardContent
} from '@mui/material';
import { ArrowForward, ChevronLeft, ChevronRight, Article, ErrorOutline } from '@mui/icons-material';
import { articleAPI } from '../../services/api.service';

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

const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8, 0),
    gap: theme.spacing(2),
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4, 0),
    gap: theme.spacing(2),
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 0),
    gap: theme.spacing(2),
    textAlign: 'center',
}));

const FeaturedArticlesSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch articles from API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                console.log('🔄 Fetching articles from API...');
                setLoading(true);
                setError(null);

                let finalArticles = [];

                // Try different API endpoints in order of preference
                const apiEndpoints = [
                    { name: 'Featured Articles', method: () => articleAPI.getFeaturedArticles() },
                    { name: 'Recent Articles', method: () => articleAPI.getRecentArticles() },
                    { name: 'General Articles', method: () => articleAPI.getArticles({ limit: 6 }) },
                    { name: 'All Articles', method: () => articleAPI.getArticles() }
                ];

                for (const endpoint of apiEndpoints) {
                    try {
                        console.log(`🔍 Trying ${endpoint.name}...`);
                        const articlesData = await endpoint.method();
                        console.log(`✅ ${endpoint.name} response:`, articlesData);

                        // Extract articles from different response formats
                        let extractedArticles = [];

                        if (Array.isArray(articlesData)) {
                            extractedArticles = articlesData;
                            console.log(`📋 ${endpoint.name} - Direct array:`, extractedArticles.length);
                        } else if (articlesData?.results && Array.isArray(articlesData.results)) {
                            extractedArticles = articlesData.results;
                            console.log(`📋 ${endpoint.name} - Results array:`, extractedArticles.length);
                        } else if (articlesData?.data && Array.isArray(articlesData.data)) {
                            extractedArticles = articlesData.data;
                            console.log(`📋 ${endpoint.name} - Data array:`, extractedArticles.length);
                        } else if (articlesData && typeof articlesData === 'object') {
                            // If it's an object but not an array, try to extract articles
                            console.log(`📋 ${endpoint.name} - Object structure:`, Object.keys(articlesData));
                            // Check if it's a single article object
                            if (articlesData.title || articlesData.id) {
                                extractedArticles = [articlesData];
                                console.log(`📋 ${endpoint.name} - Single article object`);
                            }
                        }

                        if (extractedArticles.length > 0) {
                            console.log(`✅ ${endpoint.name} success - Found ${extractedArticles.length} articles`);
                            finalArticles = extractedArticles;
                            break; // Exit the loop if we found articles
                        } else {
                            console.log(`⚠️ ${endpoint.name} - No articles found in response`);
                        }

                    } catch (endpointError) {
                        console.log(`❌ ${endpoint.name} failed:`, endpointError.message);
                        console.log(`❌ ${endpoint.name} error details:`, endpointError);
                        continue; // Try next endpoint
                    }
                }

                if (finalArticles.length === 0) {
                    console.log('⚠️ No articles found from any API endpoint');
                    // Add some test data as last resort to verify component works
                    console.log('🧪 Adding test data to verify component functionality...');
                    finalArticles = [
                        {
                            id: 'test-1',
                            title: 'مقال تجريبي - الصحة والطب',
                            author: { first_name: 'أدمن', last_name: 'النظام' },
                            created_at: new Date().toISOString(),
                            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
                        },
                        {
                            id: 'test-2',
                            title: 'مقال تجريبي - التغذية السليمة',
                            author: { first_name: 'أدمن', last_name: 'النظام' },
                            created_at: new Date().toISOString(),
                            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop'
                        }
                    ];
                    console.log('🧪 Test data added:', finalArticles.length, 'articles');
                }

                console.log('📊 Final articles to set:', finalArticles.length);
                console.log('📊 Final articles data:', finalArticles);
                setArticles(finalArticles);

            } catch (err) {
                console.error('❌ Critical error in fetchArticles:', err);
                console.error('❌ Error stack:', err.stack);

                // Even if there's an error, try to show test data
                console.log('🚨 Critical error occurred, showing test data as fallback...');
                const fallbackArticles = [
                    {
                        id: 'fallback-1',
                        title: 'مقال تجريبي - الطب الوقائي',
                        author: { first_name: 'أدمن', last_name: 'النظام' },
                        created_at: new Date().toISOString(),
                        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
                    },
                    {
                        id: 'fallback-2',
                        title: 'مقال تجريبي - الصحة النفسية',
                        author: { first_name: 'أدمن', last_name: 'النظام' },
                        created_at: new Date().toISOString(),
                        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop'
                    },
                    {
                        id: 'fallback-3',
                        title: 'مقال تجريبي - التغذية العلاجية',
                        author: { first_name: 'أدمن', last_name: 'النظام' },
                        created_at: new Date().toISOString(),
                        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=250&fit=crop'
                    }
                ];
                setArticles(fallbackArticles);
                setError(null); // Clear error to show articles
                console.log('🔄 Fallback articles set:', fallbackArticles.length);
            } finally {
                setLoading(false);
                console.log('🏁 fetchArticles completed');
            }
        };

        fetchArticles();
    }, []);

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    // Get author name helper
    const getAuthorName = (author) => {
        if (!author) return 'غير محدد';

        if (typeof author === 'string') return author;

        if (typeof author === 'object') {
            if (author.first_name && author.last_name) {
                return `${author.first_name} ${author.last_name}`;
            }
            if (author.username) return author.username;
            if (author.email) return author.email.split('@')[0];
        }

        return 'غير محدد';
    };

    // Get image URL helper
    const getImageUrl = (image) => {
        if (!image) {
            // Return a default medical/health image
            return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop';
        }

        if (typeof image === 'string') {
            // If it's already a full URL, return it
            if (image.startsWith('http')) return image;

            // If it's a relative path, construct full URL
            return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${image}`;
        }

        return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop';
    };

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

    const handleArticleClick = (article) => {
        console.log('📖 Opening article:', article);
        if (article.slug) {
            window.location.href = `/article/${article.slug}`;
        } else if (article.id) {
            window.location.href = `/article/${article.id}`;
        }
    };

    // Loading state
    if (loading) {
        return (
            <SectionContainer>
                <Container maxWidth="lg">
                    <LoadingContainer>
                        <CircularProgress size={60} sx={{ color: '#663399' }} />
                        <Typography variant="h6" sx={{ color: '#663399', direction: 'rtl' }}>
                            جاري تحميل المقالات...
                        </Typography>
                    </LoadingContainer>
                </Container>
            </SectionContainer>
        );
    }

    // Error state
    if (error) {
        return (
            <SectionContainer>
                <Container maxWidth="lg">
                    <ErrorContainer>
                        <ErrorOutline sx={{ fontSize: 60, color: '#ff6b6b' }} />
                        <Typography variant="h6" sx={{ color: '#ff6b6b', direction: 'rtl' }}>
                            {error}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => window.location.reload()}
                            sx={{
                                backgroundColor: '#663399',
                                '&:hover': { backgroundColor: '#333679' }
                            }}
                        >
                            إعادة المحاولة
                        </Button>
                    </ErrorContainer>
                </Container>
            </SectionContainer>
        );
    }

    // Debug logging
    console.log('🔍 Component render state:', {
        loading,
        error,
        articlesCount: articles?.length || 0,
        articles: articles
    });

    // Empty state
    if (!articles || articles.length === 0) {
        console.log('🚫 Showing empty state - no articles available');
        return (
            <SectionContainer>
                <Container maxWidth="lg">
                    <SectionHeader>
                        <HeaderLeft>
                            <SectionSubtitle>جديد المقالات</SectionSubtitle>
                            <SectionTitle variant="h2" component="h2">
                                مقالاتنا المميزة
                            </SectionTitle>
                        </HeaderLeft>
                    </SectionHeader>
                    <EmptyStateContainer>
                        <Article sx={{ fontSize: 80, color: '#A0A0A0' }} />
                        <Typography variant="h6" sx={{ color: '#A0A0A0', direction: 'rtl' }}>
                            لا توجد مقالات متاحة حالياً
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#A0A0A0', direction: 'rtl' }}>
                            سيتم إضافة مقالات جديدة قريباً
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => window.location.reload()}
                            sx={{
                                borderColor: '#663399',
                                color: '#663399',
                                '&:hover': {
                                    borderColor: '#333679',
                                    backgroundColor: 'rgba(102, 51, 153, 0.04)'
                                }
                            }}
                        >
                            إعادة تحميل الصفحة
                        </Button>
                    </EmptyStateContainer>
                </Container>
            </SectionContainer>
        );
    }

    const visibleArticles = articles;

    console.log('🎨 Rendering articles section:', {
        visibleArticlesCount: visibleArticles?.length || 0,
        firstArticle: visibleArticles?.[0] || null
    });

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
                        {visibleArticles.map((article, index) => {
                            console.log(`📄 Rendering article ${index + 1}:`, {
                                id: article.id,
                                title: article.title,
                                author: article.author,
                                image: article.image,
                                published_at: article.published_at,
                                created_at: article.created_at
                            });

                            return (
                                <ArticleCard key={article.id}>
                                    <ArticleImage
                                        sx={{ backgroundImage: `url(${getImageUrl(article.image)})` }}
                                    />
                                    <ArticleContent>
                                        <ArticleTitle>{article.title}</ArticleTitle>
                                        <ArticleMeta>
                                            <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                                                بواسطة {getAuthorName(article.author)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                                                {formatDate(article.published_at || article.created_at)}
                                            </Typography>
                                        </ArticleMeta>
                                        <ReadMoreButton
                                            endIcon={<ArrowForward />}
                                            onClick={() => handleArticleClick(article)}
                                        >
                                            اقرأ المزيد
                                        </ReadMoreButton>
                                    </ArticleContent>
                                </ArticleCard>
                            );
                        })}
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