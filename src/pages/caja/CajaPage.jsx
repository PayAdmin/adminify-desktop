// Dependencias.
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "../../components/Navigation/Navigation.jsx";
import { CajaProductos } from "./components/CajaProductos.jsx";
import { CajaCarro } from "./components/CajaCarro.jsx";
import { CajaCajero } from "./components/CajaCajero.jsx";
import { CajaCierre } from "./components/CajaCierre.jsx";
import { CajaTotal } from "./components/CajaTotal.jsx";
import { CajaBotones } from "./components/CajaBotones.jsx";
import { Fab } from "@mui/material";
import { VscGear } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { publicURL, privateURL } from "../../schemas/Navigation.js";
import { useReactToPrint } from "react-to-print"
import  CajaImpresion  from "./components/CajaImpresion.jsx"

// Actions.
import { displayAlert } from "../../redux/slices/aplicacionSlice.js";
import { clearMetodo } from "../../redux/slices/ventasSlice.js";
import { clearCarro } from "../../redux/slices/productosSlice.js";

// Importación de estilos.
import "./CajaPage.scss";

// Definición del componente: <CajaPage />
const CajaPage = (props) => {
  // -- Manejo del estado.
  const { productos, sendCarrito } = props;
  const [total, setTotal] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [canPay, setCanPay] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -- Ciclo de vida.
  useEffect(() => {
    if (carrito.length > 0) {
      setCanPay(true);
    } else {
      setCanPay(false);
    }
  }, [carrito]);

  useEffect(() => {
    dispatch(clearMetodo());
    dispatch(clearCarro());
  }, []);

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
          if (cantidad >= 0) {
            item.cantidad = item.cantidad - 1;
            setTotal(total - valor);
          }
        }
      }
    });
  };

  const enviarCarrito = () => {
    // Enviar los productos del carrito a REDUX.

    let total = carrito.length;

    if (total > 0) {
      setCanPay(true);
      sendCarrito(carrito);

      // Redirigir al pago.
      navigate(privateURL.pago);
    } else {
      setCanPay(false);

      let newAlert = {
        type: "error",
        title: "Carrito vacío",
        message: "El carrito está vacío, no se puede realizar la venta",
      };

      dispatch(displayAlert(newAlert));
    }
  };

  const cerrarModal = () => {
    setModalVisibility(!modalVisibility);
  };

  const borrarDelCarro = () => {
    const carro = [...carrito];
    const carroFiltrado = carro.filter((item) => item.cantidad > 0);
    setCarrito([...carroFiltrado]);
  };

  // -- Renderizado.
  if (!modalVisibility) {
    return (
      <section className="cajaPage_container">
        {/* Navegación de la aplicación. */}
        <section className="cajaPage_navigation">
          <Navigation />
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
          <CajaCarro carro={carrito} cambiaCantidad={cambiarCantidad} borrar={borrarDelCarro} />

          {/* <CajaCajero /> */}
          <CajaTotal total={total} />

          {/* Botones. */}
          <CajaBotones
            limpia={limpiar}
            carrito={carrito}
            sendCarrito={enviarCarrito}
            canPay={canPay}
          />
          <Fab
            color="primary"
            aria-label="add"
            style={{ position: "absolute", top: "88%", left: "93%" }}
            onClick={() => {
              setModalVisibility(true);
            }}
          >
            <VscGear />
          </Fab>
        </section>
      </section>
    );
  } else {
    return (
      <section className="cajaPage_container">
        {/* Navegación de la aplicación. */}
        <section className="cajaPage_navigation">
          <Navigation />
        </section>
        <CajaCierre open={modalVisibility} cerrar={cerrarModal}></CajaCierre>
        {/* Vista de la caja. */}
        <section className="cajaPage_content_modal">
          {/* Lista de productos. */}

          {/* <CajaCierre open={modalVisibility} cerrar={cerrarModal}></CajaCierre> */}

          <CajaProductos
            total={total}
            productos={productos}
            carro={[...carrito]}
            cambiaCarro={cambiarCarro}
            cambiaTotal={cambiarTotal}
            cambiaCantidad={cambiarCantidad}
          />

          {/* Carrito de compra. */}
          <CajaCarro carro={carrito} cambiaCantidad={cambiarCantidad} borrar={borrarDelCarro} />

          {/* <CajaCajero /> */}
          <CajaTotal total={total} />

          {/* Botones. */}
          <CajaBotones
            limpia={limpiar}
            carrito={carrito}
            sendCarrito={enviarCarrito}
            canPay={canPay}
          />
          <Fab
            color="primary"
            aria-label="add"
            style={{ position: "absolute", top: "88%", left: "93%" }}
            onClick={() => {
              setModalVisibility(true);
            }}
          >
            <VscGear />
          </Fab>
        </section>
      </section>
    );
  }
};

// Exportación de la pagina: Index.
export default CajaPage;
