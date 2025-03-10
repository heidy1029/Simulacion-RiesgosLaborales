import Icon from '../assets/ganaste-fallaste-icon.svg'
import Estrellas from '../assets/estrellasModal.svg'

const GanasteModal = ({puntos, handleNextGame}) => {
  return (
    <dialog id="ganasteModal" className="modal">
        <div className="modal-box mt-24 overflow-visible pt-2 bg-azul-claro max-w-80 text-center rounded-t-none">
          <div className="absolute top-0 left-0 w-full bg-azul-claro pt-24 -translate-y-full stars rounded-t-full">
            <img className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10/12' src={Estrellas} alt="" />
            <h3 className="text-white font-black text-5xl">¡Ganaste!</h3>
          </div>
          <p className="text-white text-2xl">Completaste el reto</p>
          <div className="my-6 bg-white rounded-full flex justify-around items-center">
            <div className="icon aspect-square w-20 p-2">
              <img src={Icon} alt="" />
            </div>
            <div className="puntos">
              <div className="font-semibold text-6xl text-primary">{puntos}</div>
              <span>Puntos</span>
            </div>
          </div>
          <div className="justify-center modal-action">
            <form method="dialog">
              <button className="btn btn-accent font-extrabold text-lg px-8 py-4 rounded-3xl w-auto h-auto" onClick={handleNextGame}>Siguiente</button>
            </form>
          </div>
        </div>
    </dialog>
  )
}

export default GanasteModal