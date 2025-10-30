-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2025 at 04:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `penjualan`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`` PROCEDURE `get_top_product` ()   BEGIN
    
    SELECT
        p.product_name,
        SUM(s.quantity) AS total_penjualan
    FROM
        sales s
    INNER JOIN
        product p ON s.product_code = p.product_code
    GROUP BY
        p.product_code, p.product_name
    ORDER BY
        total_penjualan DESC
    LIMIT 5;

END$$

CREATE DEFINER=`` PROCEDURE `sp_create_sale` (IN `p_sales_referance` VARCHAR(100), IN `p_product_code` VARCHAR(100), IN `p_quantity` INT)   BEGIN
    DECLARE v_current_stock INT;
    DECLARE v_current_price DECIMAL(10, 2);
    DECLARE v_subtotal DECIMAL(10, 2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL; 
    END;

    START TRANSACTION;

    SELECT 
        stock, 
        price 
    INTO 
        v_current_stock, 
        v_current_price
    FROM 
        product 
    WHERE 
        product_code = p_product_code 
    FOR UPDATE;

    IF v_current_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stok tidak mencukupi untuk transaksi ini';
    ELSE
        SET v_subtotal = v_current_price * p_quantity;

        INSERT INTO sales (
            sales_referance, 
            sales_date, 
            product_code, 
            quantity, 
            price, 
            subtotal, 
            created_at, 
            updated_at
        )
        VALUES (
            p_sales_referance,
            NOW(),
            p_product_code,
            p_quantity,
            v_current_price,
            v_subtotal,
            NOW(),
            NOW()
        );

        UPDATE product
        SET 
            stock = stock - p_quantity,
            updated_at = NOW()
        WHERE 
            product_code = p_product_code;

    END IF;

    COMMIT;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id_product` int(11) NOT NULL,
  `product_code` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id_product`, `product_code`, `product_name`, `price`, `stock`, `created_at`, `updated_at`) VALUES
(1, 'SKU-001', 'Buku Tulis', 5000.00, 87, '2025-10-30 08:58:27', '2025-10-30 16:28:02'),
(2, 'SKU-002', 'Pulpen Gel Hitam 0.5mm', 3500.00, 235, '2025-10-30 09:11:58', '2025-10-30 11:36:01'),
(3, 'SKU-003', 'Pensil 2B (Pak isi 12)', 24000.00, 150, '2025-10-30 09:12:09', '2025-10-30 09:12:09'),
(4, 'SKU-004', 'Penghapus Putih Besar', 2500.00, 350, '2025-10-30 09:12:16', '2025-10-30 10:53:30'),
(5, 'SKU-005', 'Buku Gambar A4', 8000.00, 110, '2025-10-30 09:12:22', '2025-10-30 10:18:43'),
(6, 'SKU-006', 'Sticky Notes Kuning (Medium)', 6500.00, 201, '2025-10-30 09:12:26', '2025-10-30 13:44:13'),
(7, 'ELC-001', 'Mouse Wireless Standar', 85000.00, 75, '2025-10-30 09:12:32', '2025-10-30 09:12:32'),
(8, 'ELC-002', 'Flashdisk 64GB USB 3.0', 120000.00, 53, '2025-10-30 09:12:37', '2025-10-30 10:46:13'),
(9, 'FB-001', 'Kopi Robusta Bubuk 200g', 22000.00, 57, '2025-10-30 09:12:43', '2025-10-30 11:02:47'),
(10, 'FB-002', 'Teh Melati Celup (Isi 25)', 15000.00, 200, '2025-10-30 09:12:48', '2025-10-30 09:12:48'),
(11, 'SKU-20', 'Tas Ransel', 140000.00, 10, '2025-10-30 09:12:54', '2025-10-30 13:21:59'),
(12, 'SKU-037', 'Sandal Jepit', 12000.00, 90, '2025-10-30 14:08:48', '2025-10-30 14:08:48');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id_sales` int(11) NOT NULL,
  `sales_referance` varchar(100) NOT NULL,
  `sales_date` datetime NOT NULL,
  `product_code` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id_sales`, `sales_referance`, `sales_date`, `product_code`, `quantity`, `price`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 'INV-2025-011', '2025-10-30 16:28:02', 'SKU-001', 3, 5000.00, 15000.00, '2025-10-30 16:28:02', '2025-10-30 16:28:02'),
(2, 'inv-001', '2025-10-30 10:18:43', 'SKU-005', 10, 8000.00, 80000.00, '2025-10-30 10:18:43', '2025-10-30 10:18:43'),
(3, 'inv-02', '2025-10-30 10:46:13', 'ELC-002', 7, 120000.00, 840000.00, '2025-10-30 10:46:13', '2025-10-30 10:46:13'),
(4, 'inv-03', '2025-10-30 10:53:30', 'SKU-004', 50, 2500.00, 125000.00, '2025-10-30 10:53:30', '2025-10-30 10:53:30'),
(5, 'inv-6', '2025-10-30 11:02:47', 'FB-001', 23, 22000.00, 506000.00, '2025-10-30 11:02:47', '2025-10-30 11:02:47'),
(6, 'inv-10', '2025-10-30 11:36:01', 'SKU-002', 15, 3500.00, 52500.00, '2025-10-30 11:36:01', '2025-10-30 11:36:01'),
(7, 'INV-18', '2025-10-30 13:44:13', 'SKU-006', 99, 6500.00, 643500.00, '2025-10-30 13:44:13', '2025-10-30 13:44:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `username`, `password`) VALUES
(1, 'admin', '$2b$10$Cf6wHojEvnnVQ98OvJwKBu3m4xu4An3W7Sp8maePx.qxAse3oIlDi'),
(2, 'admin2', '$2b$10$7z3Ha.m6cOxGfhRze4Ix3u8mm7nr5TpuiIEYrrcfodXlcEfHKOwmW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id_product`),
  ADD UNIQUE KEY `product_code` (`product_code`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id_sales`),
  ADD UNIQUE KEY `sales_referance` (`sales_referance`),
  ADD KEY `product_code` (`product_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id_sales` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_code`) REFERENCES `product` (`product_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
