"use client";

import { User, Phone, Mail, Building2 } from "lucide-react";
import { Call } from "@/lib/dummyCalls";

interface CustomerCardProps {
  call: Call;
}

export default function CustomerCard({ call }: CustomerCardProps) {
  return (
    <div className="bg-muted/50 rounded-2xl p-4 border border-border">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User size={22} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base">{call.customerName}</h3>
          {call.customerCompany && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2 size={13} />
              {call.customerCompany}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 space-y-1.5 pl-[60px]">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Phone size={13} className="shrink-0" />
          <span>{call.customerPhone}</span>
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Mail size={13} className="shrink-0" />
          <span>{call.customerEmail}</span>
        </p>
      </div>
    </div>
  );
}
