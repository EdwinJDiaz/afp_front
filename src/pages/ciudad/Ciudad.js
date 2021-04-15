import React from 'react';
import Navbar from '../../components/Navbar'

class CiudadContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            ciudades: [],
            ciudad: [],
            departamentos: [],
            form: {
                nombre_ciudad: "",
                id_departamento: "",
            },
        }
    }

    componentDidMount() {
        const apiURL = "http://localhost:8080/ProyectoHeinsohn/webapi/ciudad/get"
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ ciudades: data }))

    }

    remove(id) {
        console.log(id);
        const ApiURL = (`http://localhost:8080/ProyectoHeinsohn/webapi/ciudad/delete/${id}`)
        fetch(ApiURL, { method: 'DELETE' })
            .then(response => response.status)
            .then(res => {
                if (res === 200) {
                    let data = this.state.ciudades.filter(c => c.id !== id);
                    this.setState({ ciudades: data })
                    alert("Ciudad eliminada")
                }
            })
    }

    update(ciudad) {
        let lista = [ciudad]
        this.setState({ ciudad: lista })
        const apiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/departamento/get'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ departamentos: data }))
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

    verificar() {
        if (this.state.form.nombre_ciudad === null || this.state.form.nombre_ciudad === "") {
            alert("Porfavor ingrese el nombre de la ciudad")
            return false
        } else if (this.state.form.id_departamento === null || this.state.form.id_departamento === "" || this.state.form.id_departamento === "Seleccione su Departamento") {
            alert("Porfavor ingrese el nombre del departamento")
            return false;
        } else {
            return true;
        }
    }

    updateCiudad(id) {

        let verificar = this.verificar()

        if (verificar === true) {
            const apiURL = `http://localhost:8080/ProyectoHeinsohn/webapi/ciudad/update/${id}`;
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_ciudad: this.state.form.nombre_ciudad, departamentos: { id: this.state.form.id_departamento } })
            };

            fetch(apiURL, requestOptions)
                .then(response => response.status)
                .then(res => {
                    if (res === 200) {
                        this.setState({
                            form: {
                                nombre_ciudad: '',
                                id_departamento: '',
                            }, ciudad: [],
                            departamentos: [],
                        })
                        this.componentDidMount()
                        alert("Ciudad Actualizada")

                    } if (res === 409) {
                        alert("Ya existe esta ciudad registrada en el departamento")
                    } if (res === 206) {
                        alert("Porfavor asegurese de que no tiene campos vacios")
                    } if (res === 417) {
                        alert("Porfavor asegurese de que existe la ciudad")
                    } else if (res === 406) {
                        alert("Porfavor asegures de que existe el departamento")
                    }
                })
        }


    }

    register() {


        let verificar = this.verificar()

        if (verificar === true) {
            const apiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/ciudad/add'
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_ciudad: this.state.form.nombre_ciudad, departamentos: { id: this.state.form.id_departamento } })
            };
            fetch(apiURL, requestOptions)
                .then(response => response.status)
                .then(res => {
                    if (res === 200) {
                        this.setState({
                            form: {
                                nombre_ciudad: '',
                                id_departamento: '',
                            }, ciudad: [],
                            departamentos: [],
                        })
                        this.componentDidMount()
                        alert("Ciudad registrado")

                    } if (res === 409) {
                        alert("Ya existe esta ciudad registrada en el departamento")
                    } else if (res === 206) {
                        alert("Porfavor asegurese de que no tiene campos vacios")
                    } else if (res === 417) {
                        alert("Porfavor asegurese de que existe la ciudad")
                    } else if (res === 406) {
                        alert("Porfavor asegures de que existe el departamento")
                    }
                })
        }

    }


    render() {
        return (
            <div className="container">
                <Navbar />
                <div class="d-flex flex-row-reverse bd-highlight">
                    <div class="p-2 bd-highlight"><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={() => this.update(0)}>Registrar</button></div>

                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Ciudad</th>
                            <th scope="col">Departamento</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.ciudades.map(ciudad =>
                            <tr>
                                <td><div>{ciudad.nombre_ciudad}</div></td>
                                <td> <div>{ciudad.departamentos.nombre_departamento}</div></td>
                                <td>
                                    <button onClick={() => this.remove(ciudad.id)}>Eliminar</button>
                                    <button onClick={() => this.update(ciudad)} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" >Actualizar</button>


                                </td>
                            </tr>
                        )}

                    </tbody>


                </table>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Actualizar</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>

                                    <div class="mb-3">
                                        <label for="nombre_departamento" class="form-label">Ingrese el nombre de la ciudad</label>
                                        {this.state.ciudad.map(ciudad =>
                                            <input type="text" class="form-control" id="nombre_ciudad" name="nombre_ciudad" aria-describedby="emailHelp" placeholder={"Ciudad " + ciudad.nombre_ciudad} onChange={this.handleChange} ></input>
                                        )}

                                        <div className="mb-3">
                                            <label for="select-departament" class="form-label">Ingrese su Departamento</label>
                                            <select class="form-select" aria-label="Default select example" value={this.state.id_departamento} onChange={this.handleChange} name="id_departamento" id="id_departamento">
                                                <option selected >Seleccione su Departamento</option>
                                                {this.state.departamentos.map(departamento =>
                                                    <option key={departamento.id} value={departamento.id} id="id_departamento">{departamento.nombre_departamento}</option>
                                                )}

                                            </select>
                                        </div>




                                    </div>






                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={() => this.updateCiudad(this.state.ciudad[0].id)} className="btn btn-primary" >Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Actualizar</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>

                                    <div class="mb-3">
                                        <label for="nombre_departamento" class="form-label">Ingrese el nombre de la ciudad</label>

                                        <input type="text" class="form-control" id="nombre_ciudad" name="nombre_ciudad" aria-describedby="emailHelp" placeholder="Ingrese el nombre de la ciudad" onChange={this.handleChange} ></input>


                                        <div className="mb-3">
                                            <label for="select-departament" class="form-label">Ingrese su Departamento</label>
                                            <select class="form-select" aria-label="Default select example" value={this.state.id_departamento} onChange={this.handleChange} name="id_departamento" id="id_departamento">
                                                <option selected >Seleccione su Departamento</option>
                                                {this.state.departamentos.map(departamento =>
                                                    <option key={departamento.id} value={departamento.id} id="id_departamento">{departamento.nombre_departamento}</option>
                                                )}

                                            </select>
                                        </div>




                                    </div>






                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={() => this.register()} className="btn btn-primary" >Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default CiudadContainer;