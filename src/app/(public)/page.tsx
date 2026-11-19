import { Hero } from "@/components/home/Hero";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { Categories } from "@/components/home/Categories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScrollProgress } from "@/components/home/ScrollProgress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <FeaturedServices />
      <Categories />
      <WhyChooseUs />
      <HowItWorks />
    </>
  );
}
