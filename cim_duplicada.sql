-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-02-2024 a las 09:51:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cim_duplicada`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens`
--

CREATE TABLE `tokens` (
  `token` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tokens`
--

INSERT INTO `tokens` (`token`, `user_id`) VALUES
('f3dc32fb070bd5577316c7d78bb9b51b2b9ed53eae8a78dbe2b33dc44701d012', 1),
('9d785ebc94290691441996ced9e58991fc329b5ea3b707158cfdf11bff1c4d78', 2),
('b96046770d4d9d6fb1d4f0bb82554661930f39f941886e5cb70b33c62dcce2ed', 3),
('b7dbe2e0a74b31859fe00f06255dd9a3700c5bb5a3c50c348f6cc116acd408f8', 4),
('cf360fd55127c727eb74cf0fb823f0e3962c8c4cc8766e13a76511cd70fe0580', 5),
('413cfce3efb550a10fdb95da7af4d5334b6128f68f83a3d20fbc12940a86c811', 6),
('6af40300d31a8c3bbf41ff58bedd4bced1ac43e1c9d41a82ff589d0d53cad54d', 7),
('7f6e90fc29109e752ed58bd3ad3548d706e797a9831c90fb8420a070a645ec20', 8),
('3e2283c9a4f0dc29d9c9af8835f53a9df297968b21efbdb8a56c15238b1ac4e6', 9),
('fbc2493e87490bc68827f9f2afa35be6402c797c0e8cec7532924c89a7082818', 10),
('2a842df5b4f1c1a031b3f6eb8265e601baf6f0bea7592ca3a6e3196fe7550282', 11),
('f0b944af665769997319a93d169e2cf241dddd00d6d3b037a06e92fc4050cdd0', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'Antonio', '5e4f5f9dcb97db3bf3c9093f518fade4'),
(2, 'lucia_perez', '81dc9bdb52d04dc20036dbd8313ed055'),
(3, 'lucia_perez', '81dc9bdb52d04dc20036dbd8313ed055'),
(4, 'lucia_perz', '81dc9bdb52d04dc20036dbd8313ed055'),
(5, 'lucia_perez', '81dc9bdb52d04dc20036dbd8313ed055'),
(6, 'lucia_perez', '81dc9bdb52d04dc20036dbd8313ed055'),
(7, 'lucia', '81dc9bdb52d04dc20036dbd8313ed055'),
(8, 'luciiita', '81dc9bdb52d04dc20036dbd8313ed055'),
(9, 'ilia_topuria', '81dc9bdb52d04dc20036dbd8313ed055'),
(10, 'usuario', '81dc9bdb52d04dc20036dbd8313ed055'),
(11, 'usuario', '81dc9bdb52d04dc20036dbd8313ed055'),
(12, 'gonzalo_campos', '81dc9bdb52d04dc20036dbd8313ed055');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`token`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
