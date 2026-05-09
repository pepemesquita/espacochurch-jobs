import { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Faça login no Espaço Church Jobs para gerenciar seu perfil profissional e conectar-se com a comunidade.",
};

export default function Page() {
  return <LoginPage />;
}
