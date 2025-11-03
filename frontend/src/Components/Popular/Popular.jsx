import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/products/popularinwomen");
        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos populares. Status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setPopularProducts(data);
        } else {
          console.warn("A resposta não é um array. Verifique a API.");
          setPopularProducts([]);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos populares:", error);
        setError("Não foi possível carregar os produtos no momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="popular">
      <h1>POPULARES EM MULHERES</h1>
      <hr />

      {loading ? (
        <p>Carregando produtos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="popular-item">
          {popularProducts.length > 0 ? (
            popularProducts.map((item) => (
              <Item key={item._id || item.id} product={item} />
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Popular;
