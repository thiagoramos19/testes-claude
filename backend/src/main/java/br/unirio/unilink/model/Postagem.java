package br.unirio.unilink.model;

import java.time.LocalDateTime;

/**
 * Uma linha da tabela postagem, junto com o nome e o curso do autor
 * (que vem da tabela estudante).
 */
public record Postagem(
        int id,
        String emailAutor,
        String nomeAutor,
        String cursoAutor,
        String campusAutor,
        String texto,
        String tipoMidia,
        LocalDateTime dataHoraCriacao) {
}
