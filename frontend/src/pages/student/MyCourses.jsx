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
import { assignmentsAPI } from '../../services/assignment.service';
import { quizAPI } from '../../services/quiz.service';
import { examAPI } from '../../services/exam.service';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '16px',
  bgcolor: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)'
    },
    '& .action-buttons': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}));

const StyledCardMedia = styled(CardMedia)({
  height: 160,
  position: 'relative',
  transition: 'transform 0.5s ease-in-out',
  bgcolor: '#ecf0f1',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
    zIndex: 1
  }
});



const EmptyState = ({ isCompleted = false }) => (
  <Fade in={true} timeout={500}>
    <Box sx={{
      textAlign: 'center',
      py: 8,
      color: '#333679',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }}>
      <SentimentSatisfiedAlt sx={{ fontSize: 80, color: '#4DBFB3' }} />
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {isCompleted ? 'لا توجد كورسات مكتملة بعد' : 'لا توجد كورسات مسجلة بعد'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {isCompleted 
          ? 'أكمل الكورسات المسجلة لتحصل على شهادات الإنجاز' 
          : 'يمكنك تصفح الكورسات المتاحة والتسجيل فيها لتبدأ رحلة التعلم'
        }
      </Typography>
      {!isCompleted && (
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            bgcolor: '#333679', 
            borderRadius: 3, 
            px: 5, 
            py: 1.5, 
            fontWeight: 700, 
            '&:hover': { bgcolor: '#0a3d5f' } 
          }}
          onClick={() => window.location.href = '/courses'}
        >
          تصفح الكورسات
        </Button>
      )}
    </Box>
  </Fade>
);

