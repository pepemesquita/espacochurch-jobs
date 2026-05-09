import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "Home | Espaço Church Jobs",
  description: "O maior diretório de profissionais da comunidade Espaço Church Pelotas. Encontre talentos em tecnologia, marketing, saúde, construção e muito mais.",
};

export default function Page() {
  return <HomePage />;
}
