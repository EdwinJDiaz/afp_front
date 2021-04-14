import React from 'react';
import ReactDOM from 'react-dom';
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
            },


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

    updatePerson(id) {
        console.log(id);
        const ApiURL = `http://localhost:8080/ProyectoHeinsohn/webapi/documento/update/${id}`
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documento: this.state.form.documento, ciudades: { id: this.state.form.id_ciudad } })
        };
        fetch(ApiURL, requestOptions)
            .then(response => response.status)
            .then(res => {
                if (res === 200) {
                    this.setState({
                        form: {
                            id_ciudad: '',
                            documento: '',
                        }, ciudades: [],
                        departamentos: [],
                    })
                    this.componentDidMount()
                    alert("Persona Actualizada")

                }
            })
    }

    registerPerson() {

        const ApiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/documento/add'
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documento: this.state.form.documento, ciudades: { id: this.state.form.id_ciudad } })
        };
        fetch(ApiURL, requestOptions)
            .then(response => response.status)
            .then(res => {
                if (res === 200) {
                    this.setState({
                        form: {
                            id_ciudad: '',
                            documento: '',
                        }, ciudades: [],
                        departamentos: [],
                    })
                    this.componentDidMount()
                    alert("Persona registrada")

                }
            })
    }



    render() {

        return (
            <div className="container">
                <Navbar />
                <div class="d-flex flex-row-reverse bd-highlight">
                    <div class="p-2 bd-highlight"><button onClick={() => this.update(0)} type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" >Registrar</button></div>

                </div>
                <table>
                    <thead>
                        <tr>
                            <th>documento</th>
                            <th>Ciudad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.documentos.map(documento =>
                            <tr>
                                <td><div>{documento.documento}</div></td>
                                <td> <div>{documento.ciudades.nombre_ciudad}</div></td>
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

                                    <div class="mb-3">
                                        <label for="documento" class="form-label">Ingrese su documento</label>
                                        {this.state.persona.map(persona =>
                                            <input type="text" class="form-control" id="documento" name="documento" aria-describedby="emailHelp" placeholder={"Su documento es: " + persona.documento} onChange={this.handleChange} ></input>
                                        )}
                                    </div>


                                    <div className="mb-3">
                                        <label for="select-departament" class="form-label">Ingrese su Departamento</label>
                                        <select class="form-select" aria-label="Default select example" id="select-departament">
                                            <option selected >Seleccione su Departamento</option>
                                            {this.state.departamentos.map(departamento =>
                                                <option onClick={() => this.Ciudades(departamento.id)} value={departamento.id}>{departamento.nombre_departamento}</option>
                                            )}

                                        </select>
                                    </div>

                                    <br></br>

                                    <div className="mb-3">
                                        <label for="ciudad" class="form-label">Ingrese su ciudad</label>

                                        <select class="form-select" aria-label="Default select example" value={this.state.id_ciudad}
                                            onChange={this.handleChange} name="id_ciudad">
                                            <option selected >Seleccione su ciudad</option>
                                            {this.state.ciudades.map((ciudad) =>
                                                <option key={ciudad.id} value={ciudad.id} id="id_ciudad">{ciudad.nombre_ciudad}</option>

                                            )}
                                        </select>

                                    </div>


                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={() => this.updatePerson(this.state.persona[0].id)} className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
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

                                    <div class="mb-3">
                                        <label for="documento" class="form-label">Ingrese su documento</label>

                                        <input type="text" class="form-control" id="documento" name="documento" aria-describedby="emailHelp" onChange={this.handleChange} ></input>

                                    </div>


                                    <div className="mb-3">
                                        <label for="select-departament" class="form-label">Ingrese su Departamento</label>
                                        <select class="form-select" aria-label="Default select example" id="select-departament">
                                            <option selected >Seleccione su Departamento</option>
                                            {this.state.departamentos.map(departamento =>
                                                <option onClick={() => this.Ciudades(departamento.id)} value={departamento.id}>{departamento.nombre_departamento}</option>
                                            )}

                                        </select>
                                    </div>

                                    <br></br>

                                    <div className="mb-3">
                                        <label for="ciudad" class="form-label">Ingrese su ciudad</label>

                                        <select class="form-select" aria-label="Default select example" value={this.state.id_ciudad}
                                            onChange={this.handleChange} name="id_ciudad">
                                            <option selected >Seleccione su ciudad</option>
                                            {this.state.ciudades.map((ciudad) =>
                                                <option key={ciudad.id} value={ciudad.id} id="id_ciudad">{ciudad.nombre_ciudad}</option>

                                            )}
                                        </select>

                                    </div>


                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={() => this.registerPerson()} className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
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




