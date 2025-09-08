import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  Quiz as QuizIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import contentAPI from '../../../services/content.service';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  background: theme.palette.background.paper,
  marginTop: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    padding: '0 16px',
    '& input': {
      textAlign: 'right',
      padding: '12px 0',
      fontSize: '1rem',
      '&::placeholder': {
        textAlign: 'right',
        opacity: 1,
      },
    },
    '& textarea': {
      textAlign: 'right',
      padding: '16px 0',
      fontSize: '1rem',
      lineHeight: '1.5',
      '&::placeholder': {
        textAlign: 'right',
        opacity: 1,
      },
    },
  },
  '& .MuiInputLabel-root': {
    right: 16,
    left: 'auto',
    transformOrigin: 'right',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(-14px, -9px) scale(0.75)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    textAlign: 'right',
  },
  '& .MuiInputBase-multiline': {
    padding: '8px 16px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  '&.MuiButton-contained': {
    padding: '10px 24px',
  },
}));

const UploadArea = styled('div')(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: '8px',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.05)' : theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(25, 118, 210, 0.03)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const LESSON_TYPES = [
  { value: 'video', label: 'فيديو', icon: <VideoLibraryIcon /> },
  { value: 'article', label: 'مقال', icon: <ArticleIcon /> },
];

const CreateUnit = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [unitData, setUnitData] = useState({
    title: '',
    description: '',
    duration: '',
    isPreview: false,
    videoFile: null,
    pdfFile: null,
    order: 1,
    lessons: [
      {
        id: Date.now(),
        title: '',
        type: 'video',
        duration: '',
        content: '',
        isPreview: false,
        resources: [],
      },
    ],
  });

  // لا يوجد خطوات بعد الآن

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUnitData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (type, file) => {
    setUnitData(prev => ({
      ...prev,
      [`${type}File`]: file || null,
    }));
  };

  // Preload next available order to avoid unique constraint (course, order)
  useEffect(() => {
    const preloadOrder = async () => {
      try {
        const data = await contentAPI.getModules(courseId);
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : data?.modules || [];
        const maxOrder = items.reduce((max, m) => (typeof m.order === 'number' && m.order > max ? m.order : max), 0);
        setUnitData(prev => ({ ...prev, order: maxOrder + 1 }));
      } catch (e) {
        setLoadError('تعذر تحميل ترتيب الوحدة التالي');
      }
    };
    if (courseId) preloadOrder();
  }, [courseId]);

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...unitData.lessons];
    updatedLessons[index] = {
      ...updatedLessons[index],
      [field]: value
    };
    setUnitData(prev => ({
      ...prev,
      lessons: updatedLessons
    }));
  };

  const addNewLesson = () => {
    setUnitData(prev => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          id: Date.now(),
          title: '',
          type: 'video',
          duration: '',
          content: '',
          isPreview: false,
          resources: [],
        },
      ],
    }));
  };

  const removeLesson = (index) => {
    if (unitData.lessons.length > 1) {
      const updatedLessons = [...unitData.lessons];
      updatedLessons.splice(index, 1);
      setUnitData(prev => ({
        ...prev,
        lessons: updatedLessons
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError(null);
      const payload = {
        courseId: courseId,
        title: unitData.title,
        name: unitData.title,
        description: unitData.description,
        durationMinutes: unitData.duration ? Number(unitData.duration) : 0,
        isActive: true,
        status: 'published',
        order: unitData.order,
      };
      
      // Only add files if they exist
      if (unitData.videoFile) {
        payload.videoFile = unitData.videoFile;
      }
      if (unitData.pdfFile) {
        payload.pdfFile = unitData.pdfFile;
      }
      const created = await contentAPI.createModule(payload);
      console.log('Module created:', created);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'تم حفظ الوحدة بنجاح! سيتم توجيهك إلى صفحة الوحدات...',
        severity: 'success'
      });
      
      // Navigate after showing success message
      setTimeout(() => {
        navigate(`/teacher/courses/${courseId}/units`);
      }, 2000);
    } catch (error) {
      console.error('Error creating module:', error);
      let serverMsg = 'تعذر حفظ الوحدة. برجاء التحقق من الحقول.';
      try {
        if (typeof error?.response?.data === 'string') serverMsg = error.response.data;
        else if (error?.response?.data?.detail) serverMsg = error.response.data.detail;
        else if (error?.response?.data?.error) serverMsg = error.response.data.error;
      } catch {}
      setSubmitError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Render a top-level error if exists

  // لا يوجد رجوع بعد إزالة الsteps

  // النموذج: قسم واحد بدون مراجعة نهائية

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            mr: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          إضافة وحدة جديدة
        </Typography>
      </Box>
      
      <StyledPaper elevation={0}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            معلومات الوحدة الأساسية
          </Typography>

          <StyledTextField
            fullWidth
            label="عنوان الوحدة"
            name="title"
            value={unitData.title}
            onChange={handleChange}
            variant="outlined"
            required
            size="medium"
          />

          <StyledTextField
            fullWidth
            label="وصف الوحدة"
            name="description"
            value={unitData.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
          />

          <StyledTextField
            fullWidth
            label="مدة الوحدة (بالدقائق)"
            name="duration"
            type="number"
            value={unitData.duration}
            onChange={handleChange}
            variant="outlined"
            size="medium"
            InputProps={{ endAdornment: <InputAdornment position="end">دقيقة</InputAdornment> }}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>الفيديو</Typography>
            {!unitData.videoFile ? (
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={submitting}>
                رفع فيديو (MP4)
                <input hidden type="file" accept="video/*" onChange={(e) => handleFileSelect('video', e.target.files && e.target.files.length ? e.target.files[0] : null)} />
              </Button>
            ) : (
              <Box>
                <video src={URL.createObjectURL(unitData.videoFile)} controls style={{ width: '100%', maxHeight: 360, borderRadius: 8, border: `1px solid ${theme.palette.divider}` }} />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Chip label={unitData.videoFile.name} size="small" />
                  <Button color="error" onClick={() => handleFileSelect('video', null)}>مسح الفيديو</Button>
                </Box>
              </Box>
            )}
          </Box>
          
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>ملف PDF</Typography>
            {!unitData.pdfFile ? (
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                رفع ملف PDF
                <input hidden type="file" accept="application/pdf" onChange={(e) => handleFileSelect('pdf', e.target.files && e.target.files.length ? e.target.files[0] : null)} />
              </Button>
            ) : (
              <Box>
                <Box sx={{ position: 'relative', border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: 'hidden' }}>
                  <iframe title="pdf-preview" src={URL.createObjectURL(unitData.pdfFile)} style={{ width: '100%', height: 480, border: 0 }} />
                </Box>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={unitData.pdfFile.name} size="small" />
                  <Button component="a" href={URL.createObjectURL(unitData.pdfFile)} target="_blank" rel="noopener noreferrer">فتح في تبويب</Button>
                  <Button color="error" onClick={() => handleFileSelect('pdf', null)}>مسح الملف</Button>
                </Box>
              </Box>
            )}
        </Box>
        
          <FormControlLabel
            control={<Checkbox checked={unitData.isPreview} onChange={handleChange} name="isPreview" color="primary" />}
            label="متاحة كمعاينة"
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <StyledButton variant="contained" color="primary" type="submit" disabled={submitting}>
              حفظ الوحدة
            </StyledButton>
          </Box>
        </Box>
      </StyledPaper>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => navigate(`/teacher/courses/${courseId}/units`)}
              sx={{ fontWeight: 600 }}
            >
              عرض الوحدات
            </Button>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateUnit;
