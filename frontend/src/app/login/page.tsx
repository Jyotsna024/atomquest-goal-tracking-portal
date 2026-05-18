"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Atom, User, Shield, Settings, ArrowRight, Eye, EyeOff } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const demoRoles: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
  { role: "employee", label: "Employee", desc: "View & manage your goals", icon: <User className="w-5 h-5" /> },
  { role: "manager", label: "Manager", desc: "Review team performance", icon: <Shield className="w-5 h-5" /> },
  { role: "admin", label: "Administrator", desc: "System & user management", icon: <Settings className="w-5 h-5" /> },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleDemoLogin = (role: UserRole) => {
    login(role);
    if (role === "manager") router.push("/manager");
    else if (role === "admin") router.push("/admin");
    else router.push("/employee");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login("employee");
    router.push("/employee");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Atom className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
          </div>
          <p className="text-blue-100 mt-1 text-sm">Enterprise Performance Management</p>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">Align. Track.<br />Achieve.</h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Set meaningful goals, track progress in real-time, and drive organizational performance with data-driven insights.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">42</p><p className="text-xs text-blue-200 mt-1">Active Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">156</p><p className="text-xs text-blue-200 mt-1">Goals Set</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">78%</p><p className="text-xs text-blue-200 mt-1">Completion</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-blue-200">© 2026 {APP_NAME}. All rights reserved.</p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Atom className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </div>

          {showForgot ? (
            <Card>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email to receive a reset link.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {forgotSent ? (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto">
                      <ArrowRight className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="font-medium">Check your email</p>
                    <p className="text-sm text-muted-foreground">We&apos;ve sent a reset link to {forgotEmail}</p>
                    <Button variant="ghost" onClick={() => { setShowForgot(false); setForgotSent(false); }} className="mt-4">Back to login</Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input id="forgot-email" type="email" placeholder="you@company.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                    </div>
                    <Button className="w-full" onClick={() => setForgotSent(true)}>Send Reset Link</Button>
                    <Button variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>Back to login</Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</button>
                      </div>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Sign in <ArrowRight className="w-4 h-4 ml-1" /></Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Quick Demo Access</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {demoRoles.map((r) => (
                    <button key={r.role} onClick={() => handleDemoLogin(r.role)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group cursor-pointer">
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">{r.icon}</div>
                      <span className="text-sm font-medium">{r.label}</span>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
