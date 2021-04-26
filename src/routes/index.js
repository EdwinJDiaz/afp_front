import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Documentos from '../pages/persona/Documentos'
import Departamento from '../pages/departamento/Departamento'
import Ciudad from '../pages/ciudad/Ciudad'
import App from '../pages/foto/foto'
import Grafica from '../components/Grafica'
import Login from '../pages/login/login'

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/usuarios" exact component={Documentos} />
            <Route path="/departamento" component={Departamento} />
            <Route path="/ciudad" component={Ciudad} />
            <Route path="/foto" component={App}/>
            <Route path="/grafica" component={Grafica} />
            <Route path="/" exact component={Login}/>


        </BrowserRouter>
    );
}