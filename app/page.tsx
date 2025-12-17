import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Sparkles, Calendar, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold sm:inline-block text-xl">Micro Planner</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
              Now in Beta 🎉
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-balance">
              Event planning for the rest of us.
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-balance">
              Plan beautiful micro-events in minutes. From birthdays to picnics, we handle the details so you can enjoy the moment.
            </p>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                  I have an account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 md:px-6 space-y-6 bg-slate-50 py-8 dark:bg-slate-900/50 md:py-12 lg:py-24 rounded-3xl my-8">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold tracking-tighter">
              Features designed for speed
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 text-balance">
              Everything you need to host the perfect small gathering, powered by smart tools and curated vendors.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-xl border bg-background p-2 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <Calendar className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">Smart Wizard</h3>
                  <p className="text-sm text-muted-foreground">
                    Define your event in steps. Date, budget, and guest count are all we need to start.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border bg-background p-2 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <ShoppingBag className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">Addon Marketplace</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse curated bundles for food, decor, and entertainment that fit your budget.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border bg-background p-2 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <Sparkles className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">AI Invitations</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate custom invitations instantly with AI and share them with a unique link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="container mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold tracking-tighter">
              Ready to party?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Start planning your next event today. It's free to create a draft.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg shadow-lg">Start Planning Now</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Antigravity.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
