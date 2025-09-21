package com.mycompany.englishflascard;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class FlashcardService {
    private final List<Flashcard> flashcards = Collections.synchronizedList(new ArrayList<>());
    private final AtomicInteger counter = new AtomicInteger(1);

    public List<Flashcard> getAllFlashcards() {
        return flashcards;
    }

    public Flashcard getFlashcardById(int id) {
        return flashcards.stream()
                .filter(c -> c.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public void addFlashcard(Flashcard card) {
        card.setId(counter.getAndIncrement());
        flashcards.add(card);
    }

    public boolean updateFlashcard(int id, Flashcard updatedCard) {
        for (int i = 0; i < flashcards.size(); i++) {
            if (flashcards.get(i).getId() == id) {
                updatedCard.setId(id);
                flashcards.set(i, updatedCard);
                return true;
            }
        }
        return false;
    }

    public boolean deleteFlashcard(int id) {
        return flashcards.removeIf(c -> c.getId() == id);
    }
}
