import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Chip,
  Avatar,
  Skeleton,
  Alert,
  IconButton
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  Psychology as PsychologyIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { contentAPI } from '../../services/content.service';
import assessmentService from '../../services/assessment.service';

const CourseDetails = ({ course, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState({
    lessons: false,
    questions: false,
    flashcards: false
  });

  useEffect(() => {
    if (course) {
      loadCourseData();
    }
  }, [course]);

  const loadCourseData = async () => {
    if (!course?.id) return;

    try {
      console.log('Loading data for course:', course.id);
      
      // Load lessons
      setLoading(prev => ({ ...prev, lessons: true }));
      try {
        const lessonsData = await contentAPI.getCourseModulesWithLessons(course.id);
        console.log('Lessons data:', lessonsData);
        const allLessons = lessonsData?.results?.flatMap(module => 
          module.lessons?.map(lesson => ({
            ...lesson,
            module_title: module.title
          })) || []
        ) || [];
        setLessons(allLessons);
        console.log('Processed lessons:', allLessons);
      } catch (err) {
        console.error('Error loading lessons:', err);
        // Add mock data for testing
        setLessons([
          {
            id: 1,
            title: 'مقدمة في البرمجة',
            module_title: 'الوحدة الأولى',
            duration: '30 دقيقة',
            is_completed: false
          },
          {
            id: 2,
            title: 'أساسيات JavaScript',
            module_title: 'الوحدة الأولى',
            duration: '45 دقيقة',
            is_completed: true
          }
        ]);
      }

      // Load questions
      setLoading(prev => ({ ...prev, questions: true }));
      try {
        const questionsData = await contentAPI.getCourseQuestionBank(course.id);
        console.log('Questions data:', questionsData);
        setQuestions(questionsData?.results || questionsData || []);
      } catch (err) {
        console.error('Error loading questions:', err);
        // Add mock data for testing
        setQuestions([
          {
            id: 1,
            question_text: 'ما هي لغة البرمجة المستخدمة في تطوير الويب؟',
            difficulty_level: 'easy',
            question_type: 'mcq'
          },
          {
            id: 2,
            question_text: 'اشرح مفهوم الـ DOM في JavaScript',
            difficulty_level: 'medium',
            question_type: 'essay'
          }
        ]);
      }

      // Load flashcards
      setLoading(prev => ({ ...prev, flashcards: true }));
      try {
        const flashcardsData = await contentAPI.getCourseFlashcards(course.id);
        console.log('Flashcards data:', flashcardsData);
        setFlashcards(flashcardsData?.results || flashcardsData || []);
      } catch (err) {
        console.error('Error loading flashcards:', err);
        // Add mock data for testing
        setFlashcards([
          {
            id: 1,
            front_text: 'ما هي لغة البرمجة المستخدمة في تطوير الويب؟',
            lesson_title: 'مقدمة في البرمجة'
          },
          {
            id: 2,
            front_text: 'ما هو الـ DOM؟',
            lesson_title: 'أساسيات JavaScript'
          }
        ]);
      }

    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(prev => ({ 
        ...prev, 
        lessons: false, 
        questions: false, 
        flashcards: false 
      }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDuration = (duration) => {
    if (!duration) return 'غير محدد';
    return duration;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'سهل';
      case 'medium': return 'متوسط';
      case 'hard': return 'صعب';
      default: return 'غير محدد';
    }
  };

  if (!course) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      dir="rtl"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Card sx={{
        width: '100%',
        height: '100%',
        background: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Course Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #333679, #1a6ba8)',
          borderRadius: '12px 12px 0 0',
          p: 1.5,
          color: 'white',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0 }}>
            <Avatar sx={{
              width: 35,
              height: 35,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <SchoolIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.25 }}>
                {course.title}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {course.description || 'لا يوجد وصف متاح'}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                width: 28,
                height: 28,
                '&:hover': { background: 'rgba(255,255,255,0.2)' }
              }}
            >
              ×
            </IconButton>
          </Box>

        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.8rem',
                minHeight: 40,
                textTransform: 'none'
              }
            }}
          >
            <Tab
              icon={<MenuBookIcon sx={{ fontSize: 16 }} />}
              label="الدروس"
              iconPosition="start"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            />
            <Tab
              icon={<QuizIcon sx={{ fontSize: 16 }} />}
              label="بنك الأسئلة"
              iconPosition="start"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            />
            <Tab
              icon={<PsychologyIcon sx={{ fontSize: 16 }} />}
              label="البطاقات التعليمية"
              iconPosition="start"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ 
          p: 1.5, 
          flex: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Lessons Tab */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#333679' }}>
                  دروس المقرر ({lessons.length})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                  sx={{ borderRadius: 2, fontSize: '0.8rem' }}
                >
                  بدء التعلم
                </Button>
              </Box>

              {loading.lessons ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                  ))}
                </Box>
              ) : lessons.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          borderColor: '#333679'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #333679, #1a6ba8)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}>
                              <MenuBookIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
                                {lesson.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {lesson.module_title} • {formatDuration(lesson.duration)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {lesson.is_completed && (
                                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                              )}
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                  background: 'linear-gradient(45deg, #333679, #1a6ba8)',
                                  borderRadius: 2,
                                  fontSize: '0.75rem',
                                  px: 1.5,
                                  py: 0.5,
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #1a6ba8, #333679)'
                                  }
                                }}
                              >
                                {lesson.is_completed ? 'مراجعة' : 'بدء'}
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  لا توجد دروس متاحة لهذا المقرر
                </Alert>
              )}
            </Box>
          )}

          {/* Questions Tab */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#333679' }}>
                  بنك الأسئلة ({questions.length})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<QuizIcon sx={{ fontSize: 16 }} />}
                  sx={{ borderRadius: 2, fontSize: '0.8rem' }}
                >
                  بدء الاختبار
                </Button>
              </Box>

              {loading.questions ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                  ))}
                </Box>
              ) : questions.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          borderColor: '#333679'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}>
                              <QuizIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
                                {question.question_text?.substring(0, 80)}...
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <Chip
                                  label={getDifficultyLabel(question.difficulty_level)}
                                  color={getDifficultyColor(question.difficulty_level)}
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                                <Chip
                                  label={question.question_type || 'اختيار من متعدد'}
                                  variant="outlined"
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              </Box>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
                              sx={{
                                background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                                borderRadius: 2,
                                fontSize: '0.75rem',
                                px: 1.5,
                                py: 0.5,
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #f57c00, #ff9800)'
                                }
                              }}
                            >
                              حل السؤال
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  لا توجد أسئلة متاحة لهذا المقرر
                </Alert>
              )}
            </Box>
          )}

          {/* Flashcards Tab */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#333679' }}>
                  البطاقات التعليمية ({flashcards.length})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PsychologyIcon sx={{ fontSize: 16 }} />}
                  sx={{ borderRadius: 2, fontSize: '0.8rem' }}
                >
                  بدء المراجعة
                </Button>
              </Box>

              {loading.flashcards ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                  ))}
                </Box>
              ) : flashcards.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {flashcards.map((flashcard, index) => (
                    <motion.div
                      key={flashcard.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          borderColor: '#333679'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #9c27b0, #673ab7)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}>
                              <PsychologyIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
                                {flashcard.front_text?.substring(0, 60)}...
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {flashcard.lesson_title || 'بدون درس مرتبط'}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
                              sx={{
                                background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
                                borderRadius: 2,
                                fontSize: '0.75rem',
                                px: 1.5,
                                py: 0.5,
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #673ab7, #9c27b0)'
                                }
                              }}
                            >
                              مراجعة
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  لا توجد بطاقات تعليمية متاحة لهذا المقرر
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

export default CourseDetails;
