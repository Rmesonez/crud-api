import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from "./functions.js";
import Loader from "./Loader.jsx";

const ProductList = () => {
  const url = "https://products-crud.academlo.tech/products/";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [operation, setOperation] = useState("1");
  const [title, setTitle] = useState("");

  const getProducts = () => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        console.log(res?.data);
        setProducts(res?.data);
      })
      .catch((error) => {
        console.log(error);
      });
      setTimeout(() => {
        setLoading(false);
        }, 4000);
  };

  useEffect(() => {
    setLoading(true);
    getProducts();
    setTimeout(() => {
    setLoading(false);
    }, 4000);
  }, []);

  const openModal = (op, id, name, category, price, available) => {
    setId(0);
    setName("");
    setCategory("");
    setPrice("");
    setOperation(op);
    if (op === 1) {
      setTitle("Add Product");
      setIsAvailable(false);
    } else if (op === 2) {
      setTitle("Edit Product");
      setId(id);
      setName(name);
      setCategory(category);
      setPrice(price);
      setIsAvailable(available);
    }
    window.setTimeout(() => {
      document.getElementById("name").focus();
    }, 500);
  };

  const saveProducts = () => {
    if (name === "" || category === "" || price === "") {
      show_alert("Please fill all fields", "warning");
    } else {
      if (operation === 1) {
        setLoading(true);
        axios
          .post("https://products-crud.academlo.tech/products/", {
            name: name.trim(),
            category: category.trim(),
            price: price,
            isAvailable: isAvailable
          })
          .then((res) => {
            console.log(res?.data);
            show_alert("Product saved successfully", "success");
            document.getElementById("closeModal").click();
            getProducts();
          })
          .catch((error) => {
            console.log(error);
            show_alert("Error saving product", "error");
          });
      } else if (operation === 2) {
        updateProduct(id);
      }
      setLoading(false);
    }
  };

  const updateProduct = (id) => {
    setLoading(true);
    axios
      .put(`https://products-crud.academlo.tech/products/${id}/`, {
        name: name.trim(),
        category: category.trim(),
        price: price,
        isAvailable: isAvailable,
      })
      .then((res) => {
        console.log(res?.data);
        show_alert("Product updated successfully", "success");
        document.getElementById("closeModal").click();
        getProducts();
      })
      .catch((error) => {
        console.log(error);
        show_alert("Error updating product", "error");
      });
    setLoading(false);
  };


  const deleteProduct = (id) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure to eliminate " + name + "?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios
          .delete(`https://products-crud.academlo.tech/products/${id}/`)
          .then((res) => {
            console.log(res?.data);
            show_alert("Product deleted successfully", "success");
            getProducts();
          })
          .catch((error) => {
            console.log(error);
            show_alert("error", "Error deleting product", "error");
          });
        setLoading(false);
      }
    });
  };

  return (
    <div className="App">
      {loading && (
        <Loader />
      )}
      <div className="container-fluid">
        <div className="header">
          <h1>Products Chart</h1>
          <button
            onClick={() => openModal(1)}
            className="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target="#modalProducts"
          >
            {" "}
            <i className="fa-solid fa-circle-plus p-2"></i>
            Add Product
          </button>
        </div>
        <div className="grid">
          {
          products.map((product) => (
            <div className="card" key={product?.id}>
              <h2><span># </span>{product?.id}</h2>
              
              <h2>{product?.name}</h2>
              
              <span>Category</span><h2>{product?.category}</h2>
              
              <span>Price</span><h2> ${product?.price}</h2>
               {
                product?.isAvailable ? (
                <div className="available">
                    <h4 style={{color:'green'}}>Available</h4>
                </div>
                ) : (
                <div className="available">
                    <h4 style={{color:'red'}}>Not Available</h4>
                </div>
                )}
 
              <div className="buttons">
                <button
                  onClick={() =>
                    openModal(
                      2,
                      product?.id,
                      product?.name,
                      product?.category,
                      product?.price,
                      product?.isAvailable
                    )
                  }
                  className="btn btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#modalProducts"
                >
                  <i className="fa-solid fa-edit" title="Edit"></i>
                </button>
                <button
                  onClick={() => deleteProduct(product?.id)}
                  className="btn btn-danger"
                >
                  <i className="fa-solid fa-trash text-black" title="Delete"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="modalProducts" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{title}</label>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="CLose"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id" />
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Name"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-comment"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Category"
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-dollar-sign"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Price"
                  id="price"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Available</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  placeholder="Product Availability"
                  id="isAvailable"
                  value={isAvailable}
                  onChange={(e) => {
                    setIsAvailable(e.target.checked);
                  }}
                />
              </div>
              <div className="d-grid col-6 mx-auto">
                <button
                  onClick={() => saveProducts()}
                  className="btn btn-success"
                >
                  <i className="fa-solid fa-floppy-disk p-2"></i>
                  Save
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="closeModal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
