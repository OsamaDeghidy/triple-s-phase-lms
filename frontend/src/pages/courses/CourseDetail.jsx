import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Chip,
    Avatar,
    Rating,
    CircularProgress,
    Tabs,
    Tab,
    IconButton,
    Card,
    CardContent,
    Alert,
    Dialog,
    DialogContent
} from '@mui/material';
import {
    Star as StarIcon,
    StarBorder,
    PeopleAltOutlined,
    PlayCircleOutline,
    DescriptionOutlined,
    BookmarkBorder,
    ArrowBack,
    ArrowForward,
    CheckCircle,
    Assignment as AssignmentIcon,
    InsertDriveFile as InsertDriveFileIcon,
    OndemandVideo as VideoIcon,
    Quiz as QuizIconFilled,
    Info as InfoIcon,
    VideoLibrary as VideoLibraryIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon
} from '@mui/icons-material';
import { styled, keyframes, alpha } from '@mui/material/styles';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CourseDetailBanner from '../../components/courses/CourseDetailBanner';
import CourseDetailCard from '../../components/courses/CourseDetailCard';
import CourseDetailBottomBar from '../../components/courses/CourseDetailBottomBar';
import CourseDescriptionTab from '../../components/courses/CourseDescriptionTab';
import CourseContentTab from '../../components/courses/CourseContentTab';
import CourseDemoTab from '../../components/courses/CourseDemoTab';
import CourseReviewsTab from '../../components/courses/CourseReviewsTab';
import { courseAPI, cartAPI, paymentAPI } from '../../services/courseService';
import { contentAPI } from '../../services/content.service';
import { assignmentsAPI } from '../../services/assignment.service';
import { examAPI } from '../../services/exam.service';
import { reviewsAPI } from '../../services/reviews.service';
import api from '../../services/api.service';
import { API_CONFIG } from '../../config/api.config';


// Animation keyframes
const float = keyframes`
  0% { 
    transform: translateY(0px) rotate(0deg);
    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1));
  }
  25% {
    transform: translateY(-8px) rotate(0.5deg);
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.15));
  }
  50% {
    transform: translateY(-12px) rotate(-0.5deg);
    filter: drop-shadow(0 12px 25px rgba(0,0,0,0.2));
  }
  75% {
    transform: translateY(-8px) rotate(0.5deg);
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.15));
  }
  100% { 
    transform: translateY(0px) rotate(0deg);
    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1));
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

// Animated background components
const FloatingShape = styled('div')({
    position: 'absolute',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #663399, #8B4B8C)',
    filter: 'blur(60px)',
    opacity: 0.2,
    zIndex: 1,
    animation: `${float} 15s ease-in-out infinite`,
    '&:nth-of-type(1)': {
        width: '300px',
        height: '300px',
        top: '-100px',
        right: '-100px',
        animationDelay: '0s',
    },
    '&:nth-of-type(2)': {
        width: '200px',
        height: '200px',
        bottom: '20%',
        right: '15%',
        animationDelay: '5s',
        background: 'linear-gradient(45deg, #663399, #9966CC)',
    },
    '&:nth-of-type(3)': {
        width: '250px',
        height: '250px',
        top: '30%',
        left: '15%',
        animationDelay: '7s',
        background: 'linear-gradient(45deg, #663399, #7B3F98)',
    },
});

const AnimatedBackground = styled('div')(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0d2e 100%)',
        zIndex: 1,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23663399\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        opacity: 0.4,
        zIndex: 2,
        animation: `${pulse} 15s ease-in-out infinite`,
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    marginBottom: theme.spacing(4),
    fontWeight: 700,
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        width: '80px',
        height: '4px',
        background: `linear-gradient(90deg, #333679 0%, #4DBFB3 100%)`,
        borderRadius: '2px',
    },
}));


// Skeleton animation keyframes
const pulseAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const SkeletonPulse = styled(Box)(({ theme }) => ({
    display: 'inline-block',
    animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
}));

