import { Hero } from "@/components/landing/Hero"
import { Benefits } from "@/components/landing/Benefits"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Stats } from "@/components/landing/Stats"
import { Testimonials } from "@/components/landing/Testimonials"
import { Partners } from "@/components/landing/Partners"
import { FAQ } from "@/components/landing/FAQ"
import { CTA } from "@/components/landing/CTA"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Partners />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
