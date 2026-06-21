const jpWordElement = document.getElementById("jpWord");
const wordElement = document.getElementById("word");
const inputElement = document.getElementById("input");
const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");
const multiplierElement = document.getElementById("multiplier");
const kpsElement =document.getElementById("kps");
const timeElement = document.getElementById("time");
const startButton =
    document.getElementById(
        "startButton"
    );

const countdownElement =
    document.getElementById(
        "countdown"
    );
let totalKeystrokes = 0;
let score = 0;
let combo = 0;
let timeLeft = 60;
let scoredLength = 0;
inputElement.disabled = true;

const typeSoundSrc = "type.mp3";
const clearSoundSrc = "clear.mp3";
const missSoundSrc = "miss.mp3";

function playSound(src, volume = 1) {

    const sound = new Audio(src);

    sound.volume = volume;

    sound.play().catch(() => {});
}

const ROMA_TABLE = {

    "あ":["a"],
    "い":["i"],
    "う":["u"],
    "え":["e"],
    "お":["o"],

    "か":["ka"],
    "き":["ki"],
    "く":["ku"],
    "け":["ke"],
    "こ":["ko"],

    "さ":["sa"],
    "し":["shi","si"],
    "す":["su"],
    "せ":["se"],
    "そ":["so"],

    "た":["ta"],
    "ち":["chi","ti"],
    "つ":["tsu","tu"],
    "て":["te"],
    "と":["to"],

    "な":["na"],
    "に":["ni"],
    "ぬ":["nu"],
    "ね":["ne"],
    "の":["no"],

    "は":["ha"],
    "ひ":["hi"],
    "ふ":["fu","hu"],
    "へ":["he"],
    "ほ":["ho"],

    "ま":["ma"],
    "み":["mi"],
    "む":["mu"],
    "め":["me"],
    "も":["mo"],

    "や":["ya"],
    "ゆ":["yu"],
    "よ":["yo"],

    "ら":["ra"],
    "り":["ri"],
    "る":["ru"],
    "れ":["re"],
    "ろ":["ro"],

    "わ":["wa"],
    "を":["wo"],

    "が":["ga"],
    "ぎ":["gi"],
    "ぐ":["gu"],
    "げ":["ge"],
    "ご":["go"],

    "ざ":["za"],
    "じ":["ji","zi"],
    "ず":["zu"],
    "ぜ":["ze"],
    "ぞ":["zo"],

    "だ":["da"],
    "ぢ":["di"],
    "づ":["du"],
    "で":["de"],
    "ど":["do"],

    "ば":["ba"],
    "び":["bi"],
    "ぶ":["bu"],
    "べ":["be"],
    "ぼ":["bo"],

    "ぱ":["pa"],
    "ぴ":["pi"],
    "ぷ":["pu"],
    "ぺ":["pe"],
    "ぽ":["po"],

    "きゃ":["kya"],
    "きゅ":["kyu"],
    "きょ":["kyo"],

    "しゃ":["sha","sya"],
    "しゅ":["shu","syu"],
    "しょ":["sho","syo"],

    "ちゃ":["cha","tya"],
    "ちゅ":["chu","tyu"],
    "ちょ":["cho","tyo"],

    "じゃ":["ja","jya","zya"],
    "じゅ":["ju","jyu","zyu"],
    "じょ":["jo","jyo","zyo"],

    "にゃ":["nya"],
    "にゅ":["nyu"],
    "にょ":["nyo"],

    "ひゃ":["hya"],
    "ひゅ":["hyu"],
    "ひょ":["hyo"],

    "みゃ":["mya"],
    "みゅ":["myu"],
    "みょ":["myo"],

    "りゃ":["rya"],
    "りゅ":["ryu"],
    "りょ":["ryo"],

    "ぎゃ":["gya"],
    "ぎゅ":["gyu"],
    "ぎょ":["gyo"],

    "びゃ":["bya"],
    "びゅ":["byu"],
    "びょ":["byo"],

    "ぴゃ":["pya"],
    "ぴゅ":["pyu"],
    "ぴょ":["pyo"],

    "ふぁ":["fa"],
    "ふぃ":["fi"],
    "ふぇ":["fe"],
    "ふぉ":["fo"],

    "てぃ":["thi","texi","teli"],
    "でぃ":["dhi","dexi","deli"],
    "ー": ["-"]
};

