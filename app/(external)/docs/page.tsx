// app/(external)/docs/page.tsx
"use client"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"
import { Code, Settings, Zap, BookOpen, ChevronDown, Copy, Check } from "lucide-react"
import Image from "next/image"

const SECTION_SPACING_DEFAULT = "py-16 md:py-24"
const CONTAINER_RESPONSIVE_CLASS = "container mx-auto px-4 sm:px-6 lg:px-8"

export default function DocsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({})

  const setCopiedFor = (key: string) => {
    setCopiedMap((s) => ({ ...s, [key]: true }))
    setTimeout(() => setCopiedMap((s) => ({ ...s, [key]: false })), 1400)
  }

  const initializationCode = `TourWidget.init({
    tourId: 'your-tour-id',
      showTourButton?: false, // optional
      backgroundColor?: white, // optional
      textColor?: black, // optional
      primaryColor?: blue // optional
  })`

  const scriptTagCode = `<script src="https://tourwidget-onboarding.vercel.app/tour.js"></script>`


  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFor(key)
    } catch (err) {
      // fallback: select + execCommand (rare in modern browsers)
      console.error("Copy failed", err)
    }
  }

  const tabs = [
    {
      label: "Installation",
      value: "installation",
      icon: <Code className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Integrating TourWidget is as simple as adding a single script tag to your page before the closing <code>{'</body>'}</code>.
          </p>

          <div className="relative bg-gray-900 text-white p-6 rounded-xl shadow-lg font-mono text-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-primary-foreground font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" /> Embed Script
                </h4>
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  <code>{scriptTagCode}</code>
                </pre>
              </div>

              <button
                aria-label="Copy embed script"
                onClick={() => copyToClipboard(scriptTagCode, "embed")}
                className="ml-4 hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                {copiedMap["embed"] ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copiedMap["embed"] ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* small copy for mobile below code */}
            <div className="mt-4 md:hidden flex justify-end">
              <button
                aria-label="Copy embed script"
                onClick={() => copyToClipboard(scriptTagCode, "embed")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                {copiedMap["embed"] ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copiedMap["embed"] ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Initialization & Usage",
      value: "getting-started",
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            After the script loads, initialize and start tours via the global <code>window.TourWidget</code> object.
          </p>

          <div className="relative bg-gray-900 text-white p-6 rounded-xl shadow-lg font-mono text-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-primary-foreground font-semibold mb-3">Client-Side Initialization</h4>
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  <code>{initializationCode}</code>
                </pre>
              </div>

              <button
                aria-label="Copy initialization code"
                onClick={() => copyToClipboard(initializationCode, "init")}
                className="ml-4 hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                {copiedMap["init"] ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copiedMap["init"] ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="mt-4 md:hidden flex justify-end">
              <button
                aria-label="Copy initialization code"
                onClick={() => copyToClipboard(initializationCode, "init")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                {copiedMap["init"] ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copiedMap["init"] ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const faqs = [
    {
      q: "Is there a free plan?",
      a: "Yes! We offer a free tier that lets you configure up to 3 tours. Paid plans unlock analytics and more seats.",
    },
    {
      q: "Can I customize the styling?",
      a: "Absolutely — you can override CSS variables or pass custom styles from the Dashboard for each tour.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes. The widget is responsive and touch-friendly; steps reposition to avoid occluding mobile UI.",
    },
    {
      q: "How do I define the minimum 5 steps?",
      a: "Every tour must include at least five step objects with unique IDs. The Dashboard enforces this rule when publishing.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <NavbarExternal />

      {/* HERO SECTION (unchanged image) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-black/50">
        <div className="absolute inset-0">
          <Image
            src="/docs.jpg"
            alt="Developer Documentation Background"
            fill
            className="object-cover object-top"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-black/50" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-accent/5" />
        </div>

        <div className="relative z-10 text-center py-24 md:py-32">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-lg"
          >
            Developer Documentation
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <span className="text-xl md:text-2xl text-white max-w-4xl mx-auto font-light drop-shadow block">
              Everything you need to integrate TourWidget into your website.
            </span>
          </motion.p>
        </div>
      </section>

      {/* FEATURES */}
      <motion.section
        className={SECTION_SPACING_DEFAULT}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={CONTAINER_RESPONSIVE_CLASS}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 border-l-4 border-primary hover:shadow-xl transition-shadow">
              <Code className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">📦 Script Integration</h3>
              <p className="text-sm text-muted-foreground">Just copy and paste one script tag.</p>
            </Card>

            <Card className="p-6 border-l-4 border-accent hover:shadow-xl transition-shadow">
              <Settings className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">⚙️ Unique Tour IDs</h3>
              <p className="text-sm text-muted-foreground">Tours are managed from your Dashboard.</p>
            </Card>

            <Card className="p-6 border-l-4 border-success hover:shadow-xl transition-shadow">
              <Zap className="w-8 h-8 text-success mb-3" />
              <h3 className="font-bold text-lg mb-2">🚀 Minimal Footprint</h3>
              <p className="text-sm text-muted-foreground">Lightweight bundle for fast load times.</p>
            </Card>
          </div>

          <Card className="p-4 md:p-8 shadow-2xl">
            <Tabs tabs={tabs} defaultValue="installation"/>
          </Card>
        </div>
      </motion.section>

      {/* FAQ */}
      <section className={`${SECTION_SPACING_DEFAULT} bg-muted/50`}>
        <div className={`${CONTAINER_RESPONSIVE_CLASS} max-w-4xl`}>
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    className="p-5 cursor-pointer"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1 text-lg">{item.q}</h3>
                        <motion.div
                          initial={false}
                          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="text-muted-foreground text-base mt-2">{item.a}</p>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={false}
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex-shrink-0 ml-4 pt-1"
                        aria-hidden
                      >
                        <ChevronDown className="w-5 h-5 text-primary" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* TRY DEMO / CTA */}
      <motion.section
        className="py-20 md:py-28 bg-gradient-to-br from-primary/6 to-accent/6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={CONTAINER_RESPONSIVE_CLASS}>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-extrabold">Try the Embeddable Demo</h3>
            <p className="text-lg text-muted-foreground">
              Embed the script into a test page and run a 5-step guided tour — perfect for demos and QA.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/dashboard"   className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:opacity-95 transition">
              View Install
              </Link>
              <Link href="/demo"    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border  hover:bg-white/5 transition border-gray-500">
               Open Demo
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}