// components/FacebookSDK.tsx
"use client";

import { useEffect } from "react";

export default function FacebookSDK() {
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) return;

    const script = document.createElement("script");

    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return null;
}
