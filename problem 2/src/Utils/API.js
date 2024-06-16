async function fetchAuthToken() {
  const authUrl = 'http://20.244.56.144/test/auth';
  const payload = {
    companyName: "KL University",
    clientID: "220910fe-c3dd-496a-98a6-5335a5181725",
    clientSecret: "CIPjRpuZYrVOZLMB",
    ownerName: "KOTI CHOHAN",
    ownerEmail: "chohankoti333@gmail.com",
    rollNo: "2100031265"
  };

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch auth token! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
}

  

  async function fetchData(company, category, minPrice, maxPrice) {
    const baseUrl = 'http://20.244.56.144/test/companies';
    const authToken = await fetchAuthToken();
  
    if (!authToken) {
      console.error('Failed to fetch auth token. Aborting fetch request.');
      return null;
    }
  
    const url = `${baseUrl}/${company}/categories/${category}/products?top=10&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; 
    }
  }
  
  export { fetchAuthToken, fetchData };
  