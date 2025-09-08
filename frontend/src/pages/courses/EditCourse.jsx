import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Checkbox, 
  FormControlLabel,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { courseAPI } from '../../services/api.service';

// Reuse the same styled components from CreateCourse
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

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
];

const LANGUAGE_OPTIONS = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

const steps = ['المعلومات الأساسية', 'الوسائط والمحتوى', 'الأسعار والخصومات', 'المراجعة والنشر'];

const EditCourse = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // Get course ID from URL
  const [activeStep, setActiveStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Form state - initialize with empty values
  const [courseData, setCourseData] = useState({
    id: id,
    title: '',
    subtitle: '',
    description: '',
    shortDescription: '',
    level: 'beginner',
    language: 'ar',
    category: '',
    tags: [],
    isFree: false,
    price: 0,
    discountPrice: null,
    status: 'draft',
    isFeatured: false,
    isCertified: false,
    image: null,
    promotionalVideo: '',
    syllabusPdf: null,
    materialsPdf: null,
  });
  
  const [newTag, setNewTag] = useState('');
  
  // Fetch course data and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await courseAPI.getCategories();
        // Ensure categories is an array
        const categoriesArray = Array.isArray(categoriesResponse) ? categoriesResponse : 
                               categoriesResponse.results ? categoriesResponse.results : 
                               categoriesResponse.data ? categoriesResponse.data : [];
        setCategories(categoriesArray);
        
        // Fetch course data
        if (id) {
          const courseResponse = await courseAPI.getCourse(id);
          const course = courseResponse;
          
          // Transform the API response to match our form structure
          setCourseData({
            id: course.id,
            title: course.title || '',
            subtitle: course.subtitle || '',
            description: course.description || '',
            shortDescription: course.short_description || '',
            level: course.level || 'beginner',
            language: course.language || 'ar',
            category: course.category?.id || '',
            tags: course.tags?.map(tag => tag.name) || [],
            isFree: course.is_free || false,
            price: course.price || 0,
            discountPrice: course.discount_price || null,
            status: course.status || 'draft',
            isFeatured: course.is_featured || false,
            isCertified: course.is_certified || false,
            image: null, // We'll handle image separately
            promotionalVideo: course.promotional_video || '',
            syllabusPdf: null, // We'll handle files separately
            materialsPdf: null,
            // Store original image/file URLs for display
            imageUrl: course.image,
            syllabusPdfUrl: course.syllabus_pdf,
            materialsPdfUrl: course.materials_pdf,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        let errorMessage = 'حدث خطأ أثناء تحميل بيانات الدورة. يرجى المحاولة مرة أخرى.';
        
        if (error.response?.status === 404) {
          errorMessage = 'الدورة غير موجودة أو تم حذفها.';
        } else if (error.response?.status === 403) {
          errorMessage = 'ليس لديك صلاحية للوصول إلى هذه الدورة.';
        } else if (error.response?.status === 500) {
          errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setIsLoading(false);
      setError('معرف الدورة غير صحيح');
    }
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep === steps.length - 1) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        // Validate required fields
        if (!courseData.title.trim()) {
          setError('عنوان الدورة مطلوب');
          return;
        }
        
        if (!courseData.description.trim()) {
          setError('وصف الدورة مطلوب');
          return;
        }
        
        // Validate price if not free
        if (!courseData.isFree && (!courseData.price || courseData.price <= 0)) {
          setError('يجب إدخال سعر صحيح للدورة');
          return;
        }
        
        // Validate discount price
        if (courseData.discountPrice && courseData.discountPrice >= courseData.price) {
          setError('السعر المخفض يجب أن يكون أقل من السعر الأصلي');
          return;
        }
        
        // Prepare data for API
        const apiData = {
          title: courseData.title.trim(),
          subtitle: courseData.subtitle.trim(),
          description: courseData.description.trim(),
          short_description: courseData.shortDescription.trim(),
          level: courseData.level,
          language: courseData.language,
          category: courseData.category || null,
          tags: courseData.tags,
          is_free: courseData.isFree,
          price: courseData.isFree ? 0 : courseData.price,
          discount_price: courseData.isFree ? null : courseData.discountPrice,
          status: courseData.status,
          is_featured: courseData.isFeatured,
          is_certified: courseData.isCertified,
          promotional_video: courseData.promotionalVideo.trim(),
        };
        
        // Add files if they exist
        if (courseData.image instanceof File) {
          apiData.image = courseData.image;
        }
        if (courseData.syllabusPdf instanceof File) {
          apiData.syllabus_pdf = courseData.syllabusPdf;
        }
        if (courseData.materialsPdf instanceof File) {
          apiData.materials_pdf = courseData.materialsPdf;
        }
        
        // Update course
        const updatedCourse = await courseAPI.updateCourse(id, apiData);
        
        console.log('Course updated successfully:', updatedCourse);
        
        // Set success message and navigate
        setSuccess('تم تحديث الدورة بنجاح!');
        console.log('Success message set');
        
        // Navigate back after a short delay
        setTimeout(() => {
          console.log('Navigating to /teacher/my-courses');
          navigate('/teacher/my-courses');
        }, 2000);
        
      } catch (error) {
        console.error('Error updating course:', error);
        let errorMessage = 'حدث خطأ أثناء تحديث الدورة. يرجى المحاولة مرة أخرى.';
        
        if (error.response?.status === 404) {
          errorMessage = 'الدورة غير موجودة أو تم حذفها.';
        } else if (error.response?.status === 403) {
          errorMessage = 'ليس لديك صلاحية لتعديل هذه الدورة.';
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || 'بيانات غير صحيحة. يرجى التحقق من المعلومات المدخلة.';
        } else if (error.response?.status === 500) {
          errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleNext();
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e, field) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  // Debug effect to log success state changes
  useEffect(() => {
    if (success) {
      console.log('Success state updated:', success);
    }
  }, [success]);
  
  // Render step content (same as CreateCourse)
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
              المعلومات الأساسية
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <StyledTextField
                fullWidth
                label="عنوان الدورة"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                variant="outlined"
                required
                size="medium"
                sx={{ mb: 2 }}
              />
              
              <StyledTextField
                fullWidth
                label="وصف قصير"
                name="subtitle"
                value={courseData.subtitle}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              
              <StyledTextField
                fullWidth
                label="الوصف الكامل"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={6}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>مستوى الصعوبة</InputLabel>
                  <Select
                    name="level"
                    value={courseData.level}
                    onChange={handleChange}
                    label="مستوى الصعوبة"
                    sx={{ textAlign: 'right' }}
                  >
                    {LEVEL_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>اللغة</InputLabel>
                  <Select
                    name="language"
                    value={courseData.language}
                    onChange={handleChange}
                    label="اللغة"
                    sx={{ textAlign: 'right' }}
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>التصنيف</InputLabel>
                <Select
                  name="category"
                  value={courseData.category}
                  onChange={handleChange}
                  label="التصنيف"
                  sx={{ textAlign: 'right' }}
                >
                  <MenuItem value="">
                    <em>اختر تصنيف</em>
                  </MenuItem>
                  {Array.isArray(categories) && categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>الكلمات المفتاحية</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexDirection: 'row-reverse' }}>
                  <StyledTextField
                    fullWidth
                    placeholder="أضف كلمة مفتاحية"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAddTag}
                    startIcon={<AddIcon />}
                    sx={{ minWidth: '120px' }}
                  >
                    إضافة
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {courseData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      sx={{ 
                        backgroundColor: theme.palette.primary.light, 
                        color: theme.palette.primary.contrastText,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.primary.contrastText,
                          '&:hover': {
                            color: theme.palette.primary.light
                          }
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </>
        );
      
      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
              الوسائط والمحتوى
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>صورة الغلاف</Typography>
                <UploadArea 
                  isDragActive={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'image')}
                  onClick={() => document.getElementById('image-upload').click()}
                  sx={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'image')}
                  />
                  {courseData.image ? (
                    <Box textAlign="center" width="100%">
                      <img 
                        src={URL.createObjectURL(courseData.image)} 
                        alt="Course preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          border: '1px solid #e0e0e0'
                        }} 
                      />
                      <Typography variant="body2" color="textSecondary">
                        انقر لتغيير الصورة أو اسحب صورة جديدة
                      </Typography>
                    </Box>
                  ) : courseData.imageUrl ? (
                    <Box textAlign="center" width="100%">
                      <img 
                        src={courseData.imageUrl} 
                        alt="Course preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          border: '1px solid #e0e0e0'
                        }} 
                      />
                      <Typography variant="body2" color="textSecondary">
                        انقر لتغيير الصورة أو اسحب صورة جديدة
                      </Typography>
                    </Box>
                  ) : (
                    <Box textAlign="center" p={3}>
                      <ImageIcon color="action" fontSize="large" sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 500 }}>
                        اسحب صورة الدورة هنا أو انقر للاختيار
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        يوصى بصورة بدقة 1280x720 بكسل
                      </Typography>
                    </Box>
                  )}
                </UploadArea>
              </Box>
              
              <StyledTextField
                fullWidth
                label="رابط الفيديو التعريفي (اختياري)"
                name="promotionalVideo"
                value={courseData.promotionalVideo}
                onChange={handleChange}
                variant="outlined"
                placeholder="https://www.youtube.com/watch?v=..."
                InputProps={{
                  startAdornment: <VideoLibraryIcon color="action" sx={{ ml: 1 }} />,
                }}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>الملفات المرفقة</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <input
                      id="syllabus-upload"
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, 'syllabusPdf')}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PdfIcon />}
                      onClick={() => document.getElementById('syllabus-upload').click()}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      {courseData.syllabusPdf ? courseData.syllabusPdf.name : 
                       courseData.syllabusPdfUrl ? 'منهج الدورة (تم رفعه مسبقاً)' : 'رفع منهج الدورة (PDF)'}
                    </Button>
                  </Box>
                  
                  <Box>
                    <input
                      id="materials-upload"
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, 'materialsPdf')}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PdfIcon />}
                      onClick={() => document.getElementById('materials-upload').click()}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      {courseData.materialsPdf ? courseData.materialsPdf.name : 
                       courseData.materialsPdfUrl ? 'المواد التعليمية (تم رفعها مسبقاً)' : 'رفع المواد التعليمية (PDF)'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        );
        
      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
              الأسعار والخصومات
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={courseData.isFree}
                    onChange={handleChange}
                    name="isFree"
                    color="primary"
                  />
                }
                label="هذه الدورة مجانية"
                sx={{ mb: 2 }}
              />
              
              {!courseData.isFree && (
                <>
                  <StyledTextField
                    fullWidth
                    label="سعر الدورة (بالدولار)"
                    name="price"
                    type="number"
                    value={courseData.price}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: '$‎',
                    }}
                  />
                  
                  <StyledTextField
                    fullWidth
                    label="سعر مخفض (اختياري)"
                    name="discountPrice"
                    type="number"
                    value={courseData.discountPrice || ''}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: '$‎',
                    }}
                    helperText="سيتم عرض السعر الأصلي مشطوبًا بجانب السعر المخفض"
                  />
                </>
              )}
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={courseData.isCertified}
                    onChange={handleChange}
                    name="isCertified"
                    color="primary"
                  />
                }
                label="منح شهادة إكمال للدورة"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={courseData.isFeatured}
                    onChange={handleChange}
                    name="isFeatured"
                    color="primary"
                  />
                }
                label="إظهار الدورة في الصفحة الرئيسية"
                sx={{ mb: 2 }}
              />
            </Box>
          </>
        );
        
      case 3:
        return (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
              مراجعة المعلومات
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                معلومات الدورة
              </Typography>
              <Box sx={{ backgroundColor: theme.palette.background.paper, p: 3, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" color="textSecondary">العنوان:</Typography>
                    <Typography variant="body1" fontWeight={500}>{courseData.title}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" color="textSecondary">الوصف القصير:</Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ maxWidth: '60%', textAlign: 'left' }}>{courseData.subtitle}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" color="textSecondary">المستوى:</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {LEVEL_OPTIONS.find(level => level.value === courseData.level)?.label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">السعر:</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {courseData.isFree 
                        ? 'مجاناً' 
                        : courseData.discountPrice 
                          ? `$${courseData.discountPrice} (بعد الخصم من $${courseData.price})` 
                          : `$${courseData.price}`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setActiveStep(0)}
                  startIcon={<EditIcon />}
                >
                  تعديل المعلومات
                </Button>
              </Box>
            </Box>
          </>
        );
      
      default:
        return 'خطأ في تحميل الخطوة';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Tooltip title="رجوع">
          <IconButton onClick={() => navigate(-1)} sx={{ ml: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          تعديل الدورة
        </Typography>
      </Box>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
          </Alert>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <StyledPaper>
            {/* Stepper */}
            <Box sx={{ width: '100%', mb: 4, position: 'relative' }}>
              {/* Continuous line */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: '40px',
                  left: '20px',
                  right: '20px',
                  height: '2px',
                  backgroundColor: theme.palette.grey[300],
                  zIndex: 0,
                }}
              >
                {/* Active progress line */}
                <Box 
                  sx={{
                    height: '100%',
                    width: `${(activeStep / (steps.length - 1)) * 100}%`,
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {steps.map((label, index) => (
                  <Box 
                    key={label}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      flex: 1,
                      position: 'relative',
                      zIndex: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveStep(index)}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: activeStep >= index ? theme.palette.primary.main : theme.palette.grey[300],
                        color: activeStep >= index ? '#fff' : theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        border: `2px solid ${activeStep >= index ? theme.palette.primary.main : theme.palette.grey[300]}`,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography 
                      variant="caption" 
                      align="center" 
                      sx={{ 
                        fontSize: '0.75rem',
                        fontWeight: activeStep >= index ? 600 : 400,
                        color: activeStep >= index ? theme.palette.primary.main : theme.palette.text.secondary,
                        mt: 0.5,
                        textAlign: 'center',
                        px: 1,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            
            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>
            
            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                startIcon={<ArrowBackIcon />}
              >
                السابق
              </Button>
              
              <Box sx={{ flex: '1 1 auto' }} />
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                endIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isSubmitting}
                sx={{ minWidth: '150px' }}
              >
                {activeStep === steps.length - 1 ? (isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات') : 'التالي'}
              </Button>
            </Box>
          </StyledPaper>
        </form>
      )}
      
      {/* Error and Success Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditCourse;
