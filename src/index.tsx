import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props: { label: string, onClick: () => void }) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.label}
    </button>
  );
}

function Board(props: { squares: Array<string>, onClick: (i: number) => void }) {
  return (
    <div>
      <div className="board-row">
        <Square label={props.squares[0]} onClick={() => props.onClick(0)} />
        <Square label={props.squares[1]} onClick={() => props.onClick(1)} />
        <Square label={props.squares[2]} onClick={() => props.onClick(2)} />
      </div>
      <div className="board-row">
        <Square label={props.squares[3]} onClick={() => props.onClick(3)} />
        <Square label={props.squares[4]} onClick={() => props.onClick(4)} />
        <Square label={props.squares[5]} onClick={() => props.onClick(5)} />
      </div>
      <div className="board-row">
        <Square label={props.squares[6]} onClick={() => props.onClick(6)} />
        <Square label={props.squares[7]} onClick={() => props.onClick(7)} />
        <Square label={props.squares[8]} onClick={() => props.onClick(8)} />
      </div>
    </div>
  );
}

class Game extends React.Component<{}, { history: Array<Array<string>>, xIsNext: boolean, step: number }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [Array(9).fill(null!)],
      xIsNext: true,
      step: 0,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.step + 1);
    const squares = history[history.length - 1].slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Update the history
    this.setState({
      history: this.state.history.concat([squares]),
      xIsNext: !this.state.xIsNext,
      step: history.length,
    });

  }

  jumpTo(step: number) {
    this.setState({
      step: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const winner = calculateWinner(this.state.history[this.state.step]);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = this.state.history.map((step: Array<string>, move: number) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.history[this.state.history.length - 1]}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: Array<string>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// @ts-ignore
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(<Game />);
