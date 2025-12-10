"use client"

import Image from "next/image"
import { motion } from "framer-motion"  
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Rocket, Users, Target, Zap } from "lucide-react"
import Link from "next/link"

const SECTION_SPACING_DEFAULT = "py-16 md:py-24"
const CONTAINER_RESPONSIVE_CLASS = "container mx-auto px-4 sm:px-6 lg:px-8"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavbarExternal />

      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden bg-linear-to-b from-primary/10 to-black/50"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="absolute inset-0">
          <Image
            src="/about-us.webp"
            alt="TourWidget team exploring the world"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-white/70" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-accent/5" />
        </div>

        <motion.div 
          className="section-spacing relative z-10 text-center py-24 md:py-32" 
          variants={staggerChildren}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-lg" 
            variants={fadeUp}
          >
            About TourWidget
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-white max-w-4xl mx-auto font-light drop-shadow" 
            variants={fadeUp}
          >
            We're building the future of product onboarding and user engagement
          </motion.p>
        </motion.div>
      </motion.section>


      {/* Mission Section */}
      <motion.section 
        className={SECTION_SPACING_DEFAULT} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={staggerChildren}
      >
        <div className={CONTAINER_RESPONSIVE_CLASS}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <h2 className="text-4xl font-bold mb-4 flex items-center gap-3 text-primary">
                <Target className="w-8 h-8"/> Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We believe that every product deserves an exceptional onboarding experience. 
                Our mission is to make it <strong>easy for businesses</strong> to create engaging, 
                interactive product tours that delight users and <strong>drive adoption</strong>.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-accent pl-4 italic">
                TourWidget is designed for teams who care about user experience and want 
                to accelerate their product adoption without complexity.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 h-64 md:h-96 flex flex-col items-center justify-center shadow-2xl border-0">
                <Rocket className="w-20 h-20 text-indigo-600 mb-4 animate-bounce" />
                <p className="text-xl font-semibold text-indigo-700">
                  Accelerating Product Adoption
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>


      
     {/* Team Section */}
<motion.section 
  className={`${SECTION_SPACING_DEFAULT} bg-muted/30`} 
  initial="hidden" 
  whileInView="visible" 
  viewport={{ once: true }} 
  variants={staggerChildren}
>
  <div className={CONTAINER_RESPONSIVE_CLASS}>
    <motion.h2 
      className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3" 
      variants={fadeUp}
    >
      <Users className="w-8 h-8 text-primary"/> Meet the Innovators
    </motion.h2>

    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6" 
      variants={staggerChildren}
    >

      {[
        { name: "Maiqel Olawale", role: "CEO & Co-founder", img: "/maiqel.jpeg" },
        { name: "Kabiru Mohammed", role: "CTO & Co-founder", img: "/mknas.jpeg" },
        { name: "Oluwaseyi", role: "Product Lead", img: "/seyi.jpeg" },
        { name: "Mujeeb", role: "Design Lead", img: "/mujeeb.jpeg" },
      ].map((member, idx) => (
        <motion.div key={idx} variants={fadeUp}>
          <Card className="p-6 text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-t-4 border-primary/50">

            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              <Image 
                src={member.img}
                alt={member.name}
                width={130}
                height={130}
                className="
                  rounded-full
                  object-cover
                  border-4 
                  border-primary/30 
                  shadow-md w-20 h-20
                "
              />
            </div>

            <h3 className="font-extrabold text-xl mb-1 text-foreground">
              {member.name}
            </h3>
            <p className="text-sm font-medium text-primary">
              {member.role}
            </p>

          </Card>
        </motion.div>
      ))}

    </motion.div>
  </div>
</motion.section>

      {/* CTA Section */}
      <motion.section 
        className={SECTION_SPACING_DEFAULT} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={fadeUp}
      >
        <div className={CONTAINER_RESPONSIVE_CLASS}>
          <motion.div 
            className="bg-primary text-primary-foreground p-10 md:p-16 rounded-2xl shadow-xl text-center" 
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Ready to Elevate Your Onboarding?
            </h2>
            <p className="text-xl mb-8 font-light max-w-3xl mx-auto">
              Join the teams already leveraging TourWidget to accelerate adoption.
            </p>

            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-primary bg-primary-foreground hover:bg-white transition duration-300 transform hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" /> Start Your Free Trial
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}