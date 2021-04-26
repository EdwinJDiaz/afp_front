import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Navbar = () => {


    return (


        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <React.Fragment>
                            <ul className="navbar-nav">

                                <li className="nav-item">
                                    <Link className="nav-link" to="/usuarios">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/ciudad">Ciudad</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/departamento">Departamento</Link>
                                </li>

                            </ul>
                        </React.Fragment>
                    </div>
                </div>
            </nav>



        </div>


    )
}

export default withRouter(Navbar);