const CourseSkeleton = () => (
    <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
            <Grid container spacing={4}>
                <Grid xs={12} lg={8}>
                    <SkeletonPulse variant="rectangular" width="100%" height={400} sx={{ mb: 3, borderRadius: 2 }} />
                    <Box sx={{ mb: 4 }}>
                        <SkeletonPulse variant="text" width="60%" height={40} sx={{ mb: 2 }} />
                        <SkeletonPulse variant="text" width="90%" height={24} sx={{ mb: 1 }} />
                        <SkeletonPulse variant="text" width="80%" height={24} sx={{ mb: 3 }} />
                        <SkeletonPulse variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
                    </Box>
                    <Tabs value={0} sx={{ mb: 3 }}>
                        {['Overview', 'Curriculum', 'Instructor', 'Reviews', 'FAQs'].map((tab) => (
                            <Tab key={tab} label={tab} sx={{ minWidth: 'auto' }} />
                        ))}
                    </Tabs>
                    <SkeletonPulse variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid xs={12} lg={4}>
                    <SkeletonPulse variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                </Grid>
            </Grid>
        </Container>
    </Box>
);

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [relatedCourses, setRelatedCourses] = useState([]);
    const [expandedModules, setExpandedModules] = useState({});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Review states
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);


    // Toggle module expansion
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Preview dialog handlers
    const handleClosePreview = () => setIsPreviewOpen(false);

    // Choose lesson icon by status/type
    const getLessonIcon = (lesson) => {
        if (lesson?.completed) {
            return <CheckCircle htmlColor="#333679" />;
        }
        if (lesson?.type === 'video') {
            return <VideoIcon htmlColor="#333679" />;
        }
        if (lesson?.type === 'article') {
            return <InsertDriveFileIcon htmlColor="#4DBFB3" />;
        }
        if (lesson?.type === 'quiz') {
            return <QuizIconFilled htmlColor="#333679" />;
        }
        if (lesson?.type === 'assignment') {
            return <AssignmentIcon htmlColor="#4DBFB3" />;
        }
        if (lesson?.type === 'exam') {
            return <QuizIcon htmlColor="#333679" />;
        }
        if (lesson?.type === 'file') {
            return <DownloadIcon htmlColor="#4DBFB3" />;
        }
        if (lesson?.type === 'project') {
            return <CodeIcon htmlColor="#333679" />;
        }
        if (lesson?.type === 'exercise') {
            return <AssignmentTurnedInIcon htmlColor="#4DBFB3" />;
        }
        if (lesson?.type === 'case-study') {
            return <InfoIcon htmlColor="#333679" />;
        }
        if (lesson?.isPreview) {
            return <PlayCircleOutline htmlColor="#333679" />;
        }
        return <DescriptionOutlined htmlColor="#333679" />;
    };


    // Initialize all modules as collapsed by default
    const initializeExpandedModules = (modules) => {
        const initialExpanded = {};
        if (Array.isArray(modules)) {
            modules.forEach(module => {
                if (module && module.id) {
                    initialExpanded[module.id] = false;
                }
            });
        }
        return initialExpanded;
    };

    // Load course data
    useEffect(() => {
        const fetchCourseData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching course data for ID:', id);

                // Fetch course details
                let courseData;
                try {
                    courseData = await courseAPI.getCourseById(id);
                    console.log('Course data from API:', courseData);
                } catch (error) {
                    // If course details require authentication, try to get basic info from public courses
                    if (error.response?.status === 401) {
                        console.log('Course details require authentication, fetching from public courses...');
                        try {
                            const publicCoursesResponse = await courseAPI.getCourses({ status: 'published' });
                            const publicCourses = publicCoursesResponse.results || publicCoursesResponse;
                            courseData = publicCourses.find(course => course.id === parseInt(id));

                            if (!courseData) {
                                throw new Error('Course not found in public courses');
                            }
                            console.log('Course data from public courses:', courseData);
                        } catch (publicError) {
                            console.error('Error fetching from public courses:', publicError);
                            throw error; // Re-throw original error
                        }
                    } else {
                        throw error;
                    }
                }

                // Fetch related courses
                let relatedCoursesData = [];
                try {
                    const relatedResponse = await courseAPI.getRelatedCourses(id);
                    relatedCoursesData = relatedResponse.results || relatedResponse || [];
                    console.log('Related courses data:', relatedCoursesData);
                } catch (error) {
                    console.warn('Could not fetch related courses:', error);
                    relatedCoursesData = [];
                }

                // Fetch course modules from content API (real data)
                let modulesData = [];
                let isUserEnrolled = false;

                // Only try to fetch modules if user is authenticated
                if (isAuthenticated) {
                    try {
                        console.log('Fetching modules from content API for course:', id);
                        const modulesResponse = await contentAPI.getModules(id);
                        console.log('Content API modules response:', modulesResponse);

                        // Handle different response formats
                        if (modulesResponse && typeof modulesResponse === 'object') {
                            if (Array.isArray(modulesResponse)) {
                                modulesData = modulesResponse;
                            } else if (modulesResponse.modules && Array.isArray(modulesResponse.modules)) {
                                modulesData = modulesResponse.modules;
                            } else if (modulesResponse.results && Array.isArray(modulesResponse.results)) {
                                modulesData = modulesResponse.results;
                            } else if (modulesResponse.data && Array.isArray(modulesResponse.data)) {
                                modulesData = modulesResponse.data;
                            } else {
                                modulesData = [];
                            }
                        } else {
                            modulesData = [];
                        }

                        console.log('Processed content modules data:', modulesData);

                        // If we got modules data, user is enrolled or content is public
                        if (modulesData.length > 0) {
                            isUserEnrolled = true;
                        } else {
                            // Try to get modules from course API as fallback
                            try {
                                const courseModulesResponse = await courseAPI.getCourseModules(id);
                                console.log('Course API modules response:', courseModulesResponse);

                                if (courseModulesResponse && typeof courseModulesResponse === 'object') {
                                    if (Array.isArray(courseModulesResponse)) {
                                        modulesData = courseModulesResponse;
                                    } else if (courseModulesResponse.modules && Array.isArray(courseModulesResponse.modules)) {
                                        modulesData = courseModulesResponse.modules;
                                    } else if (courseModulesResponse.results && Array.isArray(courseModulesResponse.results)) {
                                        modulesData = courseModulesResponse.results;
                                    }
                                }

                                if (modulesData.length > 0) {
                                    isUserEnrolled = true;
                                }
                            } catch (courseModulesError) {
                                console.warn('Could not fetch course modules from course API:', courseModulesError);
                                if (courseModulesError.response && courseModulesError.response.status === 403) {
                                    isUserEnrolled = false;
                                }
                            }
                        }
                    } catch (error) {
                        console.warn('Could not fetch modules from content API:', error);

                        // Try course API as fallback
                        try {
                            const courseModulesResponse = await courseAPI.getCourseModules(id);
                            console.log('Fallback course API modules response:', courseModulesResponse);

                            if (courseModulesResponse && typeof courseModulesResponse === 'object') {
                                if (Array.isArray(courseModulesResponse)) {
                                    modulesData = courseModulesResponse;
                                } else if (courseModulesResponse.modules && Array.isArray(courseModulesResponse.modules)) {
                                    modulesData = courseModulesResponse.modules;
                                } else if (courseModulesResponse.results && Array.isArray(courseModulesResponse.results)) {
                                    modulesData = courseModulesResponse.results;
                                }
                            }

                            if (modulesData.length > 0) {
                                isUserEnrolled = true;
                            }
                        } catch (courseModulesError) {
                            console.warn('Could not fetch course modules from course API:', courseModulesError);
                            if (courseModulesError.response && courseModulesError.response.status === 403) {
                                isUserEnrolled = false;
                            }
                            modulesData = [];
                        }
                    }
                }

                // Fetch lessons, assignments, quizzes, and exams for each module
                if (modulesData.length > 0) {
                    console.log('Fetching content for modules...');
                    for (let i = 0; i < modulesData.length; i++) {
                        const module = modulesData[i];
                        const moduleId = module.id;

                        // Fetch lessons
                        try {
                            const lessonsResponse = await contentAPI.getLessons({ moduleId: moduleId, courseId: id });
                            console.log(`Lessons for module ${moduleId}:`, lessonsResponse);

                            if (lessonsResponse && Array.isArray(lessonsResponse)) {
                                modulesData[i].lessons = lessonsResponse;
                            } else if (lessonsResponse && Array.isArray(lessonsResponse.results)) {
                                modulesData[i].lessons = lessonsResponse.results;
                            } else if (lessonsResponse && Array.isArray(lessonsResponse.data)) {
                                modulesData[i].lessons = lessonsResponse.data;
                            }
                        } catch (error) {
                            console.warn(`Could not fetch lessons for module ${moduleId}:`, error);
                            modulesData[i].lessons = [];
                        }

                        // Fetch assignments for this module
                        try {
                            const assignmentsResponse = await assignmentsAPI.getAssignments({
                                course: id,
                                module: moduleId
                            });
                            console.log(`Assignments for module ${moduleId}:`, assignmentsResponse);

                            if (assignmentsResponse && Array.isArray(assignmentsResponse)) {
                                modulesData[i].assignments = assignmentsResponse;
                            } else if (assignmentsResponse && Array.isArray(assignmentsResponse.results)) {
                                modulesData[i].assignments = assignmentsResponse.results;
                            } else if (assignmentsResponse && Array.isArray(assignmentsResponse.data)) {
                                modulesData[i].assignments = assignmentsResponse.data;
                            }
                        } catch (error) {
                            console.warn(`Could not fetch assignments for module ${moduleId}:`, error);
                            modulesData[i].assignments = [];
                        }

                        // Fetch quizzes for this module
                        try {
                            const quizzesResponse = await api.get(`/api/assignments/quizzes/`, {
                                params: { course: id, module: moduleId }
                            });
                            console.log(`Quizzes for module ${moduleId}:`, quizzesResponse.data);

                            if (quizzesResponse.data && Array.isArray(quizzesResponse.data)) {
                                modulesData[i].quizzes = quizzesResponse.data;
                            } else if (quizzesResponse.data && Array.isArray(quizzesResponse.data.results)) {
                                modulesData[i].quizzes = quizzesResponse.data.results;
                            }
                        } catch (error) {
                            console.warn(`Could not fetch quizzes for module ${moduleId}:`, error);
                            modulesData[i].quizzes = [];
                        }

                        // Fetch exams for this module
                        try {
                            const examsResponse = await examAPI.getExams({
                                course: id,
                                module: moduleId
                            });
                            console.log(`Exams for module ${moduleId}:`, examsResponse);

                            if (examsResponse && Array.isArray(examsResponse)) {
                                modulesData[i].exams = examsResponse;
                            } else if (examsResponse && Array.isArray(examsResponse.results)) {
                                modulesData[i].exams = examsResponse.results;
                            } else if (examsResponse && Array.isArray(examsResponse.data)) {
                                modulesData[i].exams = examsResponse.data;
                            }
                        } catch (error) {
                            console.warn(`Could not fetch exams for module ${moduleId}:`, error);
                            modulesData[i].exams = [];
                        }
                    }
                }

                // Fetch course reviews from reviews API (real data)
                let reviewsData = [];
                let ratingStats = null;

                // Only try to fetch reviews if user is authenticated
                if (isAuthenticated) {
                    try {
                        console.log('Fetching reviews from reviews API for course:', id);
                        const reviewsResponse = await reviewsAPI.getCourseReviews(id);
                        console.log('Reviews API response:', reviewsResponse);

                        if (reviewsResponse && reviewsResponse.results) {
                            reviewsData = reviewsResponse.results;
                        } else if (Array.isArray(reviewsResponse)) {
                            reviewsData = reviewsResponse;
                        } else {
                            reviewsData = [];
                        }

                        console.log('Processed reviews data:', reviewsData);
                    } catch (error) {
                        console.warn('Could not fetch reviews from reviews API:', error);

                        // Try course API as fallback
                        try {
                            const courseReviewsResponse = await courseAPI.getCourseReviews(id);
                            reviewsData = courseReviewsResponse.results || courseReviewsResponse || [];
                            console.log('Fallback course reviews data:', reviewsData);
                        } catch (courseReviewsError) {
                            console.warn('Could not fetch course reviews from course API:', courseReviewsError);
                            reviewsData = [];
                        }
                    }
                }

                // Fetch course rating statistics (only if authenticated)
                if (isAuthenticated) {
                    try {
                        const ratingResponse = await reviewsAPI.getCourseRating(id);
                        console.log('Course rating stats:', ratingResponse);
                        ratingStats = ratingResponse;
                    } catch (error) {
                        console.warn('Could not fetch course rating stats:', error);
                        ratingStats = null;
                    }
                }

                // Transform API data to match expected format
                const transformedCourse = transformCourseData(courseData, modulesData, reviewsData, isUserEnrolled, ratingStats);
                console.log('Transformed course:', transformedCourse);
                console.log('Transformed course modules:', transformedCourse.modules);

                setCourse(transformedCourse);
                setRelatedCourses(relatedCoursesData);
                setExpandedModules(initializeExpandedModules(transformedCourse.modules));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course data:', error);
                let errorMessage = 'فشل في تحميل بيانات الدورة';

                if (error.response) {
                    // Server responded with error status
                    if (error.response.status === 404) {
                        errorMessage = 'الدورة غير موجودة';
                    } else if (error.response.status === 403) {
                        errorMessage = 'ليس لديك صلاحية لعرض هذه الدورة';
                    } else if (error.response.status === 401) {
                        // Don't show login required message for public course details
                        if (!isAuthenticated) {
                            errorMessage = 'هذه الدورة غير متاحة للعرض العام. يرجى تسجيل الدخول لعرض التفاصيل الكاملة.';
                        } else {
                            errorMessage = 'يرجى تسجيل الدخول لعرض هذه الدورة';
                        }
                    } else if (error.response.data?.detail) {
                        errorMessage = error.response.data.detail;
                    } else if (error.response.data?.error) {
                        errorMessage = error.response.data.error;
                    } else if (error.response.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.request) {
                    // Network error
                    errorMessage = 'خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت.';
                } else {
                    // Other error
                    errorMessage = error.message || 'حدث خطأ غير متوقع';
                }

                setError(errorMessage);
                setLoading(false);
            }
        };

        if (id) {
            fetchCourseData();
        }
    }, [id, isAuthenticated]);

    // Transform API data to match expected format
    const transformCourseData = (apiCourse, modulesData = [], reviewsData = [], isUserEnrolled = false, ratingStats = null) => {
        console.log('Transforming course data:', apiCourse);

        // Handle image URLs
        const getImageUrl = (imageField) => {
            if (!imageField) return 'https://source.unsplash.com/random/1600x500?programming,react';
            if (typeof imageField === 'string') {
                // Check if it's already a full URL
                if (imageField.startsWith('http')) return imageField;
                // If it's a relative path, prepend the base URL
                return `${API_CONFIG.baseURL}${imageField}`;
            }
            if (imageField.url) return imageField.url;
            return 'https://source.unsplash.com/random/1600x500?programming,react';
        };

        // Handle file URLs (e.g., PDFs)
        const getFileUrl = (fileField) => {
            if (!fileField) return null;
            if (typeof fileField === 'string') {
                if (fileField.startsWith('http')) return fileField;
                return `${API_CONFIG.baseURL}${fileField}`;
            }
            if (fileField.url) return fileField.url;
            return null;
        };

        // Handle price calculations
        const price = parseFloat(apiCourse.price) || 0;
        const discountPrice = parseFloat(apiCourse.discount_price) || 0;
        const discount = discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

        // Calculate total lessons and hours from modules
        const totalLessons = Array.isArray(modulesData) ? modulesData.reduce((total, module) => {
            return total + (Array.isArray(module.lessons || module.content) ? (module.lessons || module.content).length : 0);
        }, 0) : 0;

        const totalHours = Math.round(totalLessons * 0.5); // Estimate 30 minutes per lesson

        // Transform reviews data with real API data
        const transformedReviews = Array.isArray(reviewsData) ? reviewsData.map(review => ({
            id: review.id,
            user: {
                name: review.user_name || review.user?.username || review.user?.first_name || review.user?.name || 'مستخدم',
                avatar: getImageUrl(review.user_image || review.user?.profile?.avatar || review.user?.profile_pic || review.avatar),
                id: review.user?.id || null,
            },
            rating: review.rating || 5,
            date: review.created_at ? new Date(review.created_at).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : 'مؤخراً',
            title: review.title || 'تقييم ممتاز',
            content: review.review_text || review.content || review.comment || review.text || '',
            likes: review.like_count || review.helpful_count || review.likes_count || 0,
            isLiked: review.is_liked_by_user || review.is_liked || false,
            isOwner: review.is_owner || false,
            isApproved: review.is_approved !== false,
            ...review
        })) : [];

        // Use rating statistics if available
        const courseRating = ratingStats?.average_rating || apiCourse.average_rating || apiCourse.rating || 4.8;
        const totalReviews = ratingStats?.review_count || ratingStats?.total_reviews || transformedReviews.length;

        return {
            id: apiCourse.id,
            title: apiCourse.title || apiCourse.name || '',
            subtitle: apiCourse.subtitle || apiCourse.short_description || apiCourse.description?.substring(0, 100) || '',
            description: apiCourse.description || '',
            longDescription: apiCourse.description || apiCourse.long_description || apiCourse.content || '',
            instructor: apiCourse.instructors?.[0]?.name || apiCourse.instructor?.name || apiCourse.teacher?.name || 'مدرس محترف',
            instructorTitle: apiCourse.instructors?.[0]?.bio || apiCourse.instructor?.title || apiCourse.teacher?.title || 'مدرس محترف',
            instructorBio: apiCourse.instructors?.[0]?.bio || apiCourse.instructor?.bio || apiCourse.teacher?.bio || '',
            instructorAvatar: getImageUrl(apiCourse.instructors?.[0]?.profile_pic || apiCourse.instructor?.profile_pic || apiCourse.teacher?.profile_pic),
            instructorRating: apiCourse.instructor?.rating || apiCourse.teacher?.rating || 4.9,
            instructorStudents: apiCourse.instructor?.students_count || apiCourse.teacher?.students_count || apiCourse.total_enrollments || 0,
            instructorCourses: apiCourse.instructor?.courses_count || apiCourse.teacher?.courses_count || 8,
            bannerImage: getImageUrl(apiCourse.image || apiCourse.banner_image || apiCourse.cover_image),
            thumbnail: getImageUrl(apiCourse.image || apiCourse.thumbnail || apiCourse.cover_image),
            category: apiCourse.category?.name || apiCourse.category || 'التدريب الإلكتروني',
            level: apiCourse.level || 'مبتدئ',
            duration: apiCourse.duration || `${totalHours} ساعة`,
            totalHours: totalHours,
            lectures: totalLessons,
            resources: apiCourse.resources_count || apiCourse.materials_count || 45,
            students: apiCourse.total_enrollments || apiCourse.students_count || apiCourse.enrollments_count || 0,
            rating: courseRating,
            courseReviews: transformedReviews,
            price: price,
            originalPrice: discountPrice > 0 ? price : price,
            discount: discount,
            isBestseller: apiCourse.is_featured || apiCourse.is_bestseller || false,
            lastUpdated: apiCourse.updated_at ? new Date(apiCourse.updated_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }) : 'مؤخراً',
            language: apiCourse.language || 'العربية',
            captions: apiCourse.captions || ['العربية', 'English'],
            features: [
                'وصول مدى الحياة',
                'الوصول عبر الجوال والتلفاز',
                'شهادة إتمام الدورة',
                'ضمان استرداد الأموال خلال 30 يوم',
                'موارد قابلة للتحميل',
                'واجبات واختبارات'
            ],
            isEnrolled: apiCourse.is_enrolled || false,
            planPdfUrl: getFileUrl(apiCourse.timeline_pdf || apiCourse.plan_pdf || apiCourse.plan || apiCourse.syllabus_pdf),
            enrichmentPdfUrl: getFileUrl(apiCourse.enrichment_pdf || apiCourse.resources_pdf || apiCourse.materials_pdf),
            requirements: apiCourse.requirements || apiCourse.prerequisites || [],
            whoIsThisFor: apiCourse.who_is_this_for || apiCourse.target_audience || apiCourse.audience || [],
            modules: transformModulesData(modulesData, apiCourse, isUserEnrolled),
            curriculum: [
                { title: 'البداية', duration: '2h 45m', lectures: 5, completed: 2 },
                { title: 'أنماط React المتقدمة', duration: '4h 15m', lectures: 6, completed: 0 },
                { title: 'إدارة الحالة مع Redux', duration: '5h 30m', lectures: 6, completed: 0 },
                { title: 'تحسين الأداء', duration: '3h 45m', lectures: 5, completed: 0 },
            ],
            faqs: apiCourse.faqs || [
                {
                    question: 'كيف يمكنني الوصول إلى دورتي بعد الشراء؟',
                    answer: 'بعد الشراء، يمكنك الوصول إلى دورتك فوراً عن طريق الذهاب إلى "تعلمي" في حسابك. ستكون الدورة متاحة هناك للوصول مدى الحياة.'
                },
                {
                    question: 'هل تقدمون شهادة إتمام؟',
                    answer: 'نعم، ستحصل على شهادة إتمام بمجرد إنهاء جميع محتوى الدورة واجتياز أي تقييمات مطلوبة.'
                },
                {
                    question: 'هل يمكنني تحميل فيديوهات الدورة؟',
                    answer: 'لأسباب حقوق النشر والترخيص، لا نسمح بتحميل فيديوهات الدورة. ومع ذلك، يمكنك الوصول إليها في أي وقت من خلال منصتنا مع اتصال بالإنترنت.'
                },
                {
                    question: 'ماذا لو احتجت إلى مساعدة أثناء الدورة؟',
                    answer: 'يمكنك طرح الأسئلة في منطقة مناقشة الدورة حيث يمكن للمدرب والطلاب الآخرين المساعدة. للمشكلات التقنية، فريق الدعم لدينا متاح على مدار الساعة طوال أيام الأسبوع.'
                },
                {
                    question: 'هل هناك ضمان استرداد الأموال؟',
                    answer: 'نعم، نقدم ضمان استرداد الأموال لمدة 30 يوماً إذا لم تكن راضياً عن الدورة لأي سبب.'
                }
            ]
        };
    };

    // Transform modules data
    const transformModulesData = (modulesData, courseData, isUserEnrolled = false) => {
        console.log('transformModulesData called with:', { modulesData, courseData, isUserEnrolled });

        // Ensure modulesData is an array
        if (!modulesData || !Array.isArray(modulesData)) {
            console.log('modulesData is not an array, using empty array');
            modulesData = [];
        }

        // Check if modulesData is empty or has no lessons
        const hasValidModules = modulesData.length > 0 && modulesData.some(module => {
            const lessons = module.lessons || module.content || module.lectures || [];
            return Array.isArray(lessons) && lessons.length > 0;
        });

        // If user is not enrolled or no valid modules, show preview modules
        if (!isUserEnrolled || !hasValidModules) {
            console.log('User not enrolled or no valid modules, showing preview modules');

            // Get course title for better preview content
            const courseTitle = courseData?.title || courseData?.name || 'الدورة';
            const isReactCourse = courseTitle.toLowerCase().includes('react');
            const isWebCourse = courseTitle.toLowerCase().includes('web') || courseTitle.toLowerCase().includes('frontend');
            const isBackendCourse = courseTitle.toLowerCase().includes('backend') || courseTitle.toLowerCase().includes('django') || courseTitle.toLowerCase().includes('python');

            // Return preview modules based on course type
            return [
                {
                    id: 1,
                    title: `مقدمة إلى ${isReactCourse ? 'React' : isWebCourse ? 'تطوير الويب' : isBackendCourse ? 'تطوير الخلفية' : 'الدورة'}`,
                    description: 'إعداد بيئة التطوير وفهم المفاهيم الأساسية',
                    duration: '2h 45m',
                    lessons: [
                        { id: 1, title: `مقدمة إلى ${isReactCourse ? 'React' : isWebCourse ? 'تطوير الويب' : isBackendCourse ? 'تطوير الخلفية' : 'الدورة'}`, duration: '15:30', isPreview: true, completed: false, type: 'video' },
                        { id: 2, title: 'إعداد بيئة التطوير', duration: '12:45', isPreview: true, completed: false, type: 'video' },
                        { id: 3, title: 'المفاهيم الأساسية', duration: '18:20', isPreview: false, completed: false, type: 'video' },
                        { id: 4, title: 'إعداد المشروع والتهيئة', duration: '22:10', isPreview: false, completed: false, type: 'video' },
                        { id: 5, title: 'موارد الدورة والأدوات', duration: '08:30', isPreview: true, completed: false, type: 'article' },
                        { id: 6, title: 'واجب الوحدة الأولى: مشروع تطبيقي', duration: '45:00', isPreview: false, completed: false, type: 'assignment' },
                        { id: 7, title: 'كويز المفاهيم الأساسية', duration: '20:00', isPreview: false, completed: false, type: 'quiz' },
                    ],
                },
                {
                    id: 2,
                    title: 'المفاهيم المتقدمة',
                    description: 'إتقان المفاهيم المتقدمة وأفضل الممارسات',
                    duration: '4h 15m',
                    lessons: [
                        { id: 8, title: 'المفاهيم المتقدمة - الجزء الأول', duration: '22:10', isPreview: true, completed: false, type: 'video' },
                        { id: 9, title: 'المفاهيم المتقدمة - الجزء الثاني', duration: '18:30', isPreview: true, completed: false, type: 'video' },
                        { id: 10, title: 'التطبيق العملي', duration: '20:15', isPreview: false, completed: false, type: 'video' },
                        { id: 11, title: 'أفضل الممارسات', duration: '25:40', isPreview: false, completed: false, type: 'video' },
                        { id: 12, title: 'التطبيقات العملية', duration: '28:20', isPreview: false, completed: false, type: 'video' },
                        { id: 13, title: 'تمرين عملي: تطبيق المفاهيم', duration: '15:00', isPreview: false, completed: false, type: 'exercise' },
                        { id: 14, title: 'واجب الوحدة الثانية: مشروع متقدم', duration: '60:00', isPreview: false, completed: false, type: 'assignment' },
                        { id: 15, title: 'كويز المفاهيم المتقدمة', duration: '25:00', isPreview: false, completed: false, type: 'quiz' },
                    ],
                },
                {
                    id: 3,
                    title: 'المشاريع العملية',
                    description: 'تطبيق المفاهيم في مشاريع حقيقية',
                    duration: '5h 30m',
                    lessons: [
                        { id: 16, title: 'مقدمة المشاريع العملية', duration: '25:20', isPreview: true, completed: false, type: 'video' },
                        { id: 17, title: 'تطوير المشروع الأول', duration: '19:45', isPreview: false, completed: false, type: 'video' },
                        { id: 18, title: 'تطوير المشروع الثاني', duration: '21:30', isPreview: true, completed: false, type: 'video' },
                        { id: 19, title: 'اختبار وتحسين المشاريع', duration: '28:15', isPreview: false, completed: false, type: 'video' },
                        { id: 20, title: 'نشر المشاريع', duration: '17:50', isPreview: false, completed: false, type: 'video' },
                        { id: 21, title: 'مشروع نهائي شامل', duration: '45:00', isPreview: false, completed: false, type: 'project' },
                        { id: 22, title: 'واجب الوحدة الثالثة: مشروع شامل', duration: '90:00', isPreview: false, completed: false, type: 'assignment' },
                        { id: 23, title: 'امتحان منتصف الدورة', duration: '60:00', isPreview: false, completed: false, type: 'exam' },
                    ],
                },
                {
                    id: 4,
                    title: 'التحسين والتطوير',
                    description: 'تحسين الأداء والتطوير المستمر',
                    duration: '3h 45m',
                    lessons: [
                        { id: 24, title: 'تحسين الأداء', duration: '20:10', isPreview: true, completed: false, type: 'video' },
                        { id: 25, title: 'أدوات التطوير', duration: '18:30', isPreview: false, completed: false, type: 'video' },
                        { id: 26, title: 'اختبار الجودة', duration: '25:45', isPreview: false, completed: false, type: 'video' },
                        { id: 27, title: 'أدوات المراقبة', duration: '22:15', isPreview: false, completed: false, type: 'video' },
                        { id: 28, title: 'دراسة حالة شاملة', duration: '30:00', isPreview: false, completed: false, type: 'case-study' },
                        { id: 29, title: 'واجب الوحدة الرابعة: تحسين شامل', duration: '75:00', isPreview: false, completed: false, type: 'assignment' },
                        { id: 30, title: 'كويز التحسين والتطوير', duration: '30:00', isPreview: false, completed: false, type: 'quiz' },
                    ],
                },
            ];
        }

        const result = modulesData.map((module, index) => {
            // Transform assignments
            const transformAssignments = (assignments) => {
                if (!Array.isArray(assignments)) return [];

                return assignments.map((assignment, aIndex) => {
                    return {
                        id: `assignment_${assignment.id || aIndex + 1}`,
                        title: assignment.title || `واجب ${aIndex + 1}`,
                        duration: '45:00', // Default assignment duration
                        type: 'assignment',
                        isPreview: false,
                        completed: false,
                        description: assignment.description || '',
                        dueDate: assignment.due_date,
                        points: assignment.points || 100,
                        hasQuestions: assignment.has_questions || false,
                        hasFileUpload: assignment.has_file_upload || false,
                        order: assignment.order || aIndex + 1,
                        isActive: assignment.is_active !== false,
                        ...assignment
                    };
                });
            };

            // Transform quizzes
            const transformQuizzes = (quizzes) => {
                if (!Array.isArray(quizzes)) return [];

                return quizzes.map((quiz, qIndex) => {
                    return {
                        id: `quiz_${quiz.id || qIndex + 1}`,
                        title: quiz.title || `كويز ${qIndex + 1}`,
                        duration: quiz.time_limit ? `${quiz.time_limit}:00` : '20:00',
                        type: 'quiz',
                        isPreview: false,
                        completed: false,
                        description: quiz.description || '',
                        passMark: quiz.pass_mark || 60,
                        totalQuestions: quiz.get_total_questions ? quiz.get_total_questions() : 0,
                        order: quiz.order || qIndex + 1,
                        isActive: quiz.is_active !== false,
                        ...quiz
                    };
                });
            };

            // Transform exams
            const transformExams = (exams) => {
                if (!Array.isArray(exams)) return [];

                return exams.map((exam, eIndex) => {
                    return {
                        id: `exam_${exam.id || eIndex + 1}`,
                        title: exam.title || `امتحان ${eIndex + 1}`,
                        duration: exam.time_limit ? `${exam.time_limit}:00` : '60:00',
                        type: 'exam',
                        isPreview: false,
                        completed: false,
                        description: exam.description || '',
                        passMark: exam.pass_mark || 60,
                        isFinal: exam.is_final || false,
                        order: exam.order || eIndex + 1,
                        isActive: exam.is_active !== false,
                        ...exam
                    };
                });
            };

            // Transform lessons with better type detection for real API data
            const transformLessons = (lessons) => {
                if (!Array.isArray(lessons)) return [];

                return lessons.map((lesson, lIndex) => {
                    // Determine lesson type based on lesson_type field from API
                    let lessonType = lesson.lesson_type || lesson.type || 'video';

                    // Enhanced type detection for Arabic and English content
                    const title = lesson.title?.toLowerCase() || lesson.name?.toLowerCase() || '';

                    if (title.includes('واجب') || title.includes('assignment') || title.includes('homework')) {
                        lessonType = 'assignment';
                    } else if (title.includes('كويز') || title.includes('quiz') || title.includes('test')) {
                        lessonType = 'quiz';
                    } else if (title.includes('امتحان') || title.includes('exam') || title.includes('final')) {
                        lessonType = 'exam';
                    } else if (title.includes('مقال') || title.includes('article') || title.includes('text')) {
                        lessonType = 'article';
                    } else if (title.includes('ملف') || title.includes('file') || title.includes('document')) {
                        lessonType = 'file';
                    } else if (title.includes('مشروع') || title.includes('project')) {
                        lessonType = 'project';
                    } else if (title.includes('تمرين') || title.includes('exercise') || title.includes('practice')) {
                        lessonType = 'exercise';
                    } else if (title.includes('دراسة') || title.includes('case') || title.includes('study')) {
                        lessonType = 'case-study';
                    }

                    // Convert duration from minutes to MM:SS format
                    const formatDuration = (minutes) => {
                        if (!minutes) return '15:00';
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `${mins}:00`;
                    };

                    return {
                        id: lesson.id || lIndex + 1,
                        title: lesson.title || lesson.name || `الدرس ${lIndex + 1}`,
                        duration: formatDuration(lesson.duration_minutes || lesson.duration),
                        type: lessonType,
                        isPreview: lesson.is_free || lesson.is_preview || lesson.isPreview || false,
                        completed: lesson.completed || lesson.is_completed || false,
                        description: lesson.description || '',
                        videoUrl: lesson.video_url || lesson.videoUrl || null,
                        fileUrl: lesson.file_url || lesson.fileUrl || null,
                        content: lesson.content || '',
                        difficulty: lesson.difficulty || 'beginner',
                        order: lesson.order || lIndex + 1,
                        ...lesson
                    };
                });
            };

            // Get lessons, assignments, quizzes, and exams from various possible field names
            const lessons = module.lessons || module.content || module.lectures || [];
            const assignments = module.assignments || [];
            const quizzes = module.quizzes || [];
            const exams = module.exams || [];

            console.log(`Module ${module.id || index + 1}:`, {
                lessons: lessons.length,
                assignments: assignments.length,
                quizzes: quizzes.length,
                exams: exams.length
            });

            // Transform all content types
            const transformedLessons = transformLessons(lessons);
            const transformedAssignments = transformAssignments(assignments);
            const transformedQuizzes = transformQuizzes(quizzes);
            const transformedExams = transformExams(exams);

            // Combine all content and sort by order
            const allContent = [
                ...transformedLessons,
                ...transformedAssignments,
                ...transformedQuizzes,
                ...transformedExams
            ].sort((a, b) => (a.order || 0) - (b.order || 0));

            // If no content found, add some default content
            if (allContent.length === 0) {
                console.log(`No content found for module ${module.id || index + 1}, adding default content`);
                allContent.push(
                    { id: 1, title: 'مقدمة إلى الوحدة', duration: '15:00', isPreview: true, completed: false, type: 'video', order: 1 },
                    { id: 2, title: 'واجب الوحدة', duration: '45:00', isPreview: false, completed: false, type: 'assignment', order: 2 },
                    { id: 3, title: 'كويز الوحدة', duration: '20:00', isPreview: false, completed: false, type: 'quiz', order: 3 }
                );
            }

            // Convert module duration from seconds to readable format
            const formatModuleDuration = (seconds) => {
                if (!seconds) return '1h 00m';
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            };

            return {
                id: module.id || index + 1,
                title: module.name || module.title || `الوحدة ${index + 1}`,
                description: module.description || '',
                duration: formatModuleDuration(module.video_duration || module.duration),
                lessons: allContent, // Now includes lessons, assignments, quizzes, and exams
                order: module.order || index + 1,
                status: module.status || 'published',
                isActive: module.is_active !== false
            };
        });

        console.log('transformModulesData result:', result);
        return result;
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Review handlers
    const handleReviewFormChange = (field, value) => {
        setReviewForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitReview = async () => {
        if (!reviewForm.comment.trim()) {
            alert('يرجى كتابة تعليق للتقييم');
            return;
        }

        try {
            setSubmittingReview(true);

            // Transform data to match API expectations
            const reviewData = {
                rating: reviewForm.rating,
                review_text: reviewForm.comment
            };

            console.log('=== REVIEW SUBMISSION DEBUG ===');
            console.log('Original reviewForm:', reviewForm);
            console.log('Transformed reviewData:', reviewData);
            console.log('Course ID:', id);
            console.log('================================');

            const response = await reviewsAPI.createReview(id, reviewData);
            console.log('Review submitted successfully:', response);

            // Show success message
            alert('تم إضافة تقييمك بنجاح!');

            // Reset form and close
            setReviewForm({ rating: 5, comment: '' });
            setShowReviewForm(false);

            // Refresh course data to show new review
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
            let errorMessage = 'فشل في إضافة التقييم';

            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = 'يجب أن تكون مسجلاً في الدورة لتتمكن من تقييمها';
                } else if (error.response.status === 400) {
                    errorMessage = error.response.data?.error || 'بيانات التقييم غير صحيحة';
                } else if (error.response.data?.error) {
                    errorMessage = error.response.data.error;
                }
            }

            alert(errorMessage);
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleLikeReview = async (reviewId) => {
        try {
            console.log('Liking review:', reviewId);
            const response = await reviewsAPI.likeReview(reviewId);
            console.log('Like response:', response);

            // Update the specific review's like status without reloading
            setCourse(prevData => ({
                ...prevData,
                reviews: prevData.reviews.map(review =>
                    review.id === reviewId
                        ? {
                            ...review,
                            likes: response.liked ? review.likes + 1 : review.likes - 1,
                            isLiked: response.liked
                        }
                        : review
                )
            }));
        } catch (error) {
            console.error('Error liking review:', error);
            alert('فشل في إعجاب التقييم');
        }
    };


    // Handle adding course to cart
    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true);
            // Add course to cart via API
            const response = await cartAPI.addToCart(course.id);
            console.log('Added to cart:', response);

            // Show success message
            alert('تم إضافة الدورة إلى السلة بنجاح!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            let errorMessage = 'حدث خطأ أثناء إضافة الدورة إلى السلة';

            if (error.response) {
                if (error.response.data?.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }

            alert(errorMessage);
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Show loading skeleton while loading
    if (loading) {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header />
                <CourseSkeleton />
                <Box sx={{ mt: 'auto' }}>
                    <Footer />
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        خطأ في تحميل الدورة
                    </Typography>
                    <Typography variant="body1">
                        {error}
                    </Typography>
                </Alert>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {!isAuthenticated && error.includes('تسجيل الدخول') && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            component={Link}
                            to="/login"
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                background: 'linear-gradient(45deg, #333679, #1a6ba8)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1a6ba8, #333679)',
                                }
                            }}
                        >
                            تسجيل الدخول
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => window.location.reload()}
                        startIcon={<ArrowBack />}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        حاول مرة أخرى
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/courses')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        تصفح الدورات
                    </Button>
                </Box>
            </Container>
        );
    }

    if (!course) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Box mb={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        الدورة غير موجودة
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        الدورة التي تبحث عنها غير موجودة أو تم حذفها.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/courses')}
                    startIcon={<ArrowBack />}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}
                >
                    تصفح جميع الدورات
                </Button>
            </Container>
        );
    }

    const totalLessons = Array.isArray(course.modules) ? course.modules.reduce((total, module) => total + (Array.isArray(module.lessons) ? module.lessons.length : 0), 0) : 0;
    const completedLessons = Array.isArray(course.modules) ? course.modules.flatMap(m => Array.isArray(m.lessons) ? m.lessons : []).filter(l => l.completed).length : 0;
    const progress = Math.round((completedLessons / totalLessons) * 100) || 0;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <AnimatedBackground>
                <FloatingShape />
                <FloatingShape style={{ width: '200px', height: '200px', bottom: '20%', right: '15%', animationDelay: '5s' }} />
                <FloatingShape style={{ width: '250px', height: '250px', top: '30%', left: '15%', animationDelay: '7s' }} />
            </AnimatedBackground>
            {/* Header */}
            <Header />

            {/* Course Banner */}
            <CourseDetailBanner
                course={course}
            />

            {/* Course Detail Card with Image */}
            <CourseDetailCard
                course={course}
                isAddingToCart={isAddingToCart}
                handleAddToCart={handleAddToCart}
            />

            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onClose={handleClosePreview} maxWidth="md" fullWidth>
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                        <Box
                            component="iframe"
                            src={course?.previewUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                            title="Course Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            sx={{
                                border: 0,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Main Content - Single Column Layout - Right Aligned */}
            <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
                <Container maxWidth="lg" sx={{ py: 0, px: { xs: 2, sm: 3, md: 4 } }}>
                    {/* Single Column Layout - All components start from right */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: '1200px',
                        margin: '0 auto',
                        direction: 'rtl' // Right to left direction
                    }}>
                        {/* Navigation Tabs */}
                        <Box>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{
                                    '& .MuiTab-root': {
                                        minHeight: 50,
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        backgroundColor: '#f8f9fa',
                                        color: '#6c757d',
                                        borderTopLeftRadius: '8px',
                                        borderTopRightRadius: '8px',
                                        borderBottom: 'none',
                                        '&.Mui-selected': {
                                            color: '#ffffff',
                                            backgroundColor: '#495057',
                                            fontWeight: 600
                                        },
                                        '&:not(:last-child)': {
                                            marginRight: '2px'
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        display: 'none'
                                    }
                                }}
                            >
                                <Tab
                                    label="الوصف"
                                    icon={<DescriptionOutlined sx={{ fontSize: 18, mr: 1 }} />}
                                    iconPosition="start"
                                />
                                <Tab
                                    label="محتوى الدورة"
                                    icon={<VideoLibraryIcon sx={{ fontSize: 18, mr: 1 }} />}
                                    iconPosition="start"
                                />
                                <Tab
                                    label="العرض التوضيحي"
                                    icon={<PlayCircleOutline sx={{ fontSize: 18, mr: 1 }} />}
                                    iconPosition="start"
                                />
                                <Tab
                                    label="التقييمات"
                                    icon={<StarIcon sx={{ fontSize: 18, mr: 1 }} />}
                                    iconPosition="start"
                                />
                            </Tabs>
                        </Box>

                        {/* Tab Content */}
                        <Box>
                            {tabValue === 0 && (
                                <CourseDescriptionTab
                                    course={course}
                                    totalLessons={totalLessons}
                                />
                            )}

                            {tabValue === 1 && (
                                <CourseContentTab
                                    course={course}
                                    totalLessons={totalLessons}
                                    expandedModules={expandedModules}
                                    toggleModule={toggleModule}
                                    getLessonIcon={getLessonIcon}
                                />
                            )}

                            {tabValue === 2 && (
                                <CourseDemoTab
                                    course={course}
                                />
                            )}

                            {tabValue === 3 && (
                                <CourseReviewsTab
                                    course={course}
                                    setShowReviewForm={setShowReviewForm}
                                    handleLikeReview={handleLikeReview}
                                />
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>



            {/* Related Courses Section */}
            {Array.isArray(relatedCourses) && relatedCourses.length > 0 && (
                <Container maxWidth="lg" sx={{ pt: 1, pb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
                    <Box sx={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        direction: 'rtl' // Right to left direction
                    }}>
                        <Box sx={{ mb: 4 }}>
                            <SectionTitle variant="h4" component="h2" gutterBottom>
                                الدورات ذات الصلة
                            </SectionTitle>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                                إخترنا لك مجموعة من الدورات التي قد تعجبك
                            </Typography>
                        </Box>

                        {/* Grid Container - 3 cards side by side */}
                        <Grid container spacing={3} justifyContent="flex-start">
                            {Array.isArray(relatedCourses) ? relatedCourses.slice(0, 3).map((relatedCourse) => (
                                <Grid key={relatedCourse.id} xs={12} sm={6} lg={4}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            boxShadow: '0 6px 20px rgba(14, 81, 129, 0.08)',
                                            border: '1px solid',
                                            borderColor: 'rgba(14, 81, 129, 0.08)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
                                            backdropFilter: 'blur(10px)',
                                            maxWidth: '400px',
                                            mx: 'auto',
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.02)',
                                                boxShadow: '0 15px 35px rgba(14, 81, 129, 0.15)',
                                                borderColor: 'rgba(14, 81, 129, 0.2)',
                                            },
                                        }}
                                        onClick={() => navigate(`/courses/${relatedCourse.id}`)}
                                    >
                                        {/* Course Image with Overlay */}
                                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                            <Box sx={{
                                                width: '100%',
                                                height: 180,
                                                background: 'linear-gradient(135deg, #333679 0%, #4DBFB3 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                            }}>
                                                <img
                                                    src={relatedCourse.image || relatedCourse.thumbnail || 'https://source.unsplash.com/random/400x200?programming'}
                                                    alt={relatedCourse.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.4s ease',
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                />
                                                {/* Gradient Overlay */}
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'linear-gradient(135deg, rgba(14, 81, 129, 0.3) 0%, rgba(229, 151, 139, 0.3) 100%)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                    '&:hover': { opacity: 1 }
                                                }} />

                                                {/* Category Badge */}
                                                <Chip
                                                    label={relatedCourse.category || "التدريب الإلكتروني"}
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 16,
                                                        right: 16,
                                                        bgcolor: 'rgba(255,255,255,0.9)',
                                                        color: '#333679',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        backdropFilter: 'blur(10px)',
                                                    }}
                                                />

                                                {/* Bookmark Icon */}
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 16,
                                                        left: 16,
                                                        bgcolor: 'rgba(255,255,255,0.9)',
                                                        color: '#333679',
                                                        '&:hover': {
                                                            bgcolor: '#333679',
                                                            color: 'white',
                                                            transform: 'scale(1.1)'
                                                        },
                                                        transition: 'all 0.3s ease',
                                                    }}
                                                >
                                                    <BookmarkBorder fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        {/* Course Content */}
                                        <CardContent sx={{ p: 2.5 }}>
                                            {/* Course Title */}
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                sx={{
                                                    fontWeight: 700,
                                                    lineHeight: 1.3,
                                                    mb: 1.5,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    fontSize: '1rem',
                                                    color: '#333679',
                                                }}
                                                dir="rtl"
                                            >
                                                {relatedCourse.title}
                                            </Typography>

                                            {/* Instructor Info */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                <Avatar
                                                    src={relatedCourse.instructorAvatar || relatedCourse.instructor?.avatar}
                                                    alt={relatedCourse.instructor}
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        mr: 1,
                                                        border: '2px solid #4DBFB3'
                                                    }}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    {relatedCourse.instructor || 'مدرس محترف'}
                                                </Typography>
                                            </Box>

                                            {/* Course Stats */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <VideoIcon fontSize="small" sx={{ color: '#333679', mr: 0.5 }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {relatedCourse.lectures || 4} درس
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PeopleAltOutlined fontSize="small" sx={{ color: '#4DBFB3', mr: 0.5 }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {relatedCourse.students || 6} طالب
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Rating */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                <Rating
                                                    value={(() => {
                                                        const rating = relatedCourse.rating;
                                                        if (typeof rating === 'number') {
                                                            return rating;
                                                        } else if (typeof rating === 'string') {
                                                            const numRating = parseFloat(rating);
                                                            return isNaN(numRating) ? 0 : numRating;
                                                        } else {
                                                            return 0;
                                                        }
                                                    })()}
                                                    precision={0.5}
                                                    readOnly
                                                    size="small"
                                                    emptyIcon={<StarBorder fontSize="inherit" />}
                                                    sx={{
                                                        mr: 1.25,
                                                        '& .MuiRating-iconFilled': {
                                                            color: '#4DBFB3',
                                                        },
                                                    }}
                                                />
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                                    {(() => {
                                                        const rating = relatedCourse.rating;
                                                        if (typeof rating === 'number') {
                                                            return rating.toFixed(1);
                                                        } else if (typeof rating === 'string') {
                                                            const numRating = parseFloat(rating);
                                                            return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
                                                        } else {
                                                            return '0.0';
                                                        }
                                                    })()}/5.00
                                                </Typography>
                                            </Box>

                                            {/* Price */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: '1.1rem',
                                                        fontWeight: 700,
                                                        background: 'linear-gradient(135deg, #333679 0%, #4DBFB3 100%)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                    }}
                                                >
                                                    {(() => {
                                                        const price = relatedCourse.price;
                                                        if (typeof price === 'number') {
                                                            return price.toFixed(2);
                                                        } else if (typeof price === 'string') {
                                                            const numPrice = parseFloat(price);
                                                            return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
                                                        } else {
                                                            return '0.00';
                                                        }
                                                    })()} ر.س
                                                </Typography>

                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#333679',
                                                        color: '#333679',
                                                        '&:hover': {
                                                            bgcolor: '#333679',
                                                            color: 'white',
                                                            borderColor: '#333679',
                                                        },
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        px: 2,
                                                        py: 0.5,
                                                    }}
                                                >
                                                    عرض الدورة
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )) : null}
                        </Grid>
                    </Box>
                </Container>
            )}

            {/* Review Form Dialog */}
            <Dialog
                open={showReviewForm}
                onClose={() => setShowReviewForm(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(14, 81, 129, 0.1)',
                        direction: 'rtl',
                    }
                }}
            >
                <DialogContent sx={{ p: 4, direction: 'rtl' }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
                        تقييم الدورة
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'right' }}>
                            تقييمك للدورة
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Rating
                                value={reviewForm.rating}
                                onChange={(event, newValue) => {
                                    handleReviewFormChange('rating', newValue);
                                }}
                                size="large"
                                sx={{
                                    direction: 'ltr',
                                    '& .MuiRating-iconFilled': {
                                        color: '#4DBFB3',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: '#4DBFB3',
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'right' }}>
                            تعليقك (اختياري)
                        </Typography>
                        <textarea
                            value={reviewForm.comment}
                            onChange={(e) => handleReviewFormChange('comment', e.target.value)}
                            placeholder="اكتب تعليقك عن الدورة..."
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                direction: 'rtl',
                                textAlign: 'right'
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowReviewForm(false)}
                            disabled={submittingReview}
                            sx={{
                                borderColor: '#333679',
                                color: '#333679',
                                '&:hover': {
                                    borderColor: '#4DBFB3',
                                    color: '#4DBFB3',
                                },
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            إلغاء
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmitReview}
                            disabled={submittingReview || !reviewForm.comment.trim()}
                            endIcon={submittingReview ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{
                                background: 'linear-gradient(135deg, #333679 0%, #4DBFB3 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4DBFB3 0%, #333679 100%)',
                                },
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                            }}
                        >
                            {submittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Mobile Bottom Bar */}
            <CourseDetailBottomBar
                course={course}
                isAddingToCart={isAddingToCart}
                handleAddToCart={handleAddToCart}
            />

            {/* Footer */}
            <Box sx={{ mt: 'auto' }}>
                <Footer />
            </Box>
        </Box>
    );
};

export default CourseDetail;