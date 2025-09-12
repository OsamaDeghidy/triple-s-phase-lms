import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Alert,
  FormControlLabel,
  Switch,
  FormGroup,
  RadioGroup,
  Radio,
  FormLabel,
  Checkbox,
  FormHelperText,
  Paper,
  Container,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  VideoLibrary as VideoIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Tag as TagIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import { useTheme, alpha, styled } from '@mui/material/styles';

// Styled Components for Clean Form Design with RTL Support
const FormContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  padding: theme.spacing(3),
  direction: 'rtl',
  [theme.breakpoints.down('sm')]: {
  padding: theme.spacing(2),
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  direction: 'rtl',
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: '#d0d0d0',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontSize: '14px',
    fontWeight: 500,
    right: 14,
    left: 'auto',
    transformOrigin: 'right',
    '&.Mui-focused': {
      color: '#1976d2',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(-14px, -9px) scale(0.75)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
    fontSize: '14px',
    textAlign: 'right',
    '&::placeholder': {
      textAlign: 'right',
      opacity: 1,
    },
  },
  '& .MuiOutlinedInput-multiline': {
    padding: '8px 14px',
    '& textarea': {
      textAlign: 'right',
      '&::placeholder': {
        textAlign: 'right',
        opacity: 1,
      },
    },
  },
}));

const FormSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: '#d0d0d0',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: '2px',
    },
  },
  '& .MuiSelect-select': {
    padding: '12px 14px',
    fontSize: '14px',
    textAlign: 'right',
    paddingRight: '32px !important',
    color: '#333333',
  },
  '& .MuiSelect-icon': {
    right: 14,
    left: 'auto',
    color: '#666666',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d0d0d0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
    borderWidth: '2px',
  },
}));

const FormButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  padding: '10px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  minHeight: '40px',
  direction: 'rtl',
  '&.MuiButton-contained': {
    backgroundColor: '#1976d2',
  '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  '&.MuiButton-outlined': {
    borderColor: '#d0d0d0',
    color: '#666666',
  '&:hover': {
      borderColor: '#1976d2',
      color: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  },
  '& .MuiButton-startIcon': {
    marginLeft: theme.spacing(1),
    marginRight: 0,
  },
  '& .MuiButton-endIcon': {
    marginRight: theme.spacing(1),
    marginLeft: 0,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: '#333333',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  direction: 'rtl',
  textAlign: 'right',
}));

const RequiredAsterisk = styled('span')({
  color: '#d32f2f',
  marginRight: '4px',
  marginLeft: 0,
});

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  backgroundColor: '#fafafa',
  borderRadius: '6px',
  border: '1px solid #e0e0e0',
  direction: 'rtl',
}));

