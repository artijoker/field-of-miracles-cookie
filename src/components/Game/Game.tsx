import React, { Component, HTMLAttributes, ChangeEvent } from "react";
import { Cookies } from "react-cookie";
import './Game.css';
import Data from './../../data/data.json';

interface Props {
    cookies: Cookies;
    addNewRecord: (name: string, score: number) => void;
}

interface State {
    question: string;
    answer: string;
    partialAnswer: string;
    inputValue: string;
    score: number;
    isOneLetter: boolean;
    isBlockInput: boolean;
    isOnGame: boolean;
    [key: string]: any;
}

class Game extends Component<Props & HTMLAttributes<HTMLDivElement>, State> {

    private currentIndex?: number;
    private remainingAttempts: number;
    private addNewRecord: (name: string, score: number) => void;
    private cookies: Cookies;

    constructor(props: Props) {
        super(props);

        this.addNewRecord = props.addNewRecord;
        this.cookies = props.cookies;
        let gameData = this.cookies.get("gameData");
        
        if (!gameData) {
            //console.log("Not Cookie");
            this.remainingAttempts = 5;
            this.currentIndex = undefined;

            this.state = {
                question: "",
                answer: "",
                partialAnswer: "",
                inputValue: "",
                score: 0,
                isOneLetter: true,
                isBlockInput: false,
                isOnGame: false
            }
        }
        else {
            //console.log("Cookie");
            this.remainingAttempts = gameData.remainingAttempts;
            this.currentIndex = gameData.currentIndex;

            this.state = {
                question: gameData.question,
                answer: gameData.answer,
                partialAnswer: gameData.partialAnswer,
                inputValue: gameData.inputValue,
                score: gameData.score,
                isOneLetter: gameData.isOneLetter,
                isBlockInput: gameData.isBlockInput,
                isOnGame: gameData.isOnGame
            }
        }
    }

    private isWordOpen = () => !this.state.partialAnswer.includes("-");