const CourseCard = ({ course, onClick }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [courseContent, setCourseContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [calculatedData, setCalculatedData] = useState({
    totalLessons: 0,
    completedLessons: 0,
    duration: "0د"
  });
  
  // Ensure progress is a valid number between 0 and 100
  const progress = Math.min(Math.max(course.progress || 0, 0), 100);
  
  // Calculate completed lessons and total runtime from course data
  const totalLessons = calculatedData.totalLessons || course.totalLessons || course.total_lessons || course.lessons_count || 0;
  const completedLessons = calculatedData.completedLessons || course.completedLessons || Math.floor((progress / 100) * totalLessons);
  const totalRuntime = calculatedData.duration || course.duration || course.total_duration || "0د";
  
  // Ensure progress is properly calculated from enrollment data
  const actualProgress = course.progress !== undefined ? course.progress : progress;
  
  // Debug logging
  console.log('Course data:', {
    id: course.id,
    title: course.title,
    progress: course.progress,
    totalLessons: course.totalLessons,
    completedLessons: course.completedLessons,
    duration: course.duration,
    total_duration: course.total_duration
  });
  
  const handleExpandClick = async () => {
    if (!expanded && courseContent.length === 0) {
      setLoadingContent(true);
      try {
        const allContent = [];
        let totalLessonsCount = 0;
        let completedLessonsCount = 0;
        let totalDurationSeconds = 0;
        
        // Fetch course modules and lessons
        const modulesResponse = await contentAPI.getModules(course.id);
        console.log('Modules fetched:', modulesResponse);
        
        // Extract modules from paginated response
        const modules = modulesResponse.results || modulesResponse || [];
        console.log('Modules array:', modules);
        
        if (!Array.isArray(modules)) {
          console.error('Modules is not an array:', modules);
          throw new Error('Invalid modules data format');
        }
        
        for (const module of modules) {
          // Get lessons for this module
          const lessonsResponse = await contentAPI.getLessons({ moduleId: module.id });
          console.log(`Lessons for module ${module.id}:`, lessonsResponse);
          
          // Extract lessons from paginated response
          const lessons = lessonsResponse.results || lessonsResponse || [];
          console.log(`Lessons array for module ${module.id}:`, lessons);
          
          if (!Array.isArray(lessons)) {
            console.error(`Lessons for module ${module.id} is not an array:`, lessons);
            continue; // Skip this module if lessons data is invalid
          }
          
          const mappedLessons = lessons.map(lesson => {
            totalLessonsCount++;
            if (lesson.is_completed) completedLessonsCount++;
            
            // Calculate duration in seconds
            if (lesson.duration) {
              const durationParts = lesson.duration.split(':');
              if (durationParts.length === 3) {
                const hours = parseInt(durationParts[0]) || 0;
                const minutes = parseInt(durationParts[1]) || 0;
                const seconds = parseInt(durationParts[2]) || 0;
                totalDurationSeconds += hours * 3600 + minutes * 60 + seconds;
              }
            }
            
            return {
              id: `lesson-${lesson.id}`,
              title: lesson.title,
              type: lesson.content_type || 'video',
              duration: lesson.duration || null,
              completed: lesson.is_completed || false,
              progress: lesson.progress_percentage || 0,
              module_title: module.title,
              module_id: module.id,
              content_id: lesson.id,
              content_type: 'lesson'
            };
          });
          allContent.push(...mappedLessons);
        }
        
        // Fetch assignments for this course
        try {
          const assignmentsResponse = await assignmentsAPI.getAssignments({ course: course.id });
          console.log('Assignments fetched:', assignmentsResponse);
          
          // Extract assignments from paginated response
          const assignments = assignmentsResponse.results || assignmentsResponse || [];
          console.log('Assignments array:', assignments);
          
          if (!Array.isArray(assignments)) {
            console.error('Assignments is not an array:', assignments);
            throw new Error('Invalid assignments data format');
          }
          
          const mappedAssignments = assignments.map(assignment => ({
            id: `assignment-${assignment.id}`,
            title: assignment.title,
            type: 'assignment',
            duration: assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('en-US') : null,
            completed: assignment.is_submitted || false,
            progress: assignment.grade ? Math.round((assignment.grade / assignment.max_grade) * 100) : 0,
            module_title: assignment.module?.title || 'Assignment',
            module_id: assignment.module?.id,
            content_id: assignment.id,
            content_type: 'assignment',
            due_date: assignment.due_date,
            grade: assignment.grade,
            max_grade: assignment.max_grade
          }));
          allContent.push(...mappedAssignments);
        } catch (error) {
          console.log('No assignments found for course:', course.id);
        }
        
        // Fetch quizzes for this course
        try {
          const quizzesResponse = await quizAPI.getQuizzes({ course: course.id });
          console.log('Quizzes fetched:', quizzesResponse);
          
          // Extract quizzes from paginated response
          const quizzes = quizzesResponse.results || quizzesResponse || [];
          console.log('Quizzes array:', quizzes);
          
          if (!Array.isArray(quizzes)) {
            console.error('Quizzes is not an array:', quizzes);
            throw new Error('Invalid quizzes data format');
          }
          
          const mappedQuizzes = quizzes.map(quiz => ({
            id: `quiz-${quiz.id}`,
            title: quiz.title,
            type: 'quiz',
            duration: quiz.time_limit ? `${quiz.time_limit} min` : null,
            completed: quiz.is_completed || false,
            progress: quiz.score ? Math.round((quiz.score / quiz.max_score) * 100) : 0,
            module_title: quiz.module?.title || 'Quiz',
            module_id: quiz.module?.id,
            content_id: quiz.id,
            content_type: 'quiz',
            score: quiz.score,
            max_score: quiz.max_score,
            attempts: quiz.attempts || 0
          }));
          allContent.push(...mappedQuizzes);
        } catch (error) {
          console.log('No quizzes found for course:', course.id);
        }
        
        // Fetch exams for this course
        try {
          const examsResponse = await examAPI.getExams({ course: course.id });
          console.log('Exams fetched:', examsResponse);
          
          // Extract exams from paginated response
          const exams = examsResponse.results || examsResponse || [];
          console.log('Exams array:', exams);
          
          if (!Array.isArray(exams)) {
            console.error('Exams is not an array:', exams);
            throw new Error('Invalid exams data format');
          }
          
          const mappedExams = exams.map(exam => ({
            id: `exam-${exam.id}`,
            title: exam.title,
            type: 'exam',
            duration: exam.duration ? `${exam.duration} min` : null,
            completed: exam.is_completed || false,
            progress: exam.score ? Math.round((exam.score / exam.max_score) * 100) : 0,
            module_title: exam.module?.title || 'Exam',
            module_id: exam.module?.id,
            content_id: exam.id,
            content_type: 'exam',
            score: exam.score,
            max_score: exam.max_score,
            attempts: exam.attempts || 0
          }));
          allContent.push(...mappedExams);
        } catch (error) {
          console.log('No exams found for course:', course.id);
        }
        
        // Add course resources if available
        if (course.resources && course.resources.length > 0) {
          course.resources.forEach(resource => {
            allContent.unshift({
              id: `resource-${resource.id}`,
              title: resource.title || 'Resources',
              type: 'resource',
              duration: null,
              completed: false,
              progress: 0,
              module_title: 'Resources',
              content_id: resource.id,
              content_type: 'resource',
              resource_url: resource.file_url
            });
          });
        }
        
        // Sort content by module order and then by type
        allContent.sort((a, b) => {
          // First sort by module_id if available
          if (a.module_id && b.module_id && a.module_id !== b.module_id) {
            return a.module_id - b.module_id;
          }
          // Then sort by content type priority
          const typeOrder = { 'resource': 0, 'lesson': 1, 'assignment': 2, 'quiz': 3, 'exam': 4 };
          return (typeOrder[a.content_type] || 5) - (typeOrder[b.content_type] || 5);
        });
        
        // Update course data with calculated values
        const calculatedProgress = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;
        const calculatedDuration = totalDurationSeconds > 0 ? 
          `${Math.floor(totalDurationSeconds / 3600)}س ${Math.floor((totalDurationSeconds % 3600) / 60)}د` : 
          "0د";
        
        console.log('Calculated data:', {
          totalLessonsCount,
          completedLessonsCount,
          calculatedProgress,
          calculatedDuration
        });
        
        // Update calculated data
        setCalculatedData({
          totalLessons: totalLessonsCount,
          completedLessons: completedLessonsCount,
          duration: calculatedDuration
        });
        
        setCourseContent(allContent);
      } catch (error) {
        console.error('Error fetching course content:', error);
        // Show error message instead of fallback data
        setCourseContent([]);
        
        // Show user-friendly error message
        if (error.message.includes('Invalid')) {
          console.error('Data format error:', error.message);
        } else if (error.response?.status === 404) {
          console.error('Course content not found');
        } else if (error.response?.status === 403) {
          console.error('Access denied to course content');
        } else {
          console.error('Unexpected error:', error.message);
        }
        
        console.warn('Failed to load course content. Please try again later.');
      } finally {
        setLoadingContent(false);
      }
    }
    setExpanded(!expanded);
  };

  const getContentTypeIcon = (type, contentType) => {
    switch (contentType) {
      case 'lesson':
        switch (type?.toLowerCase()) {
          case 'video': 
          case 'video_lesson': return <VideoIcon sx={{ fontSize: 16, color: '#666' }} />;
          case 'text': 
          case 'article': return <SchoolIcon sx={{ fontSize: 16, color: '#666' }} />;
          default: return <PlayArrowIcon sx={{ fontSize: 16, color: '#666' }} />;
        }
      case 'assignment': return <EditIcon sx={{ fontSize: 16, color: '#666' }} />;
      case 'quiz': return <BitesIcon sx={{ fontSize: 16, color: '#666' }} />;
      case 'exam': return <CheckCircleIcon sx={{ fontSize: 16, color: '#666' }} />;
      case 'resource': return <PdfIcon sx={{ fontSize: 16, color: '#666' }} />;
      default: return <PlayArrowIcon sx={{ fontSize: 16, color: '#666' }} />;
    }
  };

  const getContentTypeColor = (contentType) => {
    switch (contentType) {
      case 'lesson': return '#4caf50'; // Green for lessons
      case 'assignment': return '#ff9800'; // Orange for assignments
      case 'quiz': return '#9c27b0'; // Purple for quizzes
      case 'exam': return '#f44336'; // Red for exams
      case 'resource': return '#666'; // Grey for resources
      default: return '#666';
    }
  };

  const getContentTypeLabel = (contentType) => {
    switch (contentType) {
      case 'lesson': return 'درس';
      case 'assignment': return 'واجب';
      case 'quiz': return 'كويز';
      case 'exam': return 'امتحان';
      case 'resource': return 'مورد';
      default: return 'محتوى';
    }
  };

  const getContentActionIcon = (item) => {
    switch (item.content_type) {
      case 'resource': return <DownloadIcon sx={{ fontSize: 16 }} />;
      case 'lesson': return <PlayArrowIcon sx={{ fontSize: 16 }} />;
      case 'assignment': return <EditIcon sx={{ fontSize: 16 }} />;
      case 'quiz': return <BitesIcon sx={{ fontSize: 16 }} />;
      case 'exam': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      default: return <PlayArrowIcon sx={{ fontSize: 16 }} />;
    }
  };

  const handleContentClick = (item) => {
    switch (item.content_type) {
      case 'resource':
        if (item.resource_url) {
          window.open(item.resource_url, '_blank');
        }
        break;
      case 'lesson':
        // Navigate to lesson page
        navigate(`/student/courses/${course.id}/lessons/${item.content_id}`);
        break;
      case 'assignment':
        // Navigate to assignment page
        navigate(`/student/courses/${course.id}/assignments/${item.content_id}`);
        break;
      case 'quiz':
        // Navigate to quiz page
        navigate(`/student/courses/${course.id}/quizzes/${item.content_id}`);
        break;
      case 'exam':
        // Navigate to exam page
        navigate(`/student/courses/${course.id}/exams/${item.content_id}`);
        break;
      default:
        // Default to course page
        onClick(course.id);
    }
  };
  
  return (
  <Card
    sx={{
        borderRadius: '16px',
      mb: 3,
      overflow: 'hidden',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
      '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      {/* Course Content with Image on Side */}
      <Box sx={{ 
        display: 'flex', 
        minHeight: 200,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        
        {/* Course Content */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          pb: 2, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#333'
              }}>
                {course.title}
              </Typography>
              {course.status && (
                <Chip 
                  label={course.status === 'completed' ? 'مكتمل' : 'نشط'} 
                  size="small"
                  sx={{
                    bgcolor: course.status === 'completed' ? '#4caf50' : '#2196f3',
                    color: 'white',
                    fontSize: '10px',
                    height: 20
                  }}
                />
              )}
            </Box>
            
            {course.description && (
              <Typography variant="body2" sx={{ 
                color: '#666', 
                fontSize: '14px',
                mb: 1,
                lineHeight: 1.4
              }}>
                {course.description}
              </Typography>
            )}
            
            {/* Course Meta Info */}
            <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
              {course.instructor && (
                <Typography variant="caption" sx={{ 
                  color: '#999', 
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <SchoolIcon sx={{ fontSize: 14 }} />
                  {course.instructor}
                </Typography>
              )}
              {course.category && (
                <Typography variant="caption" sx={{ 
                  color: '#999', 
                  fontSize: '12px'
                }}>
                  {course.category}
                </Typography>
              )}
              {course.enrollment_date && (
                <Typography variant="caption" sx={{ 
                  color: '#999', 
                  fontSize: '12px'
                }}>
                  مسجل منذ: {new Date(course.enrollment_date).toLocaleDateString('en-US')}
                </Typography>
              )}
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#666', fontSize: '12px', fontWeight: 500 }}>
                  التقدم
                </Typography>
                <Typography variant="caption" sx={{ color: '#333679', fontSize: '12px', fontWeight: 600 }}>
                  {Math.round(actualProgress)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={actualProgress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    background: actualProgress >= 100 
                      ? 'linear-gradient(90deg, #4caf50, #66bb6a)' 
                      : 'linear-gradient(90deg, #333679, #1a6ba8)',
                    borderRadius: 3
                  }
                }} 
              />
            </Box>
            
            <Typography variant="body2" sx={{ 
              color: '#666', 
              fontSize: '14px',
              mb: 2
            }}>
              {totalLessons > 0 ? `${completedLessons} من ${totalLessons} درس مكتمل` : 'لا توجد دروس متاحة'} • {totalRuntime} مدة الكورس
              {course.grade && (
                <span style={{ marginLeft: '8px', color: '#4caf50', fontWeight: 'bold' }}>
                  • الدرجة: {course.grade}
                </span>
              )}
              <span style={{ marginLeft: '8px', color: '#333679', fontWeight: 'bold' }}>
                • التقدم: {Math.round(actualProgress)}%
              </span>
              {course.enrollment_date && (
                <span style={{ marginLeft: '8px', color: '#999', fontSize: '12px' }}>
                  • مسجل منذ: {new Date(course.enrollment_date).toLocaleDateString('ar-SA')}
                </span>
              )}
            </Typography>
            
            
            {/* Show content summary */}
            {expanded && courseContent.length > 0 && (
              <Typography variant="caption" sx={{ 
                color: '#4caf50', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {courseContent.length} عنصر محتوى متاح
              </Typography>
            )}
            
            {/* Show content breakdown */}
            {expanded && courseContent.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {(() => {
                  const contentTypes = courseContent.reduce((acc, item) => {
                    acc[item.content_type] = (acc[item.content_type] || 0) + 1;
                    return acc;
                  }, {});
                  
                  return Object.entries(contentTypes).map(([type, count]) => (
                    <Chip
                      key={type}
                      label={`${count} ${getContentTypeLabel(type)}`}
                      size="small"
                      sx={{
                        bgcolor: getContentTypeColor(type),
                        color: 'white',
                        fontSize: '10px',
                        height: 20
                      }}
                    />
                  ));
                })()}
              </Box>
            )}
            
            
            {/* Show last updated time */}
            {expanded && courseContent.length > 0 && (
              <Typography variant="caption" sx={{ 
                color: '#999', 
                fontSize: '10px',
                fontStyle: 'italic'
              }}>
                آخر تحديث: {new Date().toLocaleTimeString('en-US')}
              </Typography>
            )}
            
            {/* Show error message if content failed to load */}
            {expanded && courseContent.length === 0 && !loadingContent && (
              <Typography variant="caption" sx={{ 
                color: '#f44336', 
                fontSize: '11px',
                fontStyle: 'italic'
              }}>
                فشل في تحميل محتوى الكورس. يرجى المحاولة مرة أخرى.
              </Typography>
            )}
            
            {/* Show retry button if content failed to load */}
            {expanded && courseContent.length === 0 && !loadingContent && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleExpandClick}
                sx={{
                  mt: 1,
                  fontSize: '10px',
                  py: 0.5,
                  px: 2,
                  minWidth: 'auto'
                }}
              >
                إعادة المحاولة
              </Button>
            )}
            
            {/* Show loading indicator */}
            {loadingContent && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={16} sx={{ color: '#7c4dff' }} />
                <Typography variant="caption" sx={{ 
                  color: '#666', 
                  fontSize: '11px'
                }}>
                  جاري تحميل المحتوى...
                </Typography>
              </Box>
            )}
            
            
            {/* Show content types preview */}
            {!expanded && courseContent.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                {(() => {
                  const contentTypes = courseContent.reduce((acc, item) => {
                    acc[item.content_type] = (acc[item.content_type] || 0) + 1;
                    return acc;
                  }, {});
                  
                  return Object.entries(contentTypes).slice(0, 3).map(([type, count]) => (
                    <Chip
                      key={type}
                      label={`${count} ${getContentTypeLabel(type)}`}
                      size="small"
                      sx={{
                        bgcolor: getContentTypeColor(type),
                        color: 'white',
                        fontSize: '9px',
                        height: 18
                      }}
                    />
                  ));
                })()}
                {Object.keys(courseContent.reduce((acc, item) => {
                  acc[item.content_type] = (acc[item.content_type] || 0) + 1;
                  return acc;
                }, {})).length > 3 && (
                  <Typography variant="caption" sx={{ 
                    color: '#999', 
                    fontSize: '9px',
                    alignSelf: 'center'
                  }}>
                    +{Object.keys(courseContent.reduce((acc, item) => {
                      acc[item.content_type] = (acc[item.content_type] || 0) + 1;
                      return acc;
                    }, {})).length - 3} أكثر
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Show progress preview */}
            {!expanded && courseContent.length > 0 && (
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="caption" sx={{ 
                  color: '#333679', 
                  fontSize: '10px',
                  fontWeight: 500
                }}>
                  التقدم: {Math.round((courseContent.filter(item => item.completed).length / courseContent.length) * 100)}% مكتمل
                </Typography>
              </Box>
            )}
            
            
            
            {/* Show loading preview */}
            {!expanded && loadingContent && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <CircularProgress size={12} sx={{ color: '#7c4dff' }} />
                <Typography variant="caption" sx={{ 
                  color: '#666', 
                  fontSize: '10px'
                }}>
                  جاري التحميل...
                </Typography>
              </Box>
            )}
            
            
            
      </Box>
          
        <Button 
          variant="contained" 
          sx={{
              bgcolor: course.status === 'completed' ? '#4caf50' : '#2196f3',
              color: 'white',
              borderRadius: '8px',
              px: 3,
              py: 1,
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 100,
              alignSelf: 'flex-start',
              mt: 2,
            '&:hover': { 
                bgcolor: course.status === 'completed' ? '#45a049' : '#663399'
            }
          }}
            onClick={(e) => {
            e.stopPropagation();
            onClick(course.id);
          }}
        >
            {course.status === 'completed' ? 'مراجعة' : actualProgress > 0 ? 'متابعة' : 'ابدأ'}
        </Button>
        </Box>
        
        {/* Expand/Collapse Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 2,
          borderTop: '1px solid #f0f0f0',
          pt: 2,
          bgcolor: '#fafafa'
        }}>
          <IconButton
            onClick={handleExpandClick}
            sx={{
              color: '#666',
              border: 'none',
              outline: 'none',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)'
              },
              '&:focus': {
                outline: 'none',
                border: 'none'
              }
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Course Content Dropdown */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ 
          borderTop: '1px solid #f0f0f0',
          bgcolor: '#fafafa'
        }}>
          {loadingContent ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={24} sx={{ color: '#7c4dff' }} />
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                جاري تحميل محتوى الكورس...
              </Typography>
            </Box>
          ) : courseContent.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: '#666' }}>
              <SchoolIcon sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                لا يوجد محتوى متاح لهذا الكورس حالياً
              </Typography>
              <Typography variant="caption" sx={{ color: '#999' }}>
                سيتم إضافة المحتوى قريباً
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {courseContent.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        checked={item.completed}
                        sx={{
                          p: 0.5,
                          '&.Mui-checked': {
                            color: '#4caf50'
                          }
                        }}
                      />
                    </ListItemIcon>
                    
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {getContentTypeIcon(item.type, item.content_type)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={getContentTypeLabel(item.content_type)}
                            size="small"
                            sx={{
                              bgcolor: getContentTypeColor(item.content_type),
                              color: 'white',
                              fontSize: '11px',
                              height: 20,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ fontSize: '14px', color: '#333' }}>
                            {item.title}
                          </Typography>
                          {item.module_title && (
                            <Typography variant="caption" sx={{ 
                              fontSize: '11px', 
                              color: '#999',
                              ml: 1,
                              fontStyle: 'italic'
                            }}>
                              ({item.module_title})
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Show progress for assignments, quizzes, and exams */}
                      {(item.content_type === 'assignment' || item.content_type === 'quiz' || item.content_type === 'exam') && item.progress !== undefined ? (
                        <>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '12px' }}>
                            {item.content_type === 'assignment' && item.grade ? 
                              `${item.grade}/${item.max_grade}` : 
                              item.duration || `${Math.round(item.progress)}%`
                            }
                          </Typography>
                          <Box sx={{ width: 40, height: 4, bgcolor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ 
                              width: `${item.progress}%`, 
                              height: '100%', 
                              bgcolor: getContentTypeColor(item.content_type),
                              borderRadius: 2
                            }} />
                          </Box>
                        </>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '12px' }}>
                          {item.content_type === 'resource' 
                            ? 'تحميل الملف' 
                            : item.duration || '--:--'
                          }
                        </Typography>
                      )}
                      <IconButton 
                        size="small" 
                        sx={{ color: '#999' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContentClick(item);
                        }}
                      >
                        {getContentActionIcon(item)}
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < courseContent.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Collapse>
  </Card>
  );
};

