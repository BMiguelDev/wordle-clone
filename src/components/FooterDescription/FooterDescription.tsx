import React from "react";
import styles from "./FooterDescription.module.scss";

export default function FooterDescription() {
    const date = new Date();
    let currentYear = date.getFullYear();

    return (
        <div className={styles.footer_container}>
            <div className={styles.footer_api_description}>
                <p>
                    Powered by{" "}
                    <a href="https://www.datamuse.com/api/" target="_blank" rel="noreferrer">
                        Datamuse API
                    </a>{" "}
                    and{" "}
                    <a href="https://dictionaryapi.dev/" target="_blank" rel="noreferrer">
                        Free Dictionary API
                    </a>
                </p>
            </div>
            <div className={styles.footer_design_description}>
                <p>
                    Design cloned from{" "}
                    <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noreferrer">
                        Wordle
                    </a>
                    {", "}
                    <a href="https://www.nytimes.com/" target="_blank" rel="noreferrer">
                        New York Times
                    </a>
                </p>
            </div>
            <div className={styles.footer_text_description}>
                <div className={styles.footer_text}>
                    <p>Copyright © {currentYear} Bruno Miguel</p>
                </div>
                <div className={styles.footer_icon_container}>
                    <a href="https://github.com/BMiguelDev/wordle-clone" target="_blank" rel="noreferrer">
                        <i className="fa-solid fa-code"></i>
                    </a>
                    <a href="https://google.com" target="_blank" rel="noreferrer">
                        <i className="fa-solid fa-desktop"></i>
                    </a>
                    <a href="https://github.com/BMiguelDev" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/miguel--bruno/" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}
