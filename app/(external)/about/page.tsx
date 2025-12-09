"use client"
import { NavbarExternal } from "@/components/layout/navbar-external"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <NavbarExternal />

      {/* Hero */}
      <section className="section-spacing bg-gradient-to-b from-primary/10 to-white">
        <div className="container-responsive text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About TourWidget</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're building the future of product onboarding and user engagement
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-spacing">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We believe that every product deserves an exceptional onboarding experience. Our mission is to make it
                easy for businesses to create engaging, interactive product tours that delight users and drive adoption.
              </p>
              <p className="text-gray-600 leading-relaxed">
                TourWidget is designed for teams who care about user experience and want to accelerate their product
                adoption without the complexity of traditional approaches.
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent to-success rounded-lg h-64 md:h-96 flex items-center justify-center opacity-20">
              <div className="text-6xl">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-spacing bg-card-bg">
        <div className="container-responsive">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Alice Johnson", role: "CEO & Co-founder", initials: "AJ" },
              { name: "Bob Smith", role: "CTO & Co-founder", initials: "BS" },
              { name: "Carol White", role: "Product Lead", initials: "CW" },
              { name: "David Brown", role: "Design Lead", initials: "DB" },
            ].map((member, idx) => (
              <Card key={idx} className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Avatar size="lg" initials={member.initials} />
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