const CompletedCourseCard = ({ course }) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        mb: 2,
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #f0f0f0',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid #e0e0e0'
        }
      }}
    >
      {/* Completion Badge */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 2,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
        border: '3px solid white',
        animation: 'pulse 2s infinite',
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
          },
          '50%': {
            boxShadow: '0 6px 24px rgba(76, 175, 80, 0.6)',
            transform: 'scale(1.05)',
          },
          '100%': {
            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
          },
        },
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 8px 32px rgba(76, 175, 80, 0.6)',
        }
      }}>
        <CheckCircleIcon sx={{ 
          color: 'white', 
          fontSize: 28,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }} />
      </Box>

      {/* Course Image */}
      <CardMedia
        component="img"
        image={course.image || course.thumbnail || '/static/images/blank.png'}
        alt={course.title}
        sx={{
          maxWidth: '100%',
          height: '200px',
          width: '350px',
          objectFit: 'cover',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)'
        }}
      />

      {/* Course Content */}
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category */}
        {course.category && (
          <Chip 
            label={course.category} 
            size="small"
            sx={{ 
              bgcolor: '#f5f5f5', 
              color: '#666', 
              fontSize: '11px',
              height: 24,
              mb: 1.5,
              alignSelf: 'flex-start'
            }} 
          />
        )}

        {/* Course Title */}
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: '#333',
          mb: 0.5,
          fontSize: '16px',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.title}
        </Typography>

        {/* Course Description */}
        {course.description && (
          <Typography variant="body2" sx={{ 
            color: '#666', 
            mb: 1,
            fontSize: '12px',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}>
            {course.description}
          </Typography>
        )}

        {/* Instructor */}
        {course.instructor && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <SchoolIcon sx={{ fontSize: 14, color: '#999' }} />
            <Typography variant="caption" sx={{ color: '#999', fontSize: '11px' }}>
              {course.instructor}
            </Typography>
          </Box>
        )}

        {/* Completion Info */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 1.5,
          bgcolor: '#f8fff8',
          borderRadius: '8px',
          border: '1px solid #e8f5e8',
          mb: 1
        }}>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
            مكتمل
          </Typography>
          {course.grade && (
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 700, fontSize: '12px' }}>
              {course.grade}
            </Typography>
          )}
        </Box>

        {/* Completion Date */}
        {course.completion_date && (
          <Typography variant="caption" sx={{ 
            color: '#999', 
            fontSize: '10px',
            mb: 1,
            textAlign: 'center'
          }}>
            تم الإكمال في: {new Date(course.completion_date).toLocaleDateString('en-US')}
          </Typography>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<SchoolIcon />}
            onClick={() => window.open('http://localhost:5173/student/certificates', '_blank')}
            sx={{
              bgcolor: '#4caf50',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              py: 0.5,
              px: 2,
              textTransform: 'none',
              flex: 1,
              '&:hover': { 
                bgcolor: '#45a049',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
              }
            }}
          >
            عرض الشهادة
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => window.open(`http://localhost:5173/student/courses/${course.id}`, '_blank')}
            sx={{
              color: '#333679',
              borderColor: '#333679',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              py: 0.5,
              px: 2,
              textTransform: 'none',
              flex: 1,
              '&:hover': { 
                bgcolor: 'rgba(51, 54, 121, 0.1)',
                borderColor: '#333679',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(51, 54, 121, 0.2)'
              }
            }}
          >
            عرض الكورس
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

