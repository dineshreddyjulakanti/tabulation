// src/components/ProductTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------------ */
/* One canonical axios instance                                             */
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/products`,
});

/* ------------------------------------------------------------------------ */
export default function ProductTable() {
  const navigate = useNavigate();

  // ---------------- state ----------------
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // ------------ auth / role --------------
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const token = auth?.token;
  const isAdmin = auth?.role === "admin";
  const authCfg = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  // ------------- fetch list --------------
  useEffect(() => {
    (async () => {
      try {
        const url = search.trim() ? `/search?name=${search}` : "/";
        const { data } = await api.get(url, authCfg);
        setProducts(data);
        setPage(0);
      } catch (err) {
        console.error("API error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("auth");
          navigate("/");
        }
      }
    })();
  }, [search, token]); // Re-run when search or token changes

  // ------------ helpers ------------------
  const enterEditMode = (p) => {
    setEditRowId(p._id);
    setEditValues({ ...p });
  };

  const handleEditChange = (field, value) =>
    setEditValues((prev) => ({
      ...prev,
      [field]: field === "price" ? parseFloat(value) : value,
    }));

  const handleCheckboxChange = (field, checked) =>
    setEditValues((prev) => ({ ...prev, [field]: checked }));

  const handleSave = async (id) => {
    try {
      // Ensure price is a number and prepare data
      const payload = {
        ...editValues,
        price: parseFloat(editValues.price)
      };
      
      // Remove _id to avoid MongoDB modification issues
      if (payload._id) {
        delete payload._id;
      }
      
      console.log("Sending update with payload:", payload);
      const { data } = await api.put(`/${id}`, payload, authCfg);
      
      setProducts((prev) => prev.map((p) => (p._id === id ? data : p)));
      setEditRowId(null);
    } catch (err) {
      console.error("Update failed:", err);
      console.error("Response:", err.response?.data);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("auth");
        navigate("/");
      } else {
        alert(`Update failed: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`, authCfg);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("auth");
        navigate("/");
      }
    }
  };

  /* ---------------------------------------------------------------------- */
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Product List
      </Typography>

      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search products by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Price
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Category
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  In&nbsp;Stock
                </TableCell>
                {isAdmin && (
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((p) => (
                  <TableRow key={p._id}>
                    {editRowId === p._id ? (
                      <>
                        <TableCell>
                          <TextField
                            value={editValues.name}
                            onChange={(e) =>
                              handleEditChange("name", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={editValues.price}
                            onChange={(e) =>
                              handleEditChange("price", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={editValues.category}
                            onChange={(e) =>
                              handleEditChange("category", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={editValues.inStock}
                            onChange={(e) =>
                              handleCheckboxChange("inStock", e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleSave(p._id)}
                          >
                            Save
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>${p.price.toFixed(2)}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>{p.inStock ? "Yes" : "No"}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button
                              sx={{ mr: 1 }}
                              size="small"
                              variant="outlined"
                              onClick={() => enterEditMode(p)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleDelete(p._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        )}
                      </>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={products.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Container>
  );
}
