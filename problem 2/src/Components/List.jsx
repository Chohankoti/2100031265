import React, { useState, useEffect } from 'react';
import { companies, categories } from '../Utils/DropDown';
// import {fetchData} from '../Utils/API';
import { SNP } from '../Utils/data';

import fetchData from '../Utils/DataFilter';

export default function List() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(90000);
  const [selectedCompany, setSelectedCompany] = useState('SNP');
  const [selectedCategory, setSelectedCategory] = useState('Phone');
  const [products, setProducts] = useState(SNP);

//   useEffect(() => {
//     const fetchDataFromAPI = async () => {
//       if (selectedCompany && selectedCategory) {
//         const data = await fetchData(selectedCompany, selectedCategory, minPrice, maxPrice);
//         if (data) {
//           setProducts(data);
//         } else {
//           setProducts([]);
//         }
//       }
//     };

//     fetchDataFromAPI();
//   }, [selectedCompany, selectedCategory, minPrice, maxPrice]);

useEffect(() => {
    fetchData(selectedCompany, selectedCategory, minPrice, maxPrice)
      .then((data) => {
        setProducts(data || []);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [selectedCompany, selectedCategory, minPrice, maxPrice]);


  const handleMinPriceChange = (value) => {
    const newValue = parseInt(value, 10);
    if (newValue <= maxPrice) {
      setMinPrice(newValue);
    } else {
      alert('Minimum price cannot be greater than maximum price');
    }
  };

  const handleMaxPriceChange = (value) => {
    const newValue = parseInt(value, 10);
    if (newValue >= minPrice) {
      setMaxPrice(newValue);
    } else {
      alert('Maximum price cannot be less than minimum price');
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-4">
          {/* Companies Filter */}
          <div className="w-1/2 pr-2">
            <label htmlFor="companies" className="block text-sm font-medium text-gray-700">Companies</label>
            <select
              id="companies"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Select a company</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select>
          </div>

          {/* Categories Filter */}
          <div className="w-1/2 pl-2">
            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</label>
            <select
              id="categories"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="mb-4">
          <label htmlFor="price-range" className="block text-sm font-medium text-gray-700">
            Price Range: ${minPrice} - ${maxPrice}
          </label>
          <div className="flex items-center space-x-4 mt-2">
            <input
              type="number"
              id="minPriceInput"
              min="0"
              max="1000"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="w-20 p-2 border rounded-md"
            />
            <input
              type="range"
              id="minPrice"
              min="0"
              max="1000"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              id="maxPrice"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              id="maxPriceInput"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="w-20 p-2 border rounded-md"
            />
          </div>
        </div>      
      </div>
      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold">{product.productName}</h2>
              <p className="text-gray-700">Price: ${product.price}</p>
              <p className="text-gray-700">Rating: {product.rating}</p>
              <p className="text-gray-700">Discount: {product.discount}%</p>
              <p className={`text-gray-700 ${product.availability === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                Availability: {product.availability === 'yes' ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          ))}
        </div>
    </div>
  );
}
