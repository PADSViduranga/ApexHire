
import HeroSlider from "../components/home/HeroSlider";
import SearchSection from "../components/home/SearchSection";
import Statistics from "../components/home/Statistics";
import WhyChooseUs from "../components/home/WhyChooseUs";
import FeaturedCompanies from "../components/home/FeaturedCompanies";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";

import FeaturedJobs from "../components/jobs/FeaturedJobs";

export default function HomePage() {
    return (
        <main className="home-page">
            {/* Hero */}
            <HeroSlider />

            {/* Job Search */}
            <SearchSection />

            {/* Featured Jobs */}
            <FeaturedJobs />

            {/* Platform Statistics */}
            <Statistics />

            {/* Why Choose ApexHire */}
            <WhyChooseUs />

            {/* Featured Companies */}
            <FeaturedCompanies />

            {/* Process */}
            <HowItWorks />

            {/* Testimonials */}
            <Testimonials />

            {/* Final Call To Action */}
            <CallToAction />
        </main>
    );
}


