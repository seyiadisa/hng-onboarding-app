"use client"
import Link from "next/link"
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <NavbarExternal />

      {/* Hero Section */}
      <section
        id="hero"
        className="section-spacing bg-gradient-to-br from-primary via-primary-light to-accent text-white overflow-hidden"
      >
        <div className="container-responsive grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Create Interactive Product Tours in Minutes
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Engage users with seamless onboarding flows and product tours. No coding required.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/register">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg h-64 md:h-96 flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-full h-full p-8 text-white opacity-20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="2" y="2" width="20" height="20" rx="2" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing">
        <div className="container-responsive">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Easy to Use",
                description: "Intuitive interface for creating tours without coding",
                icon: "⚡",
              },
              {
                title: "Analytics",
                description: "Track completion rates and user engagement",
                icon: "📊",
              },
              {
                title: "Customizable",
                description: "Match your brand with full design customization",
                icon: "🎨",
              },
              {
                title: "Real-time Updates",
                description: "See analytics and changes update in real-time",
                icon: "🔄",
              },
              {
                title: "Developer Friendly",
                description: "Simple API and embed script for integration",
                icon: "💻",
              },
              {
                title: "24/7 Support",
                description: "Get help whenever you need it",
                icon: "🎯",
              },
            ].map((feature, idx) => (
              <Card key={idx} hoverable className="p-6 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="getting-started" className="section-spacing bg-card-bg">
        <div className="container-responsive">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Tour",
                description: "Design your onboarding flow with our visual builder",
              },
              {
                step: "02",
                title: "Customize Steps",
                description: "Add descriptions, target elements, and positioning",
              },
              {
                step: "03",
                title: "Deploy",
                description: "Copy the embed script and add it to your website",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold text-accent mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Snippet */}
      <section className="section-spacing">
        <div className="container-responsive">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Integration is Simple</h2>
          <Card className="p-8">
            <pre className="bg-neutral-dark text-white p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<script src="https://tourwidget.com/widget.js"></script>
<script>
  initTour({
    tourId: "tour_abc123",
    containerId: "my-app"
  });
</script>`}</code>
            </pre>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
