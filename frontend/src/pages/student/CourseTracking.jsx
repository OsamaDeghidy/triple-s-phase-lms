import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  LinearProgress, 
  CircularProgress,
  TextField,
  Chip, 
  IconButton, 
  Divider, 
  Button,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  useTheme,
  useMediaQuery,
  alpha,
  keyframes,
  Tooltip,
  linearProgressClasses,
  Tabs,
  Tab,
  Drawer,
  AppBar,
  Toolbar,
  InputBase,
  Fab,
  Zoom,
  Fade,
  Slide,
  Grow,
  Modal,
  Backdrop,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  PlayCircleOutline, 
  PlayArrow,
  Close as CloseIcon,
  Pause,
  Fullscreen,
  FullscreenExit,
  VolumeUp,
  VolumeOff,
  Speed as SpeedIcon,
  ClosedCaption,
  Settings,
  PictureInPicture,
  CheckCircle, 
  CheckCircleOutline, 
  ExpandMore, 
  ExpandLess,
  BookmarkBorder,
  Bookmark,
  AccessTime,
  MenuBook,
  Quiz,
  VideoLibrary,
  Star,
  StarBorder,
  StarHalf,
  ArrowBack,
  ArrowForward,
  DescriptionOutlined,
  School,
  Timeline,
  LocalLibrary,
  Speed,
  InsertChart,
  CalendarToday,
  HourglassEmpty,
  CheckCircle as CheckCircleIcon,
  Menu,
  Close,
  NoteAlt,
  Download,
  Share,
  MoreVert,
  Subscriptions,
  ThumbUp,
  ThumbUpOutlined,
  ForumOutlined,
  NoteAltOutlined,
  DownloadOutlined,
  ShareOutlined,
  MoreVertOutlined,
  CloudOff,
  Forum,
  ChevronRight,
  ChevronLeft,
  PictureAsPdf,
  Image,
  TableChart,
  TextSnippet,
  Code,
  AudioFile,
  VideoFile,
  Archive,
  InsertDriveFile,
  Visibility,
  OpenInNew,
  Search,
} from '@mui/icons-material';
import { Quiz as QuizIcon } from '@mui/icons-material';
import QuizStart from './quiz/QuizStart';
import QuizResult from './quiz/QuizResult';
import { courseAPI } from '../../services/api.service';
import { API_CONFIG } from '../../config/api.config';
// Force reload

// Simple video player component to replace ReactPlayer
const VideoPlayer = ({ url, playing, onPlay, onPause, onProgress, onDuration, width, height, style, lessonData }) => {
  const videoRef = React.useRef(null);

  // Process URL to ensure it's absolute (for videos)
  const processVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;
    
    // If it's already a full URL, return as is
    if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
      return videoUrl;
    }
    
    // If it starts with /media/ or /static/, make it absolute
    if (videoUrl.startsWith('/media/') || videoUrl.startsWith('/static/')) {
      return `${API_CONFIG.baseURL}${videoUrl}`;
    }
    
    // If it's a relative path, assume it's in media
    if (!videoUrl.startsWith('/')) {
      return `${API_CONFIG.baseURL}/media/${videoUrl}`;
    }
    
    return videoUrl;
  };
  
  const processedUrl = processVideoUrl(url);
  
  // Debug logging
  console.log('VideoPlayer - Original URL:', url);
  console.log('VideoPlayer - Processed URL:', processedUrl);
  console.log('VideoPlayer - isValidVideoUrl:', processedUrl && (
    processedUrl.includes('.mp4') || 
    processedUrl.includes('.webm') || 
    processedUrl.includes('.ogg') || 
    processedUrl.includes('.avi') ||
    processedUrl.includes('.mov') ||
    processedUrl.includes('.wmv') ||
    processedUrl.includes('.flv') ||
    processedUrl.includes('blob:') ||
    processedUrl.startsWith('http://') ||
    processedUrl.startsWith('https://')
  ));

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => onPlay && onPlay();
    const handlePause = () => onPause && onPause();
    const handleTimeUpdate = () => {
      if (onProgress && video.duration) {
        onProgress({
          played: video.currentTime / video.duration,
          playedSeconds: video.currentTime,
          loaded: 1,
          loadedSeconds: video.duration,
        });
      }
    };
    const handleDuration = () => onDuration && onDuration(video.duration);
    const handleLoadedMetadata = () => onDuration && onDuration(video.duration);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDuration);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDuration);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onPlay, onPause, onProgress, onDuration]);

  React.useEffect(() => {
    if (!videoRef.current) return;
    
    if (playing) {
      videoRef.current.play().catch(e => console.error('Error playing video:', e));
    } else {
      videoRef.current.pause();
    }
  }, [playing]);

  // Check if URL is valid
  const isValidVideoUrl = processedUrl && (
    processedUrl.includes('.mp4') || 
    processedUrl.includes('.webm') || 
    processedUrl.includes('.ogg') || 
    processedUrl.includes('.avi') ||
    processedUrl.includes('.mov') ||
    processedUrl.includes('.wmv') ||
    processedUrl.includes('.flv') ||
    processedUrl.includes('blob:') ||
    processedUrl.startsWith('http://') ||
    processedUrl.startsWith('https://')
  );


  if (!isValidVideoUrl) {
    return (
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: 'white',
        flexDirection: 'column',
        gap: 2,
        padding: 2
      }}>
        {/* عرض محتوى الدرس مباشرة */}
        {lessonData?.content ? (
          <Box sx={{ 
            width: '100%',
            height: '100%',
            p: 3,
            overflow: 'auto',
            bgcolor: 'rgba(255,255,255,0.95)',
            color: 'text.primary'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'right',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mb: 2
                },
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pr: 2,
                  mb: 2
                },
                '& li': {
                  mb: 1
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  boxShadow: 2
                },
                '& blockquote': {
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  pl: 2,
                  fontStyle: 'italic',
                  bgcolor: 'grey.50',
                  p: 2,
                  borderRadius: 1,
                  mb: 2
                },
                '& code': {
                  bgcolor: 'grey.100',
                  px: 1,
                  py: 0.5,
                  borderRadius: 0.5,
                  fontFamily: 'monospace'
                },
                '& pre': {
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  mb: 2
                }
              }}
              dangerouslySetInnerHTML={{ __html: lessonData.content }}
            />
          </Box>
        ) : (
          <>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
              لا يوجد محتوى متاح
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', opacity: 0.7 }}>
              {url ? `رابط الفيديو غير صحيح أو غير مدعوم` : 'لم يتم توفير رابط الفيديو أو محتوى'}
            </Typography>
          </>
        )}
        {url && (
          <Typography variant="caption" sx={{ color: 'white', textAlign: 'center', opacity: 0.5, wordBreak: 'break-all' }}>
            الرابط الأصلي: {url}
          </Typography>
        )}
        {processedUrl && processedUrl !== url && (
          <Typography variant="caption" sx={{ color: 'white', textAlign: 'center', opacity: 0.5, wordBreak: 'break-all' }}>
            الرابط المعالج: {processedUrl}
          </Typography>
        )}
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={processedUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          ...style
        }}
        controls
        playsInline
        preload="metadata"
        onError={(e) => {
          console.error('Video error:', e);
          console.error('Video src (original):', url);
          console.error('Video src (processed):', processedUrl);
          console.error('Video error details:', e.target.error);
        }}
        onLoadStart={() => {
          console.log('Video load started for URL:', processedUrl);
        }}
        onLoadedData={() => {
          console.log('Video data loaded for URL:', processedUrl);
        }}
        onCanPlay={() => {
          console.log('Video can play for URL:', processedUrl);
        }}
      />
    </>
  );
};



