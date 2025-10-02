import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Button,
  Chip,
  Fade,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Checkbox,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  School as SchoolIcon, 
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckCircleIcon,
  SentimentSatisfiedAlt,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VideoLibrary as VideoIcon,
  PictureAsPdf as PdfIcon,
  GridView as BitesIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Quiz as QuizIcon,
  Psychology as PsychologyIcon,
  PlayCircle as PlayCircleIcon,
  Assignment as AssignmentIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled, keyframes } from '@mui/system';
import { courseAPI } from '../../services/api.service';
import { contentAPI } from '../../services/content.service';
// import { quizAPI } from '../../services/quiz.service';

// Module Lessons Component
const ModuleLessons = ({ moduleId, lessons = [], course = null }) => {
  const [localLessons, setLocalLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If lessons are passed as props (from the new API), use them directly
  // Otherwise, fetch them individually (fallback)
  useEffect(() => {
    if (lessons.length > 0) {
      setLocalLessons(lessons);
    } else {
      fetchLessons();
    }
  }, [moduleId, lessons.length]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const lessonsResponse = await contentAPI.getLessons({ moduleId });
      const lessonsData = lessonsResponse.results || lessonsResponse || [];
      setLocalLessons(lessonsData);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLocalLessons([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#fafafa', px: 3, py: 2, textAlign: 'center' }}>
        <CircularProgress size={20} />
        <Typography variant="caption" sx={{ ml: 1 }}>
          جاري تحميل الدروس...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: '#fafafa',
      px: 3, 
      py: 2,
      borderTop: '1px solid #e0e0e0'
    }}>
      {/* Resources Section - Only show if course has resources */}
      {course?.resources && course.resources.length > 0 && (
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          py: 1.5,
          px: 0,
          borderBottom: '1px solid #e0e0e0'
        }}>
          {/* Checkbox */}
          <Box sx={{ mr: 2 }}>
            <Checkbox 
              size="small" 
              checked={false}
              sx={{
                color: '#666',
                '&.Mui-checked': {
                  color: '#4caf50'
                }
              }}
            />
          </Box>

          {/* Document Icon */}
          <Box sx={{ mr: 2 }}>
            <Box sx={{
              width: 20,
              height: 20,
              color: '#999',
              fontSize: '16px'
            }}>
              📄
            </Box>
          </Box>

          {/* PDF Badge */}
          <Box sx={{ mr: 2 }}>
            <Box sx={{
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              background: '#f5f5f5',
              color: '#666',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              border: '1px solid #e0e0e0'
            }}>
              PDF
            </Box>
          </Box>

          {/* Resources Title */}
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500, 
                color: '#333',
                fontSize: '14px'
              }}
            >
              Resources ({course?.resources?.length || 0})
            </Typography>
          </Box>

          {/* Download Action */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#999',
                fontSize: '12px'
              }}
            >
              Download PDF
            </Typography>
            
            {/* Arrow Icon */}
            <Box sx={{ 
              color: '#999',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              →
            </Box>
          </Box>
        </Box>
      )}

      {/* Lessons */}
      {localLessons.map((lesson, index) => (
        <Box 
          key={lesson.id} 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            px: 0,
            borderBottom: '1px solid #e0e0e0',
            '&:last-child': {
              borderBottom: 'none'
            }
          }}
        >
          {/* Checkbox - Left side */}
          <Box sx={{ mr: 2 }}>
            <Checkbox 
              size="small" 
              checked={lesson.is_completed || false}
              sx={{
                color: '#666',
                '&.Mui-checked': {
                  color: '#4caf50'
                }
              }}
            />
          </Box>

          {/* Lesson Number */}
          <Box sx={{ mr: 2, minWidth: '20px' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#999',
                fontSize: '14px',
                fontWeight: 400
              }}
            >
              {index + 1}
            </Typography>
          </Box>

          {/* Content Type Badge */}
          <Box sx={{ mr: 2 }}>
            <Box sx={{
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              background: lesson.content_type === 'article' 
                ? '#f5f5f5'
                : lesson.content_type === 'video'
                ? '#e8f5e8'
                : '#f5f5f5',
              color: lesson.content_type === 'article' 
                ? '#666'
                : lesson.content_type === 'video'
                ? '#4caf50'
                : '#666',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              border: '1px solid #e0e0e0'
            }}>
              {lesson.content_type === 'article' ? 'PDF' : 
               lesson.content_type === 'video' ? 'VIDEO' : 'LESSON'}
            </Box>
          </Box>

          {/* Lesson Title with Module Info */}
          <Box sx={{ flex: 1, mr: 2 }}>
              <Typography 
              variant="body2" 
                sx={{ 
                fontWeight: 500, 
                color: '#333',
                fontSize: '14px',
                mb: 0.5
                }}
              >
                {lesson.title}
              </Typography>
            {lesson.module_name && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#4DBFB3',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: '#e8f5e8',
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5
                }}
              >
                {lesson.module_name}
              </Typography>
            )}
          </Box>

          {/* Duration and Action */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {lesson.duration && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                  color: '#999',
                  fontSize: '12px'
                  }}
                >
                {lesson.duration}
                </Typography>
            )}
            
            {/* Arrow Icon - Clickable to navigate to specific lesson */}
            <Box 
              sx={{ 
                color: '#999',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4DBFB3',
                  transform: 'translateX(2px)'
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (course?.id && moduleId && lesson?.id) {
                  navigate(`/student/courses/${course.id}/tracking?tab=lessons&moduleId=${moduleId}&lessonId=${lesson.id}`);
                }
              }}
            >
              →
          </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Course Detail Page Component
