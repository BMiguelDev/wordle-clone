import React from "react";
import styles from './Line.module.scss';

interface LineProps {
    line: string;
    lineClassNames: string[][];
    index: number;
    wordLength: number;
}

export function Line({ line, lineClassNames, index, wordLength }: LineProps) {
    
    let tileArray = [];
    for (let i = 0; i < wordLength; i++) {
        tileArray.push(
            // For each class in lineClassNames[index][i] string, we need a singular `styles.thatString`, hence the confusing code below
            <div key={i} className={lineClassNames[index][i].split(' ').map(eachClass => { return styles[eachClass]}).toString().replaceAll(',', ' ')}>
                {<p className={styles.letter}>{line[i]}</p>}
            </div>
        );
    }

    return <div className={styles.tile_row}>{tileArray}</div>;
}
