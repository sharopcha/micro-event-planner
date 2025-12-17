'use client'

import { Progress } from '@/components/ui/progress'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardProgressProps {
  currentStep: number // 1: Type, 2: Basics, 3: Addons, 4: Review
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  const steps = [
    { number: 1, label: 'Type' },
    { number: 2, label: 'Basics' },
    { number: 3, label: 'Addons' },
    { number: 4, label: 'Review' },
  ]

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="w-full space-y-4">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-sm">
        {steps.map((step) => (
          <div
            key={step.number}
            className={cn(
              "flex items-center space-x-2",
              currentStep >= step.number ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
              currentStep > step.number 
                ? "bg-primary text-primary-foreground border-primary" 
                : currentStep === step.number
                  ? "border-primary text-primary"
                  : "border-muted"
            )}>
              {currentStep > step.number ? <Check className="h-3 w-3" /> : step.number}
            </div>
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
