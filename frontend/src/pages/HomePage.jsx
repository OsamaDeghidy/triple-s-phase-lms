import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/home/HeroBanner';
import CourseCollections from '../components/home/CourseSlider';
import BannerFile from '../components/home/BannerFile';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FeaturedArticlesSection from '../components/home/FeaturedArticlesSection';
import LearningMethodsSection from '../components/home/LearningMethodsSection';
import AboutAcademySection from '../components/home/AboutAcademySection';


const HomePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>الرئيسية | منصة التطوير المهني التعليمية</title>
        <meta
          name="description"
          content="منصة تعليمية متكاملة تقدم دورات تدريبية احترافية في مختلف المجالات. تعلم من أفضل المدربين واحصل على شهادات معتمدة."
        />
        <meta name="keywords" content="تعليم عن بعد, دورات تدريبية, تعلم اونلاين, شهادات معتمدة, تطوير مهني" />
      </Helmet>

      {/* Header */}
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero Banner Section */}
        <Box component="section" id="home">
          <HeroBanner />
        </Box>

        {/* Learning Methods Section */}
        <Box component="section" id="learning-methods">
          <LearningMethodsSection />
        </Box>

        {/* About Academy Section */}
        <Box component="section" id="about-academy">
          <AboutAcademySection />
        </Box>

        {/* Course Collections Section */}
        <Box component="section" id="course-collections" sx={{ bgcolor: 'background.default' }}>
          <CourseCollections />
        </Box>

        {/* Banner File Section */}
        <Box component="section" id="banner-file">
          <BannerFile />
        </Box>

        {/* Why Choose Us Section */}
        <Box component="section" id="why-choose-us">
          <WhyChooseUsSection />
        </Box>

        {/* Testimonials Section */}
        <Box component="section" id="testimonials" sx={{ bgcolor: 'background.default' }}>
          <TestimonialsSection />
        </Box>

        {/* Featured Articles Section */}
        <Box component="section" id="featured-articles">
          <FeaturedArticlesSection />
        </Box>

      </Box>
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HomePage;
