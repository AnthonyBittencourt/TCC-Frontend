import {
  Utensils,
  Car,
  Home,
  Heart,
  GraduationCap,
  Gamepad2,
  ShoppingBag,
  Wrench,
  Repeat,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIAS_INFO: Record<
  string,
  { label: string; icon: LucideIcon; cor: string }
> = {
  ALIMENTACAO: { label: "Alimentação", icon: Utensils, cor: "bg-orange-500" },
  TRANSPORTE: { label: "Transporte", icon: Car, cor: "bg-blue-500" },
  MORADIA: { label: "Moradia", icon: Home, cor: "bg-purple-500" },
  SAUDE: { label: "Saúde", icon: Heart, cor: "bg-pink-500" },
  EDUCACAO: { label: "Educação", icon: GraduationCap, cor: "bg-cyan-500" },
  LAZER: { label: "Lazer", icon: Gamepad2, cor: "bg-yellow-500" },
  COMPRAS: { label: "Compras", icon: ShoppingBag, cor: "bg-teal-500" },
  SERVICOS: { label: "Serviços", icon: Wrench, cor: "bg-slate-500" },
  ASSINATURAS: { label: "Assinaturas", icon: Repeat, cor: "bg-indigo-500" },
  OUTROS: { label: "Outros", icon: MoreHorizontal, cor: "bg-gray-500" },
};

export const CATEGORIAS_LISTA = Object.entries(CATEGORIAS_INFO).map(
  ([key, info]) => ({ key, ...info }),
);