import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">TourWidget</h3>
            <p className="text-sm opacity-80">Create interactive product tours and onboarding flows</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="opacity-80 hover:opacity-100">
                  About
                </Link>
              </li>
              <li>
                <Link href="/docs" className="opacity-80 hover:opacity-100">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="opacity-80 hover:opacity-100">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-sm text-center opacity-80">
          © 2025 TourWidget. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
