import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
// import Nutshell from './components/nutshell'

// TODO: CSS Modules
// TODO: Nicky Cases's Nutshell for Nobelprize facts and wikipedia links

function App() {
  const laureateTypes: {
    fullName: { en: string };
    id: number;
    birth: { date: string };
    wikipedia: { english: string };
  }[] = [];

  // id: number;
  // fullname: string;
  // birthDate: string; //TODO ==> to year
  // wikipediaLink: string; //TODO use nutshell
  // Facts:  [href; title] //use Nutshell
  // Nobel prizes [{awardYear:string, category{en}, motivation{en}}]
  // TODO use nutshell
  const [laureates, setLaureates] = useState(laureateTypes);
  const [error, setError] = useState<Error | null>(null);

  // Nutshell.setOptions({
  //   startOnLoad: false,
  // })


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

      const script = document.createElement('script');

      script.src = "https://cdn.jsdelivr.net/gh/ncase/nutshell/nutshell.js"

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script)
      }
  }, []);

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
      <a href="http://localhost:5173/#NobelPrizeLaureates">:nutshellTest</a>
      <div className="card">
        <table>
          <tbody>
            <tr>
              <th>Full Name</th>
              <th>Birth date</th>
              <th>Wikipedia Link</th>
            </tr>
            {laureates.map((laureate) => {
              return (
                <tr key={laureate.id} className="laureate-table-row">
                  <td>{laureate.fullName.en}</td>
                  {/* TODO: Split birth date to years */}
                  <td>{laureate.birth.date}</td>
                  <td>
                    <a href={laureate.wikipedia.english}>Link</a>
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
