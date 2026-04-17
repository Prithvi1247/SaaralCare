// pages/_app.js
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0a1628",
            color: "#e2e8f0",
            border: "1px solid rgba(58,189,248,0.2)",
            borderRadius: "12px",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
          success: {
            duration: 3000,
            style: {
              borderColor: "rgba(52, 211, 153, 0.3)",
              background: "linear-gradient(135deg, rgba(5,36,31,0.9) 0%, rgba(5,46,35,0.9) 100%)",
            },
            iconTheme: {
              primary: "#34d399",
              secondary: "#0a1628",
            },
          },
          error: {
            duration: 5000,
            style: {
              borderColor: "rgba(239, 68, 68, 0.3)",
              background: "linear-gradient(135deg, rgba(28,25,23,0.9) 0%, rgba(42,21,20,0.9) 100%)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0a1628",
            },
          },
          loading: {
            style: {
              borderColor: "rgba(58,189,248, 0.3)",
              background: "linear-gradient(135deg, rgba(6,11,20,0.9) 0%, rgba(10,22,32,0.9) 100%)",
            },
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