// Animation
// Styled Components
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundImage: 'linear-gradient(45deg, #3f51b5, #2196f3)',
  },
}));

const ProgressCircle = styled(CircularProgress)({
  position: 'relative',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  },
});

const ProgressText = styled(Typography)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontWeight: 'bold',
});

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 30, 46, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeIn} 0.5s ease-out forwards`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

const ModuleCard = styled(Card)(({ theme, active }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: active 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(63, 81, 181, 0.15)' 
      : 'rgba(63, 81, 181, 0.05)'
    : 'transparent',
  borderLeft: `4px solid ${active ? theme.palette.primary.main : 'transparent'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderLeft: `4px solid ${theme.palette.primary.light}`,
    background: theme.palette.mode === 'dark' 
      ? 'rgba(63, 81, 181, 0.2)' 
      : 'rgba(63, 81, 181, 0.08)',
    transform: 'translateX(4px)',
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: value === 100 
      ? `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
      : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
  },
}));

// Helper function to find the next incomplete lesson
const findNextIncompleteLesson = (modules) => {
  for (const module of modules) {
    const incompleteLesson = module.lessons.find(lesson => !lesson.completed);
    if (incompleteLesson) {
      return { module, lesson: incompleteLesson };
    }
  }
  return null;
};

// Calculate course statistics
const calculateCourseStats = (modules) => {
  const totalLessons = modules.reduce(
    (sum, module) => sum + module.lessons.length, 0
  );
  const completedLessons = modules.reduce(
    (sum, module) => sum + module.lessons.filter(lesson => lesson.completed).length, 0
  );
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
  const totalDuration = modules.reduce(
    (sum, module) => sum + module.lessons.reduce(
      (moduleSum, lesson) => moduleSum + parseInt(lesson.duration), 0
    ), 0
  );
  
  return {
    totalLessons,
    completedLessons,
    completionPercentage,
    totalDuration: Math.round(totalDuration / 60) // Convert to hours
  };
};

// Get module icon based on module ID
const getModuleIcon = (moduleId) => {
  const icons = [
    <School color="primary" />,
    <LocalLibrary color="secondary" />,
    <Timeline color="success" />,
    <Speed color="warning" />,
    <InsertChart color="info" />,
    <EmojiEvents color="error" />
  ];
  // Convert moduleId to string and ensure it's valid before using charCodeAt
  const moduleIdStr = String(moduleId || 0);
  return icons[moduleIdStr.charCodeAt(1) % icons.length];
};

// Get lesson icon based on lesson type
const getLessonIcon = (type) => {
  switch(type) {
    case 'video':
      return <VideoLibrary color="primary" />;
    case 'quiz':
      return <Quiz color="secondary" />;
    case 'assignment':
      return <Assignment color="warning" />;
    default:
      return <MenuBook color="action" />; // Course Content Component
  }
};

// Get file icon based on file type
const getFileIcon = (fileName, fileType) => {
  const extension = fileName ? fileName.split('.').pop().toLowerCase() : '';
  
  // Check by file type first
  if (fileType) {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return <Image sx={{ color: '#663399' }} />;
      case 'video':
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
        return <VideoFile sx={{ color: '#388e3c' }} />;
      case 'audio':
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'aac':
        return <AudioFile sx={{ color: '#f57c00' }} />;
      case 'document':
      case 'doc':
      case 'docx':
        return <TextSnippet sx={{ color: '#663399' }} />;
      case 'excel':
      case 'xls':
      case 'xlsx':
        return <TableChart sx={{ color: '#388e3c' }} />;
      case 'powerpoint':
      case 'ppt':
      case 'pptx':
        return <DescriptionOutlined sx={{ color: '#d32f2f' }} />;
      case 'code':
      case 'txt':
      case 'js':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
        return <Code sx={{ color: '#7b1fa2' }} />;
      case 'archive':
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <Archive sx={{ color: '#5d4037' }} />;
      default:
        return <InsertDriveFile sx={{ color: '#757575' }} />;
    }
  }
  
  // Check by file extension
  switch (extension) {
    case 'pdf':
      return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'svg':
      return <Image sx={{ color: '#663399' }} />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
    case 'mkv':
      return <VideoFile sx={{ color: '#388e3c' }} />;
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'aac':
    case 'flac':
      return <AudioFile sx={{ color: '#f57c00' }} />;
    case 'doc':
    case 'docx':
      return <TextSnippet sx={{ color: '#663399' }} />;
    case 'xls':
    case 'xlsx':
      return <TableChart sx={{ color: '#388e3c' }} />;
    case 'ppt':
    case 'pptx':
      return <DescriptionOutlined sx={{ color: '#d32f2f' }} />;
    case 'txt':
    case 'js':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'php':
    case 'json':
    case 'xml':
      return <Code sx={{ color: '#7b1fa2' }} />;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return <Archive sx={{ color: '#5d4037' }} />;
    default:
      return <InsertDriveFile sx={{ color: '#757575' }} />;
  }
};

// Get file type color
const getFileTypeColor = (fileName, fileType) => {
  const extension = fileName ? fileName.split('.').pop().toLowerCase() : '';
  
  if (fileType) {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return '#d32f2f';
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return '#663399';
      case 'video':
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
        return '#388e3c';
      case 'audio':
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'aac':
        return '#f57c00';
      case 'document':
      case 'doc':
      case 'docx':
        return '#663399';
      case 'excel':
      case 'xls':
      case 'xlsx':
        return '#388e3c';
      case 'powerpoint':
      case 'ppt':
      case 'pptx':
        return '#d32f2f';
      case 'code':
      case 'txt':
      case 'js':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
        return '#7b1fa2';
      case 'archive':
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return '#5d4037';
      default:
        return '#757575';
    }
  }
  
  switch (extension) {
    case 'pdf':
      return '#d32f2f';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'svg':
      return '#663399';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
    case 'mkv':
      return '#388e3c';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'aac':
    case 'flac':
      return '#f57c00';
    case 'doc':
    case 'docx':
      return '#663399';
    case 'xls':
    case 'xlsx':
      return '#388e3c';
    case 'ppt':
    case 'pptx':
      return '#d32f2f';
    case 'txt':
    case 'js':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'php':
    case 'json':
    case 'xml':
      return '#7b1fa2';
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return '#5d4037';
    default:
      return '#757575';
  }
};

const CourseContent = ({ modules, expandedModule, onModuleClick, onLessonClick, currentLessonId, setActiveQuizId, setOpenQuiz, setShowQuizResult, quizzes }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('lessons');
  
  return (
    <Box 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255,255,255,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '3px',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          color: 'white'
        }}>
          <MenuBook sx={{ ml: 1, color: 'white' }} />
          محتوى الدورة
        </Typography>
        
        {/* Tabs for different content types */}
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 40,
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'none',
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              }
            },
            '& .Mui-selected': {
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.15)',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: 3,
            }
          }}
        >
          <Tab 
            label={`All`} 
            value="lessons"
          />
          <Tab 
            label={`Videos`} 
            value="videos"
          />
          <Tab 
            label={`Quizzes`} 
            value="quizzes"
          />
        </Tabs>
        
        {/* Search Bar */}
        <Box sx={{ mt: 2 }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <Search sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />,
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                  opacity: 1,
                },
              }
            }}
          />
        </Box>
      </Box>
      
      {/* Tab Content */}
      {activeTab === 'lessons' && (
        <List sx={{ p: 0 }}>
          {(modules || []).map((module, moduleIndex) => (
          <React.Fragment key={module.id}>
            <ListItem 
              component="div"
              onClick={() => onModuleClick(module.id)}
              sx={{
                bgcolor: expandedModule === module.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon>
                <Box 
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #333679 0%, #4DBFB3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(14, 81, 129, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                      borderRadius: 2,
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #333679 0%, #4DBFB3 100%)',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                        }
                      }}
                    />
                  </Box>
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold', 
                    textAlign: 'left', 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}>
                    {module.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ 
                    textAlign: 'left', 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 0.5, 
                    justifyContent: 'flex-start',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.75rem'
                  }}>
                    {module.completedLessons} of {module.totalLessons} lessons
                  </Typography>
                }
                sx={{ ml: 1 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 60, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={module.progress} 
                    sx={{ 
                      height: 4, 
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)',
                      }
                    }} 
                  />
                </Box>
                <Box 
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: expandedModule === module.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  {expandedModule === module.id ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                </Box>
              </Box>
            </ListItem>
            
            <Collapse in={expandedModule === module.id} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {(module.lessons || []).map((lesson, lessonIndex) => (
                  <ListItem
                    key={lesson.id}
                    component="div"
                    selected={currentLessonId === lesson.id}
                    onClick={() => onLessonClick(module.id, lesson.id)}
                    sx={{
                      pl: 4,
                      pr: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      bgcolor: currentLessonId === lesson.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {lesson.completed ? (
                        <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                      ) : (
                        <Box 
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {lessonIndex + 1}
                        </Box>
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: currentLessonId === lesson.id ? 'bold' : 'normal',
                            color: currentLessonId === lesson.id ? 'white' : 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: '0.85rem'
                          }}
                        >
                          {lesson.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" sx={{ 
                            fontSize: '0.7rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            mt: 0.5, 
                            gap: 1,
                            color: 'rgba(255,255,255,0.6)'
                          }}>
                            <span>{lesson.duration}</span>
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton size="small" edge="end" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      <PlayCircleOutline sx={{ fontSize: 18 }} />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
        </List>
      )}


      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <List sx={{ p: 0 }}>
          {quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <ListItem
                key={quiz.id || index}
                sx={{
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon>
                  <Box 
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <Quiz sx={{ fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold', 
                      textAlign: 'left', 
                      color: 'white',
                      fontSize: '0.9rem'
                    }}>
                      {quiz.title || quiz.name || `Quiz ${index + 1}`}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="caption" sx={{ 
                        textAlign: 'left', 
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.75rem'
                      }}>
                        {quiz.description || 'No description available'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, justifyContent: 'flex-start' }}>
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.7rem'
                        }}>
                          Points: {quiz.total_points || quiz.points || 'N/A'}
                        </Typography>
                        {quiz.time_limit && (
                          <>
                            <Typography variant="caption" sx={{ mx: 1, color: 'rgba(255,255,255,0.6)' }}>•</Typography>
                            <Typography variant="caption" sx={{ 
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.7rem'
                            }}>
                              Duration: {quiz.time_limit} min
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  }
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<QuizIcon sx={{ fontSize: '0.8rem' }} />}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    px: 1.5,
                    py: 0.5,
                    minWidth: 'auto',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                  onClick={() => {
                    setActiveQuizId && setActiveQuizId(quiz.id);
                    setOpenQuiz && setOpenQuiz(true);
                    setShowQuizResult && setShowQuizResult(false);
                  }}
                >
                  Start Quiz
                </Button>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText 
                primary={
                  <Typography variant="body2" sx={{ 
                    textAlign: 'center', 
                    py: 2,
                    color: 'rgba(255,255,255,0.7)'
                  }}>
                    No quizzes available for this course
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      )}

                  </Box>
  );
};

const CourseTracking = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedModule, setExpandedModule] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedLessons, setBookmarkedLessons] = useState({});
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const playerRef = useRef(null);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeAttemptId, setActiveAttemptId] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [imagePreview, setImagePreview] = useState({ open: false, url: '', title: '' });
  
  // Fetch course data on component mount
  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);


  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!courseId) {
        setError('معرف الدورة غير صحيح');
        setIsLoading(false);
        return;
      }
      
      const response = await courseAPI.getCourseTrackingData(courseId);
      
      // Debug: Log the full response
      console.log('Full API Response:', response);
      console.log('Course modules:', response?.course?.modules);
      
      // Check if response has required data
      if (!response || !response.course) {
        setError('بيانات الدورة غير متاحة');
        setIsLoading(false);
        return;
      }
      
      // Transform API data to match component structure
      const transformedData = {
        id: response.course.id,
        title: response.course.title,
        instructor: response.course.instructor,
        instructorAvatar: response.course.instructor_avatar,
        category: response.course.category,
        level: response.course.level,
        duration: response.course.duration,
        progress: response.course.overall_progress,
        rating: response.course.rating,
        totalStudents: response.course.total_students,
        lastAccessed: {
          moduleId: response.course.modules[0]?.id || 'm1',
          lessonId: response.course.modules[0]?.lessons[0]?.id || 'l1',
          title: response.course.modules[0]?.lessons[0]?.title || 'الدرس الأول',
          duration: response.course.modules[0]?.lessons[0]?.duration_minutes || 15,
          completion: response.course.completed_lessons
        },
        enrolledDate: response.enrollment?.enrollment_date,
        hasFinalExam: response.course.has_final_exam,
        modules: (response.course.modules || []).map(module => ({
          id: module.id,
          title: module.name,
          progress: module.progress,
          totalLessons: module.total_lessons,
          completedLessons: module.completed_lessons,
          lessons: (module.lessons || []).map(lesson => {
            // Debug: Log lesson data
            console.log('Lesson data:', lesson);
            console.log('Lesson video_url:', lesson.video_url);
            console.log('Lesson video_file:', lesson.video_file);
            console.log('Lesson file_url:', lesson.file_url);
            console.log('Lesson resources:', lesson.resources);
            
            // Find video resource if no direct video_url
            let videoUrl = lesson.video_url;
            if (!videoUrl && lesson.resources) {
              const videoResource = lesson.resources.find(resource => 
                resource.resource_type === 'video' || 
                (resource.file_url && (
                  resource.file_url.includes('.mp4') || 
                  resource.file_url.includes('.webm') || 
                  resource.file_url.includes('.mov') ||
                  resource.file_url.includes('.avi')
                ))
              );
              if (videoResource) {
                videoUrl = videoResource.file_url || videoResource.url;
              }
            }
            
            console.log('Final videoUrl for lesson:', lesson.id, ':', videoUrl);
            
            return {
              id: lesson.id,
              title: lesson.title,
              duration: `${Math.floor(lesson.duration_minutes / 60)}:${(lesson.duration_minutes % 60).toString().padStart(2, '0')}`,
              type: lesson.lesson_type,
              completed: lesson.completed,
              videoUrl: videoUrl,
              content: lesson.content,
              resources: lesson.resources || []
            };
          })
        })),
        quizzes: response.quizzes || []
      };
      
      // Debug: Log transformed data
      console.log('Transformed course data:', transformedData);
      console.log('First module lessons:', transformedData.modules?.[0]?.lessons);
      
      setCourseData(transformedData);
      
      // Set initial expanded module to first module
      if (transformedData.modules && transformedData.modules.length > 0) {
        setExpandedModule(transformedData.modules[0].id);
      }
      
      // Set initial current lesson
      if (transformedData.modules && transformedData.modules.length > 0 && 
          transformedData.modules[0].lessons && transformedData.modules[0].lessons.length > 0) {
        const firstLesson = transformedData.modules[0].lessons[0];
        console.log('Setting current lesson:', firstLesson);
        console.log('Current lesson videoUrl:', firstLesson.videoUrl);
        setCurrentLesson({
          moduleId: transformedData.modules[0].id,
          lessonId: firstLesson.id,
          ...firstLesson
        });
      }
      
    } catch (err) {
      console.error('Error fetching course data:', err);
      if (err.response?.status === 404) {
        setError('الدورة غير موجودة أو غير متاحة لك.');
      } else if (err.response?.status === 403) {
        setError('أنت غير مسجل في هذه الدورة.');
      } else if (err.response?.status === 401) {
        setError('يرجى تسجيل الدخول مرة أخرى.');
      } else {
        setError('حدث خطأ أثناء جلب بيانات الدورة. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate course statistics
  const courseStats = courseData ? {
    totalLessons: (courseData.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0),
    completedLessons: (courseData.modules || []).reduce((sum, module) => sum + (module.completedLessons || 0), 0),
    completionPercentage: courseData.progress || 0,
    totalDuration: courseData.duration || 0,
    totalQuizzes: (courseData.quizzes || []).length,
    remainingLessons: (courseData.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0) - (courseData.modules || []).reduce((sum, module) => sum + (module.completedLessons || 0), 0)
  } : { totalLessons: 0, completedLessons: 0, completionPercentage: 0, totalDuration: 0, totalQuizzes: 0, remainingLessons: 0 };


  const nextLesson = courseData ? (() => {
    for (const module of (courseData.modules || [])) {
      const incompleteLesson = (module.lessons || []).find(lesson => !lesson.completed);
      if (incompleteLesson) {
        return { module, lesson: incompleteLesson };
      }
    }
    return null;
  })() : null;

  // Handle module expansion
  const handleModuleClick = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  // Handle lesson selection
  const handleLessonClick = (moduleId, lessonId) => {
    const module = (courseData.modules || []).find(m => m.id === moduleId);
    if (module) {
      const lesson = (module.lessons || []).find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLesson({
          moduleId,
          lessonId,
          ...lesson
        });
        setIsPlaying(true);
        if (isMobile) {
          setShowSidebar(false);
        }
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle video progress
  const handleProgress = (state) => {
    setVideoProgress(state.playedSeconds);
  };

  // Handle video duration
  const handleDuration = (duration) => {
    setVideoDuration(duration);
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoProgress(0);
  };

  // Mark lesson as completed
  const markLessonAsCompleted = async () => {
    if (!currentLesson || !courseId) return;
    
    try {
      await courseAPI.markLessonCompleted(courseId, currentLesson.id);
      
      // Update local state
      setCourseData(prevData => {
        const updatedModules = prevData.modules.map(module => {
          if (module.id === currentLesson.moduleId) {
            const updatedLessons = module.lessons.map(lesson => {
              if (lesson.id === currentLesson.id) {
                return { ...lesson, completed: true };
              }
              return lesson;
            });
            return {
              ...module,
              lessons: updatedLessons,
              completedLessons: updatedLessons.filter(l => l.completed).length
            };
          }
          return module;
        });
        
        return {
          ...prevData,
          modules: updatedModules
        };
      });
      
      showSnackbar('تم إكمال الدرس بنجاح!', 'success');
      
      // Auto-advance to next lesson if available
      setTimeout(() => {
        navigateToNextLesson();
      }, 2000);
      
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      showSnackbar('حدث خطأ أثناء إكمال الدرس', 'error');
    }
  };

  // Navigate to next lesson
  const navigateToNextLesson = () => {
    if (!currentLesson || !courseData) return;
    
    const currentModuleIndex = courseData.modules.findIndex(m => m.id === currentLesson.moduleId);
    if (currentModuleIndex >= 0) {
      const currentModule = courseData.modules[currentModuleIndex];
      const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
      
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        // Next lesson in same module
        const nextLesson = currentModule.lessons[currentLessonIndex + 1];
        handleLessonClick(currentModule.id, nextLesson.id);
      } else if (currentModuleIndex < courseData.modules.length - 1) {
        // First lesson of next module
        const nextModule = courseData.modules[currentModuleIndex + 1];
        if (nextModule.lessons.length > 0) {
          const nextLesson = nextModule.lessons[0];
          handleLessonClick(nextModule.id, nextLesson.id);
        }
      }
    }
  };

  // Navigate to previous lesson
  const navigateToPreviousLesson = () => {
    if (!currentLesson || !courseData) return;
    
    const currentModuleIndex = courseData.modules.findIndex(m => m.id === currentLesson.moduleId);
    if (currentModuleIndex >= 0) {
      const currentModule = courseData.modules[currentModuleIndex];
      const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
      
      if (currentLessonIndex > 0) {
        // Previous lesson in same module
        const prevLesson = currentModule.lessons[currentLessonIndex - 1];
        handleLessonClick(currentModule.id, prevLesson.id);
      } else if (currentModuleIndex > 0) {
        // Last lesson of previous module
        const prevModule = courseData.modules[currentModuleIndex - 1];
        if (prevModule.lessons.length > 0) {
          const prevLesson = prevModule.lessons[prevModule.lessons.length - 1];
          handleLessonClick(prevModule.id, prevLesson.id);
        }
      }
    }
  };

  // Process file URL to ensure it's absolute
  const processFileUrl = (fileUrl) => {
    if (!fileUrl) return null;
    
    // If it's already a full URL, return as is
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    
    // If it starts with /media/ or /static/, make it absolute
    if (fileUrl.startsWith('/media/') || fileUrl.startsWith('/static/')) {
      return `${API_CONFIG.baseURL}${fileUrl}`;
    }
    
    // If it's a relative path, assume it's in media
    if (!fileUrl.startsWith('/')) {
      return `${API_CONFIG.baseURL}/media/${fileUrl}`;
    }
    
    return fileUrl;
  };

  // Download resource
  const downloadResource = async (resource) => {
    try {
      const fileUrl = resource.file_url || resource.url;
      if (!fileUrl) {
        showSnackbar('رابط الملف غير متوفر', 'error');
        return;
      }

      const processedUrl = processFileUrl(fileUrl);
      const fileName = resource.title || resource.name || 'ملف';
      
      // Direct download for file resources
      const link = document.createElement('a');
      link.href = processedUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSnackbar('تم بدء تحميل الملف', 'success');
    } catch (error) {
      console.error('Error downloading resource:', error);
      showSnackbar('حدث خطأ أثناء تحميل الملف', 'error');
    }
  };

  // Preview resource
  const previewResource = (resource) => {
    try {
      const fileUrl = resource.file_url || resource.url;
      if (!fileUrl) {
        showSnackbar('رابط الملف غير متوفر', 'error');
        return;
      }

      const processedUrl = processFileUrl(fileUrl);
      const fileName = resource.title || resource.name || 'ملف';
      const extension = fileName.split('.').pop().toLowerCase();
      
      // For images, show in modal preview
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
        setImagePreview({
          open: true,
          url: processedUrl,
          title: fileName
        });
        return;
      }
      
      // For PDFs, open in new tab
      if (extension === 'pdf') {
        window.open(processedUrl, '_blank');
        showSnackbar('تم فتح ملف PDF في نافذة جديدة', 'info');
        return;
      }
      
      // For videos, open in new tab
      if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)) {
        window.open(processedUrl, '_blank');
        showSnackbar('تم فتح الفيديو في نافذة جديدة', 'info');
        return;
      }
      
      // For other files, try to open in new tab
      window.open(processedUrl, '_blank');
      showSnackbar('تم فتح الملف في نافذة جديدة', 'info');
      
    } catch (error) {
      console.error('Error previewing resource:', error);
      showSnackbar('حدث خطأ أثناء معاينة الملف', 'error');
    }
  };

  // Track video progress
  const trackVideoProgress = async (progress) => {
    if (!currentLesson || !courseId) return;
    
    try {
      await courseAPI.trackLessonProgress(courseId, currentLesson.id, {
        content_type: 'video',
        progress_percentage: progress.played * 100,
        current_time: progress.playedSeconds,
        duration: videoDuration
      });
    } catch (error) {
      console.error('Error tracking video progress:', error);
    }
  };

  // Handle video progress with throttling
  const handleProgressWithTracking = (state) => {
    setVideoProgress(state.playedSeconds);
    
    // Track progress every 10 seconds or when video ends
    if (state.playedSeconds % 10 < 1 || state.played >= 0.95) {
      trackVideoProgress(state);
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  const toggleSidebarExpand = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Snackbar handlers
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };





  const toggleBookmark = (lessonId) => {
    setBookmarkedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={60} sx={{ color: '#7c4dff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default',
        flexDirection: 'column',
        gap: 2
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchCourseData}
          sx={{ bgcolor: '#7c4dff' }}
        >
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  if (!courseId) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default',
        flexDirection: 'column',
        gap: 2
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          معرف الدورة غير صحيح
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/student/my-courses')}
          sx={{ bgcolor: '#7c4dff' }}
        >
          العودة إلى كورساتي
        </Button>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <Typography>لا توجد بيانات متاحة</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      
      {/* Mobile App Bar */}
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            sx={{ mr: 1 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {currentLesson?.title || courseData.title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth={false} 
        sx={{ 
          flex: 1, 
          py: { xs: 2, md: 4 }, 
          px: { xs: 1, sm: 2, md: 4 },
          maxWidth: '100%',
          width: '100%',
          margin: 0
        }}
      >
        <Box sx={{ mb: 3, display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}>
            {/* Path/Breadcrumb */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                الرئيسية / الدورات / {courseData.title} / {currentLesson?.title || 'لوحة التتبع'}
              </Typography>
            </Box>
            
            {/* Back Button */}
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate(-1)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              العودة
            </Button>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Sidebar Toggle Button - Fixed on mobile */}
            <Box 
              sx={{ 
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1200,
                display: { xs: 'block', md: 'none' },
                '& .MuiFab-root': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }
              }}
            >
              <Tooltip title={showSidebar ? 'إغلاق القائمة' : 'فتح القائمة'}>
                <Fab 
                  color="primary" 
                  aria-label="عرض المحتوى"
                  onClick={toggleSidebar}
                >
                  {showSidebar ? <Close /> : <MenuBook />}
                </Fab>
              </Tooltip>
            </Box>

            {/* Left Sidebar - Course Content */}
            <Box 
              sx={{
                width: { xs: '100%', md: isSidebarExpanded ? '350px' : '0' },
                flexShrink: 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                position: { xs: 'fixed', md: 'relative' },
                top: { xs: 64, md: 0 },
                bottom: 0,
                right: 0,
                zIndex: 1100,
                height: { xs: showSidebar ? 'calc(100vh - 64px + 200px)' : 0, md: 'calc(100vh + 70px)' },
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                boxShadow: { xs: 3, md: 1 },
                borderRadius: { xs: 0, md: 2 },
                transform: { 
                  xs: showSidebar ? 'translateX(0)' : 'translateX(100%)',
                  md: 'none'
                },
                '&:hover': {
                  boxShadow: { md: 3 },
                }
              }}
            >
              <Box sx={{ 
                p: { xs: 2, md: 2 }, 
                height: 'auto',
                minHeight: 'calc(100%)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                color: 'white'
              }}>
                {/* Header with close and collapse buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3,
                  pt: 1
                }}>
                <IconButton
                  onClick={toggleSidebar}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      }
                  }}
                >
                  <Close />
                </IconButton>
                  
                  <IconButton
                    onClick={toggleSidebarExpand}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                </Box>

                {/* Course Title */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Biology
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                    mt: 0.5
                  }}>
                    Molecules and Fundamentals of Biology
                  </Typography>
                </Box>

                {/* Progress Section */}
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      Lessons Completed
                    </Typography>
                    <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
                      <Settings sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    {courseStats.completedLessons}/{courseStats.totalLessons}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(courseStats.completedLessons / courseStats.totalLessons) * 100}
                    sx={{ 
                      height: 4, 
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)',
                      }
                    }} 
                  />
                </Box>
                
                {/* Scrollable Content */}
                <Box sx={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  pr: 1,
                  maxHeight: 'none',
                  minHeight: 'calc(100% - 200px)',
                  '&::-webkit-scrollbar': { 
                    width: '4px',
                    display: 'none' 
                  },
                  '&:hover': {
                    '&::-webkit-scrollbar': {
                      display: 'block'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px'
                    }
                  },
                  WebkitOverflowScrolling: 'touch'
                }}>
                  <CourseContent
                    modules={courseData.modules}
                    expandedModule={expandedModule}
                    onModuleClick={handleModuleClick}
                    onLessonClick={handleLessonClick}
                    currentLessonId={currentLesson?.id}
                    setActiveQuizId={setActiveQuizId}
                    setOpenQuiz={setOpenQuiz}
                    setShowQuizResult={setShowQuizResult}
                    quizzes={courseData.quizzes}
                  />
                </Box>
                
              </Box>
            </Box>
          
            {/* Main Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Video Player Section */}
              <Card 
                elevation={0}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                  <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'black' }}>
                    {currentLesson ? (
                      <>
                        {/* Debug info */}
                        {process.env.NODE_ENV === 'development' && (
                          <Box sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            left: 8, 
                            zIndex: 10, 
                            bgcolor: 'rgba(0,0,0,0.7)', 
                            color: 'white', 
                            p: 1, 
                            borderRadius: 1,
                            fontSize: '10px'
                          }}>
                            <div>Lesson ID: {currentLesson.id}</div>
                            <div>Video URL: {currentLesson.videoUrl || 'None'}</div>
                            <div>Lesson Type: {currentLesson.type}</div>
                          </Box>
                        )}
                        <VideoPlayer
                          ref={playerRef}
                          url={currentLesson?.videoUrl}
                          width="100%"
                          height="100%"
                          playing={isPlaying}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onProgress={handleProgressWithTracking}
                          onDuration={handleDuration}
                          onEnded={handleVideoEnd}
                          lessonData={currentLesson}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            borderRadius: theme.shape.borderRadius * 2,
                            overflow: 'hidden',
                          }}
                        />
                      </>
                    ) : (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        bgcolor: 'background.paper'
                      }}
                    >
                      <Typography>اختر درسًا لبدء المشاهدة</Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Video Info */}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {currentLesson?.title || 'اختر درسًا لبدء التعلم'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentLesson?.content || 'قم بتحديد درس من القائمة الجانبية لبدء التعلم'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="إضافة إلى المفضلة">
                        <IconButton 
                          onClick={() => currentLesson && toggleBookmark(currentLesson.id)}
                          color={bookmarkedLessons[currentLesson?.id] ? 'primary' : 'default'}
                        >
                          {bookmarkedLessons[currentLesson?.id] ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="مشاركة">
                        <IconButton>
                          <Share />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="المزيد">
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  {/* Lesson Navigation */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: 2,
                    mt: 3,
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <Button 
                      variant="outlined" 
                      disabled={!currentLesson}
                      onClick={navigateToPreviousLesson}
                      startIcon={<ArrowBack />}
                      sx={{
                        minWidth: 120,
                        height: 40,
                        bgcolor: 'white',
                        color: 'text.primary',
                        borderColor: '#d1d5db',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: '#f9fafb',
                          borderColor: '#9ca3af',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        },
                        '&:disabled': {
                          bgcolor: '#f9fafb',
                          color: '#9ca3af',
                          borderColor: '#e5e7eb',
                        },
                      }}
                    >
                      Previous
                    </Button>
                    
                    <Button 
                      variant="outlined"
                      disabled={!currentLesson}
                      onClick={navigateToNextLesson}
                      endIcon={<ArrowForward />}
                      sx={{
                        minWidth: 120,
                        height: 40,
                        bgcolor: 'white',
                        color: 'text.primary',
                        borderColor: '#d1d5db',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: '#f9fafb',
                          borderColor: '#9ca3af',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        },
                        '&:disabled': {
                          bgcolor: '#f9fafb',
                          color: '#9ca3af',
                          borderColor: '#e5e7eb',
                        },
                      }}
                    >
                      Next
                    </Button>
                    
                    <Button 
                      variant="contained"
                      disabled={!currentLesson}
                      onClick={markLessonAsCompleted}
                      sx={{
                        minWidth: 180,
                        height: 40,
                        bgcolor: '#3b82f6',
                          color: 'white',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: '#2563eb',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        },
                        '&:disabled': {
                          bgcolor: '#d1d5db',
                          color: '#9ca3af',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Complete and Continue
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              
                              </Box>
          </Box>
        </Box>
      </Container>
      
      {/* Quiz Modal */}
      <Modal
        open={openQuiz}
        onClose={() => {
          setOpenQuiz(false);
          setShowQuizResult(false);
          setActiveAttemptId(null);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openQuiz}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '98vw', sm: 600 },
            maxWidth: '98vw',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 1, sm: 4 },
            outline: 'none',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <IconButton
              onClick={() => {
                setOpenQuiz(false);
                setShowQuizResult(false);
                setActiveAttemptId(null);
              }}
              sx={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}
            >
              <Close />
            </IconButton>
            {!showQuizResult ? (
              <QuizStart
                quizId={activeQuizId}
                onFinish={(attemptId) => {
                  console.log('Quiz finished with attempt ID:', attemptId);
                  setActiveAttemptId(attemptId);
                  setShowQuizResult(true);
                }}
                onClose={() => {
                  setOpenQuiz(false);
                  setShowQuizResult(false);
                  setActiveAttemptId(null);
                }}
              />
            ) : (
              <QuizResult
                quizId={activeQuizId}
                attemptId={activeAttemptId}
                onClose={() => {
                  setOpenQuiz(false);
                  setShowQuizResult(false);
                  setActiveAttemptId(null);
                }}
              />
            )}
          </Box>
        </Fade>
      </Modal>
      


      {/* Image Preview Modal */}
      <Modal
        open={imagePreview.open}
        onClose={() => setImagePreview({ open: false, url: '', title: '' })}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={imagePreview.open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95vw', sm: '80vw', md: '70vw' },
            height: { xs: '80vh', sm: '70vh', md: '60vh' },
            maxWidth: '1200px',
            maxHeight: '800px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header */}
            <Box sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
                {imagePreview.title}
              </Typography>
              <IconButton
                onClick={() => setImagePreview({ open: false, url: '', title: '' })}
                sx={{ ml: 2 }}
              >
                <Close />
              </IconButton>
            </Box>
            
            {/* Image Content */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              overflow: 'hidden'
            }}>
              <img
                src={processFileUrl(imagePreview.url)}
                alt={imagePreview.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onError={(e) => {
                  console.error('Error loading image:', e);
                  showSnackbar('حدث خطأ أثناء تحميل الصورة', 'error');
                }}
              />
            </Box>
            
            {/* Footer Actions */}
            <Box sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center',
              gap: 2
            }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {
                  const processedUrl = processFileUrl(imagePreview.url);
                  const link = document.createElement('a');
                  link.href = processedUrl;
                  link.download = imagePreview.title;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showSnackbar('تم بدء تحميل الصورة', 'success');
                }}
              >
                تحميل الصورة
              </Button>
              <Button
                variant="outlined"
                startIcon={<OpenInNew />}
                onClick={() => {
                  const processedUrl = processFileUrl(imagePreview.url);
                  window.open(processedUrl, '_blank');
                  showSnackbar('تم فتح الصورة في نافذة جديدة', 'info');
                }}
              >
                فتح في نافذة جديدة
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseTracking;
