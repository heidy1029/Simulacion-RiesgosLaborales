import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from "react-router-dom";
import { Wheel } from 'react-custom-roulette'
import HeadScore from "../utils/HeadScore.jsx"

const data = [
  { option: '0' },
  { option: '1' },
  { option: '2' },
  { option: '3' },
  { option: '4' },
  { option: '5' },
  { option: '6' },
  { option: '7' },
  { option: '8' },
  { option: '9' },
  { option: '10' },
  { option: '11' },
]

const Roulette = () => {
	const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [textBtnPlay, setTextBtnPlay] = useState(true);
  const [selectedValueRoulette, setSelectedValueRoulette] = useState(null)

  const navigate = useNavigate();

  const initRoulette = () => {
  	if(textBtnPlay){
	  	if(!mustSpin){
		  	const newPrizeNumber = Math.floor(Math.random() * data.length);
		    setPrizeNumber(newPrizeNumber);
		  	setMustSpin(true)
	  	}
  	}else{
  		console.log("CAmbia")
  		navigate("/trivia")
  	}
  }

  /*Aplicando Gradiente a cada separador de la ruleta*/
  const createCanvas = document.createElement("CANVAS");
  const canvas = createCanvas.getContext("2d");
  const grad=canvas.createLinearGradient(200,300,350,900);
	grad.addColorStop(0, "#43BAFF");
	grad.addColorStop(1, "#2568FB");

  const canvas2 = createCanvas.getContext("2d");
	const grad2=canvas2.createLinearGradient(200,300,350,900);
	grad2.addColorStop(0, "#5C62DF");
	grad2.addColorStop(1, "#FF5085");

	return (
		<>
			<HeadScore title="GIRA LA RULETA Y ACEPTA EL RETO" />
			<div className="container mx-auto md:mt-8 flex flex-col items-center">
				<div className="-rotate-45 container mx-auto px-5 flex justify-center my-14">
					<Wheel
			      mustStartSpinning={mustSpin}
			      prizeNumber={prizeNumber}
			      data={data}
			      backgroundColors={["#FDFDFD", grad, grad2]}
			      outerBorderColor={["#0E59F1"]}
			      outerBorderWidth={15}
			      radiusLineColor={["transparent"]}
			      radiusLineWidth={0}
			      textColors={[grad,'#ffffff', "#ffffff"]}
			      fontSize={[35]}
			      onStopSpinning={() => {
		          setMustSpin(false);
		          setSelectedValueRoulette(data[prizeNumber].option)
		          setTextBtnPlay(false)
		        }}
			    />
		    </div>

		    <p className="text-center text-2xl font-bold text-white">{selectedValueRoulette || ""}</p>

		    <div className="px-5 flex justify-between gap-4">
		    	<button
		    		className="bg-white text-black text-lg font-semibold py-3 px-12 rounded-3xl w-1/2"
		    		>Volver</button>
		    	<button
		    		className="bg-azulBrillante3 text-black text-lg font-semibold py-3 px-12 rounded-3xl w-1/2 text-center"
		    		onClick={() => initRoulette()}
		    		>{textBtnPlay ? "Jugar" : "Cambiar"}</button>
		    	{/* <Link to="trivia" className="bg-azulBrillante3 text-black text-lg font-semibold py-3 px-9 rounded-3xl w-1/2 text-center">Jugar</Link> */}
		    </div>
	    </div>
		</>
	)
}

/*
pointerProps={{
            style: {
                position: 'absolute',
                transform: 'translateX(-300%) translateY(-50%) rotate(180deg)',
                width: '0',
                height: '0',
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: '40px solid #f0ad4e',
            },
	        }}
*/

export default Roulette
