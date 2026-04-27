"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message ?? "Неверный email или пароль");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="space-y-8">
      {/* Logo */}
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

      {/* Form */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-on-surface">
              Электронная почта
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="bg-error-container rounded-xl px-4 py-3">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Вход..." : "Войти"} <ArrowRight className="h-4 w-4" />
          </Button>
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

      {/* Quote */}
      <p className="text-center text-xs text-on-surface-variant/60 italic">
        «Маленькие шаги ведут к большим переменам.»
      </p>

      {/* Footer links */}
      <div className="flex justify-center gap-4 text-xs text-on-surface-variant/40 mt-4">
        <a href="#">Политика</a>
        <span>·</span>
        <a href="#">Поддержка</a>
      </div>
    </div>
  );
}
