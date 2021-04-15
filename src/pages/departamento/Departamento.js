import React from 'react';
import Navbar from '../../components/Navbar'

class DepartamentoContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            departamentos: [],
            departamento: [],
            form: {
                nombre_departamento: "",
            }
        }

    }

    componentDidMount() {
        const apiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/departamento/get'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ departamentos: data }))
    }

    remove(id) {
        console.log(id);
        const apiURL = `http://localhost:8080/ProyectoHeinsohn/webapi/departamento/delete/${id}`;
        fetch(apiURL, { method: 'DELETE' })
            .then(response => response.status)
            .then(res => {
                if (res === 200) {
                    let data = this.state.departamentos.filter(c => c.id !== id);
                    this.setState({ departamentos: data })
                    alert("Departamento eliminado")
                }
            })
    }

    update(departamento) {
        let lista = [departamento]
        this.setState({ departamento: lista })
    }

    handleChange = async e => {

        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);

    }


    verificar() {
        if (this.state.form.nombre_departamento === null || this.state.form.nombre_departamento === "") {
            alert("Porfavor ingrese el nombre del departamento")
            return false;
        }else {
            return true;
        }
    }

    updateDepartamento(id) {

        let verificar = this.verificar();

        if (verificar === true) {
            const apiURL = `http://localhost:8080/ProyectoHeinsohn/webapi/departamento/update/${id}`;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_departamento: this.state.form.nombre_departamento })
        };

        fetch(apiURL, requestOptions)
            .then(response => response.status)
            .then(res => {
                if (res === 200) {
                    this.setState({
                        form: {
                            nombre_departamento: '',
                        }, ciudades: [],
                        departamento: [],
                    })
                    this.componentDidMount()
                    alert("Departamento Actualizado")

                }else if (res === 409) {
                    alert("Ya existe el departamento")
                }else if (res ===206){
                    alert("Porfavor ingrese el nombre del departamento")
                }else if (res ===400){
                    alert("Porfavor asegurese que existe el departamento")
                }
            })
        }



        
    }


    register() {

        let verificar = this.verificar()

        if (verificar === true){
            const apiURL = 'http://localhost:8080/ProyectoHeinsohn/webapi/departamento/add'
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_departamento: this.state.form.nombre_departamento })
            };
            fetch(apiURL, requestOptions)
                .then(response => response.status)
                .then(res => {
                    if (res === 200) {
                        this.setState({
                            form: {
                                nombre_departamento: '',
                            }, ciudades: [],
                            departamento: [],
                        })
                        this.componentDidMount()
                        alert("Departamento registrado")
    
                    }else if (res === 409) {
                        alert("Ya existe el departamento")
                    }else if (res ===206){
                        alert("Porfavor ingrese el nombre del departamento")
                    }
                })
        }

        

    }

    render() {
        return (
            <div className="container">
                <Navbar />

                <div class="d-flex flex-row-reverse bd-highlight">
                    <div class="p-2 bd-highlight"><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" >Registrar</button></div>

                </div>

                <table className="table">
                    <thead>
                        <tr>

                            <th scope="col">Departamento</th>
                            <th scope="col">Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.departamentos.map(departamento =>
                            <tr>
                                <td><div>{departamento.nombre_departamento}</div></td>

                                <td>
                                    <button onClick={() => this.remove(departamento.id)}>Eliminar</button>
                                    <button onClick={() => this.update(departamento)} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" >Actualizar</button>


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
                                        <label for="nombre_departamento" class="form-label">Ingrese el nombre del departamento</label>
                                        {this.state.departamento.map(departamento =>
                                            <input type="text" class="form-control" id="nombre_departamento" name="nombre_departamento" aria-describedby="emailHelp" placeholder={"Departamento " + departamento.nombre_departamento} onChange={this.handleChange} ></input>
                                        )}




                                    </div>






                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={() => this.updateDepartamento(this.state.departamento[0].id)} className="btn btn-primary" >Save changes</button>
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
                                <h5 className="modal-title" id="exampleModalLabel">Registro</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>

                                    <div class="mb-3">
                                        <label for="nombre_departamento" class="form-label">Ingrese el nombre del departamento</label>

                                        <input type="text" class="form-control" id="nombre_departamento" name="nombre_departamento" aria-describedby="emailHelp" placeholder="Ingrese el nombre del departamento" onChange={this.handleChange} ></input>





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

export default DepartamentoContainer;