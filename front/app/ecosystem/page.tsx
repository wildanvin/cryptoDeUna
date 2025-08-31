import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function EcosystemPage() {
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
          <h1 className="text-3xl font-bold text-center mb-2">🌐 El Ecosistema de L2s</h1>
          <p className="text-center text-muted-foreground">Entendiendo las capas de Ethereum</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🏗️</span>
                <span>¿Qué es una Layer 2?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Imagina que Ethereum es como una autopista muy congestionada. Las Layer 2 son como túneles rápidos que
                te permiten llegar al mismo destino, pero más rápido y barato.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🚀 Beneficios:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Transacciones 100x más baratas</li>
                  <li>• Confirmaciones en segundos</li>
                  <li>• Misma seguridad de Ethereum</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🌉</span>
                <span>Bridges: Conectando Mundos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Los bridges son como puentes que te permiten mover tus criptomonedas entre diferentes redes de forma
                segura.
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://bridge.lisk.com" target="_blank" rel="noopener noreferrer">
                    Lisk Bridge Oficial
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://across.to" target="_blank" rel="noopener noreferrer">
                    Across Protocol
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚡</span>
                <span>The Superchain</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                El Superchain es como un sistema de trenes interconectados donde puedes moverte fácilmente entre
                diferentes ciudades (L2s) sin complicaciones.
              </p>
              <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                <a href="https://www.superchain.eco" target="_blank" rel="noopener noreferrer">
                  Explorar Superchain
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