const QuestionForm = ({ question, onSubmit, onCancel, lessons = [] }) => {
  const theme = useTheme();
  
  // Ensure lessons is an array
  const safeLessons = Array.isArray(lessons) ? lessons : [];
  
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'mcq',
    difficulty_level: 'medium',
    lesson: '',
    options: [],
    correct_answer: '',
    explanation: '',
    tags: [],
    image: null,
    audio: null,
    video: null
  });

  // Debug logging
  console.log('QuestionForm props:', { lessons });
  console.log('Lessons type:', typeof lessons, 'Is array:', Array.isArray(lessons));
  console.log('Form data:', formData);
  const [errors, setErrors] = useState({});
  const [newOption, setNewOption] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text || '',
        question_type: question.question_type || 'mcq',
        difficulty_level: question.difficulty_level || 'medium',
        lesson: question.lesson || '',
        options: question.options_list || [],
        correct_answer: question.correct_answer || '',
        explanation: question.explanation || '',
        tags: question.tags || [],
        image: question.image || null,
        audio: question.audio || null,
        video: question.video || null
      });
    }
  }, [question]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileUpload = (field, file) => {
    console.log(`Uploading ${field}:`, file);
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question_text.trim()) {
      newErrors.question_text = 'نص السؤال مطلوب';
    }

    if (formData.question_type === 'mcq' && formData.options.length < 2) {
      newErrors.options = 'يجب إضافة على الأقل خيارين';
    }

    if (!formData.correct_answer.trim()) {
      newErrors.correct_answer = 'الإجابة الصحيحة مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Format data for API
        const formattedData = {
          question_text: formData.question_text,
          question_type: formData.question_type,
          difficulty_level: formData.difficulty_level,
          correct_answer: formData.correct_answer,
          explanation: formData.explanation || '',
          tags: formData.tags || [],
          lesson: formData.lesson || null,
          options: formData.question_type === 'mcq' ? formData.options : [],
          // Include media files if they exist
          ...(formData.image && { image: formData.image }),
          ...(formData.audio && { audio: formData.audio }),
          ...(formData.video && { video: formData.video })
        };

        console.log('Submitting question data:', formattedData);
        await onSubmit(formattedData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const getQuestionTypeFields = () => {
    switch (formData.question_type) {
      case 'mcq':
        return (
          <Box>
            <SectionTitle>
              <QuizIcon sx={{ fontSize: 20 }} />
              خيارات الإجابة
            </SectionTitle>
            <Box sx={{ mb: 2, direction: 'rtl' }}>
              {formData.options.map((option, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2,
                  p: 2,
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  direction: 'rtl'
                }}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveOption(index)}
                    disabled={formData.options.length <= 2}
                    size="small"
                    sx={{ order: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <FormTextField
                    fullWidth
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = e.target.value;
                      handleInputChange('options', newOptions);
                    }}
                    placeholder={`الخيار ${index + 1}`}
                    size="small"
                    sx={{ order: 2 }}
                  />
                  <Radio
                    checked={formData.correct_answer === option}
                    onChange={() => handleInputChange('correct_answer', option)}
                  size="small"
                    sx={{ order: 3 }}
                />
                </Box>
              ))}
              <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center', direction: 'rtl' }}>
                <FormButton
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddOption}
                  disabled={!newOption.trim() || formData.options.length >= 6}
                  size="small"
                  sx={{ order: 1 }}
                >
                  إضافة
                </FormButton>
                <FormTextField
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="إضافة خيار جديد"
                  size="small"
                  sx={{ flexGrow: 1, order: 2 }}
                />
              </Box>
              {errors.options && (
                <FormHelperText error sx={{ mt: 1, fontSize: '12px' }}>
                  {errors.options}
                </FormHelperText>
              )}
            </Box>
          </Box>
        );

      case 'true_false':
        return (
          <Box>
            <SectionTitle>
              <QuizIcon sx={{ fontSize: 20 }} />
              الإجابة الصحيحة
            </SectionTitle>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={formData.correct_answer}
                onChange={(e) => handleInputChange('correct_answer', e.target.value)}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  gap: 2,
                  justifyContent: 'center',
                  direction: 'rtl'
                }}
              >
                <FormControlLabel 
                  value="true" 
                  control={<Radio size="small" />} 
                  label="صح" 
                  sx={{ 
                    backgroundColor: formData.correct_answer === 'true' ? '#e8f5e8' : 'transparent',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    border: `1px solid ${formData.correct_answer === 'true' ? '#4caf50' : '#e0e0e0'}`,
                    direction: 'rtl',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                />
                <FormControlLabel 
                  value="false" 
                  control={<Radio size="small" />} 
                  label="خطأ" 
                  sx={{ 
                    backgroundColor: formData.correct_answer === 'false' ? '#ffebee' : 'transparent',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    border: `1px solid ${formData.correct_answer === 'false' ? '#f44336' : '#e0e0e0'}`,
                    direction: 'rtl',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 'fill_blank':
        return (
          <Box>
            <SectionTitle>
              <QuizIcon sx={{ fontSize: 20 }} />
              إجابات ملء الفراغ
            </SectionTitle>
            <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
              استخدم [___] للإشارة إلى الفراغات في نص السؤال
            </Alert>
            <FormTextField
              fullWidth
              multiline
              rows={3}
              value={formData.correct_answer}
              onChange={(e) => handleInputChange('correct_answer', e.target.value)}
              placeholder="أدخل الإجابات الصحيحة مفصولة بفاصلة"
              helperText="مثال: الإجابة الأولى, الإجابة الثانية"
            />
          </Box>
        );

      case 'matching':
        return (
          <Box>
            <SectionTitle>
              <QuizIcon sx={{ fontSize: 20 }} />
              أزواج المطابقة
            </SectionTitle>
            <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
              أدخل أزواج المطابقة في التنسيق: العنصر الأول = العنصر المقابل
            </Alert>
            <FormTextField
              fullWidth
              multiline
              rows={4}
              value={formData.correct_answer}
              onChange={(e) => handleInputChange('correct_answer', e.target.value)}
              placeholder="مثال: القاهرة = مصر, الرياض = السعودية"
            />
          </Box>
        );

      case 'ordering':
        return (
          <Box>
            <SectionTitle>
              <QuizIcon sx={{ fontSize: 20 }} />
              ترتيب العناصر
            </SectionTitle>
            <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
              أدخل العناصر بالترتيب الصحيح مفصولة بفاصلة
            </Alert>
            <FormTextField
              fullWidth
              multiline
              rows={3}
              value={formData.correct_answer}
              onChange={(e) => handleInputChange('correct_answer', e.target.value)}
              placeholder="مثال: العنصر الأول, العنصر الثاني, العنصر الثالث"
            />
          </Box>
        );

      default:
        return (
          <Box>
            <SectionTitle>
              <QuizIcon sx={{ fontSize: 20 }} />
              الإجابة الصحيحة
            </SectionTitle>
            <FormTextField
              fullWidth
              multiline
              rows={3}
              value={formData.correct_answer}
              onChange={(e) => handleInputChange('correct_answer', e.target.value)}
              placeholder="أدخل الإجابة الصحيحة"
            />
          </Box>
        );
    }
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <FormCard>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0', direction: 'rtl' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333333', display: 'flex', alignItems: 'center', gap: 1, textAlign: 'right' }}>
              <QuizIcon sx={{ color: '#1976d2', fontSize: 28 }} />
              {question ? 'تعديل السؤال' : 'إنشاء سؤال جديد'}
            </Typography>
          </Box>

          <Stack spacing={3}>
            {/* Question Text */}
            <FormSection>
              <SectionTitle>
                <BookIcon sx={{ fontSize: 20 }} />
                معلومات السؤال
              </SectionTitle>
              <FormTextField
                fullWidth
                multiline
                rows={4}
                label="نص السؤال"
                value={formData.question_text}
                onChange={(e) => handleInputChange('question_text', e.target.value)}
                error={!!errors.question_text}
                helperText={errors.question_text}
                required
                placeholder="أدخل نص السؤال هنا..."
              />
            </FormSection>

            {/* Question Type and Difficulty */}
            <FormSection>
              <SectionTitle>
                <SchoolIcon sx={{ fontSize: 20 }} />
                إعدادات السؤال
              </SectionTitle>
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ 
                    color: '#666666', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    mb: 1,
                    textAlign: 'right'
                  }}>
                    نوع السؤال
                  </Typography>
                  <FormSelect fullWidth>
                <Select
                  value={formData.question_type}
                  onChange={(e) => handleInputChange('question_type', e.target.value)}
                      displayEmpty
                >
                  <MenuItem value="mcq">اختيار من متعدد</MenuItem>
                  <MenuItem value="true_false">صح أو خطأ</MenuItem>
                  <MenuItem value="short_answer">إجابة قصيرة</MenuItem>
                  <MenuItem value="essay">مقال</MenuItem>
                  <MenuItem value="fill_blank">ملء الفراغ</MenuItem>
                  <MenuItem value="matching">مطابقة</MenuItem>
                  <MenuItem value="ordering">ترتيب</MenuItem>
                </Select>
                  </FormSelect>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ 
                    color: '#666666', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    mb: 1,
                    textAlign: 'right'
                  }}>
                    مستوى الصعوبة
                  </Typography>
                  <FormSelect fullWidth>
                <Select
                  value={formData.difficulty_level}
                  onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                      displayEmpty
                >
                  <MenuItem value="easy">سهل</MenuItem>
                  <MenuItem value="medium">متوسط</MenuItem>
                  <MenuItem value="hard">صعب</MenuItem>
                </Select>
                  </FormSelect>
                </Box>
              </Box>
            </FormSection>

            {/* Course and Lesson */}
            <FormSection>
              <SectionTitle>
                <SchoolIcon sx={{ fontSize: 20 }} />
                المقرر والدرس
              </SectionTitle>
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ 
                    color: '#666666', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    mb: 1,
                    textAlign: 'right'
                  }}>
                    الدرس
                  </Typography>
                  <FormSelect fullWidth>
                <Select
                  value={formData.lesson}
                  onChange={(e) => handleInputChange('lesson', e.target.value)}
                      displayEmpty
                >
                  <MenuItem value="">اختر الدرس</MenuItem>
                  {safeLessons.map((lesson) => (
                    <MenuItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </MenuItem>
                  ))}
                </Select>
                  </FormSelect>
                </Box>
              </Box>
            </FormSection>

            {/* Answer Configuration */}
            <FormSection>
              <SectionTitle>
                <QuizIcon sx={{ fontSize: 20 }} />
                  إعدادات الإجابة
              </SectionTitle>
                
                {getQuestionTypeFields()}
                
              <Divider sx={{ my: 3 }} />
                
              <FormTextField
                  fullWidth
                  multiline
                rows={3}
                  label="شرح الإجابة (اختياري)"
                  value={formData.explanation}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  placeholder="أضف شرحاً للإجابة الصحيحة..."
                />
            </FormSection>

            {/* Tags */}
            <FormSection>
              <SectionTitle>
                <TagIcon sx={{ fontSize: 20 }} />
                  العلامات (Tags)
              </SectionTitle>
                
              <Box sx={{ mb: 2, direction: 'rtl' }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, minHeight: 32, direction: 'rtl' }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      size="small"
                        sx={{ 
                        borderRadius: '16px',
                        fontSize: '12px',
                        height: '28px',
                        direction: 'rtl'
                        }}
                      />
                    ))}
                  </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', direction: 'rtl' }}>
                  <FormButton
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    size="small"
                    sx={{ order: 1 }}
                    >
                      إضافة
                  </FormButton>
                  <FormTextField
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="إضافة علامة جديدة"
                    size="small"
                    sx={{ flexGrow: 1, order: 2 }}
                  />
                  </Box>
                </Box>
            </FormSection>

            {/* Media Files */}
            <FormSection>
              <SectionTitle>
                <AttachFileIcon sx={{ fontSize: 20 }} />
                  الملفات المرفقة
              </SectionTitle>
              
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ 
                    border: '2px dashed #d0d0d0',
                    borderRadius: '4px',
                    padding: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: '#1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    }
                  }}>
                    <ImageIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333333' }}>
                        صورة السؤال
                      </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                        PNG, JPG, GIF حتى 10MB
                      </Typography>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                        type="file"
                        onChange={(e) => handleFileUpload('image', e.target.files[0])}
                      />
                      <label htmlFor="image-upload">
                      <FormButton variant="outlined" component="span" startIcon={<UploadIcon />}>
                          رفع صورة
                      </FormButton>
                      </label>
                      {formData.image && (
                      <Typography variant="body2" color="success.main" sx={{ display: 'block', mt: 2, fontWeight: 600 }}>
                          ✓ تم رفع الملف بنجاح: {formData.image.name}
                        </Typography>
                      )}
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ 
                    border: '2px dashed #d0d0d0',
                    borderRadius: '4px',
                    padding: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: '#1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    }
                  }}>
                    <AudioIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333333' }}>
                        ملف صوتي
                      </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                        MP3, WAV حتى 50MB
                      </Typography>
                      <input
                        accept="audio/*"
                        style={{ display: 'none' }}
                        id="audio-upload"
                        type="file"
                        onChange={(e) => handleFileUpload('audio', e.target.files[0])}
                      />
                      <label htmlFor="audio-upload">
                      <FormButton variant="outlined" component="span" startIcon={<UploadIcon />}>
                          رفع صوت
                      </FormButton>
                      </label>
                      {formData.audio && (
                      <Typography variant="body2" color="success.main" sx={{ display: 'block', mt: 2, fontWeight: 600 }}>
                          ✓ تم رفع الملف بنجاح: {formData.audio.name}
                        </Typography>
                      )}
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ 
                    border: '2px dashed #d0d0d0',
                    borderRadius: '4px',
                    padding: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: '#1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    }
                  }}>
                    <VideoIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333333' }}>
                        فيديو
                      </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                        MP4, AVI حتى 100MB
                      </Typography>
                      <input
                        accept="video/*"
                        style={{ display: 'none' }}
                        id="video-upload"
                        type="file"
                        onChange={(e) => handleFileUpload('video', e.target.files[0])}
                      />
                      <label htmlFor="video-upload">
                      <FormButton variant="outlined" component="span" startIcon={<UploadIcon />}>
                          رفع فيديو
                      </FormButton>
                      </label>
                      {formData.video && (
                      <Typography variant="body2" color="success.main" sx={{ display: 'block', mt: 2, fontWeight: 600 }}>
                          ✓ تم رفع الملف بنجاح: {formData.video.name}
                        </Typography>
                      )}
              </Box>
                </Box>
              </Box>
            </FormSection>

            {/* Action Buttons */}
              <Box sx={{ 
              p: 2, 
              borderRadius: '4px', 
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              direction: 'rtl'
            }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', flexWrap: 'wrap', direction: 'rtl' }}>
                <FormButton 
                    variant="outlined" 
                    onClick={onCancel}
                  >
                    إلغاء
                </FormButton>
                <FormButton 
                    type="submit" 
                    variant="contained"
                  >
                    {question ? 'تحديث السؤال' : 'إنشاء السؤال'}
                </FormButton>
                </Box>
              </Box>
          </Stack>
        </CardContent>
      </FormCard>
    </FormContainer>
  );
};

export default QuestionForm;
