"use client";

import { useState, useRef } from "react";

// ✅ Safe dynamic import
let toPng: any = null;

if (typeof window !== "undefined") {
  import("html-to-image").then((mod) => {
    toPng = mod.toPng;
  });
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [slides, setSlides] = useState<{ title: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [format, setFormat] = useState("carousel");

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const generate = async () => {
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, format }),
    });

    const data = await res.json();
    setSlides(data.slides);

    setLoading(false);
  };

  const downloadSlides = async () => {
    if (!toPng) {
      alert("Please wait a second and try again");
      return;
    }

    for (let i = 0; i < slideRefs.current.length; i++) {
      const node = slideRefs.current[i];
      if (!node) continue;

      const dataUrl = await toPng(node);

      const link = document.createElement("a");
      link.download = `slide-${i + 1}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className={darkMode ? "bg-black text-white min-h-screen p-6" : "bg-white text-black min-h-screen p-6"}>
      
      <div className="grid grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="sticky top-6 h-fit">
          <h1 className="text-3xl font-bold mb-4">
            AI Social Media Studio 🚀
          </h1>

          {/* ✅ BLUE BORDER DROPDOWN */}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className={`mb-3 p-2 rounded border-2 border-blue-500 bg-transparent outline-none focus:ring-2 focus:ring-blue-300 ${
              darkMode ? "text-white bg-black" : "text-black bg-white"
            }`}
          >
            <option value="carousel">Carousel (1:1)</option>
            <option value="post">Post (1:1)</option>
            <option value="story">Story (9:16)</option>
          </select>

          {/* INPUT */}
          <textarea
            className={`w-full p-3 rounded border-2 border-blue-500 bg-transparent placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300 ${
              darkMode ? "text-white" : "text-black"
            }`}
            placeholder="Enter your idea..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex gap-3 mt-3 flex-wrap">

            <button
              onClick={generate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded font-medium ${
                darkMode
                  ? "bg-blue-600 text-white"
                  : "border border-gray-400 text-black"
              }`}
            >
              {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
            </button>

            <button
              onClick={downloadSlides}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
            >
              Download Slides 📥
            </button>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col items-center">

          <p className="text-sm opacity-70 mb-4">
            Multi-format slides ✨
          </p>

          <div className="grid grid-cols-2 gap-6">
            {slides.map((slide, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) slideRefs.current[i] = el;
                }}
                className={`${
                  format === "story"
                    ? "w-[250px] h-[400px]"
                    : "w-[300px] h-[300px]"
                } flex flex-col justify-between p-6 rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400`}
              >
                
                {/* TITLE */}
                <textarea
                  className="bg-transparent text-center font-bold text-xl outline-none resize-none leading-snug overflow-hidden"
                  rows={2}
                  value={slide.title}
                  onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[i].title = e.target.value;
                    setSlides(newSlides);
                  }}
                />

                {/* CONTENT */}
                <textarea
                  className="bg-transparent text-center text-sm outline-none resize-none leading-relaxed overflow-hidden"
                  rows={5}
                  value={slide.content}
                  onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[i].content = e.target.value;
                    setSlides(newSlides);
                  }}
                />

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
