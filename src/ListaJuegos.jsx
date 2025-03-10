import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { Link, useParams } from 'react-router-dom'

const ListaJuegos = () => {
  let params = useParams();
    const [tituloJuego, setTituloJuego] = useState('');
    const [listaJuegos, setlistaJuegos] = useState([]);

    useEffect(() => {
        const { nombreJuego, oids } = params;
        let formatNombre = nombreJuego.replaceAll('-',' ');
        setTituloJuego(formatNombre.replace(/^./, match => match.toUpperCase()));

        (async() => {
            const todosJuegos = await JSON.parse(localStorage.getItem('todosJuegos'));
            let filtrados = [];
            let juegos = todosJuegos.map((item,indx) => oids.split(',').includes(item.tipoJuego.toString()) && filtrados.push(item));
            console.log(filtrados);
            setlistaJuegos(filtrados);
        })();

    }, [params]);


    return (
        <div className="flex flex-col justify-between flex-nowrap items-center min-h-screen md:min-h-px md:h-screen">
            <Header />
            <main className="grow w-full flex flex-col">
                <header className="w-full bg-gris-claro-azul py-2">
                    <div className="container mx-auto text-center">
                        <h1 className="text-secondary text-3xl">{tituloJuego}</h1>
                    </div>
                </header>
                <section className="grow container mx-auto  px-4 lg:px-16 py-12">
                    <div className="flex flex-wrap">
                        {listaJuegos.map((item, key) => (
                            <div className="w-1/2 lg:w-1/4 px-2" key={key}>
                                <div className="card aspect-square lg:aspect-4/3 size-full text-azul-claro shadow-lg transition-all ease-in-out duration-700 cursor-pointer  hover:shadow-2xl">     
                                    <div className="card-body  pt-6 p-2">
                                        <h2 className="card-title mx-auto text-center leading-tight text-base">{item.titulo}</h2>
                                        <Link  className="btn bg-transparent hover:bg-success text-center font-semibold flex items-center justify-center" to={`/${item.tipoJuego}/${item.oidJuego}/18`}>
                                            Jugar
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            ))
                        }
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default ListaJuegos