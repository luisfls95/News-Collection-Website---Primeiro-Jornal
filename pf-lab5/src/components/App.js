import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoticiasGuardadas from "./NoticiasGuardadas";
import ProtectedRoutes from "./ProtectedRoutes";
import NavBar from "./NavBar";
import Ultimas from "./Ultimas";
import Noticia from "./Noticia";
import NoMatch from "./NoMatch";
import Inicio from "./Inicio";
import OMeuFeed from "./OMeuFeed";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<ProtectedRoutes />}>
            <Route element={<NavBar />}>
              <Route index element={<Inicio />} />
              <Route path='ultimas' element={<Ultimas />} />
              <Route path='omeufeed' element={<OMeuFeed />} />
              <Route path='noticia/:fonte/:ano/:mes/:dia/:id' element={<Noticia />} />
              <Route path='guardadas' element={<NoticiasGuardadas />} />
              <Route path='*' element={<NoMatch />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
