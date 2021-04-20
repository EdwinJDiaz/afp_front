import React from 'react';
import axios from 'axios';
import { useState } from 'react';


function App() {

    const [archivos, setArchivos]=useState(null);

    /*const base64=(e)=>{
         
        
       Array.from(e).forEach(archivo=>{
            var reader = new FileReader();
            reader.readAsDataURL(archivo);
            reader.onload =function(){
                
                var base64 = reader.result;

                var imagen = base64.split(',')

                console.log(imagen);

                setArchivos(imagen);

                
            }
        })

        setArchivos(e[0])
        console.log(archivos);

    }*/


    const Base64=(e)=>{
        console.log(e);
        extraerBase64(e[0]).then((imagen)=>{
            setArchivos(imagen.base)
        })
    }


    const extraerBase64 = async (e) => new Promise((resolve, reject) => {
        try {
         
          const reader = new FileReader();
          reader.readAsDataURL(e);
          reader.onload = () => {
              var base64 = reader.result
              var imagen = base64.split(',')
              console.log(imagen);
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




    const insertar=async()=>{
        
        

        const f = new FormData();
        f.append('image', archivos)
        
        axios.post('http://localhost:8080/proyecto/webapi/documento/preferencias',f)
        .then(res => console.log(res))
        

                
    }


    return(
        <div className="container">
            <br></br>
            <input type="file" className="form-control" id="files" name="files" onChange={(e)=>Base64(e.target.files)} enctype="multipart/form-data"></input>
            <button className="btn btn-primary" onClick={()=>insertar()}>Enviar</button>
            <img src={archivos}></img>
        </div>
    )
}

export default App;