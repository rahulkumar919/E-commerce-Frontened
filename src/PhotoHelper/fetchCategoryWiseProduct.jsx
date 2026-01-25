import SummaryApi from "../../common";

const fetchCategoryWiseProduct = async (category) => {
  try {
    const response = await fetch(SummaryApi.CategoryWiseProduct.url, {
      method: SummaryApi.CategoryWiseProduct.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    });

    const dataResponse = await response.json();
    return dataResponse;
  } catch (error) {
    console.error("Error fetching category-wise product:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export default fetchCategoryWiseProduct;
