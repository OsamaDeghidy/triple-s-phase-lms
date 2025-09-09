import React from 'react';
import { Box, Container, Typography, Button, useTheme, useMediaQuery, styled } from '@mui/material';
import { ArrowForward, Phone } from '@mui/icons-material';
import massageImage from '../../assets/images/massageImage.png';

const BannerContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(0.5, 0),
    background: 'linear-gradient(135deg, rgba(102, 51, 153, 0.9) 0%, rgba(51, 54, 121, 0.9) 50%, rgba(27, 27, 72, 0.9) 100%)',
    overflow: 'hidden',
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.05) 2px,
        rgba(255, 255, 255, 0.05) 4px
      )
    `,
        zIndex: 0,
    },
    '& > *': {
        position: 'relative',
        zIndex: 1,
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(0.25, 0),
    },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    gap: theme.spacing(4),
    alignItems: 'center',
    minHeight: '200px',
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),
        textAlign: 'center',
    },
}));

const LeftSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '180px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(102, 51, 153, 0.7) 0%, rgba(51, 54, 121, 0.7) 50%, rgba(27, 27, 72, 0.7) 100%)',
        zIndex: 1,
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        zIndex: 2,
    },
    [theme.breakpoints.down('lg')]: {
        order: 3,
        height: '140px',
        maxWidth: '320px',
        margin: '0 auto',
    },
}));

const CenterSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    zIndex: 2,
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
        order: 2,
        alignItems: 'center',
        textAlign: 'center',
    },
}));

const IconContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.5),
}));

const EmailIcon = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '120px',
    height: '120px',
    backgroundImage: `url(${massageImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        width: '18px',
        height: '18px',
        background: 'linear-gradient(145deg, #FF0000 0%, #CC0000 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `
            0 4px 8px rgba(255, 0, 0, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.3),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2)
        `,
        animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1)',
        },
        '50%': {
            transform: 'scale(1.1)',
        },
        '100%': {
            transform: 'scale(1)',
        },
    },
}));

const PhoneIcon = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '18px',
    height: '18px',
    background: 'linear-gradient(145deg, #FF0000 0%, #CC0000 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `
        0 2px 4px rgba(255, 0, 0, 0.4),
        inset 0 1px 2px rgba(255, 255, 255, 0.3),
        inset 0 -1px 2px rgba(0, 0, 0, 0.2)
    `,
    '& .MuiSvgIcon-root': {
        fontSize: '0.7rem',
        color: '#FFFFFF',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
    },
}));

const MainTitle = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: 800,
    color: '#FFFFFF',
    lineHeight: 1.2,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
    },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    color: '#FFFFFF',
    lineHeight: 1.5,
    marginBottom: theme.spacing(1.5),
    maxWidth: '500px',
    opacity: 0.95,
    textAlign: 'center',
    [theme.breakpoints.down('lg')]: {
        maxWidth: '100%',
    },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    color: '#5C2D91',
    padding: theme.spacing(1, 3),
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: '0 3px 10px rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    alignSelf: 'center',
    '&:hover': {
        backgroundColor: '#F5F5F5',
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(255, 255, 255, 0.4)',
    },
    '& .MuiButton-endIcon': {
        marginLeft: theme.spacing(0.5),
        marginRight: 0,
    },
}));

const RightSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
        order: 1,
    },
}));

const BannerFile = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <BannerContainer>
            <Container maxWidth="lg">
                <ContentWrapper>
                    <LeftSection />

                    <CenterSection>
                        <MainTitle variant="h2" component="h2">
                            احصل على كورسات الاونلاين
                        </MainTitle>

                        <Subtitle variant="body1">
                            انضم إلى منصتنا التعليمية واستفد من مجموعة واسعة من الكورسات الأونلاين المصممة بعناية لتناسب جميع المستويات والاهتمامات.
                        </Subtitle>

                        <RegisterButton
                            endIcon={<ArrowForward />}
                            onClick={() => window.location.href = '/register'}
                        >
                            سجل معنا
                        </RegisterButton>
                    </CenterSection>

                    <RightSection>
                        <IconContainer>
                            <EmailIcon>
                                <PhoneIcon>
                                    <Phone />
                                </PhoneIcon>
                            </EmailIcon>
                        </IconContainer>
                    </RightSection>
                </ContentWrapper>
            </Container>
        </BannerContainer>
    );
};

export default BannerFile;
