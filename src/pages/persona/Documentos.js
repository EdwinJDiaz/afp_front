import React from 'react';
import Navbar from '../../components/Navbar'



class DocumentosContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            documentos: [],
            persona: [],
            ciudades: [],
            departamentos: [],
            departamento: [],
            form: {
                documento: '',
                id_ciudad: '',
                nombre: '',
                apellidos: '',
                correo: '',
                telefono: '',
                tipoDocumentos: '',
            },

            tipoDocumento: [],


        }
    }

    componentDidMount() {
        const apiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/documento/documentos'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ documentos: data }))

    }

    remove(id) {
        console.log(id);
        const ApiURL = (`http://localhost:8080/ProyectoHeinsohn/webapi/documento/delete/${id}`)
        fetch(ApiURL, { method: 'DELETE' })
            .then(response => response.status)
            .then(res => {
                if (res === 200) {
                    let data = this.state.documentos.filter(c => c.id !== id);
                    this.setState({ documentos: data })
                    alert("Persona eliminada")
                }
            })
    }

    update(documento) {
        let lista = [documento]
        this.setState({ persona: lista })
        const apiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/departamento/get'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ departamentos: data }))

        this.tipoDocumento()
    }


    tipoDocumento() {
        const apiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/documento/tipoDocumentos'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ tipoDocumento: data }))
    }


    Ciudades(id) {
        const apiURL = `http://localhost:8080/ProyectoHeinsohn/webapi/ciudad/get/${id}`
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ ciudades: data }))
    }

    handleChange = async e => {

        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
        console.log(this.state.persona[0].id);
    }


    verificar() {

        if (this.state.form.apellidos === null || this.state.form.apellidos === "") {
            alert("Porfavor ingrese su apellido")
            return false;
        }

        else if (this.state.form.nombre === null || this.state.form.nombre === "") {
            alert("Porfavor ingrese su nombre")
            return false;
        }

        else if (this.state.form.id_ciudad === null || this.state.form.id_ciudad === "" || this.state.form.id_ciudad === "Seleccione su ciudad") {
            alert("Porfavor ingrese su ciudad")
            return false;
        }

        else if (this.state.form.telefono === null || this.state.form.telefono === "") {
            alert("Porfavor ingrese su telefono")
            return false;
        }

        else if (this.state.form.tipoDocumentos === null || this.state.form.tipoDocumentos === "" || this.state.form.tipoDocumentos === "Seleccione su tipo de documento") {
            alert("Porfavor ingrese su tipo de documento")
            return false;
        }

        return true;

    }

    updatePerson(id) {

        let verificar = this.verificar();


        if (verificar === true) {
            console.log(id);
            const ApiURL = `http://localhost:8080/ProyectoHeinsohn/webapi/documento/update/${id}`
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documento: this.state.form.documento,
                    ciudades: { id: this.state.form.id_ciudad },
                    tipoDocumento: { id: this.state.form.tipoDocumentos },
                    nombre: this.state.form.nombre,
                    apellidos: this.state.form.apellidos,
                    correo: this.state.form.correo,
                    telefono: this.state.form.telefono,
                })
            };
            fetch(ApiURL, requestOptions)
                .then(response => response.status)
                .then(res => {
                    if (res === 200) {
                        this.setState({
                            form: {
                                documento: '',
                                id_ciudad: '',
                                nombre: '',
                                apellidos: '',
                                correo: '',
                                telefono: '',
                                tipoDocumentos: '',
                            }, ciudades: [],
                            departamentos: [],
                        })
                        this.componentDidMount()
                        alert("Persona Actualizada")

                    } else if (res === 406) {
                        alert("Ingrese un correo valido")
                    } else if (res === 400) {
                        alert("Porfavor ingrese un numero de documento")
                    } else if (res === 409) {
                        alert("El usuario no existe")
                    } else if (res === 417) {
                        alert("El correo o el documento estan registrados, porfavor revise los datos")
                    } else if (res === 404) {
                        alert("El correo o el documento estan registrados, porfavor revise los datos")
                    }
                })
        }


    }

    registerPerson() {


        let verificar = this.verificar();


        if (verificar) {
            const ApiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/documento/add'
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documento: this.state.form.documento,
                    ciudades: { id: this.state.form.id_ciudad },
                    tipoDocumento: { id: this.state.form.tipoDocumentos },
                    nombre: this.state.form.nombre,
                    apellidos: this.state.form.apellidos,
                    correo: this.state.form.correo,
                    telefono: this.state.form.telefono,
                })
            };
            fetch(ApiURL, requestOptions)
                .then(response => response.status)
                .then(res => {
                    if (res === 200) {
                        this.setState({
                            form: {
                                documento: '',
                                id_ciudad: '',
                                nombre: '',
                                apellidos: '',
                                correo: '',
                                telefono: '',
                                tipoDocumentos: '',
                            }, ciudades: [],
                            departamentos: [],
                        })
                        this.componentDidMount()
                        alert("Persona registrada")

                    } else if (res === 406) {
                        alert("Ingrese un correo valido")
                    } else if (res === 400) {
                        alert("Porfavor ingrese un numero de documento")
                    } else if (res === 409) {
                        alert("El correo o el documento estan registrados, porfavor revise los datos")
                    } else if (res === 206) {
                        alert("Porfavor revise que no hayan campos vacios")
                    }
                })

        }


    }





    render() {

        return (
            <div className="container">
                <Navbar />
                <div className="d-flex flex-row-reverse bd-highlight">
                    <div className="p-2 bd-highlight"><button onClick={() => this.update(0)} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" >Registrar</button></div>

                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">documento</th>
                            <th scope="col">Ciudad</th>
                            <th scope="col">Nombres</th>
                            <th scope="col">Apellidos</th>
                            <th scope="col">Telefono</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Tipo documento</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.documentos.map(documento =>
                            <tr>
                                <td><div>{documento.documento}</div></td>
                                <td><div >{documento.ciudades && documento.ciudades.nombre_ciudad}</div></td>
                                <td><div>{documento.nombre}</div></td>
                                <td><div>{documento.apellidos}</div></td>
                                <td><div>{documento.telefono}</div></td>
                                <td><div>{documento.correo}</div></td>
                                <td><div>{documento.tipoDocumento && documento.tipoDocumento.tipo_documento}</div></td>
                                <td>
                                    <button onClick={() => this.remove(documento.id)}>Eliminar</button>
                                    <button onClick={() => this.update(documento)} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" >Actualizar</button>


                                </td>
                            </tr>
                        )}

                    </tbody>


                </table>


                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>

                                    <div className="mb-3">
                                        <label htmlFor="documento" className="form-label">Ingrese su documento</label>
                                        {this.state.persona.map(persona =>
                                            <input type="text" className="form-control" id="documento" name="documento" aria-describedby="emailHelp" placeholder={"Su documento es: " + persona.documento} onChange={this.handleChange} ></input>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Ingrese su nombre</label>
                                        {this.state.persona.map(persona =>
                                            <input type="text" className="form-control" id="nombre" name="nombre" aria-describedby="emailHelp" placeholder={"Su nombre es: " + persona.nombre} onChange={this.handleChange} ></input>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="apellidos" className="form-label">Ingrese sus apellidos </label>
                                        {this.state.persona.map(persona =>
                                            <input type="text" className="form-control" id="apellidos" name="apellidos" aria-describedby="emailHelp" placeholder={"Sus apellidos son: " + persona.apellidos} onChange={this.handleChange} ></input>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Ingrese su telefono</label>
                                        {this.state.persona.map(persona =>
                                            <input type="text" className="form-control" id="telefono" name="telefono" aria-describedby="emailHelp" placeholder={"Su telefono es: " + persona.telefono} onChange={this.handleChange} ></input>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="correo" className="form-label">Ingrese su correo</label>
                                        {this.state.persona.map(persona =>
                                            <input type="email" className="form-control" id="correo" name="correo" aria-describedby="emailHelp" placeholder={"Su correo es: " + persona.correo} onChange={this.handleChange} ></input>
                                        )}
                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="select-departament" className="form-label">Ingrese su Departamento</label>
                                        <select className="form-select" aria-label="Default select example" id="select-departament">
                                            <option defaultValue >Seleccione su Departamento</option>
                                            {this.state.departamentos.map(departamento =>
                                                <option onClick={() => this.Ciudades(departamento.id)} value={departamento.id}>{departamento.nombre_departamento}</option>
                                            )}

                                        </select>
                                    </div>

                                    <br></br>

                                    <div className="mb-3">
                                        <label htmlFor="ciudad" className="form-label">Ingrese su ciudad</label>

                                        <select className="form-select" aria-label="Default select example" value={this.state.id_ciudad}
                                            onChange={this.handleChange} name="id_ciudad">
                                            <option defaultValue >Seleccione su ciudad</option>
                                            {this.state.ciudades.map((ciudad) =>
                                                <option key={ciudad.id} value={ciudad.id} id="id_ciudad">{ciudad.nombre_ciudad}</option>

                                            )}
                                        </select>



                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="ciudad" className="form-label">Ingrese su tipo de documento</label>

                                        <select className="form-select" aria-label="Default select example" value={this.state.form.tipoDocumentos}
                                            onChange={this.handleChange} name="tipoDocumentos">
                                            <option defaultValue >Seleccione su tipo de documento</option>
                                            {this.state.tipoDocumento.map((tipo) =>
                                                <option key={tipo.id} value={tipo.id} id="tipoDocumentos">{tipo.tipo_documento}</option>

                                            )}
                                        </select>



                                    </div>


                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={() => this.updatePerson(this.state.persona[0].id)} className="btn btn-primary">Save changes</button>
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
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>

                                    <div className="mb-3">
                                        <label htmlFor="documento" className="form-label">Ingrese su documento</label>

                                        <input type="text" className="form-control" id="documento" name="documento" aria-describedby="emailHelp" required onChange={this.handleChange} ></input>

                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Ingrese su nombre</label>

                                        <input type="text" className="form-control" id="nombre" name="nombre" aria-describedby="emailHelp" onChange={this.handleChange} ></input>

                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="apellidos" className="form-label">Ingrese sus apellidos </label>

                                        <input type="text" className="form-control" id="apellidos" name="apellidos" aria-describedby="emailHelp" onChange={this.handleChange} ></input>

                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Ingrese su telefono</label>

                                        <input type="text" className="form-control" id="telefono" name="telefono" aria-describedby="emailHelp" onChange={this.handleChange} ></input>

                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="correo" className="form-label">Ingrese su correo</label>

                                        <input type="email" className="form-control" id="correo" name="correo" aria-describedby="emailHelp" required onChange={this.handleChange} ></input>

                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="select-departament" className="form-label">Ingrese su Departamento</label>
                                        <select className="form-select" aria-label="Default select example" id="select-departament">
                                            <option defaultValue >Seleccione su Departamento</option>
                                            {this.state.departamentos.map(departamento =>
                                                <option onClick={() => this.Ciudades(departamento.id)} value={departamento.id}>{departamento.nombre_departamento}</option>
                                            )}

                                        </select>
                                    </div>

                                    <br></br>

                                    <div className="mb-3">
                                        <label htmlFor="ciudad" className="form-label">Ingrese su ciudad</label>

                                        <select className="form-select" aria-label="Default select example" value={this.state.id_ciudad}
                                            onChange={this.handleChange} name="id_ciudad">
                                            <option defaultValue >Seleccione su ciudad</option>
                                            {this.state.ciudades.map((ciudad) =>
                                                <option key={ciudad.id} value={ciudad.id} id="id_ciudad">{ciudad.nombre_ciudad}</option>

                                            )}
                                        </select>

                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="ciudad" className="form-label">Ingrese su tipo de documento</label>

                                        <select className="form-select" aria-label="Default select example" value={this.state.form.tipoDocumentos}
                                            onChange={this.handleChange} name="tipoDocumentos">
                                            <option defaultValue >Seleccione su tipo de documento</option>
                                            {this.state.tipoDocumento.map((tipo) =>
                                                <option key={tipo.id} value={tipo.id} id="tipoDocumentos">{tipo.tipo_documento}</option>

                                            )}
                                        </select>



                                    </div> class


                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={() => this.registerPerson()} className="btn btn-primary">Save changes</button>
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










export default DocumentosContainer;




