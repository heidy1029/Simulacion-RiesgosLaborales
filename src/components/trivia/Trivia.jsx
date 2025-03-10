import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GameContext } from "../../Juegos.jsx";

const Trivia = () => {
  const { data, setWinner, moves, handleMoves, handleWinPoints } = useContext(GameContext);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (data) {
      const formInfo = {
        question: data.pregunta,
        options: data.respuesta.map((resp) => resp.opcion),
        answer: data.respuesta.find((resp) => resp.respuesta === "1")?.opcion,
        url: data.url,
      };
      setQuestions([formInfo]);
      handleMoves(data.intentos);
      setDisabled(false); // Reseteamos el estado disabled cuando hay nueva data
    }

    if(data.url !== undefined){
      document.querySelector("#preguntaDiv").innerHTML = `
        <div class="flex justify-between items-center gap-4">
          <img src="${data.url}" class="w-full rounded-xl" />
        </div>
      `;
    }
  }, [data]);

  const handleAnswer = (e, option) => {
    const fallasteModal = document.getElementById("fallasteModal");
    
    if (questions[0]?.answer === option) {
      e.target.classList.add("btnQuestionWinn");
      setScore(score + 1);
      //setWinner("ganaste");
      handleWinPoints(true)
    } else {
      const newMoves = moves - 1;
      handleMoves(newMoves);
      fallasteModal.showModal();
      
      if(newMoves === 0) {
        // Cuando llegamos a 0 intentos
        setDisabled(true);
        // Mostrar el modal final
        fallasteModal.showModal();
      } else {
        e.target.classList.add("btnQuestionBad");
        
        // Configurar el evento para cuando se cierre el modal
        const handleModalClose = () => {
          e.target.classList.remove("btnQuestionBad");
        };
        
        fallasteModal.addEventListener('close', handleModalClose);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px"}}>
      {questions.length > 0 ? (
        <motion.div
          key={`question`}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {questions[0].url && (
            <>
              <h2>{questions[0].question}</h2>
              <div className="text-sm mb-4">
                Intentos restantes: {moves}
              </div>
            </>
          )}
          {questions[0].options.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleAnswer(e, option)}
              className="btnQuestion"
              disabled={disabled}
            >
              {option}
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Trivia;