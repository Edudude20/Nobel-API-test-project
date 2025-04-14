import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

// TODO: CSS Modules

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

  // birthDate: string; //TODO ==> to year
  //prizeAmountAdjusted?? could be fun?
  const [laureates, setLaureates] = useState(laureateTypes);
  const [error, setError] = useState<Error | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);

  const nutshell = window?.Nutshell; //TODO check if window is fine

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
      nutshell.start();
    }

    return () => {
      nutshell.closeAllNutshells();
    };
  }, [nutshell]);

  useEffect(() => {
    if (nutshell && laureates.length > 0 && tableRef.current) {
      nutshell.start(tableRef.current);
    }
  }, [laureates, nutshell]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
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
      <div className="table" ref={tableRef}>
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
                <tr key={laureate.id} className="laureate-table-row">
                  <td>{laureate.fullName.en}</td>
                  {/* TODO: Split birth date to years */}
                  <td>{laureate.birth.date.slice(0, 4)}</td>
                  <td>
                    <a href={laureate.wikipedia.english}>:Link</a>
                  </td>
                  <td>
                    <ul>
                      {laureate.nobelPrizes.map((prize) => {
                        return (
                          <li>
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
      </div>
    </>
  );
}

export default App;