function getKanaTokens(kana) {

    const result = [];

    let i = 0;

    while (i < kana.length) {

        const two =
            kana.slice(i, i + 2);

        if (ROMA_TABLE[two]) {

            result.push(two);

            i += 2;

        } else {

            result.push(kana[i]);

            i++;
        }
    }

    return result;
}
function kanaToCandidates(kana) {

    const tokens =
        getKanaTokens(kana);

    let results = [""];

    for (let i = 0; i < tokens.length; i++) {

        const token = tokens[i];

       if (token === "ん") {

    const next =
        tokens[i + 1];

    const temp = [];

    results.forEach(base => {

        if (i === tokens.length - 1) {

            temp.push(base + "nn");
            temp.push(base + "xn");

        } else {

            temp.push(base + "n");
            temp.push(base + "nn");
            temp.push(base + "xn");
        }
    });

    results = temp;

    continue;
}

        if (token === "っ") {

            const next =
                tokens[i + 1];

            const nextRoma =
                ROMA_TABLE[next]?.[0];

            const temp = [];

            results.forEach(base => {

                if (nextRoma) {

                    temp.push(
                        base +
                        nextRoma[0]
                    );
                }

                temp.push(base + "xtu");
                temp.push(base + "ltu");

            });

            results = temp;

            continue;
        }

        const romas =
            ROMA_TABLE[token] ||
            [token];

        const temp = [];

        results.forEach(base => {

            romas.forEach(roma => {

                temp.push(
                    base + roma
                );

            });

        });

        results = temp;
    }

    return results;
}

let currentWord =
    words[
        Math.floor(
            Math.random() *
            words.length
        )
    ];

let currentCandidates =
    kanaToCandidates(
        currentWord.kana
    );

let currentRoma =
    currentCandidates[0];

function updateWordDisplay() {

    jpWordElement.textContent =
        currentWord.jp;

    const typed =
        inputElement.value;

    const correctPart =
        currentRoma.slice(
            0,
            typed.length
        );

    const remainingPart =
        currentRoma.slice(
            typed.length
        );

    wordElement.innerHTML =
        `<span class="correct">${correctPart}</span>${remainingPart}`;
}

updateWordDisplay();


inputElement.addEventListener(
    "input",
    () => {

        const typed =
            inputElement.value
                .toLowerCase();

        const candidate =
            currentCandidates.find(
                roma =>
                    roma.startsWith(
                        typed
                    )
            );

        if (candidate) {

            currentRoma =
                candidate;

            if (
                typed.length >
                scoredLength
            ) {

                const newChars =
                    typed.length -
                    scoredLength;

                for (
                    let i = 0;
                    i < newChars;
                    i++
                ) {

                    combo++;

                    const multiplier =
                        Math.min(
                            Math.pow(
                                1.1,
                                combo
                            ),
                            10
                        );

                    score +=
                        multiplier;

                    multiplierElement.textContent =
                        multiplier.toFixed(
                            2
                        );
                }

                playSound(
                    typeSoundSrc,
                    0.3
                );

                scoredLength =
                    typed.length;

                comboElement.textContent =
                    combo;

                scoreElement.textContent =
                    Math.floor(
                        score
                    );
            }

            updateWordDisplay();

            if (
                currentCandidates.includes(
                    typed
                )
            ) {

                playSound(
                    clearSoundSrc,
                    0.7
                );

                currentWord =
                    words[
                        Math.floor(
                            Math.random() *
                            words.length
                        )
                    ];

                currentCandidates =
                    kanaToCandidates(
                        currentWord.kana
                    );

                currentRoma =
                    currentCandidates[0];

                inputElement.value =
                    "";

                scoredLength = 0;

                updateWordDisplay();
            }

        } else {

            playSound(
                missSoundSrc,
                0.7
            );

            combo = 0;

            comboElement.textContent =
                "0";

            multiplierElement.textContent =
                "1.00";

            inputElement.value =
                typed.slice(
                    0,
                    -1
                );

            updateWordDisplay();
        }
    }
);
let timer;

startButton.addEventListener(
    "click",
    () => {

        startButton.style.display =
            "none";

        let count = 3;

        countdownElement.textContent =
            count;

        const countdown =
            setInterval(() => {

                count--;

                if (count > 0) {

                    countdownElement.textContent =
                        count;

                } else if (count === 0) {

                    countdownElement.textContent =
                        "START!";

                } else {

                    clearInterval(
                        countdown
                    );

                    countdownElement.textContent =
                        "";

                    inputElement.disabled =
                        false;

                    inputElement.focus();

                    timer =
                        setInterval(() => {

                            timeLeft--;

                            timeElement.textContent =
                                timeLeft;

                            if (
                                timeLeft <= 0
                            ) {

                                clearInterval(
                                    timer
                                );

                                inputElement.disabled =
                                    true;

                                alert(
                                    `Game Over!\nScore: ${Math.floor(score)}`
                                );
                            }

                        }, 1000);

                }

            }, 1000);

    }
);
document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        location.reload();

    }

});
document.addEventListener("keydown", (e) => {

    if (
        e.code === "Space" &&
        startButton.style.display !== "none"
    ) {

        e.preventDefault();

        startButton.click();

    }

});