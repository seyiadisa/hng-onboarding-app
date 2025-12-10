"use client"
import { useEffect, useState, useMemo } from "react"
import { createClient } from "@supabase/supabase-js" // Ensure this is installed or use your project's client helper
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToursStore } from "@/lib/store"
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { Loader2 } from "lucide-react"
import { format, subDays, isSameDay, parseISO } from "date-fns"

// Initialize Supabase Client (Or import your existing helper from @/utils/supabase/client)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

type AnalyticsEvent = {
  id: string
  created_at: string
  tour_id: string
  step_id?: string
  event_type: "tour_started" | "step_viewed" | "tour_skipped" | "tour_completed"
  session_id: string
}

const COLORS = {
  started: "#3b82f6", // Blue
  completed: "#22c55e", // Green
  skipped: "#ef4444", // Red
  viewed: "#f59e0b", // Amber
  purple: "#8b5cf6",
}

export default function AnalyticsPage() {
  const { tours, fetchTours } = useToursStore()
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch Tours (for titles) and Analytics Events
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Ensure we have tour names loaded
      if (tours.length === 0) await fetchTours()

      // Fetch analytics
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: true })

      if (!error && data) {
        setEvents(data as AnalyticsEvent[])
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  // --- Data Processing ---

  // 1. Overview Metrics
  const metrics = useMemo(() => {
    const totalStarted = events.filter(e => e.event_type === "tour_started").length
    const totalCompleted = events.filter(e => e.event_type === "tour_completed").length
    const uniqueUsers = new Set(events.map(e => e.session_id)).size
    
    const completionRate = totalStarted > 0 
      ? ((totalCompleted / totalStarted) * 100).toFixed(1) 
      : "0.0"

    return { totalStarted, totalCompleted, uniqueUsers, completionRate }
  }, [events])

  // 2. Tour Performance (Comparison of Started vs Completed per Tour)
  const tourPerformanceData = useMemo(() => {
    return tours.map(tour => {
      const tourEvents = events.filter(e => e.tour_id === tour.id)
      const started = tourEvents.filter(e => e.event_type === "tour_started").length
      const completed = tourEvents.filter(e => e.event_type === "tour_completed").length
      const rate = started > 0 ? Math.round((completed / started) * 100) : 0

      return {
        name: tour.title,
        started,
        completed,
        rate
      }
    }).filter(t => t.started > 0) // Only show tours with activity
  }, [events, tours])

  // 3. Weekly Activity Trend
  const trendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      return {
        date: format(d, "MMM dd"),
        fullDate: d,
        events: 0,
        sessions: 0
      }
    })

    events.forEach(event => {
      const eventDate = parseISO(event.created_at)
      const dayStat = last7Days.find(d => isSameDay(d.fullDate, eventDate))
      if (dayStat) {
        dayStat.events += 1
      }
    })
    
    // Calculate unique sessions per day (approximate for visualization)
    // A more accurate way would be grouping strictly, but this fits the chart structure
    events.forEach(event => {
        const eventDate = parseISO(event.created_at)
        const dayStat = last7Days.find(d => isSameDay(d.fullDate, eventDate))
        if(dayStat) {
             // This is a rough count, ideally we'd use a Set per day
             dayStat.sessions += 1 
        }
    })

    return last7Days.map(d => ({ 
        date: d.date, 
        interactions: d.events 
    }))
  }, [events])

  // 4. Event Distribution
  const distributionData = useMemo(() => {
    const counts = {
      "Started": events.filter(e => e.event_type === "tour_started").length,
      "Completed": events.filter(e => e.event_type === "tour_completed").length,
      "Skipped": events.filter(e => e.event_type === "tour_skipped").length,
    }
    return [
      { name: "Started", value: counts["Started"], color: COLORS.started },
      { name: "Completed", value: counts["Completed"], color: COLORS.completed },
      { name: "Skipped", value: counts["Skipped"], color: COLORS.skipped },
    ].filter(i => i.value > 0)
  }, [events])


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Gathering analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-sm md:text-base text-gray-600">
            Real-time insights from your onboarding tours
          </p>
        </div>

        {/* 1. Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="text-xs md:text-sm text-gray-500 mb-1">Total Tours Started</div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{metrics.totalStarted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="text-xs md:text-sm text-gray-500 mb-1">Total Completions</div>
              <div className="text-2xl md:text-3xl font-bold text-green-600">{metrics.totalCompleted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="text-xs md:text-sm text-gray-500 mb-1">Completion Rate</div>
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{metrics.completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="text-xs md:text-sm text-gray-500 mb-1">Unique Users</div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600">{metrics.uniqueUsers}</div>
            </CardContent>
          </Card>
        </div>

        {events.length === 0 ? (
           <Card className="bg-gray-50 border-dashed">
             <CardContent className="p-12 text-center">
               <p className="text-gray-500">No analytics data found yet. Start your tours to see data here!</p>
             </CardContent>
           </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            
            {/* 2. Engagement Trend (Area Chart) */}
            <Card className="overflow-hidden lg:col-span-2">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Weekly Engagement</CardTitle>
                <CardDescription>Total interactions over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-64 md:h-80 p-0 pb-4 md:p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.started} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.started} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="interactions" 
                      stroke={COLORS.started} 
                      fillOpacity={1} 
                      fill="url(#colorInteractions)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 3. Tour Completion Performance (Bar Chart) */}
            <Card className="overflow-hidden">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Tour Completion & Drop-off</CardTitle>
                <CardDescription>Started vs. Completed per tour</CardDescription>
              </CardHeader>
              <CardContent className="h-72 md:h-80 p-0 pb-4 md:p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tourPerformanceData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100} 
                      tick={{fontSize: 11, fill: '#374151'}} 
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="started" name="Started" fill={COLORS.started} radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="completed" name="Completed" fill={COLORS.completed} radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 4. Event Distribution (Donut Chart) */}
            <Card className="overflow-hidden">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">User Behavior</CardTitle>
                <CardDescription>Breakdown of user actions</CardDescription>
              </CardHeader>
              <CardContent className="h-72 md:h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  )
}