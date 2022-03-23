import type { NextPage } from "next";
import { useEffect } from "react";
import { NavBar } from "../components";

const Theme: NextPage<{}> = () => {
  useEffect(() => {
    const switcher = document?.querySelector("#theme-switcher");
    const doc = document?.firstElementChild;

    switcher?.addEventListener("input", (e) =>
      setTheme((e.target as any).value)
    );
    const setTheme = (theme: any) => doc?.setAttribute("color-scheme", theme);
  }, []);

  return (
    <>
      <NavBar />
      <header>
        <h3>Scheme</h3>
        <form id="theme-switcher">
          <div>
            <input checked type="radio" id="auto" name="theme" value="auto" />
            <label htmlFor="auto">Auto</label>
          </div>
          <div>
            <input type="radio" id="light" name="theme" value="light" />
            <label htmlFor="light">Light</label>
          </div>
          <div>
            <input type="radio" id="dark" name="theme" value="dark" />
            <label htmlFor="dark">Dark</label>
          </div>
          <div>
            <input type="radio" id="dim" name="theme" value="dim" />
            <label htmlFor="dim">Dim</label>
          </div>
        </form>
      </header>

      <main>
        <section>
          <div className="surface-samples">
            <div className="surface1 rad-shadow">1</div>
            <div className="surface2 rad-shadow">2</div>
            <div className="surface3 rad-shadow">3</div>
            <div className="surface4 rad-shadow">4</div>
          </div>
        </section>

        <section>
          <div className="text-samples">
            <h1 className="text1">
              <span className="swatch brand rad-shadow"></span>
              Brand
            </h1>
            <h1 className="text1">
              <span className="swatch text1 rad-shadow"></span>
              Text Color 1
            </h1>
            <h1 className="text2">
              <span className="swatch text2 rad-shadow"></span>
              Text Color 2
            </h1>
            <br />
            <p className="text1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="text2">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Theme;
