package com.bancodehoras.config;

import com.bancodehoras.model.Funcionario;
import com.bancodehoras.repository.FuncionarioRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    private static final List<String> NOMES = Arrays.asList(
        "ADINA COSTA PAIXÃO", "ADRIANA", "ALANA LARISSA", "ALANA COZINHEIRA",
        "ALZENI", "ALMERINDA", "ALESSANDRA", "ANA ROSA", "ANDERSON", "ANGELA",
        "ANDRESSA DE JESUS", "ATALITA", "BARBARA", "CAMILA", "CACILDA",
        "CLAUDETE", "CLAUDICEIA", "CECILIA", "DAIANY LUCAS JAROSISKI",
        "DANIEL", "ELIANE GARCIA", "ELIANE", "ELENICE PAIVA",
        "ELISANGELA BONILHO", "ELISANGELA DA SILVA DIAS", "ERICK MIGUELOTE",
        "EVELYN", "FLAVIO", "IRENE", "IVONETE PAULINO", "IVONETE RIBEIRO",
        "JAQUELINE", "JHENIFER", "JOICY", "JULIANA GOMES", "JULIANA CARRASCO",
        "KELLY", "KETLYN", "LEIDIANA", "LUCIANE", "MARCIA FORMIGARI",
        "MARCIA LIMA", "MARCO", "MARIA INES", "MARILZA", "MICHELE COSTA",
        "MICHELLE PERUCELLO", "NILCEIA DIAS", "ODETE", "OLICIO",
        "PATRICIA", "RUTH", "SAMUEL", "SILVANA", "THATIANE S. NASCIMENTO",
        "TATIANE DE SOUZA", "TATIANA", "TANIA", "VALQUIRIA", "VILMA", "VERA"
    );

    @Bean
    ApplicationRunner seed(FuncionarioRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                NOMES.stream().map(Funcionario::new).forEach(repo::save);
                System.out.println("Base de dados inicializada com " + NOMES.size() + " funcionários.");
            }
        };
    }
}
