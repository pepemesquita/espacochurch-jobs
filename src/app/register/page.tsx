import { Metadata } from "next";
import RegisterPage from "./RegisterPage";

export const metadata: Metadata = {
  title: "Cadastrar Perfil",
  description: "Crie seu perfil profissional no Espaço Church Jobs e mostre suas habilidades para toda a comunidade de Pelotas.",
};

export default function Page() {
  return <RegisterPage />;
}
