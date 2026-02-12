"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { signInDefaultValues } from "@/lib/constants";

import { signInWithCredentials } from "@/lib/actions/user.actions";

const CredentialsSignInForm = () => {
  const router = useRouter();
  const [data, action] = useActionState(signInWithCredentials, {
    message: "",
    success: false,
    callbackUrl: undefined,
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (data.success && data.callbackUrl) {
      router.push(data.callbackUrl);
    }
  }, [data.success, data.callbackUrl, router]);

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        className="w-full"
        variant="default"
        disabled={pending}
      >
        {pending ? "Signing In..." : "Sign In with Credentials"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            name="email"
            defaultValue={signInDefaultValues.email}
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            name="password"
            defaultValue={signInDefaultValues.password}
            autoComplete="current-password"
          />
        </div>

        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link target="_self" className="link" href="/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
