import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const nobelLaureates: {
    fullName: { en: string };
    id: number;
    birth: { date: string };
  }[] = [];

  // id: number;
  // fullname: string;
  // birthDate: string;
  // birthPlace: string;
  // wikipediaLink: string;
  const [laureates, setLaureates] = useState(nobelLaureates);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    console.log("effect");

    axios
      .get("https://api.nobelprize.org/2.1/laureates")
      .then((response) => {
        console.log("promise fulfilled", response);
        // console.log("response.data: ", response.data.laureates);
        setLaureates(response.data.laureates);
      })
      .catch((error) => {
        // handle error
        console.log(error);
        setError(error);
      });

    // console.log(promise);
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
      <h1>Vite + React</h1>
      <div className="card">
        <table>
          <tbody>
            <tr>
              <th>Full Name</th>
              <th>Birth date</th>
            </tr>
            {laureates.map((laureate) => {
              return (
                <tr key={laureate.id} className="laureate-table-row">
                  <td>{laureate.fullName.en}</td>
                  <td>{laureate.birth.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
