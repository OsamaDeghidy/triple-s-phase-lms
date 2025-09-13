import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormGroup,
  Container,
  InputAdornment,
  Skeleton,
  useTheme,
  alpha,
  keyframes,
  styled
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  ContentCopy as CopyIcon,
  Assessment as AssessmentIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  PublishedWithChanges as PublishedIcon,
  Drafts as DraftIcon,
  Archive as ArchiveIcon,
  Article as ArticleIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Sort as SortIcon,
  Star as StarIcon,
  Share as ShareIcon,
  ArrowForward as ArrowForwardIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionForm from './QuestionForm';
import QuestionCard from './QuestionCard';
import QuestionBankStats from './QuestionBankStats';
import useQuestionBank from '../../hooks/useQuestionBank';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(103, 58, 183, 0); }
  100% { box-shadow: 0 0 0 0 rgba(103, 58, 183, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const slideIn = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

// Styled components
const ModernCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  overflow: 'hidden',
  background: '#ffffff',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  border: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  minHeight: '300px',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  }
}));

const FilterChip = styled(Chip)(({ theme, active }) => ({
  fontWeight: 600,
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  height: 32,
  ...(active && {
    background: `linear-gradient(45deg, #663399, #42a5f5)`,
    color: 'white',
    boxShadow: `0 4px 12px ${alpha('#663399', 0.3)}`,
    transform: 'translateY(-2px)',
  }),
  '&:hover': {
    transform: active ? 'translateY(-2px)' : 'translateY(-1px)',
    boxShadow: active 
      ? `0 6px 16px ${alpha('#663399', 0.4)}`
      : `0 4px 12px ${alpha('#663399', 0.2)}`,
  }
}));

const SearchBox = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: alpha('#ffffff', 0.95),
    backdropFilter: 'blur(10px)',
    '&:hover fieldset': {
      borderColor: '#663399',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#663399',
      borderWidth: 2,
    },
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${alpha('#663399', 0.08)}, ${alpha('#42a5f5', 0.08)})`,
  border: `1px solid ${alpha('#663399', 0.15)}`,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, #663399, #42a5f5)`,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha('#663399', 0.2)}`,
  }
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)}, ${alpha('#f8f9ff', 0.95)})`,
  borderRadius: 24,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: `0 8px 32px ${alpha('#663399', 0.08)}`,
  border: `1px solid ${alpha('#663399', 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, #663399, #42a5f5, #1565c0)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s ease-in-out infinite`,
  }
}));

