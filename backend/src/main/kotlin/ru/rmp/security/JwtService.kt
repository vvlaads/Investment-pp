package ru.rmp.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import javax.crypto.SecretKey
import java.util.*

@Service
class JwtService(private val jwtProperties: JwtProperties) {

    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(jwtProperties.secret.encodeToByteArray())
    }

    fun generateToken(login: String, userId: Long): String {
        return Jwts.builder()
            .subject(login)
            .claim("userId", userId)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + jwtProperties.expirationMs))
            .signWith(key)
            .compact()
    }

    fun parseToken(token: String): Claims? {
        return try {
            Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .payload
        } catch (_: Exception) {
            null
        }
    }

    fun getLoginFromToken(token: String): String? = parseToken(token)?.subject
    fun getUserIdFromToken(token: String): Long? = parseToken(token)?.get("userId", Long::class.java)
}
