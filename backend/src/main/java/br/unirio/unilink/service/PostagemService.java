package br.unirio.unilink.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.unirio.unilink.model.Postagem;
import br.unirio.unilink.repository.PostagemRepository;

/**
 * Regras de negocio do feed (UC08 e UC09). Por enquanto so repassa a
 * listagem; as validacoes de publicar postagem entram aqui depois.
 */
@Service
public class PostagemService {

    private final PostagemRepository repository;

    public PostagemService(PostagemRepository repository) {
        this.repository = repository;
    }

    public List<Postagem> listarFeed() {
        return repository.listarTodas();
    }
}
