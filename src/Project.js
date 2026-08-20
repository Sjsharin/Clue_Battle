import { useEffect, useState } from "react";

import {
  doc,
  onSnapshot
} from "firebase/firestore";

import { db } from "./firebase";

import "./Project.css";


function Project() {

  const [game, setGame] = useState(null);


  useEffect(() => {

    const gameRef = doc(
      db,
      "games",
      "clue-battle"
    );


    const unsubscribe = onSnapshot(
      gameRef,

      (snapshot) => {

        if (snapshot.exists()) {

          setGame(snapshot.data());

        } else {

          setGame(null);

        }

      },

      (error) => {

        console.error(
          "Project Firebase error:",
          error
        );

      }
    );


    return () => unsubscribe();

  }, []);


  /*
   * WAITING SCREEN
   */

  if (!game) {

    return (

      <div className="project-screen">

        <div className="project-waiting">

          <div className="project-logo">
            🎯 CLUE BATTLE
          </div>

          <p>
            Waiting for Host...
          </p>

        </div>

      </div>

    );

  }


  /*
   * PROJECT SCREEN
   */

  return (

    <div className="project-screen">


      <div className="project-top">

        <div className="project-logo">
          🎯 CLUE BATTLE
        </div>


        <div className="project-round">
          ROUND {game.round || 1}
        </div>

      </div>


      <div className="project-content">


        <div className="project-team">

          {game.team || "RED"} TEAM

        </div>


        <div className="project-category">

          <span>
            {game.categoryIcon}
          </span>

          <span>
            {game.category}
          </span>

        </div>


        {!game.activeClue && (

          <div className="choose-message">

            <div>
              👀
            </div>

            <h1>
              CHOOSE YOUR CLUE
            </h1>

          </div>

        )}


        {game.activeClue && (

          <div className="public-clue">


            <div className="big-clue-image">

              <img
                src={game.activeClue.image}
                alt={game.activeClue.text}
              />

            </div>


            <div className="big-clue-text">

              {game.activeClue.text}

            </div>


          </div>

        )}


      </div>

    </div>

  );

}


export default Project;