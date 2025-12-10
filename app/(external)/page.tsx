// app/page.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Zap, Target, Palette, BarChart3, Globe, Code2, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [copied, setCopied] = useState(false)

  const scriptCode = `<script src="https://cdn.tourwidget.com/widget.js"></script>
<script>
  TourWidget.init({
    tourId: "your-tour-id",
    userId: "user_123" // optional
  });
</script>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scriptCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-white">
      <NavbarExternal />

      <section
        id="hero"
        className="section-spacing bg-gradient-to-br from-primary via-primary-light to-accent text-white overflow-hidden"
      >
        <div className="container-responsive grid grid-cols-1 md:grid-cols-2 gap-[70px] md:gap-8 items-center">
          <div>

            {/* ⭐ Heading Animation: Slide in from LEFT */}
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              Create Interactive Product Tours in Minutes
            </motion.h1>

            {/* ⭐ Paragraph Animation: Slide in from RIGHT */}
            <motion.p
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-lg opacity-90 mb-8"
            >
              Engage users with seamless onboarding flows and product tours. No coding required.
            </motion.p>

            {/* ⭐ Buttons Animation: Fade + Slide UP */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
              className="flex gap-4"
            >
              <Link href="/auth/register">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">

              <Button variant="secondary" size="lg">
                Watch Demo
              </Button>
              </Link>
            </motion.div>

          </div>

          <div className="rounded-lg h-64 md:h-96 flex items-center justify-center backdrop-blur-sm">
            <motion.div
              animate={{ y: [-10, 0, -10] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/hero.jpg"
                width={500}
                height={300}
                alt="TourWidget in action"
                className="rounded shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container-responsive text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Everything you need to build delightful onboarding experiences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { icon: Target, title: "No-Code Builder", desc: "Create tours visually in minutes" },
              { icon: Zap, title: "Smart Targeting", desc: "Show tours based on user behavior" },
              { icon: Palette, title: "Fully Customizable", desc: "Match your brand perfectly" },
              { icon: BarChart3, title: "Real-time Analytics", desc: "Track engagement and drop-offs" },
              { icon: Globe, title: "Multi-Language", desc: "Support 100+ languages with RTL" },
              { icon: Code2, title: "Developer Friendly", desc: "Works with any framework" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <f.icon className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 md:py-32 bg-white">
        <div className="container-responsive text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Sign Up & Create Tour", desc: "Build your first tour in under 5 minutes" },
              { step: "02", title: "Add Steps & Customize", desc: "Point-and-click to highlight any element" },
              { step: "03", title: "Embed & Launch", desc: "Add one line of code and go live instantly" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-primary mb-6">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-900 text-white">
        <div className="container-responsive px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            One Line to Install. Instant Tours.
          </h2>
          <Card className="max-w-4xl mx-auto p-10 bg-gray-800 border-gray-700 relative">

            <Button
              onClick={handleCopy}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600"
              size="sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </>
              )}
            </Button>

            <pre className="text-green-400 text-sm md:text-base overflow-x-auto mt-6">
              <code>{scriptCode}</code>
            </pre>

            <p className="text-center text-gray-400 mt-8">
              Just paste this code before{" "}
              <code className="bg-gray-700 px-2 rounded">{'</body>'}</code>
            </p>
          </Card>
        </div>
      </section>

      <motion.section
        className="py-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container-responsive text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Transform Your Onboarding?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Start free. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-10 py-6 bg-black text-white cursor-pointer">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-6 border-gray-500 hover:bg-white/10 cursor-pointer"
            >
              View Live Demo
            </Button>
            </Link>
          </div>
        </div>
      </motion.section>
      <Footer/>
    </main>
  )
}