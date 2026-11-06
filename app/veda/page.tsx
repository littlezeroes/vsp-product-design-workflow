import type { Metadata } from "next";
import VedaExperience from "./veda-experience";
import "./veda.css";

export const metadata: Metadata = {
  title: "Veda — Form Assemblies",
  description:
    "An interactive study of the Veda metallic form language. Six sculpted objects, one evolving assembly.",
};
export default function VedaPage() {
  return <VedaExperience />;
}
