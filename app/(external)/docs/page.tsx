"use client"
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"

export default function DocsPage() {
  const tabs = [
    {
      label: "Installation",
      value: "installation",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Installation</h3>
          <p className="text-gray-600">Add the TourWidget script to your HTML:</p>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`<script src="https://tourwidget.com/widget.js"></script>`}</code>
          </pre>
        </div>
      ),
    },
    {
      label: "Getting Started",
      value: "getting-started",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Getting Started</h3>
          <p className="text-gray-600">Initialize your tour widget:</p>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`window.initTour({
  tourId: "abc123",
  steps: [
    {
      title: "Welcome",
      description: "Welcome to our app",
      targetSelector: "#header"
    }
  ]
});`}</code>
          </pre>
        </div>
      ),
    },
    {
      label: "Configuration",
      value: "configuration",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Configuration</h3>
          <p className="text-gray-600">JSON configuration example:</p>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "tourId": "tour_123",
  "steps": [
    {
      "id": "step_1",
      "title": "Step 1",
      "description": "Description",
      "targetSelector": ".target",
      "position": "bottom"
    }
  ]
}`}</code>
          </pre>
        </div>
      ),
    },
  ]

  return (
    <main className="min-h-screen">
      <NavbarExternal />

      {/* Hero */}
      <section className="section-spacing bg-gradient-to-b from-primary/10 to-white">
        <div className="container-responsive text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to integrate TourWidget into your application
          </p>
        </div>
      </section>

      {/* Docs */}
      <section className="section-spacing">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <h3 className="font-bold mb-2">📦 Easy Installation</h3>
              <p className="text-sm text-gray-600">Just copy and paste one script tag</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">⚙️ Flexible Configuration</h3>
              <p className="text-sm text-gray-600">Customize everything via JSON</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">📚 Full API</h3>
              <p className="text-sm text-gray-600">Access all features programmatically</p>
            </Card>
          </div>

          <Card className="p-8">
            <Tabs tabs={tabs} />
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing bg-card-bg">
        <div className="container-responsive max-w-2xl">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is there a free plan?",
                a: "Yes! We offer a free tier with up to 3 tours.",
              },
              {
                q: "Can I customize the styling?",
                a: "You can customize colors, fonts, and animations.",
              },
              {
                q: "Does it work on mobile?",
                a: "Yes, TourWidget is fully responsive and works on all devices.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="font-bold mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
