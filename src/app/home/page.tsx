"use client"

import Content from "../components/Content/content";
import Sidebar from "../components/sidebar/sideBar";
import { Container } from "@/lib/container";

export default function Home() {
  return (
    <Container 
      as="div" 
      variant="default" 
      className="bg-synth-app flex flex-row w-full h-screen overflow-hidden"
    >
      <Container as="div" className="flex w-[5%] h-full">
        <Sidebar />
      </Container>

      {/* Main Content */}
      <Container as="div" variant="default" className="w-[95%] h-full overflow-y-auto">
        <Content />
      </Container>
    </Container>
  );
}