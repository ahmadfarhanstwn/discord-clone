import { UserButton } from "@clerk/nextjs";
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "../../../components/ModeToggle";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  )
}
