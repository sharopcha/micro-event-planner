import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Toaster } from '@/components/ui/sonner'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, LogOut, Plus, LayoutDashboard } from 'lucide-react'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Optional: Only redirect if strict app structure requires it.
    // For now, layout allows non-authed? 
    // Wait, middleware handles protection. 
    // But this layout renders user menu.
  }

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className={`min-h-screen flex flex-col ${inter.className}`}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">Micro Planner</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Dashboard
              </Link>
            </nav>
          </div>
          
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
             <div className="w-full flex-1 md:w-auto md:flex-none">
                <Link href="/create">
                   <Button size="sm" variant="default">
                     <Plus className="mr-2 h-4 w-4" /> Create Event
                   </Button>
                </Link>
             </div>
             
             {user && (
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                     <Avatar className="h-8 w-8">
                       <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                     </Avatar>
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56" align="end" forceMount>
                   <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none">User</p>
                       <p className="text-xs leading-none text-muted-foreground">
                         {user.email}
                       </p>
                     </div>
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                     <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                     </Link>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem>
                      <form action={signOut} className="w-full">
                         <button type="submit" className="flex w-full items-center">
                           <LogOut className="mr-2 h-4 w-4" /> Log out
                         </button>
                      </form>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             )}
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
