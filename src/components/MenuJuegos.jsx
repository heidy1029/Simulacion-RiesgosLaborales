import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'
import iconTrivias from '../assets/icon-trivias.svg'
import iconAdivinanzas from '../assets/icon-adivinanzas.svg'
import iconRompecabezas from '../assets/icon-rompecabezas.svg'
import iconAhorcado from '../assets/icon-ahorcado.svg'
import iconMemoria from '../assets/icon-memoria.svg'
import iconTresEnLinea from '../assets/icon-tres-en-linea.svg'
import iconCrucigrama from '../assets/icon-crucigrama.svg'
import iconSopaDeLetras from '../assets/icon-sopa-de-letras.svg'

export default function MenuJuegos({ items, display = "list" }) {
    const menuJuegos = [
        {nombre: "Trivias",         icono: iconTrivias,         page: 'trivias',         oids:[4,5]},
        {nombre: "Adivinanzas",     icono: iconAdivinanzas,     page: 'adivinanzas',     oids:[10,11]},
        {nombre: "Rompecabezas",    icono: iconRompecabezas,    page: 'rompecabezas',    oids:[3]},
        {nombre: "Ahorcado",        icono: iconAhorcado,        page: 'ahorcado',        oids:[1,2]},
        {nombre: "Memoria",         icono: iconMemoria,         page: 'memoria',         oids:[12]},
        {nombre: "Tres en línea",   icono: iconTresEnLinea,     page: 'tres-en-linea',   oids:[14]},
        {nombre: "Crucigrama",      icono: iconCrucigrama,      page: 'crucigrama',      oids:[16]},
        {nombre: "Sopa de letras",  icono: iconSopaDeLetras,    page: 'sopa-de-letras',  oids:[13]}
    ];
    
    if(items === undefined)items = JSON.parse(localStorage.getItem('actividadesDisponibles'));
    const navigate = useNavigate();
    const missingGames = [];

    return (
        <>
            {display === 'list' ?
                <ul onSelect={(selectedKey) => navigate(selectedKey)} tabIndex={0} className="menu menu-sm dropdown-content bg-azul-claro rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    {menuJuegos.map((item, index) => (
                        !missingGames.includes(item.nombre) &&
                        <li key={index}>
                            <Link className="text-white" to={`/${item.page}/${item.oids.toString()}`}>{item.nombre}</Link>
                        </li>
                    ))}
                </ul>
                :
                <div className="flex flex-wrap">
                {menuJuegos.map((item, index) => (
                    !missingGames.includes(item.nombre) && 
                    <div className="w-1/2 lg:w-1/4 px-2" key={index}>
                        <div className="card aspect-square lg:aspect-4/3 size-full text-azul-claro shadow-lg transition-all ease-in-out duration-700 cursor-pointer  hover:shadow-2xl">
                            <div className="card-body p-2 lg:p-6 justify-center">
                                <div className="w-1/2 mx-auto">
                                    <img className="aspect-square size-full " src={item.icono} alt="" />
                                </div>
                                <Link className="stretched-link font-bold text-center" to={`/${item.page}/${item.oids.toString()}`}>
                                    {item.nombre}
                                </Link>
                            </div>
                        </div>  
                    </div>
                ))}
                </div>
            }
        </>
    )
}

MenuJuegos.propTypes = {
    items: PropTypes.array,
    display: PropTypes.string
}