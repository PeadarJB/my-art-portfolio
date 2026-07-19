import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";

export const alt = "Peadar Jolliffe-Byrne — contemporary art portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#131313",
          fontFamily: "sans-serif",
          background: "#ffffff",
          borderTop: "1px solid #131313",
          borderBottom: "1px solid #131313",
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#b74034",
          }}
        >
          Art Portfolio
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 600,
            marginTop: 24,
            lineHeight: 1.02,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          {siteName}
        </div>
        <div style={{ fontSize: 38, marginTop: 28, color: "#757575" }}>
          Selected works, 2019–2022
        </div>
      </div>
    ),
    { ...size }
  );
}
