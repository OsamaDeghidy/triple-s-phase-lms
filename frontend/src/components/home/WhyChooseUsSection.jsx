import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, useTheme, useMediaQuery, styled, keyframes } from '@mui/material';
import { Check, ArrowForward } from '@mui/icons-material';

// Animation keyframes
const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const SectionContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(8, 0),
    backgroundColor: '#FFFFFF',
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #663399 0%, #333679 50%, #1B1B48 100%)',
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200px',
        height: '100%',
        background: `
            radial-gradient(circle at 20% 50%, rgba(135, 206, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(135, 206, 235, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(135, 206, 235, 0.06) 0%, transparent 50%)
        `,
        zIndex: 0,
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(6, 0),
    },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(8),
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(6),
    },
}));

const LeftSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '500px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
        height: '400px',
        order: 2,
    },
}));

const StatsCard = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: '120px',
    left: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: theme.spacing(2),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    animation: `${bounceAnimation} 3s ease-in-out infinite`,
}));

const StatsTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#663399',
    marginBottom: theme.spacing(1),
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const ProfileImage = styled(Box)(({ theme }) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: '2px solid #FFFFFF',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const MoreButton = styled(Box)(({ theme }) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#007BFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#FFFFFF',
}));

const GetStartedButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333679',
    color: '#FFFFFF',
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(51, 54, 121, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#2A2D5F',
        transform: 'translateX(-50%) translateY(-2px)',
        boxShadow: '0 6px 16px rgba(51, 54, 121, 0.4)',
    },
    '& .MuiButton-endIcon': {
        marginLeft: theme.spacing(0.5),
    },
}));

const RightSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('lg')]: {
        order: 1,
    },
}));

const SectionIcon = styled(Box)(({ theme }) => ({
    width: '24px',
    height: '24px',
    backgroundColor: '#E0E0E0',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        fontSize: '1rem',
        color: '#A0A0A0',
    },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: theme.spacing(2),
}));

const MainTitle = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#663399',
    lineHeight: 1.2,
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        fontSize: '2rem',
    },
}));

const Description = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    color: '#A0A0A0',
    lineHeight: 1.6,
    marginBottom: theme.spacing(4),
    maxWidth: '500px',
}));

const FeaturesGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
    },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
    backgroundColor: '#F8F9FA',
    borderRadius: '8px',
    padding: theme.spacing(2),
    borderLeft: '4px solid #663399',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#F0F0F0',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
    width: '20px',
    height: '20px',
    backgroundColor: '#663399',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        fontSize: '0.8rem',
        color: '#FFFFFF',
    },
}));

const FeatureTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: 700,
    color: '#663399',
    marginBottom: theme.spacing(0.5),
}));

const FeatureDescription = styled(Typography)(({ theme }) => ({
    fontSize: '0.85rem',
    color: '#A0A0A0',
    lineHeight: 1.4,
}));

const WhyChooseUsSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Array of people face images
    const profileImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    ];

    const [currentImages, setCurrentImages] = useState(profileImages.slice(0, 4));

    // Change profile images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImages(prevImages => {
                const shuffled = [...profileImages].sort(() => Math.random() - 0.5);
                return shuffled.slice(0, 4);
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            title: 'World Class Trainers',
            description: 'Seamlessly envisioneer tactical data through services.'
        },
        {
            title: 'Easy Learning',
            description: 'Seamlessly envisioneer tactical data through services.'
        },
        {
            title: 'Flexible',
            description: 'Seamlessly envisioneer tactical data through services.'
        },
        {
            title: 'Affordable Price',
            description: 'Seamlessly envisioneer tactical data through services.'
        }
    ];

    return (
        <SectionContainer>
            <Container maxWidth="lg">
                <ContentWrapper>
                    <LeftSection>
                        <StatsCard>
                            <StatsTitle>10k+ Active Students</StatsTitle>
                            <ProfileContainer>
                                {currentImages.map((image, index) => (
                                    <ProfileImage
                                        key={index}
                                        sx={{ backgroundImage: `url(${image})` }}
                                    />
                                ))}
                                <MoreButton>10k+</MoreButton>
                            </ProfileContainer>
                        </StatsCard>
                        <GetStartedButton
                            onClick={() => window.location.href = '/register'}
                        >
                            GET STARTED →
                        </GetStartedButton>
                    </LeftSection>

                    <RightSection>
                        <SectionIcon>
                            <Check />
                        </SectionIcon>
                        <SectionSubtitle>WHY CHOOSE US</SectionSubtitle>

                        <MainTitle variant="h2" component="h2">
                            Thousands Of Experts Around The World Ready To Help.
                        </MainTitle>

                        <Description variant="body1">
                            Synergistically visualize alternative content before cross functional core Rapidiously administra standardized value via focused benefits. Rapidiously redefine highly efficient niche markets with plug-and-play materials professionally seize client centric solutions
                        </Description>

                        <FeaturesGrid>
                            {features.map((feature, index) => (
                                <FeatureCard key={index}>
                                    <FeatureIcon>
                                        <Check />
                                    </FeatureIcon>
                                    <FeatureTitle>{feature.title}</FeatureTitle>
                                    <FeatureDescription>{feature.description}</FeatureDescription>
                                </FeatureCard>
                            ))}
                        </FeaturesGrid>
                    </RightSection>
                </ContentWrapper>
            </Container>
        </SectionContainer>
    );
};

export default WhyChooseUsSection;
