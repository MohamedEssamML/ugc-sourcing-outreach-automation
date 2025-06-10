document.getElementById('creator-search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const niche = document.getElementById('niche').value;
  const location = document.getElementById('location').value;
  const age = document.getElementById('age').value;
  const accent = document.getElementById('accent').value;

  // Call Python scraper (mock data in demo)
  const creators = await pyodide.runPythonAsync(`
    from instagram_scraper import scrape_instagram_profiles
    import json
    config = json.loads(await (await pyfetch('config.json')).text())
    creators = await scrape_instagram_profiles(config, niche="${niche}", location="${location}", age="${age}", accent="${accent}")
    json.dumps(creators)
  `);
  
  const parsedCreators = JSON.parse(creators);
  const resultsDiv = document.getElementById('search-results');
  resultsDiv.innerHTML = '<h3>Search Results</h3>' + parsedCreators.map(c => 
    `<p>${c.name} (@${c.handle}) - ${c.niche}, ${c.location}, ${c.age}, ${c.accent}</p>`).join('');

  // Save to local storage and update table
  localStorage.setItem('creators', JSON.stringify(parsedCreators));
  await pyodide.runPythonAsync(`await save_creators()`);
  updateCreatorTable(parsedCreators);
});

document.getElementById('creator-add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const creator = {
    name: document.getElementById('full-name').value,
    handle: document.getElementById('handle').value,
    url: document.getElementById('url').value,
    age: document.getElementById('add-age').value || 'Unknown',
    location: document.getElementById('add-location').value || 'Unknown',
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value || '',
    niche: document.getElementById('add-niche').value || 'Unknown',
    accent: document.getElementById('add-accent').value || 'Unknown',
    status: 'New',
    follow_up: ''
  };

  let creators = JSON.parse(localStorage.getItem('creators') || '[]');
  creators.push(creator);
  localStorage.setItem('creators', JSON.stringify(creators));
  await pyodide.runPythonAsync(`await save_to_sheets(json.loads(js.localStorage.getItem('creators')), json.loads(await (await pyfetch('config.json')).text()))`);
  updateCreatorTable(creators);
  document.getElementById('creator-add-form').reset();
});

function updateCreatorTable(creators) {
  const tbody = document.getElementById('creator-table-body');
  tbody.innerHTML = '';
  creators.forEach(creator => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${creator.name}</td>
      <td>${creator.handle}</td>
      <td><a href="${creator.url}" target="_blank">${creator.url}</a></td>
      <td>${creator.age}</td>
      <td>${creator.location}</td>
      <td>${creator.email}</td>
      <td>${creator.phone}</td>
      <td>${creator.niche}</td>
      <td>${creator.accent}</td>
      <td>${creator.status}</td>
      <td>${creator.follow_up}</td>
      <td><button onclick="updateStatus('${creator.email}', 'Contacted')">Mark Contacted</button></td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById('send-emails').addEventListener('click', async () => {
  const status = document.getElementById('outreach-status');
  status.textContent = 'Sending emails...';
  await pyodide.runPythonAsync(`
    from email_sender import send_emails
    import json
    config = json.loads(await (await pyfetch('config.json')).text())
    await send_emails(config)
  `);
  status.textContent = 'Emails sent! Check console for details.';
  const creators = JSON.parse(localStorage.getItem('creators') || '[]');
  updateCreatorTable(creators);
});

document.getElementById('send-dms').addEventListener('click', async () => {
  const status = document.getElementById('outreach-status');
  status.textContent = 'Sending DMs...';
  await pyodide.runPythonAsync(`
    from instagram_dm import send_dms
    import json
    config = json.loads(await (await pyfetch('config.json')).text())
    await send_dms(config)
  `);
  status.textContent = 'DMs sent! Check console for details.';
  const creators = JSON.parse(localStorage.getItem('creators') || '[]');
  updateCreatorTable(creators);
});

async function updateStatus(email, status) {
  await pyodide.runPythonAsync(`
    from sheets_manager import update_creator_status
    import json
    config = json.loads(await (await pyfetch('config.json')).text())
    await update_creator_status('${email}', '${status}', config)
  `);
  const creators = JSON.parse(localStorage.getItem('creators') || '[]');
  updateCreatorTable(creators);
}