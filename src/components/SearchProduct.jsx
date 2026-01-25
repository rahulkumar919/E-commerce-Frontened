import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SummaryApi from "../../common";
import { toast } from "react-toastify";

const SearchProduct = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!query) return;
    try {
      setLoading(true);
      const res = await fetch(`${SummaryApi.searchProduct.url}?q=${query}`);
      const data = await res.json();
      if (data.success) setData(data.data || []);
      else toast.error("No products found");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query]);

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Search Results for: <span className="text-red-500">{query}</span>
        </h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {!loading && data.length === 0 && (
          <p className="text-center text-gray-500">No products found 😢</p>
        )}

        {!loading && data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {data.map((product) => (
              <Link
                key={product._id}
                to={`/product-details/${product._id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-3"
              >
                <img
                  src={product?.productImage?.[0]}
                  alt={product.productName}
                  className="h-40 w-full object-contain"
                />
                <h3 className="text-sm font-semibold mt-2">
                  {product.productName}
                </h3>
                <p className="text-red-500 font-bold">₹{product.selling}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchProduct;
