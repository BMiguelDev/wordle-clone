import React from "react";

import styles from "./Line.module.scss";

interface PropTypes {
    line: string;
    lineClassNames: string[][];
    index: number;
    wordLength: number;
    numberStages: number;
    setLineClassNames: React.Dispatch<React.SetStateAction<string[][]>>;
}

const MAX_GAME_BOARD_HEIGHT: number = 23;
const MAX_GAME_BOARD_WIDTH: number = 23.125;


export default function Line({ line, lineClassNames, index, wordLength, numberStages, setLineClassNames }: PropTypes) {
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
        } else return;
    }

    let tileArray = [];
    for (let i = 0; i < wordLength; i++) {
        const maxWidthHeightMultiplier = Math.max(wordLength, numberStages);
        tileArray.push(
            <div
                key={i}
                style={
                    !lineClassNames[index][i].includes("shake") && !lineClassNames[index][i].includes("tick")
                        ? {
                              animationDelay: `${i * 0.2}s`,
                              width: `${MAX_GAME_BOARD_WIDTH/maxWidthHeightMultiplier}rem`,
                              height: `${MAX_GAME_BOARD_HEIGHT/maxWidthHeightMultiplier}rem`,
                          }
                        : {
                              width: `${MAX_GAME_BOARD_WIDTH/maxWidthHeightMultiplier}rem`,
                              height: `${MAX_GAME_BOARD_HEIGHT/maxWidthHeightMultiplier}rem`,
                          }
                }
                onAnimationEnd={() => handleAnimationEnd(i)}
                // For each class in lineClassNames[index][i] string, we need a singular `styles.thatString`, hence the confusing code below
                // Also we are adding a "border_highlight" className to all tiles that currently have a letter
                className={`${lineClassNames[index][i]
                    .split(" ")
                    .map((eachClass) => styles[eachClass])
                    .toString()
                    .replaceAll(",", " ")} ${line[i] ? styles.border_highlight : ""}`}
            >
                <p className={styles.letter}>{line[i]}</p>
            </div>
        );
    }

    return <div className={styles.tile_row}>{tileArray}</div>;
}
