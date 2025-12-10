"use client"
import Link from "next/link"

export default function DemoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl mb-6">Live Demo</h1>

      <iframe
        src="https://drive.google.com/file/d/1yF50L3CwS7GsdEjVmcmHwNW8nuFKz3JE/preview"
        width="800"
        height="450"
        allow="autoplay"
        className="rounded-lg shadow-lg"
      ></iframe>

      <Link href="/">
        <button className="mt-6 px-6 py-3 bg-primary rounded-lg">Back Home</button>
      </Link>
    </main>
  )
}