import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./Line.module.scss";

interface PropTypes {
    line: string;
    lineClassNames: string[][];
    index: number;
    wordLength: number;
    numberStages: number;
    setLineClassNames: React.Dispatch<React.SetStateAction<string[][]>>;
}

// const MAX_GAME_BOARD_HEIGHT: number = window.innerWidth > 500 ? 23 : 16;
// const MAX_GAME_BOARD_WIDTH: number = window.innerWidth > 500 ? 23.125 : 16;
// const MAX_TILE_FONT_SIZE: number = window.innerWidth > 500 ? 12 : 7.5;

// const MAX_GAME_BOARD_HEIGHT: number = 23;
// const MAX_GAME_BOARD_WIDTH: number = 23.125;
// const MAX_TILE_FONT_SIZE: number = 12;

export default function Line({ line, lineClassNames, index, wordLength, numberStages, setLineClassNames }: PropTypes) {
    // Function that returns the optimal game board sizes (in rem) based on window width and height
    const getMaxGameBoardSizes = useCallback(() => {
        if (window.innerWidth < 501 && window.innerHeight > 500)
            return {
                maxGameBoardHeight: wordLength > 6 && wordLength >= numberStages * 2 ? 12 : 16,
                maxGameBoardWidth: 16,
                maxTileFontSize: wordLength > 6 && wordLength >= numberStages * 2 ? 5.5 : 7.5,
            };
        else if (window.innerWidth > 500 && window.innerWidth < 1001 && window.innerHeight < 651)
            if (numberStages > 6) {
                return numberStages < 9
                    ? {
                          maxGameBoardHeight: 18,
                          maxGameBoardWidth: 18,
                          maxTileFontSize: 7.5,
                      }
                    : numberStages < 11
                    ? {
                          maxGameBoardHeight: 22,
                          maxGameBoardWidth: 22,
                          maxTileFontSize: 9.5,
                      }
                    : {
                          maxGameBoardHeight: 24,
                          maxGameBoardWidth: 24,
                          maxTileFontSize: 12,
                      };
            } else
                return {
                    maxGameBoardHeight: 12,
                    maxGameBoardWidth: 12,
                    maxTileFontSize: 5.75,
                };
        /* TODO */ else
            return {
                maxGameBoardHeight: 23,
                maxGameBoardWidth: 23.125,
                maxTileFontSize: 12,
            };
    }, [numberStages, wordLength]);

    const [gameBoardMaxSizes, setgameBoardMaxSizes] = useState(getMaxGameBoardSizes());

    useEffect(() => {
        const handleChangeGameboardMaxSizes = () => setgameBoardMaxSizes(getMaxGameBoardSizes());
        setgameBoardMaxSizes(getMaxGameBoardSizes());

        window.addEventListener("resize", handleChangeGameboardMaxSizes);

        return () => {
            window.removeEventListener("resize", handleChangeGameboardMaxSizes);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getMaxGameBoardSizes]);

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
        let dynamicDivisor: number;

        // Conditionals to compute the divisor that delivers the optimal tile size for each game setting
        if (numberStages < 3) {
            dynamicDivisor =
                wordLength < 5
                    ? maxWidthHeightMultiplier + 1
                    : wordLength < 7
                    ? maxWidthHeightMultiplier / 1.2
                    : wordLength < 9
                    ? maxWidthHeightMultiplier / 1.55
                    : maxWidthHeightMultiplier / 2;
        } else if (numberStages < 10) {
            switch (numberStages) {
                case 9:
                    dynamicDivisor =
                        wordLength > numberStages ? maxWidthHeightMultiplier / 1.05 : maxWidthHeightMultiplier + 0.5;
                    break;
                case 8:
                    dynamicDivisor =
                        wordLength > numberStages ? maxWidthHeightMultiplier / 1.1 : maxWidthHeightMultiplier + 0.25;
                    break;
                case 7:
                    dynamicDivisor =
                        wordLength > numberStages
                            ? wordLength > 8
                                ? maxWidthHeightMultiplier / 1.25
                                : maxWidthHeightMultiplier / 1.1
                            : maxWidthHeightMultiplier + 0.25;
                    break;
                case 6:
                    dynamicDivisor =
                        wordLength > numberStages
                            ? wordLength > 8
                                ? maxWidthHeightMultiplier / 1.5
                                : maxWidthHeightMultiplier / 1.175
                            : maxWidthHeightMultiplier;
                    break;
                case 5:
                    dynamicDivisor =
                        wordLength > numberStages
                            ? wordLength > 7
                                ? maxWidthHeightMultiplier / 1.6
                                : maxWidthHeightMultiplier / 1.2
                            : maxWidthHeightMultiplier;
                    break;
                case 4:
                    dynamicDivisor =
                        wordLength > numberStages
                            ? wordLength > 7
                                ? maxWidthHeightMultiplier / 1.7
                                : wordLength > 5
                                ? maxWidthHeightMultiplier / 1.3
                                : maxWidthHeightMultiplier
                            : maxWidthHeightMultiplier + 1;
                    break;
                case 3:
                    dynamicDivisor =
                        wordLength > 9
                            ? maxWidthHeightMultiplier / 2
                            : wordLength > 7
                            ? maxWidthHeightMultiplier / 1.75
                            : wordLength > 5
                            ? maxWidthHeightMultiplier / 1.35
                            : wordLength > 4
                            ? maxWidthHeightMultiplier / 1.05
                            : maxWidthHeightMultiplier + 1;
                    break;
                default:
                    dynamicDivisor = maxWidthHeightMultiplier;
                    break;
            }
        } else dynamicDivisor = maxWidthHeightMultiplier + 1;

        // const widthStyle: string = `${MAX_GAME_BOARD_WIDTH / dynamicDivisor}rem`;
        // const heightStyle: string = `${MAX_GAME_BOARD_HEIGHT / dynamicDivisor}rem`;
        // const fontSizeStyle: string = `${MAX_TILE_FONT_SIZE / dynamicDivisor}rem`;

        if (window.innerWidth < 501 && window.innerHeight > 500) dynamicDivisor = dynamicDivisor * 0.725;
        //else if (window.innerWidth > 500 && window.innerWidth < 1001 && window.innerHeight < 651) dynamicDivisor = dynamicDivisor * 0.725;

        const widthStyle: string = `${gameBoardMaxSizes.maxGameBoardWidth / dynamicDivisor}rem`;
        const heightStyle: string = `${gameBoardMaxSizes.maxGameBoardHeight / dynamicDivisor}rem`;
        const fontSizeStyle: string = `${gameBoardMaxSizes.maxTileFontSize / dynamicDivisor}rem`;

        const animationDelayStyle =
            !lineClassNames[index][i].includes("shake") && !lineClassNames[index][i].includes("tick")
                ? !lineClassNames[index][i].includes("green_correct_animation")
                    ? !lineClassNames[index][i].includes("faster_animation")
                        ? `${i * 0.2}s`
                        : `${i * 0.1}s`
                    : `${i * 0.2}s, ${i * 0.2}s, ${(wordLength - 1) * 0.2 + 0.6 + i * 0.1}s`
                : `0s`;

        return {
            animationDelay: animationDelayStyle,
            width: widthStyle,
            height: heightStyle,
            fontSize: fontSizeStyle,
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
