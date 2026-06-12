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
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cep/**").permitAll()
                        .requestMatchers(HttpMethod.GET,   "/usuarios/perfil").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/perfil").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/perfil/foto").authenticated()
                        .requestMatchers("/usuarios", "/usuarios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/logs/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/categorias/ativas").authenticated()
                        .requestMatchers("/categorias", "/categorias/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.POST, "/api/solicitacoes").hasRole("CIDADAO")
                        .requestMatchers(HttpMethod.PUT,  "/api/solicitacoes/*").hasRole("CIDADAO")
                        .requestMatchers(HttpMethod.GET,  "/api/solicitacoes/minhas").hasRole("CIDADAO")
                        .requestMatchers("/api/solicitacoes/*/aprovar").hasRole("GESTOR")
                        .requestMatchers("/api/solicitacoes/*/rejeitar").hasRole("GESTOR")
                        .requestMatchers("/api/solicitacoes/*/reativar").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/aguardando-aprovacao").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/rejeitadas").hasRole("GESTOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/finalizadas").hasRole("GESTOR")
                        .requestMatchers("/api/solicitacoes/*/pegar").hasRole("ATENDENTE")
                        .requestMatchers("/api/solicitacoes/*/finalizar").hasRole("ATENDENTE")
                        .requestMatchers("/api/solicitacoes/*/desvincular").hasRole("ATENDENTE")
                        .requestMatchers("/api/solicitacoes/*/reabrir").hasRole("ATENDENTE")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/fila").hasRole("ATENDENTE")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/finalizadas-por-mim").hasRole("ATENDENTE")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/em-andamento")
                            .hasAnyRole("GESTOR", "ATENDENTE")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/solicitacoes/*/revelar-anonimato").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/solicitacoes/*/vincular-atendente").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/solicitacoes/*/admin-update").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitacoes/*").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/solicitacoes/*/imagens").hasAnyRole("CIDADAO", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/solicitacoes/*/imagens/*").hasAnyRole("CIDADAO", "ADMINISTRADOR")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
