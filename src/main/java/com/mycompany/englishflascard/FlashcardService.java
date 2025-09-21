/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.englishflascard;

/**
 *
 * @author Admin
 */

import java.util.ArrayList;
import java.util.List;

public class FlashcardService {
    private static List<Flashcard> flashcards = new ArrayList<>();
    private static int nextId = 1;
    
    static {
        // Thêm một số flashcard mẫu
        flashcards.add(new Flashcard(nextId++, "Hello", "Xin chào", "Hello, how are you?"));
        flashcards.add(new Flashcard(nextId++, "Goodbye", "Tạm biệt", "Goodbye, see you tomorrow!"));
        flashcards.add(new Flashcard(nextId++, "Thank you", "Cảm ơn", "Thank you for your help."));
        flashcards.add(new Flashcard(nextId++, "Please", "Làm ơn", "Please give me that book."));
        flashcards.add(new Flashcard(nextId++, "Sorry", "Xin lỗi", "I'm sorry for being late."));
    }
    
    public List<Flashcard> getAllFlashcards() {
        return new ArrayList<>(flashcards);
    }
    
    public Flashcard getFlashcardById(int id) {
        for (Flashcard card : flashcards) {
            if (card.getId() == id) {
                return card;
            }
        }
        return null;
    }
    
    public void addFlashcard(Flashcard flashcard) {
        flashcard.setId(nextId++);
        flashcards.add(flashcard);
    }
    
    public boolean updateFlashcard(int id, Flashcard updatedFlashcard) {
        for (int i = 0; i < flashcards.size(); i++) {
            if (flashcards.get(i).getId() == id) {
                updatedFlashcard.setId(id);
                flashcards.set(i, updatedFlashcard);
                return true;
            }
        }
        return false;
    }
    
    public boolean deleteFlashcard(int id) {
        return flashcards.removeIf(card -> card.getId() == id);
    }
}
