const { default: axios } = require("axios");
const { response, request } = require("express");

const getItems = async (req = request, res = response) => {
  // se define un estado inicial para los items que en este caso es un array vacio
  let items = [];

  // se define un estado inicial para las categories que en este caso es un array vacio

  let categories = [];

  // obtenemos el query dado por url del endpoint
  const { q = "" } = req.query;

  // se realiza una validación, en caso de que el query sea vacio retornamos.
  if (q === "") {
    res.status(200).json({
      msg: "get items succes",
      data: {},
    });
    return;
  }

  // Si por url la query es diferente a un string vacio entonces realizaremos la peticion al endpoint de mercado libre
  // Se realiza un try catch por si en algun momento de la request algo sale mal, poder  capturar la excepción
  try {
    // Se realiza la peticion get mediante axios y extraemos la data del response
    const { data } = await axios.get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${q}`
    );

    // Si la data contiene resultados entonces empezamos a armar nuestra estructura para entregar como respuesta.
    if (data.results.length > 0) {
      // llenamos la variable items previamente establecida, esto se realiza mediante un map el cual permite generar la estructura indicada
      items = data.results.map((item) => ({
        id: item.id,
        title: item.title,
        prices: {
          currency: item.prices.prices[0].currency_id,
          amount: item.prices.prices[0].amount,
          decimals: 0,
        },
        ubication: item.address.state_name,
        free_shipping: item.shipping.free_shipping,
        picture: item.thumbnail,
        condition: item.condition,
      }));

      // se recorre los datos obtenidos para obtener las categorias y añadirlas y en caso de que este ya se en encuentre en el array
      // no se agrega de nuevo.

      data.results.forEach((item) => {
        !categories.includes(item.category_id) &&
          categories.push(item.category_id);
      });
    }

    // una vez que se haya realizado la estructura y almacenado en las variables de items, se procede a dar una respuesta de la request
    // con una respuesta 200 y los datos necesarios, como el author el cual se obtiene de las variables de entorno
    res.status(200).json({
      author: {
        name: process.env.NAME,
        lastname: process.env.LASTNAME,
      },
      categories,
      items,
    });
  } catch (error) {
    // en caso de obtener una excepción se retorna un status 400 para indicar al usuario que algo salio mal
    // y adjunto la excepción obtenida
    res.status(400).json({
      msg: "Get error",
      error,
    });
  }
};

const getItemDescription = async (req = request, res = response) => {
  const id = req.params.id;
  let item;
  let description;

  try {
    item = await axios.get(`https://api.mercadolibre.com/items/${id}`);
    description = await axios.get(
      `https://api.mercadolibre.com/items/${id}/description`
    );
    res.status(200).json({
      author: {
        name: process.env.NAME,
        lastname: process.env.LASTNAME,
      },
      item: {
        id: item.data.id,
        title: item.data.title,
        price: {
          currency: item.data.currency_id,
          amount: item.data.price,
          decimals: 0,
        },
        picture: item.data.pictures[0].secure_url,
        condition: item.data.condition,
        free_shipping: item.data.free_shipping,
        sold_quantity: item.data.sold_quantity,
        description: description.data.plain_text,
      },
    });
  } catch (error) {
    res.status(200).json({
      msg: "get item error",
      error,
    });
  }
};

module.exports = {
  getItems,
  getItemDescription,
};