const CourseDetailPage = ({ course, onBack }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedSubModules, setExpandedSubModules] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    fetchCourseContent();
  }, [course.id]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      
      // Fetch modules with lessons using the new API
      const modulesResponse = await contentAPI.getCourseModulesWithLessons(course.id);
      console.log('Modules response:', modulesResponse);
      const modulesData = modulesResponse.modules || [];
      
      // Organize modules: separate main modules and sub modules
      const mainModules = modulesData.filter(module => !module.submodule);
      const subModules = modulesData.filter(module => module.submodule);
      
      // Group sub modules under their parent modules
      const organizedModules = mainModules.map(mainModule => {
        const relatedSubModules = subModules.filter(subModule => subModule.submodule === mainModule.id);
        
        return {
          ...mainModule,
          submodules: relatedSubModules
        };
      });
      setModules(organizedModules);

      // Fetch questions using the new API
      const questionsResponse = await contentAPI.getCourseQuestionBank(course.id);
      console.log('Questions response:', questionsResponse);
      
      // Extract questions from modules structure and add module info
      const allQuestions = [];
      const questionsModules = questionsResponse.modules || [];
      questionsModules.forEach(module => {
        if (module.lessons) {
          module.lessons.forEach(lesson => {
            if (lesson.questions) {
              // Add module information to each question
              const questionsWithModule = lesson.questions.map(question => ({
                ...question,
                module_name: module.name,
                module_id: module.id
              }));
              allQuestions.push(...questionsWithModule);
            }
          });
        }
      });
      setQuestions(allQuestions);

      // Fetch flashcards using the new API
      const flashcardsResponse = await contentAPI.getCourseFlashcards(course.id);
      console.log('Flashcards response:', flashcardsResponse);
      
      // Extract flashcards from modules structure and add module info
      const allFlashcards = [];
      const flashcardsModules = flashcardsResponse.modules || [];
      flashcardsModules.forEach(module => {
        if (module.lessons) {
          module.lessons.forEach(lesson => {
            if (lesson.flashcards) {
              // Add module information to each flashcard
              const flashcardsWithModule = lesson.flashcards.map(flashcard => ({
                ...flashcard,
                module_name: module.name,
                module_id: module.id
              }));
              allFlashcards.push(...flashcardsWithModule);
            }
          });
        }
      });
      setFlashcards(allFlashcards);

    } catch (error) {
      console.error('Error fetching course content:', error);
      // Set empty arrays on error
      setModules([]);
      setQuestions([]);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleToggle = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleSubModuleToggle = (subModuleId) => {
    setExpandedSubModules(prev => ({
      ...prev,
      [subModuleId]: !prev[subModuleId]
    }));
  };

  const filteredModules = modules.filter(module => {
    if (!module || !module.title) return false;
    return module.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredQuestions = questions.filter(question => {
    if (!question || !question.question) return false;
    return question.question.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredFlashcards = flashcards.filter(flashcard => {
    if (!flashcard) return false;
    const front = flashcard.front?.toLowerCase() || '';
    const back = flashcard.back?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return front.includes(search) || back.includes(search);
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #333679 0%, #4DBFB3 50%, #333679 100%)',
        color: 'white', 
        py: 1.5,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }
      }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ 
            mb: 1, 
            color: 'rgba(255,255,255,0.9)',
            '& .MuiBreadcrumbs-separator': {
              color: 'rgba(255,255,255,0.6)'
            }
          }}>
            <Link 
              color="inherit" 
              href="#" 
              onClick={onBack}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                textDecoration: 'none',
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                background: 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                fontSize: '0.875rem',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              <HomeIcon sx={{ fontSize: 18 }} />
              الرئيسية
            </Link>
            <Typography 
              color="inherit" 
              sx={{ 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 1.5,
                background: 'rgba(255,255,255,0.15)',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              {course.title}
            </Typography>
          </Breadcrumbs>

          {/* Course Title and Stats */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 1,
            position: 'relative',
            zIndex: 2
          }}>
            <Box sx={{ 
              width: 50, 
              height: 50, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -1,
                left: -1,
                right: -1,
                bottom: -1,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #4DBFB3, #333679, #4DBFB3)',
                zIndex: -1,
                opacity: 0.7
              }
            }}>
              <SchoolIcon sx={{ fontSize: 24, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h5" 
                fontWeight={800} 
                sx={{ 
                  mb: 0.5,
                  background: 'linear-gradient(45deg, #ffffff 0%, #f0f9ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                {course.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {questions.length > 0 && (
                  <Chip 
                    icon={<QuestionAnswerIcon sx={{ fontSize: 14 }} />} 
                    label={`${questions.length} سؤال`} 
                    size="small"
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: 24,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                )}
                {modules.length > 0 && (
                  <Chip 
                    icon={<PlayCircleIcon sx={{ fontSize: 14 }} />} 
                    label={`${modules.length} وحدة`} 
                    size="small"
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: 24,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                )}
                {flashcards.length > 0 && (
                  <Chip 
                    icon={<PsychologyIcon sx={{ fontSize: 14 }} />} 
                    label={`${flashcards.length} بطاقة تعليمية`} 
                    size="small"
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: 24,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Course Instructor */}
          {course.instructor && (
            <Box sx={{ 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              {/* Instructor Avatar */}
              <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4DBFB3 0%, #45a8a0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={800} 
                    sx={{ 
                      color: 'white',
                      fontSize: '14px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {course.instructor.charAt(0).toUpperCase()}
                  </Typography>
                </Box>
              </Box>
              
              {/* Instructor Name */}
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '12px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}
                >
                  {course.instructor}
                </Typography>
              </Box>
            </Box>
          )}

        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Tabs */}
        <Box sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
          borderRadius: 4,
          p: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #4DBFB3 0%, #333679 100%)',
                height: 4,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(77, 191, 179, 0.3)'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '16px',
                minHeight: 56,
                borderRadius: 3,
                mx: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(77, 191, 179, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(77, 191, 179, 0.2)'
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(77, 191, 179, 0.15) 0%, rgba(51, 54, 121, 0.15) 100%)',
                  color: '#333679',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(77, 191, 179, 0.3)'
                }
              }
            }}
          >
            <Tab 
              icon={<VideoIcon sx={{ fontSize: 22 }} />} 
              iconPosition="start" 
              label="الوحدات" 
              sx={{ gap: 1 }}
            />
            <Tab 
              icon={<QuizIcon sx={{ fontSize: 22 }} />} 
              iconPosition="start" 
              label="بنك الأسئلة" 
              sx={{ gap: 1 }}
            />
            <Tab 
              icon={<PsychologyIcon sx={{ fontSize: 22 }} />} 
              iconPosition="start" 
              label="البطاقات التعليمية" 
              sx={{ gap: 1 }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredModules.length === 0 ? (
              <Card sx={{ borderRadius: 2, p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  لا توجد وحدات متاحة
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredModules.map((module, index) => (
                  <Card key={module.id} sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {/* Module Header */}
                    <Box sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      {/* Module Number */}
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#999',
                          fontWeight: 400,
                          fontSize: '24px',
                          minWidth: '40px'
                        }}
                      >
                        {index + 1}
                      </Typography>
                      
                      {/* Module Content */}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#333',
                            fontSize: '18px',
                            mb: 1
                          }}
                        >
                          {module.title || module.name}
                        </Typography>
                        
                        {/* Progress Bar */}
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ 
                            width: '100%', 
                            height: 4, 
                            bgcolor: '#f0f0f0', 
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              width: '0%', 
                              height: '100%', 
                              bgcolor: '#4DBFB3',
                              borderRadius: 2
                            }} />
                          </Box>
                        </Box>
                        
                        {/* Module Stats */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontSize: '14px'
                          }}
                        >
                          {(() => {
                            const mainLessons = module.lessons ? module.lessons.length : 0;
                            const subModulesLessons = module.submodules ? 
                              module.submodules.reduce((total, sub) => total + (sub.lessons ? sub.lessons.length : 0), 0) : 0;
                            const totalLessons = mainLessons + subModulesLessons;
                            return `${totalLessons} درس`;
                          })()} 
                          {module.submodules && module.submodules.length > 0 && ` • ${module.submodules.length} وحدة فرعية`}
                          • {module.video_duration ? `${Math.floor(module.video_duration / 60)}د ${module.video_duration % 60}ث` : '0د'} مدة التشغيل
                        </Typography>
                      </Box>
                      
                      {/* Start Button */}
                      <Button
                        variant="contained"
                        onClick={() => {
                          // Find first lesson in the module
                          let firstLesson = null;
                          if (module.lessons && module.lessons.length > 0) {
                            firstLesson = module.lessons[0];
                          } else if (module.submodules && module.submodules.length > 0) {
                            // Check submodules for first lesson
                            for (const subModule of module.submodules) {
                              if (subModule.lessons && subModule.lessons.length > 0) {
                                firstLesson = subModule.lessons[0];
                                break;
                              }
                            }
                          }
                          
                          if (firstLesson) {
                            navigate(`/student/courses/${course.id}/tracking?tab=lessons&moduleId=${module.id}&lessonId=${firstLesson.id}`);
                          } else {
                            navigate(`/student/courses/${course.id}/tracking?tab=lessons&moduleId=${module.id}`);
                          }
                        }}
                        sx={{
                          background: '#4DBFB3',
                          color: 'white',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '14px',
                          textTransform: 'none',
                          boxShadow: '0 2px 8px rgba(77, 191, 179, 0.3)',
                          '&:hover': {
                            background: '#45a8a0',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(77, 191, 179, 0.4)'
                          }
                        }}
                      >
                        ابدأ
                      </Button>
                    </Box>
                    
                    {/* Expandable Lessons Section */}
                    <Box sx={{
                      borderTop: '1px solid #f0f0f0',
                      bgcolor: '#fafafa'
                    }}>
                      <Button
                        fullWidth
                        onClick={() => handleModuleToggle(module.id)}
                        sx={{
                          py: 2,
                          px: 3,
                          color: '#666',
                          textTransform: 'none',
                          fontSize: '14px',
                          fontWeight: 500,
                          justifyContent: 'space-between',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.02)'
                          }
                        }}
                      >
                        <span>
                          عرض المحتوى ({(() => {
                            const mainLessons = module.lessons ? module.lessons.length : 0;
                            const subModulesLessons = module.submodules ? 
                              module.submodules.reduce((total, sub) => total + (sub.lessons ? sub.lessons.length : 0), 0) : 0;
                            const totalLessons = mainLessons + subModulesLessons;
                            return `${totalLessons} درس`;
                          })()}
                          {module.submodules && module.submodules.length > 0 && ` + ${module.submodules.length} وحدة فرعية`})
                        </span>
                        {expandedModules[module.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Button>
                      
                      <Collapse in={expandedModules[module.id]} timeout="auto" unmountOnExit>
                        {/* Main Module Lessons */}
                        {module.lessons && module.lessons.length > 0 && (
                          <Box sx={{ 
                            background: '#fafafa',
                            borderBottom: '1px solid #e0e0e0'
                          }}>
                            <Box sx={{ 
                              px: 3, 
                              py: 2,
                              borderBottom: '1px solid #e0e0e0',
                              background: '#f0f0f0'
                            }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 600, 
                                  color: '#333',
                                  fontSize: '14px'
                                }}
                              >
                                دروس الوحدة الرئيسية ({module.lessons.length})
                              </Typography>
                            </Box>
                            <ModuleLessons moduleId={module.id} lessons={module.lessons} course={course} />
                          </Box>
                        )}
                        
                        {/* Sub Modules */}
                        {module.submodules && module.submodules.length > 0 && (
                          <Box sx={{ 
                            background: '#f5f5f5'
                          }}>
                            {module.submodules.map((subModule, subIndex) => (
                              <Box key={subModule.id} sx={{ 
                                borderBottom: '1px solid #e0e0e0',
                                '&:last-child': {
                                  borderBottom: 'none'
                                }
                              }}>
                                {/* Sub Module Header - Clickable */}
                                <Button
                                  fullWidth
                                  onClick={() => handleSubModuleToggle(subModule.id)}
                                  sx={{
                                    px: 3,
                                    py: 2,
                                    borderBottom: '1px solid #e0e0e0',
                                    background: '#e8f5e8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    textTransform: 'none',
                                    justifyContent: 'flex-start',
                                    '&:hover': {
                                      background: '#d4edda'
                                    }
                                  }}
                                >
                                  {/* Sub Module Icon */}
                                  <Box sx={{
                                    width: 20,
                                    height: 20,
                                    color: '#4DBFB3',
                                    fontSize: '14px'
                                  }}>
                                    📚
                                  </Box>
                                  
                                  {/* Sub Module Title */}
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 600, 
                                      color: '#333',
                                      fontSize: '14px',
                                      flex: 1,
                                      textAlign: 'right'
                                    }}
                                  >
                                    {subModule.title || subModule.name}
                                  </Typography>
                                  
                                  {/* Sub Module Stats */}
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: '#666',
                                      fontSize: '12px'
                                    }}
                                  >
                                    {subModule.lessons ? `${subModule.lessons.length} درس` : '0 درس'}
                                  </Typography>
                                  
                                  {/* Expand/Collapse Icon */}
                                  {expandedSubModules[subModule.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </Button>
                                
                                {/* Sub Module Lessons - Collapsible */}
                                <Collapse in={expandedSubModules[subModule.id]} timeout="auto" unmountOnExit>
                                  {subModule.lessons && subModule.lessons.length > 0 && (
                                    <ModuleLessons moduleId={subModule.id} lessons={subModule.lessons} course={course} />
                                  )}
                                </Collapse>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Collapse>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : questions.length === 0 ? (
              <Card sx={{ borderRadius: 2, p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  لا توجد أسئلة متاحة
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {(() => {
                  // Group questions by module
                  const questionsByModule = {};
                  questions.forEach(question => {
                    const moduleName = question.module_name || question.category || 'عام';
                    if (!questionsByModule[moduleName]) {
                      questionsByModule[moduleName] = {
                        questions: [],
                        module_id: question.module_id
                      };
                    }
                    questionsByModule[moduleName].questions.push(question);
                  });

                  return Object.entries(questionsByModule).map(([moduleName, moduleData], moduleIndex) => (
                    <Card key={moduleName} sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {/* Module Header */}
                    <Box sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      {/* Module Number */}
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#999',
                          fontWeight: 400,
                          fontSize: '24px',
                          minWidth: '40px'
                        }}
                      >
                        {moduleIndex + 1}
                      </Typography>
                      
                      {/* Module Content */}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#333',
                            fontSize: '18px',
                            mb: 1
                          }}
                        >
                            {moduleName}
                        </Typography>
                        
                          {/* Questions Count and Types */}
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontSize: '14px'
                          }}
                        >
                              {moduleData.questions.length} سؤال
                        </Typography>
                            {(() => {
                              const questionTypes = moduleData.questions.reduce((acc, q) => {
                                const type = q.type === 'multiple_choice' ? 'اختيار من متعدد' : 
                                           q.type === 'true_false' ? 'صح أو خطأ' : 
                                           q.type === 'essay' ? 'مقالي' : 'سؤال';
                                acc[type] = (acc[type] || 0) + 1;
                                return acc;
                              }, {});
                              
                              return Object.entries(questionTypes).map(([type, count]) => (
                                              <Chip
                                  key={type}
                                  label={`${count} ${type}`}
                                                size="small"
                                                sx={{
                                    background: '#e3f2fd',
                                    color: '#1976d2',
                                    fontSize: '10px',
                                    height: 18
                                  }}
                                />
                              ));
                            })()}
                                            </Box>
                                          </Box>
                                          
                        {/* Start Button */}
                                          <Button
                                            variant="contained"
                                            onClick={() => {
                                              // Find first question in the module
                                              const firstQuestion = moduleData.questions[0];
                                              if (firstQuestion) {
                                                navigate(`/student/courses/${course.id}/tracking?tab=questions&moduleId=${moduleData.module_id}&questionId=${firstQuestion.id}`);
                                              } else {
                                                navigate(`/student/courses/${course.id}/tracking?tab=questions&moduleId=${moduleData.module_id}`);
                                              }
                                            }}
                                            sx={{
                                              background: '#1976d2',
                                              color: 'white',
                                              fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '14px',
                                              textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                                              '&:hover': {
                                                background: '#1565c0',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
                                              }
                                            }}
                                          >
                          ابدأ
                                          </Button>
                                        </Box>
                                        
                                        {/* Individual Questions List */}
                                        {moduleData.questions.length > 0 && (
                                          <Box sx={{ 
                                            borderTop: '1px solid #f0f0f0',
                                            bgcolor: '#fafafa',
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                          }}>
                                            <Box sx={{ 
                                              px: 3, 
                                              py: 2,
                                              borderBottom: '1px solid #e0e0e0',
                                              background: '#f0f0f0'
                                            }}>
                                              <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                  fontWeight: 600, 
                                                  color: '#333',
                                                  fontSize: '14px'
                                                }}
                                              >
                                                الأسئلة ({moduleData.questions.length})
                                              </Typography>
                                            </Box>
                                            {moduleData.questions.slice(0, 5).map((question, qIndex) => (
                                              <Box 
                                                key={question.id} 
                                                sx={{ 
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  py: 1.5,
                                                  px: 3,
                                                  borderBottom: '1px solid #e0e0e0',
                                                  cursor: 'pointer',
                                                  transition: 'all 0.2s ease',
                                                  '&:hover': {
                                                    bgcolor: '#e3f2fd'
                                                  },
                                                  '&:last-child': {
                                                    borderBottom: 'none'
                                                  }
                                                }}
                                                onClick={() => navigate(`/student/courses/${course.id}/tracking?tab=questions&moduleId=${moduleData.module_id}&questionId=${question.id}`)}
                                              >
                                                {/* Question Number */}
                                                <Box sx={{ mr: 2, minWidth: '20px' }}>
                                                  <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                      color: '#999',
                                                      fontSize: '14px',
                                                      fontWeight: 400
                                                    }}
                                                  >
                                                    {qIndex + 1}
                                                  </Typography>
                                                </Box>

                                                {/* Question Type Badge */}
                                                <Box sx={{ mr: 2 }}>
                                                  <Box sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 0.5,
                                                    background: question.type === 'multiple_choice' ? '#e3f2fd' : 
                                                               question.type === 'true_false' ? '#e8f5e8' : '#f5f5f5',
                                                    color: question.type === 'multiple_choice' ? '#1976d2' : 
                                                           question.type === 'true_false' ? '#4caf50' : '#666',
                                                    fontSize: '11px',
                                                    fontWeight: 500,
                                                    textTransform: 'uppercase',
                                                    border: '1px solid #e0e0e0'
                                                  }}>
                                                    {question.type === 'multiple_choice' ? 'اختيار' : 
                                                     question.type === 'true_false' ? 'صح/خطأ' : 'سؤال'}
                                                  </Box>
                                                </Box>

                                                {/* Question Title */}
                                                <Box sx={{ flex: 1, mr: 2 }}>
                                                  <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                      fontWeight: 500, 
                                                      color: '#333',
                                                      fontSize: '14px',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap'
                                                    }}
                                                  >
                                                    {question.question}
                                                  </Typography>
                                                </Box>

                                                {/* Arrow Icon */}
                                                <Box sx={{ 
                                                  color: '#999',
                                                  fontSize: '16px',
                                                  transition: 'all 0.2s ease'
                                                }}>
                                                  →
                                                </Box>
                                              </Box>
                                            ))}
                                            {moduleData.questions.length > 5 && (
                                              <Box sx={{ 
                                                px: 3, 
                                                py: 2, 
                                                textAlign: 'center',
                                                borderTop: '1px solid #e0e0e0',
                                                bgcolor: '#f5f5f5'
                                              }}>
                                                <Typography 
                                                  variant="caption" 
                                                  sx={{ 
                                                    color: '#666',
                                                    fontSize: '12px'
                                                  }}
                                                >
                                                  و {moduleData.questions.length - 5} أسئلة أخرى...
                                                </Typography>
                                              </Box>
                                            )}
                                          </Box>
                                        )}
                                      </Card>
                  ));
                })()}
                                  </Box>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : flashcards.length === 0 ? (
              <Card sx={{ borderRadius: 2, p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  لا توجد بطاقات تعليمية متاحة
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {(() => {
                  // Group flashcards by module
                  const flashcardsByModule = {};
                  flashcards.forEach(flashcard => {
                    const moduleName = flashcard.category || flashcard.module_name || 'عام';
                    if (!flashcardsByModule[moduleName]) {
                      flashcardsByModule[moduleName] = {
                        flashcards: [],
                        module_id: flashcard.module_id
                      };
                    }
                    flashcardsByModule[moduleName].flashcards.push(flashcard);
                  });

                  return Object.entries(flashcardsByModule).map(([moduleName, moduleData], moduleIndex) => (
                    <Card key={moduleName} sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {/* Module Header */}
                    <Box sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      {/* Module Number */}
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#999',
                          fontWeight: 400,
                          fontSize: '24px',
                          minWidth: '40px'
                        }}
                      >
                        {moduleIndex + 1}
                      </Typography>
                      
                      {/* Module Content */}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#333',
                            fontSize: '18px',
                            mb: 1
                          }}
                        >
                            {moduleName}
                        </Typography>
                        
                        {/* Flashcards Count */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontSize: '14px'
                          }}
                        >
                            {moduleData.flashcards.length} بطاقة تعليمية
                        </Typography>
                      </Box>
                      
                        {/* Start Button */}
                      <Button
                          variant="contained"
                          onClick={() => {
                            // Find first flashcard in the module
                            const firstFlashcard = moduleData.flashcards[0];
                            if (firstFlashcard) {
                              navigate(`/student/courses/${course.id}/tracking?tab=flashcards&moduleId=${moduleData.module_id}&flashcardId=${firstFlashcard.id}`);
                            } else {
                              navigate(`/student/courses/${course.id}/tracking?tab=flashcards&moduleId=${moduleData.module_id}`);
                            }
                          }}
                        sx={{
                            background: '#4caf50',
                            color: 'white',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '14px',
                          textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                          '&:hover': {
                              background: '#45a049',
                                          transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
                            }
                          }}
                        >
                          ابدأ
                                          </Button>
                                        </Box>
                                        
                                        {/* Individual Flashcards List */}
                                        {moduleData.flashcards.length > 0 && (
                                          <Box sx={{ 
                                            borderTop: '1px solid #f0f0f0',
                                            bgcolor: '#fafafa',
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                          }}>
                                            <Box sx={{ 
                                              px: 3, 
                                              py: 2,
                                              borderBottom: '1px solid #e0e0e0',
                                              background: '#f0f0f0'
                                            }}>
                                              <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                  fontWeight: 600, 
                                                  color: '#333',
                                                  fontSize: '14px'
                                                }}
                                              >
                                                البطاقات التعليمية ({moduleData.flashcards.length})
                                              </Typography>
                                            </Box>
                                            {moduleData.flashcards.slice(0, 5).map((flashcard, fIndex) => (
                                              <Box 
                                                key={flashcard.id} 
                                                sx={{ 
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  py: 1.5,
                                                  px: 3,
                                                  borderBottom: '1px solid #e0e0e0',
                                                  cursor: 'pointer',
                                                  transition: 'all 0.2s ease',
                                                  '&:hover': {
                                                    bgcolor: '#e8f5e8'
                                                  },
                                                  '&:last-child': {
                                                    borderBottom: 'none'
                                                  }
                                                }}
                                                onClick={() => navigate(`/student/courses/${course.id}/tracking?tab=flashcards&moduleId=${moduleData.module_id}&flashcardId=${flashcard.id}`)}
                                              >
                                                {/* Flashcard Number */}
                                                <Box sx={{ mr: 2, minWidth: '20px' }}>
                                                  <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                      color: '#999',
                                                      fontSize: '14px',
                                                      fontWeight: 400
                                                    }}
                                                  >
                                                    {fIndex + 1}
                                                  </Typography>
                                                </Box>

                                                {/* Flashcard Icon */}
                                                <Box sx={{ mr: 2 }}>
                                                  <Box sx={{
                                                    width: 20,
                                                    height: 20,
                                                    color: '#4caf50',
                                                    fontSize: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                  }}>
                                                    🧠
                                                  </Box>
                                                </Box>

                                                {/* Flashcard Content */}
                                                <Box sx={{ flex: 1, mr: 2 }}>
                                                  <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                      fontWeight: 500, 
                                                      color: '#333',
                                                      fontSize: '14px',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap'
                                                    }}
                                                  >
                                                    {flashcard.front}
                                                  </Typography>
                                                  {flashcard.back && (
                                                    <Typography 
                                                      variant="caption" 
                                                      sx={{ 
                                                        color: '#666',
                                                        fontSize: '12px',
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                      }}
                                                    >
                                                      {flashcard.back}
                                                    </Typography>
                                                  )}
                                                </Box>

                                                {/* Arrow Icon */}
                                                <Box sx={{ 
                                                  color: '#999',
                                                  fontSize: '16px',
                                                  transition: 'all 0.2s ease'
                                                }}>
                                                  →
                                                </Box>
                                              </Box>
                                            ))}
                                            {moduleData.flashcards.length > 5 && (
                                              <Box sx={{ 
                                                px: 3, 
                                                py: 2, 
                                                textAlign: 'center',
                                                borderTop: '1px solid #e0e0e0',
                                                bgcolor: '#f5f5f5'
                                              }}>
                                                <Typography 
                                                  variant="caption" 
                                                  sx={{ 
                                                    color: '#666',
                                                    fontSize: '12px'
                                                  }}
                                                >
                                                  و {moduleData.flashcards.length - 5} بطاقة أخرى...
                                                </Typography>
                                              </Box>
                                            )}
                                          </Box>
                                        )}
                                      </Card>
                  ));
                })()}
                                  </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

