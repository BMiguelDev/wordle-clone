import React from "react";

import styles from "./Line.module.scss";

interface LineProps {
    line: string;
    lineClassNames: string[][];
    index: number;
    wordLength: number;
    setLineClassNames: React.Dispatch<React.SetStateAction<string[][]>>;
}

export default function Line({ line, lineClassNames, index, wordLength, setLineClassNames }: LineProps) {

    function handleAnimationEnd(i: number) {
        if (lineClassNames[index][i].includes('shake')) {
            setLineClassNames(prevLineClassNames => {
                let newLineClassNames = [...prevLineClassNames];
                newLineClassNames[index][i]="tile";
                return newLineClassNames;
            })
        } else return;
    }

    let tileArray = [];
    for (let i = 0; i < wordLength; i++) {
        tileArray.push(
            <div
                key={i}
                style={(!lineClassNames[index][i].includes("shake") && (!lineClassNames[index][i].includes("tick"))) ? {
                    animationDelay: `${i * 0.2}s`,
                } : {}}
                onAnimationEnd={() => handleAnimationEnd(i)}
                // For each class in lineClassNames[index][i] string, we need a singular `styles.thatString`, hence the confusing code below
                className={lineClassNames[index][i]
                    .split(" ")
                    .map((eachClass) => styles[eachClass])
                    .toString()
                    .replaceAll(",", " ")}
            >
                <p className={styles.letter}>{line[i]}</p>
            </div>
        );
    }

    return <div className={styles.tile_row}>{tileArray}</div>;
}
