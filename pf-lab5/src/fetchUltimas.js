export default function fetchUltimas(num = 25, id = null, fonte) {
  const noticias_arr = [];
  return new Promise((resolve, reject) => {
    //se a fonte for o jornal eco, podemos fazer fetch de noticias relacionas, bastando passar o id da notícia atual
    if (fonte == "eco") {
      fetch(`https://eco.sapo.pt/wp-json/eco/v1/items/id/${id}/related`)
        .then((res) => res.json())
        .then((data) => {
          let json_tratato = data.map((e) => {
            return {
              id: e.item.id,
              titulo: e.item.title.long,
              data: e.item.pubDate,
              tag: e.item.type,
              lead: e.item.lead,
              img: e.item.images.wide.urlTemplate,
              fonte: "eco",
            };
          });

          resolve(json_tratato);
        });
    }

    //FETCH DAS 25 ÚLTIMAS NOTÍCIAS (10 público, 10 observador, 5 eco)
    //jornal eco
    fetch("https://eco.sapo.pt/wp-json/eco/v1/lists/latest")
      .then((res) => res.json())
      .then((data) => {
        let json_tratato = data.map((e) => {
          return {
            id: e.item.id,
            titulo: e.item.title.long,
            data: e.item.pubDate,
            tag: e.item.type,
            lead: e.item.lead,
            img: e.item.images.wide.urlTemplate,
            fonte: "eco",
          };
        });
        //adicionar o array de noticias do eco ao array de notícias principal
        noticias_arr.push(...json_tratato);
        //observador
        return fetch("https://pf-py-api.herokuapp.com/fetch/", {
          method: "POST",
          body: JSON.stringify({
            link: "https://observador.pt/wp-json/obs_api/v4/news/widget/latest",
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        let json_tratato = data.map((e) => {
          return {
            id: e.id,
            titulo: e.title,
            data: e.publish_date,
            tag: e.tag,
            lead: e.lead,
            img: e.image,
            fonte: "observador",
          };
        });
        //adicionar o array de noticias do observador ao array de notícias principal
        noticias_arr.push(...json_tratato);
        //público
        return fetch("https://pf-py-api.herokuapp.com/fetch/", {
          method: "POST",
          body: JSON.stringify({
            link: "https://www.publico.pt/api/list/ultimas",
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        let json_tratato = data.map((e) => {
          return {
            id: e.id,
            titulo: e.tituloNoticia,
            data: e.data,
            tag: e.tag,
            lead: e.descricao,
            img: e.multimediaPrincipal,
            fonte: "publico",
          };
        });
        //adicionar o array de noticias do público ao array de notícias principal
        noticias_arr.push(...json_tratato);

        //ordenar as notícias por datas
        noticias_arr.sort(function (a, b) {
          return new Date(b.data) - new Date(a.data);
        });

        if (noticias_arr !== []) {
          if (num < 25) {
            const noticias_arr_reduzido = noticias_arr.filter((e, i) => i < num + 1 && e.id != id);
            resolve(noticias_arr_reduzido);
          } else {
            resolve(noticias_arr);
          }
        } else {
          reject(new Error("Array Vazio"));
        }
      });
  });
}
