import API_BASE_URL from "../config";

useEffect(() => {
  fetch(`${API_BASE_URL}/signals`)
    .then((response) => response.json())
    .then((data) => setSignals(data))
    .catch((error) => console.error("Error fetching signals:", error));
}, []);
