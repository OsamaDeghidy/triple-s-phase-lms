import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../store/slices/authSlice';
import { useAuth } from '../../contexts/AuthContext';
import profileImage from '../../assets/images/profile.jpg';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Divider, Badge, InputBase, Paper
} from '@mui/material';
import {
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Assessment as AssessmentIcon, 
  Message as MessageIcon,
  Settings as SettingsIcon, 
  Notifications as NotificationsIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  CalendarToday as CalendarTodayIcon,
  Grade as GradeIcon,
  Home as HomeIcon,
  Quiz as QuizIcon,
  VideoCall as VideoCallIcon,
  Article as ArticleIcon
} from '@mui/icons-material';

const drawerWidth = 270;

// Navigation items for teacher
const teacherNavItems = [
  { text: 'الرئيسية', icon: <HomeIcon />, path: '/', exact: true },
  { text: 'لوحة التحكم', icon: <DashboardIcon />, path: '/teacher/dashboard' },
  { text: 'كورساتي', icon: <ClassIcon />, path: '/teacher/my-courses' },
  { text: 'بنك الأسئلة', icon: <QuizIcon />, path: '/teacher/question-bank' },
  // { text: 'الواجبات', icon: <AssignmentIcon />, path: '/teacher/assignments' },
  // { text: 'الكويزات', icon: <AssessmentIcon />, path: '/teacher/quizzes' },
  // { text: 'الامتحانات', icon: <AssessmentIcon />, path: '/teacher/exams' },
  { text: 'المحاضرات', icon: <VideoCallIcon />, path: '/teacher/meetings' },
  { text: 'المقالات', icon: <ArticleIcon />, path: '/teacher/articles' },
  { text: 'الإعدادات', icon: <SettingsIcon />, path: '/teacher/settings' },
];

// Navigation items for student
const studentNavItems = [
  { text: 'الرئيسية', icon: <HomeIcon />, path: '/', exact: true },
  { text: 'لوحة التحكم', icon: <DashboardIcon />, path: '/student/dashboard' },
  { text: 'كورساتي', icon: <ClassIcon />, path: '/student/my-courses' },
 // { text: 'واجباتي', icon: <AssignmentIcon />, path: '/student/assignments' },
  { text: 'محاضراتي', icon: <VideoCallIcon />, path: '/student/meetings' },
  { text: 'شهاداتي', icon: <SchoolIcon />, path: '/student/certificates' },
  { text: 'الإعدادات', icon: <SettingsIcon />, path: '/student/settings' },
];

