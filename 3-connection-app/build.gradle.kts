
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(ktorLibs.plugins.ktor)
}

group = "connection"
version = "1.0.0-SNAPSHOT"

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

kotlin {
    jvmToolchain(21)
}
dependencies {
    implementation(ktorLibs.serialization.jackson)
    implementation(ktorLibs.server.auth)
    implementation(ktorLibs.server.auth.jwt)
    implementation(ktorLibs.server.config.yaml)
    implementation(ktorLibs.server.contentNegotiation)
    implementation(ktorLibs.server.core)
    implementation(ktorLibs.server.cors)
    implementation(ktorLibs.server.di)
    implementation(ktorLibs.server.netty)
    implementation(ktorLibs.server.routingOpenapi)
    implementation(ktorLibs.server.swagger)
    implementation(libs.damirdenisTudor.ktorServerRabbitmq)
    implementation(libs.logback.classic)
    implementation(libs.openfolder.kotlinAsyncapiKtor)
    implementation(libs.rabbitmq.amqpClient)
    implementation(libs.auth0.jwt)

    testImplementation(kotlin("test"))
    testImplementation(ktorLibs.server.testHost)
}
