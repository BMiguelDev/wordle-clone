import React from "react";

import styles from "./Line.module.scss";

interface PropTypes {
    line: string;
    lineClassNames: string[][];
    index: number;
    wordLength: number;
    numberStages: number;
    setLineClassNames: React.Dispatch<React.SetStateAction<string[][]>>;
    isGameFinished: boolean;
    randomWord: string;
    isGameNotification: boolean;
}

const MAX_GAME_BOARD_HEIGHT: number = 23;
const MAX_GAME_BOARD_WIDTH: number = 23.125;

export default function Line({
    line,
    lineClassNames,
    index,
    wordLength,
    numberStages,
    setLineClassNames,
    isGameFinished,
    randomWord,
    isGameNotification,
}: PropTypes) {
    function handleAnimationEnd(i: number) {
        if (lineClassNames[index][i].includes("shake")) {
            setLineClassNames((prevLineClassNames) => {
                let newLineClassNames = [...prevLineClassNames];
                newLineClassNames[index][i] = "tile";
                return newLineClassNames;
            });
        } else if (lineClassNames[index][i].includes("tick")) {
            setLineClassNames((prevLineClassNames) => {
                let newLineClassNames = [...prevLineClassNames];
                newLineClassNames[index][i] = "tile";
                return newLineClassNames;
            });
        } else if (lineClassNames[index][i].includes("correct_animation") && isGameFinished) {
            console.log("Im in if 111111");
            setLineClassNames((prevLineClassNames) => {
                let newLineClassNames = [...prevLineClassNames];
                newLineClassNames[index][i] = "tile green";
                return newLineClassNames;
            });
        } else if (line === randomWord && isGameFinished && isGameNotification) {
            console.log("Im in if 2222222");
            setLineClassNames((prevLineClassNames) => {
                let newLineClassNames = [...prevLineClassNames];
                newLineClassNames[index][i] = "tile green correct_animation";
                return newLineClassNames;
            });
        } else return;
    }
    console.log("Random Word", randomWord);

    function getClassName(i: number) {
        // For each class in lineClassNames[index][i] string, we need a singular `styles.thatString`, hence the confusing code below
        // Also we are adding a "border_highlight" className to all tiles that currently have a letter
        return `${lineClassNames[index][i]
            .split(" ")
            .map((eachClass) => styles[eachClass])
            .toString()
            .replaceAll(",", " ")} ${line[i] ? styles.border_highlight : ""}`;
    }

    function getStyle(i: number) {
        const maxWidthHeightMultiplier = Math.max(wordLength, numberStages);
        return !lineClassNames[index][i].includes("shake") && !lineClassNames[index][i].includes("tick") // Probably add a condition here to make translate animation only start after the others have stopped
            ? !lineClassNames[index][i].includes("correct_animation")
                ? {
                      animationDelay: isGameFinished && !isGameNotification ? `${i * 0.1}s` : `${i * 0.2}s`,
                      width: `${MAX_GAME_BOARD_WIDTH / maxWidthHeightMultiplier}rem`,
                      height: `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`,
                  }
                : {
                      animationDelay:
                          //isGameFinished && !isGameNotification ? `${i * 0.1}s` : `${i * 0.2}s, ${wordLength * 0.2}s`,
                          `${i * 0.2}s, ${wordLength * 0.2}s`,
                      width: `${MAX_GAME_BOARD_WIDTH / maxWidthHeightMultiplier}rem`,
                      height: `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`,
                  }
            : {
                  width: `${MAX_GAME_BOARD_WIDTH / maxWidthHeightMultiplier}rem`,
                  height: `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`,
              };
    }


    let tileArray = [];
    for (let i = 0; i < wordLength; i++) {
        tileArray.push(
            <div
                key={i}
                style={getStyle(i)}
                onAnimationEnd={() => handleAnimationEnd(i)}
                className={getClassName(i)}
            >
                <p className={styles.letter}>{line[i]}</p>
            </div>
        );
    }

    return <div className={styles.tile_row}>{tileArray}</div>;
}
