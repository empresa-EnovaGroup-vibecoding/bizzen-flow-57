import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MembershipCard } from "./MembershipCard";

interface MembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MembershipModal({ open, onOpenChange }: MembershipModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>GestorQ Pro</DialogTitle>
          <DialogDescription>Únete a nuestra comunidad premium</DialogDescription>
        </DialogHeader>
        <MembershipCard />
      </DialogContent>
    </Dialog>
  );
}
