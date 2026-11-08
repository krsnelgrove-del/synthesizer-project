"use client"

import Content from "../components/Content/content";
import Sidebar from "../components/sidebar/sideBar";
import { Container } from "@/lib/container";
import { Notes, Note } from "../(const)/noteMap";


export default function Home() {

  return (
      <Container as="div" variant="default" className="flex flex-row w-full min-h-dvh gap-x-0.5">
        {/*Sidebar*/}
        <Container as="div" className="flex inset-0 w-1/20">
          <Sidebar/>
        </Container>

        {/*Main Content*/}
        <Container as="div" variant="default" className="w-19/20">
          <Content/>
        </Container>
    </Container>
  );
}