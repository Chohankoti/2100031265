import { SNP, MYN } from './data'; // Assuming 'CompanyData.js' contains SNP and MYN arrays

async function fetchData(company, category, minPrice, maxPrice) {
  let companyData = [];

  // Select the appropriate company data based on the 'company' parameter
  if (company === 'SNP') {
    companyData = SNP;
  } else if (company === 'MYN') {
    companyData = MYN;
  } else {
    console.error('Invalid company selected');
    return [];
  }

  // Filter products based on minPrice, maxPrice, and category in productName
  const filteredProducts = companyData.filter(product => {
    // Extract category from productName (assuming category is before the first space)
    const productNameParts = product.productName.split(' ');
    const productCategory = productNameParts[0];

    return (
      product.price >= minPrice &&
      product.price <= maxPrice &&
      productCategory.toLowerCase() === category.toLowerCase()
    );
  });

  // Assuming you want to limit the results to top 10 products
  const topProducts = filteredProducts.slice(0, 10);

  return topProducts;
}

export default fetchData;
