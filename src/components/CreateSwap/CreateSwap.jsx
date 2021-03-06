import { addDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import SwapItemAdmin from "../SwapItemAdmin/SwapItemAdmin";
import ImageUpload from "../ImageUpload/ImageUpload";
import "./CreateSwap.css";
import ToastNotify from "../ToastNotify/ToastNotify";

export default function CreateSwap() {
  // toast.configure();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const selectedSwap = useSelector((state) => state?.selectedSwap[0]);
  const createMessage = "Swap Created!";
  const editMessage = "Swap Edited Successfully!";

  const defaultState = {
    is_private: true,
    start_date: "",
    sell_date: "",
    stop_date: "",
    access_code: "",
    swap_name: "",
    swap_img: "",
    pre_sale_duration: "",
    sale_duration: "",
    swap_description: "",
  };

  const [swapInfo, setSwapInfo] = useState(defaultState);

  //slug is either 'edit' or doesn't exist.  Id is the id of the swap to be edited.
  //These are onlky used when editing a swap, not when creating one.
  const { slug, id } = useParams();

  const history = useHistory();

  const authLevel = user.auth_level;

  const handleSwapInfo = (event) => {
    setSwapInfo({ ...swapInfo, [event.target.name]: event.target.value });
  };

  //clicking the request access button will send an email to the owner of SnowSwaps asking for an upgrade to their account
  //allowing a user to create their own swaps.
  const handleRequestAccess = () => {
    dispatch({ type: "REQUEST_UPGRADE" });
  };
  //the the alert system to alert the user of a successful swap creation.

  // const notify = () => {
  //   toast.success("Swap Created!", { position: toast.POSITION.TOP_CENTER });
  // };

  //handleSubmit checks if a user is editing a swap or creating a new one and dispatches accordingly.
  const handleSubmit = (event) => {
    event.preventDefault();
    if (slug === "edit") {
      dispatch({ type: "EDIT_SWAP", payload: swapInfo });
      ToastNotify(editMessage);
      history.push("/profile");
    } else {
      dispatch({ type: "CREATE_SWAP", payload: swapInfo });
      dispatch({ type: "PRIVATE_TO_PUBLIC", payload: selectedSwap });
      ToastNotify(createMessage);
      history.push("/");
    }
  };

  const handleCancel = () => {
    history.push("/");
  };

  useEffect(() => {
    if (slug === "edit") {
      dispatch({ type: "FETCH_SELECTED_SWAP", payload: id });
    }
  }, []);

  const dateFormat = "yyyy-MM-dd";

  useEffect(() => {
    //if editing a swap the default state of setSwapInfo is set to the information for that selected swap.
    if (slug === "edit" && selectedSwap?.owner === user.id) {
      setSwapInfo({
        id: selectedSwap?.id,
        is_private: selectedSwap?.is_private.toString(),
        start_date: format(new Date(selectedSwap?.start_date), dateFormat),
        sell_date: format(new Date(selectedSwap?.sell_date), dateFormat),
        stop_date: format(new Date(selectedSwap?.stop_date), dateFormat),
        access_code: selectedSwap?.access_code,
        swap_name: selectedSwap?.name,
        swap_img: selectedSwap?.swap_img,
        swap_description: selectedSwap?.swap_description,
      });
    } else {
      //Otherwise the only thing we are setting is the random sting that will be used for swap access if a swap is private.
      setSwapInfo({
        ...swapInfo,
        //creates a random number which is converted to base36 and then the leading 0 and decimal are removed.
        access_code: Math.random().toString(36).slice(2),
      });
    }
  }, [selectedSwap]);

  return (
    <div className="no-overflow">
      <div className="swap-header">{slug ? "Edit" : "Create"} Swap</div>
      {authLevel < 1 ? (
        <div>
          <p>You do not have authorization to create your own swap.</p>
          <button className="ss-btn" onClick={handleRequestAccess}>
            Request Access
          </button>
        </div>
      ) : (
        <div>
          <form className="swap-creation-container" onSubmit={handleSubmit}>
            Swap Cover Image
            {swapInfo.swap_img ? (
              <div>
                <div className="swap-uploader-preview">
                  <img src={swapInfo.swap_img} />
                </div>
                <button
                  className="ss-btn"
                  type="button"
                  onClick={() => setSwapInfo({ ...swapInfo, swap_img: "" })}
                >
                  Change Cover Image
                </button>
              </div>
            ) : (
              <ImageUpload
                keyName={"swap_img"}
                state={swapInfo}
                setState={setSwapInfo}
              />
            )}
            <div className="profile-input-container">
              <div className="input-tag">Swap Name</div>
              <input
                name="swap_name"
                onChange={(event) => handleSwapInfo(event)}
                value={swapInfo.swap_name}
                type="text"
                className="styled-input"
              />
            </div>
            <div className="textarea-container">
              <div className="modal-header white-text center">
                Swap Description
              </div>
              <textarea
                value={swapInfo.swap_description}
                onChange={(event) => handleSwapInfo(event)}
                name="swap_description"
                cols="30"
                rows="10"
              />
            </div>
            <div>
              <span className="private-public">
                <p className="">Public</p>
                <div
                  className={`switch-body switch${
                    swapInfo.is_private ? "private" : "public"
                  }-body`}
                  onClick={() =>
                    setSwapInfo({
                      ...swapInfo,
                      is_private: !swapInfo.is_private,
                    })
                  }
                >
                  <div
                    className={`switch-circle ${
                      swapInfo.is_private ? "private" : "public"
                    }`}
                  ></div>
                </div>
                <p>Private</p>
              </span>
            </div>
            <div className="profile-input-container">
              <div className="input-tag">Pre-Sale Start</div>
              <input
                onChange={(event) => handleSwapInfo(event)}
                value={swapInfo.start_date}
                name="start_date"
                max={swapInfo.stop_date}
                required
                type="date"
                className="styled-input"
              />
              <div className="tool-tip">
                <img src="images/tooltip.svg" alt="" />
                <span className="tool-tip-text">
                  Start date is the day the swap will start it's pre-sale stage.
                  During this time users will be able to add their items to the
                  swap. No buying will occur during this stage
                </span>
              </div>
            </div>
            <div className="profile-input-container">
              <div className="input-tag">Sale Start</div>
              <input
                onChange={(event) => handleSwapInfo(event)}
                value={swapInfo.sell_date}
                name="sell_date"
                min={swapInfo.start_date}
                max={swapInfo.stop_date}
                required
                type="date"
                className="styled-input"
              />
              <div className="tool-tip">
                <img src="images/tooltip.svg" alt="" />
                <span className="tool-tip-text">
                  Start Sale Date is the day the swap enters it's sale stage.
                  During this time items can still be added, users are able to
                  purchase items during this time.
                </span>
              </div>
            </div>
            <div className="profile-input-container">
              <div className="input-tag">Stop Date</div>
              <input
                onChange={(event) => handleSwapInfo(event)}
                value={swapInfo.stop_date}
                name="stop_date"
                min={swapInfo.sell_date}
                required
                type="date"
                className="styled-input"
              />
              <div className="tool-tip">
                <img src="images/tooltip.svg" alt="" />
                <span className="tool-tip-text">
                  The stop date is the day the swap ends. All stages start and
                  stop at midnight. For example if you want your swap to go
                  through Sunday select Monday as your end date.
                </span>
              </div>
            </div>
            <p>Your swap access code:</p>
            <h3>{swapInfo.access_code}</h3>
            <div className="button-container">
              <button className="ss-btn" onClick={handleCancel} type="button">
                Cancel
              </button>
              <button className="ss-btn" type="submit">
                {slug === "edit" ? "Save" : "Create Swap"}
              </button>
            </div>
          </form>
          {slug === "edit" ? <SwapItemAdmin /> : <></>}
        </div>
      )}
    </div>
  );
}
