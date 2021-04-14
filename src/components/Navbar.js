import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Navbar = () => {


    return (


        <React.Fragment>
            <ul >
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/ciudad">Ciudad</Link>
                </li>
                <li>
                    <Link to="/departamento">Departamento</Link>
                </li>
            </ul>
        </React.Fragment>


    )
}

export default withRouter(Navbar);