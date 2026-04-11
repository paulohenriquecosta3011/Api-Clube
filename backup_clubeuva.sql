-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: ClubeUva
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cidades`
--

DROP TABLE IF EXISTS `cidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cidades` (
  `id_cidade` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uf_sigla` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_municipio` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cidade`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cidades`
--

LOCK TABLES `cidades` WRITE;
/*!40000 ALTER TABLE `cidades` DISABLE KEYS */;
INSERT INTO `cidades` VALUES (1,'Andradas','MG','3100705','2025-05-18 14:30:40','2025-05-18 14:30:40');
/*!40000 ALTER TABLE `cidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convidados`
--

DROP TABLE IF EXISTS `convidados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convidados` (
  `cpf` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ATIVO','INATIVO','EXCLUIDO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVO',
  PRIMARY KEY (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convidados`
--

LOCK TABLES `convidados` WRITE;
/*!40000 ALTER TABLE `convidados` DISABLE KEYS */;
/*!40000 ALTER TABLE `convidados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convites`
--

DROP TABLE IF EXISTS `convites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convites` (
  `id_convite` int unsigned NOT NULL AUTO_INCREMENT,
  `cpf_convidado` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` int DEFAULT NULL,
  `dataconvite` date NOT NULL,
  `status` enum('ATIVO','INATIVO','EXCLUIDO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVO',
  `token` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_convite`),
  UNIQUE KEY `unique_convite_cpf_data` (`cpf_convidado`,`dataconvite`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convites`
--

LOCK TABLES `convites` WRITE;
/*!40000 ALTER TABLE `convites` DISABLE KEYS */;
/*!40000 ALTER TABLE `convites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convites_downloads`
--

DROP TABLE IF EXISTS `convites_downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convites_downloads` (
  `id_download` int unsigned NOT NULL AUTO_INCREMENT,
  `id_convite` int unsigned NOT NULL,
  `id_maquina` int NOT NULL,
  `data_download` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_download`),
  UNIQUE KEY `unq_convite_maquina` (`id_convite`,`id_maquina`),
  KEY `id_maquina` (`id_maquina`),
  CONSTRAINT `convites_downloads_ibfk_1` FOREIGN KEY (`id_convite`) REFERENCES `convites` (`id_convite`),
  CONSTRAINT `convites_downloads_ibfk_2` FOREIGN KEY (`id_maquina`) REFERENCES `maquinas` (`id_maquina`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convites_downloads`
--

LOCK TABLES `convites_downloads` WRITE;
/*!40000 ALTER TABLE `convites_downloads` DISABLE KEYS */;
/*!40000 ALTER TABLE `convites_downloads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id_empresa` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnpj` char(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_cidade` int unsigned DEFAULT NULL,
  `endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('ATIVO','INATIVO','EXCLUIDO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVO',
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `cnpj` (`cnpj`),
  KEY `id_cidade` (`id_cidade`),
  CONSTRAINT `empresas_ibfk_1` FOREIGN KEY (`id_cidade`) REFERENCES `cidades` (`id_cidade`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES (1,'Empresa Teste','12.345.678/0001-90',1,'Rua Principal, 100','1234-5678','contato@clubeexemplo.com','2025-05-18 14:31:26','2026-03-21 19:15:35','ATIVO');
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maquinas`
--

DROP TABLE IF EXISTS `maquinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maquinas` (
  `id_maquina` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int unsigned NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_maquina` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('ATIVO','INATIVO','EXCLUIDO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVO',
  PRIMARY KEY (`id_maquina`),
  UNIQUE KEY `token_maquina` (`token_maquina`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maquinas`
--

LOCK TABLES `maquinas` WRITE;
/*!40000 ALTER TABLE `maquinas` DISABLE KEYS */;
INSERT INTO `maquinas` VALUES (22,1,'PORTARIAxxx ','a9611b05-5fa5-488e-8c2e-a13815d8e9d7','PC da portaria xxx','2026-03-07 21:07:51','ATIVO'),(23,1,'PORTARIA_TEST','60e38bec-431e-4a27-af4e-f0707992d234','PC da portaria teste','2026-03-07 21:13:04','ATIVO'),(24,1,'PORTARIA_TEST','17598a37-6e94-4955-8a3a-fe70b77de8b7','PC da portaria teste','2026-03-07 21:16:15','ATIVO'),(25,1,'PORTARIA_TEST','f1b91741-a686-472b-831b-69cb5cef9b5b','PC da portaria teste','2026-03-07 21:18:38','ATIVO'),(26,1,'PORTARIA_TEST','5ed4d6eb-8f93-41fa-b101-540000e447d0','PC da portaria teste','2026-03-07 21:22:37','ATIVO'),(27,1,'PORTARIA_TEST','17d8cc3a-b965-43f0-b3e4-add5c46fc141','PC da portaria teste','2026-03-07 21:25:51','ATIVO'),(28,1,'PORTARIA_TEST','ee3436f3-9141-4231-9583-1dcd54548bde','PC da portaria teste','2026-03-07 21:26:25','ATIVO');
/*!40000 ALTER TABLE `maquinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` int unsigned NOT NULL AUTO_INCREMENT,
  `id_base` int DEFAULT NULL,
  `name` varchar(63) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(127) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nasc` date DEFAULT NULL,
  `password` varchar(127) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CodigoValidacao` int DEFAULT NULL,
  `id_empresa` int unsigned NOT NULL,
  `tipo_user` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'S',
  `status` enum('ATIVO','INATIVO','EXCLUIDO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVO',
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `uk_users_email_empresa` (`email`,`id_empresa`),
  KEY `fk_users_empresa` (`id_empresa`),
  CONSTRAINT `fk_users_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `fk_usuarios_empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=370 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (21,1,'Paulo Henrique','paulohenriquecosta@hotmail.com',NULL,'$2b$10$Em48HGzA/2LJh8mXX7yalu5.qcWE00DavGCYAjjJCTuuzraAk9vhC','2025-05-21 18:25:27','2026-02-21 17:52:15',396587,1,'A','ATIVO');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-11 15:18:30
