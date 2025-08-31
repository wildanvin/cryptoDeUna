import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DeFiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center mb-2">💰 DeFi Explicado Simple</h1>
          <p className="text-center text-muted-foreground">Finanzas descentralizadas sin bancos</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🏦</span>
                <span>Préstamos Sin Bancos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Imagina poder prestar o pedir prestado dinero directamente a otras personas, sin bancos ni papeleo. Eso
                es DeFi.
              </p>
              <div className="bg-accent/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✨ Ventajas:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Sin aprobaciones bancarias</li>
                  <li>• Disponible 24/7</li>
                  <li>• Tasas competitivas</li>
                  <li>• Control total de tus fondos</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://aave.com" target="_blank" rel="noopener noreferrer">
                    Aave (Préstamos)
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://compound.finance" target="_blank" rel="noopener noreferrer">
                    Compound (Ahorro)
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📈</span>
                <span>Perpetuos (Perps)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Los perpetuos te permiten apostar si el precio de una criptomoneda subirá o bajará, como un juego de
                predicción con dinero real.
              </p>
              <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive font-medium">⚠️ Advertencia: Alto riesgo, solo para expertos</p>
              </div>
              <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                <a href="https://gmx.io" target="_blank" rel="noopener noreferrer">
                  GMX (Trading Avanzado)
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Flash Loans</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Imagina pedir prestado millones de dólares por unos segundos para hacer una operación y devolverlos
                inmediatamente. Eso son los flash loans.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 Usado por desarrolladores para arbitraje y operaciones complejas en una sola transacción.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
