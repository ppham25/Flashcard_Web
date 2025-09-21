package com.mycompany.englishflascard;

public class Flashcard {
    private int id;
    private String word;
    private String meaning;
    private String example;

    public Flashcard() {
    }

    public Flashcard(int id, String word, String meaning, String example) {
        this.id = id;
        this.word = word;
        this.meaning = meaning;
        this.example = example;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }
    public void setWord(String word) {
        this.word = word;
    }

    public String getMeaning() {
        return meaning;
    }
    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getExample() {
        return example;
    }
    public void setExample(String example) {
        this.example = example;
    }
}
