import React, { useEffect, useState } from "react";
import axios from "axios";

const URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "pKN9dcafZJtrImfp09PJM0lX6v6DeEb1";

const SearchBar = () => {
  // ? =============================== API Fetching =============================
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(16);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL, {
        params: {
          q: query,
          api_key: API_KEY,
          limit: limit,
          offset: offset,
        },
      });
      setData((prev) => [...prev, ...response.data.data]);
      setLoading(false);
    } catch (err) {
      console.log("Error is : " + err);
      setLoading(false);
    }
  };

  // ? =============================== Debouncing ===============================

  useEffect(() => {
    let timer;
    if (query) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        getData();
      }, 300);
    } else {
      setData([]);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [query,offset]);

  // ? ================================= Pagination ==============================

  const handlePagination = () => {
    setOffset(offset + limit);
  };

  return (
    <div>
      {/* ======================== Searchbox ================================ */}

      <input
        type="text"
        placeholder="Enter Gif Type"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* ======================= Image Grid ================================  */}

      <div className="image-grid-container w-100 flex">
        {loading ? (
          <p>Loading Gifs...</p>
        ) : (
          data.map((gifs) => {
            return (
              <img
                key={gifs.id}
                src={gifs.images.fixed_height.url}
                alt={gifs.title}
              />
            );
          })
        )}
      </div>

      {/* ============================= Pagination Feature ========================== */}

      {data.length > 0 && !loading && (
        <button onClick={handlePagination}>Explore More</button>
      )}
    </div>
  );
};

export default SearchBar;
