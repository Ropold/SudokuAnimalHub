import "./styles/SudokuDeckCard.css";
import { ResolveImageUrl } from "./utils/ResolveImageUrl.ts"

type SudokuDeckCardProps = {
    grid: number[][];
    deckMapping: { [key: number]: string };
};

export default function SudokuPreviewDeckCard(props: Readonly<SudokuDeckCardProps>) {

    return (
        <>
            <h3>{"Preview Sudoku Deck"}</h3>
            <div className="sudoku-deck-center">
                <div className="preview-sudoku-deck-board">
                    {Array.from({ length: 3 }, (_, blockRow) => (
                        <div key={blockRow} className="preview-sudoku-deck-block-row">
                            {Array.from({ length: 3 }, (_, blockCol) => (
                                <div key={blockCol} className="preview-sudoku-deck-block">
                                    {Array.from({ length: 3 }, (_, innerRow) =>
                                        Array.from({ length: 3 }, (_, innerCol) => {
                                            const row = blockRow * 3 + innerRow;
                                            const col = blockCol * 3 + innerCol;
                                            const value = props.grid[row][col];
                                            const imageUrl = ResolveImageUrl(value, props.deckMapping);  // <-- hier verwenden

                                            return (
                                                <div key={`${row}-${col}`} className="preview-sudoku-deck-cell">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt="Deck Item" className="preview-sudoku-deck-image" />
                                                    ) : value !== 0 ? (
                                                        <span className="preview-sudoku-deck-number">{value}</span>
                                                    ) : null}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
