import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Guarantees } from '@/components/landing/Guarantees';
import { Plugins } from '@/components/landing/Plugins';
import { Performance } from '@/components/landing/Performance';
import { OpenSource } from '@/components/landing/OpenSource';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <InteractiveDemo />
      <HowItWorks />
      <Guarantees />
      <Plugins />
      <Performance />
      <OpenSource />
      <Footer />
    </>
  );
}
