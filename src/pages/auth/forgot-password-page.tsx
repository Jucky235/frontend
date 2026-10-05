import { useState } from "react";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsSubmitted(true);
      setShowOtpStep(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpCode.trim()) return;

    console.log("OTP submitted:", otpCode);
  };

  return (
    <div className="relative min-h-screen w-full bg-background font-inter overflow-x-hidden flex flex-col justify-between pb-12">
      <div className="absolute top-0 right-0 left-0 h-[38vh] bg-gradient-to-br from-banner-from to-banner-to rounded-b-[38%] md:rounded-b-[50%] flex items-start justify-center px-6 pt-12 md:px-16 text-white shadow-xl">
        <div className="w-full max-w-5xl">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            Forgot your password?
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/80 max-w-md">
            Enter your email and we'll send a secure reset link to help you get back in.
          </p>
        </div>
      </div>

      <div className="h-[34vh]" />

      <div className="w-full max-w-lg mx-auto px-6 md:px-0">
        <div className="rounded-[28px] border border-border bg-background-card shadow-2xl shadow-black/5 p-6 md:p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-[0.18em] text-foreground-subtle"
                >
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background-hover px-4 py-3.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <Mail className="h-5 w-5 text-foreground-subtle" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-transparent text-base text-foreground placeholder:text-foreground-subtle outline-none appearance-none border-none shadow-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none pl-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-primary px-5 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-foreground">
                    Check your inbox
                  </h2>
                  <p className="text-sm text-foreground-muted">
                    We sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
                  </p>
                </div>
              </div>

              {showOtpStep && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="otp"
                      className="text-xs font-bold uppercase tracking-[0.18em] text-foreground-subtle"
                    >
                      OTP code
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background-hover px-4 py-3.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                      <Mail className="h-5 w-5 text-foreground-subtle" />
                      <input
                        id="otp"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        inputMode="numeric"
                        className="w-full bg-transparent text-base text-foreground placeholder:text-foreground-subtle outline-none appearance-none border-none shadow-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none pl-1"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!otpCode.trim()}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-primary px-5 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Verify OTP
                  </button>
                </form>
              )}

              <div className="rounded-2xl border border-border bg-background-hover px-4 py-3 text-left">
                <p className="text-xs font-medium text-foreground-subtle">
                  Didn’t get it? Try again in a few minutes or check your spam folder.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setShowOtpStep(false);
                  setEmail("");
                  setOtpCode("");
                }}
                className="w-full rounded-full border border-border bg-background-hover px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-background-subtle-hover"
              >
                Try another email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
