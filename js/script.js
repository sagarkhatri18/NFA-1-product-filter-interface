let products = [];

// render products on the basis of filter applied
const renderProducts = (filteredProducts) => {
  const productList = $("#productList");
  productList.empty();

  $("#resultCountDiv").hide();

  if (filteredProducts.length === 0) {
    $("#noProducts").removeClass("hidden");
  } else {
    $("#noProducts").addClass("hidden");
    $("#resultCount").html(filteredProducts.length);
    $("#resultCountDiv").show();
    filteredProducts.forEach((product) => {
      productList.append(`
                        <div class="bg-white p-4 rounded-md shadow-md border border-2-gray-200">
                            <h3 class="text-lg font-bold">${product.name}</h3>
                            <p class="text-gray-600">Category: ${
                              product.category
                            }</p>
                            <p class="text-gray-600">Price: $${
                              product.price
                            }</p>
                            <p class="${
                              product.inStock
                                ? "text-green-500"
                                : "text-red-500"
                            }">${
        product.inStock ? "In Stock" : "Out of Stock"
      }</p>
                        </div>
                    `);
    });
  }
};

// fetch the categories and display on the dropdown list
const populateCategories = () => {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((category) => {
    $("#categoryFilter").append(
      `<option value="${category}">${category}</option>`
    );
  });
};

// check the applied filter and render products
const applyFilters = () => {
  let filtered = [...products];

  const selectedCategory = $("#categoryFilter").val();
  const minPrice = parseFloat($("#minPrice").val());
  const maxPrice = parseFloat($("#maxPrice").val());
  const inStockOnly = $("#inStockFilter").is(":checked");

  if (selectedCategory) {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  if (!isNaN(minPrice)) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }

  if (!isNaN(maxPrice)) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  if (inStockOnly) {
    filtered = filtered.filter((p) => p.inStock);
  }

  renderProducts(filtered);
};

// reset the filters
const resetFilters = () => {
  $("#categoryFilter").val("");
  $("#minPrice").val("");
  $("#maxPrice").val("");
  $("#inStockFilter").prop("checked", false);
  applyFilters();
};

// fetch all the products from json file and load it first
$(document).ready(function () {
  $.getJSON("js/products.json", function (data) {
    products = data;
    populateCategories();
    renderProducts(products);

    $("#categoryFilter, #minPrice, #maxPrice, #inStockFilter").on(
      "input change",
      applyFilters
    );
    $("#resetFilters").on("click", resetFilters);
  }).fail(function () {
    alert("Failed to load products.json");
  });
});
