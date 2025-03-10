import React, {useContext, useEffect, useRef, useState} from 'react'
import Quiz from 'react-quiz-component';

import "../trivia/trivia.css";
import { GameContext } from '../../Juegos.jsx';

const TriviaMultiple = () => {
	const {data} = useContext(GameContext);
	const quizRef = useRef(null);
	const [infoQuiz, setInfoQuiz] = useState({});

	useEffect(() => {
		if(quizRef.current !== null && data !== null){
			let formInfo = {
				question: data.pregunta,
				//questionType: data.tipoMecanica === 1 ? "text" : "photo",
				questionType: "text",
				//answerSelectionType: data.tipoRespuesta === 1 ? "single" : "multiple",
				answerSelectionType: "single",
				answers: data.respuesta.map(resp => resp.opcion),
				correctAnswer: data.respuesta.filter((resp, index) => resp.respuesta === "1")[0].respuesta,
				point: data.puntos.toString(),
				url: data.url
			}
			setInfoQuiz({questions: [formInfo]})

			if(data.url !== undefined){
				document.querySelector("#preguntaDiv").innerHTML = `
		      <div class="flex justify-between items-center gap-4">
		        <img src="${data.url}" class="w-full rounded-xl" />
		      </div>
		    `;
			}

    console.log(data)

			if(formInfo.url === undefined){
				// Configurar el observer para observar el DOM
		    const observer = new MutationObserver((mutations) => {
		      mutations.forEach((mutation) => {
		        if (mutation.type === "childList") {
		          const element = document.querySelector(".questionWrapperBody h3");
		          if (element) {
		            element.remove(); // Eliminar el elemento
		            observer.disconnect(); // Detener el observer después de eliminar
		          }
		        }
		      });
		    });

		    // Observar el contenedor principal
		    observer.observe(document.body, {
		      childList: true, // Detecta cambios en los hijos
		      subtree: true,   // Detecta cambios en los descendientes
		    });
	    	
	    	return () => observer.disconnect();
			}
		}



	}, [])

	const quizResultFn = data => {
		console.log(data)
	}

	return (
		<>
			<div ref={quizRef} className='h-full flex items-center'>
				{Object.keys(infoQuiz)[0] == "questions" && <Quiz
					quiz={infoQuiz}
					disableSynopsis
					enableProgressBar={false}
					showDefaultResult={false}
					onComplete={quizResultFn}
				/>}
			</div>
		</>
	)
}

export default TriviaMultiple