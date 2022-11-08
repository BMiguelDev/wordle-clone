import React from "react";

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
            <div className={lineClassNames[index][i]} key={i}>
                {<p className="letter">{line[i]}</p>}
            </div>
        );
    }

    return <div className="tile_row">{tileArray}</div>;
}
