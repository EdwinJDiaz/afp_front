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
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";
import { CSVLink, CSVDownload } from "react-csv";
import Swal from 'sweetalert2'
import { Modal, TextField, CircularProgress } from "@material-ui/core";
import axios from 'axios';
import MaterialTable from 'material-table';


// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";

class Dashboard extends React.Component {

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
        openModal2: false,
        closeModal2: true,
        password: "",
        passwordConnfirmar: "",


      },


      formFecha: {
        fecha1: "",
        fecha2: "",
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
      reporteFechas: [],

      cargado: false,


    }

    this.csvLinkEl = React.createRef();

  }


  async componentDidMount() {
    const apiURL = 'http://localhost:8080/proyecto/webapi/documento/documentos'
    await fetch(apiURL)
      .then(response => response.json())
      .then(data => this.setState({ documentos: data, cargado: true }))

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

    var extensionesValidas = ".png, .gif, .jpeg, .jpg";

    var nombre = e[0].name;

    var extension = nombre.substring(nombre.lastIndexOf('.') + 1).toLowerCase();

    var extensionValida = extensionesValidas.indexOf(extension);

    if (extensionValida < 0) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese un formato valido: .png, .gif, .jpeg o .jpg',
        timer: 2000,
        target: document.getElementById('Modal')

      })

      this.setState({ archivos: null })
      return false;
    } else {

      this.extraerBase64(e[0]).then((imagen) => {

        this.setState({ archivos: imagen.base })
      })

      return true;
    }



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



  async remove(id) {

    Swal.fire({
      title: '¿Seguro desea eliminar?',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      cancelButtonText: `Cancelar`,
    })
      .then((result) => {
        if (result.value === true) {
          const ApiURL = (`http://localhost:8080/proyecto/webapi/documento/delete/${id}`)
          fetch(ApiURL, { method: 'DELETE' })
            .then(response => response.status)
            .then(res => {
              if (res === 200) {
                this.componentDidMount()
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




  async update(documento) {

    if (documento !== 0) {

      this.setState({
        form: {
          documento: documento.documento,
          id_ciudad: documento.ciudades.id,
          nombre: documento.nombre,
          apellidos: documento.apellidos,
          correo: documento.correo,
          telefono: documento.telefono,
          tipoDocumentos: documento.tipoDocumento.id,
          fechaNacimiento: documento.fecha_nacimiento,
          sexo: documento.sexo,
          preferencia: documento.preferenciasUsuarioVO[0].preferenciasVO.id,
          password: "",
          passwordConnfirmar: "",
        }
      })



      this.handleOpen()
    } else {
      this.handleOpenModal2()
    }

    console.log(this.state.form);
    let lista = [documento]
    this.setState({ persona: lista })
    const apiURL = 'http://localhost:8080/proyecto/webapi/departamento/get'
    await fetch(apiURL)
      .then(response => response.json())
      .then(data => this.setState({ departamentos: data }))

    this.tipoDocumento()
    this.Preferencias()
  }


  async tipoDocumento() {
    const apiURL = 'http://localhost:8080/proyecto/webapi/documento/tipoDocumentos'
    await fetch(apiURL)
      .then(response => response.json())
      .then(data => this.setState({ tipoDocumento: data }))
  }

  async Preferencias() {
    const apiURL = 'http://localhost:8080/proyecto/webapi/documento/preferencia'
    await fetch(apiURL)
      .then(response => response.json())
      .then(data => this.setState({ preferencias: data }))
  }


  async Ciudades(id) {
    const apiURL = `http://localhost:8080/proyecto/webapi/ciudad/get/${id}`
    await fetch(apiURL)
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


  handleFecha = async e => {
    await this.setState({
      formFecha: {
        ...this.state.formFecha,
        [e.target.name]: e.target.value
      }
    })

    console.log(this.state.formFecha)
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

  handleClose = async e => {
    await this.setState({
      open: false,
      close: true
    })
  }


  verificar() {


    if (this.state.form.nombre === null || this.state.form.nombre === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su nombre',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }

    else if (this.state.form.apellidos === null || this.state.form.apellidos === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su apellido',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }
    else if (this.state.form.tipoDocumentos === null || this.state.form.tipoDocumentos === "" || this.state.form.tipoDocumentos === "Seleccione su tipo de documento") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su tipo de documento',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }
    else if (this.state.form.password === null || this.state.form.password === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su contraseña',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }
    else if (this.state.form.password.length < 6) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese una contraseña valida: minimo 6 caracteres',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }
    else if (this.state.form.passwordConnfirmar === null || this.state.form.passwordConnfirmar === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor confirme su contraseña',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;

    }
    else if (this.state.form.passwordConnfirmar.length < 6) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese una contraseña valida: minimo 6 caracteres',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;

    }
    else if (this.state.form.documento.length < 6 || this.state.form.documento.length > 20) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese un numero de documento valido: minimo 6 caracteres, maximo 20 caracteres',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;

    }
    else if (this.state.form.passwordConnfirmar !== this.state.form.password) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'La contraseña y la confirmacion no coinciden, porfavor revise',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }

    else if (this.state.form.telefono === null || this.state.form.telefono === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su numero de telefono',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }

    else if (this.state.form.telefono.length < 7 || this.state.form.telefono.length > 10) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese un numero de telefono valido: minimo 7 caracteres, maximo 10 caracteres',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;

    }

    else if (this.state.form.id_ciudad === null || this.state.form.id_ciudad === "" || this.state.form.id_ciudad === "Seleccione su ciudad") {

      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su ciudad',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }



    else if (this.state.form.fechaNacimiento === null || this.state.form.fechaNacimiento === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su fecha de nacimiento',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    } else if (this.state.form.sexo === null || this.state.form.sexo === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su sexo',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    } else if (this.state.form.preferencia === null || this.state.form.preferencia === "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Porfavor ingrese su preferencia',
        timer: 2000,
        target: document.getElementById('Modal')

      })
      return false;
    }
    return true;

  }

  async updatePerson(id) {

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
          preferenciasUsuarioVO: [{ preferenciasVO: { id: this.state.form.preferencia } }],
          password: this.state.form.password,
        })
      };
      await fetch(ApiURL, requestOptions)
        .then(response => response.status)
        .then(res => {
          if (res === 200) {
            this.registerPicture()
            this.setState({
              form: {
                documento: '',
                id_ciudad: '',
                nombre: '',
                apellidos: '',
                correo: '',
                telefono: '',
                tipoDocumentos: '',
                fechaNacimiento: '',
                sexo: '',
                preferencia: '',
                password: "",
                passwordConnfirmar: "",
              }, ciudades: [],
              departamentos: [],
              close: true
            })
            this.componentDidMount()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se Actualizo correctamente',
              timer: 1000,
              target: document.getElementById('Modal')

            })

          } else if (res === 406) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ingrese un correo valido',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          } else if (res === 400) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor ingrese un numero de documento valido',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          } else if (res === 409) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'El usuario no existe',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          } else if (res === 417) {
            alert("El documento esta registrado, porfavor revise los datos")
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'El documento esta registrado, porfavor revise los datos',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          } else if (res === 404) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'El correo esta registrado, porfavor revise los datos',
              timer: 2000,
              target: document.getElementById('Modal')

            })

          }
          else if (res === 404) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor revise que no hayan campos vacion',
              timer: 2000,
              target: document.getElementById('Modal')

            })
          }
        })
    }


  }



  async registerPerson() {




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
          preferenciasUsuarioVO: [{ preferenciasVO: { id: this.state.form.preferencia } }],
          password: this.state.form.password,
        })
      };

      console.log(this.state.archivos);
      await fetch(ApiURL, requestOptions)
        .then(response => response.status)
        .then(res => {
          if (res === 200) {
            this.registerPicture()
            this.setState({
              form: {
                documento: '',
                id_ciudad: '',
                nombre: '',
                apellidos: '',
                correo: '',
                telefono: '',
                tipoDocumentos: '',
                fechaNacimiento: '',
                sexo: '',
                preferencia: '',
                password: "",
                passwordConnfirmar: "",
              }, ciudades: [],
              departamentos: [],
            })
            this.componentDidMount()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se Registro correctamente',
              timer: 1000
            })

          } else if (res === 406) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ingrese un correo valido',
              timer: 2000
            })
          } else if (res === 400) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor ingrese un numero de documento',
              timer: 2000
            })
          } else if (res === 409) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'El documento esta registrado, porfavor revise los datos',
              timer: 2000
            })
          } else if (res === 206) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'El correo esta registrado, porfavor revise los datos',
              timer: 2000
            })
          } else if (res === 206) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Porfavor revise que no hayan campos vacios',
              timer: 2000
            })
          }
        })

    }


  }


  registerPicture() {
    const f = new FormData();
    f.append('image', this.state.archivos)

    axios.post(`http://localhost:8080/proyecto/webapi/documento/imagen/${this.state.form.documento}`, f)
      .then(res => {
        if (res === 200) {
          this.setState({
            archivos: []
          })
          this.componentDidMount()
        }
      })
  }


  generarReporte = () => {
    const apiURL = 'http://localhost:8080/proyecto/webapi/documento/fechas/' + this.state.formFecha.fecha1 + '/' + this.state.formFecha.fecha2;
    return fetch(apiURL)
      .then(response => response.json())

  }


  descargarReporte = async () => {

    var verificar = this.verificarFecha()

    if (verificar === true) {
      try {

        const data = await this.generarReporte();

        this.setState({ reporteFechas: data }, () => {

          setTimeout(() => {
            this.csvLinkEl.current.link.click();
          });
        })

      } catch (error) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'No hay usuarios registrados en el intervalo de fechas seleccionado',
          timer: 2000

        })
      }
    }




  }

  verificarFecha() {
    if (this.state.formFecha.fecha1 === null || this.state.formFecha.fecha1 === "") {
      alert("Porfavor ingrese la primer fecha")
      return false;
    } else if (this.state.formFecha.fecha2 === null || this.state.formFecha.fecha2 === "") {
      alert("Porfavor ingrese la segunda fecha")
      return false;
    } else {
      return true;
    }
  }


  render() {
    return (
      <>

        {!this.state.cargado &&
          <div className="content">
            <div className="d-flex justify-content-center">
              <CircularProgress color="secondary" />
            </div>
          </div>
        }

        {this.state.cargado &&
        <div className="content">

          <h3>Reporte por fechas</h3>

          <div className="d-flex flex-row bd-highlight mb-3">
            <input className="p-2 bd-highlight form-control" onChange={this.handleFecha} max={this.state.formFecha.fecha2} type="date" name="fecha1" style={{ maxWidth: "140px" }}></input>

            {this.state.formFecha.fecha1 &&
              <input className="p-2 bd-highlight form-control" onChange={this.handleFecha} min={this.state.formFecha.fecha1} type="date" name="fecha2" style={{ maxWidth: "140px" }}></input>}

            <div className="p-2 bd-highlight"></div>


            <button type="button" onClick={this.descargarReporte} className="p-2 bd-highlight btn btn-success">Generar reporte</button>

            <CSVLink
              headers={[
                { label: "ID", key: "id" },
                { label: "Nombre", key: "nombre" },
                { label: "Apellidos", key: "apellidos" },
                { label: "Tipo de documento", key: "tipoDocumento.tipo_documento" },
                { label: "Documento", key: "documento" },
                { label: "Sexo", key: "sexo" },
                { label: "Preferencia", key: "preferenciasUsuarioVO[0].preferenciasVO.nombre_preferencia" },
                { label: "Correo", key: "correo" },
                { label: "Departamento", key: "ciudades.departamentos.nombre_departamento" },
                { label: "Ciudad", key: "ciudades.nombre_ciudad" },
                { label: "Fecha de nacimiento", key: "fecha_nacimiento" },
                { label: "Fecha de registro", key: "fecha_registro" }
              ]}
              data={this.state.reporteFechas}
              separator={";"}
              filename="Reporte_registros_fechas.csv"
              ref={this.csvLinkEl}>

            </CSVLink>

          </div>
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">

                      <CardTitle tag="h3">Usuarios registrados en el sistema</CardTitle>
                    </Col>
                    <Col sm="6">

                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ maxWidth: '100%', backgroundColor: "#031729" }}>
                    <MaterialTable

                      columns={[
                        { title: 'Nombre', field: "nombre" },
                        { title: 'Apellidos', field: 'apellidos' },
                        { title: 'Avatar', field: 'avatar', render: item => <img src={item.avatar} alt="" border="3" height="80" width="80" /> },
                        { title: "Tipo de documento", field: 'tipoDocumento.tipo_documento' },
                        { title: 'Documento', field: 'documento' },
                        { title: 'Sexo', field: 'sexo' },
                        { title: 'Preferencia', field: 'preferenciasUsuarioVO[0].preferenciasVO.nombre_preferencia' },
                        { title: 'Correo', field: 'correo' },
                        { title: 'Departamento', field: 'ciudades.departamentos.nombre_departamento' },
                        { title: 'Ciudad', field: 'ciudades.nombre_ciudad' },
                        { title: 'Fecha de nacimiento', field: 'fecha_nacimiento' },
                        { title: 'Fecha de registro', field: "fecha_registro" },





                      ]}
                      data={this.state.documentos}
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
                        actionsColumnIndex: -1,
                        headerStyle: {
                          backgroundColor: '#062744',
                          color: '#FFF'
                        },

                        rowStyle: {
                          backgroundColor: '#EEE',
                          color: "#17212a"
                        },



                      }}
                    />

                    <div className="d-flex flex-row-reverse bd-highlight">
                      <div className="p-2 bd-highlight"><button onClick={() => this.update(0)} type="button" className="btn btn-success"  >Registrar</button></div>
                    </div>
                  </div>

                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h3">Cantidad de personas por ciudad</CardTitle>
                </CardHeader>
                <CardBody>

                  <div style={{ maxHeight: '100%', maxWidth: '100%' }}>

                    <Pie
                      data={this.state.data} options={this.state.opciones}
                    >

                    </Pie>
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
            style={{ overflow: 'scroll' }}
            id="Modal"
            name="Modal"
          >

            <div className="modal-dialog" >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Actualizar Persona</h5>
                  <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>

                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      {this.state.persona.map(persona =>
                        <TextField type="text" className="form-control" id="nombre" name="nombre" aria-describedby="emailHelp" defaultValue={persona.nombre} placeholder={"Su nombre es: " + persona.nombre} required onChange={this.handleChange}></TextField>
                      )}
                    </div>


                    <div className="mb-3">
                      <label htmlFor="apellidos" className="form-label">Apellidos </label>
                      {this.state.persona.map(persona =>
                        <TextField type="text" className="form-control" id="apellidos" name="apellidos" aria-describedby="emailHelp" defaultValue={persona.apellidos} placeholder={"Sus apellidos son: " + persona.apellidos} required onChange={this.handleChange} ></TextField>
                      )}
                    </div>




                    <div className="mb-3">
                      <label htmlFor="ciudad" className="form-label">Tipo de documento</label>

                      <select className="form-select" aria-label="Default select example" value={this.state.form.tipoDocumentos}
                        onChange={this.handleChange} name="tipoDocumentos">
                        <option defaultValue >Seleccione su tipo de documento</option>
                        {this.state.tipoDocumento.map((tipo) =>
                          <option key={tipo.id} value={tipo.id} id="tipoDocumentos">{tipo.tipo_documento}</option>

                        )}
                      </select>


                    </div>

                    <div className="mb-3">
                      <label htmlFor="documento" className="form-label">Documento</label>
                      {this.state.persona.map(persona =>
                        <TextField type="text" className="form-control" inputProps={{ minLength: "6", maxLength: "20" }} id="documento" name="documento" aria-describedby="emailHelp" defaultValue={persona.documento} placeholder={"Su documento es: " + persona.documento} onChange={this.handleChange} ></TextField>
                      )}
                    </div>







                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Telefono</label>
                      {this.state.persona.map(persona =>
                        <TextField type="text" className="form-control" inputProps={{ minLength: "7", maxLength: "10" }} id="telefono" name="telefono" aria-describedby="emailHelp" defaultValue={persona.telefono} placeholder={"Su telefono es: " + persona.telefono} onChange={this.handleChange} ></TextField>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">Correo</label>
                      {this.state.persona.map(persona =>
                        <TextField type="email" className="form-control" id="correo" name="correo" aria-describedby="emailHelp" defaultValue={persona.correo} placeholder={"Su correo es: " + persona.correo} required onChange={this.handleChange} ></TextField>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="pass" className="form-label">Contraseña </label>

                      <TextField type="password" className="form-control" inputProps={{ minLength: "6" }} id="pass" name="password" aria-describedby="emailHelp" onChange={this.handleChange} ></TextField>

                    </div>


                    <div className="mb-3">
                      <label htmlFor="passConfirmar" className="form-label">Confirmar contraseña </label>

                      <TextField type="password" className="form-control" inputProps={{ minLength: "6" }} id="passConfirmar" name="passwordConnfirmar" aria-describedby="emailHelp" onChange={this.handleChange} ></TextField>

                    </div>


                    <div className="mb-3">
                      <label htmlFor="select-departament" className="form-label">Departamento</label>
                      <select className="form-select" aria-label="Default select example" id="select-departament">
                        <option defaultValue >Seleccione su Departamento</option>
                        {this.state.departamentos.map(departamento =>
                          <option onClick={() => this.Ciudades(departamento.id)} value={departamento.id}>{departamento.nombre_departamento}</option>
                        )}

                      </select>
                    </div>

                    <br></br>

                    <div className="mb-3">
                      <label htmlFor="ciudad" className="form-label">Ciudad</label>

                      <select className="form-select" aria-label="Default select example" value={this.state.id_ciudad}
                        onChange={this.handleChange} name="id_ciudad">
                        <option defaultValue >Seleccione su ciudad</option>
                        {this.state.ciudades.map((ciudad) =>
                          <option key={ciudad.id} value={ciudad.id} id="id_ciudad">{ciudad.nombre_ciudad}</option>

                        )}
                      </select>



                    </div>

                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">Fecha de nacimiento</label>

                      <TextField type="date" className="form-control" id="correo" name="fechaNacimiento" inputProps={{ min: "1900-01-01", max: "2015-01-01" }} defaultValue="2015-01-01" required onChange={this.handleChange} ></TextField>

                    </div>

                    <hr></hr>

                    <div>
                      <label>Sexo</label>
                      <br></br>
                      <input type="radio" value="M" name="sexo" onChange={this.handleChange} /> Hombre
                      <br></br>
                      <input type="radio" value="F" name="sexo" onChange={this.handleChange} /> Mujer
                      <br></br>
                      <input type="radio" value="O" name="sexo" onChange={this.handleChange} /> Otro
                    </div>

                    <hr></hr>


                    <div>
                      <label>Preferencia</label>
                      <br></br>
                      {this.state.preferencias.map((preferencias) =>
                        <div>

                          <input
                            type="radio"
                            value={preferencias.id}
                            name="preferencia"
                            onChange={this.handleChange}

                          />
                          {" " + preferencias.nombre_preferencia}

                        </div>
                      )}

                    </div>
                    <br></br>

                    <div >

                      <input type="file" className="form-control" id="files" name="archivos" onChange={(e) => this.Base64(e.target.files)} enctype="multipart/form-data"></input>

                      <br></br>

                      <img src={this.state.archivos} style={{ maxWidth: "250px", maxHeight: "250px" }}></img>


                    </div>
                    <br></br>


                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={this.handleClose}>Close</button>
                      <Button type="button" onClick={() => this.updatePerson(this.state.persona[0].id)} className="btn btn-primary">Save changes</Button>
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
            style={{ overflow: 'scroll' }}
            id="Modal"
            name="Modal"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Registro</h5>
                  <button type="button" className="btn-close" onClick={this.handleCloseModal2} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>

                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>

                      <TextField type="text" className="form-control" id="nombre" name="nombre" aria-describedby="emailHelp" required onChange={this.handleChange} ></TextField>

                    </div>


                    <div className="mb-3">
                      <label htmlFor="apellidos" className="form-label">Apellidos </label>

                      <TextField type="text" className="form-control" id="apellidos" name="apellidos" aria-describedby="emailHelp" required onChange={this.handleChange} ></TextField>

                    </div>



                    <div className="mb-3">
                      <label htmlFor="ciudad" className="form-label">Tipo de documento</label>

                      <select className="form-select" aria-label="Default select example" value={this.state.form.tipoDocumentos}
                        onChange={this.handleChange} name="tipoDocumentos">
                        <option defaultValue >Seleccione su tipo de documento</option>
                        {this.state.tipoDocumento.map((tipo) =>
                          <option key={tipo.id} value={tipo.id} id="tipoDocumentos">{tipo.tipo_documento}</option>

                        )}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="documento" className="form-label">Documento</label>

                      <TextField type="text" className="form-control" id="documento" name="documento" aria-describedby="emailHelp" inputProps={{ minLength: "6", maxLength: "20" }} onChange={this.handleChange} ></TextField>

                    </div>





                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Telefono</label>

                      <TextField type="text" className="form-control" id="telefono" name="telefono" aria-describedby="emailHelp" inputProps={{ minLength: "7", maxLength: "10" }} onChange={this.handleChange} ></TextField>

                    </div>

                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">Correo</label>

                      <TextField type="email" className="form-control" id="correo" name="correo" aria-describedby="emailHelp" required onChange={this.handleChange} ></TextField>

                    </div>

                    <div className="mb-3">
                      <label htmlFor="pass" className="form-label">Contraseña </label>

                      <TextField type="password" className="form-control" id="pass" name="password" aria-describedby="emailHelp" inputProps={{ minLength: "6" }} onChange={this.handleChange} ></TextField>

                    </div>


                    <div className="mb-3">
                      <label htmlFor="passConfirmar" className="form-label">Confirmar contraseña </label>

                      <TextField type="password" className="form-control" id="passConfirmar" name="passwordConnfirmar" inputProps={{ minLength: "6" }} aria-describedby="emailHelp" onChange={this.handleChange} ></TextField>

                    </div>


                    <div className="mb-3">
                      <label htmlFor="select-departament" className="form-label">Departamento</label>
                      <select className="form-select" aria-label="Default select example" id="select-departament">
                        <option defaultValue >Seleccione su Departamento</option>
                        {this.state.departamentos.map(departamento =>
                          <option onClick={() => this.Ciudades(departamento.id)} value={departamento.id}>{departamento.nombre_departamento}</option>
                        )}

                      </select>
                    </div>

                    <br></br>

                    <div className="mb-3">
                      <label htmlFor="ciudad" className="form-label">Ciudad</label>

                      <select className="form-select" aria-label="Default select example" value={this.state.id_ciudad}
                        onChange={this.handleChange} name="id_ciudad">
                        <option defaultValue >Seleccione su ciudad</option>
                        {this.state.ciudades.map((ciudad) =>
                          <option key={ciudad.id} value={ciudad.id} id="id_ciudad">{ciudad.nombre_ciudad}</option>

                        )}
                      </select>

                    </div>


                    <div className="mb-3">
                      <label htmlFor="correo" className="form-label">Fecha de nacimiento</label>

                      <TextField type="date" className="form-control" id="correo" name="fechaNacimiento" inputProps={{ min: "1900-01-01", max: "2015-01-01" }} defaultValue="2015-01-01" required onChange={this.handleChange} ></TextField>

                    </div>
                    <hr></hr>

                    <div>
                      <label>Sexo</label>
                      <br></br>
                      <input type="radio" value="M" name="sexo" onChange={this.handleChange} /> Hombre
                      <br></br>
                      <input type="radio" value="F" name="sexo" onChange={this.handleChange} /> Mujer
                      <br></br>
                      <input type="radio" value="O" name="sexo" onChange={this.handleChange} /> Otro
                    </div>


                    <hr></hr>



                    <label>Preferencia</label>
                    <br></br>
                    {this.state.preferencias.map((preferencias) =>
                      <div>


                        <input
                          type="radio"
                          value={preferencias.id}
                          name="preferencia"
                          onChange={this.handleChange}

                        />
                        {" " + preferencias.nombre_preferencia}

                      </div>
                    )}

                    <br></br>


                    <div >

                      <input type="file" className="form-control" id="files" name="archivos" onChange={(e) => this.Base64(e.target.files)} enctype="multipart/form-data"></input>

                      <br></br>

                      <img src={this.state.archivos} style={{ maxWidth: "250px", maxHeight: "250px" }}></img>


                    </div>
                    <br></br>








                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={this.handleCloseModal2}>Close</button>
                      <button type="button" onClick={() => this.registerPerson()} className="btn btn-primary">Save changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Modal>
        </div>}
      </>
    );
  }
}

export default Dashboard;
