import React from 'react';
import ReactDOM from 'react-dom';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import './index.css';

function Square(props: { selected: boolean, color: string, onClick: () => void }) {
  return (
    <button
      className={props.selected ? "square-clicked" : "square"}
      onClick={props.onClick}
      style={{background: props.color}}
    >
    </button>
  );
}

function Board(props: { squares: Array<string>, selected: Array<number>, onClick: (i: number) => void, nRows: number }) {
  const tiles = props.squares.map((square, index) => {
    return (
      <Square
        color={square}
        onClick={() => props.onClick(index)}
        selected={props.selected.includes(index)}
      />
    );
  });

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
    colors: Array<string>,
    selected: Array<number>,
    xIsNext: boolean,
    step: number,
  }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      colors: Array(256).fill(null!),
      xIsNext: true,
      selected: [],
      step: 0,
    };
  }

  handleClick(i: number) {
    const squares = this.state.colors.slice();
    if (calculateWinner(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    let xappend = (x: Array<number>, i:number) => (
      x.includes(i) ? x.filter(element => element !== i) : x.concat([i])
    )

    // Update the history
    this.setState({
      colors: squares,
      selected: xappend(this.state.selected, i),
      xIsNext: !this.state.xIsNext,
      step: 0,
    });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    const data = event.target.userdata.value;
    const selected = this.state.selected.slice();
    const history = this.state.colors.slice(0, this.state.step + 1);
    const squares = history[history.length - 1].slice();

    const updated = squares.map((element, index) => {
      return selected.includes(index) ? data : element;
    })

    this.setState({
      colors: this.state.colors.concat([updated]),
      step: this.state.step + 1
    });
  }

  render() {
    const winner = calculateWinner(this.state.colors[this.state.step]);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const panel = <ControlPanel
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
    />

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.colors[this.state.colors.length - 1]}
            selected={this.state.selected}
            onClick={(i: number) => this.handleClick(i)}
            nRows={16}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
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
