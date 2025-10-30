// app.js
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api";
  let jwtToken = localStorage.getItem("jwtToken");
  let allProducts = [];

  const pages = document.querySelectorAll(".page");
  const navButtons = document.querySelectorAll("nav button");
  const loginInput = document.getElementById("jwt-token-input");
  const loginButton = document.getElementById("login-button");
  const loginStatus = document.getElementById("login-status");

  if (jwtToken) {
    loginStatus.textContent = "Status: Login (Token tersimpan)";
    loginStatus.style.color = "green";
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const pageId = `page-${button.getAttribute("data-page")}`;
      pages.forEach((page) => {
        page.classList.toggle("hidden", page.id !== pageId);
      });

      if (pageId === "page-dashboard") loadDashboard();
      if (pageId === "page-master") loadMasterProducts();
      if (pageId === "page-transaksi") loadTransactionPage();
    });
  });

  async function fetchAPI(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };
    const config = { ...options, headers };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      alert("Token tidak valid atau kadaluwarsa. Silakan login ulang.");
      jwtToken = null;
      localStorage.removeItem("jwtToken");
      loginStatus.textContent = "Status: Token Error";
      loginStatus.style.color = "red";
      throw new Error("Unauthorized");
    }
    return response;
  }

  loginButton.addEventListener("click", () => {
    const token = loginInput.value.trim();
    if (token) {
      jwtToken = token;
      localStorage.setItem("jwtToken", token);
      loginStatus.textContent = "Status: Login (Token tersimpan)";
      loginStatus.style.color = "green";
      alert("Token berhasil disimpan!");
    } else {
      alert("Silakan paste token Anda.");
    }
  });

  // Halaman Dashboard
  async function loadDashboard() {
    if (!jwtToken) return;
    try {
      const response = await fetchAPI("/dashboard/top-products");
      if (!response.ok) throw new Error("Gagal memuat data dashboard");

      const { data } = await response.json();
      const tableBody = document.querySelector("#top-products-table tbody");
      tableBody.innerHTML = "";
      data.forEach((item) => {
        tableBody.innerHTML += `
                    <tr>
                        <td>${item.product_name}</td>
                        <td>${item.total_penjualan}</td>
                    </tr>
                `;
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  // Halaman Master Data
  const productForm = document.getElementById("product-form");
  const productsTableBody = document.querySelector("#products-table tbody");
  const searchInput = document.getElementById("search-input");
  const clearFormBtn = document.getElementById("clear-form-btn");

  async function loadMasterProducts() {
    if (!jwtToken) return;
    try {
      const query = searchInput.value ? `?nama=${searchInput.value}` : "";
      const response = await fetchAPI(`/products${query}`);
      if (!response.ok) throw new Error("Gagal memuat produk");

      const { data } = await response.json();
      productsTableBody.innerHTML = "";
      data.forEach((product) => {
        productsTableBody.innerHTML += `
                    <tr>
                        <td>${product.product_code}</td>
                        <td>${product.product_name}</td>
                        <td>${product.price}</td>
                        <td>${product.stock}</td>
                        <td>
                            <button class="edit-btn" data-id="${product.id_product}">Edit</button>
                            <button class="delete-btn" data-id="${product.id_product}">Hapus</button>
                        </td>
                    </tr>
                `;
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  searchInput.addEventListener("keyup", loadMasterProducts);

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("product-id").value;
    const data = {
      product_code: document.getElementById("product-code").value,
      product_name: document.getElementById("product-name").value,
      price: document.getElementById("product-price").value,
      stock: document.getElementById("product-stock").value,
    };

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `/products/${id}` : "/products";

    try {
      const response = await fetchAPI(endpoint, {
        method: method,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Gagal menyimpan produk");

      alert("Produk berhasil disimpan!");
      productForm.reset();
      loadMasterProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

  productsTableBody.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Yakin ingin menghapus produk ini?")) {
        try {
          const response = await fetchAPI(`/products/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Gagal menghapus produk");
          alert("Produk berhasil dihapus");
          loadMasterProducts();
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      }
    } else if (e.target.classList.contains("edit-btn")) {
      const row = e.target.closest("tr");
      document.getElementById("product-id").value = id;
      document.getElementById("product-code").value = row.cells[0].textContent;
      document.getElementById("product-name").value = row.cells[1].textContent;
      document.getElementById("product-price").value = row.cells[2].textContent;
      document.getElementById("product-stock").value = row.cells[3].textContent;
      window.scrollTo(0, 0);
    }
  });

  clearFormBtn.addEventListener("click", () => productForm.reset());

  // Halaman Transaksi Penjualan
  const salesForm = document.getElementById("sales-form");
  const productDropdown = document.getElementById("sales-product");
  const availableStockEl = document.getElementById("sales-available-stock");
  const quantityInput = document.getElementById("sales-quantity");
  const priceInput = document.getElementById("sales-price");
  const subtotalInput = document.getElementById("sales-subtotal");

  async function loadTransactionPage() {
    if (!jwtToken) return;
    try {
      const response = await fetchAPI("/products");
      const { data } = await response.json();

      allProducts = data;
      productDropdown.innerHTML =
        '<option value="">-- Pilih Produk --</option>';
      data.forEach((product) => {
        productDropdown.innerHTML += `<option value="${product.product_code}">${product.product_name} (${product.product_code})</option>`;
      });
    } catch (error) {
      console.error(error);
    }
  }

  function updateSalesForm() {
    const selectedCode = productDropdown.value;
    const product = allProducts.find((p) => p.product_code === selectedCode);

    if (product) {
      priceInput.value = product.price;
      availableStockEl.textContent = product.stock;
      quantityInput.max = product.stock;
      calculateSubtotal();
    } else {
      priceInput.value = "";
      availableStockEl.textContent = "0";
      subtotalInput.value = "";
    }
  }

  function calculateSubtotal() {
    const quantity = parseInt(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    subtotalInput.value = (quantity * price).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    const maxStock = parseInt(quantityInput.max) || 0;
    if (quantity > maxStock) {
      quantityInput.style.borderColor = "red";
      availableStockEl.style.color = "red";
    } else {
      quantityInput.style.borderColor = "#ccc";
      availableStockEl.style.color = "black";
    }
  }

  productDropdown.addEventListener("change", updateSalesForm);
  quantityInput.addEventListener("input", calculateSubtotal);

  salesForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      sales_referance: document.getElementById("sales-ref").value,
      product_code: productDropdown.value,
      quantity: parseInt(quantityInput.value),
    };

    const maxStock = parseInt(quantityInput.max);
    if (data.quantity > maxStock) {
      alert("Stok tidak mencukupi! Jumlah beli melebihi stok tersedia.");
      return;
    }

    try {
      const response = await fetchAPI("/sales", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("Transaksi berhasil disimpan!");
      salesForm.reset();
      availableStockEl.textContent = "0";
      subtotalInput.value = "";
      loadTransactionPage();
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  });

  document.querySelector('button[data-page="dashboard"]').click();
});
