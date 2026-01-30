import { MembershipCard } from "@/components/membership/MembershipCard";

export default function Membership() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Membresía Premium
        </h1>
        <p className="text-muted-foreground">
          Accede a todas las funciones exclusivas de GestorQ Pro
        </p>
      </div>
      
      <MembershipCard />
    </div>
  );
}