// Module Lessons Component
const ModuleLessons = ({ moduleId, lessons = [], course = null }) => {
  const [localLessons, setLocalLessons] = useState([]);
  const [loading, setLoading] = useState(false);

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

          {/* Lesson Title */}
          <Box sx={{ flex: 1, mr: 2 }}>
              <Typography 
              variant="body2" 
                sx={{ 
                fontWeight: 500, 
                color: '#333',
                fontSize: '14px'
                }}
              >
                {lesson.title}
              </Typography>
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
      setModules(modulesData);

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
                          {module.lessons ? `${module.lessons.length} درس` : '0 درس'} • {module.video_duration ? `${Math.floor(module.video_duration / 60)}د ${module.video_duration % 60}ث` : '0د'} مدة التشغيل
                        </Typography>
                      </Box>
                      
                      {/* Start Button */}
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/student/courses/${course.id}/tracking?tab=modules&moduleId=${module.id}`)}
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
                        <span>عرض جميع الدروس الـ {module.lessons ? module.lessons.length : 0}</span>
                        {expandedModules[module.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Button>
                      
                      <Collapse in={expandedModules[module.id]} timeout="auto" unmountOnExit>
                        <ModuleLessons moduleId={module.id} lessons={module.lessons || []} course={course} />
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
                                            onClick={() => navigate(`/student/courses/${course.id}/tracking?tab=questions&moduleId=${moduleData.module_id}`)}
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
                          onClick={() => navigate(`/student/courses/${course.id}/tracking?tab=flashcards&moduleId=${moduleData.module_id}`)}
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
    // Clear the courseId parameter from URL
    navigate('/student/my-courses', { replace: true });
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'white',
        py: 0,
        px: 0
      }}
    >
      {/* Compact Header */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        background: 'linear-gradient(135deg, #333679 0%, #4DBFB3 100%)',
        borderRadius: 3,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute', 
          top: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: -30, 
          left: -30, 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.08)',
          zIndex: 1
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
              كورساتي
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
            استكشف، تعلم، وحقق أهدافك التعليمية بسهولة واحترافية
          </Typography>
        </Box>
      </Box>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant={tab === 0 ? 'contained' : 'outlined'}
            onClick={() => setTab(0)}
          sx={{ 
              mx: 1,
              bgcolor: tab === 0 ? '#333679' : '#fff',
              color: tab === 0 ? '#fff' : '#333679',
              borderColor: '#333679',
              fontWeight: 700,
              borderRadius: 3,
              px: 4,
              py: 1.2,
              boxShadow: tab === 0 ? '0 2px 12px 0 rgba(14, 81, 129, 0.2)' : 'none',
              '&:hover': { bgcolor: 'rgba(14, 81, 129, 0.1)', color: '#333679' }
            }}
          >
            الكورسات المسجلة ({enrolledCourses.length})
          </Button>
          <Button
            variant={tab === 1 ? 'contained' : 'outlined'}
            onClick={() => setTab(1)}
                  sx={{ 
              mx: 1,
              bgcolor: tab === 1 ? '#4DBFB3' : '#fff',
              color: tab === 1 ? '#fff' : '#4DBFB3',
              borderColor: '#4DBFB3',
              fontWeight: 700,
              borderRadius: 3,
              px: 4,
              py: 1.2,
              boxShadow: tab === 1 ? '0 2px 12px 0 rgba(229, 151, 139, 0.2)' : 'none',
              '&:hover': { bgcolor: 'rgba(229, 151, 139, 0.1)', color: '#4DBFB3' }
            }}
          >
            الكورسات المكتملة ({completedCourses.length})
          </Button>
        </Box>
        <Box>
          {tab === 0
            ? (enrolledCourses.length > 0
                ? enrolledCourses.map(course => (
                    <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
                  ))
                : <EmptyState isCompleted={false} />)
            : (completedCourses.length > 0
                ? (
                    <Grid container spacing={3}>
                      {completedCourses.map(course => (
                        <Grid item xs={12} sm={6} md={6} key={course.id}>
                          <CompletedCourseCard course={course} />
                        </Grid>
                      ))}
                    </Grid>
                  )
                : <EmptyState isCompleted={true} />)
          }
        </Box>
    </Container>
    </Box>
  );
};

export default MyCourses;
