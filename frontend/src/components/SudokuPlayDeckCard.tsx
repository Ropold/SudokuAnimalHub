
type SudokuPlayDeckCardProps = {
    initialGrid: number[][];
    solutionGrid: number[][];
    deckMapping: { [key: number]: string };
}

export default function SudokuPlayDeckCard (props: Readonly<SudokuPlayDeckCardProps>) {
    return (
        <div>
            <h3>Sudoku Play Deck Card</h3>
        </div>
    )
}