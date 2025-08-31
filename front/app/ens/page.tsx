import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ENSPage() {
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
          <h1 className="text-3xl font-bold text-center mb-2">🏷️ ENS - Tu Nombre Web3</h1>
          <p className="text-center text-muted-foreground">Direcciones fáciles de recordar</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🌐</span>
                <span>¿Qué es ENS?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ENS es como tener un nombre de usuario para tu wallet. En lugar de recordar "0x1234...abcd", puedes usar
                "juan.eth".
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Ejemplo:</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-destructive/10 p-2 rounded text-destructive">
                    ❌ 0x70E1D904c1b50A4B77a38FfA4ec14217493484e3
                  </div>
                  <div className="bg-primary/10 p-2 rounded text-primary">✅ juan.eth</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>✨</span>
                <span>Beneficios de ENS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-accent/5 rounded-lg">
                  <span className="text-2xl">💌</span>
                  <div>
                    <h4 className="font-semibold">Recibir pagos fácil</h4>
                    <p className="text-sm text-muted-foreground">Solo comparte tu nombre.eth</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <h4 className="font-semibold">Sitio web descentralizado</h4>
                    <p className="text-sm text-muted-foreground">Tu nombre.eth puede ser tu website</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-accent/5 rounded-lg">
                  <span className="text-2xl">👤</span>
                  <div>
                    <h4 className="font-semibold">Identidad única</h4>
                    <p className="text-sm text-muted-foreground">Un nombre para todas las redes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🛒</span>
                <span>Conseguir tu ENS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Registrar tu nombre ENS es como comprar un dominio, pero para web3:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💰 Precios aproximados:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 5+ caracteres: ~$5/año</li>
                  <li>• 4 caracteres: ~$160/año</li>
                  <li>• 3 caracteres: ~$640/año</li>
                </ul>
              </div>
              <Button className="w-full" asChild>
                <a href="https://app.ens.domains" target="_blank" rel="noopener noreferrer">
                  Registrar mi ENS
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
