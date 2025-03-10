export async function fetchData(oidJuego,oidUsuario){
    try {
      const response = await fetch("https://tangara.gov.co/ws_pme/?respuestaJuego", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "oidJuego":oidJuego,
          "oidUsuario":oidUsuario
        })
      });

      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1)throw new Error('No se pudo cargar el Juego, vuelve a cargar la página');
      const result = await response.json();

      //con in verifico si "opcionRespuesta existe dentro del objeto result.RespuestaJuego"
      let opcionResp = "opcionRespuesta" in result.RespuestaJuego ? result.RespuestaJuego.opcionRespuesta : undefined;
      let tipoResp = "tipoRespuesta" in result.RespuestaJuego ? result.RespuestaJuego.tipoRespuesta : undefined;
      let tipoMec= "tipoMecanica" in result.RespuestaJuego ? result.RespuestaJuego.tipoMecanica : undefined;
      let urlImage= "imagen" in result.RespuestaJuego ? result.RespuestaJuego.imagen : undefined;
      let tiempo= "tiempo" in result.RespuestaJuego ? result.RespuestaJuego.tiempo : undefined;

      return {
        "pregunta": result.RespuestaJuego.pregunta,
        "url": urlImage,
        //"errores": 10,
        "errores": result.RespuestaJuego.errores || 10,
        "intentos": result.RespuestaJuego.intentos,
        "puntos": result.RespuestaJuego.puntos,
        "respuesta": opcionResp,
        "tipoRespuesta": tipoResp,
        "tipoMecanica": tipoMec,
        "tiempo": tiempo
      };
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }    
  }


export async function fetchDataListaJuegos(){
  try {
    const response = await fetch("https://tangara.gov.co/ws_pme/?JuegosDisponibles", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "oid": 18,
      })
    });

    if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1)throw new Error('No se pudo cargar la lista de juegos');
    const result = await response.json();

    if(result.status === 200){
      return result.ActividadesDisponibles;
    }else{
      throw new Error("Hubo un error al hacer la peticion al servidor")
    }
  } catch (err) {
      console.log(err);
      return { error: err.message };
  }
}