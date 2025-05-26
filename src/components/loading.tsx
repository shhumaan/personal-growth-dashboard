import React from 'react'
import { Card } from './ui/card'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4`} />
        <p className="text-white/70 text-sm">{message}</p>
      </div>
    </div>
  )
}

export function FullPageLoading({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="glass-card p-8">
        <Loading message={message} size="lg" />
      </Card>
    </div>
  )
}
