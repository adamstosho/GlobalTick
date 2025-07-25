"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Globe, Clock, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const timeZones = [
  { value: "America/New_York", label: "New York (EST/EDT)", city: "New York", flag: "🇺🇸" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", city: "Los Angeles", flag: "🇺🇸" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)", city: "Chicago", flag: "🇺🇸" },
  { value: "Europe/London", label: "London (GMT/BST)", city: "London", flag: "🇬🇧" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)", city: "Paris", flag: "🇫🇷" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", city: "Berlin", flag: "🇩🇪" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", city: "Tokyo", flag: "🇯🇵" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", city: "Shanghai", flag: "🇨🇳" },
  { value: "Asia/Dubai", label: "Dubai (GST)", city: "Dubai", flag: "🇦🇪" },
  { value: "Asia/Kolkata", label: "Mumbai (IST)", city: "Mumbai", flag: "🇮🇳" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)", city: "Sydney", flag: "🇦🇺" },
  { value: "Africa/Lagos", label: "Lagos (WAT)", city: "Lagos", flag: "🇳🇬" },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)", city: "São Paulo", flag: "🇧🇷" },
  { value: "America/Mexico_City", label: "Mexico City (CST/CDT)", city: "Mexico City", flag: "🇲🇽" },
]

const majorCities = [
  { name: "New York", timezone: "America/New_York", flag: "🇺🇸" },
  { name: "London", timezone: "Europe/London", flag: "🇬🇧" },
  { name: "Lagos", timezone: "Africa/Lagos", flag: "🇳🇬" },
  { name: "Tokyo", timezone: "Asia/Tokyo", flag: "🇯🇵" },
  { name: "Sydney", timezone: "Australia/Sydney", flag: "🇦🇺" },
  { name: "Dubai", timezone: "Asia/Dubai", flag: "🇦🇪" },
]

export default function WorldTimeSync() {
  const [isDark, setIsDark] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userTimezone, setUserTimezone] = useState("")
  const [fromTimezone, setFromTimezone] = useState("")
  const [toTimezone, setToTimezone] = useState("")
  const [inputTime, setInputTime] = useState("")
  const [convertedTime, setConvertedTime] = useState("")
  const [worldClockOpen, setWorldClockOpen] = useState(true)
  const [cityTimes, setCityTimes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Get user's timezone
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Update world clock times
    const updateCityTimes = () => {
      const times: { [key: string]: string } = {}
      majorCities.forEach((city) => {
        const time = new Date().toLocaleTimeString("en-US", {
          timeZone: city.timezone,
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
        times[city.name] = time
      })
      setCityTimes(times)
    }

    updateCityTimes()
    const timer = setInterval(updateCityTimes, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleConvert = () => {
    if (!fromTimezone || !toTimezone || !inputTime) return

    try {
      const [hours, minutes] = inputTime.split(":").map(Number)
      const today = new Date()
      today.setHours(hours, minutes, 0, 0)

      // Create date in source timezone
      const sourceTime = new Date(today.toLocaleString("en-US", { timeZone: fromTimezone }))

      // Convert to target timezone
      const targetTime = new Date(
        sourceTime.getTime() +
          (today.getTime() - new Date(today.toLocaleString("en-US", { timeZone: fromTimezone })).getTime()),
      )

      const converted = targetTime.toLocaleTimeString("en-US", {
        timeZone: toTimezone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })

      setConvertedTime(converted)
    } catch (error) {
      console.error("Conversion error:", error)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WorldTimeSync
            </h1>
          </div>
          <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full bg-transparent">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Current Time Display Panel */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Your Timezone: {userTimezone}</span>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {currentTime.toLocaleTimeString("en-US", { hour12: false })}
              </div>
              <div className="text-lg text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Zone Converter Panel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-600" />
              Time Zone Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-timezone">From Timezone</Label>
                <Select value={fromTimezone} onValueChange={setFromTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        <div className="flex items-center gap-2">
                          <span>{tz.flag}</span>
                          <span>{tz.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-timezone">To Timezone</Label>
                <Select value={toTimezone} onValueChange={setToTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        <div className="flex items-center gap-2">
                          <span>{tz.flag}</span>
                          <span>{tz.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-input">Time (24-hour format)</Label>
              <Input
                id="time-input"
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <Button
              onClick={handleConvert}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!fromTimezone || !toTimezone || !inputTime}
            >
              Convert Time
            </Button>

            {convertedTime && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Converted Time</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">{convertedTime}</div>
                    <Badge variant="secondary" className="mt-2">
                      {timeZones.find((tz) => tz.value === toTimezone)?.city}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* World Clock Section */}
        <Card className="shadow-lg">
          <Collapsible open={worldClockOpen} onOpenChange={setWorldClockOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    World Clock
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${worldClockOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {majorCities.map((city) => (
                    <Card
                      key={city.name}
                      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{city.flag}</div>
                        <div className="font-semibold text-lg mb-1">{city.name}</div>
                        <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                          {cityTimes[city.name] || "--:--"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date().toLocaleDateString("en-US", {
                            timeZone: city.timezone,
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Mobile Floating Convert Button */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleConvert}
            size="lg"
            className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!fromTimezone || !toTimezone || !inputTime}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Convert
          </Button>
        </div>
      </main>
    </div>
  )
}
