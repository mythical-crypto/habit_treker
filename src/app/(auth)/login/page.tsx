import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

interface LoginPageProps {
  searchParams?: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto">
          <Sparkles className="h-6 w-6 text-on-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Привычки</h1>
          <p className="text-sm text-on-surface-variant">
            The Mindful Ritual
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-5">
        <form action="/api/demo-login" method="post" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-on-surface">
              Электронная почта
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue="admin@example.com"
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-medium text-on-surface">
                Пароль
              </Label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Забыли?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                defaultValue="admin"
                required
                className="pl-10"
              />
            </div>
          </div>

          {hasError && (
            <div className="bg-error-container rounded-xl px-4 py-3">
              <p className="text-sm text-error">Неверный email или пароль</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-base font-medium text-on-primary transition-all hover:opacity-90"
          >
            Войти <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-on-surface-variant/60 italic">
        «Маленькие шаги ведут к большим переменам.»
      </p>

      <div className="flex justify-center gap-4 text-xs text-on-surface-variant/40 mt-4">
        <a href="#">Политика</a>
        <span>·</span>
        <a href="#">Поддержка</a>
      </div>
    </div>
  );
}
