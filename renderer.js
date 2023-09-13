const { ipcRenderer } = require('electron');

function showAlert(title, text, icon) {
    Swal.fire({ title, text, icon });
}

function toggleCookieInputDisplay() {
    const cookieInput = document.getElementById('cookieInput');
    cookieInput.style.display = cookieInput.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('searchButton').addEventListener('click', () => {
    const songName = document.getElementById('songName').value;
    ipcRenderer.send('search-song', songName);
});

ipcRenderer.on('search-result', (event, songs) => {
    const tableBody = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    songs.forEach(song => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = song.song_id;
        row.insertCell(1).textContent = song.song_name;
        row.insertCell(2).textContent = song.singer;
        const downloadCell = row.insertCell(3);
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载';
        downloadButton.classList.add('btn', 'btn-success');
        downloadButton.addEventListener('click', () => {
            ipcRenderer.send('download-song', song);
        });
        downloadCell.appendChild(downloadButton);
    });
});

document.getElementById('updateCookieButton').addEventListener('click', () => {
    const cookieInput = document.getElementById('cookieInput');

    if (cookieInput.style.display === 'none') {
        cookieInput.style.display = 'block';
    } else {
        Swal.fire({
            title: '你确定吗?',
            text: "你即将更新Cookie。",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '是的，更新它!',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                const newCookie = cookieInput.value;
                ipcRenderer.send('update-cookie', newCookie);
                toggleCookieInputDisplay();
            } else {
                toggleCookieInputDisplay();
            }
        });
    }
});

ipcRenderer.on('update-cookie-status', (event, status) => {
    const icon = status.includes('失败') ? 'error' : 'success';
    showAlert('更新Cookie状态', status, icon);
});

ipcRenderer.on('download-status', (event, status) => {
    const icon = status.includes('失败') ? 'error' : 'success';
    showAlert('下载状态', status, icon);
});
