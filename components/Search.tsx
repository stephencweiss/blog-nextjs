import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Search.module.css";
import { Card } from "./Card";

const searchEndpoint = (query: string) => `/api/search?query=${query}`;

export default function Search() {
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const [results, setResults] = useState([]);

  const onChange = useCallback((event) => {
    const query = event?.target?.value ?? "";
    setQuery(query);
    if (query?.length) {
      fetch(searchEndpoint(query))
        .then((res) => res.json())
        .then(setResults);
    } else {
      setResults([]);
    }
  }, []);

  const onClick = useCallback((event) => {
    if (
      searchRef.current &&
      !(searchRef.current as any).contains(event.target)
    ) {
      setActive(false);
      window.removeEventListener("click", onClick);
    }
  }, []);

  const onFocus = useCallback(() => {
    setActive(true);
    window.addEventListener("click", onClick);
  }, [onClick]);

  return (
    <div className={styles.container} ref={searchRef}>
      <input
        className={styles.search}
        onChange={onChange}
        onFocus={onFocus}
        placeholder="Search posts"
        type="text"
        value={query}
      />
      {active && results?.length > 0 && (
        <ul className={styles.results}>
          {results.map((res) => {
            const { slug, title, excerpt } = res;

            return (
              <li className={styles.result} key={slug}>
                <Card
                  title={title}
                  details={excerpt}
                  primaryAction={
                    <Link href={`/blog/${slug}`}>
                      <a>Read More</a>
                    </Link>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
