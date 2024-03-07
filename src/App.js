import './App.css';
import TicTacToe from './Components/TicTacToe/TicTacToe.jsx';
import croix from "./Assets/croix.png"
import rond from "./Assets/rond.png"
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';

function App() {

  const [gameId, setGameId] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [board, setBoard] = useState(Array(9).fill(""));
  const [gameStatus, setGameStatus] = useState('En cours'); 


  useEffect(() => {
    resetGame();
  }
  , []);

  useEffect(() => {
  if (gameId !== null) {
    console.log("Prêt à jouer avec gameId:", gameId);
  }
  }, [gameId]); 



  // Fonction pour jouer un coup et mettre à jour l'état du jeu
  const playMove = async (index) => {
  console.log("Tentative de jouer le coup", { gameId, index, currentPlayer, boardState: board });
  
  if ((board[index] === "" || board[index] === " ") && gameStatus === 'En cours') {
    try {
      console.log("Envoi du mouvement avec gameId:", gameId);
      const response = await axios.post('http://localhost:8080/api/game/playMove', {
        gameId,
        index,
        player: currentPlayer
      });

      console.log("Réponse de l'API", response.data);
      
      const updatedGame = response.data;
      setBoard(updatedGame.board.split(""));
      setCurrentPlayer(updatedGame.currentPlayer);
      setGameStatus(updatedGame.status);

    } catch (error) {
      console.error('There was an error playing the move:', error);
    }
  } else {
    console.log("Le coup n'a pas été joué - Condition non remplie", {boardCase: board[index], gameStatus});
  }
  };


  const checkVictory = async () => {
    const response = await axios.get(`http://localhost:8080/api/game/checkVictory/${gameId}`);
    const result = response.data;
    if (result !== 'Game continues') {
      setGameStatus(result);
    } else {
      // Alterner le joueur
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };


  // Fonction pour initialiser ou réinitialiser le jeu
  const resetGame = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/game/newGame', {
        currentPlayer: "X",
        status: "En cours"
      });
      // Initialiser l'état du jeu avec la nouvelle partie
      const newGame = response.data;
      console.log("Réponse complète de la création du jeu :", response.data); // pas de reponse postman
      console.log("Jeu créé avec l'ID:", newGame.id);
      setGameId(newGame.id);
      setBoard(Array(9).fill('')); // Ou autre logique si l'API renvoie un état initial du tableau
      setCurrentPlayer('X');
      setGameStatus('En cours');
    } catch (error) {
      console.error('There was an error resetting the game:', error);
    }
  };
  
  let titleRef = useRef(null);
  
  return (
    <div className='container'>
      <h1 className='title' ref={titleRef}>Tic Tac Toe Game</h1>

      {/* Afficher le statut du jeu ou le gagnant ici */}
      {gameStatus !== 'En cours' && (
        <div className="game-status">
          {gameStatus === 'X wins' ? 'Le joueur X a gagné !' : gameStatus === 'O wins' ? 'Le joueur O a gagné !' : 'Match nul !'}
        </div>
      )}

      <div className='board'>
        <div className='row1'>
          <div className='boxes' onClick={()=>playMove(0)}>{board[0] === 'X' && <img src={croix} alt="X" />}
  {board[0] === 'O' && <img src={rond} alt="O" />}</div>
          <div className='boxes' onClick={()=>playMove(1)}>{board[1] === 'X' && <img src={croix} alt="X" />}
  {board[1] === 'O' && <img src={rond} alt="O" />}</div>
          <div className='boxes' onClick={()=>playMove(2)}>{board[2] === 'X' && <img src={croix} alt="X" />}
  {board[2] === 'O' && <img src={rond} alt="O" />}</div>
        </div>
        <div className='row2 '>
          <div className='boxes' onClick={()=>playMove(3)}>{board[3] === 'X' && <img src={croix} alt="X" />}
  {board[3] === 'O' && <img src={rond} alt="O" />}</div>
          <div className='boxes' onClick={()=>playMove(4)}>{board[4] === 'X' && <img src={croix} alt="X" />}
  {board[4] === 'O' && <img src={rond} alt="O" />}</div>
          <div className='boxes' onClick={()=>playMove(5)}>{board[5] === 'X' && <img src={croix} alt="X" />}
  {board[5] === 'O' && <img src={rond} alt="O" />}</div>
        </div>
        <div className='row3 '>
          <div className='boxes' onClick={()=>playMove(6)}>{board[6] === 'X' && <img src={croix} alt="X" />}
  {board[6] === 'O' && <img src={rond} alt="O" />}</div>
          <div className='boxes' onClick={()=>playMove(7)}>{board[7] === 'X' && <img src={croix} alt="X" />}
  {board[7] === 'O' && <img src={rond} alt="O" />}</div>
          <div className='boxes' onClick={()=>playMove(8)}>{board[8] === 'X' && <img src={croix} alt="X" />}
  {board[8] === 'O' && <img src={rond} alt="O" />}</div>
        </div>
      </div>
      <button className='reset' onClick={()=>{resetGame()}}>Reset</button>
    </div>
  );
}

export default App;
