import "./styles/SudokuDeckCard.css";
import { AnimalEnum } from "./model/AnimalEnum";
import { animalsEnumImages } from "./utils/AnimalEnumImages";

type SudokuDeckCardProps = {
    grid: number[][];
    deckMapping: { [key: number]: string }; // Nummer → URL oder Enum-String
    title?: string;
};

export default function SudokuDeckCard(props: Readonly<SudokuDeckCardProps>) {
    const { grid, deckMapping, title } = props;

    const resolveImageUrl = (value: number) => {
        const entry = deckMapping[value];
        if (!entry) return null;
        if (entry.startsWith("http")) {
            return entry; // echte URL
        }
        // Sonst AnimalEnum-Name → lokale Map lookup
        return animalsEnumImages[entry as AnimalEnum];
    };

    return (
        <>
            <h3>{title || "Sudoku Deck"}</h3>
            <div className="sudoku-deck-card">
                <div className="sudoku-deck-board">
                    {Array.from({ length: 3 }, (_, blockRow) => (
                        <div key={blockRow} className="sudoku-deck-block-row">
                            {Array.from({ length: 3 }, (_, blockCol) => (
                                <div key={blockCol} className="sudoku-deck-block">
                                    {Array.from({ length: 3 }, (_, innerRow) =>
                                        Array.from({ length: 3 }, (_, innerCol) => {
                                            const row = blockRow * 3 + innerRow;
                                            const col = blockCol * 3 + innerCol;
                                            const value = grid[row][col];

                                            const imageUrl = resolveImageUrl(value);

                                            return (
                                                <div key={`${row}-${col}`} className="sudoku-deck-cell">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt="Deck Item" className="sudoku-deck-image" />
                                                    ) : value !== 0 ? (
                                                        <span className="sudoku-deck-number">{value}</span>
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
