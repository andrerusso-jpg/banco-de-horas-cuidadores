package com.bancodehoras.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/** Redireciona rotas do React SPA para index.html */
@Controller
public class SpaController {

    @RequestMapping(value = { "/", "/{path:[^\\.]*}", "/{path1:[^\\.]*}/{path2:[^\\.]*}" })
    public String spa() {
        return "forward:/index.html";
    }
}
