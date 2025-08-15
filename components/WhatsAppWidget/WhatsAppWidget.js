import { useEffect } from "react";

export default function WhatsAppWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="elfsight-app-2f8edd3c-c462-4ca3-8cb9-70c6592c52aa"
      data-elfsight-app-lazy
    ></div>
  );
}
