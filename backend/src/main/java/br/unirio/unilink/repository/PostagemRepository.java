package br.unirio.unilink.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import br.unirio.unilink.model.Postagem;

/**
 * Unica classe do modulo de feed que fala com o banco. Todo o SQL fica aqui.
 */
@Repository
public class PostagemRepository {

    private final JdbcTemplate jdbc;

    public PostagemRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Postagem> listarTodas() {
        String sql = """
                SELECT p.idpostagem, p.fk_email_autor, e.nome, e.curso, e.campus_predio,
                       p.conteudo_texto, p.tipo_midia, p.data_hora_criacao
                FROM postagem p
                JOIN estudante e ON e.email_institucional = p.fk_email_autor
                ORDER BY p.data_hora_criacao DESC
                """;
        return jdbc.query(sql, (rs, linha) -> new Postagem(
                rs.getInt("idpostagem"),
                rs.getString("fk_email_autor"),
                rs.getString("nome"),
                rs.getString("curso"),
                rs.getString("campus_predio"),
                rs.getString("conteudo_texto"),
                rs.getString("tipo_midia"),
                rs.getTimestamp("data_hora_criacao").toLocalDateTime()));
    }
}
