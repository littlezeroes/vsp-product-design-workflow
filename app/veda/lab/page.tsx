import type { Metadata } from "next";
import FrameStudy from "./study";
import "../veda.css";
import "./study.css";
export const metadata: Metadata = {
  title: "Veda — Frame-by-frame Blender study",
  description:
    "Compare source video frames and the reconstructed Blender geometry at the same source timestamps.",
};
export default function VedaFrameStudyPage() {
  return <FrameStudy />;
}
