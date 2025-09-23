import React from 'react';
import {
    Box,
    Typography,
    Alert,
    Chip,
    Card,
    CardContent,
    List,
    ListItem,
    Collapse,
    IconButton
} from '@mui/material';
import {
    VideoLibrary as VideoLibraryIcon,
    Article as ArticleIcon,
    AccessTime,
    Lock as LockIcon,
    CheckCircle as CheckCircleIcon,
    CheckCircleOutline,
    KeyboardArrowDown,
    KeyboardArrowUp
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const ContentSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 0),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 0),
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: '#333679',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
    },
}));

const ModuleCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    borderRadius: 3,
    background: 'linear-gradient(135deg, rgba(14, 81, 129, 0.05) 0%, rgba(229, 151, 139, 0.05) 100%)',
    border: '1px solid rgba(14, 81, 129, 0.1)',
    boxShadow: '0 8px 25px rgba(14, 81, 129, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 12px 35px rgba(14, 81, 129, 0.15)',
        borderColor: 'rgba(14, 81, 129, 0.2)',
    }
}));

const ModuleHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    backgroundColor: 'background.paper',
    cursor: 'pointer',
    borderRadius: 3,
    '&:hover': {
        backgroundColor: 'rgba(14, 81, 129, 0.04)',
    },
}));

const LessonItem = styled(ListItem)(({ theme, completed, preview }) => ({
    backgroundColor: 'background.paper',
    padding: theme.spacing(0),
    paddingY: theme.spacing(1),
    transform: 'none',
    '&:hover': {
        transform: 'none',
        backgroundColor: 'transparent'
    },
    ...(completed && {
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
        borderLeft: '3px solid #4caf50',
    }),
    ...(preview && {
        backgroundColor: 'rgba(14, 81, 129, 0.05)',
        borderLeft: '3px solid #333679',
    }),
}));

