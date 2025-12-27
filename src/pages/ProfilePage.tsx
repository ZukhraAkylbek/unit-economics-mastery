import { Settings, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProfilePageProps {
  user: { name: string; telegram: string };
}

export function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Banner Alert */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          <div>
            <div className="font-bold">ДОСЬЕ НЕ УКОМПЛЕКТОВАНО</div>
            <div className="text-sm opacity-80">ЗАПОЛНИ АНКЕТУ ДЛЯ ПЕРСОНАЛИЗАЦИИ ЗАДАЧ</div>
          </div>
        </div>
        <Button variant="secondary" className="shrink-0">
          ЗАПОЛНИТЬ СЕЙЧАС
        </Button>
      </div>

      {/* Profile Card */}
      <div className="card-elevated overflow-hidden">
        {/* Header with gradient */}
        <div className="relative h-32 bg-gradient-to-br from-primary via-primary/80 to-hero">
          <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-hero/50 backdrop-blur-sm">
            <span className="text-sm font-semibold text-accent">🏆 500 PC</span>
          </div>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-hero/50 backdrop-blur-sm text-hero-foreground hover:bg-hero/70 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Avatar & Info */}
        <div className="relative px-6 pb-6">
          <div className="absolute -top-12 left-6">
            <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card shadow-elevated flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pt-16">
            <h1 className="font-display text-3xl font-bold italic text-foreground">
              {user.name.toUpperCase()}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full border border-border text-sm">
                JUNIOR GROWTH PM
              </span>
              <span className="text-muted-foreground">{user.telegram}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="p-6 rounded-2xl bg-muted">
              <div className="text-xs tracking-wider text-muted-foreground mb-2">MASTERY</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">0</span>
                <span className="text-muted-foreground">%</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-background overflow-hidden">
                <div className="h-full w-0 bg-primary rounded-full" />
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border">
              <div className="text-xs tracking-wider text-muted-foreground mb-2">DOSSIER CONTEXT</div>
              <div className="font-bold text-foreground italic">НЕ УКАЗАН</div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="text-muted-foreground">GOAL: <span className="text-foreground">GENERAL SKILLUP</span></div>
                <div className="text-primary">LEVEL: NOT SPECIFIED</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-hero text-hero-foreground">
              <div className="text-xs tracking-wider opacity-70 mb-2">GROWTH ENGINE</div>
              <Link
                to="/tasks"
                className="flex items-center justify-between mt-4 pt-4 border-t border-hero-foreground/20 hover:opacity-80 transition-opacity"
              >
                <span className="font-bold">ADD PROJECT</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
