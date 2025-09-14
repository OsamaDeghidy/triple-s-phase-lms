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

// Global scrollbar styles to force visibility
const globalScrollbarStyles = `
  * {
    scrollbar-width: auto !important;
    scrollbar-color: rgba(255,255,255,0.6) rgba(255,255,255,0.2) !important;
  }
  
  *::-webkit-scrollbar {
    width: 25px !important;
    height: 25px !important;
    display: block !important;
    background: rgba(255,255,255,0.1) !important;
  }
  
  *::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.2) !important;
    border-radius: 12px !important;
    border: 2px solid rgba(255,255,255,0.1) !important;
    display: block !important;
  }
  
  *::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.6) !important;
    border-radius: 12px !important;
    border: 3px solid rgba(255,255,255,0.3) !important;
    min-height: 25px !important;
    display: block !important;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.8) !important;
  }
  
  *::-webkit-scrollbar-corner {
    background: rgba(255,255,255,0.2) !important;
    display: block !important;
  }
  
  *::-webkit-scrollbar-button {
    display: block !important;
    height: 25px !important;
    width: 25px !important;
    background: rgba(255,255,255,0.3) !important;
    border: 2px solid rgba(255,255,255,0.2) !important;
    border-radius: 8px !important;
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalScrollbarStyles;
  document.head.appendChild(styleSheet);
}

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

  Assignment,

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

  EmojiEvents,

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

  switch (type) {
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



const CourseContent = ({ modules, expandedModule, onModuleClick, onLessonClick, currentLessonId, setActiveQuizId, setOpenQuiz, setShowQuizResult, quizzes, isSidebarExpanded }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: isSidebarExpanded ? 0.75 : 0.5, p: isSidebarExpanded ? 0.25 : 0.125 }}>
      {(modules || []).map((module, moduleIndex) => {
        const isSelected = expandedModule === module.id;
        const isQuiz = module.title?.toLowerCase().includes('quiz');
        const hasProgress = isQuiz && module.completedLessons > 0;
        const progressPercentage = hasProgress ? (module.completedLessons / module.totalLessons) * 100 : 0;

        return (
          <Box
            key={module.id}
            onClick={() => onModuleClick(module.id)}
            sx={{
              p: isSidebarExpanded ? 1 : 0.75,
              bgcolor: isSelected ? 'white' : 'rgba(255,255,255,0.08)',
              borderRadius: 1,
              cursor: 'pointer',
              color: isSelected ? '#1e40af' : 'white',
              border: isSelected ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              minHeight: isSidebarExpanded ? 45 : 35,
              '&:hover': {
                bgcolor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.12)',
                borderColor: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.2)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: isSidebarExpanded ? 1.25 : 0.75 }}>
              {/* Radio Button / Icon */}
              <Box
                sx={{
                  width: isSidebarExpanded ? 14 : 10,
                  height: isSidebarExpanded ? 14 : 10,
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? '#3b82f6' : 'rgba(255,255,255,0.6)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isSelected ? '#3b82f6' : 'transparent',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <Box
                    sx={{
                      width: isSidebarExpanded ? 5 : 3,
                      height: isSidebarExpanded ? 5 : 3,
                      borderRadius: '50%',
                      bgcolor: 'white'
                    }}
                  />
                )}
              </Box>

              {/* Module Number or Icon */}
              <Box
                sx={{
                  width: isSidebarExpanded ? 18 : 14,
                  height: isSidebarExpanded ? 18 : 14,
                  borderRadius: '50%',
                  bgcolor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#3b82f6' : 'rgba(255,255,255,0.8)',
                  fontSize: isSidebarExpanded ? '0.65rem' : '0.55rem',
                  fontWeight: 'bold'
                }}
              >
                {isQuiz ? (
                  <Quiz sx={{ fontSize: isSidebarExpanded ? 10 : 8 }} />
                ) : (
                  moduleIndex + 1
                )}
              </Box>

              {/* Module Content */}
              {isSidebarExpanded && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{
                    fontWeight: 'bold',
                    color: isSelected ? '#1e40af' : 'white',
                    fontSize: '0.75rem',
                    mb: 0.2,
                    lineHeight: 1.2
                  }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: isSelected ? 'rgba(30, 64, 175, 0.8)' : 'rgba(255,255,255,0.8)',
                    fontSize: '0.65rem',
                    fontWeight: 500
                  }}>
                    {isQuiz ? `${module.completedLessons}/${module.totalLessons}` : (() => {
                      const totalMinutes = module.lessons?.reduce((sum, lesson) => sum + (lesson.durationMinutes || 0), 0) || 0;
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return `${hours}:${minutes.toString().padStart(2, '0')}`;
                    })()}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Progress Bar for Quiz Modules */}
            {isQuiz && hasProgress && isSidebarExpanded && (
              <Box sx={{ mt: 0.6 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 2.5,
                    borderRadius: 1.25,
                    bgcolor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1.25,
                      background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        );
      })}
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

              durationMinutes: lesson.duration_minutes,

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
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #663399 0%, #333679 50%, #1B1B48 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Left Sidebar - Course Content */}
      <Box
        sx={{
          width: { xs: showSidebar ? '100%' : 0, md: isSidebarExpanded ? '280px' : '60px' },
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          position: { xs: 'fixed', md: 'relative' },
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1100,
          height: { xs: showSidebar ? '100vh' : 0, md: '100vh' },
          background: 'linear-gradient(180deg, #663399 0%, #333679 50%, #1B1B48 100%)',
          boxShadow: { xs: 3, md: 2 },
          transform: {
            xs: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
            md: 'none'
          },
        }}
      >

        <Box sx={{
          p: isSidebarExpanded ? 1.5 : 0.5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: 'white'
        }}>
          {/* Header with close and collapse buttons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: isSidebarExpanded ? 2 : 1
          }}>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                }
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              onClick={toggleSidebarExpand}
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                }
              }}
            >
              {isSidebarExpanded ? <ChevronLeft sx={{ fontSize: 18 }} /> : <ChevronRight sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>



          {/* Course Information */}
          {isSidebarExpanded && (
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.7rem',
                fontWeight: 500,
                mb: 0.4,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Biology
              </Typography>
              <Typography variant="h6" sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                lineHeight: 1.3,
                mb: 0
              }}>
                Molecules and Fundamentals of Biology
              </Typography>
            </Box>
          )}



          {/* Progress Section */}
          {isSidebarExpanded && (
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
                <Typography variant="body2" sx={{
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Lessons Completed
                </Typography>
                <IconButton size="small" sx={{
                  color: 'white',
                  p: 0.4,
                  width: 18,
                  height: 18,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                  }
                }}>
                  <Settings sx={{ fontSize: 10 }} />
                </IconButton>
              </Box>

              <Typography variant="h5" sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 1.25,
                fontSize: '1.1rem'
              }}>
                {courseStats.completedLessons}/{courseStats.totalLessons}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={(courseStats.completedLessons / courseStats.totalLessons) * 100}
                sx={{
                  height: 2.5,
                  borderRadius: 1.25,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1.25,
                    background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                  }
                }}
              />
            </Box>
          )}


          {/* Content Tabs */}
          {isSidebarExpanded && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.4 }}>
                <Box sx={{
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 1.25,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <Typography variant="body2" sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}>
                    All
                  </Typography>
                </Box>
                <Box sx={{
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 1.25,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}>
                  <Typography variant="body2" sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }}>
                    Videos
                  </Typography>
                </Box>
                <Box sx={{
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 1.25,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}>
                  <Typography variant="body2" sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }}>
                    Quizzes
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Search Bar */}
          {isSidebarExpanded && (
            <Box sx={{ mb: 2 }}>
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <Search sx={{ color: 'rgba(255,255,255,0.6)', mr: 0.75, fontSize: 14 }} />,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 1.25,
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        borderWidth: 1,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      fontSize: '0.7rem',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.6)',
                        opacity: 1,
                      },
                    },
                  }
                }}
              />
            </Box>
          )}


          {/* Scrollable Content */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            pr: isSidebarExpanded ? 0.75 : 0,
            '&::-webkit-scrollbar': {
              width: isSidebarExpanded ? '5px' : '3px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2.5px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '2.5px',
              '&:hover': {
                background: 'rgba(255,255,255,0.5)',
              }
            },
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

              isSidebarExpanded={isSidebarExpanded}

            />

          </Box>

        </Box>

      </Box>



      {/* Main Content Area - Split Layout */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Mobile Header */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          p: 2,
          background: 'linear-gradient(135deg, rgba(102, 51, 153, 0.95) 0%, rgba(51, 54, 121, 0.95) 50%, rgba(27, 27, 72, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <IconButton onClick={toggleSidebar} sx={{ mr: 2, color: 'white' }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1, color: 'white' }}>
            {currentLesson?.title || courseData.title}
          </Typography>
        </Box>

        {/* Main Split Layout */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Left Panel - Main Video Player */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(102, 51, 153, 0.1) 0%, rgba(51, 54, 121, 0.1) 50%, rgba(27, 27, 72, 0.1) 100%)',
            backdropFilter: 'blur(5px)'
          }}>
            {/* Course Title Header - Fixed at top */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              p: 3,
              background: 'linear-gradient(135deg, rgba(102, 51, 153, 0.95) 0%, rgba(51, 54, 121, 0.95) 50%, rgba(27, 27, 72, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            }}>
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                fontSize: '2rem',
                mb: 0.5,
                textAlign: 'right',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {courseData?.title || 'Biological Chemistry'}
              </Typography>
            </Box>

            {/* Video Player Container */}
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              bgcolor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 8 // Add margin to account for fixed header
            }}>
              {currentLesson ? (
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
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                  }}
                />
              ) : (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <Typography variant="h5">اختر درسًا لبدء المشاهدة</Typography>
                </Box>
              )}

            </Box>

          </Box>




          {/* Navigation Buttons */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 51, 153, 0.95) 0%, rgba(51, 54, 121, 0.95) 50%, rgba(27, 27, 72, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2
          }}>
            <Button
              variant="outlined"
              disabled={!currentLesson}
              onClick={navigateToPreviousLesson}
              sx={{
                width: 40,
                height: 40,
                minWidth: 40,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ArrowForward />
            </Button>

            <Button
              variant="outlined"
              disabled={!currentLesson}
              onClick={navigateToNextLesson}
              sx={{
                width: 40,
                height: 40,
                minWidth: 40,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ArrowBack />
            </Button>

            <Button
              variant="contained"
              disabled={!currentLesson}
              onClick={markLessonAsCompleted}
              sx={{
                minWidth: 200,
                height: 40,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Complete and Continue
            </Button>
          </Box>

        </Box>

      </Box>



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

    </Box >
  );

};



export default CourseTracking;

