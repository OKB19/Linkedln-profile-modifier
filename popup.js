document.getElementById('change-pictures').addEventListener('click', () => {
    const imageUploadInput = document.getElementById('image-upload').files[0];
    const statusElement = document.getElementById('status');
  
    if (imageUploadInput) {
      // Use the uploaded image file
      const reader = new FileReader();
      reader.onload = function(event) {
        updateProfilePictures(event.target.result);
      };
      reader.readAsDataURL(imageUploadInput);
    } else {
      setStatus('Please upload an image file.', false);
    }
  });
  
  function updateProfilePictures(imageUrl) {
    // Store the image URL in Chrome storage
    chrome.storage.sync.set({ imageUrl }, () => {
      // Send a message to the content script to replace profile pictures
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Ensure the tab is LinkedIn's feed page
        if (tabs[0].url.includes('linkedin.com/feed')) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'replacePictures', imageUrl }, (response) => {
            if (response && response.success) {
              setStatus(' updated!', true);
            } else {
              setStatus('Failed to update profile pictures.', false);
            }
          });
        } else {
          setStatus('Please open LinkedIn feed page.', false);
        }
      });
    });
  }
  
  function setStatus(message, isSuccess) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.style.color = isSuccess ? 'green' : 'red';
    statusElement.classList.add('show');
    setTimeout(() => {
      statusElement.classList.remove('show');
    }, 3000);
  }