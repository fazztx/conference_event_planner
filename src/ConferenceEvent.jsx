import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
//Added methods from slices
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";


const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const venueItems = useSelector((state) => state.venue);

  //Extract information from add-ons state
  const avItems = useSelector((state) => { return state.av });
  const mItems = useSelector((state) => {return state.meals});

  // Console logs for debugging purposes..
  // console.log(venueItems);
  // console.log(avItems);
  // console.log(mItems);

  const dispatch = useDispatch();
  const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;


  const handleToggleItems = () => {
    console.log("handleToggleItems called");
    setShowItems(!showItems);
  };

  const handleAddToCart = (index) => {
    if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
      return; //Prevents dispatch action if quantity is 3
    }
    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  //Dispatched actions by me...
  const handleIncrementAvQuantity = (index) => {
    dispatch(incrementAvQuantity(index));
  };

  const handleDecrementAvQuantity = (index) => {
    if (avItems[index].quantity <= 0){
      // console.log("not even dispatching")
      return;
    }
    dispatch(decrementAvQuantity(index));
  };

  const handleMealSelection = (index) => {
    console.log("handleMealSelectionis being dispatched");
    dispatch(toggleMealSelection(index));

  };

  const getItemsFromTotalCost = () => {
    const items = [];
    venueItems.forEach(item => {
      if (item.quantity > 0) { //Or simply just push the whole item
        items.push({
          // name: item.name,
          // cost: item.cost,
          // quantity: item.quantity
          ...item, type: "venue"
        });
      }
    });
    avItems.forEach(item => {
      if (item.quantity > 0) { 
        items.push({
          // name: item.name,
          // cost: item.cost,
          // quantity: item.quantity
          ...item, type: "av"
        });
      }
    });
    mItems.forEach(item => {
      if (item.chkBox == true) {
        items.push({
          // name: item.name,
          // cost: item.cost,
          // quantityBasedOnNum: numberOfPeople,
          ...item, type: "m"
        });
      }
    });
    return items; // Don't forget to return the items array!
  };
  

  const items = getItemsFromTotalCost();

  const ItemsDisplay = ({ items }) => {
    console.log(items);
    return <>
      <div className="display_box1">
        {items.length === 0 && <p>No items selected</p>}
        <table className="table_item_data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit Cost</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>${item.cost}</td>
                <td>
                  {item.type === "m"
                    ?` For ${numberOfPeople} people`
                    : item.quantity}
                </td>
                <td>
                 {item.type === "m" ? item.cost * numberOfPeople : item.cost * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  };
  const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
      venueItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    } else if (section === "av") {
      avItems.forEach((item) => {
        totalCost += item.cost * item.quantity
      })
    } else if (section === "meals") {
      mItems.forEach((item) => { //Logic to prevent NaN if input is cleared
        if(!isNaN(numberOfPeople)){
          totalCost += (item.chkBox && item.cost * numberOfPeople);
        };
      })
    }
    return totalCost;
  };
  const venueTotalCost = calculateTotalCost("venue");

  //To reuse same logic...
  const avTotalCost = calculateTotalCost("av");
  const mTotalCost = calculateTotalCost("meals");

  const totalCosts = venueTotalCost + avTotalCost + mTotalCost;

  const navigateToProducts = (idType) => {
    if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
      if (showItems) { // Check if showItems is false
        setShowItems(!showItems); // Toggle showItems to true only if it's currently false
      }
    }
  }

  return (
    <>
      <navbar className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>
        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
            <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
            <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
          </div>
          <button className="details_button" onClick={() => setShowItems(!showItems)}>
            Show Details
          </button>
        </div>
      </navbar>
      <div className="main_container">
        {!showItems
          ?
          (
            <div className="items-information">
              <div id="venue" className="venue_container container_main">
                <div className="text">

                  <h1>Venue Room Selection</h1>
                </div>
                <div className="venue_selection">
                  {venueItems.map((item, index) => (
                    <div className="venue_main" key={index}>
                      <div className="img">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="text">{item.name}</div>
                      <div>${item.cost}</div>
                      <div className="button_container">
                        {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

                          <>
                            <button
                              className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
                              onClick={() => handleRemoveFromCart(index)}
                            >
                              &#8211;
                            </button>
                            <span className="selected_count">
                              {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                            </span>
                            <button
                              className={remainingAuditoriumQuantity === 0 ? "btn-success btn-disabled" : "btn-success btn-plus"}
                              onClick={() => handleAddToCart(index)}
                            >
                              &#43;
                            </button>
                          </>
                        ) : (
                          <div className="button_container">
                            <button
                              className={venueItems[index].quantity === 0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
                              onClick={() => handleRemoveFromCart(index)}
                            >
                              &#8211;
                            </button>
                            <span className="selected_count">
                              {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                            </span>
                            <button
                            //Added disabled attribute to match className logic
                              disabled={venueItems[index].quantity === 10 ? true : false}
                              className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
                              onClick={() => handleAddToCart(index)}
                            >
                              &#43;
                            </button>


                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="total_cost">Total Cost: ${venueTotalCost}</div>
              </div>

              {/*Necessary Add-ons*/}
              <div id="addons" className="venue_container container_main">


                <div className="text">

                  <h1> Add-ons Selection</h1>

                </div>
                <div className="addons_selection">
                  {avItems.map((item, index) => (
                    <div className="venue_main" key={index}>
                      <div className="img">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="text">{item.name}</div>
                      <div>${item.cost}</div>
                      <div className="addons_btn">
                          <div className="addons_btn">
                            <button
                            //If quantity is 0, changes button appearance 
                              className={avItems[index].quantity === 0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
                              onClick={() => handleDecrementAvQuantity(index)}
                            >
                              &#8211;
                            </button>
                            <span className="selected_count"> 
                              {/* Either quantity is 0 or avItems[index].quantity of that particular index */}
                              {avItems[index].quantity > 0 ? ` ${avItems[index].quantity}` : "0"} 
                            </span>
                            <button
                              className={"btn-success btn-plus"}
                              onClick={() => handleIncrementAvQuantity(index)}
                            >
                              &#43;
                            </button>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="total_cost">Total Cost: ${avTotalCost}</div>

              </div>

              {/* Meal Section */}

              <div id="meals" className="venue_container container_main">

                <div className="text">

                  <h1>Meals Selection</h1>
                </div>

                <div className="input-container venue_selection">
                  <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                  <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                    min="1"
                  />

                </div>
                <div className="meal_selection">
                  {mItems.map((item, index) => (
                    <div className="meal_item" key={index} style={{ padding: 15 }}>
                      <div className="inner">
                        <input type="checkbox" id={`meal_${index}`}
                          checked={item.chkBox}
                          onChange={() => handleMealSelection(index)}
                        />
                        <label htmlFor={`meal_${index}`}> {item.name} </label>
                      </div>
                      <div className="meal_cost">${item.cost}</div>
                    </div>
                  ))}
                </div>
                <div className="total_cost">Total Cost: ${mTotalCost}</div>


              </div>
            </div>
          ) : (
            <div className="total_amount_detail">
              <TotalCost totalCosts={totalCosts} ItemsDisplay={() => <ItemsDisplay items={items} />} />
            </div>
          )
        }




      </div>
    </>

  );
};

export default ConferenceEvent;
