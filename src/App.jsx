import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar.jsx';
import Login from './components/login.jsx';
import Inicio from './components/inicio.jsx';
import PreFormulario from './components/preFormulario.jsx';
import RegistroSuministros from './components/registroSuministros.jsx';
import AsignacionRecursos from './components/asignacionRecursos.jsx';
import BusquedaAlbergue from './components/busquedaAlbergue.jsx';
import AyudaForm from './components/ayudaForm.jsx';
import RegistrarProducto from './components/registrarProducto.jsx';
import RegistroAlbergue from './components/registroAlbergue.jsx';
import RegistroUsuario from './components/registroUsuario.jsx';
import ListaProducto from './components/listaProducto.jsx';
import ListaAlbergue from './components/listaAlbergue.jsx';
import FormularioAbastecimiento from './components/formularioAbarrotes.jsx';
import AjusteInventario from "./components/ajusteInventario";// <--- nombre correcto
import RecuperarContrasena from './components/recuperarContrasena';
import RestablecerContrasena from './components/restablecerContrasena';

import './styles/formularioFusionado.css';

const App = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/'|| location.pathname === '/recuperarContrasena'|| location.pathname === '/restablecerContrasena';

  return (
    <>
      <div className="app-container">
        {!isLogin && <Sidebar />}
        <div className="container main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio.jsx" element={<Inicio />} />
            <Route path="/preFormulario.jsx" element={<PreFormulario />} />
            <Route path="/registroSuministros.jsx" element={<RegistroSuministros />} />
            <Route path="/asignacionRecursos.jsx" element={<AsignacionRecursos />} />
            <Route path="/busquedaAlbergue.jsx" element={<BusquedaAlbergue />} />
            <Route path="/ayudaForm.jsx" element={<AyudaForm />} />
            <Route path="/registrarProducto.jsx" element={<RegistrarProducto />} />
            <Route path="/registroAlbergue.jsx" element={<RegistroAlbergue />} />
            <Route path="/registroUsuario.jsx" element={<RegistroUsuario />} />
            <Route path="/listaProducto.jsx" element={<ListaProducto />} />
            <Route path="/listaAlbergue.jsx" element={<ListaAlbergue />} />
            <Route path="/formularioAbarrotes.jsx" element={<FormularioAbastecimiento />} />
            <Route path="/ajusteInventario.jsx" element={<AjusteInventario />} />
            <Route path="/recuperarContrasena.jsx" element={<RecuperarContrasena />} />
             <Route path="/restablecerContrasena.jsx" element={<restablecerContrasena />} />
             <Route path="/restablecerContrasena" element={<RestablecerContrasena />} />
          </Routes>

        </div>
      </div>
      <footer>
        <p>© 2025 Integrador I - Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default App;
