import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { DndContext, DragStartEvent, useDraggable } from "@dnd-kit/core";

import sidebar from "./components/Sidebar/sidebar.module.css";
import { CSS } from "@dnd-kit/utilities";

// TODO: CSS Modules
// Style the table

/*
 * Add a spinning newspaper effect to a confirmation prompt when dropping to the
 * favourites box
 * */

// TODO: add dnd-kit or similar to handle dragging a laureata to a
//  special "my favourites" droppable/sortable list

const DraggableItem = ({ id }: {id: string}) => {
  const { attributes, listeners, setNodeRef, transform, } =
    useDraggable({
      id: id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <button {...listeners} {...attributes}>
        Drag Handle
      </button>
    </tr>
  );
};

interface Prizes {
  awardYear: string;
  category: { en: string };
  motivation: { en: string };
}

function App() {
  const laureateTypes: {
    fullName: { en: string };
    id: number;
    birth: { date: string };
    wikipedia: { english: string };
    nobelPrizes: Prizes[];
  }[] = [];

  //prizeAmountAdjusted?? could be fun?

  const [laureates, setLaureates] = useState(laureateTypes);
  const [favourites, setFavourites] = useState(["One", "Two"]);

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  //Explicit or implicit type checking? Do I remember this correctly?
  // Implicit I think

  const [error, setError] = useState<Error | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);

  const nutshell = window?.Nutshell;
  //TODO check if window is fine and fix TypeScript error

  if (nutshell) {
    nutshell.setOptions({
      startOnLoad: true, // Start Nutshell on load? (default: true)
      lang: "en", // Language (default: 'en', which is English)
      dontEmbedHeadings: true,
      // If 'true', removes the "embed this as a nutshell" option on headings
    });
  }

  useEffect(() => {
    console.log("effect");
    //get data
    axios
      .get("https://api.nobelprize.org/2.1/laureates")
      .then((response) => {
        // populate with data
        console.log("promise fulfilled", response);
        setLaureates(response.data.laureates);
      })
      .catch((error) => {
        // handle error
        console.log(error);
        setError(error);
      });

    if (nutshell) {
      nutshell.start(); //Makes sure Nutshell starts...duh. Fixed a major issue
    }

    return () => {
      //Make sure all of them are closed during cleanup, no sure if necessary
      nutshell.closeAllNutshells();
    };
  }, [nutshell]);

  //Restart nutshell
  useEffect(() => {
    if (nutshell && laureates.length > 0 && tableRef.current) {
      nutshell.start(tableRef.current);
    }
  }, [laureates, nutshell]);

  const handleSidebarToggle = () => {
    console.log("toggle sidebar!");

    setSidebarIsOpen(!sidebarIsOpen);
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log("Drag Started!", event);
    
  }

  //Show error
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <DndContext onDragStart={handleDragStart}>
        <aside
          className={sidebar.sidebarContainer}
          sidebar_state={sidebarIsOpen ? "open" : "closed"}
        >
          <div id={sidebar.sidebarTabContainer}>
            <button onClick={handleSidebarToggle}>My Favourites</button>
          </div>
          {/* My favourite nobel prize-winners */}

          <h2>My favourite laureates</h2>
          {favourites.map((favourite) => {
            return <p>{favourite}</p>;
          })}
        </aside>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Nobel Prize Laureates</h1>
        <a href="">:nutshellTest</a>
        <div className="table-container" ref={tableRef}>
          <table>
            <tbody>
              <tr>
                <th>Full Name</th>
                <th>Born in (year)</th>
                <th>Wikipedia Link</th>
                <th>Prizes</th>
              </tr>
              {laureates.map((laureate) => {
                return (
                  <tr key={laureate.id}>
                    <td>{laureate.fullName.en}</td>
                    <td>{laureate.birth.date.slice(0, 4)}</td>
                    <td>
                      <a href={laureate.wikipedia.english}>:Link</a>
                    </td>
                    <td>
                      <ul>
                        {laureate.nobelPrizes.map((prize, index) => {
                          return (
                            // Not the best idea to add index to key, but...
                            <li key={index}>
                              {prize.awardYear}
                              <ul>
                                <li>{prize.category.en}</li>
                                <li>{prize.motivation.en}</li>
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <DraggableItem id={"1"}></DraggableItem>
        </div>
      </DndContext>
    </>
  );
}

export default App;
