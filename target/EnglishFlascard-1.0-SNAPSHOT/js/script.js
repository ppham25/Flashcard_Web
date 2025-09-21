/* 
 * Flashcard App - JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const flashcard = document.getElementById('flashcard');
    const wordElement = document.getElementById('word');
    const meaningElement = document.getElementById('meaning');
    const exampleElement = document.getElementById('example');
    const currentElement = document.getElementById('current');
    const totalElement = document.getElementById('total');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const flipBtn = document.getElementById('flip-btn');
    const addForm = document.getElementById('add-form');
    
    // QUAN TRỌNG: SỬA BASE_URL THÀNH http://localhost:8080
    const BASE_URL = 'http://localhost:8080';
    const API_URL = BASE_URL + '/api/flashcards';
    
    let flashcards = [];
    let currentIndex = 0;
    
    // Tải flashcards từ server
    async function loadFlashcards() {
        try {
            showLoading();
            console.log('Loading flashcards from:', API_URL);
            
            const response = await fetch(API_URL);
            console.log('Response status:', response.status);
            
            if (response.ok) {
                flashcards = await response.json();
                console.log('Loaded', flashcards.length, 'flashcards');
                
                if (flashcards.length > 0) {
                    updateFlashcard();
                    updateProgress();
                } else {
                    wordElement.textContent = "No flashcards available";
                    meaningElement.textContent = "Hãy thêm thẻ mới";
                    exampleElement.textContent = "Use the form below to add your first flashcard";
                }
            } else {
                console.error('Server returned error:', response.status);
                showError('Failed to load flashcards from server. Status: ' + response.status);
                loadSampleData();
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Cannot connect to server. Using sample data. Error: ' + error.message);
            loadSampleData();
        } finally {
            hideLoading();
        }
    }
    
    function loadSampleData() {
        flashcards = [
            {id: 1, word: "Hello", meaning: "Xin chào", example: "Hello, how are you?"},
            {id: 2, word: "Goodbye", meaning: "Tạm biệt", example: "Goodbye, see you tomorrow!"},
            {id: 3, word: "Thank you", meaning: "Cảm ơn", example: "Thank you for your help."}
        ];
        updateFlashcard();
        updateProgress();
    }
    
    function updateFlashcard() {
        if (flashcards.length > 0 && currentIndex < flashcards.length) {
            const currentCard = flashcards[currentIndex];
            wordElement.textContent = currentCard.word;
            meaningElement.textContent = currentCard.meaning;
            exampleElement.textContent = currentCard.example || '';
            flashcard.classList.remove('flipped');
        }
    }
    
    function updateProgress() {
        currentElement.textContent = currentIndex + 1;
        totalElement.textContent = flashcards.length;
    }
    
    function prevFlashcard() {
        if (currentIndex > 0) {
            currentIndex--;
            updateFlashcard();
            updateProgress();
        }
    }
    
    function nextFlashcard() {
        if (currentIndex < flashcards.length - 1) {
            currentIndex++;
            updateFlashcard();
            updateProgress();
        }
    }
    
    function flipFlashcard() {
        flashcard.classList.toggle('flipped');
    }
    
    async function addFlashcard(event) {
        event.preventDefault();
        
        const newWord = document.getElementById('new-word').value;
        const newMeaning = document.getElementById('new-meaning').value;
        const newExample = document.getElementById('new-example').value;
        
        if (!newWord.trim() || !newMeaning.trim()) {
            showError('Please enter both word and meaning');
            return;
        }
        
        const newCard = {
            word: newWord.trim(),
            meaning: newMeaning.trim(),
            example: newExample.trim()
        };
        
        try {
            showLoading();
            console.log('Adding new card to:', API_URL);
            console.log('Request data:', newCard);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newCard)
            });
            
            console.log('Add response status:', response.status);
            console.log('Response headers:', Object.fromEntries([...response.headers]));
            
            if (response.ok) {
                const addedCard = await response.json();
                console.log('Added successfully:', addedCard);
                
                await loadFlashcards();
                addForm.reset();
                showSuccess('Flashcard added successfully!');
                
                currentIndex = flashcards.length - 1;
                updateFlashcard();
                updateProgress();
            } else {
                let errorText;
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = 'Cannot read error response';
                }
                console.error('Server error details:', errorText);
                showError('Error adding flashcard. Status: ' + response.status + '. ' + errorText);
            }
        } catch (error) {
            console.error('Network error details:', error);
            showError('Cannot connect to server: ' + error.message);
            
            // Fallback: save locally
            newCard.id = flashcards.length > 0 ? Math.max(...flashcards.map(c => c.id)) + 1 : 1;
            flashcards.push(newCard);
            updateFlashcard();
            updateProgress();
            addForm.reset();
            showSuccess('Flashcard saved locally (no server connection)');
        } finally {
            hideLoading();
        }
    }
    
    function showLoading() {
        document.body.style.cursor = 'wait';
    }
    
    function hideLoading() {
        document.body.style.cursor = 'default';
    }
    
    function showError(message) {
        alert('❌ Error: ' + message);
    }
    
    function showSuccess(message) {
        alert('✅ Success: ' + message);
    }
    
    // Gán sự kiện
    prevBtn.addEventListener('click', prevFlashcard);
    nextBtn.addEventListener('click', nextFlashcard);
    flipBtn.addEventListener('click', flipFlashcard);
    flashcard.addEventListener('click', flipFlashcard);
    addForm.addEventListener('submit', addFlashcard);
    
    // Khởi tạo
    loadFlashcards();
});