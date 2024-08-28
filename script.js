document.addEventListener('DOMContentLoaded', () => {
    const cryptoDataContainer = document.getElementById('crypto-data');

    fetch('/api/crypto')
        .then(response => response.json())
        .then(data => {
            data.forEach((crypto, index) => {
                const row = cryptoDataContainer.insertRow();
                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                const cell3 = row.insertCell();
                const cell4 = row.insertCell();
                const cell5 = row.insertCell();
                const cell6 = row.insertCell();

                cell1.textContent = index + 1;
                cell2.textContent = crypto.name;
                cell3.textContent = crypto.last;
                cell4.textContent = `${crypto.buy}/${crypto.sell}`;
                cell5.textContent = ((crypto.sell - crypto.buy) / crypto.buy * 100).toFixed(2) + '%'; // Placeholder - you'll need to calculate this from the data
                cell6.textContent = (crypto.sell - crypto.buy).toFixed(2); // Placeholder - you'll need to calculate this from the data
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});