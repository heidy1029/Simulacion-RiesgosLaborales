import Corazon from "./Corazon"
import PropTypes from 'prop-types'

const VidasMovimientos = ({vidas, errores, movimientos}) => {
  return (
    <div className="flex bg-primary text-white rounded-b-3xl w-4/5 md:w-2/3 h-1/3 max-h-max p-2 pt-8 divide-x-2">
        <div className="w-1/2 flex flex-col justify-end items-center">
            <div className="vidas flex space-x-2 mb-4">
                {vidas < 4 ? Array.from({ length: vidas }).map((vida, index) => <Corazon key={index} lost={errores >= vidas - index} />) : (
                    <>
                        <Corazon />
                        <span> x {vidas - errores}</span>
                    </>
                )}
            </div>
            <div className="text-sm">Vidas</div>
        </div>                                                                                                                                          
        <div className="w-1/2 flex flex-col justify-end items-center">
            <div className="movimientos text-4xl mb-2 countdown">
              <span className="text-center" style={{ "--value": movimientos }}></span>
            </div>
            <div className="text-sm">Movimientos</div>
        </div>
    </div>
  )
}
VidasMovimientos.propTypes={
  vidas:PropTypes.number,
  errores:PropTypes.number,
  movimientos:PropTypes.number
}
export default VidasMovimientos