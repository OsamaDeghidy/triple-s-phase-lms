import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { 
  Close as CloseIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import contentAPI from '../../../services/content.service';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    direction: 'rtl',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0e5181 0%, #e5978b 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  '& .MuiTypography-root': {
    fontWeight: 700,
    fontSize: '1.25rem',
  },
}));

const LessonDetail = ({ open, onClose, courseId, unitId, lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (open && lessonId) {
      fetchLesson();
    }
  }, [open, lessonId]);

  const fetchLesson = async () => {
    setLoading(true);
    setError(null);
      try {
        const moduleData = await contentAPI.getModuleById(unitId);
        const item = (moduleData?.lessons || []).find((l) => String(l.id) === String(lessonId));
        setLesson(item || null);
      
      if (item) {
        // Fetch lesson resources if available
        try {
          const lessonResources = await contentAPI.getLessonResources(lessonId);
          setResources(lessonResources || []);
        } catch (resourceError) {
          console.log('No resources found for lesson');
          setResources([]);
        }
      } else {
        setError('لم يتم العثور على الدرس المطلوب');
      }
      } catch (e) {
        setError('تعذر تحميل الدرس');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLesson(null);
    setError(null);
    setResources([]);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PdfIcon />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoIcon />;
      case 'mp3':
      case 'wav':
        return <AudioIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon />;
      default:
        return <FileIcon />;
    }
  };

  const handleDownloadResource = (resource) => {
    // Handle resource download
    console.log('Downloading resource:', resource);
    // You can implement actual download logic here
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography variant="h6">
          تفاصيل الدرس
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {lesson && !loading && (
          <Box>
            {/* Lesson Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                {lesson.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={lesson.lesson_type || 'article'} 
                  color={lesson.lesson_type === 'video' ? 'primary' : 'default'}
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={`${lesson.duration_minutes || 0} دقيقة`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
                {lesson.is_free && (
                  <Chip 
                    label="معاينة"
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />
            </Box>

            {/* Lesson Content */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                محتوى الدرس
              </Typography>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 200
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    textAlign: 'right'
                  }}
                >
                  {lesson.content || 'لا يوجد محتوى للدرس'}
                </Typography>
      </Box>
            </Box>

                         {/* Lesson Details */}
             <Box sx={{ 
               p: 3, 
               backgroundColor: 'grey.50', 
               borderRadius: 2,
               border: '1px solid',
               borderColor: 'divider',
               mb: 3
             }}>
               <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                 معلومات الدرس
               </Typography>
               
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Typography variant="body2" color="textSecondary">معرف الدرس:</Typography>
                   <Typography variant="body1" fontWeight={600}>{lesson.id}</Typography>
                 </Box>
                 
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Typography variant="body2" color="textSecondary">نوع الدرس:</Typography>
                   <Chip 
                     label={lesson.lesson_type || 'article'} 
                     size="small"
                     color={lesson.lesson_type === 'video' ? 'primary' : 'default'}
                   />
                 </Box>
                 
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Typography variant="body2" color="textSecondary">المدة:</Typography>
                   <Typography variant="body1" fontWeight={600}>
                     {lesson.duration_minutes || 0} دقيقة
                   </Typography>
                 </Box>
                 
                 {lesson.created_at && (
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="body2" color="textSecondary">تاريخ الإنشاء:</Typography>
                     <Typography variant="body1" fontWeight={600}>
                       {formatDate(lesson.created_at)}
                     </Typography>
                   </Box>
                 )}
                 
                 {lesson.updated_at && (
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="body2" color="textSecondary">آخر تحديث:</Typography>
                     <Typography variant="body1" fontWeight={600}>
                       {formatDate(lesson.updated_at)}
                     </Typography>
                   </Box>
                 )}
               </Box>
             </Box>

             {/* Lesson Resources */}
             {(resources.length > 0 || (lesson.resources && lesson.resources.length > 0)) && (
               <Box sx={{ 
                 p: 3, 
                 backgroundColor: 'grey.50', 
                 borderRadius: 2,
                 border: '1px solid',
                 borderColor: 'divider'
               }}>
                 <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                   الملفات المرفقة ({(resources.length > 0 ? resources : lesson.resources || []).length})
            </Typography>
                 
                 <List sx={{ bgcolor: 'white', borderRadius: 1 }}>
                   {(resources.length > 0 ? resources : lesson.resources || []).map((resource, index, array) => (
                     <ListItem 
                       key={resource.id || index}
                       sx={{ 
                         borderBottom: index < array.length - 1 ? '1px solid' : 'none',
                         borderColor: 'divider',
                         '&:hover': {
                           backgroundColor: 'action.hover',
                         }
                       }}
                     >
                       <ListItemIcon sx={{ minWidth: 40 }}>
                         {getFileIcon(resource.name || resource.filename || 'file')}
                       </ListItemIcon>
                       <ListItemText
                         primary={resource.name || resource.filename || 'ملف مرفق'}
                         secondary={resource.description || resource.size ? `${resource.size} bytes` : ''}
                         sx={{ 
                           '& .MuiListItemText-primary': {
                             fontWeight: 600,
                             fontSize: '0.9rem'
                           },
                           '& .MuiListItemText-secondary': {
                             fontSize: '0.8rem'
                           }
                         }}
                       />
                       <ListItemSecondaryAction>
                         <IconButton
                           edge="end"
                           onClick={() => handleDownloadResource(resource)}
                           sx={{ 
                             color: 'primary.main',
                             '&:hover': {
                               backgroundColor: 'primary.main',
                               color: 'white'
                             }
                           }}
                         >
                           <DownloadIcon />
                         </IconButton>
                       </ListItemSecondaryAction>
                     </ListItem>
                   ))}
                 </List>
               </Box>
             )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="textSecondary">
            معرف الدرس: {lessonId}
          </Typography>
        </Box>
      </DialogActions>
    </StyledDialog>
  );
};

export default LessonDetail;


