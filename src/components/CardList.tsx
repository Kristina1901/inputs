import React from "react";
import useStore from "../store/store";
import AutocompleteComponent from "../components/AutocompleteComponent";

function CardListItems() {
  const store = useStore((state) => state);
  return (
    <>
      {store.cards.map((card) => (
        <div key={card.id} className="card">
          <div className="card-head">
            <button onClick={() => store.toggleCard(card.id)} className="add">
              +
            </button>
            <button
              onClick={() => store.removeCard(card.id)}
              className="delete"
            >
              -
            </button>
          </div>
          {card.open && <AutocompleteComponent></AutocompleteComponent>}
        </div>
      ))}
    </>
  );
}
function CardList() {
  return (
    <>
      <CardListItems />
    </>
  );
}
export default CardList;