const CourseContentTab = ({
    course,
    totalLessons,
    expandedModules,
    toggleModule,
    getLessonIcon
}) => {
    if (!course) {
        return null;
    }

    return (
        <ContentSection>
            {/* Alert for non-enrolled users */}
            {!course.isEnrolled && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(14, 81, 129, 0.05) 0%, rgba(229, 151, 139, 0.05) 100%)',
                        border: '1px solid rgba(14, 81, 129, 0.1)',
                        '& .MuiAlert-icon': {
                            color: '#333679'
                        }
                    }}
                >
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                        🔒 محتوى الدورة الحقيقي
                    </Typography>
                    <Typography variant="body2">
                        هذا هو المحتوى الحقيقي للدورة من قاعدة البيانات، يتضمن المحاضرات والواجبات والكويزات والامتحانات. سجل في الدورة للوصول إلى جميع المحتويات.
                    </Typography>
                </Alert>
            )}

            {/* Success message for enrolled users */}
            {course.isEnrolled && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.1)',
                        '& .MuiAlert-icon': {
                            color: '#4caf50'
                        }
                    }}
                >
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                        ✅ محتوى الدورة الكامل
                    </Typography>
                    <Typography variant="body2">
                        مرحباً بك في الدورة! يمكنك الآن الوصول إلى جميع المحتويات: المحاضرات والواجبات والكويزات والامتحانات.
                    </Typography>
                </Alert>
            )}

            <Box sx={{
                mb: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <VideoLibraryIcon sx={{ color: 'primary.main' }} />
                    <SectionTitle variant="h5" component="h2" sx={{ mb: 0 }}>
                        محتوى الدورة
                    </SectionTitle>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                        size="small"
                        color="default"
                        variant="outlined"
                        icon={<VideoLibraryIcon />}
                        label={`${Array.isArray(course.modules) ? course.modules.length : 0} أقسام`}
                    />
                    <Chip
                        size="small"
                        color="default"
                        variant="outlined"
                        icon={<ArticleIcon />}
                        label={`${totalLessons} محاضرة`}
                    />
                    <Chip
                        size="small"
                        color="default"
                        variant="outlined"
                        icon={<AccessTime />}
                        label={`${course.totalHours} ساعة`}
                    />
                    {!course.isEnrolled && (
                        <Chip
                            size="small"
                            color="warning"
                            variant="outlined"
                            icon={<LockIcon />}
                            label="محتوى حقيقي"
                        />
                    )}
                    {course.isEnrolled && (
                        <Chip
                            size="small"
                            color="success"
                            variant="outlined"
                            icon={<CheckCircleIcon />}
                            label="محتوى كامل"
                        />
                    )}
                </Box>
            </Box>

            {/* Course Curriculum with hierarchical structure */}
            <Box sx={{ mb: 1 }}>
                {Array.isArray(course.modules) ? course.modules.map((module, moduleIndex) => (
                    <ModuleCard
                        key={module.id}
                        elevation={0}
                    >
                        <ModuleHeader
                            onClick={() => toggleModule(module.id)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(14, 81, 129, 0.1)',
                                    border: '2px solid rgba(14, 81, 129, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    color: '#333679',
                                    fontSize: '1.1rem'
                                }}>
                                    {moduleIndex + 1}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} dir="rtl" sx={{ color: '#333679', fontSize: '1.1rem' }}>
                                        {module.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666' }}>
                                        {(() => {
                                            const mainLessons = module.lessons ? module.lessons.length : 0;
                                            const subModulesLessons = module.submodules ? 
                                                module.submodules.reduce((total, sub) => total + (sub.lessons ? sub.lessons.length : 0), 0) : 0;
                                            const totalLessons = mainLessons + subModulesLessons;
                                            return `${totalLessons} درس`;
                                        })()}
                                        {module.submodules && module.submodules.length > 0 && ` • ${module.submodules.length} وحدة فرعية`}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {(() => {
                                    const completedInModule = module?.lessons?.filter((l) => l?.completed)?.length || 0;
                                    const totalInModule = module?.lessons?.length || 0;
                                    const percent = totalInModule ? Math.round((completedInModule / totalInModule) * 100) : 0;
                                    return (
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            icon={<CheckCircleOutline />}
                                            label={`إنجاز: ${completedInModule}/${totalInModule} (${percent}%)`}
                                            sx={{
                                                bgcolor: 'rgba(14, 81, 129, 0.08)',
                                                borderColor: '#333679',
                                                color: '#333679',
                                                fontWeight: 600
                                            }}
                                        />
                                    );
                                })()}
                                <AccessTime fontSize="small" sx={{ color: '#4DBFB3', opacity: 0.9 }} />
                                <Typography variant="body2" sx={{ color: '#4DBFB3', opacity: 0.9, fontWeight: 600 }}>
                                    {module.duration}
                                </Typography>
                            </Box>
                            {expandedModules[module.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </ModuleHeader>
                        
                        <Collapse in={expandedModules[module.id]} timeout="auto" unmountOnExit>
                            <List disablePadding sx={{ px: 2, pb: 2, bgcolor: 'background.paper' }}>
                                {/* Main Module Lessons */}
                                {Array.isArray(module.lessons) && module.lessons.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" fontWeight={600} sx={{ 
                                            color: '#333679',
                                            display: 'block',
                                            mb: 1,
                                            px: 1
                                        }}>
                                            دروس الوحدة الرئيسية ({module.lessons.length})
                                        </Typography>
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <LessonItem
                                                key={lesson.id}
                                                completed={lesson.completed}
                                                preview={lesson.isPreview}
                                            >
                                                <Box sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'row-reverse',
                                                    border: '1px solid rgba(14, 81, 129, 0.2)',
                                                    borderRadius: 2,
                                                    px: 2.5,
                                                    py: 1.5,
                                                    bgcolor: 'background.paper',
                                                    transition: 'all 0.3s ease',
                                                    opacity: !course.isEnrolled && !lesson.isPreview ? 0.6 : 1,
                                                    '&:hover': {
                                                        borderColor: '#333679',
                                                        bgcolor: 'rgba(14, 81, 129, 0.02)',
                                                        transform: course.isEnrolled || lesson.isPreview ? 'translateX(-5px)' : 'none'
                                                    }
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', opacity: 0.95 }}>
                                                            {!course.isEnrolled && !lesson.isPreview ? (
                                                                <LockIcon sx={{ color: '#4DBFB3', fontSize: '1.2rem' }} />
                                                            ) : (
                                                                getLessonIcon(lesson)
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2" dir="rtl" sx={{
                                                            color: !course.isEnrolled && !lesson.isPreview ? 'text.secondary' : 'text.primary',
                                                            fontWeight: 500
                                                        }}>
                                                            {lesson.title}
                                                            {!course.isEnrolled && !lesson.isPreview && (
                                                                <Typography component="span" variant="caption" sx={{
                                                                    color: '#4DBFB3',
                                                                    ml: 1,
                                                                    fontSize: '0.7rem'
                                                                }}>
                                                                    (محتوى محمي)
                                                                </Typography>
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ color: '#4DBFB3', fontWeight: 600 }}>
                                                            {lesson.duration}
                                                        </Typography>
                                                        {lesson.isPreview && (
                                                            <Chip
                                                                size="small"
                                                                label="عرض مجاني"
                                                                sx={{
                                                                    bgcolor: 'rgba(14, 81, 129, 0.1)',
                                                                    color: '#333679',
                                                                    fontSize: '0.7rem',
                                                                    height: 20
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </LessonItem>
                                        ))}
                                    </Box>
                                )}

                                {/* Sub Modules */}
                                {Array.isArray(module.submodules) && module.submodules.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" fontWeight={600} sx={{ 
                                            color: '#333679',
                                            display: 'block',
                                            mb: 1,
                                            px: 1
                                        }}>
                                            الوحدات الفرعية ({module.submodules.length})
                                        </Typography>
                                        {module.submodules.map((subModule, subIndex) => (
                                            <Box key={subModule.id} sx={{ mb: 1 }}>
                                                {/* Sub Module Header */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)',
                                                    border: '1px solid rgba(76, 175, 80, 0.2)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.04) 100%)',
                                                        borderColor: 'rgba(76, 175, 80, 0.3)'
                                                    }
                                                }}
                                                onClick={() => toggleModule(`sub_${subModule.id}`)}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                            border: '2px solid rgba(76, 175, 80, 0.3)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            color: '#4caf50',
                                                            fontSize: '0.8rem'
                                                        }}>
                                                            {subIndex + 1}
                                                        </Box>
                                                        <Typography variant="body2" fontWeight={600} sx={{ color: '#4caf50' }}>
                                                            {subModule.title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#666' }}>
                                                            ({subModule.lessons ? subModule.lessons.length : 0} درس)
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                            {subModule.duration}
                                                        </Typography>
                                                        {expandedModules[`sub_${subModule.id}`] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </Box>
                                                </Box>

                                                {/* Sub Module Lessons */}
                                                <Collapse in={expandedModules[`sub_${subModule.id}`]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ ml: 2, mt: 1 }}>
                                                        {Array.isArray(subModule.lessons) && subModule.lessons.map((lesson, lessonIndex) => (
                                                            <LessonItem
                                                                key={lesson.id}
                                                                completed={lesson.completed}
                                                                preview={lesson.isPreview}
                                                            >
                                                                <Box sx={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    flexDirection: 'row-reverse',
                                                                    border: '1px solid rgba(76, 175, 80, 0.2)',
                                                                    borderRadius: 2,
                                                                    px: 2,
                                                                    py: 1,
                                                                    bgcolor: 'rgba(76, 175, 80, 0.02)',
                                                                    transition: 'all 0.3s ease',
                                                                    opacity: !course.isEnrolled && !lesson.isPreview ? 0.6 : 1,
                                                                    '&:hover': {
                                                                        borderColor: '#4caf50',
                                                                        bgcolor: 'rgba(76, 175, 80, 0.04)',
                                                                        transform: course.isEnrolled || lesson.isPreview ? 'translateX(-3px)' : 'none'
                                                                    }
                                                                }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', opacity: 0.95 }}>
                                                                            {!course.isEnrolled && !lesson.isPreview ? (
                                                                                <LockIcon sx={{ color: '#4caf50', fontSize: '1rem' }} />
                                                                            ) : (
                                                                                getLessonIcon(lesson)
                                                                            )}
                                                                        </Box>
                                                                        <Typography variant="body2" dir="rtl" sx={{
                                                                            color: !course.isEnrolled && !lesson.isPreview ? 'text.secondary' : 'text.primary',
                                                                            fontWeight: 500,
                                                                            fontSize: '0.9rem'
                                                                        }}>
                                                                            {lesson.title}
                                                                            {!course.isEnrolled && !lesson.isPreview && (
                                                                                <Typography component="span" variant="caption" sx={{
                                                                                    color: '#4caf50',
                                                                                    ml: 1,
                                                                                    fontSize: '0.65rem'
                                                                                }}>
                                                                                    (محتوى محمي)
                                                                                </Typography>
                                                                            )}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.75rem' }}>
                                                                            {lesson.duration}
                                                                        </Typography>
                                                                        {lesson.isPreview && (
                                                                            <Chip
                                                                                size="small"
                                                                                label="عرض مجاني"
                                                                                sx={{
                                                                                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                                                    color: '#4caf50',
                                                                                    fontSize: '0.65rem',
                                                                                    height: 18
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            </LessonItem>
                                                        ))}
                                                    </Box>
                                                </Collapse>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </List>
                        </Collapse>
                    </ModuleCard>
                )) : null}
            </Box>
        </ContentSection>
    );
};

export default CourseContentTab;
