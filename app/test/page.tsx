/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MusicWave from "@/components/loaders/MusicWave";
import SpotifyPlayer from "@/components/micro/Try";
import { useRef, useState, useEffect } from "react";

export default function App() {
  return (
    <iframe
      src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fphoto.php%3Ffbid%3D122408621270224689%26set%3Da.122102886176224689%26type%3D3&show_text=false&width=500"
      width="500"
      height="753"

      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    ></iframe>
  );
}