const MyCourses = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // Handle course selection from URL parameter
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    if (courseId && (enrolledCourses.length > 0 || completedCourses.length > 0)) {
      const course = [...enrolledCourses, ...completedCourses].find(c => c.id == courseId);
      if (course) {
        setSelectedCourse(course);
      }
    } else if (!courseId && selectedCourse) {
      // If no courseId in URL but we have a selected course, clear it
      setSelectedCourse(null);
    }
  }, [searchParams, enrolledCourses, completedCourses, selectedCourse]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await courseAPI.getMyEnrolledCourses();
      
      // Process and validate course data
      const processedEnrolledCourses = (response.enrolled_courses || []).map(course => ({
        ...course,
        progress: Math.min(Math.max(course.progress || 0, 0), 100),
        totalLessons: course.totalLessons || course.total_lessons || 0,
        completedLessons: course.completedLessons || Math.floor(((course.progress || 0) / 100) * (course.totalLessons || course.total_lessons || 0)),
        duration: course.duration || course.total_duration || "0د"
      }));
      
      const processedCompletedCourses = (response.completed_courses || []).map(course => ({
        ...course,
        progress: 100, // Completed courses should always show 100%
        totalLessons: course.totalLessons || course.total_lessons || 0,
        completedLessons: course.totalLessons || course.total_lessons || 0,
        duration: course.duration || course.total_duration || "0د"
      }));
      
      setEnrolledCourses(processedEnrolledCourses);
      setCompletedCourses(processedCompletedCourses);
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('حدث خطأ أثناء جلب الكورسات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    const course = [...enrolledCourses, ...completedCourses].find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };


  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={60} sx={{ color: '#7c4dff' }} />
        <Typography variant="h6" sx={{ color: '#7c4dff', fontWeight: 600 }}>
          جاري تحميل الكورسات...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'white',
          py: 4
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
            <Button 
              variant="contained" 
              onClick={fetchMyCourses}
              sx={{ 
                bgcolor: '#7c4dff',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { bgcolor: '#6a3dcc' }
              }}
            >
              إعادة المحاولة
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // Show course detail page if a course is selected
  if (selectedCourse) {
    return <CourseDetailPage course={selectedCourse} onBack={handleBackToCourses} />;
  }

  // Show courses list
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#333' }}>
          دوراتي
        </Typography>
        
        {/* Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
              الدورات المسجلة ({enrolledCourses.length})
            </Typography>
            <Grid container spacing={3}>
              {enrolledCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.thumbnail || '/api/placeholder/400/200'}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.progress} 
                          sx={{ flex: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: '40px', textAlign: 'right' }}>
                          {course.progress}%
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {course.completedLessons} من {course.totalLessons} درس مكتمل
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
              الدورات المكتملة ({completedCourses.length})
            </Typography>
            <Grid container spacing={3}>
              {completedCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.thumbnail || '/api/placeholder/400/200'}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={100} 
                          sx={{ flex: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: '40px', textAlign: 'right' }}>
                          100%
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        مكتمل - {course.totalLessons} درس
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* No courses message */}
        {enrolledCourses.length === 0 && completedCourses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              لم تسجل في أي دورة بعد
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/courses')}
              sx={{ mt: 2 }}
            >
              تصفح الدورات
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyCourses;
