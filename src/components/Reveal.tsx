"use client";
import { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
};

// Componente simplificado sin animaciones para evitar problemas de hidratación
export function Reveal({ children }: RevealProps) {
  return <div>{children}</div>;
}


