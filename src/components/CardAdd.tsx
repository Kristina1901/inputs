import * as React from "react";
import useStore from "../store/store";

function CardAdd() {
  const store = useStore((state) => state);
  return (
    <div className="box">
      <p>
        <span className="box-name">Formulas</span>
        {store.cards.length}
      </p>
      <button
        className="add"
        onClick={() => {
          store.addCard();
        }}
      >
        +
      </button>
    </div>
  );
}
export default CardAdd;
