import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Grid,
    Breadcrumbs,
    Chip
} from '@mui/material';
import {
    PeopleAltOutlined,
    PlayCircleOutline,
    AccessTime,
    ArrowForward,
    School as SchoolIcon,
    Star as StarIcon
} from '@mui/icons-material';

const CourseDetailCard = ({
    course,
    isAddingToCart,
    handleAddToCart
}) => {
    // Return null if course data is not loaded yet
    if (!course) {
        return null;
    }

    return (
        <>
            {/* Desktop Layout - Complete Course Detail Page */}
            <Box sx={{
                display: { xs: 'none', md: 'block' },
                bgcolor: '#ffffff',
                minHeight: '60vh',
                '@keyframes float': {
                    '0%, 100%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-15px)'
                    }
                }
            }}>
                <Container maxWidth="lg" sx={{ py: 0, px: { xs: 2, sm: 3, md: 4 }, display: 'flex', justifyContent: 'flex-start' }}>
                    <Box sx={{ maxWidth: '1200px', width: '100%', direction: 'rtl', margin: '0 auto' }}>



                        {/* Main Content - Full Width Layout with Right Side Card */}
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            {/* Course Visual - Full Width with Enhanced Design */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '600px',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    mb: 4,
                                    background: 'linear-gradient(135deg, #1B1B48 0%, #333679 50%, #663399 100%)',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                {/* Left Side - Enhanced Content Area */}
                                <Box
                                    sx={{
                                        width: '65%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        p: 8,
                                        position: 'relative',
                                        zIndex: 2,
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        borderRight: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {/* Triple 8 Academy Logo - Larger Size */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 8 }}>
                                        <Box
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                backgroundImage: 'url(/src/assets/images/logo.png)',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                mr: 4,
                                                filter: 'brightness(0) invert(1)',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                                borderRadius: '50%',
                                                border: '3px solid rgba(255, 255, 255, 0.2)'
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '32px',
                                                    fontWeight: 'bold',
                                                    lineHeight: 1,
                                                    mb: 1,
                                                    textShadow: '0 3px 6px rgba(0,0,0,0.4)'
                                                }}
                                            >
                                                أكاديمية الثلاثي 8
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    fontSize: '16px',
                                                    lineHeight: 1.2,
                                                    fontWeight: 500,
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                منصة التعليم البرمجي
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Enhanced Course Title with JavaScript Theme */}
                                    <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {/* Enhanced JavaScript Logo */}
                                        <Box
                                            sx={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #F7DF1E 0%, #F0DB4F 50%, #FFD700 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '4px solid rgba(255, 255, 255, 0.4)',
                                                boxShadow: '0 8px 30px rgba(247, 223, 30, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                                                flexShrink: 0,
                                                position: 'relative',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: '-2px',
                                                    left: '-2px',
                                                    right: '-2px',
                                                    bottom: '-2px',
                                                    background: 'linear-gradient(45deg, #F7DF1E, #F0DB4F, #FFD700)',
                                                    borderRadius: '50%',
                                                    zIndex: -1,
                                                    opacity: 0.3
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: '#000',
                                                    fontSize: '36px',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'monospace',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                JS
                                            </Typography>
                                        </Box>

                                        {/* Enhanced Arabic Title Text */}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    color: 'white',
                                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                                    fontWeight: 'bold',
                                                    lineHeight: 1.1,
                                                    textAlign: 'right',
                                                    textShadow: '0 3px 10px rgba(0,0,0,0.5)',
                                                    mb: 1,
                                                    direction: 'rtl',
                                                    background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}
                                            >
                                                {course?.title || 'إتقان الطب الباطني لامتحانات الترخيص'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right Side - Redesigned Image Section */}
                                <Box
                                    sx={{
                                        width: '35%',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                                        background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'url(/src/assets/images/coursedetailMGE.jpeg)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            opacity: 0.3,
                                            zIndex: 1
                                        }
                                    }}
                                >
                                    {/* Image Frame with Modern Design */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            zIndex: 2,
                                            width: '90%',
                                            height: '80%',
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            background: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'url(/src/assets/images/coursedetailMGE.jpeg)',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                opacity: 0.9,
                                                zIndex: 1
                                            }
                                        }}
                                    >

                                        {/* Course Badge */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: '20px',
                                                left: '20px',
                                                zIndex: 3,
                                                background: 'rgba(27, 27, 72, 0.9)',
                                                borderRadius: '15px',
                                                px: 2,
                                                py: 1,
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }}
                                            >
                                                دورة للمبتدئين
                                            </Typography>
                                        </Box>

                                        {/* Decorative Corner Elements */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: '10px',
                                                width: '30px',
                                                height: '30px',
                                                border: '2px solid rgba(255,255,255,0.5)',
                                                borderRight: 'none',
                                                borderBottom: 'none',
                                                borderRadius: '8px 0 0 0',
                                                zIndex: 3
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: '10px',
                                                right: '10px',
                                                width: '30px',
                                                height: '30px',
                                                border: '2px solid rgba(255,255,255,0.5)',
                                                borderLeft: 'none',
                                                borderTop: 'none',
                                                borderRadius: '0 0 8px 0',
                                                zIndex: 3
                                            }}
                                        />
                                    </Box>

                                </Box>
                            </Box>

                            {/* Floating Card - Positioned to the right side of screen */}
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                right: "105%",
                                transform: 'translateY(-50%)',
                                zIndex: 1000,
                                width: '350px'
                            }}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e0e0e0',
                                        height: 'fit-content',
                                        width: '100%',
                                        animation: 'float 4s ease-in-out infinite'
                                    }}
                                >
                                    {/* Small Thumbnail */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            height: '120px',
                                            backgroundImage: 'url(/src/assets/images/coursedetailMGE.jpeg)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '40%',
                                                bottom: 0,
                                                background: 'linear-gradient(135deg, #1B1B48 0%, #333679 50%, #663399 100%)'
                                            }
                                        }}
                                    />

                                    {/* Content */}
                                    <Box sx={{ p: 3 }}>
                                        {/* Price */}
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: '#333',
                                                fontWeight: 'bold',
                                                mb: 3,
                                                fontSize: '2rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            ${course?.price || '74.00'}
                                        </Typography>

                                        {/* Course Information */}
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2,
                                                pb: 1,
                                                borderBottom: '1px dotted #e0e0e0'
                                            }}>
                                                <PeopleAltOutlined sx={{ color: '#666', fontSize: 18, mr: 2 }} />
                                                <Typography sx={{ color: '#333', fontSize: '14px' }}>
                                                    <span style={{ color: '#666' }}>المدرب:</span> <span style={{ color: '#4A90E2' }}>{course?.instructor || 'إليانور فانت'}</span>
                                                </Typography>
                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2,
                                                pb: 1,
                                                borderBottom: '1px dotted #e0e0e0'
                                            }}>
                                                <PlayCircleOutline sx={{ color: '#666', fontSize: 18, mr: 2 }} />
                                                <Typography sx={{ color: '#333', fontSize: '14px' }}>
                                                    <span style={{ color: '#666' }}>الفيديوهات:</span> <span style={{ color: '#4A90E2' }}>{course?.videoCount || '14'}</span>
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <AccessTime sx={{ color: '#666', fontSize: 18, mr: 2 }} />
                                                <Typography sx={{ color: '#333', fontSize: '14px' }}>
                                                    <span style={{ color: '#666' }}>المدة:</span> <span style={{ color: '#4A90E2' }}>{course?.duration || '6 ساعات'}</span>
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Add To Cart Button */}
                                        <Button
                                            variant="contained"
                                            size="large"
                                            endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                                            sx={{
                                                backgroundColor: '#2D4A3E', // Dark green matching the left side
                                                color: 'white',
                                                fontWeight: 'bold',
                                                py: 2,
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontSize: '16px',
                                                width: '100%',
                                                '&:hover': {
                                                    backgroundColor: '#1e3328'
                                                }
                                            }}
                                            onClick={handleAddToCart}
                                            disabled={isAddingToCart}
                                        >
                                            {isAddingToCart ? 'جاري الإضافة...' : 'أضف إلى السلة'}
                                        </Button>
                                    </Box>
                                </Paper>

                                {/* Decorative Dots */}
                                <Box sx={{
                                    position: 'absolute',
                                    right: '-20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1
                                }}>
                                    {[...Array(5)].map((_, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: 4,
                                                height: 4,
                                                backgroundColor: '#666',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

        </>
    );
};

export default CourseDetailCard;
