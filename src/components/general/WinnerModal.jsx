import { Sheet, Card, Title, Row } from "./WinnerModal.styled";

export function WinnerModal({
  open,
  winnerName,
  currentPlace,
  nextPlace,
  canContinue,
  onContinue,
  onFinish,
  onExit,
}) {
  if (!open) return null;

  const placeLabel = currentPlace === 1 ? "Winner" : `${currentPlace}. place`;

  return (
    <Sheet>
      <Card>
        <Title>
          {placeLabel}: {winnerName}
        </Title>
        <Row>
          {canContinue && (
            <button className="btn btn-success" onClick={onContinue}>
              Play for {nextPlace}. place
            </button>
          )}
          <button className="btn btn-warning" onClick={onFinish}>
            Finish game
          </button>
          <button className="btn btn-outline-secondary" onClick={onExit}>
            Exit to Home
          </button>
        </Row>
      </Card>
    </Sheet>
  );
}
