import { Check, Crown, Sparkles, Users, BookOpen, Headphones, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SKOOL_URL = "https://www.skool.com/gestorq-8720";

const benefits = [
  {
    icon: Headphones,
    title: "Soporte Exclusivo",
    description: "Acceso prioritario a nuestro equipo de soporte"
  },
  {
    icon: BookOpen,
    title: "Acceso a Cursos",
    description: "Formación completa sobre gestión de negocios"
  },
  {
    icon: Users,
    title: "Comunidad Privada",
    description: "Conecta con otros profesionales del sector"
  },
  {
    icon: Zap,
    title: "Gestión Ilimitada",
    description: "Sin límites en clientes, citas o inventario"
  }
];

interface MembershipCardProps {
  className?: string;
}

export function MembershipCard({ className }: MembershipCardProps) {
  const handleJoinClick = () => {
    window.open(SKOOL_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl",
      className
    )}>
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      
      <CardHeader className="relative text-center pb-2 pt-8">
        {/* Badge */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
          <Crown className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Membresía Premium
          </span>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-foreground">
          GestorQ Pro / Comunidad
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          Lleva tu negocio al siguiente nivel con acceso exclusivo
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6 pb-8">
        {/* Benefits list */}
        <ul className="space-y-4">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success shrink-0" />
                  <span className="font-medium text-foreground">{benefit.title}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {benefit.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA Section */}
        <div className="space-y-3 pt-2">
          <Button 
            onClick={handleJoinClick}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            <Crown className="mr-2 h-5 w-5" />
            Únete ahora y Paga Seguro en Skool
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            🔒 Pagos procesados de forma segura a través de la plataforma Skool
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
