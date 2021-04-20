import React from 'react';
import Navbar from '../../components/Navbar'
import axios from 'axios';
import MaterialTable from 'material-table';
import { Modal, TextField } from "@material-ui/core";
import { Pie } from 'react-chartjs-2'
import { useState } from 'react';




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
                fechaNacimiento: '',
                fechaRegistro: null,
                sexo: '',
                preferencia: '',
                open: false,
                close: true,

            },

            preferencias: [],

            tipoDocumento: [],
            datos: [],
            ciudadGrafica: [],
            cantidad: [],
            colores: [],
            data: [],
            opciones: [],
            archivos: [],



        }




    }





    async componentDidMount() {
        const apiURL = 'http://localhost:8080/proyecto/webapi/documento/documentos'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ documentos: data }))

        await this.peticion();
        await this.generarColores();
        this.configurarGrafica();

    }



    insertar = async () => {
        const f = new FormData();
        f.append('image', this.state.archivos)

        axios.post('http://localhost:8080/proyecto/webapi/documento/preferencias', f)
            .then(res => console.log(res))
    }



    Base64 = (e) => {

        this.extraerBase64(e[0]).then((imagen) => {
    
            this.setState({archivos: imagen.base})
        })
        

       
    }


    extraerBase64 = async (e) => new Promise((resolve, reject) => {
        try {

            const reader = new FileReader();
            reader.readAsDataURL(e);
            reader.onload = () => {
                var base64 = reader.result
                var imagen = base64.split(',')
                resolve({
                    base: imagen
                });
            };
            reader.onerror = error => {
                resolve({
                    base: null
                });
            };

        } catch (e) {
            return null;
        }
    })





    peticion = async () => {
        var datos = []
        var array = []
        var ciudades = []
        await fetch('http://localhost:8080/proyecto/webapi/documento/grafica')
            .then(response => response.json())
            .then(res => res.map((res) => datos.push({ cantidad: res[0], ciudad: res[1] })))

        this.setState({ datos: datos })



        this.state.datos.map(res => array.push(res.cantidad))
        this.state.datos.map(res => ciudades.push(res.ciudad))

        this.setState({ ciudadGrafica: ciudades, cantidad: array })

        console.log(this.state.cantidad, this.state.ciudadGrafica);

    }



    generarCaracter() {
        var caracter = ["a", "b", "c", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        var numero = (Math.random() * 15).toFixed(0)
        return caracter[numero]
    }

    colorHex() {
        var color = "";
        for (let i = 0; i < 6; i++) {
            color = color + this.generarCaracter();
        }
        return "#" + color;
    }

    generarColores() {
        var colores = [];
        for (let i = 0; i < this.state.datos.length; i++) {
            colores.push(this.colorHex());
        }
        this.setState({ colores: colores })
        console.log(this.state.colores);
    }

    configurarGrafica() {
        const data = {
            labels: this.state.ciudadGrafica,
            datasets: [{
                data: this.state.cantidad,
                backgroundColor: this.state.colores
            }]
        };
        const opciones = {
            responsive: true,
            maintainAspectRatio: false
        }
        this.setState({ data: data, opciones: opciones })
    }



    remove(id) {
        console.log(id);
        const ApiURL = (`http://localhost:8080/proyecto/webapi/documento/delete/${id}`)
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

        if (documento !== 0) {
            this.handleOpen()
        }
        let lista = [documento]
        this.setState({ persona: lista })
        const apiURL = 'http://localhost:8080/proyecto/webapi/departamento/get'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ departamentos: data }))

        this.tipoDocumento()
        this.Preferencias()
    }


    tipoDocumento() {
        const apiURL = 'http://localhost:8080/proyecto/webapi/documento/tipoDocumentos'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ tipoDocumento: data }))
    }

    Preferencias() {
        const apiURL = 'http://localhost:8080/proyecto/webapi/documento/preferencia'
        fetch(apiURL)
            .then(response => response.json())
            .then(data => this.setState({ preferencias: data }))
    }


    Ciudades(id) {
        const apiURL = `http://localhost:8080/proyecto/webapi/ciudad/get/${id}`
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

    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.form)
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
        } else if (this.state.form.fechaNacimiento === null || this.state.form.fechaNacimiento === "") {
            alert("Porfavor ingrese su fecha de nacimiento")
            return false;
        } else if (this.state.form.sexo === null || this.state.form.sexo === "") {
            alert("Porfavor ingrese su sexo")
            return false;
        } else if (this.state.form.preferencia === null || this.state.form.preferencia === "") {
            alert("Porfavor ingrese su preferencia")
            return false;
        }
        return true;

    }

    updatePerson(id) {

        let verificar = this.verificar();


        if (verificar === true) {
            console.log(id);
            const ApiURL = `http://localhost:8080/proyecto/webapi/documento/update/${id}`
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
                    fecha_nacimiento: this.state.form.fechaNacimiento,
                    fecha_registro: null,
                    sexo: this.state.form.sexo,
                    avatar: null,
                    preferenciasUsuarioVO: [{ preferenciasVO: { id: this.state.form.preferencia } }]
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
            const ApiURL = 'http://localhost:8080/proyecto/webapi/documento/add'
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
                    fecha_nacimiento: this.state.form.fechaNacimiento,
                    fecha_registro: null,
                    sexo: this.state.form.sexo,
                    avatar: null,
                    preferenciasUsuarioVO: [{ preferenciasVO: { id: this.state.form.preferencia } }]
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



                <div style={{ maxWidth: '100%' }}>
                    <MaterialTable

                        columns={[
                            { title: 'nombre', field: "nombre" },
                            { title: 'Apellidos', field: 'apellidos' },
                            { title: 'Ciudad', field: 'ciudades.nombre_ciudad' },
                            { title: 'Departamento', field: 'ciudades.departamentos.nombre_departamento' },
                            { title: 'Correo', field: 'correo' },
                            { title: 'Documento', field: 'documento' },
                            { title: "Tipo de documento", field: 'tipoDocumento.tipo_documento' },
                            { title: 'Fecha de nacimiento', field: 'fecha_nacimiento' },
                            { title: 'Fecha de registro', field: "fecha_registro" },
                            { title: 'Sexo', field: 'sexo' },
                            { title: 'preferencia', field: 'preferenciasUsuarioVO[0].preferenciasVO.nombre_preferencia' },





                        ]}
                        data={this.state.documentos}


                        title="Personas Registradas"
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




                <div className="d-flex flex-row-reverse bd-highlight">
                    <div className="p-2 bd-highlight"><button onClick={() => this.update(0)} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" >Registrar</button></div>

                </div>

                <div style={{ maxHeight: '500px' }}>
                    <h2 style={{ textAlign: "center" }}>Cantidad de personas por ciudad</h2>
                    <Pie
                        data={this.state.data} options={this.state.opciones}
                    >

                    </Pie>
                </div>



                <Modal
                    open={this.state.open}
                    close={this.state.close}
                    onClose={this.handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    style={{ overflow: 'scroll' }}>

                    <div className="modal-dialog" >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Actualizar Persona</h5>
                                <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>

                                    <div className="mb-3">
                                        <label htmlFor="documento" className="form-label">Ingrese su documento</label>
                                        {this.state.persona.map(persona =>
                                            <TextField type="text" className="form-control" id="documento" name="documento" aria-describedby="emailHelp" placeholder={"Su documento es: " + persona.documento} onChange={this.handleChange} ></TextField>
                                        )}
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


                                    </div>z

                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Ingrese su nombre</label>
                                        {this.state.persona.map(persona =>
                                            <TextField type="text" className="form-control" id="nombre" name="nombre" aria-describedby="emailHelp" placeholder={"Su nombre es: " + persona.nombre} onChange={this.handleChange} ></TextField>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="apellidos" className="form-label">Ingrese sus apellidos </label>
                                        {this.state.persona.map(persona =>
                                            <TextField type="text" className="form-control" id="apellidos" name="apellidos" aria-describedby="emailHelp" placeholder={"Sus apellidos son: " + persona.apellidos} onChange={this.handleChange} ></TextField>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Ingrese su telefono</label>
                                        {this.state.persona.map(persona =>
                                            <TextField type="text" className="form-control" id="telefono" name="telefono" aria-describedby="emailHelp" placeholder={"Su telefono es: " + persona.telefono} onChange={this.handleChange} ></TextField>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="correo" className="form-label">Ingrese su correo</label>
                                        {this.state.persona.map(persona =>
                                            <TextField type="email" className="form-control" id="correo" name="correo" aria-describedby="emailHelp" placeholder={"Su correo es: " + persona.correo} onChange={this.handleChange} ></TextField>
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
                                        <label htmlFor="correo" className="form-label">Ingrese su fecha de nacimiento</label>

                                        <TextField type="date" className="form-control" id="correo" name="fechaNacimiento" required onChange={this.handleChange} ></TextField>

                                    </div>

                                    <hr></hr>

                                    <div>
                                        <label>Porfavor ingrese su sexo</label>
                                        <br></br>
                                        <input type="radio" value="M" name="sexo" onChange={this.handleChange} /> Hombre
                                        <br></br>
                                        <input type="radio" value="F" name="sexo" onChange={this.handleChange} /> Mujer
                                        <br></br>
                                        <input type="radio" value="O" name="sexo" onChange={this.handleChange} /> Otro
                                    </div>

                                    <hr></hr>


                                    <div>
                                        <label>Porfavor introduzca su preferencia</label>
                                        <br></br>
                                        {this.state.preferencias.map((preferencias) =>
                                            <div className="radio">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value={preferencias.id}
                                                        name="preferencia"
                                                        onChange={this.handleChange}

                                                    />
                                                    {" " + preferencias.nombre_preferencia}
                                                </label>
                                            </div>
                                        )}

                                    </div>


                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={this.handleClose}>Close</button>
                                        <button type="button" onClick={() => this.updatePerson(this.state.persona[0].id)} className="btn btn-primary">Save changes</button>
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
                                        <label htmlFor="ciudad" className="form-label">Ingrese su tipo de documento</label>

                                        <select className="form-select" aria-label="Default select example" value={this.state.form.tipoDocumentos}
                                            onChange={this.handleChange} name="tipoDocumentos">
                                            <option defaultValue >Seleccione su tipo de documento</option>
                                            {this.state.tipoDocumento.map((tipo) =>
                                                <option key={tipo.id} value={tipo.id} id="tipoDocumentos">{tipo.tipo_documento}</option>

                                            )}
                                        </select>
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
                                        <label htmlFor="correo" className="form-label">Ingrese su fecha de nacimiento</label>

                                        <input type="date" className="form-control" id="correo" name="fechaNacimiento" required onChange={this.handleChange} ></input>

                                    </div>
                                    <hr></hr>

                                    <div>
                                        <input type="radio" value="M" name="sexo" onChange={this.handleChange} /> Hombre
                                        <br></br>
                                        <input type="radio" value="F" name="sexo" onChange={this.handleChange} /> Mujer
                                        <br></br>
                                        <input type="radio" value="O" name="sexo" onChange={this.handleChange} /> Otro
                                    </div>


                                    <hr></hr>




                                    {this.state.preferencias.map((preferencias) =>
                                        <div className="radio">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={preferencias.id}
                                                    name="preferencia"
                                                    onChange={this.handleChange}

                                                />
                                                {" " + preferencias.nombre_preferencia}
                                            </label>
                                        </div>
                                    )}

                                    <br></br>


                                    <div > 

                                        <input type="file" className="form-control" id="files" name="archivos" onChange={(e) => this.Base64(e.target.files)} enctype="multipart/form-data"></input>
                                        
                                        <br></br>
                                        
                                        <img src={this.state.archivos} style={{maxWidth:"250px", maxHeight:"250px"}}></img>
                                        

                                    </div>
                                    <br></br>








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




