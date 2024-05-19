import "./RotatingText.css";
import React, {useEffect} from "react";

export const RotatingText = () => {

    useEffect(() => {
        let words = document.querySelectorAll(".word");
        words.forEach((word: any) => {
            let letters = word.textContent.split("");
            word.textContent = '';
            letters.forEach((letter: any) => {
                let span = document.createElement("span");
                span.textContent = letter;
                span.className = "letter";
                word.append(span);
            });
        });

        let currentWordIndex = 0;
        let maxWordIndex = words.length - 1;
        (words[currentWordIndex] as HTMLElement).style.opacity = "1";

        let rotateText = () => {
            let currentWord = words[currentWordIndex];
            let nextWord =
                currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
            // rotate out letters of current word
            Array.from(currentWord.children).forEach((letter: any, i: number) => {
                setTimeout(() => {
                    letter.className = "letter out";
                }, i * 80);
            });
            // reveal and rotate in letters of next word
            (nextWord as HTMLElement).style.opacity = "1";
            Array.from(nextWord.children).forEach((letter: any, i: number) => {
                letter.className = "letter behind";
                setTimeout(() => {
                    letter.className = "letter in";
                }, 340 + i * 80);
            });
            currentWordIndex =
                currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
        };

        rotateText();
        setInterval(rotateText, 4000);

    }, []);

    return <div className="rotating-text">
        <p>discover &nbsp;</p>
        <p>
            <span className="word alizarin">answers.</span>
            <span className="word wisteria">memes.</span>
            <span className="word peter-river">Bible.</span>
            <span className="word emerald">people.</span>
            <span className="word sun-flower">nostr.</span>
        </p>
    </div>
};