import "react-toastify/dist/ReactToastify.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/animate.css';
import '../styles/flaticon.css';
import "../styles/font-awesome.min.css";
import "../styles/themify-icons.css";
import '../styles/sass/style.scss';
import '../styles/custom-overrides.css';
import { ToastContainer } from 'react-toastify';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from "next/head";
import { useRouter } from 'next/router';
import WhatsAppWidget from "../components/WhatsAppWidget/WhatsAppWidget"; // WhatsApp chat widget

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Admin pages handle their own chrome; skip public widgets there
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <div>
      <Head>
        {/* Viewport only — each page sets its own title/description via <Seo /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Component {...pageProps} />
      <ToastContainer />
      {!isAdmin && <WhatsAppWidget />} {/* Global floating WhatsApp chat — hidden for admin */}
    </div>
  );
}

export default MyApp;
