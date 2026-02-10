
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const getSuitSymbol = (suit) => {
    switch (suit) {
        case 'Hearts': return '♥';
        case 'Diamonds': return '♦';
        case 'Clubs': return '♣';
        case 'Spades': return '♠';
        default: return '';
    }
};

const Game = () => {
    const [gameState, setGameState] = useState(null);
    const [winnerMessage, setWinnerMessage] = useState('');

    useEffect(() => {
        axios.post('http://localhost:5000/game/start')
            .then(response => setGameState(response.data))
            .catch(error =>
                console.error('Error starting a new game:', error));
    }, []);

    const handleHit = () => {
        axios.post('http://localhost:5000/game/hit',
            { gameId: gameState._id })
            .then(response => {
                setGameState(response.data);
                checkWinner(response.data.winner);
            })
            .catch(error => console.error('Error hitting:', error));
    };

    const handleStand = () => {
        axios.post('http://localhost:5000/game/stand',
            { gameId: gameState._id })
            .then(response => {
                setGameState(response.data);
                checkWinner(response.data.winner);
            })
            .catch(error =>
                console.error('Error standing:', error));
    };

    const startNewGame = () => {
        setWinnerMessage(''); 
        axios.post('http://localhost:5000/game/start')
            .then(response => setGameState(response.data))
            .catch(error =>
                console.error('Error starting a new game:', error));
    };

    const checkWinner = (winner) => {
        setWinnerMessage(`Winner: ${winner}`);
        setTimeout(() => {
            startNewGame();
        }, 3000); 
    };

    return (
        <div className="kl">
            {gameState ? (
                <>
                    <h1>Blackjack Game</h1>
                    {winnerMessage && <p className="winner-message">
                        {winnerMessage} </p>}
                    <div className="ma">

                        <div className="playerside">
                            <h2>Player Hand:</h2>
                            <ul>
                                {gameState.player.hand.map((card, index) => (
                                    <li key={index}>
    {card.rank} {getSuitSymbol(card.suit)}
</li>
                                ))}
                            </ul>
                            <p>Score: {gameState.player.score}</p>
                        </div>
                        <div className="dealerside">
                            <h2>Dealer Hand:</h2>
                            <ul>
                                {gameState.dealer.hand.map((card, index) => (
                                    <li key={index}>{card.rank} 
                                        of {card.suit}</li>
                                ))}
                            </ul>
                            <p>Score: {gameState.dealer.score}</p>
                        </div>
                    </div>
                    <div className="buttons">
                        <button onClick={handleHit}>Hit</button>
                        <button onClick={handleStand}>Stand</button>
                        <button onClick={startNewGame}>
                            Start New Game
                        </button>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Game;