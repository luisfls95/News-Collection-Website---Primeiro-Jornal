export const fetchNoticia = (fonte, id) => {
  let urlFetch;
  if (fonte === "eco") {
    urlFetch = `https://eco.sapo.pt/wp-json/eco/v1/items/id/${id}`;
  } else if (fonte === "observador") {
    urlFetch = `https://pf-py-api.herokuapp.com/obs/${id}`;
  } else if (fonte === "publico") {
    urlFetch = `https://pf-py-api.herokuapp.com/pub/${id}`;
  }

  return fetch(urlFetch)
    .then((res) => res.json())
    .then((data) => data);
};
