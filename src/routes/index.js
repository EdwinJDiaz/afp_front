import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Documentos from '../pages/persona/Documentos'
import Departamento from '../pages/departamento/Departamento'
import Ciudad from '../pages/ciudad/Ciudad'

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Documentos} />
            <Route path="/departamento" component={Departamento} />
            <Route path="/ciudad" component={Ciudad} />


        </BrowserRouter>
    );
}