const QuestionBankManager = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    questionType: '',
    difficulty: '',
    course: '',
    lesson: ''
  });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const {
    questions = [],
    loading = false,
    error = null,
    stats = null,
    lessons = [],
    pagination = { page: 1, pageSize: 20, totalPages: 1, totalCount: 0 },
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkDeleteQuestions,
    searchQuestions,
    filterQuestions,
    setPage,
    setPageSize,
    goToNextPage,
    goToPreviousPage,
    clearError
  } = useQuestionBank();

  // Debug logging
  console.log('QuestionBankManager - lessons:', lessons);
  console.log('QuestionBankManager - lessons type:', typeof lessons, 'Is array:', Array.isArray(lessons));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (question = null) => {
    setEditingQuestion(question);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuestion(null);
  };

  const handleQuestionSubmit = async (questionData) => {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, questionData);
      } else {
        await createQuestion(questionData);
      }
      handleCloseDialog();
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      try {
        await deleteQuestion(questionId);
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleSearch = async (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    
    if (searchValue.trim()) {
      await searchQuestions(searchValue, filters);
    } else {
      await fetchQuestions();
    }
  };

  const handleFilterChange = async (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    
    // Apply filters
    if (searchTerm.trim()) {
      await searchQuestions(searchTerm, newFilters);
    } else {
      await filterQuestions(newFilters);
    }
  };

  const handleBulkAction = async () => {
    if (selectedQuestions.length === 0) return;

    try {
      if (bulkAction === 'delete') {
        if (window.confirm(`هل أنت متأكد من حذف ${selectedQuestions.length} سؤال؟`)) {
          const result = await bulkDeleteQuestions(selectedQuestions);
          if (result.success) {
            setSelectedQuestions([]);
            // Show success message
            console.log(result.message);
          } else {
            // Show error message
            console.error(result.error);
          }
        }
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  // Use questions directly from API (filtering is done server-side)
  const filteredQuestions = questions;

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'mcq': return <QuestionAnswerIcon />;
      case 'true_false': return <CheckCircleIcon />;
      case 'short_answer': return <EditIcon />;
      case 'essay': return <AssessmentIcon />;
      case 'fill_blank': return <PsychologyIcon />;
      default: return <QuizIcon />;
    }
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      'mcq': 'اختيار من متعدد',
      'true_false': 'صح أو خطأ',
      'short_answer': 'إجابة قصيرة',
      'essay': 'مقال',
      'fill_blank': 'ملء الفراغ',
      'matching': 'مطابقة',
      'ordering': 'ترتيب'
    };
    return types[type] || type;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    const difficulties = {
      'easy': 'سهل',
      'medium': 'متوسط',
      'hard': 'صعب'
    };
    return difficulties[difficulty] || difficulty;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Compact Header Skeleton */}
        <Box sx={{ 
          mb: 4, 
          p: 3, 
          background: 'linear-gradient(135deg, #663399 0%, #42a5f5 100%)',
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
              <QuizIcon sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                بنك الأسئلة
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
              إدارة وإنشاء الأسئلة لمختلف المقررات والاختبارات
            </Typography>
          </Box>
        </Box>
        
        <Container sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 2 }} />
                <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="40%" />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Compact Header */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        background: 'linear-gradient(90deg, #333679 0%, #4DBFB3 100%)',
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
            <QuizIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
          بنك الأسئلة
        </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
          إدارة وإنشاء الأسئلة لمختلف المقررات والاختبارات
        </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 3 }}>
        {/* Create Question Button - Fixed */}
        <Box sx={{ position: 'fixed', top: 100, left: 32, zIndex: 1200 }}>
          <IconButton
            onClick={() => handleOpenDialog()}
            sx={{
              width: 56,
              height: 56,
              background: 'linear-gradient(90deg, #333679 0%, #4DBFB3 100%)',
              boxShadow: '0 4px 20px rgba(14, 81, 129, 0.3)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(90deg, #0a3d5f 0%, #d17a6e 100%)',
                boxShadow: '0 6px 25px rgba(14, 81, 129, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <AddIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
        
        {/* Compact Statistics Row */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4, 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            backgroundColor: 'background.paper', 
            borderRadius: 2, 
            border: '1px solid #e0e0e0',
            minWidth: 140,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <QuizIcon sx={{ color: '#663399', fontSize: 24 }} />
                <Box>
              <Typography variant="h5" fontWeight={700} color="primary">
                    {stats?.total_questions || 0}
                  </Typography>
              <Typography variant="caption" color="text.secondary">
                    إجمالي الأسئلة
                  </Typography>
                </Box>
              </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            backgroundColor: 'background.paper', 
            borderRadius: 2, 
            border: '1px solid #e0e0e0',
            minWidth: 140,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <QuestionAnswerIcon sx={{ color: '#2e7d32', fontSize: 24 }} />
                <Box>
              <Typography variant="h5" fontWeight={700} color="success.main">
                    {stats?.questions_by_type?.mcq || 0}
                  </Typography>
              <Typography variant="caption" color="text.secondary">
                اختيار من متعدد
                  </Typography>
                </Box>
              </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            backgroundColor: 'background.paper', 
            borderRadius: 2, 
            border: '1px solid #e0e0e0',
            minWidth: 140,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <TrendingUpIcon sx={{ color: '#f57c00', fontSize: 24 }} />
                <Box>
              <Typography variant="h5" fontWeight={700} color="warning.main">
                    {stats?.questions_by_difficulty?.medium || 0}
                  </Typography>
              <Typography variant="caption" color="text.secondary">
                متوسطة الصعوبة
                  </Typography>
                </Box>
              </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            backgroundColor: 'background.paper', 
            borderRadius: 2, 
            border: '1px solid #e0e0e0',
            minWidth: 140,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <SchoolIcon sx={{ color: '#7b1fa2', fontSize: 24 }} />
                <Box>
              <Typography variant="h5" fontWeight={700} color="secondary.main">
                    0
                  </Typography>
              <Typography variant="caption" color="text.secondary">
                    المقررات المتاحة
                  </Typography>
                </Box>
              </Box>
        </Box>

        {/* Filters and Search */}
        <HeaderContainer>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mr: 2, color: 'primary.main' }}>
              تصفية الأسئلة:
            </Typography>
            
            <SearchBox
                      placeholder="البحث في الأسئلة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: 280, 
                flexGrow: 1,
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FilterChip
                label="الكل"
                onClick={() => setFilters({...filters, questionType: '', difficulty: '', course: '', lesson: ''})}
                active={!filters.questionType && !filters.difficulty && !filters.course && !filters.lesson}
              />
              <FilterChip
                label="اختيار من متعدد"
                onClick={() => setFilters({...filters, questionType: 'mcq'})}
                active={filters.questionType === 'mcq'}
              />
              <FilterChip
                label="صح أو خطأ"
                onClick={() => setFilters({...filters, questionType: 'true_false'})}
                active={filters.questionType === 'true_false'}
              />
              <FilterChip
                label="إجابة قصيرة"
                onClick={() => setFilters({...filters, questionType: 'short_answer'})}
                active={filters.questionType === 'short_answer'}
              />
            </Box>
              </Box>
        </HeaderContainer>

        {/* Main Content */}
        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <>

              {/* Bulk Actions */}
              {selectedQuestions.length > 0 && (
                <Paper sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">
                      تم تحديد {selectedQuestions.length} سؤال
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>إجراء جماعي</InputLabel>
                      <Select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                      >
                        <MenuItem value="delete">حذف</MenuItem>
                        <MenuItem value="export">تصدير</MenuItem>
                        <MenuItem value="duplicate">نسخ</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleBulkAction}
                      disabled={!bulkAction}
                    >
                      تطبيق
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedQuestions([])}
                    >
                      إلغاء التحديد
                    </Button>
                  </Box>
                </Paper>
              )}

              {/* Questions List */}
              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : filteredQuestions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      لا توجد أسئلة {searchTerm && `مطابقة لـ "${searchTerm}"`}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                      sx={{ 
                        borderRadius: 2,
                        background: 'linear-gradient(90deg, #333679 0%, #4DBFB3 100%)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #0a3d5f 0%, #d17a6e 100%)',
                        },
                      }}
                  >
                    إنشاء سؤال جديد
                  </Button>
                  </motion.div>
                </Box>
              ) : (
                <Box>
                  <AnimatePresence>
                    <Grid container spacing={3} sx={{ width: '100%' }}>
                  {filteredQuestions.map((question) => (
                        <Grid item xs={12} md={6} key={question.id} sx={{ display: 'flex' }}>
                      <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                            style={{ width: '100%' }}
                          >
                            <ModernCard 
                              sx={{ height: '100%', cursor: 'pointer', width: '100%' }}
                            >
                              <CardContent sx={{ 
                                flexGrow: 1, 
                                p: 3, 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                minHeight: '300px'
                              }}>
                                {/* Header with Type and Difficulty */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip
                                    label={getQuestionTypeLabel(question.question_type)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                      sx={{ fontWeight: 600 }}
                                  />
                                  <Chip
                                    label={getDifficultyLabel(question.difficulty_level)}
                                    size="small"
                                    color={getDifficultyColor(question.difficulty_level)}
                                    variant="outlined"
                                      sx={{ fontWeight: 600 }}
                                  />
                                  </Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    {new Date(question.created_at).toLocaleDateString('en-US')}
                                  </Typography>
                                </Box>
                                
                                {/* Question Text */}
                                <Typography variant="body1" sx={{ 
                                  fontWeight: 500, 
                                  lineHeight: 1.4, 
                                  minHeight: '4.2em',
                                  maxHeight: '4.2em',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  color: '#333',
                                  fontSize: '0.95rem',
                                  mb: 2
                                }}>
                                  {question.question_text}
                                </Typography>
                                
                                {/* Course and Lesson Info */}
                                {(question.course_title || question.lesson_title) && (
                                  <Box sx={{ mb: 2 }}>
                                {question.course_title && (
                                      <Typography variant="caption" color="text.secondary" sx={{ 
                                        display: 'block', 
                                        mb: 0.5,
                                        fontWeight: 500,
                                        fontSize: '0.8rem'
                                      }}>
                                        📚 {question.course_title}
                                  </Typography>
                                )}
                                {question.lesson_title && (
                                      <Typography variant="caption" color="text.secondary" sx={{ 
                                        display: 'block',
                                        fontWeight: 500,
                                        fontSize: '0.8rem'
                                      }}>
                                        📖 الدرس: {question.lesson_title}
                                  </Typography>
                                )}
                              </Box>
                                )}
                                
                                {/* Footer with Actions */}
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  mt: 'auto'
                                }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1,
                                    alignItems: 'center'
                                  }}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<VisibilityIcon />}
                                      onClick={() => handleOpenDialog(question)}
                                      sx={{
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        backgroundColor: '#4DBFB3',
                                        color: 'white',
                                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                                        '&:hover': {
                                          backgroundColor: '#388e3c',
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                                        }
                                      }}
                                    >
                                      عرض
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<EditIcon />}
                                      onClick={() => handleOpenDialog(question)}
                                      sx={{
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        borderColor: '#663399',
                                        color: '#663399',
                                        '&:hover': {
                                          borderColor: '#1565c0',
                                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                          transform: 'translateY(-1px)',
                                        }
                                      }}
                                    >
                                      تعديل
                                    </Button>
                            </Box>

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="نسخ">
                                  <IconButton size="small">
                                        <CopyIcon sx={{ fontSize: 16, color: '#999' }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="حذف">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                  >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </CardContent>
                            </ModernCard>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
                  </AnimatePresence>
                </Box>
              )}
            </>
          )}

          {tabValue === 1 && (
            <QuestionBankStats stats={stats} />
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                الأسئلة الأكثر استخداماً
              </Typography>
              <List>
                {stats?.most_used_questions?.map((question, index) => (
                  <ListItem key={question.id} divider>
                    <ListItemText
                      primary={`${index + 1}. ${question.question_text}`}
                      secondary={`تم استخدامها ${question.usage_count} مرة`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={`${question.usage_count} استخدام`}
                        color="primary"
                        variant="outlined"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Container>

      {/* Question Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <QuestionForm
            question={editingQuestion}
            onSubmit={handleQuestionSubmit}
            onCancel={handleCloseDialog}
            lessons={lessons || []}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default QuestionBankManager;
