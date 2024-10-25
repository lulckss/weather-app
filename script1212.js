document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Impede o recarregamento da página
  
    const city = document.getElementById('city').value;  // Pega o valor do input
    const apiKey = "410b9acfb60984a4d3b30f3fdce80b66" ;  // Substitua pela sua chave da API
  
    // URL da API com o nome da cidade e a chave de API
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    // Faz a requisição usando fetch
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then(data => {
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const weatherDiv = document.getElementById('weather');
  
        // Exibe os dados na página
        weatherDiv.innerHTML = `
          <h2>Weather in ${data.name}</h2>
          <p>Temperature: ${temperature}°C</p>
          <p>Description: ${description}</p>
        `;
      })
      .catch(error => {
        const weatherDiv = document.getElementById('weather');
        weatherDiv.innerHTML = `<p>${error.message}</p>`;
      });
  });
  