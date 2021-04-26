/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from "reactstrap";
import MaterialTable from 'material-table';
import { Modal, TextField, CircularProgress } from "@material-ui/core";
import Swal from 'sweetalert2'


class Ciudades extends React.Component {

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
      open: false,
      close: true,
      cargado: false,
      openModal2: false,
      closeModal2: true,

    }
  }

  componentDidMount() {
    const apiURL = "http://localhost:8080/proyecto/webapi/ciudad/get"
    fetch(apiURL)
      .then(response => response.json())
      .then(data => this.setState({ ciudades: data, cargado: true }))

  }

  remove(id) {
    Swal.fire({
      title: '¿Seguro desea eliminar?',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    })
      .then((result) => {
        if (result.value === true) {
          const ApiURL = (`http://localhost:8080/proyecto/webapi/ciudad/delete/${id}`)
          fetch(ApiURL, { method: 'DELETE' })
            .then(response => response.status)
            .then(res => {
              if (res === 200) {
                let data = this.state.ciudades.filter(c => c.id !== id);
                this.setState({ ciudades: data })
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

  update(ciudad) {

    if (ciudad !== 0) {
      this.handleOpen()

      this.setState({
        form: {
          nombre_ciudad: ciudad.nombre_ciudad,
          id_departamento: ciudad.id_departamento
        }
      })
    } else {
      this.handleOpenModal2()
    }


    let lista = [ciudad]
    this.setState({ ciudad: lista })
    const apiURL = 'http://localhost:8080/proyecto/webapi/departamento/get'
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

  handleOpenModal2 = async e => {
    await this.setState({
      openModal2: true,
      closeModal2: false
    })
  }

  handleCloseModal2 = async e => {
    await this.setState({
      openModal2: false,
      closeModal2: true
    })
  }

  verificar() {
    if (this.state.form.nombre_ciudad === null || this.state.form.nombre_ciudad === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese el nombre de la ciudad',
        timer: 2000,
        target: document.getElementById('Modal')
      })

      return false
    } else if (this.state.form.id_departamento === null || this.state.form.id_departamento === "" || this.state.form.id_departamento === "Seleccione su Departamento") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese el nombre del departamento',
        timer: 2000,
        target: document.getElementById('Modal'),

      })
      return false;
    } else {
      return true;
    }
  }

  updateCiudad(id) {

    let verificar = this.verificar()

    if (verificar === true) {
      const apiURL = `http://localhost:8080/proyecto/webapi/ciudad/update/${id}`;
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_ciudad: this.state.form.nombre_ciudad, departamentos: { id: this.state.form.id_departamento } })
      };

      fetch(apiURL, requestOptions)
        .then(response => response.status)
        .then(res => {
          if (res === 200) {
            this.handleClose()
            this.setState({
              form: {
                nombre_ciudad: '',
                id_departamento: '',
              }, ciudad: [],
              departamentos: [],
            })
            this.componentDidMount()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se Actualizo correctamente',
              timer: 1000,
              target: document.getElementById('Modal')
            })

          } if (res === 409) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ya existe esta ciudad registrada en el departamento',
              timer: 2000,
              target: document.getElementById('Modal')
            })

          } if (res === 206) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor asegurese de que no tiene campos vacios',
              timer: 2000,
              target: document.getElementById('Modal')
            })

          } if (res === 417) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor asegurese de que no existe la ciudad en el departamento seleccionado',
              timer: 2000,
              target: document.getElementById('Modal')
            })

          } else if (res === 406) {

            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor asegurese de que existe el departamento',
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
      const apiURL = 'http://localhost:8080/proyecto/webapi/ciudad/add'
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
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se Registro correctamente',
              timer: 1000,
              target: document.getElementById('Modal')

            })

          } if (res === 409) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ya existe esta ciudad registrada en el departamento',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          } else if (res === 206) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor asegurese de que no tiene campos vacios',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          } else if (res === 417) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor asegurese de que existe la ciudad',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          } else if (res === 406) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor asegures de que existe el departamento',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          }
        })
    }

  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <CardTitle tag="h3">Ciudades registradas en el sistema</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ maxWidth: '100%' }}>
                    <MaterialTable

                      columns={[

                        { title: 'Departamento', field: 'departamentos.nombre_departamento' },
                        { title: 'Ciudad', field: 'nombre_ciudad' },

                      ]}
                      data={this.state.ciudades}

                      title="Ciudades"
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
                    <div class="p-2 bd-highlight"><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={() => this.update(0)}>Registrar</button></div>

                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>


          <Modal
            open={this.state.open}
            close={this.state.close}
            onClose={this.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            id="Modal"
            name="Modal">

            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Actualizar</h5>
                  <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>

                    <div class="mb-3">
                      <label for="nombre_departamento" class="form-label">Ingrese el nombre de la ciudad</label>
                      {this.state.ciudad.map(ciudad =>
                        <TextField type="text" className="form-control" defaultValue={ciudad.nombre_ciudad} id="nombre_ciudad" name="nombre_ciudad" aria-describedby="emailHelp" placeholder={"Ciudad " + ciudad.nombre_ciudad} onChange={this.handleChange} ></TextField>
                      )}

                      <div className="mb-3">
                        <label for="select-departament" class="form-label">Ingrese su Departamento</label>
                        <select class="form-select" aria-label="Default select example" value={this.state.form.id_departamento} onChange={this.handleChange} name="id_departamento" id="id_departamento">
                          <option selected >Seleccione su Departamento</option>
                          {this.state.departamentos.map(departamento =>
                            <option key={departamento.id} value={departamento.id} id="id_departamento">{departamento.nombre_departamento}</option>
                          )}

                        </select>
                      </div>




                    </div>






                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={this.handleClose}>Close</button>
                      <button type="button" onClick={() => this.updateCiudad(this.state.ciudad[0].id)} className="btn btn-primary" >Save changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </Modal>

          <Modal
            open={this.state.openModal2}
            close={this.state.closeModal2}
            onClose={this.handleCloseModal2}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            id="Modal"
            name="Modal"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Registrar</h5>
                  <button type="button" className="btn-close" onClick={this.handleCloseModal2} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>

                    <div class="mb-3">
                      <label for="nombre_departamento" class="form-label">Ingrese el nombre de la ciudad</label>

                      <TextField type="text" className="form-control" id="nombre_ciudad" name="nombre_ciudad" aria-describedby="emailHelp" placeholder="Nombre ciudad" onChange={this.handleChange} ></TextField>

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
                    <button type="button" className="btn btn-secondary" onClick={this.handleCloseModal2}>Close</button>
                      <button type="button" onClick={() => this.register()} className="btn btn-primary" >Save changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Modal>



        </div>
      </>
    )


  }
}

export default Ciudades;
