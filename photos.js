(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'job-photos';
  dialog.setAttribute('aria-label', 'Job photos');
  dialog.innerHTML = '<header><h2>Job photos</h2><button type="button" aria-label="Close photos">×</button></header><label class="upload-label">Add job photos<input type="file" accept="image/*" multiple></label><p role="status"></p><div class="photo-list"></div>';
  document.body.append(dialog);
  const status = dialog.querySelector('[role=status]');
  const input = dialog.querySelector('input');
  const list = dialog.querySelector('.photo-list');
  const urls = [];
  let jobId = '';
  let database;
  function openDb() {
    if (!database) database = new Promise((resolve, reject) => {
      const req = indexedDB.open('crewstack-job-photos', 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore('photos', {keyPath:'id', autoIncrement:true}).createIndex('job', 'job');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => { database = null; reject(req.error); };
    });
    return database;
  }
  async function run(mode, operation) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photos', mode);
      const result = operation(tx.objectStore('photos'));
      tx.oncomplete = () => resolve(result?.result);
      tx.onabort = tx.onerror = () => reject(tx.error);
    });
  }
  function clearPhotos() {
    list.replaceChildren();
    while (urls.length) URL.revokeObjectURL(urls.pop());
  }
  async function show(id) {
    const items = await run('readonly', store => store.index('job').getAll(id));
    if (jobId !== id || !dialog.open) return;
    clearPhotos();
    status.textContent = items.length ? items.length + (items.length === 1 ? ' photo saved on this device' : ' photos saved on this device') : 'No photos yet.';
    for (const item of items) {
      const frame = document.createElement('figure');
      const img = document.createElement('img');
      img.src = URL.createObjectURL(item.file);
      urls.push(img.src);
      img.alt = item.name;
      const caption = document.createElement('figcaption');
      caption.textContent = item.name;
      frame.append(img, caption);
      list.append(frame);
    }
  }
  document.addEventListener('click', async event => {
    const trigger = event.target.closest('[data-job-photos]');
    if (!trigger) return;
    jobId = trigger.dataset.jobPhotos;
    clearPhotos();
    status.textContent = 'Loading photos…';
    dialog.showModal();
    try { await show(jobId); } catch { status.textContent = 'Photos could not be opened in this browser.'; }
  });
  input.onchange = async () => {
    const id = jobId;
    const files = [...input.files];
    input.value = '';
    if (!files.length) return;
    if (files.some(file => !file.type.startsWith('image/') || file.size > 16 * 1024 * 1024)) {
      status.textContent = 'Choose image files smaller than 16 MB each.';
      return;
    }
    input.disabled = true;
    try {
      await run('readwrite', store => { for (const file of files) store.add({job:id, name:file.name, file}); });
      await show(id);
    } catch { status.textContent = 'Could not save these photos. Check available device storage.'; }
    finally { input.disabled = false; }
  };
  dialog.querySelector('button').onclick = () => dialog.close();
  dialog.onclose = () => { jobId = ''; clearPhotos(); };
})();
