"use client";

import SideNav from "@/components/organisms/SideNav";
import TopNav from "@/components/organisms/TopNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="flex min-h-screen bg-bgGray overflow-hidden">
      <div className="mobile:max-sm:hidden shrink-0 sticky top-0 h-screen">
        <SideNav />
      </div>
      <Sheet open={showNav} onOpenChange={setShowNav}>
        <SheetContent side="left" className="p-0 w-[280px] border-none">
          <SideNav compact onNavigate={() => setShowNav(false)} />
        </SheetContent>
      </Sheet>
      <div className="w-full min-w-0">
        <TopNav onClick={() => setShowNav((prev) => !prev)} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
