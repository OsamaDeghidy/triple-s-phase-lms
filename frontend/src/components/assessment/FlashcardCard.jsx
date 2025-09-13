import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  QuestionAnswer as QuestionIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  FlipToBack as FlipIcon,
  FlipToFront as UnflipIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const FlashcardCard = ({ 
  flashcard, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  const theme = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذه البطاقة التعليمية؟')) {
      onDelete(flashcard.id);
    }
  };


  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
            }
          }}
        >
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#333679', width: 32, height: 32 }}>
                  <QuestionIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="#333679">
                  بطاقة تعليمية
                </Typography>
              </Box>
              
              {showActions && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="تعديل">
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit(flashcard)}
                      sx={{ color: '#1976d2' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="حذف">
                    <IconButton 
                      size="small" 
                      onClick={handleDelete}
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {/* Flip Card */}
            <Box 
              sx={{ 
                flex: 1,
                perspective: '1000px',
                cursor: 'pointer'
              }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Side */}
                <Card
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                      الوجه الأمامي
                    </Typography>
                    {flashcard.front_image && (
                      <Box sx={{ mb: 1, maxWidth: '80%', maxHeight: 80 }}>
                        <img 
                          src={flashcard.front_image} 
                          alt="Front" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain',
                            borderRadius: 4
                          }} 
                        />
                      </Box>
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        maxHeight: 60,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {flashcard.front_text}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Back Side */}
                <Card
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                      الوجه الخلفي
                    </Typography>
                    {flashcard.back_image && (
                      <Box sx={{ mb: 1, maxWidth: '80%', maxHeight: 80 }}>
                        <img 
                          src={flashcard.back_image} 
                          alt="Back" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain',
                            borderRadius: 4
                          }} 
                        />
                      </Box>
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        maxHeight: 60,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {flashcard.back_text}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Flip Button */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                size="small"
                startIcon={isFlipped ? <UnflipIcon /> : <FlipIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                sx={{ 
                  color: '#333679',
                  '&:hover': {
                    backgroundColor: alpha('#333679', 0.1)
                  }
                }}
              >
                {isFlipped ? 'عرض الوجه الأمامي' : 'عرض الوجه الخلفي'}
              </Button>
            </Box>

            {/* Footer Info */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="caption" color="text.secondary">
                    {flashcard.created_by_name || 'غير محدد'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(flashcard.created_at)}
                  </Typography>
                </Box>
              </Box>

              {flashcard.related_question_text && (
                <Chip
                  label="مرتبط بسؤال"
                  size="small"
                  sx={{ 
                    bgcolor: alpha('#333679', 0.1),
                    color: '#333679',
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default FlashcardCard;
