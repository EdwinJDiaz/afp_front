import React, { Component, useState, useEffect } from 'react';
import {Pie} from 'react-chartjs-2'

class Grafica extends Component {

    state = {
        datos: [],
        ciudades: [],
        cantidad: [],
        colores:[],
        data:[],
        opciones:[]
    }


    async componentDidMount(){
        await this.peticion();
        await this.generarColores();
        this.configurarGrafica();
    }

    peticion =async()=> {
        var datos=[]
        var array=[]
        var ciudades=[]
        await fetch('http://localhost:8080/proyecto/webapi/documento/grafica')
        .then(response => response.json())
        .then(res => res.map((res) => datos.push({cantidad: res[0],ciudad: res[1]})))

        this.setState({datos:datos})

        this.state.datos.map(res => array.push(res.cantidad))
        this.state.datos.map(res => ciudades.push(res.ciudad))

        this.setState({ciudades: ciudades, cantidad: array})

        console.log(this.state.cantidad, this.state.ciudades);
        
    }



    generarCaracter(){
        var caracter = ["a", "b", "c", "e", "f", "0","1","2","3","4","5","6","7","8","9"]
        var numero = (Math.random()*15).toFixed(0)
        return caracter[numero]
    }

    colorHex(){
        var color = "";
        for (let i = 0; i < 6; i++) {
            color = color + this.generarCaracter();
        }
        return "#"+color;
    }

    generarColores(){
        var colores=[];
        for (let i = 0; i < this.state.datos.length; i++) {
            colores.push(this.colorHex());         
        }
        this.setState({colores:colores})
        console.log(this.state.colores);
    }

    configurarGrafica(){
        const data = {
            labels: this.state.ciudades,
            datasets:[{
                data: this.state.cantidad,
                backgroundColor: this.state.colores
            }]
        };
        const opciones={
            responsive:true,
            maintainAspectRatio:false
        }
        this.setState({data: data, opciones: opciones})
    }

    render() {
        return (
            <div className="container">
                
                <Pie
                data={this.state.data} options={this.state.opciones}
                >

                </Pie>
            </div>
        )
    }


   
}

export default Grafica;