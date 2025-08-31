import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MultisigsPage() {
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
          <h1 className="text-3xl font-bold text-center mb-2">👥 Multisigs</h1>
          <p className="text-center text-muted-foreground">Cuentas compartidas sin papeleo</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔐</span>
                <span>¿Qué es un Multisig?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Imagina una caja fuerte que necesita 3 llaves de 5 personas para abrirse. Un multisig es como esa caja
                fuerte, pero para criptomonedas.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Casos de uso:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Fondos familiares compartidos</li>
                  <li>• Tesorería de empresas</li>
                  <li>• Proyectos entre socios</li>
                  <li>• DAOs y organizaciones</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>✨</span>
                <span>Ventajas vs Bancos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-destructive/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-destructive mb-2">🏦 Bancos Tradicionales</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Meses de papeleo</li>
                    <li>• Comisiones altas</li>
                    <li>• Horarios limitados</li>
                    <li>• Aprobaciones lentas</li>
                  </ul>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">🔐 Multisigs</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Configuración en minutos</li>
                    <li>• Sin comisiones bancarias</li>
                    <li>• Disponible 24/7</li>
                    <li>• Transparencia total</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🛠️</span>
                <span>Crear tu Multisig</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Estas plataformas te permiten crear multisigs fácilmente:</p>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://safe.global" target="_blank" rel="noopener noreferrer">
                    Safe (Más Popular)
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://multisig.lisk.com" target="_blank" rel="noopener noreferrer">
                    Lisk Multisig
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
