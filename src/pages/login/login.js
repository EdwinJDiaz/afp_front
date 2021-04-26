import React, { Component } from 'react';
import Swal from 'sweetalert2'


class Login extends Component {


    constructor(props) {
        super(props);



        this.state = {
            form: {
                correo: "",
                password: ""
            }
        }
    }

    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })

        console.log(this.state.form)
    }


    validar() {

        if (this.state.form.password === null || this.state.form.password === '') {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Porfavor ingrese su contraseña',
                timer: 2000,
                target: document.getElementById('Modal')

            })
            return false;
        }
        if (this.state.form.correo === null || this.state.form.correo === '') {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Porfavor ingrese su correo',
                timer: 2000,
                target: document.getElementById('Modal')

            })
            return false;
        }

        return true;
    }


    login() {

        var verificar = this.validar();

        if (verificar === true) {
            const APIULR = 'http://localhost:8080/proyecto/webapi/documento/login'
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: this.state.form.correo,
                    password: this.state.form.password
                })
            };

            fetch(APIULR, requestOptions)
                .then(response => response.status)
                .then(res => {
                    if (res === 200) {
                        return this.props.history.push('/usuarios');
                    } else if (res === 204) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'El correo no esta registrado, porfavor verifique el correo ingresado',
                            timer: 2000,
                            target: document.getElementById('Modal')

                        })
                    } else if (res === 406) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Correo o contraseña incorrectos, porfavor revise sus datos',
                            timer: 2000,
                            target: document.getElementById('Modal')

                        })
                    } else if (res === 409) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Porfavor ingrese un correo valido',
                            timer: 2000,
                            target: document.getElementById('Modal')

                        })
                    }
                })
        }





    }





    render() {
        return (
            <div className="container">

                <br></br>



                <div className="card" >
                    <div class="card-body d-flex flex-wrap justify-content-evenly" >

                        <div className="p-1 bd-highlight" style={{ textAlign: "center" }}>
                            <h1>Registro</h1>

                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus enim vitae est semper finibus sit amet ac elit.
                                Mauris varius feugiat lorem eget maximus. Aenean nisl lectus, viverra in sodales in, rutrum a sapien. Vestibulum suscipit auctor
                                lectus eget imperdiet. Pellentesque cursus, arcu id lacinia auctor, odio sapien ultricies dui, nec feugiat elit sem sed tortor.
                                Nullam sit amet arcu ante. Praesent varius, sapien quis placerat lobortis, elit eros vehicula justo, quis convallis elit est vitae
                                tellus. Vivamus sed congue turpis. Sed blandit eleifend tellus non vehicula</p>
                        </div>



                        <form className="p-2 bd-highlight">

                            <div>
                                <h1>Bienvenido</h1>
                            </div>

                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Correo Electronico</label>
                                <input type="email" class="form-control" id="exampleInputEmail1" onChange={this.handleChange} name="correo" aria-describedby="emailHelp" />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Contraseña</label>
                                <input type="password" minLength="6" class="form-control" name="password" onChange={this.handleChange} id="exampleInputPassword1" />
                            </div>

                            <button type="button" onClick={() => this.login()} class="btn btn-primary">Iniciar sesion</button>
                        </form>
                    </div>
                </div>



            </div>
        )
    }
}

export default Login;