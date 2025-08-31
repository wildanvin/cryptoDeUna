"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Zap, Smartphone } from "lucide-react"
import { useState } from "react"

export function PaymentButton() {
  const [isLoading, setIsLoading] = useState(false)

  const paymentUrl =
    "https://pagar.deuna.app/H92p/U2FsdGVkX18p6Zcy/bgOL6ifQX4hR/T8aY/oRSX4qe7omMo5eBIQEJYr/ZDCJF5dERMWR5e7X7ZVt+XRJ+FxZ4/YF8qdo3BhOo7MF+Mfw2qwaBQCjSdeKtBm33x4AYnST7QLXqTbNS5m01+9VhEXKikd97nSwAXD0cCKKphM32zYdQvx410zlTiMiKpZfd3SR96oLiAm40g7fYJNAlD+AA=="

  const handlePayment = async () => {
    setIsLoading(true)

    // Simular proceso de preparación del pago
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirigir a la aplicación de pagos
    window.open(paymentUrl, "_blank")

    setIsLoading(false)
  }

  return (
    <Card className="w-full border-2 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-6 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="relative">
              <Zap className="h-10 w-10 text-accent mx-auto animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-xl font-bold text-card-foreground">¡Realizar Transferencia! ⚡</h3>
            <p className="text-sm text-muted-foreground text-balance font-medium">
              Transfiere tus fondos de manera súper rápida y segura usando la app DeUna
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="font-semibold">Preparando magia...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span className="font-bold">¡Ir a DeUna ahora!</span>
                <ArrowRight className="h-5 w-5 animate-pulse" />
              </div>
            )}
          </Button>

          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-primary/20">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AAZQxtJQXbJAsTDJOkKDaArOK15svn.png"
                alt="Código QR de DeUna para pago móvil"
                className="w-48 h-48 object-contain"
              />
              <p className="text-center text-sm text-muted-foreground mt-2 font-medium">Escanea con tu móvil</p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              🚀 Serás redirigido a la aplicación DeUna para completar la transferencia
            </p>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold inline-block">
              ✨ Súper seguro y confiable
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
