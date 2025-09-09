import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    styled,
    keyframes,
    IconButton
} from '@mui/material';
import {
    ArrowBack,
    School,
    CheckCircle,
    Chat,
    KeyboardArrowUp
} from '@mui/icons-material';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const SectionContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(10, 0),
    backgroundColor: '#f9fafb',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(6, 0),
    },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: theme.spacing(8),
    alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(4),
    },
}));

const LeftSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '500px',
    [theme.breakpoints.down('lg')]: {
        height: '400px',
    },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '100%',
}));

const MainImage = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '70%',
    height: '70%',
    top: '15%',
    left: '15%',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    zIndex: 3,
    animation: `${floatAnimation} 6s ease-in-out infinite`,
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
}));

const OverlayImage = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '50%',
    height: '50%',
    bottom: '5%',
    right: '5%',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
    zIndex: 4,
    border: '4px solid #ffffff',
    animation: `${floatAnimation} 7s ease-in-out infinite 1s`,
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
}));

const DecorativeElement = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '120px',
    height: '120px',
    top: '0',
    right: '0',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.1) 0%, rgba(51, 54, 121, 0.2) 100%)',
    zIndex: 1,
}));

const RightSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    position: 'relative',
}));

const SectionLabel = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    backgroundColor: 'rgba(111, 66, 193, 0.1)',
    borderRadius: '30px',
    marginBottom: theme.spacing(2),
    '& .MuiSvgIcon-root': {
        color: '#6f42c1',
        fontSize: '1.2rem',
    },
    '& span': {
        color: '#6f42c1',
        fontSize: '0.9rem',
        fontWeight: 600,
    },
}));

const MainTitle = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1f2937',
    lineHeight: 1.2,
    marginBottom: theme.spacing(2),
    '& span': {
        color: '#6f42c1',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '2rem',
    },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    color: '#4b5563',
    lineHeight: 1.7,
    marginBottom: theme.spacing(2),
}));

const BenefitsList = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
}));

const BenefitItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
        color: '#6f42c1',
        fontSize: '1.2rem',
        flexShrink: 0,
    },
    '& span': {
        color: '#374151',
        fontSize: '1rem',
        fontWeight: 500,
    },
}));

const CallToActionButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #6f42c1 0%, #333679 100%)',
    color: '#fff',
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)',
    transition: 'all 0.3s ease',
    alignSelf: 'flex-start',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(111, 66, 193, 0.4)',
    },
}));

const StatisticsCard = styled(Card)(({ theme }) => ({
    position: 'absolute',
    bottom: '20px',
    left: '0',
    background: '#ffffff',
    color: '#1f2937',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    minWidth: '180px',
    zIndex: 5,
    animation: `${fadeInUp} 1s ease-out`,
    [theme.breakpoints.down('lg')]: {
        position: 'relative',
        bottom: 'auto',
        left: 'auto',
        marginTop: theme.spacing(3),
    },
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const StatisticsNumber = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: theme.spacing(0.5),
    color: '#6f42c1',
}));

const StatisticsText = styled(Typography)(({ theme }) => ({
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: theme.spacing(1),
}));

const BottomElements = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none',
    [theme.breakpoints.down('md')]: {
        position: 'relative',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
        marginTop: theme.spacing(3),
        justifyContent: 'center',
        gap: theme.spacing(2),
    },
}));

const ChatButton = styled(IconButton)(({ theme }) => ({
    background: '#6f42c1',
    color: '#fff',
    width: '60px',
    height: '60px',
    boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)',
    pointerEvents: 'auto',
    '&:hover': {
        background: '#5a3594',
        transform: 'scale(1.1)',
    },
}));

const ScrollToTopButton = styled(IconButton)(({ theme }) => ({
    background: '#fff',
    color: '#6f42c1',
    width: '60px',
    height: '60px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'auto',
    '&:hover': {
        background: '#f3f4f6',
        transform: 'scale(1.1)',
    },
}));

const BackgroundDots = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    opacity: 0.3,
    pointerEvents: 'none',
    backgroundImage: `radial-gradient(#9ca3af 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
}));

const AboutAcademySection = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <SectionContainer>
            <BackgroundDots />
            <Container maxWidth="lg">
                <ContentWrapper>
                    {/* Left Section - Images */}
                    <LeftSection>
                        <ImageContainer>
                            <DecorativeElement />
                            <MainImage>
                                <img
                                    src="/src/assets/images/about3.jpeg"
                                    alt="Online Education Professional"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                            </MainImage>
                            <OverlayImage>
                                <img
                                    src="/src/assets/images/about2.jpeg"
                                    alt="Online Learning Person"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                            </OverlayImage>
                            
                            <StatisticsCard>
                                <CardContentStyled>
                                    <School sx={{ fontSize: '2rem', color: '#6f42c1', mb: 1 }} />
                                    <StatisticsNumber>50k+</StatisticsNumber>
                                    <StatisticsText>طلاب نشطون على دوراتنا</StatisticsText>
                                </CardContentStyled>
                            </StatisticsCard>
                        </ImageContainer>
                    </LeftSection>

                    {/* Right Section - Content */}
                    <RightSection>
                        <SectionLabel>
                            <School />
                            <span>عن اكاديميتنا</span>
                        </SectionLabel>
                        
                        <MainTitle>
                            مرحباً بكم في <span>اكاديمية تريبلز</span>
                        </MainTitle>

                        <DescriptionText>
                            تتعاون أكاديميتنا في تبسيط الشبكات سهلة الاستخدام، مع التركيز على طرق التمكين الفعالة، وتوزيع الأسواق المتخصصة، وتحقيق الموقع السوقي، والجاهزية للويب بعد التطبيقات المستهلكة للموارد.
                        </DescriptionText>

                        <DescriptionText>
                            التعليم الإلكتروني، المعروف أيضاً باسم التعلم عبر الإنترنت، هو طريقة للتعلم تتم عبر الإنترنت، والتي توفر للأفراد الفرصة لاكتساب المعرفة والمهارات من أي مكان وفي أي وقت.
                        </DescriptionText>

                        <BenefitsList>
                            <BenefitItem>
                                <CheckCircle />
                                <span>احصل على إمكانية الوصول إلى أكثر من 4000 دورة تدريبية مميزة لدينا</span>
                            </BenefitItem>
                            <BenefitItem>
                                <CheckCircle />
                                <span>مواضيع شعبية للتعلم الآن</span>
                            </BenefitItem>
                            <BenefitItem>
                                <CheckCircle />
                                <span>ابحث عن المدرب المناسب لك</span>
                            </BenefitItem>
                        </BenefitsList>

                        <CallToActionButton
                            endIcon={<ArrowBack />}
                            onClick={() => window.location.href = '/about'}
                        >
                            المزيد عنا
                        </CallToActionButton>
                    </RightSection>
                </ContentWrapper>

                {/* Bottom Interactive Elements */}
                <BottomElements>
                    <ChatButton>
                        <Chat />
                    </ChatButton>
                    <ScrollToTopButton onClick={scrollToTop}>
                        <KeyboardArrowUp />
                    </ScrollToTopButton>
                </BottomElements>
            </Container>
        </SectionContainer>
    );
};

export default AboutAcademySection;