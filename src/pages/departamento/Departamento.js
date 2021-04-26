import React, { forwardRef } from 'react';
import Navbar from '../../components/Navbar';
import MaterialTable from 'material-table';
import { Modal, TextField, CircularProgress } from "@material-ui/core";
import Swal from 'sweetalert2'





class DepartamentoContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            departamentos: [],
            departamento: [],
            form: {
                nombre_departamento: "",
            },
            open: false,
            close: true,
            cargado: false,
        }




    }




    componentDidMount() {
        const apiURL = 'http://localhost:8080/proyecto/webapi/departamento/get'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ departamentos: data, cargado: true }))
    }

    remove(id) {

        Swal.fire({
            title: '¿Seguro desea eliminar?',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const apiURL = `http://localhost:8080/proyecto/webapi/departamento/delete/${id}`;
                    fetch(apiURL, { method: 'DELETE' })
                        .then(response => response.status)
                        .then(res => {
                            if (res === 200) {
                                let data = this.state.departamentos.filter(c => c.id !== id);
                                this.setState({ departamentos: data })
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Se elimino correctamente',
                                    timer: 1000
                                })
                            }
                        })
                }
            })





    }

    update(departamento) {
        this.handleOpen()
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

    handleOpen = async e => {
        await this.setState({
            open: true,
            close: false
        })
    }

    handleClose = async e => {
        await this.setState({
            open: false,
            close: true
        })
    }


    verificar() {
        if (this.state.form.nombre_departamento === null || this.state.form.nombre_departamento === "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Porfavor ingrese el nombre del departamento',
                timer: 2000,
                target: document.getElementById('Modal')

            })
            return false;
        } else {
            return true;
        }
    }

    updateDepartamento(id) {

        let verificar = this.verificar();


        if (verificar === true) {
            const apiURL = `http://localhost:8080/proyecto/webapi/departamento/update/${id}`;
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_departamento: this.state.form.nombre_departamento })
            };

            fetch(apiURL, requestOptions)
                .then(response => response.status)
                .then(res => {
                    if (res === 200) {
                        this.handleClose()
                        this.setState({
                            form: {
                                nombre_departamento: '',
                            }, ciudades: [],
                            departamento: [],
                        })
                        this.componentDidMount()
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Se Actualizo correctamente',
                            timer: 1000,
                            target: document.getElementById('Modal')

                        })

                    } else if (res === 409) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Ya existe el departamento',
                            timer: 2000,
                            target: document.getElementById('Modal')

                        })
                    } else if (res === 206) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Porfavor ingrese el nombre del departamento',
                            timer: 2000,
                            target: document.getElementById('Modal')

                        })
                    } else if (res === 400) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Porfavor asegurese que existe el departamento',
                            timer: 2000,
                            target: document.getElementById('Modal')

                        })
                    }
                })
        }




    }





    register() {

        let verificar = this.verificar()

        if (verificar === true) {
            const apiURL = 'http://localhost:8080/proyecto/webapi/departamento/add'
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
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Se Registro correctamente',
                            timer: 1000
                        })

                    } else if (res === 409) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Ya existe el departamento',
                            timer: 2000
                        })
                    } else if (res === 206) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Porfavor ingrese el nombre del departamento',
                            timer: 2000
                        })
                    }
                })
        }




    }





    render() {



        return (
            <div className="container">
                <Navbar />


                <hr></hr>

                <br></br>

                {!this.state.cargado &&

                    <div className="d-flex justify-content-center">
                        <CircularProgress color="secondary" />
                    </div>
                }


                {this.state.cargado &&
                    <div>


                        <div style={{ maxWidth: '100%' }}>
                            <MaterialTable

                                columns={[
                                    { title: 'Departamento', field: 'nombre_departamento' },

                                ]}
                                data={this.state.departamentos}
                                title="Demo Title"

                                title="Departamento"
                                actions={[
                                    {
                                        icon: 'delete',
                                        tooltip: 'Eliminar',
                                        onClick: (event, rowdata) => this.remove(rowdata.id)
                                    },
                                    {
                                        icon: 'edit',
                                        tooltip: 'Editar',
                                        onClick: (event, rowdata) => this.update(rowdata)
                                    }
                                ]}

                                options={{
                                    actionsColumnIndex: -1
                                }}
                            />
                        </div>



                        <div class="d-flex flex-row-reverse bd-highlight">
                            <div class="p-2 bd-highlight"><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" >Registrar</button></div>

                        </div>





                        <Modal
                            open={this.state.open}
                            close={this.state.close}
                            onClose={this.handleClose}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            id="Modal"
                            name="Modal"
                        >


                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Actualizar</h5>
                                        <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>

                                    </div>
                                    <div className="modal-body">
                                        <form>

                                            <div class="mb-3">
                                                <label for="nombre_departamento" class="form-label">Ingrese el nombre del departamento</label>
                                                {this.state.departamento.map(departamento =>
                                                    <TextField className="form-control" id="nombre_departamento" name="nombre_departamento" aria-describedby="emailHelp" placeholder={"Departamento " + departamento.nombre_departamento} onChange={this.handleChange} ></TextField>
                                                )}




                                            </div>






                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={this.handleClose}>Close</button>
                                                <button type="button" onClick={() => this.updateDepartamento(this.state.departamento[0].id)} className="btn btn-primary" >Save changes</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </Modal>


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
                    </div>}
            </div>
        )
    }

}

export default DepartamentoContainer;