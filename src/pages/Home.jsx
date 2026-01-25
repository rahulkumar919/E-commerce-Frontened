import React from "react";
import CategoryList from "../components/categoryList";
import BannerProdcut from "../components/BannerProdcut";


import HorizontalCardProduct from "../components/HorizontalCardProduct";

const home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProdcut />

      <HorizontalCardProduct category={"airpodes"} heading={"Tops Airpodes"} />
      <HorizontalCardProduct
        category={"watches"}
        heading={"Popular's Watches"}
      />
      <HorizontalCardProduct
        category={"mobiles"}
        heading={"Popular's mobiles"}
      />

      <HorizontalCardProduct
        category={"televisions"}
        heading={"Popular's televisions"}
      />
    </div>
  );
};

export default home;
