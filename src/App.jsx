import { useState, useEffect } from "react";

function App() {

  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correo, setCorreo] = useState("");
  const [personas, setPersonas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [indiceEncontrado, setIndiceEncontrado] = useState(-1);


  useEffect(() => {
    setTimeout(function () {
      setMensaje("");
    }, 3000);
  }, [mensaje]);


  useEffect(() => {
    obtenerPersonas();
  }, []);


  function obtenerPersonas() {
    fetch("http://localhost:3001/personas")
      .then((response) => response.json())
      .then((data) => setPersonas(data))
      .catch((error) => console.error("Error al obtener personas:", error));
  }


  function buscarPersona(tipo, numero) {
    let indice = -1;

    for (let i = 0; i < personas.length; i++) {
      if (
        personas[i].tipoDocumento === tipo &&
        personas[i].numeroDocumento === numero
      ) {
        indice = i;
      }
    }

    setIndiceEncontrado(indice);

    if (indice !== -1) {
      setNombres(personas[indice].nombres);
      setApellidos(personas[indice].apellidos);
      setDireccion(personas[indice].direccion);
      setCiudad(personas[indice].ciudad);
      setFechaNacimiento(personas[indice].fechaNacimiento);
      setCorreo(personas[indice].correo);
      setMensaje("Persona encontrada. Puede actualizar o eliminar");
    }
  }

  function cambiarTipoDocumento(valor) {
    setTipoDocumento(valor);
    buscarPersona(valor, numeroDocumento);
  }

  function cambiarNumeroDocumento(valor) {
    setNumeroDocumento(valor);
    buscarPersona(tipoDocumento, valor);
  }

  function seleccionarPersona(indice) {
    setIndiceEncontrado(indice);
    setTipoDocumento(personas[indice].tipoDocumento);
    setNumeroDocumento(personas[indice].numeroDocumento);
    setNombres(personas[indice].nombres);
    setApellidos(personas[indice].apellidos);
    setDireccion(personas[indice].direccion);
    setCiudad(personas[indice].ciudad);
    setFechaNacimiento(personas[indice].fechaNacimiento);
    setCorreo(personas[indice].correo);
    setMensaje("Modifique los datos y presione Actualizar");
  }

  function formularioValido() {
    if (tipoDocumento === "") {
      setMensaje("Seleccione el tipo de documento");
      return false;
    }
    if (numeroDocumento === "") {
      setMensaje("Escriba el numero de documento");
      return false;
    }
    if (numeroDocumento.length < 6 || numeroDocumento.length > 10) {
      setMensaje("El documento debe tener entre 6 y 10 digitos");
      return false;
    }
    if (nombres === "") {
      setMensaje("Escriba los nombres");
      return false;
    }
    if (apellidos === "") {
      setMensaje("Escriba los apellidos");
      return false;
    }
    if (correo === "") {
      setMensaje("Escriba el correo electronico");
      return false;
    }
    return true;
  }

  function limpiar() {
    setTipoDocumento("");
    setNumeroDocumento("");
    setNombres("");
    setApellidos("");
    setDireccion("");
    setCiudad("");
    setFechaNacimiento("");
    setCorreo("");
    setIndiceEncontrado(-1);
  }

  function guardar() {
    if (!formularioValido()) {
      return;
    }

    const nuevaPersona = {
      tipoDocumento: tipoDocumento,
      numeroDocumento: numeroDocumento,
      nombres: nombres,
      apellidos: apellidos,
      direccion: direccion,
      ciudad: ciudad,
      fechaNacimiento: fechaNacimiento,
      correo: correo,
    };

    fetch("http://localhost:3001/personas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaPersona),
    })
      .then((response) => response.json())
      .then(() => {
        obtenerPersonas();
        limpiar();
        setMensaje("Persona guardada correctamente");
      })
      .catch((error) => console.error("Error al guardar persona:", error));
  }

  function actualizar() {
    if (!formularioValido()) {
      return;
    }

    const id = personas[indiceEncontrado].id;

    const personaActualizada = {
      tipoDocumento: tipoDocumento,
      numeroDocumento: numeroDocumento,
      nombres: nombres,
      apellidos: apellidos,
      direccion: direccion,
      ciudad: ciudad,
      fechaNacimiento: fechaNacimiento,
      correo: correo,
    };

    fetch(`http://localhost:3001/personas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personaActualizada),
    })
      .then((response) => response.json())
      .then(() => {
        obtenerPersonas();
        limpiar();
        setMensaje("Persona actualizada correctamente");
      })
      .catch((error) => console.error("Error al actualizar persona:", error));
  }

  function eliminar(indice) {
    const confirmado = window.confirm("Realmente desea eliminar esta persona?");

    if (!confirmado) {
      return;
    }

    const id = personas[indice].id;

    fetch(`http://localhost:3001/personas/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        obtenerPersonas();
        limpiar();
        setMensaje("Persona eliminada correctamente");
      })
      .catch((error) => console.error("Error al eliminar persona:", error));
  }


  let botones = <button onClick={guardar}>Guardar</button>;

  if (indiceEncontrado !== -1) {
    botones = (
      <div>
        <button onClick={actualizar}>Actualizar</button>
        <button onClick={() => eliminar(indiceEncontrado)}>Eliminar</button>
      </div>
    );
  }


  return (
    <div style={{ padding: "20px", textAlign: "left" }}>
      <h1>Mi primer formulario</h1>
      <h3>Tecnologico de Antioquia - Institucion Universitaria</h3>

      <label>Tipo de documento</label>
      <br />
      <select
        value={tipoDocumento}
        onChange={(e) => cambiarTipoDocumento(e.target.value)}
      >
        <option value="">Seleccione...</option>
        <option value="CC">Cedula de ciudadania</option>
        <option value="TI">Tarjeta de identidad</option>
        <option value="CE">Cedula de extranjeria</option>
        <option value="PAS">Pasaporte</option>
      </select>
      <br />
      <br />

      <label>Numero de documento</label>
      <br />
      <input
        type="text"
        placeholder="Numero de documento"
        value={numeroDocumento}
        onChange={(e) => cambiarNumeroDocumento(e.target.value)}
      />
      <br />
      <br />

      <label>Nombres</label>
      <br />
      <input
        type="text"
        placeholder="Nombres"
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
      />
      <br />
      <br />

      <label>Apellidos</label>
      <br />
      <input
        type="text"
        placeholder="Apellidos"
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
      />
      <br />
      <br />

      <label>Direccion</label>
      <br />
      <input
        type="text"
        placeholder="Direccion"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
      <br />
      <br />

      <label>Ciudad</label>
      <br />
      <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
        <option value="">Seleccione...</option>
        <option value="medellin">Medellin</option>
        <option value="bogota">Bogota</option>
        <option value="cali">Cali</option>
        <option value="cucuta">Cucuta</option>
      </select>
      <br />
      <br />

      <label>Fecha de nacimiento</label>
      <br />
      <input
        type="date"
        value={fechaNacimiento}
        onChange={(e) => setFechaNacimiento(e.target.value)}
      />
      <br />
      <br />

      <label>Correo electronico</label>
      <br />
      <input
        type="email"
        placeholder="Correo electronico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <br />
      <br />

      {botones}

      <h3>{mensaje}</h3>
      <h2>Total personas: {personas.length}</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Tipo Documento</th>
            <th>Numero de Documento</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Direccion</th>
            <th>Ciudad</th>
            <th>Fecha de nacimiento</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona, index) => (
            <tr key={persona.id}>
              <td>{persona.tipoDocumento}</td>
              <td>{persona.numeroDocumento}</td>
              <td>{persona.nombres}</td>
              <td>{persona.apellidos}</td>
              <td>{persona.direccion}</td>
              <td>{persona.ciudad}</td>
              <td>{persona.fechaNacimiento}</td>
              <td>{persona.correo}</td>
              <td>
                <button onClick={() => seleccionarPersona(index)}>
                  Actualizar
                </button>
                <button onClick={() => eliminar(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
