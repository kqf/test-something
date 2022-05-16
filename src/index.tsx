import React from 'react';
import ReactDOM from 'react-dom';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import './index.css';

function Square(props: { label: string, onClick: () => void }) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{background: props.label}}
    >
      {props.label}
    </button>
  );
}

function Board(props: { squares: Array<string>, onClick: (i: number) => void, nRows: number }) {
  const tiles = props.squares.map((square, index) => {
    return (
      <Square label={square} onClick={() => props.onClick(index)} />
    );
  })

  const nTiles = Math.floor(tiles.length / props.nRows);
  const rows = Array.from({ length: props.nRows }, (x, i) => {
    return (
      <div className="board-row">
        {tiles.slice(i * nTiles, (i + 1) * nTiles)}
      </div>
    )
  });

  return (
    <div>
      {rows}
    </div>
  );
}

function ControlPanel(props: {onSubmit: (event: React.FormEvent<HTMLFormElement>) => void}) {
  return (
    <Form onSubmit={props.onSubmit}>
      <FormGroup>
        <Label for="exampleText">Type color</Label>
        <Input type="textarea" name="userdata" id="exampleText" />
        <Button>
          Submit
        </Button>
      </FormGroup>
    </Form>
  );
}

class Game extends React.Component<
  {},
  {
    history: Array<Array<string>>,
    selected: Array<number>,
    xIsNext: boolean,
    step: number,
  }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [Array(9).fill(null!)],
      xIsNext: true,
      selected: [],
      step: 0,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.step + 1);
    const squares = history[history.length - 1].slice();
    if (calculateWinner(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    let xappend = (x: Array<number>, i:number) => (
      x.includes(i) ? x.filter(element => element !== i) : x.concat([i])
    )

    // Update the history
    this.setState({
      history: this.state.history.concat([squares]),
      selected: xappend(this.state.selected, i),
      xIsNext: !this.state.xIsNext,
      step: history.length,
    });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    const data = event.target.userdata.value;
    const selected = this.state.selected.slice();
    const history = this.state.history.slice(0, this.state.step + 1);
    const squares = history[history.length - 1].slice();

    const updated = squares.map((element, index) => {
      return selected.includes(index) ? data : element;
    })

    this.setState({
      history: this.state.history.concat([updated]),
      step: this.state.step + 1
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

    const panel = <ControlPanel
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
    />

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.history[this.state.history.length - 1]}
            onClick={(i: number) => this.handleClick(i)}
            nRows={3}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <div>
            {this.state.selected.length > 0 ? panel : null}
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
