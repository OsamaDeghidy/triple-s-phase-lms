import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container
} from '@mui/material';
import {
    PeopleAltOutlined,
    PlayCircleOutline,
    AccessTime,
    ArrowForward
} from '@mui/icons-material';

const CourseDetailBottomBar = ({
    course,
    isAddingToCart,
    handleAddToCart
}) => {
    // Return null if course data is not loaded yet
    if (!course) {
        return null;
    }

    return (
        <Box sx={{
            display: { xs: 'block', md: 'none' }, // Show only on small screens
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
            p: 2,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            width: '100%', // Fixed width
            maxWidth: '100vw', // Prevent expansion
            boxSizing: 'border-box'
        }}>
            <Container maxWidth="sm" sx={{ width: '100%', maxWidth: '100%' }}>
                {/* Vertical Layout for Mobile */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: '100%'
                }}>
                    {/* Top Row - Image and Price */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                        minWidth: 0 // Prevent overflow
                    }}>
                        {/* Course Image */}
                        <Box
                            sx={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                backgroundImage: 'url(/src/assets/images/CourseDetail.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                flexShrink: 0
                            }}
                        />

                        {/* Price and Title */}
                        <Box sx={{
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden' // Prevent text overflow
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                mb: 0.5,
                                fontSize: '1.2rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                ${course?.price || '74.00'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                                fontSize: '0.9rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {course?.title || 'Mastering Internal Medicine'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Course Info Icons */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        width: '100%',
                        flexWrap: 'wrap' // Allow wrapping if needed
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            minWidth: 0,
                            flex: '1 1 auto'
                        }}>
                            <PeopleAltOutlined sx={{ color: '#666', fontSize: 14 }} />
                            <Typography sx={{
                                color: '#666',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {course?.instructor || 'Eleanor Fant'}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            minWidth: 0,
                            flex: '1 1 auto'
                        }}>
                            <PlayCircleOutline sx={{ color: '#666', fontSize: 14 }} />
                            <Typography sx={{
                                color: '#666',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {course?.videoCount || '14'} Videos
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            minWidth: 0,
                            flex: '1 1 auto'
                        }}>
                            <AccessTime sx={{ color: '#666', fontSize: 14 }} />
                            <Typography sx={{
                                color: '#666',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {course?.duration || '6 Hours'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Add to Cart Button */}
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        sx={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            fontWeight: 'bold',
                            py: 1.5,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '14px',
                            width: '100%',
                            maxWidth: '100%',
                            '&:hover': {
                                backgroundColor: '#218838'
                            }
                        }}
                    >
                        {isAddingToCart ? 'Adding...' : 'Add To Cart'}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default CourseDetailBottomBar;
