import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props: { value: string, onClick: () => void }) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function renderSquare(value: string, onClick: () => void) {
  return <Square
    value={value}
    onClick={onClick}
  />;
}
class Board extends React.Component<{ squares: Array<string>, onClick: (i: number) => void }> {
  render() {
    return (
      <div>
        <div className="board-row">
          {renderSquare(this.props.squares[0], () => this.props.onClick(0))}
          {renderSquare(this.props.squares[1], () => this.props.onClick(1))}
          {renderSquare(this.props.squares[2], () => this.props.onClick(2))}
        </div>
        <div className="board-row">
          {renderSquare(this.props.squares[3], () => this.props.onClick(3))}
          {renderSquare(this.props.squares[4], () => this.props.onClick(4))}
          {renderSquare(this.props.squares[5], () => this.props.onClick(5))}
        </div>
        <div className="board-row">
          {renderSquare(this.props.squares[6], () => this.props.onClick(6))}
          {renderSquare(this.props.squares[7], () => this.props.onClick(7))}
          {renderSquare(this.props.squares[8], () => this.props.onClick(8))}
        </div>
      </div>
    );
  }
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
