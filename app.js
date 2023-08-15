
document.addEventListener('DOMContentLoaded', function () {
    const jobTitle = document.querySelector('#job-title');
    const btn = document.querySelectorAll('.btn');
    const mapBtn = document.querySelector('.map');
    let index = 0;
    const jobs = [];
    let map;

    function showLoading() {
        jobTitle.innerHTML = 'Job Title (fetching...) <i class="fas fa-spinner fa-spin"></i>';
    }

    function Job(title, country) {
        this.title = title;
        this.country = country;
    }

    async function fetchJobs() {
        showLoading();

        const proxyUrl = 'http://127.0.0.1:8080/';
        const targetUrl = 'https://careers.moveoneinc.com/rss/all-rss.xml';
        const response = await fetch(proxyUrl + targetUrl);

        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const items = xmlDoc.getElementsByTagName("item");

            for (let item of items) {
                const title = item.getElementsByTagName("title")[0].textContent;
                const country = item.getElementsByTagName("country")[0].textContent;
                createJob(title, country);
            }

            jobTitle.textContent = jobs[0].title;
        } else {
            console.error("Error fetching RSS feed:", response.status, response.statusText);
        }
    }

    function createJob(title, country) {
        let job = new Job(title, country);
        jobs.push(job);
    }



function initMap(country) {
    // Check if map is already initialized
    if (map) {
        map.remove(); // Remove previous map instance
    }

    map = L.map('map').setView([0, 0], 2); // Create new map instance
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Geocode the country
    fetch(`https://nominatim.openstreetmap.org/search?country=${country}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                map.setView([lat, lon], 5);
                L.marker([lat, lon]).addTo(map);
            } else {
                console.error('Geocode was not successful for the following reason: ' + country + ' not found');
            }
        });
}

    btn.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            if (e.currentTarget.classList.contains('prev')) {
                if (index === 0) {
                    index = jobs.length;
                }
                index--;
                jobTitle.textContent = jobs[index].title;
                
            }

            if (e.currentTarget.classList.contains('next')) {
                index++;
                if (index === jobs.length) {
                    index = 0;
                }

                jobTitle.textContent = jobs[index].title;
                
            }
            initMap(jobs[index].country);
        });
    });

    mapBtn.addEventListener('click', function (e) {
        e.preventDefault();
        initMap(jobs[index].country);
    });

    fetchJobs();
});


