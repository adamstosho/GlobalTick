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
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);
  const { toast } = useToast();

  // Load user and favorites from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("globtick_user");
    if (storedUser) setUser(JSON.parse(storedUser));
    const storedFavs = localStorage.getItem("globtick_favorites");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("globtick_favorites", JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addFavorite = (tz: string) => {
    if (!favorites.includes(tz)) setFavorites([...favorites, tz]);
  };
  const removeFavorite = (tz: string) => {
    setFavorites(favorites.filter(f => f !== tz));
  };

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

  // Share Dashboard logic
  const handleShareDashboard = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("favorites", favorites.join(","));
    navigator.clipboard.writeText(url.toString());
    toast({ title: "Link copied!", description: "Your dashboard link is ready to share." });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800" : "bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50"}`}>
      {/* Share Dashboard Button */}
      {user && favorites.length > 0 && (
        <div className="container mx-auto px-2 md:px-4 pt-6 pb-2 flex items-center gap-4">
          <button onClick={handleShareDashboard} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition shadow">
            Share Dashboard
          </button>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-blue-700 dark:text-blue-300">Favorites:</span>
            {favorites.map(fav => {
              const tz = timeZones.find(tz => tz.value === fav);
              return tz ? (
                <span key={fav} className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm font-medium shadow">
                  {tz.flag} {tz.city}
                  <button onClick={() => removeFavorite(fav)} className="ml-2 text-red-500 hover:text-red-700 font-bold">×</button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/placeholder-logo.svg" alt="GlobeTick Logo" width={48} height={48} className="rounded-full shadow-lg" />
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight">GlobeTick</span>
          </div>
          <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full bg-white/70 dark:bg-gray-800/70 shadow-md hover:scale-110 transition-transform">
            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-600" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-2 md:px-4 py-6 space-y-8">
        {/* Current Time Display Panel */}
        <Card className="shadow-2xl rounded-2xl border-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-green-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-blue-600 animate-pulse" />
              <span className="text-base text-muted-foreground font-medium">Your Timezone: {userTimezone}</span>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-wider text-blue-900 dark:text-blue-200">
                {currentTime.toLocaleTimeString("en-US", { hour12: false })}
              </div>
              <div className="text-lg text-muted-foreground font-medium">
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
        <Card className="shadow-2xl rounded-2xl border-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <ArrowRight className="h-6 w-6 text-green-600 animate-bounce" />
              Time Zone Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="from-timezone" className="font-semibold">From Timezone</Label>
                <Select value={fromTimezone} onValueChange={setFromTimezone}>
                  <SelectTrigger className="rounded-lg shadow-sm">
                    <SelectValue placeholder="Select source timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="flex items-center gap-2">
                        <span>{tz.flag}</span>
                        <span>{tz.label}</span>
                        {user && (
                          favorites.includes(tz.value) ? (
                            <button type="button" onClick={e => { e.stopPropagation(); removeFavorite(tz.value); }} className="ml-2 text-red-500 hover:text-red-700">★</button>
                          ) : (
                            <button type="button" onClick={e => { e.stopPropagation(); addFavorite(tz.value); }} className="ml-2 text-yellow-500 hover:text-yellow-700">☆</button>
                          )
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-timezone" className="font-semibold">To Timezone</Label>
                <Select value={toTimezone} onValueChange={setToTimezone}>
                  <SelectTrigger className="rounded-lg shadow-sm">
                    <SelectValue placeholder="Select target timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="flex items-center gap-2">
                        <span>{tz.flag}</span>
                        <span>{tz.label}</span>
                        {user && (
                          favorites.includes(tz.value) ? (
                            <button type="button" onClick={e => { e.stopPropagation(); removeFavorite(tz.value); }} className="ml-2 text-red-500 hover:text-red-700">★</button>
                          ) : (
                            <button type="button" onClick={e => { e.stopPropagation(); addFavorite(tz.value); }} className="ml-2 text-yellow-500 hover:text-yellow-700">☆</button>
                          )
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-input" className="font-semibold">Time (24-hour format)</Label>
              <Input
                id="time-input"
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="max-w-xs rounded-lg shadow-sm"
              />
            </div>

            <Button
              onClick={handleConvert}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
              disabled={!fromTimezone || !toTimezone || !inputTime}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Convert Time
            </Button>

            {convertedTime && (
              <Card className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800 rounded-xl shadow-md mt-4">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1 font-semibold">Converted Time</div>
                    <div className="text-2xl font-extrabold text-green-700 dark:text-green-400 tracking-wide">{convertedTime}</div>
                    <Badge variant="secondary" className="mt-2 text-base font-medium">
                      {timeZones.find((tz) => tz.value === toTimezone)?.city}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* World Clock Section */}
        <Card className="shadow-2xl rounded-2xl border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 transition-all duration-300">
          <Collapsible open={worldClockOpen} onOpenChange={setWorldClockOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-2xl">
                <CardTitle className="flex items-center justify-between text-xl font-bold">
                  <div className="flex items-center gap-2">
                    <Globe className="h-6 w-6 text-purple-600" />
                    World Clock
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${worldClockOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {majorCities.map((city) => (
                    <Card
                      key={city.name}
                      className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700 transition-colors rounded-xl shadow-md"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-2 animate-pulse">{city.flag}</div>
                        <div className="font-semibold text-lg mb-1 tracking-wide">{city.name}</div>
                        <div className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
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
            className="rounded-full shadow-2xl bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 flex items-center gap-2 animate-bounce"
            disabled={!fromTimezone || !toTimezone || !inputTime}
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Convert
          </Button>
        </div>
      </main>
    </div>
  )
}
