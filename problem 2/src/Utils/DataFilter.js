// useEffect(() => {
//     fetchData(selectedCompany, selectedCategory, minPrice, maxPrice)
//       .then((data) => {
//         setProducts(data || []);
//       })
//       .catch((error) => {
//         console.error('Error fetching products:', error);
//       });
//   }, [selectedCompany, selectedCategory, minPrice, maxPrice]);


import { SNP, MYN } from './data'; 

async function fetchData(company, category, minPrice, maxPrice) {
  let companyData = [];

  if (company === 'SNP') {
    companyData = SNP;
  } else if (company === 'MYN') {
    companyData = MYN;
  } else {
    console.error('Invalid company selected');
    return [];
  }

  const filteredProducts = companyData.filter(product => {
    const productNameParts = product.productName.split(' ');
    const productCategory = productNameParts[0];

    return (
      product.price >= minPrice &&
      product.price <= maxPrice &&
      productCategory.toLowerCase() === category.toLowerCase()
    );
  });

  const topProducts = filteredProducts.slice(0, 10);

  return topProducts;
}

export default fetchData;
