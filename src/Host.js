import { useState } from "react";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { db } from "./firebase";
import gameData from "./gameData";

import "./Host.css";


function Host() {

  const [selected, setSelected] = useState(null);

  const [game, setGame] = useState({
    team: "RED",
    round: 1,
    scoreRed: 0,
    scoreBlue: 0,
    activeClue: null,
    clueNumber: null
  });


  // ==========================================
  // SELECT CATEGORY
  // ==========================================

  async function selectCategory(key) {

    const data = gameData[key];

    setSelected(data);

    const newGame = {
      category: data.category,
      categoryIcon: data.icon,

      team: "RED",
      round: 1,

      scoreRed: 0,
      scoreBlue: 0,

      activeClue: null,
      clueNumber: null,

      gameStarted: true
    };

    setGame(newGame);

    try {

      await setDoc(
        doc(db, "games", "clue-battle"),
        newGame
      );

    } catch (error) {

      console.error(error);
      alert("Could not start the game.");

    }
  }


  // ==========================================
  // SHOW CLUE
  // ==========================================

  async function showClue(clue, index) {

    try {

      const clueData = {

        activeClue: {
          ...clue
        },

        clueNumber: index + 1

      };


      await setDoc(
        doc(db, "games", "clue-battle"),
        clueData,
        {
          merge: true
        }
      );


      setGame((previous) => ({
        ...previous,
        activeClue: clue,
        clueNumber: index + 1
      }));


    } catch (error) {

      console.error(error);
      alert("Could not show clue.");

    }
  }


  // ==========================================
  // HIDE CLUE
  // ==========================================

  async function hideClue() {

    try {

      await setDoc(
        doc(db, "games", "clue-battle"),
        {
          activeClue: null,
          clueNumber: null
        },
        {
          merge: true
        }
      );


      setGame((previous) => ({
        ...previous,
        activeClue: null,
        clueNumber: null
      }));


    } catch (error) {

      console.error(error);
      alert("Could not hide clue.");

    }
  }


  // ==========================================
  // CORRECT ANSWER
  // ==========================================

  async function correctAnswer() {

    if (!game.activeClue) {
      return;
    }


    const points = 10;


    const newScoreRed =
      game.team === "RED"
        ? game.scoreRed + points
        : game.scoreRed;


    const newScoreBlue =
      game.team === "BLUE"
        ? game.scoreBlue + points
        : game.scoreBlue;


    const nextTeam =
      game.team === "RED"
        ? "BLUE"
        : "RED";


    const updatedGame = {

      ...game,

      scoreRed: newScoreRed,
      scoreBlue: newScoreBlue,

      activeClue: null,
      clueNumber: null,

      team: nextTeam

    };


    setGame(updatedGame);


    try {

      await setDoc(
        doc(db, "games", "clue-battle"),
        {
          scoreRed: newScoreRed,
          scoreBlue: newScoreBlue,

          activeClue: null,
          clueNumber: null,

          team: nextTeam
        },
        {
          merge: true
        }
      );


    } catch (error) {

      console.error(error);
      alert("Could not update score.");

    }
  }


  // ==========================================
  // WRONG ANSWER
  // ==========================================

  async function wrongAnswer() {

    if (!game.activeClue) {
      return;
    }


    const nextTeam =
      game.team === "RED"
        ? "BLUE"
        : "RED";


    const updatedGame = {

      ...game,

      activeClue: null,
      clueNumber: null,

      team: nextTeam

    };


    setGame(updatedGame);


    try {

      await setDoc(
        doc(db, "games", "clue-battle"),
        {
          activeClue: null,
          clueNumber: null,

          team: nextTeam
        },
        {
          merge: true
        }
      );


    } catch (error) {

      console.error(error);
      alert("Could not update game.");

    }
  }


  // ==========================================
  // MANUAL TEAM SWITCH
  // ==========================================

  async function switchTeam() {

    const nextTeam =
      game.team === "RED"
        ? "BLUE"
        : "RED";


    const updatedGame = {
      ...game,
      team: nextTeam
    };


    setGame(updatedGame);


    try {

      await setDoc(
        doc(db, "games", "clue-battle"),
        {
          team: nextTeam
        },
        {
          merge: true
        }
      );


    } catch (error) {

      console.error(error);
      alert("Could not switch team.");

    }
  }


  // ==========================================
  // RESET GAME
  // ==========================================

  async function resetGame() {

    if (!selected) {
      return;
    }


    const resetData = {

      category: selected.category,
      categoryIcon: selected.icon,

      team: "RED",
      round: 1,

      scoreRed: 0,
      scoreBlue: 0,

      activeClue: null,
      clueNumber: null,

      gameStarted: true

    };


    setGame(resetData);


    try {

      await setDoc(
        doc(db, "games", "clue-battle"),
        resetData
      );


    } catch (error) {

      console.error(error);
      alert("Could not reset game.");

    }
  }


  // ==========================================
  // NEW ROUND
  // ==========================================

  async function nextRound() {

    const nextRoundNumber =
      game.round + 1;


    const updatedGame = {

      ...game,

      round: nextRoundNumber,

      activeClue: null,
      clueNumber: null,

      team: "RED"

    };


    setGame(updatedGame);


    try {

      await setDoc(
        doc(db, "games", "clue-battle"),
        {
          round: nextRoundNumber,

          activeClue: null,
          clueNumber: null,

          team: "RED"
        },
        {
          merge: true
        }
      );


    } catch (error) {

      console.error(error);
      alert("Could not start next round.");

    }
  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="host-page">


      <header className="host-header">

        <div className="host-title">
          🎯 CLUE BATTLE
        </div>

        <div className="host-label">
          HOST
        </div>

      </header>


      <main className="host-main">


        <h2>
          Select Category
        </h2>


        <div className="host-categories">

          {Object.entries(gameData).map(
            ([key, data]) => (

              <button
                key={key}

                className={
                  selected?.category === data.category
                    ? "host-category selected"
                    : "host-category"
                }

                onClick={() =>
                  selectCategory(key)
                }
              >

                <span>
                  {data.icon}
                </span>

                {data.category}

              </button>

            )
          )}

        </div>


        {selected && (

          <section className="host-game">


            <div className="host-scoreboard">


              <div
                className={
                  game.team === "RED"
                    ? "team-score active"
                    : "team-score"
                }
              >

                <span>
                  🔴 RED
                </span>

                <strong>
                  {game.scoreRed}
                </strong>

              </div>


              <div className="round-display">
                ROUND {game.round}
              </div>


              <div
                className={
                  game.team === "BLUE"
                    ? "team-score active blue"
                    : "team-score blue"
                }
              >

                <span>
                  🔵 BLUE
                </span>

                <strong>
                  {game.scoreBlue}
                </strong>

              </div>


            </div>


            <div className="current-team">

              <span>
                CURRENT TEAM
              </span>

              <strong>
                {game.team === "RED"
                  ? "🔴 RED TEAM"
                  : "🔵 BLUE TEAM"}
              </strong>

            </div>


            <div className="host-answer">

              <div className="answer-label">
                SECRET ANSWER
              </div>

              <div className="answer">
                {selected.answer}
              </div>

            </div>


            <div className="host-clues-title">
              CLICK A CLUE TO SHOW IT ON PROJECTOR
            </div>


            <div className="host-clues">

              {selected.clues.map(
                (clue, index) => (

                  <button
                    key={index}
                    className="host-clue"
                    onClick={() =>
                      showClue(clue, index)
                    }
                  >

                    <div className="host-clue-number">
                      CLUE {index + 1}
                    </div>

                    <div className="host-clue-image">

                      <img
                        src={clue.image}
                        alt={clue.text}
                      />

                    </div>

                    <div className="host-clue-text">
                      {clue.text}
                    </div>

                  </button>

                )
              )}

            </div>


            {game.activeClue && (

              <div className="answer-controls">

                <button
                  className="correct-button"
                  onClick={correctAnswer}
                >
                  ✅ CORRECT +10
                </button>

                <button
                  className="wrong-button"
                  onClick={wrongAnswer}
                >
                  ❌ WRONG
                </button>

              </div>

            )}


            <div className="host-controls">

              <button
                className="hide-button"
                onClick={hideClue}
                disabled={!game.activeClue}
              >
                👁 Hide Clue
              </button>


              <button
                className="switch-button"
                onClick={switchTeam}
                disabled={!!game.activeClue}
              >
                🔄 Switch Team
              </button>


              <button
                className="reset-button"
                onClick={resetGame}
              >
                🔄 Reset Game
              </button>


              <button
                className="round-button"
                onClick={nextRound}
              >
                ➡️ Next Round
              </button>

            </div>


          </section>

        )}

      </main>

    </div>

  );
}


export default Host;