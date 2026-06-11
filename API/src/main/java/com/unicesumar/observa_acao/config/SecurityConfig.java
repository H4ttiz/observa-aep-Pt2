package com.unicesumar.observa_acao.config;

import com.unicesumar.observa_acao.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/login",
                                "/auth/cadastro",
                                "/auth/refresh",
                                "/auth/logout"
                        ).permitAll()
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        // CEP proxy — acessível sem autenticação (usado no cadastro)
                        .requestMatchers(HttpMethod.GET, "/api/cep/**").permitAll()
                        // /usuarios/perfil e /usuarios/perfil/foto — qualquer usuário autenticado
                        .requestMatchers(HttpMethod.GET,   "/usuarios/perfil").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/perfil").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/perfil/foto").authenticated()
                        // demais endpoints de /usuarios — somente ADMINISTRADOR
                        .requestMatchers("/usuarios", "/usuarios/**").hasRole("ADMINISTRADOR")
                        // logs — somente ADMINISTRADOR
                        .requestMatchers(HttpMethod.GET, "/logs/**").hasRole("ADMINISTRADOR")
                        // categorias/ativas — autenticado (deve vir antes da regra de ADMINISTRADOR)
                        .requestMatchers(HttpMethod.GET, "/categorias/ativas").authenticated()
                        // demais endpoints de /categorias — somente ADMINISTRADOR
                        .requestMatchers("/categorias", "/categorias/**").hasRole("ADMINISTRADOR")
                        // solicitações — CIDADÃO
                        .requestMatchers(HttpMethod.POST, "/api/solicitacoes").hasRole("CIDADAO")
                        .requestMatchers(HttpMethod.PUT,  "/api/solicitacoes/*").hasRole("CIDADAO")
                        .requestMatchers(HttpMethod.GET,  "/api/solicitacoes/minhas").hasRole("CIDADAO")
                        // solicitações — GESTOR
                        .requestMatchers("/api/solicitacoes/*/aprovar").hasRole("GESTOR")
                        .requestMatchers("/api/solicitacoes/*/rejeitar").hasRole("GESTOR")
                        .requestMatchers("/api/solicitacoes/*/reativar").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/aguardando-aprovacao").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/rejeitadas").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/finalizadas").hasRole("GESTOR")
                        // solicitações — ATENDENTE
                        .requestMatchers("/api/solicitacoes/*/pegar").hasRole("ATENDENTE")
                        .requestMatchers("/api/solicitacoes/*/finalizar").hasRole("ATENDENTE")
                        .requestMatchers("/api/solicitacoes/*/desvincular").hasRole("ATENDENTE")
                        .requestMatchers("/api/solicitacoes/*/reabrir").hasRole("ATENDENTE")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/fila").hasRole("ATENDENTE")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/finalizadas-por-mim").hasRole("ATENDENTE")
                        // solicitações — GESTOR + ATENDENTE (em-andamento)
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/em-andamento")
                            .hasAnyRole("GESTOR", "ATENDENTE")
                        // solicitações — ADMINISTRADOR
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/solicitacoes/*/revelar-anonimato").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/solicitacoes/*/vincular-atendente").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/solicitacoes/*/admin-update").hasRole("ADMINISTRADOR")
                        // solicitações — detalhes (qualquer autenticado)
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/*").authenticated()
                        // imagens de solicitações — CIDADÃO ou ADM (verificado no service)
                        .requestMatchers("/api/solicitacoes/*/imagens/**").authenticated()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
