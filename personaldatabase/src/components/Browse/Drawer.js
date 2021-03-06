import React, { useContext, useState, useLayoutEffect, useRef, useEffect } from "react";
import { BrowseContext } from "../../Contexts/BrowseContext";
import { Drawer } from "antd";
import { constants } from "../../Constants";
import axios from "axios";
import "antd/dist/antd.css";
import { MenuOutlined } from "@ant-design/icons";
import "./Browse.css";

const DrawerComponent = (props) => {
  const { requestObject, setRequestObject, filterObject, setFilterObject } = useContext(BrowseContext);

  const [country, setCountry] = useState([]);
  const [category1, setCategory1] = useState([]);
  const [category2, setCategory2] = useState([]);
  const [category3, setCategory3] = useState([]);
  const [seller, setSeller] = useState([]);

  const URL = constants.URL;

  useEffect(() => {
    setRequestObject({listType: "listbrowse", page: 1});
  },[]);

  const clearFunction = () => {
    const selectBox = document.getElementsByClassName("selectBox");
    for (let index = 0; index < selectBox.length; index++) {
      selectBox[index].value = "";
      setCategory1([]);
      setCategory2([]);
      setCategory3([]);
    }
    const price = document.getElementsByName("price");
    price.forEach(element => {
      element.value = "";
    });
    const checkboxes = document.getElementsByClassName("checkbox");
    for (let index = 0; index < checkboxes.length; index++) {
      checkboxes[index].checked = false;
    }
    const catalogNumber = document.getElementsByClassName("catalogNumberFilter");
    catalogNumber[0].value = "";
    setFilterObject({listType: "listbrowse", page: 1});
  };

  const changeCountry = (element)=> {
    filterObject.country = element;
    axios
      .get(`${URL}/dropdown/category1?country=${element}`)
      .then((res) => {
        setCategory1(res.data);
        setCategory2([]);
        setCategory3([]);
        filterObject.category1 = "";
        filterObject.category2 = "";
        filterObject.category3 = "";
      });
  };

  const changeCategory1 = (element)=> {
    filterObject.category1 = element;
    axios
      .get(`${URL}/dropdown/category2?category1=${element}`)
      .then((res) => {
        setCategory2(res.data);
        setCategory3([]);
        filterObject.category2 = "";
        filterObject.category3 = "";
      });
  };

  const changeCategory2 = (element)=> {
    filterObject.category2 = element;
    axios
      .get(`${URL}/dropdown/category3?category2=${element}`)
      .then((res) => {
        setCategory3(res.data);
        filterObject.category3 = "";
      });
  };

  useLayoutEffect(() => {
    axios
      .get(`${URL}/dropdown/country`)
      .then((res) => {
        setCountry(res.data);
      });
    axios
      .get(`${URL}/dropdown/seller`)
      .then((res) => {
        setSeller(res.data);
      });
  },[]);

  const countryOptions = country.map((country) =>
    <option key={country.id} value={country.id}>{country.name}</option>
  );

  const category1Options = category1.map((category) =>
    <option key={category.id} value={category.id}>{category.category1}</option>
  );

  const category2Options = category2.map((category) =>
    <option key={category.id} value={category.id}>{category.category2}</option>
  );

  const category3Options = category3.map((category) =>
    <option key={category.id} value={category.id}>{category.category3}</option>
  );

  const sellerOptions = seller.map((seller) =>
    <option key={seller.id} value={seller.id}>{seller.name}</option>
  );


  return (
    <Drawer
      placement="left"
      onClose={props.close}
      closable={true}
      visible={props.visible}
      key="left"
      maskClosable={true}
      width={"380px"}
    >
      <button id="clearAll" onClick={() => {clearFunction();}}>
        Clear all
      </button>
      <div className="filterWrapper">
        <select name="country" id="country" className="selectBox" onChange={(e) => {changeCountry(e.target.value);}}>
          <option value="" hidden>Country</option>
          {countryOptions}
        </select>
        <select disabled={category1.length === 0} name="category1" id="category1" className="selectBox" onChange={(e) => {changeCategory1(e.target.value);}}>
          <option value="" hidden>Category 1</option>
          {category1Options}
        </select>
        <select disabled={category2.length === 0} name="category2" id="category2" className="selectBox" onChange={(e) => {changeCategory2(e.target.value);}}>
          <option value="" hidden>Category 2</option>
          {category2Options}
        </select>
        <select disabled={category3.length === 0} name="category3" id="category3" className="selectBox" onChange={(e) => {filterObject.category3 = e.target.value;}}>
          <option value="" hidden>Category 3</option>
          {category3Options}
        </select>
        <select disabled={seller.length === 0} name="seller" id="seller" className="selectBox" onChange={(e) => {filterObject.seller = e.target.value;}}>
          <option value="" hidden>Seller</option>
          {sellerOptions}
        </select>

        <div className="price">
          <input type="number" id="min" name="price" min="0" placeholder="Min price" onChange={(e) => {filterObject.minPrice = e.target.value;}}/>
          <span id="priceDivider">-</span>
          <input type="number" id="max" name="price" min="0" placeholder="Max price" onChange={(e) => {filterObject.maxPrice = e.target.value;}}/>
        </div>

        <div className="checkboxes">
          <div className="checkboxWrapper">
            <label className="checkboxHeader">Used</label>
            <input className="checkbox" type="checkbox" onChange={(e) => {filterObject.used = e.target.checked;}}/>
          </div>
          <div className="checkboxWrapper">
            <label className="checkboxHeader">Mint</label>
            <input className="checkbox" type="checkbox" onChange={(e) => {filterObject.mint = e.target.checked;}}/>
          </div>
          <div className="checkboxWrapper">
            <label className="checkboxHeader">Postal</label>
            <input className="checkbox" type="checkbox" onChange={(e) => {filterObject.postalItem = e.target.checked;}}/>
          </div>
          <div className="checkboxWrapper">
            <label className="checkboxHeader">Cert.</label>
            <input className="checkbox" type="checkbox" onChange={(e) => {filterObject.certificate = e.target.checked;}}/>
          </div>
        </div>
        <input className="catalogNumberFilter" placeholder={"Catalog number"} onChange={(e) => {filterObject.catalogueNumber = e.target.value;}}/>

        <button id="applyChanges" onClick={() => {setRequestObject(filterObject); props.refetch(filterObject);}}>
        Apply
        </button>
      </div>
    </Drawer>
  );
    
};

export default DrawerComponent ;
