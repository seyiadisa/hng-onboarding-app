"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion" // <-- added Framer Motion
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({ type: "error", message: "All fields are required." })
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFeedback({ type: "error", message: "Please enter a valid email address." })
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.from("contact_messages").insert([
        { name, email, message, created_at: new Date().toISOString() },
      ])
      if (error) throw error
      setFeedback({ type: "success", message: "Message sent! We will get back to you shortly." })
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to send message. Please try again later." })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Framer Motion variants
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }
  const staggerChildren = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }

  return (
    <main className="min-h-screen">
      <NavbarExternal />

      {/* Hero Section */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} className="relative overflow-hidden bg-linear-to-b from-primary/10 to-black/50">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/contact.jpg"
            alt="Get in touch with TourWidget team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-white/70" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-accent/5" />
        </div>

        <motion.div className="section-spacing relative z-10" variants={staggerChildren}>
          <motion.div className="container-responsive text-center py-24 md:py-32" variants={staggerChildren}>
            <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-white" variants={fadeUp}>
              Contact Us
            </motion.h1>
            <motion.p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-medium" variants={fadeUp}>
              Have a question? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section className="section-spacing py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChildren}>
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div className="space-y-10" variants={staggerChildren}>
              <motion.h2 className="text-4xl font-bold" variants={fadeUp}>
                Get in Touch
              </motion.h2>
              <motion.p className="text-lg text-gray-600 leading-relaxed" variants={fadeUp}>
                Whether you're ready to start building tours or just want to say hello — we're here to help.
              </motion.p>

              <motion.div className="space-y-6" variants={staggerChildren}>
                <motion.div className="flex items-center gap-4" variants={fadeUp}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <Link href="mailto:hello@tourwidget.com" className="text-primary hover:underline">
                      hello@tourwidget.com
                    </Link>
                  </div>
                </motion.div>

                <motion.div className="flex items-center gap-4" variants={fadeUp}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </motion.div>

                <motion.div className="flex items-center gap-4" variants={fadeUp}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p>San Francisco, CA</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeUp}>
              <Card className="p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button type="submit" className="w-full flex justify-center items-center gap-2" size="lg" disabled={loading}>
                    {loading ? "Sending..." : <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>}
                  </Button>

                  {feedback && (
                    <p className={`mt-2 text-center font-medium ${feedback.type === "success" ? "text-green-500" : "text-red-500"}`}>
                      {feedback.message}
                    </p>
                  )}
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Footer />
    </main>
  )
}