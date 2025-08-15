import "react-toastify/dist/ReactToastify.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/animate.css';
import '../styles/flaticon.css';
import "../styles/font-awesome.min.css";
import "../styles/themify-icons.css";
import '../styles/sass/style.scss';
import '../styles/custom-overrides.css';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/index";
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from "next/head";
import WhatsAppWidget from "../components/WhatsAppWidget/WhatsAppWidget"; // WhatsApp chat widget

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Kenya Shilajit - Natural Energy & Health Supplement</title>
        <meta name="description" content="Boost your energy and health naturally with Kenya Shilajit – a powerful mineral resin packed with fulvic acid and minerals." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
          <ToastContainer />
          <WhatsAppWidget /> {/* Global floating WhatsApp chat */}
        </PersistGate>
      </Provider>
    </div>
  );
}

export default MyApp;
