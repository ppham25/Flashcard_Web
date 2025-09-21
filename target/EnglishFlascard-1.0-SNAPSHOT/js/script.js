/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
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
    
    let flashcards = [];
    let currentIndex = 0;
    
    // Tải flashcards từ server
    async function loadFlashcards() {
        try {
            showLoading();
            const response = await fetch('/EnglishFlascard-1.0-SNAPSHOT/api/flashcards');
            if (response.ok) {
                flashcards = await response.json();
                if (flashcards.length > 0) {
                    updateFlashcard();
                    updateProgress();
                } else {
                    // Nếu không có thẻ nào, hiển thị thông báo
                    wordElement.textContent = "No flashcards available";
                    meaningElement.textContent = "Hãy thêm thẻ mới";
                    exampleElement.textContent = "Use the form below to add your first flashcard";
                }
            } else {
                showError('Failed to load flashcards from server');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Cannot connect to server. Using sample data.');
            loadSampleData();
        } finally {
            hideLoading();
        }
    }
    
    // Tải dữ liệu mẫu nếu kết nối server thất bại
    function loadSampleData() {
        flashcards = [
            {id: 1, word: "Hello", meaning: "Xin chào", example: "Hello, how are you?"},
            {id: 2, word: "Goodbye", meaning: "Tạm biệt", example: "Goodbye, see you tomorrow!"},
            {id: 3, word: "Thank you", meaning: "Cảm ơn", example: "Thank you for your help."}
        ];
        updateFlashcard();
        updateProgress();
    }
    
    // Cập nhật nội dung flashcard hiện tại
    function updateFlashcard() {
        if (flashcards.length > 0 && currentIndex < flashcards.length) {
            const currentCard = flashcards[currentIndex];
            wordElement.textContent = currentCard.word;
            meaningElement.textContent = currentCard.meaning;
            exampleElement.textContent = currentCard.example || '';
            
            // Đảm bảo flashcard hiển thị mặt trước
            flashcard.classList.remove('flipped');
        }
    }
    
    // Cập nhật chỉ số progress
    function updateProgress() {
        currentElement.textContent = currentIndex + 1;
        totalElement.textContent = flashcards.length;
    }
    
    // Chuyển đến flashcard trước
    function prevFlashcard() {
        if (currentIndex > 0) {
            currentIndex--;
            updateFlashcard();
            updateProgress();
        }
    }
    
    // Chuyển đến flashcard tiếp theo
    function nextFlashcard() {
        if (currentIndex < flashcards.length - 1) {
            currentIndex++;
            updateFlashcard();
            updateProgress();
        }
    }
    
    // Lật flashcard
    function flipFlashcard() {
        flashcard.classList.toggle('flipped');
    }
    
    // Thêm flashcard mới
    async function addFlashcard(event) {
        event.preventDefault();
        
        const newWord = document.getElementById('new-word').value;
        const newMeaning = document.getElementById('new-meaning').value;
        const newExample = document.getElementById('new-example').value;
        
        const newCard = {
            word: newWord,
            meaning: newMeaning,
            example: newExample
        };
        
        try {
            showLoading();
            const response = await fetch('/EnglishFlascard-1.0-SNAPSHOT/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCard)
            });
            
            if (response.ok) {
                // Làm mới danh sách flashcards
                await loadFlashcards();
                // Reset form
                addForm.reset();
                showSuccess('Flashcard added successfully!');
                
                // Chuyển đến thẻ vừa thêm
                currentIndex = flashcards.length - 1;
                updateFlashcard();
                updateProgress();
            } else {
                showError('Error adding flashcard. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Cannot connect to server. Flashcard saved locally only.');
            
            // Lưu cục bộ nếu không kết nối được server
            newCard.id = flashcards.length > 0 ? Math.max(...flashcards.map(c => c.id)) + 1 : 1;
            flashcards.push(newCard);
            updateFlashcard();
            updateProgress();
            addForm.reset();
        } finally {
            hideLoading();
        }
    }
    
    // Hiển thị thông báo tải
    function showLoading() {
        // Có thể thêm hiệu ứng loading nếu muốn
    }
    
    // Ẩn thông báo tải
    function hideLoading() {
        // Ẩn hiệu ứng loading
    }
    
    // Hiển thị thông báo lỗi
    function showError(message) {
        alert('Error: ' + message);
    }
    
    // Hiển thị thông báo thành công
    function showSuccess(message) {
        alert('Success: ' + message);
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