const MainLayout = ({ children, toggleDarkMode, isDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getUserRole, user } = useAuth(); // Get user data from auth context
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Sample notifications data
  const notifications = [
    { id: 1, text: 'لديك واجب جديد في مادة الرياضيات', time: 'منذ 10 دقائق', read: false },
    { id: 2, text: 'تم إضافة درجات الاختبار النصفي', time: 'منذ ساعة', read: false },
    { id: 3, text: 'محاضرة جديدة متاحة', time: 'منذ يوم', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Get user data with fallbacks
  const getUserData = () => {
    if (user) {
      return {
        name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.username || 'مستخدم',
        email: user.email || '',
        avatar: user.profile_picture || profileImage,
        role: getUserRole() === 'instructor' ? 'مدرس' : 'طالب',
        description: user.bio || (getUserRole() === 'instructor' ? 'مدرس في المنصة' : 'طالب في المنصة')
      };
    }
    return {
      name: 'مستخدم',
      email: '',
      avatar: profileImage,
      role: 'طالب',
      description: 'طالب في المنصة'
    };
  };

  const userData = getUserData();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotifAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login');
    handleMenuClose();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setAnchorEl(null);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get user role from useAuth hook
  const userRole = getUserRole();
  
  // Select navigation items based on user role
  const getNavItems = () => {
    switch(userRole) {
      case 'instructor':
      case 'teacher':
        return teacherNavItems;
      case 'student':
      default:
        return studentNavItems;
    }
  };
  
  const navItems = getNavItems();
  
  // Check if a nav item is active based on current path
  const isActive = (itemPath, exact = false) => {
    if (exact) {
      return location.pathname === itemPath;
    }
    return location.pathname.startsWith(itemPath) && itemPath !== '/';
  };

  const drawer = (
    <Box sx={{
      height: '100%',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '24px 0 0 24px',
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      {/* User Profile */}
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3,
        background: 'rgba(14,81,129,0.05)', borderRadius: 3, p: 2, boxShadow: '0 2px 8px 0 rgba(14,81,129,0.07)'
      }}>
        <Avatar 
          src={userData.avatar} 
          alt={userData.name}
          sx={{
            width: 90, height: 90, mb: 1, border: '3px solid #4DBFB3', boxShadow: '0 2px 8px 0 rgba(14,81,129,0.09)'
          }}
        />
        <Typography fontWeight={700}>{userData.name}</Typography>
        <Typography variant="caption" color="text.secondary">{userData.description}</Typography>
      </Box>
      <Divider sx={{ width: '100%', mb: 2 }} />
      {/* Navigation */}
      <List sx={{ width: '100%' }}>
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <NavLink
              key={item.text}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                marginBottom: '8px',
                borderRadius: '8px',
                background: active ? 'linear-gradient(90deg, rgba(14,81,129,0.1) 0%, #fff 100%)' : 'none',
                boxShadow: active ? '0 2px 8px 0 rgba(14,81,129,0.10)' : 'none',
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  color: active ? '#333679' : '#757575',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(14,81,129,0.05) 0%, #fff 100%)',
                    color: '#333679'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: active ? '#333679' : '#bdbdbd',
                  fontSize: 24
                }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ fontWeight: 600 }} />
                {item.badge && (
                  <Badge badgeContent={item.badge} color="secondary" sx={{ position: 'absolute', left: 16 }} />
                )}
              </ListItemButton>
            </NavLink>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100%',
      background: '#f6f7fb', 
      direction: 'rtl', 
      overflow: 'hidden',
      '& *': {
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.02)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '4px',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.15)',
          },
        },
      },
    }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: drawerWidth, 
        flexShrink: 0, 
        position: 'relative', 
        height: '100%', 
        overflowY: 'auto',
        overflowX: 'hidden',
        '&:hover': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a8a8a8',
          },
        },
      }}>
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              background: 'transparent',
              boxShadow: 'none',
              position: 'relative',
              height: '100%',
              overflow: 'visible'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        width: '100%', // Changed to take full width
        '& > *:first-child': { // AppBar
          flexShrink: 0
        },
        '& > *:last-child': { // Content area
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 4,
          pt: 2,
          maxWidth: '100%', // Ensure content doesn't overflow
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.15)',
            },
          },
        }
      }}>
        {/* AppBar Wrapper */}
        <Box sx={{ position: 'relative', zIndex: 1000, overflow: 'visible' }}>
        {/* AppBar */}
        <AppBar position="static" elevation={0} sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)', 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(14,81,129,0.08)', 
          mb: 3, 
          borderRadius: 0,
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'visible',
          width: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #4DBFB3 0%, #333679 50%, #4DBFB3 100%)',
            zIndex: 1
          }
        }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: 1, position: 'relative', zIndex: 2 }}>
            {/* Search Bar with Enhanced Design */}
            <Paper
              component="form"
              sx={{ 
                p: '4px 12px', 
                display: 'flex', 
                alignItems: 'center', 
                width: 300, 
                background: 'rgba(255,255,255,0.9)', 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(14,81,129,0.1)',
                border: '1px solid rgba(77, 191, 179, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(14,81,129,0.15)',
                  border: '1px solid rgba(77, 191, 179, 0.3)',
                  transform: 'translateY(-1px)'
                },
                '&:focus-within': {
                  boxShadow: '0 8px 30px rgba(14,81,129,0.2)',
                  border: '1px solid #4DBFB3',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <InputBase 
                sx={{ 
                  ml: 1, 
                  flex: 1,
                  fontSize: '14px',
                  '& input': {
                    '&::placeholder': {
                      color: '#999',
                      opacity: 1
                    }
                  }
                }} 
                placeholder="ابحث عن الكورسات، الدروس، أو أي شيء..." 
                inputProps={{ 'aria-label': 'بحث' }} 
              />
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: 'linear-gradient(45deg, #4DBFB3, #333679)',
                mr: 1
              }} />
            </Paper>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Notification Dropdown with Enhanced Design */}
              <Box ref={notifRef} sx={{ position: 'relative' }}>
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    bgcolor: notifAnchorEl ? 'rgba(77, 191, 179, 0.15)' : 'rgba(77, 191, 179, 0.08)', 
                    p: 1.5,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(77, 191, 179, 0.2)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(77, 191, 179, 0.3)'
                    }
                  }}
                  onClick={handleNotifMenuOpen}
                >
                  <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                        boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.1)' },
                          '100%': { transform: 'scale(1)' }
                        }
                      }
                    }}
                  >
                    <NotificationsIcon sx={{ 
                      color: '#333679',
                      fontSize: 24,
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                    }} />
                  </Badge>
                </IconButton>
                
                {/* Notification Dropdown Menu */}
                {notifAnchorEl && (
                  <Paper 
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: 380,
                      maxHeight: 450,
                      overflowY: 'auto',
                      borderRadius: 3,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      zIndex: 10000,
                      p: 0,
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(77, 191, 179, 0.2)',
                      mt: 2,
                      overflow: 'hidden',
                      display: 'block',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #4DBFB3, #333679)',
                        zIndex: 1
                      }
                    }}
                  >
                    <Box sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, rgba(77, 191, 179, 0.05) 0%, rgba(51, 54, 121, 0.05) 100%)',
                      borderBottom: '1px solid rgba(77, 191, 179, 0.1)'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#333679' }}>
                          الإشعارات
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#4DBFB3', 
                            cursor: 'pointer',
                            fontWeight: 600,
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            bgcolor: 'rgba(77, 191, 179, 0.1)',
                            transition: 'all 0.2s',
                            '&:hover': { 
                              bgcolor: 'rgba(77, 191, 179, 0.2)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          تمييز الكل كمقروء
                        </Typography>
                      </Box>
                    </Box>
                    
                    <List sx={{ p: 2 }}>
                      {notifications.map((notification, index) => (
                        <ListItemButton 
                          key={notification.id}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            p: 2,
                            bgcolor: !notification.read ? 'rgba(77, 191, 179, 0.08)' : 'transparent',
                            border: !notification.read ? '1px solid rgba(77, 191, 179, 0.2)' : '1px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              bgcolor: 'rgba(77, 191, 179, 0.12)',
                              transform: 'translateX(4px)',
                              boxShadow: '0 4px 15px rgba(77, 191, 179, 0.2)'
                            }
                          }}
                        >
                          <Box sx={{ width: '100%', position: 'relative' }}>
                            {!notification.read && (
                              <Box sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#4DBFB3',
                                boxShadow: '0 0 8px rgba(77, 191, 179, 0.6)'
                              }} />
                            )}
                            <Typography variant="body2" sx={{ 
                              fontWeight: notification.read ? 500 : 700,
                              color: notification.read ? '#666' : '#333',
                              mb: 0.5,
                              lineHeight: 1.4
                            }}>
                              {notification.text}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: '#999',
                              fontSize: '11px',
                              fontWeight: 500
                            }}>
                              {notification.time}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      ))}
                    </List>
                    
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2,
                      borderTop: '1px solid rgba(77, 191, 179, 0.1)',
                      background: 'rgba(77, 191, 179, 0.02)'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#4DBFB3',
                          cursor: 'pointer',
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          bgcolor: 'rgba(77, 191, 179, 0.1)',
                          transition: 'all 0.2s',
                          '&:hover': { 
                            bgcolor: 'rgba(77, 191, 179, 0.2)',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        عرض جميع الإشعارات
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </Box>

              {/* Profile Dropdown */}
              <Box ref={profileRef} sx={{ position: 'relative' }}>
                <IconButton 
                  onClick={handleProfileMenuOpen}
                  sx={{ 
                    p: 0,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      borderRadius: '50%',
                      background: anchorEl ? 'linear-gradient(45deg, #4DBFB3, #333679)' : 'transparent',
                      zIndex: -1,
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <Avatar 
                    src={userData.avatar}
                    alt={userData.name}
                    sx={{ 
                      width: 44, 
                      height: 44, 
                      border: '3px solid white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(14,81,129,0.2)',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 25px rgba(14,81,129,0.4)',
                        border: '3px solid #4DBFB3'
                      }
                    }} 
                  />
                </IconButton>
                
                {/* Profile Dropdown Menu */}
                {anchorEl && (
                  <Paper 
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: 280,
                      borderRadius: 3,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      zIndex: 10000,
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(77, 191, 179, 0.2)',
                      mt: 2,
                      display: 'block',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #4DBFB3, #333679)',
                        zIndex: 1
                      }
                    }}
                  >
                    <Box sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      background: 'linear-gradient(135deg, rgba(77, 191, 179, 0.05) 0%, rgba(51, 54, 121, 0.05) 100%)',
                      borderBottom: '1px solid rgba(77, 191, 179, 0.1)'
                    }}>
                      <Avatar 
                        src={userData.avatar}
                        alt={userData.name}
                        sx={{ 
                          width: 72, 
                          height: 72, 
                          mb: 2,
                          mx: 'auto',
                          border: '3px solid #4DBFB3',
                          boxShadow: '0 4px 20px rgba(77, 191, 179, 0.3)'
                        }} 
                      />
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#333679', mb: 0.5 }}>
                        {userData.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#4DBFB3', 
                        fontWeight: 600,
                        mb: 0.5
                      }}>
                        {userData.role}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#666',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {userData.email}
                      </Typography>
                    </Box>
                    
                    <List sx={{ p: 2 }}>
                      <ListItemButton sx={{ 
                        borderRadius: 2,
                        mb: 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          bgcolor: 'rgba(77, 191, 179, 0.1)',
                          transform: 'translateX(4px)',
                          boxShadow: '0 2px 10px rgba(77, 191, 179, 0.2)'
                        } 
                      }}>
                        <ListItemIcon sx={{ 
                          minWidth: 40,
                          color: '#4DBFB3'
                        }}>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="إعدادات الحساب" 
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontWeight: 600,
                              color: '#333'
                            }
                          }}
                        />
                      </ListItemButton>
                      
                      <ListItemButton sx={{ 
                        borderRadius: 2,
                        mb: 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          bgcolor: 'rgba(77, 191, 179, 0.1)',
                          transform: 'translateX(4px)',
                          boxShadow: '0 2px 10px rgba(77, 191, 179, 0.2)'
                        } 
                      }}>
                        <ListItemIcon sx={{ 
                          minWidth: 40,
                          color: '#4DBFB3'
                        }}>
                          <NotificationsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="الإشعارات" 
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontWeight: 600,
                              color: '#333'
                            }
                          }}
                        />
                      </ListItemButton>
                      
                      <Divider sx={{ my: 1, borderColor: 'rgba(77, 191, 179, 0.2)' }} />
                      
                      <ListItemButton 
                        onClick={handleLogout}
                        sx={{ 
                          borderRadius: 2,
                          color: '#ff6b6b',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            bgcolor: 'rgba(255, 107, 107, 0.1)',
                            transform: 'translateX(4px)',
                            boxShadow: '0 2px 10px rgba(255, 107, 107, 0.2)'
                          } 
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: 40, 
                          color: 'inherit' 
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                        </ListItemIcon>
                        <ListItemText 
                          primary="تسجيل الخروج" 
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontWeight: 600
                            }
                          }}
                        />
                      </ListItemButton>
                    </List>
                  </Paper>
                )}
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        </Box>
        {/* Main Dashboard Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 0, pt: 0, width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
