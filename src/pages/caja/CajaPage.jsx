// Dependencias.
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import TabNavigation from "../../components/Navigation/Navigation.jsx";
import { CajaProductos } from "./components/CajaProductos.jsx";
import { CajaCarro } from "./components/CajaCarro.jsx";
import { CajaCajero } from "./components/CajaCajero.jsx";
import { CajaCierre } from "./components/CajaCierre.jsx";
import { CajaTotal } from "./components/CajaTotal.jsx";
import { CajaBotones } from "./components/CajaBotones.jsx";
import { Fab } from "@mui/material";
import { VscGear } from "react-icons/vsc";

// Importación de estilos.
import "./CajaPage.scss";

// Definición del componente: <CajaPage />
const CajaPage = (props) => {
  // -- Manejo del estado.
  const { sendCarrito } = props;
  const productos = useSelector((state) => state.producto.productos);
  const [total, setTotal] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [modalVisibility,setModalVisibility] = useState(false)

  // -- Ciclo de vida.
  useEffect(() => {}, []);

  // -- Metodo.
  const cambiarTotal = (valor) => {
    setTotal(total + valor);
  };

  const cambiarCarro = (index, nombre, precio, cantidad) => {
    setCarrito([...carrito, { index, nombre, precio, cantidad }]);
  };

  const limpiar = () => {
    setTotal(0);
    setCarrito([]);
  };

  const cambiarCantidad = (cantidad, valor, nombre, suma) => {
    const carro = [...carrito];
    carro.map((item) => {
      if (item.nombre == nombre) {
        if (suma) {
          item.cantidad = item.cantidad + 1;
          setTotal(total + valor);
        } else {
          if (cantidad > 1) {
            item.cantidad = item.cantidad - 1;
            setTotal(total - valor);
          }
        }
      }
    });
  };

  const enviarCarrito = () => {
    // Enviar los productos del carrito a REDUX.
    sendCarrito(carrito);
  };

  const cerrarModal = () => {
    setModalVisibility(!modalVisibility)
  }

  // -- Renderizado.
  return (
    <section className="cajaPage_container">
      {/* Navegación de la aplicación. */}
      <section className="cajaPage_navigation">
        <TabNavigation />
      </section>

      {/* Vista de la caja. */}
      <section className="cajaPage_content">
        {/* Lista de productos. */}

        <CajaCierre open={modalVisibility} cerrar={cerrarModal}></CajaCierre>

        <CajaProductos
          total={total}
          productos={productos}
          carro={[...carrito]}
          cambiaCarro={cambiarCarro}
          cambiaTotal={cambiarTotal}
          cambiaCantidad={cambiarCantidad}
        />

        {/* Carrito de compra. */}
        <CajaCarro carro={carrito} cambiaCantidad={cambiarCantidad} />

        {/* <CajaCajero /> */}
        <CajaTotal total={total} />

        {/* Botones. */}
        <CajaBotones limpia={limpiar} carrito={carrito} sendCarrito={enviarCarrito} />

        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "absolute", top: "88%", left: "93%" }}
          onClick={() => {
            setModalVisibility(true)
          }}
        >
          <VscGear />
        </Fab>
      </section>
    </section>
  );
};

// Exportación de la pagina: Index.
export default CajaPage;
