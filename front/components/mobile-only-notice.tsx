"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Monitor, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export function MobileOnlyNotice() {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  if (isMobile) {
    return (
      <Card className="w-full border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-card-foreground">📱 ¡Perfecto! Estás en móvil</p>
              <p className="text-xs text-muted-foreground">
                cryptoDeUna funciona mejor en tu teléfono con la app deUna instalada ✨
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-2 border-destructive/20 bg-gradient-to-r from-destructive/5 to-orange-500/5">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-card-foreground">🖥️ ¡Oops! Necesitas tu móvil</p>
            <p className="text-xs text-muted-foreground">
              cryptoDeUna solo funciona en dispositivos móviles con la app deUna instalada 📱
            </p>
          </div>
          <Monitor className="h-5 w-5 text-muted-foreground opacity-50" />
        </div>
      </CardContent>
    </Card>
  )
}
