package com.mycompany.englishflascard;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "FlashcardController", urlPatterns = {"/api/flashcards/*"})
public class FlashcardController extends HttpServlet {
    private final FlashcardService flashcardService = new FlashcardService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setupResponse(response);
        PrintWriter out = response.getWriter();

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            out.print(objectMapper.writeValueAsString(flashcardService.getAllFlashcards()));
        } else {
            try {
                int id = Integer.parseInt(pathInfo.substring(1));
                Flashcard card = flashcardService.getFlashcardById(id);
                if (card != null) {
                    out.print(objectMapper.writeValueAsString(card));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\": \"Flashcard not found\"}");
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\": \"Invalid ID format\"}");
            }
        }
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setupResponse(response);
        PrintWriter out = response.getWriter();

        try {
            Flashcard newCard = objectMapper.readValue(request.getReader(), Flashcard.class);
            flashcardService.addFlashcard(newCard);
            response.setStatus(HttpServletResponse.SC_CREATED);
            out.print(objectMapper.writeValueAsString(newCard));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\": \"Invalid data\"}");
        }
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setupResponse(response);
        PrintWriter out = response.getWriter();

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\": \"Missing ID in request path\"}");
        } else {
            try {
                int id = Integer.parseInt(pathInfo.substring(1));
                Flashcard updatedCard = objectMapper.readValue(request.getReader(), Flashcard.class);
                boolean updated = flashcardService.updateFlashcard(id, updatedCard);
                if (updated) {
                    out.print(objectMapper.writeValueAsString(updatedCard));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\": \"Flashcard not found\"}");
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\": \"Invalid ID format\"}");
            }
        }
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setupResponse(response);
        PrintWriter out = response.getWriter();

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\": \"Missing ID in request path\"}");
        } else {
            try {
                int id = Integer.parseInt(pathInfo.substring(1));
                boolean deleted = flashcardService.deleteFlashcard(id);
                if (deleted) {
                    out.print("{\"message\": \"Flashcard deleted successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\": \"Flashcard not found\"}");
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\": \"Invalid ID format\"}");
            }
        }
        out.flush();
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setupResponse(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setupResponse(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
    }
}
