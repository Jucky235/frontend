import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; // 1. Import Redux Provider
import { store } from "@/redux/store"; // 2. Import your central store configuration
import { router } from "@/router/router";
import { ThemeProvider } from "@/context/ThemeContext"; // 3. Import ThemeProvider
import "./index.css"; // Loads your Tailwind configurations
import "@/lib/i18n"; // Initializes your i18n translations

const setupButtonClickSound = () => {
  const AudioCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioCtor) return;

  let audioContext: AudioContext | null = null;

  const playClickSound = () => {
    if (!audioContext) {
      audioContext = new AudioCtor();
    }

    const ctx = audioContext;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const oscillatorA = ctx.createOscillator();
    const oscillatorB = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillatorA.type = "triangle";
    oscillatorA.frequency.setValueAtTime(760, now);
    oscillatorA.frequency.exponentialRampToValueAtTime(420, now + 0.08);

    oscillatorB.type = "square";
    oscillatorB.frequency.setValueAtTime(120, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    oscillatorA.connect(gain);
    oscillatorB.connect(gain);
    gain.connect(ctx.destination);

    oscillatorA.start(now);
    oscillatorB.start(now);
    oscillatorA.stop(now + 0.12);
    oscillatorB.stop(now + 0.1);
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        "button, a, input[type='button'], input[type='submit'], [role='button']",
      );

      if (!isInteractive) return;
      playClickSound();
    },
    { passive: true },
  );
};

setupButtonClickSound();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 4. Wrap with ThemeProvider so dark mode persists globally across all routes */}
    <ThemeProvider>
      <Provider store={store}>
        {/* Swapping <App /> out for the RouterProvider handles page switching */}
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
