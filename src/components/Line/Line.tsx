import React, { useRef } from "react";

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
const MAX_TILE_FONT_SIZE: number = 12;

export default function Line({
    line,
    lineClassNames,
    index,
    wordLength,
    numberStages,
    setLineClassNames
}:
PropTypes) {
    const tileDivRef = useRef<HTMLDivElement>(null);

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
        return !lineClassNames[index][i].includes("shake") && !lineClassNames[index][i].includes("tick")
            ? !lineClassNames[index][i].includes("green_correct_animation")
                ? {
                      animationDelay: !lineClassNames[index][i].includes("faster_animation")
                          ? `${i * 0.2}s`
                          : `${i * 0.1}s`,
                      width: numberStages<8 ? (wordLength>numberStages*1.75 ? `${(MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier+2)}rem` : `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`) : `${MAX_GAME_BOARD_WIDTH / (maxWidthHeightMultiplier+1)}rem`,
                      height: numberStages<8 ? (wordLength>numberStages*1.75 ? `${(MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier+2)}rem` : `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`) : `${MAX_GAME_BOARD_HEIGHT / (maxWidthHeightMultiplier+1)}rem`,
                      'font-size': `${MAX_TILE_FONT_SIZE/maxWidthHeightMultiplier}rem`
                  }
                : {
                      animationDelay: `${i * 0.2}s, ${i * 0.2}s, ${(wordLength - 1) * 0.2 + 0.6 + i * 0.1}s`,
                      width: numberStages<8 ? (wordLength>numberStages*1.75 ? `${(MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier+2)}rem` : `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`) : `${MAX_GAME_BOARD_WIDTH / (maxWidthHeightMultiplier+1)}rem`,
                      height: numberStages<8 ? (wordLength>numberStages*1.75 ? `${(MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier+2)}rem` : `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`) : `${MAX_GAME_BOARD_HEIGHT / (maxWidthHeightMultiplier+1)}rem`,
                      'font-size': `${MAX_TILE_FONT_SIZE/maxWidthHeightMultiplier}rem`
                  }
            : {
                width: numberStages<8 ? (wordLength>numberStages*1.75 ? `${(MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier+2)}rem` : `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`) : `${MAX_GAME_BOARD_WIDTH / (maxWidthHeightMultiplier+1)}rem`,
                height: numberStages<8 ? (wordLength>numberStages*1.75 ? `${(MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier+2)}rem` : `${MAX_GAME_BOARD_HEIGHT / maxWidthHeightMultiplier}rem`) : `${MAX_GAME_BOARD_HEIGHT / (maxWidthHeightMultiplier+1)}rem`,
                'font-size': `${MAX_TILE_FONT_SIZE/maxWidthHeightMultiplier}rem`
                };
    }

    let tileArray = [];
    for (let i = 0; i < wordLength; i++) {
        tileArray.push(
            <div
                ref={tileDivRef}
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