    render() {
        if (!this.state.isOnGame) {
            return (
                <div className="Game">
                    <button onClick={() => {
                        this.setQuestionAndAnswer();
                        this.setState({
                            isOnGame: true,
                            inputValue: "",
                            score: 0,
                            isOneLetter: true,
                            isBlockInput: false
                        })
                    }}>
                        ?????????? ????????
                    </button>
                    <div className="question">
                        <p>
                            ?????????? ???????????????????? ?? ???????? "???????? ??????????".<br />
                            ?? ???????? ???????? ?????? ?????????????????? ?????????????????? ??????????.
                            ?????????????? ?????????? ???????? ?????????? ?????? ?????????? ??????????????.<br />
                            ???? ???????????? ???????????????????? ?????????? ?????? ?????????? ?????????????????????? ????????.<br />
                            ???? ???????????? ???????????????????????? ?????????? ?? ?????? ?????????? ?????????????????? ???????? ?? ??????????????,
                            ?????????? ?????????????? {this.remainingAttempts}.<br />
                            ?????????? ???????????????????? ?????????????? ???????? ????????????????????.<br />
                            ???????? ???????????? ?????????? ?????????????? ?? ?????? ???????????????? ???????????? ???? ???????????????? ???????????????????????????? ????????<br />
                            ?????????? ???????????? ???? ?????????????? ?????? ???????? ?? ???????? ????????????????????.
                        </p>
                    </div>
                    <div className="letters">
                        <div className="letter">??</div>
                        <div className="letter">??</div>
                        <div className="letter">??</div>
                        <div className="letter">??</div>
                        <div className="letter"> </div>
                        <div className="letter">??</div>
                        <div className="letter">??</div>
                        <div className="letter">??</div>
                        <div className="letter">??</div>
                        <div className="letter">??</div>
                    </div>

                </div>
            );
        }
        let letters = this.getLetters();

        return (
            <div className="Game">

                <button disabled={!this.isWordOpen()}
                    onClick={
                        () => this.saveRecord()
                    }>
                    ?????????????????? ????????
                </button>
                <button disabled={!this.isWordOpen()}
                    onClick={
                        () => {
                            this.setState({
                                isBlockInput: false,
                                isOneLetter: true,
                            });
                            this.setQuestionAndAnswer();
                        }}>
                    ?????????????????? ??????????
                </button>
                <button onClick={
                    () => {
                        this.cookies.remove("gameData");
                        this.setState({
                            isOnGame: false
                        });
                    }}>
                    ?????????? ????????
                </button>
                <div className="score">????????: {this.state.score}</div>
                <div className="question">
                    {this.state.question}
                </div>
                <div className="letters">
                    {letters}
                </div>
                <div>
                    <button disabled={this.state.isOneLetter}
                        onClick={() => {
                            if (this.state.inputValue !== "")
                                this.setState({
                                    inputValue: this.state.inputValue[0],
                                    isOneLetter: !this.state.isOneLetter
                                });
                            else
                                this.setState({
                                    isOneLetter: !this.state.isOneLetter
                                });
                        }}>
                        ???????? ???? ?????????? ??????????
                    </button>
                    <button disabled={!this.state.isOneLetter}
                        onClick={() => {
                            this.setState({
                                isOneLetter: !this.state.isOneLetter
                            });
                        }}>
                        ???????? ?????????? ??????????????
                    </button>
                </div>
                <div>
                    <p>
                        <input disabled={this.state.isBlockInput}
                            type="text"
                            name="inputValue"
                            value={this.state.inputValue}
                            onChange={this.onChangeInput}
                        />
                    </p>
                    <p>
                        <button disabled={this.state.isBlockInput}
                            onClick={() => {
                                this.checkWin();
                            }}>
                            ??????????????????
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        let value = event.target.value;

        //console.log(name);
        if (this.state.isOneLetter) {
            if (value.length > 1)
                return;
            this.setState({ [name]: value });
        }
        else {
            if (value.length > this.state.answer.length)
                return;
            this.setState({ [name]: value });
        }
    }

    checkWin = () => {
        if (this.state.inputValue === "") {
            if (this.state.isOneLetter)
                alert("?????????????? ??????????!");
            else
                alert("?????????????? ??????????!");
            
            return;
        }

        let answer = this.state.answer.toLowerCase();
        let partialAnswer = this.state.partialAnswer.toLowerCase();
        let value = this.state.inputValue.toLowerCase();

        if (this.state.isOneLetter) {

            if (partialAnswer.includes(value)) {
                alert("?????????? ?????????? ?????? ??????????????!");
                this.setState({ inputValue: "" });
                return;
            }

            if (answer.includes(value)) {

                let matchesNumber = 0;
                for (let i = 0; i < answer.length; i++) {
                    const letter = answer[i];
                    if (value === letter) {
                        partialAnswer = this.setCharAt(partialAnswer, i, value)
                        ++matchesNumber;
                    }
                }
                let newScore = this.state.score + 100 * matchesNumber;
                //console.log(partialAnswer);

                if (!partialAnswer.includes("-")) {
                    alert("??????????????????????, ???? ???????????????? ??????????!");
                    this.setState({
                        inputValue: "",
                        score: newScore,
                        partialAnswer: partialAnswer,
                        isBlockInput: true
                    });
                }
                else {
                    this.setState({
                        inputValue: "",
                        partialAnswer: partialAnswer,
                        score: newScore
                    })
                }
            }
            else {
                this.remainingAttempts -= 1;
                if (this.remainingAttempts === 0) {
                    alert(`?? ?????????????????? ?????????? ?????????? ??????. ?????? ???????? ???????? ?????????????????? ??????????????. ???????? ????????????????.`);
                    this.saveRecord();
                    return;
                }
                else {
                    alert(`?? ??????????????????, ?????????? ???? ????????????! ???????????????? ?????????????? ${this.remainingAttempts}.`);
                    this.setState({
                        inputValue: "",
                        score: this.state.score > 50 ? this.state.score - 50 : this.state.score
                    });
                }

            }
        }
        else {
            if (answer === value) {
                let flag = true;

                for (let i = 0; i < partialAnswer.length; i++) {
                    if (partialAnswer[i] !== "-") {
                        flag = false;
                        break;
                    }
                }

                let extraScores = flag ? 3000 : 1000;
                alert(`??????????????????????, ???? ???????????????? ??????????! ???? ?????????????????? ${extraScores} ????????????!`);

                this.setState({
                    inputValue: "",
                    score: this.state.score + extraScores,
                    isBlockInput: true,
                    partialAnswer: value
                });
            }
            else {
                alert("?? ??????????????????, ?????????? ???? ????????????! ???? ?????????????? ?????? ??????????. ???????? ????????????????.");
                this.cookies.remove("gameData")
                this.setState({
                    isOnGame: false
                });
            }
        }
    }

    saveRecord = () => {
        let message = `?????? ?????????????????? ${this.state.score} ????????????. ?????????????? ?????? ???????? ???????????? ?????????????????? ?????????????????? ?? ?????????????? ????????????????`;
        let name = prompt(message, '');
        if (name !== null && name !== "")
            this.addNewRecord(name, this.state.score);

        this.cookies.remove("gameData")
        this.setState({
            isOnGame: false
        });

    }

    setQuestionAndAnswer = () => {
        if (this.currentIndex === undefined)
            this.currentIndex = Math.floor((Math.random() * Data.length) + 0);
        else
            this.currentIndex = this.currentIndex === Data.length - 1 ? 0 : this.currentIndex + 1

        this.setState({
            question: Data[this.currentIndex].question,
            answer: Data[this.currentIndex].answer,
            partialAnswer: '-'.repeat(Data[this.currentIndex].answer.length)
        });
    }

    getLetters = () => {
        let letters = [];

        for (let i = 0; i < this.state.partialAnswer.length; i++) {
            const char = this.state.partialAnswer[i];

            if (char === "-")
                letters.push(<div key={i} className="letter"></div>)
            else
                letters.push(<div key={i} className="letter">{char.toUpperCase()}</div>)
        }
        return letters;
    }

    setCharAt = (string: string, index: number, char: string) => {
        if (index > string.length - 1)
            return string;

        return string.substring(0, index) + char + string.substring(index + 1);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        //let { cookies } = this.props;

        if (this.state.isOnGame) {

            let oldGameData = JSON.stringify(this.cookies.get("gameData"));
            let newGameData = JSON.stringify({
                question: this.state.question,
                answer: this.state.answer,
                partialAnswer: this.state.partialAnswer,
                inputValue: this.state.inputValue,
                score: this.state.score,
                isOneLetter: this.state.isOneLetter,
                isBlockInput: this.state.isBlockInput,
                isOnGame: this.state.isOnGame,
                remainingAttempts: this.remainingAttempts,
                currentIndex: this.currentIndex
            });

            if (newGameData !== oldGameData)
                this.cookies.set("gameData", newGameData, { path: "/" });
        }

    }
}

export default Game;