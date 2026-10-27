package br.unirio.unilink.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unirio.unilink.model.Postagem;
import br.unirio.unilink.service.PostagemService;

/**
 * Porta de entrada do feed: recebe o pedido HTTP e devolve JSON.
 */
@RestController
@RequestMapping("/api/postagens")
public class PostagemController {

    private final PostagemService service;

    public PostagemController(PostagemService service) {
        this.service = service;
    }

    // GET /api/postagens -> lista as postagens, da mais nova para a mais antiga
    @GetMapping
    public List<Postagem> listar() {
        return service.listarFeed();
    }
}
