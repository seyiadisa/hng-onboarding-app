"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion" // <-- import Framer Motion
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { CheckCircle2, Zap, Target, Palette, BarChart3, Globe, Code2 } from "lucide-react"

const features = [
  { icon: Target, title: "No-Code Tour Builder", description: "Create stunning product tours in minutes — no developers needed." },
  { icon: Zap, title: "Smart Targeting", description: "Show the right message to the right user at the perfect moment using powerful conditions." },
  { icon: Palette, title: "Beautiful Themes", description: "Choose from modern, fully customizable themes that match your brand perfectly." },
  { icon: BarChart3, title: "Analytics & Insights", description: "Track completion rates, drop-offs, and user behavior with real-time analytics." },
  { icon: Globe, title: "Multi-Language Support", description: "Reach global users with automatic translation and full RTL support." },
  { icon: Code2, title: "Works Everywhere", description: "Seamless integration with React, Next.js, Vue, Angular, and plain HTML sites." },
]

// Framer Motion Variants
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }
const staggerChildren = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <NavbarExternal />

      {/* HERO */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/features.jpg"
            alt="Powerful features that make onboarding delightful"
            fill
            className="object-cover"
            priority
            quality={95}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-accent/10" />
        </div>

        <motion.div className="relative z-10 py-32 md:py-40 text-center px-6" variants={staggerChildren}>
          <motion.h1 className="text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-2xl" variants={fadeUp}>
            Features That Delight Users
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-white/90 font-medium max-w-4xl mx-auto drop-shadow-lg" variants={fadeUp}>
            Everything you need to create engaging, effective, and beautiful product onboarding experiences without the complexity.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* FEATURES GRID */}
      <motion.section
        className="py-20 md:py-32 bg-linear-to-b from-white to-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="container-responsive px-6">
          <motion.div className="text-center mb-16" variants={staggerChildren}>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6" variants={fadeUp}>
              Built for Real Results
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" variants={fadeUp}>
              Trusted by teams who want to reduce churn and boost activation and make users smile
            </motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto" variants={staggerChildren}>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={fadeUp}>
                  <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-white mb-6 shadow-xl">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      <div className="mt-8 flex items-center text-primary font-semibold">
                        <CheckCircle2 className="w-6 h-6 mr-2" />
                        Ready to use
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="container-responsive text-center px-6">
          <motion.h2 className="text-4xl md:text-6xl font-bold mb-8" variants={fadeUp}>
            Start Building Better Onboarding Today
          </motion.h2>
          <motion.p className="text-xl mb-12 max-w-2xl mx-auto" variants={fadeUp}>
            Join thousands of product teams using TourWidget to create magical first experiences.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row  gap-12 md:gap-6 justify-center " variants={staggerChildren}>
            <motion.div variants={fadeUp}>
              <Link
                href="/auth/register"
                className="px-10 py-5 bg-black text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link
                href="/demo"
                className="px-10 py-5 border-2 border-gray-400 text-black font-bold text-lg rounded-xl hover:bg-white hover:text-primary transition-all duration-300 "
              >
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>

          <motion.p className="mt-8 text-white/80 text-lg" variants={fadeUp}>
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}