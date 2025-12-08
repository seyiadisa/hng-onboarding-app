"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToursStore } from "@/lib/store"
import { mockAnalyticsEvents } from "@/lib/mock-data"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AnalyticsPage() {
  const { tours } = useToursStore()

  // Mock analytics data
  const completionData = tours.map((tour) => ({
    name: tour.title,
    completion: Math.random() * 100,
    started: Math.floor(Math.random() * 500),
  }))

  const trendData = [
    { date: "Mon", tours: 40, users: 240 },
    { date: "Tue", tours: 50, users: 300 },
    { date: "Wed", tours: 45, users: 280 },
    { date: "Thu", tours: 60, users: 380 },
    { date: "Fri", tours: 70, users: 420 },
    { date: "Sat", tours: 65, users: 390 },
    { date: "Sun", tours: 55, users: 350 },
  ]

  const stepsData = tours
    .flatMap((tour) =>
      tour.steps.map((step, idx) => ({
        name: `${tour.title} - Step ${idx + 1}`,
        completion: Math.random() * 100,
      })),
    )
    .slice(0, 5)

  const totalMetrics = {
    totalTours: tours.length,
    totalSteps: tours.reduce((acc, t) => acc + t.steps.length, 0),
    avgCompletion: (completionData.reduce((a, b) => a + b.completion, 0) / completionData.length).toFixed(1),
    totalEvents: mockAnalyticsEvents.length,
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600 mb-8">Track your product tour performance</p>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Total Tours</div>
              <div className="text-3xl font-bold">{totalMetrics.totalTours}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Total Steps</div>
              <div className="text-3xl font-bold">{totalMetrics.totalSteps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Avg. Completion</div>
              <div className="text-3xl font-bold">{totalMetrics.avgCompletion}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Total Events</div>
              <div className="text-3xl font-bold">{totalMetrics.totalEvents}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tours" stroke="var(--color-accent)" strokeWidth={2} />
                  <Line type="monotone" dataKey="users" stroke="var(--color-success)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Completion Rates</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completion" fill="var(--color-accent)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Steps Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Steps by Completion</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completion" fill="var(--color-success)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
