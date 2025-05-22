import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { Benefits } from "@/components/landing/Benefits"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Stats } from "@/components/landing/Stats"
import { Testimonials } from "@/components/landing/Testimonials"
import { Partners } from "@/components/landing/Partners"
import { FAQ } from "@/components/landing/FAQ"
import { CTA } from "@/components/landing/CTA"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Partners />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
