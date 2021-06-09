import { Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ToastNotify from "../ToastNotify/ToastNotify";

export default function PublicSwapJoinModal() {
  const selectedSwap = useSelector((state) => state?.selectedSwap);
  const stateOfContact = useSelector((state) => state?.contactJoin);
  const history = useHistory();
  const dispatch = useDispatch();
  const joinMessage = "You have Joined the Swap!";

  const contactJoinSwap = () => {
    // add this swap the the user's joined swaps, then close the modal
    dispatch({ type: "PRIVATE_TO_PUBLIC", payload: selectedSwap[0].id });
    dispatch({ type: "CLOSE_CONTACT_JOIN" });
    dispatch({ type: "OPEN_DETAIL_VIEW" });
    dispatch({ type: "ABLE_TO_CONTACT" });
    ToastNotify(joinMessage);
  };

  // a modal to prompt the user to join a public swap.
  return (
    <>
      <div className="modal-header justify-end">
        <button
          className="no-style-button"
          onClick={() => dispatch({ type: "CLOSE_CONTACT_JOIN" })}
        >
          <img src="images/cancel-white.svg" alt="" />
        </button>
      </div>
      <div className="code-modal-container">
        <h3>
          Before you continue, {selectedSwap?.name} requests that you join the
          swap.
        </h3>
        <center>
          <h3>
            When you join the swap, you can contact the owner of items that
            interest you to secure a trade or sale before the swap becomes open.
          </h3>
        </center>
        <br />
        <p>Swap Description:</p>
        <p>{selectedSwap?.swap_description}</p>
        <div className="button-container">
          <button className="ss-btn" type="button" onClick={contactJoinSwap}>
            Join Swap
          </button>
        </div>
      </div>
    </>
  );
}
