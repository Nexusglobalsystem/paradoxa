import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion administrateur — LA PARADOXA",
};

export default function ConnexionPage() {
  return (
    <div
      data-maison="groupe"
      className="flex min-h-screen items-center justify-center bg-encre-baobab px-space-lg py-space-2xl"
    >
      <Card className="w-full max-w-md bg-surface-container-lowest">
        <CardHeader>
          <CardTitle>Laboratoire &amp; administration</CardTitle>
          <CardDescription>
            Accès réservé aux comptes administrateurs de LA PARADOXA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
