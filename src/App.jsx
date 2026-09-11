import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Threats from "./pages/Threats.jsx";
import Lab from "./pages/Lab.jsx";
import Lgpd from "./pages/Lgpd.jsx";
import SecureDev from "./pages/SecureDev.jsx";
import Tools from "./pages/Tools.jsx";
import References from "./pages/References.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="ameacas" element={<Threats />} />
        <Route path="laboratorio" element={<Lab />} />
        <Route path="lgpd" element={<Lgpd />} />
        <Route path="dev-seguro" element={<SecureDev />} />
        <Route path="ferramentas" element={<Tools />} />
        <Route path="referencias" element={<References />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
